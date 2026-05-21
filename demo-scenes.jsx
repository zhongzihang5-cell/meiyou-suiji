// Demo 场景配置 — 控制默认 Tab、页面展示与交互流程
//
// 场景一 period-calendar：默认日历 Tab，通过「月经来了」触发浮动分析 → 跳转记录页周期分析
// 场景二 record-direct：未记录 landing 引导（record-empty.jsx）
// 场景三 record-blank：记录 Tab 无数据空置页（record-blank.jsx）

const DEMO_SCENES = {
  'period-calendar': {
    id: 'period-calendar',
    label: '场景一 · 日历记月经',
    description: '默认日历页，记录月经来了后弹出分析通知，点击进入周期分析',
    defaultTab: 'cal',
    identity: 'period',
    getTimeline: () => JSON.parse(JSON.stringify(window.TIMELINE_BLOCKS)),
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
    },
  },

  'record-direct': {
    id: 'record-direct',
    label: '场景二 · 未记录landing引导',
    description: '新用户首次进入记录 Tab，landing 引导 +「记一切」演示动效',
    defaultTab: 'note',
    identity: 'period',
    getTimeline: () => JSON.parse(JSON.stringify(window.getTimelineEmpty(window.SCENE_CONTEXT.period))),
    calendar: {
      enabled: true,
      periodFlow: false,
    },
    floatNotice: {
      enabled: false,
    },
    record: {
      showHealthCard: false,
      emptyState: true,
      sisterAnalysis: {
        trigger: 'none',
        initialDone: true,
      },
      todayGuide: false,
    },
  },

  'record-blank': {
    id: 'record-blank',
    label: '场景三 · 记录页空置',
    description: '记录 Tab 无数据，标准页结构 + 底部输入 Dock（空态见 record-blank.jsx）',
    defaultTab: 'note',
    identity: 'period',
    getTimeline: () => JSON.parse(JSON.stringify(window.getTimelineEmpty(window.SCENE_CONTEXT.period))),
    calendar: {
      enabled: true,
      periodFlow: false,
    },
    floatNotice: {
      enabled: false,
    },
    record: {
      showHealthCard: false,
      blankState: true,
      sisterAnalysis: {
        trigger: 'none',
        initialDone: true,
      },
      todayGuide: false,
    },
  },
};

const DEMO_SCENE_OPTIONS = Object.values(DEMO_SCENES).map((s) => ({
  value: s.id,
  label: s.label,
}));

function getDemoScene(id){
  return DEMO_SCENES[id] || DEMO_SCENES['period-calendar'];
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
});

function DemoSceneBar({ value, onChange, description }) {
  const options = window.DEMO_SCENE_OPTIONS;
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
