// ===== 场景：第二种 · 本地 Harness =====
const DISP = { 2: '是装在电脑上的 AI 工具', 3: '比如 Codex、Claude Code', 4: '有个词叫 Harness', 7: 'AI 就是那匹烈马', 8: '这些工具，', 11: 'AI 能直接看到你电脑上的文件和项目', 13: '不用再复制粘贴', 14: '你只管下命令，', 16: '做 PPT、改 Excel、整理文件夹', 17: '清理 C 盘、改代码、操作浏览器', 18: '你以前怎么用电脑，', 19: '它都能做，', 21: '如果说第一种是开了一扇窗', 22: '那现在，', 23: '整台电脑都交给 AI 了' };
TL.cues.forEach((c) => { if (DISP[c.id]) c.text = DISP[c.id]; });
['zoom', 'scroll', 'curl', 'zoom', 'scroll', 'erase'].forEach((k, i) => { if (FX_CUTS[i]) FX_CUTS[i].kind = k; });
fxPlan();
const SEC = 1150, Y = (i) => i * SEC;
const ST = (i) => fxStart(i);
// @@WIDGETS@@

// ---------- 镜头 1：第二种：装在电脑上的 AI ----------
const S1 = (() => {
  const y0 = Y(0);
  const lap = makeLaptop(560, y0 + 300, 800, 6101).penOn();
  return { y0, lap, robot: makeRobot(6102) };
})();
function draw1(t, v) {
  const { y0, lap, robot } = S1; if (!seen(v, y0 - 100, y0 + SEC)) return;
  tag('@B', 300, y0 + 110, 48, P(t, 0.05, 0.25));
  const f = hand(84, 700); let x = 420;
  x += writeText('第二种：装在', x, y0 + 110, f, C.ink, t, seq(0.15, 6, 0.08), 0.1);
  const me = M('电脑');
  blockWord('电脑', x + 14, y0 + 110, 84, C.ink, t, [me, me + 0.12], 6111);
  writeText('上的 AI', x + 28 + tw('电脑', f) + 20, y0 + 110, f, C.ink, t, seq(me + 0.3, '上的 AI', 0.07), 0.1);
  lap.at(t, 0.5, 1.0);
  const rp = P(t, me + 0.2, 0.8);
  if (rp > 0) { const rise = outBack(P(t, me + 0.5, 0.5)); g.save(); g.beginPath(); g.rect(582, y0 + 322, 756, 452); g.clip();
    drawRobot(robot, 960, lerp(y0 + 800, y0 + 400, rise), 0.62, rp, P(t, me + 0.9, 0.3), { look: 0.4 * Math.sin(t * 1.3), happy: t > M('Codex') ? 1 : 0 }); g.restore(); }
  slipDraw(t, M('Codex'), 330, y0 + 470, 280, 112, -0.08, 6121, 'Codex', 64);
  slipDraw(t, M('Claude'), 1590, y0 + 500, 400, 112, 0.07, 6122, 'Claude Code', 60);
}

// ---------- 镜头 2：Harness = 马具 ----------
const S2 = (() => {
  const y0 = Y(1), st = ST(1);
  return { y0, st, shoe: makeHorseshoe(620, y0 + 580, 1.7, 6201).penOn(), rein: new Sk(6202).curve([[460, y0 + 700], [380, y0 + 820], [620, y0 + 860], [860, y0 + 820], [780, y0 + 700]], { w: 5, col: C.ink }) };
})();
function draw2(t, v) {
  const { y0, st, shoe, rein } = S2; if (!seen(v, y0 - 100, y0 + SEC) || t < st - 0.2) return;
  const mh = M('Harness');
  writeText('有个词叫', 360, y0 + 160, hand(64, 700), C.gray, t, seq(st + 0.05, 4, 0.06), 0.1);
  const p = P(t, mh - 0.05, 0.4);
  if (p > 0) { g.save(); g.globalAlpha = clamp(p * 2); const s = lerp(1.3, 1, outBack(p)); g.translate(1080, y0 + 165); g.scale(s, s); enText('Harness', 0, 0, 150, 1, 'center', C.orange); g.restore();
    underline(820, 1340, y0 + 260, mulberry32(6203), P(t, mh + 0.4, 0.35), 8, C.ink, mh + 0.4); }
  const mm = M('马具');
  shoe.at(t, mm - 0.25, 0.7);
  if (t > mm - 0.1) { writeText('本意：', 1020, y0 + 470, hand(70, 700), C.ink, t, seq(mm - 0.15, 3, 0.06), 0.1); blockWord('马具', 1240, y0 + 470, 76, COL_A, t, [mm, mm + 0.12], 6204); }
  const ml = M('烈马');
  if (t > ml - 0.4) writeText('用来驾驭烈马', 1020, y0 + 640, hand(70, 700), C.ink, t, seq(ml - 0.4, 6, 0.07), 0.1);
  if (t > ml) underline(1200, 1440, y0 + 690, mulberry32(6205), P(t, ml + 0.1, 0.3), 7, C.orange, ml + 0.1);
}

// ---------- 镜头 3：AI 是烈马，工具是马具 ----------
const S3 = (() => {
  const y0 = Y(2), st = ST(2);
  const lap = makeLaptop(1130, y0 + 330, 520, 6301).penOn();
  const rope = new Sk(6302).curve([[1110, y0 + 560], [950, y0 + 680], [780, y0 + 620], [700, y0 + 520], [560, y0 + 470], [420, y0 + 520], [470, y0 + 640], [620, y0 + 610]], { w: 7, col: C.orange, amp: 0.8 });
  return { y0, st, lap, rope, robot: makeRobot(6303), stamp: makeStamp('驾驭', 110, C.orange, 6350, 170) };
})();
function draw3(t, v) {
  const s = S3; if (!seen(v, s.y0 - 100, s.y0 + SEC) || t < s.st - 0.2) return;
  const { y0, st } = s, m2 = M('马具2'), mw = M('工具');
  // 烈马：机器人乱蹦，套上马具后安静
  const calm = P(t, m2 + 0.3, 0.6), wild = 1 - calm;
  const hop = Math.abs(Math.sin(t * 9)) * 40 * wild, rot = Math.sin(t * 7.3) * 0.14 * wild;
  g.save(); g.translate(520, y0 + 560); g.rotate(rot); g.translate(-520, -(y0 + 560));
  drawRobot(s.robot, 520, y0 + 250 - hop, 0.95 * 0.62 / 0.62 * 0.72, P(t, st + 0.05, 0.8), P(t, st + 0.5, 0.3), { look: wild * Math.sin(t * 11), happy: calm > 0.5 ? 1 : 0 });
  g.restore();
  if (wild > 0.05 && t > st + 0.6) { g.save(); g.globalAlpha = wild; g.strokeStyle = C.ink; g.lineWidth = 4; g.lineCap = 'round';
    for (const [x, y, a] of [[300, 330, -2.4], [280, 420, 3.0], [740, 320, -0.7], [770, 420, 0.1]]) { const j = Math.sin(t * 13 + x) * 6; g.beginPath(); g.moveTo(x + j, y0 + y); g.lineTo(x + j + Math.cos(a) * 46, y0 + y + Math.sin(a) * 46); g.stroke(); }
    g.restore(); }
  const ml = M('烈马2');
  if (t > ml - 0.6) { writeText('AI', 330, y0 + 110, hand(78, 700), C.ink, t, [ml - 0.6, ml - 0.5], 0.1); writeText('=', 430, y0 + 110, hand(78, 700), C.gray, t, [ml - 0.3], 0.1); blockWord('烈马', 500, y0 + 110, 78, C.ink, t, [ml, ml + 0.12], 6304); }
  s.lap.at(t, mw - 0.6, 0.7);
  if (t > mw - 0.2) { enText('Codex', 1390, y0 + 440, 52, P(t, mw - 0.1, 0.3), 'center'); enText('Claude Code', 1390, y0 + 530, 44, P(t, mw + 0.05, 0.3), 'center'); }
  if (t > mw) { writeText('工具', 1180, y0 + 110, hand(78, 700), C.ink, t, [mw, mw + 0.1], 0.1); writeText('=', 1360, y0 + 110, hand(78, 700), C.gray, t, [mw + 0.3], 0.1); blockWord('马具', 1430, y0 + 110, 78, COL_A, t, [m2, m2 + 0.12], 6305); }
  s.rope.at(t, m2 - 0.1, 0.6);
  drawStamp(s.stamp, 960, y0 + 820, t, m2 + 0.7, -0.06);
}

// ---------- 镜头 4：能看见，还能动手 ----------
const S4 = (() => {
  const y0 = Y(3), st = ST(3);
  const lx = 220, ly = y0 + 250, lw = 860;
  const lap = makeLaptop(lx, ly, lw, 6401).penOn();
  const items = [
    makeFolder(300, ly + 70, 1, 6402), makeFolder(460, ly + 70, 1, 6403), makeFile(620, ly + 60, 0.9, 6404), makeFile(740, ly + 60, 0.9, 6405), makeFile(860, ly + 60, 0.9, 6406),
    makeFile(320, ly + 250, 0.9, 6407), makeFolder(470, ly + 260, 1, 6408), makeFile(640, ly + 250, 0.9, 6409), makeFolder(780, ly + 260, 1, 6410),
  ];
  const lens = new Sk(6411); lens.ellipse(0, 0, 80, 80, { w: 7, turns: 1.08 }); lens.line(56, 56, 130, 130, { w: 14 });
  return { y0, st, lx, ly, lw, lap, items, lens, robot: makeRobot(6412) };
})();
function draw4(t, v) {
  const s = S4; if (!seen(v, s.y0 - 100, s.y0 + SEC) || t < s.st - 0.2) return;
  const { y0, st, ly } = s;
  s.lap.at(t, st + 0.05, 0.8);
  s.items.forEach((S, k) => { if (k !== 2) S.at(t, st + 0.5 + k * 0.08, 0.25); });
  drawRobot(s.robot, 1480, y0 + 230, 0.7, P(t, st + 0.2, 0.8), P(t, st + 0.7, 0.3), { look: -1, happy: t > M('动手') ? 1 : 0 });
  const mk = M('看到'), mf = M('文件'), mp = M('项目'), md = M('动手');
  const f = hand(80, 700);
  writeText('它能看见', 1260, y0 + 100, f, C.ink, t, seq(mk - 0.1, 4, 0.08), 0.1);
  if (t > mk) {   // 放大镜扫过文件
    const u = clamp((t - mk) / (md - mk)), x = lerp(330, 900, inOutC(u)), y = ly + 170 + Math.sin(u * TAU) * 120;
    [[350, 110], [510, 110], [660, 120], [780, 120], [900, 120], [360, 300], [520, 300], [680, 300], [830, 300]].forEach(([ix, iy], k) => {
      const d = Math.hypot(ix - x, ly + iy - y); if (d < 110 && t < md) { g.save(); g.globalAlpha = 0.35; g.fillStyle = C.orange; g.beginPath(); g.arc(ix, ly + iy, 70, 0, TAU); g.fill(); g.restore(); } });
    if (t < md + 0.3) { g.save(); g.globalAlpha = 1 - P(t, md, 0.3); g.translate(x, y); s.lens.draw(P(t, mk, 0.3)); g.restore(); }
  }
  if (t > mf) writeText('文件', 1300, y0 + 790, hand(56, 700), C.ink, t, seq(mf, 2, 0.08), 0.1, 'left', false);
  if (t > mp) writeText('项目', 1520, y0 + 790, hand(56, 700), C.ink, t, seq(mp, 2, 0.08), 0.1, 'left', false);
  if (t > mf) ckSk(1265, y0 + 792, 0.8, 6420).at(t, mf + 0.15, 0.2);
  if (t > mp) ckSk(1485, y0 + 792, 0.8, 6421).at(t, mp + 0.15, 0.2);
  // 动手：鼠标把一个文件拖进文件夹
  if (t > st + 0.6) {
    const dp = inOutC(P(t, md - 0.2, 0.9)), fx = lerp(620, 790, dp), fy = lerp(ly + 60, ly + 250, dp) - Math.sin(dp * Math.PI) * 80;
    if (dp < 0.98) { g.save(); g.translate(fx - 620, fy - (ly + 60)); s.items[2].draw(1); g.restore(); }
    if (t > md - 0.5 && t < md + 1.4) cursor(fx + 60, fy + 70, 1.3, t > md - 0.2 && dp < 1 ? 1 : 0);
    if (dp >= 0.98) { const q = P(t, md + 0.7, 0.4); g.save(); g.globalAlpha = 1 - q; g.strokeStyle = C.orange; g.lineWidth = 5; g.beginPath(); g.arc(835, ly + 300, 50 + 50 * q, 0, TAU); g.stroke(); g.restore(); }
  }
  if (t > md - 0.1) { writeText('还能', 1260, y0 + 200, f, C.ink, t, seq(md - 0.1, 2, 0.07), 0.1); blockWord('动手', 1440, y0 + 200, 80, COL_A, t, [md + 0.05, md + 0.15], 6430); }
}

// ---------- 镜头 5：不用复制粘贴，下命令等结果 ----------
const S5 = (() => {
  const y0 = Y(4), st = ST(4);
  const term = new Sk(6501).penOn(); term.fill(rrPts(330, y0 + 280, 1000, 380, 22), C.ink, { fade: 1 }); term.rrect(330, y0 + 280, 1000, 380, 22, { w: 4 });
  const strike = new Sk(6502).line(660, y0 + 132, 1270, y0 + 112, { w: 10, col: C.orange, amp: 0.6 });
  const doc = makeFile(1450, y0 + 390, 1.6, 6503);
  return { y0, st, term, strike, doc, stamp: makeStamp('搞定', 110, C.orange, 6550, 170), robot: makeRobot(6504) };
})();
function draw5(t, v) {
  const s = S5; if (!seen(v, s.y0 - 100, s.y0 + SEC) || t < s.st - 0.2) return;
  const { y0, st } = s, mc = M('复制'), mo = M('下命令'), mr = M('等结果');
  writeText('不用再', 650 - tw('不用再', hand(84, 700)) - 20, y0 + 120, hand(84, 700), C.gray, t, seq(st + 0.05, 3, 0.07), 0.1);
  writeText('复制粘贴', 680, y0 + 120, hand(110, 700), C.ink, t, seq(mc - 0.05, 4, 0.08), 0.1);
  s.strike.at(t, mc + 0.6, 0.3);
  s.term.at(t, mc + 0.7, 0.5);
  if (t > mc + 0.9) {
    const f = '700 52px "Courier New", monospace';
    const cmd = '帮我做一份汇报 PPT', n = Math.floor(clamp((t - mo) / 0.9) * cmd.length);
    text('>', 380, y0 + 360, f, C.orange);
    text(cmd.slice(0, n) + (Math.floor(t * 3) % 2 && t < mr ? '▍' : ''), 430, y0 + 360, hand(54, 700), '#ffffff');
    if (t > mr) { const q = P(t, mr, 0.6); g.save(); g.globalAlpha = q; text('✓ 已生成：汇报.pptx', 380, y0 + 470, hand(48, 700), C.orangeL); g.restore();
      g.save(); g.strokeStyle = C.orangeL; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(380, y0 + 570); g.lineTo(380 + 860 * outC(P(t, mr - 0.3, 0.5)), y0 + 570); g.stroke(); g.restore(); }
  }
  popIn(t, mr + 0.1, 1520, y0 + 470, () => { s.doc.draw(1); enText('PPT', 1520, y0 + 560, 44, 1, 'center', C.orange); });
  if (t > mo - 0.2) { writeText('你：下命令', 340, y0 + 760, hand(58, 700), C.ink, t, seq(mo - 0.2, 5, 0.06), 0.1); }
  if (t > mr - 0.1) writeText('AI：干活', 800, y0 + 760, hand(58, 700), C.ink, t, seq(mr - 0.1, 5, 0.06), 0.1);
  drawStamp(s.stamp, 1540, y0 + 780, t, mr + 0.55, -0.08);
}

// ---------- 镜头 6：什么都能做 ----------
const S6 = (() => {
  const y0 = Y(5), st = ST(5);
  const W = 460, H = 270, xs = [190, 730, 1270], ys = [y0 + 150, y0 + 460];
  const defs = [['做 PPT', 'PPT'], ['改 Excel', 'Excel'], ['整理文件夹', '文件夹'], ['清理 C 盘', 'C盘'], ['改代码', '代码'], ['操作浏览器', '浏览器']];
  const cards = defs.map(([label, mk], k) => {
    const x = xs[k % 3], y = ys[Math.floor(k / 3)], cx = x + W / 2, cy = y + 110;
    let icon; const sd = 6610 + k * 3;
    if (k === 0) { icon = new Sk(sd); icon.rect(cx - 90, cy - 60, 180, 120, { w: 3.4, over: 4 }); [[-60, 30], [-20, 55], [20, 80]].forEach(([dx, h]) => { icon.fill(rectPts(cx + dx, cy + 45 - h, 28, h), C.orange, { fade: 10 }); icon.rect(cx + dx, cy + 45 - h, 28, h, { w: 2.4, over: 2 }); }); }
    else if (k === 1) { icon = new Sk(sd); icon.rect(cx - 100, cy - 60, 200, 120, { w: 3.4, over: 4 }); for (let i = 1; i < 4; i++) icon.line(cx - 100, cy - 60 + i * 30, cx + 100, cy - 60 + i * 30, { w: 2 }); for (let i = 1; i < 4; i++) icon.line(cx - 100 + i * 50, cy - 60, cx - 100 + i * 50, cy + 60, { w: 2 }); icon.fill(rectPts(cx - 48, cy - 28, 46, 26), C.orangeL, { fade: 10 }); }
    else if (k === 2) icon = makeFolder(cx - 70, cy - 55, 1.25, sd);
    else if (k === 3) icon = makeDisk(cx, cy - 5, 1, sd);
    else if (k === 4) icon = new Sk(sd).rect(cx - 100, cy - 60, 200, 120, { w: 3.4, over: 4 });
    else icon = makeBrowser(cx - 110, cy - 70, 220, 145, sd);
    return { label, mk, x, y, cx, cy, box: makeCard(x, y, W, H, sd + 1), icon, ck: ckSk(x + W - 50, y + 50, 1.2, sd + 2) };
  });
  return { y0, st, W, H, cards, stamp: makeStamp('更快', 130, C.orange, 6650, 170) };
})();
function draw6(t, v) {
  const s = S6; if (!seen(v, s.y0 - 100, s.y0 + SEC) || t < s.st - 0.2) return;
  const { y0, st, W, H } = s, mu = M('怎么用电脑'), mq = M('更快');
  const dim = 1 - 0.85 * P(t, mu, 0.5);
  g.save(); g.globalAlpha = dim;
  s.cards.forEach((c, k) => {
    const t0 = M(c.mk) - 0.25;
    if (t < t0) return;
    popIn(t, t0, c.cx, c.cy + 30, () => { c.box.draw(1); c.icon.draw(P(t, t0 + 0.05, 0.4)); if (k === 4) enText('</>', c.cx, c.cy + 2, 64, P(t, t0 + 0.15, 0.2), 'center', C.orange); });
    if (t > t0 + 0.1) writeText(c.label, c.cx, c.y + H - 50, hand(54, 700), C.ink, t, seq(t0 + 0.1, c.label, 0.05), 0.08, 'center', false);
    c.ck.at(t, t0 + 0.45, 0.2);
  });
  g.restore();
  if (t > mu - 0.1) {
    const f = hand(76, 700);
    writeText('你以前怎么用电脑，', 960, y0 + 300, f, C.ink, t, seq(mu - 0.1, 9, 0.06), 0.1, 'center');
    writeText('它都能做', 960, y0 + 440, hand(96, 700), C.ink, t, seq(M('都能做') - 0.1, 4, 0.08), 0.1, 'center');
    underline(770, 1150, y0 + 500, mulberry32(6660), P(t, M('都能做') + 0.3, 0.35), 8, C.orange, M('都能做') + 0.3);
  }
  speedLines(t, mq + 0.05, 1330, y0 + 720, 5, 320);
  drawStamp(s.stamp, 1500, y0 + 720, t, mq, -0.08);
}

// ---------- 镜头 7：整台电脑都交给 AI ----------
const S7 = (() => {
  const y0 = Y(6), st = ST(6);
  const win = makeWindowIcon(210, y0 + 360, 260, 210, 6701);
  const arr = makeArrow(560, y0 + 470, 790, y0 + 470, 6702, C.ink, 6, 40);
  const lap = makeLaptop(960, y0 + 250, 700, 6703).penOn();
  return { y0, st, win, arr, lap, robot: makeRobot(6704), stamp: makeStamp('交给 AI', 96, C.ink, 6750, 170) };
})();
function draw7(t, v) {
  const s = S7; if (!seen(v, s.y0 - 100, s.y0 + SEC) || t < s.st - 0.2) return;
  const { y0, st } = s, mw = M('一扇窗'), mn = M('那现在'), mz = M('整台电脑'), mg = M('交给');
  s.win.at(t, st + 0.1, 0.6);
  if (t > st + 0.4) writeText('第一种', 340, y0 + 300, hand(54, 700), C.gray, t, seq(st + 0.4, 3, 0.07), 0.1, 'center', false);
  if (t > mw - 0.1) writeText('一扇窗', 340, y0 + 650, hand(64, 700), C.ink, t, seq(mw - 0.1, 3, 0.08), 0.1, 'center');
  s.arr.at(t, mn - 0.1, 0.4);
  s.lap.at(t, mn, 0.8);
  if (t > mn + 0.3) { const rise = outBack(P(t, mz - 0.1, 0.6)); g.save(); g.beginPath(); g.rect(982, y0 + 272, 656, 390); g.clip();
    drawRobot(s.robot, 1310, lerp(y0 + 760, y0 + 300, rise), 0.6, P(t, mn + 0.3, 0.8), P(t, mz + 0.2, 0.3), { look: 0.3 * Math.sin(t * 1.5), happy: t > mg ? 1 : 0 }); g.restore(); }
  if (t > mz - 0.1) blockWord('整台电脑', 1130, y0 + 130, 84, C.ink, t, seq(mz - 0.1, 4, 0.08), 6705);
  drawStamp(s.stamp, 1600, y0 + 810, t, mg + 0.2, -0.08);
  const nx = '下一种：搬进云端 →', tn = mg + 1.1;
  if (t > tn) writeText(nx, 400, y0 + 800, hand(44, 700), C.gray, t, seq(tn, nx, 0.035), 0.06, 'center', false);
}

// ---------- 镜头运动 ----------
CAM0 = { x: 960, y: Y(0) + 430, z: 0.95 };
CAM = [];
for (let i = 1; i < TL.shots.length; i++) {
  const cu = FX_CUTS[i - 1], jump = cu && (cu.kind === 'curl' || cu.kind === 'erase'), sh = TL.shots[i];
  CAM.push(jump ? [cu.t0, cu.tj, 960, Y(i) + 430, 0.95, 'cut'] : [sh.start - 0.2, sh.start + 0.5, 960, Y(i) + 430, 0.95]);
}
CAM.push([M('Harness') - 0.2, M('Harness') + 0.4, 1000, Y(1) + 380, 1.05, 'sine'], [M('马具') - 0.3, M('马具') + 0.4, 960, Y(1) + 450, 0.95, 'sine']);
CAM.sort((a, b) => a[0] - b[0]);
const SHAKES = () => [M('马具2') + 0.7, M('等结果') + 0.55, M('更快'), M('交给') + 0.2];
function fxBefore(t) { for (const t0 of SHAKES()) { const s = 动效.shake(t, t0, { d: 0.2, amp: 7 }); if (s && (s.dx || s.dy)) g.translate(s.dx, s.dy); } }
function drawScenes(t, v) { draw1(t, v); draw2(t, v); draw3(t, v); draw4(t, v); draw5(t, v); draw6(t, v); draw7(t, v); }
