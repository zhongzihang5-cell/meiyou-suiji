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

const WEIGHT_KEYS = ['1','2','3','4','5','6','7','8','9','.','0','⌫'];

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

function DockWeightPicker({onConfirm, onCancel}){
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
      if(v === '0') return key;
      if(v.includes('.') && v.split('.')[1]?.length >= 1) return v;
      if(!v.includes('.') && v.replace('.','').length >= 3) return v;
      return v + key;
    });
  };

  const num = parseFloat(value);
  const canSubmit = Number.isFinite(num) && num > 0;
  const display = value || '0';
  const unitLabel = unit === 'kg' ? '公斤' : '斤';

  return (
    <div className="dock-sheet dock-weight-sheet">
      <div className="dock-weight-top">
        <p className="dock-sheet-lead">今天体重多少？</p>
        <DockSheetClose onCancel={onCancel}/>
      </div>
      <div className="dock-weight-display-wrap">
        <button
          type="button"
          className="dock-weight-unit-toggle"
          onClick={()=>setUnit(u=>(u === 'kg' ? 'jin' : 'kg'))}
        >
          切换为{unit === 'kg' ? '斤' : '公斤'}
        </button>
        <div className="dock-weight-display">
          <span className="dock-weight-num">{display}</span>
          <span className="dock-weight-unit">{unitLabel}</span>
        </div>
      </div>
      <div className="dock-weight-keypad">
        {WEIGHT_KEYS.map((key)=>(
          <button
            key={key}
            type="button"
            className={'dock-weight-key'+(key === '⌫' ? ' is-fn' : '')}
            onClick={()=>pressKey(key)}
            aria-label={key === '⌫' ? '删除' : key}
          >
            {key === '⌫' ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 8H8a2 2 0 0 0-1.7 1l-3.3 5a1 1 0 0 0 0 1l3.3 5A2 2 0 0 0 8 20h10a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2z"/>
                <path d="m14 11-2 2 2 2M12 13h0"/>
              </svg>
            ) : key}
          </button>
        ))}
      </div>
      <DockSheetFoot
        disabled={!canSubmit}
        onSubmit={()=>canSubmit && onConfirm?.({ value: num, unit })}
      />
    </div>
  );
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

function createWeightRecordEntry({value, unit}){
  const unitLabel = unit === 'jin' ? '斤' : 'kg';
  const text = unit === 'jin'
    ? `${value}斤`
    : `${value}kg`;
  return {
    id:'e-'+Date.now(),
    kind:'rec',
    time: window.formatNowTime(),
    body:'',
    tags:[{ label:'体重 '+text, cat:'weight', emoji:'⚖️' }],
    tagLayout:'t5',
    isNew: true,
  };
}

Object.assign(window, {
  SYMPTOM_SECTIONS,
  SYMPTOM_OPTIONS,
  DockSymptomPicker,
  DockWeightPicker,
  createSymptomRecordEntry,
  createWeightRecordEntry,
});
