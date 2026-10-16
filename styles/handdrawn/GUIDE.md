# 手绘笔记风格（dashi-animationstyle 管线 · 默认 1920×1080）

> 通用步骤（研究、写稿、配音与时间轴、质检原则、混音、交付、平台文案）见根目录 SKILL.md；这里只写手绘风格特有的部分。
> 配音：手绘管线自己的 `字幕.mjs` 吃 mp3 + 稿子；用 `core/scripts/voice_to_timeline.py` 生成的时间也可以拿来当 marks 的参考。
> 配乐：本目录的 `scripts/audio_bed.py`（events.json 格式，84BPM lofi + 纸张音效），或者通用的 `core/scripts/audio_bed.py`（`"music":"lofi84"`）。

## 0. 环境准备（一次性）

```bash
git clone --depth 1 https://github.com/chuspeeism/dashi-animationstyle /data/refs/dashi-animationstyle   # MIT
pip3 install edge-tts numpy
mkdir -p ~/.fonts && curl -L -o ~/.fonts/LXGWWenKai-Medium.ttf https://github.com/lxgw/LxgwWenKai/releases/latest/download/LXGWWenKai-Medium.ttf && fc-cache -f
bash styles/handdrawn/scripts/make_render_any.sh /data/refs/dashi-animationstyle    # 生成支持竖屏的 render_any.mjs
bash core/scripts/check_env.sh handdrawn                                # 必须看到 ✓
```
需要 node、ffmpeg、chromium。macOS 上用 `brew install whisper-cpp` 装上 whisper（真人录音对齐更准）。先读管线自带的 `SKILL.md` 和 `styles/手绘笔记`。

## 1. 稿子 → 分段

- 改成**口语短句**：一句 ≤20 字（竖屏 ≤16 字），多用逗号，少用长定语。术语第一次出现配一句大白话（「Harness，本意是马具」）。
- 按内容切段，每段 20–40 秒（一个论点一段）。每段单独做 timeline、单独调画面、单独渲染。
- **先做第一段给用户确认风格**，再做剩下的。
- 结尾固定：总结（把每段的比喻再串一遍，如台阶/清单）+ CTA（点赞收藏关注 + 评论区提问）。

## 2. 配音（最影响观感的一步，按优先级选）

1. **用户真人录音（首选）**：手机录即可，每句之间停顿半秒。有 whisper 就 `node pipeline/字幕.mjs <dir>`（字级时间最准）；没有就 `--no-whisper`（靠稿子 + 静音检测切句，所以停顿一定要清楚）。画面卡的是关键词，换录音后重跑 `生成timeline.mjs`，画面自动跟着走，不用改代码。
2. **高质量 TTS**：MiniMax 语音、豆包语音（火山引擎）、ElevenLabs 等，自然度远高于免费引擎。需要用户提供 API key，或用户在网页上生成好音频交给你。生成后同样走 `字幕.mjs`。
3. **兜底：edge-tts**（`bash styles/handdrawn/scripts/tts.sh 稿子.txt 口播.mp3 zh-CN-YunxiNeural +6%`）。免费，但用户会觉得「太 AI」。交付时要明确说明，并主动建议换录音。
- **禁止**：macOS `say`、espeak 这类机械合成音（量化严重，语速参数基本不起作用）。
- 字幕断句不好用 `styles/handdrawn/scripts/recue.py`；显示文字（标点、中英文空格）在 scenes.js 顶部用 `DISP` 覆盖。

```bash
cd /data/refs/dashi-animationstyle
node pipeline/新建作品.mjs /data/work/seg2 --style 手绘笔记 --audio /data/work/口播2.mp3 --script /data/work/稿子2.txt
node pipeline/字幕.mjs /data/work/seg2 [--no-whisper]
```

## 3. 分镜 + 关键词时间点

编辑 `分镜.json`（示例 `styles/handdrawn/examples/分镜_示例.json`）：
- `shots`：每个镜头包含哪些 cue（2–5 条字幕，约 4–10 秒一镜）。
- `高亮`：A（橙底）/B（墨蓝底）两个本段核心词，字幕自动上色；画面里 `blockWord` 用同色，形成记忆锚点。
- `字幕强调`：加橙色波浪线的词。
- `marks`：**每个要卡点的词**都写上——`python3 styles/handdrawn/scripts/add_marks.py <dir> '[["马具",5,"马具"],["马具2",9,"马具"]]'`。一镜通常 3–6 个 mark。
然后 `node pipeline/生成timeline.mjs <dir>`。

**写代码前先用表格写出每个镜头的「画面一句话」**，例如：
| 镜头 | 口播 | 画面 |
|---|---|---|
| 烈马与马具 | AI 就是那匹烈马，这些工具就是一套趁手的马具 | 左：机器人乱蹦+动作线「AI = 烈马」；右：笔记本里写 Codex/Claude Code「工具 = 马具」；说到第二个「马具」时橙色缰绳连上，机器人安静微笑，盖章「驾驭」 |

比喻库、版式、节奏规则见 `core/creative-method.md`。

## 4. 写场景 scenes.js

**从 `styles/handdrawn/examples/` 复制一个最接近的段落改**，不要从空白开始。结构：
```js
const DISP = {...}; TL.cues.forEach(c => { if (DISP[c.id]) c.text = DISP[c.id]; });
['zoom','scroll','curl','zoom','scroll','erase'].forEach((k,i)=>{ if (FX_CUTS[i]) FX_CUTS[i].kind = k; }); fxPlan();
const SEC = 1150, Y = i => i * SEC, ST = i => fxStart(i);   // 每个镜头占世界坐标里一块「纸面」
// @@WIDGETS@@        ← build.py 在这里插入 assets/widgets.js
const S1 = (() => { /* 预先构建 Sk 线稿（固定随机种子，帧间不抖） */ })();
function draw1(t, v) { if (!seen(v, y0-100, y0+SEC)) return; /* 按 M('词') 逐个出现 */ }
CAM0 / CAM（镜头运动）; SHAKES（重音震屏）; function fxBefore(t){...}; function drawScenes(t,v){ draw1(t,v); ... }
```
硬性要求（对应评分表）：
- 每镜 3–6 个元素，**至少一个角色**（`drawRobot` 带 `happy`/`look` 表情变化，或 `makePerson`）。
- **每镜至少一个持续的小动作**：漂浮 `Math.sin(t*1.5)*8`、乱蹦、复制 1→4→12、指针快转、迷雾散开、速度线。没有持续动作就像 PPT。
- 出现方式：线稿 `S.at(t,t0,d)` 逐笔描（大件加 `.penOn()`）；物件 `popIn`；文字 `writeText(..., seq(t0, str, 0.07))`；核心词 `blockWord`；结论 `drawStamp`。
- 安全区（横屏）：x 150–1800，y `y0+60`…`y0+860`。
- **不要在 scenes.js 里重复定义 widgets.js 已有的函数**：JS 后定义的同名函数会覆盖前面的，改了部件却看不到变化。改部件前先 `grep -n "function 名字" index.html` 确认只有一处。
- API 速查：`styles/handdrawn/references/api-cheatsheet.md`。

拼页面：首次 `python3 styles/handdrawn/scripts/patch_template.py <dir>/index.html base.html`，之后每次改完 `python3 styles/handdrawn/scripts/build.py base.html <dir>`。

## 5. 质检（批评回路，必须做，通常要 2–3 轮）

```bash
cd <dir> && node /data/refs/dashi-animationstyle/pipeline/render.mjs index.html --stills 3.5,9.3,13.5,19.5,28.5,39.8 --outdir 静帧 --prefix q
montage 静帧/q_静帧_*.png -tile 3x -geometry 640x360+4+4 /tmp/m.png    # 用看图工具真的看
```
每镜取「快结束时」一帧。逐张对照参考帧，按 `core/quality-rubric.md` 打分并写下来，再改：
- 字没写完（`seq(t0, n)` 字数写少）、被裁、压字幕、互相重叠？中英混排宽度用 `tw()` 算。
- 一眼能看懂吗？比喻有没有歧义（马蹄铁下加缰绳，结果像铃铛 → 删）？
- 镜头推近（z>1）有没有把边上的元素推出画面？
- 还要抽查**元素正在出现的时刻**（关键词 ±0.2 秒），确认是卡着嘴型出现的。

## 6. 渲染（一次只跑一个）

```bash
node /data/refs/dashi-animationstyle/pipeline/render.mjs index.html -o 画面.mp4 > render.log 2>&1   # 约 4.5 秒/秒视频，后台跑
```
**不要同时跑两个渲染（包括静帧）**，否则会 `Page.captureScreenshot 失败`。多段写成一个脚本顺序渲染。渲染速度快得离谱（例如 80 秒片 20 秒出完），通常说明画面太简单，或者没用这套模板。

## 7. 配乐音效 + 拼接 + 混音

1. 每段画面时长 = TL.duration；口播逐段 `apad=whole_dur=<段时长>,atrim` 补齐再 concat，保证音画逐段对齐。
2. 写 `events.json`，**音效时间全部从 TL.marks / TL.shots 算**（和画面同一个时钟）：纸条/卡片 pop、印章 stamp、打勾 ding、打字 click、切镜 whoosh = 各 shot.start。`python3 styles/handdrawn/scripts/audio_bed.py events.json` → 全长 lofi 音乐 + 音效轨。
3. `bash styles/handdrawn/scripts/concat.sh video.mp4 seg1/画面.mp4 seg2/画面.mp4 ...`
4. `bash core/scripts/mix.sh voice.wav audio_music.wav audio_sfx.wav video.mp4 成片.mp4`（音乐自动避让人声，loudnorm -14 LUFS）。
5. 响度用 `ffmpeg -i 成片.mp4 -af loudnorm=print_format=summary -f null -` 看 Input Integrated（目标 -16~-14 LUFS），不要用 mean_volume。
6. `bash core/scripts/contact_sheet.sh 成片.mp4 /tmp/cs.png 4 6`，和 `styles/handdrawn/assets/reference/00_整片联系表.jpg` 并排对比。

## 8. 竖屏 9:16（抖音/小红书/视频号）

模板默认 1920×1080，已提供竖屏补丁（舞台、画布、镜头焦点、字幕区都改好了，已实测能渲染）：
```bash
python3 styles/handdrawn/scripts/patch_template.py <dir>/index.html base_v.html --vertical
VW=1080 VH=1920 node /data/refs/dashi-animationstyle/pipeline/render_any.mjs index.html -o 画面.mp4
```
竖屏版式要**重新设计**，不能直接套横屏坐标：
- `SEC = 1900`；镜头中心 `CAM0/CAM` 用 `(540, Y(i)+863, 0.95)`。
- 安全区：x 60–1020，y `y0+60`…`y0+1580`（下面是字幕区）。
- 左右对比 → 上下对比；三栏卡片 → 2×2 或纵向列表；标题字号 72–90，正文 52–60。
- 每条字幕 ≤16 字（字号 56，宽 1080）。

## 交付（见 SKILL.md 第 7 步）
- 用了什么配音、什么字体（霞鹜文楷）；你听不到音频，请用户试听。用的是兜底 TTS 的话要主动建议换录音。
- 附上质量评分表的自评结果和联系表。
- 发布：云端浏览器 IP 通常在海外，国内平台用它登录发布会显示「IP属地：海外」，还可能触发风控。建议用户在本地发布。
