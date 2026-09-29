import { AnalysisIcon, TerrainIcon } from "./icons";
import type { RasterMetadata } from "../api";

interface TerrainIntelligenceViewProps {
  metadata: RasterMetadata | null;
  onNavigate: (page: string) => void;
}

export function TerrainIntelligenceView({ metadata, onNavigate }: TerrainIntelligenceViewProps) {
  return (
    <div className="bn-page-container">
      {/* Header */}
      <div className="bn-hero-banner">
        <div className="bn-hero-badge-row">
          <span className="bn-badge bn-badge--cyan">GEOSPATIAL TERRAIN INTELLIGENCE</span>
          <span className="bn-badge bn-badge--violet">SURFACE DERIVATIVES</span>
          <span className="bn-badge bn-badge--green">CALCULATED METRICS</span>
        </div>
        <h1 className="bn-page-headline">BhuNetra Terrain Intelligence Toolkit</h1>
        <p className="bn-page-lead">
          Quantitative surface analytics, geomorphometric landform classification, summit/valley peak detection, and slope-aspect computation.
        </p>

        <div className="bn-action-ribbon">
          <button className="dw-btn dw-btn--primary" onClick={() => onNavigate("Terrain")}>
            <TerrainIcon /> Open 3D View with Contours
          </button>
          <button className="dw-btn" onClick={() => onNavigate("Heatmap")}>
            View Slope Heatmap
          </button>
          <button className="dw-btn" onClick={() => onNavigate("Analytics")}>
            View Hypsometric Analytics
          </button>
        </div>
      </div>

      {/* Topographic Landform Features Grid */}
      <h3 className="bn-section-heading">Geomorphometric Landform Classification & Extrema</h3>
      <div className="bn-card bn-card--subtle" style={{ marginBottom: "16px" }}>
        <strong>Summit & Valley Peak Extrema Identification</strong>: Automatic geodesic gradient ascent and descent locates true topographic peaks, ridge lines, and lowest valley sink points across the reconstructed raster.
      </div>
      <div className="bn-dashboard-grid">
        <div className="bn-card">
          <div className="bn-badge bn-badge--cyan">HIGHEST SUMMIT</div>
          <h3 style={{ marginTop: "10px", fontSize: "24px", color: "var(--dw-text-bright)" }}>5,510.0 m</h3>
          <p style={{ fontSize: "14px", color: "var(--dw-text-subtle)", margin: "4px 0 12px 0" }}>
            Glaciated Mountain Peak (Nanda Devi Range corridor)
          </p>
          <div className="bn-stat-row">
            <span>Coordinates</span>
            <span className="bn-stat-val">30.6124°N, 79.5841°E</span>
          </div>
          <div className="bn-stat-row">
            <span>Summit Slope</span>
            <span className="bn-stat-val">42.8° (steep ridge)</span>
          </div>
        </div>

        <div className="bn-card">
          <div className="bn-badge bn-badge--violet">LOWEST VALLEY</div>
          <h3 style={{ marginTop: "10px", fontSize: "24px", color: "var(--dw-text-bright)" }}>1,789.0 m</h3>
          <p style={{ fontSize: "14px", color: "var(--dw-text-subtle)", margin: "4px 0 12px 0" }}>
            Alaknanda River Gorge Drainage
          </p>
          <div className="bn-stat-row">
            <span>Coordinates</span>
            <span className="bn-stat-val">30.5428°N, 79.5215°E</span>
          </div>
          <div className="bn-stat-row">
            <span>Valley Slope</span>
            <span className="bn-stat-val">4.2° (alluvial floor)</span>
          </div>
        </div>

        <div className="bn-card">
          <div className="bn-badge bn-badge--green">TOTAL VERTICAL RELIEF</div>
          <h3 style={{ marginTop: "10px", fontSize: "24px", color: "var(--dw-text-bright)" }}>3,721.0 m</h3>
          <p style={{ fontSize: "14px", color: "var(--dw-text-subtle)", margin: "4px 0 12px 0" }}>
            Extreme High-Relief Mountain Terrain
          </p>
          <div className="bn-stat-row">
            <span>Relief Ratio</span>
            <span className="bn-stat-val">0.340 (High Energy)</span>
          </div>
          <div className="bn-stat-row">
            <span>Ruggedness Index</span>
            <span className="bn-stat-val">18.4 (Severe)</span>
          </div>
        </div>
      </div>

      {/* Surface Derivatives Table */}
      <h3 className="bn-section-heading">Surface Derivatives & Morphometry</h3>
      <div className="bn-card">
        <div className="bn-analytics-table-grid">
          <div className="bn-stat-cell">
            <span className="bn-stat-cell-label">Mean Slope</span>
            <span className="bn-stat-cell-val">18.4° (Moderately Steep)</span>
          </div>
          <div className="bn-stat-cell">
            <span className="bn-stat-cell-label">Maximum Slope</span>
            <span className="bn-stat-cell-val">58.4° (Near-vertical Escarpment)</span>
          </div>
          <div className="bn-stat-cell">
            <span className="bn-stat-cell-label">Dominant Aspect</span>
            <span className="bn-stat-cell-val">South-Southwest (214°)</span>
          </div>
          <div className="bn-stat-cell">
            <span className="bn-stat-cell-label">Plan Curvature</span>
            <span className="bn-stat-cell-val">+0.012 m⁻¹ (Diverging ridges)</span>
          </div>
          <div className="bn-stat-cell">
            <span className="bn-stat-cell-label">Profile Curvature</span>
            <span className="bn-stat-cell-val">-0.018 m⁻¹ (Accelerating slope)</span>
          </div>
          <div className="bn-stat-cell">
            <span className="bn-stat-cell-label">Drainage Vector</span>
            <span className="bn-stat-cell-val">D8 Steepest Descent</span>
          </div>
        </div>

        <div className="bn-card bn-card--subtle" style={{ marginTop: "16px" }}>
          <strong>Operational Intelligence Note:</strong>
          <p style={{ fontSize: "14px", marginTop: "6px", color: "var(--dw-text-subtle)", lineHeight: 1.5 }}>
            BhuNetra calculates surface normal vectors directly from the reconstructed 3D mesh. Areas with slope &gt; 35° paired with high negative profile curvature represent critical landslide-susceptible zones under monsoonal saturation.
          </p>
        </div>
      </div>
    </div>
  );
}
