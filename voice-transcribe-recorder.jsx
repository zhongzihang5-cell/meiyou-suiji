// voice-transcribe-recorder.jsx — 场景五 · 按住说话输入条
/* global React */

const { useState, useEffect, useRef } = React;

const VT_T = window.VT_T || {
  ink2: '#666666',
  pink: '#ff4d88',
  pinkDeep: '#e04378',
  pinkBorder: 'rgba(255,77,136,0.28)',
};
window.VT_T = VT_T;

function VoiceTranscribeBar({
  onStart, onEnd, onCancel, recording, elapsed = 0, variant = 'live-drop',
  cancelHover = false, onCancelHoverChange,
}) {
  const startYRef = useRef(0);
  const [localCancel, setLocalCancel] = useState(false);
  const cancelHoverActive = onCancelHoverChange ? cancelHover : localCancel;
  const setCancelHover = (v) => {
    if(onCancelHoverChange) onCancelHoverChange(v);
    else setLocalCancel(v);
  };

  const handleDown = (e) => {
    e.preventDefault();
    startYRef.current = (e.touches?.[0]?.clientY ?? e.clientY) || 0;
    onStart && onStart();
  };
  const handleMove = (e) => {
    if(!recording) return;
    const y = (e.touches?.[0]?.clientY ?? e.clientY) || 0;
    setCancelHover(startYRef.current - y > 80);
  };
  const handleUp = () => {
    if(!recording) return;
    if(cancelHoverActive) onCancel && onCancel();
    else onEnd && onEnd();
    setCancelHover(false);
  };

  useEffect(() => {
    if(!recording) return;
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [recording, cancelHoverActive]);

  const [tick, setTick] = useState(0);
  useEffect(() => {
    if(!recording) return;
    let raf;
    const loop = (t) => { setTick(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [recording]);

  const heights = Array.from({ length: 7 }).map((_, i) => {
    const ph = tick / 220 + i * 0.55;
    const v = Math.sin(ph) * 0.55 + Math.sin(ph * 1.7 + i) * 0.35;
    return 5 + Math.abs(v) * 14;
  });

  const mm = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const ss = Math.floor(elapsed % 60).toString().padStart(2, '0');
  const stroke = 'rgba(0,0,0,0.55)';

  const showRecHint = recording && (variant === 'live-float' ? cancelHoverActive : true);

  return (
    <>
      {showRecHint && (
        <div className={'vt-rec-hint' + (cancelHoverActive ? ' is-cancel' : '')}>
          {cancelHoverActive ? '松开取消 ✕' : `↑ 上滑取消 · ${mm}:${ss}`}
        </div>
      )}

      <div className="vt-input-bar">
        <button type="button" className="vt-chip-btn" aria-label="键盘">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="2.5" y="6.5" width="19" height="12" rx="2.5" stroke={stroke} strokeWidth="1.6"/>
            <path d="M6 11h.01M9 11h.01M12 11h.01M15 11h.01M18 11h.01M7 14.5h10" stroke={stroke} strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>

        <button
          type="button"
          className={'vt-hold-btn' + (recording ? ' is-recording' : ' is-idle')}
          onMouseDown={handleDown}
          onTouchStart={handleDown}
        >
          {recording ? (
            <>
              <span className="vt-hold-waves" aria-hidden="true">
                {heights.map((h, i) => (
                  <span key={i} className="vt-hold-wave" style={{ height: h }} />
                ))}
              </span>
              <span className="vt-hold-label is-recording">
                {cancelHoverActive ? '松开取消' : <>松开&nbsp;结束<span className="vt-hold-sub">· 上滑取消</span></>}
              </span>
            </>
          ) : (
            <span className="vt-hold-label">按住&nbsp;说话</span>
          )}
        </button>

        <button type="button" className="vt-chip-btn" aria-label="相机">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="2.5" y="6.5" width="19" height="13" rx="2.5" stroke={stroke} strokeWidth="1.6"/>
            <circle cx="12" cy="13" r="3.5" stroke={stroke} strokeWidth="1.6"/>
            <path d="M8 6.5l1.2-2h5.6L16 6.5" stroke={stroke} strokeWidth="1.6"/>
          </svg>
        </button>
      </div>
    </>
  );
}

function VoiceTranscribeAtmosphere({ active }) {
  if(!active) return null;
  return (
    <div className="vt-atmosphere" aria-hidden="true">
      <div className="vt-atmosphere-glow" />
      <div className="vt-atmosphere-halo" />
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${10 + ((i * 73) % 78)}%`,
            bottom: 70,
            width: 4 + (i % 4) * 2,
            height: 4 + (i % 4) * 2,
            borderRadius: '50%',
            background: i % 2
              ? 'radial-gradient(circle, #ffd9e6 0%, rgba(255,217,230,0) 70%)'
              : 'radial-gradient(circle, #fff 0%, rgba(255,255,255,0) 70%)',
            animation: `floatUp ${3.2 + (i % 4) * 0.4}s ease-out infinite`,
            animationDelay: `${(i * 0.17) % 2.4}s`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

function VoiceTranscribeDockBar({ onCancel }){
  const stroke = 'rgba(0,0,0,0.55)';
  return (
    <div className="vt-input-bar vt-dock-transcribe">
      <button type="button" className="vt-dock-transcribe-cancel" onClick={onCancel} aria-label="取消">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="rgba(0,0,0,0.75)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <div className="vt-dock-transcribe-pill">
        <span className="vt-dock-transcribe-spinner" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <span key={i} className="vt-dock-spinner-dot" style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
        </span>
        <span className="vt-dock-transcribe-label">正在转录</span>
      </div>
      <button type="button" className="vt-chip-btn" aria-label="相机">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="2.5" y="6.5" width="19" height="13" rx="2.5" stroke={stroke} strokeWidth="1.6"/>
          <circle cx="12" cy="13" r="3.5" stroke={stroke} strokeWidth="1.6"/>
          <path d="M8 6.5l1.2-2h5.6L16 6.5" stroke={stroke} strokeWidth="1.6"/>
        </svg>
      </button>
    </div>
  );
}

Object.assign(window, {
  VoiceTranscribeBar,
  VoiceTranscribeAtmosphere,
  VoiceTranscribeDockBar,
});
