function reviewFmt1(x){
  return (Math.round(x * 10) / 10).toFixed(1).replace(/\.0$/, '');
}

function reviewSmoothPath(points){
  if(points.length < 2) return '';
  let d = 'M' + points[0][0].toFixed(1) + ' ' + points[0][1].toFixed(1) + ' ';
  for(let i = 0; i < points.length - 1; i++){
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || points[i + 1];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += 'C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ' '
      + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ' '
      + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1) + ' ';
  }
  return d;
}

function ReviewDropletIcon(){
  return <svg viewBox="0 0 24 24"><path d="M12 3c3.2 3.4 5.2 6 5.2 8.6A5.2 5.2 0 1 1 6.8 11.6C6.8 9 8.8 6.4 12 3z"/></svg>;
}

function ReviewScaleIcon(){
  return <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="4"/><path d="M12 8.5v3l2.4-1.6"/><path d="M8.5 16.5h7"/></svg>;
}

function ReviewMoodIcon(){
  return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c.9 1.2 2.1 1.8 3.5 1.8s2.6-.6 3.5-1.8"/><path d="M9 9.5h.01M15 9.5h.01"/></svg>;
}

function ReviewDietIcon(){
  return <svg viewBox="0 0 24 24"><path d="M6 3v7a3 3 0 0 0 6 0V3"/><path d="M9 3v18"/><path d="M17 3c-1.5 1-2.5 3-2.5 5.5S15.5 13 17 14v7"/></svg>;
}

function ReviewChevron(){
  return <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>;
}

function ReviewBackIcon(){
  return <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>;
}

function ReviewCard({title, iconClass='', icon, chart, legend, metrics, more, sample, onOpen}){
  const isActionable = typeof onOpen === 'function';
  const handleKeyDown = (event)=>{
    if(!isActionable) return;
    if(event.key === 'Enter' || event.key === ' '){
      event.preventDefault();
      onOpen();
    }
  };
  return (
    <div
      className={'review-card' + (sample ? ' is-sample' : '') + (isActionable ? ' is-actionable' : '')}
      role={isActionable ? 'button' : undefined}
      tabIndex={isActionable ? 0 : undefined}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
    >
      <div className="review-card-pad">
        <div className="review-card-head">
          <div className={'review-card-icon ' + iconClass} aria-hidden="true">{icon}</div>
          <div className="review-card-title">{title}</div>
        </div>
        <div className="review-chart">{chart}</div>
        <div className="review-legend">{legend}</div>
        <div className="review-metrics">{metrics}</div>
      </div>
      <div className="review-card-more" role="button" aria-label={more}>
        <div className="review-card-more-main">{more}</div>
        <ReviewChevron/>
      </div>
      {sample}
    </div>
  );
}

function CycleDetailChart({range}){
  const data = [
    ['22.1',33],['22.2',32],['22.4',29],['22.5',28],['22.6',31],['22.7',33],
    ['22.8',30],['22.9',32],['22.10',30],['22.11',33],['22.12',34],
    ['23.1',32],['23.2',33],['23.3',30],['23.4',29],['23.6',32],['23.7',31],
    ['23.8',33],['23.9',30],['23.10',32],['23.11',31],['23.12',33],
    ['24.1',31],['24.3',30],['24.4',29],['24.5',28],
    ['24.6',29],['24.7',34],['24.8',31],['24.9',30],['24.10',33],['24.11',31],
    ['24.12',32],['25.1',36],['25.2',31],['25.3',30],['25.4',32],['25.5',30],
    ['25.6',31],['25.7',29],['25.8',30],['25.9',31],['25.10',29],['25.11',30],
    ['25.12',29],['26.1',31],['26.2',30],['26.3',30],['26.4',28],['26.5',28],
  ];
  const slice = range === '1y' ? data.slice(-12) : (range === '3y' ? data.slice(-36) : data);
  const vals = slice.map(d=>d[1]);
  const n = vals.length;
  const normalMax = 35;
  const W = 340, H = 180, padL = 26, padR = 14, padT = 16, padB = 28;
  const x0 = padL, x1 = W - padR, y0 = padT, y1 = H - padB;
  const yMin = 26, yMax = 37;
  const X = i => x0 + (x1 - x0) * (i / (n - 1));
  const Y = v => y1 - (v - yMin) / (yMax - yMin) * (y1 - y0);
  const sx = vals.reduce((s, _v, i)=>s + i, 0);
  const sy = vals.reduce((s, v)=>s + v, 0);
  const sxy = vals.reduce((s, v, i)=>s + i * v, 0);
  const sxx = vals.reduce((s, _v, i)=>s + i * i, 0);
  const b = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const a = (sy - b * sx) / n;
  let anomalyIdx = -1, anomalyVal = 0;
  vals.forEach((v, i)=>{ if(v > normalMax && v > anomalyVal){ anomalyVal = v; anomalyIdx = i; } });
  const marks = [0, Math.round((n - 1) * 0.25), Math.round((n - 1) * 0.5), Math.round((n - 1) * 0.75), n - 1]
    .filter((v, i, arr)=>arr.indexOf(v) === i);
  const pts = vals.map((v, i)=>[X(i), Y(v)]);

  return (
    <svg viewBox="0 0 340 180" preserveAspectRatio="xMidYMid meet" role="img" aria-label="月经周期长度趋势曲线">
      <rect x={x0} y={y0} width={x1 - x0} height={Y(normalMax) - y0} fill="rgba(255,149,0,0.06)"/>
      {[28,32,36].map(g=>(
        <React.Fragment key={g}>
          <line x1={x0} y1={Y(g)} x2={x1} y2={Y(g)} stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>
          <text x={x0 - 5} y={Y(g) + 3} textAnchor="end" fontSize="9" fill="#bbbbbf" fontFamily="PingFang SC">{g}</text>
        </React.Fragment>
      ))}
      <line x1={x0} y1={Y(normalMax)} x2={x1} y2={Y(normalMax)} stroke="#ffb15a" strokeWidth="1" strokeDasharray="3 3"/>
      <text x={x1} y={Y(normalMax) - 4} textAnchor="end" fontSize="9" fill="#e8930f" fontFamily="PingFang SC">正常上限 35天</text>
      <line x1={X(0)} y1={Y(a)} x2={X(n - 1)} y2={Y(a + b * (n - 1))} stroke="#c2c2c8" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round"/>
      <path d={reviewSmoothPath(pts)} fill="none" stroke="#ff4d88" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      {vals.map((v, i)=>{
        const isAnomaly = i === anomalyIdx;
        const isLast = i === n - 1;
        return (
          <React.Fragment key={i}>
            <circle cx={X(i)} cy={Y(v)} r={isLast ? 4.5 : (isAnomaly ? 4 : 2.4)} fill={isAnomaly ? '#ff9500' : '#ff4d88'} stroke={isLast || isAnomaly ? '#fff' : 'none'} strokeWidth={isLast ? 2 : 1.5}/>
            {isAnomaly ? <text x={X(i)} y={Y(v) - 8} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#e8930f" fontFamily="PingFang SC">{anomalyVal}天</text> : null}
            {isLast ? <text x={X(i)} y={Y(v) + 15} textAnchor="end" fontSize="9.5" fontWeight="600" fill="#ff4d88" fontFamily="PingFang SC">{v}天</text> : null}
          </React.Fragment>
        );
      })}
      {marks.map(idx=>(
        <text key={idx} x={X(idx)} y={H - 9} textAnchor="middle" fontSize="9" fill="#bbbbbf" fontFamily="PingFang SC">{slice[idx][0]}</text>
      ))}
    </svg>
  );
}

function CycleDetailPage({open, onClose}){
  const [range, setRange] = useState('3y');
  const ranges = [
    {key:'1y', label:'最近1年'},
    {key:'3y', label:'最近3年'},
    {key:'all', label:'全部'},
  ];

  return (
    <section className={'review-cycle-detail' + (open ? ' is-open' : '')} aria-hidden={!open} aria-label="月经周期详情">
      <div className="review-detail-nav">
        <button type="button" className="review-detail-back" aria-label="返回" onClick={onClose}>
          <ReviewBackIcon/>
        </button>
        <span className="review-detail-title">月经周期</span>
      </div>
      <div className="review-detail-content">
        <div className="review-segment" role="tablist" aria-label="时间范围">
          {ranges.map(item=>(
            <button
              key={item.key}
              type="button"
              className={range === item.key ? 'is-active' : ''}
              aria-selected={range === item.key}
              onClick={()=>setRange(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="review-detail-card">
          <div className="review-chart review-detail-chart"><CycleDetailChart range={range}/></div>
          <div className="review-legend">
            <span className="review-legend-item is-cycle"><i></i>周期天数</span>
            <span className="review-legend-item is-trend"><i></i>趋势</span>
            <span className="review-legend-item is-warning"><i></i>偏长周期</span>
          </div>
        </div>

        <div className="review-detail-card">
          <div className="review-insight-head">
            <span className="review-ai-badge" aria-hidden="true">AI</span>
            <span>趋势分析</span>
          </div>
          <div className="review-insight-body">
            <div className="review-insight-item is-good">
              <span className="review-insight-dot"></span>
              <div>
                <div className="review-insight-title">整体规律性：相当好</div>
                <div className="review-insight-text">50 次里只有 2025 年 1 月那次 <b>36 天</b> 超出「正常上限」35 天，其余都在 28-34 天之间。周期间波动的标准差只有约 <b>1.9 天</b>。临床上通常认为同一年内波动小于 7-9 天就算「规律」，你远好于这个标准。</div>
              </div>
            </div>
            <div className="review-insight-item is-note">
              <span className="review-insight-dot"></span>
              <div>
                <div className="review-insight-title">最值得注意：周期在逐渐缩短</div>
                <div className="review-insight-text">把 50 个周期拟合一条趋势线，斜率约 <b>-0.11 天/周期</b>，相当于每年缩短 1 天多，两年累计缩短约 2.5 天。最近两个周期都是 <b>28 天</b>，是整段记录里最短的，当前这次又「提前」来了。</div>
              </div>
            </div>
            <div className="review-insight-item is-good">
              <span className="review-insight-dot"></span>
              <div>
                <div className="review-insight-title">不只是变短，还变得更稳了</div>
                <div className="review-insight-text">把前 12 个周期和后 12 个周期对比很明显：前半段在 <b>29-36 天</b> 之间跳，跨度 7 天；后半段收窄到 <b>28-31 天</b>，跨度只有 3 天。波动几乎减半，你的身体在向「28-31 天」这个更窄的区间收敛。</div>
              </div>
            </div>
            <div className="review-insight-item is-note">
              <span className="review-insight-dot"></span>
              <div>
                <div className="review-insight-title">季节的规律倾向</div>
                <div className="review-insight-text">按月对比两年同月：4-5 月偏短（<b>28-29 天</b>），冬季 12-2 月偏长（<b>30-32 天</b>），看着像「春短冬长」。但只有两年数据，而且这个「季节性」和整体下降趋势混在一起、没法拆开，所以只能算一个值得继续观察的猜想。</div>
              </div>
            </div>
            <div className="review-insight-summary">
              <div className="review-summary-head">总结</div>
              <p className="review-summary-text">总的来说，你的周期完全在健康区间内，规律性还在变好，没有需要担心的异常。轻微、渐进的周期缩短很常见，可能和年龄、压力、作息、体重等很多因素相关。这是对记录的解读，不是医学诊断。</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewMetric({value, unit, label, trend}){
  return (
    <div className="review-metric">
      <div className={'review-metric-value' + (trend ? ' is-trend' : '')}>
        {value}{unit ? <span className="review-metric-unit">{unit}</span> : null}
      </div>
      <div className="review-metric-label">{label}</div>
    </div>
  );
}

function ReviewMoodValue({kind, word, trend}){
  const faces = {
    happy: <><circle cx="12" cy="12" r="8.5"/><path d="M8.5 14c.8 1.1 2 1.7 3.5 1.7s2.7-.6 3.5-1.7"/><path d="M9 9.5h.01M15 9.5h.01"/></>,
    calm: <><circle cx="12" cy="12" r="8.5"/><path d="M8.7 14.5h6.6"/><path d="M9 9.5h.01M15 9.5h.01"/></>,
    down: <><circle cx="12" cy="12" r="8.5"/><path d="M8.5 15.3c.8-1.1 2-1.7 3.5-1.7s2.7.6 3.5 1.7"/><path d="M9 9.5h.01M15 9.5h.01"/></>,
  };
  return (
    <div className="review-mood-value">
      {kind ? <svg viewBox="0 0 24 24">{faces[kind]}</svg> : null}
      <span className={'review-mood-word' + (trend ? ' is-trend' : '')}>{word}</span>
    </div>
  );
}

function CycleChart(){
  const data = [
    ['24.6',29],['24.7',34],['24.8',31],['24.9',30],['24.10',33],['24.11',31],
    ['24.12',32],['25.1',36],['25.2',31],['25.3',30],['25.4',32],['25.5',30],
    ['25.6',31],['25.7',29],['25.8',30],['25.9',31],['25.10',29],['25.11',30],
    ['25.12',29],['26.1',31],['26.2',30],['26.3',30],['26.4',28],['26.5',28],
  ];
  const vals = data.map(d=>d[1]);
  const n = vals.length;
  const normalMax = 35;
  const W = 340, H = 168, padL = 24, padR = 14, padT = 14, padB = 26;
  const x0 = padL, x1 = W - padR, y0 = padT, y1 = H - padB;
  const yMin = 26, yMax = 37;
  const X = i => x0 + (x1 - x0) * (i / (n - 1));
  const Y = v => y1 - (v - yMin) / (yMax - yMin) * (y1 - y0);
  const pts = vals.map((v, i)=>[X(i), Y(v)]);
  const sx = vals.reduce((s, _v, i)=>s + i, 0);
  const sy = vals.reduce((s, v)=>s + v, 0);
  const sxy = vals.reduce((s, v, i)=>s + i * v, 0);
  const sxx = vals.reduce((s, _v, i)=>s + i * i, 0);
  const b = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const a = (sy - b * sx) / n;
  let anomalyIdx = -1, anomalyVal = 0;
  vals.forEach((v, i)=>{ if(v > normalMax && v > anomalyVal){ anomalyVal = v; anomalyIdx = i; } });
  const lastVal = vals[n - 1];
  const labels = {0:'24.6', 7:'25.1', 13:'25.7', 19:'26.1', 23:'26.5'};
  return (
    <svg viewBox="0 0 340 168" preserveAspectRatio="xMidYMid meet" role="img" aria-label="月经周期长度趋势曲线">
      <rect x={x0} y={y0} width={x1 - x0} height={Y(normalMax) - y0} fill="rgba(255,149,0,0.06)"/>
      {[28,32,36].map(g=>(
        <React.Fragment key={g}>
          <line x1={x0} y1={Y(g)} x2={x1} y2={Y(g)} stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>
          <text x={x0 - 5} y={Y(g) + 3} textAnchor="end" fontSize="9" fill="#bbbbbf" fontFamily="PingFang SC">{g}</text>
        </React.Fragment>
      ))}
      <line x1={x0} y1={Y(normalMax)} x2={x1} y2={Y(normalMax)} stroke="#ffb15a" strokeWidth="1" strokeDasharray="3 3"/>
      <text x={x1} y={Y(normalMax) - 4} textAnchor="end" fontSize="9" fill="#e8930f" fontFamily="PingFang SC">正常上限 35天</text>
      <line x1={X(0)} y1={Y(a)} x2={X(n - 1)} y2={Y(a + b * (n - 1))} stroke="#c2c2c8" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round"/>
      <path d={reviewSmoothPath(pts)} fill="none" stroke="#ff4d88" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      {vals.map((v, i)=>{
        const isAnomaly = i === anomalyIdx;
        const isLast = i === n - 1;
        return (
          <React.Fragment key={i}>
            <circle cx={X(i)} cy={Y(v)} r={isLast ? 4.5 : (isAnomaly ? 4 : 2.4)} fill={isAnomaly ? '#ff9500' : '#ff4d88'} stroke={isLast || isAnomaly ? '#fff' : 'none'} strokeWidth={isLast ? 2 : 1.5}/>
            {isAnomaly ? <text x={X(i)} y={Y(v) - 8} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#e8930f" fontFamily="PingFang SC">{anomalyVal}天</text> : null}
            {isLast ? <text x={X(i)} y={Y(v) + 15} textAnchor="end" fontSize="9.5" fontWeight="600" fill="#ff4d88" fontFamily="PingFang SC">{lastVal}天</text> : null}
          </React.Fragment>
        );
      })}
      {Object.keys(labels).map(k=>(
        <text key={k} x={X(+k)} y={H - 8} textAnchor="middle" fontSize="9" fill="#bbbbbf" fontFamily="PingFang SC">{labels[k]}</text>
      ))}
    </svg>
  );
}

function WeightChart(){
  const data = [103.3,98.2,101.4,97.6,98.6,97.5,97.9,97.3,96.5,99.4,102.0,100.6,101.6,99.9,101.0,102.1,100.7,101.3,101.9,100.6,101.5,102.0,101.4,101.1];
  const n = data.length;
  const W = 340, H = 168, padL = 28, padR = 14, padT = 16, padB = 26;
  const x0 = padL, x1 = W - padR, y0 = padT, y1 = H - padB;
  const yMin = 96, yMax = 104;
  const X = i => x0 + (x1 - x0) * (i / (n - 1));
  const Y = v => y1 - (v - yMin) / (yMax - yMin) * (y1 - y0);
  const pts = data.map((v, i)=>[X(i), Y(v)]);
  const labels = {0:'25.12', 11:'26.3', 23:'26.6'};
  let maxI = 0, minI = 0;
  data.forEach((v, i)=>{ if(v > data[maxI]) maxI = i; if(v < data[minI]) minI = i; });
  return (
    <svg viewBox="0 0 340 168" preserveAspectRatio="xMidYMid meet" role="img" aria-label="体重变化趋势曲线">
      {[98,100,102].map(g=>(
        <React.Fragment key={g}>
          <line x1={x0} y1={Y(g)} x2={x1} y2={Y(g)} stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>
          <text x={x0 - 5} y={Y(g) + 3} textAnchor="end" fontSize="9" fill="#bbbbbf" fontFamily="PingFang SC">{g}</text>
        </React.Fragment>
      ))}
      <path d={reviewSmoothPath(pts)} fill="none" stroke="#4f7cae" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      {data.map((v, i)=>{
        const isMax = i === maxI;
        const isMin = i === minI;
        const isLast = i === n - 1;
        return (
          <React.Fragment key={i}>
            <circle cx={X(i)} cy={Y(v)} r={isMax || isMin ? 4 : (isLast ? 4.5 : 2.2)} fill="#4f7cae" stroke={isMax || isMin || isLast ? '#fff' : 'none'} strokeWidth={isLast ? 2 : 1.5}/>
            {isMax ? <text x={X(i) + 7} y={Y(v) + 3} textAnchor="start" fontSize="9.5" fontWeight="600" fill="#4f7cae" fontFamily="PingFang SC">{reviewFmt1(v)}斤 最高</text> : null}
            {isMin ? <text x={X(i)} y={Y(v) + 16} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#4f7cae" fontFamily="PingFang SC">{reviewFmt1(v)}斤 最低</text> : null}
            {isLast ? <text x={X(i)} y={Y(v) - 8} textAnchor="end" fontSize="9.5" fontWeight="600" fill="#4f7cae" fontFamily="PingFang SC">{reviewFmt1(v)}斤</text> : null}
          </React.Fragment>
        );
      })}
      {Object.keys(labels).map(k=>(
        <text key={k} x={X(+k)} y={H - 8} textAnchor="middle" fontSize="9" fill="#bbbbbf" fontFamily="PingFang SC">{labels[k]}</text>
      ))}
    </svg>
  );
}

function getDietCalorieData(){
  const days = 29;
  const data = [];
  let seed = 20260624;
  const rnd = ()=>{
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for(let i = 0; i < days; i++){
    const weekly = 80 * Math.sin(i / 1.1);
    const noise = (rnd() - 0.5) * 150;
    data.push(Math.round(1860 + weekly + noise));
  }
  let maxI = 0;
  let minI = 0;
  data.forEach((v, i)=>{
    if(v > data[maxI]) maxI = i;
    if(v < data[minI]) minI = i;
  });
  data[maxI] = 2050;
  data[minI] = 1700;
  return data;
}

function DietChart(){
  const data = getDietCalorieData();
  const n = data.length;
  const W = 340, H = 168, padL = 34, padR = 14, padT = 14, padB = 24;
  const x0 = padL, x1 = W - padR, y0 = padT, y1 = H - padB;
  const yMin = 1200, yMax = 2200;
  const refLo = 1600, refHi = 2000;
  const X = i => x0 + (x1 - x0) * (i / (n - 1));
  const Y = v => y1 - (v - yMin) / (yMax - yMin) * (y1 - y0);
  const pts = data.map((v, i)=>[X(i), Y(v)]);
  const labels = {0:'5/27', 14:'6/10', 28:'6/24'};
  let maxI = 0;
  let minI = 0;
  data.forEach((v, i)=>{ if(v > data[maxI]) maxI = i; if(v < data[minI]) minI = i; });
  const markAnchor = i => X(i) > x1 - 60 ? 'end' : (X(i) < x0 + 60 ? 'start' : 'middle');

  return (
    <svg viewBox="0 0 340 168" preserveAspectRatio="xMidYMid meet" role="img" aria-label="每日饮食热量趋势曲线">
      <rect x={x0} y={Y(refHi)} width={x1 - x0} height={Y(refLo) - Y(refHi)} fill="rgba(255,149,0,0.06)"/>
      {[1200,1500,1800,2100].map(g=>(
        <React.Fragment key={g}>
          <line x1={x0} y1={Y(g)} x2={x1} y2={Y(g)} stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>
          <text x={x0 - 5} y={Y(g) + 3} textAnchor="end" fontSize="9" fill="#bbbbbf" fontFamily="PingFang SC">{g}</text>
        </React.Fragment>
      ))}
      <path d={reviewSmoothPath(pts)} fill="none" stroke="#ff9500" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
      {[
        {i:maxI, below:false, label:'2050 kcal 最高'},
        {i:minI, below:true, label:'1700 kcal 最低'},
      ].map(item=>(
        <React.Fragment key={item.label}>
          <circle cx={X(item.i)} cy={Y(data[item.i])} r="3.5" fill="#ff9500" stroke="#fff" strokeWidth="1.5"/>
          <text x={X(item.i)} y={Y(data[item.i]) + (item.below ? 15 : -8)} textAnchor={markAnchor(item.i)} fontSize="9.5" fontWeight="600" fill="#ff9500" fontFamily="PingFang SC">{item.label}</text>
        </React.Fragment>
      ))}
      {Object.keys(labels).map(k=>(
        <text key={k} x={X(+k)} y={H - 7} textAnchor="middle" fontSize="9" fill="#bbbbbf" fontFamily="PingFang SC">{labels[k]}</text>
      ))}
    </svg>
  );
}

function ReviewDietTrend({value}){
  return <div className="review-metric-value is-diet-trend">{value}</div>;
}

function MoodChart(){
  const data = [72,68,75,70,66,73,78,74,69,80,76,71,82,77,73,86,79,75,84,81,78,85,80,83];
  const n = data.length;
  const W = 340, H = 168, padL = 44, padR = 14, padT = 14, padB = 24;
  const x0 = padL, x1 = W - padR, y0 = padT, y1 = H - padB;
  const yMin = 55, yMax = 95;
  const X = i => x0 + (x1 - x0) * (i / (n - 1));
  const Y = v => y1 - (v - yMin) / (yMax - yMin) * (y1 - y0);
  const pts = data.map((v, i)=>[X(i), Y(v)]);
  const labels = {0:'25.12', 11:'26.3', 23:'26.6'};
  const bands = [
    {name:'积极', lo:81.667, hi:95, fill:'rgba(255,180,40,0.07)'},
    {name:'一般', lo:68.333, hi:81.667, fill:'rgba(79,124,174,0.06)'},
    {name:'消极', lo:55, hi:68.333, fill:'rgba(255,77,136,0.05)'},
  ];
  return (
    <svg viewBox="0 0 340 168" preserveAspectRatio="xMidYMid meet" role="img" aria-label="心情变化趋势曲线">
      {bands.map(b=>{
        const yt = Y(b.hi), yb = Y(b.lo);
        return (
          <React.Fragment key={b.name}>
            <rect x={x0} y={yt} width={x1 - x0} height={yb - yt} fill={b.fill}/>
            <text x={x0 - 8} y={(yt + yb) / 2 + 3} textAnchor="end" fontSize="10" fill="#999999" fontFamily="PingFang SC">{b.name}</text>
          </React.Fragment>
        );
      })}
      {[81.667,68.333].map(g=><line key={g} x1={x0} y1={Y(g)} x2={x1} y2={Y(g)} stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>)}
      <path d={reviewSmoothPath(pts)} fill="none" stroke="#b972ff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      {data.map((v, i)=>(
        <circle key={i} cx={X(i)} cy={Y(v)} r={i === n - 1 ? 4.5 : 2.2} fill="#b972ff" stroke={i === n - 1 ? '#fff' : 'none'} strokeWidth="2"/>
      ))}
      {Object.keys(labels).map(k=>(
        <text key={k} x={X(+k)} y={H - 7} textAnchor="middle" fontSize="9" fill="#bbbbbf" fontFamily="PingFang SC">{labels[k]}</text>
      ))}
    </svg>
  );
}

function ReviewPage(){
  const [cycleDetailOpen, setCycleDetailOpen] = useState(false);
  const cycleData = [29,34,31,30,33,31,32,36,31,30,32,30,31,29,30,31,29,30,29,31,30,30,28,28];
  const cycleLast12 = cycleData.slice(-12);
  const cycleAvg = cycleLast12.reduce((s, x)=>s + x, 0) / cycleLast12.length;
  const weightData = [103.3,98.2,101.4,97.6,98.6,97.5,97.9,97.3,96.5,99.4,102.0,100.6,101.6,99.9,101.0,102.1,100.7,101.3,101.9,100.6,101.5,102.0,101.4,101.1];
  const weightAvg = weightData.reduce((s, x)=>s + x, 0) / weightData.length;
  const weightDelta = weightData[weightData.length - 1] - weightData[0];
  const dietData = getDietCalorieData();
  const dietAvg = dietData.reduce((s, x)=>s + x, 0) / dietData.length;
  const dietSlope = (()=>{
    const n = dietData.length;
    const sx = dietData.reduce((s, _v, i)=>s + i, 0);
    const sy = dietData.reduce((s, v)=>s + v, 0);
    const sxy = dietData.reduce((s, v, i)=>s + i * v, 0);
    const sxx = dietData.reduce((s, _v, i)=>s + i * i, 0);
    return (n * sxy - sx * sy) / (n * sxx - sx * sx);
  })();
  const dietTrend = dietSlope * (dietData.length - 1) >= 60 ? '↗ 上升' : (dietSlope * (dietData.length - 1) <= -60 ? '↘ 下降' : '→ 平稳');

  return (
    <main className="review-page" aria-label="回顾">
      <div className="review-nav">
        <span className="review-nav-title">回顾</span>
      </div>
      <div className="review-content">
        <p className="review-page-greeting">已记录 <b>350 天</b>，共 <b>3 项</b>可回顾</p>

      <ReviewCard
        title="月经周期"
        icon={<ReviewDropletIcon/>}
        chart={<CycleChart/>}
        legend={(
          <>
            <span className="review-legend-item is-cycle"><i></i>周期天数</span>
            <span className="review-legend-item is-trend"><i></i>趋势</span>
            <span className="review-legend-item is-warning"><i></i>偏长周期</span>
          </>
        )}
        metrics={(
          <>
            <ReviewMetric value={cycleData[cycleData.length - 1]} unit="天" label="最近周期"/>
            <ReviewMetric value={reviewFmt1(cycleAvg)} unit="天" label="近一年平均"/>
            <ReviewMetric value="↘ 缩短" label="整体趋势" trend/>
          </>
        )}
        more="查看完整周期变化"
        onOpen={()=>setCycleDetailOpen(true)}
      />

      <ReviewCard
        title="体重"
        iconClass="is-weight"
        icon={<ReviewScaleIcon/>}
        chart={<WeightChart/>}
        legend={<span className="review-legend-item is-weight"><i></i>体重（斤）</span>}
        metrics={(
          <>
            <ReviewMetric value={reviewFmt1(weightData[weightData.length - 1])} unit="斤" label="最近体重"/>
            <ReviewMetric value={reviewFmt1(weightAvg)} unit="斤" label="半年均值"/>
            <ReviewMetric value={(weightDelta > 0 ? '+' : '') + reviewFmt1(weightDelta)} unit="斤" label="较半年前"/>
          </>
        )}
        more="查看完整体重变化"
      />

      <ReviewCard
        title="饮食热量"
        iconClass="is-diet"
        icon={<ReviewDietIcon/>}
        chart={<DietChart/>}
        legend={(
          <>
            <span className="review-legend-item is-diet"><i></i>每日热量</span>
            <span className="review-legend-item is-diet-band"><i></i>均衡参考区间</span>
          </>
        )}
        metrics={(
          <>
            <ReviewMetric value={Math.round(dietAvg / 10) * 10} unit="kcal" label="近1月日均"/>
            <ReviewMetric value="+10" unit="kcal" label="较上月"/>
            <div className="review-metric"><ReviewDietTrend value={dietTrend}/><div className="review-metric-label">整体趋势</div></div>
          </>
        )}
        more="查看完整热量变化"
      />

      <ReviewCard
        title="心情"
        iconClass="is-mood"
        icon={<ReviewMoodIcon/>}
        chart={<MoodChart/>}
        legend={<span className="review-legend-item is-mood"><i></i>心情</span>}
        metrics={(
          <>
            <div className="review-metric"><ReviewMoodValue kind="happy" word="开心"/><div className="review-metric-label">最近心情</div></div>
            <div className="review-metric"><ReviewMoodValue kind="calm" word="平静"/><div className="review-metric-label">半年平均</div></div>
            <div className="review-metric"><ReviewMoodValue word="↗ 变好" trend/><div className="review-metric-label">较半年前</div></div>
          </>
        )}
        more="查看完整心情变化"
        sample={(
          <div className="review-mask">
            <div className="review-mask-icon" aria-hidden="true"><ReviewDropletIcon/></div>
            <p className="review-mask-text">去点滴记录心情后可以生成回顾</p>
            <button type="button" className="review-mask-btn">
              <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>去点滴记录
            </button>
          </div>
        )}
      />
      </div>
      <CycleDetailPage open={cycleDetailOpen} onClose={()=>setCycleDetailOpen(false)}/>
    </main>
  );
}

window.ReviewPage = ReviewPage;
