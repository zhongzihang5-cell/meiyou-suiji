// voice-transcribe-demo.jsx — 场景五 · 语音转写输入层（时间轴沿用场景一）
/* global React, VoiceTranscribeBar, VoiceTranscribeAtmosphere, VoiceTranscribeDockBar,
   LiveBubble, LiveGrowPanel, LiveFloat, RecordingWave, isAsyncVoiceVariant,
   VT_DOCK_TRANSCRIBING, removeTimelineEntry */

const { useState, useRef, useCallback, useEffect } = React;

const VT_TRANSCRIPTS = [
  {
    text: '今天下午突然觉得有点累，可能是昨晚睡得不太好。胃里也有点闷闷的感觉，午饭只吃了一半。',
    tags: [
      { kind: 'category', category: '情绪', label: '疲惫' },
      { kind: 'category', category: '饮食', label: '食欲下降' },
    ],
    aiTitle: '本周情绪走势',
    chartType: 'moodWeek',
    aiInsight: '今日 ▽ 低于上周均值 · 卵泡期 · 睡眠不足关联',
  },
  {
    text: '刚刚跑完步整个人神清气爽，心情比早上好太多了。',
    tags: [
      { kind: 'category', category: '运动', label: '跑步' },
      { kind: 'category', category: '心情', label: '放松' },
    ],
    aiTitle: '本周情绪走势',
    chartType: 'moodWeek',
    aiInsight: '今日 △ 高于上周均值 · 卵泡期 · 运动带来状态回升',
  },
  {
    text: '今天小腹隐隐有点胀，下午两点左右开始的，喝了热水之后稍微好一些。',
    tags: [{ kind: 'category', category: '症状', label: '腹胀' }],
    aiTitle: '本周情绪走势',
    chartType: 'moodWeek',
    aiInsight: '今日 ▽ 低于上周均值 · 卵泡期 · 留意水分摄入',
  },
];

const VT_CAT_ICON = {
  心情: 'mood',
  情绪: 'mood',
  饮食: 'food',
  运动: 'run',
  体征: 'sym',
  症状: 'sym',
};

let vtPromptIdx = 0;

function mapVtTagsV3(tags){
  return (tags || []).map((t) => ({
    cat: t.category || t.cat,
    val: t.label || t.val,
    icon: VT_CAT_ICON[t.category || t.cat] || 'sym',
  }));
}

function patchTimelineEntry(blocks, entryId, patch){
  return blocks.map((b) => {
    if(b.type !== 'day') return b;
    const items = b.items || b.entries || [];
    if(!items.some((it) => it.id === entryId)) return b;
    return {
      ...b,
      items: items.map((it) => (it.id === entryId ? { ...it, ...patch } : it)),
      entries: undefined,
    };
  });
}

function removeTimelineEntry(blocks, entryId){
  return blocks.map((b) => {
    if(b.type !== 'day') return b;
    return {
      ...b,
      items: (b.items || b.entries || []).filter((it) => it.id !== entryId),
      entries: undefined,
    };
  });
}

function replaceTimelineEntry(blocks, entryId, nextItem){
  return blocks.map((b) => {
    if(b.type !== 'day') return b;
    const items = b.items || b.entries || [];
    if(!items.some((it) => it.id === entryId)) return b;
    return {
      ...b,
      items: items.map((it) => (it.id === entryId ? { ...nextItem, isNew: true } : it)),
      entries: undefined,
    };
  });
}

function buildVtLiveEntry(id){
  return {
    id,
    kind: 'voice-card',
    time: window.formatNowTime(),
    isNew: true,
    vtLive: true,
    liveText: '',
    voiceText: '',
    voice: { duration: '0:00' },
    tagLayout: 't5',
  };
}

function buildVtFinalGroup(tpl, finalText, durationSec, primaryId){
  const pid = primaryId || ('vt-' + Date.now());
  return {
    kind: 'record-group',
    id: pid + '-g',
    isNew: true,
    staggerReveal: true,
    primary: {
      id: pid,
      time: window.formatNowTime(),
      kind: 'voice',
      duration: window.formatVoiceDur(durationSec),
      text: finalText,
      tags: mapVtTagsV3(tpl.tags),
    },
    ai: {
      id: pid + '-ai',
      time: window.formatNowTime(),
      kind: 'chart',
      chartType: tpl.chartType || 'moodWeek',
      title: tpl.aiTitle || '本周情绪走势',
      note: tpl.aiInsight,
    },
    aiDefaultOpen: true,
  };
}

function buildVtAsyncGroup(tpl, finalText, durationSec, variant){
  const pid = 'vt-' + Date.now();
  return {
    kind: 'record-group',
    id: pid + '-g',
    isNew: true,
    vtAsync: true,
    vtVariant: variant,
    primary: {
      id: pid,
      time: window.formatNowTime(),
      kind: 'voice',
      text: finalText,
      chars: [...finalText],
      durationSec,
      vtVariant: variant,
      tags: mapVtTagsV3(tpl.tags),
    },
    ai: {
      id: pid + '-ai',
      time: window.formatNowTime(),
      kind: 'chart',
      chartType: tpl.chartType || 'moodWeek',
      title: tpl.aiTitle || '本周情绪走势',
      note: tpl.aiInsight,
    },
    aiDefaultOpen: true,
  };
}

function resolveVoiceAppendDayId(timeline){
  const days = (timeline || []).filter((b) => b.type === 'day');
  const todayDays = days.filter((d) => d.isToday);
  if(todayDays.length) return todayDays[todayDays.length - 1].id;
  return days[days.length - 1]?.id || window.resolveEntryDayId('', timeline);
}

const VT_CHAR_MS = 34;
const VT_CHAR_JITTER = 10;
const VT_LIVE_EXIT_MS = 300;

function VoiceTranscribeInputLayer({
  variant = 'live-drop',
  timeline,
  setTimeline,
  onScrollEnd,
  onRecorded,
}){
  const [recording, setRecording] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [liveText, setLiveText] = useState('');
  const [liveExiting, setLiveExiting] = useState(false);
  const [dockTranscribing, setDockTranscribing] = useState(false);

  const liveEntryIdRef = useRef(null);
  const lastAsyncGroupIdRef = useRef(null);
  const liveTplRef = useRef(null);
  const streamRef = useRef(null);
  const elapsedRef = useRef(null);
  const startTsRef = useRef(0);
  const variantRef = useRef(variant);

  variantRef.current = variant;

  useEffect(() => {
    window.__vtOnTranscribePhase = (phase) => {
      /* 底栏保持「正在转录」，等时间轴打字完成后再恢复「按住说话」 */
      if(phase === 'done'){
        setDockTranscribing(false);
      }
    };
    return () => { delete window.__vtOnTranscribePhase; };
  }, []);

  useEffect(() => {
    vtPromptIdx = 0;
    liveEntryIdRef.current = null;
    lastAsyncGroupIdRef.current = null;
    liveTplRef.current = null;
    setLiveText('');
    setLiveExiting(false);
    setDockTranscribing(false);
    setRecording(false);
    setCancelHover(false);
    setElapsed(0);
    if(streamRef.current) clearTimeout(streamRef.current);
    if(elapsedRef.current) clearInterval(elapsedRef.current);
    streamRef.current = null;
    elapsedRef.current = null;
  }, [variant]);

  const startStream = useCallback((tpl, variantAtStart) => {
    const chars = Array.from(tpl.text);
    let i = 0;
    const tick = () => {
      i += 1;
      if(i > chars.length){
        streamRef.current = null;
        return;
      }
      const slice = chars.slice(0, i).join('');
      setLiveText(slice);
      if(variantAtStart === 'live-drop' && liveEntryIdRef.current){
        const dur = (performance.now() - startTsRef.current) / 1000;
        const id = liveEntryIdRef.current;
        setTimeline((blocks) => patchTimelineEntry(blocks, id, {
          liveText: slice,
          voice: { duration: window.formatVoiceDur(Math.max(0, Math.ceil(dur))) },
        }));
        if(i === 1 || i % 2 === 0) onScrollEnd?.();
      }
      streamRef.current = setTimeout(
        tick,
        VT_CHAR_MS + Math.random() * VT_CHAR_JITTER,
      );
    };
    streamRef.current = setTimeout(tick, 70);
  }, [setTimeline, onScrollEnd]);

  const stopStream = () => {
    if(streamRef.current){
      clearTimeout(streamRef.current);
      streamRef.current = null;
    }
    if(elapsedRef.current){
      clearInterval(elapsedRef.current);
      elapsedRef.current = null;
    }
  };

  const handleStart = useCallback(() => {
    const v = variantRef.current;
    const tpl = VT_TRANSCRIPTS[vtPromptIdx % VT_TRANSCRIPTS.length];
    vtPromptIdx += 1;
    liveTplRef.current = tpl;
    setLiveText('');
    setLiveExiting(false);
    setCancelHover(false);
    setRecording(true);
    setElapsed(0);
    startTsRef.current = performance.now();
    elapsedRef.current = setInterval(() => {
      setElapsed((performance.now() - startTsRef.current) / 1000);
    }, 100);

    if(typeof isAsyncVoiceVariant === 'function' && isAsyncVoiceVariant(v)){
      return;
    }

    if(v === 'live-drop'){
      const id = 'vt-' + Date.now();
      liveEntryIdRef.current = id;
      setTimeline((blocks) => {
        const dayId = resolveVoiceAppendDayId(blocks);
        return window.appendTimelineEntry(blocks, buildVtLiveEntry(id), { dayId });
      });
      requestAnimationFrame(() => onScrollEnd?.());
    }
    startStream(tpl, v);
  }, [setTimeline, onScrollEnd, startStream]);

  const handleEnd = useCallback(() => {
    const v = variantRef.current;
    if(v === VT_DOCK_TRANSCRIBING){
      setDockTranscribing(true);
    }
    setRecording(false);
    setCancelHover(false);
    stopStream();
    const tpl = liveTplRef.current;
    if(!tpl) return;
    const finalText = liveText || tpl.text;
    const finalDuration = Math.max(2, Math.ceil(elapsed));
    onRecorded?.();

    if(typeof isAsyncVoiceVariant === 'function' && isAsyncVoiceVariant(v)){
      const entry = buildVtAsyncGroup(tpl, finalText, finalDuration, v);
      lastAsyncGroupIdRef.current = entry.id;
      setTimeline((blocks) => {
        const dayId = resolveVoiceAppendDayId(blocks);
        return window.appendTimelineEntry(blocks, entry, { dayId });
      });
      liveTplRef.current = null;
      requestAnimationFrame(() => onScrollEnd?.());
      return;
    }

    if(v === 'live-drop' && liveEntryIdRef.current){
      const id = liveEntryIdRef.current;
      const finalized = buildVtFinalGroup(tpl, finalText, finalDuration, id);
      setTimeline((blocks) => replaceTimelineEntry(blocks, id, finalized));
      liveEntryIdRef.current = null;
      setLiveText('');
      liveTplRef.current = null;
      requestAnimationFrame(() => onScrollEnd?.());
      return;
    }

    setLiveExiting(true);
    setTimeout(() => {
      setTimeline((blocks) => {
        const dayId = resolveVoiceAppendDayId(blocks);
        const entry = buildVtFinalGroup(tpl, finalText, finalDuration);
        return window.appendTimelineEntry(blocks, entry, { dayId });
      });
      setLiveExiting(false);
      setLiveText('');
      liveTplRef.current = null;
      requestAnimationFrame(() => onScrollEnd?.());
    }, VT_LIVE_EXIT_MS);
  }, [liveText, elapsed, setTimeline, onScrollEnd, onRecorded]);

  const handleCancel = useCallback(() => {
    const v = variantRef.current;
    setRecording(false);
    setCancelHover(false);
    stopStream();
    if(v === 'live-drop' && liveEntryIdRef.current){
      const id = liveEntryIdRef.current;
      setTimeline((blocks) => removeTimelineEntry(blocks, id));
      liveEntryIdRef.current = null;
    }
    setLiveText('');
    setLiveExiting(false);
    liveTplRef.current = null;
  }, [setTimeline]);

  const liveActive = recording && !liveExiting;
  const isAsync = typeof isAsyncVoiceVariant === 'function' && isAsyncVoiceVariant(variant);
  const showLiveBubble = !isAsync && (recording || liveExiting) && variant === 'live-bubble';
  const showLiveGrow = !isAsync && (recording || liveExiting) && variant === 'live-grow';
  const showLiveFloat = !isAsync && (recording || liveExiting) && variant === 'live-float';
  const showRecordingWave = isAsync && recording && variant !== VT_DOCK_TRANSCRIBING;
  const showDockBar = dockTranscribing && variant === VT_DOCK_TRANSCRIBING;

  const handleDockCancel = useCallback(() => {
    setDockTranscribing(false);
    const gid = lastAsyncGroupIdRef.current;
    if(gid){
      setTimeline((blocks) => removeTimelineEntry(blocks, gid));
      lastAsyncGroupIdRef.current = null;
    }
    liveTplRef.current = null;
  }, [setTimeline]);

  return (
    <>
      <div className="vt-overlay-root" aria-hidden={false}>
        <VoiceTranscribeAtmosphere active={recording} />
        {showRecordingWave && RecordingWave && (
          <RecordingWave
            active={recording}
            elapsed={elapsed}
            cancel={cancelHover}
            variant={variant}
          />
        )}
        {showLiveBubble && <LiveBubble text={liveText} active={liveActive} exiting={liveExiting} />}
        {showLiveGrow && <LiveGrowPanel text={liveText} active={liveActive} exiting={liveExiting} />}
      </div>
      <div className="vt-bar-wrap">
        {showLiveFloat && (
          <LiveFloat text={liveText} active={liveActive} exiting={liveExiting} />
        )}
        {showDockBar && VoiceTranscribeDockBar ? (
          <VoiceTranscribeDockBar onCancel={handleDockCancel} />
        ) : (
          <VoiceTranscribeBar
            recording={recording}
            elapsed={elapsed}
            variant={variant}
            cancelHover={cancelHover}
            onCancelHoverChange={setCancelHover}
            onStart={handleStart}
            onEnd={handleEnd}
            onCancel={handleCancel}
          />
        )}
      </div>
    </>
  );
}

Object.assign(window, {
  VoiceTranscribeInputLayer,
  patchTimelineEntry,
  removeTimelineEntry,
});
