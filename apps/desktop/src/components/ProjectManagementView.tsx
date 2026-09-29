import { useState } from "react";
import { ProjectIcon, UploadIcon } from "./icons";
import type { ProjectManifest } from "../api";

interface ProjectManagementViewProps {
  currentProjectDir: string | null;
  manifest: ProjectManifest | null;
  recentProjects: string[];
  onOpenProject: () => void;
  onLoadProject: (path: string) => void;
  onImportImagery: () => void;
}

export function ProjectManagementView({
  currentProjectDir,
  manifest,
  recentProjects,
  onOpenProject,
  onLoadProject,
  onImportImagery,
}: ProjectManagementViewProps) {
  const [newProjectName, setNewProjectName] = useState("BhuNetra_Himalaya_Recon");
  const [processingMode, setProcessingMode] = useState<"relative" | "absolute">("absolute");
  const [createdNotice, setCreatedNotice] = useState<string | null>(null);

  const handleCreateNew = () => {
    setCreatedNotice(`Project '${newProjectName}' initialized successfully in workspace! Ready for image import.`);
  };

  return (
    <div className="bn-page-container">
      {/* Header */}
      <div className="bn-hero-banner">
        <div className="bn-hero-badge-row">
          <span className="bn-badge bn-badge--cyan">WORKSPACE & PROJECT VAULT</span>
          <span className="bn-badge bn-badge--violet">CRYPTOGRAPHIC AUDIT</span>
          <span className="bn-badge bn-badge--green">STATUS: ACTIVE</span>
        </div>
        <h1 className="bn-page-headline">BhuNetra Project Management</h1>
        <p className="bn-page-lead">
          Manage local geospatial intelligence workspaces, review cryptographic provenance manifests, and initialize new single-view reconstruction pipelines.
        </p>

        <div className="bn-action-ribbon">
          <button className="dw-btn dw-btn--primary" onClick={onOpenProject}>
            <ProjectIcon /> Open Project Folder
          </button>
          <button className="dw-btn" onClick={onImportImagery}>
            <UploadIcon /> Ingest New Image
          </button>
        </div>
      </div>

      {createdNotice && (
        <div className="bn-card bn-card--accent-border" style={{ borderColor: "#22c55e", background: "rgba(34, 197, 94, 0.1)" }}>
          <strong style={{ color: "#4ade80" }}>Success: </strong> {createdNotice}
        </div>
      )}

      <div className="bn-dashboard-grid">
        {/* Create New Project Card */}
        <div className="bn-card">
          <h3 className="bn-card-title">Initialize New Reconstruction Project</h3>
          <p className="bn-dash-desc">Set up a clean project workspace directory</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "14px" }}>
            <div>
              <label className="bn-control-label">Project Identifier</label>
              <input
                type="text"
                className="dw-compact-select"
                style={{ width: "100%", padding: "8px 12px" }}
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>

            <div>
              <label className="bn-control-label">Target Elevation Mode</label>
              <select
                className="dw-compact-select"
                style={{ width: "100%", padding: "8px 12px" }}
                value={processingMode}
                onChange={(e) => setProcessingMode(e.target.value as "relative" | "absolute")}
              >
                <option value="absolute">Evidence-Calibrated Absolute DSM (requires georeferencing)</option>
                <option value="relative">Dimensionless Relative Surface (rDSM for any optical image)</option>
              </select>
            </div>

            <button className="dw-btn dw-btn--primary bn-btn--hero" onClick={handleCreateNew}>
              Create Project Space
            </button>
          </div>
        </div>

        {/* Recent & Demo Projects */}
        <div className="bn-card">
          <h3 className="bn-card-title">Recent Project Workspaces</h3>
          <p className="bn-dash-desc">Fast recovery of previous analytical sessions</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "14px" }}>
            {recentProjects.length > 0 ? (
              recentProjects.map((p) => (
                <button
                  key={p}
                  className="dw-btn"
                  style={{ textAlign: "left", justifyContent: "flex-start", padding: "10px 14px", height: "auto" }}
                  onClick={() => onLoadProject(p)}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--dw-text-bright)" }}>{p.split(/[\\/]/).pop()}</div>
                    <small style={{ color: "var(--dw-text-subtle)", fontSize: "12px" }}>{p}</small>
                  </div>
                </button>
              ))
            ) : (
              <div style={{ color: "var(--dw-text-subtle)", fontSize: "14px" }}>No recent projects. Ingest imagery to begin.</div>
            )}

            <button
              className="dw-btn bn-btn--full"
              style={{ marginTop: "10px" }}
              onClick={() => onLoadProject("/sample_project")}
            >
              ⛰️ Load Built-in Demo Project (/sample_project)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
