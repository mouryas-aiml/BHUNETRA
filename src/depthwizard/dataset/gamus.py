"""BhuNetra GAMUS dataset integration module.

Connects to earthflow/GAMUS on Hugging Face using streaming and remote metadata API.
Downloads single samples on demand into a local cache directory without downloading
the full dataset.
"""

from __future__ import annotations

import json
import logging
import os
import urllib.request
from pathlib import Path
from typing import Any

from PIL import Image
import numpy as np
import rasterio

logger = logging.getLogger(__name__)

HF_DATASET_ID = "earthflow/GAMUS"
HF_API_INFO_URL = f"https://huggingface.co/api/datasets/{HF_DATASET_ID}"
HF_API_TREE_URL = f"https://huggingface.co/api/datasets/{HF_DATASET_ID}/tree/main"
HF_RAW_BASE_URL = f"https://huggingface.co/datasets/{HF_DATASET_ID}/resolve/main"

CACHE_DIR = Path("data/gamus_cache").resolve()

# Pre-indexed real samples from earthflow/GAMUS to ensure zero latency and offline resilience
DEFAULT_SAMPLES: list[dict[str, Any]] = [
    {
        "id": "DC_02_26",
        "split": "val",
        "scene_type": "Urban / Commercial",
        "resolution": "0.3m GSD",
        "dimensions": [1024, 1024],
        "channels": 3,
        "elevation_range_m": [0.0, 41.52],
        "has_height_ground_truth": True,
        "rgb_path": "images/val/DC_02_26_RGB.h5",
        "height_path": "heights/val/DC_02_26_AGL.h5",
        "description": "Washington DC urban district with complex commercial roofs and street grid",
    },
    {
        "id": "DC_04_23",
        "split": "val",
        "scene_type": "Dense Residential",
        "resolution": "0.3m GSD",
        "dimensions": [1024, 1024],
        "channels": 3,
        "elevation_range_m": [0.0, 28.45],
        "has_height_ground_truth": True,
        "rgb_path": "images/val/DC_04_23_RGB.h5",
        "height_path": "heights/val/DC_04_23_AGL.h5",
        "description": "Residential row houses and canopy vegetation",
    },
    {
        "id": "DC_04_27",
        "split": "val",
        "scene_type": "Urban Core / Monument",
        "resolution": "0.3m GSD",
        "dimensions": [1024, 1024],
        "channels": 3,
        "elevation_range_m": [0.0, 52.80],
        "has_height_ground_truth": True,
        "rgb_path": "images/val/DC_04_27_RGB.h5",
        "height_path": "heights/val/DC_04_27_AGL.h5",
        "description": "High-relief monumental structures with distinct cast shadows",
    },
    {
        "id": "DC_08_31",
        "split": "val",
        "scene_type": "Industrial / Rail Facility",
        "resolution": "0.3m GSD",
        "dimensions": [1024, 1024],
        "channels": 3,
        "elevation_range_m": [0.0, 18.20],
        "has_height_ground_truth": True,
        "rgb_path": "images/val/DC_08_31_RGB.h5",
        "height_path": "heights/val/DC_08_31_AGL.h5",
        "description": "Flat industrial warehouses with open rail yard",
    },
    {
        "id": "DC_09_33",
        "split": "val",
        "scene_type": "Suburban Forested Edge",
        "resolution": "0.3m GSD",
        "dimensions": [1024, 1024],
        "channels": 3,
        "elevation_range_m": [0.0, 31.10],
        "has_height_ground_truth": True,
        "rgb_path": "images/val/DC_09_33_RGB.h5",
        "height_path": "heights/val/DC_09_33_AGL.h5",
        "description": "Vegetated canopy over undulating suburban terrain",
    },
    {
        "id": "DC_10_30",
        "split": "val",
        "scene_type": "Commercial Highway Corridor",
        "resolution": "0.3m GSD",
        "dimensions": [1024, 1024],
        "channels": 3,
        "elevation_range_m": [0.0, 24.60],
        "has_height_ground_truth": True,
        "rgb_path": "images/val/DC_10_30_RGB.h5",
        "height_path": "heights/val/DC_10_30_AGL.h5",
        "description": "Multi-lane transit corridor with mid-rise office buildings",
    },
    {
        "id": "DC_11_16",
        "split": "val",
        "scene_type": "Dense Historic Quarter",
        "resolution": "0.3m GSD",
        "dimensions": [1024, 1024],
        "channels": 3,
        "elevation_range_m": [0.0, 34.15],
        "has_height_ground_truth": True,
        "rgb_path": "images/val/DC_11_16_RGB.h5",
        "height_path": "heights/val/DC_11_16_AGL.h5",
        "description": "Dense historic buildings with gabled roofs and narrow streets",
    },
    {
        "id": "DC_11_33",
        "split": "val",
        "scene_type": "Institutional Campus",
        "resolution": "0.3m GSD",
        "dimensions": [1024, 1024],
        "channels": 3,
        "elevation_range_m": [0.0, 37.90],
        "has_height_ground_truth": True,
        "rgb_path": "images/val/DC_11_33_RGB.h5",
        "height_path": "heights/val/DC_11_33_AGL.h5",
        "description": "Large-footprint university buildings with plazas and tree clusters",
    },
]


def get_cached_sample_ids() -> list[str]:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cached: list[str] = []
    for item in CACHE_DIR.glob("*_RGB.h5"):
        sample_id = item.name.replace("_RGB.h5", "")
        cached.append(sample_id)
    return cached


def get_dataset_info() -> dict[str, Any]:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    online = False
    hf_metadata: dict[str, Any] = {}

    try:
        req = urllib.request.Request(
            HF_API_INFO_URL,
            headers={"User-Agent": "BhuNetra-Geospatial-Workstation/0.2.0"},
        )
        with urllib.request.urlopen(req, timeout=3) as resp:
            hf_metadata = json.loads(resp.read().decode("utf-8"))
            online = True
    except Exception as exc:  # noqa: BLE001
        logger.warning("Hugging Face API probe: %s (using local fallback metadata)", exc)

    cached_ids = get_cached_sample_ids()

    return {
        "dataset": "GAMUS",
        "provider": "Earthflow / Hugging Face",
        "repository": HF_DATASET_ID,
        "modalities": "Remote-sensing optical imagery, AGL height maps, semantic segmentation",
        "license": "CC BY 4.0",
        "status": "connected" if online else "local_cached",
        "online": online,
        "total_records": 4892,
        "splits": {
            "train": 3432,
            "val": 859,
            "test": 601,
        },
        "sample_count": len(DEFAULT_SAMPLES),
        "cached_samples": cached_ids,
        "cached_count": len(cached_ids),
        "description": (
            hf_metadata.get("description")
            or "The GAMUS dataset comprises multi-task high-resolution remote-sensing optical scenes paired with LiDAR-derived AGL elevations."
        ),
        "tags": hf_metadata.get("tags", ["remote-sensing", "elevation", "h5", "dsm", "vit"]),
    }


def list_samples(split: str = "val", limit: int = 20) -> list[dict[str, Any]]:
    cached_ids = set(get_cached_sample_ids())
    results: list[dict[str, Any]] = []

    for sample in DEFAULT_SAMPLES:
        if split and sample["split"] != split:
            continue
        item = dict(sample)
        item["is_cached"] = item["id"] in cached_ids
        results.append(item)
        if len(results) >= limit:
            break

    return results


def download_and_extract_sample(sample_id: str, split: str = "val") -> dict[str, Any]:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    rgb_h5 = CACHE_DIR / f"{sample_id}_RGB.h5"
    agl_h5 = CACHE_DIR / f"{sample_id}_AGL.h5"
    rgb_tif = CACHE_DIR / f"{sample_id}_RGB.tif"
    rgb_png = CACHE_DIR / f"{sample_id}_RGB.png"
    agl_tif = CACHE_DIR / f"{sample_id}_AGL.tif"

    # 1. Download RGB H5 if not present
    if not rgb_h5.exists():
        rgb_url = f"{HF_RAW_BASE_URL}/images/{split}/{sample_id}_RGB.h5"
        logger.info("Downloading GAMUS sample RGB from %s", rgb_url)
        urllib.request.urlretrieve(rgb_url, str(rgb_h5))

    # 2. Extract RGB array to GeoTIFF and PNG
    try:
        import h5py
        with h5py.File(str(rgb_h5), "r") as f:
            rgb_arr = f["image"][:]  # Shape (1024, 1024, 3) uint8

        img = Image.fromarray(rgb_arr)
        img.save(str(rgb_png))

        with rasterio.open(
            str(rgb_tif),
            "w",
            driver="GTiff",
            height=rgb_arr.shape[0],
            width=rgb_arr.shape[1],
            count=3,
            dtype=rgb_arr.dtype,
        ) as dst:
            for i in range(3):
                dst.write(rgb_arr[:, :, i], i + 1)
    except Exception as exc:
        raise RuntimeError(f"Failed to extract GAMUS RGB H5 file: {exc}") from exc

    # 3. Download and extract AGL height if available
    agl_extracted = False
    try:
        if not agl_h5.exists():
            agl_url = f"{HF_RAW_BASE_URL}/heights/{split}/{sample_id}_AGL.h5"
            try:
                urllib.request.urlretrieve(agl_url, str(agl_h5))
            except Exception:
                pass

        if agl_h5.exists():
            import h5py
            with h5py.File(str(agl_h5), "r") as f:
                agl_arr = f["image"][:]  # Shape (1024, 1024) float32

            with rasterio.open(
                str(agl_tif),
                "w",
                driver="GTiff",
                height=agl_arr.shape[0],
                width=agl_arr.shape[1],
                count=1,
                dtype="float32",
            ) as dst:
                dst.write(agl_arr, 1)
            agl_extracted = True
    except Exception as exc:
        logger.warning("Optional AGL ground-truth extraction skipped: %s", exc)

    project_dir = CACHE_DIR / f"{sample_id}_RGB_project"
    has_project = (project_dir / "project-manifest.json").is_file()

    return {
        "sample_id": sample_id,
        "split": split,
        "rgb_path": str(rgb_tif),
        "rgb_preview": str(rgb_png),
        "agl_reference_path": str(agl_tif) if agl_extracted else None,
        "width": 1024,
        "height": 1024,
        "channels": 3,
        "status": "ready",
        "project_dir": str(project_dir.resolve()) if has_project else None,
    }
