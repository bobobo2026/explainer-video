// ===== 场景：AI 的三种形态 · 第一种（按 分镜.json 重写）=====
// 字幕显示文字（字幕.json 里去掉了标点和空格，这里补回来）
const DISP = { 2: '豆包、DeepSeek、Codex、Claude Code、小龙虾', 3: '这些词你天天听', 4: '但真的分得清吗？', 5: '其实，', 9: '豆包、DeepSeek、ChatGPT', 13: '所以我们只能大段地复制、粘贴' };
TL.cues.forEach((c) => { if (DISP[c.id]) c.text = DISP[c.id]; });
// 转场：开场→三种 推近穿过去；三种→A 卷角翻页；A→窗口 往下读；窗口→复制 推近；复制→一扇窗 橡皮擦
['zoom', 'curl', 'scroll', 'zoom', 'erase'].forEach((k, i) => { if (FX_CUTS[i]) FX_CUTS[i].kind = k; });
fxPlan();

const SEC = 1150, Y = (i) => i * SEC;
const ST = (i) => fxStart(i);
const cueAll = (cue) => TL.chars.filter((c) => c.cue === cue).map((c) => c.start);

// @@WIDGETS@@   ← build.py 在此插入 assets/widgets.js（不要在场景里再定义同名函数：JS 后定义的会覆盖前面的）
function bigQ(t, t0, cx, cy, s) {   // 橙色大问号，一笔描出
  if (t < t0) return;
  const p = P(t, t0, 0.45);
  QSK.draw(p);
  if (t > t0 + 0.45) { g.save(); g.fillStyle = C.orange; g.beginPath(); g.arc(cx, cy + 150 * s, 15 * s * outBack(P(t, t0 + 0.45, 0.2)), 0, TAU); g.fill(); g.restore(); }
}
let QSK;

// ---------- 镜头 1：名词满天飞 ----------
const S1 = (() => {
  const y0 = Y(0);
  const title = 'AI 每天都在进化';
  const slips = [
    ['豆包', 'Mark豆包', 330, 400, -0.10, 260, 'ink'],
    ['DeepSeek', 'DeepSeek', 760, 330, 0.06, 330, 'ink'],
    ['Codex', 'Codex', 1220, 390, -0.05, 270, 'ink'],
    ['Claude Code', 'Claude', 1600, 520, 0.09, 380, 'ink'],
    ['小龙虾', '小龙虾', 560, 620, 0.07, 290, 'orange'],
  ];
  QSK = new Sk(5101);
  const qx = 1040, qy = y0 + 640, qs = 0.9;
  QSK.curve([[qx - 70 * qs, qy - 60 * qs], [qx - 50 * qs, qy - 120 * qs], [qx + 10 * qs, qy - 135 * qs], [qx + 65 * qs, qy - 100 * qs], [qx + 60 * qs, qy - 40 * qs], [qx + 5 * qs, qy + 10 * qs], [qx, qy + 80 * qs]], { w: 16, col: C.orange, amp: 0.5 });
  const trend = new Sk(5102).curve([[180, y0 + 860], [520, y0 + 780], [820, y0 + 700], [1100, y0 + 520], [1420, y0 + 380], [1740, y0 + 250]], { w: 9, col: C.orange, amp: 1.2 }).poly([[1660, y0 + 240], [1745, y0 + 248], [1710, y0 + 325]], { w: 9, col: C.orange });
  const bars = new Sk(5103); [[300, 60], [560, 110], [820, 190], [1080, 300], [1340, 420]].forEach(([x, h]) => { bars.rect(x, y0 + 880 - h, 90, h, { w: 3.2, over: 4 }); bars.hatch(rectPts(x + 4, y0 + 884 - h, 82, h - 8), 0.8, 12, { w: 1.6 }); });
  return { y0, title, slips, qx, qy, qs, trend, bars };
})();
function draw1(t, v) {
  const { y0, title, slips, qx, qy, qs, trend, bars } = S1; if (!seen(v, y0 - 100, y0 + SEC)) return;
  { const fa = lerp(1, 0.18, P(t, 2.1, 0.5)); g.save(); g.globalAlpha = fa; bars.at(t, 0.2, 1.0); trend.at(t, 0.5, 1.2); g.restore(); }
  const ct = cueAll(1), f = hand(104, 700);
  tag('@开场', 210, y0 + 110, 44, P(t, 0.1, 0.25));
  const tx = 420; writeText(title, tx, y0 + 110, f, C.ink, t, [ct[0], ct[0] + 0.08, ct[0] + 0.14, ...ct.slice(1)], 0.1);
  underline(tx + tw('AI 每天都在', f), tx + tw(title, f), y0 + 172, mulberry32(51), P(t, M('进化') + 0.1, 0.35), 7, C.orange, M('进化') + 0.1);
  const shakeOn = t > M('分得清') ? 动效.jitter ? 0 : 0 : 0;
  slips.forEach(([label, mk, x, y, rot, w, col], i) => {
    const t0 = mk === 'Mark豆包' ? M('豆包') : M(mk);
    let dx = 0, dy = 0;
    if (t > M('分得清')) { const q = P(t, M('分得清'), 0.25); const fr = Math.floor(t * 12); dx = (hsh(fr * 7 + i) - 0.5) * 10 * q; dy = (hsh(fr * 13 + i) - 0.5) * 8 * q; }
    slipDraw(t, t0, x + dx, y0 + y + dy, w, 112, rot, 61 + i * 7, label, label.length > 6 ? 56 : 64, col === 'orange' ? '#ffffff' : C.ink, col === 'orange' ? C.orange : C.white);
  });
  // 天天听：耳朵旁的声波（三道弧）
  const te = M('天天听');
  if (t > te) { g.save(); g.strokeStyle = C.ink; g.lineWidth = 4; g.lineCap = 'round';
    for (let k = 0; k < 3; k++) { const p = P(t, te + k * 0.12, 0.25); if (p <= 0) continue; const pul = 1 + 0.04 * Math.sin((t - te) * 6 + k);
      g.globalAlpha = p; g.beginPath(); g.arc(1500, y0 + 760, (40 + k * 34) * pul, -0.9, 0.9); g.stroke(); }
    g.restore(); writeText('天天听', 1610, y0 + 762, hand(52, 700), C.gray, t, seq(te, 3, 0.08), 0.1); }
  g.save(); bigQ(t, M('分得清') - 0.05, qx, qy, qs); g.restore();
}

// ---------- 镜头 2：三种 AI 工具 ----------
const S2 = (() => {
  const y0 = Y(1), st = ST(1);
  const cards = [
    { L: 'A', name: '网页对话', x: 190, ico: (cx, cy, sd) => makeWindowIcon(cx - 95, cy - 80, 190, 150, sd, false) },
    { L: 'B', name: '本地工具', x: 760, ico: (cx, cy, sd) => makeLaptop(cx - 95, cy - 90, 190, sd) },
    { L: 'C', name: '云端助手', x: 1330, ico: (cx, cy, sd) => makeCloud(cx, cy, 0.9, sd) },
  ].map((c, k) => {
    const bx = c.x, by = y0 + 300, w = 400, h = 470, cx = bx + w / 2, cy = by + 210;
    const box = new Sk(5200 + k * 3).penOn(); box.fill(rrPts(bx, by, w, h, 26), C.white, { fade: 1 }); box.rrect(bx, by, w, h, 26, { w: 3.8 });
    return { ...c, bx, by, w, h, cx, cy, box, icon: c.ico(cx, cy, 5201 + k * 3) };
  });
  return { y0, st, cards, stamp: makeStamp('三种', 120, C.orange, 5250, 170) };
})();
function draw2(t, v) {
  const { y0, st, cards, stamp } = S2; if (!seen(v, y0 - 100, y0 + SEC) || t < st - 0.2) return;
  const f = hand(88, 700), title = '其实，它们只分三种';
  tag('@其实', 330, y0 + 140, 44, P(t, st + 0.05, 0.25));
  writeText(title, 540, y0 + 140, f, C.ink, t, seq(st + 0.15, title, 0.07), 0.1);
  const m3 = M('三种');
  cards.forEach((c, k) => {
    const t0 = st + 0.5 + k * 0.75;
    c.box.at(t, t0, 0.5);
    c.icon.at(t, t0 + 0.3, 0.6);
    if (t > t0 + 0.45) {
      blockWord(c.L, c.bx + 40, c.by + 400, 64, k === 0 ? COL_A : C.ink, t, [t0 + 0.5], 70 + k);
      writeText(c.name, c.bx + 120, c.by + 402, hand(58, 700), C.ink, t, seq(t0 + 0.6, c.name, 0.07), 0.1);
    }
  });
  drawStamp(stamp, 1640, y0 + 150, t, M('工具') - 0.1, -0.08);
}

// ---------- 镜头 3：第一种：网页里的 AI ----------
const S3 = (() => {
  const y0 = Y(2), st = ST(2);
  const bx = 330, by = y0 + 260, bw = 1260, bh = 600;
  const br = makeBrowser(bx, by, bw, bh, 5301).penOn();
  const tabs = ['豆包', 'DeepSeek', 'ChatGPT'].map((n, k) => {
    const x = bx + 60 + k * 300, S = new Sk(5310 + k);
    const pts = [[x, by + 2], [x + 20, by - 64], [x + 250, by - 64], [x + 270, by + 2]];
    S.fill(pts, k === 2 ? C.orangeL : C.white, { fade: 1 }); S.poly(pts, { w: 3.2 });
    return { n, x: x + 135, S, mk: ['豆包2', 'DeepSeek2', 'ChatGPT'][k] };
  });
  const btn = new Sk(5320); btn.fill(rrPts(bx + bw / 2 - 150, by + 400, 300, 100, 20), C.orange, { fade: 1 }); btn.rrect(bx + bw / 2 - 150, by + 400, 300, 100, 20, { w: 3.4 });
  const form = new Sk(5321); form.rrect(bx + bw / 2 - 300, by + 150, 600, 76, 14, { w: 2.6 }); form.rrect(bx + bw / 2 - 300, by + 260, 600, 76, 14, { w: 2.6 });
  form.filler(bx + bw / 2 - 270, by + 188, bx + bw / 2 + 90, { w: 2.4 }); form.filler(bx + bw / 2 - 270, by + 298, bx + bw / 2 - 20, { w: 2.4 });
  return { y0, st, bx, by, bw, bh, br, tabs, btn, form };
})();
function draw3(t, v) {
  const { y0, st, bx, by, bw, bh, br, tabs, btn, form } = S3; if (!seen(v, y0 - 100, y0 + SEC) || t < st - 0.2) return;
  tag('@A', 380, y0 + 110, 48, P(t, st + 0.02, 0.25));
  const ct = cueAll(7), f = hand(84, 700);
  let x = 500; x += writeText('第一种：', x, y0 + 110, f, C.ink, t, seq(Math.max(st + 0.1, ct[0]), 4, 0.08), 0.1);
  const mw = M('网页');
  blockWord('网页', x + 14, y0 + 110, 84, COL_A, t, [mw, mw + 0.15], 81);
  writeText('里的 AI', x + 14 + tw('网页', f) + 30, y0 + 110, f, C.ink, t, seq(mw + 0.3, '里的 AI', 0.07), 0.1);
  br.at(t, st + 0.35, 0.8);
  tabs.forEach((tb) => { const t0 = M(tb.mk) - 0.12; tb.S.at(t, t0, 0.25); if (t > t0) writeText(tb.n, tb.x, by - 30, hand(40, 700), C.ink, t, seq(t0 + 0.08, tb.n, 0.035), 0.06, 'center', false); });
  form.at(t, M('ChatGPT') + 0.3, 0.6);
  const ml = M('登录');
  btn.at(t, ml - 0.35, 0.3);
  if (t > ml - 0.1) text('登录', bx + bw / 2, by + 452, hand(56, 700), '#ffffff', 'center');
  if (t > ml - 1.0) {   // 鼠标移到「登录」上点一下
    const p = inOutC(P(t, ml - 1.0, 0.85)), cx = lerp(bx + bw - 120, bx + bw / 2 + 60, p), cy = lerp(by + bh - 40, by + 470, p);
    const press = bump(P(t, ml - 0.1, 0.25));
    cursor(cx, cy, 1.4, press);
    if (t > ml) { const q = P(t, ml, 0.4); g.save(); g.globalAlpha = 1 - q; g.strokeStyle = C.orange; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, 20 + 50 * q, 0, TAU); g.stroke(); g.restore(); }
  }
}

// ---------- 镜头 4：它只看得到这个窗口 ----------
const S4 = (() => {
  const y0 = Y(3), st = ST(3);
  const lap = makeLaptop(170, y0 + 300, 520, 5401).penOn();
  const items = [makeFolder(230, y0 + 360, 1, 5402), makeFile(400, y0 + 350, 1, 5403), makeFile(540, y0 + 350, 1, 5404)];
  const chat = makeBrowser(1080, y0 + 240, 700, 540, 5405).penOn();
  const robot = makeRobot(5406);
  const b1 = makeBubble(1360, y0 + 340, 380, 90, 5407, 'right');
  const b2 = makeBubble(1360, y0 + 480, 380, 120, 5408, 'right');
  const circ = new Sk(5409).ellipse(1430, y0 + 510, 400, 320, { w: 7, col: C.orange, turns: 1.12 });
  const wall = new Sk(5410).dash(890, y0 + 220, 890, y0 + 840, { w: 5, d: 30, gp: 16 });
  const X = new Sk(5411).line(820, y0 + 460, 960, y0 + 600, { w: 16, col: C.orange, amp: 0.4 }).line(960, y0 + 460, 820, y0 + 600, { w: 16, col: C.orange, amp: 0.4 });
  const strike = [new Sk(5412).line(380, y0 + 520, 500, y0 + 500, { w: 7, col: C.orange }), new Sk(5413).line(520, y0 + 520, 640, y0 + 500, { w: 7, col: C.orange })];
  return { y0, st, lap, items, chat, robot, b1, b2, circ, wall, X, strike };
}
)();
function draw4(t, v) {
  const s = S4; if (!seen(v, s.y0 - 100, s.y0 + SEC) || t < s.st - 0.2) return;
  const { y0, st } = s;
  const title = '它只看得到这个窗口';
  writeText(title, 960, y0 + 100, hand(80, 700), C.ink, t, seq(st + 0.1, title, 0.06), 0.1, 'center');
  s.chat.at(t, st + 0.2, 0.7);
  const fa = P(t, st + 0.8, 0.3);
  drawRobot(s.robot, 1230, y0 + 380, 0.62, P(t, st + 0.6, 0.9), fa, { look: P(t, M('碰不到') - 0.3, 0.3) * -1, happy: t > M('回复你') && t < M('碰不到') ? 1 : 0 });
  const md = M('对话窗口');
  s.b1.at(t, md - 0.4, 0.3); if (t > md - 0.1) writeText('帮我改一下代码', 1390, y0 + 385, hand(40, 700), C.ink, t, seq(md - 0.1, 7, 0.04), 0.06, 'left', false);
  s.circ.at(t, md + 0.2, 0.55);
  const mr = M('回复你');
  s.b2.at(t, mr - 0.2, 0.3);
  if (t > mr) { new Sk(5420).filler(1390, y0 + 530, 1700, { w: 2.6 }).draw(P(t, mr, 0.5)); }
  // 左边：你的电脑
  s.lap.at(t, st + 0.5, 0.8);
  s.items.forEach((S, k) => S.at(t, st + 1.2 + k * 0.15, 0.3));
  if (t > st + 1.4) writeText('你的电脑', 430, y0 + 760, hand(50, 700), C.ink, t, seq(st + 1.4, 4, 0.06), 0.1, 'center');
  s.wall.at(t, M('碰不到') - 0.15, 0.4);
  const mx = M('碰不到') + 0.2;
  if (t > mx) { const q = P(t, mx, 0.2); g.save(); g.translate(890, y0 + 530); g.scale(lerp(1.5, 1, outC(q)), lerp(1.5, 1, outC(q))); g.translate(-890, -(y0 + 530)); s.X.draw(q * 1.2); g.restore(); }
  if (t > M('文件')) writeText('文件', 445, y0 + 495, hand(40, 700), C.ink, t, seq(M('文件'), 2, 0.08), 0.1, 'center', false);
  if (t > M('代码')) writeText('代码', 585, y0 + 495, hand(40, 700), C.ink, t, seq(M('代码'), 2, 0.08), 0.1, 'center', false);
}

// ---------- 镜头 5：复制 → 粘贴 ----------
const S5 = (() => {
  const y0 = Y(4), st = ST(4);
  const lap = makeLaptop(170, y0 + 330, 420, 5501);
  const chat = makeBrowser(1320, y0 + 250, 460, 420, 5502);
  const arrTop = new Sk(5503).curve([[640, y0 + 360], [960, y0 + 210], [1290, y0 + 340]], { w: 4.4 }).poly([[1250, y0 + 300], [1292, y0 + 342], [1236, y0 + 352]], { w: 4.4 });
  const arrBot = new Sk(5504).curve([[1290, y0 + 730], [960, y0 + 860], [640, y0 + 740]], { w: 4.4, col: C.orange }).poly([[684, y0 + 700], [638, y0 + 740], [690, y0 + 776]], { w: 4.4, col: C.orange });
  const tally = [0, 1, 2, 3, 4].map((k) => new Sk(5510 + k));
  // 正字：横、竖、横、竖、横
  const tx = 1640, ty = y0 + 770;
  tally[0].line(tx - 40, ty - 50, tx + 40, ty - 50, { w: 7 }); tally[1].line(tx, ty - 50, tx, ty + 40, { w: 7 }); tally[2].line(tx, ty - 5, tx + 36, ty - 5, { w: 7 });
  tally[3].line(tx - 26, ty - 15, tx - 26, ty + 40, { w: 7 }); tally[4].line(tx - 50, ty + 40, tx + 50, ty + 40, { w: 7 });
  return { y0, st, lap, chat, arrTop, arrBot, tally };
})();
function draw5(t, v) {
  const s = S5; if (!seen(v, s.y0 - 100, s.y0 + SEC) || t < s.st - 0.2) return;
  const { y0, st } = s;
  s.lap.at(t, st + 0.05, 0.6); s.chat.at(t, st + 0.15, 0.6);
  const fa = P(t, st + 0.5, 0.3); if (fa > 0) { g.save(); g.globalAlpha = fa; enText('AI', 1550, y0 + 480, 90, 1, 'center'); g.restore(); }
  const mc = M('复制'), mp = M('粘贴');
  const f = hand(80, 700);
  if (t > mc - 0.05) { blockWord('Ctrl+C', 255, y0 + 230, 60, C.ink, t, seq(mc - 0.05, 'Ctrl+C', 0.04), 91); }
  if (t > mp - 0.05) { blockWord('Ctrl+V', 1440, y0 + 180, 60, COL_A, t, seq(mp - 0.05, 'Ctrl+V', 0.04), 92); }
  s.arrTop.at(t, mc, 0.5); s.arrBot.at(t, M('来回'), 0.5);
  // 纸片来回搬：从复制开始，每 0.9 秒一趟
  const T0 = mc + 0.2, per = 0.9;
  if (t > T0) {
    const n = Math.floor((t - T0) / per), u = ((t - T0) % per) / per, back = n % 2 === 1;
    const e = inOutC(u), x = back ? lerp(1550, 380, e) : lerp(380, 1550, e), y = y0 + 470 - Math.sin(e * Math.PI) * 260 * (back ? -0.6 : 1);
    g.save(); g.translate(x, y); g.rotate(Math.sin(e * Math.PI * 2) * 0.15); cardTextSmall(); g.restore();
    s.tally.forEach((S, k) => { if (k < Math.min(5, n + 1)) S.at(t, T0 + k * per + per * 0.85, 0.12); });
  }
  if (t > T0) writeText('搬了', 1500, y0 + 770, hand(52, 700), C.ink, t, seq(T0 + 0.3, 2, 0.08), 0.1, 'center', false);
  if (t > st + 0.6) writeText('你的电脑', 380, y0 + 680, hand(48, 700), C.ink, t, seq(st + 0.6, 4, 0.06), 0.1, 'center', false);
}
const CARD_SMALL = (() => cardText(0, 0, 5530, 0.55))();
function cardTextSmall() { CARD_SMALL.draw(1); }

// ---------- 镜头 6：给 AI 开了一扇窗 ----------
const S6 = (() => {
  const y0 = Y(5), st = ST(5);
  const wx = 640, wy = y0 + 200, ww = 640, wh = 520;
  const wall = new Sk(5601);
  wall.hatch([[wx - 260, wy - 60], [wx - 20, wy - 60], [wx - 20, wy + wh + 60], [wx - 260, wy + wh + 60]], 0.8, 16, { w: 1.6, a: 0.5 });
  wall.hatch([[wx + ww + 20, wy - 60], [wx + ww + 200, wy - 60], [wx + ww + 200, wy + wh + 60], [wx + ww + 20, wy + wh + 60]], 0.8, 16, { w: 1.6, a: 0.5 });
  const frame = new Sk(5602).penOn(); frame.rect(wx, wy, ww, wh, { w: 6, over: 14, double: 8 }); frame.line(wx - 40, wy + wh + 14, wx + ww + 40, wy + wh + 14, { w: 7 });
  const bars = new Sk(5603); bars.line(wx + ww / 2, wy, wx + ww / 2, wy + wh, { w: 5 }); bars.line(wx, wy + wh / 2, wx + ww, wy + wh / 2, { w: 5 });
  const robot = makeRobot(5604);
  const rays = new Sk(5605); for (let k = 0; k < 7; k++) { const a = -Math.PI * 0.9 + k * Math.PI * 0.13; rays.line(wx + ww / 2 + Math.cos(a) * 380, wy + wh / 2 + Math.sin(a) * 340, wx + ww / 2 + Math.cos(a) * 470, wy + wh / 2 + Math.sin(a) * 420, { w: 5, col: C.orange }); }
  return { y0, st, wx, wy, ww, wh, wall, frame, bars, robot, rays, stamp: makeStamp('一扇窗', 96, C.ink, 5650, 170) };
})();
function draw6(t, v) {
  const s = S6; if (!seen(v, s.y0 - 100, s.y0 + SEC) || t < s.st - 0.2) return;
  const { y0, st, wx, wy, ww, wh } = s;
  tag('@这个阶段', 300, y0 + 120, 44, P(t, M('这个阶段') - 0.05, 0.25));
  s.wall.at(t, st + 0.1, 1.0);
  // 窗里：白纸 + 机器人探头
  const open = P(t, st + 0.2, 0.5);
  if (open > 0) { g.save(); g.beginPath(); g.rect(wx, wy, ww, wh); g.clip(); g.fillStyle = C.white; g.fillRect(wx, wy, ww, wh);
    const rise = outBack(P(t, st + 0.9, 0.6));
    drawRobot(s.robot, wx + ww / 2, lerp(wy + wh + 20, wy + 70, rise), 0.78, P(t, st + 0.7, 0.8), P(t, st + 1.2, 0.3), { look: 0.3 * Math.sin(t * 1.4), happy: t > M('一扇窗') ? 1 : 0 });
    g.restore(); }
  s.frame.at(t, st + 0.15, 0.7); s.bars.at(t, st + 0.75, 0.35);
  s.rays.at(t, M('一扇窗') + 0.05, 0.4);
  drawStamp(s.stamp, 1575, y0 + 330, t, M('一扇窗') + 0.15, -0.1);
  const nx = '下一种：把整台电脑交给 AI →', tn = M('一扇窗') + 0.9;
  if (t > tn) writeText(nx, 960, y0 + 800, hand(46, 700), C.gray, t, seq(tn, nx, 0.035), 0.06, 'center', false);
}

// ---------- 镜头运动 ----------
CAM0 = { x: 960, y: Y(0) + 430, z: 0.95 };
CAM = [];
[1, 2, 3, 4, 5].forEach((i) => {
  const cu = FX_CUTS[i - 1], jump = cu && (cu.kind === 'curl' || cu.kind === 'erase'), sh = TL.shots[i];
  CAM.push(jump ? [cu.t0, cu.tj, 960, Y(i) + 430, 0.95, 'cut'] : [sh.start - 0.2, sh.start + 0.5, 960, Y(i) + 430, 0.95]);
  if (i === 3) CAM.push([M('碰不到') - 0.2, M('碰不到') + 0.4, 890, Y(3) + 520, 1.18], [M('文件') - 0.3, M('文件') + 0.3, 960, Y(3) + 430, 0.95]);
  if (i === 5) CAM.push([M('一扇窗') - 0.3, M('一扇窗') + 0.5, 1000, Y(5) + 450, 1.08, 'sine']);
});
CAM.sort((a, b) => a[0] - b[0]);
// 震屏：问号、大叉、盖章砸下
const SHAKES = () => [M('分得清'), M('碰不到') + 0.2, M('工具') - 0.1, M('一扇窗') + 0.15];
function fxBefore(t) { for (const t0 of SHAKES()) { const s = 动效.shake(t, t0, { d: 0.2, amp: 7 }); if (s && (s.dx || s.dy)) g.translate(s.dx, s.dy); } }
function drawScenes(t, v) { draw1(t, v); draw2(t, v); draw3(t, v); draw4(t, v); draw5(t, v); draw6(t, v); }
