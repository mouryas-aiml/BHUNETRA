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
export const EvaluatorIcon = () => <Icon><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Icon>;

export const BhuNetraLogo = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="BhuNetra Logo">
    <defs>
      <linearGradient id="bnGlobe" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="bnContour" x1="16" y1="20" x2="48" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
      <filter id="bnGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Outer Orbital / Geo-ring */}
    <ellipse cx="32" cy="32" rx="27" ry="14" transform="rotate(-28 32 32)" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.6" />
    {/* Earth / Sensor Eye Iris Contour */}
    <circle cx="32" cy="32" r="22" stroke="url(#bnGlobe)" strokeWidth="2.5" />
    {/* Inner Elevation Contour Lines */}
    <path d="M16 35 C20 25, 28 22, 34 26 C40 30, 44 24, 48 28" stroke="url(#bnContour)" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 41 C24 34, 30 33, 36 37 C42 41, 46 38, 47 40" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
    <path d="M22 47 C26 43, 32 42, 38 45 C41 46, 43 45, 44 46" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    {/* Central Elevation Anchor / Vision Focal Point */}
    <circle cx="32" cy="32" r="4.5" fill="#38bdf8" filter="url(#bnGlow)" />
    <circle cx="32" cy="32" r="2" fill="#ffffff" />
    {/* Satellite Node on Orbit */}
    <circle cx="53" cy="20" r="3" fill="#00f2fe" filter="url(#bnGlow)" />
    <line x1="51" y1="18" x2="55" y2="22" stroke="#ffffff" strokeWidth="1.2" />
  </svg>
);

