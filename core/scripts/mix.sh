#!/usr/bin/env bash
# 混音 + 封装（两种风格通用）。用法：bash mix.sh voice.wav music.wav sfx.wav 画面.mp4 成片.mp4 [音乐音量=0.32] [音效音量=0.35]
# 口播原样；音乐被人声 sidechain 压低（说话时自动让位）；整体 loudnorm 到 -14 LUFS / TP -1.5（短视频平台标准）。
set -e
V=$1; MU=$2; SX=$3; VID=$4; OUT=$5; MV=${6:-0.32}; SV=${7:-0.35}
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VID")
ffmpeg -v error -y -i "$V" -i "$MU" -i "$SX" -filter_complex "[0:a]aformat=sample_rates=44100:channel_layouts=stereo,apad=whole_dur=$D,asplit=2[v][vk];[1:a]volume=$MV[m];[m][vk]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=400[md];[2:a]volume=$SV[s];[v][md][s]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[o]" -map "[o]" -ar 44100 -t "$D" /tmp/_mix.wav
ffmpeg -v error -y -i "$VID" -i /tmp/_mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
ffmpeg -i "$OUT" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1
echo "✓ $OUT"
