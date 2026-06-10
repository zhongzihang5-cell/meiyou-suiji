// ============ 心情快捷选择 — 输入框上方引导 ============

const MOOD_OPTIONS = [
  { id:'super-happy', label:'超开心', face:'super-happy', bg:'#FFE875' },
  { id:'happy', label:'挺开心', face:'happy', bg:'#FFE875' },
  { id:'normal', label:'一般', face:'normal', bg:'#B8E8FF' },
  { id:'unhappy', label:'不开心', face:'unhappy', bg:'#FFC8DC' },
  { id:'very-sad', label:'好伤心', face:'very-sad', bg:'#FFC8DC' },
  { id:'excited', label:'兴奋', face:'excited', bg:'#FFE875' },
  { id:'surprised', label:'惊喜', face:'surprised', bg:'#FFE875' },
  { id:'satisfied', label:'满足', face:'satisfied', bg:'#FFE875' },
  { id:'heart-flutter', label:'心动', face:'heart-flutter', bg:'#FFE875' },
  { id:'confident', label:'自信', face:'confident', bg:'#FFE875' },
  { id:'relaxed', label:'放松', face:'relaxed', bg:'#FFE875' },
  { id:'calm', label:'平静', face:'calm', bg:'#B8E8FF' },
  { id:'irritable', label:'烦躁', face:'irritable', bg:'#FFC8DC' },
  { id:'temper', label:'易怒', face:'temper', bg:'#FFC8DC' },
  { id:'angry', label:'生气', face:'angry', bg:'#FF9898' },
  { id:'anxious', label:'焦虑', face:'anxious', bg:'#C8E8A8' },
  { id:'overthink', label:'内耗', face:'overthink', bg:'#FFC8DC' },
  { id:'stressed', label:'压力', face:'stressed', bg:'#FFE875' },
  { id:'scared', label:'害怕', face:'scared', bg:'#FFC8DC' },
  { id:'indifferent', label:'冷漠', face:'indifferent', bg:'#B8E8FF' },
];

function MoodFace({face, bg}){
  const common = { className:'mood-face-svg', viewBox:'0 0 48 48', role:'img', 'aria-hidden':true };
  const skin = bg || '#FFE875';
  const eye = '#5A4030';
  const mouth = '#E06B88';

  switch(face){
    case 'super-happy':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <path d="M12 22c0-3 3-5 6-5s6 2 6 5M24 22c0-3 3-5 6-5s6 2 6 5" stroke={eye} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <path d="M14 30c4 6 16 6 20 0" stroke={mouth} strokeWidth="2.4" fill="none" strokeLinecap="round"/>
        </svg>
      );
    case 'happy':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <circle cx="17" cy="22" r="2.2" fill={eye}/><circle cx="31" cy="22" r="2.2" fill={eye}/>
          <path d="M16 30c3 4 13 4 16 0" stroke={mouth} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        </svg>
      );
    case 'normal':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <circle cx="17" cy="22" r="2.2" fill={eye}/><circle cx="31" cy="22" r="2.2" fill={eye}/>
          <path d="M18 31h12" stroke={mouth} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case 'unhappy':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <circle cx="17" cy="22" r="2" fill={eye}/><circle cx="31" cy="22" r="2" fill={eye}/>
          <path d="M17 32c3-3 11-3 14 0" stroke={mouth} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        </svg>
      );
    case 'very-sad':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <circle cx="17" cy="22" r="2" fill={eye}/><circle cx="31" cy="22" r="2" fill={eye}/>
          <path d="M16 33c4-4 12-4 16 0" stroke={mouth} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <path d="M14 18v5M34 18v5" stroke="#6BB8FF" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case 'excited':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <path d="M15 21l2 2 4-4M29 21l2 2 4-4" stroke={eye} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <path d="M14 30c4 5 16 5 20 0" stroke={mouth} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <path d="M30 10l2 4 4 1-4 1-2 4-2-4-4-1 4-1z" fill="#FF8CB0"/>
        </svg>
      );
    case 'surprised':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <circle cx="17" cy="21" r="2.5" fill={eye}/><circle cx="31" cy="21" r="2.5" fill={eye}/>
          <ellipse cx="24" cy="31" rx="4" ry="5" fill={mouth}/>
          <path d="M10 14l3 3M38 14l-3 3" stroke="#FFD700" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      );
    case 'satisfied':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <path d="M15 22c0-2 2-3 4-3s4 1 4 3M25 22c0-2 2-3 4-3s4 1 4 3" stroke={eye} strokeWidth="1.8" fill="none"/>
          <path d="M17 30c2 3 12 3 14 0" stroke={mouth} strokeWidth="2" fill="none" strokeLinecap="round"/>
          <circle cx="36" cy="16" r="3" fill="#FFB8D0"/>
        </svg>
      );
    case 'heart-flutter':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <circle cx="17" cy="22" r="2" fill={eye}/><circle cx="31" cy="22" r="2" fill={eye}/>
          <path d="M16 30c3 3 13 3 16 0" stroke={mouth} strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M10 12l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5zM38 10l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#FF8CB0"/>
        </svg>
      );
    case 'confident':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <rect x="12" y="20" width="24" height="8" rx="4" fill="#3A3A3A"/>
          <path d="M17 32c2 2 12 2 14 0" stroke={mouth} strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
      );
    case 'relaxed':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <path d="M15 22c0-2 2-3 4-3s4 1 4 3M25 22c0-2 2-3 4-3s4 1 4 3" stroke={eye} strokeWidth="1.8" fill="none"/>
          <path d="M17 30c2 3 12 3 14 0" stroke={mouth} strokeWidth="2" fill="none" strokeLinecap="round"/>
          <rect x="32" y="28" width="8" height="10" rx="2" fill="#fff" stroke="#ddd" strokeWidth="0.8"/>
        </svg>
      );
    case 'calm':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <circle cx="17" cy="22" r="2" fill={eye}/><circle cx="31" cy="22" r="2" fill={eye}/>
          <path d="M18 31h12" stroke={mouth} strokeWidth="2" strokeLinecap="round"/>
          <circle cx="36" cy="30" r="5" fill="#FF8CB0" opacity="0.7"/>
        </svg>
      );
    case 'irritable':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <path d="M14 20l4 2M34 20l-4 2" stroke={eye} strokeWidth="2" strokeLinecap="round"/>
          <path d="M17 32c3-2 11-2 14 0" stroke={mouth} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        </svg>
      );
    case 'temper':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <path d="M14 20l4 2M34 20l-4 2" stroke={eye} strokeWidth="2" strokeLinecap="round"/>
          <path d="M16 33c4-3 12-3 16 0" stroke={mouth} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <path d="M18 12l2-3M24 10v-3M30 12l-2-3" stroke="#FF8888" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      );
    case 'angry':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <path d="M13 19l5 3M35 19l-5 3" stroke={eye} strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M15 33c5-4 13-4 18 0" stroke="#D04040" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
          <rect x="34" y="10" width="6" height="6" rx="1" fill="#555"/>
        </svg>
      );
    case 'anxious':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <ellipse cx="17" cy="22" rx="2.5" ry="3" fill={eye}/><ellipse cx="31" cy="22" rx="2.5" ry="3" fill={eye}/>
          <path d="M18 32c2-2 10-2 12 0" stroke={mouth} strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
      );
    case 'overthink':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <ellipse cx="17" cy="21" rx="3" ry="4" fill={eye}/><ellipse cx="31" cy="21" rx="3" ry="4" fill={eye}/>
          <path d="M17 33c3-3 11-3 14 0" stroke={mouth} strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
      );
    case 'stressed':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <circle cx="17" cy="22" r="2" fill={eye}/><circle cx="31" cy="22" r="2" fill={eye}/>
          <path d="M16 32c4-2 12-2 16 0" stroke={mouth} strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M12 16h4M32 16h4" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    case 'scared':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <circle cx="17" cy="21" r="3" fill={eye}/><circle cx="31" cy="21" r="3" fill={eye}/>
          <ellipse cx="24" cy="32" rx="3" ry="4" fill={mouth}/>
          <path d="M10 28c2-4 4-4 6 0M32 28c2-4 4-4 6 0" stroke="#6BB8FF" strokeWidth="1.5" fill="none"/>
        </svg>
      );
    case 'indifferent':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
          <path d="M15 22h6M27 22h6" stroke={eye} strokeWidth="2" strokeLinecap="round"/>
          <path d="M18 31h12" stroke={mouth} strokeWidth="2" strokeLinecap="round"/>
          <rect x="34" y="18" width="6" height="10" rx="1" fill="#8CC8FF"/>
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="22" fill={skin}/>
        </svg>
      );
  }
}

function DockMoodPicker({onConfirm, onCancel}){
  const [selectedIds, setSelectedIds] = React.useState([]);
  const selected = MOOD_OPTIONS.filter(m=>selectedIds.includes(m.id));
  const I = window.Icon;

  const toggleMood = (id)=>{
    setSelectedIds(prev=>(
      prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]
    ));
  };

  return (
    <div className="dock-mood-sheet">
      <div className="dock-mood-top">
        <div className="dock-mood-lead-cell">
          <p className="dock-mood-lead">今天心情怎么样？</p>
        </div>
        <button type="button" className="dock-mood-close" onClick={onCancel} aria-label="关闭">
          <I name="close" size={18} stroke={2}/>
        </button>
      </div>
      <div className="dock-mood-grid">
        {MOOD_OPTIONS.map((m)=>{
          const isSelected = selectedIds.includes(m.id);
          return (
          <button
            key={m.id}
            type="button"
            className={'dock-mood-cell'+(isSelected?' is-selected':'')}
            onClick={()=>toggleMood(m.id)}
            aria-pressed={isSelected}
          >
            <span className="dock-mood-face-wrap">
              <span className="dock-mood-face" style={{'--mood-bg': m.bg}}>
                <MoodFace face={m.face} bg={m.bg}/>
              </span>
              {isSelected && (
                <span className="dock-mood-check" aria-hidden="true">
                  <svg viewBox="0 0 12 12" width="8" height="8">
                    <path d="M2.5 6.2 4.8 8.5 9.5 3.5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
            </span>
            <span className="dock-mood-lbl">{m.label}</span>
          </button>
          );
        })}
      </div>
      <div className="dock-mood-foot">
        <button
          type="button"
          className="dock-mood-submit"
          disabled={selected.length === 0}
          onClick={()=>selected.length > 0 && onConfirm?.(selected)}
        >
          发送
        </button>
      </div>
    </div>
  );
}

function createMoodRecordEntry(moods){
  const list = Array.isArray(moods) ? moods : [moods];
  const primary = list[0];
  const time = window.formatNowTime();
  const score = moodScoreOf(primary);
  return {
    id:'e-'+Date.now(),
    kind:'mood-insight',
    time,
    isNew: true,
    skipExtractLabel: true,
    moods: list,
    primaryMood: primary,
    copy: buildMoodCopy(primary),
    phaseCopy: buildPhaseCopy(primary),
    followUp: buildFollowUp(primary),
    guideText: (()=>{
      const c = buildMoodCopy(primary);
      const f = buildFollowUp(primary);
      return f ? c + '。' + f : c;
    })(),
    chart: {
      title:'近 1 周情绪波动曲线',
      data: buildMoodTrend(primary),
    },
    quickMood: {
      label: primary?.label || '',
      score,
      time,
    },
  };
}

const MOOD_SCORE_MAP = {
  'super-happy':5,'excited':5,'surprised':5,'satisfied':5,'heart-flutter':5,'confident':5,
  'happy':4,'relaxed':4,
  'normal':3,'calm':3,'indifferent':3,
  'unhappy':2,'irritable':2,'temper':2,'anxious':2,'overthink':2,'stressed':2,'scared':2,
  'very-sad':1,'angry':1,
};

const MOOD_WEEK_BASELINE = [
  { d:'周一', v:3 },
  { d:'周二', v:2 },
  { d:'周三', v:3 },
  { d:'周四', v:4 },
  { d:'周五', v:3 },
  { d:'周六', v:4 },
];

function moodScoreOf(mood){
  if(!mood) return 3;
  if(typeof mood.score === 'number') return mood.score;
  return MOOD_SCORE_MAP[mood.id] || MOOD_SCORE_MAP[mood.face] || 3;
}

function buildMoodTrend(currentMood){
  const todayScore = moodScoreOf(currentMood);
  return [
    ...MOOD_WEEK_BASELINE,
    { d:'今天', v: todayScore, isToday:true },
  ];
}

function buildMoodCopy(mood){
  const id = mood?.id || '';
  if(id === 'very-sad' || id === 'angry') return '这一刻的难过是真实的，允许自己情绪低落';
  if(id === 'unhappy' || MOOD_SCORE_MAP[id] === 2) return '不开心也是今天的一部分，不用急着赶走它';
  if(id === 'super-happy' || id === 'excited' || id === 'heart-flutter') return '这份雀跃挺珍贵，慢慢享受它';
  if(MOOD_SCORE_MAP[id] >= 4) return '今天的好心情值得被记下来';
  return '平平淡淡也是一种状态，不必勉强自己振作';
}

function buildFollowUp(mood){
  const id = mood?.id || '';
  const label = mood?.label || '';
  const triggered = (
    id === 'very-sad' || id === 'angry' ||
    id === 'unhappy' || MOOD_SCORE_MAP[id] === 2 ||
    id === 'happy' || id === 'relaxed' ||
    id === 'super-happy' || id === 'excited' || id === 'heart-flutter' || id === 'confident'
  );
  if(!triggered || !label) return '';
  return `是因为什么事${label}呢？可以通过语音告诉我，我帮你记录下来。`;
}

function buildPhaseCopy(mood){
  const id = mood?.id || '';
  const score = MOOD_SCORE_MAP[id] || 3;
  if(id === 'very-sad' || id === 'angry') return '卵泡期雌激素正在回升，身体会帮你慢慢恢复力气';
  if(score <= 2) return '卵泡期通常情绪相对平稳，如果今天格外低落，可能和睡眠、压力更相关';
  if(score === 3) return '卵泡期身体处于修复阶段，"还行"其实是不错的信号';
  if(id === 'super-happy' || id === 'excited' || id === 'heart-flutter') return '卵泡期是一个周期里精力和情绪的高点，适合做点想做很久的事';
  if(score >= 4) return '卵泡期雌激素上升，大脑对愉悦的感受会更敏锐一些';
  return '卵泡期身体处于修复阶段，"还行"其实是不错的信号';
}

function timeStrToMinutes(s){
  if(!s) return 0;
  const parts = String(s).split(':');
  return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
}

function buildTodayMoodPoints(history, currentMood){
  const list = (history || []).map(h => ({
    t: timeStrToMinutes(h.time),
    v: h.score,
    label: h.label,
  }));
  const time = window.formatNowTime();
  list.push({
    t: timeStrToMinutes(time),
    v: moodScoreOf(currentMood),
    label: currentMood?.label || '',
    isLast: true,
  });
  list.sort((a, b) => a.t - b.t);
  return { points: list, time };
}

function createMoodQuickEntry(moods, history){
  const list = Array.isArray(moods) ? moods : [moods];
  const primary = list[0];
  const label = primary?.label || '愉快';
  const { time } = buildTodayMoodPoints(history, primary);
  const score = moodScoreOf(primary);
  const stamp = Date.now();

  return {
    kind:'record-group',
    id:'e-mood-quick-'+stamp,
    isNew: true,
    skipExtractLabel: true,
    isQuickMood: true,
    primary:{
      id:'e-mood-quick-p-'+stamp,
      kind:'mood-face',
      time,
      text: label,
      primaryMood: primary,
    },
    quickMood: {
      label,
      score,
      time,
    },
  };
}

function createMoodRecordEntryLegacy(moods){
  const list = Array.isArray(moods) ? moods : [moods];
  return {
    id:'e-'+Date.now(),
    kind:'rec',
    time: window.formatNowTime(),
    body:'',
    tags:list.map(m=>({ label:'心情 '+m.label, cat:'mood', emoji:'💛' })),
    tagLayout:'rows',
    skipExtractLabel: true,
    isNew: true,
  };
}

Object.assign(window, {
  MOOD_OPTIONS,
  MoodFace,
  DockMoodPicker,
  createMoodRecordEntry,
  createMoodRecordEntryLegacy,
  createMoodQuickEntry,
  moodScoreOf,
  buildMoodTrend,
  buildMoodCopy,
  buildPhaseCopy,
  buildTodayMoodPoints,
  timeStrToMinutes,
});
