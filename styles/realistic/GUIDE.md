# 拟真出镜风格（竖屏 1080×1920 · Remotion）

参考成片：REA「逆向一切」那期（97 秒）。先看 `reference/00_联系表.jpg` 和 01–16 号帧。

## 「拟真」靠的是这几层（缺一层就会显得廉价）
1. **出镜主播** `<Host/>`：嘴型由 `timeline.mouth`（每帧音量）驱动，会眨眼（随机间隔）、说话时点头、呼吸起伏、音量冲高时挑眉。内容场景里放在右上角小窗 `<FaceCam/>`（带 LIVE 标），开头/结尾等重点场景放大号出镜。
2. **真实素材**：GitHub 手机页面截图、产品界面、官方配图，放进 `<Phone/>` 外壳或带阴影的窗口/拍立得相框里；镜头滚动、推近到关键数字，再用 `<HandCircle/>` / `<HandArrow/>` 橙色手绘圈注。
3. **镜头语言**：全局手持微晃（`Video` 里的 dx/dy/rot）、每个场景缓慢推近、转场时模糊 + 位移 + 淡入淡出（`<Scene/>` 自带）。
4. **质感**：胶片颗粒（`grain.png` 每 2 帧随机偏移）+ 暗角 + 纸色渐变背景 + 点阵。
5. **短视频字幕** `<Subtitle/>`：Noto Sans SC Black + 12px 深色描边，逐字由半透明变亮（跟着发音走），`CFG.keywords` 里的词标黄，超过 13 字自动折成两行（优先在空格、「的/是/把/和/就/，/、」后断）。
6. **声音**：现代拨弦配乐 + 每个动作都有对应音效（打字 click、计数 tick、盖章 stamp、弹出 pop、完成 ding、切场 whoosh）。

## 开工
```bash
cp -r styles/realistic/template /data/work/myvideo && cd /data/work/myvideo
npm i remotion @remotion/bundler @remotion/renderer react react-dom   # 或者软链已有的 node_modules
# 写 script.json → 配音 + 时间轴（见 SKILL.md 第 3 步）
python3 <skill>/core/scripts/tts_timeline.py script.json .           # 或 voice_to_timeline.py 录音.m4a script.json .
# 把截图放进 public/，改 config.ts（栏目名、标黄关键词、哪些场景用大号主播）
# 改 Video.tsx：每个 scene 一个组件，最后在 <Video> 里按顺序挂上 <Scene name="xxx"><Xxx/></Scene>
node render.mjs stills 120 450 900 ...   # 静帧质检
node render.mjs video                    # 整片 → out/video.mp4
```
模板就是 REA 那期的完整工程，能直接渲染。**先改最接近的场景，不要从空白开始写**：
| 想表达 | 抄这个场景 |
|---|---|
| 大数字开场 + 真实网页截图滚动推近 + 圈注 | `Hook` |
| 名字拆解（字母 → 单词）+ 盖章 | `Name` |
| 生活比喻（物件 + 角色 + 元素依次飞出） | `Dish` |
| 有 / 没有对比 + 箭头倒推 + 解锁 | `AppScene` |
| 真实软件截图平移 + 痛点（流汗、日历翻页） | `Old` |
| 架构连线（上中下三层 + 流动光点） | `Plug` |
| 聊天界面里跟着口播逐字打字 → 发送 | `Chat` |
| 步骤转圈 → ✓，结果卡片，盖章 | `Work` |
| 能力清单芯片飞入 → 整体变淡 → 结论卡压上来 | `Scope` |
| 案例拍立得 + 计数器 + 字节格子填满 | `Case` |
| 终端逐字输入命令 + 输出 ✓ | `Install` |
| 合规提醒 | `Warn` |
| 大号主播 + 提问气泡 + 点赞收藏关注 | `CTA` |

## lib.tsx 速查
- 时间：`wf(i,'词',off秒)` 返回第 i 句说到「词」那一刻的**全局帧号**（最常用）；`WIN[scene]=[起,止]` 帧；`S[i].start/end` 秒；`F(秒)` 转帧；`CT[i]` 是逐字时间。
- 动画：`pop(f,起始帧,阻尼)` 弹簧值 0→1；`lin(f,a,b)` 缓动值 0→1。
- 组件：`<Pop start x y rot from>` 弹出容器；`<Title text start sub accent>` 场景标题（左上 x64 y236，**≤7 个字**，84px，否则会折行）；`<Card>`、`<Chip size bg color>`、`<Emoji c size>`（Noto Color Emoji 当道具，比自己画省事又真实）；`<HandCircle x y w h start>`、`<HandArrow x1 y1 x2 y2 start bend>`；`<Spinner done doneAt>`；`<Phone w h>`；`<Host size look energy>`。
- 配色：INK 墨黑、ORANGE 主强调、BLUE、GREEN（成功/证据）、YEL（字幕关键词/高亮底）、CREAM 背景；字体 SANS（Noto Sans SC）/ HAND（霞鹜文楷，手写批注）。

## 竖屏版式（坐标都是 1080×1920，`<Scene>` 内容整体下移了 50px）
| 区域 | y 范围 | 放什么 |
|---|---|---|
| 顶栏 | 150 | 栏目名（CFG.header），进度条在 y=0 |
| 标题 | 236–460 | 左侧 x64–760；右上 x806–1032 / y196–476 是小窗主播，**这块不要放东西** |
| 主画面 | 480–1260 | x 60–1020；抖音右侧按钮大约在 x>940、y 900–1500，重要内容尽量在 x<940 |
| 字幕 | 1395–1560 | CFG.subtitleTop |
| 底部 | >1560 | 会被平台的标题和文案盖住，只放氛围元素 |

## 踩过的坑
- **字幕切段**：按「，。？！：」切，所以「R，E，A」会被切成 3 段单字。lib 已经会把 ≤1 字的段并回前一段。显示文字和读音不一样时，在 `script.json` 里改 `say` 的写法（字幕显示的就是 say）。
- **单字掉行**：标题和卡片宽度要按字数算（84px 的字大约 85px 一个），宁可缩短文案也不要压字。
- **空等**：场景开始后 0.3 秒内就要有东西出现（至少有标题）；主物件不要等到很后面的关键词才出来（例如拍立得应该在场景一开始就出现，而不是等说到「DX Ball」）。
- **截图坐标**：截图缩放成宽 588 后，原图坐标 × (588/原宽) 就是屏幕内坐标；围绕 origin 放大 zoom 倍时，圈注的 x = ox + (x−ox)×zoom。
- **数字精度**：计数器只显示到有把握的精度（239.4k），不要显示「239,400」这种假精确。
- **小窗遮挡**：芯片、标签不要放在 y<480、x>760 的位置。
- **大号主播场景**要加进 `CFG.bigHostScenes`，否则小窗和大号会同时出现。
- 同一时间只跑一个渲染（静帧也算），并行跑会抢 Chrome。97 秒的片子大约渲染 6 分钟。
- 首次渲染会下载 Chrome Headless Shell（约 114MB），需要联网。

## 换主播形象
`Host` 是纯 SVG（viewBox 400×400）：头 / 头发 / 眼镜 / 眉 / 眼 / 嘴 / 卫衣都是独立的 path，改颜色、发型、加帽子都在这个组件里。嘴型逻辑（`mo` 张合、`blink`、`bob`、`brow`）不要动。想用用户的真人照片或 AI 生成的形象：把形象切成「闭嘴底图 + 3 张不同张嘴程度的嘴部贴图」，按 `mo` 选贴图，眨眼用 1 张闭眼贴图，这样口型同步照样能用。
