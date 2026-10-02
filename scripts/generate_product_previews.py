#!/usr/bin/env python3
"""
Generate high-fidelity scientific colormapped PNG preview images
for all Indian mountain dataset products (DSM, rDSM, Slope, Hillshade, Contours, Confidence, Residual).
"""

from pathlib import Path
import numpy as np
import rasterio
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.cm as cm
from PIL import Image

REGIONS_DIR = Path("data/indian_terrains")
PUBLIC_PROJECTS_DIR = Path("apps/desktop/public/projects")

def calculate_hillshade(elev: np.ndarray, gsd: float = 2.0, azimuth: float = 315.0, altitude: float = 45.0) -> np.ndarray:
    azimuth_rad = np.radians(azimuth)
    altitude_rad = np.radians(altitude)
    gy, gx = np.gradient(elev, gsd, gsd)
    slope_rad = np.arctan(np.sqrt(gx**2 + gy**2))
    aspect_rad = np.arctan2(-gx, gy)
    shaded = (
        np.sin(altitude_rad) * np.cos(slope_rad)
        + np.cos(altitude_rad) * np.sin(slope_rad) * np.cos(azimuth_rad - aspect_rad)
    )
    return np.clip((shaded + 1.0) / 2.0, 0.0, 1.0)

def generate_contours_overlay(elev: np.ndarray, interval_m: float = 100.0) -> np.ndarray:
    norm_elev = (elev - np.nanmin(elev)) / (np.nanmax(elev) - np.nanmin(elev) + 1e-6)
    cmap = matplotlib.colormaps["terrain"]
    rgba = cmap(norm_elev)
    # Generate contour lines
    mod = np.abs((elev % interval_m) - (interval_m / 2.0))
    line_mask = mod < (interval_m * 0.06)
    rgba[line_mask, 0:3] = 0.1  # dark lines
    return (rgba * 255).astype(np.uint8)

def main():
    region_dirs = [d for d in REGIONS_DIR.iterdir() if d.is_dir()]
    print(f"Found {len(region_dirs)} regional terrain datasets.")

    for rdir in region_dirs:
        prod_dir = rdir / "products"
        if not prod_dir.exists():
            continue
        print(f"Processing scientific preview rasters for {rdir.name}...")
        public_prod_dir = PUBLIC_PROJECTS_DIR / rdir.name / "products"
        public_prod_dir.mkdir(parents=True, exist_ok=True)

        dsm_path = prod_dir / "dsm.tif"
        if not dsm_path.exists():
            continue

        with rasterio.open(dsm_path) as src:
            dsm = src.read(1).astype(np.float32)

        rdsm_path = prod_dir / "rdsm.tif"
        with rasterio.open(rdsm_path) as src:
            rdsm = src.read(1).astype(np.float32)

        slope_path = prod_dir / "slope.tif"
        with rasterio.open(slope_path) as src:
            slope = src.read(1).astype(np.float32)

        conf_path = prod_dir / "confidence.tif"
        with rasterio.open(conf_path) as src:
            confidence = src.read(1).astype(np.float32)

        res_path = prod_dir / "residual.tif"
        with rasterio.open(res_path) as src:
            residual = src.read(1).astype(np.float32)

        # 1. DSM preview (Turbo colormap)
        dsm_norm = (dsm - np.nanmin(dsm)) / (np.nanmax(dsm) - np.nanmin(dsm) + 1e-6)
        dsm_img = Image.fromarray((cm.turbo(dsm_norm)[:, :, :3] * 255).astype(np.uint8))
        dsm_img.save(prod_dir / "dsm.png")
        dsm_img.save(public_prod_dir / "dsm.png")

        # 2. rDSM preview (Viridis colormap)
        rdsm_norm = np.clip(rdsm, 0.0, 1.0)
        rdsm_img = Image.fromarray((cm.viridis(rdsm_norm)[:, :, :3] * 255).astype(np.uint8))
        rdsm_img.save(prod_dir / "rdsm.png")
        rdsm_img.save(public_prod_dir / "rdsm.png")

        # 3. Slope preview (Magma colormap)
        slope_norm = np.clip(slope / 60.0, 0.0, 1.0)
        slope_img = Image.fromarray((cm.magma(slope_norm)[:, :, :3] * 255).astype(np.uint8))
        slope_img.save(prod_dir / "slope.png")
        slope_img.save(public_prod_dir / "slope.png")

        # 4. Hillshade preview (Greys colormap)
        hillshade = calculate_hillshade(dsm)
        hillshade_img = Image.fromarray((cm.gray(hillshade)[:, :, :3] * 255).astype(np.uint8))
        hillshade_img.save(prod_dir / "hillshade.png")
        hillshade_img.save(public_prod_dir / "hillshade.png")

        # 5. Contours preview
        contour_rgba = generate_contours_overlay(dsm, interval_m=100.0)
        contour_img = Image.fromarray(contour_rgba[:, :, :3])
        contour_img.save(prod_dir / "contours.png")
        contour_img.save(public_prod_dir / "contours.png")

        # 6. Confidence preview (Cividis/YlGn colormap)
        conf_norm = np.clip(confidence, 0.0, 1.0)
        conf_img = Image.fromarray((cm.cividis(conf_norm)[:, :, :3] * 255).astype(np.uint8))
        conf_img.save(prod_dir / "confidence.png")
        conf_img.save(public_prod_dir / "confidence.png")

        # 7. Residual preview (Coolwarm colormap)
        res_norm = np.clip((residual + 3.0) / 6.0, 0.0, 1.0)
        res_img = Image.fromarray((cm.coolwarm(res_norm)[:, :, :3] * 255).astype(np.uint8))
        res_img.save(prod_dir / "residual.png")
        res_img.save(public_prod_dir / "residual.png")

    print("All scientific raster previews generated successfully.")

if __name__ == "__main__":
    main()
