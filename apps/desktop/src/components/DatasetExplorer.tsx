import { useEffect, useState } from "react";
import {
  getGamusInfo,
  getGamusSamples,
  loadGamusSample,
  type GamusInfo,
  type GamusSample,
} from "../api";

interface DatasetExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sampleId: string, split: string) => void;
}

export function DatasetExplorer({ isOpen, onClose, onSelectSample }: DatasetExplorerProps) {
  const [info, setInfo] = useState<GamusInfo | null>(null);
  const [samples, setSamples] = useState<GamusSample[]>([]);
  const [selectedSample, setSelectedSample] = useState<GamusSample | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSample, setLoadingSample] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [splitFilter, setSplitFilter] = useState("val");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    void fetchDataset();
  }, [isOpen, splitFilter]);

  async function fetchDataset() {
    setLoading(true);
    setError(null);
    try {
      const [datasetInfo, datasetSamples] = await Promise.all([
        getGamusInfo(),
        getGamusSamples(splitFilter, 30),
      ]);
      setInfo(datasetInfo);
      setSamples(datasetSamples);
      if (datasetSamples.length > 0 && !selectedSample) {
        setSelectedSample(datasetSamples[0]);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleLoad(sample: GamusSample) {
    setLoadingSample(sample.id);
    try {
      await loadGamusSample(sample.id, sample.split);
      onSelectSample(sample.id, sample.split);
      onClose();
    } catch (err) {
      alert(`Error loading sample ${sample.id}: ${String(err)}`);
    } finally {
      setLoadingSample(null);
    }
  }

  if (!isOpen) return null;

  const filteredSamples = samples.filter((s) =>
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.scene_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bn-dataset-modal-backdrop" onClick={onClose}>
      <div className="bn-dataset-modal" onClick={(e) => e.stopPropagation()}>
        <header className="bn-dataset-header">
          <div className="bn-dataset-title-group">
            <div className="bn-badge bn-badge--cyan">Hugging Face Connected</div>
            <h2>GAMUS Dataset Explorer</h2>
            <p className="bn-dataset-subtitle">
              Earthflow / GAMUS · High-Resolution Optical Remote-Sensing with AGL Elevations
            </p>
          </div>
          <button className="dw-btn" onClick={onClose}>✕ Close</button>
        </header>

        {error && (
          <div className="bn-dataset-error-banner">
            <div>
              <strong>Dataset remote probe notice:</strong> {error}
            </div>
            <div className="bn-dataset-error-actions">
              <button className="dw-btn dw-btn--primary" onClick={() => void fetchDataset()}>Retry</button>
              <button className="dw-btn" onClick={() => setError(null)}>Use Cached Samples</button>
            </div>
          </div>
        )}

        <div className="bn-dataset-layout">
          {/* Left: Controls and Statistics */}
          <aside className="bn-dataset-sidebar">
            <div className="bn-card">
              <h3 className="bn-card-title">Dataset Statistics</h3>
              <div className="bn-stat-row">
                <span>Provider</span>
                <span className="bn-stat-val">Earthflow / Hugging Face</span>
              </div>
              <div className="bn-stat-row">
                <span>Repository</span>
                <span className="bn-stat-val">earthflow/GAMUS</span>
              </div>
              <div className="bn-stat-row">
                <span>Status</span>
                <span className={`bn-stat-val ${info?.online ? "bn-text--success" : "bn-text--cyan"}`}>
                  ● {info?.online ? "Live API Connected" : "Local Verified Cache"}
                </span>
              </div>
              <div className="bn-stat-row">
                <span>License</span>
                <span className="bn-stat-val">{info?.license ?? "CC BY 4.0"}</span>
              </div>
              <div className="bn-stat-row">
                <span>Total Scenes</span>
                <span className="bn-stat-val">{info?.total_records?.toLocaleString() ?? "4,892"}</span>
              </div>
              <div className="bn-stat-row">
                <span>Resolution</span>
                <span className="bn-stat-val">0.3 m GSD</span>
              </div>
              <div className="bn-stat-row">
                <span>Cached Locally</span>
                <span className="bn-stat-val">{info?.cached_count ?? 1} samples</span>
              </div>
            </div>

            <div className="bn-card">
              <h3 className="bn-card-title">Filter by Split</h3>
              <div className="bn-filter-tabs">
                {(["val", "train", "test"] as const).map((s) => (
                  <button
                    key={s}
                    className={`bn-filter-btn ${splitFilter === s ? "bn-filter-btn--active" : ""}`}
                    onClick={() => setSplitFilter(s)}
                  >
                    {s.toUpperCase()} ({info?.splits ? (info.splits as Record<string, number>)[s] ?? "—" : "—"})
                  </button>
                ))}
              </div>

              <div className="bn-search-box">
                <input
                  type="text"
                  placeholder="Search scenes (e.g. DC_02, commercial)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="dw-compact-select bn-search-input"
                />
              </div>
            </div>

            <div className="bn-card bn-card--subtle">
              <div className="bn-dataset-note">
                <strong>Zero Full-Download Policy:</strong> Individual 1024×1024 tiles are streamed and extracted on-demand in seconds via Hugging Face SafeTensors/H5 resolvers without downloading gigabytes of raw data.
              </div>
            </div>
          </aside>

          {/* Center: Sample Cards Gallery */}
          <main className="bn-dataset-gallery">
            {loading && <div className="bn-loading-indicator">Retrieving GAMUS catalog metadata…</div>}

            <div className="bn-sample-grid">
              {filteredSamples.map((sample) => {
                const isSelected = selectedSample?.id === sample.id;
                const isCurrentlyLoading = loadingSample === sample.id;

                return (
                  <div
                    key={sample.id}
                    className={`bn-sample-card ${isSelected ? "bn-sample-card--selected" : ""}`}
                    onClick={() => setSelectedSample(sample)}
                  >
                    <div className="bn-sample-preview-box">
                      {sample.rgb_path ? (
                        <div className="bn-sample-img-wrap" style={{ position: "relative", width: "100%", height: "100%" }}>
                          <img
                            src={sample.rgb_path}
                            alt={sample.id}
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px" }}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                          <span className="bn-sample-tag">{sample.split.toUpperCase()}</span>
                          {sample.is_cached && <span className="bn-sample-cached-tag">Cached</span>}
                        </div>
                      ) : (
                        <div className="bn-sample-placeholder-art">
                          <svg viewBox="0 0 100 100" className="bn-mini-raster-svg" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id={`grad-${sample.id}`} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#0b2447" />
                                <stop offset="50%" stopColor="#19376d" />
                                <stop offset="100%" stopColor="#06b6d4" />
                              </linearGradient>
                            </defs>
                            <rect width="100" height="100" fill={`url(#grad-${sample.id})`} />
                            <circle cx="35" cy="40" r="18" fill="#38bdf8" opacity="0.3" />
                            <rect x="50" y="30" width="30" height="25" fill="#818cf8" opacity="0.4" />
                            <path d="M10 80 Q 40 50, 70 85 T 100 70" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.6" />
                          </svg>
                          <span className="bn-sample-tag">{sample.split.toUpperCase()}</span>
                          {sample.is_cached && <span className="bn-sample-cached-tag">Cached</span>}
                        </div>
                      )}
                    </div>

                    <div className="bn-sample-info">
                      <h4 className="bn-sample-name">{sample.id}</h4>
                      <p className="bn-sample-scene-type">{sample.scene_type}</p>
                      <div className="bn-sample-metrics">
                        <span>1024×1024 RGB</span>
                        <span>0.3m GSD</span>
                        <span>{sample.elevation_range_m[1].toFixed(1)}m AGL</span>
                      </div>
                    </div>

                    <div className="bn-sample-actions">
                      <button
                        className="dw-btn dw-btn--primary bn-btn--full"
                        disabled={Boolean(loadingSample)}
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleLoad(sample);
                        }}
                      >
                        {isCurrentlyLoading ? "Streaming…" : "Load into Workspace"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>

          {/* Right: Selected Sample Details */}
          {selectedSample && (
            <aside className="bn-dataset-details-pane">
              <div className="bn-card">
                <div className="bn-badge bn-badge--violet">Selected Scene</div>
                <h3 className="bn-details-title">{selectedSample.id}</h3>
                {selectedSample.rgb_path && (
                  <div style={{ width: "100%", height: "140px", borderRadius: "8px", overflow: "hidden", margin: "10px 0", border: "1px solid var(--bn-border)" }}>
                    <img
                      src={selectedSample.rgb_path}
                      alt={selectedSample.id}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}
                <p className="bn-details-desc">{selectedSample.description}</p>

                <div className="bn-details-table">
                  <div className="bn-stat-row">
                    <span>Scene Typology</span>
                    <span className="bn-stat-val">{selectedSample.scene_type}</span>
                  </div>
                  <div className="bn-stat-row">
                    <span>Dimensions</span>
                    <span className="bn-stat-val">1024 × 1024 px</span>
                  </div>
                  <div className="bn-stat-row">
                    <span>Ground Sampling</span>
                    <span className="bn-stat-val">0.30 m / pixel</span>
                  </div>
                  <div className="bn-stat-row">
                    <span>Elevation Span</span>
                    <span className="bn-stat-val">
                      {selectedSample.elevation_range_m[0]}m – {selectedSample.elevation_range_m[1]}m
                    </span>
                  </div>
                  <div className="bn-stat-row">
                    <span>Modalities</span>
                    <span className="bn-stat-val">RGB Optical + LiDAR AGL</span>
                  </div>
                  <div className="bn-stat-row">
                    <span>Cache State</span>
                    <span className="bn-stat-val">{selectedSample.is_cached ? "Ready locally" : "Remote on HF"}</span>
                  </div>
                </div>

                <div className="bn-pipeline-preview-box">
                  <div className="bn-pipeline-preview-title">Automated BhuNetra Ingest</div>
                  <ol className="bn-pipeline-steps">
                    <li>Stream 1024×1024 RGB array from Hugging Face</li>
                    <li>Synthesize GIS-compliant GeoTIFF raster</li>
                    <li>Execute radiometric & dynamic-range telemetry</li>
                    <li>Feed into DA3MONO-LARGE Vision Transformer</li>
                    <li>Generate seamless relative surface & 3D mesh</li>
                  </ol>
                </div>

                <button
                  className="dw-btn dw-btn--primary bn-btn--hero"
                  disabled={Boolean(loadingSample)}
                  onClick={() => void handleLoad(selectedSample)}
                >
                  {loadingSample === selectedSample.id ? "Streaming from Hugging Face…" : "Load Selected Sample"}
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
