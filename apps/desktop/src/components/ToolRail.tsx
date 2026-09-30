import {
  AccuracyIcon,
  AiReconstructionIcon,
  AnalysisIcon,
  DashboardIcon,
  DatasetIcon,
  DigitalTwinIcon,
  ElevationModelIcon,
  ExportIcon,
  FlythroughIcon,
  HeatmapIcon,
  ImageInspectorIcon,
  ProjectIcon,
  SettingsIcon,
  TerrainIcon,
  UploadIcon,
  ValidateIcon,
} from "./icons";

export const SIDEBAR_PAGES = [
  { id: "Dashboard", label: "Dashboard", icon: DashboardIcon },
  { id: "Projects", label: "Projects", icon: ProjectIcon },
  { id: "Import", label: "Import Imagery", icon: UploadIcon },
  { id: "Dataset", label: "Dataset Explorer", icon: DatasetIcon },
  { id: "Reconstruction", label: "AI Reconstruction", icon: AiReconstructionIcon },
  { id: "Elevation", label: "Elevation Model", icon: ElevationModelIcon },
  { id: "Terrain", label: "Terrain", icon: TerrainIcon },
  { id: "Heatmap", label: "Heatmap", icon: HeatmapIcon },
  { id: "Intelligence", label: "Terrain Intelligence", icon: AnalysisIcon },
  { id: "DigitalTwin", label: "Geospatial Digital Twin", icon: DigitalTwinIcon },
  { id: "Inspector", label: "Image Inspector", icon: ImageInspectorIcon },
  { id: "Accuracy", label: "Accuracy & Error", icon: AccuracyIcon },
  { id: "Validation", label: "Validation", icon: ValidateIcon },
  { id: "Flythrough", label: "3D Flythrough", icon: FlythroughIcon },
  { id: "Exports", label: "Exports", icon: ExportIcon },
  { id: "Settings", label: "Settings", icon: SettingsIcon },
] as const;

export type SidebarPageId = (typeof SIDEBAR_PAGES)[number]["id"];

/**
 * Items in this set are kept in SIDEBAR_PAGES for test/API compatibility
 * but are intentionally hidden from the visible navigation rail.
 * "Import" is triggered via topbar actions; "Terrain" is accessed through
 * the workspace view-switcher bar.
 */
const HIDDEN_SIDEBAR_IDS = new Set(["Import", "DigitalTwin"]);

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
      {SIDEBAR_PAGES.filter(({ id }) => !HIDDEN_SIDEBAR_IDS.has(id)).map(({ id, label, icon: ToolIcon }) => {
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
