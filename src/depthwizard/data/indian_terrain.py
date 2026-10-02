"""DepthWizard Indian Terrain Dataset Provider.

Defines geospatial metadata, sensor specifications, elevation envelopes, and reference DEM
sources for representative Indian terrain environments (Himalayas, Western Ghats, Eastern Ghats,
Ladakh high-altitude, Northeast mountainous, Deccan Plateau, and Urban Foothills).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class IndianTerrainRegion:
    id: str
    name: str
    region: str
    state: str
    terrain_type: str
    latitude: float
    longitude: float
    elevation_range_m: tuple[float, float]
    recommended_crs: str
    nominal_gsd_m: float
    primary_sensors: list[str]
    reference_dem_sources: list[str]
    access_requirements: str
    description: str
    sample_available: bool = False
    sample_project_path: str | None = None
    thumbnail_url: str | None = None

    def as_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "region": self.region,
            "state": self.state,
            "terrain_type": self.terrain_type,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "elevation_range_m": list(self.elevation_range_m),
            "recommended_crs": self.recommended_crs,
            "nominal_gsd_m": self.nominal_gsd_m,
            "primary_sensors": self.primary_sensors,
            "reference_dem_sources": self.reference_dem_sources,
            "access_requirements": self.access_requirements,
            "description": self.description,
            "sample_available": self.sample_available,
            "sample_project_path": self.sample_project_path,
            "thumbnail_url": self.thumbnail_url,
        }


# Authoritative specifications for Indian terrain environments
INDIAN_TERRAIN_REGIONS: list[IndianTerrainRegion] = [
    IndianTerrainRegion(
        id="himalayas_joshimath",
        name="Himalayan Alpine & Glaciated Terrain",
        region="Joshimath / Chamoli / Nanda Devi",
        state="Uttarakhand",
        terrain_type="Extreme Relief / Glaciated Alpine Valleys",
        latitude=30.5564,
        longitude=79.5670,
        elevation_range_m=(1789.0, 5510.0),
        recommended_crs="EPSG:32644",
        nominal_gsd_m=2.5,
        primary_sensors=["Cartosat-2/3 PAN/MX", "Sentinel-2 MSI", "Resourcesat-2 LISS-4"],
        reference_dem_sources=[
            "CartoDEM 30m (ISRO Bhuvan)",
            "Copernicus DEM GLO-30",
            "NASADEM / SRTM 30m",
            "ALOS AW3D30",
        ],
        access_requirements="Open access for Copernicus GLO-30 and SRTM 30m. CartoDEM requires registered ISRO Bhuvan / Bhoonidhi account.",
        description="High-altitude Himalayan valley featuring precipitous mountain slopes, deep river gorges, glaciated summits, and extreme relief around Nanda Devi and Trishul. Primary testbed for disaster management and landslide hazard modeling.",
        sample_available=True,
        sample_project_path="data/indian_terrains/himalayas_joshimath",
        thumbnail_url="/indian_mountains/himalayas_joshimath.png",
    ),
    IndianTerrainRegion(
        id="western_ghats_kudremukh",
        name="Western Ghats Escarpments & Dense Canopy",
        region="Kudremukh / Sahyadri Range",
        state="Karnataka",
        terrain_type="Steep Escarpments / Dense Tropical Montane",
        latitude=13.1300,
        longitude=75.2500,
        elevation_range_m=(650.0, 1894.0),
        recommended_crs="EPSG:32643",
        nominal_gsd_m=1.5,
        primary_sensors=["Cartosat-2/3 PAN/MX", "Sentinel-2 MSI", "RISAT-1A / EOS-04 SAR"],
        reference_dem_sources=[
            "CartoDEM 30m (ISRO Bhuvan)",
            "Copernicus DEM GLO-30",
            "SRTM 30m",
        ],
        access_requirements="Open access for Copernicus GLO-30. CartoDEM available via NRSC Bhoonidhi.",
        description="Complex dissected basalt escarpments with heavy monsoonal vegetation cover, knife-edge ridgelines, and precipitous west-facing drops towards the Konkan coastal plain. Challenges monocular depth estimators with dense forest canopy.",
        sample_available=True,
        sample_project_path="data/indian_terrains/western_ghats_kudremukh",
        thumbnail_url="/indian_mountains/western_ghats_kudremukh.png",
    ),
    IndianTerrainRegion(
        id="ladakh_leh",
        name="Ladakh High-Altitude Cold Desert",
        region="Leh / Indus River Valley",
        state="Ladakh (UT)",
        terrain_type="Cold Desert / Barren Rocky Scree / High Altitude",
        latitude=34.1526,
        longitude=77.5771,
        elevation_range_m=(3200.0, 5850.0),
        recommended_crs="EPSG:32643",
        nominal_gsd_m=2.0,
        primary_sensors=["Cartosat-3 High-Res PAN", "Sentinel-2 MSI", "Landsat-8/9 OLI"],
        reference_dem_sources=[
            "CartoDEM 30m (ISRO Bhuvan)",
            "Copernicus DEM GLO-30",
            "ALOS World 3D-30m",
        ],
        access_requirements="Open access for Copernicus GLO-30 and ALOS. Sensitive border region data governed by National Geospatial Policy.",
        description="Extreme high-altitude arid environment with bare rock topography, alluvial fan formations, sparse vegetation, and high shadow contrast along the Indus River valley. Validates shadow-to-height inversion without canopy interference.",
        sample_available=True,
        sample_project_path="data/indian_terrains/ladakh_leh",
        thumbnail_url="/indian_mountains/ladakh_leh.png",
    ),
    IndianTerrainRegion(
        id="eastern_ghats_araku",
        name="Eastern Ghats Dissected Highlands",
        region="Araku Valley / Ananthagiri Hills",
        state="Andhra Pradesh",
        terrain_type="Dissected Weathered Ridges & Plateaus",
        latitude=18.3273,
        longitude=82.8775,
        elevation_range_m=(600.0, 1680.0),
        recommended_crs="EPSG:32644",
        nominal_gsd_m=2.0,
        primary_sensors=["Resourcesat-2 LISS-4", "Cartosat-2", "Sentinel-2 MSI"],
        reference_dem_sources=[
            "CartoDEM 30m (ISRO Bhuvan)",
            "Copernicus DEM GLO-30",
            "NASADEM 30m",
        ],
        access_requirements="Open access for Copernicus GLO-30 and SRTM 30m.",
        description="Ancient Precambrian weathered hill ranges characterized by undulating valleys, bauxite-capped plateaus, and semi-evergreen forest patches. Tests elevation continuity across rolling, moderately sloped terrain.",
        sample_available=True,
        sample_project_path="data/indian_terrains/eastern_ghats_araku",
        thumbnail_url="/indian_mountains/eastern_ghats_araku.png",
    ),
    IndianTerrainRegion(
        id="northeast_tawang",
        name="Northeast Mountainous & Canyon Terrain",
        region="Tawang / Eastern Himalayas",
        state="Arunachal Pradesh",
        terrain_type="Rugged Montane / Deep Fluvial Canyons",
        latitude=27.5861,
        longitude=91.8594,
        elevation_range_m=(2100.0, 4800.0),
        recommended_crs="EPSG:32645",
        nominal_gsd_m=2.0,
        primary_sensors=["Cartosat-2/3 PAN/MX", "Sentinel-2 MSI", "EOS-04 C-band SAR"],
        reference_dem_sources=[
            "CartoDEM 30m (ISRO Bhuvan)",
            "Copernicus DEM GLO-30",
            "AW3D30",
        ],
        access_requirements="Open access for Copernicus GLO-30. CartoDEM via NRSC Bhoonidhi.",
        description="Deeply incised V-shaped valleys, torrential river gorges, dense temperate coniferous forests, and persistent cloud cover. Highlights the power of single-view height estimation when stereo passes are blocked by weather.",
        sample_available=True,
        sample_project_path="data/indian_terrains/northeast_tawang",
        thumbnail_url="/indian_mountains/northeast_tawang.png",
    ),
    IndianTerrainRegion(
        id="deccan_plateau_pune",
        name="Deccan Traps Basalt Mesa & Plateau",
        region="Sinhagad / Western Deccan Plateau",
        state="Maharashtra",
        terrain_type="Basalt Mesa / Stepped Terrace Topography",
        latitude=18.3664,
        longitude=73.7558,
        elevation_range_m=(580.0, 1312.0),
        recommended_crs="EPSG:32643",
        nominal_gsd_m=1.5,
        primary_sensors=["Cartosat-2/3 PAN/MX", "Resourcesat-2 LISS-4", "Sentinel-2 MSI"],
        reference_dem_sources=[
            "CartoDEM 30m (ISRO Bhuvan)",
            "Copernicus DEM GLO-30",
            "SRTM 30m",
        ],
        access_requirements="Open access for Copernicus GLO-30 and SRTM.",
        description="Terraced trap topography formed by historic basalt lava flows, featuring distinct flat-topped hills (mesas), steep vertical scarps, and broad valley floors. Excellent for testing step-edge preservation in DSMs.",
        sample_available=True,
        sample_project_path="data/indian_terrains/deccan_plateau_pune",
        thumbnail_url="/indian_mountains/deccan_plateau_pune.png",
    ),
    IndianTerrainRegion(
        id="urban_foothills_dehradun",
        name="Shivalik Foothills & Urban Transition",
        region="Dehradun Valley / Shivalik Range",
        state="Uttarakhand",
        terrain_type="Urban-to-Montane Transition / Foothill Belt",
        latitude=30.3165,
        longitude=78.0322,
        elevation_range_m=(450.0, 1150.0),
        recommended_crs="EPSG:32644",
        nominal_gsd_m=0.3,
        primary_sensors=["Cartosat-3 Very High Resolution (0.28m)", "Aerial Orthophoto"],
        reference_dem_sources=[
            "Survey of India (SoI) Large Scale Mapping (LSM)",
            "CartoDEM 30m",
            "Copernicus DEM GLO-30",
        ],
        access_requirements="Open access for Copernicus GLO-30. High-resolution SoI data accessible under National Geospatial Guidelines.",
        description="Intermontane structural valley (Doon Valley) presenting a mix of dense urban settlements, planned building footprints, riverbed terraces, and immediate foothill forest slopes. Tests building height extraction alongside terrain elevation.",
        sample_available=False,
    ),
]


class IndianTerrainProvider:
    """Abstraction provider for Indian remote sensing terrain datasets and DEM anchors."""

    def __init__(self, data_root: Path | str | None = None) -> None:
        self.data_root = Path(data_root).resolve() if data_root else Path("data").resolve()
        self._regions_by_id = {r.id: r for r in INDIAN_TERRAIN_REGIONS}

    def list_regions(self) -> list[IndianTerrainRegion]:
        """Return all supported Indian terrain regions with metadata."""
        return list(INDIAN_TERRAIN_REGIONS)

    def get_region(self, region_id: str) -> IndianTerrainRegion | None:
        """Lookup region by identifier."""
        return self._regions_by_id.get(region_id)

    def get_sample_project_path(self, region_id: str) -> Path | None:
        """Return verified local sample project path if bundled."""
        region = self.get_region(region_id)
        if region is None or not region.sample_available or not region.sample_project_path:
            return None
        candidate = (self.data_root / ".." / region.sample_project_path).resolve()
        if candidate.is_dir() and (candidate / "project-manifest.json").is_file():
            return candidate
        # Direct relative check
        direct = Path(region.sample_project_path).resolve()
        if direct.is_dir() and (direct / "project-manifest.json").is_file():
            return direct
        return None

    def export_catalog_json(self) -> list[dict[str, Any]]:
        """Return JSON-serializable list of all Indian terrain catalog items."""
        return [r.as_dict() for r in INDIAN_TERRAIN_REGIONS]
