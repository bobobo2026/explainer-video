// 用法：node render.mjs stills 120 450 900   （静帧，0.4 倍缩放，存 stills/）
//       node render.mjs video [preview]       （整片 → out/video.mp4；preview 只渲前 30 秒 → out/preview.mp4）
// 一次只跑一个渲染；约 3.7 秒墙钟 / 1 秒视频（concurrency 2）
import {bundle} from '@remotion/bundler';
import {renderStill, renderMedia, selectComposition} from '@remotion/renderer';
import fs from 'fs';
const mode = process.argv[2]; fs.mkdirSync('stills', {recursive: true}); fs.mkdirSync('out', {recursive: true});
const fix = (rules) => { for (const r of rules||[]) { if (r.use) for (const u of [].concat(r.use)) { if (u && typeof u==='object' && String(u.loader).includes('esbuild')) u.options = {...u.options, tsconfigRaw:{}}; } if (r.oneOf) fix(r.oneOf); if (r.rules) fix(r.rules);} };
const serveUrl = await bundle({publicDir: new URL('./public', import.meta.url).pathname, entryPoint: new URL('./index.tsx', import.meta.url).pathname, webpackOverride: c => { fix(c.module?.rules); return c; }});
const comp = await selectComposition({serveUrl, id:'Main'});
if (mode==='stills') {
  const frames = process.argv.slice(3).map(Number);
  for (const fr of frames) await renderStill({composition:comp, serveUrl, frame:fr, output:`stills/f${fr}.png`, scale:0.4});
  console.log('stills done');
} else {
  await renderMedia({composition:comp, serveUrl, codec:'h264', outputLocation: process.argv[3]==='preview'?'out/preview.mp4':'out/video.mp4', frameRange: process.argv[3]==='preview'?[0,899]:null, crf:18, concurrency:2, onProgress:({progress})=>{ if (Math.round(progress*100)%10===0) console.log(Math.round(progress*100)); }});
  console.log('video done');
}
process.exit(0);
