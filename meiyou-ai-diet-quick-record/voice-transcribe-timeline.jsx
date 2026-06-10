// voice-transcribe-timeline.jsx — 场景五 · 语音实时转写时间轴
/* global React */

const { useState, useEffect, useRef } = React;

// ── tokens ───────────────────────────────────────────────────
const VT_T = {
  bg:        "#f6efeb",
  ink:       "#1f1a1a",
  ink2:      "#564e4e",
  ink3:      "#9a8f8f",
  ink4:      "#c4bbb7",
  pink:      "#f43f7c",
  pinkDeep:  "#d62a66",
  pinkSoft:  "#ffe4ee",
  pinkSofter:"#fff5f8",
  pinkBorder:"#fbd5e0",
  card:      "#ffffff",
  cardBorder:"#f0e7e3",
  green:     "#22c08a",
};

// ── icons ────────────────────────────────────────────────────
function Sparkle({ size = 14, color = VT_T.pink }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z" fill={color} />
    </svg>
  );
}
function ChevDown({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke={VT_T.ink3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CalIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5" width="17" height="15" rx="3" stroke={VT_T.ink} strokeWidth="1.6"/><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke={VT_T.ink} strokeWidth="1.6" strokeLinecap="round"/></svg>; }
function BellIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 9a6 6 0 1 1 12 0v3l1.8 3H4.2L6 12V9z" stroke={VT_T.ink} strokeWidth="1.6" strokeLinejoin="round"/><path d="M10 18a2 2 0 0 0 4 0" stroke={VT_T.ink} strokeWidth="1.6" strokeLinecap="round"/></svg>; }

// ── mood face ────────────────────────────────────────────────
function MoodFace({ kind = "sad", size = 40 }) {
  const faces = {
    sad:    { mouth: <path d="M7.5 16.5c1.2-1.6 2.8-2.4 4.5-2.4s3.3.8 4.5 2.4" stroke={VT_T.pink} strokeWidth="1.7" strokeLinecap="round" fill="none"/> },
    tired:  { mouth: <path d="M8 16h8" stroke={VT_T.pink} strokeWidth="1.7" strokeLinecap="round"/> },
    happy:  { mouth: <path d="M7.5 13c1.2 1.6 2.8 2.4 4.5 2.4s3.3-.8 4.5-2.4" stroke={VT_T.pink} strokeWidth="1.7" strokeLinecap="round" fill="none"/> },
  };
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: VT_T.pinkSoft, display: "grid", placeItems: "center", flexShrink: 0 }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        <circle cx="8.5" cy="10" r="1.3" fill={VT_T.pink} />
        <circle cx="15.5" cy="10" r="1.3" fill={VT_T.pink} />
        {faces[kind].mouth}
      </svg>
    </div>
  );
}

// ── cards ────────────────────────────────────────────────────
function CardShell({ children, style }) {
  return (
    <div style={{
      background: VT_T.card, border: `1px solid ${VT_T.cardBorder}`,
      borderRadius: 18, padding: 16, ...style,
    }}>{children}</div>
  );
}

function CycleStatusDot({ color, label, sub, active }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
      <div style={{
        width: 38, height: 38, borderRadius: "50%",
        background: active
          ? `radial-gradient(circle at 32% 28%, #fff 0%, ${color} 55%, ${color} 100%)`
          : `radial-gradient(circle at 32% 28%, #fff 0%, #cdc6c3 55%, #b3acaa 100%)`,
        boxShadow: active ? `0 4px 10px -3px ${color}80` : "none",
      }} />
      <div style={{ fontSize: 12, fontWeight: 600, color: active ? VT_T.ink : VT_T.ink3 }}>{label}</div>
      <div style={{ fontSize: 9.5, color: active ? VT_T.pink : VT_T.ink3, lineHeight: 1.3, textAlign: "center", whiteSpace: "pre-line" }}>{sub}</div>
    </div>
  );
}

function CycleCard() {
  return (
    <CardShell>
      <div style={{ display: "flex", gap: 4, paddingBottom: 12 }}>
        <CycleStatusDot color={VT_T.green} label="稳定"    sub={"21–35天"}        active />
        <CycleStatusDot color="#bcb6b3" label="轻度波动" sub={"18–20天\n36–45天"} />
        <CycleStatusDot color="#bcb6b3" label="明显波动" sub={"15–17天\n46–90天"} />
        <CycleStatusDot color="#bcb6b3" label="建议关注" sub={"<15天\n>90天"} />
      </div>
      <div style={{ height: 1, background: VT_T.cardBorder, margin: "0 -16px 12px" }} />
      <div style={{ fontSize: 13, color: VT_T.ink2, lineHeight: 1.65 }}>
        这次周期天数落在 21–35 天的理想范围内。很棒哦，继续保持现在的健康生活节奏就可以。
      </div>
    </CardShell>
  );
}

function MoodSparkline() {
  const pts = [40, 55, 30, 65, 50, 70, 45];
  const W = 320, H = 70;
  const stepX = W / (pts.length - 1);
  const path = pts.map((v, i) => `${i === 0 ? "M" : "L"}${i * stepX},${H - v}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H + 22}`} style={{ width: "100%", display: "block", marginTop: 6 }}>
      <path d={path} fill="none" stroke={VT_T.pink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((v, i) => (<circle key={i} cx={i * stepX} cy={H - v} r="3" fill="#fff" stroke={VT_T.pink} strokeWidth="1.6" />))}
      {["周一","周二","周三","周四","周五","周六","周日"].map((d, i) => (
        <text key={i} x={i * stepX} y={H + 16} fontSize="10" fill={VT_T.ink3} textAnchor="middle">{d}</text>
      ))}
    </svg>
  );
}

function MoodCard() {
  return (
    <CardShell>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkle size={14} />
          <div style={{ fontSize: 13, fontWeight: 600, color: VT_T.ink }}>AI 情绪与周期分析</div>
        </div>
        <ChevDown />
      </div>
      <div style={{
        background: VT_T.pinkSofter, border: `1px solid ${VT_T.pinkBorder}`,
        borderRadius: 12, padding: "10px 12px",
        display: "flex", gap: 8, alignItems: "flex-start",
      }}>
        <span style={{
          display: "inline-block", fontSize: 11, color: VT_T.pink, background: "#ffd9e6",
          padding: "2px 8px", borderRadius: 10, fontWeight: 600, whiteSpace: "nowrap", marginTop: 1, flexShrink: 0,
        }}>卵泡期</span>
        <div style={{ fontSize: 12.5, color: VT_T.ink2, lineHeight: 1.6 }}>
          卵泡期通常情绪相对平稳，如果今天格外低落，可能和睡眠、压力更相关
        </div>
      </div>
      <div style={{ marginTop: 14, fontSize: 12, color: VT_T.ink2, fontWeight: 600 }}>近 1 周情绪波动曲线</div>
      <MoodSparkline />
    </CardShell>
  );
}

function VoiceWaveform({ bars = 28, color = VT_T.pink, live = false }) {
  // a static-but-pulsing bar field
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 28, flex: 1 }}>
      {Array.from({ length: bars }).map((_, i) => {
        // pseudo-random heights, repeatable
        const h = 6 + ((i * 53) % 18) + (i % 5 === 0 ? 6 : 0);
        const delay = (i % 7) * 0.07;
        return (
          <div key={i}
            className={live ? "live-bar" : ""}
            style={{
              width: 3, height: h, borderRadius: 2,
              background: color, opacity: 0.7 + ((i % 4) * 0.07),
              animationDelay: `${delay}s`,
            }} />
        );
      })}
    </div>
  );
}

function ThinkingHalo() {
  return (
    <div style={{ position: "relative", width: 30, height: 30, flexShrink: 0 }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: `conic-gradient(from 0deg, ${VT_T.pink}, #ff8bb3, ${VT_T.pink})`,
        animation: "sparkleSpin 2.4s linear infinite",
        WebkitMask: "radial-gradient(circle, transparent 50%, black 52%)",
                mask: "radial-gradient(circle, transparent 50%, black 52%)",
      }} />
      <div style={{
        position: "absolute", inset: 6, borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%, #fff 0%, #ffd9e6 60%, #ffb3cd 100%)",
        animation: "orbA 2.2s ease-in-out infinite",
      }} />
      <div style={{ position: "absolute", top: -2, right: -2 }}>
        <Sparkle size={10} />
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center", marginLeft: 4 }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          width: 4, height: 4, borderRadius: 2, background: VT_T.pink, display: "inline-block",
          animation: `pulseDot 1.2s ease-in-out infinite`, animationDelay: `${i * 0.15}s`,
        }} />
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Live transcript card — used by live-drop variant.
// Sits in the timeline DURING the press-and-hold; text streams into it.
// ─────────────────────────────────────────────────────────────
function LiveTranscriptCard({ entry }) {
  return (
    <div style={{
      background: VT_T.card,
      border: `1.5px solid ${VT_T.pink}`,
      borderRadius: 18, padding: 14,
      position: "relative", overflow: "hidden",
      animation: "panelIn 0.35s cubic-bezier(.2,.7,.3,1)",
      boxShadow: "0 6px 20px -8px rgba(244,63,124,0.35)",
    }}>
      <div style={{
        position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(244,63,124,0.18) 0%, rgba(244,63,124,0) 70%)",
        animation: "orbA 3s ease-in-out infinite", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -50, left: -30, width: 160, height: 160, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,180,210,0.25) 0%, rgba(255,180,210,0) 70%)",
        animation: "orbB 3.4s ease-in-out infinite", pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, position: "relative" }}>
        <ThinkingHalo />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: VT_T.ink }}>
            <span className="ai-text-shimmer">AI 正在实时转写</span>
          </div>
          <div style={{ fontSize: 10.5, color: VT_T.ink3, marginTop: 1 }}>
            录音中 · 0:{String(Math.min(99, entry.duration || 0)).padStart(2,"0")}
          </div>
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 10, color: "#fff", padding: "3px 9px", borderRadius: 10,
          background: VT_T.pink, fontWeight: 700,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: 3, background: "#fff",
            animation: "aiThinkPulse 1s ease-in-out infinite",
          }} />
          REC
        </span>
      </div>

      <div style={{ fontSize: 13.5, color: VT_T.ink, lineHeight: 1.8, minHeight: 24, position: "relative" }}>
        {entry.liveText ? (
          <>{entry.liveText}<span className="ai-caret" /></>
        ) : (
          <span style={{ color: VT_T.ink3, display: "inline-flex", alignItems: "center" }}>
            正在听<ThinkingDots />
          </span>
        )}
      </div>
    </div>
  );
}

function TranscriptionEntry({ entry, speed = 1, onSettled }) {
  // ─── LIVE MODE: text streaming into card in real-time ───
  if (entry.isLive) {
    return <LiveTranscriptCard entry={entry} />;
  }

  const skipReveal = entry.skipTextAnim || (entry.variant && entry.variant.startsWith("live"));

  // stages: 0 waveform, 1 thinking, 2 reveal, 3 settled
  const [stage, setStage] = useState(skipReveal ? 3 : (entry.initialStage ?? 0));
  const settledFiredRef = useRef(false);

  useEffect(() => {
    if (skipReveal) { setStage(3); return; }
    if (entry.initialStage === 3) return;
    const dur = (ms) => ms / speed;
    const t1 = setTimeout(() => setStage(1), dur(900));
    const t2 = setTimeout(() => setStage(2), dur(2100));
    const wordDur = entry.words.length * 90 + 600;
    const t3 = setTimeout(() => setStage(3), dur(2100 + wordDur));
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [entry.id, speed, skipReveal]);

  useEffect(() => {
    if (stage === 3 && !settledFiredRef.current) {
      settledFiredRef.current = true;
      onSettled && onSettled(entry.id);
    }
  }, [stage, entry.id, onSettled]);

  // Stage-specific border / glow
  const isActive = stage < 3;
  const wrapStyle = {
    background: VT_T.card,
    border: `1px solid ${isActive ? VT_T.pinkBorder : VT_T.cardBorder}`,
    borderRadius: 18, padding: 14,
    position: "relative", overflow: "hidden",
    animation: entry.justAdded ? "panelIn 0.45s cubic-bezier(.2,.7,.3,1)" : undefined,
    transition: "border-color 0.4s",
  };

  return (
    <div style={wrapStyle}>
      {/* glow background while active */}
      {isActive && (
        <>
          <div style={{
            position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(244,63,124,0.18) 0%, rgba(244,63,124,0) 70%)",
            animation: "orbA 3s ease-in-out infinite", pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: -50, left: -30, width: 160, height: 160, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,180,210,0.25) 0%, rgba(255,180,210,0) 70%)",
            animation: "orbB 3.4s ease-in-out infinite", pointerEvents: "none",
          }} />
        </>
      )}

      {/* ─── STAGES 0 / 1: AI is listening / transcribing ─── */}
      {stage < 2 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, position: "relative" }}>
            <ThinkingHalo />
            <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: VT_T.ink, display: "flex", alignItems: "center" }}>
                {stage === 0 ? <>正在收听<ThinkingDots /></> : <span className="ai-text-shimmer">AI 正在转写语音<ThinkingDots /></span>}
              </div>
              <div style={{ fontSize: 10.5, color: VT_T.ink3 }}>
                {stage === 0 ? `录音 ${entry.duration}″` : "理解中 · 提取要点 · 关联周期"}
              </div>
            </div>
          </div>

          {/* big animated waveform card while AI is working */}
          <div style={{
            background: VT_T.pinkSofter, border: `1px solid ${VT_T.pinkBorder}`,
            borderRadius: 12, padding: "10px 12px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <PlayBtn />
            <VoiceWaveform live={stage === 0} bars={26} />
            <div style={{ fontSize: 11, color: VT_T.ink2, fontVariantNumeric: "tabular-nums", minWidth: 32, textAlign: "right" }}>
              0:{String(entry.duration).padStart(2,"0")}
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 7 }}>
            <div className="ai-skeleton-line" style={{ width: stage === 0 ? "92%" : "88%" }} />
            <div className="ai-skeleton-line" style={{ width: stage === 0 ? "76%" : "68%" }} />
            {stage === 1 && <div className="ai-skeleton-line" style={{ width: "40%" }} />}
          </div>
        </>
      )}

      {/* ─── STAGES 2 / 3: text revealed (then voice pill + tags settle in) ─── */}
      {stage >= 2 && (
        <>
          <div style={{ fontSize: 13.5, color: VT_T.ink, lineHeight: 1.8, position: "relative" }}>
            {/* ripple variant: a pink highlight bar sweeps under the text once */}
            {entry.variant === "ripple" && stage === 2 && (
              <span style={{
                position: "absolute", top: 0, bottom: 0, left: 0,
                width: "30%", borderRadius: 8,
                background: "linear-gradient(90deg, rgba(244,63,124,0) 0%, rgba(244,63,124,0.18) 50%, rgba(244,63,124,0) 100%)",
                animation: `sweepBar ${Math.max(0.9, entry.words.length * 0.07)}s ease-out forwards`,
                pointerEvents: "none",
              }} />
            )}
            {entry.words.map((w, i) => {
              if (skipReveal) {
                return <span key={i} style={{ opacity: 1 }}>{w}</span>;
              }
              const variantClass = entry.variant === "bloom"   ? "v-bloom"
                                 : entry.variant === "ripple"  ? "v-ripple"
                                 : entry.variant === "classic" ? "v-classic"
                                 :                                "v-emerge";
              const stagger = entry.variant === "classic" ? 0.045
                             : entry.variant === "ripple" ? 0.055
                             : entry.variant === "bloom"  ? 0.06
                             :                              0.07;
              return (
                <span key={i} className={`ai-word ${variantClass}`}
                  style={{ animationDelay: `${i * stagger}s` }}>{w}</span>
              );
            })}
            {stage === 2 && <span className="ai-caret" />}
            {/* inline voice pill slides in at the END of the text once settled */}
            {stage === 3 && (
              <InlineVoicePill duration={entry.duration} />
            )}
          </div>

          {/* tags row */}
          {stage === 3 && entry.tags && entry.tags.length > 0 && (
            <div style={{
              display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12,
              animation: "panelIn 0.45s 0.1s cubic-bezier(.2,.7,.3,1) both",
            }}>
              {entry.tags.map((tag, i) => (
                <TagChip key={i} tag={tag} />
              ))}
            </div>
          )}

          {/* AI insight footer */}
          {stage === 3 && entry.aiInsight && (
            <div style={{
              marginTop: 12, paddingTop: 10, borderTop: `1px solid ${VT_T.cardBorder}`,
              display: "flex", alignItems: "center", gap: 6,
              animation: "panelIn 0.45s 0.25s cubic-bezier(.2,.7,.3,1) both",
            }}>
              <AISparkIcon />
              <span style={{ fontSize: 12, color: VT_T.ink2, fontWeight: 500 }}>
                <span style={{ color: VT_T.pink, fontWeight: 700, marginRight: 4 }}>AI</span>
                {entry.aiInsight}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Inline voice pill — sits at the end of the transcribed text
// ─────────────────────────────────────────────────────────────
function InlineVoicePill({ duration }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: VT_T.pinkSoft, borderRadius: 999,
      padding: "2px 9px 2px 2px",
      marginLeft: 6, verticalAlign: "middle",
      animation: "pillIn 0.5s cubic-bezier(.2,.7,.3,1.3) both",
      animationDelay: "0.15s",
    }}>
      <span style={{
        width: 20, height: 20, borderRadius: "50%",
        background: VT_T.pink, display: "grid", placeItems: "center",
        boxShadow: "0 2px 6px -1px rgba(244,63,124,0.45)",
      }}>
        <svg width="7" height="7" viewBox="0 0 12 12"><path d="M3 1.5l7 4.5-7 4.5V1.5z" fill="#fff" /></svg>
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 1.5 }}>
        {[5,9,6,11,7,4].map((h, i) => (
          <span key={i} style={{
            width: 1.5, height: h, borderRadius: 1, background: VT_T.pink, opacity: 0.85,
          }} />
        ))}
      </span>
      <span style={{
        fontSize: 11, color: VT_T.pinkDeep, fontWeight: 600,
        fontVariantNumeric: "tabular-nums", marginLeft: 2,
      }}>0:{String(duration).padStart(2,"0")}</span>
    </span>
  );
}

function TagChip({ tag }) {
  const isPhase = tag.kind === "phase";
  const isAI = tag.kind === "ai";
  return (
    <span style={{
      fontSize: 11.5, padding: "4px 10px", borderRadius: 12,
      background: isAI ? "#fff2f6" : VT_T.pinkSoft,
      color: VT_T.pink, fontWeight: 600,
      display: "inline-flex", alignItems: "center", gap: 5,
      border: isAI ? `1px dashed ${VT_T.pinkBorder}` : "none",
    }}>
      {isAI ? <Sparkle size={9} /> : <span style={{
        width: 12, height: 12, borderRadius: "50%",
        border: `1.2px solid ${VT_T.pink}`, display: "inline-block",
        position: "relative",
      }}>
        <span style={{
          position: "absolute", inset: 2.5, borderRadius: "50%",
          background: tag.dot || VT_T.pink, opacity: 0.85,
        }} />
      </span>}
      {tag.category && <span style={{ color: VT_T.pinkDeep, fontWeight: 500 }}>{tag.category}</span>}
      <span>{tag.label}</span>
    </span>
  );
}

function AISparkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="9" width="2.4" height="5" rx="1" fill={VT_T.pink} />
      <rect x="6.8" y="5" width="2.4" height="9" rx="1" fill={VT_T.pink} />
      <rect x="11.6" y="2" width="2.4" height="12" rx="1" fill={VT_T.pink} opacity="0.6" />
    </svg>
  );
}

function PlayBtn() {
  return (
    <button style={{
      width: 28, height: 28, borderRadius: "50%", border: "none",
      background: VT_T.pink, display: "grid", placeItems: "center",
      flexShrink: 0, cursor: "pointer",
      boxShadow: "0 4px 10px -3px rgba(244,63,124,0.5)",
    }}>
      <svg width="10" height="10" viewBox="0 0 12 12"><path d="M3 1.5l7 4.5-7 4.5V1.5z" fill="#fff" /></svg>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Generic time-stamped row in timeline
// ─────────────────────────────────────────────────────────────
function TimelineRow({ time, label, sub, children, accent = false, animateIn = false }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "44px 1fr", gap: 16, position: "relative",
      animation: animateIn ? "panelIn 0.45s cubic-bezier(.2,.7,.3,1)" : undefined,
    }}>
      <div style={{ paddingTop: 4, textAlign: "right" }}>
        <div style={{ fontSize: 12, color: VT_T.ink2, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{time}</div>
        {label && <div style={{ fontSize: 11, color: VT_T.ink3, marginTop: 3 }}>{label}</div>}
        {sub && <div style={{ fontSize: 11, color: VT_T.ink3, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{
        paddingLeft: 22, borderLeft: `1.5px dashed ${VT_T.ink4}`,
        paddingBottom: 14, position: "relative",
      }}>
        {/* dot sits ON the dashed line */}
        <div style={{
          width: 10, height: 10, borderRadius: "50%",
          background: accent ? VT_T.pink : "#fff",
          border: `2px solid ${accent ? VT_T.pink : VT_T.ink4}`,
          position: "absolute", left: -6, top: 6,
          boxShadow: accent ? "0 0 0 4px rgba(244,63,124,0.12)" : "none",
          zIndex: 2,
        }} />
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Timeline screen
// ─────────────────────────────────────────────────────────────
function VoiceTranscribeTimeline({ entries, onSettled, tabs }) {
  const [activeTab, setActiveTab] = useState(0);
  const TABS = tabs ?? ["全部", "经期", "情绪", "体征", "用药"];
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when entries change or live text streams in
  const liveSignal = entries.map(e => (e.isLive ? (e.liveText || "").length : 0)).join("|") + "|" + entries.length;
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [liveSignal]);

  return (
    <div style={{
      height: "100%", background: VT_T.bg, display: "flex", flexDirection: "column",
      fontFamily: '-apple-system, "PingFang SC", "Helvetica Neue", sans-serif',
    }}>
      {/* app bar */}
      <div style={{
        padding: "54px 18px 8px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: VT_T.ink, letterSpacing: "-0.01em" }}>点滴</div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <CalIcon /><BellIcon />
        </div>
      </div>

      {/* tabs */}
      <div style={{ display: "flex", gap: 8, padding: "10px 18px 6px", overflowX: "auto" }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setActiveTab(i)} style={{
            padding: "7px 14px", borderRadius: 16, border: "none",
            background: i === activeTab ? VT_T.ink : "#fff",
            color: i === activeTab ? "#fff" : VT_T.ink2,
            fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            border: i === activeTab ? "none" : `1px solid ${VT_T.cardBorder}`,
          }}>{t}</button>
        ))}
      </div>

      {/* date header */}
      <div style={{ padding: "12px 18px 6px" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: VT_T.ink }}>2024年10月25日</div>
        <div style={{ fontSize: 12, color: VT_T.ink3, marginTop: 2 }}>
          周五 · <span style={{ color: VT_T.pink, fontWeight: 600 }}>卵泡期 第8天</span>
        </div>
      </div>

      {/* timeline list */}
      <div ref={scrollRef} className="phone-scroll" style={{ flex: 1, overflowY: "auto", padding: "8px 12px 140px" }}>
        {entries.map((e) => (
          <TimelineRow
            key={e.id}
            time={e.time}
            label={e.kind === "voice" ? "语音" : e.kind === "mood" ? "情绪" : "经期"}
            accent={e.accent || e.kind === "voice"}
            animateIn={e.justAdded}
          >
            {e.kind === "cycle"   && (<><div style={{fontSize:14,fontWeight:600,color:VT_T.ink,marginBottom:8}}>周期天数 · 28天</div><CycleCard /></>)}
            {e.kind === "mood"    && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <MoodFace kind="sad" size={36} />
                  <div style={{ fontSize: 16, fontWeight: 600, color: VT_T.ink }}>不开心</div>
                </div>
                <MoodCard />
              </>
            )}
            {e.kind === "voice"   && <TranscriptionEntry entry={e} speed={e.speed || 1} onSettled={onSettled} />}
          </TimelineRow>
        ))}

        {/* AI summary footer */}
        <div style={{
          marginTop: 4, marginLeft: 60,
          fontSize: 11.5, color: VT_T.ink3, lineHeight: 1.6,
          padding: "8px 12px", background: "#fff", borderRadius: 12, border: `1px solid ${VT_T.cardBorder}`,
        }}>
          <Sparkle size={10} /> &nbsp;AI 已根据今日记录更新画像，可在「我的」中查看
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { VoiceTranscribeTimeline, VoiceWaveform, VT_T });
