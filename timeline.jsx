// ============ 时间轴 — 分日 · 单条记录 · AI 批注 ============

function VoiceBar({voice}){
  return <TlVoiceBar voice={voice}/>;
}

function RecordCard({entry, isNew, typewriterAiNote, animateAnalysis, hideBodyUntilDrop}){
  return (
    <SegmentedRecordCard
      entry={entry}
      isNew={isNew}
      typewriterAiNote={typewriterAiNote}
      animateAnalysis={animateAnalysis}
      hideBodyUntilDrop={hideBodyUntilDrop}
    />
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

function filterDayItems(items, sisterCycleDone, hideTodayGuide){
  return (items || []).filter(it=>{
    if(it.kind === 'guide' && hideTodayGuide && !it.alwaysShow) return false;
    if(!it.hiddenUntilSisterDone) return true;
    return sisterCycleDone;
  });
}

function getTimelineItemTime(item){
  return item?.time || item?.primary?.time || item?.voice?.time || '';
}

function getTimelineItemMinutes(item){
  const time = getTimelineItemTime(item);
  const match = String(time || '').match(/^(\d{1,2}):(\d{2})$/);
  if(!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function sortDayItemsByTime(items){
  return (items || []).map((item, index)=>({item, index, minutes:getTimelineItemMinutes(item)}))
    .sort((a, b)=>{
      if(a.minutes == null && b.minutes == null) return a.index - b.index;
      if(a.minutes == null) return 1;
      if(b.minutes == null) return -1;
      if(a.minutes !== b.minutes) return a.minutes - b.minutes;
      return a.index - b.index;
    })
    .map(entry=>entry.item);
}

function resolveTimelineLastItemId(blocks, sisterCycleDone, hideTodayGuide){
  const ids = [];
  blocks.forEach(block=>{
    if(block.type !== 'day') return;
    const items = sortDayItemsByTime(filterDayItems(block.items || block.entries, sisterCycleDone, hideTodayGuide));
    items.forEach(it=>ids.push(it.id));
  });
  return ids[ids.length - 1];
}

function TimelineDateSection({day, dayBlocks, sisterPlayAnimation, sisterCycleDone, hideTodayGuide, onSisterCycleComplete, lastItemId, hideDayHeader, firstDropAnim, onFirstDropLand, onFirstDropComplete}){
  const items = sortDayItemsByTime(filterDayItems(day.items || day.entries, sisterCycleDone, hideTodayGuide));
  const phaseCls = day.phaseKind || '';
  return (
    <>
      {hideDayHeader ? null : (
        <div
          className={'tl-day-section-head tl-rail-break'+(day.isToday?' is-today':'')+(phaseCls?' phase-'+phaseCls:'')}
          data-day-id={day.id}
        >
          <CycleDayHeader day={day} items={items} dayBlocks={dayBlocks}/>
        </div>
      )}
      {items.map((it, idx)=>{
        if(it.kind === 'sister-card' && (items[idx - 1]?.kind === 'voice-card' || items[idx - 1]?.kind === 'sync-card')) return null;
        const sisterItem = (it.kind === 'voice-card' || it.kind === 'sync-card') && items[idx + 1]?.kind === 'sister-card'
          ? items[idx + 1]
          : null;
        return (
        <TimelineItem
          key={it.id}
          item={it}
          sisterItem={sisterItem}
          isNew={it.isNew || (it.hiddenUntilSisterDone && sisterCycleDone && sisterPlayAnimation > 0)}
          phaseKind={day.phaseKind}
          isFeedLast={it.id === lastItemId || sisterItem?.id === lastItemId}
          sisterPlayAnimation={sisterPlayAnimation}
          onSisterCycleComplete={onSisterCycleComplete}
          firstDropAnim={firstDropAnim}
          onFirstDropLand={onFirstDropLand}
          onFirstDropComplete={onFirstDropComplete}
        />
        );
      })}
    </>
  );
}

function CycleStartMarker({block}){
  return (
    <div className="tl-cycle-start">
      <div className="tl-cycle-start-marker" aria-hidden="true">
        <span className="tl-cycle-start-dot"/>
      </div>
      <div className="tl-cycle-start-body">
        <span className="tl-cycle-start-icon">🩸</span>
        <span className="tl-cycle-start-text">{block.label || '本次周期开始'}</span>
        {block.sub && <span className="tl-cycle-start-sub">{block.sub}</span>}
      </div>
    </div>
  );
}

function TimelineStream({blocks, endRef, sisterPlayAnimation, sisterCycleDone, hideTodayGuide, onSisterCycleComplete, hideGapDivider, hideDayHeader, firstDropAnim, onFirstDropLand, onFirstDropComplete}){
  const lastItemId = resolveTimelineLastItemId(blocks, sisterCycleDone, hideTodayGuide);
  const dayBlocks = blocks.filter(b => b.type === 'day');

  return (
    <div className="tl-feed">
      <div className="tl-rail-continuous">
        {blocks.map((block, i)=>{
          if(block.type === 'day'){
            return (
              <TimelineDateSection
                key={block.id}
                day={block}
                dayBlocks={dayBlocks}
                sisterPlayAnimation={sisterPlayAnimation}
                sisterCycleDone={sisterCycleDone}
                hideTodayGuide={hideTodayGuide}
                onSisterCycleComplete={onSisterCycleComplete}
                lastItemId={lastItemId}
                hideDayHeader={hideDayHeader}
                firstDropAnim={firstDropAnim}
                onFirstDropLand={onFirstDropLand}
                onFirstDropComplete={onFirstDropComplete}
              />
            );
          }
          if(block.type === 'cycle-start'){
            return (
              <div key={block.id} className="tl-rail-break">
                <CycleStartMarker block={block}/>
              </div>
            );
          }
          if(block.type === 'gap'){
            if(hideGapDivider) return null;
            return (
              <div key={block.id || ('gap-'+i)} className="tl-gap-divider tl-feed-more tl-rail-break">
                <span className="tl-pull-hint">↓ 下拉查看更多</span>
              </div>
            );
          }
          if(block.type === 'cycle-sum'){
            return (
              <div key={block.id} className="tl-rail-break">
                <CycleSumCard item={block}/>
              </div>
            );
          }
          if(block.type === 'weekly'){
            return (
              <div key={block.id} className="tl-rail-break">
                <WeeklyCard item={block}/>
              </div>
            );
          }
          return null;
        })}
      </div>
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

function buildRuntimeTodayBlock(){
  if(window.buildTodayDayBlock) return window.buildTodayDayBlock();
  const d = new Date();
  const weekday = ['周日','周一','周二','周三','周四','周五','周六'][d.getDay()];
  return {
    type:'day',
    id:'d-today',
    date:`${d.getMonth() + 1}/${d.getDate()}`,
    weekday,
    isToday:true,
    items:[],
  };
}

function resolveEntryDayId(text, blocks){
  const days = blocks.filter(b=>b.type==='day');
  const todayIdx = days.findIndex(d=>d.isToday);
  if(/前天/.test(text) && todayIdx > 1) return days[todayIdx - 2].id;
  if(/昨天|昨晚/.test(text) && todayIdx > 0) return days[todayIdx - 1].id;
  return days.find(d=>d.isToday)?.id || buildRuntimeTodayBlock().id;
}

function resolveDayHint(text, blocks, dayId){
  const day = blocks.find(b=>b.type==='day' && b.id===dayId);
  if(!day || day.isToday) return '';
  if(/昨天|昨晚|前天/.test(text)) return day.date;
  return '';
}

function appendTimelineEntry(blocks, entry, opts={}){
  const targetDayId = opts.dayId || resolveEntryDayId(entry.body || '', blocks);
  const hasTargetDay = blocks.some(b=>b.type === 'day' && b.id === targetDayId);
  const sourceBlocks = hasTargetDay
    ? blocks
    : [...blocks, { ...buildRuntimeTodayBlock(), id: targetDayId }];
  return sourceBlocks.map(b=>{
    if(b.type !== 'day' || b.id !== targetDayId) return b;
    const list = b.items || b.entries || [];
    return {
      ...b,
      items: [...list, entry],
      entries: undefined,
    };
  });
}

function appendTodayEntry(blocks, entry){
  return appendTimelineEntry(blocks, entry);
}

function isTimelineEmpty(blocks){
  return !(blocks || []).some(b=>{
    if(b.type !== 'day') return true;
    return (b.items || b.entries || []).length > 0;
  });
}

Object.assign(window, {
  VoiceBar, RecordCard, CycleSumCard, WeeklyCard,
  TimelineDateSection, TimelineStream, CycleStartMarker,
  formatNowTime, formatVoiceDur,
  appendTodayEntry, appendTimelineEntry,
  resolveEntryDayId, resolveDayHint, resolveTimelineLastItemId,
  isTimelineEmpty,
});
