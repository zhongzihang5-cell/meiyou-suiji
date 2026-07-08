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
  // 始终动态计算，不使用写死的 summaryStats

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
  if(kcal > 0) stats.push({ v: String(Math.round(kcal)), l: 'kcal' });
  if(weight != null) stats.push({ v: weight.toFixed(1), l: 'kg' });

  return { count, kcal, weight, stats };
}

function resolveDayTitleLabel(day){
  const { month, day: dayNum } = parseDayParts(day.date);
  return `${month}月${dayNum}日`;
}

function formatDayMeta(day){
  return day.weekday || '';
}

function CycleDayHeader({day, items, dayBlocks}){
  const title = resolveDayTitleLabel(day, dayBlocks);
  const meta = formatDayMeta(day, title);

  return (
    <div className={'tl-day-summary'+(day.isToday ? ' is-today' : '')}>
      <div className="tl-day-summary-top">
        <span className="tl-day-summary-title">{title}</span>
        {meta && <span className="tl-day-summary-meta">{meta}</span>}
      </div>
    </div>
  );
}

function TimelineRailNode({phaseKind, railDot, isFeedLast, nodeKind, children, dropAnim, onDropLand, onDropComplete}){
  const dotCls = railDot === 'ai'
    ? ' ai'
    : (railDot ? ' '+railDot : (phaseKind ? ' '+phaseKind : ''));
  const RecordBlankAxisDropAnim = window.RecordBlankAxisDropAnim;
  const isDrop = !!dropAnim;
  return (
    <div className={'tl-rail-node'+(isFeedLast?' is-feed-last':'')+(nodeKind==='guide'?' is-guide':'')+(isDrop?' is-axis-drop':'')}>
      <div className="tl-rail-marker" aria-hidden="true">
        {isDrop && RecordBlankAxisDropAnim ? (
          <RecordBlankAxisDropAnim onLand={onDropLand} onComplete={onDropComplete}/>
        ) : (
          <span className={'tl-rail-dot'+dotCls}/>
        )}
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
  const scrollFeed = window.scrollFeedContentIntoView;
  const textRef = React.useRef(null);
  const skipDelay = !!(item.skipRevealDelay || item.alwaysShow);
  const [ready, setReady] = React.useState(!animate || skipDelay);

  React.useEffect(()=>{
    if(!animate){
      setReady(true);
      return;
    }
    if(skipDelay){
      setReady(true);
      return;
    }
    setReady(false);
    const t = setTimeout(()=>setReady(true), GUIDE_REVEAL_DELAY_MS);
    return ()=>clearTimeout(t);
  }, [animate, item.text, skipDelay]);

  React.useEffect(()=>{
    if(!ready || !animate) return;
    requestAnimationFrame(()=>{
      scrollFeed?.(textRef.current);
    });
  }, [ready, animate, scrollFeed]);

  if(!ready) return null;

  return (
    <div className={'tl-rail-guide'+(isNew?' fade-in':'')}>
      <p className="tl-rail-guide-text" ref={textRef}>
        {animate ? (
          <TypewriterText text={item.text} active charMs={GUIDE_TYPEWRITER_MS} followScroll/>
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

  if(isWellness){
    return (
      <div className="tl-weekly-bubble is-wellness">
        <div className="tl-weekly-surface">
          <TlRecCardHead time={item.time}/>
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
        <TlRecCardHead time={item.time}/>
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

function MoodCurveChart({data, animateToday = false, onTodayAnimated}){
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
  const gradId = React.useId().replace(/:/g, '');
  const wrapRef = React.useRef(null);
  const doneRef = React.useRef(false);
  const allData = data || [];

  const toPoint = (d, i)=>{
    const x = padX + (innerW * i) / Math.max(1, (allData.length - 1));
    const y = padTop + innerH - ((d.v - minV) / range) * innerH;
    return { x, y, d };
  };

  const allPoints = allData.map(toPoint);

  const pathFrom = pts => pts.length
    ? pts.map((p, i)=>(i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ')
    : '';
  const areaFrom = pts => {
    if(!pts.length) return '';
    const line = pathFrom(pts);
    const last = pts[pts.length - 1];
    const first = pts[0];
    const floor = padTop + innerH;
    return `${line} L${last.x.toFixed(1)},${floor} L${first.x.toFixed(1)},${floor} Z`;
  };

  const fullLine = pathFrom(allPoints);
  const fullArea = areaFrom(allPoints);
  const pointCount = allPoints.length;
  const axisFinishMs = 80 + Math.max(0, pointCount - 1) * 92 + 340;
  const revealMs = animateToday ? Math.max(880, 120 + pointCount * 100, axisFinishMs) : 0;

  React.useEffect(()=>{
    if(!animateToday) return;
    doneRef.current = false;
    requestAnimationFrame(()=>{
      window.scrollFeedContentIntoView?.(wrapRef.current);
    });
    const t = setTimeout(()=>{
      if(doneRef.current) return;
      doneRef.current = true;
      onTodayAnimated?.();
    }, revealMs + 80);
    return ()=>clearTimeout(t);
  }, [animateToday, onTodayAnimated, revealMs, allData]);

  return (
    <div
      ref={wrapRef}
      className={'tl-mood-curve' + (animateToday ? ' is-anim' : '')}
      style={animateToday ? { '--mood-reveal-ms': revealMs + 'ms' } : undefined}
      aria-hidden="true"
    >
      <div className="tl-mood-curve-reveal">
        <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
          <defs>
            <linearGradient id={'moodCurveFill' + gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff4d88" stopOpacity="0.22"/>
              <stop offset="100%" stopColor="#ff4d88" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {fullArea && (
            <path d={fullArea} fill={'url(#moodCurveFill' + gradId + ')'}/>
          )}
          {fullLine && (
            <path
              d={fullLine}
              fill="none"
              stroke="#ff4d88"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {allPoints.map((p, i)=>(
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
      </div>
      <div className="tl-mood-curve-axis">
        {allData.map((d, i)=>(
          <span
            key={i}
            className={'tl-mood-curve-day'
              + (d.isToday ? ' is-today' : '')
              + (animateToday ? ' is-reveal' : '')}
            style={animateToday ? { '--day-i': i } : undefined}
          >
            {d.d}
          </span>
        ))}
      </div>
    </div>
  );
}

function MoodBandChart({data, animateToday = false, onTodayAnimated}){
  const allData = data || [];
  const W = 320;
  const H = 138;
  const PAD_L = 36;
  const PAD_R = 14;
  const PAD_T = 6;
  const PAD_B = 22;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const minV = 1;
  const maxV = 5;
  const range = maxV - minV;
  const DOT_R = 4.2;
  const INNER_PAD = DOT_R + 1.5;
  const plotTop = PAD_T + INNER_PAD;
  const plotBottom = PAD_T + innerH - INNER_PAD;
  const plotRange = plotBottom - plotTop;

  // 三档分界：积极 v>=3.5, 一般 2.5<=v<3.5, 消极 v<2.5
  const vToY = v => PAD_T + innerH - ((v - minV) / range) * innerH;
  // 折线/圆点专用：内缩 DOT_R+ 让圆点不溢出色块
  const pointVToY = v => plotBottom - ((v - minV) / range) * plotRange;
  const yPos = vToY(3.5);
  const yNeu = vToY(2.5);
  const yBottom = PAD_T + innerH;

  const wrapRef = React.useRef(null);
  const doneRef = React.useRef(false);

  const points = allData.map((d, i)=>{
    const x = PAD_L + (innerW * i) / Math.max(1, (allData.length - 1));
    const y = pointVToY(d.v);
    return { x, y, d };
  });
  const line = points.length
    ? points.map((p, i)=>(i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ')
    : '';
  const revealMs = animateToday ? 900 + points.length * 80 : 0;

  React.useEffect(()=>{
    if(!animateToday) return;
    doneRef.current = false;
    requestAnimationFrame(()=>{
      window.scrollFeedContentIntoView?.(wrapRef.current);
    });
    const t = setTimeout(()=>{
      if(doneRef.current) return;
      doneRef.current = true;
      onTodayAnimated?.();
    }, revealMs + 80);
    return ()=>clearTimeout(t);
  }, [animateToday, onTodayAnimated, revealMs, allData]);

  const labelY = vToY;
  const bandFill = {
    positive: '#FFF1C7',
    neutral:  '#E2ECFB',
    negative: '#FFD9E1',
  };

  return (
    <div
      ref={wrapRef}
      className={'tl-mood-band' + (animateToday ? ' is-anim' : '')}
      style={animateToday ? { '--mood-reveal-ms': revealMs + 'ms' } : undefined}
      aria-hidden="true"
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none">
        <rect x={PAD_L} y={PAD_T} width={innerW} height={yPos - PAD_T} fill={bandFill.positive}/>
        <rect x={PAD_L} y={yPos} width={innerW} height={yNeu - yPos} fill={bandFill.neutral}/>
        <rect x={PAD_L} y={yNeu} width={innerW} height={yBottom - yNeu} fill={bandFill.negative}/>

        <text x={PAD_L - 8} y={labelY(4.5)} textAnchor="end" dominantBaseline="central"
          fontSize="11" fontFamily="PingFang SC, -apple-system, sans-serif" fill="#8E8E93">积极</text>
        <text x={PAD_L - 8} y={labelY(3)} textAnchor="end" dominantBaseline="central"
          fontSize="11" fontFamily="PingFang SC, -apple-system, sans-serif" fill="#8E8E93">一般</text>
        <text x={PAD_L - 8} y={labelY(1.5)} textAnchor="end" dominantBaseline="central"
          fontSize="11" fontFamily="PingFang SC, -apple-system, sans-serif" fill="#8E8E93">消极</text>

        {line && (
          <path
            d={line}
            fill="none"
            stroke="#ff4d88"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {points.map((p, i)=>(
          <circle
            key={i}
            cx={p.x.toFixed(1)}
            cy={p.y.toFixed(1)}
            r={DOT_R}
            fill="#ff4d88"
            stroke="#fff"
            strokeWidth="1.6"
          />
        ))}
      </svg>
      <div className="tl-mood-band-axis" style={{ paddingLeft: PAD_L, paddingRight: PAD_R }}>
        {allData.map((d, i)=>(
          <span key={i} className={'tl-mood-band-day' + (d.isToday ? ' is-today' : '')}>
            {d.d}
          </span>
        ))}
      </div>
    </div>
  );
}

const MOOD_GUIDE_AFTER_CHART_MS = 900;

function MoodInsightCard({item, isNew}){
  const TypewriterText = window.TypewriterText;
  const scrollFeed = window.scrollFeedContentIntoView;
  const cardRef = React.useRef(null);
  const [aiOpen, setAiOpen] = React.useState(true);
  const [step, setStep] = React.useState(isNew ? 0 : 10);
  const doneRef = React.useRef(false);

  const primary = item.primaryMood || (item.moods && item.moods[0]);
  const moodLabel = primary?.label || '愉快';
  const chart = item.chart || {};
  const analysisCopy = item.analysisCopy || '';
  const hasAi = !!(analysisCopy || chart.data?.length > 0);
  const hasTodayPoint = !!(chart.data || []).some(d => d.isToday);
  const chartAnimatesToday = isNew && hasTodayPoint;
  const [chartDone, setChartDone] = React.useState(!chartAnimatesToday);

  React.useEffect(()=>{
    if(!isNew || step < 1) return;
    requestAnimationFrame(()=>{
      scrollFeed?.(cardRef.current);
    });
  }, [step, isNew, scrollFeed]);

  React.useEffect(()=>{
    if(!isNew) return;
    setChartDone(!chartAnimatesToday);
    doneRef.current = false;
    const ts = [
      setTimeout(()=>setStep(1), 80),
      setTimeout(()=>setStep(2), 600),
      setTimeout(()=>setStep(3), 1200),
      setTimeout(()=>setStep(4), 1600),
    ];
    return ()=>ts.forEach(clearTimeout);
  }, [isNew, chartAnimatesToday]);

  React.useEffect(()=>{
    if(!isNew || step !== 4) return;
    const t = setTimeout(()=>setStep(5), 300);
    return ()=>clearTimeout(t);
  }, [step, isNew]);

  const handleChartTodayAnimated = React.useCallback(()=>{
    setChartDone(true);
  }, []);

  React.useEffect(()=>{
    if(!isNew || doneRef.current) return;
    const targetStep = hasAi ? 5 : 3;
    if(step < targetStep) return;
    if(chartAnimatesToday && step >= 5 && !chartDone) return;
    doneRef.current = true;
    const t = setTimeout(()=>{
      window.dispatchEvent(new CustomEvent('moodCardStreamDone'));
    }, chartAnimatesToday ? MOOD_GUIDE_AFTER_CHART_MS : 500);
    return ()=>clearTimeout(t);
  }, [step, isNew, hasAi, chartAnimatesToday, chartDone]);

  React.useEffect(()=>{
    if(!isNew || !chartAnimatesToday || chartDone) return;
    const t = setTimeout(()=>setChartDone(true), 2600);
    return ()=>clearTimeout(t);
  }, [isNew, chartAnimatesToday, chartDone]);

  const vis = n => isNew ? {
    opacity: step >= n ? 1 : 0,
    transform: step >= n ? 'translateY(0)' : 'translateY(6px)',
    transition: 'opacity 0.4s ease, transform 0.38s ease',
  } : {};

  return (
    <article className="tl-mood-insight" ref={cardRef}>
      <header className="tl-mood-insight-hd" style={vis(1)}>
        <span className="tl-mood-insight-time">{item.time}</span>
      </header>

      <div className="tl-mood-insight-user" style={vis(2)}>
        <span className="tl-mood-insight-face">
          <img src="assets/record-mood.png" alt="" width={28} height={28} draggable={false}/>
        </span>
        <span className="tl-mood-insight-mood-value">心情：{moodLabel}</span>
      </div>

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
              <span className="tl-period-analysis-spark" aria-hidden="true"/>
            </span>
            <span className="tl-mood-insight-ai-title">近7天情绪变化曲线</span>
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
              {chart.data?.length > 0 && (
                <div className="tl-mood-insight-chart-block">
                  <MoodBandChart
                    data={chart.data}
                    animateToday={chartAnimatesToday}
                    onTodayAnimated={handleChartTodayAnimated}
                  />
                </div>
              )}
              {analysisCopy && (
                <div className="tl-mood-insight-analysis-copy">
                  {(isNew && TypewriterText)
                    ? <TypewriterText text={analysisCopy} active charMs={55} followScroll/>
                    : analysisCopy}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function BabyFeedingTimelineCard({item, isNew}){
  const TypewriterText = window.TypewriterText;
  const [summaryOpen, setSummaryOpen] = React.useState(item.summaryOpen !== false);
  const title = item.feedType || '配方奶';
  const value = item.value || (item.amount ? item.amount + 'ml' : '60ml');
  const text = item.text || `${title}：${value}`;
  const icon = item.icon || '🍼';
  const color = item.color || '#FF7A66';
  const summary = item.summary;

  React.useEffect(()=>{
    setSummaryOpen(item.summaryOpen !== false);
  }, [item.id, item.summaryOpen]);

  return (
    <article className={'tl-baby-feeding-card'+(isNew ? ' is-stream fade-in' : '')}>
      <div className="tl-baby-feed-head">
        <span className="tl-baby-feed-time">{item.time || '08:15'}</span>
        {item.voice?.duration ? <span className="tl-baby-feed-voice">{item.voice.duration}</span> : null}
      </div>
      <div className="tl-baby-feed-main">
        <span className="tl-baby-feed-icon" style={{background: color}}>{icon}</span>
        <span className="tl-baby-feed-text">
          {isNew && TypewriterText ? (
            <TypewriterText text={text} active charMs={55} followScroll/>
          ) : text}
        </span>
      </div>
      <div className="tl-baby-feed-tags">
        <span className="tl-baby-feed-tag-main">小豆苗</span>
        {item.relativeTime ? <span className="tl-baby-feed-chip is-ago">{item.relativeTime}</span> : null}
      </div>
      {item.voiceQuote && (
        <div className="tl-baby-feed-source">
          <span className="tl-baby-feed-source-mic">🎙</span>
          <span className="tl-baby-feed-source-text">"{item.voiceQuote}"</span>
        </div>
      )}
      {summary && (
        <div className={'tl-baby-feed-summary'+(summaryOpen ? ' is-open' : '')}>
          <button
            type="button"
            className="tl-baby-feed-summary-toggle"
            aria-expanded={summaryOpen}
            onClick={()=>setSummaryOpen(v=>!v)}
          >
            <span className="tl-baby-feed-summary-spark" aria-hidden="true">✦</span>
            <span className="tl-baby-feed-summary-title">{summary.title || '喂养小结'}</span>
            <span className={'tl-baby-feed-summary-chev'+(summaryOpen ? ' is-open' : '')} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M6 15l6-6 6 6"/>
              </svg>
            </span>
          </button>
          <div className={'tl-baby-feed-summary-panel'+(summaryOpen ? ' is-open' : '')} aria-hidden={!summaryOpen}>
            {Array.isArray(summary.items) && summary.items.length ? (
              <div className="tl-baby-feed-summary-grid">
                {summary.items.map((row, index)=>(
                  <span
                    key={row.label || index}
                    className={'tl-baby-feed-summary-item'+(row.wide ? ' is-wide' : '')}
                  >
                    <i style={{background: row.color || '#ff6f91'}} aria-hidden="true"/>
                    <span className="tl-baby-feed-summary-copy">
                      <b>{row.label}</b>
                      <em>{row.value}</em>
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              <span className="tl-baby-feed-summary-text">{summary.text}</span>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

function TimelineItem({item, sisterItem, isNew, phaseKind, isFeedLast, sisterPlayAnimation, onSisterCycleComplete, firstDropAnim, onFirstDropLand, onFirstDropComplete}){
  const cycleDay = item.cycleDay;
  const guideAnimate = item.kind === 'guide' && !item.noAnimate && (
    isNew || item.hiddenUntilSisterDone
  );

  let body = null;
  if(item.kind === 'diet-photo-feedback'){
    const DietPhotoFeedbackCard = window.DietPhotoFeedbackCard;
    body = item.pendingDrop ? null : (
      DietPhotoFeedbackCard
        ? <DietPhotoFeedbackCard
            photoUrl={item.photoUrl}
            data={item.dietData}
            userContext={item.userContext}
            isNew={isNew}
            recognitionScenario={item.recognitionScenario}
            recognitionState={item.recognitionState}
            failureCount={item.failureCount}
            displayScenario={item.displayScenario}
          />
        : null
    );
  } else if(item.kind === 'diet-text-feedback'){
    const DietTextFeedbackCard = window.DietTextFeedbackCard;
    body = item.pendingDrop ? null : (
      DietTextFeedbackCard
        ? <DietTextFeedbackCard
            sourceText={item.sourceText}
            sourceVoice={item.sourceVoice}
            data={item.dietData}
            userContext={item.userContext}
            isNew={isNew}
            displayScenario={item.displayScenario}
            leadingIconSrc={item.leadingIconSrc}
            leadingLabel={item.leadingLabel}
          />
        : null
    );
  } else if(item.kind === 'record-group'){
    body = item.pendingDrop ? null : <V3RecordGroupCard group={item} isNew={isNew}/>;
  } else if(item.kind === 'guide'){
    body = <TodayGuideCard item={item} isNew={isNew} animate={guideAnimate}/>;
  } else if(item.kind === 'mood-insight'){
    body = item.pendingDrop ? null : <MoodInsightCard item={item} isNew={isNew}/>;
  } else if(item.kind === 'baby-feeding-card'){
    body = <BabyFeedingTimelineCard item={item} isNew={isNew}/>;
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
          analysisKind: sisterItem.analysisKind || item.analysisKind,
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
        hideBodyUntilDrop={item.hideBodyUntilDrop}
      />
    );
  }

  const isDropTarget = firstDropAnim?.entryId === item.id;

  return (
    <TimelineRailNode
      phaseKind={phaseKind}
      railDot={item.railDot || sisterItem?.railDot || (item.kind === 'sister-card' ? 'ai' : (item.ai && !item.primary ? 'ai' : undefined))}
      isFeedLast={isFeedLast}
      nodeKind={item.kind === 'record-group' ? (item.ai && !item.primary ? 'sister-card' : 'voice-card') : (sisterItem ? (item.kind === 'sync-card' ? 'sync-card' : 'voice-card') : item.kind)}
      dropAnim={isDropTarget}
      onDropLand={isDropTarget ? onFirstDropLand : undefined}
      onDropComplete={isDropTarget ? onFirstDropComplete : undefined}
    >
      <TimelineItemWrap item={item}>{body}</TimelineItemWrap>
    </TimelineRailNode>
  );
}

Object.assign(window, {
  CycleDayHeader, TimelineRailNode, TlNodeCaption, summarizeDayItems,
  resolveDayTitleLabel, formatDayMeta,
  ModulePlaceholder, TodayGuideCard, WeeklyTrendCard, TimelineItem,
  MoodInsightCard, MoodCurveChart, MoodBandChart, BabyFeedingTimelineCard,
});
