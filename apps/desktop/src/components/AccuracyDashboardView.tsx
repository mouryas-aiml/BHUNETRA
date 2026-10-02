import { AccuracyIcon, ValidateIcon } from "./icons";
import type { ProjectManifest, RasterMetadata, ReferenceValidationReport } from "../api";

interface AccuracyDashboardViewProps {
  metadata?: RasterMetadata | null;
  manifest?: ProjectManifest | null;
  validation: ReferenceValidationReport | null;
  onNavigate: (page: string) => void;
  onUploadReference: () => void;
}

export function AccuracyDashboardView({
  metadata,
  manifest,
  validation,
  onNavigate,
  onUploadReference,
}: AccuracyDashboardViewProps) {
  const isGeoreferenced = Boolean(metadata?.crs);
  const isCalibrated = manifest?.stages?.calibration?.status === "completed";
  const surfaceType = isCalibrated ? "Absolute Metric DSM" : "Relative rDSM";
  const elevationUnits = isCalibrated ? "metres (m)" : "dimensionless (relative)";

  const hasValidation = validation !== null && validation.elevation != null;

  const rmse = validation?.elevation?.rmse_m;
  const mae = validation?.elevation?.mae_m;
  const pearsonR = validation?.elevation?.pearson_r;
  const bias = validation?.elevation?.mean_bias_m;
  const p95 = validation?.elevation?.p95_abs_error_m;
  const validPixels = validation?.valid_pixels;
  const slopeRmse = validation?.slope?.rmse_degrees;
  const coveragePct = validation ? (validation.coverage_fraction * 100).toFixed(1) : null;

  return (
    <div className="bn-page-container">
      {/* Header */}
      <div className="bn-hero-banner">
        <div className="bn-hero-badge-row">
          <span className="bn-badge bn-badge--cyan">SIH26175 QUALITY & VALIDATION</span>
          <span className="bn-badge bn-badge--violet">{surfaceType.toUpperCase()}</span>
          {hasValidation && rmse != null ? (
            <span className="bn-badge bn-badge--green">RMSE: {rmse.toFixed(3)} M</span>
          ) : (
            <span className="bn-badge bn-badge--yellow">UNVALIDATED INPUT</span>
          )}
        </div>
        <h1 className="bn-page-headline">DepthWizard Elevation Accuracy & Technical Validation</h1>
        <p className="bn-page-lead">
          Technical validation comparing predicted digital surface models against independent reference DEMs and ground truth LiDAR. All metrics strictly reflect verified evidence without fabricated values.
        </p>

        <div className="bn-action-ribbon">
          <button className="dw-btn dw-btn--primary" onClick={onUploadReference}>
            <ValidateIcon /> Upload & Validate Reference GeoTIFF
          </button>
          <button className="dw-btn" onClick={() => onNavigate("Elevation")}>
            View DSM Surface
          </button>
          <button className="dw-btn" onClick={() => onNavigate("Terrain")}>
            View 3D Terrain
          </button>
        </div>
      </div>

      {/* Model Output & Reference Architecture Cards */}
      <div className="bn-dashboard-grid" style={{ marginBottom: "20px" }}>
        <div className="bn-card">
          <span className="bn-badge bn-badge--cyan">MODEL OUTPUT SPECIFICATION</span>
          <h3 style={{ marginTop: "12px", fontSize: "20px", color: "var(--dw-text-bright)" }}>
            {surfaceType}
          </h3>
          <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--dw-text-subtle)" }}>
            <div>Foundation Model: <strong style={{ color: "var(--dw-text-bright)" }}>{typeof manifest?.estimator === "object" && manifest?.estimator !== null && "selected_model_id" in manifest.estimator ? String(manifest.estimator.selected_model_id) : "DA3MONO-LARGE"}</strong></div>
            <div>Elevation Units: <strong style={{ color: "var(--dw-text-bright)" }}>{elevationUnits}</strong></div>
            <div>Geospatial Status: <strong style={{ color: "var(--dw-text-bright)" }}>{isGeoreferenced ? `Georeferenced (${metadata?.crs ?? "Projected"})` : "Non-Georeferenced (rDSM)"}</strong></div>
            <div>Resolution: <strong style={{ color: "var(--dw-text-bright)" }}>{metadata ? `${metadata.width} × ${metadata.height} px` : "—"}</strong></div>
          </div>
        </div>

        <div className="bn-card">
          <span className="bn-badge bn-badge--violet">REFERENCE EVIDENCE SOURCE</span>
          <h3 style={{ marginTop: "12px", fontSize: "20px", color: "var(--dw-text-bright)" }}>
            {validation ? validation.reference_label || "Independent Reference DSM" : isCalibrated ? "Calibration DEM / GCPs" : "No Reference Attached"}
          </h3>
          <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--dw-text-subtle)" }}>
            <div>Reference Status: <strong style={{ color: "var(--dw-text-bright)" }}>{validation ? "Held-out Reference Evaluated" : isCalibrated ? "Calibration Evidence Active" : "Reference Unavailable"}</strong></div>
            <div>Evaluation Coverage: <strong style={{ color: "var(--dw-text-bright)" }}>{coveragePct ? `${coveragePct}% of valid surface` : "—"}</strong></div>
            <div>Independence Verification: <strong style={{ color: "var(--dw-text-bright)" }}>{validation?.independence_check ?? "Awaiting independent reference"}</strong></div>
            <div>Reference Hash: <strong style={{ color: "var(--dw-text-bright)", fontFamily: "monospace", fontSize: "11px" }}>{validation?.reference_sha256 ? `${validation.reference_sha256.slice(0, 16)}…` : "—"}</strong></div>
          </div>
        </div>
      </div>

      {/* Validation Results or Honest Unavailable State */}
      {hasValidation ? (
        <>
          <div className="bn-dashboard-grid">
            <div className="bn-card">
              <span className="bn-badge bn-badge--cyan">PRIMARY ACCURACY</span>
              <h3 style={{ marginTop: "10px", fontSize: "28px", color: "var(--dw-text-bright)" }}>
                {rmse != null ? `${rmse.toFixed(3)} m` : "—"}
              </h3>
              <span className="bn-stat-cell-label">RMSE (Root Mean Square Error)</span>
              <p style={{ fontSize: "13px", color: "var(--dw-text-subtle)", marginTop: "6px" }}>
                Quadratic vertical deviation across all {validPixels?.toLocaleString() ?? 0} evaluated pixels.
              </p>
            </div>

            <div className="bn-card">
              <span className="bn-badge bn-badge--green">CORRELATION</span>
              <h3 style={{ marginTop: "10px", fontSize: "28px", color: "var(--dw-text-bright)" }}>
                {pearsonR != null ? pearsonR.toFixed(3) : "—"}
              </h3>
              <span className="bn-stat-cell-label">Pearson Correlation Coefficient (r)</span>
              <p style={{ fontSize: "13px", color: "var(--dw-text-subtle)", marginTop: "6px" }}>
                Linear topographic agreement between single-view prediction and reference terrain.
              </p>
            </div>

            <div className="bn-card">
              <span className="bn-badge bn-badge--violet">ABSOLUTE DEVIATION</span>
              <h3 style={{ marginTop: "10px", fontSize: "28px", color: "var(--dw-text-bright)" }}>
                {mae != null ? `${mae.toFixed(3)} m` : "—"}
              </h3>
              <span className="bn-stat-cell-label">MAE (Mean Absolute Error)</span>
              <p style={{ fontSize: "13px", color: "var(--dw-text-subtle)", marginTop: "6px" }}>
                Average absolute distance between predicted surface and ground reference.
              </p>
            </div>

            <div className="bn-card">
              <span className="bn-badge bn-badge--cyan">VERTICAL DATUM BIAS</span>
              <h3 style={{ marginTop: "10px", fontSize: "28px", color: "var(--dw-text-bright)" }}>
                {bias != null ? `${bias.toFixed(3)} m` : "—"}
              </h3>
              <span className="bn-stat-cell-label">Mean Signed Bias (Prediction − Reference)</span>
              <p style={{ fontSize: "13px", color: "var(--dw-text-subtle)", marginTop: "6px" }}>
                Net vertical translation confirming global geodetic datum alignment.
              </p>
            </div>

            {p95 != null && (
              <div className="bn-card">
                <span className="bn-badge bn-badge--yellow">ERROR BOUND</span>
                <h3 style={{ marginTop: "10px", fontSize: "28px", color: "var(--dw-text-bright)" }}>
                  {p95.toFixed(3)} m
                </h3>
                <span className="bn-stat-cell-label">95th Percentile Absolute Error</span>
                <p style={{ fontSize: "13px", color: "var(--dw-text-subtle)", marginTop: "6px" }}>
                  95% of all surface points deviate by less than this threshold.
                </p>
              </div>
            )}

            {slopeRmse != null && (
              <div className="bn-card">
                <span className="bn-badge bn-badge--green">DERIVATIVE ACCURACY</span>
                <h3 style={{ marginTop: "10px", fontSize: "28px", color: "var(--dw-text-bright)" }}>
                  {slopeRmse.toFixed(2)}°
                </h3>
                <span className="bn-stat-cell-label">Slope RMSE (Degrees)</span>
                <p style={{ fontSize: "13px", color: "var(--dw-text-subtle)", marginTop: "6px" }}>
                  Accuracy of terrain slope gradients derived from the elevation surface.
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bn-card bn-card--accent-border" style={{ padding: "32px", textAlign: "center" }}>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <span className="bn-badge bn-badge--yellow" style={{ fontSize: "13px", padding: "6px 14px" }}>
              VALIDATION DATA UNAVAILABLE
            </span>
            <h3 style={{ fontSize: "22px", color: "var(--dw-text-bright)", marginTop: "16px", marginBottom: "12px" }}>
              Validation unavailable for this input.
            </h3>
            <p style={{ fontSize: "14px", color: "var(--dw-text-subtle)", lineHeight: 1.6, marginBottom: "20px" }}>
              No independent ground-truth LiDAR or reference elevation model has been evaluated against this project.
              In strict accordance with SIH26175 scientific integrity principles, accuracy metrics (RMSE, MAE, Pearson r, and residual statistics) are calculated exclusively when verified reference surfaces are uploaded, and are never fabricated.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <button className="dw-btn dw-btn--primary" onClick={onUploadReference}>
                <ValidateIcon /> Upload Independent Reference GeoTIFF
              </button>
              <button className="dw-btn" onClick={() => onNavigate("Elevation")}>
                Return to Elevation Model
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
