import { AnalysisIcon, TerrainIcon } from "./icons";
import type { ProjectManifest, RasterMetadata } from "../api";

interface TerrainIntelligenceViewProps {
  metadata: RasterMetadata | null;
  manifest?: ProjectManifest | null;
  onNavigate: (page: string) => void;
}

export function TerrainIntelligenceView({ metadata, manifest, onNavigate }: TerrainIntelligenceViewProps) {
  const isGeoreferenced = Boolean(metadata?.crs);
  const isCalibrated = manifest?.stages?.calibration?.status === "completed";
  const units = isCalibrated ? "metres (m)" : "relative units (rDSM)";

  return (
    <div className="bn-page-container">
      {/* Header */}
      <div className="bn-hero-banner">
        <div className="bn-hero-badge-row">
          <span className="bn-badge bn-badge--cyan">06 — TERRAIN ANALYSIS DERIVATIVES</span>
          <span className="bn-badge bn-badge--violet">SURFACE INTELLIGENCE</span>
          <span className="bn-badge bn-badge--green">SIH26175 MILESTONE 3</span>
        </div>
        <h1 className="bn-page-headline">DepthWizard Terrain Intelligence & Surface Derivatives</h1>
        <p className="bn-page-lead">
          Quantitative surface derivatives computed directly from the reconstructed digital surface model: topographic slope, directional aspect, analytical hillshade, iso-contours, and cross-sectional elevation profiles.
        </p>

        <div className="bn-action-ribbon">
          <button className="dw-btn dw-btn--primary" onClick={() => onNavigate("Terrain")}>
            <TerrainIcon /> Open Interactive 3D Terrain
          </button>
          <button className="dw-btn" onClick={() => onNavigate("Elevation")}>
            View Elevation Surface
          </button>
          <button className="dw-btn" onClick={() => onNavigate("Accuracy")}>
            Accuracy & Error Dashboard
          </button>
        </div>
      </div>

      {/* Surface Derivatives Grid */}
      <div className="bn-dashboard-grid">
        <div className="bn-card">
          <span className="bn-badge bn-badge--cyan">DERIVATIVE 01</span>
          <h3 style={{ marginTop: "12px", fontSize: "20px", color: "var(--dw-text-bright)" }}>
            Topographic Slope Map
          </h3>
          <p style={{ fontSize: "13px", color: "var(--dw-text-subtle)", marginTop: "6px", lineHeight: 1.5 }}>
            Calculates the maximum rate of elevation change across local 2x2 ground-pixel Jacobian geometry. Essential for identifying landslide hazards, steep escarpments, and trafficability corridors.
          </p>
          <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--dw-text-bright)" }}>
            Slope Units: <strong>Angular degrees [0°, 90°]</strong>
          </div>
        </div>

        <div className="bn-card">
          <span className="bn-badge bn-badge--violet">DERIVATIVE 02</span>
          <h3 style={{ marginTop: "12px", fontSize: "20px", color: "var(--dw-text-bright)" }}>
            Compass Aspect Direction
          </h3>
          <p style={{ fontSize: "13px", color: "var(--dw-text-subtle)", marginTop: "6px", lineHeight: 1.5 }}>
            Measures the horizontal compass orientation that downhill slopes face. Vital for solar irradiation modeling, snowmelt dynamics in the Himalayas, and vegetation moisture analysis.
          </p>
          <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--dw-text-bright)" }}>
            Aspect Range: <strong>Azimuth [0° to 360° clockwise from North]</strong>
          </div>
        </div>

        <div className="bn-card">
          <span className="bn-badge bn-badge--green">DERIVATIVE 03</span>
          <h3 style={{ marginTop: "12px", fontSize: "20px", color: "var(--dw-text-bright)" }}>
            Dynamic Elevation Contours
          </h3>
          <p style={{ fontSize: "13px", color: "var(--dw-text-subtle)", marginTop: "6px", lineHeight: 1.5 }}>
            Vectorized iso-elevation intervals overlaid directly onto the optical texture or elevation surface. Enables rapid topographic map generation and tactical elevation gradient appraisal.
          </p>
          <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--dw-text-bright)" }}>
            Contour Spacing: <strong>Adaptive based on terrain relief span</strong>
          </div>
        </div>

        <div className="bn-card">
          <span className="bn-badge bn-badge--cyan">DERIVATIVE 04</span>
          <h3 style={{ marginTop: "12px", fontSize: "20px", color: "var(--dw-text-bright)" }}>
            Elevation Profile Transects
          </h3>
          <p style={{ fontSize: "13px", color: "var(--dw-text-subtle)", marginTop: "6px", lineHeight: 1.5 }}>
            Interactive cross-sectional sampling between any two surface points. Plots elevation progression, slope changes, and geodesic ground distance in real time.
          </p>
          <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--dw-text-bright)" }}>
            Measurement: <strong>Active in 2D Raster & 3D Terrain viewports</strong>
          </div>
        </div>
      </div>

      {/* Building Height Extractor Card */}
      <div className="bn-card bn-card--accent-border" style={{ marginTop: "20px" }}>
        <h3 className="bn-card-title">Building / Structure Net Height Extraction</h3>
        <p style={{ fontSize: "14px", color: "var(--dw-text-subtle)", marginTop: "8px", lineHeight: 1.5 }}>
          DepthWizard provides an evidence-based structural height tool. The operator defines a polygon footprint on the optical or DSM layer. The algorithm automatically erodes boundary pixels to avoid roof eaves, fits a robust ground reference plane from surrounding buffer annulus points, and extracts net structure height above the local terrain.
        </p>
        <div style={{ marginTop: "14px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button className="dw-btn dw-btn--primary" onClick={() => onNavigate("Terrain")}>
            <AnalysisIcon /> Launch Transect & Structure Analysis in 3D View
          </button>
        </div>
      </div>
    </div>
  );
}
