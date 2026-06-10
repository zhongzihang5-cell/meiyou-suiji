// ============ V3v2 记录卡片 — 1:1 来自 record-tab-v3plus TimelineV3v2 ============

const TL_PRIMARY = '#FF4D88';
const TL_SOFT = '#FFE0EC';
const TL_TEXT = '#323232';
const TL_MUTED = '#8E8E93';
const TL_LINE = 'rgba(0,0,0,0.06)';
const TL_HAIR = 'rgba(0,0,0,0.08)';

function TLTagIcon({name, color = TL_PRIMARY, size = 12}){
  const sw = 1.6;
  if(name === 'mood'){
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={sw}/>
        <circle cx="9" cy="10" r="1" fill={color}/>
        <circle cx="15" cy="10" r="1" fill={color}/>
        <path d="M9 15c1-0.5 5-0.5 6 0" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
      </svg>
    );
  }
  if(name === 'sym'){
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3v18M3 12h18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }
  if(name === 'food'){
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 8h16l-2 11a2 2 0 01-2 2H8a2 2 0 01-2-2L4 8z" stroke={color} strokeWidth={sw}/>
        <path d="M8 8V5a4 4 0 018 0v3" stroke={color} strokeWidth={sw}/>
      </svg>
    );
  }
  if(name === 'flame'){
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2c1 4 5 5 5 10a5 5 0 11-10 0c0-3 2-3 2-6 1 1 2 1 3-4z" stroke={color} strokeWidth={sw} strokeLinejoin="round"/>
      </svg>
    );
  }
  if(name === 'scale'){
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth={sw}/>
        <path d="M8 9l4 4 4-4" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if(name === 'period'){
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 21c-3-2.5-6-5.5-6-9a6 6 0 1112 0c0 3.5-3 6.5-6 9z" stroke={color} strokeWidth={sw} strokeLinejoin="round"/>
      </svg>
    );
  }
  if(name === 'flow'){
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 14c0-3 2-6 4-8 2 2 4 5 4 8a4 4 0 01-8 0z" stroke={color} strokeWidth={sw} strokeLinejoin="round"/>
      </svg>
    );
  }
  if(name === 'run'){
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="14" cy="5" r="2" stroke={color} strokeWidth={sw}/>
        <path d="M6 20l4-7 3 2 5-6" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  return null;
}

function TLKindIcon({kind, color = TL_PRIMARY, size = 14}){
  const sw = 1.7;
  if(kind === 'voice'){
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="9" y="3" width="6" height="12" rx="3" fill={color}/>
        <path d="M5 11a7 7 0 0014 0M12 18v3" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
      </svg>
    );
  }
  if(kind === 'image'){
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth={sw}/>
        <circle cx="9" cy="10" r="1.5" fill={color}/>
        <path d="M4 18l5-5 4 4 3-2 4 5" stroke={color} strokeWidth={sw} strokeLinejoin="round"/>
      </svg>
    );
  }
  if(kind === 'text'){
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 6h14M5 12h14M5 18h9" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
      </svg>
    );
  }
  if(kind === 'chart'){
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 20V6M4 20h16M8 16v-4M12 16V8M16 16v-6" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
      </svg>
    );
  }
  return null;
}

function TLTag({tag, size = 'sm'}){
  const fs = size === 'xs' ? 10.5 : 11.5;
  return (
    <span className={'v3-tag'+(size === 'xs' ? ' is-xs' : '')} style={{fontSize: fs}}>
      <TLTagIcon name={tag.icon} color="currentColor" size={11}/>
      <span className="v3-tag-cat">{tag.cat}</span>
      {tag.val ? <span className="v3-tag-val">{tag.val}</span> : null}
    </span>
  );
}

function TLImageThumb({size = 56, radius = 10}){
  const isFull = size === '100%';
  return (
    <div style={{
      width:isFull ? '100%' : size,
      height:isFull ? '100%' : size,
      borderRadius:radius,
      background:'linear-gradient(135deg, #FFDDB6 0%, #FFB088 45%, #E8835C 100%)',
      position:'relative', overflow:'hidden', flexShrink:0,
    }}>
      <div style={{
        position:'absolute', inset:'18%', borderRadius:'50%',
        background:'radial-gradient(circle at 35% 30%, #FFF1DB 0%, #F4D29D 60%, #C99664 100%)',
      }}/>
      <div style={{
        position:'absolute', top:'32%', left:'28%', width:'44%', height:'20%',
        borderRadius:4, background:'linear-gradient(180deg, #F2B98C 0%, #D87E50 100%)',
      }}/>
    </div>
  );
}

function ChartMoodWeek({compact = false}){
  const data = [0.55, 0.7, 0.5, 0.8, 0.65, 0.6, 0.32];
  const labels = ['一','二','三','四','五','六','日'];
  const h = compact ? 36 : 56;
  return (
    <div style={{display:'flex', alignItems:'flex-end', gap:6, height:h}}>
      {data.map((v, i)=>{
        const isToday = i === data.length - 1;
        return (
          <div key={i} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, justifyContent:'flex-end', height:'100%'}}>
            <div style={{
              width:'100%', height:v * (h - 10), borderRadius:4,
              background:isToday ? `linear-gradient(180deg, ${TL_PRIMARY}, #FF7AA8)` : `${TL_PRIMARY}40`,
            }}/>
            {!compact && <div style={{fontSize:9, color:TL_MUTED}}>{labels[i]}</div>}
          </div>
        );
      })}
    </div>
  );
}

function ChartWeightTrend({compact = false}){
  const gradId = React.useMemo(()=>'v3wt'+Math.random().toString(36).slice(2,9), []);
  const N = 30;
  const data = Array.from({length:N}, (_, i)=>{
    const base = 53;
    const trend = -i * 0.025;
    const noise = Math.sin(i * 0.9) * 0.25 + Math.cos(i * 0.4) * 0.15;
    return base + trend + noise;
  });
  const min = Math.min(...data);
  const max = Math.max(...data);
  const w = 100;
  const h = compact ? 36 : 60;
  const points = data.map((v, i)=>{
    const x = i / (N - 1) * w;
    const y = h - (v - min) / (max - min || 1) * (h - 6) - 3;
    return [x, y];
  });
  const path = points.map(([x, y], i)=>`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const fill = `${path} L${w} ${h} L0 ${h} Z`;
  const [lastX, lastY] = points[points.length - 1];
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TL_PRIMARY} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={TL_PRIMARY} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#${gradId})`}/>
      <path d={path} fill="none" stroke={TL_PRIMARY} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
      <circle cx={lastX} cy={lastY} r="2" fill={TL_PRIMARY}/>
    </svg>
  );
}

function ChartCaloriePanel({compact = false}){
  const consumed = 1126;
  const target = 1800;
  const pct = consumed / target;
  const r = compact ? 22 : 28;
  const c = 2 * Math.PI * r;
  const size = r * 2 + 8;
  return (
    <div style={{display:'flex', alignItems:'center', gap:14}}>
      <div style={{position:'relative', width:size, height:size, flexShrink:0}}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={r} stroke={TL_SOFT} strokeWidth="5" fill="none"/>
          <circle
            cx={size/2} cy={size/2} r={r} stroke={TL_PRIMARY} strokeWidth="5" fill="none"
            strokeDasharray={`${c * pct} ${c}`} strokeLinecap="round"
            transform={`rotate(-90 ${size/2} ${size/2})`}
          />
        </svg>
        <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
          <div style={{fontSize:11, fontWeight:500, color:TL_TEXT, lineHeight:1}}>{Math.round(pct * 100)}%</div>
        </div>
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:11, color:TL_MUTED, marginBottom:4}}>已摄入</div>
        <div style={{fontSize:18, fontWeight:500, color:TL_TEXT, fontVariantNumeric:'tabular-nums'}}>
          {consumed}
          <span style={{fontSize:11, fontWeight:400, color:TL_MUTED, marginLeft:4}}>/ {target} kcal</span>
        </div>
        {!compact && (
          <div style={{marginTop:6, display:'flex', gap:2, height:5, borderRadius:3, overflow:'hidden', background:'rgba(0,0,0,0.04)'}}>
            <div style={{flex:3.2, background:'#FF9966'}}/>
            <div style={{flex:4.6, background:TL_PRIMARY}}/>
            <div style={{flex:1.2, background:'#FFCBAE'}}/>
          </div>
        )}
      </div>
    </div>
  );
}

function ChartTodayMoodWave({data, compact = false}){
  const gradId = React.useMemo(()=>'v3tm'+Math.random().toString(36).slice(2,9), []);
  const w = 100;
  const h = compact ? 36 : 60;
  const minV = 1;
  const maxV = 5;
  const range = maxV - minV;
  const points = (data || []).filter(d => Number.isFinite(d.v));

  if(points.length === 0){
    return (
      <div style={{height: h, display:'flex', alignItems:'center', justifyContent:'center', color:TL_MUTED, fontSize:11}}>
        今天暂未记录情绪
      </div>
    );
  }

  if(points.length === 1){
    const only = points[0];
    const y = h - ((only.v - minV) / range) * (h - 10) - 5;
    return (
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{display:'block'}}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={TL_PRIMARY} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={TL_PRIMARY} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <line x1="0" y1={y} x2={w} y2={y} stroke={TL_PRIMARY} strokeWidth="1.2" strokeOpacity="0.35" strokeDasharray="2,3"/>
        <circle cx={w / 2} cy={y} r="2.4" fill={TL_PRIMARY}/>
      </svg>
    );
  }

  const xs = points.map(p => p.t);
  const minT = Math.min(...xs);
  const maxT = Math.max(...xs);
  const tRange = maxT - minT || 1;
  const xy = points.map(p => {
    const x = ((p.t - minT) / tRange) * w;
    const y = h - ((p.v - minV) / range) * (h - 10) - 5;
    return [x, y];
  });
  const path = xy.map(([x, y], i)=>`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const fill = `${path} L${w} ${h} L0 ${h} Z`;
  const [lastX, lastY] = xy[xy.length - 1];

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{display:'block'}}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TL_PRIMARY} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={TL_PRIMARY} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#${gradId})`}/>
      <path
        d={path}
        fill="none"
        stroke={TL_PRIMARY}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={lastX} cy={lastY} r="2" fill={TL_PRIMARY}/>
    </svg>
  );
}

function TLChart({type, compact = false, data}){
  if(type === 'moodWeek') return <ChartMoodWeek compact={compact}/>;
  if(type === 'weightTrend') return <ChartWeightTrend compact={compact}/>;
  if(type === 'caloriePanel') return <ChartCaloriePanel compact={compact}/>;
  if(type === 'todayMoodWave') return <ChartTodayMoodWave data={data} compact={compact}/>;
  return null;
}

function V3Chevron({open}){
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{transform:`rotate(${open ? 180 : 0}deg)`, transition:'transform 0.2s'}} aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke={TL_MUTED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function V3v2Header({time, title, isNew, entryId, entryKind}){
  const MoreMenu = window.CardMoreMenu;
  if(!time && !title) return null;
  return (
    <div style={{display:'flex', alignItems:'center', gap:6, minWidth:0}}>
      {time && (
        <div style={{
          fontSize:11.5, color:TL_MUTED, fontWeight:400, fontVariantNumeric:'tabular-nums', flexShrink:0,
        }}>{time}</div>
      )}
      {title && (
        <div style={{
          fontSize:12, color:TL_TEXT, fontWeight:500,
          flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
        }}>{title}</div>
      )}
      {MoreMenu && <MoreMenu delayMs={isNew ? 600 : 0} entryId={entryId} entryKind={entryKind} onEdit={window.openEditModal}/>}
    </div>
  );
}

function V3FoodListStatic({ items, totalKcal, revealStep = 3 }) {
  const DietFoodResultSummary = window.DietFoodResultSummary;
  if (DietFoodResultSummary) {
    return <DietFoodResultSummary items={items} totalKcal={totalKcal} revealStep={revealStep}/>;
  }

  const listStyle = { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 };
  const rowStyle = { fontSize: 13, color: TL_TEXT, lineHeight: 1.45, display: 'flex', alignItems: 'baseline', gap: 6 };
  const dotStyle = { width: 3, height: 3, borderRadius: 1.5, background: TL_PRIMARY, flexShrink: 0, alignSelf: 'center' };

  return (
    <ul style={listStyle}>
      {items.map((it, i) => (
        <li key={i} style={rowStyle}>
          <span style={dotStyle}/>
          <span>{it}</span>
        </li>
      ))}
      {totalKcal != null && (
        <li style={{
          ...rowStyle,
          marginTop: 4,
          paddingTop: 6,
          borderTop: `0.5px solid ${TL_HAIR}`,
          fontWeight: 500,
        }}>
          <span style={{ color: TL_MUTED, fontWeight: 500 }}>总卡路里</span>
          <span style={{ marginLeft: 'auto', color: TL_PRIMARY, fontVariantNumeric: 'tabular-nums' }}>{totalKcal} kcal</span>
        </li>
      )}
    </ul>
  );
}

function V3PhotoFoodAnalysis({ items, totalKcal, isNew, onComplete }) {
  const TypewriterText = window.TypewriterText;
  const loadingMs = window.PHOTO_ANALYZE_LOADING_MS || 5000;
  const animate = !!isNew;
  const [loading, setLoading] = React.useState(animate);
  const [activeLine, setActiveLine] = React.useState(0);
  const [typingTotal, setTypingTotal] = React.useState(false);
  const [finished, setFinished] = React.useState(!animate);
  const lineGapRef = React.useRef(null);

  const foodItems = items || [];
  const listStyle = { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 };
  const rowStyle = { fontSize: 13, color: TL_TEXT, lineHeight: 1.45, display: 'flex', alignItems: 'baseline', gap: 6 };
  const dotStyle = { width: 3, height: 3, borderRadius: 1.5, background: TL_PRIMARY, flexShrink: 0, alignSelf: 'center' };

  React.useEffect(() => {
    if (!animate) return;
    const tm = setTimeout(() => setLoading(false), loadingMs);
    return () => clearTimeout(tm);
  }, [animate, loadingMs]);

  React.useEffect(() => () => {
    if (lineGapRef.current) clearTimeout(lineGapRef.current);
  }, []);

  const finishAnalysis = React.useCallback(() => {
    setFinished(true);
    onComplete?.();
  }, [onComplete]);

  const handleFoodLineComplete = React.useCallback(() => {
    if (activeLine >= foodItems.length - 1) {
      if (totalKcal != null) {
        lineGapRef.current = setTimeout(() => setTypingTotal(true), 180);
      } else {
        finishAnalysis();
      }
    } else {
      lineGapRef.current = setTimeout(() => setActiveLine(v => v + 1), 180);
    }
  }, [activeLine, foodItems.length, totalKcal, finishAnalysis]);

  if (!animate || finished) {
    return <V3FoodListStatic items={foodItems} totalKcal={totalKcal}/>;
  }

  if (loading) {
    return (
      <div className="v3-photo-analyze-loading" aria-live="polite">
        <span className="v3-photo-analyze-dot"/>
        <span className="v3-photo-analyze-dot"/>
        <span className="v3-photo-analyze-dot"/>
        <span className="v3-photo-analyze-text">识别中...</span>
      </div>
    );
  }

  if (!TypewriterText) {
    return <V3FoodListStatic items={foodItems} totalKcal={totalKcal}/>;
  }

  return (
    <ul style={listStyle}>
      {foodItems.slice(0, activeLine).map((it, i) => (
        <li key={i} style={rowStyle}>
          <span style={dotStyle}/>
          <span>{it}</span>
        </li>
      ))}
      {!typingTotal && activeLine < foodItems.length && (
        <li style={rowStyle}>
          <span style={dotStyle}/>
          <TypewriterText
            text={foodItems[activeLine]}
            active
            charMs={42}
            followScroll
            onComplete={handleFoodLineComplete}
          />
        </li>
      )}
      {typingTotal && totalKcal != null && (
        <li style={{
          ...rowStyle,
          marginTop: 4,
          paddingTop: 6,
          borderTop: `0.5px solid ${TL_HAIR}`,
          fontWeight: 500,
        }}>
          <span style={{ color: TL_MUTED, fontWeight: 500 }}>总卡路里</span>
          <span style={{ marginLeft: 'auto', color: TL_PRIMARY, fontVariantNumeric: 'tabular-nums' }}>
            <TypewriterText
              text={`${totalKcal} kcal`}
              active
              charMs={42}
              followScroll
              onComplete={finishAnalysis}
            />
          </span>
        </li>
      )}
    </ul>
  );
}

function V3v2PrimaryBody({
  entry, showTags = true, tagsAnimate = false,
  photoAnalysis = false, isNew = false, onPhotoAnalysisComplete,
}) {
  const tagRowStyle = { display: 'flex', gap: 6, flexWrap: 'wrap' };
  if(entry.kind === 'mood-face'){
    const MoodFace = window.MoodFace;
    const mood = entry.primaryMood;
    return (
      <div style={{display:'flex', alignItems:'center', gap:10}}>
        {MoodFace && mood && (
          <div style={{width:40, height:40, borderRadius:'50%', overflow:'hidden', flexShrink:0,
            display:'flex', alignItems:'center', justifyContent:'center',
            background:'rgba(255,77,136,0.06)',
          }}>
            <MoodFace face={mood.face} bg={mood.bg}/>
          </div>
        )}
        <span style={{fontSize:18, fontWeight:500, color:TL_TEXT, lineHeight:1.2}}>{entry.text}</span>
      </div>
    );
  }
  if(entry.kind === 'voice'){
    const TlVoiceInline = window.TlVoiceInline;
    const text = entry.text || entry.body || '';
    const voice = entry.voice || (entry.duration ? { duration: entry.duration } : null);
    return (
      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        {TlVoiceInline && <TlVoiceInline voice={voice} text={text}/>}
        {showTags && (entry.tags || []).length > 0 && (
          <div style={tagRowStyle}>
            {(entry.tags || []).map((t, i)=>(
              <span
                key={i}
                className={tagsAnimate ? 'tl-tags-reveal' : undefined}
                style={tagsAnimate ? { animationDelay: `${i * 90}ms` } : undefined}
              >
                <TLTag tag={t}/>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }
  if(entry.kind === 'image'){
    const items = entry.foodItems || (entry.text || entry.body || '').split(/[；;]\s*/).filter(Boolean);
    const imgSrc = entry.useRealImage ? (entry.photo?.src || entry.imageSrc) : null;
    return (
      <div style={{display:'flex', flexDirection:'column', gap:10}}>
        <div style={{width:'100%', aspectRatio:'4/3', borderRadius:10, overflow:'hidden', background:'#eee'}}>
          {imgSrc ? (
            <img src={imgSrc} alt={entry.label || '午餐'} style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}}/>
          ) : (
            <TLImageThumb size="100%" radius={10}/>
          )}
        </div>
        {photoAnalysis ? (
          <V3PhotoFoodAnalysis
            items={items}
            totalKcal={entry.totalKcal}
            isNew={isNew}
            onComplete={onPhotoAnalysisComplete}
          />
        ) : (
          <V3FoodListStatic items={items} totalKcal={entry.totalKcal}/>
        )}
      </div>
    );
  }
  return (
    <div style={{display:'flex', flexDirection:'column', gap:8}}>
      <div style={{fontSize:14, color:TL_TEXT, lineHeight:1.5}}>{entry.text || entry.body}</div>
      {showTags && (entry.tags || []).length > 0 && (
        <div style={tagRowStyle}>
          {(entry.tags || []).map((t, i)=>(
            <span
              key={i}
              className={tagsAnimate ? 'tl-tags-reveal' : undefined}
              style={tagsAnimate ? { animationDelay: `${i * 90}ms` } : undefined}
            >
              <TLTag tag={t}/>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}


function normalizeV3Entry(raw){
  if(!raw) return null;
  const kind = raw.kind || raw.recordKind;
  return {
    ...raw,
    kind,
    text: raw.text || raw.body || '',
    duration: raw.duration || raw.voice?.duration,
    time: raw.time,
  };
}

function V3v2Card({primary, ai, aiDefaultOpen = false, isNew, staggerReveal = false, entryId, photoAnalysis = false}){
  const cardRef = React.useRef(null);
  const aiPanelRef = React.useRef(null);
  const usePhotoFlow = photoAnalysis && isNew;
  const [revealStep, setRevealStep] = React.useState(() => ((staggerReveal && isNew && !usePhotoFlow) ? 0 : 2));
  const [analysisDone, setAnalysisDone] = React.useState(!usePhotoFlow);
  const p = normalizeV3Entry(primary);
  const a = normalizeV3Entry(ai);
  const derivedKind = primary?.voice ? 'mixed' : primary?.photo ? 'image' : primary?.body || primary?.text ? 'text' : 'quick';
  const derivedId = entryId || primary?.id;

  const scrollAfterAiChartReveal = React.useCallback(() => {
    const run = () => {
      if(typeof window.scrollTimelineToBottom === 'function'){
        window.scrollTimelineToBottom('smooth');
      } else {
        const target = aiPanelRef.current || cardRef.current;
        window.scrollFeedContentIntoView?.(target);
      }
    };
    requestAnimationFrame(() => requestAnimationFrame(run));
  }, []);

  const handlePhotoAnalysisComplete = React.useCallback(() => {
    setAnalysisDone(true);
    setRevealStep(2);
    setTimeout(scrollAfterAiChartReveal, 320);
  }, [scrollAfterAiChartReveal]);

  React.useEffect(() => {
    if(usePhotoFlow) return;
    if(!staggerReveal || !isNew){
      setRevealStep(2);
      return;
    }
    setRevealStep(0);
    const tTags = setTimeout(() => setRevealStep(1), 380);
    const tAi = setTimeout(() => {
      setRevealStep(2);
      setTimeout(scrollAfterAiChartReveal, 400);
    }, 980);
    return () => {
      clearTimeout(tTags);
      clearTimeout(tAi);
    };
  }, [staggerReveal, isNew, primary?.id, scrollAfterAiChartReveal, usePhotoFlow]);

  if(!p && a){
    return (
      <div className={isNew ? 'fade-in' : undefined} style={{
        background:'#fff', borderRadius:14, border:`0.5px solid ${TL_LINE}`,
        padding:'11px 12px 12px',
      }}>
        <V3v2Header time={a.time} title={a.title} isNew={isNew} entryId={derivedId} entryKind={derivedKind}/>
        <div style={{marginTop:8}}>
          <TLChart type={a.chartType} data={a.chartData}/>
          {a.note && <div style={{fontSize:11, color:TL_MUTED, marginTop:8}}>{a.note}</div>}
        </div>
      </div>
    );
  }

  const shellClass = isNew
    ? ((staggerReveal && !usePhotoFlow) ? 'v3-card-enter' : 'fade-in')
    : undefined;
  const showTags = revealStep >= 1;
  const showAi = analysisDone && revealStep >= 2;

  return (
    <div
      ref={cardRef}
      className={shellClass}
      data-entry-id={derivedId}
      style={{
        background:'#fff', borderRadius:14, border:`0.5px solid ${TL_LINE}`,
        padding:'11px 12px 4px', overflow:'hidden',
      }}
    >
      <V3v2Header time={p.time} isNew={isNew} entryId={derivedId} entryKind={derivedKind}/>
      <div style={{marginTop:8, paddingBottom:(a && showAi) ? 10 : (p.sourceFrom ? 0 : 8)}}>
        <V3v2PrimaryBody
          entry={p}
          showTags={showTags}
          tagsAnimate={staggerReveal && showTags}
          photoAnalysis={photoAnalysis}
          isNew={isNew}
          onPhotoAnalysisComplete={handlePhotoAnalysisComplete}
        />
      </div>
      {p.sourceFrom && (
        <div className={primary._sourceNew ? 'tl-demo-source-in' : ''} style={{
          fontSize:11, color:TL_MUTED,
          paddingTop:6, paddingBottom:8,
          borderTop:'0.5px dashed '+TL_HAIR,
        }}>{p.sourceFrom}</div>
      )}
      {a && showAi && (() => {
        const DietAiCollapsibleSection = window.DietAiCollapsibleSection;
        if (!DietAiCollapsibleSection) return null;
        return (
          <div ref={aiPanelRef}>
            <DietAiCollapsibleSection
              title={a.title || 'AI 分析'}
              defaultOpen={aiDefaultOpen}
              embedded
              animateIn={isNew}
            >
              {a.chartType && <TLChart type={a.chartType} data={a.chartData}/>}
              {a.note && <div className="diet-fb-b-stats">{a.note}</div>}
            </DietAiCollapsibleSection>
          </div>
        );
      })()}
    </div>
  );
}

function V3RecordGroupCard({group, isNew}){
  if(group.vtAsync && window.VtAsyncRecordGroupCard){
    return <VtAsyncRecordGroupCard group={group} isNew={isNew} />;
  }
  return (
    <V3v2Card
      primary={group.primary}
      ai={group.ai}
      aiDefaultOpen={group.aiDefaultOpen}
      isNew={isNew}
      staggerReveal={!!group.staggerReveal}
      photoAnalysis={!!group.photoAnalysis}
      entryId={group.primary?.id || group.id}
    />
  );
}

Object.assign(window, {
  V3RecordGroupCard, V3v2Card, V3v2PrimaryBody, V3v2Header, TLChart, TLTag,
});
