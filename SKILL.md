---
name: explainer-video
description: 把一个话题/开源项目/知识点做成中文科普短视频，带口播、逐字字幕、配乐音效，可以直接发抖音/小红书/B站/视频号/X。两种画风：①「手绘笔记」白板动画（横屏 16:9 为主，适合概念讲解）；②「拟真出镜」竖屏 9:16（带口型同步的出镜主播 + 真实截图 + 手绘标注 + 手持镜头/颗粒，适合热点、产品、开源项目介绍）。包含：选题研究与事实核查、口语化写稿、配音→逐字时间轴（TTS 或真人录音自动对齐）、画面卡点、自动配乐音效与混音、静帧质检评分、各平台文案。
---

# 中文科普短视频（v3：一套流程，两种画风）

> **⚠️ 先读这四条**
> 1. **这是一个文件夹。** 安装时复制整个 `explainer-video/`。开工第一步：`bash core/scripts/check_env.sh realistic`（或 `handdrawn`）。缺东西就停下找用户要完整包。
> 2. **不要从零重写渲染器。** 拟真风格从 `styles/realistic/template/` 复制改；手绘风格用 dashi-animationstyle 管线 + `styles/handdrawn/`。画面品质大多来自这些已经调好的部件，重写一遍全会丢。
> 3. **先看参考帧**：`styles/*/reference/00_*联系表.jpg` 就是及格线。交付前按 `core/quality-rubric.md` 打分，任何一项低于 2 分都不交付。
> 4. **事实必须有出处**（README、官方文档、API 数据）。数字要注明截至哪天，不确定的内容不要写进稿子。

## 环境准备（一次性；云端沙盒重置后要重跑）
```bash
pip3 install numpy edge-tts faster-whisper          # faster-whisper 可选：真人录音字级对齐（首次运行会下载约 460MB 的 small 模型）
mkdir -p ~/.fonts && curl -L -o ~/.fonts/LXGWWenKai-Medium.ttf https://github.com/lxgw/LxgwWenKai/releases/latest/download/LXGWWenKai-Medium.ttf && fc-cache -f
# 还需要：ffmpeg、node 18+、Noto Sans SC、Noto Color Emoji
# 拟真风格：在工程目录 npm i remotion @remotion/bundler @remotion/renderer react react-dom
# 手绘风格：git clone --depth 1 https://github.com/chuspeeism/dashi-animationstyle /data/refs/dashi-animationstyle
bash core/scripts/check_env.sh realistic            # 必须看到 ✓
```

## 0. 先选画风（问用户，或者按下表推荐）

| | 手绘笔记 `styles/handdrawn/` | 拟真出镜 `styles/realistic/` |
|---|---|---|
| 样子 | 白纸、钢笔线、马克笔，边说边画 | 出镜主播（口型同步）+ 真实截图/界面 + 手绘圈注 + 镜头微晃 + 胶片颗粒 |
| 适合 | 抽象概念、方法论、「X 是什么」 | 热点项目、产品/工具介绍、带数据的新闻 |
| 画幅 | 1920×1080（有竖屏补丁） | **1080×1920 原生竖屏** |
| 引擎 | dashi-animationstyle（Canvas） | Remotion（React），模板在 `template/` |
| 指南 | `styles/handdrawn/GUIDE.md` | `styles/realistic/GUIDE.md` |

用户说「要像真人」「要拟真」「要竖屏/手机看」「抖音」→ 拟真；说「手绘」「白板」「B站横屏」→ 手绘。拿不准就各出一帧静帧给用户选。

## 1. 研究 + 事实核查
- 开源项目：用 GitHub API 取 stars/forks/创建时间/license/主页，读 README（中文 README 优先）。截图：GitHub 手机版页面、官方配图、产品界面。
- 记一份事实清单（数字、原话、出处 URL、日期），写稿只用清单里的东西。**凭记忆补的细节（年份、版本号）要么核实，要么删掉。**
- 涉及逆向、爬虫、安全这类话题时，稿子里加一句合规提醒。

## 2. 写稿 → `script.json`
```json
[{"scene":"hook","say":"半年时间，二十四万颗星。","show":"半年时间，24 万颗星","pause":0.35}, ...]
```
- `say` 是读出来的（数字写成汉字更自然：「二十四万」），`show` 是可选的显示稿。`scene` 是场景名，同一个场景的连续句子会被合成一个镜头。
- 结构（60–120 秒）：**钩子（数字/反差，3 秒内）→ 名字/定义 → 生活比喻 → 以前怎么做（痛点）→ 它做了什么 → 演示一次 → 结果/证据 → 范围/亮点 → 官方案例（硬数据）→ 怎么上手 → 提醒 → CTA（评论区提一个问题 + 关注）**。
- 口语短句：一句 ≤20 字，竖屏字幕一行 ≤13 字（会自动折成两行）。术语第一次出现马上配一句大白话或比喻。方法和比喻库见 `core/creative-method.md`。

## 3. 配音 → 逐字时间轴（两种风格通用，格式一致）
输出 `audio/voice.wav` 和 `public/timeline.json`：`{duration, fps, sentences[{scene,say,start,end,words[{t,s,e}]}], mouth[每帧 0..1]}`，其中 mouth 用来驱动主播口型。

配音按优先级选：
1. **真人录音（首选，最有真人感）**：手机录，每句之间停顿 0.5 秒。
   `python3 core/scripts/voice_to_timeline.py 录音.m4a script.json <项目>`
   装了 faster-whisper 就做字级对齐（实测匹配率约 95%，中位误差约 0.04 秒）；没装就靠静音切句 + 句内按字数均分。**换录音后画面和音效会自动重新对齐，不用改代码**，因为画面卡的是「某句里的某个词」。
2. **高质量 TTS**（MiniMax、豆包/火山、ElevenLabs）：需要用户的 key，或者用户自己生成好音频交给你，然后同样走 `voice_to_timeline.py`。
3. **兜底：edge-tts**：`python3 core/scripts/tts_timeline.py script.json <项目>`（`VOICE=zh-CN-YunxiNeural RATE=+8%`）。免费，自带字级时间，但用户普遍觉得「太 AI」。**交付时必须说明，并主动建议换真人录音。**
- 禁止使用 macOS `say`、espeak 这类机械合成音。

## 4. 画面（按所选风格的 GUIDE 做）
共同原则：
- **每个镜头只讲一个意思，并且有一个具体的视觉比喻或真实素材**；名词变成物件，动词变成动作，数字做成计数器或进度条。
- **画面跟着嘴走**：元素出现的时刻 = 关键词开始说的时刻（拟真用 `wf(句号,'词')`，手绘用 `M('词')`），提前 0.1–0.2 秒。
- 每个镜头至少有一个持续的小动作（漂浮、呼吸、转圈、计数、打字），否则像 PPT。
- 每段 2–4 个重音（印章 / 盖章 + 闷响），放在论点落点的词上。

## 5. 质检（必做，通常要改 2–3 轮）
- 取每个场景结束前的一帧作为静帧，拼成联系表，**用看图工具真的看一遍**，再和参考联系表并排对比。
- 按 `core/quality-rubric.md` 逐项打分并写下来，再改。重点查：压字幕、被裁切、文字折行难看（单字掉到下一行）、元素互相遮挡、小窗主播挡住内容、空等（说了一秒多屏幕上还没东西）。
- 成片后再用 `bash core/scripts/contact_sheet.sh 成片.mp4 /tmp/cs.png 4 8` 抽帧复查。

## 6. 配乐音效 + 混音（通用）
1. 写 `cues.json`，音效全部锚在「第 i 句的某个词」上（示例：`styles/realistic/template/cues.json`，格式写在 `audio_bed.py` 文件头）。
2. `python3 core/scripts/audio_bed.py public/timeline.json cues.json audio/` → `music.wav`（`pluck96` 现代拨弦 / `lofi84` 温柔 lofi）+ `sfx.wav`（场景切换自动加 whoosh）。
3. `bash core/scripts/mix.sh audio/voice.wav audio/music.wav audio/sfx.wav out/video.mp4 final/成片.mp4`：音乐会自动给人声让路，整体响度 -14 LUFS。
4. 响度看 ebur128 测出的 I 值（目标 -15~-14），不要看 mean_volume。

## 7. 交付
- 成片 + 一句话说明：用了什么配音、字体，以及数据截至哪天。**你听不到音频，请用户试听。**
- 附上**各平台文案**（模板见 `core/platform-copy.md`）：抖音 / 小红书 / B站（带章节时间戳）/ 视频号 / X。
- 发布：云端浏览器的 IP 通常在海外，登录国内平台发布会显示「IP属地：海外」，还可能触发风控，所以建议用户在本地发布。
- 提供下一步可选项：换真人录音（自动对齐）、换主播形象、做封面、改节奏。

## 文件地图
```
core/        creative-method.md · quality-rubric.md · platform-copy.md
core/scripts tts_timeline.py · voice_to_timeline.py · audio_bed.py · mix.sh · contact_sheet.sh · check_env.sh
styles/realistic/  GUIDE.md · template/（可直接渲染的完整工程 = REA 那期）· reference/（16 张参考帧 + 联系表）
styles/handdrawn/  GUIDE.md · assets/（widgets.js + 参考帧）· examples/ · references/api-cheatsheet.md · scripts/
examples/rea/      script.json + 平台文案（拟真风格完整案例）
```
