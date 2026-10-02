import { useState } from "react";
import { DatasetIcon, UploadIcon } from "./icons";

export interface DatasetSourceItem {
  id: string;
  name: string;
  region: string;
  provider: string;
  role: "OPTICAL INPUT DATASET" | "REFERENCE DEM" | "REFERENCE DSM" | "VALIDATION DATASET" | "BENCHMARK DATASET" | "INDIAN TERRAIN DATASET";
  category: "indian" | "optical" | "dem" | "benchmark";
  coverage: string;
  resolution: string;
  crs: string;
  dimensions: string;
  format: string;
  status: "Available" | "Live Stream" | "Direct Access" | "Cache Ready" | "Source Available";
  description: string;
  sampleId?: string;
  thumbnailUrl?: string;
  elevationRange?: string;
}

export const DATASET_CATALOG: DatasetSourceItem[] = [
  // 11 Indian Himalayan Mountain Datasets (Cache Ready)
  {
    id: "joshimath-himalaya",
    name: "Joshimath & Nanda Devi",
    region: "Garhwal Himalayas, Uttarakhand",
    provider: "Cartosat-2/3 & Sentinel-2 MSI / ISRO Bhuvan",
    role: "INDIAN TERRAIN DATASET",
    category: "indian",
    coverage: "Chamoli District, Uttarakhand (30.55°N, 79.56°E)",
    resolution: "2.5 m GSD",
    crs: "EPSG:32644 (WGS 84 / UTM zone 44N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 GeoTIFF + 3D Terrain GLB Pyramid",
    status: "Cache Ready",
    description: "High-altitude disaster-relevant alpine valley with severe glaciated relief (1,789m to 5,510m) around Nanda Devi, Trishul, and Alaknanda River gorge. Benchmark test site for landslide hazards and single-view DSM calibration.",
    sampleId: "himalayas_joshimath",
    thumbnailUrl: "/indian_mountains/himalayas_joshimath.png",
    elevationRange: "1,789 m – 5,510 m a.s.l.",
  },
  {
    id: "kedarnath-mandakini",
    name: "Kedarnath & Mandakini Valley",
    region: "Rudraprayag Himalayas, Uttarakhand",
    provider: "Cartosat-3 PAN & Sentinel-2 / ISRO Bhuvan",
    role: "INDIAN TERRAIN DATASET",
    category: "indian",
    coverage: "Mandakini Glacial Valley, Kedarnath Peak (30.73°N, 79.06°E)",
    resolution: "1.5 m GSD",
    crs: "EPSG:32644 (WGS 84 / UTM zone 44N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 GeoTIFF + 3D Terrain GLB Pyramid",
    status: "Cache Ready",
    description: "Steep glaciated U-valley cirque carved by Chorabari Glacier with lateral moraines and extreme relief ascending to Kedarnath Dome (6,940m). Essential site for glacial lake outburst flood modeling.",
    sampleId: "kedarnath_mandakini",
    thumbnailUrl: "/indian_mountains/kedarnath_mandakini.png",
    elevationRange: "3,583 m – 6,940 m a.s.l.",
  },
  {
    id: "badrinath-alaknanda",
    name: "Badrinath & Alaknanda Valley",
    region: "Garhwal Himalayas, Uttarakhand",
    provider: "Cartosat-2/3 & Copernicus GLO-30 / ISRO Bhuvan",
    role: "INDIAN TERRAIN DATASET",
    category: "indian",
    coverage: "Alaknanda Upper Basin, Neelkanth Cirque (30.74°N, 79.49°E)",
    resolution: "2.0 m GSD",
    crs: "EPSG:32644 (WGS 84 / UTM zone 44N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 GeoTIFF + 3D Terrain GLB Pyramid",
    status: "Cache Ready",
    description: "Precipitous glacial valley bounded by the colossal pyramidal horn of Neelkanth (6,596m) and Nar-Narayan ridges. Demonstrates acute shadow handling and high-angle slope estimation.",
    sampleId: "badrinath_alaknanda",
    thumbnailUrl: "/indian_mountains/badrinath_alaknanda.png",
    elevationRange: "3,100 m – 6,596 m a.s.l.",
  },
  {
    id: "gangotri-bhagirathi",
    name: "Gangotri & Bhagirathi Valley",
    region: "Uttarkashi Himalayas, Uttarakhand",
    provider: "Cartosat-3 PAN/MX & Sentinel-2 / NRSC Bhoonidhi",
    role: "INDIAN TERRAIN DATASET",
    category: "indian",
    coverage: "Gaumukh Glacial Snout & Shivling-Bhagirathi (30.98°N, 79.08°E)",
    resolution: "1.5 m GSD",
    crs: "EPSG:32644 (WGS 84 / UTM zone 44N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 GeoTIFF + 3D Terrain GLB Pyramid",
    status: "Cache Ready",
    description: "Gangotri Glacier trunk with iconic vertical granite monoliths (Shivling, Meru, Bhagirathi I-III peaks up to 7,138m). Tests deep moraine depression extraction and periglacial rock wall geometry.",
    sampleId: "gangotri_bhagirathi",
    thumbnailUrl: "/indian_mountains/gangotri_bhagirathi.png",
    elevationRange: "3,890 m – 7,138 m a.s.l.",
  },
  {
    id: "pithoragarh-kumaon",
    name: "Pithoragarh & Kumaon Himalayas",
    region: "Kumaon Himalayas, Uttarakhand",
    provider: "Cartosat-2 & Landsat-8/9 / ISRO Bhuvan",
    role: "INDIAN TERRAIN DATASET",
    category: "indian",
    coverage: "Darma & Johar Valleys, Panchachuli Massif (29.58°N, 80.22°E)",
    resolution: "2.5 m GSD",
    crs: "EPSG:32644 (WGS 84 / UTM zone 44N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 GeoTIFF + 3D Terrain GLB Pyramid",
    status: "Cache Ready",
    description: "Serrated knife-edge ridges of the Panchachuli five-peak massif with deep Gori Ganga canyon drops. Outstanding test bed for ridge-line sharpness preservation.",
    sampleId: "pithoragarh_kumaon",
    thumbnailUrl: "/indian_mountains/pithoragarh_kumaon.png",
    elevationRange: "1,600 m – 6,904 m a.s.l.",
  },
  {
    id: "kinnaur-himalayas",
    name: "Kinnaur Himalayas & Satluj Gorge",
    region: "Kinnaur, Himachal Pradesh",
    provider: "Cartosat-3 & Copernicus GLO-30 / NRSC",
    role: "INDIAN TERRAIN DATASET",
    category: "indian",
    coverage: "Satluj River Canyon, Reckong Peo (31.53°N, 78.27°E)",
    resolution: "2.0 m GSD",
    crs: "EPSG:32643 (WGS 84 / UTM zone 43N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 GeoTIFF + 3D Terrain GLB Pyramid",
    status: "Cache Ready",
    description: "One of Earth's deepest antecedent river gorges where the Satluj cuts through the Greater Himalayan axis under Kinner Kailash (6,050m), featuring 3,700m continuous vertical relief.",
    sampleId: "kinnaur_himalayas",
    thumbnailUrl: "/indian_mountains/kinnaur_himalayas.png",
    elevationRange: "2,290 m – 6,050 m a.s.l.",
  },
  {
    id: "spiti-valley",
    name: "Spiti Valley & Pin Basin",
    region: "Spiti Trans-Himalayas, Himachal Pradesh",
    provider: "Cartosat-2/3 & Sentinel-2 / ISRO Bhuvan",
    role: "INDIAN TERRAIN DATASET",
    category: "indian",
    coverage: "Kaza & Pin Valley National Park (32.22°N, 78.07°E)",
    resolution: "2.0 m GSD",
    crs: "EPSG:32643 (WGS 84 / UTM zone 43N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 GeoTIFF + 3D Terrain GLB Pyramid",
    status: "Cache Ready",
    description: "Hyper-arid cold desert plateaus with devoid vegetation, exposed Mesozoic sedimentary fold belts, braided river gravels, and jagged shale peaks. Ideal for bare-earth DEM verification.",
    sampleId: "spiti_valley",
    thumbnailUrl: "/indian_mountains/spiti_valley.png",
    elevationRange: "3,650 m – 6,230 m a.s.l.",
  },
  {
    id: "lahaul-valley",
    name: "Lahaul Valley & Rohtang Pass",
    region: "Lahaul & Spiti, Himachal Pradesh",
    provider: "Cartosat-3 PAN & Copernicus GLO-30",
    role: "INDIAN TERRAIN DATASET",
    category: "indian",
    coverage: "Keylong / Chandra-Bhaga Basin (32.57°N, 77.03°E)",
    resolution: "2.0 m GSD",
    crs: "EPSG:32643 (WGS 84 / UTM zone 43N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 GeoTIFF + 3D Terrain GLB Pyramid",
    status: "Cache Ready",
    description: "Glaciated high-altitude basin connecting Pir Panjal and Great Himalayan ranges via Rohtang and Baralacha passes. Features hanging cirque glaciers and high moraine dams.",
    sampleId: "lahaul_valley",
    thumbnailUrl: "/indian_mountains/lahaul_valley.png",
    elevationRange: "2,900 m – 6,400 m a.s.l.",
  },
  {
    id: "tawang-himalayas",
    name: "Northeast Tawang Himalayas & Sela Pass",
    region: "Tawang, Arunachal Pradesh",
    provider: "Cartosat-2/3 & Sentinel-2 MSI / ISRO Bhuvan",
    role: "INDIAN TERRAIN DATASET",
    category: "indian",
    coverage: "Tawang River Gorge, Arunachal Pradesh (27.59°N, 91.86°E)",
    resolution: "2.0 m GSD",
    crs: "EPSG:32645 (WGS 84 / UTM zone 45N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 GeoTIFF + 3D Terrain GLB Pyramid",
    status: "Cache Ready",
    description: "Precipitous Eastern Himalayan V-shaped gorges, roaring glacial rivers, dense conifer forest slopes, and monsoonal erosion scarps rising to snowbound passes.",
    sampleId: "northeast_tawang",
    thumbnailUrl: "/indian_mountains/northeast_tawang.png",
    elevationRange: "2,100 m – 4,800 m a.s.l.",
  },
  {
    id: "sikkim-kanchenjunga",
    name: "Sikkim Himalayas / Kanchenjunga Region",
    region: "North Sikkim / Khangchendzonga, Sikkim",
    provider: "Cartosat-3 & Sentinel-2 / ISRO Focus",
    role: "INDIAN TERRAIN DATASET",
    category: "indian",
    coverage: "Teesta Basin, Kanchenjunga Massif (27.70°N, 88.15°E)",
    resolution: "2.0 m GSD",
    crs: "EPSG:32645 (WGS 84 / UTM zone 45N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 GeoTIFF + 3D Terrain GLB Pyramid",
    status: "Cache Ready",
    description: "Colossal topographic relief rising from subtropical river valleys to Mount Kanchenjunga (8,586m, Earth's 3rd highest peak). Maximum vertical amplitude stress-test for monocular depth.",
    sampleId: "sikkim_kanchenjunga",
    thumbnailUrl: "/indian_mountains/sikkim_kanchenjunga.png",
    elevationRange: "2,800 m – 8,586 m a.s.l.",
  },
  {
    id: "ladakh-himalayas",
    name: "Ladakh Himalayas & Indus Valley",
    region: "Leh, Ladakh",
    provider: "Cartosat-3 PAN & Landsat-8/9 / Copernicus GLO-30",
    role: "INDIAN TERRAIN DATASET",
    category: "indian",
    coverage: "Leh / Indus River Valley, Ladakh (34.15°N, 77.58°E)",
    resolution: "2.0 m GSD",
    crs: "EPSG:32643 (WGS 84 / UTM zone 43N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 GeoTIFF + 3D Terrain GLB Pyramid",
    status: "Cache Ready",
    description: "Periglacial cold desert with hyper-arid scree slopes, alluvial fans, braided Indus riverbed, and sharp mountain shadows. Optimal for testing geometric monocular depth without canopy interference.",
    sampleId: "ladakh_leh",
    thumbnailUrl: "/indian_mountains/ladakh_leh.png",
    elevationRange: "3,200 m – 5,850 m a.s.l.",
  },

  // Additional Indian Physiographic Regions (Cache Ready)
  {
    id: "western-ghats-rainforest",
    name: "Western Ghats Escarpments (Kudremukh)",
    region: "Chikkamagaluru / Sahyadri, Karnataka",
    provider: "Cartosat-2/3 & Sentinel-2 MSI / NRSC Bhoonidhi",
    role: "INDIAN TERRAIN DATASET",
    category: "indian",
    coverage: "Kudremukh Peak / Sahyadri Range (13.13°N, 75.25°E)",
    resolution: "1.5 m GSD",
    crs: "EPSG:32643 (WGS 84 / UTM zone 43N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 GeoTIFF + 3D Terrain GLB Pyramid",
    status: "Cache Ready",
    description: "Seaward orographic escarpments, Kudremukh Peak (1,894m), dense tropical rainforest canopy, and shola grasslands dropping precipitously towards coastal plains.",
    sampleId: "western_ghats_kudremukh",
    thumbnailUrl: "/indian_mountains/western_ghats_kudremukh.png",
    elevationRange: "650 m – 1,894 m a.s.l.",
  },
  {
    id: "eastern-ghats-araku",
    name: "Eastern Ghats Highlands (Araku Valley)",
    region: "Alluri Sitharama Raju District, Andhra Pradesh",
    provider: "Resourcesat-2 LISS-4 & Cartosat-2 / ISRO Bhuvan",
    role: "INDIAN TERRAIN DATASET",
    category: "indian",
    coverage: "Araku Valley, Andhra Pradesh (18.33°N, 82.88°E)",
    resolution: "2.0 m GSD",
    crs: "EPSG:32644 (WGS 84 / UTM zone 44N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 GeoTIFF + 3D Terrain GLB Pyramid",
    status: "Cache Ready",
    description: "Dissected peninsular Precambrian charnockite-khondalite ridges, red lateritic soil valleys, and terraced mountain coffee slopes.",
    sampleId: "eastern_ghats_araku",
    thumbnailUrl: "/indian_mountains/eastern_ghats_araku.png",
    elevationRange: "600 m – 1,680 m a.s.l.",
  },
  {
    id: "deccan-plateau-traps",
    name: "Deccan Traps Basalt Mesa (Sinhagad)",
    region: "Pune District, Maharashtra",
    provider: "Resourcesat-2 LISS-4 / Cartosat-2D / ISRO Bhuvan",
    role: "INDIAN TERRAIN DATASET",
    category: "indian",
    coverage: "Sinhagad / Western Maharashtra Plateau (18.37°N, 73.76°E)",
    resolution: "1.5 m GSD",
    crs: "EPSG:32643 (WGS 84 / UTM zone 43N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 GeoTIFF + 3D Terrain GLB Pyramid",
    status: "Cache Ready",
    description: "Horizontal basaltic lava flows forming stepped mesa plateaus bounded by near-vertical escarpment cliffs and rolling foothill spurs.",
    sampleId: "deccan_plateau_pune",
    thumbnailUrl: "/indian_mountains/deccan_plateau_pune.png",
    elevationRange: "580 m – 1,312 m a.s.l.",
  },
  {
    id: "indo-gangetic-foothills",
    name: "Indo-Gangetic & Dehradun Dun Foothills",
    region: "Dehradun, Uttarakhand",
    provider: "Cartosat-3 / Sentinel-2 / Bhuvan Open",
    role: "INDIAN TERRAIN DATASET",
    category: "indian",
    coverage: "Dehradun / Rishikesh, Uttarakhand (30.31°N, 78.03°E)",
    resolution: "2.5 m – 10 m GSD",
    crs: "EPSG:32644 (WGS 84 / UTM zone 44N)",
    dimensions: "1,024 × 1,024 px",
    format: "GeoTIFF Orthophoto",
    status: "Source Available",
    description: "Alluvial gravel fans and piedmont terraces transitioning into urbanized dun topography. Tests structure height extraction and terrain filtering.",
    sampleId: "DC_10_30_RGB",
    thumbnailUrl: "/gamus/DC_10_30_RGB.png",
    elevationRange: "350 m – 1,200 m a.s.l.",
  },

  // Optical Input Datasets (GAMUS Benchmark)
  {
    id: "gamus-dc04",
    name: "GAMUS · DC_04_23 (High Canopy & Valley)",
    region: "District of Columbia, USA",
    provider: "Earthflow / Hugging Face",
    role: "OPTICAL INPUT DATASET",
    category: "optical",
    coverage: "District of Columbia, USA (38.89°N, 77.03°W)",
    resolution: "0.30 m GSD",
    crs: "EPSG:32618 (WGS 84 / UTM zone 18N)",
    dimensions: "1,024 × 1,024 px",
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
    region: "District of Columbia, USA",
    provider: "Earthflow / Hugging Face",
    role: "OPTICAL INPUT DATASET",
    category: "optical",
    coverage: "District of Columbia, USA (38.91°N, 77.01°W)",
    resolution: "0.30 m GSD",
    crs: "EPSG:32618 (WGS 84 / UTM zone 18N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 RGB GeoTIFF + AGL LiDAR",
    status: "Live Stream",
    description: "Urban/suburban residential tile with discrete roof profiles, ground clearances, and tree canopies. Ideal for building height extraction.",
    sampleId: "DC_02_26_RGB",
    thumbnailUrl: "/gamus/DC_02_26_RGB.png",
    elevationRange: "15.2 m – 74.8 m AGL",
  },
  {
    id: "gamus-dc04-27",
    name: "GAMUS · DC_04_27 (River Valley & Mountain Foothills)",
    region: "District of Columbia, USA",
    provider: "Earthflow / Hugging Face",
    role: "OPTICAL INPUT DATASET",
    category: "optical",
    coverage: "District of Columbia, USA (38.88°N, 77.05°W)",
    resolution: "0.30 m GSD",
    crs: "EPSG:32618 (WGS 84 / UTM zone 18N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 RGB GeoTIFF + AGL LiDAR",
    status: "Live Stream",
    description: "River valley drainage terrace and rolling hills with elevation transitions. Excellent test case for slope and water boundary estimation.",
    sampleId: "DC_04_27_RGB",
    thumbnailUrl: "/gamus/DC_04_27_RGB.png",
    elevationRange: "9.8 m – 67.4 m AGL",
  },
  {
    id: "gamus-dc09",
    name: "GAMUS · DC_09_33 (Commercial & Complex Infrastructure)",
    region: "District of Columbia, USA",
    provider: "Earthflow / Hugging Face",
    role: "OPTICAL INPUT DATASET",
    category: "optical",
    coverage: "District of Columbia, USA (38.90°N, 77.02°W)",
    resolution: "0.30 m GSD",
    crs: "EPSG:32618 (WGS 84 / UTM zone 18N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 RGB GeoTIFF + AGL LiDAR",
    status: "Live Stream",
    description: "Multi-level institutional and commercial buildings with extensive flat roofs, parking structures, and complex shadows.",
    sampleId: "DC_09_33_RGB",
    thumbnailUrl: "/gamus/DC_09_33_RGB.png",
    elevationRange: "18.0 m – 92.1 m AGL",
  },
  {
    id: "gamus-dc10",
    name: "GAMUS · DC_10_30 (Dense Urban & High-Rise Infrastructure)",
    region: "District of Columbia, USA",
    provider: "Earthflow / Hugging Face",
    role: "OPTICAL INPUT DATASET",
    category: "optical",
    coverage: "District of Columbia, USA (38.90°N, 77.04°W)",
    resolution: "0.30 m GSD",
    crs: "EPSG:32618 (WGS 84 / UTM zone 18N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 RGB GeoTIFF + AGL LiDAR",
    status: "Live Stream",
    description: "Downtown urban canyon with multi-story facades, deep cast shadows, and challenging occlusion geometry.",
    sampleId: "DC_10_30_RGB",
    thumbnailUrl: "/gamus/DC_10_30_RGB.png",
    elevationRange: "21.5 m – 108.3 m AGL",
  },
  {
    id: "gamus-dc11-16",
    name: "GAMUS · DC_11_16 (Forest Reserve & Drainage Basin)",
    region: "District of Columbia, USA",
    provider: "Earthflow / Hugging Face",
    role: "OPTICAL INPUT DATASET",
    category: "optical",
    coverage: "District of Columbia, USA (38.93°N, 77.06°W)",
    resolution: "0.30 m GSD",
    crs: "EPSG:32618 (WGS 84 / UTM zone 18N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 RGB GeoTIFF + AGL LiDAR",
    status: "Live Stream",
    description: "Dense deciduous woodland reserve with dendritic drainage streams and continuous canopy roughness.",
    sampleId: "DC_11_16_RGB",
    thumbnailUrl: "/gamus/DC_11_16_RGB.png",
    elevationRange: "14.0 m – 78.5 m AGL",
  },
  {
    id: "gamus-dc11-33",
    name: "GAMUS · DC_11_33 (Steep Ridge & Mountain Escarpment)",
    region: "District of Columbia, USA",
    provider: "Earthflow / Hugging Face",
    role: "OPTICAL INPUT DATASET",
    category: "optical",
    coverage: "District of Columbia, USA (38.92°N, 77.08°W)",
    resolution: "0.30 m GSD",
    crs: "EPSG:32618 (WGS 84 / UTM zone 18N)",
    dimensions: "1,024 × 1,024 px",
    format: "1024×1024 RGB GeoTIFF + AGL LiDAR",
    status: "Live Stream",
    description: "Pronounced topographic ridge and steep slopes with severe elevation relief and varying solar incidence angles.",
    sampleId: "DC_11_33_RGB",
    thumbnailUrl: "/gamus/DC_11_33_RGB.png",
    elevationRange: "28.0 m – 134.2 m AGL",
  },

  // Open Reference DEMs
  {
    id: "copernicus-glo30",
    name: "Copernicus DEM GLO-30",
    region: "Global (Copernicus / TanDEM-X)",
    provider: "European Space Agency (ESA) / Airbus",
    role: "REFERENCE DSM",
    category: "dem",
    coverage: "Global (landmasses 84°N to 60°S)",
    resolution: "30 m (1 arc-second)",
    crs: "EPSG:4326 (WGS 84 2D)",
    dimensions: "Global Tiled 3600 × 3600 px",
    format: "Cloud-Optimized GeoTIFF (COG)",
    status: "Direct Access",
    description: "High-accuracy digital surface model derived from WorldDEM TanDEM-X interferometric SAR. Primary reference for regional scale calibration across Indian and global terrain.",
    sampleId: "DC_11_33_RGB",
    thumbnailUrl: "/gamus/DC_11_33_RGB.png",
    elevationRange: "-400 m to 8,848 m",
  },
  {
    id: "nasadem-srtm",
    name: "NASADEM / SRTM v3 Global 30m",
    region: "Global (NASA / NGA)",
    provider: "NASA JPL / USGS",
    role: "REFERENCE DEM",
    category: "dem",
    coverage: "Global (60°N to 56°S)",
    resolution: "30 m (1 arc-second)",
    crs: "EPSG:4326 (WGS 84 2D)",
    dimensions: "Global Tiled 3601 × 3601 px",
    format: "HGT / Cloud-Optimized GeoTIFF",
    status: "Direct Access",
    description: "Reprocessed Shuttle Radar Topography Mission data with void reduction, ICESat laser altimetry calibration, and updated geoid heights.",
    sampleId: "DC_04_23_RGB",
    thumbnailUrl: "/gamus/DC_04_23_RGB.png",
    elevationRange: "Global land surface",
  },
  {
    id: "alos-aw3d30",
    name: "ALOS World 3D (AW3D30)",
    region: "Global (JAXA PRISM)",
    provider: "JAXA (Japan Aerospace Exploration Agency)",
    role: "REFERENCE DSM",
    category: "dem",
    coverage: "Global",
    resolution: "30 m (stereo PRISM)",
    crs: "EPSG:4326 (WGS 84 2D)",
    dimensions: "Global Tiled 3600 × 3600 px",
    format: "GeoTIFF",
    status: "Available",
    description: "Global optical stereo DSM compiled from millions of PRISM optical stereo pairs onboard the ALOS satellite.",
    sampleId: "DC_11_16_RGB",
    thumbnailUrl: "/gamus/DC_11_16_RGB.png",
    elevationRange: "Global land surface",
  },

  // Benchmarks
  {
    id: "usgs-3dep",
    name: "USGS 3DEP (3D Elevation Program LiDAR)",
    region: "United States (Airborne LiDAR)",
    provider: "United States Geological Survey",
    role: "VALIDATION DATASET",
    category: "benchmark",
    coverage: "Conterminous US & Alaska",
    resolution: "1 m – 3 m High-Res DEM",
    crs: "EPSG:6349 (NAD83 2011 / UTM zone)",
    dimensions: "High-density Point Cloud / Raster",
    format: "Cloud-Optimized GeoTIFF / LAS",
    status: "Direct Access",
    description: "Survey-grade airborne LiDAR digital elevation models used for centimeter-level independent validation benchmarks.",
    sampleId: "DC_10_30_RGB",
    thumbnailUrl: "/gamus/DC_10_30_RGB.png",
    elevationRange: "Local relief up to 4,400 m",
  },
  {
    id: "isprs-potsdam",
    name: "ISPRS 2D/3D Urban Benchmark · Potsdam",
    region: "Potsdam, Brandenburg, Germany",
    provider: "ISPRS Commission III",
    role: "BENCHMARK DATASET",
    category: "benchmark",
    coverage: "Potsdam, Germany (52.40°N, 13.06°E)",
    resolution: "0.05 m GSD (Ultra-high res)",
    crs: "EPSG:25833 (ETRS89 / UTM zone 33N)",
    dimensions: "6,000 × 6,000 px Tiles",
    format: "TIFF + Matched LiDAR DSM",
    status: "Source Available",
    description: "Dense urban environment with varied architectural topologies. Provides strict independent error gate for depth refiner models.",
    sampleId: "DC_09_33_RGB",
    thumbnailUrl: "/gamus/DC_09_33_RGB.png",
    elevationRange: "20 m – 80 m a.s.l.",
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
      item.region.toLowerCase().includes(search.toLowerCase()) ||
      item.provider.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.coverage.toLowerCase().includes(search.toLowerCase()) ||
      item.role.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const indianCount = DATASET_CATALOG.filter((d) => d.category === "indian").length;
  const opticalCount = DATASET_CATALOG.filter((d) => d.category === "optical").length;
  const demCount = DATASET_CATALOG.filter((d) => d.category === "dem").length;
  const benchmarkCount = DATASET_CATALOG.filter((d) => d.category === "benchmark").length;

  return (
    <div className="bn-page-container">
      {/* Header */}
      <div className="bn-hero-banner">
        <div className="bn-hero-badge-row">
          <span className="bn-badge bn-badge--cyan">GEOSPATIAL CATALOG</span>
          <span className="bn-badge bn-badge--green">14 INDIAN TERRAIN REPOSITORIES (11 HIMALAYAN SITES)</span>
          <span className="bn-badge bn-badge--violet">{DATASET_CATALOG.length} CURATED DATASETS</span>
        </div>
        <h1 className="bn-page-headline">DepthWizard Indian Mountain & Geospatial Dataset Library</h1>
        <p className="bn-page-lead">
          Curated Earth observation datasets featuring authentic Indian mountain test sites (Joshimath, Kedarnath, Badrinath, Gangotri, Pithoragarh, Kinnaur, Spiti, Lahaul, Tawang, Sikkim/Kanchenjunga, Ladakh) with verified 2D optical orthophotos, metric DSM elevation models, and multi-LOD 3D terrain meshes.
        </p>

        <div className="bn-action-ribbon">
          <button className="dw-btn dw-btn--primary" onClick={onExploreGamus}>
            <DatasetIcon /> Open GAMUS Sample Explorer
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
            { id: "all", label: `All Datasets (${DATASET_CATALOG.length})` },
            { id: "indian", label: `Indian Mountains (${indianCount})` },
            { id: "optical", label: `Optical Ingest (${opticalCount})` },
            { id: "dem", label: `Reference DEMs (${demCount})` },
            { id: "benchmark", label: `Benchmarks (${benchmarkCount})` },
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
          placeholder="Search by region, mountain site, sensor, or format…"
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
                  <span>Region</span>
                  <span className="bn-stat-val">{item.region}</span>
                </div>
                <div className="bn-stat-row">
                  <span>Provider / Source</span>
                  <span className="bn-stat-val">{item.provider}</span>
                </div>
                <div className="bn-stat-row">
                  <span>Coverage</span>
                  <span className="bn-stat-val">{item.coverage}</span>
                </div>
                <div className="bn-stat-row">
                  <span>Resolution / GSD</span>
                  <span className="bn-stat-val">{item.resolution}</span>
                </div>
                <div className="bn-stat-row">
                  <span>CRS</span>
                  <span className="bn-stat-val">{item.crs}</span>
                </div>
                <div className="bn-stat-row">
                  <span>Dimensions</span>
                  <span className="bn-stat-val">{item.dimensions}</span>
                </div>
                {item.elevationRange && (
                  <div className="bn-stat-row">
                    <span>Elevation Range</span>
                    <span className="bn-stat-val">{item.elevationRange}</span>
                  </div>
                )}
                <div className="bn-stat-row">
                  <span>Format</span>
                  <span className="bn-stat-val">{item.format}</span>
                </div>
                <div className="bn-stat-row">
                  <span>Status</span>
                  <span className={`bn-stat-val ${item.status === "Cache Ready" ? "bn-text--success" : ""}`}>
                    ● {item.status}
                  </span>
                </div>
              </div>

              {item.sampleId && (
                <button
                  className="dw-btn dw-btn--primary bn-btn--full"
                  style={{ marginTop: "14px" }}
                  onClick={() => onSelectSample(item.sampleId!)}
                >
                  ⚡ Load Sample into Workspace
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
