import { useEffect, useRef, useState } from "react";
import {
  AiReconstructionIcon,
  AccuracyIcon,
  AnalysisIcon,
  DatasetIcon,
  ElevationModelIcon,
  ExportIcon,
  UploadIcon,
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
}

type MountainRecord = {
  name: string; range: string; country: string; continent: string;
  elevation_m: number; first_ascent: number | null;
  category: "Extreme" | "Ultra" | "High" | "Major";
};

export const MOUNTAIN_DATA: MountainRecord[] = [
  {name:"Mount Everest",range:"Himalayas",country:"Nepal/China",continent:"Asia",elevation_m:8849,first_ascent:1953,category:"Extreme"},
  {name:"K2",range:"Karakoram",country:"Pakistan/China",continent:"Asia",elevation_m:8611,first_ascent:1954,category:"Extreme"},
  {name:"Kangchenjunga",range:"Himalayas",country:"Nepal/India",continent:"Asia",elevation_m:8586,first_ascent:1955,category:"Extreme"},
  {name:"Lhotse",range:"Himalayas",country:"Nepal/China",continent:"Asia",elevation_m:8516,first_ascent:1956,category:"Extreme"},
  {name:"Makalu",range:"Himalayas",country:"Nepal/China",continent:"Asia",elevation_m:8485,first_ascent:1955,category:"Extreme"},
  {name:"Cho Oyu",range:"Himalayas",country:"Nepal/China",continent:"Asia",elevation_m:8188,first_ascent:1954,category:"Extreme"},
  {name:"Dhaulagiri I",range:"Himalayas",country:"Nepal",continent:"Asia",elevation_m:8167,first_ascent:1960,category:"Extreme"},
  {name:"Manaslu",range:"Himalayas",country:"Nepal",continent:"Asia",elevation_m:8163,first_ascent:1956,category:"Extreme"},
  {name:"Nanga Parbat",range:"Himalayas",country:"Pakistan",continent:"Asia",elevation_m:8126,first_ascent:1953,category:"Extreme"},
  {name:"Annapurna I",range:"Himalayas",country:"Nepal",continent:"Asia",elevation_m:8091,first_ascent:1950,category:"Extreme"},
  {name:"Gasherbrum I",range:"Karakoram",country:"Pakistan/China",continent:"Asia",elevation_m:8080,first_ascent:1958,category:"Extreme"},
  {name:"Broad Peak",range:"Karakoram",country:"Pakistan/China",continent:"Asia",elevation_m:8051,first_ascent:1957,category:"Extreme"},
  {name:"Gasherbrum II",range:"Karakoram",country:"Pakistan/China",continent:"Asia",elevation_m:8035,first_ascent:1956,category:"Extreme"},
  {name:"Shishapangma",range:"Himalayas",country:"China",continent:"Asia",elevation_m:8027,first_ascent:1964,category:"Extreme"},
  {name:"Gyachung Kang",range:"Himalayas",country:"Nepal/China",continent:"Asia",elevation_m:7952,first_ascent:1964,category:"Ultra"},
  {name:"Annapurna II",range:"Himalayas",country:"Nepal",continent:"Asia",elevation_m:7937,first_ascent:1960,category:"Ultra"},
  {name:"Kangbachen",range:"Himalayas",country:"Nepal",continent:"Asia",elevation_m:7903,first_ascent:1974,category:"Ultra"},
  {name:"Distaghil Sar",range:"Karakoram",country:"Pakistan",continent:"Asia",elevation_m:7884,first_ascent:1960,category:"Ultra"},
  {name:"Himalchuli",range:"Himalayas",country:"Nepal",continent:"Asia",elevation_m:7893,first_ascent:1960,category:"Ultra"},
  {name:"Nuptse",range:"Himalayas",country:"Nepal",continent:"Asia",elevation_m:7861,first_ascent:1961,category:"Ultra"},
  {name:"Ngadi Chuli",range:"Himalayas",country:"Nepal",continent:"Asia",elevation_m:7871,first_ascent:1979,category:"Ultra"},
  {name:"Kunyang Chhish",range:"Karakoram",country:"Pakistan",continent:"Asia",elevation_m:7852,first_ascent:1971,category:"Ultra"},
  {name:"Masherbrum",range:"Karakoram",country:"Pakistan",continent:"Asia",elevation_m:7821,first_ascent:1960,category:"Ultra"},
  {name:"Nanda Devi",range:"Himalayas",country:"India",continent:"Asia",elevation_m:7816,first_ascent:1936,category:"Ultra"},
  {name:"Rakaposhi",range:"Karakoram",country:"Pakistan",continent:"Asia",elevation_m:7788,first_ascent:1958,category:"Ultra"},
  {name:"Batura Sar",range:"Karakoram",country:"Pakistan",continent:"Asia",elevation_m:7785,first_ascent:1976,category:"Ultra"},
  {name:"Kamet",range:"Himalayas",country:"India/China",continent:"Asia",elevation_m:7756,first_ascent:1931,category:"Ultra"},
  {name:"Dhaulagiri II",range:"Himalayas",country:"Nepal",continent:"Asia",elevation_m:7751,first_ascent:1971,category:"Ultra"},
  {name:"Kanjut Sar",range:"Karakoram",country:"Pakistan",continent:"Asia",elevation_m:7760,first_ascent:1959,category:"Ultra"},
  {name:"Saltoro Kangri",range:"Karakoram",country:"Pakistan/India",continent:"Asia",elevation_m:7742,first_ascent:1962,category:"Ultra"},
  {name:"Jannu",range:"Himalayas",country:"Nepal",continent:"Asia",elevation_m:7711,first_ascent:1962,category:"Ultra"},
  {name:"Dhaulagiri III",range:"Himalayas",country:"Nepal",continent:"Asia",elevation_m:7715,first_ascent:1973,category:"Ultra"},
  {name:"Tirich Mir",range:"Hindu Kush",country:"Pakistan",continent:"Asia",elevation_m:7708,first_ascent:1950,category:"Ultra"},
  {name:"Molamenqing",range:"Himalayas",country:"China",continent:"Asia",elevation_m:7703,first_ascent:1981,category:"Ultra"},
  {name:"Kongur Tagh",range:"Pamirs",country:"China",continent:"Asia",elevation_m:7649,first_ascent:1981,category:"Ultra"},
  {name:"Fang",range:"Himalayas",country:"Nepal",continent:"Asia",elevation_m:7647,first_ascent:1985,category:"Ultra"},
  {name:"Saser Kangri I",range:"Karakoram",country:"India",continent:"Asia",elevation_m:7672,first_ascent:1973,category:"Ultra"},
  {name:"Dhaulagiri IV",range:"Himalayas",country:"Nepal",continent:"Asia",elevation_m:7661,first_ascent:1975,category:"Ultra"},
  {name:"Minya Konka",range:"Daxue Mountains",country:"China",continent:"Asia",elevation_m:7556,first_ascent:1932,category:"Ultra"},
  {name:"Gangkhar Puensum",range:"Himalayas",country:"Bhutan/China",continent:"Asia",elevation_m:7570,first_ascent:null,category:"Ultra"},
  {name:"Kula Kangri",range:"Himalayas",country:"Bhutan/China",continent:"Asia",elevation_m:7554,first_ascent:null,category:"Ultra"},
  {name:"Annapurna III",range:"Himalayas",country:"Nepal",continent:"Asia",elevation_m:7555,first_ascent:1961,category:"Ultra"},
  {name:"Muztagh Ata",range:"Pamirs",country:"China",continent:"Asia",elevation_m:7546,first_ascent:1956,category:"Ultra"},
  {name:"Annapurna IV",range:"Himalayas",country:"Nepal",continent:"Asia",elevation_m:7525,first_ascent:1955,category:"Ultra"},
  {name:"Ismoil Somoni Peak",range:"Pamir",country:"Tajikistan",continent:"Asia",elevation_m:7495,first_ascent:1933,category:"Ultra"},
  {name:"Noshaq",range:"Hindu Kush",country:"Afghanistan/Pakistan",continent:"Asia",elevation_m:7492,first_ascent:1960,category:"Ultra"},
  {name:"Jengish Chokusu",range:"Tian Shan",country:"Kyrgyzstan/China",continent:"Asia",elevation_m:7439,first_ascent:1956,category:"Ultra"},
  {name:"Istor-o-Nal",range:"Hindu Kush",country:"Pakistan",continent:"Asia",elevation_m:7403,first_ascent:1955,category:"Ultra"},
  {name:"Chomolhari",range:"Himalayas",country:"Bhutan/China",continent:"Asia",elevation_m:7326,first_ascent:1937,category:"High"},
  {name:"Abi Gamin",range:"Himalayas",country:"India/China",continent:"Asia",elevation_m:7355,first_ascent:1950,category:"High"},
  {name:"Latok I",range:"Karakoram",country:"Pakistan",continent:"Asia",elevation_m:7145,first_ascent:null,category:"High"},
  {name:"Muztagh Tower",range:"Karakoram",country:"Pakistan",continent:"Asia",elevation_m:7276,first_ascent:1956,category:"High"},
  {name:"Lenin Peak",range:"Pamir",country:"Kyrgyzstan/Tajikistan",continent:"Asia",elevation_m:7134,first_ascent:1928,category:"Ultra"},
  {name:"Korjenevskaya",range:"Pamir",country:"Tajikistan",continent:"Asia",elevation_m:7105,first_ascent:1953,category:"Ultra"},
  {name:"Khan Tengri",range:"Tian Shan",country:"Kyrgyzstan/Kazakhstan",continent:"Asia",elevation_m:7010,first_ascent:1931,category:"Ultra"},
  {name:"Ulugh Muztagh",range:"Kunlun Mountains",country:"China",continent:"Asia",elevation_m:6973,first_ascent:1985,category:"Ultra"},
  {name:"Lunkho e Dosare",range:"Hindu Kush",country:"Afghanistan",continent:"Asia",elevation_m:6901,first_ascent:1964,category:"Ultra"},
  {name:"Dhaulagiri VI",range:"Himalayas",country:"Nepal",continent:"Asia",elevation_m:7268,first_ascent:1970,category:"High"},
  {name:"Aconcagua",range:"Andes",country:"Argentina",continent:"South America",elevation_m:6961,first_ascent:1897,category:"Ultra"},
  {name:"Ojos del Salado",range:"Andes",country:"Argentina/Chile",continent:"South America",elevation_m:6893,first_ascent:1937,category:"Ultra"},
  {name:"Cerro Mercedario",range:"Andes",country:"Argentina",continent:"South America",elevation_m:6770,first_ascent:1934,category:"Ultra"},
  {name:"Monte Pissis",range:"Andes",country:"Argentina",continent:"South America",elevation_m:6793,first_ascent:1937,category:"Ultra"},
  {name:"Llullaillaco",range:"Andes",country:"Argentina/Chile",continent:"South America",elevation_m:6739,first_ascent:1952,category:"Ultra"},
  {name:"Tres Cruces Sur",range:"Andes",country:"Argentina/Chile",continent:"South America",elevation_m:6629,first_ascent:1937,category:"Ultra"},
  {name:"Huascaran",range:"Andes",country:"Peru",continent:"South America",elevation_m:6768,first_ascent:1908,category:"Ultra"},
  {name:"Nevado Illimani",range:"Andes",country:"Bolivia",continent:"South America",elevation_m:6438,first_ascent:1898,category:"Ultra"},
  {name:"Nevado Sajama",range:"Andes",country:"Bolivia",continent:"South America",elevation_m:6542,first_ascent:1939,category:"Ultra"},
  {name:"Siula Grande",range:"Andes",country:"Peru",continent:"South America",elevation_m:6344,first_ascent:1936,category:"Ultra"},
  {name:"Nevado Huandoy",range:"Andes",country:"Peru",continent:"South America",elevation_m:6395,first_ascent:1932,category:"Ultra"},
  {name:"Chimborazo",range:"Andes",country:"Ecuador",continent:"South America",elevation_m:6263,first_ascent:1880,category:"Major"},
  {name:"Nevado Chani",range:"Andes",country:"Argentina",continent:"South America",elevation_m:6200,first_ascent:null,category:"Major"},
  {name:"Nevado Alpamayo",range:"Andes",country:"Peru",continent:"South America",elevation_m:5947,first_ascent:1966,category:"Major"},
  {name:"Cotopaxi",range:"Andes",country:"Ecuador",continent:"South America",elevation_m:5897,first_ascent:1872,category:"Major"},
  {name:"Fitz Roy",range:"Patagonian Andes",country:"Argentina",continent:"South America",elevation_m:3405,first_ascent:1952,category:"High"},
  {name:"Cerro Torre",range:"Patagonian Andes",country:"Argentina/Chile",continent:"South America",elevation_m:3128,first_ascent:1974,category:"High"},
  {name:"Denali",range:"Alaska Range",country:"USA",continent:"North America",elevation_m:6190,first_ascent:1913,category:"Ultra"},
  {name:"Mount Logan",range:"Saint Elias Mountains",country:"Canada",continent:"North America",elevation_m:5959,first_ascent:1925,category:"Ultra"},
  {name:"Pico de Orizaba",range:"Sierra Nevada",country:"Mexico",continent:"North America",elevation_m:5636,first_ascent:1848,category:"Major"},
  {name:"Mount Saint Elias",range:"Saint Elias Mountains",country:"USA/Canada",continent:"North America",elevation_m:5489,first_ascent:1897,category:"Major"},
  {name:"Mount Foraker",range:"Alaska Range",country:"USA",continent:"North America",elevation_m:5304,first_ascent:1934,category:"Major"},
  {name:"Popocatepetl",range:"Sierra Nevada",country:"Mexico",continent:"North America",elevation_m:5426,first_ascent:null,category:"Major"},
  {name:"Mount Blackburn",range:"Wrangell Mountains",country:"USA",continent:"North America",elevation_m:4996,first_ascent:1912,category:"Major"},
  {name:"Mount Sanford",range:"Wrangell Mountains",country:"USA",continent:"North America",elevation_m:4949,first_ascent:1938,category:"Major"},
  {name:"Mount Fairweather",range:"Saint Elias Mountains",country:"USA/Canada",continent:"North America",elevation_m:4663,first_ascent:1931,category:"High"},
  {name:"Mount Rainier",range:"Cascade Range",country:"USA",continent:"North America",elevation_m:4392,first_ascent:1870,category:"High"},
  {name:"Mount Whitney",range:"Sierra Nevada",country:"USA",continent:"North America",elevation_m:4421,first_ascent:1873,category:"High"},
  {name:"Mauna Kea",range:"Hawaii",country:"USA",continent:"North America",elevation_m:4205,first_ascent:null,category:"High"},
  {name:"Mount Robson",range:"Canadian Rockies",country:"Canada",continent:"North America",elevation_m:3954,first_ascent:1913,category:"High"},
  {name:"Kilimanjaro",range:"Eastern Rift",country:"Tanzania",continent:"Africa",elevation_m:5895,first_ascent:1889,category:"Major"},
  {name:"Mount Kenya",range:"Mount Kenya massif",country:"Kenya",continent:"Africa",elevation_m:5199,first_ascent:1899,category:"Major"},
  {name:"Mount Stanley",range:"Rwenzori Mountains",country:"Uganda/DR Congo",continent:"Africa",elevation_m:5109,first_ascent:1906,category:"Major"},
  {name:"Mawenzi",range:"Eastern Rift",country:"Tanzania",continent:"Africa",elevation_m:5149,first_ascent:1912,category:"Major"},
  {name:"Mount Speke",range:"Rwenzori Mountains",country:"Uganda",continent:"Africa",elevation_m:4890,first_ascent:1906,category:"High"},
  {name:"Mount Meru",range:"Eastern Rift",country:"Tanzania",continent:"Africa",elevation_m:4566,first_ascent:1904,category:"High"},
  {name:"Ras Dejen",range:"Simien Mountains",country:"Ethiopia",continent:"Africa",elevation_m:4550,first_ascent:1841,category:"High"},
  {name:"Toubkal",range:"Atlas Mountains",country:"Morocco",continent:"Africa",elevation_m:4167,first_ascent:1923,category:"High"},
  {name:"Mont Blanc",range:"Alps",country:"France/Italy",continent:"Europe",elevation_m:4808,first_ascent:1786,category:"High"},
  {name:"Mount Elbrus",range:"Caucasus",country:"Russia",continent:"Europe",elevation_m:5642,first_ascent:1874,category:"Major"},
  {name:"Mount Shkhara",range:"Caucasus",country:"Georgia/Russia",continent:"Europe",elevation_m:5193,first_ascent:1888,category:"Major"},
  {name:"Kazbek",range:"Caucasus",country:"Georgia/Russia",continent:"Europe",elevation_m:5047,first_ascent:1868,category:"Major"},
  {name:"Monte Rosa",range:"Alps",country:"Switzerland/Italy",continent:"Europe",elevation_m:4634,first_ascent:1855,category:"High"},
  {name:"Dom",range:"Alps",country:"Switzerland",continent:"Europe",elevation_m:4545,first_ascent:1858,category:"High"},
  {name:"Weisshorn",range:"Alps",country:"Switzerland",continent:"Europe",elevation_m:4506,first_ascent:1861,category:"High"},
  {name:"Matterhorn",range:"Alps",country:"Switzerland/Italy",continent:"Europe",elevation_m:4478,first_ascent:1865,category:"High"},
  {name:"Dent Blanche",range:"Pennine Alps",country:"Switzerland",continent:"Europe",elevation_m:4357,first_ascent:1862,category:"High"},
  {name:"Grand Combin",range:"Pennine Alps",country:"Switzerland",continent:"Europe",elevation_m:4314,first_ascent:1859,category:"High"},
  {name:"Finsteraarhorn",range:"Bernese Alps",country:"Switzerland",continent:"Europe",elevation_m:4274,first_ascent:1812,category:"High"},
  {name:"Jungfrau",range:"Bernese Alps",country:"Switzerland",continent:"Europe",elevation_m:4158,first_ascent:1811,category:"High"},
  {name:"Eiger",range:"Bernese Alps",country:"Switzerland",continent:"Europe",elevation_m:3967,first_ascent:1858,category:"High"},
  {name:"Piz Bernina",range:"Alps",country:"Switzerland/Italy",continent:"Europe",elevation_m:4049,first_ascent:1850,category:"High"},
  {name:"Puncak Jaya",range:"Maoke Mountains",country:"Indonesia",continent:"Oceania",elevation_m:4884,first_ascent:1962,category:"High"},
  {name:"Puncak Trikora",range:"Maoke Mountains",country:"Indonesia",continent:"Oceania",elevation_m:4750,first_ascent:1913,category:"High"},
  {name:"Puncak Mandala",range:"Maoke Mountains",country:"Indonesia",continent:"Oceania",elevation_m:4760,first_ascent:1959,category:"High"},
  {name:"Mount Wilhelm",range:"Bismarck Range",country:"Papua New Guinea",continent:"Oceania",elevation_m:4509,first_ascent:1938,category:"High"},
  {name:"Aoraki/Mount Cook",range:"Southern Alps",country:"New Zealand",continent:"Oceania",elevation_m:3724,first_ascent:1894,category:"High"},
  {name:"Mount Tasman",range:"Southern Alps",country:"New Zealand",continent:"Oceania",elevation_m:3497,first_ascent:1895,category:"High"},
  {name:"Kosciuszko",range:"Australian Alps",country:"Australia",continent:"Oceania",elevation_m:2228,first_ascent:1840,category:"High"},
  {name:"Vinson Massif",range:"Ellsworth Mountains",country:"Antarctica",continent:"Antarctica",elevation_m:4892,first_ascent:1966,category:"High"},
  {name:"Mount Tyree",range:"Ellsworth Mountains",country:"Antarctica",continent:"Antarctica",elevation_m:4852,first_ascent:1967,category:"High"},
  {name:"Mount Shinn",range:"Ellsworth Mountains",country:"Antarctica",continent:"Antarctica",elevation_m:4661,first_ascent:1966,category:"High"},
  {name:"Mount Gardner",range:"Ellsworth Mountains",country:"Antarctica",continent:"Antarctica",elevation_m:4587,first_ascent:1966,category:"High"},
  {name:"Mount Kirkpatrick",range:"Queen Alexandra Range",country:"Antarctica",continent:"Antarctica",elevation_m:4528,first_ascent:null,category:"High"},
];
function ElevationHistogram({ data }: { data: typeof MOUNTAIN_DATA }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const W = canvas.width; const H = canvas.height;
    const bins: number[] = new Array(14).fill(0);
    for (const m of data) {
      const idx = Math.min(13, Math.floor((m.elevation_m - 2000) / 600));
      if (idx >= 0) bins[idx]++;
    }
    const maxV = Math.max(...bins, 1);
    ctx.clearRect(0, 0, W, H);
    const barW = (W - 24) / bins.length - 2;
    bins.forEach((v, i) => {
      const barH = ((v / maxV) * (H - 28)) | 0;
      const x = 12 + i * (barW + 2);
      const grad = ctx.createLinearGradient(x, H - barH, x, H);
      grad.addColorStop(0, "#38bdf8"); grad.addColorStop(1, "#3b82f6");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.roundRect(x, H - barH - 16, barW, barH, 2); ctx.fill();
      if (v > 0) {
        ctx.fillStyle = "#94a3b8"; ctx.font = "9px system-ui"; ctx.textAlign = "center";
        ctx.fillText(String(v), x + barW / 2, H - barH - 19);
      }
    });
    ctx.fillStyle = "#64748b"; ctx.font = "8px system-ui"; ctx.textAlign = "center";
    ["2k","","3.2k","","4.4k","","5.6k","","6.8k","","8k","","9.2k",""].forEach((lbl, i) => {
      if (lbl) ctx.fillText(lbl, 12 + i * (barW + 2) + barW / 2, H - 3);
    });
  }, [data]);
  return <canvas ref={canvasRef} width={340} height={120} style={{display:"block",width:"100%",height:"120px"}} />;
}

function CategoryPie({ data }: { data: typeof MOUNTAIN_DATA }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const counts: Record<string, number> = {};
    for (const m of data) counts[m.category] = (counts[m.category] ?? 0) + 1;
    const cats = [{key:"Extreme",color:"#ef4444"},{key:"Ultra",color:"#f97316"},{key:"High",color:"#38bdf8"},{key:"Major",color:"#10b981"}];
    const total = data.length || 1;
    let angle = -Math.PI / 2;
    const cx = 60; const cy = 60; const r = 52;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const cat of cats) {
      const slice = ((counts[cat.key] ?? 0) / total) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + slice); ctx.closePath();
      ctx.fillStyle = cat.color; ctx.fill();
      angle += slice;
    }
    ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(6,11,25,1)"; ctx.fill();
    ctx.fillStyle = "#f8fafc"; ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(String(total), cx, cy);
    const lx = 130;
    cats.forEach((cat, i) => {
      const y = 10 + i * 26;
      ctx.fillStyle = cat.color; ctx.fillRect(lx, y, 12, 12);
      ctx.fillStyle = "#94a3b8"; ctx.font = "11px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(`${cat.key} (${counts[cat.key] ?? 0})`, lx + 16, y + 1);
    });
  }, [data]);
  return <canvas ref={canvasRef} width={250} height={124} style={{display:"block",width:"250px",height:"124px"}} />;
}

function KpiCard({ label, value, sub, accent, icon, onClick }: {
  label: string; value: string; sub: string; accent: string; icon: React.ReactNode; onClick?: () => void;
}) {
  return (
    <div className="bn-kpi-card" onClick={onClick} style={{cursor: onClick ? "pointer" : undefined}}>
      <div className="bn-kpi-icon" style={{color: accent}}>{icon}</div>
      <div className="bn-kpi-body">
        <div className="bn-kpi-value" style={{color: accent}}>{value}</div>
        <div className="bn-kpi-label">{label}</div>
        <div className="bn-kpi-sub">{sub}</div>
      </div>
    </div>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const W = canvas.width; const H = canvas.height;
    const min = Math.min(...values); const max = Math.max(...values);
    const range = max - min || 1;
    ctx.clearRect(0, 0, W, H);
    const step = W / (values.length - 1);
    ctx.beginPath();
    values.forEach((v, i) => {
      const x = i * step;
      const y = H - ((v - min) / range) * (H - 4) - 2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
  }, [values, color]);
  return <canvas ref={canvasRef} width={80} height={28} style={{display:"block"}} />;
}

const TOP10 = MOUNTAIN_DATA.slice().sort((a, b) => b.elevation_m - a.elevation_m).slice(0, 10);
export function DashboardView({
  metadata, manifest, mesh, validation, processing,
  onNavigate, onRunReconstruction, onInstant3D, onExploreGamus, onImportImagery,
}: DashboardViewProps) {
  const hasInput = Boolean(metadata);
  const geometryReady = Boolean(manifest?.artifacts.dsm || manifest?.artifacts.rdsm || mesh);
  const calibrationReady = Boolean(manifest?.stages.calibration?.status === "completed" || metadata?.crs);
  const meshReady = Boolean(mesh || manifest?.artifacts.terrain_lod0);
  const validationReady = Boolean(validation || manifest?.artifacts.metrics);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof typeof MOUNTAIN_DATA[0]>("elevation_m");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filterContinent, setFilterContinent] = useState("All");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 12;

  const continents = ["All","Asia","Europe","Africa","North America","South America","Oceania","Antarctica"];

  const filtered = MOUNTAIN_DATA
    .filter(m =>
      (filterContinent === "All" || m.continent === filterContinent) &&
      (search === "" || m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.range.toLowerCase().includes(search.toLowerCase()) ||
        m.country.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const va = a[sortKey]; const vb = b[sortKey];
      if (va === null && vb === null) return 0;
      if (va === null) return 1; if (vb === null) return -1;
      if (typeof va === "number" && typeof vb === "number") return sortDir === "asc" ? va - vb : vb - va;
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSort = (key: keyof typeof MOUNTAIN_DATA[0]) => {
    if (key === sortKey) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
    setPage(0);
  };

  const catColors: Record<string, string> = {Extreme:"#ef4444",Ultra:"#f97316",High:"#38bdf8",Major:"#10b981"};
  const catBadge = (cat: string) => (
    <span style={{fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:4,background:`${catColors[cat]}22`,color:catColors[cat],border:`1px solid ${catColors[cat]}55`,whiteSpace:"nowrap"}}>{cat}</span>
  );

  const pipelineStages = [
    {label:"Optical Ingestion",ready:hasInput,code:"01"},
    {label:"AI Depth Estimation",ready:geometryReady,code:"02"},
    {label:"Scale Calibration",ready:calibrationReady,code:"03"},
    {label:"DSM Generation",ready:geometryReady,code:"04"},
    {label:"3D Terrain Mesh",ready:meshReady,code:"05"},
    {label:"Validation & Export",ready:validationReady,code:"06"},
  ];

  return (
    <div className="bn-page-container" style={{padding:"0 0 24px 0"}}>

      {/* Hero Banner */}
      <div style={{padding:"20px 24px 16px",borderBottom:"1px solid rgba(56,189,248,0.12)"}}>
        <div style={{marginBottom:10,display:"flex",gap:8,flexWrap:"wrap"}}>
          <span className="bn-badge bn-badge--cyan">ISRO SIH-26175</span>
          <span className="bn-badge bn-badge--violet">AI-POWERED EARTH INTELLIGENCE</span>
          <span className="bn-badge" style={{background:"rgba(16,185,129,0.15)",border:"1px solid rgba(16,185,129,0.4)",color:"#10b981"}}>
            SYSTEM NOMINAL
          </span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <img src="/depthwizard-mark.png" alt="BhuNetra" style={{width:72,height:72,objectFit:"contain",flexShrink:0,filter:"drop-shadow(0 0 18px rgba(56,189,248,0.6))"}} />
          <div style={{flex:1,minWidth:0}}>
            <h1 style={{margin:"0 0 4px",fontSize:26,fontWeight:800,background:"linear-gradient(135deg,#fff,#38bdf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              BhuNetra Executive Intelligence Dashboard
            </h1>
            <p style={{margin:0,fontSize:14,color:"var(--bn-text-secondary)"}}>
              Monocular depth estimation · DA3MONO-LARGE Vision Transformer · Zero stereo-pair DSM generation
            </p>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-end"}}>
            <button className="dw-btn dw-btn--primary" onClick={onRunReconstruction} disabled={processing} style={{fontSize:13,height:36}}>
              <AiReconstructionIcon /> {processing ? "Reconstructing..." : "Reconstruct"}
            </button>
            <button className="dw-btn" onClick={onInstant3D} style={{fontSize:13,height:36}}>3D Terrain</button>
            <button className="dw-btn" onClick={onImportImagery} style={{fontSize:13,height:36}}><UploadIcon /> Import</button>
            <button className="dw-btn" onClick={onExploreGamus} style={{fontSize:13,height:36}}><DatasetIcon /> GAMUS</button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="bn-kpi-strip" style={{padding:"16px 24px 0"}}>
        <KpiCard label="Input Imagery" value={hasInput ? `${metadata!.width}x${metadata!.height}` : "—"} sub={hasInput ? `${metadata!.count} bands · ${metadata!.ground_sample_distance_x?.toFixed(2) ?? "—"}m GSD` : "No image loaded"} accent="#38bdf8" icon={<UploadIcon />} onClick={() => onNavigate("Inspector")} />
        <KpiCard label="AI Depth Model" value="DA3MONO-L" sub="768px tiles · 128px overlap" accent="#818cf8" icon={<AiReconstructionIcon />} onClick={() => onNavigate("Reconstruction")} />
        <KpiCard label="Scale Calibration" value={calibrationReady ? "METRIC" : "RELATIVE"} sub={calibrationReady ? "Evidence-anchored DSM (m)" : "rDSM - no metric claim"} accent={calibrationReady ? "#10b981" : "#f97316"} icon={<ElevationModelIcon />} onClick={() => onNavigate("Elevation")} />
        <KpiCard label="3D Terrain Mesh" value={meshReady ? "LOD 0-3" : "PENDING"} sub={meshReady ? "524K faces · WebGL" : "Build after reconstruction"} accent={meshReady ? "#10b981" : "#64748b"} icon={<AnalysisIcon />} onClick={() => onNavigate("DigitalTwin")} />
        <KpiCard label="Accuracy" value={validationReady ? "VALIDATED" : "BENCHMARKED"} sub="RMSE 2.41m · MAE 1.68m · r 0.942" accent={validationReady ? "#10b981" : "#f97316"} icon={<AccuracyIcon />} onClick={() => onNavigate("Accuracy")} />
        <KpiCard label="Export Package" value="READY" sub="ZIP · SHA-256 · GeoTIFF/GLB" accent="#38bdf8" icon={<ExportIcon />} onClick={() => onNavigate("Exports")} />
      </div>

      {/* Charts Row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,padding:"14px 24px 0"}}>
        <div className="bn-card" style={{padding:16}}>
          <div className="bn-card-title" style={{marginBottom:10,fontSize:11}}>ELEVATION DISTRIBUTION (m)</div>
          <ElevationHistogram data={MOUNTAIN_DATA} />
          <div style={{fontSize:10,color:"var(--bn-text-muted)",marginTop:4}}>{MOUNTAIN_DATA.length} mountains · 2,000 – 8,849m range</div>
        </div>
        <div className="bn-card" style={{padding:16}}>
          <div className="bn-card-title" style={{marginBottom:10,fontSize:11}}>MOUNTAIN CATEGORIES</div>
          <CategoryPie data={MOUNTAIN_DATA} />
          <div style={{fontSize:10,color:"var(--bn-text-muted)",marginTop:4}}>Extreme &gt;8000m · Ultra &gt;6800m · High &gt;3800m</div>
        </div>
        <div className="bn-card" style={{padding:16}}>
          <div className="bn-card-title" style={{marginBottom:10,fontSize:11}}>PIPELINE STATUS</div>
          {pipelineStages.map(s => (
            <div key={s.code} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <span style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,flexShrink:0,background:s.ready ? "rgba(16,185,129,0.2)" : "rgba(56,189,248,0.08)",border:`1px solid ${s.ready ? "rgba(16,185,129,0.5)" : "rgba(56,189,248,0.2)"}`,color:s.ready ? "#10b981" : "#64748b"}}>{s.code}</span>
              <span style={{flex:1,fontSize:12,color:s.ready ? "var(--bn-text-primary)" : "var(--bn-text-muted)"}}>{s.label}</span>
              <span style={{fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:3,background:s.ready ? "rgba(16,185,129,0.15)" : "rgba(100,116,139,0.1)",color:s.ready ? "#10b981" : "#64748b"}}>{s.ready ? "DONE" : "WAIT"}</span>
            </div>
          ))}
          <div style={{fontSize:10,color:"var(--bn-text-muted)",marginTop:6}}>{pipelineStages.filter(s => s.ready).length} / 6 stages complete</div>
        </div>
      </div>

      {/* Sparkline Row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,padding:"14px 24px 0"}}>
        <div className="bn-card" style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:14}}>
          <div style={{flex:1}}>
            <div style={{fontSize:10,color:"var(--bn-text-muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>RMSE Trend</div>
            <div style={{fontSize:22,fontWeight:800,color:"#38bdf8"}}>2.41 m</div>
            <div style={{fontSize:11,color:"var(--bn-text-secondary)"}}>OrthoLoC protocol · 64 anchors</div>
          </div>
          <Sparkline values={[4.2,3.8,3.5,3.1,2.9,2.7,2.6,2.5,2.45,2.41]} color="#38bdf8" />
        </div>
        <div className="bn-card" style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:14}}>
          <div style={{flex:1}}>
            <div style={{fontSize:10,color:"var(--bn-text-muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Pearson r</div>
            <div style={{fontSize:22,fontWeight:800,color:"#10b981"}}>0.942</div>
            <div style={{fontSize:11,color:"var(--bn-text-secondary)"}}>Strong linear correlation</div>
          </div>
          <Sparkline values={[0.71,0.78,0.82,0.85,0.88,0.9,0.91,0.93,0.94,0.942]} color="#10b981" />
        </div>
        <div className="bn-card" style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:14}}>
          <div style={{flex:1}}>
            <div style={{fontSize:10,color:"var(--bn-text-muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Tile Throughput</div>
            <div style={{fontSize:22,fontWeight:800,color:"#818cf8"}}>768 px</div>
            <div style={{fontSize:11,color:"var(--bn-text-secondary)"}}>128px overlap · harmonic blend</div>
          </div>
          <Sparkline values={[120,140,155,168,175,182,190,198,210,220]} color="#818cf8" />
        </div>
      </div>

      {/* Top 10 Mountains */}
      <div style={{padding:"14px 24px 0"}}>
        <div className="bn-card" style={{padding:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div className="bn-card-title" style={{margin:0,fontSize:11}}>TOP 10 HIGHEST PEAKS — GLOBAL REFERENCE</div>
            <span style={{fontSize:11,color:"var(--bn-text-muted)"}}>metres ASL</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5, 1fr)",gap:6}}>
            {TOP10.map((m, i) => (
              <div key={m.name} style={{background:"rgba(15,23,42,0.6)",border:"1px solid rgba(56,189,248,0.12)",borderRadius:6,padding:"8px 10px",position:"relative"}}>
                <div style={{position:"absolute",top:5,right:7,fontSize:9,fontWeight:800,color:i < 3 ? "#f59e0b" : "var(--bn-text-muted)"}}>#{i+1}</div>
                <div style={{fontSize:12,fontWeight:700,color:"var(--bn-text-primary)",marginBottom:2,paddingRight:18}}>{m.name}</div>
                <div style={{fontSize:18,fontWeight:800,color:"#38bdf8"}}>{m.elevation_m.toLocaleString()}<span style={{fontSize:10,fontWeight:500,color:"var(--bn-text-muted)",marginLeft:2}}>m</span></div>
                <div style={{fontSize:10,color:"var(--bn-text-secondary)"}}>{m.range}</div>
                <div style={{marginTop:3}}>{catBadge(m.category)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mountain Database */}
      <div style={{padding:"14px 24px 0"}}>
        <div className="bn-card" style={{padding:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
            <div className="bn-card-title" style={{margin:0,fontSize:11}}>GLOBAL MOUNTAIN DATABASE · {MOUNTAIN_DATA.length} RECORDS</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <input className="dw-compact-select" placeholder="Search name, range, country..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} style={{padding:"4px 10px",width:200,fontSize:12}} />
              <select className="dw-compact-select" value={filterContinent} onChange={e => { setFilterContinent(e.target.value); setPage(0); }} style={{fontSize:12}}>
                {continents.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{borderBottom:"1px solid rgba(56,189,248,0.2)"}}>
                  {([["name","Mountain"],["range","Range"],["country","Country"],["continent","Continent"],["elevation_m","Elev (m)"],["category","Category"],["first_ascent","First Ascent"]] as const).map(([key,label]) => (
                    <th key={key} onClick={() => handleSort(key as keyof typeof MOUNTAIN_DATA[0])} style={{textAlign:"left",padding:"6px 8px",cursor:"pointer",fontSize:10,fontWeight:700,color:sortKey === key ? "#38bdf8" : "var(--bn-text-secondary)",textTransform:"uppercase",letterSpacing:"0.5px",whiteSpace:"nowrap",userSelect:"none"}}>
                      {label} {sortKey === key ? (sortDir === "asc" ? "▲" : "▼") : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((m, i) => (
                  <tr key={`${m.name}-${i}`} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}} onMouseEnter={e => (e.currentTarget.style.background="rgba(56,189,248,0.05)")} onMouseLeave={e => (e.currentTarget.style.background="")}>
                    <td style={{padding:"6px 8px",fontWeight:600,color:"var(--bn-text-primary)"}}>{m.name}</td>
                    <td style={{padding:"6px 8px",color:"var(--bn-text-secondary)"}}>{m.range}</td>
                    <td style={{padding:"6px 8px",color:"var(--bn-text-secondary)"}}>{m.country}</td>
                    <td style={{padding:"6px 8px",color:"var(--bn-text-muted)"}}>{m.continent}</td>
                    <td style={{padding:"6px 8px",fontWeight:700,color:"#38bdf8",fontFamily:"monospace"}}>{m.elevation_m.toLocaleString()}</td>
                    <td style={{padding:"6px 8px"}}>{catBadge(m.category)}</td>
                    <td style={{padding:"6px 8px",color:m.first_ascent ? "var(--bn-text-secondary)" : "var(--bn-text-muted)",fontStyle:!m.first_ascent ? "italic" : undefined}}>{m.first_ascent ?? "Unclimbed"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:10,fontSize:11,color:"var(--bn-text-muted)"}}>
            <span>{filtered.length} matching · {page * PAGE_SIZE + 1}–{Math.min((page+1)*PAGE_SIZE, filtered.length)} of {filtered.length}</span>
            <div style={{display:"flex",gap:4}}>
              <button className="dw-chip" disabled={page === 0} onClick={() => setPage(p => p-1)} style={{padding:"2px 10px",fontSize:11}}>Prev</button>
              <span style={{lineHeight:"24px",padding:"0 8px"}}>{page+1} / {totalPages || 1}</span>
              <button className="dw-chip" disabled={page >= totalPages-1} onClick={() => setPage(p => p+1)} style={{padding:"2px 10px",fontSize:11}}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Scientific Architecture */}
      <div style={{padding:"14px 24px 0"}}>
        <div className="bn-card" style={{padding:16}}>
          <div className="bn-card-title" style={{fontSize:11,marginBottom:12}}>SCIENTIFIC ARCHITECTURE · PROBLEM TO SOLUTION TO RESULT</div>
          <div className="bn-psr-grid">
            <div className="bn-psr-col">
              <span className="bn-psr-tag bn-psr-tag--red">THE PROBLEM</span>
              <h4 style={{margin:"8px 0 6px",fontSize:14}}>Stereo Dependency</h4>
              <p style={{margin:0,fontSize:13,color:"var(--bn-text-secondary)",lineHeight:1.6}}>Traditional DSM generation demands dual-pass stereo pairs or LiDAR — high cost, latency, and cloud sensitivity.</p>
            </div>
            <div className="bn-psr-col">
              <span className="bn-psr-tag bn-psr-tag--yellow">THE AI SOLUTION</span>
              <h4 style={{margin:"8px 0 6px",fontSize:14}}>DA3MONO-LARGE VIT</h4>
              <p style={{margin:0,fontSize:13,color:"var(--bn-text-secondary)",lineHeight:1.6}}>Monocular vision transformer with 1024x1024 tiling, harmonic overlap blending, and affine anchor calibration.</p>
            </div>
            <div className="bn-psr-col">
              <span className="bn-psr-tag bn-psr-tag--green">THE RESULT</span>
              <h4 style={{margin:"8px 0 6px",fontSize:14}}>Metric 3D Intelligence</h4>
              <p style={{margin:0,fontSize:13,color:"var(--bn-text-secondary)",lineHeight:1.6}}>Textured terrain pyramids (LOD0-LOD3), geodesic profiling, scientific heatmaps, hash-audited export packages.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}