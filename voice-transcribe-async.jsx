// voice-transcribe-async.jsx — 场景五 · 异步转写（对齐点滴 v2：顶栏语音条 → 句尾胶囊）
/* global React, VT_T, V3v2Header, TLChart, TLTag */

const TL_PRIMARY = '#ff4d88';
const TL_TEXT = 'rgba(0,0,0,0.8)';
const TL_MUTED = 'rgba(0,0,0,0.6)';
const TL_LINE = 'rgba(0,0,0,0.08)';
const TL_HAIR = 'rgba(0,0,0,0.06)';
const TL_SOFT = 'rgba(255,77,136,0.08)';
const TL_PINK_SOFT = 'rgba(255,77,136,0.08)';
const TL_PINK_BORDER = 'rgba(255,77,136,0.28)';

const { useState, useEffect, useRef, useLayoutEffect } = React;

/** 时间轴转写动效 variant（不含 bar-transcribing，该方案仅影响底栏） */
const VT_ASYNC_VARIANTS = ['calm', 'wave', 'glow', 'focus', 'stream'];
const VT_DOCK_TRANSCRIBING = 'bar-transcribing';

const PROC_MS = { calm: 600, wave: 750, glow: 950, stream: 1300, focus: 820 };
const PER_MS = { calm: 44, wave: 52, glow: 74, stream: 36, focus: 26 };

function isAsyncVoiceVariant(v){
  return VT_ASYNC_VARIANTS.includes(v) || v === VT_DOCK_TRANSCRIBING;
}

function timelineVariantFor(v){
  return v === VT_DOCK_TRANSCRIBING ? 'calm' : v;
}

function VtThinkingDots(){
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center', marginLeft: 4 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 4, height: 4, borderRadius: 2, background: VT_T.pink, display: 'inline-block',
          animation: 'aiThinkPulse 1.2s ease-in-out infinite', animationDelay: `${i * 0.15}s`,
        }} />
      ))}
    </span>
  );
}

function VtThinkingHalo(){
  return (
    <div className="vt-thinking-halo">
      <div className="vt-thinking-halo-ring" />
      <div className="vt-thinking-halo-core" />
    </div>
  );
}

function VtProcessingHeader({ variant, duration }){
  const v = timelineVariantFor(variant);
  if(v === 'calm'){
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span className="proc-dot" />
        <span style={{ fontSize: 12.5, fontWeight: 500, color: TL_MUTED }}>转写中</span>
        <VtThinkingDots />
      </div>
    );
  }
  const title = v === 'wave' ? '正在把声音转成文字'
    : v === 'focus' ? 'AI 正在显影文字'
    : v === 'stream' ? 'AI 正在理解你的语音'
    : 'AI 正在转写';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      {v === 'stream' ? (
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          background: 'conic-gradient(from 0deg, #ff4d88, #ff8bb3, #ffd9e6, #ff4d88)',
          animation: 'orbSpin 3s linear infinite',
        }} />
      ) : <VtThinkingHalo />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: TL_TEXT, display: 'flex', alignItems: 'center' }}>
          <span className="ai-text-shimmer">{title}</span><VtThinkingDots />
        </div>
        <div style={{ fontSize: 10.5, color: TL_MUTED, marginTop: 1 }}>
          语音 {duration}″ · 提取要点 · 关联周期
        </div>
      </div>
    </div>
  );
}

function VtPlayBtn(){
  return (
    <button type="button" className="vt-voice-msg-play" aria-label="播放">
      <svg width="9" height="9" viewBox="0 0 12 12"><path d="M3 1.5l7 4.5-7 4.5V1.5z" fill="#fff" /></svg>
    </button>
  );
}

function VtVoiceMessageBar({ duration, live = false, morph = null, compact = false, exiting = false }){
  const N = 30;
  const bars = Array.from({ length: N }).map((_, i) => 6 + ((i * 53) % 16) + (i % 4 === 0 ? 7 : 0));
  return (
    <div className={'vt-voice-msg-bar' + (exiting ? ' is-exiting' : '') + (compact ? ' is-compact' : '')}>
      <VtPlayBtn />
      <div className="vt-voice-msg-waves">
        {bars.map((h, i) => {
          const consumed = morph != null && i / N < morph;
          return (
            <span
              key={i}
              className={live ? 'live-bar' : ''}
              style={{
                flex: 1, minWidth: 2, height: h, borderRadius: 2,
                background: consumed ? TL_PINK_BORDER : VT_T.pink,
                opacity: consumed ? 0.5 : 0.78 + ((i % 4) * 0.06),
                transform: consumed ? 'scaleY(0.45)' : undefined,
                transition: 'background 0.3s, opacity 0.3s, transform 0.3s',
                animationDelay: `${(i % 7) * 0.07}s`,
              }}
            />
          );
        })}
      </div>
      <span className="vt-voice-msg-dur">0:{String(duration).padStart(2, '0')}</span>
    </div>
  );
}

function VtInlineVoicePill({ duration, innerRef }){
  const bars = [6, 11, 7, 13, 8, 5];
  return (
    <span ref={innerRef} className="vt-inline-voice-pill">
      <span className="vt-inline-voice-play" aria-hidden="true">
        <svg width="8" height="8" viewBox="0 0 12 12"><path d="M3 1.5l7 4.5-7 4.5V1.5z" fill="#fff" /></svg>
      </span>
      <span className="vt-inline-voice-bars" aria-hidden="true">
        {bars.map((h, i) => (
          <span key={i} className="live-bar" style={{
            width: 2, height: h, borderRadius: 1, background: VT_T.pink, opacity: 0.9,
            animationDelay: `${(i % 5) * 0.08}s`,
          }} />
        ))}
      </span>
      <span className="vt-inline-voice-dur">0:{String(duration).padStart(2, '0')}</span>
    </span>
  );
}

function VtAsyncTranscriptionBody({ primary, variant, isNew, onDone, onPhaseChange }){
  const chars = primary.chars || [...(primary.text || '')];
  const duration = primary.durationSec || 2;
  const rawVariant = variant || primary.vtVariant || 'calm';
  const isDockMode = rawVariant === VT_DOCK_TRANSCRIBING;
  const v = timelineVariantFor(rawVariant);
  const motion = 'inline';

  const [phase, setPhase] = useState(() => (isDockMode ? 'typing' : 'processing'));
  const [n, setN] = useState(0);
  const [barExiting, setBarExiting] = useState(false);
  const doneRef = useRef(false);
  const voiceBarRef = useRef(null);
  const pillRef = useRef(null);
  const flipFromRef = useRef(null);

  useEffect(() => {
    onPhaseChange?.(phase);
    if(typeof window.__vtOnTranscribePhase === 'function'){
      window.__vtOnTranscribePhase(phase);
    }
  }, [phase, onPhaseChange]);

  useEffect(() => {
    doneRef.current = false;
    flipFromRef.current = null;
    setBarExiting(false);
    setN(0);
    if(isDockMode){
      setPhase('typing');
      return undefined;
    }
    setPhase('processing');
    const t = setTimeout(() => setPhase('typing'), PROC_MS[v] || 900);
    return () => clearTimeout(t);
  }, [primary.id, v, isDockMode]);

  const goDone = () => {
    if(isDockMode){
      setPhase('done');
      return;
    }
    if(voiceBarRef.current){
      flipFromRef.current = voiceBarRef.current.getBoundingClientRect();
    }
    setBarExiting(true);
    setTimeout(() => {
      setPhase('done');
    }, 180);
  };

  useEffect(() => {
    if(phase !== 'typing') return;
    if(n >= chars.length){
      goDone();
      return;
    }
    const base = PER_MS[v] || 50;
    const last = chars[n - 1];
    const punct = '，。、；！？…'.includes(last) ? 220 : 0;
    const jitter = v === 'stream' ? Math.random() * 38 : 0;
    const id = setTimeout(() => setN((k) => k + 1), base + punct + jitter);
    return () => clearTimeout(id);
  }, [phase, n, chars.length, v]);

  useLayoutEffect(() => {
    if(phase !== 'done' || isDockMode) return;
    const from = flipFromRef.current;
    const pill = pillRef.current;
    flipFromRef.current = null;
    if(!from || !pill) return;
    const to = pill.getBoundingClientRect();
    const dx = (from.left + from.width / 2) - (to.left + to.width / 2);
    const dy = (from.top + from.height / 2) - (to.top + to.height / 2);
    const sx = Math.min(2.6, Math.max(1, from.width / Math.max(to.width, 1)));
    pill.style.transformOrigin = 'center';
    pill.style.transition = 'none';
    pill.style.transform = `translate(${dx}px, ${dy}px) scale(${sx})`;
    pill.style.opacity = '0.45';
    void pill.offsetWidth;
    requestAnimationFrame(() => {
      pill.style.transition = 'transform 0.55s cubic-bezier(.34,.86,.28,1), opacity 0.45s ease';
      pill.style.transform = 'translate(0,0) scale(1)';
      pill.style.opacity = '1';
    });
  }, [phase]);

  useEffect(() => {
    if(phase === 'done' && !doneRef.current){
      doneRef.current = true;
      onDone?.();
    }
  }, [phase, onDone]);

  const working = phase !== 'done';
  const typing = phase === 'typing';
  const barAtTop = !isDockMode && working && !barExiting;
  const morphProgress = !isDockMode && v === 'wave' && typing && chars.length ? n / chars.length : null;
  const showProcessingChrome = !isDockMode && working;

  const Caret = () => {
    if(v === 'glow') return <span className="caret-dot" />;
    if(v === 'stream') return <span className="caret-stream" />;
    if(v === 'focus') return <span className="caret-scan" />;
    return <span className="caret-bar" />;
  };

  const renderText = () => {
    if(v === 'focus'){
      return chars.map((c, i) => (
        <React.Fragment key={i}>
          {typing && i === n && <span className="caret-scan" />}
          <span className={`tw-char ${i < n ? 'tw-focus-on' : 'tw-focus-off'}`}>{c}</span>
        </React.Fragment>
      ));
    }
    const charClass = v === 'glow' ? 'tw-glow'
      : v === 'stream' ? 'tw-stream'
      : 'tw-plain';
    return (
      <>
        {chars.slice(0, n).map((c, i) => (
          <span key={i} className={`tw-char ${charClass}`}>{c}</span>
        ))}
        {phase === 'done' && motion === 'inline' && (
          <VtInlineVoicePill duration={duration} innerRef={pillRef} />
        )}
        {typing && <Caret />}
      </>
    );
  };

  return (
    <div className={'vt-async-card' + (isNew ? ' v3-card-enter' : '') + (showProcessingChrome ? ' is-working' : '') + (isDockMode ? ' is-dock-typewriter' : '')}>
      {showProcessingChrome && (
        <>
          <div className="vt-async-orb vt-async-orb-a" aria-hidden="true" />
          <div className="vt-async-orb vt-async-orb-b" aria-hidden="true" />
        </>
      )}

      {showProcessingChrome && (
        <div style={{ marginBottom: 10, position: 'relative' }}>
          <VtProcessingHeader variant={v} duration={duration} />
        </div>
      )}

      {barAtTop && (
        <div ref={voiceBarRef} className="vt-voice-msg-wrap">
          <VtVoiceMessageBar
            duration={duration}
            live={phase === 'processing'}
            morph={morphProgress}
            compact={false}
            exiting={barExiting}
          />
        </div>
      )}

      {(isDockMode || phase !== 'processing') && (
        <div className="vt-async-text">
          {renderText()}
        </div>
      )}
    </div>
  );
}

function VtAsyncRecordGroupCard({ group, isNew, onTranscribePhase }){
  const [showTags, setShowTags] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const [open, setOpen] = useState(false);
  const p = group.primary || {};
  const a = group.ai;
  const variant = group.vtVariant || p.vtVariant || 'calm';
  const tags = p.tags || [];

  const handleDone = () => {
    setShowTags(true);
    setTimeout(() => {
      setShowAi(true);
      setOpen(!!group.aiDefaultOpen);
      requestAnimationFrame(() => {
        if(typeof window.scrollTimelineToBottom === 'function'){
          window.scrollTimelineToBottom('smooth');
        }
      });
    }, 120);
  };

  return (
    <div style={{
      background: '#fff', borderRadius: 14, border: `0.5px solid ${TL_LINE}`,
      padding: '11px 12px 4px', overflow: 'hidden',
    }}>
      <V3v2Header time={p.time} />
      <div style={{ marginTop: 8, paddingBottom: showAi ? 10 : 8 }}>
        <VtAsyncTranscriptionBody
          primary={p}
          variant={variant}
          isNew={isNew}
          onDone={handleDone}
          onPhaseChange={onTranscribePhase}
        />
        {showTags && tags.length > 0 && (
          <div className="vt-async-tags v3-ai-stagger-in">
            {tags.map((t, i) => (
              <span key={i} className="tl-tags-reveal" style={{ animationDelay: `${i * 90}ms` }}>
                <TLTag tag={t} />
              </span>
            ))}
          </div>
        )}
      </div>
      {showAi && a && (
        <div className="v3-ai-stagger-in">
          <div style={{ borderTop: `0.5px dashed ${TL_HAIR}`, marginInline: -12 }} />
          <button
            type="button"
            onClick={() => setOpen((x) => !x)}
            style={{
              width: '100%', background: 'transparent', border: 0,
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 0', cursor: 'pointer', fontFamily: 'inherit',
            }}
            aria-expanded={open}
          >
            <div style={{
              width: 18, height: 18, borderRadius: 9, background: TL_SOFT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 10, color: TL_PRIMARY, fontWeight: 500 }}>AI</span>
            </div>
            <span style={{ fontSize: 12.5, color: TL_TEXT, fontWeight: 500, flex: 1, textAlign: 'left' }}>{a.title}</span>
            <span style={{ fontSize: 11, color: TL_MUTED }}>{open ? '▲' : '▼'}</span>
          </button>
          {open && (
            <div className="v3-ai-panel-in" style={{ paddingBottom: 12 }}>
              {a.chartType && <TLChart type={a.chartType} data={a.chartData} />}
              {a.note && (
                <div style={{ fontSize: 13, color: TL_TEXT, lineHeight: 1.55, marginTop: a.chartType ? 8 : 0 }}>
                  {a.note}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  VT_ASYNC_VARIANTS,
  VT_DOCK_TRANSCRIBING,
  timelineVariantFor,
  isAsyncVoiceVariant,
  VtAsyncRecordGroupCard,
  VtAsyncTranscriptionBody,
  VtInlineVoicePill,
});
