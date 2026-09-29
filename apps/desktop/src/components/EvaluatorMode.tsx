import { useState } from "react";

interface EvaluatorModeProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadDemo: () => void;
  onExploreGamus: () => void;
  onInspect: () => void;
  onRunReconstruct: () => void;
  onBuild3D: () => void;
  onExport: () => void;
}

const STEPS = [
  {
    num: 1,
    title: "Optical Ingest",
    desc: "Single-view satellite or aerial RGB imagery is ingested and evaluated for radiometric quality.",
    badge: "1024×1024 / 0.3m",
  },
  {
    num: 2,
    title: "AI Depth Estimation",
    desc: "DA3MONO-LARGE Vision Transformer infers dense affine relative surface geometry.",
    badge: "ViT-Large + DPT",
  },
  {
    num: 3,
    title: "Scene-Global Mosaicking",
    desc: "Overlapping tiles are harmonized via Pearson-gated affine fusers to prevent seam artifacts.",
    badge: "Hann Cosine Blend",
  },
  {
    num: 4,
    title: "Scale Calibration",
    desc: "Huber/IRLS regression pairs relative heights with coarse DEM or 6+ distributed GCPs.",
    badge: "Positive Scale α > 0",
  },
  {
    num: 5,
    title: "Metric DSM Synthesis",
    desc: "Standard GeoTIFF Digital Surface Model in metres is produced with derived slope maps.",
    badge: "GeoTIFF float32",
  },
  {
    num: 6,
    title: "3D Terrain Reconstruction",
    desc: "Multi-LOD triangulated mesh with UV diffuse orthotexture for real-time WebGL rendering.",
    badge: "GLB / Three.js",
  },
  {
    num: 7,
    title: "Geospatial Analysis",
    desc: "Cursor elevation probing, transect cross-sections, and physical building height extraction.",
    badge: "Physical Annulus",
  },
  {
    num: 8,
    title: "GIS Package Export",
    desc: "Hash-audited archive containing DSMs, slope maps, 3D assets, and JSON provenance.",
    badge: "ZIP / SHA-256",
  },
];

export function EvaluatorMode({
  isOpen,
  onClose,
  onLoadDemo,
  onExploreGamus,
  onRunReconstruct,
  onBuild3D,
  onExport,
}: EvaluatorModeProps) {
  const [activeStep, setActiveStep] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="bn-dataset-modal-backdrop" onClick={onClose}>
      <div className="bn-evaluator-modal" onClick={(e) => e.stopPropagation()}>
        <header className="bn-dataset-header">
          <div className="bn-dataset-title-group">
            <div className="bn-badge bn-badge--violet">SIH26175 Evaluator Mode</div>
            <h2>BhuNetra Scientific Pipeline Stepper</h2>
            <p className="bn-dataset-subtitle">
              Single-View Height Estimation & 3D Flythrough · Interactive Walkthrough for Judges & Mentors
            </p>
          </div>
          <button className="dw-btn" onClick={onClose}>✕ Close</button>
        </header>

        <div className="bn-evaluator-stepper-bar">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className={`bn-stepper-node ${activeStep === s.num ? "bn-stepper-node--active" : activeStep > s.num ? "bn-stepper-node--done" : ""}`}
              onClick={() => setActiveStep(s.num)}
            >
              <div className="bn-node-number">{s.num}</div>
              <div className="bn-node-title">{s.title}</div>
            </div>
          ))}
        </div>

        <div className="bn-evaluator-content-card">
          <div className="bn-eval-main-desc">
            <div className="bn-badge bn-badge--cyan">{STEPS[activeStep - 1].badge}</div>
            <h3>{STEPS[activeStep - 1].title}</h3>
            <p className="bn-eval-desc-text">{STEPS[activeStep - 1].desc}</p>
          </div>

          <div className="bn-eval-actions-row">
            {activeStep === 1 && (
              <>
                <button
                  className="dw-btn dw-btn--primary bn-btn--hero"
                  onClick={() => {
                    onLoadDemo();
                    onClose();
                  }}
                >
                  🚀 Load Verified Demo Project (1-Click)
                </button>
                <button
                  className="dw-btn"
                  onClick={() => {
                    onClose();
                    onExploreGamus();
                  }}
                >
                  🌐 Browse Hugging Face GAMUS Dataset
                </button>
              </>
            )}

            {activeStep === 2 && (
              <button
                className="dw-btn dw-btn--primary"
                onClick={() => {
                  onRunReconstruct();
                  onClose();
                }}
              >
                ⚡ Trigger DA3 Monocular Reconstruction
              </button>
            )}

            {activeStep >= 3 && activeStep <= 5 && (
              <button
                className="dw-btn dw-btn--primary"
                onClick={() => {
                  onLoadDemo();
                  onClose();
                }}
              >
                🔬 Inspect Calibrated DSM Layers
              </button>
            )}

            {activeStep === 6 && (
              <button
                className="dw-btn dw-btn--primary"
                onClick={() => {
                  onBuild3D();
                  onClose();
                }}
              >
                ⛰️ Open 3D Terrain Flythrough
              </button>
            )}

            {activeStep >= 7 && (
              <button
                className="dw-btn dw-btn--primary"
                onClick={() => {
                  onExport();
                  onClose();
                }}
              >
                📦 Export Verified Geospatial Archive
              </button>
            )}

            <div className="bn-step-nav-buttons">
              <button
                className="dw-btn"
                disabled={activeStep <= 1}
                onClick={() => setActiveStep((c) => Math.max(1, c - 1))}
              >
                ← Previous
              </button>
              <button
                className="dw-btn dw-btn--primary"
                disabled={activeStep >= STEPS.length}
                onClick={() => setActiveStep((c) => Math.min(STEPS.length, c + 1))}
              >
                Next Step →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
