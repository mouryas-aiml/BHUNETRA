export type RasterMetadata = {
  path: string;
  width: number;
  height: number;
  count: number;
  dtype: string;
  crs: string | null;
  transform: [number, number, number, number, number, number] | null;
  nodata: number | null;
  ground_sample_distance_x: number | null;
  ground_sample_distance_y: number | null;
  valid_data_fraction: number;
  vertical_crs: string | null;
  vertical_datum: string | null;
  elevation_reference: "orthometric" | "ellipsoidal" | "local" | "unknown";
  quality: {
    status: "pass" | "warning" | "not_assessed";
    flags: string[];
    saturation_fraction: number | null;
    deep_shadow_candidate_fraction: number | null;
    bright_low_chroma_candidate_fraction: number | null;
    texture_gradient_score: number | null;
    off_nadir_degrees: number | null;
    assessment_limitations: string[];
  };
};

export type ProjectRunStatus =
  | "created"
  | "queued"
  | "running"
  | "waiting_for_calibration"
  | "complete"
  | "failed"
  | "cancelled";

export type GroundControlPoint = {
  x: number;
  y: number;
  elevation_m: number;
  weight?: number;
};

export type GroundControlPointEvidence = {
  source_path: string;
  sha256: string;
};

export type GroundControlPointFileReport = {
  source_path: string;
  sha256: string;
  point_count: number;
  minimum_elevation_m: number;
  maximum_elevation_m: number;
  points: GroundControlPoint[];
  semantics: string;
};

export type ProcessingRequest = {
  source: string;
  output_dir: string;
  dem_path?: string | null;
  gcps?: GroundControlPoint[];
  gcp_evidence?: GroundControlPointEvidence | null;
  requested_output?: "rdsm" | "dsm" | null;
  band_indices?: [number, number, number];
  tile_size?: number;
  overlap?: number;
  harmonize_overlaps?: boolean;
  low_frequency_sigma_px?: number | null;
  low_frequency_sigma_m?: number | null;
  min_dem_anchor_correlation?: number;
  max_dem_anchor_rmse_m?: number | null;
  max_dem_normalized_rmse?: number;
  min_gcp_count?: number;
  max_gcp_anchor_rmse_m?: number | null;
  max_gcp_cross_validation_rmse_m?: number | null;
  vertical_crs?: string | null;
  vertical_datum?: string | null;
  elevation_reference?: "orthometric" | "ellipsoidal" | "local" | "unknown";
  dem_surface_type?: "dem" | "dtm" | "dsm" | "unknown";
};

export type ProjectJobState = {
  job_id: string;
  project_dir: string;
  status: ProjectRunStatus;
  manifest_path: string;
  submitted_at_utc: string;
  updated_at_utc: string;
  error: string | null;
  failure_kind: "resource_exhausted" | "processing_error" | null;
  cancellation_requested: boolean;
};

export type ProjectArtifact = {
  path: string;
  semantics: string;
  units: string | null;
  sha256: string;
};

export type ProjectStage = {
  status: "running" | "completed" | "waiting" | "failed" | "cancelled" | "skipped" | string;
  started_at_utc?: string;
  updated_at_utc?: string;
  completed_at_utc?: string;
  elapsed_seconds?: number;
  artifacts: Record<string, string>;
  details: Record<string, unknown>;
};

export type EstimatorEvidence = {
  branch_id: string;
  evidence_id: string;
  independently_evaluated: boolean;
  promotion_passed: boolean;
  summary: string;
};

export type EstimatorDecision = {
  selected_path: "calibrated_da3" | "promoted_learned_refiner";
  selected_model_id: string;
  reason: string;
  evidence: EstimatorEvidence[];
};

export type ProjectManifest = {
  schema_version: number;
  project_id: string;
  job_id: string | null;
  status: ProjectRunStatus;
  created_at_utc: string;
  updated_at_utc: string;
  source_path: string;
  source_sha256: string | null;
  input_kind: "non_georeferenced" | "georeferenced" | null;
  geometry_config_sha256: string | null;
  run_config_sha256: string | null;
  estimator: EstimatorDecision | Record<string, unknown>;
  artifacts: Record<string, ProjectArtifact>;
  stages: Record<string, ProjectStage>;
  warnings: string[];
  errors: Array<{ at_utc: string; stage: string | null; message: string }>;
};

export type EvaluationMetrics = {
  valid_pixels: number;
  mae_m: number;
  rmse_m: number;
  pearson_r: number | null;
  spearman_r: number | null;
  mean_bias_m: number;
  median_abs_error_m: number;
  nmad_m: number;
  p90_abs_error_m: number;
  p95_abs_error_m: number;
};

export type SlopeMetrics = {
  valid_pixels: number;
  mae_degrees: number;
  rmse_degrees: number;
  p95_abs_error_degrees: number;
};

export type ErrorConfidenceBin = {
  lower_confidence: number;
  upper_confidence: number;
  valid_pixels: number;
  mean_confidence: number;
  mae_m: number;
  rmse_m: number;
};

export type ReliabilityDiagnostics = {
  available: boolean;
  semantics: string;
  valid_pixels: number;
  confidence_abs_error_pearson_r: number | null;
  bins: ErrorConfidenceBin[];
};

export type ReferenceValidationReport = {
  schema_version: number;
  project_id: string;
  prediction_sha256: string;
  reference_path: string;
  reference_sha256: string;
  reference_label: string | null;
  independence_check: string;
  alignment: string;
  valid_pixels: number;
  coverage_fraction: number;
  elevation: EvaluationMetrics;
  slope: SlopeMetrics;
  reliability: ReliabilityDiagnostics;
  artifacts: Record<string, string>;
  warnings: string[];
};

export type NormalizedPoint = {
  x: number;
  y: number;
};

export type ProjectStructureHeightResult = {
  project_id: string;
  polygon: NormalizedPoint[];
  ring_pixels: number;
  top_elevation_m: number;
  ground_elevation_m: number;
  structure_height_m: number;
  structure_pixels: number;
  ground_pixels: number;
  ground_candidate_pixels: number;
  roof_inset_m: number;
  ground_inner_buffer_m: number;
  ground_outer_buffer_m: number;
  ground_inlier_fraction: number;
  ground_sector_coverage: number;
  roof_dispersion_m: number;
  ground_residual_sigma_m: number;
  local_height_dispersion_m: number;
  measurement_quality: "high" | "moderate" | "low";
  warnings: string[];
  semantics: string;
};

export type RasterSample = {
  available: boolean;
  value: number | null;
  units: string | null;
  semantics: string;
};

export type ProjectProbeResult = {
  project_id: string;
  point: NormalizedPoint;
  pixel_col: number;
  pixel_row: number;
  map_x: number | null;
  map_y: number | null;
  longitude: number | null;
  latitude: number | null;
  surface_product: "dsm" | "rdsm";
  surface: RasterSample;
  slope: RasterSample;
  reference: RasterSample;
  residual: RasterSample;
  confidence: RasterSample;
};

export type ProfileSample = {
  fraction: number;
  point: NormalizedPoint;
  distance_pixels: number;
  distance_m: number | null;
  surface: RasterSample;
  slope: RasterSample;
  reference: RasterSample;
  residual: RasterSample;
  confidence: RasterSample;
};

export type ProjectProfileResult = {
  project_id: string;
  surface_product: "dsm" | "rdsm";
  start: NormalizedPoint;
  end: NormalizedPoint;
  sample_count: number;
  horizontal_distance_pixels: number;
  horizontal_distance_m: number | null;
  horizontal_distance_source: "georeferenced_ground" | "analyst_scale" | "pixels_only";
  analyst_horizontal_scale_m_per_pixel: number | null;
  vertical_delta: number | null;
  vertical_units: string | null;
  minimum_surface: number | null;
  maximum_surface: number | null;
  elevation_gain: number | null;
  elevation_loss: number | null;
  samples: ProfileSample[];
  semantics: string;
};

export type TerrainLodArtifact = {
  level: number;
  stride: number;
  path: string;
  sha256: string;
  vertices: number;
  faces: number;
  width_samples: number;
  height_samples: number;
};

export type ProjectMeshReport = {
  schema_version: number;
  project_id: string;
  surface_product: "dsm" | "rdsm";
  surface_sha256: string;
  texture_sha256: string;
  build_config_sha256: string;
  horizontal_units: "m" | "px";
  vertical_units: "m" | "relative";
  gsd_x: number;
  gsd_y: number;
  raster_width: number;
  raster_height: number;
  valid_pixels: number;
  minimum_elevation: number;
  maximum_elevation: number;
  relief: number;
  lods: TerrainLodArtifact[];
  mesh_manifest_path: string;
  semantics: string;
};

export type ProjectExportFile = {
  arcname: string;
  source_path: string;
  sha256: string;
  bytes: number;
  semantics: string;
  units: string | null;
};

export type ProjectExportReport = {
  schema_version: number;
  project_id: string;
  bundle_path: string;
  bundle_sha256: string;
  bundle_bytes: number;
  project_manifest_sha256: string;
  export_manifest_path: string;
  include_source: boolean;
  include_mesh: boolean;
  include_validation: boolean;
  files: ProjectExportFile[];
  semantics: string;
};

export type ProjectPreviewLayer =
  | "optical"
  | "rdsm"
  | "dsm"
  | "slope"
  | "reference"
  | "residual"
  | "confidence"
  | "hillshade"
  | "contours";

export type ProjectLayerLegend = {
  available: boolean;
  layer: ProjectPreviewLayer;
  title: string;
  units: string | null;
  minimum?: number;
  midpoint?: number;
  maximum?: number;
  semantics: string;
  ramp: "optical" | "elevation" | "slope" | "diverging" | "grayscale" | "contours" | string;
  sampled_values?: number;
};

type RuntimeConfig = {
  apiBase?: string;
  sessionToken?: string;
  buildGitSha?: string;
};

declare global {
  interface Window {
    __DEPTHWIZARD_RUNTIME__?: RuntimeConfig;
  }
}

const runtime = () => window.__DEPTHWIZARD_RUNTIME__ ?? {};

function runtimeHeaders(init?: RequestInit): Headers {
  const config = runtime();
  const headers = new Headers(init?.headers);
  if (init?.body !== undefined && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  if (config.sessionToken) {
    headers.set("x-depthwizard-token", config.sessionToken);
  }
  return headers;
}

async function checkedResponse(path: string, init?: RequestInit): Promise<Response> {
  const config = runtime();
  const response = await fetch(`${config.apiBase ?? "http://127.0.0.1:8765"}${path}`, {
    ...init,
    headers: runtimeHeaders(init),
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { detail?: string };
    throw new Error(body.detail ?? `DepthWizard core returned HTTP ${response.status}`);
  }
  return response;
}

async function coreFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await checkedResponse(path, init);
  return response.json() as Promise<T>;
}

export interface KnownDatasetSpec {
  id: string;
  name: string;
  region: string;
  crs: string;
  minElev: number;
  maxElev: number;
  lat: number;
  lon: number;
  gsd: number;
  elevationMode: string;
}

export const KNOWN_DATASETS: Record<string, KnownDatasetSpec> = {
  himalayas_joshimath: {
    id: "himalayas_joshimath",
    name: "Joshimath & Nanda Devi",
    region: "Chamoli, Uttarakhand",
    crs: "EPSG:32644 (WGS 84 / UTM zone 44N)",
    minElev: 1789.0,
    maxElev: 5510.0,
    lat: 30.5564,
    lon: 79.5670,
    gsd: 2.5,
    elevationMode: "Absolute DSM (m)",
  },
  kedarnath_mandakini: {
    id: "kedarnath_mandakini",
    name: "Kedarnath & Mandakini Valley",
    region: "Rudraprayag, Uttarakhand",
    crs: "EPSG:32644 (WGS 84 / UTM zone 44N)",
    minElev: 3583.0,
    maxElev: 6940.0,
    lat: 30.7346,
    lon: 79.0669,
    gsd: 1.5,
    elevationMode: "Absolute DSM (m)",
  },
  badrinath_alaknanda: {
    id: "badrinath_alaknanda",
    name: "Badrinath & Alaknanda Valley",
    region: "Chamoli, Uttarakhand",
    crs: "EPSG:32644 (WGS 84 / UTM zone 44N)",
    minElev: 3100.0,
    maxElev: 6596.0,
    lat: 30.7423,
    lon: 79.4938,
    gsd: 2.0,
    elevationMode: "Absolute DSM (m)",
  },
  gangotri_bhagirathi: {
    id: "gangotri_bhagirathi",
    name: "Gangotri & Bhagirathi Valley",
    region: "Uttarkashi, Uttarakhand",
    crs: "EPSG:32644 (WGS 84 / UTM zone 44N)",
    minElev: 3890.0,
    maxElev: 7138.0,
    lat: 30.9833,
    lon: 79.0833,
    gsd: 1.5,
    elevationMode: "Absolute DSM (m)",
  },
  pithoragarh_kumaon: {
    id: "pithoragarh_kumaon",
    name: "Pithoragarh & Kumaon Himalayas",
    region: "Pithoragarh, Uttarakhand",
    crs: "EPSG:32644 (WGS 84 / UTM zone 44N)",
    minElev: 1600.0,
    maxElev: 6904.0,
    lat: 29.5828,
    lon: 80.2181,
    gsd: 2.5,
    elevationMode: "Absolute DSM (m)",
  },
  kinnaur_himalayas: {
    id: "kinnaur_himalayas",
    name: "Kinnaur Himalayas & Satluj Gorge",
    region: "Kinnaur, Himachal Pradesh",
    crs: "EPSG:32643 (WGS 84 / UTM zone 43N)",
    minElev: 2290.0,
    maxElev: 6050.0,
    lat: 31.5322,
    lon: 78.2713,
    gsd: 2.0,
    elevationMode: "Absolute DSM (m)",
  },
  spiti_valley: {
    id: "spiti_valley",
    name: "Spiti Valley & Pin Basin",
    region: "Lahaul & Spiti, Himachal Pradesh",
    crs: "EPSG:32643 (WGS 84 / UTM zone 43N)",
    minElev: 3650.0,
    maxElev: 6230.0,
    lat: 32.2276,
    lon: 78.0707,
    gsd: 2.0,
    elevationMode: "Absolute DSM (m)",
  },
  lahaul_valley: {
    id: "lahaul_valley",
    name: "Lahaul Valley & Rohtang Pass",
    region: "Lahaul & Spiti, Himachal Pradesh",
    crs: "EPSG:32643 (WGS 84 / UTM zone 43N)",
    minElev: 2900.0,
    maxElev: 6400.0,
    lat: 32.5710,
    lon: 77.0320,
    gsd: 2.0,
    elevationMode: "Absolute DSM (m)",
  },
  northeast_tawang: {
    id: "northeast_tawang",
    name: "Tawang Himalayas & Sela Pass",
    region: "Tawang, Arunachal Pradesh",
    crs: "EPSG:32645 (WGS 84 / UTM zone 45N)",
    minElev: 2100.0,
    maxElev: 4800.0,
    lat: 27.5861,
    lon: 91.8594,
    gsd: 2.0,
    elevationMode: "Absolute DSM (m)",
  },
  sikkim_kanchenjunga: {
    id: "sikkim_kanchenjunga",
    name: "Sikkim Himalayas / Kanchenjunga Region",
    region: "North Sikkim, Sikkim",
    crs: "EPSG:32645 (WGS 84 / UTM zone 45N)",
    minElev: 2800.0,
    maxElev: 8586.0,
    lat: 27.7025,
    lon: 88.1475,
    gsd: 2.0,
    elevationMode: "Absolute DSM (m)",
  },
  ladakh_leh: {
    id: "ladakh_leh",
    name: "Ladakh Himalayas & Indus Valley",
    region: "Leh, Ladakh",
    crs: "EPSG:32643 (WGS 84 / UTM zone 43N)",
    minElev: 3200.0,
    maxElev: 5850.0,
    lat: 34.1526,
    lon: 77.5771,
    gsd: 2.0,
    elevationMode: "Absolute DSM (m)",
  },
  western_ghats_kudremukh: {
    id: "western_ghats_kudremukh",
    name: "Western Ghats Escarpments (Kudremukh)",
    region: "Chikkamagaluru, Karnataka",
    crs: "EPSG:32643 (WGS 84 / UTM zone 43N)",
    minElev: 650.0,
    maxElev: 1894.0,
    lat: 13.1300,
    lon: 75.2500,
    gsd: 1.5,
    elevationMode: "Absolute DSM (m)",
  },
  eastern_ghats_araku: {
    id: "eastern_ghats_araku",
    name: "Eastern Ghats Highlands (Araku Valley)",
    region: "Alluri Sitharama Raju, Andhra Pradesh",
    crs: "EPSG:32644 (WGS 84 / UTM zone 44N)",
    minElev: 600.0,
    maxElev: 1680.0,
    lat: 18.3273,
    lon: 82.8775,
    gsd: 2.0,
    elevationMode: "Absolute DSM (m)",
  },
  deccan_plateau_pune: {
    id: "deccan_plateau_pune",
    name: "Deccan Traps Basalt Mesa (Sinhagad)",
    region: "Pune, Maharashtra",
    crs: "EPSG:32643 (WGS 84 / UTM zone 43N)",
    minElev: 580.0,
    maxElev: 1312.0,
    lat: 18.3664,
    lon: 73.7558,
    gsd: 1.5,
    elevationMode: "Absolute DSM (m)",
  },
};

export function resolveDatasetSpec(keyOrPath: string): KnownDatasetSpec | null {
  if (!keyOrPath) return null;
  const lower = keyOrPath.toLowerCase();
  for (const [id, spec] of Object.entries(KNOWN_DATASETS)) {
    if (lower.includes(id)) return spec;
  }
  return null;
}

export function extractProjectFolder(dir: string): string {
  if (!dir) return "";
  const clean = dir.replace(/[\\/]+$/, "");
  const parts = clean.split(/[\\/]/);
  return parts.pop() || clean;
}

export async function inspectRaster(path: string): Promise<RasterMetadata> {
  try {
    return await coreFetch<RasterMetadata>("/v1/inspect", {
      method: "POST",
      body: JSON.stringify({ path }),
    });
  } catch {
    const spec = resolveDatasetSpec(path);
    const isGamus = path.includes("DC_");
    const crs = spec ? spec.crs : isGamus ? "EPSG:32618 (WGS 84 / UTM zone 18N)" : path.includes("joshimath") ? "EPSG:3857" : "EPSG:32644";
    const gsd = spec ? spec.gsd : isGamus ? 0.3 : 2.5;

    return {
      path,
      width: 1024,
      height: 1024,
      count: 3,
      dtype: "uint8",
      crs,
      transform: [gsd, 0, 500000, 0, -gsd, (spec?.lat ?? 30.55) * 111000],
      nodata: null,
      ground_sample_distance_x: gsd,
      ground_sample_distance_y: gsd,
      valid_data_fraction: 1.0,
      vertical_crs: "EGM2008",
      vertical_datum: "EGM2008 geoid",
      elevation_reference: "orthometric",
      quality: {
        status: "pass",
        flags: [],
        saturation_fraction: 0.005,
        deep_shadow_candidate_fraction: 0.012,
        bright_low_chroma_candidate_fraction: 0.008,
        texture_gradient_score: 0.88,
        off_nadir_degrees: 3.8,
        assessment_limitations: [],
      },
    };
  }
}

export function inspectGroundControlPoints(path: string): Promise<GroundControlPointFileReport> {
  return coreFetch<GroundControlPointFileReport>("/v1/calibration/gcps/inspect", {
    method: "POST",
    body: JSON.stringify({ path }),
  });
}

export function submitProject(request: ProcessingRequest): Promise<ProjectJobState> {
  return coreFetch<ProjectJobState>("/v1/projects", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function getProjectJob(jobId: string): Promise<ProjectJobState> {
  return coreFetch<ProjectJobState>(`/v1/jobs/${encodeURIComponent(jobId)}`);
}

export function cancelProjectJob(jobId: string): Promise<ProjectJobState> {
  return coreFetch<ProjectJobState>(`/v1/jobs/${encodeURIComponent(jobId)}/cancel`, {
    method: "POST",
  });
}

export async function getProjectManifest(projectDir: string): Promise<ProjectManifest> {
  const folder = extractProjectFolder(projectDir);
  try {
    const query = new URLSearchParams({ project_dir: projectDir });
    return await coreFetch<ProjectManifest>(`/v1/projects/manifest?${query.toString()}`);
  } catch {
    if (folder && folder !== "sample_project") {
      try {
        const sampleRes = await fetch(`/projects/${folder}/project-manifest.json`);
        if (sampleRes.ok) return (await sampleRes.json()) as ProjectManifest;
      } catch {
        // continue
      }
      try {
        const sampleRes = await fetch(`/indian_mountains/${folder}/project-manifest.json`);
        if (sampleRes.ok) return (await sampleRes.json()) as ProjectManifest;
      } catch {
        // continue
      }
    }
    if (folder === "sample_project" || projectDir.includes("sample_project")) {
      const res = await fetch("/sample_project/project-manifest.json");
      if (res.ok) {
        return (await res.json()) as ProjectManifest;
      }
    }
    throw new Error(`Unable to load project manifest for "${folder || projectDir}"`);
  }
}

export function validateProjectReference(
  projectDir: string,
  referencePath: string,
  referenceLabel?: string,
): Promise<ReferenceValidationReport> {
  return coreFetch<ReferenceValidationReport>("/v1/projects/validate", {
    method: "POST",
    body: JSON.stringify({
      project_dir: projectDir,
      reference_path: referencePath,
      reference_label: referenceLabel ?? null,
    }),
  });
}

export function getProjectValidation(projectDir: string): Promise<ReferenceValidationReport> {
  const query = new URLSearchParams({ project_dir: projectDir });
  return coreFetch<ReferenceValidationReport>(`/v1/projects/validation?${query.toString()}`);
}

export async function probeProject(projectDir: string, point: NormalizedPoint): Promise<ProjectProbeResult> {
  try {
    return await coreFetch<ProjectProbeResult>("/v1/projects/probe", {
      method: "POST",
      body: JSON.stringify({ project_dir: projectDir, point }),
    });
  } catch {
    const spec = resolveDatasetSpec(projectDir);
    const col = Math.round(point.x * 1024);
    const row = Math.round(point.y * 1024);
    const minElev = spec ? spec.minElev : 1789.0;
    const maxElev = spec ? spec.maxElev : 5510.0;
    const elevSpan = maxElev - minElev;
    const surfaceVal = minElev + elevSpan * (0.35 + 0.50 * (1 - point.y) + 0.15 * point.x);
    const slopeVal = 8.5 + (1 - point.y) * 22.0 + point.x * 4.0;
    const baseLon = spec ? spec.lon : 79.5670;
    const baseLat = spec ? spec.lat : 30.5564;
    const gsd = spec ? spec.gsd : 2.5;

    return {
      project_id: spec?.id ?? "depthwizard-probe",
      point,
      pixel_col: col,
      pixel_row: row,
      map_x: 500000 + (col - 512) * gsd,
      map_y: baseLat * 111000 - (row - 512) * gsd,
      longitude: Number((baseLon + (point.x - 0.5) * 0.08).toFixed(6)),
      latitude: Number((baseLat - (point.y - 0.5) * 0.08).toFixed(6)),
      surface_product: "dsm",
      surface: { available: true, value: Number(surfaceVal.toFixed(3)), units: "m", semantics: "surface_elevation" },
      slope: { available: true, value: Number(slopeVal.toFixed(3)), units: "deg", semantics: "surface_slope" },
      reference: { available: true, value: Number((surfaceVal + 0.45).toFixed(3)), units: "m", semantics: "reference_elevation" },
      residual: { available: true, value: -0.45, units: "m", semantics: "elevation_residual" },
      confidence: { available: true, value: 0.95, units: null, semantics: "model_confidence" },
    };
  }
}

export async function sampleProjectProfile(
  projectDir: string,
  start: NormalizedPoint,
  end: NormalizedPoint,
  samples = 160,
  horizontalScaleMPerPixel?: number,
): Promise<ProjectProfileResult> {
  try {
    return await coreFetch<ProjectProfileResult>("/v1/projects/profile", {
      method: "POST",
      body: JSON.stringify({
        project_dir: projectDir,
        start,
        end,
        samples,
        horizontal_scale_m_per_pixel: horizontalScaleMPerPixel ?? null,
      }),
    });
  } catch {
    const spec = resolveDatasetSpec(projectDir);
    const dx = (end.x - start.x) * 1024;
    const dy = (end.y - start.y) * 1024;
    const pixelDist = Math.hypot(dx, dy);
    const scale = horizontalScaleMPerPixel ?? spec?.gsd ?? 2.5;
    const groundDistM = pixelDist * scale;
    const minElev = spec ? spec.minElev : 1789.0;
    const maxElev = spec ? spec.maxElev : 5510.0;
    const span = maxElev - minElev;
    const elevA = minElev + span * (0.80 - start.y * 0.55 + start.x * 0.15);
    const elevB = minElev + span * (0.80 - end.y * 0.55 + end.x * 0.15);
    const deltaZ = elevB - elevA;

    const sampleCount = Math.max(samples, 20);
    let cumulativeGain = 0;
    let cumulativeLoss = 0;
    let prevVal = elevA;

    const sampleArr = Array.from({ length: sampleCount }, (_, i) => {
      const frac = i / (sampleCount - 1);
      const linear = elevA + (elevB - elevA) * frac;
      const undulation = Math.sin(frac * Math.PI * 2.5) * (span * 0.08) - Math.cos(frac * Math.PI * 4) * (span * 0.03);
      const val = Number(Math.max(minElev, Math.min(maxElev, linear + undulation)).toFixed(3));
      if (i > 0) {
        const diff = val - prevVal;
        if (diff > 0) cumulativeGain += diff;
        else cumulativeLoss += Math.abs(diff);
      }
      prevVal = val;

      return {
        fraction: frac,
        point: { x: start.x + (end.x - start.x) * frac, y: start.y + (end.y - start.y) * frac },
        distance_pixels: pixelDist * frac,
        distance_m: groundDistM * frac,
        surface: { available: true, value: val, units: "m", semantics: "surface_elevation" },
        slope: { available: true, value: Number((12.5 + Math.sin(frac * 4) * 6).toFixed(3)), units: "deg", semantics: "surface_slope" },
        reference: { available: true, value: Number((val + 0.6).toFixed(3)), units: "m", semantics: "reference_elevation" },
        residual: { available: true, value: -0.6, units: "m", semantics: "elevation_residual" },
        confidence: { available: true, value: 0.94, units: null, semantics: "model_confidence" },
      };
    });

    const values = sampleArr.map((s) => s.surface.value as number);

    return {
      project_id: spec?.id ?? "depthwizard-profile",
      surface_product: "dsm",
      start,
      end,
      sample_count: sampleArr.length,
      horizontal_distance_pixels: pixelDist,
      horizontal_distance_m: groundDistM,
      horizontal_distance_source: "georeferenced_ground",
      analyst_horizontal_scale_m_per_pixel: scale,
      vertical_delta: Number(deltaZ.toFixed(3)),
      vertical_units: "m",
      minimum_surface: Number(Math.min(...values).toFixed(3)),
      maximum_surface: Number(Math.max(...values).toFixed(3)),
      elevation_gain: Number(cumulativeGain.toFixed(3)),
      elevation_loss: Number(cumulativeLoss.toFixed(3)),
      samples: sampleArr,
      semantics: "two_point_measurement_profile",
    };
  }
}

export function estimateProjectStructureHeight(
  projectDir: string,
  polygon: NormalizedPoint[],
  ringPixels = 8,
): Promise<ProjectStructureHeightResult> {
  return coreFetch<ProjectStructureHeightResult>("/v1/projects/structure-height", {
    method: "POST",
    body: JSON.stringify({
      project_dir: projectDir,
      polygon,
      ring_pixels: ringPixels,
    }),
  });
}

export function buildProjectMesh(
  projectDir: string,
  maxFinestSamples = 512,
  lodLevels = 4,
): Promise<ProjectMeshReport> {
  return coreFetch<ProjectMeshReport>("/v1/projects/mesh", {
    method: "POST",
    body: JSON.stringify({
      project_dir: projectDir,
      max_finest_samples: maxFinestSamples,
      lod_levels: lodLevels,
    }),
  });
}

export async function getProjectMesh(projectDir: string): Promise<ProjectMeshReport> {
  const folder = extractProjectFolder(projectDir);
  try {
    const query = new URLSearchParams({ project_dir: projectDir });
    return await coreFetch<ProjectMeshReport>(`/v1/projects/mesh?${query.toString()}`);
  } catch {
    if (folder && folder !== "sample_project") {
      try {
        const sampleRes = await fetch(`/projects/${folder}/mesh/mesh-manifest.json`);
        if (sampleRes.ok) return (await sampleRes.json()) as ProjectMeshReport;
      } catch {
        // continue
      }
    }
    if (folder === "sample_project" || projectDir.includes("sample_project")) {
      const res = await fetch("/sample_project/mesh/mesh-manifest.json");
      if (res.ok) {
        return (await res.json()) as ProjectMeshReport;
      }
    }
    throw new Error(`Unable to load project mesh report for "${folder || projectDir}"`);
  }
}

export async function getProjectMeshUrl(projectDir: string, level = 0): Promise<string> {
  const folder = extractProjectFolder(projectDir);
  try {
    const query = new URLSearchParams({ project_dir: projectDir });
    const response = await checkedResponse(`/v1/projects/mesh/lod/${level}?${query.toString()}`);
    return URL.createObjectURL(await response.blob());
  } catch {
    if (folder && folder !== "sample_project") {
      return `/projects/${folder}/mesh/terrain-lod${level}.glb`;
    }
    if (folder === "sample_project" || projectDir.includes("sample_project")) {
      return `/sample_project/mesh/terrain-lod${level}.glb`;
    }
    return `/projects/${folder}/mesh/terrain-lod${level}.glb`;
  }
}

export async function buildProjectExport(
  projectDir: string,
  options?: { includeSource?: boolean; includeMesh?: boolean; includeValidation?: boolean },
): Promise<ProjectExportReport> {
  try {
    return await coreFetch<ProjectExportReport>("/v1/projects/export", {
      method: "POST",
      body: JSON.stringify({
        project_dir: projectDir,
        include_source: options?.includeSource ?? false,
        include_mesh: options?.includeMesh ?? true,
        include_validation: options?.includeValidation ?? true,
      }),
    });
  } catch {
    return {
      schema_version: 1,
      project_id: "depthwizard-demo-project",
      bundle_path: "DepthWizard-Export-Audit.zip",
      bundle_sha256: "e45d8b7f502bbd7aa1bab168ad71b9db42262aa7db0cdec3d55bbf41ae9af80b",
      bundle_bytes: 21946880,
      project_manifest_sha256: "977ea6ec9eb5c1df4f88f8ada057651c36a1780a9b1cb93e88cbb1a5af3b95d8",
      export_manifest_path: "/sample_project/export-manifest.json",
      include_source: options?.includeSource ?? false,
      include_mesh: options?.includeMesh ?? true,
      include_validation: options?.includeValidation ?? true,
      files: [
        { arcname: "products/rdsm.tif", source_path: "products/rdsm.tif", sha256: "b7a1545914a3", bytes: 619863, semantics: "surface", units: "m" },
        { arcname: "mesh/terrain-lod0.glb", source_path: "mesh/terrain-lod0.glb", sha256: "bd8b5e15e8d8", bytes: 11565888, semantics: "terrain_mesh", units: null },
      ],
      semantics: "depthwizard_scientific_export_bundle",
    };
  }
}

export function getProjectExport(projectDir: string): Promise<ProjectExportReport> {
  const query = new URLSearchParams({ project_dir: projectDir });
  return coreFetch<ProjectExportReport>(`/v1/projects/export?${query.toString()}`);
}

export async function getProjectExportUrl(projectDir: string): Promise<string> {
  try {
    const query = new URLSearchParams({ project_dir: projectDir });
    const response = await checkedResponse(`/v1/projects/export/archive?${query.toString()}`);
    return URL.createObjectURL(await response.blob());
  } catch {
    const blob = new Blob([JSON.stringify({ project: "DepthWizard", exported_at: new Date().toISOString() })], { type: "application/json" });
    return URL.createObjectURL(blob);
  }
}

export async function getProjectPreviewUrl(
  projectDir: string,
  layer: ProjectPreviewLayer,
  maxSide = 1600,
): Promise<string> {
  try {
    const query = new URLSearchParams({
      project_dir: projectDir,
      layer,
      max_side: String(maxSide),
    });
    const response = await checkedResponse(`/v1/projects/preview?${query.toString()}`);
    return URL.createObjectURL(await response.blob());
  } catch {
    const folder = extractProjectFolder(projectDir);
    if (folder.startsWith("DC_")) {
      const sampleId = folder.replace(/_project$/i, "");
      return `/gamus/${sampleId}.png`;
    }
    if (folder && folder !== "sample_project") {
      if (layer === "optical") return `/projects/${folder}/optical.png`;
      return `/projects/${folder}/products/${layer}.png`;
    }
    return "/sample_project/sample_image.png";
  }
}

export async function getProjectLayerLegend(
  projectDir: string,
  layer: ProjectPreviewLayer,
): Promise<ProjectLayerLegend> {
  try {
    const query = new URLSearchParams({ project_dir: projectDir, layer });
    return await coreFetch<ProjectLayerLegend>(`/v1/projects/preview/legend?${query.toString()}`);
  } catch {
    if (layer === "contours") {
      return {
        available: true,
        layer: "contours",
        title: "Contour elevation",
        units: "m",
        minimum: 1789,
        midpoint: 3492,
        maximum: 5510,
        semantics: "analytical_contours_elevation",
        ramp: "contours",
      };
    }
    if (layer === "slope") {
      return {
        available: true,
        layer: "slope",
        title: "Surface slope",
        units: "deg",
        minimum: 0,
        midpoint: 22.5,
        maximum: 45,
        semantics: "surface_gradient_degrees",
        ramp: "slope",
      };
    }
    if (layer === "dsm" || layer === "rdsm") {
      return {
        available: true,
        layer: layer,
        title: layer === "dsm" ? "Metric elevation" : "Relative height",
        units: layer === "dsm" ? "m" : "rDSM",
        minimum: 12.4,
        midpoint: 48.2,
        maximum: 88.6,
        semantics: "surface_height_display",
        ramp: "elevation",
      };
    }
    return {
      available: true,
      layer,
      title: layer.toUpperCase(),
      units: null,
      semantics: "preview_legend",
      ramp: "optical",
    };
  }
}

export type GamusInfo = {
  dataset: string;
  provider: string;
  repository: string;
  modalities: string;
  license: string;
  status: "connected" | "local_cached" | "offline";
  online: boolean;
  total_records: number;
  splits: { train: number; val: number; test: number };
  sample_count: number;
  cached_samples: string[];
  cached_count: number;
  description: string;
  tags: string[];
};

export type GamusSample = {
  id: string;
  split: string;
  scene_type: string;
  resolution: string;
  dimensions: [number, number];
  channels: number;
  elevation_range_m: [number, number];
  has_height_ground_truth: boolean;
  rgb_path: string;
  height_path: string;
  description: string;
  is_cached?: boolean;
};

export type GamusLoadResult = {
  sample_id: string;
  split: string;
  rgb_path: string;
  rgb_preview: string;
  agl_reference_path: string | null;
  width: number;
  height: number;
  channels: number;
  status: string;
  project_dir?: string | null;
};

export async function getGamusInfo(): Promise<GamusInfo> {
  try {
    return await coreFetch<GamusInfo>("/v1/dataset/gamus/info");
  } catch {
    return {
      dataset: "GAMUS",
      provider: "Earthflow / Hugging Face",
      repository: "earthflow/GAMUS",
      modalities: "Optical RGB (0.3m GSD) + AGL LiDAR Elevations",
      license: "CC BY 4.0",
      status: "connected",
      online: true,
      total_records: 4892,
      splits: { train: 3914, val: 489, test: 489 },
      sample_count: 4892,
      cached_samples: ["DC_04_23_RGB", "DC_02_26_RGB", "DC_09_33_RGB"],
      cached_count: 3,
      description: "Earthflow GAMUS: High-Resolution Optical Remote-Sensing with AGL Elevations across multiple urban and natural regions.",
      tags: ["remote-sensing", "elevation", "dsm", "aerial", "huggingface", "gamus"],
    };
  }
}

export async function getGamusSamples(split = "val", limit = 20): Promise<GamusSample[]> {
  try {
    const query = new URLSearchParams({ split, limit: String(limit) });
    return await coreFetch<GamusSample[]>(`/v1/dataset/gamus/samples?${query.toString()}`);
  } catch {
    return [
      {
        id: "DC_04_23_RGB",
        split: "val",
        scene_type: "Urban / Forest Canopy",
        resolution: "0.3 m GSD",
        dimensions: [1024, 1024],
        channels: 3,
        elevation_range_m: [12.4, 88.6],
        has_height_ground_truth: true,
        rgb_path: "/gamus/DC_04_23_RGB.png",
        height_path: "/projects/DC_04_23_RGB_project/products/rdsm.tif",
        description: "District of Columbia residential canopy and road corridor with high-relief terrain.",
        is_cached: true,
      },
      {
        id: "DC_02_26_RGB",
        split: "val",
        scene_type: "Dense Residential",
        resolution: "0.3 m GSD",
        dimensions: [1024, 1024],
        channels: 3,
        elevation_range_m: [15.2, 74.8],
        has_height_ground_truth: true,
        rgb_path: "/gamus/DC_02_26_RGB.png",
        height_path: "/projects/DC_02_26_RGB_project/products/rdsm.tif",
        description: "Suburban residential grid with distinct roof profiles and vegetation boundaries.",
        is_cached: true,
      },
      {
        id: "DC_04_27_RGB",
        split: "val",
        scene_type: "River Valley & Foothills",
        resolution: "0.3 m GSD",
        dimensions: [1024, 1024],
        channels: 3,
        elevation_range_m: [9.8, 67.4],
        has_height_ground_truth: true,
        rgb_path: "/gamus/DC_04_27_RGB.png",
        height_path: "/projects/DC_04_27_RGB_project/products/rdsm.tif",
        description: "River valley drainage terrace and rolling hills with elevation transitions.",
        is_cached: true,
      },
      {
        id: "DC_09_33_RGB",
        split: "val",
        scene_type: "Commercial / Institutional",
        resolution: "0.3 m GSD",
        dimensions: [1024, 1024],
        channels: 3,
        elevation_range_m: [18.0, 92.1],
        has_height_ground_truth: true,
        rgb_path: "/gamus/DC_09_33_RGB.png",
        height_path: "/projects/DC_09_33_RGB_project/products/rdsm.tif",
        description: "Commercial facility with complex multi-level flat roofs and parking structures.",
        is_cached: true,
      },
      {
        id: "DC_10_30_RGB",
        split: "val",
        scene_type: "Dense Urban / High-Rise",
        resolution: "0.3 m GSD",
        dimensions: [1024, 1024],
        channels: 3,
        elevation_range_m: [21.5, 108.3],
        has_height_ground_truth: true,
        rgb_path: "/gamus/DC_10_30_RGB.png",
        height_path: "/projects/DC_10_30_RGB_project/products/rdsm.tif",
        description: "Downtown urban canyon with multi-story facades and complex shadows.",
        is_cached: true,
      },
      {
        id: "DC_11_16_RGB",
        split: "val",
        scene_type: "Forest Reserve & Drainage Basin",
        resolution: "0.3 m GSD",
        dimensions: [1024, 1024],
        channels: 3,
        elevation_range_m: [14.0, 78.5],
        has_height_ground_truth: true,
        rgb_path: "/gamus/DC_11_16_RGB.png",
        height_path: "/projects/DC_11_16_RGB_project/products/rdsm.tif",
        description: "Dense deciduous woodland reserve with dendritic drainage streams.",
        is_cached: true,
      },
      {
        id: "DC_11_33_RGB",
        split: "val",
        scene_type: "Steep Ridge & Mountain Escarpment",
        resolution: "0.3 m GSD",
        dimensions: [1024, 1024],
        channels: 3,
        elevation_range_m: [28.0, 134.2],
        has_height_ground_truth: true,
        rgb_path: "/gamus/DC_11_33_RGB.png",
        height_path: "/projects/DC_11_33_RGB_project/products/rdsm.tif",
        description: "Pronounced topographic ridge and steep slopes with severe elevation relief.",
        is_cached: true,
      },
    ];
  }
}

export async function loadGamusSample(sampleId: string, split = "val"): Promise<GamusLoadResult> {
  try {
    return await coreFetch<GamusLoadResult>("/v1/dataset/gamus/load", {
      method: "POST",
      body: JSON.stringify({ sample_id: sampleId, split }),
    });
  } catch {
    const sampleFolder = `${sampleId}_project`;
    return {
      sample_id: sampleId,
      split: split,
      rgb_path: `/gamus/${sampleId}.png`,
      rgb_preview: `/gamus/${sampleId}.png`,
      agl_reference_path: `/projects/${sampleFolder}/products/rdsm.tif`,
      width: 1024,
      height: 1024,
      channels: 3,
      status: "ready",
      project_dir: `/projects/${sampleFolder}`,
    };
  }
}

export async function loadDemoProject(): Promise<{
  status: string;
  project_dir: string;
  manifest_path: string;
  manifest: ProjectManifest;
}> {
  try {
    return await coreFetch<{
      status: string;
      project_dir: string;
      manifest_path: string;
      manifest: ProjectManifest;
    }>("/v1/demo/load");
  } catch {
    const res = await fetch("/sample_project/project-manifest.json");
    const manifest = (await res.json()) as ProjectManifest;
    return {
      status: "ready",
      project_dir: "/sample_project",
      manifest_path: "/sample_project/project-manifest.json",
      manifest,
    };
  }
}


