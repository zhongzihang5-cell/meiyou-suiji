#!/usr/bin/env node
/**
 * 打包单页 HTML demo（锁定场景一 · period-calendar）
 * Usage: node scripts/build-standalone.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');

const MEAL_PHOTO_DATA_URI = (() => {
  const mealPath = path.join(ROOT, 'assets', 'meal-519.png');
  if (!fs.existsSync(mealPath)) return null;
  return `data:image/png;base64,${fs.readFileSync(mealPath).toString('base64')}`;
})();

const CURLY_ARROW_DATA_URI = (() => {
  const arrowPath = path.join(ROOT, 'assets', 'curly-arrow-pink.png');
  if (!fs.existsSync(arrowPath)) return null;
  return `data:image/png;base64,${fs.readFileSync(arrowPath).toString('base64')}`;
})();

const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const inlineStyleMatch = indexHtml.match(/<style>([\s\S]*?)<\/style>/);
const inlineStyles = inlineStyleMatch ? inlineStyleMatch[1] : '';

const cssFiles = [
  'cloud.css',
  'timeline.css',
  'calendar.css',
  'record-empty.css',
  'record-blank.css',
  'search.css',
];
const css = cssFiles.map((f) => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n\n');

const scriptFiles = [
  'icons.jsx',
  'data.jsx',
  'components.jsx',
  'calendar-page.jsx',
  'timeline-sister-cards.jsx',
  'timeline-v3v2-cards.jsx',
  'mood-picker.jsx',
  'quick-pickers.jsx',
  'timeline-modules.jsx',
  'timeline.jsx',
  'record-empty.jsx',
  'record-blank.jsx',
  'record-blank-scheme3.jsx',
  'record-blank-scheme1-ceremony.jsx',
  'search-page.jsx',
  'cloud-publisher.jsx',
  'demo-scenes.jsx',
  'tweaks-panel.jsx',
  'app.jsx',
];

const scripts = scriptFiles.map((f) => {
  let content = fs.readFileSync(path.join(ROOT, f), 'utf8');
  if (f === 'data.jsx' && MEAL_PHOTO_DATA_URI) {
    content = content.replace(/assets\/meal-519\.png/g, MEAL_PHOTO_DATA_URI);
  }
  if (f === 'app.jsx' && CURLY_ARROW_DATA_URI) {
    content = content.replace(/assets\/curly-arrow-pink\.png/g, CURLY_ARROW_DATA_URI);
  }
  return `<!-- ${f} -->\n<script type="text/babel">\n${content}\n</script>`;
});

const STANDALONE_DEMO_CSS = fs.readFileSync(path.join(ROOT, 'standalone-demo.css'), 'utf8');

const BUILD = {
  outfile: 'demo.html',
  pagesName: 'index.html',
  title: '【AI点滴记录】饮食快捷记录 · Demo',
  demoScene: 'period-calendar',
  comment: '基线：复制自美柚记录原型场景一（日历记月经），用于饮食快捷记录需求迭代',
};

function buildHtml({ title, demoScene, comment, builtAt }) {
  const buildId = `${builtAt}-diet-demo`;
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>${title}</title>
<!--
  ${comment}
  生成日期: ${builtAt}
  重新打包: node scripts/build-standalone.js
-->
<style>
${inlineStyles}
${css}
${STANDALONE_DEMO_CSS}
</style>
</head>
<body class="standalone-demo">

<div id="root"></div>

<script>
window.__TWEAK_DEFAULTS = { "demoScene": "${demoScene}" };
window.__BUILD__ = "${buildId}";
window.__STANDALONE_LOCKED_SCENE = true;
</script>

<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>

${scripts.join('\n\n')}

</body>
</html>
`;
}

const builtAt = new Date().toISOString().slice(0, 10);
const html = buildHtml({ ...BUILD, builtAt });

fs.mkdirSync(DOCS, { recursive: true });
fs.writeFileSync(path.join(ROOT, BUILD.outfile), html, 'utf8');
fs.writeFileSync(path.join(DOCS, BUILD.pagesName), html, 'utf8');

const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
console.log(`Wrote ${path.join(ROOT, BUILD.outfile)} (${kb} KB)`);
console.log(`Wrote ${path.join(DOCS, BUILD.pagesName)} (${kb} KB)`);
