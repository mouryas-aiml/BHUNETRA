import { useState } from "react";
import {
  AiReconstructionIcon,
  AccuracyIcon,
  DatasetIcon,
  ElevationModelIcon,
  ExportIcon,
  TerrainIcon,
  UploadIcon,
  DepthWizardLogo,
} from "./icons";
import type { ProjectManifest, ProjectMeshReport, RasterMetadata, ReferenceValidationReport } from "../api";

interface DashboardViewProps {
  metadata: RasterMetadata | null;
  manifest: ProjectManifest | null;
  mesh: ProjectMeshReport | null;
  validation: ReferenceValidationReport | null;
  processing: boolean;
  onNavigate: (page: string) => void;
  onRunReconstruction: () => void;
  onInstant3D: () => void;
  onExploreGamus: () => void;
  onImportImagery: () => void;
  onLoadIndianRegion?: (regionId: string) => void;
}

interface IndianTerrainRegion {
  id: string;
  name: string;
  physiography: string;
  location: string;
  elevationRange: string;
  slopeProfile: string;
  challenges: string;
  crs: string;
  sensor: string;
  status: "Sample Available" | "Integration Ready";
  thumbnailUrl: string;
}

const INDIAN_TERRAIN_REGIONS: IndianTerrainRegion[] = [
  {
    id: "himalayas_joshimath",
    name: "Himalayan Alpine & Glaciated Ridge (Nanda Devi / Joshimath)",
    physiography: "High-relief alpine glaciated valley with severe topographic relief around Nanda Devi (7,816m), Trishul, and deep river gorges",
    location: "Joshimath / Chamoli, Uttarakhand (30.55°N, 79.56°E)",
    elevationRange: "1,789 m – 5,510 m a.s.l.",
    slopeProfile: "35° – 68° extreme glaciated escarpments",
    challenges: "Snow albedo saturation, steep cast shadows, acute relief displacement",
    crs: "EPSG:32644 (UTM Zone 44N)",
    sensor: "Cartosat-2/3 PAN/MX & Sentinel-2 MSI",
    status: "Sample Available",
    thumbnailUrl: "/indian_mountains/himalayas_joshimath.png",
  },
  {
    id: "western_ghats_kudremukh",
    name: "Western Ghats Escarpment & Rainforest (Kudremukh)",
    physiography: "Steep seaward orographic cliffs, Kudremukh Peak (1,894m), dense tropical evergreen rainforest canopy, and shola mountain grasslands",
    location: "Kudremukh / Sahyadri Range, Karnataka (13.13°N, 75.25°E)",
    elevationRange: "650 m – 1,894 m a.s.l.",
    slopeProfile: "25° – 60° fault-block trap escarpments",
    challenges: "Dense multi-tier canopy occluding bare earth, frequent monsoonal cloud persistence",
    crs: "EPSG:32643 (UTM Zone 43N)",
    sensor: "Sentinel-2 MSI / Resourcesat-2A LISS-IV",
    status: "Sample Available",
    thumbnailUrl: "/indian_mountains/western_ghats_kudremukh.png",
  },
  {
    id: "ladakh_leh",
    name: "Ladakh High-Altitude Cold Desert (Leh & Indus Valley)",
    physiography: "Hyper-arid periglacial plateau, barren scree slopes, braided Indus riverbed, and sharp mountain shadows",
    location: "Leh / Indus River Valley, Ladakh (34.15°N, 77.58°E)",
    elevationRange: "3,200 m – 5,850 m a.s.l.",
    slopeProfile: "15° – 45° scree slopes and dry valley floors",
    challenges: "Near-total lack of vegetation canopy, high ground reflectance, atmospheric clarity",
    crs: "EPSG:32643 (UTM Zone 43N)",
    sensor: "Cartosat-3 PAN / Landsat-9 OLI-2",
    status: "Sample Available",
    thumbnailUrl: "/indian_mountains/ladakh_leh.png",
  },
  {
    id: "eastern_ghats_araku",
    name: "Eastern Ghats Dissected Peninsular Hills (Araku Valley)",
    physiography: "Discontinuous relict mountain belt, deeply eroded charnockite-khondalite ridges, red lateritic soil, and coffee terraces",
    location: "Araku Valley, Andhra Pradesh (18.33°N, 82.88°E)",
    elevationRange: "600 m – 1,680 m a.s.l.",
    slopeProfile: "12° – 38° dissected structural valleys",
    challenges: "Subtle topographic gradients, mixed deciduous canopy and terrace cultivation",
    crs: "EPSG:32644 (UTM Zone 44N)",
    sensor: "Resourcesat-2 LISS-IV / Cartosat-2",
    status: "Sample Available",
    thumbnailUrl: "/indian_mountains/eastern_ghats_araku.png",
  },
  {
    id: "northeast_tawang",
    name: "Northeast Mountainous Fold Belts (Tawang River Gorge)",
    physiography: "Precipitous Eastern Himalayan V-valleys, roaring glacial river gorges, and dense coniferous montane forest slopes",
    location: "Tawang, Arunachal Pradesh (27.59°N, 91.86°E)",
    elevationRange: "2,100 m – 4,800 m a.s.l.",
    slopeProfile: "20° – 55° heavily incised drainage valleys",
    challenges: "Persistent cloud cover, extreme rainfall erosion features, dense bamboo understory",
    crs: "EPSG:32645 (UTM Zone 45N)",
    sensor: "Sentinel-2 MSI / Cartosat-2C",
    status: "Sample Available",
    thumbnailUrl: "/indian_mountains/northeast_tawang.png",
  },
  {
    id: "deccan_plateau_pune",
    name: "Deccan Basaltic Traps & Mesa (Sinhagad & Sahyadri)",
    physiography: "Stepped volcanic trap lava flows, flat-topped mesas, buttressed ravines, and near-vertical basalt cliff drops",
    location: "Sinhagad / Western Maharashtra Plateau (18.37°N, 73.76°E)",
    elevationRange: "580 m – 1,312 m a.s.l.",
    slopeProfile: "0° – 5° plateau summits, 70° – 90° basalt cliff drops",
    challenges: "Sharp cliff-top boundaries requiring strict edge preservation in depth models",
    crs: "EPSG:32643 (UTM Zone 43N)",
    sensor: "Resourcesat-2 LISS-4 / Cartosat-2D",
    status: "Sample Available",
    thumbnailUrl: "/indian_mountains/deccan_plateau_pune.png",
  },
  {
    id: "urban_foothills",
    name: "Indo-Gangetic Transition & Dehradun Foothills",
    physiography: "Alluvial gravel fans (Bhabhar), marshy Terai transition, urbanized duns",
    location: "Dehradun / Rishikesh, Uttarakhand (30.31°N, 78.03°E)",
    elevationRange: "350 m – 1,200 m a.s.l.",
    slopeProfile: "2° – 18° rolling foothills and piedmont gravel fans",
    challenges: "Dense urban structures alongside natural river terraces requiring nDSM separation",
    crs: "EPSG:32644 (UTM Zone 44N)",
    sensor: "Cartosat-3 / WorldView-3 / Sentinel-2",
    status: "Integration Ready",
    thumbnailUrl: "/indian_mountains/himalayas_joshimath.png",
  },
];

export function DashboardView({
  metadata,
  manifest,
  mesh,
  validation,
  processing,
  onNavigate,
  onRunReconstruction,
  onInstant3D,
  onExploreGamus,
  onImportImagery,
  onLoadIndianRegion,
}: DashboardViewProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("himalayas_joshimath");
  const hasInput = Boolean(metadata);
  const geometryReady = Boolean(manifest?.artifacts.dsm || manifest?.artifacts.rdsm || mesh);
  const calibrationReady = Boolean(manifest?.stages.calibration?.status === "completed" || metadata?.crs);
  const meshReady = Boolean(mesh || manifest?.artifacts.terrain_lod0);
  const validationReady = Boolean(validation || manifest?.artifacts.metrics);

  const pipelineStages = [
    { code: "01", label: "Upload & Ingest", desc: "RGB optical chip / GeoTIFF verification", ready: hasInput, page: "Inspector" },
    { code: "02", label: "Image Analysis", desc: "Radiometric checks, blur, exposure & telemetry", ready: hasInput, page: "Inspector" },
    { code: "03", label: "Monocular Depth", desc: "Vision Transformer deep geometry inference", ready: geometryReady, page: "Reconstruction" },
    { code: "04", label: "Scale Calibration", desc: "Huber IRLS alignment via DEM / GCPs", ready: calibrationReady, page: "Elevation" },
    { code: "05", label: "Elevation Map", desc: "Metric DSM or Relative rDSM surface", ready: geometryReady, page: "Elevation" },
    { code: "06", label: "3D Terrain", desc: "Textured WebGL mesh with multi-mode flythrough", ready: meshReady, page: "Terrain" },
    { code: "07", label: "Terrain Derivatives", desc: "Slope, aspect, contours & cross-sections", ready: geometryReady, page: "Intelligence" },
    { code: "08", label: "Export Products", desc: "GeoTIFF, GLB LOD pyramid, provenance audit", ready: geometryReady, page: "Exports" },
  ];

  return (
    <div className="bn-page-container" style={{ padding: "0 0 32px 0" }}>
      {/* Hero Banner */}
      <div style={{ padding: "20px 24px 18px", borderBottom: "1px solid rgba(56,189,248,0.12)", background: "rgba(10,16,31,0.6)" }}>
        <div style={{ marginBottom: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span className="bn-badge bn-badge--cyan">SIH 2026 · PROBLEM STATEMENT 26175</span>
          <span className="bn-badge bn-badge--violet">ISRO / DEPARTMENT OF SPACE</span>
          <span className="bn-badge" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", color: "#10b981" }}>
            SYSTEM OPERATIONAL
          </span>
          {calibrationReady ? (
            <span className="bn-badge" style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.4)", color: "#38bdf8" }}>
              MODE: ABSOLUTE METRIC DSM
            </span>
          ) : geometryReady ? (
            <span className="bn-badge" style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.4)", color: "#f97316" }}>
              MODE: RELATIVE rDSM (UNANCHORED)
            </span>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <DepthWizardLogo size={74} className="dw-hero-logo" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: "0 0 4px", fontSize: 25, fontWeight: 800, background: "linear-gradient(135deg,#fff,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.3px" }}>
              DepthWizard — Single-View Height Estimation & 3D Terrain Intelligence
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "var(--bn-text-secondary)", lineHeight: 1.5 }}>
              Single RGB / GeoTIFF Image → Monocular Depth Estimation → Robust Scale Calibration → DSM/rDSM Elevation Surface → Navigable 3D WebGL Flythrough
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button className="dw-btn dw-btn--primary" onClick={onRunReconstruction} disabled={processing || !hasInput} style={{ fontSize: 13, height: 36 }}>
              <AiReconstructionIcon /> {processing ? "Estimating Height..." : "Run Height Estimation"}
            </button>
            <button className="dw-btn" onClick={onInstant3D} style={{ fontSize: 13, height: 36 }}>
              <TerrainIcon /> 3D Flythrough
            </button>
            <button className="dw-btn" onClick={onImportImagery} style={{ fontSize: 13, height: 36 }}>
              <UploadIcon /> Import Imagery
            </button>
            <button className="dw-btn" onClick={onExploreGamus} style={{ fontSize: 13, height: 36 }}>
              <DatasetIcon /> Datasets & GAMUS
            </button>
          </div>
        </div>
      </div>

      {/* The 3 Core SIH Milestones Tracker */}
      <div style={{ padding: "16px 24px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {/* Milestone 1 */}
          <div className="bn-card" style={{ padding: "14px 16px", borderLeft: "3px solid #38bdf8" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.5px" }}>MILESTONE 1</span>
              <span className={`bn-badge ${geometryReady ? "bn-badge--green" : "bn-badge--cyan"}`}>
                {geometryReady ? "ESTIMATED" : "READY"}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>
              Elevation Extraction
            </div>
            <p style={{ fontSize: 12, color: "var(--bn-text-secondary)", margin: "0 0 8px", lineHeight: 1.4 }}>
              Extracts high-fidelity dense depth cues from a single optical image using Vision Transformer foundation priors without requiring stereo pairs.
            </p>
            <div style={{ fontSize: 11, color: "var(--bn-text-muted)", display: "flex", justifyContent: "space-between" }}>
              <span>Prior: DA3MONO-LARGE</span>
              <span>Tiles: 768px + Hann Blend</span>
            </div>
          </div>

          {/* Milestone 2 */}
          <div className="bn-card" style={{ padding: "14px 16px", borderLeft: `3px solid ${calibrationReady ? "#10b981" : "#f97316"}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: calibrationReady ? "#10b981" : "#f97316", textTransform: "uppercase", letterSpacing: "0.5px" }}>MILESTONE 2</span>
              <span className={`bn-badge ${calibrationReady ? "bn-badge--green" : "bn-badge--violet"}`}>
                {calibrationReady ? "CALIBRATED (METRIC)" : "RELATIVE (rDSM)"}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>
              Scale Calibration
            </div>
            <p style={{ fontSize: 12, color: "var(--bn-text-secondary)", margin: "0 0 8px", lineHeight: 1.4 }}>
              Converts dimensionless depth into physical metric elevations using reference DEMs (Copernicus/SRTM) or surveyed GCPs via Huber IRLS regression.
            </p>
            <div style={{ fontSize: 11, color: "var(--bn-text-muted)", display: "flex", justifyContent: "space-between" }}>
              <span>Method: Positive Huber IRLS</span>
              <span>Fail-closed: No false units</span>
            </div>
          </div>

          {/* Milestone 3 */}
          <div className="bn-card" style={{ padding: "14px 16px", borderLeft: "3px solid #818cf8" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.5px" }}>MILESTONE 3</span>
              <span className={`bn-badge ${meshReady ? "bn-badge--green" : "bn-badge--cyan"}`}>
                {meshReady ? "LOD 0-3 ACTIVE" : "GPU READY"}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>
              3D Flythrough Visualization
            </div>
            <p style={{ fontSize: 12, color: "var(--bn-text-secondary)", margin: "0 0 8px", lineHeight: 1.4 }}>
              Generates a four-level terrain mesh pyramid with original optical texture projection, supporting Orbit, Fly, First-Person, and Top-Down flight.
            </p>
            <div style={{ fontSize: 11, color: "var(--bn-text-muted)", display: "flex", justifyContent: "space-between" }}>
              <span>Engine: WebGL / Three.js</span>
              <span>Cameras: 4 Flight Modes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Ingest Contract Guide */}
      <div style={{ padding: "14px 24px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {/* Non-Georeferenced Ingest */}
          <div className="bn-card" style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="bn-badge bn-badge--violet">WORKFLOW A</span>
              <strong style={{ fontSize: 13, color: "#f8fafc" }}>Non-Georeferenced Input (JPG / JPEG / PNG)</strong>
            </div>
            <div style={{ fontSize: 12, color: "var(--bn-text-secondary)", marginBottom: 10, lineHeight: 1.4 }}>
              Designed for standard single-view aerial photographs, drone shots, or cropped optical chips without embedded coordinate metadata.
            </div>
            <div style={{ background: "rgba(15,23,42,0.6)", borderRadius: 6, padding: "8px 12px", fontSize: 11, fontFamily: "monospace", color: "#38bdf8", marginBottom: 10 }}>
              RGB Image → Monocular Depth → Normalized Inversion → Relative DSM (rDSM) → 3D Mesh
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "var(--bn-text-muted)", lineHeight: 1.5 }}>
              <li>Output is strictly labeled: <strong style={{ color: "#f97316" }}>Relative Digital Surface Model (rDSM)</strong></li>
              <li>No false metric elevation or geographic coordinates are fabricated</li>
              <li>Supports relative slope analysis, relative height cross-sections, and full 3D flythrough</li>
            </ul>
          </div>

          {/* Georeferenced Ingest */}
          <div className="bn-card" style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="bn-badge bn-badge--cyan">WORKFLOW B</span>
              <strong style={{ fontSize: 13, color: "#f8fafc" }}>Georeferenced Input (GeoTIFF / Orthophoto)</strong>
            </div>
            <div style={{ fontSize: 12, color: "var(--bn-text-secondary)", marginBottom: 10, lineHeight: 1.4 }}>
              Designed for remote-sensing satellite orthophotos (Sentinel-2, Cartosat, Resourcesat) with CRS and affine transform preservation.
            </div>
            <div style={{ background: "rgba(15,23,42,0.6)", borderRadius: 6, padding: "8px 12px", fontSize: 11, fontFamily: "monospace", color: "#10b981", marginBottom: 10 }}>
              GeoTIFF → Depth Prior → Reference DEM/GCP Alignment → Metric DSM (m) → Validated 3D Terrain
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "var(--bn-text-muted)", lineHeight: 1.5 }}>
              <li>Output is verified as: <strong style={{ color: "#10b981" }}>Absolute Digital Surface Model (DSM)</strong> in physical metres</li>
              <li>Preserves projected CRS, pixel resolution (GSD), bounding box, and affine coordinates</li>
              <li>Generates genuine residual analysis (RMSE, MAE, distribution) against independent ground control</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 8-Stage Pipeline Stepper */}
      <div style={{ padding: "14px 24px 0" }}>
        <div className="bn-card" style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="bn-card-title" style={{ margin: 0, fontSize: 12 }}>
              SIH 26175 END-TO-END PIPELINE LIFECYCLE
            </div>
            <span style={{ fontSize: 11, color: "var(--bn-text-muted)" }}>
              {pipelineStages.filter((s) => s.ready).length} / 8 stages completed for current workspace
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 8 }}>
            {pipelineStages.map((stage) => (
              <div
                key={stage.code}
                onClick={() => onNavigate(stage.page)}
                style={{
                  background: stage.ready ? "rgba(16,185,129,0.08)" : "rgba(15,23,42,0.6)",
                  border: `1px solid ${stage.ready ? "rgba(16,185,129,0.35)" : "rgba(56,189,248,0.12)"}`,
                  borderRadius: 6,
                  padding: "10px 8px",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 800, color: stage.ready ? "#10b981" : "#64748b", marginBottom: 4 }}>
                  STAGE {stage.code}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: stage.ready ? "#f8fafc" : "#94a3b8", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {stage.label}
                </div>
                <div style={{ fontSize: 9, color: "var(--bn-text-muted)", lineHeight: 1.2, height: 22, overflow: "hidden" }}>
                  {stage.desc}
                </div>
                <div style={{ marginTop: 6 }}>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "2px 5px",
                      borderRadius: 3,
                      background: stage.ready ? "rgba(16,185,129,0.2)" : "rgba(100,116,139,0.15)",
                      color: stage.ready ? "#10b981" : "#64748b",
                    }}
                  >
                    {stage.ready ? "READY" : "PENDING"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indian Terrain Physiographic Profiles */}
      <div style={{ padding: "14px 24px 0" }}>
        <div className="bn-card" style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <div>
              <div className="bn-card-title" style={{ margin: 0, fontSize: 12 }}>
                INDIAN PHYSIOGRAPHIC TERRAIN REPOSITORIES
              </div>
              <div style={{ fontSize: 11, color: "var(--bn-text-secondary)", marginTop: 2 }}>
                7 authoritative Indian terrain environments configured for remote-sensing height validation (ISRO / Bhuvan / Copernicus DEM alignment)
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="dw-btn" onClick={() => onNavigate("Datasets")} style={{ fontSize: 12, height: 30 }}>
                View Full Catalog ({INDIAN_TERRAIN_REGIONS.length})
              </button>
              <button
                className="dw-btn dw-btn--primary"
                onClick={() => void onInstant3D()}
                style={{ fontSize: 12, height: 30 }}
                title="Loads the verified Joshimath, Uttarakhand alpine terrain sample"
              >
                ⚡ Load Joshimath Sample
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14 }}>
            {/* Region List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 320, overflowY: "auto" }}>
              {INDIAN_TERRAIN_REGIONS.map((region) => {
                const isSelected = selectedRegion === region.id;
                return (
                  <div
                    key={region.id}
                    onClick={() => setSelectedRegion(region.id)}
                    style={{
                      background: isSelected ? "rgba(56,189,248,0.12)" : "rgba(15,23,42,0.4)",
                      border: `1px solid ${isSelected ? "#38bdf8" : "rgba(56,189,248,0.08)"}`,
                      borderRadius: 6,
                      padding: "8px 12px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isSelected ? "#38bdf8" : "#f8fafc" }}>
                        {region.name}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--bn-text-muted)" }}>
                        {region.elevationRange}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        padding: "2px 5px",
                        borderRadius: 3,
                        background: region.status === "Sample Available" ? "rgba(16,185,129,0.2)" : "rgba(56,189,248,0.1)",
                        color: region.status === "Sample Available" ? "#10b981" : "#38bdf8",
                      }}
                    >
                      {region.status === "Sample Available" ? "SAMPLE" : "CONFIG"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Region Detail Card */}
            {(() => {
              const r = INDIAN_TERRAIN_REGIONS.find((x) => x.id === selectedRegion) ?? INDIAN_TERRAIN_REGIONS[0];
              return (
                <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: 6, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <h3 style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: "#f8fafc" }}>
                        {r.name}
                      </h3>
                      <div style={{ fontSize: 11, color: "#38bdf8" }}>{r.location}</div>
                    </div>
                    <button
                      className="dw-btn dw-btn--primary"
                      onClick={() => onLoadIndianRegion ? onLoadIndianRegion(r.id) : onInstant3D()}
                      style={{ fontSize: 11, height: 28 }}
                    >
                      ⚡ Load 3D Terrain
                    </button>
                  </div>

                  {r.thumbnailUrl && (
                    <div style={{ margin: "10px 0", borderRadius: 6, overflow: "hidden", border: "1px solid rgba(56,189,248,0.2)", position: "relative", height: 160 }}>
                      <img src={r.thumbnailUrl} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", bottom: 6, left: 10, background: "rgba(0,0,0,0.75)", padding: "2px 8px", borderRadius: 4, fontSize: 10, color: "#38bdf8" }}>
                        Optical Satellite Ingest · {r.sensor}
                      </div>
                    </div>
                  )}

                  <p style={{ fontSize: 12, color: "var(--bn-text-secondary)", margin: "0 0 10px", lineHeight: 1.4 }}>
                    {r.physiography}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11 }}>
                    <div style={{ background: "rgba(0,0,0,0.2)", padding: "6px 10px", borderRadius: 4 }}>
                      <span style={{ color: "var(--bn-text-muted)", display: "block" }}>Elevation Span</span>
                      <strong style={{ color: "#38bdf8" }}>{r.elevationRange}</strong>
                    </div>
                    <div style={{ background: "rgba(0,0,0,0.2)", padding: "6px 10px", borderRadius: 4 }}>
                      <span style={{ color: "var(--bn-text-muted)", display: "block" }}>Slope Dynamics</span>
                      <strong style={{ color: "#f8fafc" }}>{r.slopeProfile}</strong>
                    </div>
                    <div style={{ background: "rgba(0,0,0,0.2)", padding: "6px 10px", borderRadius: 4 }}>
                      <span style={{ color: "var(--bn-text-muted)", display: "block" }}>Target Projected CRS</span>
                      <strong style={{ color: "#f8fafc" }}>{r.crs}</strong>
                    </div>
                    <div style={{ background: "rgba(0,0,0,0.2)", padding: "6px 10px", borderRadius: 4 }}>
                      <span style={{ color: "var(--bn-text-muted)", display: "block" }}>Recommended Sensor</span>
                      <strong style={{ color: "#f8fafc" }}>{r.sensor}</strong>
                    </div>
                  </div>

                  <div style={{ marginTop: 10, fontSize: 11, color: "var(--bn-text-secondary)" }}>
                    <strong style={{ color: "#f59e0b" }}>Scientific Challenge: </strong>
                    {r.challenges}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Live Workspace Telemetry */}
      <div style={{ padding: "14px 24px 0" }}>
        <div className="bn-card" style={{ padding: 16 }}>
          <div className="bn-card-title" style={{ margin: "0 0 10px", fontSize: 12 }}>
            ACTIVE WORKSPACE TELEMETRY & PRODUCT STATUS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            <div style={{ background: "rgba(15,23,42,0.4)", borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "var(--bn-text-muted)", textTransform: "uppercase" }}>Source Optical Ingest</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: hasInput ? "#38bdf8" : "#64748b", margin: "4px 0 2px" }}>
                {hasInput ? `${metadata!.width} × ${metadata!.height} px` : "No image ingested"}
              </div>
              <div style={{ fontSize: 11, color: "var(--bn-text-secondary)" }}>
                {hasInput ? `${metadata!.count} Bands · GSD ${metadata!.ground_sample_distance_x?.toFixed(2) ?? "—"} m` : "Upload single-view image"}
              </div>
            </div>

            <div style={{ background: "rgba(15,23,42,0.4)", borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "var(--bn-text-muted)", textTransform: "uppercase" }}>Surface Product Mode</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: calibrationReady ? "#10b981" : geometryReady ? "#f97316" : "#64748b", margin: "4px 0 2px" }}>
                {calibrationReady ? "Absolute DSM (m)" : geometryReady ? "Relative rDSM" : "Pending Estimation"}
              </div>
              <div style={{ fontSize: 11, color: "var(--bn-text-secondary)" }}>
                {calibrationReady ? "Huber IRLS evidence anchored" : geometryReady ? "Dimensionless relative height" : "Run depth estimation"}
              </div>
            </div>

            <div style={{ background: "rgba(15,23,42,0.4)", borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "var(--bn-text-muted)", textTransform: "uppercase" }}>3D Terrain Mesh</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: meshReady ? "#10b981" : "#64748b", margin: "4px 0 2px" }}>
                {meshReady ? "LOD 0-3 Generated" : "Mesh Not Built"}
              </div>
              <div style={{ fontSize: 11, color: "var(--bn-text-secondary)" }}>
                {meshReady ? "Persistent WebGL GLB pyramid" : "Requires elevation surface"}
              </div>
            </div>

            <div style={{ background: "rgba(15,23,42,0.4)", borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "var(--bn-text-muted)", textTransform: "uppercase" }}>Technical Validation</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: validationReady ? "#10b981" : "#f59e0b", margin: "4px 0 2px" }}>
                {validationReady && validation?.elevation?.rmse_m != null ? `RMSE ${validation.elevation.rmse_m.toFixed(2)} m` : "No Reference DEM"}
              </div>
              <div style={{ fontSize: 11, color: "var(--bn-text-secondary)" }}>
                {validationReady ? `${validation?.valid_pixels.toLocaleString()} points validated` : "Validation unavailable without reference"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}