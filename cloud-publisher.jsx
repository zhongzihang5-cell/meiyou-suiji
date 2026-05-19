// ============ 云朵发布器 — 浮在流上的输入框 ============
function CloudPublisher({
  ctx, expanded, onToggle, turns, syncItems, draft, onDraft,
  onSend, onChip, onVoice, onPhoto, livePreview,
}){
  const I = window.Icon;
  const listRef = React.useRef(null);
  const taRef = React.useRef(null);
  const phaseCls = ctx.cycle.kind || 'period';

  React.useEffect(()=>{
    if(listRef.current){
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [turns, syncItems, expanded]);

  if(!expanded){
    return (
      <div className="cloud-mini-row">
        <button className="cloud-mini-mic" onClick={onVoice} aria-label="语音记录">
          <I name="mic" size={18} stroke={1.8}/>
        </button>
        <button className="cloud-mini" onClick={onToggle} aria-label="展开记录">
          <span className="cloud-mini-glow"/>
          <span className="cloud-mini-text">今天，想记录点什么…</span>
          <span className="cloud-mini-chevron"><I name="arrow" size={14} stroke={2}/></span>
        </button>
      </div>
    );
  }

  return (
    <div className="cloud-float">
      <div className="cloud-float-glow" aria-hidden="true"/>
      <div className="cloud-card">
        <button className="cloud-collapse" onClick={onToggle} aria-label="收起">
          <I name="arrow" size={16} stroke={2}/>
        </button>

        <div className="cloud-date-pill">
          <span className="cloud-date-dot"/>
          <span>5月19日 · {ctx.weather.icon} {ctx.weather.text}</span>
          <span className="cloud-date-sep">·</span>
          <span className={'cloud-phase '+phaseCls}>{ctx.cycle.label} {ctx.cycle.sub}</span>
        </div>

        <div className="cloud-body" ref={listRef}>
          {turns.map((turn, i)=>{
            if(turn.type==='prompt'){
              return (
                <div key={i} className="cloud-prompt">
                  <p className="cloud-prompt-kicker">今天，想记录什么</p>
                  <p className="cloud-prompt-text">{turn.text}</p>
                </div>
              );
            }
            if(turn.type==='ai'){
              return (
                <div key={i} className={'cloud-ai'+(turn.isNew?' fade-in':'')}>{turn.text}</div>
              );
            }
            if(turn.type==='nudge'){
              return (
                <p key={i} className={'cloud-nudge'+(turn.isNew?' fade-in':'')}>{turn.text}</p>
              );
            }
            if(turn.type==='user'){
              return (
                <div key={i} className={'cloud-user'+(turn.isNew?' fade-in':'')}>{turn.text}</div>
              );
            }
            if(turn.type==='suggest'){
              return (
                <div key={i} className="cloud-chips">
                  {turn.items.map((it,j)=>(
                    <button key={j} className="cloud-chip" onClick={()=>onChip(it)}>
                      {it}
                    </button>
                  ))}
                </div>
              );
            }
            return null;
          })}

          {syncItems.length > 0 && (
            <div className="cloud-sync-lite fade-in">
              <span className="cloud-sync-lite-mark">
                <I name="check" size={10} stroke={2.6}/>
                已记录
              </span>
              <div className="cloud-sync-tags">
                {syncItems.map((s,i)=>(
                  <span
                    key={i}
                    className="cloud-sync-tag"
                    style={{animationDelay:(0.06 + i * 0.08)+'s'}}
                  >
                    {typeof s === 'string' ? s : s.label}
                  </span>
                ))}
              </div>
              {syncItems[0]?.dayHint && (
                <span className="cloud-sync-date">{syncItems[0].dayHint}</span>
              )}
            </div>
          )}
        </div>

        {livePreview && livePreview.labels?.length > 0 && (
          <div className="cloud-live-row">
            <div className="cloud-live-tag">
              <span className="cloud-live-dot"/>
              识别到 · {livePreview.labels.join(' · ')}
            </div>
            {livePreview.dayHint && (
              <span className="cloud-live-date">将记到 {livePreview.dayHint}</span>
            )}
          </div>
        )}

        <div className="cloud-input">
          <button className="cloud-ib cam" onClick={onPhoto} aria-label="拍照">
            <I name="camera" size={18} stroke={1.6}/>
          </button>
          <div className="cloud-ib text">
            <textarea
              ref={taRef}
              rows="1"
              placeholder="随口一说…"
              value={draft}
              onChange={(e)=>{
                onDraft(e.target.value);
                e.target.style.height='auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 64)+'px';
              }}
              onKeyDown={(e)=>{
                if(e.key==='Enter' && !e.shiftKey && draft.trim()){
                  e.preventDefault();
                  onSend();
                }
              }}
            />
          </div>
          <button className="cloud-ib voice always" onClick={onVoice} aria-label="语音">
            <span className="cloud-vwf">
              {[5,9,12,9,5,8,11].map((h,j)=><span key={j} style={{height:h+'px'}}/>)}
            </span>
          </button>
          {draft.trim() ? (
            <button className="cloud-ib send on" onClick={onSend} aria-label="发送">
              <I name="send" size={16} stroke={2}/>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ============ 聆听层（全屏，仅录音时） ============
function ListeningOverlay({ctx, onCancel, onDone, script}){
  const I = window.Icon;
  const [sec, setSec] = React.useState(0);
  const [partial, setPartial] = React.useState('');
  const line = script || '哎，昨天月经来了，昨天肚子不太舒服';

  React.useEffect(()=>{
    const id = setInterval(()=>setSec(s=>s+1), 1000);
    return ()=>clearInterval(id);
  },[]);

  React.useEffect(()=>{
    let i = 0;
    const id = setInterval(()=>{
      i++;
      setPartial(line.slice(0, i));
      if(i >= line.length) clearInterval(id);
    }, 160);
    return ()=>clearInterval(id);
  }, [line]);

  return (
    <div className="listen-overlay">
      <button className="listen-close" onClick={onCancel} aria-label="关闭">
        <I name="close" size={24} stroke={1.5}/>
      </button>
      <div className="listen-title">正在听你说<span className="dots">······</span></div>
      {ctx && (
        <div className="listen-ctx">{ctx.cycle.label} · {ctx.cycle.sub}</div>
      )}
      <div className="listen-orb-wrap">
        <div className="orb-aura"/>
        <div className="orb"/>
        {partial && <div className="listen-transcript">「{partial}」</div>}
      </div>
      <button className="listen-mic" onClick={()=>onDone(partial || line, sec)}>
        <I name="mic" size={26} stroke={1.7}/>
      </button>
    </div>
  );
}

Object.assign(window, { CloudPublisher, ListeningOverlay });
