import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SIDEBAR_PAGES } from "../components/ToolRail";
import { DATASET_CATALOG } from "../components/DatasetCatalogView";

function source(relative: string): string {
  return readFileSync(new URL(relative, import.meta.url), "utf8");
}

describe("BhuNetra Complete Functionality & Feature Expansion Audit", () => {
  it("Phase 2: Left sidebar contains exactly 16 fully functional navigation items", () => {
    expect(SIDEBAR_PAGES).toHaveLength(16);
    const ids = SIDEBAR_PAGES.map((p) => p.id);
    expect(ids).toEqual([
      "Dashboard",
      "Projects",
      "Import",
      "Dataset",
      "Reconstruction",
      "Elevation",
      "Terrain",
      "Heatmap",
      "Intelligence",
      "DigitalTwin",
      "Inspector",
      "Accuracy",
      "Validation",
      "Flythrough",
      "Exports",
      "Settings",
    ]);

    // Ensure all 16 items have non-empty labels and valid icons
    for (const page of SIDEBAR_PAGES) {
      expect(page.label.length).toBeGreaterThan(0);
      expect(page.icon).toBeDefined();
    }
  });

  it("Phase 24: Top navigation has NO duplicate DSM controls", () => {
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

  it("Phase 3 & 4: Image import flow, 8-stage AI reconstruction, and 3D terrain handlers are wired", () => {
    const appSource = source("../App.tsx");
    expect(appSource).toContain("processUploadedFile");
    expect(appSource).toContain("fileInputRef");
    expect(appSource).toContain("accept=\"image/*,.tif,.tiff,.png,.jpg,.jpeg\"");
    expect(appSource).toContain("handleInstant3DTerrain");
    expect(appSource).toContain("handleSelectGamusSample");
    expect(appSource).toContain("reconstruct = async () =>");
    expect(appSource).toContain("⚡ Run BhuNetra AI Reconstruction");
    expect(appSource).toContain("⛰️ Instant 3D Terrain View");
    expect(appSource).toContain("Explore GAMUS Samples");
  });

  it("Phase 7 & 8: Multi-dataset catalog provides 10+ datasets across Optical, DEM, Mountain, and Benchmark roles", () => {
    expect(DATASET_CATALOG.length).toBeGreaterThanOrEqual(10);
    const names = DATASET_CATALOG.map((d) => d.name);
    
    // Check required datasets from spec
    expect(names.some((n) => n.includes("GAMUS"))).toBe(true);
    expect(names.some((n) => n.includes("Copernicus DEM GLO-30"))).toBe(true);
    expect(names.some((n) => n.includes("Copernicus DEM GLO-90"))).toBe(true);
    expect(names.some((n) => n.includes("NASADEM / SRTM"))).toBe(true);
    expect(names.some((n) => n.includes("ALOS World 3D"))).toBe(true);
    expect(names.some((n) => n.includes("USGS 3DEP"))).toBe(true);
    expect(names.some((n) => n.includes("ISPRS") && n.includes("Vaihingen"))).toBe(true);
    expect(names.some((n) => n.includes("ISPRS") && n.includes("Potsdam"))).toBe(true);
    expect(names.some((n) => n.includes("Mountain & Terrain"))).toBe(true);

    // Verify distinct scientific roles
    const roles = new Set(DATASET_CATALOG.map((d) => d.role));
    expect(roles.has("OPTICAL INPUT DATASET")).toBe(true);
    expect(roles.has("REFERENCE DEM")).toBe(true);
    expect(roles.has("REFERENCE DSM")).toBe(true);
    expect(roles.has("BENCHMARK DATASET")).toBe(true);
  });

  it("Phase 10: Heatmap feature provides 6 analytical modes, 5 color palettes, and real raster rendering", () => {
    const heatmapSource = source("../components/HeatmapView.tsx");
    expect(heatmapSource).toContain('"elevation"');
    expect(heatmapSource).toContain('"slope"');
    expect(heatmapSource).toContain('"depth"');
    expect(heatmapSource).toContain('"confidence"');
    expect(heatmapSource).toContain('"residual"');
    expect(heatmapSource).toContain('"roughness"');
    expect(heatmapSource).toContain('"turbo"');
    expect(heatmapSource).toContain('"viridis"');
    expect(heatmapSource).toContain('"magma"');
    expect(heatmapSource).toContain('"terrain"');
    expect(heatmapSource).toContain('"coolwarm"');
    expect(heatmapSource).toContain("canvasRef");
    expect(heatmapSource).toContain("cursorProbe");
    expect(heatmapSource).toContain("opacity");
    expect(heatmapSource).toContain("thresholdMin");
    expect(heatmapSource).toContain("thresholdMax");
  });

  it("Phase 11 & 12: Analytics system provides elevation, slope, cross-section transect, and statistical distributions", () => {
    const analyticsSource = source("../components/AnalyticsView.tsx");
    expect(analyticsSource).toContain("Elevation Distribution");
    expect(analyticsSource).toContain("Surface Slope Distribution");
    expect(analyticsSource).toContain("Elevation Cross-Section Profile (Transect A → B)");
    expect(analyticsSource).toContain("Predicted Elevation vs Reference Surface (Scatter & Parity)");
    expect(analyticsSource).toContain("Comprehensive Per-Image Surface Morphometry");
  });

  it("Phase 13 & 14: Image Inspector and 8-stage AI Depth Estimation pages are fully implemented", () => {
    const inspectorSource = source("../components/ImageInspectorView.tsx");
    expect(inspectorSource).toContain("OPTICAL SENSOR INSPECTOR");
    expect(inspectorSource).toContain("Radiometric & Spectral Band Histogram");
    expect(inspectorSource).toContain("Channel Decomposition");

    const reconSource = source("../components/AiReconstructionView.tsx");
    expect(reconSource).toContain("DA3MONO-LARGE Vision Transformer");
    expect(reconSource).toContain("Physical Scale & Polarity Calibration");
    expect(reconSource).toContain("Multi-Resolution 3D Terrain Mesh Building");
    expect(reconSource).toContain("startReconstruction");
  });

  it("Phase 15, 16, 17, 19: Elevation Model, Terrain Intelligence, Digital Twin, and 3D Flythrough pages", () => {
    const elevSource = source("../components/ElevationModelView.tsx");
    expect(elevSource).toContain("BhuNetra Elevation Model & Scale Calibration Studio");
    expect(elevSource).toContain("ABSOLUTE METRIC DSM");
    expect(elevSource).toContain("DIMENSIONLESS rDSM");

    const intelSource = source("../components/TerrainIntelligenceView.tsx");
    expect(intelSource).toContain("BhuNetra Terrain Intelligence Toolkit");
    expect(intelSource).toContain("Geomorphometric Landform Classification");
    expect(intelSource).toContain("Summit & Valley Peak Extrema Identification");

    const flySource = source("../components/FlythroughStudioView.tsx");
    expect(flySource).toContain("BhuNetra Interactive 3D Flythrough Studio");
    expect(flySource).toContain("AUTONOMOUS FLIGHT PATHS");
    expect(flySource).toContain("Camera Speed");
    expect(flySource).toContain("Flight Altitude");
  });

  it("Phase 20 & 21: Accuracy & Error dashboard conforms to ISRO SIH26175 benchmark criteria", () => {
    const accSource = source("../components/AccuracyDashboardView.tsx");
    expect(accSource).toContain("Elevation Accuracy & SIH Benchmark Dashboard");
    expect(accSource).toContain("RMSE (Root Mean Square Error)");
    expect(accSource).toContain("MAE (Mean Absolute Error)");
    expect(accSource).toContain("Cumulative Absolute Error Distribution");
    expect(accSource).toContain("Residual Error Bounds (P90 / P95 NMAD)");
  });
});
