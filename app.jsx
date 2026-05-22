const { useState, useEffect, useRef } = React;

function shouldShowAnalysis(hits, analysis){
  if(!analysis || !hits.length) return false;
  if(analysis.tone === 'warn') return true;
  if(hits.some(h=>h.kind==='period')) return true;
  return false;
}

function buildTimelineEntry(text, hits, opts={}){
  const analysis = hits.length ? window.chooseAnalysis(hits) : null;
  const toneMap = { warn:'yellow', brand:'brand', good:'green' };
  const tags = window.buildT5TagsFromText(text, hits);
  const entry = {
    id:'e-'+Date.now(),
    kind: opts.voice ? 'voice-card' : 'rec',
    time: window.formatNowTime(),
    isNew: true,
    tags,
    tagLayout: 't5',
  };
  if(opts.voice){
    entry.voice = opts.voice;
    entry.voiceText = text;
  } else {
    entry.body = text;
  }
  if(shouldShowAnalysis(hits, analysis)){
    entry.aiNote = {
      tone: toneMap[analysis.tone] || 'green',
      icon: analysis.points?.[0]?.icon || '💡',
      text: analysis.points?.map(p=>p.text).join(' ') || analysis.title,
    };
  }
  if(opts.quickTag){
    entry.tags = [{ label: opts.quickTag.label, cat:'symptom', emoji: opts.quickTag.emoji }, ...entry.tags];
  }
  return entry;
}

function App(){
  const [t, setTweak] = window.useTweaks({...window.__TWEAK_DEFAULTS});
  const scene = window.getDemoScene(t.demoScene);
  const ctx = window.SCENE_CONTEXT[scene.identity] || window.SCENE_CONTEXT.period;

  const initial = window.getSceneInitialState(t.demoScene);
  const [draft, setDraft] = useState(initial.draft);
  const [timeline, setTimeline] = useState(initial.timeline);
  const [toasts, setToasts] = useState([]);
  const [showPhoto, setShowPhoto] = useState(false);
  const [activeTab, setActiveTab] = useState(initial.activeTab);
  const [showAnalysisNotice, setShowAnalysisNotice] = useState(initial.showAnalysisNotice);
  const [sisterPlayAnimation, setSisterPlayAnimation] = useState(initial.sisterPlayAnimation);
  const [sisterCycleDone, setSisterCycleDone] = useState(initial.sisterCycleDone);
  const [hideTodayGuide, setHideTodayGuide] = useState(initial.hideTodayGuide);
  const [dockExpanded, setDockExpanded] = useState(false);
  const [showSearchPage, setShowSearchPage] = useState(false);
  const scheme3FirstVisitRef = useRef(null);
  const streamRef = useRef(null);
  const timelineEndRef = useRef(null);
  const recordEnterModeRef = useRef('idle');

  const resetSceneState = (demoSceneId)=>{
    const next = window.getSceneInitialState(demoSceneId);
    setDraft(next.draft);
    setTimeline(next.timeline);
    setShowAnalysisNotice(next.showAnalysisNotice);
    setSisterPlayAnimation(next.sisterPlayAnimation);
    setSisterCycleDone(next.sisterCycleDone);
    setHideTodayGuide(next.hideTodayGuide);
    setActiveTab(next.activeTab);
    setShowPhoto(false);
    setShowSearchPage(false);
    scheme3FirstVisitRef.current = null;
  };

  useEffect(()=>{
    resetSceneState(t.demoScene);
  }, [t.demoScene]);

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
    if(scene.record.sisterAnalysis.trigger !== 'float-notice') return;
    recordEnterModeRef.current = 'analysis';
    setShowAnalysisNotice(false);
    setSisterCycleDone(false);
    setSisterPlayAnimation(n=>n + 1);
    setActiveTab('note');
    scrollToSisterAnalysis();
  };

  const handleSisterCycleComplete = React.useCallback(()=>{
    setSisterCycleDone(true);
    requestAnimationFrame(()=>{
      setTimeout(()=>scrollTimelineToLastItem('smooth'), 120);
    });
  }, []);

  useEffect(()=>{
    if(sisterPlayAnimation > 0){
      setSisterCycleDone(false);
      setHideTodayGuide(false);
    }
  }, [sisterPlayAnimation]);

  const scrollTimelineToLastItem = (behavior='smooth')=>{
    requestAnimationFrame(()=>{
      setTimeout(()=>{
        const el = streamRef.current;
        if(!el) return;
        const anchor = el.querySelector('.tl-rail-node.is-feed-last') || timelineEndRef.current;
        if(anchor){
          const top = anchor.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop - 28;
          if(behavior === 'auto') el.scrollTop = Math.max(0, top);
          else el.scrollTo({ top: Math.max(0, top), behavior });
          return;
        }
        if(behavior === 'auto') el.scrollTop = el.scrollHeight;
        else el.scrollTo({ top: el.scrollHeight, behavior });
      }, 80);
    });
  };

  const scrollTimelineToEnd = (behavior='smooth')=>{
    scrollTimelineToLastItem(behavior);
  };

  const handleTabChange = (tab)=>{
    if(tab === 'note' && activeTab !== 'note'){
      recordEnterModeRef.current = 'manual';
    }
    if(tab !== 'note'){
      recordEnterModeRef.current = 'idle';
    }
    setActiveTab(tab);
  };

  const showRecordEmpty = !!(scene.record.emptyState && window.isTimelineEmpty(timeline));
  const showRecordBlank = !!scene.record.blankState;
  const showBlankEmpty = showRecordBlank && window.isTimelineEmpty(timeline);

  useEffect(()=>{
    if(activeTab !== 'note') return;
    if(showRecordEmpty || showBlankEmpty) return;
    if(recordEnterModeRef.current === 'analysis'){
      recordEnterModeRef.current = 'idle';
      return;
    }
    const tm = setTimeout(()=>scrollTimelineToLastItem('smooth'), 220);
    recordEnterModeRef.current = 'idle';
    return ()=>clearTimeout(tm);
  }, [activeTab, showRecordEmpty, showBlankEmpty]);

  useEffect(()=>{
    if(showRecordEmpty || showBlankEmpty) return;
    const tm = setTimeout(()=>scrollTimelineToEnd('auto'), 120);
    return ()=>clearTimeout(tm);
  }, [t.demoScene, showRecordEmpty, showBlankEmpty]);

  useEffect(()=>{
    if(showRecordEmpty || showBlankEmpty) return;
    scrollTimelineToEnd('smooth');
  }, [timeline, showRecordEmpty, showBlankEmpty]);

  const pushToast = (opts)=>{
    const id = Math.random().toString(36).slice(2);
    setToasts(ts=>[...ts, {id, ...opts}]);
    setTimeout(()=>{
      setToasts(ts=>ts.map(x=>x.id===id?{...x,bye:true}:x));
      setTimeout(()=>setToasts(ts=>ts.filter(x=>x.id!==id)), 220);
    }, 2400);
  };

  const markUserRecorded = ()=>{
    if(scene.record.todayGuide) setHideTodayGuide(true);
  };

  const isScheme3 = scene.record.blankScheme === 3;
  const isScheme1 = scene.record.blankScheme === 1;
  const showScheme1Hints = isScheme1 && showBlankEmpty;
  if(isScheme3 && scheme3FirstVisitRef.current === null){
    scheme3FirstVisitRef.current = !!window.shouldShowScheme3Bubble?.();
  }

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
    const entry = buildTimelineEntry(text, hits, opts);
    pushToTimeline(entry, text);
  };

  const submitVoice = (transcript, durSec)=>{
    markUserRecorded();
    if(scene.id === 'record-direct' && window.buildScene2VoiceEntry){
      const entry = window.buildScene2VoiceEntry(durSec);
      pushToTimeline(entry, entry.voiceText);
      return;
    }
    const text = transcript.trim();
    if(!text) return;
    const hits = window.extractKeywords(text);
    const entry = buildTimelineEntry(text, hits, {
      voice: { duration: window.formatVoiceDur(durSec) },
    });
    pushToTimeline(entry, text);
  };

  const submitQuickMark = (mark)=>{
    submitText(mark.text, { quickTag: { emoji: mark.emoji, label: mark.label } });
  };

  const submitMoodRecord = (moods)=>{
    markUserRecorded();
    const entry = window.createMoodRecordEntry(moods);
    const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
      || window.resolveEntryDayId('', timeline);
    setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
  };

  const submitSymptomRecord = (symptoms)=>{
    markUserRecorded();
    const entry = window.createSymptomRecordEntry(symptoms);
    const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
      || window.resolveEntryDayId('', timeline);
    setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
  };

  const submitWeightRecord = (payload)=>{
    markUserRecorded();
    const entry = window.createWeightRecordEntry(payload);
    const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
      || window.resolveEntryDayId('', timeline);
    setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
  };

  const submitPhoto = ()=>{
    setShowPhoto(false);
    markUserRecorded();
    const entry = {
      id:'e-'+Date.now(),
      time: window.formatNowTime(),
      body:'',
      photo:true, photoTone:'warm', photoEmoji:'🌸',
      isNew: true,
      tags:[{ emoji:'📷', label:'照片' }],
    };
    pushToTimeline(entry, '');
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

  const showCalendar = scene.calendar.enabled && activeTab === 'cal';
  const showFloatNotice = scene.floatNotice.enabled && showAnalysisNotice && activeTab === 'cal';
  const showRecordShell = activeTab === 'note';
  const showTodayGuide = scene.record.todayGuide && !hideTodayGuide;

  const I = window.Icon;
  const DemoSceneBar = window.DemoSceneBar;
  const DemoScheme3Bar = window.DemoScheme3Bar;
  const RecordEmptyScreen = window.RecordEmptyScreen;
  const RecordBlankStream = window.RecordBlankStream;
  const SearchPage = window.SearchPage;

  const openSearchPage = ()=>setShowSearchPage(true);
  const closeSearchPage = ()=>setShowSearchPage(false);
  const showScheme3Bubble = isScheme3 && showBlankEmpty
    && window.shouldShowScheme3Bubble?.();
  const highlightScheme3Input = isScheme3 && showBlankEmpty
    && scheme3FirstVisitRef.current;

  return (
    <>
      <div className="phone">
        <StatusBar/>

      {showCalendar && (
        <CalendarPage
          key={scene.id}
          periodFlowEnabled={scene.calendar.periodFlow}
          onAnalysisReady={()=>setShowAnalysisNotice(true)}
          onPeriodReset={()=>setShowAnalysisNotice(false)}
        />
      )}

      {scene.floatNotice.enabled && (
        <FloatNotice
          show={showFloatNotice}
          onOpen={openSisterAnalysis}
          onClose={()=>setShowAnalysisNotice(false)}
        />
      )}

      <div
        className={'suiji-shell suiji-shell--scene'+(showRecordEmpty ? ' suiji-shell--empty' : '')+(showRecordBlank ? ' suiji-shell--blank' : '')+(showRecordShell ? '' : ' app-view-hidden')+(dockExpanded?' is-mood-expanded':'')}
        aria-hidden={!showRecordShell}
      >
        {showRecordEmpty ? (
          <RecordEmptyScreen onVoiceDone={submitVoice}/>
        ) : showRecordBlank ? (
        <>
        <RecordBlankStream
          streamRef={streamRef}
          timelineEndRef={timelineEndRef}
          timeline={timeline}
          scene={scene}
          onOpenCalendar={()=>setActiveTab('cal')}
          onOpenSearch={openSearchPage}
          sisterPlayAnimation={sisterPlayAnimation}
          sisterCycleDone={sisterCycleDone}
          hideTodayGuide={!showTodayGuide}
          onSisterCycleComplete={handleSisterCycleComplete}
        />
        {showScheme1Hints ? (
          <div className="rb-s1-curly-arrow" aria-hidden="true">
            <img src="assets/curly-arrow-pink.png" alt=""/>
          </div>
        ) : null}
        <DockPublisher
          draft={draft}
          onDraft={setDraft}
          onSend={()=>submitText()}
          onQuickMark={submitQuickMark}
          onMoodConfirm={submitMoodRecord}
          onSymptomConfirm={submitSymptomRecord}
          onWeightConfirm={submitWeightRecord}
          onVoiceDone={submitVoice}
          onPhoto={()=>setShowPhoto(true)}
          onDockExpandedChange={setDockExpanded}
          activeTab={activeTab}
          defaultInputMode={showScheme1Hints ? 'voice' : 'text'}
          showScheme3Bubble={showScheme3Bubble}
          highlightScheme3Input={highlightScheme3Input}
        />
        </>
        ) : (
        <>
        <div className="suiji-stream" ref={streamRef}>
          <div className="stream-header">
            <div>
              <h1 className="stream-title">点滴</h1>
            </div>
            <div className="stream-actions">
              {scene.calendar.enabled && (
                <button
                  className="stream-action"
                  aria-label="日历"
                  type="button"
                  onClick={()=>setActiveTab('cal')}
                >
                  <I name="calendar" size={20} stroke={1.7}/>
                </button>
              )}
              <button
                className="stream-action"
                aria-label="搜索"
                type="button"
                onClick={openSearchPage}
              >
                <I name="search" size={20} stroke={1.7}/>
              </button>
            </div>
          </div>

          {scene.record.showHealthCard && (
            <div className="stream-health">
              <HealthCard scene={sceneForHealth}/>
            </div>
          )}

          <TimelineStream
            blocks={timeline}
            endRef={timelineEndRef}
            sisterPlayAnimation={sisterPlayAnimation}
            sisterCycleDone={sisterCycleDone}
            hideTodayGuide={!showTodayGuide}
            onSisterCycleComplete={handleSisterCycleComplete}
          />
        </div>

        <DockPublisher
          draft={draft}
          onDraft={setDraft}
          onSend={()=>submitText()}
          onQuickMark={submitQuickMark}
          onMoodConfirm={submitMoodRecord}
          onSymptomConfirm={submitSymptomRecord}
          onWeightConfirm={submitWeightRecord}
          onVoiceDone={submitVoice}
          onPhoto={()=>setShowPhoto(true)}
          onDockExpandedChange={setDockExpanded}
          activeTab={activeTab}
        />
        </>
        )}
      </div>

      {showSearchPage && (
        <SearchPage timeline={timeline} onClose={closeSearchPage}/>
      )}

      {showPhoto && <PhotoSheet onCancel={()=>setShowPhoto(false)} onPick={submitPhoto}/>}

      <Toast toasts={toasts}/>
      {!showSearchPage && <TabBar active={activeTab} onChange={handleTabChange}/>}
      </div>

      {window.__SCENE3_SCHEME_HUB ? (
        <DemoScheme3Bar
          value={t.demoScene}
          onChange={(v)=>setTweak('demoScene', v)}
          description={scene.description}
        />
      ) : !window.__STANDALONE_LOCKED_SCENE ? (
        <DemoSceneBar
          value={t.demoScene}
          onChange={(v)=>setTweak('demoScene', v)}
          description={scene.description}
        />
      ) : null}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
