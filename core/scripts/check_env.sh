#!/usr/bin/env bash
# 开工第一步：确认 skill 包完整 + 环境就绪。用法：bash core/scripts/check_env.sh [handdrawn|realistic]
# 缺文件 → 停下找用户要完整 zip，不要自己从零重写渲染器。
D=$(cd "$(dirname "$0")/../.." && pwd); ST=${1:-realistic}; miss=0
need(){ [ -e "$D/$1" ] || { echo "✗ 缺 $1"; miss=1; }; }
for f in SKILL.md core/creative-method.md core/quality-rubric.md core/platform-copy.md core/scripts/tts_timeline.py core/scripts/voice_to_timeline.py core/scripts/audio_bed.py core/scripts/mix.sh core/scripts/contact_sheet.sh; do need $f; done
command -v ffmpeg >/dev/null || { echo "✗ 没有 ffmpeg"; miss=1; }
python3 -c "import numpy" 2>/dev/null || { echo "✗ pip3 install numpy"; miss=1; }
python3 -c "import edge_tts" 2>/dev/null || echo "· 没装 edge-tts（只有兜底配音需要：pip3 install edge-tts）"
python3 -c "import faster_whisper" 2>/dev/null || echo "· 没装 faster-whisper（真人录音对齐更准：pip3 install faster-whisper）"
fc-list | grep -qi "LXGW WenKai" || { echo "✗ 没装霞鹜文楷（见 SKILL.md「环境准备」）"; miss=1; }
fc-list | grep -qi "Noto Sans SC\|Noto Sans CJK SC" || { echo "✗ 没装 Noto Sans SC（思源黑体）"; miss=1; }
fc-list | grep -qi "Noto Color Emoji" || echo "· 没装 Noto Color Emoji（拟真风格里的 emoji 道具会变方块）"
if [ "$ST" = realistic ]; then
  for f in styles/realistic/GUIDE.md styles/realistic/template/lib.tsx styles/realistic/template/Video.tsx styles/realistic/template/config.ts styles/realistic/template/index.tsx styles/realistic/template/render.mjs styles/realistic/template/public/grain.png styles/realistic/reference/00_联系表.jpg; do need $f; done
  node -e "require.resolve('remotion')" 2>/dev/null || ( cd "$D/styles/realistic/template" && node -e "require.resolve('remotion')" 2>/dev/null ) || { echo "✗ 没有 remotion（npm i remotion @remotion/bundler @remotion/renderer react react-dom）"; miss=1; }
else
  for f in styles/handdrawn/GUIDE.md styles/handdrawn/assets/widgets.js styles/handdrawn/assets/reference/00_整片联系表.jpg styles/handdrawn/references/api-cheatsheet.md styles/handdrawn/scripts/patch_template.py styles/handdrawn/scripts/build.py styles/handdrawn/examples/分镜_示例.json; do need $f; done
  P=${2:-/data/refs/dashi-animationstyle}; [ -f "$P/pipeline/render.mjs" ] || { echo "✗ 没有管线 $P（git clone https://github.com/chuspeeism/dashi-animationstyle）"; miss=1; }
fi
[ $miss = 0 ] && echo "✓ [$ST] 包完整、环境就绪" || { echo "→ 有缺项：先补齐。包不完整就向用户要完整 zip，不要换语言/框架重写渲染器。"; exit 1; }
