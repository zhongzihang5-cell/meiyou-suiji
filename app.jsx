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
  const [analysisNoticeTitle, setAnalysisNoticeTitle] = useState('结合近期记录，已为你生成周期状态分析');
  const [analysisNoticeKind, setAnalysisNoticeKind] = useState('period-start');
  const [sisterPlayAnimation, setSisterPlayAnimation] = useState(initial.sisterPlayAnimation);
  const [sisterCycleDone, setSisterCycleDone] = useState(initial.sisterCycleDone);
  const [hideTodayGuide, setHideTodayGuide] = useState(initial.hideTodayGuide);
  const [periodEndRecordReady, setPeriodEndRecordReady] = useState(false);
  const [periodEndRecordCompleted, setPeriodEndRecordCompleted] = useState(false);
  const [periodDetailRecordEnabled, setPeriodDetailRecordEnabled] = useState(false);
  const [periodDetailDraft, setPeriodDetailDraft] = useState({});
  const [healthRecordDrafts, setHealthRecordDrafts] = useState([]);
  const [dockExpanded, setDockExpanded] = useState(false);
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const scheme3FirstVisitRef = useRef(null);
  const searchCloseScrollRef = useRef(null);
  const streamRef = useRef(null);
  const timelineEndRef = useRef(null);
  const recordEnterModeRef = useRef('idle');
  const periodRecordRef = useRef(null);
  const firstRecordAnimDoneRef = useRef(false);
  const moodGuideQueueRef = useRef(null);
  const dropLandRevealRef = useRef(false);
  const [firstDropAnim, setFirstDropAnim] = useState(null);

  const recordFeedback = !!scene.record.recordFeedback;

  // ====== 演示流程状态 ======
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoPhase, setDemoPhase] = useState(null); // null | 'listening' | 'recognizing'
  const demoIdsRef = useRef([]); // 追踪演示卡片 id

  // 暴露重置函数给全局 resetDemo 按钮
  React.useEffect(()=>{
    window.__resetDemo = ()=>{
      if(!demoIdsRef.current.length) return;
      setTimeline(blocks=>blocks.map(b=>{
        if(b.type!=='day') return b;
        const items = (b.items||[]).filter(it=>!demoIdsRef.current.includes(it.id));
        return {...b, items, entries:undefined};
      }));
      demoIdsRef.current = [];
      setIsDemoRunning(false);
      setDemoPhase(null);
    };
  }, []);

  React.useEffect(()=>{
    const handler = ()=>{
      const fn = moodGuideQueueRef.current;
      moodGuideQueueRef.current = null;
      fn?.();
    };
    window.addEventListener('moodCardStreamDone', handler);
    return ()=>window.removeEventListener('moodCardStreamDone', handler);
  }, []);

  React.useEffect(()=>{
    const onInsert = (event)=>{
      const kind = event?.detail?.kind;
      const entry = kind === 'not-food'
        ? window.createDietNotFoodDemoEntry?.()
        : window.createDietTimeoutDemoEntry?.();
      if(!entry) return;
      const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
        || window.resolveEntryDayId?.('', timeline);
      if(!dayId) return;
      setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
      requestAnimationFrame(()=>{
        if(typeof window.scrollTimelineToBottom === 'function'){
          window.scrollTimelineToBottom('smooth');
        }
      });
    };
    window.addEventListener('dietRecognitionDemoInsert', onInsert);
    return ()=>window.removeEventListener('dietRecognitionDemoInsert', onInsert);
  }, [timeline]);

  React.useEffect(()=>{
    const onDisplayInsert = (event)=>{
      const entry = window.createDietFeedbackDisplayDemoEntry?.(event?.detail?.scenario);
      if(!entry) return;
      const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
        || window.resolveEntryDayId?.('', timeline);
      if(!dayId) return;
      setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
      requestAnimationFrame(()=>{
        if(typeof window.scrollTimelineToBottom === 'function'){
          window.scrollTimelineToBottom('smooth');
        }
      });
    };
    window.addEventListener('dietFeedbackDisplayDemoInsert', onDisplayInsert);
    return ()=>window.removeEventListener('dietFeedbackDisplayDemoInsert', onDisplayInsert);
  }, [timeline]);

  React.useEffect(()=>{
    const onComboInsert = (event)=>{
      const entry = window.createDietFeedbackComboDemoEntry?.(event?.detail?.scenario || 'combo-ab');
      if(!entry) return;
      const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
        || window.resolveEntryDayId?.('', timeline);
      if(!dayId) return;
      setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
      requestAnimationFrame(()=>{
        if(typeof window.scrollTimelineToBottom === 'function'){
          window.scrollTimelineToBottom('smooth');
        }
      });
    };
    window.addEventListener('dietFeedbackComboDemoInsert', onComboInsert);
    return ()=>window.removeEventListener('dietFeedbackComboDemoInsert', onComboInsert);
  }, [timeline]);

  const resetSceneState = (demoSceneId)=>{
    const next = window.getSceneInitialState(demoSceneId);
    setDraft(next.draft);
    setTimeline(next.timeline);
    setShowAnalysisNotice(next.showAnalysisNotice);
    setAnalysisNoticeTitle('结合近期记录，已为你生成周期状态分析');
    setAnalysisNoticeKind('period-start');
    setSisterPlayAnimation(next.sisterPlayAnimation);
    setSisterCycleDone(next.sisterCycleDone);
    setHideTodayGuide(next.hideTodayGuide);
    setPeriodEndRecordReady(false);
    setPeriodEndRecordCompleted(false);
    setHealthRecordDrafts([]);
    setActiveTab(next.activeTab);
    setShowPhoto(false);
    setShowSearchPage(false);
    setSearchCriteria(null);
    periodRecordRef.current = null;
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
    const tryScroll = (attempt)=>{
      const stream = streamRef.current;
      const el = document.getElementById('sister-analysis-anchor');
      if(stream && el){
        const top = el.getBoundingClientRect().top - stream.getBoundingClientRect().top + stream.scrollTop - 32;
        stream.scrollTo({ top: Math.max(0, top), behavior:'smooth' });
      } else if(el){
        el.scrollIntoView({ behavior:'smooth', block:'center' });
      } else if(attempt < 3){
        setTimeout(()=>tryScroll(attempt + 1), 300);
      }
    };
    requestAnimationFrame(()=>setTimeout(()=>tryScroll(0), 350));
  };

  const openSisterAnalysis = ()=>{
    if(scene.record.sisterAnalysis.trigger !== 'float-notice') return;
    recordEnterModeRef.current = 'analysis';
    setShowAnalysisNotice(false);
    const isPeriodEndAnalysis = analysisNoticeKind === 'period-end';
    if(!isPeriodEndAnalysis) setPeriodEndRecordReady(true);
    else setPeriodEndRecordCompleted(true);

    const periodRecord = periodRecordRef.current || {};
    const periodDetails = isPeriodEndAnalysis ? [] : [
      periodRecord.flow ? { label:'流量', value: periodRecord.flow, icon:'flow' } : null,
      periodRecord.color ? { label:'颜色', value: periodRecord.color, icon:'color' } : null,
      periodRecord.cramps ? { label:'痛经', value: periodRecord.cramps, icon:'cramps' } : null,
    ].filter(Boolean);
    const syncEntry = {
      kind:'sync-card', id:'e-period-'+Date.now(), time: window.formatNowTime(),
      cardLabel:'自动同步', cardLabelKind:'sync',
      body: isPeriodEndAnalysis ? '今天月经走喽。' : '今天月经来了。',
      tagLayout:'v3', isNew: true,
      tags:[{ label: isPeriodEndAnalysis ? '月经走喽' : '月经来了', cat:'period', val:'', icon:'period' }],
      periodDetails,
      periodSummaryLabel: isPeriodEndAnalysis ? '月经走喽' : '月经来了',
      analysisKind: isPeriodEndAnalysis ? 'period-end' : 'period-start',
    };
    const sisterEntry = {
      kind:'sister-card', id:'e-sister-'+Date.now(), time: window.formatNowTime(), railDot:'ai',
      analysisKind: isPeriodEndAnalysis ? 'period-end' : 'period-start',
    };
    const todayId = timeline.find(b=>b.type==='day' && b.isToday)?.id;
    setTimeline(blocks => {
      let result = window.appendTimelineEntry(blocks, syncEntry, { dayId: todayId });
      result = window.appendTimelineEntry(result, sisterEntry, { dayId: todayId });
      return result;
    });

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

  const buildPeriodDetailEntry = (details)=>{
    const detailItems = [
      details.flow ? { label:'流量', value: details.flow, icon:'flow' } : null,
      details.color ? { label:'颜色', value: details.color, icon:'color' } : null,
      details.cramps ? { label:'痛经', value: details.cramps, icon:'cramps' } : null,
    ].filter(Boolean);
    if(!detailItems.length) return null;
    return {
      kind:'record-group',
      id:'e-period-detail-'+Date.now(),
      isNew:true,
      primary:{
        id:'e-period-detail-primary-'+Date.now(),
        time: window.formatNowTime(),
        kind:'period-detail',
        text:'',
        periodDetailItems: detailItems,
        tags: detailItems.map((it)=>({ label:it.label, cat:'period', val:it.value, icon:it.icon })),
      },
    };
  };

  const buildHealthRecordEntry = (record)=>{
    if(!record?.type || !record?.label || !record?.value) return null;
    const now = Date.now();
    const iconMap = {
      love: 'love',
      discharge: 'discharge',
      temp: 'temp',
      stool: 'stool',
      habit: 'habit',
    };
    const valueText = record.detail || record.value;
    return {
      kind:'record-group',
      id:'e-health-'+record.type+'-'+now,
      isNew:true,
      primary:{
        id:'e-health-primary-'+record.type+'-'+now,
        time: window.formatNowTime(),
        kind:'daily-record',
        recordType: record.type,
        recordLabel: record.label,
        recordValue: record.value,
        recordDetail: valueText,
        icon: iconMap[record.type] || 'quick',
        iconText: record.iconText || '',
        text: `${record.label}：${valueText}`,
        tags:[{ label:record.label, cat:record.label, val:record.value, icon:iconMap[record.type] || 'quick' }],
      },
    };
  };

  const submitHealthRecordDraftsToTimeline = ()=>{
    if(!healthRecordDrafts.length) return false;
    const entries = healthRecordDrafts.map(buildHealthRecordEntry).filter(Boolean);
    if(!entries.length) return false;
    const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
      || window.resolveEntryDayId('', timeline);
    setTimeline(blocks=>entries.reduce(
      (nextBlocks, entry)=>window.appendTimelineEntry(nextBlocks, entry, { dayId }),
      blocks
    ));
    setHealthRecordDrafts([]);
    requestAnimationFrame(()=>setTimeout(()=>scrollTimelineToLastItem('smooth'), 160));
    return true;
  };

  const submitPeriodDetailDraftToTimeline = ()=>{
    const entry = buildPeriodDetailEntry(periodDetailDraft);
    if(!entry) return false;
    const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
      || window.resolveEntryDayId('', timeline);
    setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
    setPeriodDetailDraft({});
    requestAnimationFrame(()=>setTimeout(()=>scrollTimelineToLastItem('smooth'), 160));
    return true;
  };

  React.useEffect(()=>{
    const removeTimelineEntry = (entryId)=>{
      if(!entryId) return;
      setTimeline(blocks=>blocks.map(block=>{
        if(block.type !== 'day') return block;
        const items = (block.items || block.entries || []).filter(item=>{
          const primaryId = item?.primary?.id;
          return item?.id !== entryId && primaryId !== entryId;
        });
        return { ...block, items, entries: undefined };
      }));
      window.__showEditToast && window.__showEditToast('记录已删除');
    };
    window.deleteTimelineEntry = removeTimelineEntry;
    const onEditDelete = (event)=>{
      removeTimelineEntry(event?.detail?.entryId);
    };
    const onEditSave = (event)=>{
      const entryId = event?.detail?.entryId;
      const payload = event?.detail?.payload;
      if(!entryId || !payload?.kind) return;
      if(payload.kind === 'daily-record'){
        const iconMap = {
          love: 'love',
          discharge: 'discharge',
          temp: 'temp',
          stool: 'stool',
          habit: 'habit',
        };
        setTimeline(blocks=>blocks.map(block=>{
          if(block.type !== 'day') return block;
          const nextItems = (block.items || block.entries || []).map(item=>{
            const primaryId = item?.primary?.id;
            if(item?.id !== entryId && primaryId !== entryId) return item;
            const type = payload.recordType || item.primary?.recordType;
            const label = payload.recordLabel || item.primary?.recordLabel || '记录';
            const value = payload.recordValue || item.primary?.recordValue || '';
            const detail = payload.recordDetail || value;
            const icon = payload.icon || iconMap[type] || item.primary?.icon || 'quick';
            return {
              ...item,
              primary:{
                ...item.primary,
                time: payload.time || item.primary?.time,
                kind:'daily-record',
                recordType:type,
                recordLabel:label,
                recordValue:value,
                recordDetail:detail,
                icon,
                iconText: payload.iconText || item.primary?.iconText || '',
                text:`${label}：${detail}`,
                tags:[{ label, cat:label, val:value, icon }],
              },
            };
          });
          return { ...block, items: nextItems, entries: undefined };
        }));
        return;
      }
      if(payload.kind === 'quick'){
        const detailItems = (payload.detailItems || payload.periodDetails || []).filter(it=>it?.label && it?.value);
        const recordLabel = payload.recordLabel || '快捷记录';
        const recordIcon = payload.icon || (recordLabel.indexOf('走') >= 0 ? 'period-end' : 'period');
        const isSymptomQuick = recordIcon === 'symptom' || recordLabel === '症状';
        setTimeline(blocks=>blocks.map(block=>{
          if(block.type !== 'day') return block;
          const nextItems = (block.items || block.entries || []).map(item=>{
            const primaryId = item?.primary?.id;
            if(item?.id !== entryId && primaryId !== entryId) return item;
            if(item?.primary){
              if(isSymptomQuick){
                const symptomValue = payload.recordValue || detailItems.map(it=>it.value).filter(Boolean).join('、');
                return {
                  ...item,
                  primary:{
                    ...item.primary,
                    time: payload.time || item.primary?.time,
                    kind:'symptom',
                    text:'',
                    symptomLabel: recordLabel,
                    symptomValue,
                    tags:[],
                  },
                };
              }
              return {
                ...item,
                primary:{
                  ...item.primary,
                  time: payload.time || item.primary?.time,
                  periodLabel: recordLabel,
                  text: recordLabel,
                  tags:[{ label: recordLabel, cat:'period', val:'', icon: recordIcon }],
                },
              };
            }
            if(isSymptomQuick){
              const symptomValue = payload.recordValue || detailItems.map(it=>it.value).filter(Boolean).join('、');
              return {
                ...item,
                time: payload.time || item.time,
                kind:'symptom',
                body:'',
                symptomLabel: recordLabel,
                symptomValue,
                tags:[],
              };
            }
            return {
              ...item,
              time: payload.time || item.time,
              body: recordLabel,
              tags:[{ label: recordLabel, cat:'period', val:'', icon: recordIcon }],
              periodDetails: detailItems,
              periodSummaryLabel: recordLabel,
            };
          });
          return { ...block, items: nextItems, entries: undefined };
        }));
        return;
      }
      if(payload.kind !== 'period-detail') return;
      const detailItems = (payload.periodDetailItems || []).filter(it=>it?.label && it?.value);
      setTimeline(blocks=>blocks.map(block=>{
        if(block.type !== 'day') return block;
        const nextItems = (block.items || []).map(item=>{
          const primaryId = item?.primary?.id;
          if(item?.id !== entryId && primaryId !== entryId) return item;
          return {
            ...item,
            primary:{
              ...item.primary,
              time: payload.time || item.primary?.time,
              periodDetailItems: detailItems,
              tags: detailItems.map((it)=>({ label:it.label, cat:'period', val:it.value, icon:it.icon })),
            },
          };
        });
        return { ...block, items: nextItems, entries: undefined };
      }));
    };
    window.addEventListener('edit-save', onEditSave);
    window.addEventListener('edit-delete', onEditDelete);
    return ()=>{
      window.removeEventListener('edit-save', onEditSave);
      window.removeEventListener('edit-delete', onEditDelete);
      delete window.deleteTimelineEntry;
    };
  }, []);

  const handleTabChange = (tab)=>{
    if(tab === 'note' && activeTab !== 'note'){
      recordEnterModeRef.current = 'manual';
      if(periodDetailRecordEnabled || periodEndRecordCompleted) submitPeriodDetailDraftToTimeline();
      submitHealthRecordDraftsToTimeline();
    }
    if(tab !== 'note'){
      recordEnterModeRef.current = 'idle';
    }
    if(tab === 'cal' && activeTab !== 'cal' && periodEndRecordCompleted){
      setPeriodDetailDraft({});
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
        if(it.kind === 'mood-insight' || it.kind === 'record-group' || it.kind === 'diet-photo-feedback') next.isNew = true;
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

    const pending = (entry.kind === 'mood-insight' || entry.kind === 'record-group' || entry.kind === 'diet-photo-feedback')
      ? { ...entry, pendingDrop: true, isNew: false }
      : { ...entry, hideBodyUntilDrop: true, isNew: true };

    setFirstDropAnim({ entryId: pending.id });
    setTimeline(blocks=>window.appendTimelineEntry(blocks, pending, { dayId }));
    return true;
  };

  const submitText = (textOverride, opts={})=>{
    const text = (textOverride || draft).trim();
    if(!text) return;

    const recordScenario = window.readCameraPermissionScenario?.() || 'unauthorized';
    const dietEntry = window.tryCreateDietTextFeedbackEntry?.(text, recordScenario, opts.voice);
    if (dietEntry) {
      setDraft('');
      markUserRecorded();
      const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
        || window.resolveEntryDayId('', timeline);
      setTimeline(blocks=>window.appendTimelineEntry(blocks, dietEntry, { dayId }));
      requestAnimationFrame(()=>{
        if (typeof window.scrollTimelineToBottom === 'function') {
          window.scrollTimelineToBottom('smooth');
        }
      });
      return;
    }

    const weightEntry = window.tryCreateWeightTextEntry?.(text, opts);
    if (weightEntry) {
      setDraft('');
      markUserRecorded();
      const entryText = weightEntry.primary?.text || '';
      if(recordFeedback && tryStartFirstDrop(weightEntry, entryText)) return;
      pushToTimeline(weightEntry, entryText);
      return;
    }

    const hits = window.extractKeywords(text);
    setDraft('');
    markUserRecorded();
    const entry = buildTimelineEntry(text, hits, opts);
    if(recordFeedback && tryStartFirstDrop(entry, text)) return;
    pushToTimeline(entry, text);
  };

  // ====== 清除上一轮演示卡片 ======
  const clearDemoCards = (cb)=>{
    if(!demoIdsRef.current.length){ cb?.(); return; }
    // 淡出 DOM
    demoIdsRef.current.forEach(id=>{
      const el = document.querySelector('[data-entry-id="'+id+'"]');
      if(el){ el.style.transition='opacity .2s'; el.style.opacity='0'; }
    });
    const oldIds = [...demoIdsRef.current];
    setTimeout(()=>{
      setTimeline(blocks=>blocks
        .map(b=>{
          if(b.type!=='day') return b;
          const items = (b.items||[]).filter(it=>!oldIds.includes(it.id));
          return {...b, items, entries:undefined};
        })
        .filter(b=>b.id!=='d-5-17' || (b.items||[]).length > 0) // 清空后移除空的 d-5-17
      );
      demoIdsRef.current = [];
      cb?.();
    }, 220);
  };

  // ====== 6 阶段演示流程 ======
  const runDemoFlow = ()=>{
    setIsDemoRunning(true);
    setDemoPhase('recognizing');

    const demoR1Id = 'demo-r1-'+Date.now();
    const demoR2Id = 'demo-r2-'+Date.now();
    const demoR3Id = 'demo-r3-'+Date.now();
    demoIdsRef.current = [demoR1Id, demoR2Id, demoR3Id];

    const DEMO_TEXT = '昨天下午来了姨妈，来之前，上午就开始头痛。';

    // 阶段 2：识别中 800ms → 浮层消失
    setTimeout(()=>{
      setDemoPhase(null);

      // 阶段 3：插入记录 1、2 到 5-17 block（200ms 后）
      setTimeout(()=>{
        const r1 = {
          kind:'record-group', id:demoR1Id, isNew:true, _demoCard:true,
          primary:{ id:demoR1Id, time:'10:00', kind:'text',
            kind:'symptom',
            symptomLabel:'症状',
            symptomValue:'头痛',
            text:'头痛',
            tags:[{cat:'症状', val:'头痛', icon:'sym'}],
          },
        };
        const r2 = {
          kind:'record-group', id:demoR2Id, isNew:true, _demoCard:true,
          primary:{ id:demoR2Id, time:'16:00', kind:'text',
            kind:'period',
            periodLabel:'月经来了',
            text:'月经来了',
            tags:[{cat:'月经', val:'', icon:'period'}],
          },
        };
        setTimeline(blocks=>{
          // 动态插入 d-5-17 day block（如果不存在）
          let next = blocks;
          if(!next.find(b=>b.id==='d-5-17')){
            const todayIdx = next.findIndex(b=>b.type==='day'&&b.isToday);
            const ins = { type:'day', id:'d-5-17', date:'5/17', weekday:'周日', items:[] };
            next = [...next];
            next.splice(todayIdx >= 0 ? todayIdx : next.length, 0, ins);
          }
          next = window.appendTimelineEntry(next, r1, {dayId:'d-5-17'});
          next = window.appendTimelineEntry(next, r2, {dayId:'d-5-17'});
          return next;
        });

        // 阶段 4：停留 200ms，追加记录 3 占位
        setTimeout(()=>{
          const r3 = {
            kind:'voice-card', id:demoR3Id, isNew:true, _demoCard:true,
            time:'12:00',
            body:'',
            voiceText:'',
            voice:{ duration:'0:05' },
            tagLayout:'t5',
            tags:[],
            _demoTypewriter: true,
            _demoFullText: DEMO_TEXT,
            _demoTags:[
              {cat:'月经', val:'开始', icon:'period'},
              {cat:'症状', val:'头痛', icon:'sym'},
            ],
          };
          setTimeline(blocks=>{
            const todayId = blocks.find(b=>b.type==='day'&&b.isToday)?.id;
            return window.appendTimelineEntry(blocks, r3, {dayId: todayId});
          });

          // 滚动到记录 3
          setTimeout(()=>{
            const el = document.querySelector('[data-entry-id="'+demoR3Id+'"]');
            if(el) el.scrollIntoView({behavior:'smooth', block:'center'});
          }, 80);

          // 阶段 5 由 SegmentedRecordCard 的 TypewriterText 完成回调驱动
          // 阶段 6：回填来源标签
          // 通过 window event 监听 typewriter 完成
          const onTypewriterDone = ()=>{
            window.removeEventListener('demoTypewriterDone', onTypewriterDone);
            setTimeout(()=>{
              setIsDemoRunning(false);
            }, 900);
          };
          window.addEventListener('demoTypewriterDone', onTypewriterDone);

        }, 200); // 阶段 4 delay
      }, 200); // 阶段 3 delay after float disappears
    }, 800); // 阶段 2 ASR delay
  };

  const submitVoice = (transcript, durSec)=>{
    const recordScenario = window.readCameraPermissionScenario?.() || 'unauthorized';
    if (window.isDietTextRecordScenario?.(recordScenario)) {
      markUserRecorded();
      const text = (transcript || '').trim();
      if (text) {
        submitText(text, {
          voice: { duration: window.formatVoiceDur?.(durSec) || '0:03' },
        });
        return;
      }
    }

    markUserRecorded();
    setDemoPhase('listening');
    // 清除上一轮演示卡片，然后启动新流程
    clearDemoCards(()=> runDemoFlow());

    // 真实 ASR 接入时启用以下逻辑：
    // const text = transcript.trim();
    // if(!text) return;
    // const hits = window.extractKeywords(text);
    // const entry = buildTimelineEntry(text, hits, {
    //   voice: { duration: window.formatVoiceDur(durSec) },
    // });
    // if(recordFeedback && tryStartFirstDrop(entry, text)) return;
    // pushToTimeline(entry, text);
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
      return;
    }
    const entry = window.createMoodRecordEntryLegacy(moods);
    const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
      || window.resolveEntryDayId('', timeline);
    setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
  };

  const appendSymptomRecord = (symptoms, { allowFirstDrop = false } = {})=>{
    markUserRecorded();
    const entry = window.createSymptomRecordEntry(symptoms);
    if(allowFirstDrop && recordFeedback && tryStartFirstDrop(entry, entry.body || '')) return;
    const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
      || window.resolveEntryDayId('', timeline);
    setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
  };

  const submitSymptomRecord = (symptoms)=>{
    appendSymptomRecord(symptoms, { allowFirstDrop: true });
  };

  const submitRecordTabSymptomRecord = (symptoms)=>{
    appendSymptomRecord(symptoms);
  };

  const submitWeightRecord = (payload)=>{
    markUserRecorded();
    const entry = window.createWeightRecordEntry(payload);
    const entryText = entry.primary?.weightValue || entry.primary?.text || entry.body || '';
    if(recordFeedback && tryStartFirstDrop(entry, entryText)) return;
    const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
      || window.resolveEntryDayId('', timeline);
    setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
  };

  const submitPeriodDetailRecord = ({ type, value })=>{
    if(!type || !value) return;
    markUserRecorded();
    setPeriodDetailDraft((prev)=>({ ...prev, [type]: value }));
    setPeriodDetailRecordEnabled(true);
  };

  const submitHealthRecord = (payload)=>{
    if(!payload?.type || !payload?.value) return;
    markUserRecorded();
    setHealthRecordDrafts((prev)=>[...prev, payload]);
  };

  const submitFoodRecord = (foods)=>{
    markUserRecorded();
    const entry = window.createFoodRecordEntry(foods);
    if(recordFeedback && tryStartFirstDrop(entry, entry.body || '')) return;
    const dayId = timeline.find(b=>b.type==='day' && b.isToday)?.id
      || window.resolveEntryDayId('', timeline);
    setTimeline(blocks=>window.appendTimelineEntry(blocks, entry, { dayId }));
  };

  const submitDietCapture = (payload)=>{
    markUserRecorded();
    const entry = window.createDietCaptureGroup?.({
      photoUrl: payload?.photoUrl || payload?.photo?.thumb || null,
    });
    if(!entry) return;
    entry.isNew = true;
    if (payload?.recognitionState) {
      entry.recognitionState = payload.recognitionState;
    }
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

  const showRecordTab = scene.calendar.enabled && activeTab === 'cal';
  const showHome = activeTab === 'home';
  const showReview = activeTab === 'cash';
  const showFloatNotice = scene.floatNotice.enabled && showAnalysisNotice && activeTab === 'cal';
  const showRecordShell = activeTab === 'note';
  const showTodayGuide = scene.record.todayGuide && !hideTodayGuide;

  const I = window.Icon;
  const DemoSceneBar = window.DemoSceneBar;
  const CameraPermissionScenarioBar = window.CameraPermissionScenarioBar;
  const DietRecognitionScenarioBar = window.DietRecognitionScenarioBar;
  const DietFeedbackDisplayScenarioBar = window.DietFeedbackDisplayScenarioBar;
  const DietFeedbackComboScenarioBar = window.DietFeedbackComboScenarioBar;
  const RecordEmptyScreen = window.RecordEmptyScreen;
  const RecordBlankStream = window.RecordBlankStream;
  const StreamSearchOverlay = window.StreamSearchOverlay;
  const ReviewPage = window.ReviewPage;
  const HomePage = window.HomePage;
  const VoiceTranscribeInputLayer = window.VoiceTranscribeInputLayer;

  const toggleSearchPage = ()=> setShowSearchPage((prev)=> !prev);
  const restoreSearchCloseScroll = React.useCallback(()=>{
    const saved = searchCloseScrollRef.current;
    if(!saved) return;
    const stream = streamRef.current;
    if(!stream) return;
    const { anchorId, scrollTop } = saved;
    if(anchorId){
      const el = stream.querySelector(`[data-entry-id="${anchorId}"]`);
      if(el){
        const top = el.getBoundingClientRect().top - stream.getBoundingClientRect().top + stream.scrollTop - 28;
        stream.scrollTop = Math.max(0, top);
        return;
      }
    }
    stream.scrollTop = scrollTop;
  }, []);
  const closeSearchPage = ()=> {
    const filterTimelineForSearchFn = window.filterTimelineForSearch;
    const filtered = (searchCriteria && filterTimelineForSearchFn)
      ? filterTimelineForSearchFn(timeline, searchCriteria)
      : timeline;
    searchCloseScrollRef.current = {
      anchorId: window.getSearchAnchorEntryId?.(filtered),
      scrollTop: streamRef.current?.scrollTop ?? 0,
    };
    setShowSearchPage(false);
    setSearchCriteria(null);
  };
  const handleTimelineSearch = (criteria)=> setSearchCriteria(criteria);
  const handleTimelineSearchClear = ()=> setSearchCriteria(null);
  const handleTimelineDateSelect = React.useCallback((recordDate)=>{
    if(!recordDate?.dayId) return;
    setShowSearchPage(false);
    setSearchCriteria(null);
    const scrollToDay = ()=>{
      const stream = streamRef.current;
      if(!stream) return;
      const el = stream.querySelector(`[data-day-id="${recordDate.dayId}"]`);
      if(!el) return;
      const header = stream.parentElement?.querySelector('.stream-header');
      const headerH = header?.getBoundingClientRect().height || 0;
      const top = el.getBoundingClientRect().top - stream.getBoundingClientRect().top + stream.scrollTop - headerH - 18;
      stream.scrollTop = Math.max(0, top);
    };
    requestAnimationFrame(()=>requestAnimationFrame(scrollToDay));
  }, []);

  const filterTimelineForSearch = window.filterTimelineForSearch;
  const countTimelineSearchItems = window.countTimelineSearchItems;
  const isSearchActive = !!(searchCriteria && (searchCriteria.query?.trim() || searchCriteria.filterId));
  const displayTimeline = React.useMemo(()=>{
    if(!isSearchActive || !filterTimelineForSearch) return timeline;
    return filterTimelineForSearch(timeline, searchCriteria);
  }, [timeline, searchCriteria, isSearchActive, filterTimelineForSearch]);
  const searchResultCount = React.useMemo(()=>{
    if(!isSearchActive || !countTimelineSearchItems) return null;
    return countTimelineSearchItems(displayTimeline);
  }, [displayTimeline, isSearchActive, countTimelineSearchItems]);

  React.useLayoutEffect(()=>{
    if(searchCriteria) return;
    if(!searchCloseScrollRef.current) return;
    restoreSearchCloseScroll();
    requestAnimationFrame(()=>{
      restoreSearchCloseScroll();
      searchCloseScrollRef.current = null;
    });
  }, [searchCriteria, restoreSearchCloseScroll]);

  const [homeDetailOpen, setHomeDetailOpen] = React.useState(false);
  const showBottomTabBar = !homeDetailOpen;
  const showScheme3Bubble = isScheme3 && showBlankEmpty
    && window.shouldShowScheme3Bubble?.();
  const highlightScheme3Input = isScheme3 && showBlankEmpty
    && scheme3FirstVisitRef.current;

  return (
    <>
      <div className={'phone' + (homeDetailOpen ? ' is-home-detail-open' : '')}>
        <StatusBar/>

      {showHome && HomePage && (
        <HomePage onDetailOpenChange={setHomeDetailOpen}/>
      )}

      {showRecordTab && (
        <RecordPage
          key={scene.id}
          periodFlowEnabled={scene.calendar.periodFlow}
          periodEndRecordReady={periodEndRecordReady}
          periodEndRecordCompleted={periodEndRecordCompleted}
          onAnalysisReady={()=>{
            setAnalysisNoticeTitle('结合近期记录，已为你生成周期状态分析');
            setAnalysisNoticeKind('period-start');
            setShowAnalysisNotice(true);
          }}
          onPeriodEndAnalysisReady={()=>{
            setAnalysisNoticeTitle('本次月经长度为8天，较前两次明显延长...');
            setAnalysisNoticeKind('period-end');
            setShowAnalysisNotice(true);
          }}
          onPeriodReset={()=>{
            setShowAnalysisNotice(false);
            setAnalysisNoticeTitle('结合近期记录，已为你生成周期状态分析');
            setAnalysisNoticeKind('period-start');
            setPeriodEndRecordReady(false);
            setPeriodEndRecordCompleted(false);
            setPeriodDetailRecordEnabled(false);
            setPeriodDetailDraft({});
          }}
          onPeriodRecordSubmit={(value)=>{
            periodRecordRef.current = value || null;
            setPeriodDetailRecordEnabled(true);
          }}
          onPeriodDetailRecordSubmit={submitPeriodDetailRecord}
          onSymptomRecordSubmit={submitRecordTabSymptomRecord}
          onHealthRecordSubmit={submitHealthRecord}
          periodDetailValues={periodDetailDraft}
          periodDetailDemoEnabled={periodDetailRecordEnabled || periodEndRecordCompleted}
        />
      )}

      {scene.floatNotice.enabled && (
        <FloatNotice
          show={showFloatNotice}
          title={analysisNoticeTitle}
          onOpen={openSisterAnalysis}
          onClose={()=>setShowAnalysisNotice(false)}
        />
      )}

      {showReview && ReviewPage && (
        <ReviewPage/>
      )}

      <div
        className={'suiji-shell suiji-shell--scene'+(showRecordEmpty ? ' suiji-shell--empty' : '')+(showRecordBlank ? ' suiji-shell--blank' : '')+(voiceTranscribe ? ' suiji-shell--voice' : '')+(showRecordShell ? '' : ' app-view-hidden')+(dockExpanded?' is-mood-expanded':'')+(showSearchPage?' is-search-open':'')+(isSearchActive?' is-search-filtered':'')}
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
          onOpenSearch={toggleSearchPage}
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
          onDietCapture={submitDietCapture}
          onVoiceDone={submitVoice}
          onPhoto={()=>setShowPhoto(true)}
          onDockExpandedChange={setDockExpanded}
          activeTab={activeTab}
          defaultInputMode={showScheme1Hints ? 'voice' : 'text'}
          showScheme3Bubble={showScheme3Bubble}
          highlightScheme3Input={highlightScheme3Input}
          demoPhase={demoPhase}
          isDemoRunning={isDemoRunning}
        />
        )}
        </>
        ) : (
        <>
        <div className="stream-header">
          <div className="stream-header-side"/>
          <h1 className="stream-title">点滴</h1>
          <div className="stream-actions">
            <button
              className={'stream-action' + (showSearchPage ? ' is-active' : '')}
              aria-label="搜索"
              aria-pressed={showSearchPage}
              type="button"
              onClick={toggleSearchPage}
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

          {isSearchActive && searchResultCount === 0 ? (
            <div className="tl-search-empty" role="status">
              <span className="tl-search-empty-ico" aria-hidden="true">
                <I name="search" size={44} stroke={1.4}/>
              </span>
              <p className="tl-search-empty-title">无结果</p>
              <p className="tl-search-empty-desc">检查拼写或尝试新搜索词。</p>
            </div>
          ) : (
          <TimelineStream
            blocks={displayTimeline}
            endRef={timelineEndRef}
            sisterPlayAnimation={sisterPlayAnimation}
            sisterCycleDone={sisterCycleDone}
            hideTodayGuide={!showTodayGuide}
            onSisterCycleComplete={handleSisterCycleComplete}
            firstDropAnim={recordFeedback ? firstDropAnim : null}
            onFirstDropLand={recordFeedback ? handleFirstDropLand : undefined}
            onFirstDropComplete={recordFeedback ? handleFirstDropComplete : undefined}
          />
          )}
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
          onDietCapture={submitDietCapture}
          onVoiceDone={submitVoice}
          onPhoto={()=>setShowPhoto(true)}
          onDockExpandedChange={setDockExpanded}
          activeTab={activeTab}
          demoPhase={demoPhase}
          isDemoRunning={isDemoRunning}
        />
        )}
        {showSearchPage && StreamSearchOverlay && (
          <StreamSearchOverlay
            timeline={timeline}
            onClose={closeSearchPage}
            onSearch={handleTimelineSearch}
            onSearchClear={handleTimelineSearchClear}
            onDateSelect={handleTimelineDateSelect}
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

      {showPhoto && <PhotoSheet onCancel={()=>setShowPhoto(false)} onPick={submitPhoto}/>}

      <Toast toasts={toasts}/>
      {showBottomTabBar && <TabBar active={activeTab} onChange={handleTabChange}/>}
      </div>

      {!window.__STANDALONE_LOCKED_SCENE && (
        <div className="demo-controls-stack">
          <DemoSceneBar
            value={t.demoScene}
            onChange={(v)=>setTweak('demoScene', v)}
            description={scene.description}
          />
        </div>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
