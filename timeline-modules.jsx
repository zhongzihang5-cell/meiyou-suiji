// ============ 时间轴模块占位 & 场景卡片 ============

function parseDayParts(dateStr){
  const [m, d] = (dateStr || '').split('/');
  return { month: m || '', day: d || '' };
}

function CycleDayHeader({day}){
  const { month, day: dayNum } = parseDayParts(day.date);
  const phaseCls = day.phaseKind || '';

  return (
    <div className="tl-day-banner">
      <div className="tl-day-banner-top">
        <div className="tl-day-banner-left">
          <span className="tl-day-big">{dayNum}</span>
          <div className="tl-day-meta">
            <span className="tl-day-month">{month}月</span>
            <span className="tl-day-week">
              {day.weekday}{day.isToday ? ' · 今天' : ''}
            </span>
          </div>
        </div>
        {day.phaseTag && (
          <span className={'tl-cycle-chip '+phaseCls}>{day.phaseTag}</span>
        )}
      </div>
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

<<<<<<< Updated upstream
function TodayGuideCard({item, isNew}){
=======
const GUIDE_REVEAL_DELAY_MS = 1800;
const GUIDE_TYPEWRITER_MS = 84;

function TodayGuideCard({item, isNew, animate}){
  const [ready, setReady] = React.useState(!animate);
  const delay = item.guideDelay !== undefined ? item.guideDelay : GUIDE_REVEAL_DELAY_MS;

  React.useEffect(()=>{
    if(!animate){
      setReady(true);
      return;
    }
    setReady(false);
    const t = setTimeout(()=>setReady(true), delay);
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

>>>>>>> Stashed changes
  return (
    <div className={'tl-rail-guide'+(isNew?' fade-in':'')}>
      <p className="tl-rail-guide-text">{item.text}</p>
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

  if(isWellness){
    return (
      <div className="tl-weekly-bubble is-wellness">
        <div className="tl-weekly-surface">
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

function getNodeCaption(item){
  if(item.cardLabel || item.cardLabelKind){
    return {
      label: item.cardLabel,
      kind: item.cardLabelKind,
    };
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
  const cap = getNodeCaption(item);
  const showCaption = item.kind !== 'guide';
  return (
    <div className="tl-node-stack">
      {showCaption && (
        <TlNodeCaption
          time={item.time}
          label={cap?.label}
          labelKind={cap?.kind}
        />
      )}
      {children}
    </div>
  );
}

<<<<<<< Updated upstream
function TimelineItem({item, isNew, phaseKind, isFeedLast, sisterPlayAnimation, onSisterCycleComplete}){
=======
function MoodCurveChart({data}){
  const w = 280;
  const h = 64;
  const padX = 14;
  const padTop = 8;
  const padBot = 22;
  const minV = 1;
  const maxV = 5;
  const range = maxV - minV;
  const innerW = w - padX * 2;
  const innerH = h - padTop - padBot;
  const points = (data || []).map((d, i)=>{
    const x = padX + (innerW * i) / Math.max(1, (data.length - 1));
    const y = padTop + innerH - ((d.v - minV) / range) * innerH;
    return { x, y, d };
  });
  const linePath = points.length ? points.map((p, i)=>(i===0?'M':'L')+p.x.toFixed(1)+','+p.y.toFixed(1)).join(' ') : '';
  const areaPath = points.length
    ? `${linePath} L${points[points.length-1].x.toFixed(1)},${padTop + innerH} L${points[0].x.toFixed(1)},${padTop + innerH} Z`
    : '';

  return (
    <div className="tl-mood-curve" aria-hidden="true">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
        <defs>
          <linearGradient id="moodCurveFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff4d88" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="#ff4d88" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {areaPath && <path d={areaPath} fill="url(#moodCurveFill)"/>}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="#ff4d88"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {points.map((p, i)=>(
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.d.isToday ? 4 : 2.2}
            fill={p.d.isToday ? '#ff4d88' : '#fff'}
            stroke={p.d.isToday ? '#fff' : '#ff4d88'}
            strokeWidth={p.d.isToday ? 1.5 : 1.4}
          />
        ))}
      </svg>
      <div className="tl-mood-curve-axis">
        {(data || []).map((d, i)=>(
          <span
            key={i}
            className={'tl-mood-curve-day'+(d.isToday ? ' is-today' : '')}
          >
            {d.d}
          </span>
        ))}
      </div>
    </div>
  );
}

function MoodInsightCard({item, isNew}){
  const MoodFace = window.MoodFace;
  const TypewriterText = window.TypewriterText;
  const [aiOpen, setAiOpen] = React.useState(true);
  // step: 0=hidden, 1=header, 2=user, 3=AI toggle, 4=AI body(typewriter), 5=chart, 10=all(non-stream)
  const [step, setStep] = React.useState(isNew ? 0 : 10);
  const doneRef = React.useRef(false);

  const primary = item.primaryMood || (item.moods && item.moods[0]);
  const moodLabel = primary?.label || '愉快';
  const chart = item.chart || {};
  const phaseCopy = item.phaseCopy || '';
  const hasAi = !!(phaseCopy || chart.data?.length > 0);

  // sequential section reveal
  React.useEffect(()=>{
    if(!isNew) return;
    const ts = [
      setTimeout(()=>setStep(1), 80),
      setTimeout(()=>setStep(2), 600),
      setTimeout(()=>setStep(3), 1200),
      setTimeout(()=>setStep(4), 1600),
    ];
    return ()=>ts.forEach(clearTimeout);
  }, [isNew]);

  // if no phaseCopy, skip straight to chart after body opens
  React.useEffect(()=>{
    if(!isNew || step !== 4 || phaseCopy) return;
    const t = setTimeout(()=>setStep(5), 300);
    return ()=>clearTimeout(t);
  }, [step, isNew, phaseCopy]);

  const handlePhaseTyped = React.useCallback(()=>{
    setStep(s => Math.max(s, 5));
  }, []);

  // dispatch event when card is fully rendered
  React.useEffect(()=>{
    if(!isNew || doneRef.current) return;
    const targetStep = hasAi ? 5 : 3;
    if(step >= targetStep){
      doneRef.current = true;
      const t = setTimeout(()=>{
        window.dispatchEvent(new CustomEvent('moodCardStreamDone'));
      }, 500);
      return ()=>clearTimeout(t);
    }
  }, [step, isNew, hasAi]);

  const vis = n => isNew ? {
    opacity: step >= n ? 1 : 0,
    transform: step >= n ? 'translateY(0)' : 'translateY(6px)',
    transition: 'opacity 0.4s ease, transform 0.38s ease',
  } : {};

  return (
    <article className="tl-mood-insight">
      {/* ── 时间头 ── */}
      <header className="tl-mood-insight-hd" style={vis(1)}>
        <span className="tl-mood-insight-time">{item.time}</span>
      </header>

      {/* ── 用户记录区 ── */}
      <div className="tl-mood-insight-user" style={vis(2)}>
        <span className="tl-mood-insight-face">
          {primary && MoodFace ? <MoodFace face={primary.face} bg={primary.bg}/> : null}
        </span>
        <span className="tl-mood-insight-mood-value">{moodLabel}</span>
      </div>

      {/* ── 分割线 + AI 折叠区 ── */}
      {hasAi && step >= 3 && (
        <div className="tl-mood-insight-ai-wrap" style={vis(3)}>
          <div className="tl-mood-insight-divider"/>
          <button
            type="button"
            className="tl-mood-insight-ai-toggle"
            onClick={()=>setAiOpen(v=>!v)}
            aria-expanded={aiOpen}
          >
            <span className="tl-mood-insight-ai-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 20V6M4 20h16M8 16v-4M12 16V8M16 16v-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="tl-mood-insight-ai-label">AI</span>
            <span className="tl-mood-insight-ai-title">情绪与周期分析</span>
            <svg
              className="tl-mood-insight-ai-chev"
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              style={{transform: aiOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition:'transform 0.2s'}}
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {aiOpen && step >= 4 && (
            <div className="tl-mood-insight-ai-body">
              {phaseCopy && (
                <div className="tl-mood-insight-phase-row">
                  <span className="tl-mood-insight-phase-pill">卵泡期</span>
                  <span className="tl-mood-insight-phase-text">
                    {(isNew && TypewriterText)
                      ? <TypewriterText text={phaseCopy} active charMs={55} onComplete={handlePhaseTyped}/>
                      : phaseCopy}
                  </span>
                </div>
              )}
              {step >= 5 && chart.data?.length > 0 && (
                <div className="tl-mood-insight-chart-block" style={vis(5)}>
                  <div className="tl-mood-insight-inner-sep"/>
                  <span className="tl-mood-insight-chart-label">{chart.title || '近 1 周情绪波动曲线'}</span>
                  <MoodCurveChart data={chart.data}/>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function TimelineItem({item, sisterItem, isNew, phaseKind, isFeedLast, sisterPlayAnimation, onSisterCycleComplete, firstDropAnim, onFirstDropLand, onFirstDropComplete}){
>>>>>>> Stashed changes
  const cycleDay = item.cycleDay;

  let body = null;
<<<<<<< Updated upstream
  if(item.kind === 'guide'){
    body = <TodayGuideCard item={item} isNew={isNew}/>;
  } else if(item.kind === 'weekly' || item.kind === 'wellness'){
    body = <WeeklyTrendCard item={item}/>;
  } else if(item.kind === 'voice-card'){
    body = <VoiceRecordCard item={item}/>;
=======
  if(item.kind === 'record-group'){
    body = <V3RecordGroupCard group={item} isNew={isNew}/>;
  } else if(item.kind === 'guide'){
    body = <TodayGuideCard item={item} isNew={isNew} animate={guideAnimate}/>;
  } else if(item.kind === 'mood-insight'){
    body = <MoodInsightCard item={item} isNew={isNew}/>;
  } else if(item.kind === 'weekly' || item.kind === 'wellness'){
    body = <WeeklyTrendCard item={item}/>;
  } else if(item.kind === 'voice-card' || item.kind === 'sync-card'){
    body = (
      <VoiceRecordCard
        entry={item}
        isNew={isNew}
        typewriterBody={!!item.streamBody}
        animateAnalysis={isFeedLast}
        analysisProps={sisterItem ? {
          playAnimation: sisterPlayAnimation,
          onCycleComplete: onSisterCycleComplete,
        } : null}
      />
    );
>>>>>>> Stashed changes
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
        <RecordCard entry={item} isNew={isNew}/>
        <ModulePlaceholder mod={item.module} cycleDay={cycleDay || item.module.cycleDay}/>
      </div>
    );
  } else {
    body = <RecordCard entry={item} isNew={isNew}/>;
  }

  return (
    <TimelineRailNode
      phaseKind={phaseKind}
      railDot={item.railDot || (item.kind === 'sister-card' ? 'ai' : undefined)}
      isFeedLast={isFeedLast}
      nodeKind={item.kind}
    >
      <TimelineItemWrap item={item}>{body}</TimelineItemWrap>
    </TimelineRailNode>
  );
}

Object.assign(window, {
  CycleDayHeader, TimelineRailNode, TlNodeCaption,
  ModulePlaceholder, TodayGuideCard, WeeklyTrendCard, TimelineItem,
  MoodInsightCard, MoodCurveChart,
});
