# 用法：python3 tts_timeline.py script.json <项目目录>   （VOICE=zh-CN-YunxiNeural RATE=+8% 可改）
# script.json: [{"scene":"hook","say":"口播原文","show":"可选","pause":0.35}, ...]
# 输出：<项目>/audio/voice.wav（48k 单声道）+ <项目>/public/timeline.json {duration,fps,sentences[{scene,say,start,end,words[{t,s,e}]}],mouth[每帧0..1]}
# 兜底方案：edge-tts 免费但「AI 味」重；真人录音请用 voice_to_timeline.py
import asyncio, json, edge_tts, subprocess, os, wave, numpy as np
VOICE, RATE = os.environ.get('VOICE','zh-CN-YunxiNeural'), os.environ.get('RATE','+8%')
import sys
SCRIPT, OUTDIR = (sys.argv[1] if len(sys.argv)>1 else 'script.json'), (sys.argv[2] if len(sys.argv)>2 else '.')
S = json.load(open(os.path.abspath(SCRIPT)))
os.makedirs(OUTDIR+'/audio',exist_ok=True); os.makedirs(OUTDIR+'/public',exist_ok=True); os.chdir(OUTDIR)
async def one(i, s):
    c = edge_tts.Communicate(s['say'], VOICE, rate=RATE, boundary='WordBoundary')
    words=[]; 
    with open(f'audio/s{i:02d}.mp3','wb') as f:
        async for ch in c.stream():
            if ch['type']=='audio': f.write(ch['data'])
            elif ch['type']=='WordBoundary': words.append({'t':ch['text'],'s':ch['offset']/1e7,'e':(ch['offset']+ch['duration'])/1e7})
    return words
async def main():
    out=[]; t=0.25; pcm=[np.zeros(int(0.25*48000),np.float32)]
    for i,s in enumerate(S):
        w = await one(i,s)
        subprocess.run(['ffmpeg','-v','error','-y','-i',f'audio/s{i:02d}.mp3','-ac','1','-ar','48000','-f','f32le',f'audio/s{i:02d}.raw'],check=True)
        x=np.fromfile(f'audio/s{i:02d}.raw',np.float32)
        # 去掉首尾静音
        nz=np.where(np.abs(x)>0.01)[0]; a=max(0,nz[0]-480); b=min(len(x),nz[-1]+2400); x=x[a:b]; off=a/48000
        d=len(x)/48000
        out.append({**s,'start':round(t,3),'end':round(t+d,3),'words':[{'t':q['t'],'s':round(t+q['s']-off,3),'e':round(t+q['e']-off,3)} for q in w]})
        pcm.append(x); t+=d
        p=s['pause']; pcm.append(np.zeros(int(p*48000),np.float32)); t+=p
    y=np.concatenate(pcm); dur=len(y)/48000+0.6
    with wave.open('audio/voice.wav','wb') as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(48000); wf.writeframes((np.clip(y,-1,1)*32767).astype(np.int16).tobytes())
    # 嘴型：每帧 RMS
    fps=30; n=int(dur*fps); hop=48000//fps; env=[]
    for k in range(n):
        seg=y[k*hop:(k+1)*hop]; env.append(float(np.sqrt(np.mean(seg**2))) if len(seg) else 0.0)
    m=max(env) or 1; env=[round(min(1,v/m*1.6),3) for v in env]
    json.dump({'duration':round(dur,2),'fps':fps,'sentences':out,'mouth':env},open('public/timeline.json','w'),ensure_ascii=False)
    print('dur',round(dur,2)); [print(o['scene'],o['start'],o['end'],len(o['words']), ' '.join(q['t'] for q in o['words'])[:80]) for o in out]
asyncio.run(main())
