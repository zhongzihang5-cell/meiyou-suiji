#!/usr/bin/env node
/**
 * Bundle meiyou-suiji prototype into a single shareable HTML file.
 * Usage: node scripts/build-standalone.js
 * Output: meiyou-record-standalone.html (project root)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'meiyou-record-standalone.html');

const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const inlineStyleMatch = indexHtml.match(/<style>([\s\S]*?)<\/style>/);
const inlineStyles = inlineStyleMatch ? inlineStyleMatch[1] : '';

const cssFiles = ['cloud.css', 'timeline.css', 'calendar.css'];
const css = cssFiles
  .map((f) => fs.readFileSync(path.join(ROOT, f), 'utf8'))
  .join('\n\n');

const scriptFiles = [
  'icons.jsx',
  'data.jsx',
  'components.jsx',
  'calendar-page.jsx',
  'timeline-sister-cards.jsx',
  'timeline-modules.jsx',
  'timeline.jsx',
  'cloud-publisher.jsx',
  'tweaks-panel.jsx',
  'app.jsx',
];

const scripts = scriptFiles.map((f) => {
  const content = fs.readFileSync(path.join(ROOT, f), 'utf8');
  return `<!-- ${f} -->\n<script type="text/babel">\n${content}\n</script>`;
});

const builtAt = new Date().toISOString().slice(0, 10);

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>美柚 · 记录 · 场景原型</title>
<!--
  美柚记录 Tab 场景原型 — 单文件版
  生成日期: ${builtAt}
  使用方式: 双击打开，或浏览器拖入此文件即可预览（需联网加载 React/Babel CDN）

  编辑指南:
  · 场景数据 → 搜索 TIMELINE_BLOCKS（约 data.jsx 段）
  · 样式 → 下方 <style> 内搜索 class 名
  · 重新打包多文件版 → 在项目根目录运行: node scripts/build-standalone.js
-->
<style>
${inlineStyles}
${css}
</style>
</head>
<body>

<div id="root"></div>

<script>
const TWEAK_DEFAULTS = {
  "scene": "period",
  "entry": "direct"
};
window.__TWEAK_DEFAULTS = TWEAK_DEFAULTS;
</script>

<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>

${scripts.join('\n\n')}

</body>
</html>
`;

fs.writeFileSync(OUT, html, 'utf8');
const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
console.log(`Wrote ${OUT} (${kb} KB)`);
