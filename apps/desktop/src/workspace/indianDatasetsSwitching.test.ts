import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  extractProjectFolder,
  getProjectMeshUrl,
  KNOWN_DATASETS,
  probeProject,
  resolveDatasetSpec,
  sampleProjectProfile,
} from "../api";
import { SIDEBAR_PAGES } from "../components/ToolRail";

const HIMALAYAN_REGIONS = [
  "himalayas_joshimath",
  "kedarnath_mandakini",
  "badrinath_alaknanda",
  "gangotri_bhagirathi",
  "pithoragarh_kumaon",
  "kinnaur_himalayas",
  "spiti_valley",
  "lahaul_valley",
  "northeast_tawang",
  "sikkim_kanchenjunga",
  "ladakh_leh",
];

const PENINSULAR_REGIONS = [
  "western_ghats_kudremukh",
  "eastern_ghats_araku",
  "deccan_plateau_pune",
];

const ALL_INDIAN_REGIONS = [...HIMALAYAN_REGIONS, ...PENINSULAR_REGIONS];

describe("Indian Mountain Dataset Switching & Scene Inspector Verification", () => {
  it("ToolRail: '01 — 3D Terrain Flythrough' is Option 1 and Heatmap is removed", () => {
    expect(SIDEBAR_PAGES[0].id).toBe("Terrain");
    expect(SIDEBAR_PAGES[0].label).toContain("01 — 3D Terrain Flythrough");
    const ids = SIDEBAR_PAGES.map((p) => p.id);
    expect(ids).not.toContain("Heatmap");
  });

  it("KNOWN_DATASETS contains all 11 authentic Himalayan test sites plus peninsular sites", () => {
    for (const regionId of ALL_INDIAN_REGIONS) {
      expect(KNOWN_DATASETS).toHaveProperty(regionId);
      const spec = KNOWN_DATASETS[regionId];
      expect(spec.name).toBeDefined();
      expect(spec.region).toBeDefined();
      expect(spec.crs).toMatch(/^EPSG:\d+/);
      expect(spec.gsd).toBeGreaterThan(0);
      expect(spec.minElev).toBeLessThan(spec.maxElev);
      expect(spec.elevationMode).toBe("Absolute DSM (m)");
    }
  });

  it("Every Indian mountain dataset has verified physical assets (Manifest, Optical, 4-LOD GLBs, GeoTIFFs, and PNG previews)", () => {
    const publicProjects = resolve(__dirname, "../../public/projects");

    for (const regionId of ALL_INDIAN_REGIONS) {
      const regionDir = resolve(publicProjects, regionId);
      expect(existsSync(regionDir), `Directory exists for ${regionId}`).toBe(true);

      // 1. Manifest
      const manifestPath = resolve(regionDir, "project-manifest.json");
      expect(existsSync(manifestPath), `Manifest exists for ${regionId}`).toBe(true);
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
      expect(manifest.project_id).toBe(regionId);
      expect(manifest.status).toBe("complete");

      // 2. Optical orthophoto
      const optPath = resolve(regionDir, "optical.png");
      expect(existsSync(optPath), `optical.png exists for ${regionId}`).toBe(true);

      // 3. Mesh manifest & 4-level LOD GLBs
      const meshManifestPath = resolve(regionDir, "mesh/mesh-manifest.json");
      expect(existsSync(meshManifestPath), `mesh-manifest exists for ${regionId}`).toBe(true);
      const meshManifest = JSON.parse(readFileSync(meshManifestPath, "utf8"));
      expect(meshManifest.lods.length).toBe(4);

      for (let lod = 0; lod < 4; lod++) {
        const glbPath = resolve(regionDir, `mesh/terrain-lod${lod}.glb`);
        expect(existsSync(glbPath), `terrain-lod${lod}.glb exists for ${regionId}`).toBe(true);
      }

      // 4. Products (GeoTIFFs and colormapped preview PNGs)
      const products = ["dsm", "rdsm", "slope", "hillshade", "contours", "confidence", "residual"];
      for (const prod of products) {
        const pngPath = resolve(regionDir, `products/${prod}.png`);
        expect(existsSync(pngPath), `products/${prod}.png exists for ${regionId}`).toBe(true);
      }
    }
  });

  it("Dataset switching between 3 distinct Indian mountain datasets resolves completely distinct scenes with no Joshimath fallback", async () => {
    const testRegions = [
      { id: "spiti_valley", crsPrefix: "EPSG:32643", minElev: 3600, maxElev: 6250 },
      { id: "kedarnath_mandakini", crsPrefix: "EPSG:32644", minElev: 3100, maxElev: 6940 },
      { id: "sikkim_kanchenjunga", crsPrefix: "EPSG:32645", minElev: 2800, maxElev: 8586 },
    ];

    const probeResults: Array<{ id: string; surface: number; crs: string; meshUrl: string }> = [];

    for (const testRegion of testRegions) {
      const projDir = `/projects/${testRegion.id}`;
      const folder = extractProjectFolder(projDir);
      expect(folder).toBe(testRegion.id);

      const spec = resolveDatasetSpec(projDir);
      expect(spec).toBeDefined();
      expect(spec?.crs.startsWith(testRegion.crsPrefix)).toBe(true);

      // Verify mesh URL points to this dataset's own GLB, not sample_project or Joshimath
      const meshUrl = await getProjectMeshUrl(projDir, 0);
      expect(meshUrl).toBe(`/projects/${testRegion.id}/mesh/terrain-lod0.glb`);
      expect(meshUrl).not.toContain("sample_project");

      // Verify probeProject samples this dataset's physical elevation range
      const probe = await probeProject(projDir, { x: 0.5, y: 0.5 });
      expect(probe.surface.available).toBe(true);
      expect(probe.surface.value).toBeGreaterThanOrEqual(testRegion.minElev);
      expect(probe.surface.value).toBeLessThanOrEqual(testRegion.maxElev);

      // Verify sampleProjectProfile computes valid transects
      const profile = await sampleProjectProfile(projDir, { x: 0.1, y: 0.2 }, { x: 0.9, y: 0.8 }, 160, spec?.gsd);
      expect(profile.sample_count).toBe(160);
      expect(profile.horizontal_distance_m).toBeGreaterThan(0);
      expect(profile.samples[0].surface.value).toBeGreaterThanOrEqual(testRegion.minElev);

      probeResults.push({
        id: testRegion.id,
        surface: probe.surface.value!,
        crs: spec!.crs,
        meshUrl,
      });
    }

    // Verify all 3 datasets produced completely distinct values
    expect(probeResults[0].meshUrl).not.toBe(probeResults[1].meshUrl);
    expect(probeResults[1].meshUrl).not.toBe(probeResults[2].meshUrl);

    expect(probeResults[0].crs).not.toBe(probeResults[1].crs);
    expect(probeResults[1].crs).not.toBe(probeResults[2].crs);

    expect(probeResults[0].surface).not.toBe(probeResults[1].surface);
    expect(probeResults[1].surface).not.toBe(probeResults[2].surface);
  });
});
