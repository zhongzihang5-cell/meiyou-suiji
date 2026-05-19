// ============ 统一语音条 & 5/18 分析卡片 ============

const VOICE_WAVE_HEIGHTS = [6,11,16,9,13,7,17,12,8,15,10,18,9,14,7,12,16,8,13,6,11,15,9,7];

const CC_ICON = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAfACEDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAUHCAMG/8QAKhAAAgEDAwIDCQAAAAAAAAAAAQIDAAQRBQYhEjEHExQWJTJxgYKhsfH/xAAXAQEBAQEAAAAAAAAAAAAAAAACBQED/8QAHBEAAQUBAQEAAAAAAAAAAAAAAgABAwURBBJh/9oADAMBAAIRAxEAPwDZLEAZP7pdc6vYQTxwSTxiSQ9IGaNyytDod5IrYKwuQftNRGzknvr5LeMl5ZGzk9uaYjqsVlY3YJET4zK2prWnNcrbi5j8xk6wM96YRsrqCpyCM96hOu2t1o18IrnJJxyOx/lVHwyuXudrwNJIXIyAT86RDjJWFSPNCM0Zazr1FFFFclFSjeCO+278Rgl/TyYA7/Caz5oOtPpOqpdeWSUOCpPNaYYBhgjOR9KTy7a0KaVpJNJsXZjkkwAk02LFcqLaPijOOQPTEoVufdDa3cxOYuhIxwM9zmq94Q9fsdbs64LEn8mmw2tt7j3NY8HPEC03t4o4YwkcYjUDAUAACsck7O4h6oBgiDyzfdXSijFFFQF//9k=';

const SC_ICON = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAjACIDASIAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAAAAMHAQUIBv/EACkQAAEEAQMCBgIDAAAAAAAAAAEAAgMEEQUGEiExBxMUMmFxIkFRodH/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAgUDBv/EAB8RAAICAwACAwAAAAAAAAAAAAACAREDBAUSkSFBcf/aAAwDAQACEQMRAD8A7JPRRSWYIpmQySsbI/2tJ6n6UGvXDQ0i1cAyYYnPA+gqYGp6nq+pjjLJLYcfxw7t/gVqtmpzuW24rPdLBdzbVd1gwNmYZQMlmeuFMCqihrSwSiVu4GMtAgZAeW5/gv7KzdvzWptKhkt8fOIw4tOQfkfBRko57mjGvESrXHo2PVFhFBnmn3pDNY2tqMUDS6R1d/ED9nCpLbFqRtPVnQkiwyAFo/fHkOf9LoRwBGD2WjG09CbqR1FlFjLByC5pIyD3BCtWo2+Z1E1ML4nW7qfRT9PWq8m3LNF8wZMJRKzI93wPlWl4WTWJ9qQyWORBcfLJ7lueiil8ONsSXvVekeMnkYxIeGfpesqV4q0DIIGNZGwYa0DAASWs79Xp62zi8MKz8zc39fhJ0RMlFB50yiIgGEREAwiIgP/Z';

function TlCardTime({time}){
  if(!time) return null;
  return <div className="tl-card-time">{time}</div>;
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
  return (
    <>
      <div className="tl-extract-label">已记录</div>
      <div className={'tl-tags'+(isRows ? ' tl-tags-rows' : '')}>
        {visible.map((t, i) => {
          const r = resolveTag(t);
          return (
            <span key={i} className={'tl-tag tone-'+r.tone+(isRows ? ' is-row':'')}>
              <span className="tl-tag-ico" aria-hidden="true">{r.emoji}</span>
              {r.label}
            </span>
          );
        })}
      </div>
    </>
  );
}

function AiNoteSection({aiNote}){
  if(!aiNote) return null;
  const tone = aiNote.tone || 'green';
  const icon = aiNote.icon || '💡';

  return (
    <div className={'tl-combo-ai '+tone+'-bg'}>
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

function VoiceWave({playing}){
  return (
    <div className={'tl-voice-wave'+(playing?' is-playing':'')} aria-hidden="true">
      {VOICE_WAVE_HEIGHTS.map((h, i) => (
        <span key={i} style={{height: h + 'px', '--i': i}}/>
      ))}
    </div>
  );
}

function TlVoiceBar({voice}){
  const [playing, setPlaying] = React.useState(false);
  const duration = voice?.duration || '0:00';
  return (
    <div className="tl-voice-bar">
      <button
        type="button"
        className="tl-voice-play"
        onClick={()=>setPlaying(p=>!p)}
        aria-label={playing?'暂停':'播放语音'}
      >
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </button>
      <VoiceWave playing={playing}/>
      <div className="tl-voice-dur">{duration}</div>
    </div>
  );
}

function VoiceRecordCard({item}){
  const voiceText = item.voiceText || '';

  return (
    <div className="tl-card">
      {item.voice && <TlVoiceBar voice={item.voice}/>}
      <div className="tl-voice-text">{voiceText}</div>
      <RecordedTags tags={item.tags}/>
    </div>
  );
}

function SisterCycleChart({animated}){
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

  React.useEffect(()=>{
    if(!animated) return;
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

function SisterAnalysisCard({playAnimation, onCycleComplete}){
  const [animated, setAnimated] = React.useState(false);
  const [showSignal, setShowSignal] = React.useState(!playAnimation);
  const [showClosing, setShowClosing] = React.useState(!playAnimation);

  React.useEffect(()=>{
    if(!playAnimation){
      onCycleComplete?.();
      return;
    }
    setAnimated(true);
    setShowSignal(false);
    setShowClosing(false);
    const t1 = setTimeout(()=>setShowSignal(true), 3600);
    const t2 = setTimeout(()=>setShowClosing(true), 5800);
    const t3 = setTimeout(()=>onCycleComplete?.(), 5800);
    return ()=>{ clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [playAnimation, onCycleComplete]);

  return (
    <div className="sister-bubble" id="sister-analysis-anchor">
      <p>以下是本次月经情况的分析。先看一下你最近3个周期的情况：</p>
      <SisterCycleChart animated={animated}/>
      <p>你最近三次周期分别是<b>30天、31天、29天</b>，整体波动幅度很小，属于<b>非常规律</b>的状态。</p>
      {showSignal && <SisterSignalCard animated={animated}/>}
      {showClosing && (
        <p>这次周期天数落在<b>21–35天的理想范围</b>内。很棒哦，继续保持现在的健康生活节奏就可以。</p>
      )}
    </div>
  );
}

Object.assign(window, {
  TlCardTime, TlVoiceBar, RecordedTags, AiNoteSection, RecordPhoto, resolveTag,
  VoiceRecordCard, SisterAnalysisCard,
});
