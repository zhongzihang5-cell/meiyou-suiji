// ============ 时间轴 — 分日 · 单条记录 · AI 批注 ============

function VoiceBar({voice}){
  const I = window.Icon;
  const [playing, setPlaying] = React.useState(false);
  return (
    <button
      type="button"
      className={'rec-voice'+(playing?' playing':'')}
      onClick={()=>setPlaying(p=>!p)}
      aria-label={playing?'暂停':'播放语音'}
    >
      <span className="rec-voice-play">
        <I name={playing?'pause':'play'} size={13}/>
      </span>
      <span className="rec-voice-bars" aria-hidden="true">
        {Array.from({length:22}).map((_,j)=>(<span key={j} style={{'--i':j}}/>))}
      </span>
      <span className="rec-voice-dur">{voice.duration}</span>
    </button>
  );
}

function RecordCard({entry, isNew}){
  return (
    <div className={'rec'+(isNew?' fade-in':'')}>
      {entry.time && <div className="rec-time">{entry.time}</div>}
      {entry.voice && <VoiceBar voice={entry.voice}/>}
      {entry.body && (
        <div className={'rec-body'+(entry.voice?' rec-body-voice':'')}>{entry.body}</div>
      )}
      {entry.photo && (
        <div className="rec-img">
          <div className={'rec-img-ph '+(entry.photoTone||'warm')}>
            {entry.photoEmoji || '🌸'}
          </div>
        </div>
      )}
      {entry.tags && entry.tags.length > 0 && (
        <div className="rec-tags">
          {entry.tags.map((t,i)=>(
            <span key={i} className={'rec-tag'+(t.ai?' ai':'')+(t.content?' content':'')}>
              {t.emoji && <span>{t.emoji} </span>}
              {t.label}
              {t.ai && <span className="ai-badge">AI</span>}
            </span>
          ))}
        </div>
      )}
      {entry.aiNote && (
        <div className={'ai-anno '+(entry.aiNote.tone||'green')+'-bg'}>
          {entry.aiNote.icon && <span className="anno-icon">{entry.aiNote.icon}</span>}
          {entry.aiNote.text}
        </div>
      )}
    </div>
  );
}

function CycleSumCard({item}){
  return (
    <div className={'cycle-sum'+(item.tone==='warn'?' warn':'')}>
      <div className="cs-head">
        <span className="cs-icon">{item.icon || '🟢'}</span>
        <span className="cs-title">{item.title}</span>
      </div>
      <div className="cs-body">{item.body}</div>
      {item.link && <span className="cs-link">{item.link}</span>}
    </div>
  );
}

function WeeklyCard({item}){
  return (
    <div className="weekly-card">
      <div className="wk-left">
        <div className="wk-icon">{item.icon || '📊'}</div>
        <div>
          <div className="wk-title">{item.title}</div>
          <div className="wk-sub">{item.sub}</div>
        </div>
      </div>
      <span className="wk-action">{item.action || '查看 ›'}</span>
    </div>
  );
}

function TimelineDateSection({day}){
  const I = window.Icon;
  const phaseCls = day.phaseKind || '';
  return (
    <div className={'tl-date-section'+(day.isToday?' is-today':'')}>
      <div className="date-head">
        <span className="date-num">{day.date}</span>
        <span className="date-info">
          {day.weekday}{day.isToday ? ' · 今天' : ''}
        </span>
        {day.phaseTag && (
          <span className={'date-tag '+phaseCls}>{day.phaseTag}</span>
        )}
      </div>
      {(day.extras || []).map((x,j)=>{
        if(x.type==='cycle-sum') return <CycleSumCard key={x.id||j} item={x}/>;
        return null;
      })}
      {day.isToday && (!day.entries || day.entries.length === 0) && (
        <div className="tl-today-guide">
          <span className="tl-today-guide-icon">
            <I name="pen" size={13} stroke={1.6}/>
          </span>
          <span className="tl-today-guide-text">
            经期<em>第 3 天</em>，经量通常开始减少了。今天感觉怎么样？
          </span>
        </div>
      )}
      {(day.entries || []).map(e=>(
        <RecordCard key={e.id} entry={e} isNew={e.isNew}/>
      ))}
    </div>
  );
}

function TimelineStream({blocks, endRef}){
  return (
    <div className="tl-feed">
      {blocks.map((block, i)=>{
        if(block.type === 'day'){
          return <TimelineDateSection key={block.id} day={block}/>;
        }
        if(block.type === 'gap'){
          return (
            <div key={block.id || ('gap-'+i)} className="tl-gap-divider">
              · · ·  {block.label}  · · ·
            </div>
          );
        }
        if(block.type === 'cycle-sum'){
          return <CycleSumCard key={block.id} item={block}/>;
        }
        if(block.type === 'weekly'){
          return <WeeklyCard key={block.id} item={block}/>;
        }
        return null;
      })}
      <div ref={endRef} className="tl-feed-end" aria-hidden="true"/>
    </div>
  );
}

function formatNowTime(){
  const d = new Date();
  return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
}

function formatVoiceDur(sec){
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m+':'+String(s).padStart(2,'0');
}

function resolveEntryDayId(text, blocks){
  const days = blocks.filter(b=>b.type==='day');
  const todayIdx = days.findIndex(d=>d.isToday);
  if(/前天/.test(text) && todayIdx > 1) return days[todayIdx - 2].id;
  if(/昨天|昨晚/.test(text) && todayIdx > 0) return days[todayIdx - 1].id;
  return days.find(d=>d.isToday)?.id || days[days.length - 1]?.id;
}

function resolveDayHint(text, blocks, dayId){
  const day = blocks.find(b=>b.type==='day' && b.id===dayId);
  if(!day || day.isToday) return '';
  if(/昨天|昨晚|前天/.test(text)) return day.date;
  return '';
}

function appendTimelineEntry(blocks, entry, opts={}){
  const dayId = opts.dayId || resolveEntryDayId(entry.body || '', blocks);
  return blocks.map(b=>{
    if(b.type !== 'day' || b.id !== dayId) return b;
    return {
      ...b,
      entries: [...(b.entries || []), entry],
    };
  });
}

function appendTodayEntry(blocks, entry){
  return appendTimelineEntry(blocks, entry);
}

Object.assign(window, {
  VoiceBar, RecordCard, CycleSumCard, WeeklyCard,
  TimelineDateSection, TimelineStream,
  formatNowTime, formatVoiceDur,
  appendTodayEntry, appendTimelineEntry,
  resolveEntryDayId, resolveDayHint,
});
