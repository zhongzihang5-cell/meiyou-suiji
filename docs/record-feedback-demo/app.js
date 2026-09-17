(() => {
  'use strict';
  const data = window.RECORD_FEEDBACK_DEMO;
  const el = id => document.getElementById(id);
  let moduleIndex = 0;
  let sceneIndex = 0;
  let replayTimer;
  let currentScene;

  function setParagraphs(target, rows, tag = 'p') {
    const nodes = rows.map(text => {
      const node = document.createElement(tag);
      node.textContent = text;
      return node;
    });
    target.replaceChildren(...nodes);
  }

  function renderScene() {
    clearTimeout(replayTimer);
    el('replay').disabled = false;
    el('saving-state').hidden = true;
    el('feedback-zone').hidden = false;
    currentScene = data.modules[moduleIndex].scenes[sceneIndex];
    const s = currentScene;
    el('record-input').textContent = s.record;
    el('record-time').textContent = s.time;
    el('record-time').dateTime = s.time;
    el('record-symbol').textContent = data.modules[moduleIndex].symbol;
    el('receipt').textContent = s.receipt;
    setParagraphs(el('feedback-copy'), s.paragraphs);
    setParagraphs(el('history-copy'), s.detail);
    el('history-detail').hidden = !s.detail.length;
    el('history-detail').open = false;
    el('source').textContent = s.source;
    el('scene-note').textContent = s.note;
    el('candidate-note').hidden = !s.candidate;
    el('copy-status').textContent = '';
    el('scene-select').value = String(sceneIndex);
    document.querySelector('.source-detail').open = false;
  }

  function renderModule(index) {
    moduleIndex = index;
    sceneIndex = 0;
    const m = data.modules[index];
    el('research-title').textContent = m.name;
    el('module-status').textContent = m.status;
    el('module-status').classList.toggle('pending', m.id === 'solids');
    el('conclusion').textContent = m.conclusion;
    el('need').textContent = m.need;
    el('boundary').textContent = m.boundary;
    setParagraphs(el('outputs'), m.outputs, 'li');
    el('scene-picker').hidden = m.scenes.length < 2;
    el('scene-select').replaceChildren(...m.scenes.map((s, i) => {
      const option = document.createElement('option');
      option.value = String(i);
      option.textContent = s.label;
      return option;
    }));
    el('module-tabs').querySelectorAll('button').forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    renderScene();
  }

  data.modules.forEach((m, i) => {
    const button = document.createElement('button');
    button.className = 'module-tab';
    button.type = 'button';
    button.setAttribute('aria-pressed', String(i === 0));
    button.setAttribute('aria-label', m.name);
    const mark = document.createElement('span');
    mark.className = 'tab-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = m.symbol;
    button.append(mark, document.createTextNode(m.name));
    button.addEventListener('click', () => renderModule(i));
    el('module-tabs').append(button);
  });

  el('scene-select').addEventListener('change', event => {
    sceneIndex = Number(event.target.value);
    renderScene();
  });
  el('replay').addEventListener('click', () => {
    el('replay').disabled = true;
    el('copy-status').textContent = '';
    el('feedback-zone').hidden = true;
    el('saving-state').hidden = false;
    replayTimer = setTimeout(() => {
      el('saving-state').hidden = true;
      el('feedback-zone').hidden = false;
      el('history-detail').open = false;
      el('replay').disabled = false;
    }, 550);
  });
  el('copy').addEventListener('click', async () => {
    const copy = [currentScene.receipt, ...currentScene.paragraphs, ...currentScene.detail].join('\n');
    try {
      await navigator.clipboard.writeText(copy);
      el('copy-status').textContent = '已复制完整反馈文案，含展开内容。';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(el('feedback-zone'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      el('copy-status').textContent = '请展开回顾后，选中文字进行复制。';
    }
  });
  setParagraphs(el('common-rules'), data.common, 'li');
  renderModule(0);
})();
