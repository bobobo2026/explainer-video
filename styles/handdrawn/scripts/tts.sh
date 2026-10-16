#!/usr/bin/env bash
# 兜底配音（免费，但有 AI 腔）。优先级见 SKILL.md 第 2 步：真人录音 > 高质量 TTS（MiniMax/豆包/ElevenLabs）> 本脚本。
# 用法：bash tts.sh 稿子.txt 口播.mp3 [音色=zh-CN-YunxiNeural] [语速=+6%]
# 男声推荐 YunxiNeural（年轻自然）/ YunjianNeural（浑厚）；女声 XiaoxiaoNeural / XiaoyiNeural。不要用 macOS say / espeak（机械感重，量化严重）。
# 让它更像人：稿子多用逗号短句、口语词（「其实」「你看」「说白了」），每段之间空一行（产生自然停顿，也方便 --no-whisper 切句）。
set -e; V=${3:-zh-CN-YunxiNeural}; R=${4:-+6%}
edge-tts --voice "$V" --rate="$R" -f "$1" --write-media "$2"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$2"
