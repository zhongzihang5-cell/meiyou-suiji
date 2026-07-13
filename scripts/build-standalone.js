#!/usr/bin/env node
/**
 * Bundle meiyou-suiji prototype into shareable HTML files.
 *
 * Usage: node scripts/build-standalone.js
 *
 * Outputs (project root):
 *   meiyou-scene1-period-calendar.html
 *   meiyou-scene2-record-empty.html  → 场景二 landing 引导
 *   meiyou-scene3-scheme1.html  → 场景三 · 方案一
 *   meiyou-scene3-scheme2.html  → 场景三 · 方案二
 *   meiyou-scene3-scheme3.html  → 场景三 · 方案三
 *   meiyou-scene4-note-quick-record.html → 场景四
 *   meiyou-scene5-voice-1.html … voice-4.html → 场景五 · 语音转文字四方案
 *   meiyou-record-standalone.html
 *
 * Outputs (docs/ — for GitHub Pages):
 *   index.html    主应用（note-quick-record，直达演示）
 *   scene1.html   场景一
 *   scene2.html   场景二
 *   scene3-1.html 场景三 · 方案一
 *   scene3-2.html 场景三 · 方案二
 *   scene3-3.html 场景三 · 方案三
 *   scene4.html   场景四
 *   scene5-1.html … scene5-4.html  场景五 · 语音转文字
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

const cssFiles = [
  'cloud.css',
  'timeline.css',
  'calendar.css',
  'record-page.css',
  'record-empty.css',
  'record-blank.css',
  'search.css',
  'voice-transcribe.css',
  'camera-diet.css',
  'diet-feedback.css',
  'path-flyout.css',
  'review-page.css',
  'home-page.css',
];
const css = cssFiles
  .map((f) => fs.readFileSync(path.join(ROOT, f), 'utf8'))
  .join('\n\n');

const scriptFiles = [
  'icons.jsx',
  'data.jsx',
  'components.jsx',
  'calendar-page.jsx',
  'record-page.jsx',
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
  'search-filter.jsx',
  'search-page.jsx',
  'review-page.jsx',
  'home-page.jsx',
  'cloud-publisher.jsx',
  'voice-transcribe-recorder.jsx',
  'voice-transcribe-interludes.jsx',
  'voice-transcribe-async.jsx',
  'voice-transcribe-demo.jsx',
  'IOSFrame.jsx',
  'camera-transition.jsx',
  'diet-feedback-card.jsx',
  'diet-feedback.jsx',
  'path-flyout.jsx',
  'demo-scenes.jsx',
  'tweaks-panel.jsx',
  'app.jsx',
];

const tabbarIconsScript = fs.readFileSync(path.join(ROOT, 'tabbar-icons.js'), 'utf8');

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
    outfile: 'meiyou-scene3-scheme1.html',
    pagesName: 'scene3-1.html',
    title: '美柚 · 场景三 · 方案一 · 空白时间轴',
    demoScene: 'record-blank-1',
    locked: true,
    comment: '场景三方案一：居中极简空态，从记录此刻开始',
  },
  {
    outfile: 'meiyou-scene3-scheme2.html',
    pagesName: 'scene3-2.html',
    title: '美柚 · 场景三 · 方案二 · 示例蒙层',
    demoScene: 'record-blank-2',
    locked: true,
    comment: '场景三方案二：示例时间轴数据预览 + 半透明蒙层引导',
  },
  {
    outfile: 'meiyou-scene3-scheme3.html',
    pagesName: 'scene3-3.html',
    title: '美柚 · 场景三 · 方案三 · 生长引导',
    demoScene: 'record-blank-3',
    locked: true,
    comment: '场景三方案三：生长时间轴空态引导',
  },
  {
    outfile: 'meiyou-scene4-note-quick-record.html',
    pagesName: 'scene4.html',
    alsoWriteIndex: true,
    indexTitle: '美柚 · 记录',
    title: '美柚 · 场景四 · 记录心情反馈',
    demoScene: 'note-quick-record',
    locked: true,
    comment: '记录心情反馈：首次记录水滴动画 + 心情洞察卡',
  },
  {
    outfile: 'meiyou-scene5-voice-1.html',
    pagesName: 'scene5-1.html',
    title: '美柚 · 场景五 · 方案一 · 落入',
    demoScene: 'voice-transcribe-1',
    locked: true,
    comment: '语音转文字方案一：字符直接流入时间轴实时转写卡',
  },
  {
    outfile: 'meiyou-scene5-voice-2.html',
    pagesName: 'scene5-2.html',
    title: '美柚 · 场景五 · 方案二 · 气泡',
    demoScene: 'voice-transcribe-2',
    locked: true,
    comment: '语音转文字方案二：输入条上方对话气泡实时转写',
  },
  {
    outfile: 'meiyou-scene5-voice-3.html',
    pagesName: 'scene5-3.html',
    title: '美柚 · 场景五 · 方案三 · 顶起',
    demoScene: 'voice-transcribe-3',
    locked: true,
    comment: '语音转文字方案三：从输入条向上撑起转写面板',
  },
  {
    outfile: 'meiyou-scene5-voice-4.html',
    pagesName: 'scene5-4.html',
    title: '美柚 · 场景五 · 方案四 · 悬浮',
    demoScene: 'voice-transcribe-4',
    locked: true,
    comment: '语音转文字方案四：无边框悬浮文字 + AI 锚点',
  },
  {
    outfile: 'meiyou-scene5-voice-5.html',
    pagesName: 'scene5-5.html',
    title: '美柚 · 场景五 · 方案五 · 静默',
    demoScene: 'voice-transcribe-5',
    locked: true,
    comment: '异步转写：按住轻脉冲，松手稳定打字机 + 句尾语音条',
  },
  {
    outfile: 'meiyou-scene5-voice-6.html',
    pagesName: 'scene5-6.html',
    title: '美柚 · 场景五 · 方案六 · 声波',
    demoScene: 'voice-transcribe-6',
    locked: true,
    comment: '异步转写：按住波形，松手声波成文 + 句尾语音条',
  },
  {
    outfile: 'meiyou-scene5-voice-7.html',
    pagesName: 'scene5-7.html',
    title: '美柚 · 场景五 · 方案七 · 流光',
    demoScene: 'voice-transcribe-7',
    locked: true,
    comment: '异步转写：按住光球，松手流光逐字 + 句尾语音条',
  },
  {
    outfile: 'meiyou-scene5-voice-8.html',
    pagesName: 'scene5-8.html',
    title: '美柚 · 场景五 · 方案八 · 显影',
    demoScene: 'voice-transcribe-8',
    locked: true,
    comment: '异步转写：按住磨砂波，松手聚焦显影 + 句尾语音条',
  },
  {
    outfile: 'meiyou-scene5-voice-9.html',
    pagesName: 'scene5-9.html',
    title: '美柚 · 场景五 · 方案九 · 底栏转录',
    demoScene: 'voice-transcribe-9',
    locked: true,
    comment: '松手后底栏正在转录，时间轴顶栏语音条收拢为句尾胶囊',
  },
  {
    outfile: 'meiyou-scene5-voice-10.html',
    pagesName: 'scene5-10.html',
    title: '美柚 · 场景五 · 方案十 · 思考流',
    demoScene: 'voice-transcribe-10',
    locked: true,
    comment: '异步转写：按住聆听环，松手流式吐字 + 句尾语音条',
  },
  {
    outfile: 'meiyou-scene6-babylog-1.html',
    pagesName: null,
    title: '美柚 · 场景六 · 宝宝喂养记录 · 方案一',
    demoScene: 'note-quick-record',
    locked: true,
    babyFeedingMode: true,
    comment: '宝宝喂养记录：点滴时间轴与快捷记录面板',
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
    { file: 'scene3.html', target: '../scene3-1.html', label: '场景三 · 方案一' },
    { file: 'scene3-1.html', target: '../scene3-1.html', label: '场景三 · 方案一' },
    { file: 'scene3-2.html', target: '../scene3-2.html', label: '场景三 · 方案二' },
    { file: 'scene3-3.html', target: '../scene3-3.html', label: '场景三 · 方案三' },
    { file: 'scene4.html', target: '../scene4.html', label: '场景四 · 记录心情反馈' },
    { file: 'scene5-1.html', target: '../scene5-1.html', label: '场景五 · 方案一 · 落入' },
    { file: 'scene5-2.html', target: '../scene5-2.html', label: '场景五 · 方案二 · 气泡' },
    { file: 'scene5-3.html', target: '../scene5-3.html', label: '场景五 · 方案三 · 顶起' },
    { file: 'scene5-4.html', target: '../scene5-4.html', label: '场景五 · 方案四 · 悬浮' },
    { file: 'scene5-5.html', target: '../scene5-5.html', label: '场景五 · 方案五 · 静默' },
    { file: 'scene5-6.html', target: '../scene5-6.html', label: '场景五 · 方案六 · 声波成文' },
    { file: 'scene5-7.html', target: '../scene5-7.html', label: '场景五 · 方案七 · 流光' },
    { file: 'scene5-8.html', target: '../scene5-8.html', label: '场景五 · 方案八 · 聚焦显影' },
    { file: 'scene5-9.html', target: '../scene5-9.html', label: '场景五 · 方案九 · 底栏转录' },
    { file: 'scene5-10.html', target: '../scene5-10.html', label: '场景五 · 方案十 · 思考流' },
  ];
  redirects.forEach(({ file, target, label }) => {
    fs.writeFileSync(path.join(legacyDir, file), buildRedirectPage(target, label), 'utf8');
  });
}

function buildHtml({ title, demoScene, locked, babyFeedingMode = false, comment, builtAt }) {
  const extraCss = locked ? STANDALONE_DEMO_CSS : '';
  const bodyClass = locked ? ' class="standalone-demo"' : '';
  const buildId = `${builtAt}-nomask`;
  const lockedScript = locked
    ? `window.__BUILD__ = "${buildId}";\nwindow.__STANDALONE_LOCKED_SCENE = true;`
    : `window.__BUILD__ = "${buildId}";\nwindow.__STANDALONE_LOCKED_SCENE = false;`;
  const babyFeedingScript = babyFeedingMode ? 'window.__BABY_FEEDING_MODE = true;' : '';

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
${babyFeedingScript}
</script>

<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>

<script>
${tabbarIconsScript}
</script>

${scripts.join('\n\n')}

</body>
</html>
`;
}

const builtAt = new Date().toISOString().slice(0, 10);
const buildOnly = process.env.BUILD_ONLY || '';
const selectedBuilds = buildOnly
  ? BUILDS.filter((cfg) => cfg.outfile === buildOnly)
  : BUILDS;

if (buildOnly && !selectedBuilds.length) {
  throw new Error(`Unknown standalone build target: ${buildOnly}`);
}

fs.mkdirSync(DOCS, { recursive: true });

selectedBuilds.forEach((cfg) => {
  const html = buildHtml({ ...cfg, builtAt });
  const outPath = path.join(ROOT, cfg.outfile);
  fs.writeFileSync(outPath, html, 'utf8');
  const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
  console.log(`Wrote ${outPath} (${kb} KB)`);

  if (cfg.pagesName) {
    const pagesPath = path.join(DOCS, cfg.pagesName);
    fs.writeFileSync(pagesPath, html, 'utf8');
    console.log(`Wrote ${pagesPath} (${kb} KB)`);
  }

  if (cfg.alsoWriteIndex) {
    const indexHtml = buildHtml({
      ...cfg,
      title: cfg.indexTitle || cfg.title,
      builtAt,
    });
    const indexPath = path.join(DOCS, 'index.html');
    fs.writeFileSync(indexPath, indexHtml, 'utf8');
    const indexKb = (Buffer.byteLength(indexHtml, 'utf8') / 1024).toFixed(1);
    console.log(`Wrote ${indexPath} (${indexKb} KB)`);
  }
});

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirSync(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

if (!buildOnly) {
  const assetsSrc = path.join(ROOT, 'assets');
  const assetsDest = path.join(DOCS, 'assets');
  if (fs.existsSync(assetsSrc)) {
    copyDirSync(assetsSrc, assetsDest);
    console.log(`Copied assets → ${assetsDest}`);
  }

  fs.writeFileSync(
    path.join(DOCS, 'scene3.html'),
    buildRedirectPage('./scene3-1.html', '场景三 · 方案一'),
    'utf8',
  );
  console.log('Wrote docs/scene3.html (redirect → scene3-1.html)');

  writeLegacyRedirects();
  console.log(`Wrote legacy redirects under ${path.join(DOCS, 'docs')}`);
}
