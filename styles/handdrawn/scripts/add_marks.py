#!/usr/bin/env python3
"""给 分镜.json 写关键词时间点（marks），场景代码用 M('词') 拿到这个词开始说出的秒数。
用法：python3 add_marks.py <作品目录> '[["电脑",2,"电脑"],["马具2",9,"马具"]]'   # [名字, cue编号, 原文短语]
同一个词出现两次：名字加后缀（马具2），短语照写。写完重跑 node pipeline/生成timeline.mjs <作品目录>"""
import json, sys
d, ms = sys.argv[1], json.loads(sys.argv[2])
p = f'{d}/分镜.json'; s = json.load(open(p, encoding='utf-8'))
s['marks'] = [{'name': a, 'cue': b, 'phrase': c} for a, b, c in ms]
json.dump(s, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1); print('✓', len(ms), 'marks')
