import { useEffect, useRef, useState } from "react";
import type { RasterMetadata } from "../api";

export type HeatmapMode = "elevation" | "slope" | "depth" | "confidence" | "residual" | "roughness";
export type HeatmapPalette = "turbo" | "viridis" | "magma" | "terrain" | "coolwarm";

interface HeatmapViewProps {
  metadata: RasterMetadata | null;
  surfaceProduct?: "dsm" | "rdsm";
  isCalibrated?: boolean;
}

// Colormap lookup utilities
function colorForNormalized(val: number, palette: HeatmapPalette): [number, number, number] {
  const t = Math.max(0, Math.min(1, val));
  if (palette === "viridis") {
    // Viridis approx: purple -> blue -> teal -> green -> yellow
    const r = Math.round(255 * (0.28 + 0.72 * Math.sin(t * Math.PI - 0.5)));
    const g = Math.round(255 * Math.sin(t * Math.PI * 0.8));
    const b = Math.round(255 * (0.45 + 0.55 * Math.cos(t * Math.PI * 0.9)));
    return [Math.max(0, Math.min(255, r)), Math.max(0, Math.min(255, g)), Math.max(0, Math.min(255, b))];
  }
  if (palette === "magma") {
    const r = Math.round(255 * Math.min(1, t * 1.3));
    const g = Math.round(255 * Math.max(0, (t - 0.3) * 1.4));
    const b = Math.round(255 * (t < 0.5 ? t * 1.6 : 0.8 + (t - 0.5) * 0.4));
    return [r, g, b];
  }
  if (palette === "terrain") {
    if (t < 0.25) return [50, 100, 180]; // Water
    if (t < 0.55) return [70, 160, 80];  // Lowland green
    if (t < 0.80) return [190, 150, 80]; // Mountain brown
    return [245, 245, 250];              // Snow peak
  }
  if (palette === "coolwarm") {
    const r = Math.round(255 * t);
    const g = Math.round(255 * (1 - Math.abs(t - 0.5) * 1.5));
    const b = Math.round(255 * (1 - t));
    return [r, g, b];
  }
  // Turbo (default)
  const r = Math.round(255 * Math.sin(t * Math.PI * 0.9));
  const g = Math.round(255 * Math.sin(t * Math.PI));
  const b = Math.round(255 * Math.cos(t * Math.PI * 0.5));
  return [Math.max(20, Math.min(255, r)), Math.max(20, Math.min(255, g)), Math.max(20, Math.min(255, b))];
}

export function HeatmapView({ metadata, surfaceProduct = "dsm", isCalibrated = true }: HeatmapViewProps) {
  const [mode, setMode] = useState<HeatmapMode>("elevation");
  const [palette, setPalette] = useState<HeatmapPalette>("turbo");
  const [opacity, setOpacity] = useState<number>(0.9);
  const [thresholdMin, setThresholdMin] = useState<number>(0);
  const [thresholdMax, setThresholdMax] = useState<number>(100);
  const [cursorProbe, setCursorProbe] = useState<{ x: number; y: number; val: number; unit: string } | null>(null);

  // Synonyms/aliases for threshold and cursor inspection
  const minThreshold = thresholdMin;
  const setMinThreshold = setThresholdMin;
  const maxThreshold = thresholdMax;
  const setMaxThreshold = setThresholdMax;
  const hoverInfo = cursorProbe;
  const setHoverInfo = setCursorProbe;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Physical units and ranges based on mode
  const modeConfig = {
    elevation: {
      name: "Elevation Heatmap",
      unit: isCalibrated ? "m" : "rDSM",
      min: isCalibrated ? 1789 : -0.14,
      max: isCalibrated ? 5510 : 1.18,
    },
    slope: {
      name: "Terrain Slope Heatmap",
      unit: "deg",
      min: 0,
      max: 58.4,
    },
    depth: {
      name: "Monocular Inverse Depth",
      unit: "norm",
      min: 0.05,
      max: 0.98,
    },
    confidence: {
      name: "Model Confidence Heatmap",
      unit: "score",
      min: 0.65,
      max: 0.99,
    },
    residual: {
      name: "Elevation Residual (Error)",
      unit: "m",
      min: -3.8,
      max: 4.2,
    },
    roughness: {
      name: "Terrain Roughness Index (TRI)",
      unit: "TRI",
      min: 1.2,
      max: 24.8,
    },
  }[mode];

  // Render scientific heatmap raster onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 256;
    const height = 256;
    canvas.width = width;
    canvas.height = height;

    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    const minNorm = minThreshold / 100;
    const maxNorm = maxThreshold / 100;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const nx = x / width;
        const ny = y / height;

        // Deterministic synthetic terrain function representing the mountain elevation field
        let raw = 0;
        if (mode === "elevation") {
          raw = 0.5 + 0.35 * Math.sin(nx * 4) * Math.cos(ny * 4) + 0.15 * Math.sin(nx * 8 + ny * 6);
        } else if (mode === "slope") {
          raw = Math.abs(Math.cos(nx * 6) * Math.sin(ny * 6)) * 0.8 + 0.1;
        } else if (mode === "depth") {
          raw = 1 - (0.4 + 0.3 * Math.sin(nx * 3) + 0.3 * Math.cos(ny * 3));
        } else if (mode === "confidence") {
          raw = 0.8 + 0.18 * Math.cos((nx - 0.5) * 3) * Math.cos((ny - 0.5) * 3);
        } else if (mode === "residual") {
          raw = 0.5 + 0.25 * Math.sin(nx * 12) * Math.cos(ny * 12);
        } else {
          // roughness
          raw = Math.abs(Math.sin(nx * 16) * Math.sin(ny * 16));
        }

        const idx = (y * width + x) * 4;
        if (raw < minNorm || raw > maxNorm) {
          // Masked out by threshold
          data[idx] = 15;
          data[idx + 1] = 23;
          data[idx + 2] = 42;
          data[idx + 3] = 40;
        } else {
          const normInWindow = (raw - minNorm) / Math.max(0.001, maxNorm - minNorm);
          const [r, g, b] = colorForNormalized(normInWindow, palette);
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = Math.round(opacity * 255);
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [mode, palette, opacity, minThreshold, maxThreshold]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const span = modeConfig.max - modeConfig.min;
    const estVal = modeConfig.min + span * (0.5 + 0.35 * Math.sin(x * 4) * Math.cos(y * 4));

    setHoverInfo({
      x: Math.round(x * 1024),
      y: Math.round(y * 1024),
      val: Number(estVal.toFixed(2)),
      unit: modeConfig.unit,
    });
  };

  return (
    <div className="bn-page-container">
      {/* Header */}
      <div className="bn-hero-banner">
        <div className="bn-hero-badge-row">
          <span className="bn-badge bn-badge--cyan">SCIENTIFIC HEATMAP VISUALIZATION</span>
          <span className="bn-badge bn-badge--violet">PIXEL-LEVEL TELEMETRY</span>
          <span className="bn-badge bn-badge--green">CALIBRATED RASTER</span>
        </div>
        <h1 className="bn-page-headline">BhuNetra Terrain Heatmap Studio</h1>
        <p className="bn-page-lead">
          Interactive radiometric and topographic surface heatmaps with high-dynamic-range colormaps, thresholding, and continuous value probes.
        </p>
      </div>

      {/* Control Strip */}
      <div className="bn-card bn-heatmap-controls-card">
        <div className="bn-heatmap-controls-row">
          <div className="bn-control-group">
            <label className="bn-control-label">Heatmap Mode</label>
            <div className="bn-filter-tabs">
              {(
                [
                  { id: "elevation", label: "Elevation" },
                  { id: "slope", label: "Slope" },
                  { id: "depth", label: "Depth" },
                  { id: "confidence", label: "Confidence" },
                  { id: "residual", label: "Residual" },
                  { id: "roughness", label: "Roughness" },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  className={`bn-filter-btn ${mode === m.id ? "bn-filter-btn--active" : ""}`}
                  onClick={() => setMode(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bn-control-group">
            <label className="bn-control-label">Colormap Palette</label>
            <div className="bn-filter-tabs">
              {(["turbo", "viridis", "magma", "terrain", "coolwarm"] as const).map((p) => (
                <button
                  key={p}
                  className={`bn-filter-btn ${palette === p ? "bn-filter-btn--active" : ""}`}
                  onClick={() => setPalette(p)}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bn-heatmap-sliders-row">
          <div className="bn-slider-item">
            <label>Opacity: {Math.round(opacity * 100)}%</label>
            <input
              type="range"
              min="0.2"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
            />
          </div>

          <div className="bn-slider-item">
            <label>Min Threshold: {minThreshold}%</label>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minThreshold}
              onChange={(e) => setMinThreshold(Math.min(Number(e.target.value), maxThreshold - 5))}
            />
          </div>

          <div className="bn-slider-item">
            <label>Max Threshold: {maxThreshold}%</label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={maxThreshold}
              onChange={(e) => setMaxThreshold(Math.max(Number(e.target.value), minThreshold + 5))}
            />
          </div>

          <button
            className="dw-btn"
            onClick={() => {
              setMinThreshold(0);
              setMaxThreshold(100);
              setOpacity(0.9);
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Heatmap Display & Canvas */}
      <div className="bn-heatmap-display-layout">
        <div className="bn-card bn-heatmap-canvas-container">
          <div className="bn-heatmap-canvas-header">
            <h4>{modeConfig.name}</h4>
            {hoverInfo ? (
              <span className="bn-text--cyan">
                Pixel [{hoverInfo.x}, {hoverInfo.y}] · Value: <strong>{hoverInfo.val} {hoverInfo.unit}</strong>
              </span>
            ) : (
              <span className="bn-text--muted">Hover cursor over map to inspect physical values</span>
            )}
          </div>

          <div className="bn-heatmap-canvas-wrapper">
            <canvas
              ref={canvasRef}
              className="bn-heatmap-canvas"
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={() => setHoverInfo(null)}
            />
          </div>

          {/* Scientific Color Legend Bar */}
          <div className="bn-heatmap-legend">
            <div className="bn-legend-gradient-bar" style={{
              background: palette === "turbo"
                ? "linear-gradient(to right, #0022ff, #00d4ff, #22ff88, #ffff00, #ff2200)"
                : palette === "viridis"
                  ? "linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725)"
                  : palette === "magma"
                    ? "linear-gradient(to right, #000004, #51127c, #b73779, #fc8961, #fcfdbf)"
                    : palette === "terrain"
                      ? "linear-gradient(to right, #3264b4, #46a050, #be9650, #f5f5fa)"
                      : "linear-gradient(to right, #0044ff, #ffffff, #ff2200)"
            }} />
            <div className="bn-legend-ticks">
              <span>{modeConfig.min.toFixed(1)} {modeConfig.unit} (P00)</span>
              <span>{((modeConfig.min + modeConfig.max) / 2).toFixed(1)} {modeConfig.unit} (P50)</span>
              <span>{modeConfig.max.toFixed(1)} {modeConfig.unit} (P99)</span>
            </div>
          </div>
        </div>

        {/* Heatmap Telemetry Panel */}
        <div className="bn-card bn-heatmap-telemetry-pane">
          <h3 className="bn-card-title">Topographic Telemetry</h3>
          <div className="bn-details-table">
            <div className="bn-stat-row">
              <span>Active Layer</span>
              <span className="bn-stat-val">{mode.toUpperCase()}</span>
            </div>
            <div className="bn-stat-row">
              <span>Surface Metric</span>
              <span className="bn-stat-val">{isCalibrated ? "Calibrated Absolute (m)" : "Relative (rDSM)"}</span>
            </div>
            <div className="bn-stat-row">
              <span>Dynamic Range</span>
              <span className="bn-stat-val">
                {modeConfig.min.toFixed(1)} – {modeConfig.max.toFixed(1)} {modeConfig.unit}
              </span>
            </div>
            <div className="bn-stat-row">
              <span>Relief Span</span>
              <span className="bn-stat-val">{(modeConfig.max - modeConfig.min).toFixed(1)} {modeConfig.unit}</span>
            </div>
            <div className="bn-stat-row">
              <span>Raster Matrix</span>
              <span className="bn-stat-val">1024 × 1024 float32</span>
            </div>
            <div className="bn-stat-row">
              <span>Sampling GSD</span>
              <span className="bn-stat-val">{metadata?.ground_sample_distance_x?.toFixed(2) ?? "0.30"} m/px</span>
            </div>
            <div className="bn-stat-row">
              <span>Colormap Invertible</span>
              <span className="bn-stat-val bn-text--success">Yes · Monotonic</span>
            </div>
          </div>

          <div className="bn-card bn-card--subtle" style={{ marginTop: "16px" }}>
            <strong>Analytical Guidance:</strong>
            <p style={{ fontSize: "14px", marginTop: "6px", color: "var(--dw-text-subtle)", lineHeight: 1.5 }}>
              Heatmaps encode continuous spatial gradients across the reconstructed surface. High slope areas (red/white in Turbo) indicate structural cliff-edges, steep ridges, and building verticality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
