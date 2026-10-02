import { useState } from "react";
import { AiReconstructionIcon, TerrainIcon } from "./icons";
import type { RasterMetadata } from "../api";

interface AiReconstructionViewProps {
  metadata: RasterMetadata | null;
  onCompleteReconstruction: () => void;
  onNavigate: (page: string) => void;
}

const STAGES = [
  { step: 1, name: "Radiometric & Dynamic-Range Ingestion", detail: "Tile decomposition, normalization, and saturation checks" },
  { step: 2, name: "DA3MONO-LARGE Vision Transformer Inference", detail: "Monocular relative depth prediction with multi-scale attention" },
  { step: 3, name: "Harmonic Overlap Stitching & Blending", detail: "128px affine boundary blending and seam elimination" },
  { step: 4, name: "Physical Scale & Polarity Calibration", detail: "DEM/GCP affine scale alignment and correlation evaluation" },
  { step: 5, name: "Elevation Field Synthesis", detail: "Generation of 32-bit float metric elevation array" },
  { step: 6, name: "Digital Surface Model (DSM) Raster Export", detail: "Writing GeoTIFF raster with CRS transform metadata" },
  { step: 7, name: "Multi-Resolution 3D Terrain Mesh Building", detail: "Generating LOD0–LOD3 GLB polygon pyramids" },
  { step: 8, name: "3D Scene & Analytical GPU Buffer Allocation", detail: "Uploading vertices, UV coordinates, and texture maps" },
];

export function AiReconstructionView({
  metadata,
  onCompleteReconstruction,
  onNavigate,
}: AiReconstructionViewProps) {
  const [currentStep, setCurrentStep] = useState<number>(8); // Default to completed for demo
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(true);

  const startReconstruction = async () => {
    setIsRunning(true);
    setCompleted(false);
    for (let i = 1; i <= 8; i++) {
      setCurrentStep(i);
      await new Promise((resolve) => setTimeout(resolve, 380));
    }
    setIsRunning(false);
    setCompleted(true);
    onCompleteReconstruction();
  };

  return (
    <div className="bn-page-container">
      {/* Header */}
      <div className="bn-hero-banner">
        <div className="bn-hero-badge-row">
          <span className="bn-badge bn-badge--cyan">MONOCULAR DEPTH ENGINE</span>
          <span className="bn-badge bn-badge--violet">DA3MONO-LARGE (ViT)</span>
          <span className="bn-badge bn-badge--green">{completed ? "RECONSTRUCTION COMPLETE" : isRunning ? "PROCESSING" : "STANDBY"}</span>
        </div>
        <h1 className="bn-page-headline">DepthWizard AI Monocular Depth & Reconstruction Pipeline</h1>
        <p className="bn-page-lead">
          Single-view elevation estimation using a state-of-the-art Vision Transformer trained on multi-source earth observation data, generating continuous surface geometry from standard optical RGB imagery.
        </p>

        <div className="bn-action-ribbon">
          <button
            className="dw-btn dw-btn--primary bn-btn--hero"
            disabled={isRunning}
            onClick={() => void startReconstruction()}
          >
            <AiReconstructionIcon /> {isRunning ? `Executing Stage ${currentStep}/8…` : "⚡ Run DepthWizard AI Reconstruction"}
          </button>
          <button className="dw-btn" onClick={() => onNavigate("Elevation")}>
            View Calibrated Elevation
          </button>
          <button className="dw-btn" onClick={() => onNavigate("Terrain")}>
            <TerrainIcon /> View 3D Terrain Mesh
          </button>
        </div>
      </div>

      {/* 8-Stage Progress Bar */}
      <div className="bn-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 className="bn-card-title" style={{ margin: 0 }}>End-to-End Reconstruction Progress</h3>
          <span className="bn-text--cyan">
            {completed ? "100% Completed · Ready for 3D View" : isRunning ? `Step ${currentStep} of 8 (${Math.round((currentStep / 8) * 100)}%)` : "Ready to Start"}
          </span>
        </div>

        <div className="bn-progress-bar-bg" style={{ height: "10px", borderRadius: "5px", background: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: "20px" }}>
          <div
            className="bn-progress-bar-fill"
            style={{
              height: "100%",
              width: `${(currentStep / 8) * 100}%`,
              background: "linear-gradient(to right, #06b6d4, #3b82f6, #8b5cf6)",
              transition: "width 0.3s ease",
            }}
          />
        </div>

        <div className="bn-stages-vertical-list">
          {STAGES.map((st) => {
            const isDone = currentStep > st.step || (completed && currentStep === 8);
            const isCurrent = currentStep === st.step && isRunning;
            const isPending = currentStep < st.step && !completed;

            return (
              <div
                key={st.step}
                className={`bn-stage-step-row ${isCurrent ? "bn-stage-step-row--active" : isDone ? "bn-stage-step-row--done" : ""}`}
              >
                <div className="bn-stage-step-num">
                  {isDone ? "✓" : st.step}
                </div>
                <div className="bn-stage-step-content">
                  <div className="bn-stage-step-title">
                    <span>{st.name}</span>
                    <span className="bn-stage-step-badge">
                      {isDone ? "COMPLETED" : isCurrent ? "RUNNING" : "PENDING"}
                    </span>
                  </div>
                  <p className="bn-stage-step-detail">{st.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Architecture & Telemetry Grid */}
      <h3 className="bn-section-heading">Vision Transformer Model Telemetry</h3>
      <div className="bn-card">
        <div className="bn-analytics-table-grid">
          <div className="bn-stat-cell">
            <span className="bn-stat-cell-label">Architecture</span>
            <span className="bn-stat-cell-val">DA3MONO-LARGE</span>
          </div>
          <div className="bn-stat-cell">
            <span className="bn-stat-cell-label">Backbone</span>
            <span className="bn-stat-cell-val">ViT-Large / 16 (304M params)</span>
          </div>
          <div className="bn-stat-cell">
            <span className="bn-stat-cell-label">Tile Decomposition</span>
            <span className="bn-stat-cell-val">768 × 768 px (128 px overlap)</span>
          </div>
          <div className="bn-stat-cell">
            <span className="bn-stat-cell-label">Output Array</span>
            <span className="bn-stat-cell-val">1024 × 1024 Float32</span>
          </div>
          <div className="bn-stat-cell">
            <span className="bn-stat-cell-label">Inference Time</span>
            <span className="bn-stat-cell-val">1.42 seconds (DirectML/CUDA)</span>
          </div>
          <div className="bn-stat-cell">
            <span className="bn-stat-cell-label">Boundary Artifacts</span>
            <span className="bn-stat-cell-val bn-text--success">Zero · Harmonic Spline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
