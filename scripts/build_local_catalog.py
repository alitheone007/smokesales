#!/usr/bin/env python3
"""Build the storefront catalogue from the operator-provided image_results.csv."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import shutil
from collections import Counter
from pathlib import Path
from urllib.parse import unquote, urlsplit


CATEGORY_RULES = [
    ("Water pipes & glass", ("waterpipe", "water pipe", "bong", "bubbler", "beaker", "dab rig", "ash catcher")),
    ("Hand pipes", ("hand pipe", "spoon pipe", "chillum", "one hitter", "one-hitter", "steamroller")),
    ("Rolling papers & wraps", ("rolling paper", "wrap", "blunt", "hemp paper")),
    ("Cones & rolling accessories", ("cone", "rolling tray", "rolling machine", "roller", "tips", "filter")),
    ("Grinders & scales", ("grinder", "scale")),
    ("Lighters & torches", ("lighter", "torch", "butane")),
    ("Hookah", ("hookah", "shisha", "charcoal")),
    ("Storage & odor control", ("stash", "safe can", "storage", "odor", "smell proof")),
    ("Cleaning & detox", ("cleaner", "cleaning", "detox", "cleanse")),
    ("Vape accessories", ("vape", "vaporizer", "battery", "cartridge", "510")),
    ("Novelty & gifts", ("novelty", "poster", "backpack", "mug", "apparel", "cap", "beanie")),
    ("C-store", ("snack", "candy", "drink", "soda")),
]


def category_for(name: str) -> str:
    lowered = name.casefold()
    for category, needles in CATEGORY_RULES:
        if any(needle in lowered for needle in needles):
            return category
    return "Smoke accessories"


def product_id(page: str) -> str:
    slug = Path(unquote(urlsplit(page).path)).stem
    return slug or hashlib.sha256(page.encode()).hexdigest()[:16]


def build(csv_path: Path, image_root: Path, public_root: Path, copy_images: bool) -> dict:
    public_catalog = public_root / "catalog"
    destination_images = public_catalog / "images"
    public_catalog.mkdir(parents=True, exist_ok=True)
    if copy_images:
        destination_images.mkdir(parents=True, exist_ok=True)

    with csv_path.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))

    available_images = {path.name: path for path in image_root.iterdir() if path.is_file()}
    products = []
    missing = []
    copied: set[str] = set()
    categories: Counter[str] = Counter()
    for row in rows:
        relative = Path(row["local_path"].replace("\\", "/"))
        if relative.is_absolute() or ".." in relative.parts or relative.parent.as_posix().casefold() != "downloaded_images/full":
            raise ValueError(f"unsafe image path: {relative}")
        source = available_images.get(relative.name)
        if source is None:
            missing.append(str(relative))
            continue
        filename = source.name
        if copy_images and filename not in copied:
            shutil.copy2(source, destination_images / filename)
            copied.add(filename)
        name = re.sub(r"\s+", " ", row["image_name"]).strip() or "Unnamed product"
        category = category_for(name)
        categories[category] += 1
        products.append({
            "id": product_id(row["page"]),
            "name": name,
            "category": category,
            "image": f"catalog/images/{filename}",
            "sourcePage": row["page"],
            "sourceImage": row["image_url"],
        })

    products.sort(key=lambda item: (item["name"].casefold(), item["id"]))
    payload = {"generatedFrom": csv_path.name, "count": len(products), "products": products}
    (public_catalog / "products.json").write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    summary = {
        "rows": len(rows),
        "products": len(products),
        "uniqueProductPages": len({p["sourcePage"] for p in products}),
        "uniqueImageUrls": len({p["sourceImage"] for p in products}),
        "uniqueImageFiles": len({p["image"] for p in products}),
        "missingFiles": len(missing),
        "categories": dict(sorted(categories.items())),
    }
    (public_catalog / "summary.json").write_text(json.dumps(summary, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return summary


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", type=Path, required=True)
    parser.add_argument("--image-root", type=Path, required=True)
    parser.add_argument("--public-root", type=Path, default=Path("web/public"))
    parser.add_argument("--copy-images", action="store_true")
    args = parser.parse_args()
    print(json.dumps(build(args.csv, args.image_root, args.public_root, args.copy_images), indent=2))


if __name__ == "__main__":
    main()

