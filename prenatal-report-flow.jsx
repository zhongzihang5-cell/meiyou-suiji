function PrenatalReportDocIcon({size=24}){
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <rect x="10" y="6" width="28" height="36" rx="5" fill="#fff"/>
      <path d="M17 16h14M17 22h14M17 28h8" fill="none" stroke="#ff6b9c" strokeWidth="2.4" strokeLinecap="round"/>
      <circle cx="31" cy="31" r="5" fill="#ff6b9c" opacity=".18"/>
      <path d="m28.8 31 1.5 1.5 3-3.3" fill="none" stroke="#ff4d88" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PrenatalReportPreview(){
  return (
    <div className="prenatal-report-paper" aria-hidden="true">
      <div className="prenatal-report-paper-head"><i/><span>美柚妇产医院</span></div>
      <b>孕早期产前检查报告</b>
      <div className="prenatal-report-paper-meta"><span>姓名：柚子</span><span>孕周：12周3天</span></div>
      <div className="prenatal-report-paper-table">
        <span>检查项目</span><span>结果</span><span>参考范围</span>
        <em>NT</em><em>1.6 mm</em><em>＜2.5 mm</em>
        <em>胎心率</em><em>158 次/分</em><em>正常</em>
        <em>头臀长</em><em>58 mm</em><em>符合孕周</em>
      </div>
      <div className="prenatal-report-paper-seal">已审核</div>
    </div>
  );
}

function PrenatalReportCardThumb(){
  return (
    <div className="prenatal-card-paper" aria-hidden="true">
      <div className="prenatal-card-paper-head"><i/><span>检查报告</span></div>
      <b>产前检查报告</b>
      <div className="prenatal-card-paper-line is-long"/>
      <div className="prenatal-card-paper-line"/>
      <div className="prenatal-card-paper-grid">
        <i/><i/><i/><i/><i/><i/><i/><i/><i/>
      </div>
    </div>
  );
}

function PrenatalReportCapture({onBack,onCapture,onAlbum}){
  return (
    <section className="prenatal-capture-page" aria-label="拍摄产检单">
      <header><button type="button" aria-label="返回" onClick={onBack}>‹</button><h1>拍摄产检单</h1><span>拍摄示例</span></header>
      <div className="prenatal-capture-main">
        <div className="prenatal-capture-frame"><PrenatalReportPreview/><i className="is-tl"/><i className="is-tr"/><i className="is-bl"/><i className="is-br"/></div>
        <p>请将整张产检单放入框内，保持文字清晰</p>
      </div>
      <footer>
        <button type="button" className="prenatal-album-btn" onClick={onAlbum}><span>▧</span>相册</button>
        <button type="button" className="prenatal-shutter" aria-label="拍照识别产检单" onClick={onCapture}><i/></button>
        <span className="prenatal-capture-spacer"/>
      </footer>
    </section>
  );
}

function PrenatalReportScanning(){
  return (
    <section className="prenatal-scan-page" aria-label="正在识别产检单">
      <div className="prenatal-scan-photo"><PrenatalReportPreview/><span/></div>
      <div className="prenatal-scan-status"><i>✦</i><b>正在识别产检单...</b><p>识别检查类型、孕周、日期和医院</p><div><span/></div></div>
    </section>
  );
}

function PrenatalReportReview({onBack,onSave}){
  return (
    <section className="prenatal-review-page" aria-label="确认产检单识别结果">
      <header><button type="button" aria-label="返回重拍" onClick={onBack}>‹</button><h1>确认产检单</h1><span/></header>
      <div className="prenatal-review-scroll">
        <div className="prenatal-review-source"><PrenatalReportPreview/><div><b>产检单识别完成</b><span>已识别 4 项信息</span><button type="button">查看原图</button></div></div>
        <section className="prenatal-review-card">
          <h2>基本信息</h2>
          <label><span>产检日期</span><input aria-label="产检日期" defaultValue="2026-08-19"/></label>
          <label><span>医院</span><input aria-label="医院" defaultValue="美柚妇产医院"/></label>
          <label><span>孕周</span><input aria-label="孕周" defaultValue="12周3天"/></label>
          <label><span>检查类型</span><input aria-label="检查类型" defaultValue="NT检查"/></label>
        </section>
        <p className="prenatal-review-tip">请核对识别结果，原图将与本次产检记录一起保存。</p>
      </div>
      <footer><button type="button" onClick={onSave}>确认记录</button></footer>
    </section>
  );
}

function PrenatalReportFlow({open,onClose,onSave}){
  const [phase,setPhase]=React.useState('capture');
  const timerRef=React.useRef(null);
  React.useEffect(()=>{
    if(open) setPhase('capture');
    return ()=>window.clearTimeout(timerRef.current);
  },[open]);
  const recognize=()=>{
    setPhase('scanning');
    window.clearTimeout(timerRef.current);
    timerRef.current=window.setTimeout(()=>onSave?.({date:'2026-08-19',hospital:'美柚妇产医院',week:'12周3天',examType:'NT检查'}),5000);
  };
  if(!open) return null;
  return ReactDOM.createPortal(
    <div className="prenatal-report-flow" role="dialog" aria-modal="true" aria-label="记录产检单">
      {phase==='capture'?<PrenatalReportCapture onBack={onClose} onCapture={recognize} onAlbum={recognize}/>:null}
      {phase==='scanning'?<PrenatalReportScanning/>:null}
      {phase==='review'?<PrenatalReportReview onBack={()=>setPhase('capture')} onSave={()=>onSave?.({date:'2026-08-19',hospital:'美柚妇产医院',week:'12周3天',examType:'NT检查'})}/>:null}
    </div>,
    document.body
  );
}

function PrenatalReportTimelineCard({item}){
  const openEdit=()=>window.dispatchEvent(new CustomEvent('open-prenatal-report-edit',{detail:item}));
  return (
    <article className="prenatal-timeline-card" role="button" tabIndex="0" aria-label="编辑产检单记录" onClick={openEdit} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openEdit();}}}>
      {item.time?<time>{item.time}</time>:null}
      <section className="prenatal-timeline-summary">
        <header><span><PrenatalReportDocIcon size={20}/></span><b>产检单：</b></header>
        <div className="prenatal-timeline-thumb"><PrenatalReportCardThumb/></div>
        <p>{item.week}完成<span className="prenatal-timeline-highlight">NT</span>产检</p>
      </section>
    </article>
  );
}

function PrenatalReportEditPage({item,onClose,onDelete,onSave}){
  const source=item || {};
  const [draft,setDraft]=React.useState({examType:source.examType || 'NT检查',week:source.week || '12周3天',date:source.date || '2026-08-19',hospital:source.hospital || '美柚妇产医院'});
  const [activeField,setActiveField]=React.useState(null);
  if(!item) return null;
  const dirty=draft.examType!==(source.examType || 'NT检查') || draft.week!==(source.week || '12周3天') || draft.date!==(source.date || '2026-08-19') || draft.hospital!==(source.hospital || '美柚妇产医院');
  const update=(key,value)=>setDraft(current=>({...current,[key]:value}));
  const closeKeyboard=()=>{setActiveField(null);document.activeElement?.blur?.();};
  const keyboardRows=[['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['Z','X','C','V','B','N','M']];
  const pressKey=key=>{
    if(!activeField) return;
    if(key==='删除') update(activeField,draft[activeField].slice(0,-1));
    else if(key==='空格') update(activeField,draft[activeField]+' ');
    else update(activeField,draft[activeField]+key.toLowerCase());
  };
  return ReactDOM.createPortal(
    <section className={`prenatal-edit-page${activeField?' is-keyboard-open':''}`} aria-label="编辑产检单记录">
      <header><button type="button" className="prenatal-edit-close" aria-label="关闭编辑记录" onClick={onClose}>×</button><h1>编辑记录</h1><button type="button" className="prenatal-edit-save" disabled={!dirty} onClick={()=>onSave?.(draft)}>保存</button></header>
      <main>
        <section className="prenatal-edit-section prenatal-edit-time">
          <div><span>◷</span><b>记录时间</b></div><p>今天 {item.time}<i>›</i></p>
        </section>
        <section className="prenatal-edit-section prenatal-edit-details">
          <header><span>▤</span><b>记录详情</b></header>
          <div className="prenatal-edit-detail-photo"><span>产检单图片</span><div className="prenatal-edit-photo-box"><PrenatalReportCardThumb/></div></div>
          <dl>
            <label><dt>产检单类型</dt><dd><input aria-label="产检单类型" inputMode="text" enterKeyHint="done" autoComplete="off" value={draft.examType} onFocus={()=>setActiveField('examType')} onClick={()=>setActiveField('examType')} onChange={event=>update('examType',event.target.value)}/></dd></label>
            <label><dt>孕周</dt><dd><input aria-label="孕周" inputMode="text" enterKeyHint="done" autoComplete="off" value={draft.week} onFocus={()=>setActiveField('week')} onClick={()=>setActiveField('week')} onChange={event=>update('week',event.target.value)}/></dd></label>
            <label><dt>检查时间</dt><dd><input aria-label="检查时间" inputMode="text" enterKeyHint="done" autoComplete="off" value={draft.date} onFocus={()=>setActiveField('date')} onClick={()=>setActiveField('date')} onChange={event=>update('date',event.target.value)}/></dd></label>
            <label><dt>检查医院</dt><dd><input aria-label="检查医院" inputMode="text" enterKeyHint="done" autoComplete="off" value={draft.hospital} onFocus={()=>setActiveField('hospital')} onClick={()=>setActiveField('hospital')} onChange={event=>update('hospital',event.target.value)}/></dd></label>
          </dl>
        </section>
        <section className="prenatal-edit-section prenatal-edit-danger"><button type="button" onClick={onDelete}>删除这条记录</button></section>
      </main>
      {activeField?<div className="prenatal-edit-keyboard" role="dialog" aria-label="输入键盘">
        <header><span>正在编辑</span><button type="button" onMouseDown={event=>event.preventDefault()} onClick={closeKeyboard}>完成</button></header>
        {keyboardRows.map((row,index)=><div className={`prenatal-key-row is-${index+1}`} key={index}>{row.map(key=><button type="button" key={key} onMouseDown={event=>event.preventDefault()} onClick={()=>pressKey(key)}>{key}</button>)}</div>)}
        <div className="prenatal-key-row is-actions"><button type="button" onMouseDown={event=>event.preventDefault()} onClick={()=>pressKey('删除')}>删除</button><button type="button" onMouseDown={event=>event.preventDefault()} onClick={()=>pressKey('空格')}>空格</button><button type="button" onMouseDown={event=>event.preventDefault()} onClick={closeKeyboard}>完成</button></div>
      </div>:null}
    </section>,
    document.body
  );
}

window.PrenatalReportFlow=PrenatalReportFlow;
window.PrenatalReportTimelineCard=PrenatalReportTimelineCard;
window.PrenatalReportDocIcon=PrenatalReportDocIcon;
window.PrenatalReportEditPage=PrenatalReportEditPage;
