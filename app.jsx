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
<<<<<<< Updated upstream
=======
  const recordEnterModeRef = useRef('idle');
  const moodGuideQueueRef = useRef(null);

  React.useEffect(()=>{
    const handler = ()=>{
      const fn = moodGuideQueueRef.current;
      moodGuideQueueRef.current = null;
      fn?.();
    };
    window.addEventListener('moodCardStreamDone', handler);
    return ()=>window.removeEventListener('moodCardStreamDone', handler);
  }, []);

  const stripStreamedPeriodCards = (blocks)=>{
    return blocks.map(b=>{
      if(b.type !== 'day' || !b.isToday) return b;
      const items = (b.items || b.entries || []).filter(it=>(
        it && it.kind !== 'sync-card' && it.kind !== 'sister-card'
      ));
      return { ...b, items, entries: undefined };
    });
  };

  const resetSceneState = (demoSceneId)=>{
    if(sisterStreamTimerRef.current){
      clearTimeout(sisterStreamTimerRef.current);
      sisterStreamTimerRef.current = null;
    }
    const next = window.getSceneInitialState(demoSceneId);
    setDraft(next.draft);
    const timeline0 = demoSceneId === 'period-calendar'
      ? stripStreamedPeriodCards(next.timeline)
      : next.timeline;
    setTimeline(timeline0);
    setShowAnalysisNotice(next.showAnalysisNotice);
    setSisterPlayAnimation(next.sisterPlayAnimation);
    setSisterCycleDone(next.sisterCycleDone);
    setHideTodayGuide(next.hideTodayGuide);
    setActiveTab(next.activeTab);
    setShowPhoto(false);
    setShowSearchPage(false);
    setFirstDropAnim(null);
  };

  useEffect(()=>{
    resetSceneState(t.demoScene);
  }, [t.demoScene]);
>>>>>>> Stashed changes

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

  const sisterStreamTimerRef = useRef(null);

  const streamTodayPeriodCards = ()=>{
    if(sisterStreamTimerRef.current){
      clearTimeout(sisterStreamTimerRef.current);
      sisterStreamTimerRef.current = null;
    }
    const nowTime = window.formatNowTime();

    setTimeline(blocks=>{
      const idx = blocks.findIndex(b=>b.type==='day' && b.isToday);
      if(idx < 0) return blocks;
      const today = blocks[idx];
      const items = today.items || today.entries || [];
      const alreadyHasSync = items.some(it=>it && it.kind === 'sync-card');
      if(alreadyHasSync) return blocks;

      const syncCard = {
        kind:'sync-card', id:'e-stream-sync-'+Date.now(),
        time: nowTime,
        cardLabel:'自动同步',
        cardLabelKind:'sync',
        body:'今天月经来了。',
        tagLayout:'v3',
        tags:[{ cat:'月经', val:'', icon:'period' }],
        isNew: true,
        streamBody: true,
      };
      const newItems = [syncCard, ...items];
      const next = [...blocks];
      next[idx] = { ...today, items: newItems, entries: undefined };
      return next;
    });

    sisterStreamTimerRef.current = setTimeout(()=>{
      setTimeline(blocks=>{
        const idx = blocks.findIndex(b=>b.type==='day' && b.isToday);
        if(idx < 0) return blocks;
        const today = blocks[idx];
        const items = today.items || today.entries || [];
        const alreadyHasSister = items.some(it=>it && it.kind === 'sister-card');
        if(alreadyHasSister) return blocks;
        const syncIdx = items.findIndex(it=>it && it.kind === 'sync-card');
        if(syncIdx < 0) return blocks;
        const sisterCard = {
          kind:'sister-card', id:'e-stream-sister-'+Date.now(),
          time: nowTime, railDot:'ai',
          isNew: true,
        };
        const newItems = [...items];
        newItems.splice(syncIdx + 1, 0, sisterCard);
        const next = [...blocks];
        next[idx] = { ...today, items: newItems, entries: undefined };
        return next;
      });
      setSisterCycleDone(false);
      setSisterPlayAnimation(n=>n + 1);
    }, 1200);
  };

  useEffect(()=>()=>{
    if(sisterStreamTimerRef.current) clearTimeout(sisterStreamTimerRef.current);
  }, []);

  const openSisterAnalysis = ()=>{
    setShowAnalysisNotice(false);
    setActiveTab('note');
    streamTodayPeriodCards();
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

<<<<<<< Updated upstream
=======
  const collectTodayQuickMoodHistory = ()=>{
    const today = timeline.find(b=>b.type==='day' && b.isToday);
    if(!today) return [];
    const items = today.items || today.entries || [];
    return items
      .filter(it=>it && it.quickMood)
      .map(it=>it.quickMood);
  };

  const submitMoodRecord = (moods)=>{
    markUserRecorded();
    const history = collectTodayQuickMoodHistory();
    const isFirst = history.length === 0;
    if(!isFirst) moodGuideQueueRef.current = null; // 取消待追加的 guide
    const entry = isFirst
      ? window.createMoodRecordEntry(moods)
      : window.createMoodQuickEntry(moods, history);
    if(tryStartFirstDrop(entry, entry.body || '')) return;
    const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
      || window.resolveEntryDayId('', timeline);
    setTimeline(blocks=>{
      // 第二次及以后，先移除追加的 mood guide 卡
      const cleaned = !isFirst ? blocks.map(b=>{
        if(b.type !== 'day') return b;
        const items = (b.items || b.entries || []).filter(it=>!(it.kind === 'guide' && it.alwaysShow));
        return { ...b, items, entries: undefined };
      }) : blocks;
      return window.appendTimelineEntry(cleaned, entry, { dayId });
    });
    if(isFirst && entry.guideText){
      const capturedDayId = dayId;
      const guideText = entry.guideText;
      moodGuideQueueRef.current = ()=>{
        const guide = {
          id: 'e-mood-guide-' + Date.now(),
          kind: 'guide',
          isNew: true,
          alwaysShow: true,
          guideDelay: 200,
          text: guideText,
        };
        setTimeline(blocks=>window.appendTimelineEntry(blocks, guide, { dayId: capturedDayId }));
      };
    }
  };

  const submitSymptomRecord = (symptoms)=>{
    markUserRecorded();
    const entry = window.createSymptomRecordEntry(symptoms);
    if(tryStartFirstDrop(entry, entry.body || '')) return;
    const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
      || window.resolveEntryDayId('', timeline);
    setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
  };

  const submitWeightRecord = (payload)=>{
    markUserRecorded();
    const entry = window.createWeightRecordEntry(payload);
    if(tryStartFirstDrop(entry, entry.body || '')) return;
    const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
      || window.resolveEntryDayId('', timeline);
    setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
  };

  const submitFoodRecord = (foods)=>{
    markUserRecorded();
    const entry = window.createFoodRecordEntry(foods);
    if(tryStartFirstDrop(entry, entry.body || '')) return;
    const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
      || window.resolveEntryDayId('', timeline);
    setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
  };

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        <div className="suiji-stream" ref={streamRef}>
          <div className="stream-header">
            <div>
              <h1 className="stream-title">记录</h1>
              <p className="stream-sub">情绪 · 身体 · 体重</p>
=======
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
          firstDropAnim={firstDropAnim}
          onFirstDropLand={handleFirstDropLand}
          onFirstDropComplete={handleFirstDropComplete}
        />
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
          showFirstDropBubble={showFirstDropBubble}
        />
        </>
        ) : (
        <>
        <div className="suiji-stream" ref={streamRef}>
          <div className="stream-header">
            <div>
              <h1 className="stream-title">点滴</h1>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
          onMoodConfirm={submitMoodRecord}
          onSymptomConfirm={submitSymptomRecord}
          onWeightConfirm={submitWeightRecord}
          onFoodConfirm={submitFoodRecord}
>>>>>>> Stashed changes
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
