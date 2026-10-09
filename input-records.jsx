/* Shared input receipt, provenance and prototype comparison UI. */
const InputRecordContext = React.createContext({family:false});
const inputPlayback = (()=>{
  let state={id:null,playing:false,remaining:0,total:0}, timer=null, media=null;
  const listeners=new Set();
  const emit=()=>listeners.forEach(fn=>fn({...state}));
  const stop=()=>{clearInterval(timer);timer=null;if(media){media.pause();media=null;}window.speechSynthesis?.cancel();};
  const toggle=(source)=>{
    const seconds = Number(source.voice?.seconds) || (()=>{const p=String(source.voice?.duration||'8').replace(/[″秒]/g,'').split(':').map(Number);return p.length===2?p[0]*60+p[1]:p[0];})() || 8;
    if(state.id===source.id && state.playing){
      clearInterval(timer);timer=null;media?.pause();window.speechSynthesis?.pause();state.playing=false;emit();return;
    }
    const resume=state.id===source.id && state.remaining>0 && state.remaining<state.total;
    if(!resume){stop();state={id:source.id,total:seconds,remaining:seconds,playing:true};
      if(source.voice?.url){media=new Audio(source.voice.url);media.play().catch(()=>{});}
      else if(window.speechSynthesis){const utterance=new SpeechSynthesisUtterance(source.text||source.originalText||'语音记录');utterance.lang='zh-CN';window.speechSynthesis.speak(utterance);}
    }else{state.playing=true;media?.play().catch(()=>{});window.speechSynthesis?.resume();}
    const started=Date.now(), remaining=state.remaining;
    timer=setInterval(()=>{state.remaining=Math.max(0,remaining-(Date.now()-started)/1000);if(!state.remaining){stop();state.playing=false;state.remaining=state.total;}emit();},100);
    emit();
  };
  return {toggle,reset(){stop();state={id:null,playing:false,remaining:0,total:0};emit();},subscribe(fn){listeners.add(fn);fn({...state});return ()=>listeners.delete(fn);}};
})();

function InputVoice({source,compact=false}){
  const [play,setPlay]=React.useState({});
  React.useEffect(()=>inputPlayback.subscribe(setPlay),[]);
  if(!source?.voice)return null;
  const active=play.id===source.id, playing=active&&play.playing;
  const duration=source.voice.seconds || source.voice.duration || 8;
  return <button type="button" className={'input-voice'+(compact?' is-compact':'')+(playing?' is-playing':'')} aria-label={(playing?'暂停语音':'播放语音')+' '+duration+'秒'} onClick={e=>{e.stopPropagation();inputPlayback.toggle(source);}} onKeyDown={e=>e.stopPropagation()}>
    <span aria-hidden="true">{playing?'Ⅱ':'▶'}</span><span className="input-wave" aria-hidden="true"><i/><i/><i/><i/><i/></span><span>{active?Math.ceil(play.remaining):String(duration).replace(/[″秒]/g,'')}″</span>
  </button>;
}

function InputSourceMeta({source}){
  const date=source.date ? source.date.slice(5) : '';
  return <div className="input-source-meta"><small>仅本人可见</small><small>来自 {date ? date+' ' : ''}{source.time}的{source.voice?'语音':'文字'}记录</small></div>;
}

function InputProvenance({entry,expanded=false}){
  const {family}=React.useContext(InputRecordContext);
  const source=window.InputRecords.privateSource(entry);
  if(family||!source)return null;
  return <section className={'input-provenance'+(expanded?' is-expanded':'')} onClick={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()} aria-label="记录来源，仅本人可见">
    {expanded?<InputSourceMeta source={source}/>:null}
    <div className="input-provenance-line">
      {expanded?<p className="input-original-copy">{source.voice?<InputVoice source={source}/>:null}<span>{source.text}</span></p>:<>{source.voice?<InputVoice source={source} compact/>:null}<button className="input-source-link" type="button" disabled={source.deleted} onClick={()=>window.dispatchEvent(new CustomEvent('open-input-source',{detail:source.id}))}><span>{source.text}</span></button></>}
    </div>
  </section>;
}

function InputResultRow({record,showHistory=true}){
  return <div className="input-result-row"><button type="button" className="input-result-open" onClick={()=>window.dispatchEvent(new CustomEvent('open-input-result',{detail:record.id}))}>
    <span className="input-result-art">{record.iconSrc?<img src={record.iconSrc} alt=""/>:'✦'}</span>
    <span><b>{InputRecords.title(record)}{InputRecords.value(record)?' · '+InputRecords.value(record):''}</b><small>{InputRecords.subject(record)} · {record.dateOffset?'昨天 ':''}{record.time||record.primary?.time}</small></span><i>›</i>
  </button>{showHistory&&record.showFeedingHistoryEntry?<button type="button" className="input-history-link" onClick={()=>window.dispatchEvent(new CustomEvent('open-shared-feeding-history',{detail:{babyName:record.babyName}}))}>查看{record.babyName}的全部喂养记录 ›</button>:null}</div>;
}

function InputSourceCard({item}){
  const related=item.relatedRecords||[];
  const tags=InputRecords.subjectTags(related);
  return <article className={'input-source-card'+(item.grouped?' is-grouped':'')} data-input-id={item.id}>
    <div className="input-source-heading"><time>{item.time}</time></div>
    <div className="input-source-content" role="button" tabIndex="0" aria-label="编辑原始输入" onClick={()=>window.dispatchEvent(new CustomEvent('open-input-source',{detail:item.id}))} onKeyDown={e=>{if(e.target===e.currentTarget&&(e.key==='Enter'||e.key===' ')){e.preventDefault();window.dispatchEvent(new CustomEvent('open-input-source',{detail:item.id}));}}}>
      <p className="input-original-copy">{item.voice?<InputVoice source={{...item,text:item.originalText}}/>:null}<span>{item.originalText}</span></p>
      {tags.length?<div className="input-tags">{tags.map(group=><div className="input-tag-row" key={group.subject}><span className="input-subject-tag">{group.subject}</span>{group.labels.map(label=><span key={label}>{label}</span>)}</div>)}</div>:null}
    </div>
    {item.status==='pending'?<button className="input-confirm-resume" onClick={()=>window.dispatchEvent(new CustomEvent('confirm-input-records',{detail:item.id}))}>待确认 · 补充信息后保存 ›</button>:item.status==='processing'?<div className="input-extract-status" role="status"><span className="input-ai-spin">✦</span>记录提取中<span className="input-extract-dots">···</span></div>:related.length&&item.status!=='failed'?null:<div className="input-extract-status" role="status">{item.status==='failed'?'已保存':'原文已保存，未提取出记录'}</div>}
    {item.grouped&&related.length?<div className="input-results">{related.map(r=><InputResultRow key={r.id} record={r}/>)}</div>:null}
    {item.status==='done'&&item.feedbackStatus!=='failed'&&item.feedbackRecord?<BabyRecordFeedback item={item.feedbackRecord} showFeedingFeedback={['配方奶','母乳','瓶喂母乳'].includes(item.feedbackRecord.feedType)}/>:null}
  </article>;
}

function InputSourceEditor({source,records,onClose,onSave,onDelete}){
  const [text,setText]=React.useState(source.originalText);
  const [time,setTime]=React.useState(source.time);
  const changed=text!==source.originalText||time!==source.time;
  const dateLabel=source.date?`${Number(source.date.slice(5,7))}月${Number(source.date.slice(8,10))}日`:'';
  return <section className="input-full-page input-source-editor" role="dialog" aria-modal="true" aria-label="原始输入编辑页">
    <header><button onClick={onClose}>取消</button><h1>编辑记录</h1><button className="input-source-save" disabled={!changed||!text.trim()||!time} onClick={()=>onSave(text,time)}>保存</button></header>
    <main>
      <section className="input-editor-section input-source-time"><label><span>记录时间</span><span className="input-source-time-value">{dateLabel} {time}<i>›</i></span><input aria-label="记录时间" type="time" value={time} onChange={e=>setTime(e.target.value)}/></label></section>
      <section className="input-editor-section input-source-copy"><h2>记录内容</h2>{source.voice?<div className="input-original-copy"><InputVoice source={{...source,text:source.originalText}}/></div>:null}<textarea aria-label="原始输入内容" value={text} onChange={e=>setText(e.target.value)}/></section>
      <p className="input-editor-hint">修改文字不会修改识别内容</p>
      <section className="input-editor-section input-source-recognized"><h2>识别内容</h2>{records.length?records.map(r=><InputResultRow record={r} key={r.id} showHistory={false}/>):<p className="input-editor-hint">{source.status==='processing'?'记录提取中':source.status==='pending'?'待确认记录信息':'暂无识别内容'}</p>}</section>
      <button className="input-source-delete" onClick={onDelete}>删除这条记录</button>
    </main>
  </section>;
}

function InputPersonalEditor({entry,onClose,onSave,onDelete}){
  const [val,setVal]=React.useState(InputRecords.value(entry)||entry.primary?.text||'');
  const [time,setTime]=React.useState(entry.time||entry.primary?.time||'');
  const [note,setNote]=React.useState(entry.noteText||'');
  return <section className="input-full-page input-result-editor" role="dialog" aria-modal="true" aria-label={InputRecords.title(entry)+'记录编辑页'}>
    <header><button aria-label="返回" onClick={onClose}>‹</button><h1>{InputRecords.title(entry)}</h1><span/></header><main><section className="input-editor-section"><label className="input-time-field">记录时间<input type="time" value={time} onChange={e=>setTime(e.target.value)}/></label><label>记录内容<input className="input-value-field" value={val} onChange={e=>setVal(e.target.value)}/></label><label>备注<textarea aria-label="备注" placeholder="添加备注" value={note} onChange={e=>setNote(e.target.value)}/></label></section><InputProvenance entry={entry} expanded/></main><footer><button disabled={!val.trim()||!time} onClick={()=>onSave({value:val,time,note})}>保存</button></footer>
  </section>;
}

function InputRecordEditors({timeline,setTimeline,family}){
  const [sourceId,setSourceId]=React.useState(null);
  const [resultId,setResultId]=React.useState(null);
  React.useEffect(()=>{if(family){inputPlayback.reset();setSourceId(null);setResultId(null);}},[family]);
  const entries=InputRecords.all(timeline);
  const latest=React.useRef(entries);latest.current=entries;
  React.useEffect(()=>{
    const source=e=>{if(!family){setSourceId(e.detail);setResultId(null);}};
    const result=e=>{
      const record=latest.current.find(r=>r.id===e.detail);
      if(!record||family)return;
      if(record.kind==='baby-feeding-card')window.dispatchEvent(new CustomEvent('open-baby-feeding-detail',{detail:record}));
      else setResultId(record.id);
    };
    window.addEventListener('open-input-source',source);window.addEventListener('open-input-result',result);
    const original=window.openEditModal;
    const intercept=(id,kind,payload)=>{const record=latest.current.find(r=>r.id===id||r.primary?.id===id);if(record?.inputId){result({detail:record.id});return;}original?.(id,kind,payload);};
    window.openEditModal=intercept;
    return ()=>{window.removeEventListener('open-input-source',source);window.removeEventListener('open-input-result',result);if(window.openEditModal===intercept)window.openEditModal=original;};
  },[family]);
  const mutate=fn=>setTimeline(blocks=>blocks.map(b=>b.type==='day'?{...b,items:fn(b.items||b.entries||[]),entries:undefined}:b));
  const source=entries.find(r=>r.id===sourceId), result=entries.find(r=>r.id===resultId);
  if(family)return null;
  return <>{source?<InputSourceEditor key={source.id} source={source} records={entries.filter(r=>r.inputId===source.id)} onDelete={()=>{mutate(items=>items.filter(r=>r.id!==source.id).map(r=>r.inputId===source.id?{...r,inputSource:{...r.inputSource,deleted:true}}:r));setSourceId(null);}} onClose={()=>setSourceId(null)} onSave={(text,time)=>{mutate(items=>items.map(r=>r.id===source.id?{...r,originalText:text,time}:r.inputId===source.id?{...r,inputSource:{...r.inputSource,text,time}}:r));setSourceId(null);}}/>:null}
    {result?<InputPersonalEditor key={result.id} entry={result} onClose={()=>setResultId(null)} onDelete={()=>{mutate(items=>items.filter(r=>r.id!==result.id));setResultId(null);}} onSave={({value,time,note})=>{mutate(items=>items.map(r=>r.id===result.id?{...r,time,noteText:note,primary:{...r.primary,time,recordValue:value,recordDetail:value,symptomValue:r.primary?.kind==='symptom'?value:r.primary?.symptomValue,periodLabel:r.primary?.kind==='period'?value:r.primary?.periodLabel,text:value}}:r));setResultId(null);}}/>:null}</>;
}

function InputConfirmation({source,onClose,onConfirm}){
  const [records,setRecords]=React.useState(source.pendingRecords);
  const pending=records.filter(r=>r.confirmationFields?.length);
  const ready=pending.every(r=>r.babyName && r.feedType!=='奶');
  const choose=(id,field,value)=>setRecords(rows=>rows.map(r=>r.id===id?{...r,[field]:value}:r));
  return <div className="input-confirm-overlay"><section className="input-confirm-sheet" role="dialog" aria-modal="true" aria-label="确认记录信息">
    <header><h2>确认记录信息</h2><button aria-label="稍后确认" onClick={onClose}>×</button></header>
    <p className="input-confirm-hint">补充以下信息，确认后保存记录</p>
    <p className="input-confirm-original input-original-copy">{source.voice?<InputVoice source={{...source,text:source.originalText}}/>:null}<span>{source.originalText}</span></p>
    <div className="input-confirm-items">{pending.map((r,i)=><section className="input-confirm-item" key={r.id}>
      <h3>{pending.length>1?`记录 ${i+1} · `:''}{r.value || InputRecords.title(r)}</h3>
      {r.confirmationFields.includes('feedType')?<fieldset><legend>记录项</legend><div>{['配方奶','瓶喂母乳'].map(type=><button key={type} aria-pressed={r.feedType===type} onClick={()=>choose(r.id,'feedType',type)}>{type}</button>)}</div></fieldset>:<p>记录项：{r.feedType}</p>}
      {r.confirmationFields.includes('babyName')?<fieldset><legend>记录对象</legend><div>{['小豆苗','小豆芽'].map(name=><button key={name} aria-pressed={r.babyName===name} onClick={()=>choose(r.id,'babyName',name)}>{name}</button>)}</div></fieldset>:<p>记录对象：{r.babyName}</p>}
    </section>)}</div>
    <button className="input-confirm-save" disabled={!ready} onClick={()=>onConfirm(records)}>确认并保存</button>
  </section></div>;
}

function InputMethodGuide({onDismiss,scheme}){
  const [anchor,setAnchor]=React.useState(null);
  const dismissRef=React.useRef(onDismiss);dismissRef.current=onDismiss;
  React.useLayoutEffect(()=>{
    const dock=document.querySelector('.phone .dock-wrap');
    if(!dock)return;
    const input=dock.querySelector('.dock-input-row');
    if(!input)return;
    if(scheme==='both')input.querySelector('[aria-label="切换语音"]')?.click();
    const position=()=>{const rect=input.getBoundingClientRect();setAnchor({top:rect.top,bottom:rect.bottom});};
    position();const observer=new ResizeObserver(position);observer.observe(dock);observer.observe(input);
    window.addEventListener('resize',position);
    const interact=e=>{if(e.target.closest('.dock-input-row') && (e.type==='input'||e.target.closest('button,textarea,input')))dismissRef.current();};
    document.addEventListener('pointerdown',interact);document.addEventListener('input',interact);
    return ()=>{observer.disconnect();window.removeEventListener('resize',position);document.removeEventListener('pointerdown',interact);document.removeEventListener('input',interact);};
  },[]);
  if(anchor===null)return null;
  return <><button type="button" className="input-guide-shade" style={{top:0,height:Math.max(0,anchor.top-4)}} aria-label="关闭新手引导" onClick={onDismiss}/><div className="input-guide-shade" style={{top:anchor.bottom+4,bottom:0}} aria-hidden="true" onClick={onDismiss}/><aside className="input-method-guide" style={{bottom:window.innerHeight-anchor.top+12}} aria-label="语音和文字记录新手引导">
    {scheme==='both'?<>
      <h2>宝宝的日常，你的状态，都能记</h2>
      <p>说话、打字都可以，试试按住下方说一句。</p>
      <h3>记宝宝</h3>
      <section className="input-guide-examples"><p>“上午10点，喂了配方奶100毫升”</p><p>“宝宝今天下午2点睡了一觉，5点醒来”</p></section>
      <h3>记自己</h3>
      <section className="input-guide-examples"><p>“今天月经来了，有点头痛，心情烦躁”</p><p>“早上称了体重，58公斤”</p></section>
      <div className="input-guide-voice-cue"><span>按住说话，帮你记下来</span></div>
    </>:<>
      <h2>现在，说一句或打字也能记</h2>
      <p>不知道怎么记？看看例子</p>
      <section className="input-guide-examples"><p>“上午10点，喂了配方奶100毫升”</p><p>“宝宝今天下午2点睡了一觉，5点醒来”</p></section>
      <div><span>按住说话，也可以点键盘输入</span></div>
    </>}
  </aside></>;
}

function InputEmptyGuide(){
  const [slide,setSlide]=React.useState(0);
  const [bottom,setBottom]=React.useState(240);
  React.useEffect(()=>{const timer=setInterval(()=>setSlide(n=>(n+1)%4),5000);return ()=>clearInterval(timer);},[]);
  React.useLayoutEffect(()=>{
    const dock=document.querySelector('.phone .dock-wrap');if(!dock)return;
    const update=()=>setBottom(window.innerHeight-dock.getBoundingClientRect().top+12);
    update();const observer=new ResizeObserver(update);observer.observe(dock);window.addEventListener('resize',update);
    return ()=>{observer.disconnect();window.removeEventListener('resize',update);};
  },[]);
  const titles=['说一句，宝宝喂养轻松记','开口说，饮食心情自动归集','拍一下，即刻算出每餐热量','记周期，马上读懂身体信号'];
  return <section className="input-empty-guide" style={{bottom}} aria-label="空值引导轮播" aria-roledescription="轮播">
    <article className={'input-empty-card input-empty-slide-'+slide} aria-label={`第${slide+1}张，共4张：${titles[slide]}`}>
      <h2>{titles[slide]}</h2><div className="input-empty-rail"><h3>{slide===1?'9月1日':slide===2?'昨天':'今天'}<small>{slide===1?'周一':slide===2?'周二':'周三'}</small></h3>
      {slide===0?<>
        <p className="input-empty-quote"><span>▶ 8″</span>上午10点，小豆苗喝了100毫升配方奶，刚换了尿布。</p>
        <div className="input-empty-baby-row"><img src="assets/baby-feeding-icons/formula.png" alt=""/><div>配方奶：100ml<small>小豆苗 · 10:00</small></div></div>
        <div className="input-empty-baby-row"><img src="assets/baby-feeding-icons/diaper.png" alt=""/><div>换尿布<small>小豆苗 · 10:00</small></div></div>
        <div className="input-empty-baby-summary"><b>喂养日常，一句话记下来</b><p>说话、打字都可以<br/>一次也能记录多件事</p></div>
      </>:slide===1?<>
        <p className="input-empty-quote"><span>▶ 8″</span>昨天下班后吃了一顿火锅，非常好吃，心情舒畅感到很快乐。</p>
        <div className="input-empty-chart"><b>✦ 情绪变化曲线</b><svg viewBox="0 0 260 100" role="img" aria-label="情绪变化示例"><rect x="0" y="8" width="260" height="44" rx="10" fill="#fffbe9"/><rect y="58" width="260" height="20" fill="#f0f9fd"/><rect y="84" width="260" height="16" fill="#fff2f5"/><path d="M12 28L53 31L94 31L135 31L176 30L217 23L248 22" fill="none" stroke="#ff70a3" strokeWidth="2"/>{[[12,28],[53,31],[94,31],[135,31],[176,30],[217,23],[248,22]].map(([x,y])=><circle key={x} cx={x} cy={y} r="3.5" fill="#ff70a3"/>)}</svg></div>
        <p className="input-empty-insight">近7天：心情整体不错，均处于<em>积极状态</em></p>
      </>:slide===2?<>
        <img className="input-empty-meal" src="assets/diet-meal-1.png" alt="饮食记录示例"/>
        <div className="input-empty-foods"><span>番茄炖牛腩 200千卡</span><span>清蒸鲈鱼 310千卡</span><span>香菇扒菜心 90千卡</span><span>胡萝卜炒肉 130千卡</span></div><p className="input-empty-insight">总热量：<em>730千卡</em></p>
      </>:<>
        <p className="input-empty-period">🩸 月经来了</p><div className="input-empty-signals"><b>－ 月经信号灯 －</b><div>{['稳定','轻度波动','明显波动','建议关注'].map((label,i)=><span key={label} className={'signal-'+i}><i/>{label}</span>)}</div></div><p className="input-empty-insight">本次周期：<em>30</em>天，整体表现稳定<br/>处于<em>21–35</em>天的理想范围内，继续保持！</p>
      </>}
      </div>
    </article>
    <nav className="input-empty-dots" aria-label="选择空值引导页">{titles.map((title,i)=><button key={title} aria-label={title} aria-current={slide===i?'true':undefined} onClick={()=>setSlide(i)}/>)}</nav>
  </section>;
}

function InputDemoPanel({scheme,onScheme,family,onFamily,onDemo,onConfirmDemo,emptyGuide,onEmptyGuide,guideScheme,onGuideScheme,onReplayGuide}){
  const [open,setOpen]=React.useState(false), [scenario,setScenario]=React.useState('success');
  return <aside className="input-demo-panel"><button className="input-demo-toggle" onClick={()=>setOpen(!open)} aria-expanded={open}>交互方案 {open?'×':'⚙'}</button>{open?<div className="input-demo-body"><h2>点滴交互探索</h2><label>时间轴内容<select aria-label="空值引导" value={emptyGuide?'empty':'records'} onChange={e=>onEmptyGuide(e.target.value==='empty')}><option value="records">显示已有记录</option><option value="empty">空值引导 · 5秒自动轮播</option></select></label><label>输入方式新手引导<select aria-label="新手引导方案" value={guideScheme} onChange={e=>onGuideScheme(e.target.value)}><option value="bubble">方案一 · 输入栏轻提示</option><option value="none">不展示引导</option><option value="both">方案二 · 宝宝和自己都能记</option></select></label><div className="input-demo-actions"><button disabled={family} onClick={onReplayGuide}>重新展示引导</button></div><label>时间轴展示<select aria-label="时间轴展示方案" value={scheme} onChange={e=>onScheme(e.target.value)}><option value="independent">方案一 · 独立卡片</option><option value="grouped">方案二 · 紧凑记录组</option></select></label><label>查看视角<select aria-label="查看视角" value={family?'family':'self'} onChange={e=>onFamily(e.target.value==='family')}><option value="self">本人</option><option value="family">亲友（共享记录）</option></select></label><label>下次演示结果<select aria-label="演示提取结果" value={scenario} onChange={e=>setScenario(e.target.value)}><option value="success">正常提取</option><option value="failed">提取失败</option><option value="analysis-failed">反馈失败</option></select></label><div className="input-demo-actions"><button disabled={family} onClick={()=>onDemo(false,scenario)}>发送文字示例</button><button disabled={family} onClick={()=>onDemo(true,scenario)}>发送语音示例</button></div><label>信息不足时的确认</label><div className="input-demo-actions"><button disabled={family} onClick={()=>{setOpen(false);onConfirmDemo();}}>体验信息补充确认</button></div><p>发送“喂了100ml奶”，提取后选择奶类和宝宝，再确认保存。</p><p>本地规则模拟提取，等待 3 秒。语音示例使用文字朗读，不是真实录音。</p></div>:null}</aside>;
}

Object.assign(window,{InputSourceCard,InputProvenance,InputRecordEditors,InputDemoPanel,InputRecordContext,InputConfirmation,InputMethodGuide,InputEmptyGuide});
