const { useState, useEffect, useRef } = React;

const TAG_EMOJI = {
  period:'🩸', pain:'😖', flow:'🩸', 'flow-low':'💧',
  sleep:'😴', mood:'💛', med:'💊',
};

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
    kind:'rec',
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
  if(opts.quickTag) entry.tags = [{ emoji: opts.quickTag.emoji, label: opts.quickTag.label }, ...entry.tags];
  return entry;
}

function App(){
  const [t, setTweak] = window.useTweaks({...window.__TWEAK_DEFAULTS});
  const ctx = window.SCENE_CONTEXT[t.scene] || window.SCENE_CONTEXT.period;

  const [draft, setDraft] = useState('');
  const [timeline, setTimeline] = useState(window.TIMELINE_BLOCKS);
  const [toasts, setToasts] = useState([]);
  const [showPhoto, setShowPhoto] = useState(false);
  const [activeTab, setActiveTab] = useState('cal');
  const [showAnalysisNotice, setShowAnalysisNotice] = useState(false);
  const [sisterPlayAnimation, setSisterPlayAnimation] = useState(0);
  const [sisterCycleDone, setSisterCycleDone] = useState(true);
  const [hideTodayGuide, setHideTodayGuide] = useState(false);
  const streamRef = useRef(null);
  const timelineEndRef = useRef(null);

  const scrollToSisterAnalysis = ()=>{
    requestAnimationFrame(()=>{
      setTimeout(()=>{
        const stream = streamRef.current;
        const el = document.getElementById('sister-analysis-anchor');
        if(stream && el){
          const top = el.getBoundingClientRect().top - stream.getBoundingClientRect().top + stream.scrollTop - 32;
          stream.scrollTo({ top: Math.max(0, top), behavior:'smooth' });
        } else if(el){
          el.scrollIntoView({ behavior:'smooth', block:'center' });
        }
      }, 180);
    });
  };

  const openSisterAnalysis = ()=>{
    setShowAnalysisNotice(false);
    setSisterCycleDone(false);
    setSisterPlayAnimation(n=>n + 1);
    setActiveTab('note');
    scrollToSisterAnalysis();
  };

  const handleSisterCycleComplete = React.useCallback(()=>{
    setSisterCycleDone(true);
    requestAnimationFrame(()=>{
      setTimeout(()=>scrollTimelineToEnd('smooth'), 120);
    });
  }, []);

  useEffect(()=>{
    if(sisterPlayAnimation > 0){
      setSisterCycleDone(false);
      setHideTodayGuide(false);
    }
  }, [sisterPlayAnimation]);

  useEffect(()=>{
    setDraft('');
    setHideTodayGuide(false);
  }, [t.scene]);

  const scrollTimelineToEnd = (behavior='smooth')=>{
    requestAnimationFrame(()=>{
      const el = streamRef.current;
      if(!el) return;
      if(behavior === 'auto') el.scrollTop = el.scrollHeight;
      else el.scrollTo({ top: el.scrollHeight, behavior:'smooth' });
    });
  };

  useEffect(()=>{
    const tm = setTimeout(()=>scrollTimelineToEnd('auto'), 120);
    return ()=>clearTimeout(tm);
  }, []);

  useEffect(()=>{ scrollTimelineToEnd('smooth'); }, [timeline]);

  const pushToast = (opts)=>{
    const id = Math.random().toString(36).slice(2);
    setToasts(ts=>[...ts, {id, ...opts}]);
    setTimeout(()=>{
      setToasts(ts=>ts.map(x=>x.id===id?{...x,bye:true}:x));
      setTimeout(()=>setToasts(ts=>ts.filter(x=>x.id!==id)), 220);
    }, 2400);
  };

  const markUserRecorded = ()=> setHideTodayGuide(true);

  const pushToTimeline = (entry, text)=>{
    const dayId = window.resolveEntryDayId(text || entry.body || '', timeline);
    setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
  };

  const submitText = (textOverride, opts={})=>{
    const text = (textOverride || draft).trim();
    if(!text) return;

    const hits = window.extractKeywords(text);
    setDraft('');
    markUserRecorded();
    pushToTimeline(buildTimelineEntry(text, hits, opts), text);
  };

  const submitVoice = (transcript, durSec)=>{
    const text = transcript.trim();
    if(!text) return;
    const hits = window.extractKeywords(text);
    markUserRecorded();
    pushToTimeline(buildTimelineEntry(text, hits, {
      voice: { duration: window.formatVoiceDur(durSec) },
    }), text);
  };

  const submitQuickMark = (mark)=>{
    submitText(mark.text, { quickTag: { emoji: mark.emoji, label: mark.label } });
  };

  const submitPhoto = ()=>{
    setShowPhoto(false);
    markUserRecorded();
    pushToTimeline({
      id:'e-'+Date.now(),
      time: window.formatNowTime(),
      body:'',
      photo:true, photoTone:'warm', photoEmoji:'🌸',
      isNew: true,
      tags:[{ emoji:'📷', label:'照片' }],
    }, '');
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

      {activeTab === 'cal' && (
        <CalendarPage
          onAnalysisReady={()=>setShowAnalysisNotice(true)}
          onPeriodReset={()=>setShowAnalysisNotice(false)}
        />
      )}

      <FloatNotice
        show={showAnalysisNotice && activeTab === 'cal'}
        onOpen={openSisterAnalysis}
        onClose={()=>setShowAnalysisNotice(false)}
      />

      <div
        className={'suiji-shell suiji-shell--scene'+(activeTab !== 'note' ? ' app-view-hidden' : '')}
        aria-hidden={activeTab !== 'note'}
      >
        <div className="suiji-stream" ref={streamRef}>
          <div className="stream-header">
            <div>
              <h1 className="stream-title">记录</h1>
              <p className="stream-sub">情绪 · 身体 · 体重</p>
            </div>
            <div className="stream-actions">
              <button
                className="stream-action"
                aria-label="日历"
                type="button"
                onClick={()=>setActiveTab('cal')}
              >
                <I name="calendar" size={20} stroke={1.7}/>
              </button>
              <button className="stream-action" aria-label="搜索" type="button">
                <I name="search" size={20} stroke={1.7}/>
              </button>
            </div>
          </div>

          {t.entry === 'analysis' && (
            <div className="stream-health">
              <HealthCard scene={sceneForHealth}/>
            </div>
          )}

          <TimelineStream
            blocks={timeline}
            endRef={timelineEndRef}
            sisterPlayAnimation={sisterPlayAnimation}
            sisterCycleDone={sisterCycleDone}
            hideTodayGuide={hideTodayGuide}
            onSisterCycleComplete={handleSisterCycleComplete}
          />
        </div>

        <DockPublisher
          draft={draft}
          onDraft={setDraft}
          onSend={()=>submitText()}
          onQuickMark={submitQuickMark}
          onVoiceDone={submitVoice}
          onPhoto={()=>setShowPhoto(true)}
        />
      </div>

      {showPhoto && <PhotoSheet onCancel={()=>setShowPhoto(false)} onPick={submitPhoto}/>}

      <Toast toasts={toasts}/>
      <TabBar active={activeTab} onChange={setActiveTab}/>

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
        </TS>
      </TP>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
