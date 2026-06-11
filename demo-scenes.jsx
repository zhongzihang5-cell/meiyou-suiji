// Demo 场景配置 — 控制默认 Tab、页面展示与交互流程
//
// 场景四 note-quick-record：记录心情反馈

const DEMO_SCENES = {
  'note-quick-record': {
    id: 'note-quick-record',
    label: '场景四 · 记录心情反馈',
    description: '首次记录有轴心水滴动画；点右下角 + 选「心情」可体验洞察卡与 AI 反馈',
    defaultTab: 'note',
    identity: 'period',
    getTimeline: ()=>{
      const blocks = JSON.parse(JSON.stringify(window.TIMELINE_BLOCKS));
      blocks.forEach(block=>{
        if(block.type !== 'day') return;
        (block.items || []).forEach(it=>{
          if(it?.kind === 'guide' && it.id === 'g-518-post') it.noAnimate = true;
        });
      });
      // d-5-17 不在初始 timeline 中，演示流程触发时由 app.jsx 动态插入
      return blocks;
    },
    calendar: {
      enabled: true,
      periodFlow: true,
    },
    floatNotice: {
      enabled: true,
    },
    record: {
      showHealthCard: false,
      sisterAnalysis: {
        trigger: 'float-notice',
        initialDone: false,
      },
      todayGuide: true,
      recordFeedback: true,
    },
  },
};

const DEMO_SCENE_OPTIONS = Object.values(DEMO_SCENES).map((s) => ({
  value: s.id,
  label: s.label,
}));

function getDemoScene(id){
  return DEMO_SCENES[id] || DEMO_SCENES['note-quick-record'];
}

function isVoiceTranscribeScene(id){
  const scene = getDemoScene(id);
  return scene.mode === 'voice-transcribe';
}

function getSceneInitialState(id){
  const scene = getDemoScene(id);
  return {
    activeTab: scene.defaultTab,
    timeline: scene.getTimeline(),
    showAnalysisNotice: false,
    sisterPlayAnimation: 0,
    sisterCycleDone: scene.record.sisterAnalysis.initialDone,
    hideTodayGuide: false,
    draft: '',
  };
}

Object.assign(window, {
  DEMO_SCENES,
  DEMO_SCENE_OPTIONS,
  getDemoScene,
  getSceneInitialState,
  isVoiceTranscribeScene,
});

function DemoSceneBar({ value, onChange, description }) {
  const options = window.DEMO_SCENE_OPTIONS;
  if(options.length <= 1) return null;
  return (
    <div className="demo-scene-dock" role="toolbar" aria-label="演示场景切换">
      <div className="demo-scene-dock-label">演示场景</div>
      <div className="demo-scene-dock-options">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={'demo-scene-dock-btn' + (value === opt.value ? ' active' : '')}
            aria-pressed={value === opt.value}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {description && <p className="demo-scene-dock-hint">{description}</p>}
    </div>
  );
}

Object.assign(window, { DemoSceneBar });
