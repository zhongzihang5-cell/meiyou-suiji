// ============ 底部 Dock — 输入栏 + 右下悬浮快捷发布 ============

<<<<<<< Updated upstream
/** 右下角 + — 5 项快捷发布 */
const QUICK_PUBLISH = [
  { id:'period', emoji:'🩸', label:'月经', text:'今天月经来了' },
  { id:'mood', emoji:'💛', label:'心情', text:'今天心情还行' },
  { id:'weight', emoji:'⚖️', label:'体重', text:'今天体重 52.3kg' },
  { id:'symptom', emoji:'🤒', label:'症状', text:'有点不舒服' },
  { id:'diary', emoji:'📔', label:'日记', text:'想记录一下今天…' },
=======
/** 方案 I · 卡片扇 — 4 项快捷发布 */
const QUICK_CARDS = [
  { id:'mood',    label:'心情', hint:'5 档表情', title:'记录心情', x:-99, y:-14, angle:-8 },
  { id:'symptom', label:'症状', hint:'快速多选', title:'今日症状', x:-85, y:-53, angle:-2 },
  { id:'weight',  label:'体重', hint:'±0.1 kg',  title:'今日体重', x:-56, y:-83, angle:4 },
  { id:'diet',    label:'饮食', hint:'餐食速记', title:'今日饮食', x:-17, y:-98, angle:9 },
>>>>>>> Stashed changes
];

const DEMO_VOICE_LINE = '哎，昨天月经来了，昨天肚子不太舒服';

<<<<<<< Updated upstream
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
=======
const DOCK_PLACEHOLDER_TEXT = '记录生活点滴';

function DockWavePlaceholder({show, focused}){
  if(!show) return null;

  return (
    <span
      className={'dock-float-ph'
        +(focused ? ' is-focused' : '')}
      aria-hidden="true"
    >
      <span className="dock-float-ph-char is-idle">{DOCK_PLACEHOLDER_TEXT}</span>
    </span>
  );
}

function QuickCardFan({
  open, selected, onFabTap, onSelectCard, onClose,
  onMoodSubmit, onSymptomSubmit, onWeightSubmit, onFoodSubmit,
}){
  const I = window.Icon;
  const QuickCardIcon = window.QuickCardIcon;
  const QuickMoodPicker = window.QuickMoodPicker;
  const QuickSymptomPicker = window.QuickSymptomPicker;
  const QuickWeightPicker = window.QuickWeightPicker;
  const QuickFoodPicker = window.QuickFoodPicker;
>>>>>>> Stashed changes

  return (
    <div className={'dock-fan dock-fan-corner'+(open?' open':'')+(closing?' closing':'')}>
      {open && (
        <button
          type="button"
          className="dock-fan-scrim"
          onClick={()=>onToggle(false)}
          aria-label="关闭"
        />
      )}
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
              <span className="dock-fan-node-ico dock-fan-node-ico--stack">
                <span className="dock-fan-node-em" aria-hidden="true">{item.emoji}</span>
                <span className="dock-fan-node-lbl">{item.label}</span>
              </span>
            </button>
<<<<<<< Updated upstream
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
=======

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
                ) : card.id === 'diet' ? (
                  <QuickFoodPicker onSubmit={onFoodSubmit}/>
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
>>>>>>> Stashed changes
    </div>
  );
}

function DockPublisher({
<<<<<<< Updated upstream
  draft, onDraft, onSend, onQuickMark, onVoiceDone,
  onPhoto,
=======
  draft, onDraft, onSend, onQuickMark, onMoodConfirm, onSymptomConfirm, onWeightConfirm,
  onFoodConfirm,
  onVoiceDone, onPhoto, onDockExpandedChange, activeTab, showFirstDropBubble,
>>>>>>> Stashed changes
}){
  const I = window.Icon;
  const [inputMode, setInputMode] = React.useState('text');
  const [quickOpen, setQuickOpen] = React.useState(false);
  const [quickClosing, setQuickClosing] = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const [recSec, setRecSec] = React.useState(0);
  const recTimer = React.useRef(null);

  const quickOpenedAt = React.useRef(0);

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

  const handleQuick = (item)=>{
    if(item) onQuickMark?.(item);
    toggleQuick(false);
  };

<<<<<<< Updated upstream
=======
  const handleQuickSymptomSubmit = (symptoms)=>{
    closeQuick();
    onSymptomConfirm?.(symptoms);
  };

  const handleQuickWeightSubmit = (payload)=>{
    closeQuick();
    onWeightConfirm?.(payload);
  };

  const handleQuickFoodSubmit = (foods)=>{
    closeQuick();
    onFoodConfirm?.(foods);
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

>>>>>>> Stashed changes
  return (
    <>
      <div className="quick-float-wrap">
        <QuickFan
          items={QUICK_PUBLISH}
          open={quickOpen}
<<<<<<< Updated upstream
          closing={quickClosing}
          onToggle={toggleQuick}
          onPick={handleQuick}
          renderFab={(open)=>(
            open
              ? <I name="close" size={20} stroke={2.2}/>
              : <I name="plus" size={24} stroke={2.2}/>
          )}
=======
          selected={quickSelected}
          onFabTap={handleFabTap}
          onSelectCard={setQuickSelected}
          onClose={closeQuick}
          onMoodSubmit={handleQuickMoodSubmit}
          onSymptomSubmit={handleQuickSymptomSubmit}
          onWeightSubmit={handleQuickWeightSubmit}
          onFoodSubmit={handleQuickFoodSubmit}
>>>>>>> Stashed changes
        />
      </div>

      <div className="dock-wrap">
        <div className="dock-panel">
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
                <div className="dock-text-field">
                  <textarea
                    rows="1"
<<<<<<< Updated upstream
                    placeholder="说点什么…"
=======
                    placeholder=""
                    aria-label={DOCK_PLACEHOLDER_TEXT}
>>>>>>> Stashed changes
                    value={draft}
                    onChange={(e)=>{
                      onDraft(e.target.value);
                      e.target.style.height='auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 72)+'px';
                    }}
                    onKeyDown={(e)=>{
                      if(e.key==='Enter' && !e.shiftKey && draft.trim()){
                        e.preventDefault();
                        onSend();
                      }
                    }}
                  />
                </div>
              ) : (
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
                    <span>按住 说话</span>
                  )}
                </button>
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
        </div>
      </div>
    </>
  );
}

Object.assign(window, { DockPublisher, CloudPublisher: DockPublisher });
