#!/usr/bin/env python3
"""重切字幕条：TTS 断句不理想时，把几条 cue 的字重新分组。
用法：python3 recue.py <作品目录> '[[[16,17],["做PPT改Excel整理文件夹","清理C盘改代码操作浏览器"]]]'
（文字要和 字幕.json 里的字逐字一致，不含标点空格）改完重跑 生成timeline.mjs"""
import json, sys
d0, fixes = sys.argv[1], json.loads(sys.argv[2])
p = f'{d0}/字幕.json'; d = json.load(open(p, encoding='utf-8')); chars = d['chars']
for ids, texts in fixes:
    cs = [c for c in chars if c['cue'] in ids]; base = min(ids); k = 0
    for j, tx in enumerate(texts):
        acc = ''
        while acc != tx:
            acc += cs[k]['text']; cs[k]['cue'] = base + j; k += 1
            assert len(acc) <= len(tx) and tx.startswith(acc), (acc, tx)
    assert k == len(cs), '文字没对齐'
ids = sorted(set(c['cue'] for c in chars)); cues = []
for i in ids:
    cc = [c for c in chars if c['cue'] == i]
    cues.append({'id': i, 'text': ''.join(c['text'] for c in cc), 'start': cc[0]['start'], 'end': cc[-1]['end']})
for i, c in enumerate(cues):
    c['show'] = round(max(0, c['start'] - 0.05), 3)
    c['hide'] = round(cues[i + 1]['start'] - 0.05, 3) if i + 1 < len(cues) else d['duration']
d['cues'] = cues; json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1); print('✓', p)
