import { useState } from "react";
import { FlythroughIcon, TerrainIcon } from "./icons";

interface FlythroughStudioViewProps {
  onStartFlythrough: (speed: number, altitude: number, fov: number) => void;
  onNavigate: (page: string) => void;
}

export function FlythroughStudioView({ onStartFlythrough, onNavigate }: FlythroughStudioViewProps) {
  const [speed, setSpeed] = useState<number>(1.5);
  const [altitude, setAltitude] = useState<number>(250);
  const [fov, setFov] = useState<number>(65);
  const [preset, setPreset] = useState<string>("ridge");

  const handleLaunch = () => {
    onStartFlythrough(speed, altitude, fov);
    onNavigate("Terrain");
  };

  return (
    <div className="bn-page-container">
      {/* Header */}
      <div className="bn-hero-banner">
        <div className="bn-hero-badge-row">
          <span className="bn-badge bn-badge--cyan">3D FLYTHROUGH STUDIO</span>
          <span className="bn-badge bn-badge--violet">AUTONOMOUS FLIGHT PATHS</span>
          <span className="bn-badge bn-badge--green">GPU ACCELERATED</span>
        </div>
        <h1 className="bn-page-headline">BhuNetra Interactive 3D Flythrough Studio</h1>
        <p className="bn-page-lead">
          Execute cinematic flight trajectories across the reconstructed terrain mesh with terrain-following obstacle avoidance, camera altitude control, and smooth 60fps rendering.
        </p>

        <div className="bn-action-ribbon">
          <button className="dw-btn dw-btn--primary bn-btn--hero" onClick={handleLaunch}>
            <FlythroughIcon /> 🚀 Launch Active 3D Flythrough Tour
          </button>
          <button className="dw-btn" onClick={() => onNavigate("Terrain")}>
            <TerrainIcon /> Open Standard 3D Orbit View
          </button>
          <button className="dw-btn" onClick={() => onNavigate("DigitalTwin")}>
            Open Geospatial Digital Twin
          </button>
        </div>
      </div>

      {/* Flight Control Deck */}
      <div className="bn-dashboard-grid">
        {/* Preset Cards */}
        <div className="bn-card">
          <h3 className="bn-card-title">Flight Path Tour Presets</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
            {[
              { id: "ridge", name: "Himalayan Ridge Traversal", desc: "Follows prominent ridgelines overlooking deep drainage valleys at 250m clearance." },
              { id: "valley", name: "Valley Corridor Descent", desc: "Low-altitude 100m flight tracing the fluvial river canyon floor." },
              { id: "summit", name: "Summit 360° Orbit Tour", desc: "Circular inspection orbit around the highest 5,510m mountain summit." },
            ].map((p) => (
              <div
                key={p.id}
                className={`bn-sample-card ${preset === p.id ? "bn-sample-card--selected" : ""}`}
                style={{ padding: "12px", cursor: "pointer" }}
                onClick={() => {
                  setPreset(p.id);
                  if (p.id === "ridge") { setAltitude(250); setSpeed(1.5); }
                  if (p.id === "valley") { setAltitude(100); setSpeed(1.0); }
                  if (p.id === "summit") { setAltitude(450); setSpeed(2.0); }
                }}
              >
                <h4 style={{ margin: 0, fontSize: "16px", color: "var(--dw-text-bright)" }}>{p.name}</h4>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--dw-text-subtle)" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Flight Parameters Slider Deck */}
        <div className="bn-card">
          <h3 className="bn-card-title">Flight Dynamics & Optics</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "16px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span className="bn-stat-cell-label">Camera Speed</span>
                <span className="bn-text--cyan"><strong>{speed.toFixed(1)}×</strong> ({Math.round(speed * 60)} km/h equiv)</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span className="bn-stat-cell-label">Flight Altitude</span>
                <span className="bn-text--cyan"><strong>{altitude} m</strong> above ground</span>
              </div>
              <input
                type="range"
                min="50"
                max="800"
                step="25"
                value={altitude}
                onChange={(e) => setAltitude(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span className="bn-stat-cell-label">Camera Field of View (FOV)</span>
                <span className="bn-text--cyan"><strong>{fov}°</strong> Wide Angle</span>
              </div>
              <input
                type="range"
                min="45"
                max="90"
                step="5"
                value={fov}
                onChange={(e) => setFov(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <button className="dw-btn dw-btn--primary bn-btn--hero" onClick={handleLaunch} style={{ marginTop: "10px" }}>
              ▶ Start Cinematic Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
