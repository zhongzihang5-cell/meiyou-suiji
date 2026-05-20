// ============ 时间轴模块占位 & 场景卡片 ============

function parseDayParts(dateStr){
  const [m, d] = (dateStr || '').split('/');
  return { month: m || '', day: d || '' };
}

function extractKcalFromText(text){
  if(!text) return 0;
  const m = String(text).match(/(\d+(?:\.\d+)?)\s*kcal/i);
  return m ? parseFloat(m[1]) : 0;
}

function extractWeightFromItem(item){
  const text = [item.body, item.voiceText].filter(Boolean).join(' ');
  const scaleMatch = text.match(/称[^0-9]*(\d+\.?\d*)/);
  if(scaleMatch) return parseFloat(scaleMatch[1]);

  if(item.kind === 'wellness' && item.panels){
    const panel = item.panels.find(p => p.type === 'weight');
    const trend = panel?.weightTrend;
    if(trend?.length) return trend[trend.length - 1].v;
  }
  return null;
}

function summarizeDayItems(items, day){
  if(day?.summaryStats?.length) return { stats: day.summaryStats };

  let count = 0;
  let kcal = 0;
  let weight = null;

  (items || []).forEach((it, idx)=>{
    if(it.kind === 'sister-card' && (items[idx - 1]?.kind === 'voice-card' || items[idx - 1]?.kind === 'sync-card')) return;
    if(it.kind === 'guide') return;

    if(it.kind === 'record-group'){
      if(it.primary) count += 1;
      if(it.ai) count += 1;
      if(it.primary?.totalKcal) kcal += it.primary.totalKcal;
      (it.primary?.tags || []).forEach(tag=>{
        const m = String(tag.val || '').match(/(\d+(?:\.\d+)?)\s*kcal/i);
        if(m) kcal += parseFloat(m[1]);
        const wm = String(tag.val || '').match(/(\d+\.?\d*)\s*kg/i);
        if(wm) weight = parseFloat(wm[1]);
      });
      const w = extractWeightFromItem(it.primary || it);
      if(w != null) weight = w;
      return;
    }

    count += 1;
    kcal += extractKcalFromText(it.aiNote?.total);

    const w = extractWeightFromItem(it);
    if(w != null) weight = w;
  });

  const stats = [];
  if(count > 0) stats.push({ v: String(count), l: '条' });
  if(kcal > 0) stats.push({ v: String(Math.round(kcal)), l: 'kcal' });
  if(weight != null) stats.push({ v: weight.toFixed(1), l: 'kg' });

  return { count, kcal, weight, stats };
}

function resolveDayTitleLabel(day, allDays){
  if(day.isToday) return '今天';
  const days = allDays || [];
  const todayIdx = days.findIndex(d => d.isToday);
  const idx = days.findIndex(d => d.id === day.id);
  if(todayIdx >= 0 && idx === todayIdx - 1) return '昨天';
  if(todayIdx >= 0 && idx === todayIdx - 2) return '前天';
  const { month, day: dayNum } = parseDayParts(day.date);
  return `${month}/${dayNum}`;
}

function formatDayMeta(day, titleLabel){
  const relative = titleLabel === '今天' || titleLabel === '昨天' || titleLabel === '前天';
  if(relative){
    const { month, day: dayNum } = parseDayParts(day.date);
    const datePart = `${month}月${dayNum}日`;
    return day.weekday ? `${datePart} · ${day.weekday}` : datePart;
  }
  return day.weekday || '';
}

function CycleDayHeader({day, items, dayBlocks}){
  const title = resolveDayTitleLabel(day, dayBlocks);
  const meta = formatDayMeta(day, title);
  const { stats } = summarizeDayItems(items, day);

  return (
    <div className={'tl-day-summary'+(day.isToday ? ' is-today' : '')}>
      <div className="tl-day-summary-top">
        <span className="tl-day-summary-title">{title}</span>
        {meta && <span className="tl-day-summary-meta">{meta}</span>}
      </div>
      {stats.length > 0 && (
        <div className="tl-day-summary-stats">
          {stats.map((s, i)=>(
            <span key={i} className="tl-day-summary-stat">
              <span className="tl-day-summary-stat-v">{s.v}</span>
              <span className="tl-day-summary-stat-l">{s.l}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function TimelineRailNode({phaseKind, railDot, isFeedLast, nodeKind, children}){
  const dotCls = railDot === 'ai'
    ? ' ai'
    : (phaseKind ? ' '+phaseKind : '');
  return (
    <div className={'tl-rail-node'+(isFeedLast?' is-feed-last':'')+(nodeKind==='guide'?' is-guide':'')}>
      <div className="tl-rail-marker" aria-hidden="true">
        <span className={'tl-rail-dot'+dotCls}/>
      </div>
      <div className="tl-rail-body">{children}</div>
    </div>
  );
}

function ModulePlaceholder({mod, cycleDay}){
  const icons = {
    'cycle-card':'🔄',
    'wellness':'⚖️',
    'calorie':'🍽',
  };
  const dLabel = cycleDay ? 'D'+cycleDay : 'D1';
  return (
    <div className={'tl-module ph-'+mod.type}>
      <div className="tl-module-head">
        <span className="tl-module-icon">{icons[mod.type] || '📦'}</span>
        <div className="tl-module-meta">
          <span className="tl-module-title">{mod.title}</span>
          <span className="tl-module-badge">模块占位</span>
        </div>
      </div>
      <div className="tl-module-body">
        <div className="tl-module-sk">
          {mod.sketch === 'cycle' && (
            <div className="sk-cycle">
              <div className="sk-cycle-ring"/>
              <span>{dLabel}</span>
            </div>
          )}
          {mod.sketch === 'wellness' && (
            <div className="sk-wellness">
              <div className="sk-row"><span>⚖️ 52.4 kg</span><span className="sk-delta">↓0.3</span></div>
              <div className="sk-row"><span>😴 6h 40m</span><span className="sk-tag">偏少</span></div>
            </div>
          )}
          {mod.sketch === 'calorie' && (
            <div className="sk-calorie">
              <div className="sk-cal-num">≈ 480 <em>kcal</em></div>
              <div className="sk-cal-tags"><span>午餐</span><span>蛋白质</span></div>
            </div>
          )}
          {!mod.sketch && <div className="tl-module-empty"/>}
        </div>
        <p className="tl-module-desc">{mod.desc}</p>
      </div>
    </div>
  );
}

const GUIDE_REVEAL_DELAY_MS = 1800;
const GUIDE_TYPEWRITER_MS = 84;

function TodayGuideCard({item, isNew, animate}){
  const [ready, setReady] = React.useState(!animate);

  React.useEffect(()=>{
    if(!animate){
      setReady(true);
      return;
    }
    setReady(false);
    const t = setTimeout(()=>setReady(true), GUIDE_REVEAL_DELAY_MS);
    return ()=>clearTimeout(t);
  }, [animate, item.text]);

  React.useEffect(()=>{
    if(!ready || !animate) return;
    requestAnimationFrame(()=>{
      setTimeout(()=>{
        const end = document.querySelector('.tl-feed-end');
        end?.scrollIntoView({ behavior:'smooth', block:'end' });
      }, 80);
    });
  }, [ready, animate]);

  if(!ready) return null;

  return (
    <div className={'tl-rail-guide'+(isNew?' fade-in':'')}>
      <p className="tl-rail-guide-text">
        {animate ? (
          <TypewriterText text={item.text} active charMs={GUIDE_TYPEWRITER_MS}/>
        ) : item.text}
      </p>
    </div>
  );
}

function buildWeeklyPanels(item){
  const panels = [];
  if(item.moodTrend?.length){
    panels.push({
      id:'mood', type:'mood', icon:'💜', title:'心情趋势',
      moodTrend: item.moodTrend,
      summary: item.moodSummary || '',
    });
  }
  if(item.weightTrend?.length){
    panels.push({
      id:'weight', type:'weight', icon:'⚖️', title:'体重变化',
      weightTrend: item.weightTrend,
      weightDelta: item.weightDelta,
      summary: item.weightSummary || '',
    });
  }
  if(panels.length === 1 && item.summary){
    panels[0].summary = item.summary;
  }
  return panels;
}

function WeeklyMoodChart({data}){
  const maxM = Math.max(...data.map(d=>d.v), 1);
  return (
    <div className="tl-trend-chart mood">
      {data.map((d,i)=>(
        <div key={i} className="tl-trend-col">
          <div
            className="tl-trend-bar"
            style={{height: Math.round((d.v / maxM) * 48)+'px'}}
          />
          <span className="tl-trend-day">{d.d}</span>
        </div>
      ))}
    </div>
  );
}

function WeeklyWeightChart({data, delta}){
  const wVals = data.map(d=>d.v);
  const minW = Math.min(...wVals);
  const maxW = Math.max(...wVals);
  const wRange = maxW - minW || 1;
  return (
    <>
      <div className="tl-trend-chart weight">
        {data.map((d,i)=>(
          <div key={i} className="tl-trend-col">
            <div
              className="tl-trend-dot"
              style={{bottom: Math.round(((d.v - minW) / wRange) * 40)+'px'}}
            />
            <span className="tl-trend-day">{d.d}</span>
          </div>
        ))}
        <svg className="tl-trend-line" viewBox="0 0 200 48" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="rgba(255,77,136,0.5)"
            strokeWidth="2"
            points={data.map((d,i)=>{
              const x = (i / Math.max(data.length - 1, 1)) * 200;
              const y = 44 - ((d.v - minW) / wRange) * 36;
              return x+','+y;
            }).join(' ')}
          />
        </svg>
      </div>
      {delta && <div className="tl-weekly-panel-delta">{delta}</div>}
    </>
  );
}

function WeeklySleepChart({data}){
  const maxH = Math.max(...data.map(d=>d.v), 1);
  const minH = Math.min(...data.map(d=>d.v));
  return (
    <div className="tl-trend-chart sleep">
      {data.map((d,i)=>(
        <div key={i} className="tl-trend-col">
          <div
            className="tl-trend-bar sleep-bar"
            style={{height: Math.round(((d.v - minH * 0.85) / (maxH - minH * 0.85 || 1)) * 44)+'px'}}
          />
          <span className="tl-trend-day">{d.d}</span>
        </div>
      ))}
    </div>
  );
}

function panelStat(panel){
  if(panel.type === 'weight') return panel.weightDelta || null;
  if(panel.type === 'sleep') return panel.sleepDelta || null;
  return null;
}

function WeeklyPanel({panel, variant}){
  const statOnly = variant === 'wellness-stat';
  const showChart = variant === 'weekly-mood' || variant === 'weekly-trend';
  const stat = panelStat(panel);
  let chart = null;

  if(showChart){
    if(panel.type === 'mood'){
      chart = <WeeklyMoodChart data={panel.moodTrend || []}/>;
    } else if(panel.type === 'weight'){
      chart = <WeeklyWeightChart data={panel.weightTrend || []} delta={panel.weightDelta}/>;
    } else if(panel.type === 'sleep'){
      chart = <WeeklySleepChart data={panel.sleepTrend || []}/>;
    }
  }

  return (
    <article className={'tl-weekly-panel tone-'+panel.type+(showChart ? ' has-chart' : ' is-stat-only')}>
      <div className="tl-weekly-panel-head">
        <span className="tl-weekly-panel-icon">{panel.icon || '📊'}</span>
        <span className="tl-weekly-panel-title">{panel.title}</span>
      </div>
      {statOnly && stat && (
        <div className="tl-weekly-panel-stat">{stat}</div>
      )}
      {showChart && chart && (
        <div className="tl-weekly-panel-chart">{chart}</div>
      )}
      {panel.summary && (
        <p className="tl-weekly-panel-summary">{panel.summary}</p>
      )}
    </article>
  );
}

function WeeklyTrendCard({item}){
  const panels = item.panels?.length ? item.panels : buildWeeklyPanels(item);
  const overview = item.overview || item.analysis || '';
  const isWellness = item.kind === 'wellness';
  const [open, setOpen] = React.useState(false);

  const recKind = window.inferRecordKind?.(item) || { kind:'ai', label:'AI 分析' };

  if(isWellness){
    return (
      <div className="tl-weekly-bubble is-wellness">
        <div className="tl-weekly-surface">
          <TlRecCardHead time={item.time} kind={recKind.kind} label={recKind.label}/>
          {overview && <p className="tl-weekly-overview">{overview}</p>}
          {panels.length > 0 && (
            <div className="tl-weekly-stack-inline">
              {panels.map(p=>(
                <WeeklyPanel key={p.id || p.type} panel={p} variant="wellness-stat"/>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const moodPanel = panels.find(p => p.type === 'mood');
  const trendPanels = panels.filter(p => p.type !== 'mood');
  const hasExpand = trendPanels.length > 0;

  return (
    <div className={'tl-weekly-bubble'+(open ? ' is-open' : '')}>
      <div className="tl-weekly-surface">
        <TlRecCardHead time={item.time} kind={recKind.kind} label={recKind.label}/>
        {overview && <p className="tl-weekly-overview">{overview}</p>}
        {moodPanel && (
          <div className="tl-weekly-stack-inline">
            <WeeklyPanel panel={moodPanel} variant="weekly-mood"/>
          </div>
        )}
      </div>
      {hasExpand && (
        <>
          <div className="tl-weekly-detail">
            {trendPanels.map(p=>(
              <WeeklyPanel key={p.id || p.type} panel={p} variant="weekly-trend"/>
            ))}
          </div>
          <button
            type="button"
            className="tl-weekly-toggle"
            onClick={()=>setOpen(v=>!v)}
            aria-expanded={open}
          >
            <span className="tl-weekly-toggle-label">{open ? '收起' : '展开'}</span>
            <span className="tl-weekly-chev" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={open ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'}/>
              </svg>
            </span>
          </button>
        </>
      )}
    </div>
  );
}

function TlNodeCaption({time, label, labelKind}){
  if(!time && !label) return null;
  return (
    <div className="tl-node-caption">
      {time && <span className="tl-node-time">{time}</span>}
      {time && label && <span className="tl-node-sep" aria-hidden="true">·</span>}
      {label && (
        <span className={'tl-node-label'+(labelKind ? ' kind-'+labelKind : '')}>{label}</span>
      )}
    </div>
  );
}

function getNodeCaption(item, sisterItem){
  if(item.cardLabel || item.cardLabelKind){
    return {
      label: item.cardLabel,
      kind: item.cardLabelKind,
    };
  }
  if(sisterItem){
    return { label:'本次周期分析', kind:'ai' };
  }
  if(item.kind === 'sister-card'){
    return { label:'本次周期分析', kind:'ai' };
  }
  if(item.kind === 'weekly'){
    const range = item.range ? ' · '+item.range : '';
    return { label:'周报'+range, kind:'weekly' };
  }
  return null;
}

function TimelineItemWrap({item, children}){
  return (
    <div className="tl-node-stack">
      {children}
    </div>
  );
}

function TimelineItem({item, sisterItem, isNew, phaseKind, isFeedLast, sisterPlayAnimation, onSisterCycleComplete}){
  const cycleDay = item.cycleDay;
  const guideAnimate = item.kind === 'guide' && (
    isNew || item.hiddenUntilSisterDone
  );

  let body = null;
  if(item.kind === 'record-group'){
    body = <V3RecordGroupCard group={item} isNew={isNew}/>;
  } else if(item.kind === 'guide'){
    body = <TodayGuideCard item={item} isNew={isNew} animate={guideAnimate}/>;
  } else if(item.kind === 'weekly' || item.kind === 'wellness'){
    body = <WeeklyTrendCard item={item}/>;
  } else if(item.kind === 'voice-card' || item.kind === 'sync-card'){
    body = (
      <VoiceRecordCard
        entry={item}
        isNew={isNew}
        animateAnalysis={isFeedLast}
        analysisProps={sisterItem ? {
          playAnimation: sisterPlayAnimation,
          onCycleComplete: onSisterCycleComplete,
        } : null}
      />
    );
  } else if(item.kind === 'sister-card'){
    body = (
      <SisterAnalysisCard
        item={item}
        playAnimation={sisterPlayAnimation}
        onCycleComplete={onSisterCycleComplete}
      />
    );
  } else if(item.module) {
    body = (
      <div className="tl-rec-group">
        <RecordCard entry={item} isNew={isNew} typewriterAiNote={!!(isNew && item.aiNote)}/>
        <ModulePlaceholder mod={item.module} cycleDay={cycleDay || item.module.cycleDay}/>
      </div>
    );
  } else {
    body = (
      <RecordCard
        entry={item}
        isNew={isNew}
        typewriterAiNote={!!(isNew && item.aiNote)}
      />
    );
  }

  return (
    <TimelineRailNode
      phaseKind={phaseKind}
      railDot={item.railDot || sisterItem?.railDot || (item.kind === 'sister-card' ? 'ai' : (item.ai && !item.primary ? 'ai' : undefined))}
      isFeedLast={isFeedLast}
      nodeKind={item.kind === 'record-group' ? (item.ai && !item.primary ? 'sister-card' : 'voice-card') : (sisterItem ? (item.kind === 'sync-card' ? 'sync-card' : 'voice-card') : item.kind)}
    >
      <TimelineItemWrap item={item}>{body}</TimelineItemWrap>
    </TimelineRailNode>
  );
}

Object.assign(window, {
  CycleDayHeader, TimelineRailNode, TlNodeCaption, summarizeDayItems,
  resolveDayTitleLabel, formatDayMeta,
  ModulePlaceholder, TodayGuideCard, WeeklyTrendCard, TimelineItem,
});
