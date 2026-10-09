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
  if(day.relativeLabel) return day.relativeLabel;
  if(day.isToday) return '今天';
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
    <div className={'tl-rail-node'+(isFeedLast?' is-feed-last':'')+(nodeKind==='guide'?' is-guide':'')+(nodeKind==='ai-record-processing'?' is-ai-record-processing':'')+(nodeKind==='inline-record-confirm'?' is-inline-record-confirm':'')+(isDrop?' is-axis-drop':'')}>
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

function buildDietEditPayload(item){
  if(!item || (item.kind !== 'diet-photo-feedback' && item.kind !== 'diet-text-feedback')) return null;
  const data = item.dietData || {};
  const items = Array.isArray(data.items) ? data.items : [];
  const foods = data.foods || items.map(food => food?.name).filter(Boolean);
  const names = foods.length ? foods.join('、') : (item.sourceText || '饮食记录');
  return {
    kind: 'daily-record',
    time: data.time || item.time,
    recordType: 'diet',
    recordLabel: '饮食',
    recordValue: names,
    recordDetail: names,
    icon: 'diet',
    iconText: '',
    dietItems: items.map(food => ({ ...food })),
    totalKcal: data.totalKcal || 0,
    mealType: data.mealType || item.mealType || '',
    photoUrl: item.photoUrl || null,
  };
}

function EditableTimelineBody({item, editPayload, children}){
  const canEdit = !!(editPayload && item?.id && typeof window.openEditModal === 'function');
  const open = React.useCallback((event)=>{
    if(!canEdit) return;
    if(event.target.closest('button,a,input,textarea,select')) return;
    window.openEditModal(item.id, editPayload.kind || item.kind, editPayload);
  }, [canEdit, item?.id, item?.kind, editPayload]);
  const keyOpen = React.useCallback((event)=>{
    if(!canEdit || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    window.openEditModal(item.id, editPayload.kind || item.kind, editPayload);
  }, [canEdit, item?.id, item?.kind, editPayload]);
  if(!canEdit) return children;
  return (
    <div className="tl-edit-hit-area" role="button" tabIndex={0} onClick={open} onKeyDown={keyOpen}>
      {children}
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

function MoodScatterChart({data, animateToday = false, onTodayAnimated}){
  const allData = data || [];
  const W = 320;
  const H = 214;
  const PAD_L = 42;
  const PAD_R = 16;
  const PAD_T = 24;
  const PAD_B = 34;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const wrapRef = React.useRef(null);
  const doneRef = React.useRef(false);
  const currentLabels = allData.filter(point=>point.isCurrent).map(point=>point.label);
  const points = allData.map((point, index)=>({
    ...point,
    index,
    cx:PAD_L + point.x * innerW,
    cy:PAD_T + point.y * innerH,
  }));

  React.useEffect(()=>{
    if(!animateToday) return;
    doneRef.current = false;
    requestAnimationFrame(()=>{
      window.scrollFeedContentIntoView?.(wrapRef.current);
    });
    const timer = setTimeout(()=>{
      if(doneRef.current) return;
      doneRef.current = true;
      onTodayAnimated?.();
    }, 1180);
    return ()=>clearTimeout(timer);
  }, [animateToday, onTodayAnimated, allData]);

  const labelBox = point=>{
    const width = 14 + Math.max(2, point.label.length) * 12;
    const placeLeft = point.x > 0.62;
    const placeBelow = point.y < 0.20;
    const rawX = placeLeft ? point.cx - width - 7 : point.cx + 7;
    const x = Math.max(PAD_L + 2, Math.min(rawX, W - PAD_R - width - 2));
    const y = Math.max(PAD_T + 2, Math.min(placeBelow ? point.cy + 7 : point.cy - 23, PAD_T + innerH - 20));
    return { x, y, width };
  };

  return (
    <div ref={wrapRef} className={'tl-mood-scatter' + (animateToday ? ' is-anim' : '')}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        role="img"
        aria-label={'二维情绪散点图，横轴从愉快到不愉快，纵轴从平静到激动。本次记录：' + currentLabels.join('、')}
      >
        <rect x={PAD_L} y={PAD_T} width={innerW / 2} height={innerH / 2} fill="#fff8df"/>
        <rect x={PAD_L + innerW / 2} y={PAD_T} width={innerW / 2} height={innerH / 2} fill="#fff0f4"/>
        <rect x={PAD_L} y={PAD_T + innerH / 2} width={innerW / 2} height={innerH / 2} fill="#f4f8ff"/>
        <rect x={PAD_L + innerW / 2} y={PAD_T + innerH / 2} width={innerW / 2} height={innerH / 2} fill="#f7f5fb"/>
        <rect x={PAD_L} y={PAD_T} width={innerW} height={innerH} rx="8" fill="none" stroke="rgba(50,50,50,0.10)"/>
        <line x1={PAD_L + innerW / 2} y1={PAD_T} x2={PAD_L + innerW / 2} y2={PAD_T + innerH} stroke="rgba(50,50,50,0.16)" strokeDasharray="3 4"/>
        <line x1={PAD_L} y1={PAD_T + innerH / 2} x2={PAD_L + innerW} y2={PAD_T + innerH / 2} stroke="rgba(50,50,50,0.16)" strokeDasharray="3 4"/>

        <text className="tl-mood-scatter-axis-label" x={PAD_L - 8} y={PAD_T + 5} textAnchor="end">激动</text>
        <text className="tl-mood-scatter-axis-label" x={PAD_L - 8} y={PAD_T + innerH} textAnchor="end">平静</text>
        <text className="tl-mood-scatter-axis-label" x={PAD_L} y={H - 7} textAnchor="start">愉快</text>
        <text className="tl-mood-scatter-axis-label" x={PAD_L + innerW} y={H - 7} textAnchor="end">不愉快</text>

        {points.map(point=>{
          const box = labelBox(point);
          return (
            <g
              key={point.pointId || point.recordId || point.id + '-' + point.index}
              className={'tl-mood-scatter-point' + (point.isCurrent ? ' is-current' : '') + (point.isToday && !point.isCurrent ? ' is-earlier-today' : '')}
              style={animateToday && point.isCurrent ? {'--scatter-i':point.index} : undefined}
            >
              <circle cx={point.cx} cy={point.cy} r={point.isCurrent ? 5.5 : point.isToday ? 4.2 : 3.2}/>
              <rect className="tl-mood-scatter-label-bg" x={box.x} y={box.y} width={box.width} height="19" rx="9.5"/>
              <text className="tl-mood-scatter-point-label" x={box.x + box.width / 2} y={box.y + 13} textAnchor="middle">{point.label}</text>
            </g>
          );
        })}
      </svg>
      {currentLabels.length > 0 && (
        <div className="tl-mood-scatter-current-tags" aria-label={'本次记录情绪：' + currentLabels.join('、')}>
          <span>本次</span>
          {currentLabels.map((label, index)=><b key={label + index}>{label}</b>)}
        </div>
      )}
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
  const moodLabel = (item.moods || []).map(mood=>mood.label).filter(Boolean).join('、') || primary?.label || '愉快';
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
            <span className="tl-mood-insight-ai-title">
              {chart.type === 'scatter' ? (chart.title || '近7天情绪散点图') : '近7天情绪变化曲线'}
            </span>
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
                  {chart.type === 'scatter' ? (
                    <MoodScatterChart
                      data={chart.data}
                      animateToday={chartAnimatesToday}
                      onTodayAnimated={handleChartTodayAnimated}
                    />
                  ) : (
                    <MoodBandChart
                      data={chart.data}
                      animateToday={chartAnimatesToday}
                      onTodayAnimated={handleChartTodayAnimated}
                    />
                  )}
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

function BabySleepWeekComboChart({data}){
  const durations = data?.durations || [];
  const symptoms = data?.symptoms || [];
  const width = 318;
  const height = 238;
  const left = 49;
  const right = 306;
  const barTop = 25;
  const barBottom = 115;
  const maxHours = 12;
  const xAt = index=>left + ((right-left)/Math.max(durations.length-1,1))*index;
  const yAt = hours=>barBottom - (hours/maxHours)*(barBottom-barTop);
  const symptomRows = ['夜醒','哭闹','鼻塞'];
  const symptomY = type=>155 + symptomRows.indexOf(type)*26;
  return <section className="tl-baby-sleep-combo" aria-label="近7天宝宝睡眠时长和症状" onClick={event=>event.stopPropagation()}>
    <header className="tl-baby-sleep-combo-head"><strong>近7天宝宝睡眠</strong><span>睡眠时长 + 同期症状</span></header>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="近7天宝宝睡眠时长柱状图和症状散点图">
      <text className="tl-baby-sleep-section" x={left} y="12">睡眠时长</text>
      {[12,8,4].map(tick=>{
        const y=yAt(tick);
        return <g key={tick}><line className="tl-baby-sleep-gridline" x1={left} x2={right} y1={y} y2={y}/><text className="tl-baby-sleep-axis" x={left-7} y={y+3} textAnchor="end">{tick}h</text></g>;
      })}
      {durations.map((day,index)=>{
        const x=xAt(index);
        const y=yAt(day.hours);
        return <g key={`${day.label}-${index}`}>
          <rect className={'tl-baby-sleep-bar'+(day.isToday?' is-today':'')} x={x-9} y={y} width="18" height={barBottom-y} rx="7"/>
          {day.isToday ? <text className="tl-baby-sleep-value" x={x} y={Math.max(y-7,18)} textAnchor="middle">{day.hours.toFixed(1)}h</text> : null}
        </g>;
      })}
      <line className="tl-baby-sleep-divider" x1={left} x2={right} y1="132" y2="132"/>
      <text className="tl-baby-sleep-section" x={left} y="145">同期症状</text>
      {symptomRows.map(type=>{
        const y=symptomY(type);
        return <g key={type}><text className="tl-baby-sleep-row-label" x={left-7} y={y+3} textAnchor="end">{type}</text><line className="tl-baby-sleep-rowline" x1={left} x2={right} y1={y} y2={y}/></g>;
      })}
      {symptoms.map((event,index)=>{
        const x=xAt(event.dayIndex);
        const y=symptomY(event.type);
        if(y<155) return null;
        return <g key={`${event.type}-${event.dayIndex}-${index}`}>
          <line className="tl-baby-sleep-sync" x1={x} x2={x} y1={barBottom+3} y2={y-6}/>
          <circle className={'tl-baby-sleep-symptom'+(event.isToday?' is-today':'')} cx={x} cy={y} r={event.isToday?5:4.3} fill={event.color}/>
        </g>;
      })}
      {durations.map((day,index)=><text key={day.label} className={'tl-baby-sleep-day'+(day.isToday?' is-today':'')} x={xAt(index)} y="231" textAnchor="middle">{day.label}</text>)}
    </svg>
  </section>;
}

function BabyFeedingFeedbackModule({feedback, open}){
  if(!feedback) return null;
  const renderMetrics = ()=>feedback.metrics?.length ? (
    <div className="tl-baby-feedback-metrics">
      {feedback.metrics.map((metric,index)=>(
        <span className="tl-baby-feedback-metric" key={`${metric.label}-${index}`}>
          <i style={{background:metric.color || undefined}} aria-hidden="true" />
          <em>{metric.label}</em><b>{metric.value}</b>
        </span>
      ))}
    </div>
  ) : null;
  const renderVisual = ()=>{
    if(feedback.kind === 'milk' || feedback.kind === 'pump'){
      return (
        <div className="tl-baby-feedback-clock" aria-label="24小时记录分布">
          <div className="tl-baby-feedback-clock-labels"><span>0</span><span>6</span><span>12</span><span>18</span><span>24时</span></div>
          <div className="tl-baby-feedback-clock-track">
            {(feedback.timeline || []).map((point,index)=><i key={`${point.time}-${index}`} style={{left:`${Math.max(1,Math.min(99,(point.minute || 0) / 14.4))}%`,background:point.color}} title={`${point.time} ${point.label || ''}`} />)}
          </div>
        </div>
      );
    }
    if(feedback.kind === 'sleep'){
      return (
        <div className="tl-baby-feedback-sleep" aria-label="24小时睡眠分布">
          <div className="tl-baby-feedback-clock-labels"><span>0</span><span>6</span><span>12</span><span>18</span><span>24时</span></div>
          <div className="tl-baby-feedback-sleep-track">
            {(feedback.segments || []).map((segment,index)=><i key={index} style={{left:`${Math.max(0,Math.min(99,segment.start / 14.4))}%`,width:`${Math.max(2,Math.min(100-segment.start/14.4,segment.duration / 14.4))}%`}} />)}
          </div>
        </div>
      );
    }
    if(feedback.kind === 'diaper'){
      const total = Math.max(feedback.composition?.total || 0,1);
      const poop = Math.round(((feedback.composition?.poop || 0) / total) * 100);
      const wet = Math.round(((feedback.composition?.wet || 0) / total) * 100);
      return (
        <div className="tl-baby-feedback-composition">
          <div className="tl-baby-feedback-composition-track"><i style={{width:`${poop}%`}}/><i className="is-wet" style={{width:`${wet}%`}}/></div>
          <span>每次记录都已汇总到今日排泄情况</span>
        </div>
      );
    }
    if(feedback.kind === 'supplement'){
      return (
        <div className="tl-baby-feedback-week" aria-label="近7日补剂记录">
          {(feedback.days || []).map((day,index)=><span key={index} className={(day.recorded ? 'is-recorded ' : '')+(day.isToday ? 'is-today' : '')}><i>{day.recorded ? '✓' : ''}</i><em>{day.label}</em></span>)}
        </div>
      );
    }
    if(feedback.kind === 'water'){
      return <div className="tl-baby-feedback-drops">{Array.from({length:6},(_,index)=><i key={index} className={index < (feedback.level || 0) ? 'is-filled' : ''} />)}</div>;
    }
    if(feedback.kind === 'solid'){
      return <div className="tl-baby-feedback-foods">{(feedback.foods || []).map(food=><span key={food}>{food}</span>)}</div>;
    }
    if(feedback.kind === 'activity'){
      return <div className="tl-baby-feedback-activity"><i aria-hidden="true">{feedback.activityType === '洗澡' ? '♨' : feedback.activityType === '游泳' ? '≈' : '●'}</i><span>持续记录后，可在回顾查看变化</span></div>;
    }
    return null;
  };
  return (
    <section className={`tl-baby-feedback is-${feedback.kind}`+(open ? ' is-open' : '')} onClick={event=>event.stopPropagation()}>
      <div className="tl-baby-feedback-toggle">
        <span className="tl-baby-feedback-heading"><b>{feedback.title}</b><em>{feedback.subtitle}</em></span>
      </div>
      <div className={'tl-baby-feedback-panel'+(open ? ' is-open' : '')}>
        <div className="tl-baby-feedback-panel-inner">
          {renderMetrics()}
          {renderVisual()}
        </div>
      </div>
    </section>
  );
}

// Shared unchanged feedback presentation for standalone quick records and input receipts.
function BabyRecordFeedback({item,showFeedingFeedback=false}){
  return <>
      {showFeedingFeedback ? (
        <details className="tl-baby-feed-feedback" open onClick={event=>event.stopPropagation()} onKeyDown={event=>event.stopPropagation()}>
          <summary><span className="tl-baby-feedback-spark" aria-hidden="true">✦<small>✦</small></span><span>关于这条点滴</span><i aria-hidden="true"/></summary>
          <p>距上次喂奶<em>2小时30分钟</em>，今天已喂奶<em>5次</em>，奶量<em>360毫升</em>，亲喂<em>40分钟</em>。</p>
          <svg viewBox="0 24 626 306" role="img" aria-label="喂养趋势示意图，10月15日至今天，奶量柱状图与亲喂时长折线，标注50分和今天42分">
            {[83,148,212,277].map((y,i)=><g key={y}><line x1="67" x2="609" y1={y} y2={y} stroke="#f1f1f3" strokeWidth="2"/>{i<3 ? <text x="59" y={y+6} textAnchor="end" fill="#bcbcc4" fontSize="16">{600-i*200}ml</text> : null}</g>)}
            {[
              [106,180,97,109,67,'10.15'],[183,164,113,80,80,'10.16'],
              [261,186,91,125,57,'10.17'],[338,154,123,61,89,'10.18'],
              [415,180,97,103,73,'10.19'],[493,154,123,60,90,'10.20'],
              [570,238,39,51,183,'今天']
            ].map(([x,y,h,py,ph,label])=><g key={label}>
              <rect x={x-20} y={y} width="40" height={h} rx="17" fill="#ff9b3e"/>
              <rect x={x-20} y={py} width="40" height={ph} rx="17" fill="#ff88b2"/>
              <text x={x} y="313" textAnchor="middle" fill={label==='今天'?'#ff4789':'#bcbcc4'} fontSize="16">{label}</text>
            </g>)}
            <path d="M106 91 C132 99 158 107 183 114 S235 139 261 134 S312 91 338 83 S389 102 415 106 S467 128 493 126 S545 117 570 114" fill="none" stroke="#ff4789" strokeWidth="4"/>
            {[[106,91],[183,114],[261,134],[338,83],[415,106],[493,126],[570,114]].map(([x,y],i)=><circle key={x} cx={x} cy={y} r={i===6?7:6} fill={i===6?'#ff4789':'white'} stroke="#ff4789" strokeWidth="4"/>)}
            {[[338,43,'50分'],[570,75,'42分']].map(([x,y,label])=><g key={label}><rect x={x-28} y={y} width="56" height="27" rx="13.5" fill="white" stroke="#ff4789"/><text x={x} y={y+19} textAnchor="middle" fill="#ff2877" fontSize="17">{label}</text></g>)}
          </svg>
        </details>
      ) : null}
      {item.diaperFeedback ? (
        <details className="tl-baby-feed-feedback" open onClick={event=>event.stopPropagation()} onKeyDown={event=>event.stopPropagation()}>
          <summary><span className="tl-baby-feedback-spark" aria-hidden="true">✦<small>✦</small></span><span>关于这条点滴</span><i aria-hidden="true"/></summary>
          <p>距上次换尿布<em>1小时30分钟</em>，今天已换<em>5次</em>，其中嘘嘘<em>4次</em>、臭臭<em>2次</em>。</p>
          <svg viewBox="0 28 340 187" role="img" aria-label="近7天换尿布堆叠柱状图。今天仅嘘嘘3次、仅臭臭1次、嘘嘘加臭臭1次，共5次。">
            {[0,2,4,6,8].map(count=><g key={count}>
              <line x1="32" x2="334" y1={158-count*14} y2={158-count*14} stroke="#efedf2"/>
              <text x="27" y={162-count*14} textAnchor="end" fontSize="10" fill="#aaa6b0">{count}次</text>
            </g>)}
            {/* Prototype example: exclusive categories keep the stack total equal to diaper changes. */}
            {[[4,1,1],[3,1,2],[4,2,1],[3,1,1],[4,1,2],[3,2,1],[3,1,1]].map((counts,index)=>{
              const date=new Date(); date.setDate(date.getDate()-6+index);
              return <g key={index}>
                {counts.map((count,part)=><rect key={part} x={43+index*42} y={158-counts.slice(0,part+1).reduce((sum,n)=>sum+n,0)*14} width="24" height={count*14} fill={['#8ec8ef','#ffc16f','#d3b4ef'][part]}/>)}
                <text x={55+index*42} y="177" textAnchor="middle" fontSize="10" fill={index===6?'#ff4d88':'#aaa6b0'}>{index===6?'今天':`${date.getMonth()+1}.${date.getDate()}`}</text>
              </g>;
            })}
            {['仅嘘嘘','仅臭臭','嘘嘘＋臭臭'].map((label,index)=><g key={label}>
              <rect x={42+index*91} y="197" width="8" height="8" rx="2" fill={['#8ec8ef','#ffc16f','#d3b4ef'][index]}/>
              <text x={54+index*91} y="205" fontSize="10" fill="#999">{label}</text>
            </g>)}
          </svg>
        </details>
      ) : null}
      {item.sleepFeedback ? (
        <details className="tl-baby-feed-feedback" open onClick={event=>event.stopPropagation()} onKeyDown={event=>event.stopPropagation()}>
          <summary><span className="tl-baby-feedback-spark" aria-hidden="true">✦<small>✦</small></span><span>关于这条点滴</span><i aria-hidden="true"/></summary>
          <p>{item.sleeping ? <>已开始记录，入睡前清醒了<em>2小时10分钟</em>。</> : <>今天已睡<em>3次</em>，累计睡眠<em>9小时40分钟</em>。</>}</p>
          {!item.sleeping ? <div className="tl-baby-sleep-feedback-chart">
            <svg viewBox="0 12 340 178" role="img" aria-label="近7天睡眠时长柱状图，今天9小时40分钟">
              {[0,4,8,12].map(hours=><g key={hours}>
                <line x1="32" x2="334" y1={150-hours*10} y2={150-hours*10} stroke="#efedf2"/>
                <text x="27" y={154-hours*10} textAnchor="end" fontSize="10" fill="#aaa6b0">{hours}h</text>
              </g>)}
              {[9.2,10.1,9.6,8.4,10.3,9.1,9+40/60].map((hours,index)=>{
                const date=new Date(); date.setDate(date.getDate()-6+index);
                return <g key={index}>
                  <rect x={43+index*42} y={150-hours*10} width="24" height={hours*10} rx="6" fill={index===6?'#a56cf4':'#d7bdf5'}/>
                  <text x={55+index*42} y="173" textAnchor="middle" fontSize="10" fill={index===6?'#9558dc':'#aaa6b0'}>{index===6?'今天':`${date.getMonth()+1}.${date.getDate()}`}</text>
                </g>;
              })}
            </svg>
          </div> : null}
        </details>
      ) : item.sleepWeekCombo ? <BabySleepWeekComboChart data={item.sleepWeekCombo}/> : null}
  </>;
}

function BabyFeedingTimelineCard({item, isNew}){
  const TypewriterText = window.TypewriterText;
  const [summaryOpen, setSummaryOpen] = React.useState(item.feedbackOpen !== false);
  const iconSrcByType = {
    配方奶:'assets/baby-feeding-icons/formula.png',
    母乳:'assets/baby-feeding-icons/breast.png',
    瓶喂母乳:'assets/baby-feeding-icons/bottle-breast.png',
    换尿布:'assets/baby-feeding-icons/diaper.png',
    睡眠:'assets/baby-feeding-icons/sleep.png',
    营养补剂:'assets/baby-feeding-icons/nutrition.png',
    喝水:'assets/baby-feeding-icons/water.png',
    吸奶:'assets/baby-feeding-icons/pump.png',
    辅食:'assets/baby-feeding-icons/solid-food.png',
    洗澡:'assets/baby-feeding-icons/bath.png',
    玩耍:'assets/baby-feeding-icons/play.png',
    游泳:'assets/baby-feeding-icons/swim.png',
    心情:'assets/baby-feeding-icons/other-event.png',
    体重:'assets/baby-feeding-icons/other-event.png',
    饮食:'assets/baby-feeding-icons/other-event.png',
    体温:'assets/baby-feeding-icons/other-event.png',
    症状:'assets/baby-feeding-icons/other-event.png',
  };
  const title = item.feedType || '配方奶';
  const value = item.value || (title === '换尿布' ? '' : (item.amount ? item.amount + 'ml' : '60ml'));
  const text = item.text || (value ? `${title}：${value}` : title);
  const icon = item.icon || '🍼';
  const iconSrc = item.iconSrc || iconSrcByType[title];
  const color = item.color || '#FF7A66';
  const feedback = item.feedback;
  const creator = item.creator || '妈妈';
  const detailLines = Array.isArray(item.detailLines) ? item.detailLines.filter(Boolean) : [];
  const hasDetail = detailLines.length > 0;
  const notePreview = item.noteText || '';

  React.useEffect(()=>{
    setSummaryOpen(item.feedbackOpen !== false);
  }, [item.id, item.feedbackOpen]);

  const editableFeedingTypes = ['配方奶','母乳','睡眠','瓶喂母乳','换尿布','吸奶','辅食','洗澡','玩耍','游泳','营养补剂','喝水'];
  const canOpenFeedingDetail = !item.readOnly && editableFeedingTypes.includes(title);
  const openFeedingDetail = ()=>{
    if(!canOpenFeedingDetail) return;
    window.dispatchEvent(new CustomEvent('open-baby-feeding-detail', {detail:item}));
  };
  const sleepMinutes = Math.max(1, Math.ceil((item.elapsedSeconds || 60) / 60));
  const openSleepWakeSheet = (event)=>{
    event.stopPropagation();
    window.dispatchEvent(new CustomEvent('open-baby-feeding-detail', {
      detail:{...item, elapsedSeconds:item.elapsedSeconds || 60, sleepMode:'timer'}
    }));
  };
  const openTodayFeedingOverview = (event)=>{
    event.stopPropagation();
    window.dispatchEvent(new CustomEvent('open-shared-feeding-history', {detail:{babyName:item.babyName || '小豆苗'}}));
  };
  const showTodayFeedingOverview = item.showFeedingHistoryEntry === true;
  const hasSpecializedFeedback = (
    (showTodayFeedingOverview && item.babyName === '小豆芽')
    || item.diaperFeedback
    || item.sleepFeedback
    || item.sleepWeekCombo
  );
  const showGenericFeedback = !item.inputId && !!feedback && !hasSpecializedFeedback;

  return (
    <article
      className={'tl-baby-feeding-card'+(isNew ? ' is-stream fade-in' : '')+(canOpenFeedingDetail ? ' is-clickable' : '')}
      role={canOpenFeedingDetail ? 'button' : undefined}
      tabIndex={canOpenFeedingDetail ? 0 : undefined}
      onClick={openFeedingDetail}
      onKeyDown={(event)=>{
        if(canOpenFeedingDetail && (event.key === 'Enter' || event.key === ' ')){
          event.preventDefault();
          openFeedingDetail();
        }
      }}
    >
      <div className="tl-baby-feed-head">
        <span className="tl-baby-feed-time">{item.time || '08:15'}</span>
      </div>
      <div className={'tl-baby-feed-main'+(hasDetail ? ' is-detail' : '')}>
        <span className={'tl-baby-feed-icon'+(iconSrc ? ' is-image' : '')} style={iconSrc ? undefined : {background: color}}>
          {iconSrc ? <img src={iconSrc} alt="" /> : icon}
        </span>
        <div className="tl-baby-feed-content">
          {hasDetail ? (
            <span className="tl-baby-feed-detail">
              {detailLines.map((line, index)=>(
                <span key={index}>{line}</span>
              ))}
            </span>
          ) : (
            <span className="tl-baby-feed-text">
              {isNew && TypewriterText ? (
                <TypewriterText text={text} active charMs={55} followScroll/>
              ) : text}
            </span>
          )}
          {notePreview ? <p className="tl-baby-feed-note-preview">{notePreview}</p> : null}
        </div>
      </div>
      <InputProvenance entry={item}/>
      {item.sleeping ? (
        <div className="tl-baby-sleep-live">
          <span className="tl-baby-sleep-duration">睡了{sleepMinutes}分钟</span>
          <span className="tl-baby-sleep-status">宝宝睡觉中...</span>
          <button type="button" onClick={openSleepWakeSheet}>宝宝醒了</button>
        </div>
      ) : null}
      <div className="tl-baby-feed-tags">
        {showGenericFeedback ? (
          <button
            className={`tl-baby-feedback-entry is-${feedback.kind}`+(summaryOpen ? ' is-open' : '')}
            type="button"
            aria-label={`${summaryOpen ? '收起' : '展开'}${feedback.title}`}
            aria-expanded={summaryOpen}
            onClick={event=>{event.stopPropagation();setSummaryOpen(value=>!value);}}
          >
            <span className="tl-baby-feedback-entry-mark" aria-hidden="true">✦</span>
            <span className="tl-baby-feedback-entry-label">AI<span className="tl-baby-feedback-entry-label-suffix">反馈</span></span>
            <i className="tl-baby-feedback-entry-caret" aria-hidden="true">⌄</i>
          </button>
        ) : null}
        {item.showBabyTag !== false ? <span className="tl-baby-feed-tag-main">{item.babyName || '小豆苗'}</span> : null}
        {item.showCreator ? (
          <span className={'tl-baby-feed-creator' + (item.creatorId === 'family' ? ' is-family' : '')}>{creator}记录</span>
        ) : null}
        {item.relativeTime ? <span className="tl-baby-feed-chip is-ago">{item.relativeTime}</span> : null}
      </div>
      {!item.inputId?<BabyRecordFeedback item={item} showFeedingFeedback={showTodayFeedingOverview && item.babyName === '小豆芽'}/>:null}
      {showGenericFeedback ? <BabyFeedingFeedbackModule feedback={feedback} open={summaryOpen} /> : null}
      {showTodayFeedingOverview ? (
        <button className="tl-baby-feed-overview-link" type="button" onClick={openTodayFeedingOverview}>
          <span>进入{item.babyName || '小豆苗'}的喂养记录</span><i aria-hidden="true">›</i>
        </button>
      ) : null}
    </article>
  );
}

function InlineRecordConfirmCard({item}){
  const [feedingType, setFeedingType] = React.useState('');
  const [customValue, setCustomValue] = React.useState('');
  const subjectOptions = [
    {id:'自己', mark:'我'},
    {id:'小豆苗', mark:'苗'},
    {id:'小豆芽', mark:'芽'},
  ];
  const feedingOptions = [
    {id:'配方奶', iconSrc:'assets/baby-feeding-icons/formula.png'},
    {id:'母乳', iconSrc:'assets/baby-feeding-icons/breast.png'},
    {id:'瓶喂母乳', iconSrc:'assets/baby-feeding-icons/bottle-breast.png'},
  ];
  const isDuration = feedingType === '母乳';
  const quickValues = isDuration ? [10,20,30] : [90,120,150];
  const unit = isDuration ? '分钟' : 'ml';
  const resolve = detail=>window.dispatchEvent(new CustomEvent('resolve-inline-record-confirm',{detail:{entryId:item.id,...detail}}));
  if(item.confirmType === 'subject'){
    return (
      <article className="tl-inline-confirm-card is-subject" aria-labelledby={`${item.id}-title`}>
        <header className="tl-inline-confirm-head">
          <span className="tl-inline-confirm-ai" aria-hidden="true">✦</span>
          <span><b id={`${item.id}-title`}>这条记录是谁的？</b><em>{item.recordType}　{item.value}{item.unit} · {item.timeLabel}</em></span>
        </header>
        <p className="tl-inline-confirm-source">“{item.text}”</p>
        <div className="tl-inline-confirm-subjects" aria-label="选择记录对象">
          {subjectOptions.map(subject=><button key={subject.id} type="button" onClick={()=>resolve({action:'confirm-subject',subject:subject.id})}><i aria-hidden="true">{subject.mark}</i><span>{subject.id}</span></button>)}
        </div>
        <button className="tl-inline-confirm-keep" type="button" onClick={()=>resolve({action:'keep-original'})}>仅保留原文</button>
      </article>
    );
  }
  const saveFeeding = value=>feedingType && resolve({action:'confirm-feeding',feedingType,value:Number(value),unit,babyName:item.babyName || '小豆苗'});
  return (
    <article className="tl-inline-confirm-card is-feeding" aria-labelledby={`${item.id}-title`}>
      <header className="tl-inline-confirm-head">
        <span className="tl-inline-confirm-ai is-baby" aria-hidden="true"><img src="assets/feeding-review-icon.png" alt=""/></span>
        <span><b id={`${item.id}-title`}>补充一下喂奶信息</b><em>{item.babyName || '小豆苗'} · {item.timeLabel}</em></span>
      </header>
      <p className="tl-inline-confirm-source">“{item.text}”</p>
      <div className="tl-inline-confirm-feed-types" aria-label="选择喂奶方式">
        {feedingOptions.map(option=><button key={option.id} type="button" className={feedingType===option.id?'is-selected':''} onClick={()=>{setFeedingType(option.id);setCustomValue('')}}><img src={option.iconSrc} alt=""/><span>{option.id}</span></button>)}
      </div>
      {feedingType ? <div className="tl-inline-confirm-values" aria-label={`选择${isDuration?'喂奶时长':'奶量'}`}>
        <span>{isDuration?'喂了多久':'喝了多少'}</span>
        <div>{quickValues.map(value=><button key={value} type="button" onClick={()=>saveFeeding(value)}>{value}<small>{unit}</small></button>)}</div>
        <label><input inputMode="decimal" value={customValue} placeholder="其他" onChange={event=>setCustomValue(event.target.value.replace(/[^\d.]/g,''))}/><em>{unit}</em><button type="button" disabled={!customValue} onClick={()=>saveFeeding(customValue)}>确定</button></label>
      </div> : <p className="tl-inline-confirm-tip">选择喂奶方式后补充核心信息</p>}
      <button className="tl-inline-confirm-keep" type="button" onClick={()=>resolve({action:'keep-original'})}>仅保留原文</button>
    </article>
  );
}

function AiQuestionCard({item}){
  const I=window.Icon;
  const [feedbackOpen,setFeedbackOpen]=React.useState(item.feedbackOpen !== false);
  React.useEffect(()=>setFeedbackOpen(item.feedbackOpen !== false),[item.id,item.feedbackOpen]);
  const continueQuestion=()=>window.dispatchEvent(new CustomEvent('open-qa-conversation',{detail:{
    sourceType:'question',
    sourceText:item.question,
    question:item.question,
    fullResponse:item.fullResponse,
  }}));
  const answerContent=<>
    <header><b>{item.assistantTitle || '点滴助手'}</b><span className="tl-ai-feedback-chat" aria-hidden="true"><I name="message-circle" size={17} stroke={1.8}/></span></header>
    <p>{item.contextLabel ? <><span className="tl-ai-question-context">{item.contextLabel}</span>，</> : null}{item.answer}</p>
  </>;
  return (
    <article className="tl-ai-question-card">
      <time>{item.time}</time>
      <div className="tl-ai-question-prompt"><span aria-hidden="true">?</span><p>{item.question}</p></div>
      <div className="tl-ai-question-feedback-entry-row">
        <button
          className={`tl-baby-feedback-entry is-ai-question${feedbackOpen?' is-open':''}`}
          type="button"
          aria-label={`${feedbackOpen?'收起':'展开'}点滴助手反馈`}
          aria-expanded={feedbackOpen}
          onClick={()=>setFeedbackOpen(open=>!open)}
        >
          <span className="tl-baby-feedback-entry-mark" aria-hidden="true">✦</span>
          <span className="tl-baby-feedback-entry-label">AI<span className="tl-baby-feedback-entry-label-suffix">反馈</span></span>
          <i className="tl-baby-feedback-entry-caret" aria-hidden="true">⌄</i>
        </button>
      </div>
      {feedbackOpen ? <button className="tl-ai-question-answer is-whole-action" type="button" aria-label={`${item.assistantTitle || '点滴助手'}，继续问`} onClick={continueQuestion}>{answerContent}</button> : null}
    </article>
  );
}

function AiRecordFeedbackCard({item}){
  const I=window.Icon;
  const [feedbackOpen,setFeedbackOpen]=React.useState(item.feedbackOpen !== false);
  React.useEffect(()=>setFeedbackOpen(item.feedbackOpen !== false),[item.id,item.feedbackOpen]);
  const continueQuestion=()=>window.dispatchEvent(new CustomEvent('open-qa-conversation',{detail:{
    sourceType:'record',
    sourceText:item.sourceText,
    question:item.question,
    fullResponse:item.fullResponse,
  }}));
  const openFeedingHistory=()=>window.dispatchEvent(new CustomEvent('open-shared-feeding-history',{detail:{babyName:item.babyName || '小豆苗'}}));
  const feedbackContent=<>
    <header><b>{item.feedbackTitle}</b><span className="tl-ai-feedback-chat" aria-hidden="true"><I name="message-circle" size={17} stroke={1.8}/></span></header>
    <p>{item.feedbackSummary}</p>
  </>;
  return (
    <article className="tl-ai-record-feedback-card">
      <div className="tl-baby-feed-head"><span className="tl-baby-feed-time">{item.time}</span></div>
      <div className="tl-ai-record-main">
        <span className="tl-ai-record-icon" aria-hidden="true"><img src={item.iconSrc} alt=""/></span>
        <span className="tl-ai-record-copy">
          <b>{item.recordTitle}：<strong>{item.recordValue}</strong></b>
          <em>{item.recordRange}</em>
        </span>
      </div>
      <div className="tl-baby-feed-tags">
        <button
          className={'tl-baby-feedback-entry is-sleep'+(feedbackOpen ? ' is-open' : '')}
          type="button"
          aria-label={`${feedbackOpen ? '收起' : '展开'}${item.feedbackTitle}`}
          aria-expanded={feedbackOpen}
          onClick={()=>setFeedbackOpen(value=>!value)}
        >
          <span className="tl-baby-feedback-entry-mark" aria-hidden="true">✦</span>
          <span className="tl-baby-feedback-entry-label">AI<span className="tl-baby-feedback-entry-label-suffix">反馈</span></span>
          <i className="tl-baby-feedback-entry-caret" aria-hidden="true">⌄</i>
        </button>
        <span className="tl-baby-feed-tag-main">{item.babyName || '小豆苗'}</span>
        <span className="tl-baby-feed-chip is-ago">{item.relativeTime || '刚刚'}</span>
      </div>
      {feedbackOpen ? <button className="tl-ai-record-feedback is-whole-action" type="button" aria-label={`${item.feedbackTitle}，继续问`} onClick={continueQuestion}>{feedbackContent}</button> : null}
      <footer><button type="button" onClick={openFeedingHistory}><span>进入{item.babyName || '小豆苗'}的喂养记录</span><i aria-hidden="true">›</i></button></footer>
    </article>
  );
}

function TimelineItem({item, sisterItem, isNew, phaseKind, isFeedLast, sisterPlayAnimation, onSisterCycleComplete, firstDropAnim, onFirstDropLand, onFirstDropComplete}){
  const cycleDay = item.cycleDay;
  const guideAnimate = item.kind === 'guide' && !item.noAnimate && (
    isNew || item.hiddenUntilSisterDone
  );

  let body = null;
  if(item.kind === 'input-source'){
    body = <InputSourceCard item={item}/>;
  } else if(item.kind === 'ai-record-processing'){
    const stageText = ['正在提取记录','正在整理到时间轴'][item.processingStage] || '正在智能记录';
    body = (
      <div className="tl-ai-record-processing-card" role="status" aria-live="polite">
        <span className="tl-ai-record-processing-icon" aria-hidden="true">✦</span>
        <span className="tl-ai-record-processing-copy">
          <b>{stageText}</b>
          <em>{item.processingSource === 'voice' ? 'AI 正在处理这段语音' : 'AI 正在处理这段文字'}</em>
        </span>
        <span className="tl-ai-record-processing-dots" aria-hidden="true"><i/><i/><i/></span>
      </div>
    );
  } else if(item.kind === 'ai-question-card'){
    body = <AiQuestionCard item={item}/>;
  } else if(item.kind === 'ai-record-feedback-card'){
    body = <AiRecordFeedbackCard item={item}/>;
  } else if(item.kind === 'inline-record-confirm'){
    body = <InlineRecordConfirmCard item={item}/>;
  } else if(item.kind === 'diet-photo-feedback'){
    const DietPhotoFeedbackCard = window.DietPhotoFeedbackCard;
    const card = DietPhotoFeedbackCard
      ? <DietPhotoFeedbackCard
            photoUrl={item.photoUrl}
            data={item.dietData}
            userContext={item.userContext}
            isNew={isNew}
            leadingIconSrc={item.leadingIconSrc}
            leadingLabel={item.leadingLabel}
            recognitionScenario={item.recognitionScenario}
            recognitionState={item.recognitionState}
            failureCount={item.failureCount}
            displayScenario={item.displayScenario}
          />
      : null;
    body = item.pendingDrop ? null : (
      <EditableTimelineBody item={item} editPayload={buildDietEditPayload(item)}>
        {card}
      </EditableTimelineBody>
    );
  } else if(item.kind === 'diet-text-feedback'){
    const DietTextFeedbackCard = window.DietTextFeedbackCard;
    const card = DietTextFeedbackCard
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
      : null;
    body = item.pendingDrop ? null : (
      <EditableTimelineBody item={item} editPayload={buildDietEditPayload(item)}>
        {card}
      </EditableTimelineBody>
    );
  } else if(item.kind === 'record-group'){
    body = item.pendingDrop ? null : <V3RecordGroupCard group={item} isNew={isNew}/>;
  } else if(item.kind === 'guide'){
    body = <TodayGuideCard item={item} isNew={isNew} animate={guideAnimate}/>;
  } else if(item.kind === 'mood-insight'){
    body = item.pendingDrop ? null : <MoodInsightCard item={item} isNew={isNew}/>;
  } else if(item.kind === 'custom-record-card'){
    const result=item.structure==='event'?'':item.structure==='option'?(item.value||'已完成'):`${item.value||0}${item.unit||''}`;
    const openCustomEditor=()=>window.openCustomRecordEditor?.(item);
    body=<article className={`tl-custom-record-card${isNew?' is-new':''} is-clickable`} role="button" tabIndex="0" onClick={openCustomEditor} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openCustomEditor();}}}>
      <time>{item.time}</time>
      <div className="tl-custom-record-main"><span className="tl-custom-record-icon">✦</span><div><p><b>{item.recordName}{item.structure==='event'?'':'：'}</b>{result}</p>{item.noteText?<small>{item.noteText}</small>:null}</div></div>
      {item.owner && item.owner !== '自己' ? <div className="tl-baby-feed-tags"><span className="tl-baby-feed-tag-main">{item.owner}</span></div> : null}
    </article>;
  } else if(item.kind === 'prenatal-report-card'){
    const PrenatalReportTimelineCard=window.PrenatalReportTimelineCard;
    body=PrenatalReportTimelineCard?<PrenatalReportTimelineCard item={item}/>:null;
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
      <TimelineItemWrap item={item}>{body}{item.inputId && item.kind !== 'baby-feeding-card' ? <InputProvenance entry={item}/> : null}</TimelineItemWrap>
    </TimelineRailNode>
  );
}

Object.assign(window, {
  CycleDayHeader, TimelineRailNode, TlNodeCaption, summarizeDayItems,
  resolveDayTitleLabel, formatDayMeta,
  ModulePlaceholder, TodayGuideCard, WeeklyTrendCard, TimelineItem,
  MoodInsightCard, MoodCurveChart, MoodBandChart, MoodScatterChart,
  BabySleepWeekComboChart, BabyFeedingFeedbackModule, BabyFeedingTimelineCard,
  AiQuestionCard, AiRecordFeedbackCard,
});
