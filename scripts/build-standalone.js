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
 *   index.html    入口页，链到各场景/方案
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

const cssFiles = ['cloud.css', 'timeline.css', 'calendar.css', 'record-empty.css', 'record-blank.css', 'search.css', 'voice-transcribe.css'];
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
  'voice-transcribe-recorder.jsx',
  'voice-transcribe-interludes.jsx',
  'voice-transcribe-async.jsx',
  'voice-transcribe-demo.jsx',
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
  .section-label{
    font-size:13px;color:#8e8e93;font-weight:500;
    margin:4px 0 -4px;padding-left:2px;
  }
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
      <p class="section-label">场景三 · 未记录时间轴</p>
      <a class="card" href="./scene3-1.html">
        <div class="card-title">方案一 · 空白时间轴</div>
        <div class="card-desc">居中极简空态，粉色箭头指向快捷记录入口。</div>
        <span class="go">进入方案一 →</span>
      </a>
      <a class="card" href="./scene3-2.html">
        <div class="card-title">方案二 · 示例蒙层</div>
        <div class="card-desc">两条示例记录 + 半透明蒙层，预览时间轴长什么样。</div>
        <span class="go">进入方案二 →</span>
      </a>
      <a class="card" href="./scene3-3.html">
        <div class="card-title">方案三 · 生长引导</div>
        <div class="card-desc">时间轴生长动画 + 能力卡片，引导用户开始记录。</div>
        <span class="go">进入方案三 →</span>
      </a>
      <a class="card" href="./scene4.html">
        <div class="card-title">场景四 · 记录心情反馈</div>
        <div class="card-desc">首次记录有轴心水滴动画；点右下角 + 选「心情」可体验洞察卡与 AI 反馈。</div>
        <span class="go">进入场景四 →</span>
      </a>
      <p class="section-label">场景五 · 语音转文字</p>
      <a class="card" href="./scene5-1.html">
        <div class="card-title">方案一 · 落入</div>
        <div class="card-desc">按住说话，字符直接流入时间轴底部实时转写卡。</div>
        <span class="go">进入方案一 →</span>
      </a>
      <a class="card" href="./scene5-2.html">
        <div class="card-title">方案二 · 气泡</div>
        <div class="card-desc">输入条上方对话气泡实时转写，松手飞入时间轴。</div>
        <span class="go">进入方案二 →</span>
      </a>
      <a class="card" href="./scene5-3.html">
        <div class="card-title">方案三 · 顶起</div>
        <div class="card-desc">从输入条向上撑起转写面板，松手面板退下、卡片落入。</div>
        <span class="go">进入方案三 →</span>
      </a>
      <a class="card" href="./scene5-4.html">
        <div class="card-title">方案四 · 悬浮</div>
        <div class="card-desc">无边框悬浮文字 + AI 锚点，多层光晕保证可读。</div>
        <span class="go">进入方案四 →</span>
      </a>
      <p class="section-label">场景五 · 异步转写（松手后）</p>
      <a class="card" href="./scene5-5.html">
        <div class="card-title">方案五 · 静默</div>
        <div class="card-desc">按住：轻点脉冲；松手：稳定打字机 + 句尾语音跳动线。</div>
        <span class="go">进入方案五 →</span>
      </a>
      <a class="card" href="./scene5-6.html">
        <div class="card-title">方案六 · 声波成文</div>
        <div class="card-desc">按住：钉钉式波形；松手：逐字落下 + 句尾语音跳动线。</div>
        <span class="go">进入方案六 →</span>
      </a>
      <a class="card" href="./scene5-7.html">
        <div class="card-title">方案七 · 流光</div>
        <div class="card-desc">按住：呼吸光球；松手：流光点亮逐字 + 句尾语音跳动线。</div>
        <span class="go">进入方案七 →</span>
      </a>
      <a class="card" href="./scene5-8.html">
        <div class="card-title">方案八 · 聚焦显影</div>
        <div class="card-desc">按住：磨砂波形扫光；松手：虚影逐字显影 + 句尾语音跳动线。</div>
        <span class="go">进入方案八 →</span>
      </a>
      <a class="card" href="./scene5-9.html">
        <div class="card-title">方案九 · 底栏转录</div>
        <div class="card-desc">松手后底栏显示「正在转录」，时间轴直接打字机；相机保留右下角。</div>
        <span class="go">进入方案九 →</span>
      </a>
      <a class="card" href="./scene5-10.html">
        <div class="card-title">方案十 · 思考流</div>
        <div class="card-desc">按住：聆听声波环；松手：快速流式吐字 + 句尾语音跳动线。</div>
        <span class="go">进入方案十 →</span>
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

function buildHtml({ title, demoScene, locked, comment, builtAt }) {
  const extraCss = locked ? STANDALONE_DEMO_CSS : '';
  const bodyClass = locked ? ' class="standalone-demo"' : '';
  const buildId = `${builtAt}-nomask`;
  const lockedScript = locked
    ? `window.__BUILD__ = "${buildId}";\nwindow.__STANDALONE_LOCKED_SCENE = true;`
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

fs.writeFileSync(
  path.join(DOCS, 'scene3.html'),
  buildRedirectPage('./scene3-1.html', '场景三 · 方案一'),
  'utf8',
);
console.log('Wrote docs/scene3.html (redirect → scene3-1.html)');

writeLegacyRedirects();
console.log(`Wrote legacy redirects under ${path.join(DOCS, 'docs')}`);
