// ============ Status bar ============
function StatusBar(){
  return (
    <div className="statusbar">
      <span>9:41</span>
      <div className="sb-r">
        <span className="sb-bars"><i></i><i></i><i></i><i></i></span>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M7.5 1.5a8 8 0 0 1 5.5 2M7.5 4.5a5 5 0 0 1 3.5 1.5M7.5 7.5a2 2 0 0 1 1.5.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
          <circle cx="7.5" cy="10" r="0.8" fill="currentColor"/>
        </svg>
        <div className="sb-batt"><i></i></div>
      </div>
    </div>
  );
}

function TopNav({title='随记'}){
  return (
    <div className="nav">
      <div className="nav-title">{title}</div>
      <div className="nav-actions">
        <div className="nav-icon"><Icon name="search" size={20} stroke={1.8}/></div>
        <div className="nav-icon"><Icon name="calendar" size={20} stroke={1.8}/></div>
      </div>
    </div>
  );
}

// ============ Mascot ============
function Mascot({size='md'}){
  return (
    <div className={'mascot'+(size==='sm'?' sm':'')}>
      <div className="mascot-body">
        <div className="mascot-eye l"></div>
        <div className="mascot-eye r"></div>
        <div className="mascot-mouth"></div>
        <div className="mascot-cheek l"></div>
        <div className="mascot-cheek r"></div>
      </div>
    </div>
  );
}

// ============ Compact health card ============
function HealthCard({scene}){
  const phaseClass = {
    period:'', foll:'foll', ov:'ov', lut:'lut'
  }[scene.phaseKind] || '';
  return (
    <div className="health">
      <span className={'health-light '+scene.status}></span>
      <div className="health-text">
        <div className="health-title">
          {scene.healthTitle}
          <span className={'health-phase '+phaseClass}>{scene.phaseLabel}</span>
        </div>
        <div className="health-desc">{scene.healthDesc}</div>
      </div>
      <div className="health-day">
        <div className="health-day-num">{scene.dayNum}</div>
        <div className="health-day-lbl">{scene.dayLbl}</div>
      </div>
    </div>
  );
}

// ============ Guide card ============
function GuideCard({children, chips=[], onChip}){
  return (
    <div className="guide">
      <div className="guide-avatar"><Mascot size="md"/></div>
      <div className="guide-content">
        <div className="guide-name">
          <b>小柚</b>
          <span className="ai-badge">AI</span>
        </div>
        <div className="guide-text">{children}</div>
        {chips.length>0 && (
          <div className="chips">
            {chips.map((c,i)=>(
              <button key={i} className="chip" onClick={()=>onChip&&onChip(c)}>{c}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ AI insight (folded note under entry) ============
function AIInsight({analysis}){
  if(!analysis) return null;
  return (
    <div className={'ai-insight '+(analysis.tone||'')}>
      <div className="ai-ins-head">
        <span className="mini-mascot"></span>
        <span>小柚 · {analysis.title}</span>
      </div>
      <ul className="ai-ins-points">
        {analysis.points && analysis.points.map((p,i)=>(
          <li key={i}><span className="ico">{p.icon}</span><span>{p.text}</span></li>
        ))}
      </ul>
    </div>
  );
}

// ============ Entry card ============
function Entry({e, isNew}){
  const I = window.Icon;
  return (
    <div className={'entry'+(isNew?' fade-in':'')}>
      <div className="entry-meta">
        <span>{e.time}</span>
        <span className="more-btn">···</span>
      </div>
      {e.title && (
        <div className="entry-title">
          {e.emoji && <span className="entry-title-emoji">{e.emoji}</span>}
          <span>{e.title}</span>
        </div>
      )}
      {e.body && <div className="entry-body">{e.body}</div>}
      {e.photo && <div className="entry-photo">[ 照片占位 · 由用户上传 ]</div>}
      {e.voice && (
        <div className="voice">
          <span className="voice-ico"><I name="mic" size={16} stroke={1.8}/></span>
          <div className="voice-wave">
            {Array.from({length:22}).map((_,i)=>{
              const h = 4 + (Math.sin(i*0.7)*0.5+0.5)*14;
              return <span key={i} style={{height:h+'px'}}></span>;
            })}
          </div>
          <span className="voice-dur">{e.voice.duration}</span>
        </div>
      )}
      {e.tags && e.tags.length>0 && (
        <div className="tags">
          {e.tags.map((t,i)=>(
            <span key={i} className={'tag'+(t.auto?' auto':'')}>{t.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ Day section header ============
function DaySection({item}){
  return (
    <div className={'tl-day-row'}>
      <div>
        <div className="tl-day-num">{item.date}</div>
      </div>
      <div className="tl-day-meta">
        {item.dateTag ? <span>{item.dateTag} · </span> : null}
        <b>{item.weekday}</b>{item.isToday?' · 今天':''}
      </div>
    </div>
  );
}

// ============ Phase marker ============
function PhaseMarker({item}){
  return (
    <div className={'tl-phase '+(item.phase||'')}>
      <span className="tl-phase-pill">{item.label}</span>
    </div>
  );
}

// ============ Gap marker ============
function GapMarker({item}){
  return (
    <div className="tl-gap">
      <span className="tl-gap-lbl">{item.days} 天</span>
    </div>
  );
}

// ============ Cycle report ============
function CycleReport({item}){
  const I = window.Icon;
  return (
    <div className={'tl-cycle-report '+(item.tone||'')}>
      <div className="cycle-card">
        <div className="cycle-card-head">
          <div className="cycle-card-lbl">周期月报</div>
          <span className="cycle-card-arrow">›</span>
        </div>
        <div className="cycle-card-title">{item.title}</div>
        <div className="cycle-card-range">{item.range}</div>
        <div className="cycle-card-stats">
          {item.stats.map((s,i)=>(
            <div key={i} className="cycle-card-stat">
              <div className={'cc-num '+(s.tone||'')}>{s.num}</div>
              <div className="cc-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
        <div className="cycle-card-summary">{item.summary}</div>
      </div>
    </div>
  );
}

// ============ Tab bar ============
// Order: 美柚 / 记录 / 随记(center) / 返现 / 我
function TabBar({active='note'}){
  const tabs = [
    {id:'home', label:'美柚', custom:(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 3.5a8.5 8.5 0 0 0-2 16.7c0 .4.2.8 1 .8s1-.5 1-1v-2.5a2.5 2.5 0 0 1 2 2.5c0 .5.2 1 1 1s1-.4 1-.8a8.5 8.5 0 0 0-4-16.7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M12 3.5c1.5-1.5 3-1.5 3 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    )},
    {id:'rec', label:'记录', custom:<span className="tile">19</span>},
    {id:'note', label:'随记', custom:(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M14 4l5 5-9 9H5v-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M13 5l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="6" cy="19" r="1.2" fill="currentColor"/>
      </svg>
    )},
    {id:'cash', label:'返现', custom:(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M9 8l3 4 3-4M12 12v6M9 14h6M9 17h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    )},
    {id:'me', label:'我', custom:(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ), notif:true},
  ];
  return (
    <div className="tabbar">
      {tabs.map(t=>(
        <div key={t.id} className={'tab'+(active===t.id?' active':'')}>
          <div className="tab-ico">{t.custom}</div>
          <div className="tab-lbl">{t.label}</div>
          {t.notif && <span className="notif"></span>}
        </div>
      ))}
    </div>
  );
}

// ============ Toast ============
function Toast({toasts}){
  const I = window.Icon;
  return (
    <div className="toast-stack">
      {toasts.map(t=>(
        <div key={t.id} className={'toast'+(t.bye?' bye':'')}>
          <span className="check"><I name="check" size={11} stroke={2.6}/></span>
          <span>{t.text}</span>
          {t.tags && t.tags.map((tg,i)=>(
            <span key={i} className="toast-tag">{tg}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

// ============ Voice / Photo sheets ============
function VoiceSheet({onCancel, onDone}){
  const [sec, setSec] = React.useState(0);
  React.useEffect(()=>{
    const id = setInterval(()=>setSec(s=>s+1), 1000);
    return ()=>clearInterval(id);
  },[]);
  const fmt = s => String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
  return (
    <React.Fragment>
      <div className="sheet-mask" onClick={onCancel}></div>
      <div className="sheet">
        <div className="sheet-handle"></div>
        <div className="sheet-title">正在录音</div>
        <div className="sheet-sub">说出今天身体的感受，小柚会帮你整理</div>
        <div className="voice-stage">
          <div className="voice-circle">
            <div className="voice-wf">
              <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
          </div>
          <div className="voice-time">{fmt(sec)}</div>
          <div className="voice-hint">轻触圆圈可暂停</div>
        </div>
        <div className="voice-actions">
          <button className="va-btn cancel" onClick={onCancel}>取消</button>
          <button className="va-btn done" onClick={()=>onDone(fmt(sec))}>完成</button>
        </div>
      </div>
    </React.Fragment>
  );
}

function PhotoSheet({onCancel, onPick}){
  const I = window.Icon;
  return (
    <React.Fragment>
      <div className="sheet-mask" onClick={onCancel}></div>
      <div className="sheet">
        <div className="sheet-handle"></div>
        <div className="sheet-title">添加照片</div>
        <div className="sheet-sub">皮肤状态、用药、经血……都可以记下来</div>
        <div className="photo-grid">
          <div className="photo-opt" onClick={()=>onPick('camera')}>
            <I name="camera" size={24} stroke={1.6}/>
            <div className="photo-opt-title">拍一张</div>
            <div className="photo-opt-desc">打开相机记录此刻</div>
          </div>
          <div className="photo-opt" onClick={()=>onPick('album')}>
            <I name="image" size={24} stroke={1.6}/>
            <div className="photo-opt-title">从相册</div>
            <div className="photo-opt-desc">可多张合并到一条</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, {
  StatusBar, TopNav, Mascot, HealthCard, GuideCard,
  AIInsight, Entry, DaySection, PhaseMarker, GapMarker, CycleReport,
  TabBar, Toast, VoiceSheet, PhotoSheet
});
