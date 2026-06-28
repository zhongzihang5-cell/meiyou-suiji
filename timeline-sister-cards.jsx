// ============ 统一语音条 & 5/18 分析卡片 ============

const VOICE_WAVE_HEIGHTS = [6,11,16,9,13,7,17,12,8,15,10,18,9,14,7,12,16,8,13,6,11,15,9,7];
const MINI_WAVE_HEIGHTS = [4, 8, 11, 7, 5];
const COMPACT_WAVE_HEIGHTS = [4, 8, 10, 7, 5];

const CC_ICON = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAfACEDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAUHCAMG/8QAKhAAAgEDAwIDCQAAAAAAAAAAAQIDAAQRBQYhEjEHExQWJTJxgYKhsfH/xAAXAQEBAQEAAAAAAAAAAAAAAAACBQED/8QAHBEAAQUBAQEAAAAAAAAAAAAAAgABAwURBBJh/9oADAMBAAIRAxEAPwDZLEAZP7pdc6vYQTxwSTxiSQ9IGaNyytDod5IrYKwuQftNRGzknvr5LeMl5ZGzk9uaYjqsVlY3YJET4zK2prWnNcrbi5j8xk6wM96YRsrqCpyCM96hOu2t1o18IrnJJxyOx/lVHwyuXudrwNJIXIyAT86RDjJWFSPNCM0Zazr1FFFFclFSjeCO+278Rgl/TyYA7/Caz5oOtPpOqpdeWSUOCpPNaYYBhgjOR9KTy7a0KaVpJNJsXZjkkwAk02LFcqLaPijOOQPTEoVufdDa3cxOYuhIxwM9zmq94Q9fsdbs64LEn8mmw2tt7j3NY8HPEC03t4o4YwkcYjUDAUAACsck7O4h6oBgiDyzfdXSijFFFQF//9k=';

const SC_ICON = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAjACIDASIAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAAAAMHAQUIBv/EACkQAAEEAQMCBgIDAAAAAAAAAAEAAgMEEQUGEiExBxMUMmFxIkFRodH/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAgUDBv/EAB8RAAICAwACAwAAAAAAAAAAAAACAREDBAUSkSFBcf/aAAwDAQACEQMRAD8A7JPRRSWYIpmQySsbI/2tJ6n6UGvXDQ0i1cAyYYnPA+gqYGp6nq+pjjLJLYcfxw7t/gVqtmpzuW24rPdLBdzbVd1gwNmYZQMlmeuFMCqihrSwSiVu4GMtAgZAeW5/gv7KzdvzWptKhkt8fOIw4tOQfkfBRko57mjGvESrXHo2PVFhFBnmn3pDNY2tqMUDS6R1d/ED9nCpLbFqRtPVnQkiwyAFo/fHkOf9LoRwBGD2WjG09CbqR1FlFjLByC5pIyD3BCtWo2+Z1E1ML4nW7qfRT9PWq8m3LNF8wZMJRKzI93wPlWl4WTWJ9qQyWORBcfLJ7lueiil8ONsSXvVekeMnkYxIeGfpesqV4q0DIIGNZGwYa0DAASWs79Xp62zi8MKz8zc39fhJ0RMlFB50yiIgGEREAwiIgP/Z';

function TlRecKindIcon({kind}){
  const I = window.Icon;
  const p = { size:12, stroke:1.8 };
  if(kind === 'voice') return <I name="mic" {...p}/>;
  if(kind === 'sync'){
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 12a8 8 0 0113.5-5.9M20 4v4h-4"/>
        <path d="M20 12a8 8 0 01-13.5 5.9M4 20v-4h4"/>
      </svg>
    );
  }
  if(kind === 'diet' || kind === 'photo') return <I name="camera" {...p}/>;
  if(kind === 'ai'){
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19V5M4 19h16M8 17V9M12 17V7M16 17v-4"/>
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h10"/>
    </svg>
  );
}

function inferRecordKind(entry){
  if(!entry) return { kind:'text', label:'文字' };
  if(entry.cardLabel){
    return { kind: entry.cardLabelKind || 'ai', label: entry.cardLabel };
  }
  if(entry.kind === 'sync-card'){
    return { kind:'sync', label:'自动同步' };
  }
  if(entry.voice || entry.kind === 'voice-card'){
    return { kind:'voice', label:'语音' };
  }
  if(entry.photo){
    return { kind:'diet', label:'饮食' };
  }
  if(entry.kind === 'wellness'){
    return { kind:'ai', label:'AI 分析' };
  }
  if(entry.kind === 'weekly'){
    const range = entry.range ? ' · '+entry.range : '';
    return { kind:'ai', label:'周报'+range };
  }
  if(entry.kind === 'sister-card'){
    return { kind:'ai', label:'本次周期分析' };
  }
  return { kind:'text', label:'文字' };
}

/** 卡片右上角 ··· 更多菜单 */
function CardMoreMenu({delayMs = 0, entryId, entryKind, onEdit}){
  const [open, setOpen] = React.useState(false);
  const [visible, setVisible] = React.useState(!delayMs);
  const wrapRef = React.useRef(null);

  React.useEffect(()=>{
    if(!delayMs){ setVisible(true); return; }
    const tm = setTimeout(()=>setVisible(true), delayMs);
    return ()=>clearTimeout(tm);
  }, [delayMs]);

  React.useEffect(()=>{
    if(!open) return;
    const handler = (e)=>{
      if(wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    // 延一帧注册，避免当次 click 同步触发 capture 关闭
    const raf = requestAnimationFrame(()=>{
      document.addEventListener('pointerdown', handler);
    });
    return ()=>{
      cancelAnimationFrame(raf);
      document.removeEventListener('pointerdown', handler);
    };
  }, [open]);

  return (
    <div className={'card-more-wrap'+(visible ? ' is-visible' : '')} ref={wrapRef}>
      <button
        type="button"
        className="card-more-btn"
        onClick={()=>{ if(visible) setOpen(v=>!v); }}
        aria-label="更多操作"
        aria-expanded={open}
        tabIndex={visible ? 0 : -1}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="3" cy="8" r="1.4"/>
          <circle cx="8" cy="8" r="1.4"/>
          <circle cx="13" cy="8" r="1.4"/>
        </svg>
      </button>
      {open && (
        <div className="card-more-menu">
          <button type="button" className="card-more-menu-item" onClick={()=>{ setOpen(false); onEdit?.(entryId, entryKind); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <span>编辑</span>
          </button>
          <button type="button" className="card-more-menu-item card-more-menu-item--danger" onClick={()=>setOpen(false)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            <span>删除</span>
          </button>
        </div>
      )}
    </div>
  );
}

function TlRecCardHead({time, isNew, entryId, entryKind, onEdit}){
  if(!time) return null;
  return (
    <div className="tl-rec-card-hd">
      <span className="tl-rec-card-time">{time}</span>
      <CardMoreMenu delayMs={isNew ? 600 : 0} entryId={entryId} entryKind={entryKind} onEdit={onEdit}/>
    </div>
  );
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

function measureFeedBottomReserve(stream){
  if(!stream) return 280;
  const streamRect = stream.getBoundingClientRect();
  let reserve = 220;

  const phone = stream.closest('.phone');
  const fab = phone?.querySelector('.quick-card-fab:not(.is-covered)');
  if(fab){
    const fabRect = fab.getBoundingClientRect();
    if(fabRect.height > 0){
      reserve = Math.max(reserve, streamRect.bottom - fabRect.top + 28);
    }
  }

  const dock = phone?.querySelector('.dock-wrap');
  if(dock){
    const dockRect = dock.getBoundingClientRect();
    reserve = Math.max(reserve, streamRect.bottom - dockRect.top + 16);
  }

  return reserve;
}

function scrollFeedContentIntoView(el, bottomReserve){
  if(!el) return;
  const stream = el.closest('.suiji-stream');
  if(!stream) return;
  const streamRect = stream.getBoundingClientRect();
  const target = el.querySelector?.('.tl-typewriter-cursor') || el;
  const targetRect = target.getBoundingClientRect();
  const reserve = bottomReserve ?? measureFeedBottomReserve(stream);
  const visibleBottom = streamRect.bottom - reserve;
  if(targetRect.bottom > visibleBottom){
    stream.scrollTop += targetRect.bottom - visibleBottom + 20;
  }
}

function TypewriterText({text, segments, active, charMs = TYPEWRITER_MS, onComplete, className, followScroll = false}){
  const full = segments ? segmentsFullText(segments) : (text || '');
  const [len, setLen] = React.useState(active ? 0 : full.length);
  const doneRef = React.useRef(!active);
  const onCompleteRef = React.useRef(onComplete);
  const rootRef = React.useRef(null);
  onCompleteRef.current = onComplete;

  React.useLayoutEffect(()=>{
    if(!active || !followScroll || !rootRef.current) return;
    scrollFeedContentIntoView(rootRef.current);
  }, [len, active, followScroll]);

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
    <span ref={rootRef} className={className}>
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
  const isV3 = layout === 'v3' || ((tags || []).length > 0 && (tags || []).every(t => t.cat && t.icon && t.val !== undefined));
  if(isV3){
    const visible = (tags || []).filter(t => t.cat !== 'care');
    if(visible.length === 0) return null;
    const TLTag = window.TLTag;
    if(!TLTag) return null;
    return (
      <div className="tl-tags tl-tags-v3">
        {visible.map((t, i)=><TLTag key={i} tag={t}/>)}
      </div>
    );
  }
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
            <TypewriterText text={aiNote.text} active followScroll onComplete={onTypeComplete}/>
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

function VoiceWave({playing, mini, compact}){
  const heights = compact
    ? COMPACT_WAVE_HEIGHTS
    : (mini ? MINI_WAVE_HEIGHTS : VOICE_WAVE_HEIGHTS);
  return (
    <div className={'tl-voice-wave'+(mini?' is-mini':'')+(playing?' is-playing':'')} aria-hidden="true">
      {heights.map((h, i) => (
        <span key={i} style={{height: h + 'px', '--i': i}}/>
      ))}
    </div>
  );
}

function formatVoiceDuration(raw, compact) {
  const s = String(raw || '0');
  if (!compact) {
    if (/^\d+["″']?$/.test(s)) {
      return '0:' + String(parseInt(s, 10)).padStart(2, '0');
    }
    return s;
  }
  let sec = 0;
  if (/^\d+["″']?$/.test(s)) {
    sec = parseInt(s, 10);
  } else {
    const m = s.match(/^(\d+):(\d+)$/);
    if (m) sec = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    else if (/^\d+$/.test(s)) sec = parseInt(s, 10);
  }
  return sec + '″';
}

function TlVoicePlayBtn({voice, compact}){
  const [playing, setPlaying] = React.useState(false);
  const duration = formatVoiceDuration(voice?.duration || '0:00', compact);
  return (
    <button
      type="button"
      className={'tl-voice-pill'+(playing?' is-playing':'')+(compact?' is-compact':'')}
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
          <svg viewBox="0 0 12 12" fill="currentColor">
            <path d="M3.4 1.6c.3-.2.7-.2 1 .1l5.6 3.6c.3.2.3.7 0 .9l-5.6 3.6c-.3.2-.7.2-1-.1-.2-.2-.4-.5-.4-.8V2.4c0-.3.2-.6.4-.8z"/>
          </svg>
        )}
      </span>
      {!compact ? <VoiceWave playing={playing} mini compact={compact}/> : null}
      <span className="tl-voice-pill-dur">{duration}</span>
    </button>
  );
}

function TlVoiceBar({voice}){
  return <TlVoicePlayBtn voice={voice}/>;
}

function TlVoiceInline({voice, text}){
  if(!voice && !text) return null;
  if(!voice){
    return text ? (
      <div className="tl-voice-block">
        <span className="tl-voice-text">{text}</span>
      </div>
    ) : null;
  }
  return (
    <div className="tl-voice-block has-voice-pill">
      <TlVoicePlayBtn voice={voice} compact/>
      {text && <span className="tl-voice-text">{text}</span>}
    </div>
  );
}

/** 演示专用：语音原文 + 流式打字 + 标签依次出现 */
function DemoVoiceCard({entry, isNew}){
  const TLTag = window.TLTag;
  const [typedLen, setTypedLen] = React.useState(0);
  const [typeDone, setTypeDone] = React.useState(false);
  const [showTags, setShowTags] = React.useState([]);
  const fullText = entry._demoFullText || '';
  const demoTags = entry._demoTags || [];

  React.useEffect(()=>{
    if(!entry._demoTypewriter || !fullText) return;
    let i = 0;
    const iv = setInterval(()=>{
      i++;
      setTypedLen(i);
      if(i >= fullText.length){
        clearInterval(iv);
        setTypeDone(true);
        // 400ms 后开始显示标签
        setTimeout(()=>{
          demoTags.forEach((_,idx)=>{
            setTimeout(()=>{
              setShowTags(prev=>[...prev, idx]);
              // 最后一个标签出现后通知阶段 6
              if(idx === demoTags.length - 1){
                setTimeout(()=>{
                  window.dispatchEvent(new Event('demoTypewriterDone'));
                }, 200);
              }
            }, idx * 120);
          });
        }, 400);
      }
    }, 60);
    return ()=>clearInterval(iv);
  }, [entry._demoTypewriter, fullText]);

  return (
    <div className={'tl-card tl-t5-card'+(isNew?' tl-demo-expand':'')} data-entry-id={entry.id}>
      <TlRecCardHead time={entry.time} isNew={isNew} entryId={entry.id} entryKind="mixed" onEdit={window.openEditModal}/>
      <section className="tl-t5-main">
        <div className="tl-t5-body" style={{minHeight:24, lineHeight:'1.6', fontSize:15}}>
          {fullText.substring(0, typedLen)}
          {!typeDone && <span className="ai-caret"/>}
        </div>
        {showTags.length > 0 && (
          <div className="tl-t5-tags" style={{display:'flex', gap:6, flexWrap:'wrap', marginTop:10}}>
            {demoTags.map((tag, i)=>(
              showTags.includes(i) ? (
                <span key={i} className="tl-demo-tag-in" style={{animationDelay:(i * 0.12)+'s'}}>
                  <TLTag tag={tag}/>
                </span>
              ) : null
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PeriodSummaryIcon({type}){
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 22 22',
    fill: 'none',
    'aria-hidden': 'true',
  };
  if(type === 'flow'){
    return (
      <svg {...common}>
        <path d="M11 2.8c.8 3.2 5.8 6.4 5.8 10.8a5.8 5.8 0 1 1-11.6 0C5.2 9.2 10.2 6 11 2.8Z" fill="#ff6aa0"/>
        <path d="M7.8 13.2c1.8 1.8 4.5 1.8 6.4 0" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    );
  }
  if(type === 'color'){
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="8" fill="#ff6aa0"/>
        <circle cx="7.8" cy="8.2" r="1.3" fill="#fff" opacity=".8"/>
        <circle cx="13.8" cy="7.8" r="1" fill="#fff" opacity=".74"/>
        <circle cx="15.2" cy="12.4" r="1.2" fill="#fff" opacity=".68"/>
        <path d="M8.4 14.3c1.2 1 3.5 1 4.8-.1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if(type === 'cramps'){
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="8" fill="#ff6aa0"/>
        <path d="M12.3 5.8 8.5 11h3.1l-1.8 5.2 4-6h-3.1l1.6-4.4Z" fill="#fff"/>
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M11 2.8c.8 3.2 5.8 6.4 5.8 10.8a5.8 5.8 0 1 1-11.6 0C5.2 9.2 10.2 6 11 2.8Z" fill="#ff6aa0"/>
      <path d="M8 14.1c1.7 1.4 4.2 1.4 6 0" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
}

function PeriodRecordSummary({entry}){
  const details = entry.periodDetails || [];
  const rows = [
    { label: entry.periodSummaryLabel || '月经来了', icon: 'period' },
    ...details,
  ];
  return (
    <section className="tl-period-summary" aria-label="月经记录">
      {rows.map((row, index) => (
        <div key={`${row.label}-${index}`} className="tl-period-summary-row">
          <span className="tl-period-summary-icon">
            <PeriodSummaryIcon type={row.icon}/>
          </span>
          <span className="tl-period-summary-text">
            {row.value ? `${row.label}： ${row.value}` : row.label}
          </span>
        </div>
      ))}
    </section>
  );
}

function SegmentedRecordCard({entry, isNew, animateAnalysis, typewriterAiNote, typewriterBody, hideBodyUntilDrop, analysisProps}){
  // 演示专用语音卡片
  if(entry._demoTypewriter) return <DemoVoiceCard entry={entry} isNew={isNew}/>;

  const tags = entry.tags || []
  const hasTags = tags.some(t => resolveTag(t).cat !== 'care');
  const hasAiNote = !!entry.aiNote;
  const hasAnalysis = !!analysisProps;
  const hasVoice = !!entry.voice;
  const isVtLive = !!entry.vtLive;
  const isPeriodSync = entry.kind === 'sync-card' && (entry.tags || []).some((tag) => (
    resolveTag(tag).cat === 'period' || tag.cat === '月经' || tag.icon === 'period'
  ));
  const text = isVtLive ? (entry.liveText || '') : (entry.voiceText || entry.body || '');
  const tagLayout = entry.tagLayout || 't5';
  const aiNoteTypewriter = !!(typewriterAiNote && hasAiNote);
  const analysisAnimateText = hasAnalysis && !entry.instantAnalysis && (
    !!animateAnalysis || (analysisProps.playAnimation > 0)
  );

  return (
    <div className={'tl-card tl-t5-card'+(isNew?' fade-in':'')+(hasAnalysis?' has-sister-analysis':'')+(isVtLive?' is-vt-live':'')+(isPeriodSync?' has-period-summary':'')} data-entry-id={entry.id}>
      <TlRecCardHead time={entry.time} isNew={isNew} entryId={entry.id} entryKind={entry.voice ? 'mixed' : entry.photo ? 'image' : entry.body ? 'text' : 'quick'} onEdit={window.openEditModal}/>
      {isPeriodSync ? (
        <PeriodRecordSummary entry={entry}/>
      ) : (
        <section className="tl-t5-main">
          {isVtLive ? (
            <div className="tl-voice-block tl-vt-live-body">
              {text ? (
                <span className="tl-voice-text">{text}<span className="ai-caret" /></span>
              ) : (
                <span className="tl-vt-live-placeholder">正在听…</span>
              )}
            </div>
          ) : hasVoice ? (
            <TlVoiceInline voice={entry.voice} text={text}/>
          ) : hideBodyUntilDrop ? (
            <div className="tl-t5-body tl-t5-body--pending" aria-hidden="true"/>
          ) : text ? (
            typewriterBody ? (
              <div className="tl-t5-body">
                <TypewriterText text={text} active charMs={48} followScroll/>
              </div>
            ) : (
              <div className="tl-t5-body">{text}</div>
            )
          ) : null}
          <RecordPhoto photo={entry.photo}/>
          {hasTags && (
            <div className="tl-t5-tags">
              <RecordedTags tags={tags} layout={tagLayout}/>
            </div>
          )}
        </section>
      )}

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
        <SisterAnalysisCollapsible
          {...analysisProps}
          periodStyle={isPeriodSync}
          animateText={analysisAnimateText}
        />
      )}
    </div>
  );
}

function VoiceRecordCard(props){
  return <SegmentedRecordCard {...props}/>;
}

const CYCLE_CHART_ANIM_MS = 4280; // zoom-pop @3580ms + 0.7s animation

function SisterCycleChart({animated, onComplete, staticView = false}){
  const bars = [
    {date:'上上次', status:'准时', width:'96.8%', label:'30天'},
    {date:'上次', status:'准时', width:'100%', label:'31天'},
    {date:'本次', status:'推迟2天', width:'93.5%', label:'29天', zoom:true},
  ];
  const done = staticView || !animated;
  const [headSeen, setHeadSeen] = React.useState(done);
  const [seenBars, setSeenBars] = React.useState(done ? [0, 1, 2] : []);
  const [grownBars, setGrownBars] = React.useState(done ? [0, 1, 2] : []);
  const [zoomPop, setZoomPop] = React.useState(done);
  const chartRef = React.useRef(null);
  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;

  React.useLayoutEffect(()=>{
    if(staticView || !animated) return;
    requestAnimationFrame(()=>scrollFeedContentIntoView(chartRef.current));
  }, [animated, staticView, headSeen, seenBars, grownBars, zoomPop]);

  React.useEffect(()=>{
    if(staticView){
      onCompleteRef.current?.();
      return;
    }
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
      setTimeout(()=>onCompleteRef.current?.(), CYCLE_CHART_ANIM_MS),
    ];
    return ()=>timers.forEach(clearTimeout);
  }, [animated, staticView]);

  return (
    <div className="chart-block" ref={chartRef} style={{background:'transparent', border:'none', padding:0}}>
      <div className={'cycle-card'+(!animated?' cycle-card--static':'')}>
        <div className={'cc-head cc-seg'+(headSeen?' seen':'')}>
          <span className="cc-title">
            <img className="cc-icon" src={CC_ICON} width="16" height="16" alt="" aria-hidden="true"/>
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

const PERIOD_END_CHART_ANIM_MS = 4280;

function PeriodEndCycleChart({animated, onComplete, staticView = false}){
  const bars = [
    {date:'上上次', width:'62.5%', label:'5'},
    {date:'上次', width:'75%', label:'6'},
    {date:'本次', width:'100%', label:'8', zoom:true, tone:'warning'},
  ];
  const done = staticView || !animated;
  const [headSeen, setHeadSeen] = React.useState(done);
  const [seenBars, setSeenBars] = React.useState(done ? [0, 1, 2] : []);
  const [grownBars, setGrownBars] = React.useState(done ? [0, 1, 2] : []);
  const [zoomPop, setZoomPop] = React.useState(done);
  const chartRef = React.useRef(null);
  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;

  React.useLayoutEffect(()=>{
    if(staticView || !animated) return;
    requestAnimationFrame(()=>scrollFeedContentIntoView(chartRef.current));
  }, [animated, staticView, headSeen, seenBars, grownBars, zoomPop]);

  React.useEffect(()=>{
    if(staticView){
      onCompleteRef.current?.();
      return;
    }
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
      setTimeout(()=>onCompleteRef.current?.(), PERIOD_END_CHART_ANIM_MS),
    ];
    return ()=>timers.forEach(clearTimeout);
  }, [animated, staticView]);

  return (
    <div className="chart-block" ref={chartRef} style={{background:'transparent', border:'none', padding:0}}>
      <div className={'cycle-card period-end-cycle-card'+(!animated?' cycle-card--static':'')}>
        <div className={'cc-head cc-seg'+(headSeen?' seen':'')}>
          <span className="cc-title">
            <img className="cc-icon" src={CC_ICON} width="16" height="16" alt="" aria-hidden="true"/>
            最近3次经期
          </span>
        </div>
        <div className="cc-bars">
          {bars.map((b, i) => (
            <div key={i} className={'cc-bar-row cc-seg'+(seenBars.includes(i)?' seen':'')}>
              <div className="cc-bar-wrap">
                <div
                  className={'cc-bar'+(b.tone === 'warning' ? ' is-warning' : '')+(grownBars.includes(i)?' grow':'')}
                  style={{'--cc-target': b.width}}
                >
                  <span className={'cc-bar-label'+(b.zoom && zoomPop?' cc-zoom-target zoom-pop':'')}>{b.label}</span>
                </div>
              </div>
              <span className="cc-bar-date">{b.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PeriodForecastCard({animated, onComplete, staticView = false}){
  const cardRef = React.useRef(null);
  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;

  React.useLayoutEffect(()=>{
    if(staticView || !animated) return;
    requestAnimationFrame(()=>scrollFeedContentIntoView(cardRef.current));
  }, [animated, staticView]);

  React.useEffect(()=>{
    onCompleteRef.current?.();
  }, [animated, staticView]);

  const cards = [
    {key:'month', label:'MONTH', text:'7月'},
    {key:'day', label:'DAY', text:'5'},
    {key:'weekday', label:'DAY OF WEEK', text:'周日'},
  ];

  return (
    <div className="chart-block" ref={cardRef} style={{background:'transparent', border:'none', padding:0}}>
      <div className="forecast-card">
        <div className="fc-head">
          <span className="fc-title">
            <svg className="fc-icon" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="12" cy="13" r="8" fill="#ff4d88"/>
              <path d="M4 6 L7 4" stroke="#ff4d88" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 6 L17 4" stroke="#ff4d88" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 9 L12 13 L15 15" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            下次月经预测
          </span>
        </div>
        <div className="fc-flipboard">
          {cards.map((card) => (
            <div
              key={card.key}
              className="fc-flip-card"
              data-flip={card.key}
            >
              <div className="fc-flip-value">{card.text}</div>
              <div className="fc-flip-label">{card.label}</div>
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
        <div className="cc-head">
          <span className="cc-title">
            <img className="cc-icon" src={SC_ICON} width="16" height="16" alt="" aria-hidden="true"/>
            月经信号灯
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
const PERIOD_END_LEAD = '以下是本次月经情况的分析。先看一下你最近3次经期天数变化：';

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

const PERIOD_END_PARA = [
  { text:'最近3次经期天数呈逐渐变长的趋势。本次 ' },
  { text:'8 天', bold:true },
  { text:'比平时稍长一点，超过了' },
  { text:'7天', bold:true },
  { text:'的正常范围。单次的小波动通常受作息、压力等影响，不用太担心，留意后续几次是否回到平时节奏就好。' },
];

const PERIOD_END_FORECAST_TEXT = [
  { text:'按照你的周期规律计算，预计下次月经将' },
  { text:'7月5日', bold:true },
  { text:'前后到来，还有' },
  { text:'25天', bold:true },
  { text:'，到时记得提前做好准备哦。' },
];

function TlAiChartIcon({size = 10, color = '#FF4D88'}){
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20V6M4 20h16M8 16v-4M12 16V8M16 16v-6" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
}

function SisterAnalysisCollapsible({playAnimation, onCycleComplete, animateText, periodStyle = false, analysisKind = 'period-start'}){
  const [open, setOpen] = React.useState(true);
  const [canCollapse, setCanCollapse] = React.useState(!animateText);
  const [hasSeenAnimation, setHasSeenAnimation] = React.useState(!animateText);
  const contentAnimateText = animateText && !hasSeenAnimation;
  const keepContentMounted = hasSeenAnimation;

  React.useEffect(()=>{
    if(!animateText){
      setCanCollapse(true);
      setHasSeenAnimation(true);
      return;
    }
    setOpen(true);
    setCanCollapse(false);
    setHasSeenAnimation(false);
  }, [animateText, playAnimation]);

  const handleComplete = React.useCallback(()=>{
    setCanCollapse(true);
    setHasSeenAnimation(true);
    onCycleComplete?.();
  }, [onCycleComplete]);

  const handleToggle = ()=>{
    if(!canCollapse) return;
    setOpen(v=>{
      if(v) setHasSeenAnimation(true);
      return !v;
    });
  };

  return (
    <>
      <div className="tl-t5-divider-dashed" role="separator"/>
      <section className="tl-t5-insight tl-sister-ai-wrap" id="sister-analysis-anchor">
        <button
          type="button"
          className={'tl-ai-toggle'+(canCollapse ? '' : ' is-locked')+(periodStyle ? ' is-period-style' : '')}
          onClick={handleToggle}
          aria-expanded={open}
        >
          <span className="tl-ai-badge">
            {periodStyle ? <span className="tl-period-analysis-spark" aria-hidden="true"/> : <TlAiChartIcon size={10}/>}
          </span>
          {!periodStyle ? <span className="tl-ai-label">AI</span> : null}
          <span className="tl-ai-title">本次月经分析</span>
          <span className={'tl-ai-chevron'+(open ? ' is-open' : '')} aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </button>
        {(open || keepContentMounted) && (
          <div
            className={'tl-sister-ai-panel'+(!open ? ' is-collapsed' : '')}
            aria-hidden={!open}
          >
            <SisterAnalysisContent
              key={playAnimation}
              playAnimation={contentAnimateText ? playAnimation : 0}
              onCycleComplete={handleComplete}
              animateText={contentAnimateText}
              analysisKind={analysisKind}
            />
          </div>
        )}
      </section>
    </>
  );
}

function SisterAnalysisContent({playAnimation, onCycleComplete, animateText, analysisKind = 'period-start'}){
  const [animated, setAnimated] = React.useState(false);
  const [leadDone, setLeadDone] = React.useState(!animateText);
  const [chartDone, setChartDone] = React.useState(!animateText);
  const [para1Done, setPara1Done] = React.useState(!animateText);
  const [showForecast, setShowForecast] = React.useState(!animateText);
  const [forecastDone, setForecastDone] = React.useState(!animateText);
  const [showSignal, setShowSignal] = React.useState(!animateText);
  const [showClosing, setShowClosing] = React.useState(!animateText);
  const [closingDone, setClosingDone] = React.useState(!animateText);
  const prevPlayRef = React.useRef(playAnimation);
  const onCycleCompleteRef = React.useRef(onCycleComplete);
  const bodyRef = React.useRef(null);
  onCycleCompleteRef.current = onCycleComplete;
  const isPeriodEnd = analysisKind === 'period-end';
  const leadText = isPeriodEnd ? PERIOD_END_LEAD : SISTER_LEAD;
  const mainParagraph = isPeriodEnd ? PERIOD_END_PARA : SISTER_PARA1;

  React.useLayoutEffect(()=>{
    if(!animateText || !bodyRef.current) return;
    requestAnimationFrame(()=>scrollFeedContentIntoView(bodyRef.current));
  }, [animateText, leadDone, chartDone, para1Done, showSignal, showClosing]);

  React.useEffect(()=>{
    if(!animateText){
      setAnimated(false);
      setLeadDone(true);
      setChartDone(true);
      setPara1Done(true);
      setShowForecast(true);
      setForecastDone(true);
      setClosingDone(true);
      setShowSignal(true);
      setShowClosing(true);
      return;
    }
    if(playAnimation > prevPlayRef.current){
      setLeadDone(false);
      setChartDone(false);
      setPara1Done(false);
      setShowForecast(false);
      setForecastDone(false);
      setClosingDone(false);
      setShowSignal(false);
      setShowClosing(false);
      setAnimated(false);
    }
    prevPlayRef.current = playAnimation;
  }, [animateText, playAnimation]);

  const handleLeadComplete = React.useCallback(()=>{
    setLeadDone(true);
    if(animateText){
      setChartDone(false);
      setAnimated(true);
      setShowSignal(false);
      setShowClosing(false);
    }
  }, [animateText]);

  React.useEffect(()=>{
    if(isPeriodEnd){
      if(!animateText || !para1Done) return;
      const delay = playAnimation ? 360 : 220;
      const t = setTimeout(()=>setShowForecast(true), delay);
      return ()=>clearTimeout(t);
    }
    if(!animateText || !para1Done) return;
    const delay = playAnimation ? 480 : 320;
    const t = setTimeout(()=>setShowSignal(true), delay);
    return ()=>clearTimeout(t);
  }, [animateText, isPeriodEnd, para1Done, playAnimation]);

  React.useEffect(()=>{
    if(!isPeriodEnd) return;
    if(!animateText || !forecastDone) return;
    const delay = playAnimation ? 360 : 220;
    const t = setTimeout(()=>setShowClosing(true), delay);
    return ()=>clearTimeout(t);
  }, [animateText, forecastDone, isPeriodEnd, playAnimation]);

  React.useEffect(()=>{
    if(isPeriodEnd) return;
    if(!animateText || !showSignal) return;
    const delay = playAnimation ? 2400 : 880;
    const t = setTimeout(()=>setShowClosing(true), delay);
    return ()=>clearTimeout(t);
  }, [animateText, isPeriodEnd, showSignal, playAnimation]);

  React.useEffect(()=>{
    if(isPeriodEnd){
      if(!animateText || !showClosing || !closingDone) return;
      onCycleCompleteRef.current?.();
      return;
    }
    if(!animateText || !showClosing || !closingDone) return;
    onCycleCompleteRef.current?.();
  }, [animateText, isPeriodEnd, para1Done, showClosing, closingDone]);

  const showChart = !animateText || (leadDone && animated);
  const showPara1 = !animateText || (leadDone && chartDone);

  return (
    <div className="tl-t5-analysis-body" ref={bodyRef}>
      <p className="tl-t5-analysis-lead">
        {animateText && !leadDone ? (
          <TypewriterText text={leadText} active followScroll onComplete={handleLeadComplete}/>
        ) : leadText}
      </p>
      {showChart && (
        isPeriodEnd ? (
          <PeriodEndCycleChart
            animated={animated}
            staticView={!animateText}
            onComplete={()=>setChartDone(true)}
          />
        ) : (
          <SisterCycleChart
            animated={animated}
            staticView={!animateText}
            onComplete={()=>setChartDone(true)}
          />
        )
      )}
      {showPara1 && (
        <p className="tl-t5-analysis-text">
          {animateText && !para1Done ? (
            <TypewriterText
              segments={mainParagraph}
              active
              followScroll
              onComplete={()=>setPara1Done(true)}
            />
          ) : (
            renderTypedSegments(mainParagraph, segmentsFullText(mainParagraph).length)
          )}
        </p>
      )}
      {isPeriodEnd && showForecast && (!animateText || para1Done) && (
        <PeriodForecastCard
          animated={animated}
          staticView={!animateText}
          onComplete={()=>setForecastDone(true)}
        />
      )}
      {!isPeriodEnd && showSignal && (!animateText || para1Done) && (
        <>
          <div className="tl-t5-chart-divider" role="separator"/>
          <SisterSignalCard animated={animated}/>
        </>
      )}
      {!isPeriodEnd && showClosing && (!animateText || para1Done) && (
        <p className="tl-t5-analysis-text">
          {animateText && !closingDone ? (
            <TypewriterText
              segments={SISTER_CLOSING}
              active
              followScroll
              onComplete={()=>setClosingDone(true)}
            />
          ) : (
            renderTypedSegments(SISTER_CLOSING, segmentsFullText(SISTER_CLOSING).length)
          )}
        </p>
      )}
      {isPeriodEnd && showClosing && (!animateText || forecastDone) && (
        <p className="tl-t5-analysis-text">
          {animateText && !closingDone ? (
            <TypewriterText
              segments={PERIOD_END_FORECAST_TEXT}
              active
              followScroll
              onComplete={()=>setClosingDone(true)}
            />
          ) : (
            renderTypedSegments(PERIOD_END_FORECAST_TEXT, segmentsFullText(PERIOD_END_FORECAST_TEXT).length)
          )}
        </p>
      )}
    </div>
  );
}

function SisterAnalysisCard({playAnimation, onCycleComplete, animateText}){
  return (
    <div className="sister-bubble">
      <SisterAnalysisCollapsible
        playAnimation={playAnimation}
        onCycleComplete={onCycleComplete}
        animateText={!!animateText}
      />
    </div>
  );
}

Object.assign(window, {
  TlRecCardHead, TlRecKindIcon, inferRecordKind, TypewriterText, TypewriterBody, TlVoiceBar, TlVoicePlayBtn, TlVoiceInline, RecordedTags, AiNoteSection, RecordPhoto, resolveTag, CardMoreMenu,
  SegmentedRecordCard, VoiceRecordCard, DemoVoiceCard, SisterAnalysisCard, SisterAnalysisCollapsible, SisterAnalysisContent,
  scrollFeedContentIntoView,
});
