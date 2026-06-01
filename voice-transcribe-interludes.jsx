// voice-transcribe-interludes.jsx — 场景五 · 实时转写浮层（气泡 / 顶起 / 悬浮）
// Three variants of "where does the live text appear during press-and-hold":
//   live-drop   — text streams directly into a timeline card (no overlay)
//   live-bubble — speech bubble above the bar with live text + tail
//   live-grow   — panel grows upward from the bar (no bubble shape)
//   live-float  — bare floating text drifts above the bar, unboxed
/* global React, VT_T */

const { useState, useEffect, useRef } = React;

if(!window.VT_T){
  window.VT_T = {
    ink: '#323232',
    ink2: '#666666',
    ink3: '#999999',
    pink: '#ff4d88',
    pinkDeep: '#e04378',
    pinkBorder: 'rgba(255,77,136,0.28)',
    pinkSoft: 'rgba(255,77,136,0.08)',
  };
}
const VT_T = window.VT_T;

function Sparkle({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z" fill={VT_T.pink} />
    </svg>
  );
}

function AIOrb({ size = 22 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "conic-gradient(from 0deg, #f43f7c, #ff8bb3, #ffd9e6, #f43f7c)",
      animation: "orbSpin 3s linear infinite",
      display: "grid", placeItems: "center", flexShrink: 0,
    }}>
      <span style={{
        width: size - 8, height: size - 8, borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%, #fff 0%, #ffd9e6 60%, #f43f7c 100%)",
      }} />
    </div>
  );
}

function ThinkingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center", marginLeft: 4 }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          width: 4, height: 4, borderRadius: 2, background: VT_T.pink, display: "inline-block",
          animation: `aiThinkPulse 1.2s ease-in-out infinite`, animationDelay: `${i * 0.15}s`,
        }} />
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// V2 · LIVE-BUBBLE  — speech bubble above the bar
// ─────────────────────────────────────────────────────────────
function LiveBubble({ text, active, exiting = false }) {
  const anim = active
    ? 'bloomUp 0.32s cubic-bezier(.2,.7,.3,1)'
    : exiting
      ? 'bubbleFly 0.3s cubic-bezier(0.22,1,0.36,1) forwards'
      : undefined;
  return (
    <div
      className="vt-live-bubble"
      style={{
        animation: anim,
        ['--fly-x']: '-20px',
        ['--fly-y']: '-200px',
      }}
    >
      <div style={{
        maxWidth: "88%", minWidth: 120,
        background: "linear-gradient(135deg, #fff 0%, #fff5f8 100%)",
        border: `1px solid ${VT_T.pinkBorder}`,
        borderRadius: 18, padding: "12px 14px 12px 40px",
        position: "relative",
        boxShadow: "0 16px 36px -10px rgba(244,63,124,0.32), 0 2px 8px rgba(0,0,0,0.06)",
      }}>
        <div style={{ position: "absolute", left: 10, top: 10 }}>
          <AIOrb size={22} />
        </div>
        <div style={{ fontSize: 13.5, color: VT_T.ink, lineHeight: 1.65, minHeight: 22 }}>
          {text ? (
            <>{text}<span className="ai-caret" /></>
          ) : (
            <span style={{ color: VT_T.ink3, display: "inline-flex", alignItems: "center" }}>
              正在听<ThinkingDots />
            </span>
          )}
        </div>
        <div style={{
          position: "absolute", bottom: -7, left: 64,
          width: 14, height: 14, transform: "rotate(45deg)",
          background: "#fff",
          borderRight: `1px solid ${VT_T.pinkBorder}`,
          borderBottom: `1px solid ${VT_T.pinkBorder}`,
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V3 · LIVE-GROW — docked panel growing upward from the bar
// ─────────────────────────────────────────────────────────────
function LiveGrowPanel({ text, active, exiting = false }) {
  const anim = active
    ? 'growUp 0.32s cubic-bezier(.2,.7,.3,1)'
    : exiting
      ? 'growUpExit 0.3s cubic-bezier(0.22,1,0.36,1) forwards'
      : undefined;
  return (
    <div
      className="vt-live-grow"
      style={{ animation: anim }}
    >
      <div style={{
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(14px)",
        border: `1px solid ${VT_T.pinkBorder}`,
        borderRadius: 20, padding: "14px 16px",
        boxShadow: "0 -10px 32px -10px rgba(244,63,124,0.35)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <AIOrb size={20} />
          <span className="ai-text-shimmer" style={{ fontSize: 12, fontWeight: 700 }}>
            AI 正在实时转写
          </span>
          <ThinkingDots />
        </div>
        <div style={{ fontSize: 14, color: VT_T.ink, lineHeight: 1.7, minHeight: 24 }}>
          {text ? (
            <>{text}<span className="ai-caret" /></>
          ) : (
            <span style={{ color: VT_T.ink3 }}>正在听…</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V4 · LIVE-FLOAT — bare floating text above the bar, no chrome.
// Text uses layered white-halo shadows for legibility on any bg.
// The recorder bar hides its overlapping cancel-hint chip for this variant.
// ─────────────────────────────────────────────────────────────
function LiveFloat({ text, active, exiting = false }) {
  const anim = active
    ? 'bloomUp 0.32s cubic-bezier(.2,.7,.3,1)'
    : exiting
      ? 'floatAway 0.3s cubic-bezier(0.22,1,0.36,1) forwards'
      : undefined;
  return (
    <div
      className="vt-live-float"
      style={{ animation: anim }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{
          flexShrink: 0,
          filter: "drop-shadow(0 2px 8px rgba(255,255,255,0.95)) drop-shadow(0 0 6px rgba(255,255,255,0.8))",
        }}>
          <AIOrb size={20} />
        </div>
        <div style={{ flex: 1, paddingTop: 0, minWidth: 0 }}>
          <div style={{
            fontSize: 13,
            lineHeight: 1.7,
            fontWeight: 500,
            color: VT_T.pinkDeep,
            letterSpacing: "0.01em",
            // soft white halo for legibility, no hard shadow
            textShadow: [
              "0 0 6px rgba(255,255,255,0.95)",
              "0 0 12px rgba(255,255,255,0.85)",
              "0 0 20px rgba(255,255,255,0.6)",
              "0 1px 0 rgba(255,255,255,0.9)",
            ].join(", "),
            minHeight: 22,
          }}>
            {text ? (
              <>{text}<span className="ai-caret" /></>
            ) : (
              <span style={{ color: VT_T.pink, opacity: 0.65, fontSize: 12 }}>
                正在听…
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 异步方案 · 按住录音可视化（与松手后转写风格匹配）──
const barFill = (cancel) => cancel ? '#cdc4c0' : 'linear-gradient(180deg, #ff8bb3 0%, #ff4d88 100%)';

function WaveBars({ cancel, blur = false, profile }) {
  return (
    <div className="vt-recwave-field" style={{ filter: blur ? 'blur(2.4px)' : 'none' }}>
      {profile.map((p, i) => (
        <span key={i} className="recwave-bar" style={{
          flex: 1, height: p.base, minWidth: 2, borderRadius: 2,
          background: barFill(cancel), opacity: cancel ? 0.7 : 0.88,
          animation: cancel ? 'none' : `liveBar ${p.dur}s ease-in-out ${p.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

function CalmPulse({ cancel, profile }) {
  return (
    <div className="vt-recwave-field vt-recwave-field--calm">
      {profile.slice(0, 22).map((p, i) => (
        <span key={i} style={{
          width: 3, height: 4 + (i % 3), borderRadius: 2,
          background: cancel ? '#cdc4c0' : VT_T.pink, opacity: cancel ? 0.6 : 0.55,
          animation: cancel ? 'none' : `aiThinkPulse ${1 + (i % 4) * 0.18}s ease-in-out ${(i % 6) * 0.1}s infinite`,
        }} />
      ))}
    </div>
  );
}

function GlowOrb({ cancel }) {
  return (
    <div className="vt-rec-glow-orb">
      {!cancel && [0, 1].map((i) => (
        <span key={i} className="vt-rec-glow-ring" style={{ animationDelay: `${i * 0.9}s` }} />
      ))}
      <div className={'vt-rec-glow-core' + (cancel ? ' is-cancel' : '')} />
    </div>
  );
}

function InkStroke({ cancel }) {
  return (
    <div className="vt-rec-ink">
      <div className={'vt-rec-ink-line' + (cancel ? ' is-cancel' : '')} />
      {!cancel && <div className="vt-rec-ink-nib" />}
    </div>
  );
}

function ListenRings({ cancel }) {
  return (
    <div className="vt-rec-listen">
      {!cancel && [0, 1, 2].map((i) => (
        <span key={i} className="vt-rec-glow-ring" style={{ animationDelay: `${i * 0.7}s` }} />
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <AIOrb size={24} />
        {!cancel && <ThinkingDots />}
      </div>
    </div>
  );
}

function RecordingWave({ active, elapsed = 0, cancel = false, variant = 'wave' }) {
  const profileRef = useRef(null);
  if(!profileRef.current){
    profileRef.current = Array.from({ length: 34 }).map((_, i) => ({
      base: 8 + ((i * 37) % 22),
      dur: 0.55 + ((i * 13) % 9) * 0.06,
      delay: ((i * 17) % 11) * 0.06,
    }));
  }
  const profile = profileRef.current;

  const mm = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const ss = Math.floor(elapsed % 60).toString().padStart(2, '0');
  const accent = cancel ? VT_T.ink2 : VT_T.pink;
  const listening = variant === 'glow' || variant === 'stream';
  const statusLabel = cancel ? '松开取消' : (listening ? '正在聆听' : '正在录音');

  let visual;
  if(variant === 'glow') visual = <GlowOrb cancel={cancel} />;
  else if(variant === 'stream') visual = <ListenRings cancel={cancel} />;
  else if(variant === 'calm' || variant === 'bar-transcribing') visual = <CalmPulse cancel={cancel} profile={profile} />;
  else if(variant === 'focus') visual = (
    <div className="vt-rec-focus-wrap">
      <WaveBars cancel={cancel} blur profile={profile} />
      {!cancel && <div className="vt-rec-frost-sweep" />}
    </div>
  );
  else visual = <WaveBars cancel={cancel} profile={profile} />;

  return (
    <div
      className={'vt-recording-wave' + (active ? ' is-active' : '') + (cancel ? ' is-cancel' : '')}
      style={{ animation: active ? 'bloomUp 0.32s cubic-bezier(.2,.7,.3,1) both' : 'floatAway 0.4s forwards' }}
    >
      <div className="vt-recording-wave-card">
        <div className="vt-recording-wave-head">
          <div className="vt-recording-wave-status">
            <span className="proc-dot" style={{ background: accent }} />
            <span style={{ color: cancel ? VT_T.ink2 : VT_T.pinkDeep }}>{statusLabel}</span>
          </div>
          <span className="vt-recording-wave-time" style={{ color: accent }}>{mm}:{ss}</span>
        </div>
        {visual}
      </div>
    </div>
  );
}

Object.assign(window, { LiveBubble, LiveGrowPanel, LiveFloat, RecordingWave });
