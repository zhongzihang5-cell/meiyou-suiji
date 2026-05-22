// ============ 场景三 · 方案三 — 生长时间轴空态引导 ============

const { useState, useEffect, useRef } = React;

const SCHEME3_BUBBLE_KEY = 'diandi_scheme3_bubble_seen';
const AXIS_GROW_PX = 340;

const CAPABILITY_CARDS = [
  { icon: '✏️', title: '记下此刻', desc: '心情 · 体重 · 症状 · 日常' },
  { icon: '🤖', title: 'AI 即时反馈', desc: 'AI分析 · 趋势图' },
  { icon: '📊', title: '趋势浮现', desc: '越了解自己的变化' },
];

function shouldShowScheme3Bubble(){
  try{
    return !localStorage.getItem(SCHEME3_BUBBLE_KEY);
  }catch{
    return true;
  }
}

function markScheme3BubbleSeen(){
  try{
    localStorage.setItem(SCHEME3_BUBBLE_KEY, '1');
  }catch{}
}

function formatCeremonyDayTitle(day){
  if(!day) return '今天 · 1条';
  return `${day.date} ${day.weekday} · 1条`;
}

const AXIS_STEP_MS = 900;
const SUBCOPY_AT = 2400;
const FIRST_CARD_AT = SUBCOPY_AT + AXIS_STEP_MS;
const SECOND_CARD_AT = FIRST_CARD_AT + AXIS_STEP_MS;
const THIRD_CARD_AT = SECOND_CARD_AT + AXIS_STEP_MS;

function RecordBlankScheme3Guide({ exiting }){
  const [headlinePhase, setHeadlinePhase] = useState('idle');
  const [axisPhase, setAxisPhase] = useState(0);
  const [showSubcopy, setShowSubcopy] = useState(false);
  const [visibleCardCount, setVisibleCardCount] = useState(0);

  useEffect(()=>{
    const timers = [
      setTimeout(()=>{
        setHeadlinePhase('in');
        setAxisPhase(1);
      }, 200),
      setTimeout(()=>setHeadlinePhase('out'), 1600),
      setTimeout(()=>setHeadlinePhase('gone'), 2100),
      setTimeout(()=>{
        setShowSubcopy(true);
        setAxisPhase(2);
      }, SUBCOPY_AT),
      setTimeout(()=>{
        setVisibleCardCount(1);
        setAxisPhase(3);
      }, FIRST_CARD_AT),
      setTimeout(()=>{
        setVisibleCardCount(2);
        setAxisPhase(4);
      }, SECOND_CARD_AT),
      setTimeout(()=>{
        setVisibleCardCount(3);
        setAxisPhase(5);
      }, THIRD_CARD_AT),
    ];
    return ()=>timers.forEach(clearTimeout);
  }, []);

  const headlineCls = headlinePhase === 'in' ? ' is-visible'
    : headlinePhase === 'out' ? ' is-visible is-exiting'
    : headlinePhase === 'gone' ? ' is-gone' : '';

  return (
    <div
      className={'rb-s3-guide'+(exiting ? ' is-exiting' : '')}
      aria-label="时间轴空态引导"
    >
      <div className="rb-s3-axis-wrap" aria-hidden="true">
        <div className={'rb-s3-axis is-phase-'+axisPhase+(axisPhase >= 1 ? ' is-flowing' : '')}>
          <span className="rb-s3-axis-tip"/>
        </div>
      </div>

      <div className="rb-s3-copy">
        <h2 className={'rb-s3-headline'+headlineCls}>
          时间一直在走
        </h2>
        <p className={'rb-s3-subcopy'+(showSubcopy ? ' is-visible' : '')}>
          你记下的点滴，都会留在这条时间轴上
        </p>

        <div className="rb-s3-cards">
          {CAPABILITY_CARDS.map((card, i)=>(
            <div
              key={card.title}
              className={'rb-s3-card'+(visibleCardCount > i ? ' is-visible' : '')}
            >
              <span className="rb-s3-card-icon" aria-hidden="true">{card.icon}</span>
              <div className="rb-s3-card-text">
                <span className="rb-s3-card-title">{card.title}</span>
                <span className="rb-s3-card-desc">{card.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecordBlankScheme3Ripple(){
  const uid = React.useId().replace(/:/g, '');
  return (
    <div className="rb-s3-celebrate-ripple" aria-hidden="true">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <circle
          className="rb-s3-celeb-ring is-outer"
          cx="30"
          cy="30"
          r="8"
          stroke="#ff4d88"
          strokeWidth="1.5"
          fill="none"
          opacity="0.2"
        />
        <circle
          className="rb-s3-celeb-ring is-inner"
          cx="30"
          cy="30"
          r="5"
          stroke="#ff4d88"
          strokeWidth="1"
          fill="none"
          opacity="0.28"
        />
        {[0, 72, 144, 216, 288].map((deg, i)=>(
          <circle
            key={deg}
            className="rb-s3-splash-drop"
            cx="30"
            cy="30"
            r="2"
            fill="#ff4d88"
            style={{ '--rb-s3-angle': deg + 'deg', '--rb-s3-drop-i': i }}
          />
        ))}
      </svg>
    </div>
  );
}

function RecordBlankScheme3Ceremony({ entry, dayBlock, onComplete }){
  const TlRecCardHead = window.TlRecCardHead;
  const [phase, setPhase] = useState(0);
  const doneRef = useRef(false);
  const text = entry.voiceText || entry.body || '';

  useEffect(()=>{
    const timers = [
      setTimeout(()=>setPhase(1), 280),
      setTimeout(()=>setPhase(2), 520),
      setTimeout(()=>setPhase(3), 1120),
      setTimeout(()=>setPhase(4), 1450),
      setTimeout(()=>setPhase(5), 2000),
      setTimeout(()=>{
        if(!doneRef.current){
          doneRef.current = true;
          onComplete?.(entry);
        }
      }, 4200),
    ];
    return ()=>timers.forEach(clearTimeout);
  }, [entry, onComplete]);

  return (
    <div className="rb-s3-ceremony tl-feed" aria-live="polite">
      <div className="tl-rail-continuous">
        <div className={'rb-s3-date-head'+(phase >= 1 ? ' is-visible' : '')}>
          <div className="tl-day-summary is-today">
            <div className="tl-day-summary-top">
              <span className="tl-day-summary-title">{formatCeremonyDayTitle(dayBlock)}</span>
            </div>
          </div>
        </div>

        <div className="tl-rail-node is-feed-last">
          <div className="tl-rail-marker" aria-hidden="true">
            <span className={'rb-s3-node-dot'+(phase >= 2 ? ' is-pop' : '')}/>
          </div>
          <div className="tl-rail-body">
            <div className={'rb-s3-record-slot'+(phase >= 2 ? ' is-visible' : '')}>
              <div className="tl-card tl-t5-card">
                <TlRecCardHead time={entry.time}/>
                <section className="tl-t5-main">
                  <div className="tl-t5-body">{text}</div>
                </section>
              </div>
            </div>

            <div className={'rb-s3-ai-card'+(phase >= 3 ? ' is-visible' : '')}>
              <div className="rb-s3-ai-avatar" aria-hidden="true">AI</div>
              <div className="rb-s3-ai-body">
                <p className="rb-s3-ai-title">小柚收到啦</p>
                <p className="rb-s3-ai-text">
                  已经帮你记下来了～记满 7 天，我就能告诉你这周的变化趋势
                </p>
              </div>
            </div>

            <div className={'rb-s3-sync-line'+(phase >= 4 ? ' is-visible' : '')}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="6.5" stroke="#00cc99" strokeWidth="1"/>
                <path d="M4 7l2 2 4-4" stroke="#00cc99" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>已自动同步到「记录」日历</span>
            </div>

            <div className={'rb-s3-celebrate'+(phase >= 5 ? ' is-visible' : '')}>
              <RecordBlankScheme3Ripple/>
              <p className="rb-s3-celebrate-title">时间轴长出了第一节 🌱</p>
              <p className="rb-s3-celebrate-sub">它会随你的记录一直延伸</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  RecordBlankScheme3Guide,
  RecordBlankScheme3Ceremony,
  shouldShowScheme3Bubble,
  markScheme3BubbleSeen,
  SCHEME3_BUBBLE_KEY,
});
