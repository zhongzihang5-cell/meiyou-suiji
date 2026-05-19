const { useState, useEffect, useRef } = React;

const SCENE_VOICE_SYNC = {
  period: ['经量','心情'],
  follicular: ['状态','睡眠'],
  pregnancy: ['胎动','体重'],
  parenting: ['喂养','睡眠'],
};

const TAG_EMOJI = {
  period:'🩸', pain:'😖', flow:'🩸', 'flow-low':'💧',
  sleep:'😴', mood:'💛', med:'💊',
};

function buildInitialTurns(ctx){
  return [
    { type:'prompt', text: ctx.openPrompt },
    { type:'suggest', items: ctx.chips },
  ];
}

function buildTimelineEntry(text, hits){
  const analysis = hits.length ? window.chooseAnalysis(hits) : null;
  const toneMap = { warn:'yellow', brand:'brand', good:'green' };
  const contentTypes = window.extractContentTypes(text);
  const topicTags = hits.map(h=>({
    emoji: TAG_EMOJI[h.kind] || '·',
    label: h.label,
  }));
  const contentTags = contentTypes.map(c=>({
    emoji: c.emoji,
    label: c.label,
    content: true,
  }));
  return {
    id:'e-'+Date.now(),
    time: window.formatNowTime(),
    body: text,
    isNew: true,
    tags: [...contentTags, ...topicTags],
    aiNote: analysis ? {
      tone: toneMap[analysis.tone] || 'green',
      icon: analysis.points?.[0]?.icon || '💡',
      text: analysis.points?.map(p=>p.text).join(' ') || analysis.title,
    } : undefined,
  };
}

function App(){
  const [t, setTweak] = window.useTweaks({...window.__TWEAK_DEFAULTS});
  const ctx = window.SCENE_CONTEXT[t.scene] || window.SCENE_CONTEXT.period;

  const [cloudExpanded, setCloudExpanded] = useState(false);
  const [turns, setTurns] = useState(()=>buildInitialTurns(ctx));
  const [syncItems, setSyncItems] = useState([]);
  const [draft, setDraft] = useState('');
  const [livePreview, setLivePreview] = useState(null);
  const [timeline, setTimeline] = useState(window.TIMELINE_BLOCKS);
  const [toasts, setToasts] = useState([]);
  const [listening, setListening] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);

  useEffect(()=>{
    setTurns(buildInitialTurns(ctx));
    setSyncItems([]);
    setDraft('');
    setLivePreview(null);
  }, [t.scene]);

  useEffect(()=>{
    if(!draft.trim()){ setLivePreview(null); return; }
    const tm = setTimeout(()=>{
      const hits = window.extractKeywords(draft);
      setLivePreview(hits[0] || null);
    }, 350);
    return ()=>clearTimeout(tm);
  }, [draft]);

  const pushToast = (opts)=>{
    const id = Math.random().toString(36).slice(2);
    setToasts(ts=>[...ts, {id, ...opts}]);
    setTimeout(()=>{
      setToasts(ts=>ts.map(x=>x.id===id?{...x,bye:true}:x));
      setTimeout(()=>setToasts(ts=>ts.filter(x=>x.id!==id)), 220);
    }, 2400);
  };

  const stripSuggest = (prev)=> prev.filter((x,i)=>!(x.type==='suggest' && i===prev.length-1));

  const pushToTimeline = (entry)=>{
    setTimeline(blocks=>window.appendTodayEntry(blocks, entry));
  };

  const submitText = (textOverride)=>{
    const text = (textOverride || draft).trim();
    if(!text) return;

    const hits = window.extractKeywords(text);
    const syncLabels = hits.map(h=>h.syncLabel || h.label);

    setTurns(prev=>[
      ...stripSuggest(prev),
      { type:'user', text, isNew:true },
    ]);
    setDraft('');
    setLivePreview(null);

    if(syncLabels.length){
      setSyncItems([]);
      setTimeout(()=>setSyncItems(syncLabels), 80);
    }

    setTimeout(()=>{
      setTurns(prev=>[...prev, { type:'ai', text: ctx.followUp, isNew:true }]);
    }, syncLabels.length ? 800 : 450);

    pushToTimeline(buildTimelineEntry(text, hits));

    if(syncLabels.length){
      pushToast({ text:'已同步到记录', tags: syncLabels.slice(0,2) });
    } else {
      pushToast({ text:'已保存到点滴' });
    }
  };

  const submitVoice = (transcript, durSec)=>{
    setListening(false);
    const syncLabels = SCENE_VOICE_SYNC[t.scene] || SCENE_VOICE_SYNC.period;

    setTurns(prev=>[
      ...stripSuggest(prev),
      { type:'user', text: transcript, isNew:true },
    ]);
    setSyncItems([]);
    setTimeout(()=>setSyncItems(syncLabels), 100);

    pushToTimeline({
      id:'e-'+Date.now(),
      time: window.formatNowTime(),
      body: transcript,
      isNew: true,
      tags: syncLabels.map(l=>({ emoji:'·', label:l })),
      aiNote:{
        tone:'green', icon:'💡',
        text:'语音已转写并关联到今日记录，小柚会持续观察本周期变化。',
      },
    });

    pushToast({ text:'语音已转写', tags: syncLabels.slice(0,2) });
  };

  const submitPhoto = ()=>{
    setShowPhoto(false);
    setTurns(prev=>[...stripSuggest(prev), { type:'user', text:'📷 添加了一张照片', isNew:true }]);
    pushToTimeline({
      id:'e-'+Date.now(),
      time: window.formatNowTime(),
      body:'',
      photo:true, photoTone:'warm', photoEmoji:'🌸',
      isNew: true,
      tags:[{ emoji:'📷', label:'照片' }],
    });
    pushToast({ text:'照片已加入点滴' });
  };

  const sceneForHealth = {
    status: ctx.status,
    healthTitle: ctx.healthTitle,
    healthDesc: ctx.healthDesc,
    phaseLabel: ctx.cycle.label,
    phaseKind: ctx.cycle.kind,
    dayNum: ctx.cycle.dayNum,
    dayLbl: '今日',
  };

  const TP = window.TweaksPanel;
  const TR = window.TweakRadio;
  const TS = window.TweakSection;
  const I = window.Icon;

  return (
    <div className="phone">
      <StatusBar/>

      <div className={'suiji-shell'+(cloudExpanded?' suiji-shell--cloud-open':'')}>
        <div className="suiji-stream">
          <div className="stream-header">
            <div>
              <h1 className="stream-title">点滴</h1>
              <p className="stream-sub">我和我身体的空间</p>
            </div>
            <div className="stream-actions">
              <button className="stream-action" aria-label="日历">
                <I name="calendar" size={20} stroke={1.7}/>
              </button>
              <button className="stream-action" aria-label="搜索">
                <I name="search" size={20} stroke={1.7}/>
              </button>
            </div>
          </div>

          {t.entry === 'analysis' && (
            <div className="stream-health">
              <HealthCard scene={sceneForHealth}/>
            </div>
          )}

          <TimelineStream blocks={timeline}/>
        </div>

        <CloudPublisher
          ctx={ctx}
          expanded={cloudExpanded}
          onToggle={()=>setCloudExpanded(v=>!v)}
          turns={turns}
          syncItems={syncItems}
          draft={draft}
          onDraft={setDraft}
          onSend={()=>submitText()}
          onChip={(c)=>submitText(c)}
          onVoice={()=>setListening(true)}
          onPhoto={()=>setShowPhoto(true)}
          livePreview={livePreview}
        />
      </div>

      {listening && (
        <ListeningOverlay
          ctx={ctx}
          onCancel={()=>setListening(false)}
          onDone={submitVoice}
        />
      )}
      {showPhoto && <PhotoSheet onCancel={()=>setShowPhoto(false)} onPick={submitPhoto}/>}

      <Toast toasts={toasts}/>
      <TabBar active="note"/>

      <TP>
        <TS label="场景">
          <TR
            label="用户身份"
            value={t.scene}
            options={[
              {value:'period', label:'经期'},
              {value:'follicular', label:'卵泡期'},
              {value:'pregnancy', label:'孕期'},
              {value:'parenting', label:'育儿'},
            ]}
            onChange={(v)=>setTweak('scene', v)}
          />
          <TR
            label="分析引流"
            value={t.entry || 'direct'}
            options={[
              {value:'direct', label:'无'},
              {value:'analysis', label:'顶部红绿灯'},
            ]}
            onChange={(v)=>setTweak('entry', v)}
          />
          <TR
            label="云朵"
            value={cloudExpanded ? 'open' : 'mini'}
            options={[
              {value:'open', label:'展开'},
              {value:'mini', label:'收起'},
            ]}
            onChange={(v)=>setCloudExpanded(v==='open')}
          />
        </TS>
      </TP>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
