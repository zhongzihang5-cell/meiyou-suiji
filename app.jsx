const { useState, useEffect, useRef } = React;

const SCENES = {
  period: {
    status:'good',
    healthTitle:'本次周期正常',
    healthDesc:'经期第 3 天 · 较上周期更规律',
    phaseLabel:'经期', phaseKind:'period',
    dayNum:'D3', dayLbl:'今日',
    guideText:<React.Fragment>经期<em>第 3 天</em>，量通常开始减少了。今天感觉怎么样？</React.Fragment>,
    chips:['还不错','有点疼','量挺多','心情不好','想吃甜的'],
  },
  follicular: {
    status:'good',
    healthTitle:'卵泡期 · 状态良好',
    healthDesc:'距下次经期约 16 天',
    phaseLabel:'卵泡期', phaseKind:'foll',
    dayNum:'D9', dayLbl:'今日',
    guideText:<React.Fragment>这是月里<em>精力最充沛</em>的几天，想做的事可以安排起来。</React.Fragment>,
    chips:['状态不错','皮肤变好','想运动','有点累','拍张自拍'],
  },
  warn: {
    status:'warn',
    healthTitle:'本周期需关注',
    healthDesc:'痛经加重 · 量较上次偏多',
    phaseLabel:'经期', phaseKind:'period',
    dayNum:'D2', dayLbl:'今日',
    guideText:<React.Fragment>上周期没有用药，这次第 2 天就吃了止痛药，<em>需要留意</em>。</React.Fragment>,
    chips:['还在疼','已缓解','量很多','想休息','看看建议'],
  },
};

function App(){
  const [t, setTweak] = window.useTweaks({...window.__TWEAK_DEFAULTS});
  const scene = SCENES[t.scene] || SCENES.period;

  const [draft, setDraft] = useState('');
  const [focused, setFocused] = useState(false);
  const [livePreview, setLivePreview] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [timeline, setTimeline] = useState(window.TIMELINE);
  const [newId, setNewId] = useState(null);
  const [showVoice, setShowVoice] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const taRef = useRef(null);

  useEffect(()=>{
    if(!draft.trim()){ setLivePreview(null); return; }
    const tm = setTimeout(()=>{
      const hits = window.extractKeywords(draft);
      setLivePreview(hits[0]||null);
    }, 350);
    return ()=>clearTimeout(tm);
  },[draft]);

  const pushToast = (opts)=>{
    const id = Math.random().toString(36).slice(2);
    setToasts(ts=>[...ts, {id, ...opts}]);
    setTimeout(()=>{
      setToasts(ts=>ts.map(x=>x.id===id?{...x,bye:true}:x));
      setTimeout(()=>setToasts(ts=>ts.filter(x=>x.id!==id)), 220);
    }, 2400);
  };

  // insert a new entry into the timeline under today's day section
  const insertEntry = (newEntry)=>{
    setTimeline(tl=>{
      // find today section
      const idx = tl.findIndex(i=>i.type==='day' && i.isToday);
      if(idx<0){ return [newEntry, ...tl]; }
      // insert after today's "guide" if present, else after day row
      let insertAt = idx+1;
      if(tl[idx+1] && tl[idx+1].type==='guide') insertAt = idx+2;
      return [...tl.slice(0,insertAt), newEntry, ...tl.slice(insertAt)];
    });
  };

  const submitText = ()=>{
    const text = draft.trim();
    if(!text) return;
    const hits = window.extractKeywords(text);
    const tags = hits.map(h=>({label:h.label, auto:true}));
    const analysis = window.chooseAnalysis(hits);
    const now = new Date();
    const time = String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
    const id = 'n'+Date.now();
    insertEntry({
      type:'entry', id, time, body:text, tags, analysis:null,
    });
    setDraft(''); setLivePreview(null); setNewId(id);
    if(tags.length){
      pushToast({ text:'已自动记录', tags: tags.slice(0,2).map(t=>t.label) });
    } else {
      pushToast({ text:'已保存到今日随记' });
    }
    if(analysis){
      setTimeout(()=>{
        setTimeline(tl=>tl.map(i=>i.id===id?{...i, analysis}:i));
      }, 700);
    }
    setTimeout(()=>window.scrollTo({top:0, behavior:'smooth'}), 50);
  };

  const submitVoice = (dur)=>{
    setShowVoice(false);
    const id = 'v'+Date.now();
    const now = new Date();
    const time = String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
    insertEntry({
      type:'entry', id, time,
      voice:{duration:dur || '0:08'},
      tags:[{label:'语音笔记', auto:false}],
      analysis:null,
    });
    setNewId(id);
    pushToast({ text:'语音已保存', tags:['转写中…']});
    setTimeout(()=>{
      setTimeline(tl=>tl.map(i=>i.id===id?{
        ...i,
        body:'今天感觉还行，量比昨天少了一些。',
        tags:[{label:'经量偏少', auto:true},{label:'状态平稳', auto:true}],
        analysis:{tone:'good', title:'转写完成 · 经期接近尾声',
          points:[{icon:'✓', text:'经量减少符合本周期趋势。'}]}
      }:i));
    }, 1400);
  };

  const submitPhoto = (src)=>{
    setShowPhoto(false);
    const id = 'p'+Date.now();
    const now = new Date();
    const time = String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
    insertEntry({
      type:'entry', id, time,
      photo:'placeholder',
      tags:[{label: src==='camera'?'拍摄':'相册', auto:false}],
    });
    setNewId(id);
    pushToast({ text:'照片已加入随记'});
  };

  const TP = window.TweaksPanel;
  const TR = window.TweakRadio;
  const TS = window.TweakSection;

  // render timeline items
  const renderItem = (item, i)=>{
    if(item.type==='day'){
      return (
        <div key={item.id} className={'tl-section'+(item.isToday?' today':'')+(item.dim?' dim':'')}>
          <DaySection item={item}/>
        </div>
      );
    }
    if(item.type==='guide'){
      return (
        <GuideCard key={'guide-'+i} chips={scene.chips} onChip={(c)=>{
          setDraft(c);
          taRef.current && taRef.current.focus();
        }}>
          {scene.guideText}
        </GuideCard>
      );
    }
    if(item.type==='entry'){
      return (
        <React.Fragment key={item.id}>
          <Entry e={item} isNew={item.id===newId}/>
          {item.analysis && <AIInsight analysis={item.analysis}/>}
        </React.Fragment>
      );
    }
    if(item.type==='phase'){
      return <PhaseMarker key={'phase-'+i} item={item}/>;
    }
    if(item.type==='gap'){
      return <GapMarker key={'gap-'+i} item={item}/>;
    }
    if(item.type==='cycle-report'){
      return <CycleReport key={'rep-'+i} item={item}/>;
    }
    return null;
  };

  return (
    <div className="phone">
      <StatusBar/>
      <TopNav title="随记"/>

      <div className="app">
        <HealthCard scene={scene}/>

        <div className="timeline">
          {timeline.map((item, i)=>renderItem(item, i))}
        </div>
      </div>

      <Toast toasts={toasts}/>

      <div className="input-wrap">
        {livePreview && (
          <div className="extract-preview">
            <span className="ico"></span>
            <span>小柚识别到：</span>
            <span className="tag-pill">{livePreview.label}</span>
          </div>
        )}
        <div className={'input-bar'+(focused?' focused':'')}>
          <button className="ib-icon" onClick={()=>setShowPhoto(true)} aria-label="photo">
            <Icon name="camera" size={20} stroke={1.7}/>
          </button>
          <button className="ib-icon" onClick={()=>setShowVoice(true)} aria-label="voice">
            <Icon name="mic" size={20} stroke={1.7}/>
          </button>
          <div className="ib-input">
            <textarea
              ref={taRef}
              rows="1"
              placeholder="说说今天身体的感受…"
              value={draft}
              onChange={(e)=>{
                setDraft(e.target.value);
                e.target.style.height='auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 80)+'px';
              }}
              onFocus={()=>setFocused(true)}
              onBlur={()=>setFocused(false)}
            ></textarea>
          </div>
          <button className={'ib-send'+(draft.trim()?' on':'')} onClick={submitText}>
            <Icon name="send" size={16} stroke={2}/>
          </button>
        </div>
      </div>

      {showVoice && <VoiceSheet onCancel={()=>setShowVoice(false)} onDone={submitVoice}/>}
      {showPhoto && <PhotoSheet onCancel={()=>setShowPhoto(false)} onPick={submitPhoto}/>}

      <TabBar active="note"/>

      <TP>
        <TS label="场景">
          <TR
            label="周期阶段"
            value={t.scene}
            options={[
              {value:'period', label:'经期中'},
              {value:'follicular', label:'卵泡期'},
              {value:'warn', label:'需关注'},
            ]}
            onChange={(v)=>setTweak('scene', v)}
          />
        </TS>
      </TP>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
