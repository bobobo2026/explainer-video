#!/usr/bin/env python3
"""拼页面：base.html 的 @@SCENES@@ ← scenes.js（其中 // @@WIDGETS@@ 处插入 widgets.js）
用法：python3 build.py <base.html> <作品目录>   → 写 <作品目录>/index.html"""
import sys, os
base, d = sys.argv[1], sys.argv[2]
W = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'widgets.js')
h = open(base, encoding='utf-8').read(); sc = open(os.path.join(d, 'scenes.js'), encoding='utf-8').read(); w = open(W, encoding='utf-8').read()
p = sc.split('// @@WIDGETS@@'); body = p[0] + w + p[1] if len(p) == 2 else w + sc
open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(h.replace('@@SCENES@@', body)); print('✓', d + '/index.html')
