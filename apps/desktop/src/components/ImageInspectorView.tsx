import { useState } from "react";
import { AiReconstructionIcon, TerrainIcon } from "./icons";
import type { RasterMetadata } from "../api";

interface ImageInspectorViewProps {
  metadata: RasterMetadata | null;
  onNavigate: (page: string) => void;
  onRunReconstruction?: () => void;
}

export function ImageInspectorView({ metadata, onNavigate, onRunReconstruction }: ImageInspectorViewProps) {
  const [selectedBand, setSelectedBand] = useState<"all" | "red" | "green" | "blue">("all");

  const fileName = metadata?.path ? metadata.path.split(/[\\/]/).pop() ?? metadata.path : "No image selected";
  const hasMetadata = metadata !== null;
  const width = metadata?.width ?? 0;
  const height = metadata?.height ?? 0;
  const isGeoreferenced = Boolean(metadata?.crs);
  const crs = metadata?.crs ?? "Non-georeferenced (Relative Mode)";
  const gsd = metadata?.ground_sample_distance_x != null ? `${metadata.ground_sample_distance_x.toFixed(2)} m` : "—";

  // Real quality assessment from metadata
  const quality = metadata?.quality;
  const qualityStatus = quality?.status ?? "not_assessed";
  const qualityFlags = quality?.flags ?? [];

  // Determine readiness indicator (SIH Requirement 15)
  const isReady = qualityStatus !== "warning" || qualityFlags.length === 0;
  const readinessLabel = isReady
    ? "Ready for processing"
    : "Image quality may reduce elevation reliability";

  // Radiometric metrics
  const saturationPct = quality?.saturation_fraction != null ? (quality.saturation_fraction * 100).toFixed(1) : "0.0";
  const shadowPct = quality?.deep_shadow_candidate_fraction != null ? (quality.deep_shadow_candidate_fraction * 100).toFixed(1) : "0.0";
  const brightPct = quality?.bright_low_chroma_candidate_fraction != null ? (quality.bright_low_chroma_candidate_fraction * 100).toFixed(1) : "0.0";
  const textureScore = quality?.texture_gradient_score != null ? quality.texture_gradient_score.toFixed(4) : "—";
  const validDataPct = metadata?.valid_data_fraction != null ? (metadata.valid_data_fraction * 100).toFixed(1) : "100.0";

  return (
    <div className="bn-page-container">
      {/* Header */}
      <div className="bn-hero-banner">
        <div className="bn-hero-badge-row">
          <span className="bn-badge bn-badge--cyan">02 — IMAGE QUALITY & ANALYSIS</span>
          <span className={`bn-badge ${isReady ? "bn-badge--green" : "bn-badge--yellow"}`}>
            {readinessLabel.toUpperCase()}
          </span>
          <span className="bn-badge bn-badge--violet">
            {isGeoreferenced ? "GEOREFERENCED GEOTIFF" : "RELATIVE RGB IMAGE"}
          </span>
        </div>
        <h1 className="bn-page-headline">DepthWizard Remote Sensing Image Quality Inspector</h1>
        <p className="bn-page-lead">
          Pre-inference radiometric diagnostics, spatial georeferencing inspection, resolution validation, and blur/contrast readiness assessment.
        </p>

        <div className="bn-action-ribbon">
          <button
            className="dw-btn dw-btn--primary"
            onClick={() => {
              if (onRunReconstruction) onRunReconstruction();
              else onNavigate("Reconstruction");
            }}
          >
            <AiReconstructionIcon /> Proceed to Monocular Depth (03)
          </button>
          <button className="dw-btn" onClick={() => onNavigate("Elevation")}>
            View Elevation Model
          </button>
          <button className="dw-btn" onClick={() => onNavigate("Terrain")}>
            <TerrainIcon /> Open 3D Terrain
          </button>
        </div>
      </div>

      {/* SIH Requirement 15: Image Quality Readiness Card */}
      <div className="bn-card bn-card--accent-border" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <span className="bn-card-tag" style={{ color: isReady ? "var(--bn-green-accent)" : "var(--bn-yellow-accent)" }}>
              PRE-INFERENCE READINESS CHECK
            </span>
            <h3 style={{ fontSize: "20px", color: "var(--dw-text-bright)", marginTop: "4px" }}>
              Status: {readinessLabel}
            </h3>
          </div>
          <span
            className={`bn-badge ${isReady ? "bn-badge--green" : "bn-badge--yellow"}`}
            style={{ fontSize: "14px", padding: "6px 14px" }}
          >
            {isReady ? "✓ PASSED QUALITY CRITERIA" : "⚠ QUALITY DIAGNOSTIC WARNING"}
          </span>
        </div>

        {qualityFlags.length > 0 && (
          <div style={{ marginTop: "14px", padding: "10px 14px", background: "rgba(245, 158, 11, 0.1)", borderRadius: "6px", borderLeft: "3px solid #f59e0b" }}>
            <strong style={{ color: "#fbbf24", fontSize: "13px" }}>Identified Quality Flags:</strong>
            <ul style={{ margin: "6px 0 0 16px", padding: 0, fontSize: "12px", color: "var(--dw-text-subtle)" }}>
              {qualityFlags.map((flag) => (
                <li key={flag}>{flag.replace(/_/g, " ")}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bn-inspector-view-layout">
        {/* Left: Metadata & Quality Telemetry */}
        <div className="bn-card bn-inspector-media-card">
          <div className="bn-chart-header">
            <h3>Input Imagery Telemetry</h3>
            <span className="bn-text--cyan">{fileName}</span>
          </div>

          <div className="bn-analytics-table-grid" style={{ marginTop: "14px" }}>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">Raster Dimensions</span>
              <span className="bn-stat-cell-val">{hasMetadata ? `${width} × ${height} px` : "—"}</span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">Spectral Bands</span>
              <span className="bn-stat-cell-val">{metadata?.count ?? 0} Bands ({metadata?.dtype ?? "—"})</span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">Coordinate System (CRS)</span>
              <span className="bn-stat-cell-val" style={{ fontSize: "13px" }}>{crs}</span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">Pixel GSD (Resolution)</span>
              <span className="bn-stat-cell-val">{gsd}</span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">Valid Pixel Coverage</span>
              <span className="bn-stat-cell-val">{validDataPct}%</span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">Texture Gradient Score</span>
              <span className="bn-stat-cell-val">{textureScore}</span>
            </div>
          </div>
        </div>

        {/* Right: Radiometric Quality Breakdown */}
        <div className="bn-card">
          <h3 className="bn-card-title">Radiometric & Exposure Distribution</h3>
          <p style={{ fontSize: "13px", color: "var(--dw-text-subtle)", marginTop: "4px" }}>
            Quantitative inspection of pixel clipping, shadow occlusion, and radiometric contrast.
          </p>

          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                <span>Dynamic Range Saturation (Clipping)</span>
                <strong>{saturationPct}%</strong>
              </div>
              <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, Number(saturationPct))}%`, height: "100%", background: "var(--bn-cyan-accent)" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                <span>Deep Shadow Candidate Fraction</span>
                <strong>{shadowPct}%</strong>
              </div>
              <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, Number(shadowPct))}%`, height: "100%", background: "#6366f1" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                <span>Bright Low-Chroma Candidate Fraction</span>
                <strong>{brightPct}%</strong>
              </div>
              <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, Number(brightPct))}%`, height: "100%", background: "#ec4899" }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: "20px", padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "6px", fontSize: "12px", color: "var(--dw-text-subtle)", lineHeight: 1.5 }}>
            <strong>Geospatial Compliance Note:</strong> Non-georeferenced images proceed automatically to the Relative rDSM pipeline without inventing geodetic coordinates. Georeferenced GeoTIFFs preserve native CRS tags and affine transform matrices for metric calibration.
          </div>
        </div>
      </div>
    </div>
  );
}
