// ============ 时间轴 — 分日 · 单条记录 · AI 批注 ============

function RecordCard({entry, isNew}){
  return (
    <div className={'rec'+(isNew?' fade-in':'')}>
      {entry.time && <div className="rec-time">{entry.time}</div>}
      <div className="rec-body">{entry.body}</div>
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
          <span className="tl-today-guide-text">写下今日点滴，AI 会帮你整理</span>
        </div>
      )}
      {(day.entries || []).map(e=>(
        <RecordCard key={e.id} entry={e} isNew={e.isNew}/>
      ))}
    </div>
  );
}

function TimelineStream({blocks}){
  const I = window.Icon;
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
    </div>
  );
}

function formatNowTime(){
  const d = new Date();
  return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
}

function appendTodayEntry(blocks, entry){
  return blocks.map(b=>{
    if(b.type !== 'day' || !b.isToday) return b;
    return {
      ...b,
      entries: [...(b.entries || []), entry],
    };
  });
}

Object.assign(window, {
  RecordCard, CycleSumCard, WeeklyCard,
  TimelineDateSection, TimelineStream,
  formatNowTime, appendTodayEntry,
});
