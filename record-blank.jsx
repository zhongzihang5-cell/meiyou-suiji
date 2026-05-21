// ============ 记录 Tab · 空置页（场景三 — 在此修改空态） ============
//
// 标准记录页结构：顶栏 + 今日分日头 + 空态区 + 底部 Dock（由 app.jsx 渲染）
// 与场景二 landing 引导（record-empty.jsx）分离，方便独立迭代空态设计。

function RecordBlankPlaceholder(){
  return (
    <div className="record-blank-placeholder" aria-label="记录页空态">
      <div className="record-blank-icon" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="8" y="6" width="32" height="36" rx="8" stroke="rgba(255,77,136,0.35)" strokeWidth="1.5"/>
          <path d="M16 18h16M16 24h12M16 30h14" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <p className="record-blank-title">还没有记录</p>
      <p className="record-blank-desc">说句话，或点下方按钮开始第一次记录</p>
    </div>
  );
}

function RecordBlankStream({
  streamRef,
  timelineEndRef,
  timeline,
  scene,
  onOpenCalendar,
  onOpenSearch,
  sisterPlayAnimation,
  sisterCycleDone,
  hideTodayGuide,
  onSisterCycleComplete,
}){
  const I = window.Icon;
  const TimelineStream = window.TimelineStream;
  const showBlank = window.isTimelineEmpty(timeline);

  return (
    <div className="suiji-stream record-blank-stream" ref={streamRef}>
      <div className="stream-header">
        <div>
          <h1 className="stream-title">记录</h1>
          <p className="stream-sub">情绪 · 身体 · 体重</p>
        </div>
        <div className="stream-actions">
          {scene.calendar.enabled && (
            <button
              className="stream-action"
              aria-label="日历"
              type="button"
              onClick={onOpenCalendar}
            >
              <I name="calendar" size={20} stroke={1.7}/>
            </button>
          )}
          <button
            className="stream-action"
            aria-label="搜索"
            type="button"
            onClick={onOpenSearch}
          >
            <I name="search" size={20} stroke={1.7}/>
          </button>
        </div>
      </div>

      <TimelineStream
        blocks={timeline}
        endRef={timelineEndRef}
        sisterPlayAnimation={sisterPlayAnimation}
        sisterCycleDone={sisterCycleDone}
        hideTodayGuide={hideTodayGuide}
        onSisterCycleComplete={onSisterCycleComplete}
      />

      {showBlank && <RecordBlankPlaceholder/>}
    </div>
  );
}

Object.assign(window, { RecordBlankStream, RecordBlankPlaceholder });
