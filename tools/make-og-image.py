#!/usr/bin/env python3
"""Generate docs/og.png (1280x640 social preview card) for explainer-video.

Usage: python3 tools/make-og-image.py   (run from the repository root)

Crops four frames out of the photoreal reference contact sheet and lays them out
next to the title. Requires Pillow. Latin text uses a system sans font; the small
Chinese line is skipped if no CJK font is available.
"""
from __future__ import annotations

import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHEET = os.path.join(ROOT, "styles", "realistic", "reference", "00_联系表.jpg")
OUT = os.path.join(ROOT, "docs", "og.png")

W, H = 1280, 640
CREAM = (247, 242, 232)
INK = (22, 19, 15)
SOFT = (74, 66, 56)
ORANGE = (232, 98, 44)
LINE = (227, 217, 198)

LATIN_BOLD = [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Supplemental/HelveticaNeue.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
]
LATIN_REG = [
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]
CJK = [
    "/System/Library/Fonts/Hiragino Sans GB.ttc",
    "/System/Library/Fonts/PingFang.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
]


def load(cands, size):
    for p in cands:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()


def main() -> int:
    img = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 12, H], fill=ORANGE)

    f_word = load(LATIN_BOLD, 30)
    f_title = load(LATIN_BOLD, 58)
    f_sub = load(LATIN_REG, 23)
    f_small = load(LATIN_BOLD, 20)
    f_cjk = load(CJK, 22) if any(os.path.exists(p) for p in CJK) else None

    x = 64
    d.text((x, 62), "explainer-video", font=f_word, fill=ORANGE)

    lines = ["Chinese explainer", "videos, made by", "an agent."]
    y = 118
    for line in lines:
        d.text((x, y), line, font=f_title, fill=INK)
        y += 64

    d.line([x, 344, x + 470, 344], fill=LINE, width=2)

    sub = ["1 shared pipeline · 2 art styles", "13 reusable scenes · word-level sync", "−14 LUFS master · MIT licensed"]
    y = 366
    for line in sub:
        d.text((x, y), line, font=f_sub, fill=SOFT)
        y += 32

    if f_cjk is not None:
        d.text((x, 470), "中文科普短视频 Agent Skill", font=f_cjk, fill=SOFT)

    d.text((x, 552), "Claude Code · Codex · DeepSeek Harness", font=f_small, fill=INK)

    # Right side: 2x2 grid cropped from the photoreal contact sheet.
    if os.path.exists(SHEET):
        sheet = Image.open(SHEET).convert("RGB")
        sw, sh = sheet.size
        cols, rows = 8, 2
        cw, ch = sw // cols, sh // rows
        picks = [(0, 0), (0, 3), (1, 5), (1, 7)]
        cell_w, cell_h = 250, 190
        gx, gy, gap = 712, 62, 14
        for i, (r, c) in enumerate(picks):
            crop = sheet.crop((c * cw, r * ch, (c + 1) * cw, (r + 1) * ch))
            crop = crop.resize((cell_w, int(crop.height * cell_w / crop.width)), Image.LANCZOS)
            if crop.height > cell_h:
                top = (crop.height - cell_h) // 2
                crop = crop.crop((0, top, cell_w, top + cell_h))
            px = gx + (i % 2) * (cell_w + gap)
            py = gy + (i // 2) * (cell_h + gap)
            img.paste(crop, (px, py))
            d.rectangle([px, py, px + cell_w, py + cell_h], outline=LINE, width=2)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    img.save(OUT, "PNG", optimize=True)
    print(f"wrote {OUT} ({os.path.getsize(OUT)} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
