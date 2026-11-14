#!/usr/bin/env python3
"""Axmed "strata" art: layered data-terrain ridges with dusty edges, vertical striation and grain.
Reads as many sources settling into one shape (knowledge, supply, demand pooled into one route).
Usage:
  python3 scripts/make-terrain.py                      -> stills, all palettes, 3 sizes
  python3 scripts/make-terrain.py --animate brand 1080x1350 8   -> MP4 loop (palette, size, seconds)
Deterministic per palette seed."""
import sys, pathlib, subprocess, tempfile, math
import numpy as np
from PIL import Image

OUT = pathlib.Path(__file__).resolve().parent.parent / "brand/strata"; OUT.mkdir(parents=True, exist_ok=True)
PAL = {
    # sky, deep field, then layers back -> front
    "brand": {"sky": "#0C0A26", "field": "#2B2F8F", "seed": 4,
              "layers": ["#3F48B0", "#8D86C9", "#B6B0E0", "#5A47EB", "#9FE6FF", "#D9D6F0", "#0CC4FF", "#EEF0FA", "#7C83D6", "#392AB0"]},
    "warm":  {"sky": "#0C0A26", "field": "#2B2F8F", "seed": 8,
              "layers": ["#3F48B0", "#B6B0E0", "#F2C9A0", "#8D86C9", "#F6A57A", "#9FE6FF", "#FFE3B8", "#D9D6F0", "#EE8A64", "#392AB0"]},
    "light": {"sky": "#F7F6F3", "field": "#DEDAF2", "seed": 6,
              "layers": ["#CBC5EA", "#E6F6FC", "#B6B0E0", "#9FE6FF", "#EEEBF8", "#8D86C9", "#C9EEFA", "#FFFFFF", "#ABA5DA", "#7C83D6"]},
}
hexrgb = lambda h: np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32)

def smooth_noise(n, rng, scales=((0.0012, 1.0), (0.0035, .35), (0.011, .07)), phase=0.0):
    x = np.arange(n, dtype=np.float32); out = np.zeros(n, np.float32)
    for f, a in scales:
        k = rng.uniform(0, 1000); out += a * np.sin((x + k) * f * 2 * np.pi + phase)
        out += a * .5 * np.sin((x * 1.6 + k * 3) * f * np.pi - phase)
    return out

def render(name, W, H, t=0.0):
    p = PAL[name]; rng = np.random.default_rng(p["seed"])
    img = np.zeros((H, W, 3), np.float32); img[:] = hexrgb(p["sky"])
    yy = np.arange(H, dtype=np.float32)[:, None]
    # the deep field: a big ridge that takes most of the frame
    base = H * .16 + H * .06 * smooth_noise(W, np.random.default_rng(p["seed"] + 99), phase=t) + (np.arange(W) / W) * H * .10
    img = np.where(yy > base[None, :], hexrgb(p["field"]), img)[..., :] if False else img
    m = (yy > base[None, :])[..., None]; img = img * (1 - m) + hexrgb(p["field"]) * m
    # strata: each layer is a ridge band whose top is a noisy line sloping down to the right
    n = len(p["layers"]); xs = np.arange(W, dtype=np.float32); slope = (xs / W) ** 1.3 * H * .26
    for k, col in enumerate(p["layers"]):
        r = np.random.default_rng(p["seed"] * 31 + k)
        top = H * (.24 + .045 * k) + H * .06 * smooth_noise(W, r, phase=t) + slope
        if k < 4:                                                     # a few tall crests at the back, like the reference
            cx, w_ = r.uniform(.12, .55) * W, r.uniform(.06, .14) * W
            top = top - H * r.uniform(.08, .18) * np.exp(-((xs - cx - math.sin(t) * W * .02) / w_) ** 2)
        thick = np.full(W, H * .22, np.float32)
        bot = np.full(W, H * 2.0, np.float32)
        c = hexrgb(col)
        stri = np.convolve(r.normal(0, 1, W), np.ones(5) / 5, "same").astype(np.float32)[None, :]   # fine vertical striation
        inside = (yy >= top[None, :]) & (yy <= bot[None, :])
        d = np.clip((top[None, :] - yy) / (H * .03), -5, 50)                                                     # dusty crest
        dust = (d > 0) & (d < 1.6) & (r.random((H, W)) < np.exp(-d * 2.2) * .5)
        mask = inside | dust
        shade = 1 + .06 * stri + .045 * r.normal(0, 1, (H, W)).astype(np.float32)
        fade = np.clip(1.08 - (yy - top[None, :]) / np.maximum(thick[None, :], 1) * .3, .72, 1.08)
        layer = c[None, None, :] * (shade * fade)[..., None]
        a = np.where(mask, np.where(dust, .55, .82), 0)[..., None]
        img = img * (1 - a) + layer * a
    # film grain
    g = np.random.default_rng(int(t * 1000) + 1).normal(0, 1, (H, W)).astype(np.float32)
    img += g[..., None] * 9
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))

if __name__ == "__main__":
    if "--animate" in sys.argv:
        i = sys.argv.index("--animate"); name = sys.argv[i + 1]; W, H = map(int, sys.argv[i + 2].split("x")); secs = float(sys.argv[i + 3])
        fps = 24; tmp = pathlib.Path(tempfile.mkdtemp())
        for f in range(int(secs * fps)):
            ph = 2 * math.pi * f / (secs * fps)                       # loops: phase runs one full turn
            render(name, W, H, t=ph).save(tmp / f"f{f:04d}.png")
        out = OUT / f"strata-{name}_{W}x{H}.mp4"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(fps), "-i", str(tmp / "f%04d.png"),
                        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", str(out)], check=True)
        print("wrote", out.name)
    else:
        for name in PAL:
            for W, H in [(1080, 1350), (1920, 1080), (1080, 1080)]:
                render(name, W, H).save(OUT / f"strata-{name}_{W}x{H}.jpg", quality=90); print("wrote", f"strata-{name}_{W}x{H}.jpg")
