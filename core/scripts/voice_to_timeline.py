# 真人录音 / 外部高质量 TTS → 与 tts_timeline.py 完全相同格式的 timeline.json，画面代码不用改。
# 用法：python3 voice_to_timeline.py 录音.(wav|mp3|m4a) script.json <项目目录> [--min-gap 0.28]
# 原理：
#   1) 有 faster-whisper（pip install faster-whisper）→ 字级时间戳，按稿子逐字对齐（最准）；
#   2) 没有 → 静音检测切句：要求录音时每句之间停顿 ≥0.3 秒、句数与 script.json 一致；句内按字数均分时间。
#      切出来的句数不对时会打印每段时长，调 --min-gap 或让用户重录停顿更清楚的版本。
import sys, json, os, subprocess, wave, numpy as np
src, script, out = sys.argv[1], sys.argv[2], sys.argv[3]
mg = float(sys.argv[sys.argv.index('--min-gap')+1]) if '--min-gap' in sys.argv else 0.15
S = json.load(open(script)); SR = 48000
os.makedirs(out+'/audio', exist_ok=True); os.makedirs(out+'/public', exist_ok=True)
wav = out+'/audio/voice.wav'
subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-ac','1','-ar',str(SR),'-af','highpass=f=70,loudnorm=I=-18',wav],check=True)
with wave.open(wav) as w: y = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32)/32768
PUN = set('，。？！：；、,.?!:; ')
def chars(s): return [c for c in s if c not in PUN]
sent = []
try:
    from faster_whisper import WhisperModel
    m = WhisperModel(os.environ.get('WHISPER','small'), compute_type='int8')
    y16 = np.interp(np.arange(0, len(y), 3), np.arange(len(y)), y).astype(np.float32)  # 48k→16k，直接喂数组（绕开 PyAV 版本问题）
    segs, _ = m.transcribe(y16, language='zh', word_timestamps=True, initial_prompt='以下是普通话的句子。')
    segs = list(segs)
    W = [(c, w.start + (w.end-w.start)*k/max(1,len(w.word.strip())), w.end) for s in segs for w in s.words for k, c in enumerate(w.word.strip())]
    # 全局序列对齐（difflib）：识别结果可能有错字/阿拉伯数字/繁体，匹配上的字取识别时间，没匹配上的按前后插值
    import difflib
    allc = [c for s in S for c in chars(s['say'])]
    rec = [w[0] for w in W]
    tt = [None]*len(allc)
    sm = difflib.SequenceMatcher(None, [c.lower() for c in allc], [c.lower() for c in rec], autojunk=False)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size): tt[blk.a+k] = W[blk.b+k][1]
    known = [k for k, v in enumerate(tt) if v is not None]
    print('匹配率', round(len(known)/len(allc)*100), '%')
    if len(known) < len(allc)*0.4: raise RuntimeError('识别结果和稿子差太多')
    tt = list(np.interp(range(len(allc)), known, [tt[k] for k in known]))
    for k in range(1, len(tt)): tt[k] = max(tt[k], tt[k-1])
    i = 0
    for s in S:
        n = len(chars(s['say'])); sent.append(tt[i:i+n]); i += n
    print('对齐方式：faster-whisper 字级')
except Exception as ex:
    print('（faster-whisper 不可用：', type(ex).__name__, '→ 改用静音切句）')
    hop = SR//100; e = np.array([np.sqrt(np.mean(y[i:i+hop]**2)) for i in range(0, len(y)-hop, hop)])
    thr = max(0.012, np.percentile(e, 30)*1.8); voiced = e > thr
    # 找 ≥mg 秒的静音，把有声段切开
    segs = []; i = 0; n = len(voiced)
    while i < n:
        if voiced[i]:
            j = i; gap = 0
            while j < n and gap < mg*100: gap = 0 if voiced[j] else gap+1; j += 1
            segs.append((i/100, (j-gap)/100)); i = j
        else: i += 1
    segs = [s for s in segs if s[1]-s[0] > 0.25]
    # 用动态规划在所有停顿里挑 N-1 个切点：每句时长要接近「按字数估计的时长」，同时优先切在长停顿上
    def weight(t): return sum(0.45 if c.isascii() else 1 for c in chars(t))
    wts = [weight(s['say']) for s in S]
    if len(segs) < len(S):
        print('✗ 只找到', len(segs), '段有声音，稿子有', len(S), '句：请让每句之间停顿更明显'); sys.exit(1)
    T0, T1 = segs[0][0], segs[-1][1]; tot = sum(b-a for a,b in segs); W = sum(wts)
    G = len(segs)-1; INF = 1e18
    # dp[i][g]：前 i 句用掉前 g+1 段
    import math
    dp = [[INF]*(G+1) for _ in range(len(S)+1)]; bk = [[-1]*(G+1) for _ in range(len(S)+1)]
    def cost(i, g0, g1):  # 第 i 句覆盖 segs[g0..g1]
        d = sum(segs[k][1]-segs[k][0] for k in range(g0, g1+1)); exp = tot*wts[i]/W
        gap = segs[g1+1][0]-segs[g1][1] if g1 < G else 1.0
        return math.log(max(d,0.05)/exp)**2 - 1.5*min(gap,1.0)
    for g in range(G+1): dp[1][g] = cost(0, 0, g)
    for i in range(2, len(S)+1):
        for g in range(i-1, G+1):
            for h in range(i-2, g):
                if dp[i-1][h] < INF:
                    c = dp[i-1][h] + cost(i-1, h+1, g)
                    if c < dp[i][g]: dp[i][g] = c; bk[i][g] = h
    cuts = []; g = G
    for i in range(len(S), 0, -1):
        h = bk[i][g] if i > 1 else -1; cuts.append((segs[h+1][0], segs[g][1])); g = h
    segs = cuts[::-1]
    for (a, b), s in zip(segs, S):
        cs = chars(s['say']); sent.append([a + (b-a)*k/len(cs) for k in range(len(cs))])
    print('对齐方式：静音切句 + 句内均分（装 faster-whisper 会更准）')
out_s = []
for s, ts in zip(S, sent):
    cs = chars(s['say']); end = ts[-1] + 0.25
    words = [{'t': c, 's': round(t,3), 'e': round(ts[k+1] if k+1 < len(ts) else end,3)} for k, (c, t) in enumerate(zip(cs, ts))]
    out_s.append({**s, 'start': round(ts[0],3), 'end': round(end,3), 'words': words})
for k in range(len(out_s)-1): out_s[k]['pause'] = round(max(0, out_s[k+1]['start']-out_s[k]['end']),2)
dur = len(y)/SR + 0.4; fps = 30; hop = SR//fps
env = [float(np.sqrt(np.mean(y[k*hop:(k+1)*hop]**2))) if k*hop < len(y) else 0 for k in range(int(dur*fps))]
mx = max(env) or 1; env = [round(min(1, v/mx*1.6),3) for v in env]
json.dump({'duration': round(dur,2), 'fps': fps, 'sentences': out_s, 'mouth': env}, open(out+'/public/timeline.json','w'), ensure_ascii=False)
print('✓ timeline.json', round(dur,2), 's'); [print(o['scene'], o['start'], o['end'], o['say'][:20]) for o in out_s]
