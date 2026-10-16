import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame, interpolate, spring, Easing, random} from 'remotion';
import tl from './public/timeline.json';
import {CFG} from './config';

export const FPS = 30;
export const TOTAL = Math.ceil(tl.duration * FPS) + 6;
export const S: any[] = (tl as any).sentences;
export const MOUTH: number[] = (tl as any).mouth;
export const F = (s: number) => Math.round(s * FPS);
export const INK = '#1b1b1f', ORANGE = '#FF6A2B', CREAM = '#F5F0E6', BLUE = '#2F6BFF', GREEN = '#1FA463', YEL = '#FFD43B';
export const SANS = '"Noto Sans SC", sans-serif', HAND = '"LXGW WenKai", "Noto Sans SC", sans-serif';
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------- timing helpers ----------
export const PUNCT = /[，。？！：；、,.?!:;\s]/;
export const charTimes = (s: any) => {
  const q: {c: string; t: number}[] = [];
  for (const w of s.words) { const L = w.t.length; [...w.t].forEach((c: string, k: number) => q.push({c, t: w.s + (w.e - w.s) * k / L})); }
  let qi = 0, last = s.start; const out: {c: string; t: number}[] = [];
  for (const c of [...s.say]) {
    if (PUNCT.test(c)) { out.push({c, t: last}); continue; }
    let found = -1;
    for (let j = qi; j < Math.min(q.length, qi + 4); j++) if (q[j].c.toLowerCase() === c.toLowerCase()) { found = j; break; }
    if (found >= 0) { last = q[found].t; qi = found + 1; }
    out.push({c, t: last});
  }
  return out;
};
export const CT = S.map(charTimes);
/** global frame when substring `sub` begins in sentence i */
export const wf = (i: number, sub: string, off = 0) => {
  const idx = S[i].say.indexOf(sub);
  const t = idx >= 0 ? CT[i][idx].t : S[i].start;
  return F(t + off);
};
export const SCENES: string[] = [];
S.forEach(s => { if (!SCENES.includes(s.scene)) SCENES.push(s.scene); });
export const sceneStart = (n: string) => S.find(s => s.scene === n).start;
export const WIN: Record<string, [number, number]> = {};
SCENES.forEach((n, k) => {
  const a = k === 0 ? 0 : F(sceneStart(n) - 0.3);
  const b = k === SCENES.length - 1 ? TOTAL : F(sceneStart(SCENES[k + 1]) - 0.3);
  WIN[n] = [a, b];
});

export const useSp = (start: number, cfg: any = {damping: 14, mass: 0.7}) => {
  const f = useCurrentFrame();
  return spring({frame: f - start, fps: FPS, config: cfg});
};
export const pop = (f: number, start: number, d = 12) => spring({frame: f - start, fps: FPS, config: {damping: d, mass: 0.6, stiffness: 160}});
export const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.bezier(0.4, 0, 0.2, 1)});

// ---------- primitives ----------
export const HandCircle: React.FC<{x: number; y: number; w: number; h: number; start: number; color?: string; dur?: number; sw?: number}> = ({x, y, w, h, start, color = ORANGE, dur = 14, sw = 9}) => {
  const f = useCurrentFrame();
  const p = lin(f, start, start + dur);
  const d = `M ${w * 0.08} ${h * 0.42} C ${w * 0.05} ${h * -0.05}, ${w * 0.95} ${h * -0.08}, ${w * 0.98} ${h * 0.45} C ${w * 1.02} ${h * 1.05}, ${w * 0.04} ${h * 1.08}, ${w * 0.02} ${h * 0.5} C ${w * 0.0} ${h * 0.2}, ${w * 0.3} ${h * 0.02}, ${w * 0.55} ${h * 0.03}`;
  return <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={w} height={h}>
    <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
  </svg>;
};
export const HandArrow: React.FC<{x1: number; y1: number; x2: number; y2: number; start: number; color?: string; bend?: number; sw?: number}> = ({x1, y1, x2, y2, start, color = ORANGE, bend = 60, sw = 9}) => {
  const f = useCurrentFrame();
  const p = lin(f, start, start + 12);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2; const dx = x2 - x1, dy = y2 - y1; const L = Math.hypot(dx, dy);
  const cx = mx - dy / L * bend, cy = my + dx / L * bend;
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const hp = lin(f, start + 10, start + 15);
  const a1 = ang + Math.PI * 0.82, a2 = ang - Math.PI * 0.82, hl = 34 * hp;
  return <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1080} height={1920}>
    <path d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    {hp > 0 && <path d={`M${x2 + Math.cos(a1) * hl} ${y2 + Math.sin(a1) * hl} L${x2} ${y2} L${x2 + Math.cos(a2) * hl} ${y2 + Math.sin(a2) * hl}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />}
  </svg>;
};
export const Pop: React.FC<{start: number; x: number; y: number; children: any; rot?: number; from?: number; style?: any; origin?: string}> = ({start, x, y, children, rot = 0, from = 0.4, style, origin = 'center'}) => {
  const f = useCurrentFrame();
  const p = pop(f, start);
  if (f < start) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `scale(${from + (1 - from) * p}) rotate(${rot * (1 - p) + 0}deg)`, transformOrigin: origin, opacity: Math.min(1, (f - start) / 4), ...style}}>{children}</div>;
};
export const Card: React.FC<{style?: any; children: any}> = ({style, children}) =>
  <div style={{background: '#fff', borderRadius: 28, boxShadow: '0 18px 40px rgba(40,30,10,.16), 0 3px 8px rgba(40,30,10,.08)', ...style}}>{children}</div>;
export const Chip: React.FC<{children: any; bg?: string; color?: string; size?: number; style?: any}> = ({children, bg = '#fff', color = INK, size = 40, style}) =>
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: `${size * 0.32}px ${size * 0.6}px`, borderRadius: 999, background: bg, color, fontFamily: SANS, fontWeight: 800, fontSize: size, boxShadow: '0 10px 24px rgba(40,30,10,.14)', whiteSpace: 'nowrap', ...style}}>{children}</div>;
export const Emoji: React.FC<{c: string; size: number; style?: any}> = ({c, size, style}) => <span style={{fontFamily: '"Noto Color Emoji"', fontSize: size, lineHeight: 1, ...style}}>{c}</span>;
export const Title: React.FC<{text: string; start: number; sub?: string; accent?: string}> = ({text, start, sub, accent = ORANGE}) => {
  const f = useCurrentFrame();
  const p = pop(f, start, 15);
  return <div style={{position: 'absolute', left: 64, top: 236, width: 700}}>
    <div style={{width: 74 * p, height: 10, background: accent, borderRadius: 6, marginBottom: 20}} />
    <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 84, color: INK, lineHeight: 1.12, letterSpacing: 1, transform: `translateY(${(1 - p) * 40}px)`, opacity: p}}>{text}</div>
    {sub && <div style={{fontFamily: HAND, fontSize: 44, color: '#6b6357', marginTop: 12, opacity: lin(f, start + 8, start + 18)}}>{sub}</div>}
  </div>;
};
export const Spinner: React.FC<{size: number; done: boolean; doneAt: number}> = ({size, done, doneAt}) => {
  const f = useCurrentFrame();
  if (done) { const p = pop(f, doneAt, 10); return <div style={{width: size, height: size, borderRadius: 99, background: GREEN, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.62, fontWeight: 900, transform: `scale(${0.5 + 0.5 * p})`, fontFamily: SANS}}>✓</div>; }
  return <svg width={size} height={size} style={{transform: `rotate(${f * 14}deg)`}}><circle cx={size / 2} cy={size / 2} r={size / 2 - 5} stroke="#d8d2c6" strokeWidth={6} fill="none" /><circle cx={size / 2} cy={size / 2} r={size / 2 - 5} stroke={BLUE} strokeWidth={6} fill="none" strokeDasharray={`${size * 0.8} 999`} strokeLinecap="round" /></svg>;
};

// ---------- host character ----------
export const Host: React.FC<{size: number; look?: number; energy?: number}> = ({size, look = 0, energy = 1}) => {
  const f = useCurrentFrame();
  const m = Math.min(1, (MOUTH[Math.min(MOUTH.length - 1, f)] || 0) * 1.25);
  const mPrev = MOUTH[Math.max(0, f - 3)] || 0;
  // blink every ~3.3s with jitter
  const cyc = f % 100; const off = Math.floor(f / 100);
  const bAt = 60 + Math.floor(random('b' + off) * 30);
  const blink = Math.abs(cyc - bAt) < 3 ? Math.abs(cyc - bAt) / 3 : 1;
  const talk = Math.min(1, mPrev * 2);
  const bob = Math.sin(f / 7) * 3 * talk * energy + Math.sin(f / 23) * 2;
  const tilt = Math.sin(f / 31) * 3 + Math.sin(f / 11) * 1.5 * talk + look * 4;
  const brow = Math.max(0, (MOUTH[Math.min(MOUTH.length - 1, f + 2)] || 0) - 0.55) * 18;
  const breath = Math.sin(f / 22) * 0.012;
  const mo = Math.max(0.02, m);
  return <svg width={size} height={size} viewBox="0 0 400 400" style={{display: 'block', overflow: 'visible'}}>
    <g transform={`translate(0 ${400 * breath * 3}) scale(1 ${1 + breath})`} style={{transformOrigin: '200px 400px'}}>
      {/* body / hoodie */}
      <path d="M40 420 C 46 330, 110 300, 150 296 L 250 296 C 290 300, 354 330, 360 420 Z" fill="#33415C" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M150 296 C 165 330, 235 330, 250 296" fill="#26324A" stroke={INK} strokeWidth={5} />
      <path d="M178 322 L 172 380 M222 322 L 228 380" stroke="#e9e3d6" strokeWidth={5} strokeLinecap="round" />
      <circle cx={172} cy={384} r={5} fill="#e9e3d6" /><circle cx={228} cy={384} r={5} fill="#e9e3d6" />
      <rect x={176} y={262} width={48} height={44} fill="#EBC09E" stroke={INK} strokeWidth={5} />
    </g>
    <g transform={`translate(${look * 6} ${bob}) rotate(${tilt} 200 270)`}>
      {/* ears */}
      <ellipse cx={104} cy={196} rx={18} ry={26} fill="#F3CBAB" stroke={INK} strokeWidth={5} />
      <ellipse cx={296} cy={196} rx={18} ry={26} fill="#F3CBAB" stroke={INK} strokeWidth={5} />
      {/* head */}
      <path d="M110 170 C 108 90, 160 62, 200 62 C 246 62, 292 92, 290 172 C 290 236, 260 282, 200 284 C 140 282, 110 236, 110 170 Z" fill="#F6D3B6" stroke={INK} strokeWidth={6} />
      {/* hair */}
      <path d="M100 168 C 92 88, 150 40, 210 44 C 270 46, 312 90, 300 168 C 292 140, 280 118, 262 108 C 236 128, 196 126, 160 112 C 150 130, 128 140, 118 170 Z" fill="#26211E" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M160 112 C 176 96, 196 92, 214 100" stroke="#4a403a" strokeWidth={4} fill="none" strokeLinecap="round" />
      {/* brows */}
      <path d={`M140 ${142 - brow} Q 162 ${132 - brow} 184 ${140 - brow}`} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d={`M216 ${140 - brow} Q 238 ${132 - brow} 260 ${142 - brow}`} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
      {/* eyes */}
      <g transform={`translate(${look * 5} 0)`}>
        <ellipse cx={162} cy={180} rx={9} ry={11 * blink + 0.8} fill={INK} />
        <ellipse cx={238} cy={180} rx={9} ry={11 * blink + 0.8} fill={INK} />
        {blink > 0.6 && <><circle cx={165} cy={176} r={3} fill="#fff" /><circle cx={241} cy={176} r={3} fill="#fff" /></>}
      </g>
      {/* glasses */}
      <rect x={124} y={152} width={76} height={58} rx={20} fill="rgba(255,255,255,.18)" stroke={INK} strokeWidth={6} />
      <rect x={200 + 0} y={152} width={76} height={58} rx={20} fill="rgba(255,255,255,.18)" stroke={INK} strokeWidth={6} transform="translate(0 0)" />
      <path d="M196 176 Q 200 170 204 176" stroke={INK} strokeWidth={5} fill="none" />
      <path d="M124 172 L 108 166 M276 172 L 292 166" stroke={INK} strokeWidth={5} />
      {/* nose & cheeks */}
      <path d="M200 196 Q 192 222 204 226" stroke="#c9906d" strokeWidth={5} fill="none" strokeLinecap="round" />
      <ellipse cx={142} cy={228} rx={16} ry={9} fill="#F29C94" opacity={0.45} />
      <ellipse cx={258} cy={228} rx={16} ry={9} fill="#F29C94" opacity={0.45} />
      {/* mouth */}
      {mo < 0.08
        ? <path d="M178 246 Q 200 262 222 246" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
        : <g>
            <path d={`M${176 - mo * 6} 244 Q 200 ${248 + mo * 4} ${224 + mo * 6} 244 Q ${222 + mo * 4} ${250 + mo * 34} 200 ${252 + mo * 34} Q ${178 - mo * 4} ${250 + mo * 34} ${176 - mo * 6} 244 Z`} fill="#5A2026" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
            <path d={`M${182} 246 L ${218} 246 L ${216} ${250 + mo * 6} L ${184} ${250 + mo * 6} Z`} fill="#fff" opacity={mo > 0.2 ? 1 : 0} />
            <ellipse cx={200} cy={246 + mo * 28} rx={12 + mo * 4} ry={4 + mo * 5} fill="#E36A6A" opacity={mo > 0.3 ? 1 : 0} />
          </g>}
    </g>
  </svg>;
};
export const FaceCam: React.FC = () => {
  const f = useCurrentFrame();
  // 小窗在 CFG.bigHostScenes 里的场景隐藏（那些场景自己放大号主播）
  let vis = 1;
  for (const n of CFG.bigHostScenes) { const w = WIN[n]; if (!w) continue; vis = Math.min(vis, f < w[0] ? 1 : f > w[1] ? lin(f, w[1], w[1] + 8) : 1 - lin(f, w[0], w[0] + 8)); }
  const intro = pop(f, 10, 14);
  if (vis <= 0.01) return null;
  return <div style={{position: 'absolute', left: 806, top: 196, width: 226, height: 280, borderRadius: 30, overflow: 'hidden', background: 'linear-gradient(170deg,#cfd9e6 0%,#a9b9cc 60%,#8fa2b8 100%)', border: '7px solid #fff', boxShadow: '0 20px 40px rgba(20,20,40,.28)', transform: `scale(${intro * vis}) rotate(${Math.sin(f / 50) * 1.2}deg)`, transformOrigin: 'top right'}}>
    {/* room bokeh */}
    <div style={{position: 'absolute', left: 20, top: 30, width: 60, height: 60, borderRadius: 99, background: 'rgba(255,230,180,.55)', filter: 'blur(10px)'}} />
    <div style={{position: 'absolute', left: 150, top: 60, width: 40, height: 40, borderRadius: 99, background: 'rgba(255,255,255,.5)', filter: 'blur(8px)'}} />
    <div style={{position: 'absolute', left: 0, top: 120, width: 226, height: 6, background: 'rgba(255,255,255,.25)'}} />
    <div style={{position: 'absolute', left: -14, top: 48}}><Host size={254} /></div>
    <div style={{position: 'absolute', left: 12, top: 12, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,.45)', borderRadius: 99, padding: '3px 12px', color: '#fff', fontFamily: SANS, fontWeight: 800, fontSize: 20}}>
      <div style={{width: 12, height: 12, borderRadius: 99, background: '#ff3b3b', opacity: Math.floor(f / 15) % 2 ? 1 : 0.35}} />LIVE</div>
  </div>;
};

// ---------- subtitles ----------
export const KEYS: string[] = CFG.keywords;
type Phr = {text: string; a: number; b: number; i: number; off: number};
export const PHRASES: Phr[] = [];
S.forEach((s, i) => {
  const parts = s.say.split(/(?<=[，。？！：])/);
  let off = 0;
  parts.forEach((p: string) => {
    const t = p.replace(/[，。？！：]$/, '');
    if (t.trim()) PHRASES.push({text: t, a: CT[i][off].t, b: 0, i, off});
    off += [...p].length;
  });
});
for (let k = PHRASES.length - 1; k > 0; k--) { const p = PHRASES[k], q = PHRASES[k - 1]; if (p.i === q.i && (p.text.trim().length <= 1 || q.text.trim().length <= 1)) { q.text = S[q.i].say.slice(q.off, p.off + p.text.length); PHRASES.splice(k, 1); } }
PHRASES.forEach((p, k) => { const n = PHRASES[k + 1]; p.b = n ? Math.min(n.a, S[p.i].end + S[p.i].pause + 0.2) : S[p.i].end + 1.5; });
export const Subtitle: React.FC = () => {
  const f = useCurrentFrame(); const t = f / FPS;
  const p = PHRASES.find(p => t >= p.a - 0.05 && t < p.b);
  if (!p) return null;
  const st = F(p.a - 0.05); const s = pop(f, st, 13);
  // highlight ranges
  const txt = p.text; const hl = new Array(txt.length).fill(false);
  for (const k of KEYS) { let idx = txt.indexOf(k); while (idx >= 0) { for (let j = idx; j < idx + k.length; j++) hl[j] = true; idx = txt.indexOf(k, idx + 1); } }
  const chars = [...txt];
  const size = chars.length > 13 ? 60 : 68;
  let brk = -1; if (chars.length > 13) { const mid = chars.length / 2; let best = 99; chars.forEach((c, j) => { if ((c === ' ' || /[的是把和就，、]/.test(chars[j - 1] || '')) && Math.abs(j - mid) < best) { best = Math.abs(j - mid); brk = j; } }); if (best > 4) brk = Math.round(mid); }
  const ct = CT[p.i];
  return <div style={{position: 'absolute', left: 50, right: 50, top: CFG.subtitleTop, display: 'flex', justifyContent: 'center', transform: `scale(${0.86 + 0.14 * s})`}}>
    <div style={{maxWidth: 900, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: size, lineHeight: 1.28, letterSpacing: 1}}>
      {chars.map((c, j) => {
        const said = (ct[p.off + j]?.t ?? 0) <= t + 0.04;
        return <React.Fragment key={j}>{j === brk && <br />}<span style={{color: hl[j] ? YEL : '#fff', opacity: said ? 1 : 0.55, WebkitTextStroke: '12px #16161a', paintOrder: 'stroke fill', textShadow: '0 6px 14px rgba(0,0,0,.35)'} as any}>{c}</span></React.Fragment>;
      })}
    </div>
  </div>;
};

// ---------- scene wrapper ----------
export const Scene: React.FC<{name: string; children: any}> = ({name, children}) => {
  const f = useCurrentFrame();
  const [a, b] = WIN[name];
  if (f < a - 1 || f > b + 8) return null;
  const pin = name === 'hook' ? 1 : lin(f, a, a + 9);
  const pout = 1 - lin(f, b - 1, b + 7);
  const o = Math.min(pin, pout);
  const sc = 1 + (1 - pin) * 0.06 - (1 - pout) * 0.04;
  const push = interpolate(f, [a, b], [0, 0.025], clamp);
  const blur = (1 - pin) * 10 + (1 - pout) * 8;
  return <AbsoluteFill style={{opacity: o, transform: `scale(${sc + push}) translateY(${50 + (1 - pin) * 40 - (1 - pout) * 30}px)`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined}}>{children}</AbsoluteFill>;
};

// ---------- scenes ----------
export const Phone: React.FC<{w: number; h: number; children: any; style?: any}> = ({w, h, children, style}) =>
  <div style={{width: w, height: h, borderRadius: 64, background: '#111', padding: 16, boxShadow: '0 40px 80px rgba(30,20,0,.35), inset 0 0 0 3px #333', ...style}}>
    <div style={{width: '100%', height: '100%', borderRadius: 50, overflow: 'hidden', position: 'relative', background: '#fff'}}>{children}
      <div style={{position: 'absolute', left: '50%', top: 14, width: 120, height: 34, marginLeft: -60, borderRadius: 99, background: '#000'}} /></div>
  </div>;


// ---------- background & finishing ----------
export const Bg: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: `radial-gradient(120% 80% at 50% 35%, #FBF8F2 0%, ${CREAM} 55%, #E9E1D2 100%)`}}>
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: 0.35}}>
      <defs><pattern id="g" width={60} height={60} patternUnits="userSpaceOnUse"><circle cx={2} cy={2} r={2} fill="#cfc5b3" /></pattern></defs>
      <rect width={1080} height={1920} fill="url(#g)" />
    </svg>
    <div style={{position: 'absolute', left: 64, top: 150, fontFamily: SANS, fontWeight: 800, fontSize: 28, color: '#9a9083', letterSpacing: 2}}>{CFG.header}</div>
  </AbsoluteFill>;
};
export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const ox = Math.floor(random('gx' + Math.floor(f / 2)) * 512), oy = Math.floor(random('gy' + Math.floor(f / 2)) * 512);
  return <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('grain.png')})`, backgroundPosition: `${ox}px ${oy}px`, opacity: 0.07, mixBlendMode: 'overlay'}} />
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(40,25,5,.28) 100%)'}} />
  </AbsoluteFill>;
};
export const Progress: React.FC = () => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: `${f / TOTAL * 100}%`, background: ORANGE}} />;
};
