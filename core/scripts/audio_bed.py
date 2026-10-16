# 配乐 + 音效轨，全部从 timeline.json 的逐字时间算（和画面同一个时钟）。
# 用法：python3 audio_bed.py <项目>/public/timeline.json cues.json <输出目录>   → music.wav + sfx.wav（44.1k 立体声）
# cues.json：
# {"music": "pluck96" | "lofi84" | "none",          // pluck96=现代小调拨弦(信息/科技)；lofi84=温柔 lofi(人文/手绘)
#  "whoosh_on_scene_change": true,                  // 每个场景切换前 0.32s 自动加 whoosh
#  "cues": [
#   {"type":"pop", "at":[4,"没有菜谱"], "off":0.15},              // 第4句说到「没有菜谱」时
#   {"type":"pop", "at":[4,"说出"], "repeat":6, "every":0.133},   // 连续 6 下（配合依次弹出的元素）
#   {"type":"click", "chars":[10,"帮我"], "off":0.12},             // 从「帮我」起每个字一下（打字）
#   {"type":"tick", "at":[0,"二十四万"], "off":-0.2, "until":0.95, "every":0.06},  // 计数器滴答，持续 0.95s
#   {"type":"stamp", "last_words":[1,3]},                         // 第1句最后 3 个词各一下
#   {"type":"pop", "scene":"case", "off":-0.03},                  // 相对场景首句开始
#   {"type":"ding", "t":12.3}                                     // 绝对时间
#  ]}
# 音效类型：pop click ding whoosh swish stamp tick scratch
import sys, json, wave, numpy as np
T = json.load(open(sys.argv[1])); C = json.load(open(sys.argv[2])); OUT = sys.argv[3] if len(sys.argv) > 3 else '.'
S = T['sentences']; SR = 44100; D = T['duration'] + 0.3; N = int(SR*D); rng = np.random.default_rng(3)
def wr(name, L, R):
    x = np.clip(np.stack([L, R], 1), -1, 1); s = (x*32767).astype(np.int16)
    with wave.open(name, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(s.tobytes())
def wt(i, sub, off=0):
    j = ''.join(w['t'] for w in S[i]['words']); sub = sub.replace(' ', '').replace('，', '')
    idx = j.find(sub)
    if idx < 0: print(f'  ⚠ 第{i}句找不到「{sub}」，用句首'); return S[i]['start']+off
    c = 0
    for w in S[i]['words']:
        if c+len(w['t']) > idx: return w['s']+(w['e']-w['s'])*(idx-c)/len(w['t'])+off
        c += len(w['t'])
scenes = []; [scenes.append(s['scene']) for s in S if s['scene'] not in scenes]
st = {n: next(s['start'] for s in S if s['scene'] == n) for n in scenes}
E = []
if C.get('whoosh_on_scene_change', True): E += [('whoosh', st[n]-0.32) for n in scenes[1:]]
for q in C.get('cues', []):
    ty, off = q['type'], q.get('off', 0)
    if 'chars' in q:
        i, sub = q['chars']; t0 = wt(i, sub)
        for w in S[i]['words']:
            if w['s'] >= t0-0.01:
                for k in range(len(w['t'])): E.append((ty, w['s']+(w['e']-w['s'])*k/len(w['t'])+off))
        continue
    if 'last_words' in q:
        i, n = q['last_words']; E += [(ty, w['s']+off) for w in S[i]['words'][-n:]]; continue
    t = wt(*q['at'], off) if 'at' in q else (st[q['scene']]+off if 'scene' in q else q['t']+off)
    if 'until' in q: E += [(ty, x) for x in np.arange(t, t+q['until'], q.get('every', 0.06))]
    else: E += [(ty, t+k*q.get('every', 0.13)) for k in range(q.get('repeat', 1))]
L = np.zeros(N); R = np.zeros(N)
def add(t, sig, amp=1, pan=0):
    i = int(t*SR)
    if i < 0 or i >= N: return
    n = min(len(sig), N-i); L[i:i+n] += sig[:n]*amp*(1-pan); R[i:i+n] += sig[:n]*amp*(1+pan)
def tt(d): return np.arange(int(d*SR))/SR
def lp(x, k): return np.convolve(x, np.ones(k)/k, 'same')
def s_pop(): t = tt(.12); f = 500+900*t/.12; return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*35)*0.6
def s_click(): t = tt(.03); return np.diff(rng.standard_normal(len(t)+1))*np.exp(-t*220)*0.25+np.sin(2*np.pi*2400*t)*np.exp(-t*300)*0.15
def s_ding(): t = tt(.9); return (np.sin(2*np.pi*1568*t)+0.5*np.sin(2*np.pi*2352*t)*np.exp(-t*6)+0.3*np.sin(2*np.pi*3136*t))*np.exp(-t*5)*0.25
def s_whoosh(): t = tt(.5); return lp(rng.standard_normal(len(t)), 20)*np.sin(np.pi*t/.5)**2*0.5
def s_swish(): t = tt(.22); return lp(rng.standard_normal(len(t)), 4)*np.sin(np.pi*t/.22)**1.5*0.3
def s_stamp(): t = tt(.35); f = 60+120*np.exp(-t*25); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*12)*0.9+lp(rng.standard_normal(len(t)), 3)*np.exp(-t*40)*0.4
def s_tick(): t = tt(.02); return np.sin(2*np.pi*3200*t)*np.exp(-t*400)*0.25
def s_scratch(): t = tt(.3); return lp(rng.standard_normal(len(t)), 2)*(0.5+0.5*np.sin(2*np.pi*14*t))*np.sin(np.pi*t/.3)*0.22
G = {k[2:]: v for k, v in globals().items() if k.startswith('s_')}
for ty, t in E: add(t, G[ty](), 1, rng.uniform(-.3, .3))
wr(f'{OUT}/sfx.wav', L*0.9, R*0.9)
from collections import Counter; print('音效', dict(Counter(e[0] for e in E)))
# ---------------- music ----------------
L = np.zeros(N); R = np.zeros(N); m2f = lambda m: 440*2**((m-69)/12)
P = {'pluck96': dict(bpm=96, ch=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]], bs=[45,41,48,43], arp=[0,1,2,1,2,0,1,2], kick=0.28, pluck=0.05, pad=0.018),
     'lofi84':  dict(bpm=84, ch=[[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59]], bs=[41,40,38,36], arp=[0,2,1,3,2,1,3,2], kick=0.2, pluck=0.035, pad=0.022)}
mode = C.get('music', 'pluck96')
if mode != 'none':
    p = P[mode]; beat = 60/p['bpm']; bar = beat*4
    def pluck(t0, f, dur, amp, pan=0):
        t = tt(dur); x = (np.sign(np.sin(2*np.pi*f*t))*0.25+np.sin(2*np.pi*f*t)+0.4*np.sin(2*np.pi*2*f*t))*np.exp(-t*9)*amp; add(t0, lp(x, 6 if mode == 'pluck96' else 14), 1, pan)
    def pad(t0, f, dur, amp):
        t = tt(dur); env = np.minimum(1, t/0.4)*np.minimum(1, (dur-t)/0.4); add(t0, (np.sin(2*np.pi*f*t)+np.sin(2*np.pi*f*1.004*t)+0.3*np.sin(2*np.pi*2*f*t))*env*amp)
    k = 0; t = 0
    while t < D:
        c = p['ch'][k % 4]
        for m in c: pad(t, m2f(m), bar, p['pad'])
        for j in range(8): pluck(t+j*beat/2, m2f(c[p['arp'][j] % len(c)]+12), 0.4, p['pluck'], 0.3 if j % 2 else -0.3)
        for b in range(4):
            tb = t+b*beat; tq = tt(beat*0.9)
            add(tb, np.sin(2*np.pi*m2f(p['bs'][k % 4]-12)*tq)*np.minimum(1, tq*60)*np.exp(-tq*2)*0.16)
            if k >= 1:
                tq = tt(.3); f = 45+110*np.exp(-tq*35)
                if mode == 'pluck96' or b in (0, 2): add(tb, np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tq*10)*p['kick'])
                if b in (1, 3): tq = tt(.18); add(tb, lp(rng.standard_normal(len(tq)), 2)*np.exp(-tq*28)*0.08)
                tq = tt(.04); add(tb+beat/2, np.diff(rng.standard_normal(len(tq)+1))*np.exp(-tq*120)*0.04, 1, 0.2)
        t += bar; k += 1
    def verb(x):
        y = x.copy()
        for d, g in ((0.029, 0.3), (0.043, 0.27), (0.067, 0.22), (0.101, 0.17), (0.143, 0.12)): n = int(d*SR); y[n:] += x[:-n]*g
        return y
    L = verb(L); R = verb(R)
    fade = np.ones(N); e = int((D-2.5)*SR); fade[e:] = np.linspace(1, 0, N-e); fade[:int(0.3*SR)] = np.linspace(0, 1, int(0.3*SR))
    m = max(abs(L).max(), abs(R).max()) or 1; L, R = L/m*0.8*fade, R/m*0.8*fade
wr(f'{OUT}/music.wav', L, R); print('✓', OUT+'/music.wav', OUT+'/sfx.wav')
