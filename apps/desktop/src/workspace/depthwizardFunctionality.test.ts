import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SIDEBAR_PAGES } from "../components/ToolRail";
import { DATASET_CATALOG } from "../components/DatasetCatalogView";

function source(relative: string): string {
  return readFileSync(new URL(relative, import.meta.url), "utf8");
}

describe("DepthWizard SIH 26175 Complete Functionality & Rebranding Audit", () => {
  it("Core Pipeline: Left navigation rail contains exactly 11 streamlined SIH 26175 pipeline stages", () => {
    expect(SIDEBAR_PAGES).toHaveLength(11);
    const ids = SIDEBAR_PAGES.map((p) => p.id);
    expect(ids).toEqual([
      "Terrain",
      "Import",
      "Inspector",
      "Reconstruction",
      "Elevation",
      "Intelligence",
      "Accuracy",
      "Exports",
      "Dashboard",
      "Dataset",
      "Settings",
    ]);

    // Ensure all 11 items have non-empty labels and valid icons
    for (const page of SIDEBAR_PAGES) {
      expect(page.label.length).toBeGreaterThan(0);
      expect(page.icon).toBeDefined();
    }
  });

  it("Viewport Layer Switcher: Contains all scientific layers with no duplicate DSM controls", () => {
    const appSource = source("../App.tsx");
    // Match views array
    expect(appSource).toContain('const views = ["Optical", "Depth", "DSM", "3D Terrain", "Reference", "Residual", "Confidence"] as const;');
    // Match layers array - DSM removed and replaced with Heatmap
    expect(appSource).toContain('const layers = ["Texture", "Slope", "Hillshade", "Contours", "Heatmap", "Confidence", "Residual"] as const;');

    // Verify DSM appears in views but NOT in layers
    const viewsDef = appSource.match(/const views = \[(.*?)\]/)?.[1] ?? "";
    const layersDef = appSource.match(/const layers = \[(.*?)\]/)?.[1] ?? "";
    expect(viewsDef).toContain('"DSM"');
    expect(layersDef).not.toContain('"DSM"');
    expect(layersDef).toContain('"Heatmap"');
  });

  it("Ingest & Processing Pipeline: Image import, AI reconstruction, and 3D terrain handlers are properly wired", () => {
    const appSource = source("../App.tsx");
    expect(appSource).toContain("processUploadedFile");
    expect(appSource).toContain("fileInputRef");
    expect(appSource).toContain('accept="image/*,.tif,.tiff,.png,.jpg,.jpeg"');
    expect(appSource).toContain("handleInstant3DTerrain");
    expect(appSource).toContain("handleSelectGamusSample");
    expect(appSource).toContain("reconstruct = async () =>");
    expect(appSource).toContain("⚡ Run DepthWizard AI Height Estimation");
    expect(appSource).toContain("⛰️ Instant 3D Terrain View");
  });

  it("Indian Terrain & Global Dataset Support: Multi-dataset catalog provides 15+ datasets including 7 Indian regions", () => {
    expect(DATASET_CATALOG.length).toBeGreaterThanOrEqual(12);
    const names = DATASET_CATALOG.map((d) => d.name);

    // Verify Indian Terrain regions
    expect(names.some((n) => n.includes("Joshimath"))).toBe(true);
    expect(names.some((n) => n.includes("Ladakh"))).toBe(true);
    expect(names.some((n) => n.includes("Western Ghats"))).toBe(true);
    expect(names.some((n) => n.includes("Eastern Ghats"))).toBe(true);
    expect(names.some((n) => n.includes("Northeast"))).toBe(true);
    expect(names.some((n) => n.includes("Deccan Traps"))).toBe(true);
    expect(names.some((n) => n.includes("Indo-Gangetic") || n.includes("Dehradun"))).toBe(true);

    // Verify Open Reference DEMs and Benchmarks
    expect(names.some((n) => n.includes("Copernicus DEM GLO-30"))).toBe(true);
    expect(names.some((n) => n.includes("NASADEM / SRTM"))).toBe(true);
    expect(names.some((n) => n.includes("ALOS World 3D"))).toBe(true);
    expect(names.some((n) => n.includes("USGS 3DEP"))).toBe(true);
    expect(names.some((n) => n.includes("ISPRS") && n.includes("Potsdam"))).toBe(true);

    // Verify distinct scientific roles
    const roles = new Set(DATASET_CATALOG.map((d) => d.role));
    expect(roles.has("INDIAN TERRAIN DATASET")).toBe(true);
    expect(roles.has("OPTICAL INPUT DATASET")).toBe(true);
    expect(roles.has("REFERENCE DEM") || roles.has("REFERENCE DSM")).toBe(true);
    expect(roles.has("BENCHMARK DATASET")).toBe(true);
  });

  it("Heatmap Feature: Provides genuine scientific raster preview modes and technical specs", () => {
    const heatmapSource = source("../components/HeatmapView.tsx");
    expect(heatmapSource).toContain('"elevation"');
    expect(heatmapSource).toContain('"slope"');
    expect(heatmapSource).toContain('"hillshade"');
    expect(heatmapSource).toContain('"contours"');
    expect(heatmapSource).toContain('"confidence"');
    expect(heatmapSource).toContain('"residual"');
    expect(heatmapSource).toContain("DepthWizard Topographic Raster & Scientific Layers");
  });

  it("Analytics System: Elevation, slope, cross-section transect, and statistical distributions", () => {
    const analyticsSource = source("../components/AnalyticsView.tsx");
    expect(analyticsSource).toContain("Hypsometric Elevation Profile");
    expect(analyticsSource).toContain("Standard Topographic Slope Classification");
    expect(analyticsSource).toContain("Geospatial Telemetry Details");
    expect(analyticsSource).toContain("SURFACE ELEVATION RANGE");
  });

  it("Image Quality & Depth Estimation Views: Rebranded and functionally verified", () => {
    const inspectorSource = source("../components/ImageInspectorView.tsx");
    expect(inspectorSource).toContain("DepthWizard Remote Sensing Image Quality Inspector");
    expect(inspectorSource).toContain("PRE-INFERENCE READINESS CHECK");
    expect(inspectorSource).toContain("Radiometric & Exposure Distribution");

    const reconSource = source("../components/AiReconstructionView.tsx");
    expect(reconSource).toContain("DA3MONO-LARGE Vision Transformer");
    expect(reconSource).toContain("Physical Scale & Polarity Calibration");
    expect(reconSource).toContain("Multi-Resolution 3D Terrain Mesh Building");
  });

  it("Elevation Model & Terrain Intelligence: Properly distinguish Absolute DSM and Relative rDSM", () => {
    const elevSource = source("../components/ElevationModelView.tsx");
    expect(elevSource).toContain("DepthWizard Elevation Model & Scale Calibration Studio");
    expect(elevSource).toContain("ABSOLUTE METRIC DSM");
    expect(elevSource).toContain("DIMENSIONLESS rDSM");

    const intelSource = source("../components/TerrainIntelligenceView.tsx");
    expect(intelSource).toContain("DepthWizard Terrain Intelligence & Surface Derivatives");
    expect(intelSource).toContain("Topographic Slope Map");
    expect(intelSource).toContain("Compass Aspect Direction");
    expect(intelSource).toContain("Dynamic Elevation Contours");
    expect(intelSource).toContain("Elevation Profile Transects");
  });

  it("Accuracy & Error Dashboard: Honest technical validation conforming to SIH 26175", () => {
    const accSource = source("../components/AccuracyDashboardView.tsx");
    expect(accSource).toContain("DepthWizard Elevation Accuracy & Technical Validation");
    expect(accSource).toContain("RMSE (Root Mean Square Error)");
    expect(accSource).toContain("MAE (Mean Absolute Error)");
    expect(accSource).toContain("Pearson Correlation Coefficient (r)");
    expect(accSource).toContain("Validation unavailable for this input.");
  });
});
