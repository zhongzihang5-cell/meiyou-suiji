const { useState, useEffect, useRef } = React;

const DEMO_VOICE_SCRIPT = '哎，昨天月经来了，昨天肚子不太舒服';

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

function shouldShowAnalysis(hits, analysis){
  if(!analysis || !hits.length) return false;
  if(analysis.tone === 'warn') return true;
  if(hits.some(h=>h.kind==='period')) return true;
  return false;
}

function buildTimelineEntry(text, hits, opts={}){
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
  const entry = {
    id:'e-'+Date.now(),
    time: window.formatNowTime(),
    body: text,
    isNew: true,
    tags: [...contentTags, ...topicTags],
  };
  if(shouldShowAnalysis(hits, analysis)){
    entry.aiNote = {
      tone: toneMap[analysis.tone] || 'green',
      icon: analysis.points?.[0]?.icon || '💡',
      text: analysis.points?.map(p=>p.text).join(' ') || analysis.title,
    };
  }
  if(opts.voice) entry.voice = opts.voice;
  return entry;
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
  const streamRef = useRef(null);
  const timelineEndRef = useRef(null);

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
      if(!hits.length){ setLivePreview(null); return; }
      const dayId = window.resolveEntryDayId(draft, timeline);
      const dayHint = window.resolveDayHint(draft, timeline, dayId);
      setLivePreview({
        labels: hits.map(h=>window.buildSyncDisplayLabel(h, draft)),
        dayHint,
      });
    }, 300);
    return ()=>clearTimeout(tm);
  }, [draft, timeline]);

  const scrollTimelineToEnd = (behavior='smooth')=>{
    requestAnimationFrame(()=>{
      const el = streamRef.current;
      if(!el) return;
      if(behavior === 'auto'){
        el.scrollTop = el.scrollHeight;
      } else {
        el.scrollTo({ top: el.scrollHeight, behavior:'smooth' });
      }
    });
  };

  useEffect(()=>{
    const t = setTimeout(()=>scrollTimelineToEnd('auto'), 120);
    return ()=>clearTimeout(t);
  }, []);

  useEffect(()=>{
    scrollTimelineToEnd('smooth');
  }, [timeline]);

  const pushToast = (opts)=>{
    const id = Math.random().toString(36).slice(2);
    setToasts(ts=>[...ts, {id, ...opts}]);
    setTimeout(()=>{
      setToasts(ts=>ts.map(x=>x.id===id?{...x,bye:true}:x));
      setTimeout(()=>setToasts(ts=>ts.filter(x=>x.id!==id)), 220);
    }, 2400);
  };

  const stripSuggest = (prev)=> prev.filter((x,i)=>!(x.type==='suggest' && i===prev.length-1));

  const buildSyncItems = (text, hits)=>{
    const dayId = window.resolveEntryDayId(text, timeline);
    const dayHint = window.resolveDayHint(text, timeline, dayId);
    return hits.map(h=>({
      label: window.buildSyncDisplayLabel(h, text),
      dayHint,
    }));
  };

  const appendFollowUp = (hits)=>{
    const follow = window.pickFollowUp(hits, ctx);
    setTimeout(()=>{
      setTurns(prev=>[
        ...prev,
        { type:'nudge', text: follow.text, isNew:true },
        { type:'suggest', items: follow.chips },
      ]);
    }, 420);
  };

  const pushToTimeline = (entry, text)=>{
    const dayId = window.resolveEntryDayId(text || entry.body || '', timeline);
    setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
  };

  const submitText = (textOverride)=>{
    const text = (textOverride || draft).trim();
    if(!text) return;

    const hits = window.extractKeywords(text);
    const syncItemsBuilt = buildSyncItems(text, hits);

    setTurns(prev=>[
      ...stripSuggest(prev),
      { type:'user', text, isNew:true },
    ]);
    setDraft('');
    setLivePreview(null);

    if(syncItemsBuilt.length){
      setSyncItems([]);
      setTimeout(()=>setSyncItems(syncItemsBuilt), 80);
      appendFollowUp(hits);
    } else {
      setTimeout(()=>{
        setTurns(prev=>[...prev, { type:'nudge', text: ctx.followUp, isNew:true }]);
      }, 450);
    }

    pushToTimeline(buildTimelineEntry(text, hits), text);

    if(syncItemsBuilt.length){
      const tags = syncItemsBuilt.map(s=>s.label);
      pushToast({ text:'已记录', tags: tags.slice(0,2) });
    } else {
      pushToast({ text:'已保存到记录' });
    }
  };

  const submitVoice = (transcript, durSec)=>{
    setListening(false);
    const text = transcript.trim();
    const hits = window.extractKeywords(text);
    const syncItemsBuilt = buildSyncItems(text, hits);

    setTurns(prev=>[
      ...stripSuggest(prev),
      { type:'user', text, isNew:true },
    ]);
    setSyncItems([]);
    setTimeout(()=>setSyncItems(syncItemsBuilt.length ? syncItemsBuilt : [{ label:'语音', dayHint:'' }]), 100);

    if(syncItemsBuilt.length){
      appendFollowUp(hits);
    }

    pushToTimeline(buildTimelineEntry(text, hits, {
      voice: { duration: window.formatVoiceDur(durSec) },
    }), text);

    if(syncItemsBuilt.length){
      pushToast({ text:'已记录', tags: syncItemsBuilt.map(s=>s.label).slice(0,2) });
    } else {
      pushToast({ text:'语音已转写' });
    }
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
    }, '');
    pushToast({ text:'照片已加入记录' });
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
        <div className="suiji-stream" ref={streamRef}>
          <div className="stream-header">
            <div>
              <h1 className="stream-title">记录</h1>
              <p className="stream-sub">情绪 · 身体 · 体重</p>
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

          <TimelineStream blocks={timeline} endRef={timelineEndRef}/>
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
          script={DEMO_VOICE_SCRIPT}
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
