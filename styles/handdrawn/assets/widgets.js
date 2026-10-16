// ---------- 小部件 ----------
function makeLaptop(x, y, w, seed) {   // (x,y) 屏幕左上角，w 屏幕宽；高约 0.62w + 底座
  const S = new Sk(seed), h = w * 0.62;
  S.fill(rrPts(x, y, w, h, 18), C.white, { fade: 1 });
  S.rrect(x, y, w, h, 18, { w: 4 });
  S.rect(x + 22, y + 22, w - 44, h - 44, { w: 2.4, over: 4 });
  S.poly([[x - 40, y + h + 8], [x + w + 40, y + h + 8], [x + w + 70, y + h + 46], [x - 70, y + h + 46], [x - 40, y + h + 8]], { w: 3.6 });
  S.line(x + w * 0.4, y + h + 27, x + w * 0.6, y + h + 27, { w: 2.6 });
  S.hatch([[x + w + 44, y + h + 10], [x + w + 70, y + h + 46], [x + w + 30, y + h + 46]], 0.8, 7, { w: 1.4 });
  S.ground(x - 100, x + w + 110, y + h + 62);
  return S;
}
function makeFolder(x, y, s, seed) {
  const S = new Sk(seed);
  const pts = [[x, y + 14 * s], [x, y], [x + 40 * s, y], [x + 52 * s, y + 14 * s], [x + 110 * s, y + 14 * s], [x + 110 * s, y + 84 * s], [x, y + 84 * s]];
  S.fill(pts, C.orangeL, { fade: 10 }); S.poly(pts.concat([pts[0]]), { w: 3 });
  S.line(x, y + 26 * s, x + 110 * s, y + 26 * s, { w: 2 });
  return S;
}
function makeFile(x, y, s, seed) {
  const S = new Sk(seed), w = 86 * s, h = 104 * s, d = 22 * s;
  S.fill(rectPts(x, y, w, h), C.white, { fade: 1 });
  S.poly([[x, y], [x + w - d, y], [x + w, y + d], [x + w, y + h], [x, y + h], [x, y]], { w: 3 });
  S.poly([[x + w - d, y], [x + w - d, y + d], [x + w, y + d]], { w: 2.2 });
  for (let k = 0; k < 3; k++) S.line(x + 14 * s, y + (40 + k * 20) * s, x + w - (16 + (k === 2 ? 22 : 0)) * s, y + (40 + k * 20) * s, { w: 2.2, col: C.gray });
  return S;
}
function makeBrowser(x, y, w, h, seed) {
  const S = new Sk(seed);
  S.fill(rrPts(x, y, w, h, 22), C.white, { fade: 1 });
  S.rrect(x, y, w, h, 22, { w: 4 });
  S.line(x + 6, y + 70, x + w - 6, y + 70, { w: 3 });
  for (let k = 0; k < 3; k++) S.ellipse(x + 40 + k * 32, y + 36, 9, 9, { w: 2.6, turns: 1.05, spiral: 0.02 });
  S.rrect(x + 150, y + 18, w - 190, 36, 14, { w: 2.4 });
  return S;
}
function makeCloud(cx, cy, s, seed) {
  const S = new Sk(seed), pts = [];
  const bumps = [[-110, 20, 50], [-60, -30, 60], [10, -55, 70], [85, -25, 58], [120, 25, 45]];
  const outline = [[-150, 40], [-155, 10], [-120, -15], [-95, -55], [-40, -75], [10, -110], [70, -95], [100, -70], [140, -45], [165, 0], [160, 40], [130, 62], [-120, 62]];
  S.fill(outline.map(([a, b]) => [cx + a * s, cy + b * s]), C.white, { fade: 1 });
  S.curve(outline.map(([a, b]) => [cx + a * s, cy + b * s]), { w: 3.6, closed: true });
  S.hatch([[cx + 60 * s, cy + 50 * s], [cx + 150 * s, cy + 30 * s], [cx + 130 * s, cy + 60 * s]], 0.8, 8, { w: 1.4 });
  return S;
}
function makeWindowIcon(x, y, w, h, seed, frame = true) {   // 窗户：外框 + 十字窗棂
  const S = new Sk(seed);
  S.fill(rectPts(x, y, w, h), C.white, { fade: 1 });
  S.rect(x, y, w, h, { w: 4.4, over: 10, double: frame ? 6 : 0 });
  S.line(x + w / 2, y, x + w / 2, y + h, { w: 3.4 });
  S.line(x, y + h / 2, x + w, y + h / 2, { w: 3.4 });
  return S;
}
function cursor(x, y, s = 1, press = 0) {
  const k = s * (1 - 0.12 * press);
  g.save(); g.translate(x, y); g.scale(k, k);
  g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 46); g.lineTo(12, 35); g.lineTo(21, 55); g.lineTo(29, 51); g.lineTo(20, 32); g.lineTo(36, 32); g.closePath();
  g.fillStyle = C.white; g.fill(); g.strokeStyle = C.ink; g.lineWidth = 3.2; g.lineJoin = 'round'; g.stroke(); g.restore();
}
function slipDraw(t, t0, cx, cy, w, h, rot, seed, label, size, col = C.ink, fillCol = C.white) {   // 掉下来的纸条 + 手写名字
  if (t < t0 - 0.05) return;
  const p = P(t, t0 - 0.05, 0.42), s = lerp(1.35, 1, outBack(p)), a = clamp(p * 3);
  const sw = 动效.sway(t, seed * 0.37, { dy: 3, deg: 1.4 });
  g.save(); g.globalAlpha *= a; g.translate(cx, cy + sw.dy); g.rotate(rot + sw.r * 0.6); g.scale(s, s);
  g.fillStyle = 'rgba(21,25,45,0.10)'; g.fillRect(-w / 2 + 8, -h / 2 + 10, w, h);
  const r = mulberry32(seed); blockQuad(-w / 2, -h / 2, w, h, fillCol, r);
  g.strokeStyle = C.ink; g.lineWidth = 3; g.beginPath(); g.rect(-w / 2, -h / 2, w, h); g.stroke();
  g.restore();
  g.save(); g.globalAlpha *= a; g.translate(cx, cy + sw.dy); g.rotate(rot + sw.r * 0.6); g.scale(s, s);
  writeText(label, 0, 4, hand(size, 700), col, t, seq(t0 + 0.05, label, 0.05), 0.08, 'center', false);
  g.restore();
}
// ---------- 新部件（第二~四段）----------
function ckSk(x, y, s, seed, col = C.orange) { return new Sk(seed).poly([[x - 24 * s, y - 2 * s], [x - 6 * s, y + 20 * s], [x + 32 * s, y - 28 * s]], { w: 9 * s, col }); }
function xSk(x, y, s, seed, col = C.orange) { return new Sk(seed).line(x - 26 * s, y - 26 * s, x + 26 * s, y + 26 * s, { w: 8 * s, col, amp: 0.4 }).line(x + 26 * s, y - 26 * s, x - 26 * s, y + 26 * s, { w: 8 * s, col, amp: 0.4 }); }
function makePerson(cx, fy, s, seed, o = {}) {   // fy = 脚底
  const S = new Sk(seed), hx = cx, hy = fy - 232 * s;
  S.fill(circlePts(hx, hy, 38 * s), C.white, { fade: 1 }); S.ellipse(hx, hy, 38 * s, 40 * s, { w: 3.6, turns: 1.06, spiral: 0.02 });
  S.dot(hx - 13 * s, hy - 2 * s, 4.2 * s); S.dot(hx + 13 * s, hy - 2 * s, 4.2 * s);
  S.curve([[hx - 12 * s, hy + 14 * s], [hx, hy + 20 * s], [hx + 12 * s, hy + 14 * s]], { w: 2.6 });
  S.line(cx, fy - 192 * s, cx, fy - 92 * s, { w: 4 });
  if (o.sit) { S.line(cx, fy - 92 * s, cx + 60 * s, fy - 92 * s, { w: 4 }); S.line(cx + 60 * s, fy - 92 * s, cx + 60 * s, fy, { w: 4 }); }
  else { S.line(cx, fy - 92 * s, cx - 40 * s, fy, { w: 4 }); S.line(cx, fy - 92 * s, cx + 40 * s, fy, { w: 4 }); }
  const arm = o.arm || 'down';
  S.line(cx, fy - 170 * s, cx - 58 * s, fy - 112 * s, { w: 4 });
  if (arm === 'point') S.line(cx, fy - 170 * s, cx + 80 * s, fy - 190 * s, { w: 4 });
  else if (arm === 'type') S.line(cx, fy - 170 * s, cx + 80 * s, fy - 130 * s, { w: 4 });
  else S.line(cx, fy - 170 * s, cx + 58 * s, fy - 112 * s, { w: 4 });
  return S;
}
function makeCrown(cx, cy, s, seed) {
  const S = new Sk(seed), pts = [[-52, 30], [-62, -34], [-26, -2], [0, -50], [26, -2], [62, -34], [52, 30]].map(([a, b]) => [cx + a * s, cy + b * s]);
  S.fill(pts, C.orange, { fade: 10 }); S.poly(pts.concat([pts[0]]), { w: 3.4 });
  S.dot(cx, cy - 50 * s - 6, 7 * s, C.orange); S.dot(cx - 62 * s, cy - 34 * s - 5, 6 * s, C.orange); S.dot(cx + 62 * s, cy - 34 * s - 5, 6 * s, C.orange);
  return S;
}
function makePhone(x, y, w, h, seed) {
  const S = new Sk(seed);
  S.fill(rrPts(x, y, w, h, 34), C.white, { fade: 1 }); S.rrect(x, y, w, h, 34, { w: 4.4 });
  S.line(x + w / 2 - 40, y + 28, x + w / 2 + 40, y + 28, { w: 5 });
  S.ellipse(x + w / 2, y + h - 34, 14, 14, { w: 2.8, turns: 1.05, spiral: 0.02 });
  S.line(x + 12, y + 56, x + w - 12, y + 56, { w: 2.2, col: C.gray }); S.line(x + 12, y + h - 68, x + w - 12, y + h - 68, { w: 2.2, col: C.gray });
  return S;
}
function makeClock(cx, cy, r, seed) {
  const S = new Sk(seed);
  S.fill(circlePts(cx, cy, r), C.white, { fade: 1 }); S.ellipse(cx, cy, r, r, { w: 4.4, turns: 1.08, spiral: 0.02 });
  for (let k = 0; k < 12; k++) { const a = k / 12 * TAU, L = k % 3 === 0 ? 22 : 12; S.line(cx + Math.cos(a) * (r - 8), cy + Math.sin(a) * (r - 8), cx + Math.cos(a) * (r - 8 - L), cy + Math.sin(a) * (r - 8 - L), { w: k % 3 === 0 ? 4 : 2.6 }); }
  return S;
}
function clockHands(cx, cy, r, ang) {
  g.save(); g.strokeStyle = C.ink; g.lineCap = 'round';
  g.lineWidth = 7; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(ang / 12 - Math.PI / 2) * r * 0.5, cy + Math.sin(ang / 12 - Math.PI / 2) * r * 0.5); g.stroke();
  g.strokeStyle = C.orange; g.lineWidth = 5; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(ang - Math.PI / 2) * r * 0.75, cy + Math.sin(ang - Math.PI / 2) * r * 0.75); g.stroke();
  g.fillStyle = C.ink; g.beginPath(); g.arc(cx, cy, 8, 0, TAU); g.fill(); g.restore();
}
function makeGear(cx, cy, r, seed) {
  const S = new Sk(seed), pts = [], n = 8;
  for (let k = 0; k < n; k++) { const a = k / n * TAU, d = TAU / n;
    [[a - d * 0.32, r * 0.78], [a - d * 0.2, r], [a + d * 0.2, r], [a + d * 0.32, r * 0.78]].forEach(([aa, rr_]) => pts.push([cx + Math.cos(aa) * rr_, cy + Math.sin(aa) * rr_])); }
  S.fill(pts, C.white, { fade: 1 }); S.poly(pts.concat([pts[0]]), { w: 3.4 });
  S.ellipse(cx, cy, r * 0.32, r * 0.32, { w: 3, turns: 1.05, spiral: 0.02 });
  return S;
}
function makeHorseshoe(cx, cy, s, seed) {
  const S = new Sk(seed), R = 120 * s, r = 74 * s, out = [], inn = [];
  for (let k = 0; k <= 24; k++) { const a = (150 + k * 10) * Math.PI / 180; out.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]); inn.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  const poly = out.concat(inn.reverse());
  S.fill(poly, C.orangeL, { fade: 10 }); S.poly(poly.concat([poly[0]]), { w: 4.4 });
  [185, 220, 255, 285, 320, 355].forEach((d) => { const a = d * Math.PI / 180; S.dot(cx + Math.cos(a) * 97 * s, cy + Math.sin(a) * 97 * s, 6 * s); });
  return S;
}
function makeDisk(cx, cy, s, seed) {
  const S = new Sk(seed), w = 90 * s, h = 70 * s, e = 24 * s;
  S.fill(rectPts(cx - w, cy - h / 2, w * 2, h), C.white, { fade: 1 });
  S.ellipse(cx, cy - h / 2, w, e, { w: 3.2, turns: 1.04, spiral: 0.01 });
  S.line(cx - w, cy - h / 2, cx - w, cy + h / 2, { w: 3.2 }); S.line(cx + w, cy - h / 2, cx + w, cy + h / 2, { w: 3.2 });
  S.curve([[cx - w, cy + h / 2], [cx - w * 0.6, cy + h / 2 + e * 0.9], [cx, cy + h / 2 + e], [cx + w * 0.6, cy + h / 2 + e * 0.9], [cx + w, cy + h / 2]], { w: 3.2 });
  S.dot(cx + w * 0.6, cy + h * 0.25, 6 * s, C.orange);
  return S;
}
function makeArrow(x0, y0, x1, y1, seed, col = C.ink, w = 5, bend = 0) {
  const S = new Sk(seed), mx = (x0 + x1) / 2, my = (y0 + y1) / 2 - bend;
  S.curve([[x0, y0], [mx, my], [x1, y1]], { w, col });
  const a = Math.atan2(y1 - my, x1 - mx), L = 30;
  S.poly([[x1 + Math.cos(a + 2.6) * L, y1 + Math.sin(a + 2.6) * L], [x1, y1], [x1 + Math.cos(a - 2.6) * L, y1 + Math.sin(a - 2.6) * L]], { w, col });
  return S;
}
function makeCard(x, y, w, h, seed, fillCol = C.white) { const S = new Sk(seed); S.fill(rrPts(x, y, w, h, 24), fillCol, { fade: 1 }); S.rrect(x, y, w, h, 24, { w: 3.6 }); return S; }
function popIn(t, t0, cx, cy, fn, d = 0.35) { if (t < t0) return; const p = P(t, t0, d), s = lerp(0.4, 1, outBack(p)); g.save(); g.globalAlpha *= clamp(p * 3); g.translate(cx, cy); g.scale(s, s); g.translate(-cx, -cy); fn(); g.restore(); }
function speedLines(t, t0, x, y, n, L, col = C.orange) { if (t < t0) return; g.save(); g.strokeStyle = col; g.lineWidth = 5; g.lineCap = 'round';
  for (let k = 0; k < n; k++) { const p = P(t, t0 + k * 0.05, 0.25), yy = y + (k - (n - 1) / 2) * 26, ph = ((t * 2.2 + k * 0.37) % 1); g.globalAlpha = p * (0.4 + 0.6 * (1 - ph)); g.beginPath(); g.moveTo(x - L * p, yy); g.lineTo(x - L * p * 0.15 - ph * 30, yy); g.stroke(); }
  g.restore(); }
