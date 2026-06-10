// ============ 记录 Tab · 新用户空值页（_Tab__standalone.html） ============

const { useState, useEffect, useRef } = React;

const EMPTY_LOOP_SEC = 4.6;
const EMPTY_DEMO_ACTIVE_SEC = 3.6;

function useLoopTime(duration = EMPTY_LOOP_SEC, speed = 1) {
  const [t, setT] = useState(0);
  const startRef = useRef(performance.now());
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    let raf;
    const tick = () => {
      const now = performance.now();
      const elapsed = ((now - startRef.current) / 1000) * speedRef.current;
      setT(elapsed % duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);
  return t;
}

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const range = (t, a, b) => clamp01((t - a) / (b - a));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

const EMPTY_PALETTE = {
  bg1: '#FFFFFF',
  bg2: '#F2F2F5',
  primary: '#FF4D88',
  primarySoft: '#FFE0EC',
  accent: '#FF7AA8',
  ring: 'rgba(255,77,136,0.18)',
};

const EMPTY_DEMO_TRANSCRIPT = '今天有点累，肚子胀，午饭吃了三明治';

const SCENE2_RECORD_TEXT = '今天有点累，肚子也有点胀，午饭吃了三明治，下午还一直有点犯困。';

const SCENE2_VOICE_TAGS = [
  { cat:'情绪', val:'疲惫', icon:'mood' },
  { cat:'症状', val:'腹胀', icon:'sym' },
  { cat:'饮食', val:'三明治', icon:'food' },
];

function buildScene2VoiceEntry(durSec){
  return {
    id:'e-'+Date.now(),
    kind:'voice-card',
    time: window.formatNowTime(),
    isNew: true,
    tagLayout: 'v3',
    voiceText: SCENE2_RECORD_TEXT,
    voice: { duration: window.formatVoiceDur(Math.max(durSec || 0, 18)) },
    tags: SCENE2_VOICE_TAGS.map(t=>({...t})),
  };
}

function RecordEmptyTagIcon({ name, color }) {
  if(name === 'mood'){
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6"/>
        <circle cx="9" cy="10" r="1" fill={color}/>
        <circle cx="15" cy="10" r="1" fill={color}/>
        <path d="M9 15c1-0.5 5-0.5 6 0" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    );
  }
  if(name === 'sym'){
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3v18M3 12h18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 8h16l-2 11a2 2 0 01-2 2H8a2 2 0 01-2-2L4 8z" stroke={color} strokeWidth="1.6"/>
      <path d="M8 8V5a4 4 0 018 0v3" stroke={color} strokeWidth="1.6"/>
    </svg>
  );
}

function RecordEmptyScreen({ onVoiceDone }) {
  const P = EMPTY_PALETTE;
  const t = useLoopTime(EMPTY_LOOP_SEC, 1);
  const [pressed, setPressed] = useState(false);
  const [recSec, setRecSec] = useState(0);
  const recTimer = useRef(null);

  useEffect(() => {
    if(pressed){
      recTimer.current = setInterval(()=>setRecSec(s=>s+1), 1000);
    } else {
      clearInterval(recTimer.current);
      setRecSec(0);
    }
    return ()=>clearInterval(recTimer.current);
  }, [pressed]);

  const handleRelease = ()=>{
    if(!pressed) return;
    setPressed(false);
    onVoiceDone?.(EMPTY_DEMO_TRANSCRIPT, Math.max(recSec, 3));
  };

  return (
    <div className="record-empty-root">
      <div
        className="record-empty-blob record-empty-blob--tr"
        style={{ background: `radial-gradient(circle, ${P.primarySoft} 0%, transparent 70%)` }}
        aria-hidden="true"
      />
      <div
        className="record-empty-blob record-empty-blob--bl"
        style={{ background: `radial-gradient(circle, ${P.primarySoft} 0%, transparent 70%)` }}
        aria-hidden="true"
      />

      <div className="record-empty-hero">
        <h1 className="record-empty-hero-title">
          <span className="record-empty-hero-line">在美柚，</span>
          <span className="record-empty-hero-line record-empty-accent">记录生活点滴</span>
        </h1>
        <p className="record-empty-hero-sub">说一句话，情绪 · 症状 · 饮食 自动整理</p>
      </div>

      <div className="record-empty-demo">
        <RecordEmptyDemoCard t={t} P={P}/>
      </div>

      <div className="record-empty-voice-wrap">
        <RecordEmptyVoiceButton
          P={P}
          pressed={pressed}
          onPress={()=>setPressed(true)}
          onRelease={handleRelease}
        />
        <p className="record-empty-voice-hint">
          {pressed ? '松开发送' : '按住说话  或  点击长录'}
        </p>
      </div>
    </div>
  );
}

function RecordEmptyDemoCard({ t, P }) {
  const pCard = easeOut(range(t, 0.0, 0.4));
  const pVoice = easeOut(range(t, 0.5, 1.0));
  const pText = range(t, 1.1, 2.0);
  const pTags = [range(t, 2.0, 2.25), range(t, 2.2, 2.45), range(t, 2.4, 2.65)];
  const pChart = easeOut(range(t, 2.7, 3.3));
  const shown = EMPTY_DEMO_TRANSCRIPT.slice(0, Math.floor(pText * EMPTY_DEMO_TRANSCRIPT.length));
  const pct = Math.floor((Math.min(t, EMPTY_DEMO_ACTIVE_SEC) / EMPTY_DEMO_ACTIVE_SEC) * 100);

  return (
    <div
      className="record-empty-card"
      style={{
        opacity: pCard,
        transform: `translateY(${(1 - pCard) * 8}px)`,
      }}
    >
      <div className="record-empty-card-hd">
        <div className="record-empty-card-label">
          <span
            className="record-empty-card-dot"
            style={{ opacity: 0.6 + 0.4 * Math.sin(t * 6) }}
          />
          示例 · 一次记录会发生什么
        </div>
        <span className="record-empty-card-pct">{pct}%</span>
      </div>

      <RecordEmptyVoiceBubble pIn={pVoice} pText={pText} text={shown} P={P} t={t}/>
      <RecordEmptyTagsRow progress={pTags} P={P}/>
      <RecordEmptyMiniChart progress={pChart} P={P}/>
    </div>
  );
}

function RecordEmptyVoiceBubble({ pIn, pText, text, P, t }) {
  const bars = 22;
  return (
    <div
      className="record-empty-bubble-wrap"
      style={{
        opacity: pIn,
        transform: `translateY(${(1 - pIn) * 6}px)`,
      }}
    >
      <div
        className="record-empty-bubble"
        style={{
          background: `linear-gradient(135deg, ${P.primary} 0%, ${P.accent} 100%)`,
          boxShadow: `0 4px 12px ${P.ring}`,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="9" y="3" width="6" height="12" rx="3" fill="white"/>
          <path d="M5 11a7 7 0 0014 0M12 18v3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <div className="record-empty-wave">
          {Array.from({ length: bars }).map((_, i) => {
            const phase = i * 0.45;
            const a = Math.sin(t * 8 + phase) * 0.45 + Math.sin(t * 14 + phase * 1.7) * 0.3;
            const env = pText < 1 ? 1 : 0.35;
            const h = 3 + (Math.abs(a) * 12 + 2) * env;
            return <span key={i} style={{ height: h + 'px' }}/>;
          })}
        </div>
        <span className="record-empty-bubble-dur">0:0{Math.floor(t * 2) % 10}</span>
      </div>
      {pText > 0 && (
        <div className="record-empty-transcript">
          {text}
          {pText < 1 && (
            <span
              className="record-empty-cursor"
              style={{ opacity: 0.5 + 0.5 * Math.sin(t * 20) }}
            />
          )}
        </div>
      )}
    </div>
  );
}

function RecordEmptyTagsRow({ progress, P }) {
  const items = [
    { cat: '情绪', val: '疲惫', icon: 'mood' },
    { cat: '症状', val: '腹胀', icon: 'sym' },
    { cat: '饮食', val: '三明治', icon: 'food' },
  ];
  return (
    <div className="record-empty-tags">
      {items.map((it, i) => {
        const p = easeOut(progress[i]);
        return (
          <div
            key={i}
            className="record-empty-tag"
            style={{
              opacity: p,
              transform: `translateY(${(1 - p) * 10}px) scale(${0.92 + p * 0.08})`,
              background: P.primarySoft,
              borderColor: P.primary + '22',
            }}
          >
            <RecordEmptyTagIcon name={it.icon} color={P.primary}/>
            <span className="record-empty-tag-cat" style={{ color: P.primary }}>{it.cat}</span>
            <span className="record-empty-tag-val">{it.val}</span>
          </div>
        );
      })}
    </div>
  );
}

function RecordEmptyMiniChart({ progress, P }) {
  const data = [0.35, 0.55, 0.4, 0.7, 0.5, 0.8, 0.65];
  const labels = ['一', '二', '三', '四', '五', '六', '日'];
  return (
    <div
      className="record-empty-chart"
      style={{
        opacity: progress,
        transform: `translateY(${(1 - progress) * 6}px)`,
      }}
    >
      <div className="record-empty-chart-hd">
        <span className="record-empty-chart-title">本周情绪走势</span>
        <span className="record-empty-chart-badge" style={{ color: P.primary, background: P.primarySoft }}>
          自动生成
        </span>
      </div>
      <div className="record-empty-chart-bars">
        {data.map((v, i) => {
          const delay = i * 0.07;
          const localP = easeOut(clamp01((progress - delay) / (1 - delay)));
          const h = v * 44 * localP;
          const isLast = i === data.length - 1;
          return (
            <div key={i} className="record-empty-chart-col">
              <div
                className="record-empty-chart-bar"
                style={{
                  height: h + 'px',
                  background: isLast
                    ? `linear-gradient(180deg, ${P.primary} 0%, ${P.accent} 100%)`
                    : `${P.primary}55`,
                }}
              />
              <span className="record-empty-chart-day">{labels[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecordEmptyVoiceButton({ P, pressed, onPress, onRelease }) {
  const scale = pressed ? 0.94 : 1;

  return (
    <div
      className="record-empty-mic"
      onMouseDown={onPress}
      onMouseUp={onRelease}
      onMouseLeave={pressed ? onRelease : undefined}
      onTouchStart={(e)=>{ e.preventDefault(); onPress(); }}
      onTouchEnd={(e)=>{ e.preventDefault(); onRelease(); }}
      role="button"
      aria-label="按住说话"
    >
      <div
        className="record-empty-mic-ring record-empty-mic-ring--glow"
        style={{
          background: P.primary,
          opacity: 0.14,
        }}
      />
      <div
        className="record-empty-mic-ring record-empty-mic-ring--stroke"
        style={{
          borderColor: P.primary,
          opacity: 0.16,
        }}
      />
      <div
        className="record-empty-mic-core"
        style={{
          background: `radial-gradient(circle at 30% 25%, ${P.accent} 0%, ${P.primary} 60%, ${P.primary} 100%)`,
          boxShadow: pressed
            ? `inset 0 4px 12px rgba(0,0,0,0.18), 0 2px 6px ${P.ring}`
            : `0 8px 24px ${P.ring}, 0 2px 6px ${P.ring}, inset 0 1.5px 0 rgba(255,255,255,0.3)`,
          transform: `scale(${scale})`,
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="9" y="3" width="6" height="13" rx="3" fill="white"/>
          <path d="M5 11a7 7 0 0014 0" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 18v3M8.5 21h7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

Object.assign(window, {
  RecordEmptyScreen,
  EMPTY_DEMO_TRANSCRIPT,
  SCENE2_VOICE_TAGS,
  buildScene2VoiceEntry,
});
