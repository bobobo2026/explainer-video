#!/usr/bin/env bash
# 质检：整片每 N 秒取一帧拼成一张图，一眼看完节奏/留白/穿帮。用法：bash contact_sheet.sh 视频.mp4 out.png [间隔秒=2.5] [列=4]
ffmpeg -v error -y -i "$1" -vf "fps=1/${3:-2.5},scale=480:-1,tile=${4:-4}x6" -frames:v 1 "$2" && echo "✓ $2"
