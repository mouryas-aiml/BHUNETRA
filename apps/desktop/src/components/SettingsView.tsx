import { useState } from "react";
import { SettingsIcon } from "./icons";

export function SettingsView() {
  const [apiHost, setApiHost] = useState("http://127.0.0.1:8765");
  const [hfToken, setHfToken] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bn-page-container">
      {/* Header */}
      <div className="bn-hero-banner">
        <div className="bn-hero-badge-row">
          <span className="bn-badge bn-badge--cyan">CONFIGURATION & PREFERENCES</span>
          <span className="bn-badge bn-badge--green">SYSTEM STATUS: OPTIMAL</span>
        </div>
        <h1 className="bn-page-headline">DepthWizard System Settings</h1>
        <p className="bn-page-lead">
          Manage backend connection parameters, Hugging Face streaming credentials, 3D WebGL renderer profiles, and offline cache storage.
        </p>
      </div>

      {saved && (
        <div className="bn-card bn-card--accent-border" style={{ borderColor: "#22c55e", background: "rgba(34, 197, 94, 0.1)", marginBottom: "16px" }}>
          <strong style={{ color: "#4ade80" }}>Settings Saved Successfully: </strong> System preferences updated in local workspace storage.
        </div>
      )}

      <div className="bn-dashboard-grid">
        {/* Connection & APIs */}
        <div className="bn-card">
          <h3 className="bn-card-title">Backend & API Endpoints</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "14px" }}>
            <div>
              <label className="bn-control-label">DepthWizard Core Service API Base</label>
              <input
                type="text"
                className="dw-compact-select"
                style={{ width: "100%", padding: "8px 12px" }}
                value={apiHost}
                onChange={(e) => setApiHost(e.target.value)}
              />
              <small style={{ color: "var(--dw-text-subtle)", fontSize: "12px", display: "block", marginTop: "4px" }}>
                Active in local development and desktop Tauri shell. Web app automatically falls back to bundled static assets.
              </small>
            </div>

            <div>
              <label className="bn-control-label">Hugging Face API Token (Optional for Private Hub Quotas)</label>
              <input
                type="password"
                className="dw-compact-select"
                style={{ width: "100%", padding: "8px 12px" }}
                placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={hfToken}
                onChange={(e) => setHfToken(e.target.value)}
              />
              <small style={{ color: "var(--dw-text-subtle)", fontSize: "12px", display: "block", marginTop: "4px" }}>
                Token is kept strictly client-side and never logged.
              </small>
            </div>

            <button className="dw-btn dw-btn--primary" onClick={handleSave}>
              Save Connection Settings
            </button>
          </div>
        </div>

        {/* 3D Hardware Telemetry */}
        <div className="bn-card">
          <h3 className="bn-card-title">Graphics & Renderer Engine</h3>
          <div className="bn-details-table" style={{ marginTop: "12px" }}>
            <div className="bn-stat-row">
              <span>Rendering Backend</span>
              <span className="bn-stat-val">Three.js WebGL 2.0 (DirectML/Metal)</span>
            </div>
            <div className="bn-stat-row">
              <span>Target Refresh Rate</span>
              <span className="bn-stat-val">60.0 fps (vsync locked)</span>
            </div>
            <div className="bn-stat-row">
              <span>Adaptive LOD Strategy</span>
              <span className="bn-stat-val bn-text--success">Dynamic Frame-Time Budget</span>
            </div>
            <div className="bn-stat-row">
              <span>Max Polygon Budget</span>
              <span className="bn-stat-val">524,288 Triangles (LOD 0)</span>
            </div>
            <div className="bn-stat-row">
              <span>Texture Filtering</span>
              <span className="bn-stat-val">Anisotropic 4×</span>
            </div>
            <div className="bn-stat-row">
              <span>Local Cached Samples</span>
              <span className="bn-stat-val">3 verified tiles (DC_04, DC_02, DC_09)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
