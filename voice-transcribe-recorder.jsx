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

function VoiceTranscribeBar({ onStart, onEnd, onCancel, recording, elapsed = 0, variant = 'live-drop' }) {
  const startYRef = useRef(0);
  const [cancelHover, setCancelHover] = useState(false);

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
    if(cancelHover) onCancel && onCancel();
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
  }, [recording, cancelHover]);

  const mm = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const ss = Math.floor(elapsed % 60).toString().padStart(2, '0');
  const stroke = 'rgba(0,0,0,0.55)';

  const showRecHint = recording && (variant !== 'live-float' || cancelHover);

  return (
    <>
      {showRecHint && (
        <div className={'vt-rec-hint' + (cancelHover ? ' is-cancel' : '')}>
          {cancelHover ? '松开取消 ✕' : `↑ 上滑取消 · ${mm}:${ss}`}
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
          className="vt-hold-btn is-idle"
          onMouseDown={handleDown}
          onTouchStart={handleDown}
        >
          <span className="vt-hold-label">按住&nbsp;说话</span>
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

Object.assign(window, { VoiceTranscribeBar, VoiceTranscribeAtmosphere });
