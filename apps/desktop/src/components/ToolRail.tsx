import {
  AccuracyIcon,
  AiReconstructionIcon,
  AnalysisIcon,
  DashboardIcon,
  DatasetIcon,
  ElevationModelIcon,
  ExportIcon,
  ImageInspectorIcon,
  SettingsIcon,
  TerrainIcon,
  UploadIcon,
} from "./icons";

export const SIDEBAR_PAGES = [
  { id: "Terrain", label: "01 — 3D Terrain Flythrough", icon: TerrainIcon },
  { id: "Import", label: "02 — Upload & Ingest Imagery", icon: UploadIcon },
  { id: "Inspector", label: "03 — Image Quality & Metadata", icon: ImageInspectorIcon },
  { id: "Reconstruction", label: "04 — Monocular Depth Estimation", icon: AiReconstructionIcon },
  { id: "Elevation", label: "05 — Scale Calibration & DSM", icon: ElevationModelIcon },
  { id: "Intelligence", label: "06 — Terrain Analysis Derivatives", icon: AnalysisIcon },
  { id: "Accuracy", label: "07 — Accuracy & Residuals", icon: AccuracyIcon },
  { id: "Exports", label: "08 — Geospatial Exports", icon: ExportIcon },
  { id: "Dashboard", label: "DepthWizard Pipeline Overview", icon: DashboardIcon },
  { id: "Dataset", label: "Indian Mountain Datasets", icon: DatasetIcon },
  { id: "Settings", label: "System Settings", icon: SettingsIcon },
] as const;

export type SidebarPageId = (typeof SIDEBAR_PAGES)[number]["id"];

export function ToolRail({
  active,
  onChange,
  disabledTools,
}: {
  active: string;
  onChange: (tool: string) => void;
  disabledTools?: ReadonlySet<string>;
}) {
  return (
    <nav className="dw-toolrail" aria-label="Workspace tools">
      {SIDEBAR_PAGES.map(({ id, label, icon: ToolIcon }) => {
        const disabled = disabledTools?.has(id) ?? false;
        return (
          <button
            key={id}
            className="dw-tool"
            data-active={active === id}
            title={label}
            aria-label={label}
            disabled={disabled}
            onClick={() => {
              if (!disabled) onChange(id);
            }}
          >
            <span className="dw-tool-icon" aria-hidden="true">
              <ToolIcon />
            </span>
          </button>
        );
      })}
    </nav>
  );
}
