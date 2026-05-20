// ============ 底部 Dock — 输入栏 + 右下悬浮快捷发布 ============

/** 右下角 + — 5 项快捷发布 */
const QUICK_PUBLISH = [
  { id:'mood', emoji:'💛', label:'情绪', text:'今天情绪有点低落', bg:'#fff8e6' },
  { id:'symptom', emoji:'🤒', label:'症状', text:'有点不舒服', bg:'#fff4ee' },
  { id:'food', emoji:'🍽️', label:'饮食', text:'午餐吃了鸡胸肉和青菜', bg:'#eefaf3' },
  { id:'weight', emoji:'⚖️', label:'体重', text:'今天体重 52.3kg', bg:'#eef4fc' },
  { id:'sleep', emoji:'😴', label:'睡眠', text:'昨晚睡了 7 小时', bg:'#f0f4ff' },
];

const DEMO_VOICE_LINE = '哎，昨天月经来了，昨天肚子不太舒服';

const DOCK_SELLING_POINTS = [
  '记点什么…',
  '记录今天的心情…',
  '身体有什么变化…',
  '刚才吃了什么…',
  '睡眠怎么样…',
];
const DOCK_PH_CHAR_STAGGER = 72;
const DOCK_PH_CHAR_ENTER = 440;
const DOCK_PH_DWELL = 2600;
const DOCK_PH_LEAVE = 360;

function DockWavePlaceholder({show, focused}){
  const [index, setIndex] = React.useState(0);
  const [phase, setPhase] = React.useState('enter');
  const timersRef = React.useRef([]);
  const runIdRef = React.useRef(0);

  const clearTimers = ()=>{
    timersRef.current.forEach(t=>window.clearTimeout(t));
    timersRef.current = [];
  };

  const pushTimer = (fn, ms)=>{
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };

  React.useEffect(()=>{
    if(!show || focused){
      clearTimers();
      runIdRef.current += 1;
      return;
    }

    const runId = ++runIdRef.current;
    const startCycle = (pointIndex)=>{
      if(runId !== runIdRef.current) return;
      const text = DOCK_SELLING_POINTS[pointIndex];
      const enterMs = Math.max(0, text.length - 1) * DOCK_PH_CHAR_STAGGER + DOCK_PH_CHAR_ENTER;

      setIndex(pointIndex);
      setPhase('enter');

      pushTimer(()=>{
        if(runId !== runIdRef.current) return;
        setPhase('idle');
        pushTimer(()=>{
          if(runId !== runIdRef.current) return;
          setPhase('leave');
          pushTimer(()=>{
            if(runId !== runIdRef.current) return;
            startCycle((pointIndex + 1) % DOCK_SELLING_POINTS.length);
          }, DOCK_PH_LEAVE);
        }, DOCK_PH_DWELL);
      }, enterMs);
    };

    startCycle(0);
    return ()=>{
      runIdRef.current += 1;
      clearTimers();
    };
  }, [show, focused]);

  if(!show) return null;

  const text = DOCK_SELLING_POINTS[index];
  const chars = Array.from(text);
  const charPhase = phase === 'enter' ? 'enter' : 'idle';

  return (
    <span
      className={'dock-float-ph'
        +(focused ? ' is-focused' : '')
        +(phase === 'leave' ? ' is-leaving' : '')}
      aria-hidden="true"
    >
      {chars.map((ch, i)=>(
        <span
          key={index+'-'+i}
          className={'dock-float-ph-char is-'+charPhase}
          style={{'--i': i}}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

/** 左半圆：从 + 向左侧展开（90° 上 → 180° 左 → 270° 下），不往右伸 */
function fanArcPos(index, total, radius){
  const startDeg = 90;
  const endDeg = 270;
  const t = total <= 1 ? 0.5 : index / (total - 1);
  const deg = startDeg + (endDeg - startDeg) * t;
  const rad = (deg * Math.PI) / 180;
  return {
    x: Math.round(radius * Math.cos(rad)),
    y: Math.round(-radius * Math.sin(rad)),
  };
}

function QuickFan({items, open, closing, onToggle, onPick, renderFab}){
  /* 180° 左半圆 / 5 项 / 50px 圆：R ≥ 50/(2·sin22.5°) ≈ 66 */
  const r = items.length >= 5 ? 76 : 64;
  const fabTapLock = React.useRef(false);

  const handleFabTap = (e)=>{
    e.preventDefault();
    if(fabTapLock.current) return;
    fabTapLock.current = true;
    onToggle(!open);
    window.setTimeout(()=>{ fabTapLock.current = false; }, 360);
  };

  return (
    <div className={'dock-fan dock-fan-corner'+(open?' open':'')+(closing?' closing':'')}>
      <div className={'dock-fan-stage'+(open?' open':'')+(closing?' closing':'')}>
        {items.map((item,i)=>{
          const {x,y} = fanArcPos(i, items.length, r);
          return (
            <button
              key={item.id}
              type="button"
              className="dock-fan-node"
              style={{
                '--fx': x+'px',
                '--fy': y+'px',
                '--zi': i,
                '--delay': (0.02 + i * 0.045)+'s',
                '--close-delay': ((items.length - 1 - i) * 0.028)+'s',
              }}
              onClick={()=> onPick(item)}
              aria-label={item.label}
            >
              <span
                className="dock-fan-node-ico dock-fan-node-ico--stack"
                style={item.bg ? { background: item.bg } : undefined}
              >
                <span className="dock-fan-node-em" aria-hidden="true">{item.emoji}</span>
                <span className="dock-fan-node-lbl">{item.label}</span>
              </span>
            </button>
          );
        })}
        <button
          type="button"
          className={'dock-fab dock-fab-media'+(open?' open':'')}
          onPointerUp={handleFabTap}
          aria-expanded={open}
          aria-label={open ? '收起' : '快捷发布'}
        >
          {renderFab(open)}
        </button>
      </div>
    </div>
  );
}

function DockPublisher({
  draft, onDraft, onSend, onQuickMark, onMoodConfirm, onSymptomConfirm, onWeightConfirm,
  onVoiceDone, onPhoto, onDockExpandedChange, activeTab,
}){
  const I = window.Icon;
  const DockMoodPicker = window.DockMoodPicker;
  const DockSymptomPicker = window.DockSymptomPicker;
  const DockWeightPicker = window.DockWeightPicker;
  const [inputMode, setInputMode] = React.useState('text');
  const [quickOpen, setQuickOpen] = React.useState(false);
  const [quickClosing, setQuickClosing] = React.useState(false);
  const [dockSheet, setDockSheet] = React.useState(null);
  const [recording, setRecording] = React.useState(false);
  const [recSec, setRecSec] = React.useState(0);
  const [inputFocused, setInputFocused] = React.useState(false);
  const recTimer = React.useRef(null);

  const quickOpenedAt = React.useRef(0);
  const prevTabRef = React.useRef(activeTab);

  React.useEffect(()=>{
    if(activeTab === 'note' && prevTabRef.current !== 'note'){
      setQuickOpen(false);
      setQuickClosing(false);
      setDockSheet(null);
    }
    prevTabRef.current = activeTab;
  }, [activeTab]);

  const toggleQuick = (next)=>{
    if(next === undefined) next = !quickOpen;
    if(next){
      if(quickOpen || quickClosing) return;
      quickOpenedAt.current = Date.now();
      setQuickClosing(false);
      setQuickOpen(true);
      return;
    }
    if(!quickOpen || quickClosing) return;
    if(Date.now() - quickOpenedAt.current < 380) return;
    setQuickClosing(true);
    setTimeout(()=>{
      setQuickOpen(false);
      setQuickClosing(false);
    }, 340);
  };


  React.useEffect(()=>{
    if(recording){
      recTimer.current = setInterval(()=>setRecSec(s=>s+1), 1000);
    } else {
      clearInterval(recTimer.current);
      setRecSec(0);
    }
    return ()=>clearInterval(recTimer.current);
  }, [recording]);

  const startRec = ()=> setRecording(true);
  const stopRec = ()=>{
    if(!recording) return;
    setRecording(false);
    onVoiceDone(DEMO_VOICE_LINE, Math.max(recSec, 3));
  };

  const toggleMode = ()=>{
    setInputMode(m=>m==='text' ? 'voice' : 'text');
    toggleQuick(false);
  };

  const closeDockSheet = ()=> setDockSheet(null);

  const handleQuick = (item)=>{
    toggleQuick(false);
    if(item?.id === 'mood'){
      setDockSheet('mood');
      return;
    }
    if(item?.id === 'symptom'){
      setDockSheet('symptom');
      return;
    }
    if(item?.id === 'weight'){
      setDockSheet('weight');
      return;
    }
    setDockSheet(null);
    if(item) onQuickMark?.(item);
  };

  const handleMoodConfirm = (moods)=>{
    setDockSheet(null);
    onMoodConfirm?.(moods);
  };

  const handleSymptomConfirm = (symptoms)=>{
    setDockSheet(null);
    onSymptomConfirm?.(symptoms);
  };

  const handleWeightConfirm = (payload)=>{
    setDockSheet(null);
    onWeightConfirm?.(payload);
  };

  React.useEffect(()=>{
    onDockExpandedChange?.(!!dockSheet);
  }, [dockSheet, onDockExpandedChange]);

  const isDockExpanded = !!dockSheet;

  return (
    <>
      <div className={'quick-float-wrap'+(isDockExpanded?' is-covered':'')}>
        <QuickFan
          items={QUICK_PUBLISH}
          open={quickOpen}
          closing={quickClosing}
          onToggle={toggleQuick}
          onPick={handleQuick}
          renderFab={(open)=>(
            open
              ? <I name="close" size={20} stroke={2.2}/>
              : <I name="plus" size={24} stroke={2.2}/>
          )}
        />
      </div>

      <div className={'dock-wrap'+(isDockExpanded?' is-mood-expanded':'')}>
        <div className={'dock-panel'+(isDockExpanded?' is-mood-expanded':'')}>
          {dockSheet === 'mood' ? (
            <DockMoodPicker
              onConfirm={handleMoodConfirm}
              onCancel={closeDockSheet}
            />
          ) : dockSheet === 'symptom' ? (
            <DockSymptomPicker
              onConfirm={handleSymptomConfirm}
              onCancel={closeDockSheet}
            />
          ) : dockSheet === 'weight' ? (
            <DockWeightPicker
              onConfirm={handleWeightConfirm}
              onCancel={closeDockSheet}
            />
          ) : (
          <div className="dock-bar">
            <div className="dock-input-row">
              <button
                type="button"
                className="dock-mode-btn"
                onClick={toggleMode}
                aria-label={inputMode==='text'?'切换语音':'切换键盘'}
              >
                {inputMode==='text'
                  ? <I name="mic" size={22} stroke={1.6}/>
                  : <span className="dock-kbd-ico">⌨</span>}
              </button>

              {inputMode==='text' ? (
                <div className={'dock-text-field'+(inputFocused?' is-focused':'')}>
                  <DockWavePlaceholder
                    show={!draft.trim()}
                    focused={inputFocused}
                  />
                  <textarea
                    rows="1"
                    placeholder=""
                    aria-label={DOCK_SELLING_POINTS[0]}
                    value={draft}
                    onChange={(e)=>{
                      onDraft(e.target.value);
                      e.target.style.height='auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 72)+'px';
                    }}
                    onFocus={()=>setInputFocused(true)}
                    onBlur={()=>setInputFocused(false)}
                    onKeyDown={(e)=>{
                      if(e.key==='Enter' && !e.shiftKey && draft.trim()){
                        e.preventDefault();
                        onSend();
                      }
                    }}
                  />
                </div>
              ) : (
                <div className={'dock-voice-wrap'+(recording?' is-recording':'')}>
                  <div className="dock-voice-stage" aria-hidden="true">
                    <span className="dock-voice-shimmer"/>
                  </div>
                  <button
                    type="button"
                    className={'dock-voice-btn'+(recording?' recording':'')}
                    onPointerDown={(e)=>{ e.preventDefault(); startRec(); }}
                    onPointerUp={stopRec}
                    onPointerLeave={recording ? stopRec : undefined}
                  >
                    {recording ? (
                      <>
                        <span className="dock-voice-waves" aria-hidden="true">
                          {[4,8,12,8,6,10,7].map((h,j)=><span key={j} style={{height:h+'px'}}/>)}
                        </span>
                        <span>松开 结束{recSec > 0 ? ' '+recSec+'s' : ''}</span>
                      </>
                    ) : (
                      <span className="dock-voice-label">按住 说话</span>
                    )}
                  </button>
                </div>
              )}

              {inputMode==='text' && draft.trim() ? (
                <button type="button" className="dock-send-btn" onClick={onSend} aria-label="发送">
                  <I name="send" size={16} stroke={2}/>
                </button>
              ) : null}
            </div>

            <button
              type="button"
              className="dock-camera-btn"
              onClick={onPhoto}
              aria-label="拍照上传"
            >
              <I name="camera" size={22} stroke={1.6}/>
            </button>
          </div>
          )}
        </div>
      </div>
    </>
  );
}

Object.assign(window, { DockPublisher, CloudPublisher: DockPublisher });