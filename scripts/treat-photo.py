#!/usr/bin/env python3
"""Put a REAL, consented photo into Axmed's brand frames.
Usage: python3 scripts/treat-photo.py <photo.jpg> [outdir]
Outputs: <name>_duotone.jpg (indigo→cyan duotone) and <name>_in-the-mark_<size>.png for 4 sizes.
Guardrail: only real photos with consent (strategy/templates/consent-checklist.md). Never AI-generated people."""
import sys, pathlib, base64, io, subprocess
from PIL import Image, ImageOps
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
src = pathlib.Path(sys.argv[1]); out = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else src.parent); out.mkdir(parents=True, exist_ok=True)
img = Image.open(src).convert("RGB")
# duotone: shadows indigo-deep, highlights soft cyan-white
duo = ImageOps.colorize(ImageOps.autocontrast(img.convert("L"), cutoff=1), black="#1C1560", white="#E6F8FF", mid="#4A7FD0")
duo.save(out / f"{src.stem}_duotone.jpg", quality=92)
import importlib.util
spec = importlib.util.spec_from_file_location("mp", ROOT / "scripts/make-patterns.py"); 
mp_src = (ROOT / "scripts/make-patterns.py").read_text().split("SETS = {")[0]
ns = {"__file__": str(ROOT / "scripts/make-patterns.py")}; exec(mp_src, ns)
files = []
for sz in ["1080x1350", "1920x1080", "1080x1920", "1080x1080"]:
    W, H = map(int, sz.split("x"))
    for variant, im in (("color", img), ("duotone", duo)):
        buf = io.BytesIO(); im.save(buf, "JPEG", quality=90)
        uri = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()
        f = out / f"{src.stem}_in-the-mark_{variant}_{sz}.svg"; f.write_text(ns["people_frame"](W, H, uri)); files.append(str(f))
subprocess.run([sys.executable, str(ROOT / "scripts/svg-to-png.py"), *files], check=True)
for f in files: pathlib.Path(f).unlink()
print("done →", out)
