#!/usr/bin/env node
/**
 * Bundle meiyou-suiji prototype into shareable HTML files.
 *
 * Usage: node scripts/build-standalone.js
 *
 * Outputs (project root):
 *   meiyou-scene1-period-calendar.html
 *   meiyou-scene2-record-empty.html  → 场景二 landing 引导
 *   meiyou-scene3-record-blank.html  → 场景三 记录页空置
 *   meiyou-scene4-note-quick-record.html → 场景四 点滴页快捷记录
 *   meiyou-record-standalone.html
 *
 * Outputs (docs/ — for GitHub Pages):
 *   index.html   入口页，链到四个场景
 *   scene1.html  场景一
 *   scene2.html  场景二
 *   scene3.html  场景三（页内可切换方案一/二/三）
 *   scene4.html  场景四
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');

const MEAL_PHOTO_DATA_URI = (() => {
  const mealPath = path.join(ROOT, 'assets', 'meal-519.png');
  if (!fs.existsSync(mealPath)) return null;
  const b64 = fs.readFileSync(mealPath).toString('base64');
  return `data:image/png;base64,${b64}`;
})();

const CURLY_ARROW_DATA_URI = (() => {
  const arrowPath = path.join(ROOT, 'assets', 'curly-arrow-pink.png');
  if (!fs.existsSync(arrowPath)) return null;
  const b64 = fs.readFileSync(arrowPath).toString('base64');
  return `data:image/png;base64,${b64}`;
})();

const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const inlineStyleMatch = indexHtml.match(/<style>([\s\S]*?)<\/style>/);
const inlineStyles = inlineStyleMatch ? inlineStyleMatch[1] : '';

const cssFiles = ['cloud.css', 'timeline.css', 'calendar.css', 'record-empty.css', 'record-blank.css', 'search.css'];
const css = cssFiles
  .map((f) => fs.readFileSync(path.join(ROOT, f), 'utf8'))
  .join('\n\n');

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

const BUILDS = [
  {
    outfile: 'meiyou-scene1-period-calendar.html',
    pagesName: 'scene1.html',
    title: '美柚 · 场景一 · 日历记月经',
    demoScene: 'period-calendar',
    locked: true,
    comment: '场景一：默认日历 Tab，记录「月经来了」→ 浮动分析 → 跳转记录页',
  },
  {
    outfile: 'meiyou-scene2-record-empty.html',
    pagesName: 'scene2.html',
    title: '美柚 · 场景二 · 未记录运营引导',
    demoScene: 'record-direct',
    locked: true,
    comment: '场景二：未记录运营引导 +「记一切」演示动效',
  },
  {
    outfile: 'meiyou-scene3-record-blank.html',
    pagesName: 'scene3.html',
    title: '美柚 · 场景三 · 未记录时间轴',
    demoScene: 'record-blank-1',
    locked: true,
    schemeHub: true,
    comment: '场景三：方案一空白 / 方案二蒙层 / 方案三生长时间轴引导（页内可切换）',
  },
  {
    outfile: 'meiyou-scene4-note-quick-record.html',
    pagesName: 'scene4.html',
    title: '美柚 · 场景四 · 点滴页快捷记录',
    demoScene: 'note-quick-record',
    locked: true,
    comment: '场景四：点滴页 + 静态记录页，无顶部横幅与横幅跳转链路',
  },
  {
    outfile: 'meiyou-record-standalone.html',
    pagesName: null,
    title: '美柚 · 记录 · 场景原型',
    demoScene: 'period-calendar',
    locked: false,
    comment: '三场景合一版（含底部场景切换栏，适合桌面预览）',
  },
];

function buildLandingPage(builtAt) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>美柚 · 记录演示</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{
    font-family:"PingFang SC",-apple-system,sans-serif;
    background:#f2f2f5;color:#323232;
    min-height:100vh;min-height:100dvh;
    padding:32px 20px calc(env(safe-area-inset-bottom, 20px) + 32px);
    display:flex;flex-direction:column;align-items:center;
  }
  .wrap{width:100%;max-width:420px}
  h1{font-size:22px;font-weight:500;margin-bottom:6px}
  .hint{font-size:14px;color:#666;line-height:1.5;margin-bottom:8px}
  .url{
    font-size:12px;color:#8e8e93;line-height:1.45;margin-bottom:24px;
    word-break:break-all;
  }
  .cards{display:flex;flex-direction:column;gap:12px}
  a.card{
    display:block;text-decoration:none;color:inherit;
    background:#fff;border-radius:12px;padding:18px 16px;
    box-shadow:0 2px 10px rgba(50,50,50,0.06);
    border:0.5px solid rgba(0,0,0,0.04);
    -webkit-tap-highlight-color:transparent;
  }
  a.card:active{opacity:0.92;transform:scale(0.99)}
  .card-title{font-size:16px;font-weight:500;margin-bottom:4px}
  .card-desc{font-size:13px;color:#8e8e93;line-height:1.45}
  .go{
    display:inline-block;margin-top:12px;font-size:13px;font-weight:500;
    color:#ff4d88;
  }
  footer{margin-top:28px;font-size:11px;color:#c8c8cc;line-height:1.5}
</style>
</head>
<body>
  <div class="wrap">
    <h1>美柚 · 记录演示</h1>
    <p class="hint">先在这里选场景，再进入演示。建议用 Safari 打开并添加到主屏幕，全屏效果更好。</p>
    <p class="url">入口地址：zhongzihang5-cell.github.io/meiyou-suiji/</p>
    <div class="cards">
      <a class="card" href="./scene1.html">
        <div class="card-title">场景一 · 日历记月经</div>
        <div class="card-desc">默认日历页，记录「月经来了」后弹出分析，点击进入周期分析。</div>
        <span class="go">进入场景一 →</span>
      </a>
      <a class="card" href="./scene2.html">
        <div class="card-title">场景二 · 未记录运营引导</div>
        <div class="card-desc">新用户首次进入记录 Tab，运营 landing 引导 +「记一切」演示动效。</div>
        <span class="go">进入场景二 →</span>
      </a>
      <a class="card" href="./scene3.html">
        <div class="card-title">场景三 · 未记录时间轴</div>
        <div class="card-desc">三套方案：方案一空白、方案二示例蒙层、方案三生长引导。进入后可在页内切换。</div>
        <span class="go">进入场景三 →</span>
      </a>
      <a class="card" href="./scene4.html">
        <div class="card-title">场景四 · 点滴页快捷记录</div>
        <div class="card-desc">基于场景一：保留点滴页与静态记录页，移除顶部横幅及横幅跳转链路。</div>
        <span class="go">进入场景四 →</span>
      </a>
    </div>
    <footer>构建 ${builtAt}<br>微信内若无法加载，点右上角 ··· 用 Safari 打开</footer>
  </div>
</body>
</html>`;
}

function buildRedirectPage(target, label) {
  const safeTarget = target.replace(/"/g, '&quot;');
  const safeLabel = label.replace(/</g, '&lt;');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0;url=${safeTarget}">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>跳转 · ${safeLabel}</title>
<script>location.replace("${target.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}");</script>
</head>
<body style="font-family:PingFang SC,sans-serif;padding:24px;color:#666">
<p>正在跳转到${safeLabel}…</p>
<p><a href="${safeTarget}">若未自动跳转，请点这里</a></p>
</body>
</html>`;
}

function writeLegacyRedirects() {
  const legacyDir = path.join(DOCS, 'docs');
  fs.mkdirSync(legacyDir, { recursive: true });
  const redirects = [
    { file: 'index.html', target: '../', label: '演示入口' },
    { file: 'scene1.html', target: '../scene1.html', label: '场景一' },
    { file: 'scene2.html', target: '../scene2.html', label: '场景二' },
    { file: 'scene3.html', target: '../scene3.html', label: '场景三' },
    { file: 'scene4.html', target: '../scene4.html', label: '场景四' },
  ];
  redirects.forEach(({ file, target, label }) => {
    fs.writeFileSync(path.join(legacyDir, file), buildRedirectPage(target, label), 'utf8');
  });
}

function buildHtml({ title, demoScene, locked, schemeHub, comment, builtAt }) {
  const extraCss = locked ? STANDALONE_DEMO_CSS : '';
  const bodyClass = locked
    ? ` class="standalone-demo${schemeHub ? ' standalone-demo-scheme3' : ''}"`
    : '';
  const buildId = `${builtAt}-nomask`;
  const lockedScript = locked
    ? `window.__BUILD__ = "${buildId}";\nwindow.__STANDALONE_LOCKED_SCENE = true;${schemeHub ? '\nwindow.__SCENE3_SCHEME_HUB = true;' : ''}`
    : `window.__BUILD__ = "${buildId}";\nwindow.__STANDALONE_LOCKED_SCENE = false;`;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
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
<body${bodyClass}>

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

fs.mkdirSync(DOCS, { recursive: true });

BUILDS.forEach((cfg) => {
  const html = buildHtml({ ...cfg, builtAt });
  const outPath = path.join(ROOT, cfg.outfile);
  fs.writeFileSync(outPath, html, 'utf8');
  const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
  console.log(`Wrote ${outPath} (${kb} KB)`);

  if(cfg.pagesName){
    const pagesPath = path.join(DOCS, cfg.pagesName);
    fs.writeFileSync(pagesPath, html, 'utf8');
    console.log(`Wrote ${pagesPath} (${kb} KB)`);
  }
});

const landingPath = path.join(DOCS, 'index.html');
fs.writeFileSync(landingPath, buildLandingPage(builtAt), 'utf8');
console.log(`Wrote ${landingPath}`);

writeLegacyRedirects();
console.log(`Wrote legacy redirects under ${path.join(DOCS, 'docs')}`);
