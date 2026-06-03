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
  const voiceTranscribe = !!scene.record?.voiceTranscribe;
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
  const firstRecordAnimDoneRef = useRef(false);
  const moodGuideQueueRef = useRef(null);
  const dropLandRevealRef = useRef(false);
  const [firstDropAnim, setFirstDropAnim] = useState(null);

  const recordFeedback = !!scene.record.recordFeedback;

  React.useEffect(()=>{
    const handler = ()=>{
      const fn = moodGuideQueueRef.current;
      moodGuideQueueRef.current = null;
      fn?.();
    };
    window.addEventListener('moodCardStreamDone', handler);
    return ()=>window.removeEventListener('moodCardStreamDone', handler);
  }, []);

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
    setFirstDropAnim(null);
    firstRecordAnimDoneRef.current = false;
    moodGuideQueueRef.current = null;
    dropLandRevealRef.current = false;
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

  const scrollTimelineToBottom = (behavior='auto')=>{
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        const el = streamRef.current;
        if(!el) return;
        const top = Math.max(0, el.scrollHeight - el.clientHeight);
        if(behavior === 'auto') el.scrollTop = top;
        else el.scrollTo({ top, behavior });
      });
    });
  };

  useEffect(()=>{
    window.scrollTimelineToBottom = scrollTimelineToBottom;
    return ()=>{ delete window.scrollTimelineToBottom; };
  });

  const scrollTimelineToEnd = (behavior='smooth')=>{
    if(voiceTranscribe) scrollTimelineToBottom(behavior === 'smooth' ? 'smooth' : 'auto');
    else scrollTimelineToLastItem(behavior);
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
    if(voiceTranscribe){
      const tm = setTimeout(()=>scrollTimelineToBottom('auto'), 80);
      return ()=>clearTimeout(tm);
    }
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
    if(voiceTranscribe){
      const t1 = setTimeout(()=>scrollTimelineToBottom('auto'), 50);
      const t2 = setTimeout(()=>scrollTimelineToBottom('auto'), 240);
      return ()=>{ clearTimeout(t1); clearTimeout(t2); };
    }
    const tm = setTimeout(()=>scrollTimelineToEnd('auto'), 120);
    return ()=>clearTimeout(tm);
  }, [t.demoScene, showRecordEmpty, showBlankEmpty, voiceTranscribe]);

  useEffect(()=>{
    if(showRecordEmpty || showBlankEmpty) return;
    if(voiceTranscribe) return;
    scrollTimelineToEnd('smooth');
  }, [timeline, showRecordEmpty, showBlankEmpty, voiceTranscribe]);

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

  const revealFirstDropEntry = React.useCallback(()=>{
    if(dropLandRevealRef.current) return;
    dropLandRevealRef.current = true;
    setTimeline(blocks=>blocks.map(b=>{
      if(b.type !== 'day') return b;
      const items = (b.items || b.entries || []).map(it=>{
        if(it.id !== firstDropAnim?.entryId) return it;
        const next = { ...it };
        delete next.hideBodyUntilDrop;
        delete next.pendingDrop;
        if(it.kind === 'mood-insight' || it.kind === 'record-group') next.isNew = true;
        return next;
      });
      return { ...b, items, entries: undefined };
    }));
    requestAnimationFrame(()=>{
      setTimeout(()=>scrollTimelineToLastItem('smooth'), 80);
    });
  }, [firstDropAnim]);

  const handleFirstDropLand = React.useCallback(()=>{
    revealFirstDropEntry();
  }, [revealFirstDropEntry]);

  const handleFirstDropComplete = React.useCallback(()=>{
    setFirstDropAnim(null);
    dropLandRevealRef.current = false;
  }, []);

  const tryStartFirstDrop = (entry, text)=>{
    if(!recordFeedback || firstRecordAnimDoneRef.current) return false;
    firstRecordAnimDoneRef.current = true;

    const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
      || window.resolveEntryDayId(text || entry.body || '', timeline);

    const pending = (entry.kind === 'mood-insight' || entry.kind === 'record-group')
      ? { ...entry, pendingDrop: true, isNew: false }
      : { ...entry, hideBodyUntilDrop: true, isNew: true };

    setFirstDropAnim({ entryId: pending.id });
    setTimeline(blocks=>window.appendTimelineEntry(blocks, pending, { dayId }));
    return true;
  };

  const submitText = (textOverride, opts={})=>{
    const text = (textOverride || draft).trim();
    if(!text) return;

    const hits = window.extractKeywords(text);
    setDraft('');
    markUserRecorded();
    const entry = buildTimelineEntry(text, hits, opts);
    if(recordFeedback && tryStartFirstDrop(entry, text)) return;
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
    if(recordFeedback && tryStartFirstDrop(entry, text)) return;
    pushToTimeline(entry, text);
  };

  const submitQuickMark = (mark)=>{
    submitText(mark.text, { quickTag: { emoji: mark.emoji, label: mark.label } });
  };

  const collectTodayQuickMoodHistory = ()=>{
    const today = timeline.find(b=>b.type==='day' && b.isToday);
    if(!today) return [];
    const items = today.items || today.entries || [];
    return items
      .filter(it=>it && it.quickMood)
      .map(it=>it.quickMood);
  };

  const appendMoodGuide = (guideText, dayId)=>{
    moodGuideQueueRef.current = ()=>{
      const guide = {
        id: 'e-mood-guide-' + Date.now(),
        kind: 'guide',
        isNew: true,
        alwaysShow: true,
        text: guideText,
      };
      setTimeline(blocks=>window.appendTimelineEntry(blocks, guide, { dayId }));
      requestAnimationFrame(()=>{
        setTimeout(()=>{
          window.scrollFeedContentIntoView?.(
            document.querySelector('.tl-rail-node.is-feed-last .tl-rail-guide-text')
          );
        }, 80);
      });
    };
  };

  const submitMoodRecord = (moods)=>{
    markUserRecorded();
    if(recordFeedback){
      const history = collectTodayQuickMoodHistory();
      const isFirst = history.length === 0;
      if(!isFirst) moodGuideQueueRef.current = null;
      const entry = isFirst
        ? window.createMoodRecordEntry(moods)
        : window.createMoodQuickEntry(moods, history);
      const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
        || window.resolveEntryDayId('', timeline);
      if(tryStartFirstDrop(entry, '')){
        if(isFirst && entry.guideText) appendMoodGuide(entry.guideText, dayId);
        return;
      }
      setTimeline(blocks=>{
        const cleaned = !isFirst ? blocks.map(b=>{
          if(b.type !== 'day') return b;
          const items = (b.items || b.entries || []).filter(it=>!(it.kind === 'guide' && it.alwaysShow));
          return { ...b, items, entries: undefined };
        }) : blocks;
        return window.appendTimelineEntry(cleaned, entry, { dayId });
      });
      if(isFirst && entry.guideText) appendMoodGuide(entry.guideText, dayId);
      return;
    }
    const entry = window.createMoodRecordEntryLegacy(moods);
    const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
      || window.resolveEntryDayId('', timeline);
    setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
  };

  const submitSymptomRecord = (symptoms)=>{
    markUserRecorded();
    const entry = window.createSymptomRecordEntry(symptoms);
    if(recordFeedback && tryStartFirstDrop(entry, entry.body || '')) return;
    const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
      || window.resolveEntryDayId('', timeline);
    setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
  };

  const submitWeightRecord = (payload)=>{
    markUserRecorded();
    const entry = window.createWeightRecordEntry(payload);
    if(recordFeedback && tryStartFirstDrop(entry, entry.body || '')) return;
    const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
      || window.resolveEntryDayId('', timeline);
    setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
  };

  const submitFoodRecord = (foods)=>{
    markUserRecorded();
    const entry = window.createFoodRecordEntry(foods);
    if(recordFeedback && tryStartFirstDrop(entry, entry.body || '')) return;
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
  const RecordEmptyScreen = window.RecordEmptyScreen;
  const RecordBlankStream = window.RecordBlankStream;
  const SearchPage = window.SearchPage;
  const VoiceTranscribeInputLayer = window.VoiceTranscribeInputLayer;

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
        className={'suiji-shell suiji-shell--scene'+(showRecordEmpty ? ' suiji-shell--empty' : '')+(showRecordBlank ? ' suiji-shell--blank' : '')+(voiceTranscribe ? ' suiji-shell--voice' : '')+(showRecordShell ? '' : ' app-view-hidden')+(dockExpanded?' is-mood-expanded':'')}
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
          onFoodConfirm={submitFoodRecord}
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
        <div className="stream-header">
          <div className="stream-header-side"/>
          <h1 className="stream-title">点滴</h1>
          <div className="stream-actions">
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
        <div className="suiji-stream" ref={streamRef}>

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
            firstDropAnim={recordFeedback ? firstDropAnim : null}
            onFirstDropLand={recordFeedback ? handleFirstDropLand : undefined}
            onFirstDropComplete={recordFeedback ? handleFirstDropComplete : undefined}
          />
        </div>

        {!voiceTranscribe && (
        <DockPublisher
          draft={draft}
          onDraft={setDraft}
          onSend={()=>submitText()}
          onQuickMark={submitQuickMark}
          onMoodConfirm={submitMoodRecord}
          onSymptomConfirm={submitSymptomRecord}
          onWeightConfirm={submitWeightRecord}
          onFoodConfirm={submitFoodRecord}
          onVoiceDone={submitVoice}
          onPhoto={()=>setShowPhoto(true)}
          onDockExpandedChange={setDockExpanded}
          activeTab={activeTab}
        />
        )}
        </>
        )}
      </div>

      {voiceTranscribe && showRecordShell && !showRecordEmpty && !showRecordBlank && VoiceTranscribeInputLayer && (
        <VoiceTranscribeInputLayer
          variant={scene.voiceVariant}
          timeline={timeline}
          setTimeline={setTimeline}
          onScrollEnd={()=>scrollTimelineToBottom('smooth')}
          onRecorded={markUserRecorded}
        />
      )}

      {showSearchPage && (
        <SearchPage timeline={timeline} onClose={closeSearchPage}/>
      )}

      {showPhoto && <PhotoSheet onCancel={()=>setShowPhoto(false)} onPick={submitPhoto}/>}

      <Toast toasts={toasts}/>
      {!showSearchPage && <TabBar active={activeTab} onChange={handleTabChange}/>}
      </div>

      {!window.__STANDALONE_LOCKED_SCENE && (
        <DemoSceneBar
          value={t.demoScene}
          onChange={(v)=>setTweak('demoScene', v)}
          description={scene.description}
        />
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
