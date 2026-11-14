#!/usr/bin/env python3
"""Axmed "atmosphere" backgrounds: out-of-focus tonal fields with film grain (after the ElevenLabs cards),
in ONE Axmed hue each, so no purple-to-blue gradients (Hallmark floor 11).
Usage: python3 scripts/make-backgrounds.py            -> brand/backgrounds/<name>_<w>x<h>.jpg
Deterministic: the same seed makes the same field."""
import math, pathlib, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = pathlib.Path(__file__).resolve().parent.parent / "brand/backgrounds"; OUT.mkdir(parents=True, exist_ok=True)

# Each palette = one hue, light to dark (hex), plus where the light falls and how strong the text shade is.
PALETTES = {
    "indigo-dusk":  {"tones": ["#AEB6D2", "#7C83B4", "#4A4C93", "#2A2470", "#16123F", "#0C0A26"], "seed": 7,  "shade": .55},
    "indigo-haze":  {"tones": ["#F1F0FA", "#D9D6F0", "#B6B0E0", "#8D86C9", "#6259AE", "#3D348A"], "seed": 11, "shade": .72},
    "cyan-mist":    {"tones": ["#EAF8FD", "#C9EEFA", "#9FDFF5", "#62C7EA", "#2A9CC8", "#13628A"], "seed": 5,  "shade": .30},
    "cyan-deep":    {"tones": ["#8FD9F2", "#45B6DE", "#1B86B3", "#105E84", "#0A3D58", "#06233A"], "seed": 3,  "shade": .55},
    "lilac-mist":   {"tones": ["#FFFFFF", "#F6F5FC", "#ECEAF8", "#DEDAF2", "#CBC5EA", "#B3ABDD"], "seed": 21, "shade": .0},
    "ice-mist":     {"tones": ["#FFFFFF", "#F4FBFE", "#E6F6FC", "#D2EEF9", "#B8E3F4", "#9AD4EC"], "seed": 23, "shade": .0},
    "paper-warm":   {"tones": ["#FFFDF9", "#F7F2EA", "#EDE6DA", "#E0D6C6", "#CFC2AE", "#B5A68F"], "seed": 9,  "shade": .12},
}

def hexrgb(h): h = h.lstrip("#"); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def field(name, W, H):
    p = PALETTES[name]; r = random.Random(p["seed"]); tones = [hexrgb(t) for t in p["tones"]]
    s = 0.25; w, h = int(W * s), int(H * s)                       # paint small, blur, upscale: smoother and faster
    img = Image.new("RGB", (w, h), tones[3]); d = ImageDraw.Draw(img, "RGBA")
    # base: dark-to-mid tonal ramp across the frame, same hue
    for i in range(h):
        k = i / h; t0, t1 = tones[2], tones[5]
        d.line([(0, i), (w, i)], fill=tuple(int(t0[c] * (1 - k) + t1[c] * k) for c in range(3)) + (255,))
    ang = r.uniform(-1.05, -0.75)
    # one dominant fold of light: a wide bright band with a softer halo, like a blurred window or fabric
    cx, cy = r.uniform(.35, .65) * w, r.uniform(.25, .45) * h
    for width, tone, alpha in ((.75, 1, 120), (.42, 0, 150), (.18, 0, 170)):
        L = 2.2 * max(w, h); dx, dy = math.cos(ang) * L / 2, math.sin(ang) * L / 2
        d.line([(cx - dx, cy - dy), (cx + dx, cy + dy)], fill=tones[tone] + (alpha,), width=int(width * min(w, h)))
    # a few secondary folds and deep pools for depth
    for k in range(5):
        t = tones[r.choice([1, 2, 4, 5, 5])]; off = r.uniform(-.6, .6) * w
        L = 2 * max(w, h); dx, dy = math.cos(ang + r.uniform(-.25, .25)) * L / 2, math.sin(ang) * L / 2
        d.line([(cx + off - dx, cy - dy), (cx + off + dx, cy + dy)], fill=t + (r.randint(60, 130),), width=int(r.uniform(.08, .22) * min(w, h)))
    for k in range(3):
        R_ = r.uniform(.25, .45) * w; x, y = r.uniform(.6, 1.1) * w, r.uniform(.6, 1.1) * h
        d.ellipse([x - R_, y - R_, x + R_, y + R_], fill=tones[5] + (150,))
    img = img.filter(ImageFilter.GaussianBlur(min(w, h) * .075))
    img = img.resize((W, H), Image.BICUBIC)
    a = np.asarray(img).astype(np.float32)
    # darker lower third for text (same hue: multiply toward the darkest tone)
    yy = np.linspace(0, 1, H)[:, None]
    shade = np.clip((yy - .55) / .45, 0, 1) ** 1.6 * p["shade"]
    dark = np.array(tones[5], np.float32)
    a = a * (1 - shade[..., None]) + dark * shade[..., None]
    # soft vignette
    xx = np.linspace(-1, 1, W)[None, :]; y2 = np.linspace(-1, 1, H)[:, None]
    light = p["shade"] == 0
    v = np.clip(1 - (.05 if light else .18) * (xx ** 2 + y2 ** 2), .7, 1)
    a *= v[..., None]
    # film grain: monochrome, fine, stronger in the darks (as in the reference)
    g = np.random.default_rng(p["seed"]).normal(0, 1, (H, W)).astype(np.float32)
    lum = a.mean(axis=2, keepdims=True) / 255
    a += g[..., None] * ((6 + 4 * (1 - lum)) if light else (10 + 10 * (1 - lum)))
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

if __name__ == "__main__":
    sizes = [(1080, 1350), (1920, 1080), (1080, 1080)]
    for name in PALETTES:
        for W, H in sizes:
            f = OUT / f"{name}_{W}x{H}.jpg"; field(name, W, H).save(f, quality=90); print("wrote", f.name)
