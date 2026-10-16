# explainer-video

**An Agent Skill that turns a topic, an open-source project, or an idea into a finished Chinese explainer short video** — narration, word-level captions, music, sound effects, a mixed master, a quality rubric, and per-platform copy included.

[English](README.md) · [简体中文](README.zh-CN.md) · [Docs site](https://bobobo2026.github.io/explainer-video/) · [llms.txt](https://bobobo2026.github.io/explainer-video/llms.txt)

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Agent Skill](https://img.shields.io/badge/Agent%20Skill-SKILL.md-orange.svg)](SKILL.md)
[![Docs](https://img.shields.io/badge/docs-GitHub%20Pages-green.svg)](https://bobobo2026.github.io/explainer-video/)
![Version](https://img.shields.io/badge/version-v3-lightgrey.svg)

---

## What is explainer-video?

`explainer-video` is a reusable **Agent Skill**: a folder containing a `SKILL.md` entry point, a shared production pipeline, runnable Python/Shell scripts, and two complete art-style engines. Drop the folder into your agent's skills directory, and the agent can produce a publish-ready Chinese explainer video end to end — from topic research to the final mixed MP4 and the Douyin / Xiaohongshu / Bilibili / WeChat Channels / X captions.

It is **not** a text-to-video model. The visuals are real code (React/Remotion compositions and Canvas/whiteboard scenes) driven by a word-level narration timeline, so every frame is deterministic, editable, and re-renderable — swap the voice track and the animation, sound effects, and captions re-align automatically.

- **Two art styles, one pipeline:** hand-drawn whiteboard (16:9) and photoreal talking-head vertical (1080×1920).
- **Word-level timing is the spine:** a single `timeline.json` (`{scene, say, start, end, words[], mouth}`) drives captions, animation cues, SFX and mouth shapes.
- **Agent-native:** designed to be copied whole into a skills directory — no service, no API keys required (unless you want premium TTS).

## Two art styles

| | Hand-drawn whiteboard `styles/handdrawn/` | Photoreal talking-head `styles/realistic/` |
|---|---|---|
| Look | Paper, pen lines, marker fills; drawn while the narrator speaks | On-camera presenter (lip-synced) + real screenshots + hand-drawn callouts + handheld drift + film grain |
| Best for | Abstract concepts, methodology, "what is X" | Trending projects, product/tool intros, data-driven news |
| Aspect | 1920×1080 (vertical patch included) | **1080×1920 native vertical** |
| Engine | [dashi-animationstyle](https://github.com/chuspeeism/dashi-animationstyle) (Canvas) | [Remotion](https://github.com/remotion-dev/remotion) (React) — template renders as-is |

| Photoreal vertical · reference contact sheet (REA episode) |
|---|
| ![Photoreal vertical reference frames](styles/realistic/reference/00_联系表.jpg) |

| Hand-drawn whiteboard · reference contact sheet |
|---|
| ![Hand-drawn whiteboard reference frames](styles/handdrawn/assets/reference/00_整片联系表.jpg) |

## Key facts

| | |
|---|---|
| Skill version | v3 (single skill, two styles) |
| Reusable scenes in the vertical template | 13 (`hook` → `cta`) |
| Reference frames shipped | 16 photoreal + 19 hand-drawn |
| Target episode length | 60–120 s |
| Real-voice word alignment accuracy | ≈95% of characters matched, median error ≈0.04 s (faster-whisper, word-level) |
| Master loudness | −14 LUFS integrated, −1.5 dBTP, music ducked under voice |
| Music beds | `pluck96` (modern plucked) and `lofi84` (gentle lofi) |
| Render cost | ≈3.7 s wall-clock per 1 s of video (Remotion, concurrency 2) |
| Quality gate | 9-item rubric; any dimension below 2/5 does not ship |
| License | MIT |

## How it works

1. **Pick a style** — the agent asks, or recommends from your goal.
2. **Research and fact-check** — numbers, quotes and screenshots are collected with sources and dates before any writing.
3. **Write the script** — `script.json`, spoken-colloquial sentences (≤20 characters each), hook in the first 3 seconds.
4. **Narration → word-level timeline** — your own recording (`voice_to_timeline.py`), premium TTS, or `edge-tts` as a free fallback; output is `voice.wav` + `timeline.json`.
5. **Visuals** — one idea per shot, visuals cued to the exact word (`wf(sentence, 'word')` in Remotion, `M('word')` in whiteboard).
6. **Quality check** — stills from every scene are tiled into a contact sheet and really looked at; scored against `core/quality-rubric.md`.
7. **Music, SFX and mix** — SFX are anchored to "word *k* of sentence *i*" in `cues.json`, so replacing the narration never breaks the timing; `mix.sh` ducks music under voice and normalizes to −14 LUFS.
8. **Delivery** — final MP4 plus 抖音 / 小红书 / B站 (with chapter timestamps) / 视频号 / X copy.

## Install

Copy the **whole folder** (copying only `SKILL.md` will not work — the scripts and templates live in the sibling directories):

```bash
# Claude Code / Codex
cp -r explainer-video ~/.claude/skills/     # or ~/.codex/skills/

# DeepSeek Harness
cp -r explainer-video ~/.dsh/skills/
```

Then run the environment check — you must see ✓:

```bash
bash core/scripts/check_env.sh realistic   # or: handdrawn
```

One-time environment setup (re-run after a cloud sandbox reset):

```bash
pip3 install numpy edge-tts faster-whisper     # faster-whisper is optional: word-level alignment for real recordings
mkdir -p ~/.fonts && curl -L -o ~/.fonts/LXGWWenKai-Medium.ttf \
  https://github.com/lxgw/LxgwWenKai/releases/latest/download/LXGWWenKai-Medium.ttf && fc-cache -f
# also required: ffmpeg, node 18+, Noto Sans SC, Noto Color Emoji
```

Photoreal style: install the render dependencies (already declared in `styles/realistic/template/package.json`):

```bash
cd styles/realistic/template && npm install
```

## Usage

Once the folder sits in your skills directory, just tell the agent:

> Use explainer-video to make a vertical video about *&lt;topic / repo&gt;*.

The agent then follows the seven steps in `SKILL.md`. To swap the presenter, replace the SVG parts in the `Host` component (or supply a photo/AI avatar as one neutral mouth base plus three mouth-openness sprites and one blink sprite) — lip sync keeps working because it is driven by `timeline.mouth`.

## Repository layout

```
SKILL.md              entry point: style → research → script → voice+timeline → visuals → QA → mix → delivery
core/                 shared across both styles
  creative-method.md    structure, metaphor library, colloquial-writing rules
  quality-rubric.md     9-dimension scoring sheet
  platform-copy.md      per-platform caption templates
  scripts/              check_env.sh · tts_timeline.py · voice_to_timeline.py · audio_bed.py · mix.sh · contact_sheet.sh
styles/realistic/     GUIDE.md · template/ (complete Remotion project, 13 scenes) · reference/ (16 frames)
styles/handdrawn/     GUIDE.md · assets/ (widget library + reference frames) · examples/ · references/ · scripts/
examples/rea/         the reference photoreal episode: script.json + platform copy
tools/                repo tooling: docs generator helpers (not needed to make videos)
docs/                 GitHub Pages site
```

## FAQ

**What exactly is explainer-video?**
It is an Agent Skill — a folder with a `SKILL.md` plus scripts, templates and reference frames — that an AI coding agent loads to produce Chinese explainer short videos end to end.

**Which agents can run it?**
Any agent that supports skill folders, including Claude Code, Codex, and DeepSeek Harness (DSH). The reference episodes were produced with DeepSeek v4.1-flash running on DeepSeek Harness.

**Do I need a paid TTS service?**
No. `edge-tts` is the free fallback and ships word-level timestamps; premium TTS (MiniMax, Doubao/Volcano, ElevenLabs) or your own recording simply produces better "human feel".

**Can I use my own recorded narration?**
Yes, and it is the recommended option. `core/scripts/voice_to_timeline.py` aligns a phone recording to the word level. Measured on the reference episode: ≈95% of characters matched, median error ≈0.04 s. If `faster-whisper` is absent it falls back to silence-based sentence splitting with in-sentence distribution by character count.

**Does swapping the narration break the animation or the sound effects?**
No. Animation cues are anchored to *words* (`wf(sentence,'word')`) and SFX are anchored to *word k of sentence i* in `cues.json`, so a new take re-aligns automatically — no code edits.

**Is the video generated by a text-to-video model?**
No. Frames are rendered from real code: Remotion (React) compositions for the photoreal style, Canvas scenes for the whiteboard style. That makes output deterministic, reviewable and re-renderable, and it lets real screenshots and product UI appear pixel-accurate.

**What are the hard dependencies?**
`ffmpeg`, Node 18+, Python 3 with `numpy`, the Noto Sans SC and Noto Color Emoji fonts, and LXGW WenKai for handwriting annotations. The photoreal template additionally needs Remotion packages; the whiteboard style needs a clone of dashi-animationstyle. `core/scripts/check_env.sh` reports exactly what is missing.

**How long does rendering take?**
About 3.7 seconds of wall-clock per second of video with concurrency 2 — roughly 6 minutes for a 97-second episode. The first render downloads the Chrome Headless Shell (~114 MB).

**Which platforms is the output made for?**
Douyin, Xiaohongshu, Bilibili, WeChat Channels and X. The vertical template keeps content inside platform safe areas (right-side button column, bottom caption zone) and ships caption templates per platform.

**Is it free to use?**
Yes, MIT licensed. Note that Remotion has its own license terms for commercial use, and the fonts and dashi-animationstyle keep their original licenses.

**How is this different from a generic AI video generator?**
Generic generators synthesize pixels from a prompt. `explainer-video` writes and renders a real composition with a fact-checked script and exact word-level sync, so you can fix a single wrong frame, reuse the 13 scene components, and re-render after changing the narration.

## Limitations

- Narration: real recordings first, premium TTS second, `edge-tts` only as a fallback — it is free and word-timed but sounds synthetic, and the skill is instructed to say so at delivery.
- The first render downloads a Chrome Headless Shell (~114 MB) and needs network access.
- Cloud browser IPs are usually overseas, so logging in to Chinese platforms from a sandbox shows "IP location: overseas" and may trip risk control — publish from your own machine.
- For reverse-engineering, scraping or security topics, the script must include a compliance reminder and only analyze software you are allowed to analyze.

## Citation

If you use this work in writing, cite it via [`CITATION.cff`](CITATION.cff):

```bibtex
@software{explainer_video_2026,
  author  = {bobobo2026},
  title   = {explainer-video: an Agent Skill for Chinese explainer short videos},
  year    = {2026},
  version = {3.0.0},
  license = {MIT},
  url     = {https://github.com/bobobo2026/explainer-video}
}
```

## Credits and license

Released under the [MIT License](LICENSE).

- Whiteboard style depends on [chuspeeism/dashi-animationstyle](https://github.com/chuspeeism/dashi-animationstyle) (MIT). Its source is not bundled here — clone it as described in `styles/handdrawn/GUIDE.md`.
- Photoreal style is built on [Remotion](https://github.com/remotion-dev/remotion) (Remotion License — see its terms for commercial use).
- Fonts: LXGW WenKai, Noto Sans SC, Noto Color Emoji, each under its own license.

Summarized by Notion AI while producing two reference episodes: *《AI的三种形态》* (whiteboard) and *《REA 逆向一切》* (photoreal vertical).

If this skill saves you time, a ⭐ helps other creators find it.
