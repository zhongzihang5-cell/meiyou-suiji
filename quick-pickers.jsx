// ============ 快捷发布 · 症状 / 体重（底部展开） ============

const SYMPTOM_SECTIONS = [
  {
    title:'身体症状',
    items:[
      { id:'none', label:'没症状', emoji:'👍', bg:'#ffe8f0' },
      { id:'breast', label:'乳胀', emoji:'💗', bg:'#ffe8f0' },
      { id:'discharge', label:'白带', emoji:'💧', bg:'#ffe8f0' },
      { id:'headache', label:'头痛', emoji:'🤕', bg:'#ffe8f0' },
      { id:'fever', label:'身体发热', emoji:'🌡️', bg:'#ffe8f0' },
      { id:'weak', label:'浑身无力', emoji:'😮‍💨', bg:'#ffe8f0' },
      { id:'cold', label:'身体冷', emoji:'🥶', bg:'#ffe8f0' },
      { id:'tired', label:'疲惫', emoji:'😩', bg:'#ffe8f0' },
      { id:'urine', label:'尿频', emoji:'🚽', bg:'#ffe8f0' },
      { id:'constipation', label:'便秘', emoji:'😣', bg:'#ffe8f0' },
      { id:'back', label:'腰酸', emoji:'🦴', bg:'#ffe8f0' },
      { id:'dizzy', label:'眩晕', emoji:'😵', bg:'#ffe8f0' },
    ],
  },
  {
    title:'阴道分泌物',
    items:[
      { id:'dry', label:'干燥', emoji:'🏜️', bg:'#ffe8f0' },
      { id:'sticky', label:'粘稠', emoji:'🍯', bg:'#ffe8f0' },
      { id:'creamy', label:'乳液状', emoji:'🥛', bg:'#ffe8f0' },
      { id:'eggwhite', label:'蛋清状', emoji:'🥚', bg:'#ffe8f0' },
    ],
  },
];

const SYMPTOM_OPTIONS = SYMPTOM_SECTIONS.flatMap(s=>s.items);

const WEIGHT_BASELINE_KG = 52.3;

function toWeightKg(value, unit){
  return unit === 'jin' ? value / 2 : value;
}

function formatWeightDelta(currentKg, baselineKg = WEIGHT_BASELINE_KG){
  const delta = +(currentKg - baselineKg).toFixed(1);
  if(delta === 0) return '与上次持平';
  const arrow = delta < 0 ? '↓' : '↑';
  return `比上次 ${arrow} ${Math.abs(delta).toFixed(1)}kg`;
}

function DockSheetFoot({disabled, onSubmit, label}){
  return (
    <div className="dock-sheet-foot">
      <button
        type="button"
        className="dock-sheet-submit"
        disabled={disabled}
        onClick={onSubmit}
      >
        {label || '发送'}
      </button>
    </div>
  );
}

function DockSheetClose({onCancel}){
  const I = window.Icon;
  return (
    <button type="button" className="dock-sheet-close" onClick={onCancel} aria-label="关闭">
      <I name="close" size={18} stroke={2}/>
    </button>
  );
}

function SymptomCheck(){
  return (
    <span className="dock-picker-check" aria-hidden="true">
      <svg viewBox="0 0 12 12" width="8" height="8">
        <path d="M2.5 6.2 4.8 8.5 9.5 3.5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

function DockSymptomPicker({onConfirm, onCancel}){
  const [selectedIds, setSelectedIds] = React.useState([]);
  const selected = SYMPTOM_OPTIONS.filter(s=>selectedIds.includes(s.id));

  const toggle = (id)=>{
    setSelectedIds(prev=>(
      prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]
    ));
  };

  return (
    <div className="dock-sheet dock-symptom-sheet">
      <div className="dock-sheet-hd">
        <h2 className="dock-sheet-title">症状</h2>
        <DockSheetClose onCancel={onCancel}/>
      </div>
      <div className="dock-symptom-scroll">
        {SYMPTOM_SECTIONS.map((section)=>(
          <div key={section.title} className="dock-symptom-group">
            <h3 className="dock-symptom-group-title">{section.title}</h3>
            <div className="dock-symptom-grid">
              {section.items.map((item)=>{
                const isSelected = selectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={'dock-symptom-cell'+(isSelected?' is-selected':'')}
                    onClick={()=>toggle(item.id)}
                    aria-pressed={isSelected}
                  >
                    <span className="dock-symptom-ico-wrap">
                      <span className="dock-symptom-ico" style={{'--sym-bg': item.bg}}>
                        {item.emoji}
                      </span>
                      {isSelected && <SymptomCheck/>}
                    </span>
                    <span className="dock-symptom-lbl">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <DockSheetFoot
        disabled={selected.length === 0}
        onSubmit={()=>selected.length > 0 && onConfirm?.(selected)}
      />
    </div>
  );
}

function useWeightInput(){
  const [value, setValue] = React.useState('');
  const [unit, setUnit] = React.useState('kg');

  const pressKey = (key)=>{
    if(key === '⌫'){
      setValue(v=>v.slice(0, -1));
      return;
    }
    if(key === '.'){
      if(value.includes('.')) return;
      setValue(v=>(v || '0') + '.');
      return;
    }
    setValue(v=>{
      if(!v || v === '0') return key;
      if(v.includes('.') && v.split('.')[1]?.length >= 2) return v;
      if(!v.includes('.') && v.length >= 3) return v;
      return v + key;
    });
  };

  const selectUnit = (next)=>{
    if(next === unit) return;
    const n = parseFloat(value);
    if(Number.isFinite(n) && n > 0){
      const converted = next === 'jin' ? (n * 2) : (n / 2);
      setValue(String(+converted.toFixed(2)));
    }
    setUnit(next);
  };

  const num = parseFloat(value);
  const canSubmit = Number.isFinite(num) && num > 0;
  const display = value || '0';

  return {
    value, unit, pressKey, selectUnit, num, canSubmit, display,
    unitLabel: unit === 'kg' ? '公斤' : '斤',
    toggleUnitLabel: unit === 'kg' ? '切换为斤' : '切换为公斤',
    isPlaceholder: !value || display === '0',
    toggleUnit: ()=>selectUnit(unit === 'kg' ? 'jin' : 'kg'),
  };
}

function WeightKeypadConfirmIcon(){
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5 9.5 17 19 7"/>
    </svg>
  );
}

function QuickWeightPicker({ onSubmit }){
  const w = useWeightInput();

  const submit = ()=>{
    if(!w.canSubmit) return;
    onSubmit?.({ value: w.num, unit: w.unit });
  };

  return (
    <div className="quick-weight-panel">
      <div className="quick-weight-panel-top">
        <div className="quick-weight-panel-display">
          <span className={'quick-weight-panel-num'+(w.isPlaceholder ? ' is-placeholder' : '')}>{w.display}</span>
          <span className="quick-weight-panel-unit">{w.unitLabel}</span>
          <button type="button" className="quick-weight-unit-toggle" onClick={w.toggleUnit}>
            {w.toggleUnitLabel}
          </button>
        </div>
      </div>
      <div className="quick-weight-panel-grid">
        {['1','2','3','4','5','6','7','8','9'].map((key)=>(
          <button
            key={key}
            type="button"
            className="quick-weight-panel-key"
            data-key={key}
            onClick={()=>w.pressKey(key)}
          >
            {key}
          </button>
        ))}
        <button type="button" className="quick-weight-panel-key" data-key="dot" onClick={()=>w.pressKey('.')}>.</button>
        <button type="button" className="quick-weight-panel-key" data-key="0" onClick={()=>w.pressKey('0')}>0</button>
        <button
          type="button"
          className="quick-weight-panel-key is-delete"
          data-key="delete"
          onClick={()=>w.pressKey('⌫')}
          aria-label="删除"
        >
          ×
        </button>
        <button
          type="button"
          className="quick-weight-panel-key is-confirm"
          disabled={!w.canSubmit}
          onClick={submit}
          aria-label="记录"
        >
          <WeightKeypadConfirmIcon/>
        </button>
      </div>
    </div>
  );
}

/** @deprecated 扇形内联已用 QuickWeightPicker，保留兼容旧 dock 引用 */
function DockWeightPicker({onConfirm}){
  return <QuickWeightPicker onSubmit={onConfirm}/>;
}

function createSymptomRecordEntry(symptoms){
  const list = Array.isArray(symptoms) ? symptoms : [symptoms];
  return {
    id:'e-'+Date.now(),
    kind:'rec',
    time: window.formatNowTime(),
    body:'',
    tags:list.map(s=>({ label:s.label, cat:'symptom', emoji:s.emoji || '🤒' })),
    tagLayout:'t5',
    isNew: true,
  };
}

function formatWeightValueText(value, unit){
  const text = String(value);
  return unit === 'jin' ? `${text}斤` : `${text}公斤`;
}

function buildWeightAnalysisNote(value, unit){
  const todayKg = toWeightKg(value, unit);
  const yesterdayKg = todayKg + 0.5;
  const tailBase = '属正常波动，黄体期受孕激素影响身体容易潴留水分。';

  if(unit === 'jin'){
    const deltaJin = +(value - yesterdayKg * 2).toFixed(1);
    if(Math.abs(deltaJin) < 0.05){
      return {
        prefix: '比昨天持平，变化',
        delta: '',
        emphasize: false,
        tail: `${tailBase}`,
      };
    }
    const sign = deltaJin > 0 ? '+' : '-';
    const trend = deltaJin > 0 ? '上升' : '下降';
    return {
      prefix: '比昨天 ',
      delta: `${sign}${Math.abs(deltaJin).toFixed(1)} 斤`,
      emphasize: deltaJin < 0,
      tail: `，${trend}${tailBase}`,
    };
  }

  const deltaKg = +(todayKg - yesterdayKg).toFixed(1);
  if(Math.abs(deltaKg) < 0.05){
    return {
      prefix: '比昨天持平，变化',
      delta: '',
      emphasize: false,
      tail: tailBase,
    };
  }
  const sign = deltaKg > 0 ? '+' : '-';
  const trend = deltaKg > 0 ? '上升' : '下降';
  return {
    prefix: '比昨天 ',
    delta: `${sign}${Math.abs(deltaKg).toFixed(1)} 公斤`,
    emphasize: deltaKg < 0,
    tail: `，${trend}${tailBase}`,
  };
}

function buildWeightWeekChartData(todayKg, unit){
  const days = ['周六','周日','周一','周二','周三','周四','今天'];
  const offsets = [0.5, -0.3, -0.1, 0.2, 1.1, 0.5, 0];
  return days.map((d, i) => {
    let v = todayKg + offsets[i];
    if(unit === 'jin') v = v * 2;
    return {
      d,
      v: +v.toFixed(1),
      isToday: i === days.length - 1,
    };
  });
}

function parseWeightFromText(text){
  const raw = String(text || '').trim();
  if(!raw) return null;

  const labeled = raw.match(/体重\s*[:：]?\s*(\d+(?:\.\d+)?)\s*(kg|kgs|公斤|千克|斤)?/i);
  if(labeled){
    const value = parseFloat(labeled[1]);
    if(!Number.isFinite(value) || value <= 0) return null;
    const unitToken = (labeled[2] || '').toLowerCase();
    const unit = unitToken === '斤' ? 'jin' : 'kg';
    return { value, unit, text: raw };
  }

  const bare = raw.match(/(\d+(?:\.\d+)?)\s*(kg|kgs|公斤|千克|斤)\b/i);
  if(bare){
    const value = parseFloat(bare[1]);
    if(!Number.isFinite(value) || value <= 0) return null;
    const unitToken = bare[2].toLowerCase();
    const unit = unitToken === '斤' ? 'jin' : 'kg';
    return { value, unit, text: raw };
  }

  return null;
}

function buildWeightAiBlock(value, unit){
  const todayKg = toWeightKg(value, unit);
  const gid = 'e-'+Date.now();
  const time = window.formatNowTime();
  return {
    id:gid+'-ai',
    time,
    kind:'chart',
    chartType:'weightTrend',
    title:'近7日体重趋势',
    chartData: buildWeightWeekChartData(todayKg, unit),
    weightUnit: unit,
    noteParts: buildWeightAnalysisNote(value, unit),
  };
}

function createWeightRecordEntry({value, unit}){
  const gid = 'e-'+Date.now();
  const time = window.formatNowTime();
  return {
    kind:'record-group',
    id:gid+'-g',
    isNew: true,
    weightSource:'quick',
    primary:{
      id:gid,
      time,
      kind:'weight',
      text:'',
      weightLabel:'体重',
      weightValue:formatWeightValueText(value, unit),
      weightUnit:unit,
      tags:[],
    },
    ai: buildWeightAiBlock(value, unit),
    aiDefaultOpen:true,
  };
}

function createWeightRecordEntryFromText(text, opts = {}){
  const parsed = parseWeightFromText(text);
  if(!parsed) return null;
  const gid = 'e-'+Date.now();
  const time = window.formatNowTime();
  const valText = formatWeightValueText(parsed.value, parsed.unit);
  return {
    kind:'record-group',
    id:gid+'-g',
    isNew: true,
    weightSource:'text',
    primary:{
      id:gid,
      time,
      kind:'weight-text',
      text: parsed.text,
      weightLabel:'体重',
      weightValue: valText,
      weightUnit: parsed.unit,
      tags:[{ cat:'体重', val: valText, icon:'weight' }],
      voice: opts.voice || null,
    },
    ai: buildWeightAiBlock(parsed.value, parsed.unit),
    aiDefaultOpen:true,
  };
}

function tryCreateWeightTextEntry(text, opts = {}){
  return createWeightRecordEntryFromText(text, opts);
}

/* ============ 卡片扇 · 紧凑选择器（方案 I） ============ */

const QUICK_SYMPTOM_TAGS = [
  { id:'headache', label:'头痛', emoji:'🤕' },
  { id:'bloat', label:'腹胀', emoji:'😣' },
  { id:'cramp', label:'痛经', emoji:'😖' },
  { id:'nausea', label:'恶心', emoji:'🤢' },
  { id:'tired', label:'疲惫', emoji:'😩' },
  { id:'back', label:'腰酸', emoji:'🦴' },
  { id:'breast', label:'乳房胀', emoji:'💗' },
  { id:'insomnia', label:'失眠', emoji:'😴' },
];

const QUICK_MOOD_LEVELS = [
  { id:'very-sad', label:'好伤心', face:'very-sad', bg:'#FFC8DC' },
  { id:'unhappy', label:'不开心', face:'unhappy', bg:'#FFC8DC' },
  { id:'normal', label:'一般', face:'normal', bg:'#B8E8FF' },
  { id:'happy', label:'挺开心', face:'happy', bg:'#FFE875' },
  { id:'super-happy', label:'超开心', face:'super-happy', bg:'#FFE875' },
];

const MOOD_QUICK_OPTIONS = [
  { id:'super-happy', icon:'assets/mood-super-happy.png', label:'超开心', color:'#2fb344', mood: QUICK_MOOD_LEVELS[4] },
  { id:'happy', icon:'assets/mood-happy.png', label:'挺开心', color:'#7cc34a', mood: QUICK_MOOD_LEVELS[3] },
  { id:'normal', icon:'assets/mood-normal.png', label:'一般', color:'#f2b705', mood: QUICK_MOOD_LEVELS[2] },
  { id:'unhappy', icon:'assets/mood-unhappy.png', label:'不开心', color:'#f08a3c', mood: QUICK_MOOD_LEVELS[1] },
  { id:'very-sad', icon:'assets/mood-very-sad.png', label:'好伤心', color:'#5b8def', mood: QUICK_MOOD_LEVELS[0] },
];

function QuickMoodFace({ level, color, size = 28 }) {
  const sw = 1.6;
  const mouths = {
    1:'M9 16.2c1-1.6 5-1.6 6 0',
    2:'M9.2 15.6c1-0.7 4.8-0.7 5.8 0',
    3:'M9 15h6',
    4:'M9.2 14.4c1 0.8 4.8 0.8 5.8 0',
    5:'M9 14c1 1.6 5 1.6 6 0',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={sw}/>
      <circle cx="9" cy="10.2" r="1.1" fill={color}/>
      <circle cx="15" cy="10.2" r="1.1" fill={color}/>
      <path d={mouths[level]} stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none"/>
    </svg>
  );
}

const QUICK_CARD_ICONS = {
  mood: 'assets/quick-icon-mood.png',
  symptom: 'assets/quick-icon-symptom.png',
  weight: 'assets/quick-icon-weight.png',
  diet: 'assets/quick-icon-diet.png',
};

function QuickCardIcon({ kind, size = 28 }) {
  const src = QUICK_CARD_ICONS[kind];
  if(!src) return null;
  return (
    <img
      className="quick-card-fan-img"
      src={src}
      alt=""
      width={size}
      height={size}
      draggable={false}
    />
  );
}

function QuickMoodPicker({ onSubmit }) {
  const [level, setLevel] = React.useState(null);
  const timerRef = React.useRef(null);
  const onSubmitRef = React.useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  React.useEffect(()=>()=>{
    if(timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  const pickLevel = (l)=>{
    if(timerRef.current) window.clearTimeout(timerRef.current);
    setLevel(l);
    timerRef.current = window.setTimeout(()=>{
      timerRef.current = null;
      const mood = QUICK_MOOD_LEVELS[l - 1];
      onSubmitRef.current?.([mood]);
    }, 320);
  };

  return (
    <div className="quick-card-picker quick-card-picker--mood">
      {[1, 2, 3, 4, 5].map(l=>(
        <button
          key={l}
          type="button"
          className={'quick-card-mood-btn'+(level === l ? ' is-selected' : '')}
          onClick={()=>pickLevel(l)}
          aria-label={QUICK_MOOD_LEVELS[l - 1].label}
        >
          <QuickMoodFace level={l} color={level === l ? 'var(--my-brand-red)' : 'var(--my-text-primary)'} size={30}/>
        </button>
      ))}
    </div>
  );
}

function MoodQuickOverlay({ open, onSubmit, onClose }) {
  const [choosing, setChoosing] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [toastText, setToastText] = React.useState('');
  const [toastShow, setToastShow] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const busyRef = React.useRef(false);

  React.useEffect(()=>{
    if(!open){
      setChoosing(false);
      setSelected(null);
      setToastShow(false);
      busyRef.current = false;
      setReady(false);
      return;
    }
    const tm = window.setTimeout(()=>setReady(true), 150);
    return ()=>window.clearTimeout(tm);
  }, [open]);

  const pick = (opt)=>{
    if(busyRef.current) return;
    busyRef.current = true;
    setChoosing(true);
    setSelected(opt.id);
    setToastText('心情已记录 · ' + opt.label);
    setToastShow(true);
    window.setTimeout(()=>{
      onSubmit?.([opt.mood]);
      setToastShow(false);
    }, 600);
  };

  return (
    <>
      <div
        className={'mood-quick'+(open ? ' show' : '')+(choosing ? ' choosing' : '')}
        aria-hidden={!open}
      >
        <div className="mood-quick-card" style={{pointerEvents: ready ? 'auto' : 'none'}}>
          {MOOD_QUICK_OPTIONS.map((opt, i)=>(
            <button
              key={opt.id}
              type="button"
              className={'mood-quick-opt'+(selected === opt.id ? ' sel' : '')}
              style={{'--mc': opt.color, '--d': (i * 0.035).toFixed(3) + 's'}}
              onClick={()=>pick(opt)}
            >
              <span className="mood-quick-icon">
                <img src={opt.icon} alt="" draggable={false}/>
              </span>
              <span className="mood-quick-lbl">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={'mood-quick-toast'+(toastShow ? ' show' : '')}>{toastText}</div>
    </>
  );
}

function QuickSymptomPicker({ onSubmit }) {
  const [sel, setSel] = React.useState([]);
  const toggle = (id)=> setSel(s=> s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
  const picked = QUICK_SYMPTOM_TAGS.filter(t=>sel.includes(t.id));

  return (
    <div className="quick-card-picker quick-card-picker--symptom">
      <div className="quick-card-sym-tags">
        {QUICK_SYMPTOM_TAGS.map(t=>{
          const on = sel.includes(t.id);
          return (
            <button
              key={t.id}
              type="button"
              className={'quick-card-sym-tag'+(on ? ' is-selected' : '')}
              onClick={()=>toggle(t.id)}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="quick-card-submit"
        disabled={picked.length === 0}
        onClick={()=>picked.length > 0 && onSubmit?.(picked)}
      >
        {picked.length ? `记录 ${picked.length} 项` : '选择后记录'}
      </button>
    </div>
  );
}

const QUICK_FOOD_OPTIONS = [
  { id:'breakfast', label:'早餐' },
  { id:'lunch', label:'午餐' },
  { id:'dinner', label:'晚餐' },
  { id:'snack', label:'加餐' },
  { id:'fruit', label:'水果' },
  { id:'coffee', label:'咖啡/茶' },
  { id:'water', label:'补水' },
  { id:'dessert', label:'甜食' },
];

function QuickFoodPicker({ onSubmit }) {
  const [sel, setSel] = React.useState([]);
  const toggle = (id)=> setSel(s=> {
    if(s.includes(id)) return s.filter(x=>x!==id);
    if(s.length >= 3) return [...s.slice(1), id];
    return [...s, id];
  });
  const picked = QUICK_FOOD_OPTIONS.filter(t=>sel.includes(t.id));

  return (
    <div className="quick-card-picker quick-card-picker--food">
      <div className="quick-card-food-tags">
        {QUICK_FOOD_OPTIONS.map(t=>{
          const on = sel.includes(t.id);
          return (
            <button
              key={t.id}
              type="button"
              className={'quick-card-food-tag'+(on ? ' is-selected' : '')}
              onClick={()=>toggle(t.id)}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="quick-card-submit"
        disabled={picked.length === 0}
        onClick={()=>picked.length > 0 && onSubmit?.(picked)}
      >
        {picked.length ? `记录饮食 · ${picked.length} 项` : '选择后记录'}
      </button>
    </div>
  );
}

function createFoodRecordEntry(foods){
  const list = Array.isArray(foods) ? foods : [foods];
  return {
    id:'e-'+Date.now(),
    kind:'rec',
    time: window.formatNowTime(),
    body:'',
    tags:list.map(s=>({ label:'饮食 '+s.label, cat:'diet' })),
    tagLayout:'t5',
    isNew: true,
  };
}

Object.assign(window, {
  SYMPTOM_SECTIONS,
  SYMPTOM_OPTIONS,
  DockSymptomPicker,
  DockWeightPicker,
  QUICK_SYMPTOM_TAGS,
  QUICK_MOOD_LEVELS,
  QuickCardIcon,
  QuickMoodPicker,
  MoodQuickOverlay,
  MOOD_QUICK_OPTIONS,
  QuickSymptomPicker,
  QuickWeightPicker,
  QuickFoodPicker,
  QUICK_FOOD_OPTIONS,
  createFoodRecordEntry,
  createSymptomRecordEntry,
  createWeightRecordEntry,
  createWeightRecordEntryFromText,
  tryCreateWeightTextEntry,
  parseWeightFromText,
  WEIGHT_BASELINE_KG,
  formatWeightDelta,
});
