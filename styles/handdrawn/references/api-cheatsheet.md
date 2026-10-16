# API 速查（模板 + assets/widgets.js）

## 时间
- `M('词')` 关键词开始秒数（来自 分镜.json marks）；`ME('词')` 结束。`MS('词', 默认)` 不存在不报错。
- `TL.shots[i].start/end`，`TL.cues`，`TL.chars`（逐字 start/end/cue），`TL.duration`。
- `ST(i)=fxStart(i)` 第 i 镜（0 起）转场结束、可以开始画的时刻。
- `P(t, t0, d)` 0→1 进度；缓动 `outC` `outBack` `inOutC` `bump`；`lerp` `clamp`；`seq(t0, str|n, step)` 逐字时间数组。

## 线稿 Sk（构建一次，帧里调用 at/draw）
```js
const S = new Sk(seed).penOn();          // penOn：描线时画笔尖跟随
S.line(x0,y0,x1,y1,{w,col,amp}); S.poly(pts,o); S.curve(pts,{w,col,closed,amp});
S.rect(x,y,w,h,{w,over,double}); S.rrect(x,y,w,h,r,{w}); S.ellipse(cx,cy,rx,ry,{w,col,turns,spiral});
S.dash(x0,y0,x1,y1,{w,col,d,gp}); S.squig(x0,y,x1,{w,col,amp,per}); S.filler(x0,y,x1)  // 假文字 ~~~ — ·
S.hatch(poly, angle, gap, {w}); S.ground(x0,x1,y); S.dot(x,y,r,col); S.fill(pts,col,{fade})
S.at(t, t0, d)   // 在 t0 开始用 d 秒描完；S.draw(p) 直接画到进度 p
```
点集工具：`rrPts(x,y,w,h,r)` `rectPts(x,y,w,h)` `circlePts(cx,cy,r)`。

## 文字
- `writeText(str,x,y,font,col,t,times,dur,align='left',pen=true)` 返回宽度；`font=hand(size,700)`。
- `blockWord(str,x,y,size,col,t,times,seed)` 色块白字（核心词），返回宽度。
- `enText(str,x,y,size,alpha,align,col)` 英文；`text(str,x,y,font,col,align)` 静态字；`tw(str,font)` 量宽度。
- `tag('@B',x,y,size,p)` 左上小标签；`underline(x0,x1,y,mulberry32(seed),p,w,col,t0)` 马克笔下划线。
- `makeStamp(str,size,col,seed,170)` + `drawStamp(ST,cx,cy,t,t0,rot)` 颗粒印章（重音）。

## 角色/物件
- 模板：`makeRobot(seed)` + `drawRobot(R,x,y,scale,p,faceAlpha,{look:-1..1,happy:0|1})`（机器人高约 530×scale，(x,y) 是天线顶）；`makeBubble(x,y,w,h,seed,'left'|'right'|'down')`；`cardText/cardImg/cardWave`。
- widgets.js：`makeLaptop(x,y,w,seed)`（屏幕左上角，高≈0.62w+底座）、`makeFolder`、`makeFile`、`makeBrowser(x,y,w,h)`、`makeCloud(cx,cy,s)`、`makeWindowIcon`、`makePhone(x,y,w,h)`、`makePerson(cx,脚底y,s,seed,{sit,arm:'down'|'point'|'type'})`、`makeCrown(cx,cy,s)`、`makeClock`+`clockHands(cx,cy,r,ang)`、`makeGear`、`makeHorseshoe`、`makeDisk`、`makeArrow(x0,y0,x1,y1,seed,col,w,bend)`、`makeCard(x,y,w,h,seed)`、`ckSk`（打勾）、`xSk`（打叉）。
- 动作：`popIn(t,t0,cx,cy,()=>{...})` 弹出；`slipDraw(t,t0,cx,cy,w,h,rot,seed,label,size,col,fill)` 掉落纸条；`cursor(x,y,s,press)` 鼠标；`speedLines(t,t0,x,y,n,L)` 速度线。
- 裁切：机器人从屏幕里升起 → `g.save(); g.beginPath(); g.rect(屏幕内框); g.clip(); drawRobot(...); g.restore();`

## 镜头与特效
```js
CAM0 = { x: 960, y: Y(0)+430, z: 0.95 };
CAM = [[t0, t1, x, y, z, 'sine'|'cut'], ...];   // 每镜切过去一条；局部推近 z 1.05–1.18（注意边缘裁切）
FX_CUTS[k].kind = 'zoom'|'scroll'|'curl'|'erase'; fxPlan();   // curl/erase 要用 'cut' 跳镜（见 examples 里的循环写法）
const SHAKES = () => [M('更快'), ...];   // 印章砸下同一刻
function fxBefore(t){ for (const t0 of SHAKES()) { const s = 动效.shake(t,t0,{d:0.2,amp:7}); if (s&&(s.dx||s.dy)) g.translate(s.dx,s.dy); } }
```
颜色：`C.paper C.white C.ink C.gray C.gray2 C.orange C.orangeD C.orangeL`；`COL_A`=橙（高亮 A），B 用 `C.ink`。
