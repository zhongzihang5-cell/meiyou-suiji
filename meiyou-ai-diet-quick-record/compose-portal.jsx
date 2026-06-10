// ============ Compose Portal — 随记特色输入页 ============
function ComposeScreen({
  ctx, messages, syncItems, chips, draft, onDraft,
  onSend, onChip, onClose, onVoice, onPhoto, leaving,
}){
  const I = window.Icon;
  const chatRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const [mode, setMode] = React.useState('voice'); // voice | text
  const [dockFocus, setDockFocus] = React.useState(false);

  React.useEffect(()=>{
    if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, syncItems]);

  React.useEffect(()=>{
    if(mode === 'text' && inputRef.current){
      setTimeout(()=>inputRef.current.focus(), 120);
    }
  }, [mode]);

  const phaseCls = ctx.cycle.kind || 'period';
  const hasUserMsg = messages.some(m=>m.role==='user');
  const showChips = !hasUserMsg && chips.length > 0;

  const enterVoice = ()=>{
    setMode('voice');
    onVoice();
  };

  return (
    <div className={'portal'+(leaving?' portal--leave':'')}>
      {/* 氛围层 */}
      <div className="portal-ambient" aria-hidden="true">
        <div className="portal-blob portal-blob--1"/>
        <div className="portal-blob portal-blob--2"/>
        <div className="portal-blob portal-blob--3"/>
        <div className="portal-grain"/>
      </div>

      {/* 顶栏 */}
      <div className="portal-header">
        <button className="portal-back" onClick={onClose} aria-label="收起">
          <I name="arrow" size={18} stroke={2}/>
          <span>我的随记</span>
        </button>
        <div className="portal-date-tag">
          <span>5月19日</span>
          <span className="portal-date-dot"/>
          <span>{ctx.weather.icon}</span>
        </div>
      </div>

      {/* 主舞台 */}
      <div className="portal-body" ref={chatRef}>
        <div className="portal-context">
          <span className="portal-ctx-item">{ctx.weather.text}</span>
          <span className={'portal-ctx-item portal-ctx-item--phase '+phaseCls}>
            {ctx.cycle.label} · {ctx.cycle.sub}
          </span>
        </div>

        {/* 首屏主引导 — 编辑感大标题，非聊天列表 */}
        {!hasUserMsg && messages[0] && (
          <div className="portal-hero">
            <p className="portal-hero-kicker">今天，想记录什么</p>
            <h1 className="portal-hero-text">{messages[0].text}</h1>
          </div>
        )}

        {/* 对话流 */}
        <div className="portal-thread">
          {hasUserMsg && messages.map((m,i)=>(
            <div key={i} className={'portal-msg portal-msg--'+m.role}>
              {m.role !== 'user' && <span className="portal-msg-glow"/>}
              <p>{m.text}</p>
            </div>
          ))}

          {syncItems.length > 0 && (
            <div className="portal-sync">
              {syncItems.map((s,i)=>(
                <div key={i} className="portal-sync-pill" style={{animationDelay:(i*0.1)+'s'}}>
                  <span className="portal-sync-ring">
                    <I name="check" size={11} stroke={2.8}/>
                  </span>
                  <span className="portal-sync-text">已记录 <em>{s}</em></span>
                </div>
              ))}
            </div>
          )}
        </div>

        {showChips && (
          <div className="portal-chips">
            {chips.map((c,i)=>(
              <button key={i} className="portal-chip" onClick={()=>onChip(c)}>{c}</button>
            ))}
          </div>
        )}
      </div>

      {/* 特色输入 Dock */}
      <div className={'portal-dock'+(dockFocus?' portal-dock--focus':'')+(mode==='text'?' portal-dock--text':'')}>
        <div className="portal-dock-glass">
          <div className="portal-mode-tabs">
            <button
              className={'portal-mode-tab'+(mode==='voice'?' is-active':'')}
              onClick={()=>setMode('voice')}
            >
              <I name="mic" size={15} stroke={1.8}/>
              语音
            </button>
            <button
              className={'portal-mode-tab'+(mode==='text'?' is-active':'')}
              onClick={()=>setMode('text')}
            >
              <I name="pen" size={15} stroke={1.8}/>
              文字
            </button>
          </div>

          {mode === 'voice' ? (
            <div className="portal-voice-stage">
              <button className="portal-cam" onClick={onPhoto} aria-label="拍照">
                <I name="camera" size={20} stroke={1.7}/>
              </button>
              <button className="portal-voice-hero" onClick={enterVoice} aria-label="开始说话">
                <span className="portal-voice-ring portal-voice-ring--1"/>
                <span className="portal-voice-ring portal-voice-ring--2"/>
                <span className="portal-voice-core">
                  <I name="mic" size={26} stroke={1.6}/>
                </span>
              </button>
              <div className="portal-voice-hint">
                <span>点按开始说</span>
                <span className="portal-voice-sub">随口一说，自动整理</span>
              </div>
              <div className="portal-voice-spacer"/>
            </div>
          ) : (
            <div className="portal-text-stage">
              <button className="portal-cam portal-cam--inline" onClick={onPhoto} aria-label="拍照">
                <I name="camera" size={20} stroke={1.7}/>
              </button>
              <div className="portal-text-field">
                <textarea
                  ref={inputRef}
                  rows="1"
                  placeholder="今天身体有什么感受…"
                  value={draft}
                  onFocus={()=>setDockFocus(true)}
                  onBlur={()=>setDockFocus(false)}
                  onChange={(e)=>{
                    onDraft(e.target.value);
                    e.target.style.height='auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 96)+'px';
                  }}
                  onKeyDown={(e)=>{
                    if(e.key==='Enter' && !e.shiftKey && draft.trim()){
                      e.preventDefault();
                      onSend();
                    }
                  }}
                />
              </div>
              <button
                className={'portal-send'+(draft.trim()?' is-ready':'')}
                onClick={onSend}
                disabled={!draft.trim()}
                aria-label="发送"
              >
                <I name="send" size={16} stroke={2}/>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ Immersive Voice — 沉浸式聆听 ============
function ImmersiveVoice({onClose, onDone, ctx}){
  const I = window.Icon;
  const [sec, setSec] = React.useState(0);
  const [active, setActive] = React.useState(true);

  React.useEffect(()=>{
    if(!active) return;
    const id = setInterval(()=>setSec(s=>s+1), 1000);
    return ()=>clearInterval(id);
  }, [active]);

  const fmt = s => String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');

  const finish = ()=>{
    if(sec < 1) return;
    setActive(false);
    setTimeout(()=>onDone(fmt(sec)), 200);
  };

  return (
    <div className="voice-room">
      <div className="voice-room-ambient" aria-hidden="true">
        <div className="voice-room-blob voice-room-blob--1"/>
        <div className="voice-room-blob voice-room-blob--2"/>
      </div>

      <button className="voice-room-close" onClick={onClose} aria-label="关闭">
        <I name="close" size={20} stroke={2}/>
      </button>

      <div className="voice-room-status">
        <span className={'voice-room-dot'+(active?' voice-room-dot--live':'')}/>
        {active ? '随记正在听…' : '整理中…'}
      </div>

      {ctx && (
        <div className="voice-room-ctx">
          {ctx.cycle.label} · {ctx.cycle.sub}
        </div>
      )}

      <div className="voice-room-center">
        <div className={'voice-orb'+(active?' voice-orb--live':'')}>
          <div className="voice-orb-inner">
            {active && (
              <div className="voice-wave">
                {Array.from({length:24}).map((_,i)=>(
                  <span key={i} style={{animationDelay:(i*0.05)+'s'}}/>
                ))}
              </div>
            )}
          </div>
          <span className="voice-orb-ring voice-orb-ring--1"/>
          <span className="voice-orb-ring voice-orb-ring--2"/>
          <span className="voice-orb-ring voice-orb-ring--3"/>
        </div>
        <div className="voice-room-time">{fmt(sec)}</div>
      </div>

      <div className="voice-room-foot">
        <p className="voice-room-tip">说完任意内容，我会帮你整理成记录</p>
        <button className="voice-room-done" onClick={finish}>
          <I name="check" size={20} stroke={2.2}/>
        </button>
        <span className="voice-room-done-lbl">完成</span>
      </div>
    </div>
  );
}

Object.assign(window, { ComposeScreen, ImmersiveVoice });
