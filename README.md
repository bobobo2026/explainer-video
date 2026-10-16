# explainer-video（v3）

把**一个话题 / 一个开源项目 / 一个知识点**做成中文科普短视频的 Agent Skill：口播 + 逐字字幕 + 配乐音效 + 混音，直接能发抖音 / 小红书 / B站 / 视频号 / X。

一套共用流程，两种画风：

| | 手绘笔记 `styles/handdrawn/` | 拟真出镜 `styles/realistic/` |
|---|---|---|
| 样子 | 白纸、钢笔线、马克笔，边说边画 | 出镜主播（口型同步）+ 真实截图 + 手绘圈注 + 手持微晃 + 胶片颗粒 |
| 适合 | 抽象概念、方法论、「X 是什么」 | 热点项目、产品/工具介绍、带数据的新闻 |
| 画幅 | 1920×1080（有竖屏补丁） | 1080×1920 原生竖屏 |
| 引擎 | dashi-animationstyle（Canvas） | Remotion（React），`template/` 可直接渲染 |

<br>

| 拟真出镜 · 参考成片联系表 |
|---|
| ![拟真出镜参考帧](styles/realistic/reference/00_联系表.jpg) |

| 手绘笔记 · 参考成片联系表 |
|---|
| ![手绘笔记参考帧](styles/handdrawn/assets/reference/00_整片联系表.jpg) |

## 包含什么

- `SKILL.md`：入口（选画风 → 研究 → 写稿 → 配音时间轴 → 画面 → 质检 → 混音 → 交付 + 文案）
- `core/`：两种风格通用的方法、评分表、各平台文案模板和脚本
  - `creative-method.md` 结构和比喻库 · `quality-rubric.md` 评分表 · `platform-copy.md` 文案模板
  - `scripts/tts_timeline.py` TTS → 逐字时间轴 · `voice_to_timeline.py` 真人录音自动对齐 · `audio_bed.py` 配乐音效 · `mix.sh` 混音 · `contact_sheet.sh` 抽帧联系表 · `check_env.sh` 环境检查
- `styles/realistic/`：拟真出镜竖屏。REA 那期的完整 Remotion 工程当模板（13 个场景拆成可复用部件）+ 16 张参考帧 + 「想表达什么就改哪个场景」对照表 + 踩坑记录
- `styles/handdrawn/`：手绘白板。部件库 + 示例分镜 + API 速查 + 渲染脚本 + 参考帧
- `examples/rea/`：拟真风格完整案例（`script.json` + 各平台文案）

## 这套流程解决的事

1. **真人录音自动对齐**：录好口播交给它，自动对到每个字的时刻，画面和音效跟着走，不用改代码（实测约 95% 的字能对上，中位误差约 0.04 秒）。
2. **音效按「哪句话的哪个词」设定**：换配音不用手动重新卡点。
3. **开工前先检查环境**：`check_env.sh` 当场报出缺的字体、配音库、渲染器，按 `SKILL.md` 的步骤补完再开工。
4. **静帧质检评分表**：事实、字幕、真人感、真实素材、质感、竖屏安全区，任一项低于 2 分不交付。

## 安装

复制**整个文件夹**（只拷 `SKILL.md` 不行，脚本和模板都在别的目录里）：

```bash
# Claude Code / Codex
cp -r explainer-video ~/.claude/skills/     # 或 ~/.codex/skills/

# DeepSeek Harness
cp -r explainer-video ~/.dsh/skills/
```

然后跑一次环境检查，必须看到 ✓：

```bash
bash core/scripts/check_env.sh realistic   # 或 handdrawn
```

准备环境（一次性；云端沙盒重置后要重跑）：

```bash
pip3 install numpy edge-tts faster-whisper     # faster-whisper 可选：真人录音字级对齐
mkdir -p ~/.fonts && curl -L -o ~/.fonts/LXGWWenKai-Medium.ttf \
  https://github.com/lxgw/LxgwWenKai/releases/latest/download/LXGWWenKai-Medium.ttf && fc-cache -f
# 还需要：ffmpeg、node 18+、Noto Sans SC、Noto Color Emoji
```

拟真风格在模板目录装渲染依赖（`styles/realistic/template/package.json` 已列好）：

```bash
cd styles/realistic/template && npm install
```

## 用法

把文件夹放进 skills 目录后，直接对 Agent 说：**「用 explainer-video 做一条讲 XX 的竖屏视频」**，它会按 `SKILL.md` 的七步走完。

## 已知边界

- 配音首选真人录音，其次是 MiniMax / 豆包 / ElevenLabs 等高质量 TTS；`edge-tts` 只是免费兜底，用户普遍觉得「太 AI」，交付时要主动说明。
- 首次渲染会下载 Chrome Headless Shell（约 114MB），需要联网；97 秒的片子大约渲染 6 分钟。
- 云端浏览器的 IP 通常在海外，登录国内平台发布会显示「IP属地：海外」还可能触发风控，建议在本地发布。
- 涉及逆向、爬虫、安全这类选题时，稿子里要加合规提醒，只分析用户有权分析的对象。

## 许可与致谢

本仓库以 [MIT](LICENSE) 许可发布。

- 手绘风格依赖 [chuspeeism/dashi-animationstyle](https://github.com/chuspeeism/dashi-animationstyle)（MIT），本仓库不包含其源码，按其 `GUIDE.md` 自行 clone。
- 拟真风格基于 [Remotion](https://github.com/remotion-dev/remotion)（Remotion License，商用需遵守其条款）。
- 字体：霞鹜文楷 / Noto Sans SC / Noto Color Emoji，各自遵循其原始许可。

## v3 相对 v2 的变化

- 合并为一个 skill，加入「拟真出镜」风格（原生竖屏）
- 新增 `voice_to_timeline.py`：真人录音自动对齐到逐字时间轴，画面和音效不用改
- 新增通用 `audio_bed.py`：音效锚在「第 i 句的某个词」上，有两种配乐
- 评分表增加了事实、字幕、真人感、真实素材、质感、竖屏安全区几项
- 新增各平台文案模板

> 由 Notion AI 在制作《AI的三种形态》（手绘）和《REA 逆向一切》（拟真竖屏）时总结而成。
