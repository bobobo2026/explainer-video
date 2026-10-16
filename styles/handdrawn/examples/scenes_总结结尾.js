// ===== 场景：总结 + 结尾 =====
const DISP = { 1: '总结一下', 3: '给 AI 开一扇窗', 5: '把整台电脑交给 AI', 7: '组建你的 AI 团队', 8: '如果这期让你面前的迷雾清晰了一点点', 9: '点赞、收藏、关注走起！', 10: '还有想知道的，' };
TL.cues.forEach((c) => { if (DISP[c.id]) c.text = DISP[c.id]; });
['erase'].forEach((k, i) => { if (FX_CUTS[i]) FX_CUTS[i].kind = k; });
fxPlan();
const SEC = 1150, Y = (i) => i * SEC;
const ST = (i) => fxStart(i);
// @@WIDGETS@@

// ---------- 镜头 1：三级台阶 ----------
const S1 = (() => {
  const y0 = Y(0);
  const rows = [
    { mk: '第一种', mw: '一扇窗', L: 'A', pre: '给 AI 开', key: '一扇窗', post: '', x: 200, y: y0 + 690, ico: (x, y, sd) => makeWindowIcon(x - 70, y - 60, 140, 115, sd) },
    { mk: '第二种', mw: '整台电脑', L: 'B', pre: '把', key: '整台电脑', post: '交给 AI', x: 520, y: y0 + 470, ico: (x, y, sd) => makeLaptop(x - 85, y - 70, 170, sd) },
    { mk: '第三种', mw: 'AI团队', L: 'C', pre: '组建你的', key: 'AI 团队', post: '', x: 840, y: y0 + 250, ico: (x, y, sd) => makeCloud(x, y, 0.7, sd) },
  ].map((r, k) => {
    const sd = 8100 + k * 7, step = new Sk(sd + 1);
    step.line(r.x - 130, r.y + 100, r.x + 1040, r.y + 100, { w: 4.4 }); step.line(r.x - 130, r.y + 100, r.x - 130, r.y + 320 - (k === 0 ? 120 : 0), { w: 4.4 });
    return { ...r, sd, step, icon: r.ico(r.x, r.y, sd), ck: ckSk(r.x + 1000, r.y + 20, 1.2, sd + 3) };
  });
  const arrows = [makeArrow(260, y0 + 590, 400, y0 + 470, 8150, C.orange, 6, 40), makeArrow(580, y0 + 370, 720, y0 + 250, 8151, C.orange, 6, 40)];
  return { y0, rows, arrows, crown: makeCrown(840, y0 + 150, 0.7, 8160), robot: makeRobot(8161) };
})();
function draw1(t, v) {
  const { y0, rows, arrows, crown } = S1; if (!seen(v, y0 - 100, y0 + SEC)) return;
  writeText('总结一下', 960, y0 + 60, hand(80, 700), C.ink, t, seq(0.25, 4, 0.08), 0.1, 'center');
  rows.forEach((r, k) => {
    const t0 = M(r.mk) - 0.2; if (t < t0) return;
    r.step.at(t, t0, 0.5); r.icon.at(t, t0 + 0.1, 0.5);
    blockWord(r.L, r.x + 140, r.y, 56, k === 0 ? COL_A : k === 1 ? C.ink : COL_A, t, [t0 + 0.2], 8170 + k);
    const f = hand(64, 700), mw = M(r.mw); let x = r.x + 220;
    if (r.pre) x += writeText(r.pre, x, r.y, f, C.ink, t, seq(Math.max(t0 + 0.3, mw - 0.5), r.pre, 0.06), 0.1) + 16;
    x += blockWord(r.key, x + 10, r.y, 64, k === 1 ? C.ink : COL_A, t, seq(mw, r.key, 0.08), 8175 + k) + 40;
    if (r.post) writeText(r.post, x, r.y, f, C.ink, t, seq(mw + 0.4, r.post, 0.06), 0.1);
    r.ck.at(t, mw + 0.6, 0.2);
    if (k > 0) arrows[k - 1].at(t, t0 - 0.1, 0.4);
  });
  popIn(t, M('AI团队') + 0.3, 840, y0 + 150, () => crown.draw(1));
}

// ---------- 镜头 2：迷雾散开 + 点赞收藏关注 ----------
const S2 = (() => {
  const y0 = Y(1), st = ST(1);
  const fog = []; for (let k = 0; k < 16; k++) { const S = new Sk(8200 + k), y = y0 + 120 + k * 42, x0 = 300 + (k % 3) * 60; S.squig(x0, y, x0 + 1300 - (k % 4) * 80, { w: 10, col: C.gray3 || C.gray2, amp: 9, per: 70 }); fog.push(S); }
  const icons = [
    { mk: '点赞', w: '点赞', x: 640, draw: (S, x, y) => { const pts = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU, hx = 16 * Math.pow(Math.sin(a), 3), hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)); pts.push([x + hx * 4, y + hy * 4]); } S.fill(pts, C.orange, { fade: 10 }); S.curve(pts, { w: 4, closed: true }); } },
    { mk: '收藏', w: '收藏', x: 960, draw: (S, x, y) => { const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 30 : 72; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); } S.fill(pts, C.orange, { fade: 10 }); S.poly(pts.concat([pts[0]]), { w: 4 }); } },
    { mk: '关注', w: '关注', x: 1280, draw: (S, x, y) => { S.fill(circlePts(x, y, 66), C.orange, { fade: 10 }); S.ellipse(x, y, 66, 66, { w: 4, turns: 1.06, spiral: 0.02 }); S.line(x - 32, y, x + 32, y, { w: 10, col: '#ffffff' }); S.line(x, y - 32, x, y + 32, { w: 10, col: '#ffffff' }); } },
  ].map((ic, k) => { const S = new Sk(8230 + k); ic.draw(S, ic.x, y0 + 520); return { ...ic, S }; });
  const bub = makeBubble(1260, y0 + 120, 520, 150, 8240, 'left');
  return { y0, st, fog, icons, bub, robot: makeRobot(8250), stamp: makeStamp('下期见', 110, C.orange, 8260, 170) };
})();
function draw2(t, v) {
  const s = S2; if (!seen(v, s.y0 - 100, s.y0 + SEC) || t < s.st - 0.2) return;
  const { y0, st } = s, mm = M('迷雾'), mq = M('清晰'), mz = M('点赞'), mk = M('想知道'), mp = M('评论区'), mn = M('下期');
  // 机器人在雾后面，雾散了就笑
  const clear = P(t, mq, 1.0), rx = lerp(960, 900, P(t, mk - 0.3, 0.6)), rs = lerp(0.62, 0.42, inOutC(P(t, mz - 0.4, 0.6))), ry = lerp(y0 + 210, y0 + 130, inOutC(P(t, mz - 0.4, 0.6)));
  const rxx = lerp(960, 960, 0);
  drawRobot(s.robot, rxx, ry, rs, P(t, st + 0.1, 0.8), P(t, st + 0.6, 0.3), { happy: clear > 0.6 ? 1 : 0, look: clear > 0.6 ? 0.3 * Math.sin(t * 2) : 0 });
  g.save(); s.fog.forEach((S, k) => { const dx = clear * (k % 2 ? 1 : -1) * 900; g.save(); g.globalAlpha = (1 - clear) * 0.85; g.translate(dx + Math.sin(t * 0.8 + k) * 20, 0); S.at(t, st + 0.2 + k * 0.05, 0.6); g.restore(); }); g.restore();
  if (t > mq + 0.3 && t < mz) writeText('清晰了一点点', 960, y0 + 800, hand(64, 700), C.ink, t, seq(mq + 0.3, 6, 0.06), 0.1, 'center');
  s.icons.forEach((ic, k) => {
    const t0 = M(ic.mk) - 0.1; if (t < t0) return;
    const bp = 1 + 0.08 * Math.sin((t - t0) * 6) * Math.exp(-(t - t0) * 2);
    popIn(t, t0, ic.x, y0 + 520, () => { g.save(); g.translate(ic.x, y0 + 520); g.scale(bp, bp); g.translate(-ic.x, -(y0 + 520)); ic.S.draw(1); g.restore(); });
    writeText(ic.w, ic.x, y0 + 645, hand(60, 700), C.ink, t, seq(t0 + 0.1, 2, 0.08), 0.1, 'center', false);
  });
  if (t > mk - 0.2) { s.bub.at(t, mk - 0.2, 0.3); writeText('还有想知道的？', 1300, y0 + 175, hand(50, 700), C.ink, t, seq(mk - 0.1, 7, 0.05), 0.08, 'left', false); }
  if (t > mp - 0.1) { writeText('评论区留言', 1300, y0 + 235, hand(50, 700), C.orange, t, seq(mp - 0.1, 5, 0.06), 0.08, 'left', false); }
  drawStamp(s.stamp, 960, y0 + 820, t, mn + 0.1, -0.05);
}

// ---------- 镜头运动 ----------
CAM0 = { x: 960, y: Y(0) + 430, z: 0.95 };
CAM = [];
for (let i = 1; i < TL.shots.length; i++) {
  const cu = FX_CUTS[i - 1], jump = cu && (cu.kind === 'curl' || cu.kind === 'erase'), sh = TL.shots[i];
  CAM.push(jump ? [cu.t0, cu.tj, 960, Y(i) + 430, 0.95, 'cut'] : [sh.start - 0.2, sh.start + 0.5, 960, Y(i) + 430, 0.95]);
}
CAM.sort((a, b) => a[0] - b[0]);
const SHAKES = () => [M('下期') + 0.1];
function fxBefore(t) { for (const t0 of SHAKES()) { const s = 动效.shake(t, t0, { d: 0.2, amp: 7 }); if (s && (s.dx || s.dy)) g.translate(s.dx, s.dy); } }
function drawScenes(t, v) { draw1(t, v); draw2(t, v); }
