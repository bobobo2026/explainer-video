#!/usr/bin/env bash
# 多段拼接。用法：bash concat.sh 输出画面.mp4 seg1/画面.mp4 seg2/画面.mp4 ...   （各段同一模板渲染，参数一致，可直接 -c copy）
# 口播同理：每段口播用 apad=whole_dur=<该段画面时长>,atrim 补齐再 concat，保证音画逐段对齐
set -e; OUT=$1; shift; L=$(mktemp); for f in "$@"; do echo "file '$(realpath "$f")'" >> "$L"; done
ffmpeg -v error -y -f concat -safe 0 -i "$L" -c copy "$OUT"; echo "✓ $OUT"
