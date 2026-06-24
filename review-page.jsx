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

function ReviewChevron(){
  return <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>;
}

function ReviewCard({title, iconClass='', icon, chart, legend, metrics, more, sample}){
  return (
    <div className={'review-card' + (sample ? ' is-sample' : '')}>
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
  const cycleData = [29,34,31,30,33,31,32,36,31,30,32,30,31,29,30,31,29,30,29,31,30,30,28,28];
  const cycleLast12 = cycleData.slice(-12);
  const cycleAvg = cycleLast12.reduce((s, x)=>s + x, 0) / cycleLast12.length;
  const weightData = [103.3,98.2,101.4,97.6,98.6,97.5,97.9,97.3,96.5,99.4,102.0,100.6,101.6,99.9,101.0,102.1,100.7,101.3,101.9,100.6,101.5,102.0,101.4,101.1];
  const weightAvg = weightData.reduce((s, x)=>s + x, 0) / weightData.length;
  const weightDelta = weightData[weightData.length - 1] - weightData[0];

  return (
    <main className="review-page" aria-label="回顾">
      <div className="review-nav">
        <span className="review-nav-title">回顾</span>
      </div>
      <div className="review-content">
        <p className="review-page-greeting">已记录 <b>350 天</b>，共 <b>2 项</b>可回顾</p>

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
    </main>
  );
}

window.ReviewPage = ReviewPage;
