// ============ 统一语音条 & 5/18 分析卡片 ============

const VOICE_WAVE_HEIGHTS = [6,11,16,9,13,7,17,12,8,15,10,18,9,14,7,12,16,8,13,6,11,15,9,7];
const MINI_WAVE_HEIGHTS = [4,7,9,6,8,5];

const CC_ICON = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAfACEDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAUHCAMG/8QAKhAAAgEDAwIDCQAAAAAAAAAAAQIDAAQRBQYhEjEHExQWJTJxgYKhsfH/xAAXAQEBAQEAAAAAAAAAAAAAAAACBQED/8QAHBEAAQUBAQEAAAAAAAAAAAAAAgABAwURBBJh/9oADAMBAAIRAxEAPwDZLEAZP7pdc6vYQTxwSTxiSQ9IGaNyytDod5IrYKwuQftNRGzknvr5LeMl5ZGzk9uaYjqsVlY3YJET4zK2prWnNcrbi5j8xk6wM96YRsrqCpyCM96hOu2t1o18IrnJJxyOx/lVHwyuXudrwNJIXIyAT86RDjJWFSPNCM0Zazr1FFFFclFSjeCO+278Rgl/TyYA7/Caz5oOtPpOqpdeWSUOCpPNaYYBhgjOR9KTy7a0KaVpJNJsXZjkkwAk02LFcqLaPijOOQPTEoVufdDa3cxOYuhIxwM9zmq94Q9fsdbs64LEn8mmw2tt7j3NY8HPEC03t4o4YwkcYjUDAUAACsck7O4h6oBgiDyzfdXSijFFFQF//9k=';

const SC_ICON = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAjACIDASIAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAAAAMHAQUIBv/EACkQAAEEAQMCBgIDAAAAAAAAAAEAAgMEEQUGEiExBxMUMmFxIkFRodH/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAgUDBv/EAB8RAAICAwACAwAAAAAAAAAAAAACAREDBAUSkSFBcf/aAAwDAQACEQMRAD8A7JPRRSWYIpmQySsbI/2tJ6n6UGvXDQ0i1cAyYYnPA+gqYGp6nq+pjjLJLYcfxw7t/gVqtmpzuW24rPdLBdzbVd1gwNmYZQMlmeuFMCqihrSwSiVu4GMtAgZAeW5/gv7KzdvzWptKhkt8fOIw4tOQfkfBRko57mjGvESrXHo2PVFhFBnmn3pDNY2tqMUDS6R1d/ED9nCpLbFqRtPVnQkiwyAFo/fHkOf9LoRwBGD2WjG09CbqR1FlFjLByC5pIyD3BCtWo2+Z1E1ML4nW7qfRT9PWq8m3LNF8wZMJRKzI93wPlWl4WTWJ9qQyWORBcfLJ7lueiil8ONsSXvVekeMnkYxIeGfpesqV4q0DIIGNZGwYa0DAASWs79Xp62zi8MKz8zc39fhJ0RMlFB50yiIgGEREAwiIgP/Z';

function TlCardTime({time}){
  if(!time) return null;
  return <div className="tl-card-time">{time}</div>;
}

const TYPEWRITER_MS = 68;

function segmentsFullText(segments){
  return (segments || []).map(s => s.text).join('');
}

function renderTypedSegments(segments, len){
  let left = len;
  const out = [];
  (segments || []).forEach((seg, i) => {
    if(left <= 0) return;
    const take = Math.min(left, seg.text.length);
    if(take <= 0) return;
    const chunk = seg.text.slice(0, take);
    left -= take;
    if(seg.bold) out.push(<b key={i}>{chunk}</b>);
    else out.push(<React.Fragment key={i}>{chunk}</React.Fragment>);
  });
  return out;
}

function TypewriterText({text, segments, active, charMs = TYPEWRITER_MS, onComplete, className}){
  const full = segments ? segmentsFullText(segments) : (text || '');
  const [len, setLen] = React.useState(active ? 0 : full.length);
  const doneRef = React.useRef(!active);
  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;

  React.useEffect(()=>{
    if(!active){
      setLen(full.length);
      if(!doneRef.current){
        doneRef.current = true;
        onCompleteRef.current?.();
      }
      return;
    }
    doneRef.current = false;
    setLen(0);
    if(!full.length){
      doneRef.current = true;
      onCompleteRef.current?.();
      return;
    }
    let i = 0;
    let timer = null;
    const tick = ()=>{
      i += 1;
      setLen(i);
      if(i >= full.length){
        doneRef.current = true;
        onCompleteRef.current?.();
        return;
      }
      timer = setTimeout(tick, charMs);
    };
    timer = setTimeout(tick, charMs);
    return ()=>{ if(timer) clearTimeout(timer); };
  }, [text, segments, active, charMs, full]);

  const showCursor = active && len < full.length;
  const content = segments ? renderTypedSegments(segments, len) : full.slice(0, len);

  return (
    <span className={className}>
      {content}
      {showCursor && <span className="tl-typewriter-cursor" aria-hidden="true"/>}
    </span>
  );
}

function TypewriterBody({text, active, onComplete, className}){
  if(!text) return null;
  if(!active){
    return <div className={className}>{text}</div>;
  }
  return (
    <div className={className}>
      <TypewriterText text={text} active onComplete={onComplete}/>
    </div>
  );
}

// ============ 记录标签体系 ============
// 分类 tone：period/flow→brand  symptom/care→coral  mood→lavender
//              sleep→sky  fitness/appetite/weight/diet→mint  care→sun

const TAG_TONES = {
  period:'brand', flow:'brand',
  symptom:'neutral', care:'neutral',
  mood:'neutral',
  sleep:'neutral',
  fitness:'neutral', appetite:'neutral', weight:'neutral', diet:'neutral',
};

const TAG_CAT_EMOJI = {
  period:'🩸', flow:'💧', symptom:'🤕', mood:'💭',
  sleep:'😴', fitness:'🏃', appetite:'🍽️',
  weight:'⚖️', diet:'🥗', care:'💆',
};

const TAG_REGISTRY = {
  '跑步':       { cat:'fitness', emoji:'🏃' },
  '愉快':       { cat:'mood',    emoji:'😊' },
  '食欲旺盛':   { cat:'appetite',emoji:'🍽️' },
  '食欲变化':   { cat:'appetite',emoji:'🍽️' },
  '腹胀':       { cat:'symptom', emoji:'😣' },
  '低落':       { cat:'mood',    emoji:'😔' },
  '心情 平静':  { cat:'mood',    emoji:'😌' },
  '腰酸':       { cat:'symptom', emoji:'🦴' },
  '疲惫':       { cat:'symptom', emoji:'😮‍💨' },
  '睡眠':       { cat:'sleep',   emoji:'😴' },
  '睡眠偏少':   { cat:'sleep',   emoji:'😴' },
  '月经来了':   { cat:'period',  emoji:'🩸' },
  '经量 偏少':  { cat:'flow',    emoji:'💧' },
  '经量正常':   { cat:'flow',    emoji:'💧' },
  '热敷':       { cat:'care',    emoji:'♨️' },
  '缓解':       { cat:'care',    emoji:'😌' },
  '体重':       { cat:'weight',  emoji:'⚖️' },
  '饮食':       { cat:'diet',    emoji:'🥗' },
  '卡路里':     { cat:'diet',    emoji:'🔥' },
  '经前':       { cat:'care',    emoji:'📅' },
  '经前提醒':   { cat:'care',    emoji:'📅' },
};

function inferTagCat(label){
  const s = label || '';
  if(/月经|经期/.test(s)) return 'period';
  if(/经量/.test(s)) return 'flow';
  if(/跑步|运动/.test(s)) return 'fitness';
  if(/食欲/.test(s)) return 'appetite';
  if(/腹胀|腰酸|疲惫|痛|不适/.test(s)) return 'symptom';
  if(/心情|愉快|低落|情绪|平静/.test(s)) return 'mood';
  if(/睡眠/.test(s)) return 'sleep';
  if(/体重/.test(s)) return 'weight';
  if(/饮食|卡路里/.test(s)) return 'diet';
  if(/热敷|缓解|经前/.test(s)) return 'care';
  return 'symptom';
}

function resolveTag(tag){
  const label = tag.label || '';
  const preset = TAG_REGISTRY[label] || {};
  const cat = tag.cat || preset.cat || inferTagCat(label);
  const emoji = tag.emoji || preset.emoji || TAG_CAT_EMOJI[cat] || '·';
  const tone = tag.tone || TAG_TONES[cat] || 'neutral';
  return { label, emoji, cat, tone };
}

function inferTagTone(label){
  return TAG_TONES[inferTagCat(label)] || 'neutral';
}

function tagLabel(t){
  const r = resolveTag(t);
  return r.emoji ? (r.emoji + ' ' + r.label) : r.label;
}

function RecordedTags({tags, layout}){
  const visible = (tags || []).filter(t => resolveTag(t).cat !== 'care');
  if(visible.length === 0) return null;
  const isRows = layout === 'rows';
  const isT5 = layout === 't5';
  return (
    <div className={'tl-tags'+(isRows ? ' tl-tags-rows' : '')+(isT5 ? ' tl-tags-t5' : '')}>
      {visible.map((t, i) => {
        const r = resolveTag(t);
        return (
          <span key={i} className={'tl-tag tone-'+r.tone+(isRows ? ' is-row':'')+(isT5 ? ' is-t5':'')}>
            {isT5 ? (
              tagLabel(t)
            ) : (
              <>
                <span className="tl-tag-ico" aria-hidden="true">{r.emoji}</span>
                {r.label}
              </>
            )}
          </span>
        );
      })}
    </div>
  );
}

function AiNoteSection({aiNote, embedded, typewriter, onTypeComplete}){
  if(!aiNote) return null;
  const tone = aiNote.tone || 'green';
  const icon = aiNote.icon || '💡';

  return (
    <div className={'tl-combo-ai'+(embedded?' tl-t5-ai-note':' '+tone+'-bg')}>
      <span className="tl-combo-ai-icon" aria-hidden="true">{icon}</span>
      <div className="tl-combo-ai-body">
        {aiNote.items?.length ? (
          <>
            <ul className="tl-combo-ai-list">
              {aiNote.items.map((line, i)=>(
                <li key={i}>{line}</li>
              ))}
            </ul>
            {aiNote.total && (
              <div className="tl-combo-ai-total">{aiNote.total}</div>
            )}
          </>
        ) : typewriter ? (
          <p className="tl-combo-ai-text">
            <TypewriterText text={aiNote.text} active onComplete={onTypeComplete}/>
          </p>
        ) : (
          <p className="tl-combo-ai-text">{aiNote.text}</p>
        )}
      </div>
    </div>
  );
}

function RecordPhoto({photo}){
  if(!photo) return null;
  if(photo.src){
    return (
      <div className="rec-img">
        <img className="rec-img-real" src={photo.src} alt={photo.alt || '记录照片'}/>
      </div>
    );
  }
  return (
    <div className="rec-img">
      <div className={'rec-img-ph '+(photo.tone || 'warm')}>
        {photo.emoji || '🌸'}
      </div>
    </div>
  );
}

function VoiceWave({playing, mini}){
  const heights = mini ? MINI_WAVE_HEIGHTS : VOICE_WAVE_HEIGHTS;
  return (
    <div className={'tl-voice-wave'+(mini?' is-mini':'')+(playing?' is-playing':'')} aria-hidden="true">
      {heights.map((h, i) => (
        <span key={i} style={{height: h + 'px', '--i': i}}/>
      ))}
    </div>
  );
}

function TlVoicePlayBtn({voice}){
  const [playing, setPlaying] = React.useState(false);
  const raw = voice?.duration || '0:00';
  const duration = /^\d+["″]?$/.test(raw)
    ? '0:'+String(parseInt(raw, 10)).padStart(2, '0')
    : raw;
  return (
    <button
      type="button"
      className={'tl-voice-pill'+(playing?' is-playing':'')}
      onClick={()=>setPlaying(p=>!p)}
      aria-label={playing?'暂停':'播放语音'}
    >
      <span className="tl-voice-pill-ico" aria-hidden="true">
        {playing ? (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="7" y="6" width="3.5" height="12" rx="0.8"/>
            <rect x="13.5" y="6" width="3.5" height="12" rx="0.8"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        )}
      </span>
      <VoiceWave playing={playing} mini/>
      <span className="tl-voice-pill-dur">{duration}</span>
    </button>
  );
}

function TlVoiceBar({voice}){
  return <TlVoicePlayBtn voice={voice}/>;
}

function TlVoiceInline({voice, text}){
  if(!voice && !text) return null;
  return (
    <div className={'tl-voice-block'+(voice?' has-voice-pill':'')}>
      <p className="tl-voice-text">
        {text}
        {voice && <TlVoicePlayBtn voice={voice}/>}
      </p>
    </div>
  );
}

function SegmentedRecordCard({entry, isNew, animateAnalysis, typewriterAiNote, analysisProps}){
  const tags = entry.tags || [];
  const hasTags = tags.some(t => resolveTag(t).cat !== 'care');
  const hasAiNote = !!entry.aiNote;
  const hasAnalysis = !!analysisProps;
  const hasVoice = !!entry.voice;
  const text = entry.voiceText || entry.body || '';
  const tagLayout = entry.tagLayout || 't5';
  const aiNoteTypewriter = !!(typewriterAiNote && hasAiNote);
  const analysisAnimateText = hasAnalysis && (
    !!animateAnalysis || (analysisProps.playAnimation > 0)
  );

  return (
    <div className={'tl-card tl-t5-card'+(isNew?' fade-in':'')}>
      <section className="tl-t5-main">
        {hasVoice ? (
          <TlVoiceInline voice={entry.voice} text={text}/>
        ) : text ? (
          <div className="tl-t5-body">{text}</div>
        ) : null}
        <RecordPhoto photo={entry.photo}/>
        {hasTags && (
          <div className="tl-t5-tags">
            <RecordedTags tags={tags} layout={tagLayout}/>
          </div>
        )}
      </section>

      {hasAiNote && (
        <>
          <div className="tl-t5-divider" role="separator"/>
          <section className="tl-t5-insight">
            <AiNoteSection
              aiNote={entry.aiNote}
              embedded
              typewriter={aiNoteTypewriter}
            />
          </section>
        </>
      )}

      {hasAnalysis && (
        <>
          <div className="tl-t5-divider" role="separator"/>
          <section className="tl-t5-insight" id="sister-analysis-anchor">
            <SisterAnalysisContent
              {...analysisProps}
              animateText={analysisAnimateText}
            />
          </section>
        </>
      )}
    </div>
  );
}

function VoiceRecordCard(props){
  return <SegmentedRecordCard {...props}/>;
}

const CYCLE_CHART_ANIM_MS = 4280; // zoom-pop @3580ms + 0.7s animation

function SisterCycleChart({animated, onComplete}){
  const bars = [
    {date:'上上次', status:'准时', width:'96.8%', label:'30天'},
    {date:'上次', status:'准时', width:'100%', label:'31天'},
    {date:'本次', status:'推迟2天', width:'93.5%', label:'29天', zoom:true},
  ];
  const done = !animated;
  const [headSeen, setHeadSeen] = React.useState(done);
  const [seenBars, setSeenBars] = React.useState(done ? [0, 1, 2] : []);
  const [grownBars, setGrownBars] = React.useState(done ? [0, 1, 2] : []);
  const [zoomPop, setZoomPop] = React.useState(done);
  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;

  React.useEffect(()=>{
    if(!animated){
      onCompleteRef.current?.();
      return;
    }
    setHeadSeen(false);
    setSeenBars([]);
    setGrownBars([]);
    setZoomPop(false);
    const timers = [
      setTimeout(()=>setHeadSeen(true), 60),
      setTimeout(()=>{ setSeenBars([0]); setGrownBars([0]); }, 320),
      setTimeout(()=>{ setSeenBars([0, 1]); setGrownBars([0, 1]); }, 1400),
      setTimeout(()=>{ setSeenBars([0, 1, 2]); setGrownBars([0, 1, 2]); }, 2480),
      setTimeout(()=>setZoomPop(true), 3580),
      setTimeout(()=>onCompleteRef.current?.(), CYCLE_CHART_ANIM_MS),
    ];
    return ()=>timers.forEach(clearTimeout);
  }, [animated]);

  return (
    <div className="chart-block" style={{background:'transparent', border:'none', padding:0}}>
      <div className={'cycle-card'+(!animated?' cycle-card--static':'')}>
        <div className={'cc-head cc-seg'+(headSeen?' seen':'')}>
          <span className="cc-title">
            <img className="cc-icon" src={CC_ICON} width="18" height="18" alt="" aria-hidden="true"/>
            最近3个周期
          </span>
        </div>
        <div className="cc-bars">
          {bars.map((b, i) => (
            <div key={i} className={'cc-bar-row cc-seg'+(seenBars.includes(i)?' seen':'')}>
              <span className="cc-bar-date">{b.date}</span>
              <span className="cc-bar-status">{b.status}</span>
              <div className="cc-bar-wrap">
                <div
                  className={'cc-bar'+(grownBars.includes(i)?' grow':'')}
                  style={{'--cc-target': b.width}}
                >
                  <span className={'cc-bar-label'+(b.zoom && zoomPop?' cc-zoom-target zoom-pop':'')}>{b.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SisterSignalCard({animated}){
  const lights = [
    {color:'green', label:'稳定', range:'21–35天'},
    {color:'yellow', label:'轻度波动', range:['18–20天','36–45天']},
    {color:'orange', label:'明显波动', range:['15–17天','46–90天']},
    {color:'purple', label:'建议关注', range:['<15天','>90天']},
  ];
  const done = !animated;
  const [activeColor, setActiveColor] = React.useState(done ? 'green' : null);
  const [isFinal, setIsFinal] = React.useState(done);

  React.useEffect(()=>{
    if(!animated) return;
    setActiveColor(null);
    setIsFinal(false);
    const sequence = ['green', 'yellow', 'orange', 'purple', 'green'];
    const STEP_MS = 380;
    let step = 0;
    let timer = null;

    function tick(){
      if(step >= sequence.length){
        setActiveColor('green');
        setIsFinal(true);
        return;
      }
      setActiveColor(sequence[step]);
      step += 1;
      timer = setTimeout(tick, STEP_MS);
    }
    tick();
    return ()=>{ if(timer) clearTimeout(timer); };
  }, [animated]);

  return (
    <div className="chart-block" style={{background:'transparent', border:'none', padding:0}}>
      <div className={'signal-card'+(animated && !isFinal?' sc-animating':'')}>
        <div className="sc-head">
          <span className="sc-title">
            <img className="sc-icon" src={SC_ICON} width="18" height="18" alt="" aria-hidden="true"/>
            周期天数评估
          </span>
        </div>
        <div className="sc-lights">
          {lights.map((l, i) => (
            <div
              key={i}
              className={'sc-light'+(l.color === 'green' && isFinal ? ' sc-final' : '')}
              data-light={l.color}
            >
              <div
                className={'sc-bulb'+(activeColor === l.color ? ' sc-on' : '')}
                data-color={l.color}
              />
              <div className="sc-label">{l.label}</div>
              <div className="sc-range">
                {Array.isArray(l.range)
                  ? l.range.map((line, j) => (
                      <React.Fragment key={j}>
                        {j > 0 && <br/>}
                        {line}
                      </React.Fragment>
                    ))
                  : l.range}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const SISTER_LEAD = '以下是本次月经情况的分析。先看一下你最近3个周期的情况：';

const SISTER_PARA1 = [
  { text:'你最近三次周期分别是' },
  { text:'30天、31天、29天', bold:true },
  { text:'，整体波动幅度很小，属于' },
  { text:'非常规律', bold:true },
  { text:'的状态。' },
];

const SISTER_CLOSING = [
  { text:'这次周期天数落在' },
  { text:'21–35天的理想范围', bold:true },
  { text:'内。很棒哦，继续保持现在的健康生活节奏就可以。' },
];

function SisterAnalysisContent({playAnimation, onCycleComplete, animateText}){
  const [animated, setAnimated] = React.useState(false);
  const [leadDone, setLeadDone] = React.useState(!animateText);
  const [chartDone, setChartDone] = React.useState(!animateText);
  const [para1Done, setPara1Done] = React.useState(!animateText);
  const [showSignal, setShowSignal] = React.useState(!playAnimation && !animateText);
  const [showClosing, setShowClosing] = React.useState(!playAnimation && !animateText);
  const [closingDone, setClosingDone] = React.useState(!animateText);
  const prevPlayRef = React.useRef(playAnimation);
  const onCycleCompleteRef = React.useRef(onCycleComplete);
  onCycleCompleteRef.current = onCycleComplete;

  React.useEffect(()=>{
    if(!animateText){
      setLeadDone(true);
      setChartDone(true);
      setPara1Done(true);
      setClosingDone(true);
      onCycleCompleteRef.current?.();
      return;
    }
    if(playAnimation > prevPlayRef.current){
      setLeadDone(false);
      setChartDone(false);
      setPara1Done(false);
      setClosingDone(false);
      setShowSignal(false);
      setShowClosing(false);
      setAnimated(false);
    }
    prevPlayRef.current = playAnimation;
  }, [animateText, playAnimation]);

  React.useEffect(()=>{
    if(!playAnimation) return;
    if(animateText && !leadDone) return;
    setAnimated(true);
    setShowSignal(false);
    setShowClosing(false);
  }, [playAnimation, animateText, leadDone]);

  React.useEffect(()=>{
    if(!animateText || !para1Done) return;
    const delay = playAnimation ? 480 : 320;
    const t = setTimeout(()=>setShowSignal(true), delay);
    return ()=>clearTimeout(t);
  }, [animateText, para1Done, playAnimation]);

  React.useEffect(()=>{
    if(!animateText || !showSignal) return;
    const delay = playAnimation ? 2400 : 880;
    const t = setTimeout(()=>setShowClosing(true), delay);
    return ()=>clearTimeout(t);
  }, [animateText, showSignal, playAnimation]);

  React.useEffect(()=>{
    if(!animateText || !showClosing || !closingDone) return;
    onCycleCompleteRef.current?.();
  }, [animateText, showClosing, closingDone]);

  const showChart = !animateText || leadDone;
  const showPara1 = !animateText || (leadDone && chartDone);

  return (
    <div className="tl-t5-analysis-body">
      <p className="tl-t5-analysis-lead">
        {animateText && !leadDone ? (
          <TypewriterText text={SISTER_LEAD} active onComplete={()=>setLeadDone(true)}/>
        ) : SISTER_LEAD}
      </p>
      {showChart && (
        <SisterCycleChart
          animated={animated}
          onComplete={()=>setChartDone(true)}
        />
      )}
      {showPara1 && (
        <p className="tl-t5-analysis-text">
          {animateText && !para1Done ? (
            <TypewriterText
              segments={SISTER_PARA1}
              active
              onComplete={()=>setPara1Done(true)}
            />
          ) : (
            renderTypedSegments(SISTER_PARA1, segmentsFullText(SISTER_PARA1).length)
          )}
        </p>
      )}
      {showSignal && (!animateText || para1Done) && (
        <>
          <div className="tl-t5-chart-divider" role="separator"/>
          <SisterSignalCard animated={animated}/>
        </>
      )}
      {showClosing && (!animateText || para1Done) && (
        <p className="tl-t5-analysis-text">
          {animateText && !closingDone ? (
            <TypewriterText
              segments={SISTER_CLOSING}
              active
              onComplete={()=>setClosingDone(true)}
            />
          ) : (
            renderTypedSegments(SISTER_CLOSING, segmentsFullText(SISTER_CLOSING).length)
          )}
        </p>
      )}
    </div>
  );
}

function SisterAnalysisCard({playAnimation, onCycleComplete}){
  return (
    <div className="sister-bubble" id="sister-analysis-anchor">
      <SisterAnalysisContent
        playAnimation={playAnimation}
        onCycleComplete={onCycleComplete}
      />
    </div>
  );
}

Object.assign(window, {
  TlCardTime, TypewriterText, TypewriterBody, TlVoiceBar, TlVoicePlayBtn, TlVoiceInline, RecordedTags, AiNoteSection, RecordPhoto, resolveTag,
  SegmentedRecordCard, VoiceRecordCard, SisterAnalysisCard, SisterAnalysisContent,
});
