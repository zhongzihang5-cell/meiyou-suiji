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

function TopNav({title='点滴'}){
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
// Order: 美柚 / 记录 / 点滴(center) / 返现 / 我
function TabBar({active='note', onChange}){
  const I = window.Icon;
  const tabs = [
    {id:'home', label:'美柚', custom:(
      <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3.2"/>
        <ellipse cx="24" cy="24" rx="3" ry="8" fill="currentColor"/>
        <ellipse cx="24" cy="24" rx="3" ry="8" fill="currentColor" transform="rotate(60 24 24)"/>
        <ellipse cx="24" cy="24" rx="3" ry="8" fill="currentColor" transform="rotate(120 24 24)"/>
        <circle cx="24" cy="24" r="2.5" fill="currentColor"/>
      </svg>
    )},
    {id:'cal', label:'记录', custom:(
      <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="10" width="36" height="32" rx="5" stroke="currentColor" strokeWidth="3.2"/>
        <line x1="15" y1="6" x2="15" y2="14" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round"/>
        <line x1="33" y1="6" x2="33" y2="14" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round"/>
        <line x1="6" y1="20" x2="42" y2="20" stroke="currentColor" strokeWidth="3.2"/>
        <text x="24" y="37" textAnchor="middle" fill="currentColor" fontSize="18" fontWeight="700" fontFamily="PingFang SC, sans-serif">3</text>
      </svg>
    )},
    {id:'note', label:'点滴', custom:<I name="mic" size={22} stroke={1.6}/>},
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
        <div
          key={t.id}
          className={'tab'+(active===t.id?' active':'')}
          onClick={()=>onChange && onChange(t.id)}
          role="button"
          tabIndex={0}
        >
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

// ComposeScreen & ImmersiveVoice → compose-portal.jsx

Object.assign(window, {
  StatusBar, TopNav, Mascot, HealthCard, GuideCard,
  AIInsight, Entry, DaySection, PhaseMarker, GapMarker, CycleReport,
  TabBar, Toast, VoiceSheet, PhotoSheet,
  DailyCard, TimelineFeed,
});
function DailyCard({card}){
  const phaseCls = card.phaseKind || 'period';
  const accentColors = {
    period:'var(--my-brand-red)', foll:'var(--phase-foll)',
    lut:'var(--phase-lut)', preg:'var(--my-purple)', baby:'var(--my-success)',
  };
  return (
    <div className={'day-card'+(card.isToday?' today':'')}>
      <div className="day-card-accent" style={{background:accentColors[phaseCls]||accentColors.period}}/>
      <div className="day-card-head">
        <div>
          <div className="dc-date">
            <span className="dc-day">{card.date}</span>
            <span className="dc-month">{card.month}</span>
          </div>
          <div className="dc-weekday">{card.weekday}{card.isToday?' · 今天':''}</div>
        </div>
        <div className="dc-meta">
          <span className="dc-weather">{card.weather}</span>
          <span className={'dc-phase '+phaseCls}>{card.phase}</span>
        </div>
      </div>
      <div className="day-card-body">
        <div className="dc-summary">{card.summary}</div>
        {card.tags && card.tags.length > 0 && (
          <div className="dc-tags">
            {card.tags.map((t,i)=>(
              <span key={i} className="dc-tag auto">{t}</span>
            ))}
          </div>
        )}
      </div>
      {(card.insight || card.entryCount) && (
        <div className="dc-foot">
          {card.insight ? (
            <span className="dc-insight">
              {card.hasPhoto && <span className="dc-photo-dot"/>}
              {card.insight}
            </span>
          ) : <span/>}
          <span className="dc-count">{card.entryCount} 条记录</span>
        </div>
      )}
    </div>
  );
}

function TimelineFeed({cards, onCompose}){
  const I = window.Icon;
  return (
    <div className="feed">
      <div className="feed-header">
        <div>
          <div className="feed-title">点滴</div>
          <div className="feed-sub">我和我身体的空间</div>
        </div>
        <button className="feed-compose-btn" onClick={onCompose} aria-label="写点滴">
          <I name="pen" size={18} stroke={1.8}/>
        </button>
      </div>
      <div className="day-cards">
        {cards.map(c=><DailyCard key={c.id} card={c}/>)}
      </div>
    </div>
  );
}

Object.assign(window, {
  StatusBar, TopNav, Mascot, HealthCard, GuideCard,
  AIInsight, Entry, DaySection, PhaseMarker, GapMarker, CycleReport,
  TabBar, Toast, VoiceSheet, PhotoSheet,
  DailyCard, TimelineFeed,
});
