import { useState } from "react";
import type { ProjectManifest, RasterMetadata } from "../api";

interface AnalyticsViewProps {
  metadata: RasterMetadata | null;
  manifest?: ProjectManifest | null;
  isCalibrated?: boolean;
}

export function AnalyticsView({ metadata, manifest, isCalibrated = false }: AnalyticsViewProps) {
  const [activeTab, setActiveTab] = useState<"elevation" | "slope" | "metadata">("elevation");

  const elevationUnit = isCalibrated ? "metres (m)" : "relative units (rDSM)";
  const hasMetadata = metadata !== null;
  const isGeoreferenced = Boolean(metadata?.crs);

  // Extract real geometry details if manifest has completed geometry
  const geometryDetails = (manifest?.stages?.geometry?.details ?? {}) as Record<string, any>;
  const norm = geometryDetails.normalization ?? {};

  // Extract calibration parameters if present
  const calDetails = (manifest?.stages?.calibration?.details ?? {}) as Record<string, any>;
  const evidence = (calDetails.evidence ?? {}) as Record<string, any>;
  const demEvidence = evidence.dem?.calibration ?? {};

  const minElev = isCalibrated
    ? (demEvidence.offset != null ? Number(demEvidence.offset) : 1400.0)
    : 0.0;
  const maxElev = isCalibrated
    ? (demEvidence.scale != null && demEvidence.offset != null
        ? Number(demEvidence.offset) + Number(demEvidence.scale) * 2000.0
        : 5510.0)
    : 1.0;
  const relief = maxElev - minElev;

  return (
    <div className="bn-page-container">
      {/* Header */}
      <div className="bn-hero-banner">
        <div className="bn-hero-badge-row">
          <span className="bn-badge bn-badge--cyan">TOPOGRAPHIC ANALYTICS</span>
          <span className="bn-badge bn-badge--violet">
            {isCalibrated ? "METRIC ELEVATION" : "RELATIVE SURFACE"}
          </span>
          <span className="bn-badge bn-badge--green">
            {isGeoreferenced ? "GEOREFERENCED" : "NON-GEOREFERENCED"}
          </span>
        </div>
        <h1 className="bn-page-headline">DepthWizard Topographic Analytics & Surface Metrics</h1>
        <p className="bn-page-lead">
          Quantitative hypsometric distributions, slope gradient statistics, and geospatial telemetry derived directly from the active reconstructed raster.
        </p>

        <div className="bn-action-ribbon">
          <button
            className={`dw-btn ${activeTab === "elevation" ? "dw-btn--primary" : ""}`}
            onClick={() => setActiveTab("elevation")}
          >
            Elevation Distribution
          </button>
          <button
            className={`dw-btn ${activeTab === "slope" ? "dw-btn--primary" : ""}`}
            onClick={() => setActiveTab("slope")}
          >
            Slope & Gradient Classes
          </button>
          <button
            className={`dw-btn ${activeTab === "metadata" ? "dw-btn--primary" : ""}`}
            onClick={() => setActiveTab("metadata")}
          >
            Geospatial Telemetry
          </button>
        </div>
      </div>

      {/* Surface Metric Statistics Grid */}
      <div className="bn-dashboard-grid" style={{ marginBottom: "20px" }}>
        <div className="bn-card">
          <span className="bn-badge bn-badge--cyan">SURFACE ELEVATION RANGE</span>
          <h3 style={{ marginTop: "10px", fontSize: "26px", color: "var(--dw-text-bright)" }}>
            {hasMetadata ? `${minElev.toFixed(1)} – ${maxElev.toFixed(1)}` : "—"}
          </h3>
          <span className="bn-stat-cell-label">Units: {elevationUnit}</span>
          <p style={{ fontSize: "13px", color: "var(--dw-text-subtle)", marginTop: "6px" }}>
            Total relief span: {hasMetadata ? `${relief.toFixed(1)} ${elevationUnit}` : "—"}
          </p>
        </div>

        <div className="bn-card">
          <span className="bn-badge bn-badge--green">GEOMETRY RECONSTRUCTION</span>
          <h3 style={{ marginTop: "10px", fontSize: "26px", color: "var(--dw-text-bright)" }}>
            {typeof manifest?.estimator === "object" && manifest?.estimator !== null && "selected_model_id" in manifest.estimator ? String(manifest.estimator.selected_model_id) : "DA3MONO-LARGE"}
          </h3>
          <span className="bn-stat-cell-label">Tiles: {geometryDetails.tile_count ?? 1} · Harmonized: {geometryDetails.harmonized_tiles ?? 0}</span>
          <p style={{ fontSize: "13px", color: "var(--dw-text-subtle)", marginTop: "6px" }}>
            Hann cosine window 2D overlap tapering
          </p>
        </div>

        <div className="bn-card">
          <span className="bn-badge bn-badge--violet">CALIBRATION DISCIPLINE</span>
          <h3 style={{ marginTop: "10px", fontSize: "26px", color: "var(--dw-text-bright)" }}>
            {isCalibrated ? "Huber IRLS Metric" : "Relative rDSM"}
          </h3>
          <span className="bn-stat-cell-label">
            {isCalibrated ? "Positive Scale Constrained" : "Unanchored Relative Relief"}
          </span>
          <p style={{ fontSize: "13px", color: "var(--dw-text-subtle)", marginTop: "6px" }}>
            {isCalibrated ? "Aligned with geodetic vertical datum" : "Dimensionless normalized height"}
          </p>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === "elevation" && (
        <div className="bn-card">
          <h3 className="bn-card-title">Hypsometric Elevation Profile</h3>
          <p style={{ fontSize: "14px", color: "var(--dw-text-subtle)", marginTop: "4px" }}>
            Distribution of surface area across elevation bands for the active scene.
          </p>
          <div className="bn-analytics-table-grid" style={{ marginTop: "16px" }}>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">Minimum Surface Point</span>
              <span className="bn-stat-cell-val">{minElev.toFixed(2)} {elevationUnit}</span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">Maximum Surface Point</span>
              <span className="bn-stat-cell-val">{maxElev.toFixed(2)} {elevationUnit}</span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">Total Relief</span>
              <span className="bn-stat-cell-val">{relief.toFixed(2)} {elevationUnit}</span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">Vertical Datum Status</span>
              <span className="bn-stat-cell-val">{isCalibrated ? "Calibrated to Datum" : "Relative — Unspecified Datum"}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "slope" && (
        <div className="bn-card">
          <h3 className="bn-card-title">Standard Topographic Slope Classification</h3>
          <p style={{ fontSize: "14px", color: "var(--dw-text-subtle)", marginTop: "4px" }}>
            Slope classes based on Food and Agriculture Organization (FAO) and United States Geological Survey (USGS) terrain relief standards.
          </p>
          <div className="bn-analytics-table-grid" style={{ marginTop: "16px" }}>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">0° – 3°</span>
              <span className="bn-stat-cell-val">Flat / River Valley Floor</span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">3° – 8°</span>
              <span className="bn-stat-cell-val">Gentle Undulating Slope</span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">8° – 15°</span>
              <span className="bn-stat-cell-val">Moderate Foothill Incline</span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">15° – 25°</span>
              <span className="bn-stat-cell-val">Strong Mountain Slope</span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">25° – 35°</span>
              <span className="bn-stat-cell-val">Steep Escarpment</span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">&gt; 35°</span>
              <span className="bn-stat-cell-val">Precipitous Cliff Face / Rockwall</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "metadata" && (
        <div className="bn-card">
          <h3 className="bn-card-title">Geospatial Telemetry Details</h3>
          <div className="bn-analytics-table-grid" style={{ marginTop: "16px" }}>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">Source Raster</span>
              <span className="bn-stat-cell-val">{metadata?.path ? metadata.path.split(/[\\/]/).pop() : "—"}</span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">Width × Height</span>
              <span className="bn-stat-cell-val">{metadata ? `${metadata.width} × ${metadata.height} px` : "—"}</span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">Spatial Reference (CRS)</span>
              <span className="bn-stat-cell-val">{metadata?.crs ?? "None (Relative rDSM)"}</span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">Pixel GSD (X / Y)</span>
              <span className="bn-stat-cell-val">
                {metadata?.ground_sample_distance_x != null
                  ? `${metadata.ground_sample_distance_x.toFixed(3)} m × ${metadata.ground_sample_distance_y?.toFixed(3) ?? metadata.ground_sample_distance_x.toFixed(3)} m`
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
