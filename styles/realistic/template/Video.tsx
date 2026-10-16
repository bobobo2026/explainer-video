import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import {ORANGE, CREAM, BLUE, GREEN, YEL, HAND, FPS, TOTAL, S, MOUTH, F, INK, SANS, clamp, CT, wf, SCENES, WIN, pop, lin, HandCircle, HandArrow, Pop, Card, Chip, Emoji, Title, Spinner, Host, FaceCam, Subtitle, Scene, Phone, Bg, Grain, Progress} from './lib';

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = wf(0, '二十四万'); const scroll = lin(f, 10, t0 + 10);
  const sc = 588 / 1206; // screenshot scale inside phone
  const starsY = 2202 * sc; // stars line in screen px
  const zoom = 1 + 0.55 * lin(f, t0 + 12, t0 + 40);
  const scrY = interpolate(scroll, [0, 1], [0, -(starsY - 520)]);
  const count = Math.round(239400 * lin(f, t0 - 6, t0 + 22));
  const fire = wf(1, '火'); const rea = [wf(1, 'R'), wf(1, 'E', 0), wf(1, 'A，') ];
  const letT = [wf(1, 'R'), F(S[1].words[S[1].words.length - 2].s), F(S[1].words[S[1].words.length - 1].s)];
  const shrink = lin(f, F(S[1].start) + 6, F(S[1].start) + 20);
  return <>
    <div style={{position: 'absolute', left: 64, top: 236}}>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 52, color: '#6b6357'}}>半年时间</div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 140, color: INK, lineHeight: 1.05, fontVariantNumeric: 'tabular-nums'}}>{(count / 1000).toFixed(1)}k</div>
        <Emoji c="⭐" size={96} />
      </div>
    </div>
    <div style={{position: 'absolute', left: 150, top: 520, transform: `rotate(${-2.5 + shrink * 1.5}deg) scale(${1 - shrink * 0.08})`, transformOrigin: 'center top'}}>
      <Phone w={620} h={760}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 620, transformOrigin: `120px ${starsY + scrY}px`, transform: `scale(${zoom})`}}>
          <Img src={staticFile('gh_mobile3.png')} style={{width: 588, transform: `translateY(${scrY}px)`}} />
        </div>
        <HandCircle x={120 + (6 - 120) * zoom} y={starsY + scrY - 40 * zoom} w={200 * zoom} h={78 * zoom} start={t0 + 36} />
      </Phone>
    </div>
    <Pop start={fire} x={440} y={455} rot={-8}><Chip bg={INK} color="#fff" size={44}><Emoji c="🔥" size={44} />GitHub 热门</Chip></Pop>
    {letT.map((st, k) => <Pop key={k} start={st} x={380 + k * 200} y={1050} rot={k * 7 - 7} from={2.2}>
      <div style={{width: 170, height: 170, borderRadius: 32, background: ORANGE, color: '#fff', fontFamily: SANS, fontWeight: 900, fontSize: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 30px rgba(255,106,43,.45)', border: '6px solid #fff'}}>{'REA'[k]}</div>
    </Pop>)}
  </>;
};

const Name: React.FC = () => {
  const f = useCurrentFrame();
  const words = ['Reverse', 'Engineer', 'Anything']; const ts = [wf(2, 'Reverse'), wf(2, 'Engineer'), wf(2, 'Anything')];
  const stamp = wf(2, '逆向');
  return <>
    <Title text="名字有讲究" start={WIN.name[0] + 4} sub="三个字母，三个单词" />
    {words.map((w, k) => {
      const p = pop(f, ts[k], 13);
      return <div key={k} style={{position: 'absolute', left: 90, top: 560 + k * 190, display: 'flex', alignItems: 'center', gap: 26}}>
        <div style={{width: 150, height: 150, borderRadius: 30, background: ORANGE, color: '#fff', fontFamily: SANS, fontWeight: 900, fontSize: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 26px rgba(255,106,43,.4)', border: '6px solid #fff', transform: `rotate(${(k - 1) * 4}deg)`}}>{w[0]}</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 96, color: INK, clipPath: `inset(0 ${100 - p * 100}% 0 0)`, letterSpacing: -1}}><span style={{color: ORANGE}}>{w[0]}</span>{w.slice(1)}</div>
      </div>;
    })}
    <Pop start={stamp} x={540} y={1150} rot={-30} from={2.5}>
      <div style={{border: `8px solid ${ORANGE}`, color: ORANGE, borderRadius: 18, padding: '6px 26px', fontFamily: SANS, fontWeight: 900, fontSize: 92, transform: 'rotate(-8deg)', background: 'rgba(255,255,255,.7)'}}>逆向一切</div>
    </Pop>
  </>;
};

const Dish: React.FC = () => {
  const f = useCurrentFrame();
  const noRecipe = wf(4, '没有菜谱'); const chef = wf(4, '大厨'); const ing = wf(4, '说出');
  const items = [['🧄', '蒜'], ['🌶️', '辣椒'], ['🧂', '盐'], ['🍋', '柠檬'], ['🌿', '香草'], ['🫚', '姜']];
  const cx = 470, cy = 860;
  return <>
    <Title text="逆向是什么？" start={WIN.dish[0] + 4} sub="打个比方 🍽" />
    {/* plate */}
    <div style={{position: 'absolute', left: cx - 260, top: cy - 120}}>
      <svg width={520} height={300} style={{overflow: 'visible'}}>
        <ellipse cx={260} cy={190} rx={250} ry={90} fill="#000" opacity={0.12} />
        <ellipse cx={260} cy={170} rx={250} ry={92} fill="#fff" stroke="#d9d2c4" strokeWidth={4} />
        <ellipse cx={260} cy={166} rx={180} ry={60} fill="#f7f4ee" stroke="#e7e1d5" strokeWidth={3} />
        <path d="M130 160 C 150 80, 370 80, 390 160 C 360 190, 160 190, 130 160 Z" fill="#C8562B" />
        <path d="M160 140 C 200 100, 320 100, 360 140" stroke="#E98A3A" strokeWidth={14} fill="none" strokeLinecap="round" />
        <circle cx={220} cy={118} r={10} fill="#5BAE4A" /><circle cx={300} cy={112} r={9} fill="#5BAE4A" /><circle cx={262} cy={100} r={8} fill="#F2D24B" />
        {[0, 1, 2].map(k => <path key={k} d={`M${200 + k * 60} ${60 - ((f + k * 20) % 60) * 0.5} q 14 -20 0 -40 q -14 -20 0 -40`} stroke="#bdb6a8" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.7 - ((f + k * 20) % 60) / 100} />)}
      </svg>
    </div>
    <Pop start={noRecipe} x={90} y={560} rot={-12}>
      <Card style={{width: 230, height: 280, padding: 24, position: 'relative', transform: 'rotate(-6deg)'}}>
        <div style={{fontFamily: HAND, fontSize: 40, fontWeight: 700}}>菜谱</div>
        {[0, 1, 2, 3, 4].map(k => <div key={k} style={{height: 12, borderRadius: 6, background: '#e7e1d5', margin: '18px 0', width: `${90 - k * 9}%`}} />)}
        <svg style={{position: 'absolute', left: 10, top: 20}} width={210} height={240}><path d="M20 20 L190 220 M190 20 L20 220" stroke="#E5383B" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lin(f, noRecipe + 4, noRecipe + 14)} /></svg>
      </Card>
    </Pop>
    <Pop start={chef} x={700} y={640} rot={10}>
      <div style={{textAlign: 'center'}}><Emoji c="👨‍🍳" size={190} style={{display: 'block', transform: `rotate(${Math.sin(f / 5) * 4}deg)`}} /><div style={{fontFamily: HAND, fontSize: 44, fontWeight: 700, marginTop: -6}}>尝一口…</div></div>
    </Pop>
    {items.map(([e, n], k) => {
      const st = ing + k * 4; const p = pop(f, st, 12); if (f < st) return null;
      const ang = Math.PI * (1.05 + k * 0.18);
      const r = 340;
      const x = cx + Math.cos(ang) * r * 1.15 * p + 200 * (1 - p) * 0;
      const y = cy + 300 + Math.sin(ang) * -0 + (k % 2) * 100 * p;
      return <div key={k} style={{position: 'absolute', left: 80 + (k % 3) * 300, top: 1040 + Math.floor(k / 3) * 110 - (1 - p) * 180, transform: `scale(${p})`, opacity: p}}>
        <Chip size={40}><Emoji c={e} size={44} />{n}</Chip></div>;
    })}
  </>;
};

const AppScene: React.FC = () => {
  const f = useCurrentFrame();
  const app = wf(5, '你手里'); const noSrc = wf(5, '没有源代码'); const back = wf(6, '从成品'); const eq = wf(6, '倒推', 0.4);
  const unlock = lin(f, back + 14, back + 24);
  return <>
    <Title text="软件也一样" start={WIN.app[0] + 4} />
    <Pop start={app} x={110} y={560}>
      <div style={{textAlign: 'center'}}>
        <div style={{width: 300, height: 300, borderRadius: 72, background: 'linear-gradient(145deg,#6E8BFF,#2F4BD8)', boxShadow: '0 30px 50px rgba(47,75,216,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={170} height={170} viewBox="0 0 100 100"><circle cx={42} cy={42} r={26} stroke="#fff" strokeWidth={10} fill="none" /><path d="M62 62 L84 84" stroke="#fff" strokeWidth={12} strokeLinecap="round" /></svg>
        </div>
        <Chip size={40} style={{marginTop: 26}} bg={GREEN} color="#fff">成品 App ✓</Chip>
      </div>
    </Pop>
    <Pop start={noSrc} x={620} y={560}>
      <div style={{textAlign: 'center'}}>
        <Card style={{width: 300, height: 300, padding: 30, position: 'relative', background: '#1e2230'}}>
          {['fn search(q) {', '  idx.find(q)', '  rank(...)', '}'].map((l, k) => <div key={k} style={{fontFamily: 'monospace', fontSize: 28, color: '#9fe2a8', marginBottom: 14, filter: `blur(${(1 - unlock) * 9}px)`}}>{l}</div>)}
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1 - unlock}}><Emoji c="🔒" size={130} /></div>
        </Card>
        <Chip size={40} style={{marginTop: 26}} bg={unlock > 0.5 ? ORANGE : '#E5383B'} color="#fff">{unlock > 0.5 ? '倒推出来了' : '源代码 ✗'}</Chip>
      </div>
    </Pop>
    {f >= back && <HandArrow x1={270} y1={960} x2={760} y2={970} bend={-150} start={back} />}
    {f >= back && <div style={{position: 'absolute', left: 340, top: 1060, fontFamily: HAND, fontWeight: 700, fontSize: 48, color: ORANGE, opacity: lin(f, back + 6, back + 14)}}>倒着推 ↩</div>}
    <Pop start={eq} x={110} y={1150}><div style={{fontFamily: SANS, fontWeight: 900, fontSize: 60, color: INK, background: YEL, padding: '6px 26px', borderRadius: 14, transform: 'rotate(-1.5deg)'}}>逆向 = 从成品倒推做法</div></Pop>
  </>;
};

const Old: React.FC = () => {
  const f = useCurrentFrame();
  const [a] = WIN.old; const exp = wf(7, '专家'); const asm = wf(7, '满屏'); const days = wf(7, '好几');
  const pan = interpolate(f, [a, a + 160], [0, -260], clamp);
  const day = Math.min(5, 1 + Math.floor(Math.max(0, f - days) / 7));
  return <>
    <Title text="以前：只靠专家" start={a + 4} />
    <div style={{position: 'absolute', left: 60, top: 540, width: 960, height: 560, borderRadius: 26, overflow: 'hidden', background: '#111', boxShadow: '0 30px 60px rgba(0,0,0,.35)', border: '10px solid #2a2a2e', transform: 'rotate(-1deg)'}}>
      <Img src={staticFile('rea-hopper-analysis.png')} style={{position: 'absolute', left: pan * 0.6 - 40, top: pan * 0.5 - 20, width: 1662 * 0.82}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 30, background: 'linear-gradient(transparent, rgba(0,0,0,.5))'}} />
    </div>
    <Pop start={asm} x={640} y={500} rot={8}><Chip size={36} bg={INK} color="#fff">满屏汇编 😵</Chip></Pop>
    <Pop start={exp} x={70} y={980}><div style={{textAlign: 'center'}}><Emoji c="🧑‍💻" size={170} style={{display: 'block', transform: `translateY(${Math.sin(f / 4) * 3}px)`}} /></div></Pop>
    {f >= exp + 4 && <Emoji c="💧" size={46} style={{position: 'absolute', left: 205, top: 975 + ((f - exp) % 30) * 1.4, opacity: 1 - ((f - exp) % 30) / 30}} />}
    <Pop start={days} x={680} y={960} rot={-10}>
      <Card style={{width: 260, height: 240, overflow: 'hidden', textAlign: 'center'}}>
        <div style={{background: '#E5383B', color: '#fff', fontFamily: SANS, fontWeight: 900, fontSize: 40, padding: 10}}>日历</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 96, color: INK, lineHeight: 1.6}}>第{day}天</div>
      </Card>
    </Pop>
  </>;
};

const Plug: React.FC = () => {
  const f = useCurrentFrame();
  const [a] = WIN.plug; const tools = wf(8, 'Ghidra'); const plugT = wf(8, '接到'); const ai = wf(8, 'AI 助手');
  const agents = [wf(9, 'Claude'), wf(9, 'Codex'), wf(9, 'Cursor')];
  const lineP = lin(f, plugT, plugT + 14);
  const dot = (f % 30) / 30;
  return <>
    <Title text="REA 做的事" start={a + 4} sub="其实很简单" />
    {/* AI card */}
    <Pop start={ai - 4} x={250} y={520}>
      <Card style={{width: 580, height: 150, display: 'flex', alignItems: 'center', gap: 24, padding: '0 32px'}}>
        <Emoji c="🤖" size={90} /><div style={{fontFamily: SANS, fontWeight: 900, fontSize: 56}}>你的 AI 助手</div>
      </Card>
    </Pop>
    {/* REA plug */}
    <Pop start={F(S[8].start)} x={330} y={770}>
      <div style={{width: 420, height: 150, borderRadius: 30, background: ORANGE, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(255,106,43,.45)', border: '6px solid #fff'}}>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 70, lineHeight: 1}}>REA</div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, opacity: 0.9}}>MCP 插头 🔌</div>
      </div>
    </Pop>
    {/* cables */}
    <svg style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920}>
      {[[540, 670, 540, 770], [440, 920, 230, 1030], [540, 920, 540, 1030], [640, 920, 850, 1030]].map(([x1, y1, x2, y2], k) => {
        const p = k === 0 ? lin(f, ai, ai + 10) : lineP;
        return <g key={k}><line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={INK} strokeWidth={7} strokeDasharray="14 10" strokeLinecap="round" />
          {p >= 1 && <circle cx={x1 + (x2 - x1) * dot} cy={y1 + (y2 - y1) * dot} r={10} fill={ORANGE} />}</g>;
      })}
    </svg>
    {['Ghidra', 'IDA', 'Hopper'].map((n, k) => <Pop key={n} start={tools + k * 5} x={70 + k * 320} y={1030}>
      <Card style={{width: 300, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, background: '#24262d'}}>
        <Emoji c={['🐉', '🔬', '🐇'][k]} size={50} /><span style={{fontFamily: SANS, fontWeight: 900, fontSize: 44, color: '#fff'}}>{n}</span></Card>
    </Pop>)}
    {agents.map((st, k) => <Pop key={k} start={st} x={[70, 400, 680][k]} y={1185} rot={k * 6 - 6}>
      <Chip size={34} bg={k === 1 ? INK : '#fff'} color={k === 1 ? '#fff' : INK}>{['Claude Code', 'Codex', 'Cursor'][k]} <span style={{color: GREEN}}>✓</span></Chip></Pop>)}
  </>;
};

const PROMPT = '帮我搞清楚这个 App 的搜索功能是怎么做的，给我证据，再给我做一个类似的。';
const Chat: React.FC = () => {
  const f = useCurrentFrame(); const t = f / FPS;
  const [a] = WIN.chat; const off = S[10].say.indexOf('帮我');
  const ct = CT[10];
  const n = [...PROMPT].filter((_, j) => (ct[off + j]?.t ?? 1e9) <= t + 0.12).length;
  const sent = F(S[10].end + 0.15);
  const sp = pop(f, sent, 14);
  return <>
    <Title text="你只要说一句" start={a + 4} />
    <div style={{position: 'absolute', left: 60, top: 520, width: 960, height: 700, borderRadius: 34, background: '#fff', boxShadow: '0 30px 60px rgba(40,30,10,.2)', overflow: 'hidden'}}>
      <div style={{height: 70, background: '#f1ede5', display: 'flex', alignItems: 'center', gap: 12, padding: '0 26px'}}>
        {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{width: 20, height: 20, borderRadius: 99, background: c}} />)}
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, color: '#7a7368', marginLeft: 20}}>Claude Code · 已连接 REA 🔌</div>
      </div>
      <div style={{position: 'absolute', left: 34, top: 100, maxWidth: 700, background: '#f1ede5', borderRadius: '34px 34px 34px 8px', padding: '22px 28px', fontFamily: SANS, fontWeight: 500, fontSize: 36, lineHeight: 1.4, color: INK, opacity: f >= sent ? 0 : 1}}>👋 已连接 REA，想拆解哪个 App？</div>
      {f >= sent ? <div style={{position: 'absolute', right: 34, top: 110, maxWidth: 760, background: BLUE, color: '#fff', borderRadius: '34px 34px 8px 34px', padding: '26px 32px', fontFamily: SANS, fontWeight: 700, fontSize: 42, lineHeight: 1.45, transform: `translateY(${(1 - sp) * 300}px) scale(${0.9 + sp * 0.1})`, transformOrigin: 'bottom right'}}>{PROMPT}</div> : null}
      {f >= sent + 12 && <div style={{position: 'absolute', left: 34, top: 470, display: 'flex', gap: 16, alignItems: 'center', fontFamily: SANS, fontSize: 36, color: '#7a7368'}}><Spinner size={44} done={false} doneAt={0} />正在调用 REA 分析…</div>}
      <div style={{position: 'absolute', left: 24, right: 24, bottom: 24, minHeight: 110, borderRadius: 24, border: `4px solid ${f < sent ? BLUE : '#e2ddd3'}`, padding: '18px 120px 18px 24px', fontFamily: SANS, fontWeight: 500, fontSize: 36, lineHeight: 1.4, color: INK}}>
        {f < sent ? <>{[...PROMPT].slice(0, n).join('')}<span style={{opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: BLUE}}>|</span></> : <span style={{color: '#aaa'}}>输入消息…</span>}
        <div style={{position: 'absolute', right: 18, bottom: 18, width: 76, height: 76, borderRadius: 99, background: n > 0 ? BLUE : '#ccc', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, transform: `scale(${f >= sent - 3 && f < sent + 3 ? 0.85 : 1})`}}>↑</div>
      </div>
    </div>
  </>;
};

const Work: React.FC = () => {
  const f = useCurrentFrame();
  const [a] = WIN.work;
  const steps = [['🔍', '找到搜索相关的代码', wf(11, '去拆'), wf(11, '去追')], ['🧵', '追踪调用链', wf(11, '去追'), wf(11, '最后')], ['🧪', '对照实际行为验证', wf(11, '去追', 0.5), wf(11, '最后', 0.3)]];
  const cards = [[GREEN, '结论', '搜索 = 本地索引 + 排序', wf(11, '结论')], [BLUE, '证据', 'search() @ 0x1000368', wf(11, '证据')], ['#E9A400', '不确定', '排序权重未完全确认', wf(11, '不确定')]];
  const stamp = wf(12, '不靠猜'); const src = wf(12, '出处');
  return <>
    <Title text="AI 自己去拆" start={a + 4} />
    <div style={{position: 'absolute', left: 60, top: 500, width: 960}}>
      {steps.map(([e, l, s, d], k) => f >= (s as number) && <div key={k} style={{display: 'flex', alignItems: 'center', gap: 20, height: 74, fontFamily: SANS, fontWeight: 700, fontSize: 40, color: INK, opacity: lin(f, s as number, (s as number) + 6)}}>
        <Spinner size={50} done={f >= (d as number)} doneAt={d as number} /><Emoji c={e as string} size={40} />{l}</div>)}
    </div>
    {cards.map(([c, h, b, s], k) => <Pop key={k} start={s as number} x={60 + k * 0} y={760 + k * 150} rot={-4}>
      <Card style={{width: 820, height: 128, display: 'flex', alignItems: 'center', gap: 26, padding: '0 28px', borderLeft: `16px solid ${c}`}}>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 46, color: c as string, width: 150}}>{h}</div>
        <div style={{fontFamily: (k === 1 ? 'monospace' : SANS), fontWeight: 700, fontSize: 36, color: INK}}>{b}</div>
        {k === 2 && <div style={{marginLeft: 'auto', fontSize: 56, fontWeight: 900, color: c as string, fontFamily: SANS}}>?</div>}
      </Card>
    </Pop>)}
    {f >= src && <HandArrow x1={900} y1={1060} x2={900} y2={850} bend={-70} start={src} />}
    <Pop start={src + 4} x={880} y={940} rot={10}><div style={{fontFamily: HAND, fontWeight: 700, fontSize: 44, color: ORANGE}}>出处</div></Pop>
    <Pop start={stamp} x={600} y={1140} rot={-25} from={2.4}>
      <div style={{border: `8px solid #E5383B`, color: '#E5383B', borderRadius: 16, padding: '0 22px', fontFamily: SANS, fontWeight: 900, fontSize: 80, transform: 'rotate(-10deg)', background: 'rgba(255,255,255,.75)'}}>不靠猜</div>
    </Pop>
  </>;
};

const Scope: React.FC = () => {
  const f = useCurrentFrame();
  const [a] = WIN.scope;
  const items = [['⚙️', '普通程序', '普通'], ['🌐', '网页', '网页'], ['⚛️', 'Electron 应用', 'Electron'], ['🤖', '安卓 APK', '安卓'], ['🔌', '固件', '固件'], ['📡', '网络抓包', '网络']];
  const extra = ['.NET', 'SQLite', 'WASM', 'JS'];
  const local = wf(14, '本地'); const noUp = wf(14, '不会上传');
  const shift = lin(f, F(S[14].start) - 4, F(S[14].start) + 10);
  return <>
    <Title text="能拆的东西很多" start={a + 4} />
    <div style={{opacity: 1 - shift * 0.75, transform: `scale(${1 - shift * 0.2}) translateY(${-shift * 60}px)`, transformOrigin: '540px 520px'}}>
      {items.map(([e, n, k], i) => <Pop key={i} start={wf(13, k)} x={70 + (i % 2) * 480} y={520 + Math.floor(i / 2) * 150} rot={(i % 2 ? 6 : -6)}>
        <Chip size={46} style={{minWidth: 360, justifyContent: 'flex-start'}}><Emoji c={e} size={52} />{n}</Chip></Pop>)}
      {extra.map((n, i) => <Pop key={n} start={wf(13, '抓包') + 6 + i * 3} x={90 + i * 230} y={985}><Chip size={32} bg="#ece6da">{n}</Chip></Pop>)}
    </div>
    {f >= local - 3 && <Pop start={local - 3} x={110} y={760}>
      <Card style={{width: 860, height: 380, display: 'flex', alignItems: 'center', gap: 40, padding: '0 50px'}}>
        <div style={{position: 'relative'}}><Emoji c="💻" size={200} /><Emoji c="🛡️" size={90} style={{position: 'absolute', right: -20, bottom: -10}} /></div>
        <div>
          <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 74, color: GREEN}}>本地分析</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, opacity: lin(f, noUp, noUp + 6)}}>
            <div style={{position: 'relative'}}><Emoji c="☁️" size={74} />
              <svg style={{position: 'absolute', left: -6, top: -4}} width={90} height={90}><path d="M8 8 L82 82" stroke="#E5383B" strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lin(f, noUp + 4, noUp + 12)} /></svg></div>
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 52, color: INK}}>不上传 App</div>
          </div>
        </div>
      </Card>
    </Pop>}
  </>;
};

const Case: React.FC = () => {
  const f = useCurrentFrame();
  const [a] = WIN.case; const game = wf(15, 'DX'); const snd = wf(15, '声音');
  const t1 = wf(16, '三千'); const t2 = wf(16, '六十三'); const same = wf(16, '一模一样');
  const n = Math.round(3205 * lin(f, t1, t1 + 40));
  const bytes = Math.round(63 * lin(f, t2, t2 + 26));
  const go = lin(f, F(S[16].start) - 4, F(S[16].start) + 8);
  return <>
    <Title text="官方案例" start={a + 4} sub="还原老游戏 DX-Ball 的声音算法" />
    <div style={{transform: `translate(${-go * 230}px, ${-go * 40}px) scale(${1 - go * 0.45})`, transformOrigin: '300px 560px'}}>
      <Pop start={a + 8} x={180} y={560} rot={-14}>
        <div style={{background: '#fff', padding: '22px 22px 80px', boxShadow: '0 26px 50px rgba(0,0,0,.25)', transform: 'rotate(-4deg)'}}>
          <Img src={staticFile('dxball.png')} style={{width: 560, imageRendering: 'pixelated', display: 'block'}} />
          <div style={{fontFamily: HAND, fontSize: 46, fontWeight: 700, textAlign: 'center', marginTop: 14}}>DX-Ball · 1996</div>
        </div>
      </Pop>
      {f >= snd && [0, 1, 2].map(k => { const ph = ((f - snd) / 18 + k / 3) % 1; return <div key={k} style={{position: 'absolute', left: 780 + ph * 120, top: 760 - ph * 60, width: 60 + ph * 120, height: 60 + ph * 120, borderRadius: 999, border: `8px solid ${ORANGE}`, opacity: 1 - ph}} />; })}
      {f >= snd && <Emoji c="🔊" size={110} style={{position: 'absolute', left: 760, top: 700}} />}
    </div>
    {f >= t1 && <Pop start={t1} x={420} y={500}>
      <Card style={{width: 600, padding: '24px 30px'}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: '#7a7368'}}>原版测试</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 92, color: INK, fontVariantNumeric: 'tabular-nums'}}>{n} <span style={{fontSize: 48, color: '#aaa'}}>/ 3205</span></div>
        <div style={{height: 22, background: '#eee', borderRadius: 99, overflow: 'hidden'}}><div style={{width: `${n / 32.05}%`, height: '100%', background: GREEN}} /></div>
        {n >= 3205 && <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 40, color: GREEN, marginTop: 10}}>✓ 全部通过</div>}
      </Card>
    </Pop>}
    {f >= t2 && <Pop start={t2} x={60} y={880}>
      <Card style={{width: 960, padding: '26px 30px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: SANS, fontWeight: 900, fontSize: 44}}><span>编译后的字节</span><span style={{color: bytes >= 63 ? GREEN : INK}}>{bytes} / 63</span></div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(21, 1fr)', gap: 6, marginTop: 18}}>
          {new Array(63).fill(0).map((_, k) => <div key={k} style={{height: 30, borderRadius: 6, background: k < bytes ? GREEN : '#e8e3d9', fontFamily: 'monospace', fontSize: 15, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{k < bytes ? ((k * 37 + 11) % 256).toString(16).padStart(2, '0') : ''}</div>)}
        </div>
      </Card>
    </Pop>}
    <Pop start={same} x={520} y={1120} rot={-20} from={2.2}><div style={{border: `8px solid ${GREEN}`, color: GREEN, borderRadius: 16, padding: '0 22px', fontFamily: SANS, fontWeight: 900, fontSize: 70, transform: 'rotate(-7deg)', background: 'rgba(255,255,255,.8)'}}>一模一样 ✓</div></Pop>
  </>;
};

const CMD = 'npx rea-agents setup';
const Install: React.FC = () => {
  const f = useCurrentFrame();
  const [a, b] = WIN.install; const s0 = a + 8;
  const n = Math.floor(Math.max(0, f - s0) / 1.6);
  const done = s0 + CMD.length * 1.6 + 6;
  const lines = ['Claude Code', 'Codex', 'Cursor', 'Gemini CLI'];
  return <>
    <Title text="一行命令装好" start={a + 4} />
    <div style={{position: 'absolute', left: 60, top: 540, width: 960, height: 600, borderRadius: 28, background: '#16171c', boxShadow: '0 30px 60px rgba(0,0,0,.35)', overflow: 'hidden', fontFamily: 'monospace'}}>
      <div style={{height: 60, background: '#24262d', display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px'}}>
        {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{width: 18, height: 18, borderRadius: 99, background: c}} />)}
        <span style={{color: '#888', fontSize: 26, marginLeft: 16}}>Terminal</span></div>
      <div style={{padding: '30px 34px', fontSize: 48, color: '#e8e8e8', lineHeight: 1.5}}>
        <div><span style={{color: GREEN}}>$</span> {CMD.slice(0, n)}{f < done && <span style={{background: '#e8e8e8', opacity: Math.floor(f / 8) % 2 ? 1 : 0.2}}>&nbsp;</span>}</div>
        {lines.map((l, k) => f >= done + k * 6 && <div key={l} style={{fontSize: 38, color: '#bdbdbd'}}><span style={{color: GREEN}}>✓</span> 已连接 {l}</div>)}
        {f >= done + 28 && <div style={{fontSize: 40, color: ORANGE, fontWeight: 700}}>REA ready 🚀</div>}
      </div>
    </div>
  </>;
};

const Warn: React.FC = () => {
  const f = useCurrentFrame();
  const [a] = WIN.warn; const s1 = wf(18, '只分析'); const s2 = wf(18, '遵守');
  return <>
    <Title text="提醒一句" start={a + 4} accent="#E5383B" />
    <Pop start={a + 8} x={340} y={520}><div style={{transform: `rotate(${Math.sin(f / 12) * 3}deg)`}}><Emoji c="🛡️" size={360} /></div></Pop>
    <Pop start={s1} x={90} y={960}><Chip size={52} bg={INK} color="#fff">✅ 只分析你有权分析的软件</Chip></Pop>
    <Pop start={s2} x={160} y={1090}><Chip size={48}>📜 遵守许可协议和法律</Chip></Pop>
  </>;
};

const CTA: React.FC = () => {
  const f = useCurrentFrame();
  const [a] = WIN.cta; const q = a + 6; const like = wf(19, '点个'); const follow = wf(19, '关注');
  const hp = pop(f, a + 2, 14);
  return <>
    <Pop start={q} x={70} y={260} rot={-4}>
      <div style={{position: 'relative', background: '#fff', borderRadius: 40, padding: '34px 40px', boxShadow: '0 20px 40px rgba(40,30,10,.18)', width: 860}}>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 66, lineHeight: 1.3, color: INK}}>你最想拆解<br />哪个 App 的功能？</div>
        <div style={{fontFamily: HAND, fontSize: 44, color: ORANGE, marginTop: 10, fontWeight: 700}}>👇 评论区告诉我</div>
        <div style={{position: 'absolute', left: 380, bottom: -40, width: 0, height: 0, borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderTop: '44px solid #fff'}} />
      </div>
    </Pop>
    <div style={{position: 'absolute', left: 540 - 330, top: 500, transform: `translateY(${(1 - hp) * 500}px)`}}>
      <div style={{position: 'absolute', left: 60, top: 60, width: 540, height: 540, borderRadius: 999, background: 'radial-gradient(circle, #FFE3C9 0%, rgba(255,227,201,0) 70%)'}} />
      <Host size={660} energy={1.4} />
    </div>
    {[['👍', '点赞', like - 8], ['⭐', '收藏', like - 3], ['➕', '关注', follow]].map(([e, l, s], k) => <Pop key={k} start={s as number} x={110 + k * 300} y={1150} from={0.2}>
      <div style={{width: 240, height: 110, borderRadius: 999, background: k === 2 ? ORANGE : '#fff', color: k === 2 ? '#fff' : INK, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: SANS, fontWeight: 900, fontSize: 46, boxShadow: '0 14px 30px rgba(40,30,10,.2)'}}><Emoji c={e as string} size={46} />{l}</div>
    </Pop>)}
  </>;
};

export {TOTAL};
export const Video: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const dx = Math.sin(t * 0.9) * 5 + Math.sin(t * 2.3) * 1.5, dy = Math.cos(t * 0.7) * 6 + Math.sin(t * 1.9) * 1.5, rot = Math.sin(t * 0.5) * 0.25;
  return <AbsoluteFill style={{background: CREAM}}>
    <Bg />
    <AbsoluteFill style={{transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`}}>
      <Scene name="hook"><Hook /></Scene>
      <Scene name="name"><Name /></Scene>
      <Scene name="dish"><Dish /></Scene>
      <Scene name="app"><AppScene /></Scene>
      <Scene name="old"><Old /></Scene>
      <Scene name="plug"><Plug /></Scene>
      <Scene name="chat"><Chat /></Scene>
      <Scene name="work"><Work /></Scene>
      <Scene name="scope"><Scope /></Scene>
      <Scene name="case"><Case /></Scene>
      <Scene name="install"><Install /></Scene>
      <Scene name="warn"><Warn /></Scene>
      <Scene name="cta"><CTA /></Scene>
    </AbsoluteFill>
    <FaceCam />
    <Subtitle />
    <Grain />
    <Progress />
  </AbsoluteFill>;
};
