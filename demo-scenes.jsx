// Demo 场景配置 — 控制默认 Tab、页面展示与交互流程
//
// 场景一 period-calendar：默认日历 Tab，通过「月经来了」触发浮动分析 → 跳转记录页周期分析
// 场景二 record-direct：未记录 landing 引导（record-empty.jsx）
// 场景三 record-blank-1/2/3：三套时间轴空态方案（record-blank.jsx）

// 场景三拆为三套方案（record-blank.jsx）
//   方案一 record-blank-1：时间轴空白
//   方案二 record-blank-2：示例数据 + 蒙层
//   方案三 record-blank-3：生长时间轴空态引导

const SCENE3_SCHEME_OPTIONS = [
  { value: 'record-blank-1', label: '方案一' },
  { value: 'record-blank-2', label: '方案二' },
  { value: 'record-blank-3', label: '方案三' },
];

function getBlankScheme2PreviewTimeline(){
  const blocks = window.TIMELINE_BLOCKS;
  const day514 = blocks.find(b => b.type === 'day' && b.id === 'd-5-14');
  const day519 = blocks.find(b => b.type === 'day' && b.id === 'd-5-19');
  const clone = (obj) => JSON.parse(JSON.stringify(obj));
  const pickGroup = (day, groupId) => day?.items?.find(i => i.id === groupId);

  const voiceDietGroup = pickGroup(day519, 'y1-g');
  const weightGroup = pickGroup(day514, 't5-g-514');
  const items = [];

  if(voiceDietGroup){
    items.push(clone(voiceDietGroup));
  }
  if(weightGroup){
    items.push({ ...clone(weightGroup), aiDefaultOpen: true });
  }

  if(!items.length) return [];

  const day = clone(day519);
  day.id = 's2-preview-day';
  day.date = '5/19';
  day.weekday = '周一';
  day.isToday = false;
  day.phaseTag = undefined;
  day.phaseKind = undefined;
  day.cycleDay = undefined;
  day.periodLen = undefined;
  day.summaryStats = undefined;
  day.items = items;

  return [day];
}

const BLANK_SCHEME_BASE = {
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
};

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
    label: '场景二 · 未记录运营引导',
    description: '新用户首次进入记录 Tab，运营 landing 引导 +「记一切」演示动效',
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

  'record-blank-1': {
    ...BLANK_SCHEME_BASE,
    id: 'record-blank-1',
    label: '场景三 · 方案一',
    description: '居中极简空态：生活的点滴都值得被记下',
    record: {
      ...BLANK_SCHEME_BASE.record,
      blankScheme: 1,
    },
  },

  'record-blank-2': {
    ...BLANK_SCHEME_BASE,
    id: 'record-blank-2',
    label: '场景三 · 方案二',
    description: '示例时间轴数据预览，半透明蒙层 + 空态引导',
    record: {
      ...BLANK_SCHEME_BASE.record,
      blankScheme: 2,
    },
  },

  'record-blank-3': {
    ...BLANK_SCHEME_BASE,
    id: 'record-blank-3',
    label: '场景三 · 方案三',
    description: '生长时间轴空态引导 + 首条记录仪式',
    record: {
      ...BLANK_SCHEME_BASE.record,
      blankScheme: 3,
    },
  },

  'note-quick-record': {
    id: 'note-quick-record',
    label: '场景四 · 记录心情反馈',
    description: '首次记录有轴心水滴动画；点右下角 + 选「心情」可体验洞察卡与 AI 反馈',
    defaultTab: 'note',
    identity: 'period',
    getTimeline: () => JSON.parse(JSON.stringify(window.TIMELINE_BLOCKS)),
    calendar: {
      enabled: true,
      periodFlow: false,
    },
    floatNotice: {
      enabled: false,
    },
    record: {
      showHealthCard: false,
      sisterAnalysis: {
        trigger: 'none',
        initialDone: true,
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
  const resolved = id === 'record-blank' ? 'record-blank-1' : id;
  return DEMO_SCENES[resolved] || DEMO_SCENES['period-calendar'];
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
  SCENE3_SCHEME_OPTIONS,
  getDemoScene,
  getSceneInitialState,
  getBlankScheme2PreviewTimeline,
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
