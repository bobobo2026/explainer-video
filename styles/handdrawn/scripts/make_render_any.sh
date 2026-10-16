#!/usr/bin/env bash
# 生成支持任意尺寸的渲染器（原 render.mjs 写死 1920×1080）。用法：bash make_render_any.sh /data/refs/dashi-animationstyle
# 竖屏渲染：VW=1080 VH=1920 node <管线>/pipeline/render_any.mjs index.html -o 画面.mp4
P=${1:-/data/refs/dashi-animationstyle}/pipeline
sed 's/^const W = 1920, H = 1080;/const W = +(process.env.VW || 1920), H = +(process.env.VH || 1080);/' "$P/render.mjs" > "$P/render_any.mjs" && grep -q 'process.env.VW' "$P/render_any.mjs" && echo "✓ $P/render_any.mjs"
