import { useState } from "react";
import { DatasetIcon, UploadIcon } from "./icons";
import type { GamusInfo, GamusSample } from "../api";

export interface DatasetSourceItem {
  id: string;
  name: string;
  provider: string;
  role: "OPTICAL INPUT DATASET" | "REFERENCE DEM" | "REFERENCE DSM" | "VALIDATION DATASET" | "BENCHMARK DATASET";
  category: "optical" | "dem" | "mountain" | "benchmark";
  coverage: string;
  resolution: string;
  format: string;
  status: "Available" | "Live Stream" | "Direct Access" | "Cache Ready";
  description: string;
  sampleId?: string;
  thumbnailUrl?: string;
  elevationRange?: string;
}

export const DATASET_CATALOG: DatasetSourceItem[] = [
  {
    id: "gamus-dc04",
    name: "GAMUS · DC_04_23 (High Canopy & Valley)",
    provider: "Earthflow / Hugging Face",
    role: "OPTICAL INPUT DATASET",
    category: "optical",
    coverage: "District of Columbia, USA",
    resolution: "0.30 m GSD",
    format: "1024×1024 RGB GeoTIFF + AGL LiDAR",
    status: "Live Stream",
    description: "High-resolution aerial optical remote-sensing tile with dense canopy cover and pronounced relief. Paired with USGS airborne LiDAR heights.",
    sampleId: "DC_04_23_RGB",
    thumbnailUrl: "/gamus/DC_04_23_RGB.png",
    elevationRange: "12.4 m – 88.6 m AGL",
  },
  {
    id: "gamus-dc02",
    name: "GAMUS · DC_02_26 (Suburban Residential Grid)",
    provider: "Earthflow / Hugging Face",
    role: "OPTICAL INPUT DATASET",
    category: "optical",
    coverage: "District of Columbia, USA",
    resolution: "0.30 m GSD",
    format: "1024×1024 RGB GeoTIFF + AGL LiDAR",
    status: "Live Stream",
    description: "Urban/suburban residential tile with discrete roof profiles, ground clearances, and tree canopies. Ideal for building height extraction.",
    sampleId: "DC_02_26_RGB",
    thumbnailUrl: "/gamus/DC_02_26_RGB.png",
    elevationRange: "15.2 m – 74.8 m AGL",
  },
  {
    id: "gamus-dc09",
    name: "GAMUS · DC_09_33 (Commercial & Complex Infrastructure)",
    provider: "Earthflow / Hugging Face",
    role: "OPTICAL INPUT DATASET",
    category: "optical",
    coverage: "District of Columbia, USA",
    resolution: "0.30 m GSD",
    format: "1024×1024 RGB GeoTIFF + AGL LiDAR",
    status: "Live Stream",
    description: "Multi-level institutional and commercial buildings with extensive flat roofs, parking structures, and complex shadows.",
    sampleId: "DC_09_33_RGB",
    thumbnailUrl: "/gamus/DC_09_33_RGB.png",
    elevationRange: "18.0 m – 92.1 m AGL",
  },
  {
    id: "copernicus-glo30",
    name: "Copernicus DEM GLO-30",
    provider: "European Space Agency (ESA) / Airbus",
    role: "REFERENCE DSM",
    category: "mountain",
    coverage: "Global (landmasses 84°N to 60°S)",
    resolution: "30 m (1 arc-second)",
    format: "Cloud-Optimized GeoTIFF (COG)",
    status: "Direct Access",
    description: "High-accuracy digital surface model derived from WorldDEM TanDEM-X interferometric SAR. Primary reference for regional scale calibration.",
    elevationRange: "-400 m to 8,848 m",
  },
  {
    id: "copernicus-glo90",
    name: "Copernicus DEM GLO-90",
    provider: "European Space Agency (ESA)",
    role: "REFERENCE DEM",
    category: "dem",
    coverage: "Global",
    resolution: "90 m (3 arc-seconds)",
    format: "Cloud-Optimized GeoTIFF",
    status: "Available",
    description: "Global elevation coverage suitable for wide-area macro-topographic trend extraction and low-frequency terrain normalisation.",
    elevationRange: "Global terrain span",
  },
  {
    id: "nasadem-srtm",
    name: "NASADEM / SRTM v3 Global 30m",
    provider: "NASA JPL / USGS",
    role: "REFERENCE DEM",
    category: "dem",
    coverage: "Global (60°N to 56°S)",
    resolution: "30 m (1 arc-second)",
    format: "HGT / Cloud-Optimized GeoTIFF",
    status: "Direct Access",
    description: "Reprocessed Shuttle Radar Topography Mission data with improved void reduction, ICESat calibration, and modernized geoid heights.",
    elevationRange: "Global land surface",
  },
  {
    id: "alos-aw3d30",
    name: "ALOS World 3D (AW3D30)",
    provider: "JAXA (Japan Aerospace Exploration Agency)",
    role: "REFERENCE DSM",
    category: "mountain",
    coverage: "Global",
    resolution: "30 m (stereo PRISM)",
    format: "GeoTIFF",
    status: "Available",
    description: "Global optical stereo DSM compiled from millions of PRISM optical stereo pairs onboard the ALOS satellite.",
    elevationRange: "Global land surface",
  },
  {
    id: "usgs-3dep",
    name: "USGS 3DEP (3D Elevation Program LiDAR)",
    provider: "United States Geological Survey",
    role: "VALIDATION DATASET",
    category: "dem",
    coverage: "Conterminous US & Alaska",
    resolution: "1 m – 3 m High-Res DEM",
    format: "Cloud-Optimized GeoTIFF / LAS",
    status: "Direct Access",
    description: "Survey-grade airborne LiDAR digital elevation models used for centimeter-level independent validation benchmarks.",
    elevationRange: "Local relief up to 4,400 m",
  },
  {
    id: "isprs-vaihingen",
    name: "ISPRS 2D/3D Semantic & DSM · Vaihingen",
    provider: "ISPRS Working Group III/4",
    role: "BENCHMARK DATASET",
    category: "benchmark",
    coverage: "Vaihingen, Germany",
    resolution: "0.09 m GSD (Aerial True-Ortho)",
    format: "TIFF + Normalized DSM (nDSM)",
    status: "Cache Ready",
    description: "Historic gold-standard scientific benchmark for single-view building extraction and dense true-surface DSM validation.",
    elevationRange: "250 m – 350 m a.s.l.",
  },
  {
    id: "isprs-potsdam",
    name: "ISPRS 2D/3D Urban Benchmark · Potsdam",
    provider: "ISPRS Commission III",
    role: "BENCHMARK DATASET",
    category: "benchmark",
    coverage: "Potsdam, Germany",
    resolution: "0.05 m GSD (Ultra-high res)",
    format: "TIFF + Matched LiDAR DSM",
    status: "Cache Ready",
    description: "Dense urban environment with varied architectural topologies. Provides strict independent error gate for depth refiner models.",
    elevationRange: "20 m – 80 m a.s.l.",
  },
  {
    id: "joshimath-himalaya",
    name: "Mountain & Terrain · Joshimath Himalayan S2",
    provider: "EOX Sentinel-2 Cloudless / Mapzen Terrarium",
    role: "BENCHMARK DATASET",
    category: "mountain",
    coverage: "Joshimath, Uttarakhand, India (30.55°N, 79.56°E)",
    resolution: "10 m – 32.9 m GSD",
    format: "Multispectral GeoTIFF + Metric Terrain Mesh",
    status: "Cache Ready",
    description: "High-altitude disaster-relevant terrain with severe relief (1,789m to 5,510m). Tested extensively for ground subsidence and landslide analysis.",
    sampleId: "joshimath_s2cloudless_2024",
    thumbnailUrl: "/gamus/DC_04_23_RGB.png",
    elevationRange: "1,789 m – 5,510 m a.s.l.",
  },
];

interface DatasetCatalogViewProps {
  onSelectSample: (sampleId: string) => void;
  onExploreGamus: () => void;
  onImportReference: () => void;
}

export function DatasetCatalogView({
  onSelectSample,
  onExploreGamus,
  onImportReference,
}: DatasetCatalogViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const filtered = DATASET_CATALOG.filter((item) => {
    const matchesCat = activeCategory === "all" || item.category === activeCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.provider.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.role.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="bn-page-container">
      {/* Header */}
      <div className="bn-hero-banner">
        <div className="bn-hero-badge-row">
          <span className="bn-badge bn-badge--cyan">GEOSPATIAL CATALOG</span>
          <span className="bn-badge bn-badge--violet">10 MULTI-MODAL DATASETS</span>
          <span className="bn-badge bn-badge--green">STREAMING & CACHED</span>
        </div>
        <h1 className="bn-page-headline">BhuNetra Multi-Sensor Dataset Catalog</h1>
        <p className="bn-page-lead">
          Curated Earth observation datasets spanning high-resolution optical imagery, spaceborne interferometric radar DSMs, airborne LiDAR references, and complex mountain terrains.
        </p>

        <div className="bn-action-ribbon">
          <button className="dw-btn dw-btn--primary" onClick={onExploreGamus}>
            <DatasetIcon /> Open GAMUS Explorer Modal
          </button>
          <button className="dw-btn" onClick={onImportReference}>
            <UploadIcon /> Upload Custom Reference GeoTIFF
          </button>
        </div>
      </div>

      {/* Category Tabs & Search */}
      <div className="bn-catalog-controls">
        <div className="bn-filter-tabs">
          {[
            { id: "all", label: "All Datasets (11)" },
            { id: "optical", label: "Optical Input (3)" },
            { id: "mountain", label: "Mountain & Terrain (3)" },
            { id: "dem", label: "Reference DEMs (3)" },
            { id: "benchmark", label: "Benchmarks (3)" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`bn-filter-btn ${activeCategory === tab.id ? "bn-filter-btn--active" : ""}`}
              onClick={() => setActiveCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          className="dw-compact-select bn-catalog-search"
          placeholder="Search by dataset name, provider, or sensor…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Dataset Grid */}
      <div className="bn-catalog-grid">
        {filtered.map((item) => (
          <div key={item.id} className="bn-card bn-catalog-card">
            {item.thumbnailUrl && (
              <div className="bn-catalog-thumbnail">
                <img src={item.thumbnailUrl} alt={item.name} />
                <span className="bn-catalog-role-tag">{item.role}</span>
              </div>
            )}
            <div className="bn-catalog-body">
              {!item.thumbnailUrl && <span className="bn-catalog-role-tag">{item.role}</span>}
              <h3 className="bn-catalog-name">{item.name}</h3>
              <p className="bn-catalog-desc">{item.description}</p>

              <div className="bn-catalog-specs">
                <div className="bn-stat-row">
                  <span>Provider</span>
                  <span className="bn-stat-val">{item.provider}</span>
                </div>
                <div className="bn-stat-row">
                  <span>Coverage</span>
                  <span className="bn-stat-val">{item.coverage}</span>
                </div>
                <div className="bn-stat-row">
                  <span>Resolution</span>
                  <span className="bn-stat-val">{item.resolution}</span>
                </div>
                <div className="bn-stat-row">
                  <span>Format</span>
                  <span className="bn-stat-val">{item.format}</span>
                </div>
                {item.elevationRange && (
                  <div className="bn-stat-row">
                    <span>Elevation Span</span>
                    <span className="bn-stat-val">{item.elevationRange}</span>
                  </div>
                )}
                <div className="bn-stat-row">
                  <span>Availability</span>
                  <span className="bn-stat-val bn-text--success">● {item.status}</span>
                </div>
              </div>

              {item.sampleId && (
                <button
                  className="dw-btn dw-btn--primary bn-btn--full"
                  style={{ marginTop: "14px" }}
                  onClick={() => onSelectSample(item.sampleId!)}
                >
                  ⚡ Load into Workspace & Reconstruct
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
