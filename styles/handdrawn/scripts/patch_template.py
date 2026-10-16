#!/usr/bin/env python3
"""把 dashi-animationstyle 新建作品生成的 index.html 变成可复用底座 base.html。
用法：python3 patch_template.py <作品目录>/index.html <输出 base.html> [--vertical]
--vertical：改成 1080×1920 竖屏（舞台/画布/W,H/镜头焦点/字幕区/字幕字号），渲染要用 render_any.mjs + VW=1080 VH=1920
做三件事：①字体前置 LXGW WenKai / Verdana（Linux 没有苹方/Hannotate）②删掉模板空的 fxBefore（场景里自己定义）
③场景入口 drawSections → drawScenes；把模板骨架场景段替换成 @@SCENES@@ 占位。"""
import sys
src, out = sys.argv[1], sys.argv[2]; V = '--vertical' in sys.argv
h = open(src, encoding='utf-8').read()
a = h.index('// ===== 场景'); b = h.index('// ===== 底座（续）：字幕 =====')
h = h[:a] + '@@SCENES@@\n' + h[b:]
R = [("const F_HAND = '\"Hannotate SC\"", "const F_HAND = '\"LXGW WenKai\", \"Hannotate SC\""),
     ("const F_ROUND = '\"Yuanti SC\"", "const F_ROUND = '\"LXGW WenKai\", \"Yuanti SC\""),
     ("const F_EN = '\"Arial Rounded MT Bold\"", "const F_EN = '\"Verdana\", \"Arial Rounded MT Bold\""),
     ("function fxBefore(t) { }", ""),
     ("drawSections(t, v);", "drawScenes(t, v);")]
if V: R += [("width: 1920px; height: 1080px", "width: 1080px; height: 1920px"), ('width="1920" height="1080"', 'width="1080" height="1920"'),
           ("const W = 1920, H = 1080", "const W = 1080, H = 1920"), ("const FOCUS = { x: 960, y: 455 }, SUB_TOP = 908;", "const FOCUS = { x: 540, y: 820 }, SUB_TOP = 1600;"),
           ("let CAM0 = { x: 960,", "let CAM0 = { x: 540,"), ("f = hand(64, 700), y = 990, PB = 12;", "f = hand(56, 700), y = SUB_TOP + 110, PB = 12;")]
for x, y in R:
    if x not in h: print('⚠ 没找到（模板可能改版了，手动检查）：', x[:50]); continue
    h = h.replace(x, y, 1)
open(out, 'w', encoding='utf-8').write(h); print('✓', out)
