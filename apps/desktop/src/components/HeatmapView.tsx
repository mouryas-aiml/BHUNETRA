import { useEffect, useState } from "react";
import { getProjectPreviewUrl, type ProjectManifest, type RasterMetadata } from "../api";
import { ScientificLegend } from "./ScientificLegend";

export type HeatmapMode = "elevation" | "slope" | "hillshade" | "contours" | "confidence" | "residual";

interface HeatmapViewProps {
  metadata: RasterMetadata | null;
  manifest?: ProjectManifest | null;
  projectDir?: string | null;
  surfaceProduct?: "dsm" | "rdsm";
  isCalibrated?: boolean;
}

export function HeatmapView({
  metadata,
  manifest,
  projectDir,
  surfaceProduct = "dsm",
  isCalibrated = false,
}: HeatmapViewProps) {
  const [mode, setMode] = useState<HeatmapMode>("elevation");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Map mode to backend preview layer
  const previewLayer = mode === "elevation"
    ? (manifest?.artifacts?.dsm ? "dsm" : "rdsm")
    : mode;

  const isLayerAvailable = Boolean(
    manifest?.artifacts && (
      (mode === "elevation" && (manifest.artifacts.dsm || manifest.artifacts.rdsm)) ||
      (mode === "slope" && manifest.artifacts.slope) ||
      (mode === "hillshade" && (manifest.artifacts.dsm || manifest.artifacts.rdsm)) ||
      (mode === "contours" && (manifest.artifacts.dsm || manifest.artifacts.rdsm)) ||
      (mode === "confidence" && manifest.artifacts.confidence) ||
      (mode === "residual" && manifest.artifacts.residual)
    )
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setImageLoaded(false);
    setImageError(false);

    if (projectDir && isLayerAvailable) {
      void getProjectPreviewUrl(projectDir, previewLayer)
        .then((url) => {
          if (active) setPreviewUrl(url);
        })
        .catch(() => {
          if (active) setPreviewUrl(null);
        });
    } else {
      setPreviewUrl(null);
    }

    return () => {
      active = false;
    };
  }, [mode, projectDir, isLayerAvailable, previewLayer]);

  const layerTitles: Record<HeatmapMode, { title: string; desc: string; units: string }> = {
    elevation: {
      title: isCalibrated ? "Calibrated Elevation DSM (Metres)" : "Relative Surface Model (rDSM)",
      desc: isCalibrated
        ? "Physical elevation model anchored via robust Huber IRLS regression."
        : "Truthful dimensionless height ordering without false geodetic claims.",
      units: isCalibrated ? "m" : "norm",
    },
    slope: {
      title: "Topographic Slope Gradient Map",
      desc: "Local rate of surface elevation change derived across ground-pixel geometry.",
      units: "degrees (°)",
    },
    hillshade: {
      title: "Analytical Topographic Hillshade",
      desc: "Directional solar illumination highlighting structural ridgelines and ravines.",
      units: "intensity [0, 1]",
    },
    contours: {
      title: "Iso-Elevation Contours",
      desc: "Calculated iso-elevation intervals overlaid for topographic survey appraisal.",
      units: "interval steps",
    },
    confidence: {
      title: "Uncertainty Indicator & Reliability Map",
      desc: "Documented uncertainty score derived from model confidence and terrain gradient strength.",
      units: "score [0, 1]",
    },
    residual: {
      title: "Evaluation Residual (Prediction − Reference)",
      desc: "Signed deviation map against independent reference surface. Only available with reference DEM/GCPs.",
      units: "metres (m)",
    },
  };

  const current = layerTitles[mode];

  return (
    <div className="bn-page-container">
      {/* Header */}
      <div className="bn-hero-banner">
        <div className="bn-hero-badge-row">
          <span className="bn-badge bn-badge--cyan">SCIENTIFIC RASTER LAYERS</span>
          <span className="bn-badge bn-badge--violet">{current.units.toUpperCase()}</span>
          <span className={`bn-badge ${isLayerAvailable ? "bn-badge--green" : "bn-badge--yellow"}`}>
            {isLayerAvailable ? "LAYER ACTIVE" : "AWAITING LAYER DATA"}
          </span>
        </div>
        <h1 className="bn-page-headline">DepthWizard Topographic Raster & Scientific Layers</h1>
        <p className="bn-page-lead">
          High-resolution scientific visualization of elevation surfaces, terrain gradients, analytical hillshade illumination, and residual error heatmaps.
        </p>

        {/* Mode Selector Tabs */}
        <div className="bn-action-ribbon">
          {(["elevation", "slope", "hillshade", "contours", "confidence", "residual"] as const).map((m) => (
            <button
              key={m}
              className={`dw-btn ${mode === m ? "dw-btn--primary" : ""}`}
              onClick={() => setMode(m)}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Display Frame */}
      <div className="bn-inspector-view-layout">
        {/* Left: Scientific Raster Viewer */}
        <div className="bn-card bn-inspector-media-card" style={{ minHeight: "440px", display: "flex", flexDirection: "column" }}>
          <div className="bn-chart-header">
            <h3>{current.title}</h3>
            <span className="bn-text--cyan">{current.units}</span>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#030712",
              borderRadius: "8px",
              marginTop: "12px",
              minHeight: "360px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {previewUrl && !imageError ? (
              <>
                <img
                  src={previewUrl}
                  alt={current.title}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "480px",
                    objectFit: "contain",
                    borderRadius: "4px",
                    display: imageLoaded ? "block" : "none",
                  }}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
                {!imageLoaded && (
                  <div style={{ color: "var(--dw-text-subtle)", fontSize: "14px" }}>
                    Loading scientific raster layer…
                  </div>
                )}
              </>
            ) : (
              <div style={{ padding: "32px", textAlign: "center", maxWidth: "480px" }}>
                <span className="bn-badge bn-badge--yellow" style={{ marginBottom: "12px" }}>
                  DATA UNAVAILABLE
                </span>
                <h4 style={{ color: "var(--dw-text-bright)", fontSize: "18px", marginTop: "8px" }}>
                  {mode === "residual"
                    ? "Residual analysis cannot be computed."
                    : `${current.title} is not yet available.`}
                </h4>
                <p style={{ color: "var(--dw-text-subtle)", fontSize: "13px", marginTop: "8px", lineHeight: 1.5 }}>
                  {mode === "residual"
                    ? "Residual calculation requires an aligned independent reference DEM or Ground Control Points. In accordance with SIH26175 scientific protocols, residual errors are never fabricated."
                    : "Execute the reconstruction and calibration pipeline to generate this analytical raster derivative."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Technical Explanation */}
        <div className="bn-card">
          <h3 className="bn-card-title">Scientific Specification</h3>
          <p style={{ fontSize: "14px", color: "var(--dw-text-subtle)", marginTop: "8px", lineHeight: 1.5 }}>
            {current.desc}
          </p>

          <div className="bn-analytics-table-grid" style={{ marginTop: "16px" }}>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">Selected Layer</span>
              <span className="bn-stat-cell-val" style={{ textTransform: "capitalize" }}>{mode}</span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">Data Availability</span>
              <span className={`bn-stat-cell-val ${isLayerAvailable ? "bn-text--success" : "bn-text--warning"}`}>
                {isLayerAvailable ? "Ready" : "Unavailable"}
              </span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">Elevation Status</span>
              <span className="bn-stat-cell-val">{isCalibrated ? "Metric DSM" : "Relative rDSM"}</span>
            </div>
            <div className="bn-stat-cell">
              <span className="bn-stat-cell-label">Units</span>
              <span className="bn-stat-cell-val">{current.units}</span>
            </div>
          </div>

          <div style={{ marginTop: "20px", padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "6px", fontSize: "12px", color: "var(--dw-text-subtle)", lineHeight: 1.5 }}>
            <strong>Geospatial Integrity:</strong> All raster representations maintain pixel-for-pixel alignment with the source imagery. Color ramps adhere to scientific perceptual linearity without visual artifacts.
          </div>
        </div>
      </div>
    </div>
  );
}
