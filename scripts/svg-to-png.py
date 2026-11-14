#!/usr/bin/env python3
"""Rasterise SVGs to PNG with headless Chromium. Usage: python3 scripts/svg-to-png.py a.svg [b.svg ...] [--scale 1]"""
import sys, re, pathlib
from playwright.sync_api import sync_playwright
args = sys.argv[1:]; scale = 1
if "--scale" in args: i = args.index("--scale"); scale = float(args[i + 1]); del args[i:i + 2]
with sync_playwright() as p:
    b = p.chromium.launch()
    for f in args:
        f = pathlib.Path(f).resolve(); svg = f.read_text()
        W, H = map(int, re.search(r'width="(\d+)" height="(\d+)"', svg).groups())
        pg = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=scale)
        pg.goto(f.as_uri()); pg.screenshot(path=str(f.with_suffix(".png"))); pg.close()
        print("✓", f.with_suffix(".png").name)
    b.close()
