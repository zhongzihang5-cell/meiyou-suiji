// ============ 记录 Tab · 空置页（场景三 — 空态 + 第一滴仪式） ============

const { useState, useEffect, useRef } = React;

function RecordBlankDroplet({ className, size = 'md', animateFloat = false, style }) {
  const uid = React.useId().replace(/:/g, '');
  const gradId = 'rbGrad' + uid;
  const shineId = 'rbShine' + uid;
  const w = size === 'lg' ? 36 : 22;
  const h = size === 'lg' ? 48 : 30;
  const pathCls = 'record-blank-droplet-shape' + (animateFloat ? ' is-floating' : '');
  return (
    <svg
      className={'record-blank-droplet' + (className ? ' ' + className : '')}
      width={w}
      height={h}
      viewBox="0 0 22 30"
      fill="none"
      aria-hidden="true"
      style={style}
    >
      <defs>
        <linearGradient id={gradId} x1="11" y1="1" x2="11" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffb8d0" stopOpacity="0.55"/>
          <stop offset="38%" stopColor="#ff8fb4" stopOpacity="0.78"/>
          <stop offset="100%" stopColor="#ff4d88" stopOpacity="0.92"/>
        </linearGradient>
        <radialGradient id={shineId} cx="0.32" cy="0.28" r="0.55">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.42"/>
          <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
        </radialGradient>
        <filter id={'rbShadow' + uid} x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" floodColor="#ff4d88" floodOpacity="0.22"/>
        </filter>
      </defs>
      <path
        className={pathCls}
        d="M11 2 C11 2, 2 14, 2 18 C2 23, 6 27, 11 27 C16 27, 20 23, 20 18 C20 14, 11 2, 11 2Z"
        fill={`url(#${gradId})`}
        filter={`url(#rbShadow${uid})`}
      />
      <path
        d="M11 2 C11 2, 2 14, 2 18 C2 23, 6 27, 11 27 C16 27, 20 23, 20 18 C20 14, 11 2, 11 2Z"
        fill={`url(#${shineId})`}
        opacity="0.85"
      />
      <ellipse
        cx="8"
        cy="14"
        rx="2.2"
        ry="3.2"
        fill="#fff"
        fillOpacity="0.38"
        transform="rotate(-22 8 14)"
      />
      <ellipse
        cx="13.2"
        cy="19"
        rx="1"
        ry="1.4"
        fill="#fff"
        fillOpacity="0.18"
      />
    </svg>
  );
}

const AXIS_FALL_MS = 540;
const AXIS_SPLASH_MS = 480;
const AXIS_SHRINK_MS = 160;
const AXIS_LAND_MS = AXIS_FALL_MS;
const AXIS_SETTLE_MS = AXIS_FALL_MS + AXIS_SPLASH_MS;
const AXIS_DONE_MS = AXIS_SETTLE_MS + AXIS_SHRINK_MS;
const SPLASH_ANGLES = [0, 60, 120, 180, 240, 300];

function easeInQuad(t){
  return t * t;
}

function easeOutCubic(t){
  return 1 - Math.pow(1 - t, 3);
}

function easeOutQuart(t){
  return 1 - Math.pow(1 - t, 4);
}

function computeAxisFall(t, distance){
  const p = Math.min(1, t / AXIS_FALL_MS);
  const gravity = easeInQuad(p);
  let y = -distance + gravity * distance;
  let sx = 1;
  let sy = 1;

  const speed = p < 1 ? Math.min(1, p * 1.35) : 0;
  const stretch = speed * (1 - p * 0.45);
  sy = 1 + stretch * 0.16;
  sx = 1 - stretch * 0.06;

  if(p >= 0.78){
    const u = (p - 0.78) / 0.22;
    const bounce = Math.sin(u * Math.PI);
    sy = 1 - bounce * 0.24;
    sx = 1 + bounce * 0.16;
    y -= bounce * 4;
  }

  const fadeTail = p > 0.94 ? (p - 0.94) / 0.06 : 0;
  return {
    y,
    sx,
    sy,
    opacity: 1 - fadeTail * 0.85,
  };
}

function RecordBlankAxisSplash({ elapsed, shrinkElapsed = 0 }) {
  const uid = React.useId().replace(/:/g, '');
  const gradId = 'rbAxisGrad' + uid;
  const p = Math.min(1, elapsed / AXIS_SPLASH_MS);
  const burst = easeOutCubic(Math.min(1, p / 0.36));
  const fade = p > 0.5 ? easeOutQuart((p - 0.5) / 0.5) : 0;
  const shrinkT = Math.min(1, shrinkElapsed / AXIS_SHRINK_MS);
  const shrinkEase = easeOutCubic(shrinkT);
  const dropScale = (1 - fade * 0.18) * (1 - shrinkEase * 0.86);
  const ringScale = 0.4 + burst * 1.05;
  const ringOp = 0.38 * (1 - easeOutQuart(p));

  return (
    <div className="record-blank-axis-splash" aria-hidden="true">
      <span
        className="record-blank-axis-splash-ring is-outer"
        style={{
          transform: `scale(${ringScale})`,
          opacity: ringOp * (1 - shrinkEase),
        }}
      />
      <span
        className="record-blank-axis-splash-ring is-inner"
        style={{
          transform: `scale(${0.35 + burst * 0.72})`,
          opacity: ringOp * 0.82 * (1 - shrinkEase),
        }}
      />
      <svg
        className="record-blank-axis-splash-svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        style={{ transform: `scale(${dropScale})` }}
      >
        <defs>
          <linearGradient id={gradId} x1="24" y1="10" x2="24" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffb8d0" stopOpacity="0.55"/>
            <stop offset="38%" stopColor="#ff8fb4" stopOpacity="0.78"/>
            <stop offset="100%" stopColor="#ff4d88" stopOpacity="0.92"/>
          </linearGradient>
        </defs>
        {SPLASH_ANGLES.map((deg, i) => {
          const delay = i * 32;
          const local = Math.max(0, elapsed - delay);
          const lp = Math.min(1, local / (AXIS_SPLASH_MS * 0.72));
          const expand = easeOutCubic(lp);
          const particleFade = lp > 0.58 ? easeOutQuart((lp - 0.58) / 0.42) : 0;
          const orbit = 2 + expand * 15 - particleFade * 4;
          const dotOp = 0.58 * (1 - particleFade) * (1 - shrinkEase * 0.9);
          const rad = (deg - 90) * Math.PI / 180;
          const r = 3.4 - particleFade * 1.4;
          if(dotOp <= 0.02) return null;
          return (
            <circle
              key={deg}
              cx={24 + Math.cos(rad) * orbit}
              cy={24 + Math.sin(rad) * orbit}
              r={r}
              fill="#ff4d88"
              fillOpacity={dotOp}
            />
          );
        })}
        <path
          d="M24 11 C24 11, 17 20, 17 23.5 C17 27.2, 20.1 30, 24 30 C27.9 30, 31 27.2, 31 23.5 C31 20, 24 11, 24 11Z"
          fill={`url(#${gradId})`}
          fillOpacity={1 - shrinkEase * 0.15}
        />
        <ellipse
          cx="21.5"
          cy="21"
          rx="1.6"
          ry="2.2"
          fill="#fff"
          fillOpacity={0.42 * (1 - shrinkEase)}
          transform="rotate(-18 21.5 21)"
        />
      </svg>
      {shrinkEase > 0.08 && (
        <span
          className="record-blank-axis-settle-dot"
          style={{
            transform: `scale(${0.18 + shrinkEase * 0.12})`,
            opacity: shrinkEase,
          }}
        />
      )}
    </div>
  );
}

function RecordBlankAxisLand({ t, variant = 'ceremony' }) {
  const distance = variant === 'timeline' ? 76 : 128;
  const landClass = 'record-blank-axis-land' + (variant === 'timeline' ? ' is-timeline' : '');
  const fallT = Math.min(t, AXIS_LAND_MS);
  const fall = computeAxisFall(fallT, distance);
  const splashElapsed = Math.max(0, t - AXIS_LAND_MS);
  const shrinkElapsed = Math.max(0, t - AXIS_SETTLE_MS);
  const inFall = t < AXIS_LAND_MS;
  const inSplash = t >= AXIS_LAND_MS && t < AXIS_DONE_MS;
  const preSplash = t >= AXIS_LAND_MS - 64 && t < AXIS_LAND_MS;
  const preSplashMix = preSplash ? (t - (AXIS_LAND_MS - 64)) / 64 : 0;
  const showFallDroplet = inFall && fall.opacity > 0.08;
  const showSplash = inSplash || preSplashMix > 0.12;
  const showCeremonyDot = variant !== 'timeline' && t >= AXIS_DONE_MS;

  const innerTransform = inFall
    ? `translateY(${fall.y}px) scale(${fall.sx}, ${fall.sy})`
    : 'translateY(0) scale(1, 1)';

  return (
    <div className={landClass} aria-hidden="true">
      <div
        className="record-blank-axis-land-inner"
        style={{ transform: innerTransform }}
      >
        {showFallDroplet && (
          <RecordBlankDroplet
            className="is-axis-fall"
            style={{ opacity: fall.opacity * (1 - preSplashMix * 0.75) }}
          />
        )}
        {showSplash && (
          <div
            className="record-blank-axis-splash-wrap"
            style={{ opacity: inSplash ? 1 : preSplashMix * 0.55 }}
          >
            <RecordBlankAxisSplash
              elapsed={inSplash ? splashElapsed : 0}
              shrinkElapsed={variant === 'timeline' ? shrinkElapsed : 0}
            />
          </div>
        )}
        {showCeremonyDot && <span className="record-blank-node-dot is-landed"/>}
      </div>
    </div>
  );
}

function RecordBlankAxisDropAnim({ onLand, onComplete }) {
  const [t, setT] = useState(0);
  const landRef = useRef(false);
  const completeRef = useRef(false);
  const startRef = useRef(performance.now());

  useEffect(() => {
    landRef.current = false;
    completeRef.current = false;
    startRef.current = performance.now();
    setT(0);
    let raf;
    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      setT(elapsed);
      if(elapsed < AXIS_DONE_MS + 40) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if(t >= AXIS_LAND_MS && !landRef.current){
      landRef.current = true;
      onLand?.();
    }
  }, [t, onLand]);

  useEffect(() => {
    if(t >= AXIS_DONE_MS && !completeRef.current){
      completeRef.current = true;
      onComplete?.();
    }
  }, [t, onComplete]);

  return <RecordBlankAxisLand t={t} variant="timeline"/>;
}

function RecordBlankRipples({ className, variant = 'wait' }) {
  return (
    <div className={'record-blank-ripples' + (className ? ' ' + className : '') + (variant === 'splash' ? ' is-splash' : '')} aria-hidden="true">
      <span className="record-blank-ripple"/>
      <span className="record-blank-ripple"/>
      <span className="record-blank-ripple"/>
    </div>
  );
}

function RecordBlankGuideCard({ showArrow }) {
  return (
    <div className="record-blank-guide-card">
      <p className="record-blank-guide-title">
        你的点滴，<br/>
        从第一句话开始
      </p>
      <p className="record-blank-guide-sub">
        说说今天吃了什么、心情怎么样<br/>
        每一条都会变成时间轴上的一滴
      </p>
      <div className={'record-blank-guide-arrow-row' + (showArrow ? ' is-visible' : '')}>
        <span className="record-blank-guide-arrow-btn" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v8m0 0l-3-3m3 3l3-3" stroke="#ff4d88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="record-blank-guide-arrow-text">在下方输入框说点什么</span>
      </div>
    </div>
  );
}

function RecordBlankGhostCards({ visible }) {
  return (
    <div className={'record-blank-ghost-stack' + (visible ? ' is-visible' : '')} aria-hidden="true">
      <div className="record-blank-ghost">
        <span className="record-blank-ghost-dot"/>
        <div className="record-blank-ghost-body is-tall"/>
      </div>
      <div className="record-blank-ghost">
        <span className="record-blank-ghost-dot"/>
        <div className="record-blank-ghost-body is-short"/>
      </div>
    </div>
  );
}

function RecordBlankEmptyState() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="record-blank-empty" aria-label="记录页空态">
      <div className="record-blank-axis-line"/>

      <div className={'record-blank-droplet-hanger' + (phase >= 1 ? ' is-visible' : '')}>
        <RecordBlankDroplet animateFloat={phase >= 1}/>
      </div>

      <div className={'record-blank-ripple-field' + (phase >= 2 ? ' is-visible' : '')}>
        <div className="record-blank-ripple-core" aria-hidden="true">
          {[0, 1, 2].map(i => (
            <span key={'c' + i} className="record-blank-ripple-pulse" style={{ '--rb-pulse-i': i }}/>
          ))}
        </div>
        {[0, 1, 2, 3, 4].map(i => (
          <span key={i} className="record-blank-ripple-ring" style={{ '--rb-ring-i': i }}/>
        ))}
      </div>

      <div className={'record-blank-content' + (phase >= 2 ? ' is-visible' : '')}>
        <RecordBlankGuideCard showArrow={phase >= 3}/>
        <RecordBlankGhostCards visible={phase >= 3}/>
      </div>
    </div>
  );
}

function RecordBlankScheme1Empty({ exiting }){
  return (
    <RecordBlankScheme1 ceremonyEntry={null}/>
  );
}

function RecordBlankScheme2Stack({ previewBlocks }) {
  const TimelineStream = window.TimelineStream;
  return (
    <div className="record-blank-scheme2-stack" aria-label="示例数据预览">
      <div className="record-blank-scheme2-preview" aria-hidden="true">
        <TimelineStream
          blocks={previewBlocks}
          sisterPlayAnimation={0}
          sisterCycleDone={true}
          hideTodayGuide={true}
          hideGapDivider={true}
          hideDayHeader={true}
        />
      </div>
      <div className="record-blank-scheme2-mask" aria-hidden="true"/>
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
  const scheme = scene.record.blankScheme || 1;
  const previewBlocks = scheme === 2 && showBlank ? window.getBlankScheme2PreviewTimeline() : null;

  const renderBlankBody = ()=>{
    if(scheme === 2 && previewBlocks){
      return <RecordBlankScheme2Stack previewBlocks={previewBlocks}/>;
    }
    if(scheme === 3){
      return (
        <RecordBlankScheme3Guide exiting={false}/>
      );
    }
    if(scheme === 1){
      return (
        <RecordBlankScheme1 ceremonyEntry={null}/>
      );
    }
    return <div className="record-blank-plain" aria-hidden="true"/>;
  };

  const schemeCls = scheme === 1 && showBlank ? ' is-scheme1'
    : (scheme === 2 && showBlank ? ' is-scheme2'
    : (scheme === 3 && showBlank ? ' is-scheme3' : ''));

  return (
    <div className={'suiji-stream record-blank-stream' + schemeCls} ref={streamRef}>
      <div className="stream-header">
        <div>
          <h1 className="stream-title">点滴</h1>
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

      {showBlank ? renderBlankBody() : (
        <TimelineStream
          blocks={timeline}
          endRef={timelineEndRef}
          sisterPlayAnimation={sisterPlayAnimation}
          sisterCycleDone={sisterCycleDone}
          hideTodayGuide={hideTodayGuide}
          onSisterCycleComplete={onSisterCycleComplete}
        />
      )}
    </div>
  );
}

Object.assign(window, {
  RecordBlankStream,
  RecordBlankEmptyState,
  RecordBlankAxisDropAnim,
});
