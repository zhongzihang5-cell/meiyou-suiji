// ============ 底部 Dock — 输入栏 + 右下悬浮快捷发布 ============

/** 方案 I · 卡片扇 — 仅 3 项 */
const QUICK_CARDS = [
  { id:'mood', label:'情绪', hint:'5 档表情', title:'记录情绪', x:-148, y:-32, angle:-12 },
  { id:'symptom', label:'症状', hint:'快速多选', title:'今日症状', x:-74, y:-72, angle:0 },
  { id:'weight', label:'体重', hint:'±0.1 kg', title:'今日体重', x:-4, y:-32, angle:12 },
];

const DEMO_VOICE_LINE = '哎，昨天月经来了，昨天肚子不太舒服';

const DOCK_PLACEHOLDER = '记录生活点滴';

function QuickCardFan({
  open, selected, onFabTap, onSelectCard, onClose,
  onMoodSubmit, onSymptomSubmit, onWeightSubmit,
}){
  const I = window.Icon;
  const QuickCardIcon = window.QuickCardIcon;
  const QuickMoodPicker = window.QuickMoodPicker;
  const QuickSymptomPicker = window.QuickSymptomPicker;
  const QuickWeightPicker = window.QuickWeightPicker;

  return (
    <div className={'quick-card-fan'+(open ? ' is-open' : '')+(selected ? ' has-selected' : '')}>
      {QUICK_CARDS.map((card, i)=>{
        const isSel = selected === card.id;
        const isOther = selected && !isSel;
        const fanDelay = (open && !selected) ? i * 65 : (QUICK_CARDS.length - 1 - i) * 30;
        const tDelay = isSel ? 0 : fanDelay;

        return (
          <div
            key={card.id}
            className={'quick-card-fan-item'
              +(isSel ? ' is-selected' : '')
              +(isOther ? ' is-faded' : '')
              +(open ? ' is-visible' : '')}
            data-card={card.id}
            style={{
              '--card-x': card.x+'px',
              '--card-y': card.y+'px',
              '--card-angle': card.angle+'deg',
              '--card-delay': tDelay+'ms',
            }}
          >
            <button
              type="button"
              className="quick-card-fan-face"
              onClick={()=>{
                if(open && !selected) onSelectCard(card.id);
              }}
              aria-label={card.label}
              tabIndex={open && !selected ? 0 : -1}
            >
              <span className="quick-card-fan-ico">
                <QuickCardIcon kind={card.id} color="var(--my-brand-red)" size={24}/>
              </span>
              <span className="quick-card-fan-meta">
                <span className="quick-card-fan-lbl">{card.label}</span>
                <span className="quick-card-fan-hint">{card.hint}</span>
              </span>
            </button>

            <div className="quick-card-fan-panel" aria-hidden={!isSel}>
              <div className="quick-card-fan-panel-hd">
                <span className="quick-card-fan-panel-title">{card.title}</span>
                <button type="button" className="quick-card-fan-panel-close" onClick={onClose} aria-label="关闭">
                  ×
                </button>
              </div>
              <div className="quick-card-fan-panel-body">
                {card.id === 'mood' ? (
                  <QuickMoodPicker onSubmit={onMoodSubmit}/>
                ) : card.id === 'symptom' ? (
                  <QuickSymptomPicker onSubmit={onSymptomSubmit}/>
                ) : (
                  <QuickWeightPicker onSubmit={onWeightSubmit}/>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        className={'quick-card-fab'+(open ? ' is-open' : '')+(selected ? ' is-covered' : '')}
        onClick={onFabTap}
        aria-expanded={open}
        aria-label={open ? '收起快捷记录' : '快捷记录'}
      >
        {open
          ? <I name="close" size={20} stroke={2.2}/>
          : <I name="plus" size={24} stroke={2.2}/>}
      </button>
    </div>
  );
}

function DockPublisher({
  draft, onDraft, onSend, onQuickMark, onMoodConfirm, onSymptomConfirm, onWeightConfirm,
  onVoiceDone, onPhoto, onDockExpandedChange, activeTab, showScheme3Bubble,
  highlightScheme3Input, dockPlaceholder, defaultInputMode = 'text',
}){
  const I = window.Icon;
  const DockMoodPicker = window.DockMoodPicker;
  const DockSymptomPicker = window.DockSymptomPicker;
  const DockWeightPicker = window.DockWeightPicker;
  const [inputMode, setInputMode] = React.useState(defaultInputMode);
  const [quickOpen, setQuickOpen] = React.useState(false);
  const [quickSelected, setQuickSelected] = React.useState(null);
  const [dockSheet, setDockSheet] = React.useState(null);
  const [recording, setRecording] = React.useState(false);
  const [recSec, setRecSec] = React.useState(0);
  const [inputFocused, setInputFocused] = React.useState(false);
  const recTimer = React.useRef(null);
  const prevTabRef = React.useRef(activeTab);

  React.useEffect(()=>{
    setInputMode(defaultInputMode);
  }, [defaultInputMode]);

  React.useEffect(()=>{
    if(activeTab === 'note' && prevTabRef.current !== 'note'){
      setQuickOpen(false);
      setQuickSelected(null);
      setDockSheet(null);
    }
    prevTabRef.current = activeTab;
  }, [activeTab]);

  React.useEffect(()=>{
    if(!showScheme3Bubble) return;
    const tm = setTimeout(()=>window.markScheme3BubbleSeen?.(), 2400);
    return ()=>clearTimeout(tm);
  }, [showScheme3Bubble]);

  const closeQuick = ()=>{
    setQuickSelected(null);
    setQuickOpen(false);
  };

  const handleFabTap = ()=>{
    if(quickOpen) closeQuick();
    else setQuickOpen(true);
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
    closeQuick();
  };

  const closeDockSheet = ()=> setDockSheet(null);

  const handleQuickMoodSubmit = (moods)=>{
    closeQuick();
    onMoodConfirm?.(moods);
  };

  const handleQuickSymptomSubmit = (symptoms)=>{
    closeQuick();
    onSymptomConfirm?.(symptoms);
  };

  const handleQuickWeightSubmit = (payload)=>{
    closeQuick();
    onWeightConfirm?.(payload);
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
    onDockExpandedChange?.(!!dockSheet || !!quickSelected);
  }, [dockSheet, quickSelected, onDockExpandedChange]);

  const isDockExpanded = !!dockSheet;
  const isQuickActive = quickOpen || !!quickSelected;
  const inputPlaceholder = dockPlaceholder || DOCK_PLACEHOLDER;

  return (
    <>
      <div className={'quick-float-wrap'+(isDockExpanded ? ' is-covered' : '')+(isQuickActive ? ' is-quick-active' : '')}>
        {isQuickActive ? (
          <div
            className="quick-card-fan-scrim"
            onClick={closeQuick}
            aria-hidden="false"
          />
        ) : null}
        <QuickCardFan
          open={quickOpen}
          selected={quickSelected}
          onFabTap={handleFabTap}
          onSelectCard={setQuickSelected}
          onClose={closeQuick}
          onMoodSubmit={handleQuickMoodSubmit}
          onSymptomSubmit={handleQuickSymptomSubmit}
          onWeightSubmit={handleQuickWeightSubmit}
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
                <div className={'dock-text-field'
                  +(inputFocused?' is-focused':'')
                  +(highlightScheme3Input?' is-scheme3-highlight':'')}>
                  {showScheme3Bubble && !draft.trim() && !inputFocused ? (
                    <span className="dock-scheme3-bubble" aria-hidden="true">
                      ✏️ 记下第一刻
                    </span>
                  ) : null}
                  <textarea
                    rows="1"
                    placeholder={inputPlaceholder}
                    aria-label={inputPlaceholder}
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