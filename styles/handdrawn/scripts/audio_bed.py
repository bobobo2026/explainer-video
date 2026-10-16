# 用法：python3 audio_bed.py events.json  → 生成 audio_music.wav（84BPM lofi）+ audio_sfx.wav（纸张音效）
# events.json: {"duration":137.3,"segment_starts":[0,35.4,...],"segments":[{"offset":0,"pop":[..],"card":[..],"stamp":[..],"thud":[..],"ding":[..],"click":[..],"whoosh":[切镜时间..],"whoosh_long":[..]}]}
import numpy as np, json, wave
import sys
EV=json.load(open(sys.argv[1]))
SR=44100; D=float(EV['duration']); N=int(SR*D)
rng=np.random.default_rng(7)

def wr(name,x):
    x=np.clip(x,-1,1); s=(x*32767).astype(np.int16)
    with wave.open(name,'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(s.tobytes())
# ---- music: 84 BPM lofi, Fmaj7 Em7 Dm7 Cmaj7, 1 bar each ----
bpm=84; beat=60/bpm; bar=beat*4
L=np.zeros(N); R=np.zeros(N)
def note(buf,t0,f,dur,amp,pan=0.0,bright=1.0):
    i0=int(t0*SR); n=int(dur*SR)
    if i0>=N: return
    n=min(n,N-i0); tt=np.arange(n)/SR
    env=(1-np.exp(-tt*80))*np.exp(-tt*2.2/dur*1.5)
    det=1.003
    sig=(np.sin(2*np.pi*f*tt)+0.35*bright*np.sin(2*np.pi*2*f*tt)*np.exp(-tt*3)+0.12*bright*np.sin(2*np.pi*3*f*tt)*np.exp(-tt*5)+0.5*np.sin(2*np.pi*f*det*tt))/1.9
    s=sig*env*amp
    L[i0:i0+n]+=s*(1-pan)*0.9; R[i0:i0+n]+=s*(1+pan)*0.9
m2f=lambda m:440*2**((m-69)/12)
chords=[[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59]]
bass=[41,40,38,36]
mel=[[72,None,69,67],[67,None,64,None],[65,67,69,None],[64,None,62,60]]
t=0;k=0
while t<D:
    c=chords[k%4]
    for j,m in enumerate(c): note(L,t+j*0.03,m2f(m),bar*0.95,0.06,pan=(j-1.5)*0.3,bright=0.7)
    note(L,t+beat*2.5,m2f(c[2]+12),beat*1.2,0.025,pan=0.4)
    note(L,t,m2f(bass[k%4]-12+12),beat*1.8,0.09,bright=0.3); note(L,t+beat*2,m2f(bass[k%4]),beat*1.5,0.07,bright=0.3)
    if k>=1:
        for j,m in enumerate(mel[k%4]):
            if m: note(L,t+j*beat,m2f(m),beat*1.1,0.035,pan=-0.2,bright=1.2)
    # drums
    for b in range(4):
        tb=t+b*beat; i0=int(tb*SR)
        if i0>=N-SR//2: continue
        if b in (0,2):  # soft kick
            n=int(0.35*SR); tt=np.arange(n)/SR; f=50+90*np.exp(-tt*30)
            kk=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*9)*0.22
            e=min(N,i0+n); L[i0:e]+=kk[:e-i0]; R[i0:e]+=kk[:e-i0]
        if b in (1,3):  # snare-ish brush
            n=int(0.2*SR); nz=rng.standard_normal(n)*np.exp(-np.arange(n)/SR*25)*0.05
            nz=np.convolve(nz,np.ones(4)/4,'same'); e=min(N,i0+n); L[i0:e]+=nz[:e-i0]; R[i0:e]+=nz[:e-i0]
        for h in (0,0.5):  # hats
            i1=int((tb+h*beat)*SR); n=int(0.05*SR); nz=np.diff(rng.standard_normal(n+1))*np.exp(-np.arange(n)/SR*90)*0.02
            e=min(N,i1+n); L[i1:e]+=nz[:e-i1]*0.8; R[i1:e]+=nz[:e-i1]
    t+=bar;k+=1
# vinyl crackle
cr=np.zeros(N); idx=rng.integers(0,N,int(D*25)); cr[idx]=rng.standard_normal(len(idx))*0.03
L+=cr; R+=cr
# simple reverb (feedback delays)
def verb(x):
    y=x.copy()
    for d,g in ((0.031,0.35),(0.047,0.3),(0.071,0.25),(0.113,0.2)):
        n=int(d*SR); z=np.zeros_like(x); z[n:]=x[:-n]*g; y+=z
    return y
L=verb(L); R=verb(R)
fade=np.ones(N); fi=int(1.0*SR); fo=int(2.0*SR); fade[:fi]=np.linspace(0,1,fi); fade[-fo:]=np.linspace(1,0,fo)
wr('audio_music.wav',np.stack([L*fade,R*fade],1).ravel())
# ---- sfx ----
S=np.zeros(N)
def add(t0,sig):
    i0=int(t0*SR); e=min(N,i0+len(sig))
    if i0<N: S[i0:e]+=sig[:e-i0]
def pop(amp=0.35):  # paper tap
    n=int(0.09*SR); tt=np.arange(n)/SR
    return (np.sin(2*np.pi*(900*np.exp(-tt*25)+300)*tt)*0.6+rng.standard_normal(n)*0.4)*np.exp(-tt*55)*amp
def whoosh(d=0.6,amp=0.25):
    n=int(d*SR); tt=np.arange(n)/SR; nz=rng.standard_normal(n)
    env=np.sin(np.pi*tt/d)**2
    out=np.zeros(n); k=0.0
    for i in range(n):
        a=0.02+0.25*env[i]; k=k+a*(nz[i]-k); out[i]=k
    return out*env*amp*3
def thud(amp=0.6):
    n=int(0.4*SR); tt=np.arange(n)/SR; f=60+120*np.exp(-tt*25)
    return (np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*10)+rng.standard_normal(n)*np.exp(-tt*60)*0.3)*amp
def click(amp=0.3):
    n=int(0.03*SR); tt=np.arange(n)/SR; return rng.standard_normal(n)*np.exp(-tt*300)*amp
def ding(amp=0.18):
    n=int(0.8*SR); tt=np.arange(n)/SR; return (np.sin(2*np.pi*1320*tt)+0.4*np.sin(2*np.pi*1980*tt))*np.exp(-tt*5)*amp
KIND={'pop':lambda:pop(),'card':lambda:pop(0.26),'stamp':lambda:thud(),'thud':lambda:thud(0.45),'ding':lambda:ding(0.1),'click':lambda:click(),'whoosh':lambda:whoosh(),'whoosh_long':lambda:whoosh(0.9,0.22)}
LEAD={'pop':-0.03,'stamp':-0.05,'whoosh':-0.35}
for seg in EV['segments']:
    o=seg.get('offset',0)
    for k,ts in seg.items():
        if k=='offset': continue
        for x in ts: add(o+x+LEAD.get(k,0),KIND[k]())
for o in EV.get('segment_starts',[])[1:]: add(o-0.4,whoosh(0.7,0.3))
wr('audio_sfx.wav',np.stack([S,S],1).ravel())
print('ok')
