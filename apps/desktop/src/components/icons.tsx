import type { ReactNode } from "react";

const Icon = ({ children }: { children: ReactNode }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const ProjectIcon = () => <Icon><path d="M4 7.5h6l1.7 2H20v9.5H4z"/><path d="M4 7.5V5h6l1.7 2"/></Icon>;
export const LayersIcon = () => <Icon><path d="m12 3 8 4-8 4-8-4 8-4Z"/><path d="m4 12 8 4 8-4"/><path d="m4 17 8 4 8-4"/></Icon>;
export const MeasureIcon = () => <Icon><path d="M4 17 17 4l3 3L7 20H4v-3Z"/><path d="m13.5 7.5 3 3"/></Icon>;
export const StructureIcon = () => <Icon><path d="M5 20V10l7-5 7 5v10"/><path d="M9 20v-6h6v6"/><path d="M3 20h18"/></Icon>;
export const ProfileIcon = () => <Icon><path d="M3 18h18"/><path d="m5 16 4-6 3 3 4-8 3 11"/></Icon>;
export const ValidateIcon = () => <Icon><circle cx="12" cy="12" r="8"/><path d="m8.5 12 2.3 2.3 4.8-5"/></Icon>;
export const CompareIcon = () => <Icon><rect x="4" y="5" width="7" height="14" rx="1"/><rect x="13" y="5" width="7" height="14" rx="1"/></Icon>;
export const ExportIcon = () => <Icon><path d="M12 4v11"/><path d="m8 11 4 4 4-4"/><path d="M5 19h14"/></Icon>;
export const UploadIcon = () => <Icon><path d="M12 20V9"/><path d="m8 13 4-4 4 4"/><path d="M5 5h14"/></Icon>;
export const DatasetIcon = () => <Icon><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></Icon>;
export const TerrainIcon = () => <Icon><path d="m2 17 5-6 4 4 6-8 5 10H2Z"/><path d="m14 11 2-3 2 3"/></Icon>;
export const DsmIcon = () => <Icon><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></Icon>;
export const AnalysisIcon = () => <Icon><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></Icon>;
export const DashboardIcon = () => <Icon><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></Icon>;
export const SettingsIcon = () => <Icon><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></Icon>;
export const HeatmapIcon = () => <Icon><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="2.5" fill="currentColor"/><circle cx="16" cy="12" r="3.5" fill="currentColor" opacity="0.7"/><circle cx="9" cy="16" r="2" fill="currentColor" opacity="0.5"/></Icon>;
export const FlythroughIcon = () => <Icon><path d="m3 9 18-6-6 18-3-7-9-5Z"/></Icon>;
export const DigitalTwinIcon = () => <Icon><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="9" ry="4"/><line x1="12" y1="3" x2="12" y2="21"/></Icon>;
export const ImageInspectorIcon = () => <Icon><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><path d="M11 8v6M8 11h6"/></Icon>;
export const AiReconstructionIcon = () => <Icon><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Icon>;
export const AccuracyIcon = () => <Icon><path d="M18 20V10M12 20V4M6 20v-6"/><path d="M3 20h18"/></Icon>;
export const ElevationModelIcon = () => <Icon><path d="M2 20h20"/><path d="m4 17 6-10 4 6 2-3 4 7"/></Icon>;

export const DepthWizardLogo = ({ size = 26, className = "" }: { size?: number; className?: string }) => (
  <img
    src="/depthwizard-mark.png"
    alt="DepthWizard Logo"
    width={size}
    height={size}
    className={className}
    style={{ objectFit: "contain", verticalAlign: "middle" }}
  />
);




