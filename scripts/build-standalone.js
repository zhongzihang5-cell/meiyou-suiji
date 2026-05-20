#!/usr/bin/env node
/**
 * Bundle meiyou-suiji prototype into shareable HTML files.
 *
 * Usage: node scripts/build-standalone.js
 *
 * Outputs:
 *   meiyou-scene1-period-calendar.html  — 场景一（日历记月经）
 *   meiyou-scene2-record-empty.html      — 场景二（未记录空值）
 *   meiyou-record-standalone.html         — 双场景合一（含底部切换栏，开发用）
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const inlineStyleMatch = indexHtml.match(/<style>([\s\S]*?)<\/style>/);
const inlineStyles = inlineStyleMatch ? inlineStyleMatch[1] : '';

const cssFiles = ['cloud.css', 'timeline.css', 'calendar.css', 'record-empty.css', 'search.css'];
const css = cssFiles
  .map((f) => fs.readFileSync(path.join(ROOT, f), 'utf8'))
  .join('\n\n');

const scriptFiles = [
  'icons.jsx',
  'data.jsx',
  'components.jsx',
  'calendar-page.jsx',
  'timeline-sister-cards.jsx',
  'mood-picker.jsx',
  'quick-pickers.jsx',
  'timeline-modules.jsx',
  'timeline.jsx',
  'record-empty.jsx',
  'search-page.jsx',
  'cloud-publisher.jsx',
  'demo-scenes.jsx',
  'tweaks-panel.jsx',
  'app.jsx',
];

const scripts = scriptFiles.map((f) => {
  const content = fs.readFileSync(path.join(ROOT, f), 'utf8');
  return `<!-- ${f} -->\n<script type="text/babel">\n${content}\n</script>`;
});

const MOBILE_STANDALONE_CSS = `
/* —— 单场景 HTML · 手机全屏演示 —— */
html,body{background:var(--my-bg);height:100%;overflow:hidden}
#root{min-height:100%;height:100%;align-items:stretch}
.phone{width:100%;max-width:none;min-height:100%;height:100%;box-shadow:none!important}
.demo-scene-dock{display:none!important}
`;

const BUILDS = [
  {
    outfile: 'meiyou-scene1-period-calendar.html',
    title: '美柚 · 场景一 · 日历记月经',
    demoScene: 'period-calendar',
    locked: true,
    comment: '场景一：默认日历 Tab，记录「月经来了」→ 浮动分析 → 跳转记录页',
  },
  {
    outfile: 'meiyou-scene2-record-empty.html',
    title: '美柚 · 场景二 · 未记录空值',
    demoScene: 'record-direct',
    locked: true,
    comment: '场景二：新用户记录 Tab 空值页 +「记一切」演示动效',
  },
  {
    outfile: 'meiyou-record-standalone.html',
    title: '美柚 · 记录 · 场景原型',
    demoScene: 'period-calendar',
    locked: false,
    comment: '双场景合一版（含底部场景切换栏，适合桌面预览）',
  },
];

function buildHtml({ title, demoScene, locked, comment, builtAt }) {
  const extraCss = locked ? MOBILE_STANDALONE_CSS : '';
  const lockedScript = locked
    ? 'window.__STANDALONE_LOCKED_SCENE = true;'
    : 'window.__STANDALONE_LOCKED_SCENE = false;';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<title>${title}</title>
<!--
  ${comment}
  生成日期: ${builtAt}

  手机演示：
  1. 把此 HTML 发到手机（AirDrop / 微信 / iCloud / GitHub Pages）
  2. 用 Safari / Chrome 打开（需联网加载 React CDN）
  3. 可选：Safari「添加到主屏幕」→ 全屏演示

  重新打包 → 项目根目录运行: node scripts/build-standalone.js
-->
<style>
${inlineStyles}
${css}
${extraCss}
</style>
</head>
<body>

<div id="root"></div>

<script>
const TWEAK_DEFAULTS = {
  "demoScene": "${demoScene}"
};
window.__TWEAK_DEFAULTS = TWEAK_DEFAULTS;
${lockedScript}
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

BUILDS.forEach((cfg) => {
  const outPath = path.join(ROOT, cfg.outfile);
  const html = buildHtml({ ...cfg, builtAt });
  fs.writeFileSync(outPath, html, 'utf8');
  const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
  console.log(`Wrote ${outPath} (${kb} KB)`);
});
