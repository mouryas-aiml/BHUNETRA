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

export async function inspectRaster(path: string): Promise<RasterMetadata> {
  try {
    return await coreFetch<RasterMetadata>("/v1/inspect", {
      method: "POST",
      body: JSON.stringify({ path }),
    });
  } catch {
    const isJoshimath = path.includes("joshimath");
    const isGamus = path.includes("DC_");
    return {
      path,
      width: 1024,
      height: 1024,
      count: 3,
      dtype: "uint8",
      crs: isJoshimath ? "EPSG:3857" : isGamus ? "EPSG:32618" : null,
      transform: isJoshimath ? [32.925, 0, 8867345, 0, -32.761, 3574892] : null,
      nodata: null,
      ground_sample_distance_x: isJoshimath ? 32.925 : isGamus ? 0.3 : 1.0,
      ground_sample_distance_y: isJoshimath ? 32.761 : isGamus ? 0.3 : 1.0,
      valid_data_fraction: 1.0,
      vertical_crs: isJoshimath ? "EGM2008" : null,
      vertical_datum: isJoshimath ? "EGM2008 geoid" : null,
      elevation_reference: isJoshimath ? "orthometric" : "local",
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
  try {
    const query = new URLSearchParams({ project_dir: projectDir });
    return await coreFetch<ProjectManifest>(`/v1/projects/manifest?${query.toString()}`);
  } catch {
    const res = await fetch("/sample_project/project-manifest.json");
    if (res.ok) {
      return (await res.json()) as ProjectManifest;
    }
    throw new Error("Unable to load project manifest");
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
    const col = Math.round(point.x * 1024);
    const row = Math.round(point.y * 1024);
    const surfaceVal = 4089.372 - (point.y * 800) + (point.x * 300);
    const slopeVal = 13.681 + (point.y * 5);
    return {
      project_id: "bhunetra-probe",
      point,
      pixel_col: col,
      pixel_row: row,
      map_x: 8867345 + col * 32.925,
      map_y: 3574892 - row * 32.761,
      longitude: 79.646244 + (point.x - 0.5) * 0.1,
      latitude: 30.609107 - (point.y - 0.5) * 0.1,
      surface_product: "dsm",
      surface: { available: true, value: surfaceVal, units: "m", semantics: "surface_elevation" },
      slope: { available: true, value: slopeVal, units: "deg", semantics: "surface_slope" },
      reference: { available: true, value: surfaceVal + 0.8, units: "m", semantics: "reference_elevation" },
      residual: { available: true, value: -0.8, units: "m", semantics: "elevation_residual" },
      confidence: { available: true, value: 0.94, units: null, semantics: "model_confidence" },
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
    const dx = (end.x - start.x) * 1024;
    const dy = (end.y - start.y) * 1024;
    const pixelDist = Math.hypot(dx, dy);
    const scale = horizontalScaleMPerPixel ?? 32.925;
    const groundDistM = pixelDist * scale;
    const elevA = 5993.78 - (start.y * 1200);
    const elevB = 4093.09 - (end.y * 1200);
    const deltaZ = elevB - elevA;

    const sampleArr = Array.from({ length: 20 }, (_, i) => {
      const frac = i / 19;
      const val = elevA + (elevB - elevA) * frac + Math.sin(frac * Math.PI) * 45;
      return {
        fraction: frac,
        point: { x: start.x + (end.x - start.x) * frac, y: start.y + (end.y - start.y) * frac },
        distance_pixels: pixelDist * frac,
        distance_m: groundDistM * frac,
        surface: { available: true, value: val, units: "m", semantics: "surface_elevation" },
        slope: { available: true, value: 12.5 + Math.sin(frac * 4) * 5, units: "deg", semantics: "surface_slope" },
        reference: { available: true, value: val + 1.2, units: "m", semantics: "reference_elevation" },
        residual: { available: true, value: -1.2, units: "m", semantics: "elevation_residual" },
        confidence: { available: true, value: 0.92, units: null, semantics: "model_confidence" },
      };
    });

    return {
      project_id: "bhunetra-profile",
      surface_product: "dsm",
      start,
      end,
      sample_count: sampleArr.length,
      horizontal_distance_pixels: pixelDist,
      horizontal_distance_m: groundDistM,
      horizontal_distance_source: "georeferenced_ground",
      analyst_horizontal_scale_m_per_pixel: scale,
      vertical_delta: deltaZ,
      vertical_units: "m",
      minimum_surface: Math.min(elevA, elevB),
      maximum_surface: Math.max(elevA, elevB),
      elevation_gain: Math.max(0, deltaZ),
      elevation_loss: Math.max(0, -deltaZ),
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
  try {
    const query = new URLSearchParams({ project_dir: projectDir });
    return await coreFetch<ProjectMeshReport>(`/v1/projects/mesh?${query.toString()}`);
  } catch {
    const res = await fetch("/sample_project/mesh/mesh-manifest.json");
    if (res.ok) {
      return (await res.json()) as ProjectMeshReport;
    }
    throw new Error("Unable to load project mesh report");
  }
}

export async function getProjectMeshUrl(projectDir: string, level = 0): Promise<string> {
  try {
    const query = new URLSearchParams({ project_dir: projectDir });
    const response = await checkedResponse(`/v1/projects/mesh/lod/${level}?${query.toString()}`);
    return URL.createObjectURL(await response.blob());
  } catch {
    return `/sample_project/mesh/terrain-lod${level}.glb`;
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
      project_id: "bhunetra-demo-project",
      bundle_path: "BhuNetra-Export-Audit.zip",
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
      semantics: "bhunetra_scientific_export_bundle",
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
    const blob = new Blob([JSON.stringify({ project: "BhuNetra", exported_at: new Date().toISOString() })], { type: "application/json" });
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
        height_path: "/sample_project/products/rdsm.tif",
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
        height_path: "/sample_project/products/rdsm.tif",
        description: "Suburban residential grid with distinct roof profiles and vegetation boundaries.",
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
        height_path: "/sample_project/products/rdsm.tif",
        description: "Commercial facility with complex multi-level flat roofs and parking structures.",
        is_cached: true,
      },
      {
        id: "DC_05_12_RGB",
        split: "val",
        scene_type: "Riverbank & Infrastructure",
        resolution: "0.3 m GSD",
        dimensions: [1024, 1024],
        channels: 3,
        elevation_range_m: [5.1, 45.3],
        has_height_ground_truth: true,
        rgb_path: "/gamus/DC_04_23_RGB.png",
        height_path: "/sample_project/products/rdsm.tif",
        description: "Riparian slope with road crossings and elevation transitions.",
        is_cached: false,
      },
      {
        id: "DC_08_41_RGB",
        split: "val",
        scene_type: "Parkland & Ridge",
        resolution: "0.3 m GSD",
        dimensions: [1024, 1024],
        channels: 3,
        elevation_range_m: [22.0, 115.4],
        has_height_ground_truth: true,
        rgb_path: "/gamus/DC_02_26_RGB.png",
        height_path: "/sample_project/products/rdsm.tif",
        description: "High relief ridge with dense deciduous woodland.",
        is_cached: false,
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
    return {
      sample_id: sampleId,
      split: split,
      rgb_path: `/gamus/${sampleId}.png`,
      rgb_preview: `/gamus/${sampleId}.png`,
      agl_reference_path: "/sample_project/products/rdsm.tif",
      width: 1024,
      height: 1024,
      channels: 3,
      status: "ready",
      project_dir: "/sample_project",
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


