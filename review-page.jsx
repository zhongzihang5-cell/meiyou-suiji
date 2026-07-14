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

function ReviewBabyIcon({kind}){
  if(kind === 'sleep') return <svg viewBox="0 0 24 24"><path d="M20 15.2A8 8 0 0 1 8.8 4 8 8 0 1 0 20 15.2z"/></svg>;
  if(kind === 'diaper') return <svg viewBox="0 0 24 24"><path d="M5 5.5h14v5.8c0 4.5-2.7 7.2-7 7.2s-7-2.7-7-7.2z"/><path d="M5 9.5c2.2.2 3.8 1.2 4.8 3M19 9.5c-2.2.2-3.8 1.2-4.8 3"/></svg>;
  if(kind === 'food') return <svg viewBox="0 0 24 24"><path d="M5 13h14a7 7 0 0 1-14 0z"/><path d="M4 13h16M8 19.5h8"/><path d="M15.5 4.5l-4 8"/></svg>;
  return <svg viewBox="0 0 24 24"><path d="M9 3h6v3l2 2v10a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V8l2-2z"/><path d="M9 9h6M9 14h3"/></svg>;
}

function ReviewFormulaRecordIcon(){
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8v3l1.8 2.2v9.3A3.5 3.5 0 0 1 14.3 21h-4.6a3.5 3.5 0 0 1-3.5-3.5V8.2L8 6z"/><path d="M8 9h8M9 14h3.5M17.8 12.5h1.1a2.1 2.1 0 0 1 0 4.2h-1.1"/></svg>;
}

function ReviewPlaceholderChart(){
  return (
    <div className="review-placeholder-chart" aria-label="图表占位">
      <span className="review-placeholder-grid is-top"></span>
      <span className="review-placeholder-grid is-middle"></span>
      <span className="review-placeholder-grid is-bottom"></span>
      <svg viewBox="0 0 340 150" preserveAspectRatio="none" aria-hidden="true">
        <path d="M10 112 C55 98 75 107 112 78 S176 92 213 59 S278 73 330 35"/>
      </svg>
    </div>
  );
}

function ReviewPlaceholderMetrics(){
  return (
    <>
      {['最近记录', '近期平均', '数据变化'].map((label)=>(
        <div className="review-metric review-placeholder-metric" key={label}>
          <span className="review-placeholder-value"></span>
          <div className="review-metric-label">{label}</div>
        </div>
      ))}
    </>
  );
}

function SleepReviewChart(){
  const days = [
    {date:'10.15', hours:16, minutes:44},
    {date:'10.16', hours:15, minutes:12},
    {date:'10.17', hours:14, minutes:24},
    {date:'10.18', hours:15, minutes:19},
    {date:'10.19', hours:15, minutes:40},
    {date:'10.20', hours:14, minutes:37},
    {date:'今天', hours:7, minutes:37, highlight:true},
  ];
  const W = 340, H = 168, padL = 28, padR = 12, padT = 14, padB = 27;
  const x0 = padL, x1 = W - padR, y0 = padT, y1 = H - padB;
  const yMax = 18;
  const band = (x1 - x0) / days.length;
  const barWidth = 22;
  const X = i => x0 + band * i + band / 2;
  const Y = hours => y1 - hours / yMax * (y1 - y0);
  return (
    <svg viewBox="0 0 340 168" preserveAspectRatio="xMidYMid meet" role="img" aria-label="近7天睡眠总时长柱状图">
      {[8,12,16].map(tick=>(
        <React.Fragment key={tick}>
          <line x1={x0} y1={Y(tick)} x2={x1} y2={Y(tick)} stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>
          <text x={x0 - 5} y={Y(tick) + 3} textAnchor="end" fontSize="9" fill="#bbbbbf" fontFamily="PingFang SC">{tick}h</text>
        </React.Fragment>
      ))}
      <line x1={x0} y1={y1} x2={x1} y2={y1} stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
      {days.map((day, i)=>{
        const totalHours = day.hours + day.minutes / 60;
        const barY = Y(totalHours);
        return (
          <React.Fragment key={day.date}>
            <rect x={X(i) - barWidth / 2} y={barY} width={barWidth} height={y1 - barY} rx="10" fill="#b263e8"/>
            <text x={X(i)} y={H - 8} textAnchor="middle" fontSize="9" fontWeight={day.highlight ? '600' : '400'} fill={day.highlight ? '#a85ee0' : '#bbbbbf'} fontFamily="PingFang SC">{day.date}</text>
          </React.Fragment>
        );
      })}
    </svg>
  );
}

function SleepReviewMetric({major, majorUnit, minor, minorUnit, label, trend}){
  return (
    <div className="review-metric">
      <div className={'review-sleep-metric-value' + (trend ? ' is-trend' : '')}>
        {trend ? <><span className="review-sleep-trend-arrow">→</span><span>平稳</span></> : (
          <>
            <span className="review-sleep-metric-number">{major}</span><span className="review-sleep-metric-unit">{majorUnit}</span>
            <span className="review-sleep-metric-number is-secondary">{minor}</span><span className="review-sleep-metric-unit">{minorUnit}</span>
          </>
        )}
      </div>
      <div className="review-metric-label">{label}</div>
    </div>
  );
}

function SleepReviewCard({onFullOpen}){
  return (
    <ReviewCard
      title="睡眠"
      iconClass="is-sleep"
      icon={<ReviewBabyIcon kind="sleep"/>}
      chart={<SleepReviewChart/>}
      legend={<span className="review-legend-item is-sleep"><i></i>睡眠总时长</span>}
      metrics={(
        <>
          <SleepReviewMetric major="1" majorUnit="小时" minor="2" minorUnit="分" label="最近记录"/>
          <SleepReviewMetric major="15" majorUnit="小时" minor="10" minorUnit="分钟" label="近7天平均"/>
          <SleepReviewMetric label="整体趋势" trend/>
        </>
      )}
      more="查看完整睡眠变化"
      onMore={onFullOpen}
    />
  );
}

function DiaperReviewChart(){
  const recordPatterns = [
    ['pee','pee','poop','pee','both'],
    ['pee','poop','pee','pee','pee'],
    ['both','pee','pee','poop','pee','pee'],
    ['pee','pee','both','pee','poop'],
    ['poop','pee','pee','pee','both'],
    ['pee','both','pee','poop','pee'],
  ];
  const dateLabels = [
    '9.22','9.23','9.24','9.25','9.26','9.27','9.28','9.29','9.30',
    '10.1','10.2','10.3','10.4','10.5','10.6','10.7','10.8','10.9','10.10','10.11',
    '10.12','10.13','10.14','10.15','10.16','10.17','10.18','10.19','10.20','今天',
  ];
  const days = Array.from({length:30}, (_item, index)=>(
    {
      key:'diaper-day-' + index,
      date:dateLabels[index],
      records:index === 29 ? [] : recordPatterns[index % recordPatterns.length],
      highlight:index === 29,
    }
  ));
  const W = 340, H = 168, padL = 28, padR = 12, padT = 14, padB = 27;
  const x0 = padL, x1 = W - padR, y0 = padT, y1 = H - padB;
  const yMax = 6.8;
  const band = (x1 - x0) / days.length;
  const segmentWidth = 5.6;
  const X = i => x0 + band * i + band / 2;
  const Y = count => y1 - count / yMax * (y1 - y0);
  const colors = {pee:'#f5b335', poop:'#45c978', both:'#4b91ed'};
  const visibleDateIndexes = {0:true, 7:true, 14:true, 21:true, 29:true};
  return (
    <svg viewBox="0 0 340 168" preserveAspectRatio="xMidYMid meet" role="img" aria-label="近30天换尿布分类次数图">
      {[2,4,6].map(tick=>(
        <React.Fragment key={tick}>
          <line x1={x0} y1={Y(tick)} x2={x1} y2={Y(tick)} stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>
          <text x={x0 - 5} y={Y(tick) + 3} textAnchor="end" fontSize="9" fill="#bbbbbf" fontFamily="PingFang SC">{tick}次</text>
        </React.Fragment>
      ))}
      <line x1={x0} y1={y1} x2={x1} y2={y1} stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
      {days.map((day, i)=>{
        const segments = ['pee','poop','both'].map(type=>(
          {type, count:day.records.filter(record=>record === type).length}
        )).filter(segment=>segment.count > 0);
        let stackedCount = 0;
        return (
          <React.Fragment key={day.key}>
            {segments.map(segment=>{
              const segmentBottom = Y(stackedCount);
              stackedCount += segment.count;
              const segmentTop = Y(stackedCount);
              return <rect key={segment.type} x={X(i) - segmentWidth / 2} y={segmentTop + 0.8} width={segmentWidth} height={segmentBottom - segmentTop - 1.6} rx={segmentWidth / 2} fill={colors[segment.type]}/>;
            })}
            <line x1={X(i)} y1={y1} x2={X(i)} y2={y1 + 3} stroke="#d8d8dc" strokeWidth="0.7"/>
            {visibleDateIndexes[i] ? <text x={X(i)} y={H - 8} textAnchor="middle" fontSize="9" fontWeight={day.highlight ? '600' : '400'} fill={day.highlight ? '#e8930f' : '#bbbbbf'} fontFamily="PingFang SC">{day.date}</text> : null}
          </React.Fragment>
        );
      })}
    </svg>
  );
}

function DiaperReviewMetric({kind, label}){
  return (
    <div className="review-metric">
      {kind === 'empty' ? <div className="review-diaper-text-value">未记录</div> : null}
      {kind === 'average' ? (
        <div className="review-diaper-average-value"><b>5</b><span>次</span></div>
      ) : null}
      {kind === 'trend' ? (
        <div className="review-diaper-trend-value"><span>→</span><b>平稳</b></div>
      ) : null}
      <div className="review-metric-label">{label}</div>
    </div>
  );
}

function DiaperReviewCard(){
  return (
    <ReviewCard
      title="换尿布"
      iconClass="is-diaper"
      icon={<ReviewBabyIcon kind="diaper"/>}
      chart={<DiaperReviewChart/>}
      legend={(
        <>
          <span className="review-legend-item is-diaper-pee"><i></i>嘘嘘</span>
          <span className="review-legend-item is-diaper-poop"><i></i>臭臭</span>
          <span className="review-legend-item is-diaper-both"><i></i>嘘嘘+臭臭</span>
        </>
      )}
      metrics={(
        <>
          <DiaperReviewMetric kind="empty" label="最近记录"/>
          <DiaperReviewMetric kind="average" label="近30天平均"/>
          <DiaperReviewMetric kind="trend" label="整体趋势"/>
        </>
      )}
      more="查看完整换尿布变化"
    />
  );
}

function FoodReviewChart(){
  const days = [
    {date:'10.15', grams:600},
    {date:'10.16', grams:500},
    {date:'10.17', grams:600},
    {date:'10.18', grams:500},
    {date:'10.19', grams:600},
    {date:'10.20', grams:600},
    {date:'今天', grams:600, highlight:true},
  ];
  const W = 340, H = 168, padL = 32, padR = 12, padT = 14, padB = 27;
  const x0 = padL, x1 = W - padR, y0 = padT, y1 = H - padB;
  const yMax = 700;
  const band = (x1 - x0) / days.length;
  const barWidth = 22;
  const X = i => x0 + band * i + band / 2;
  const Y = grams => y1 - grams / yMax * (y1 - y0);
  return (
    <svg viewBox="0 0 340 168" preserveAspectRatio="xMidYMid meet" role="img" aria-label="近7天辅食总量柱状图">
      {[200,400,600].map(tick=>(
        <React.Fragment key={tick}>
          <line x1={x0} y1={Y(tick)} x2={x1} y2={Y(tick)} stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>
          <text x={x0 - 5} y={Y(tick) + 3} textAnchor="end" fontSize="9" fill="#bbbbbf" fontFamily="PingFang SC">{tick}g</text>
        </React.Fragment>
      ))}
      <line x1={x0} y1={y1} x2={x1} y2={y1} stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
      {days.map((day, i)=>{
        const barY = Y(day.grams);
        return (
          <React.Fragment key={day.date}>
            <rect x={X(i) - barWidth / 2} y={barY} width={barWidth} height={y1 - barY} rx="10" fill="#ff8a4c"/>
            <text x={X(i)} y={H - 8} textAnchor="middle" fontSize="9" fontWeight={day.highlight ? '600' : '400'} fill={day.highlight ? '#e87635' : '#bbbbbf'} fontFamily="PingFang SC">{day.date}</text>
          </React.Fragment>
        );
      })}
    </svg>
  );
}

function FoodReviewMetric({kind, label}){
  return (
    <div className="review-metric">
      {kind === 'recent' ? <div className="review-food-amount-value"><b>600</b><span>g</span></div> : null}
      {kind === 'average' ? <div className="review-food-average-value"><b>600</b><span>g</span></div> : null}
      {kind === 'trend' ? <div className="review-food-trend-value"><span>→</span><b>平稳</b></div> : null}
      <div className="review-metric-label">{label}</div>
    </div>
  );
}

function FoodReviewCard(){
  return (
    <ReviewCard
      title="辅食"
      iconClass="is-food-review"
      icon={<ReviewBabyIcon kind="food"/>}
      chart={<FoodReviewChart/>}
      legend={<span className="review-legend-item is-food-review"><i></i>辅食总量</span>}
      metrics={(
        <>
          <FoodReviewMetric kind="recent" label="最近记录"/>
          <FoodReviewMetric kind="average" label="近7天平均"/>
          <FoodReviewMetric kind="trend" label="整体趋势"/>
        </>
      )}
      more="查看完整辅食变化"
    />
  );
}

const FEEDING_REVIEW_DAYS = [
  {date:'10.15', breast:220, formula:300, minutes:48, directCount:3, leftMinutes:25, rightMinutes:23, feeds:[{hour:3.6,type:'formula'},{hour:8.1,type:'breast'},{hour:12.4,type:'direct'},{hour:16.2,type:'formula'},{hour:20.3,type:'breast'}]},
  {date:'10.16', breast:260, formula:350, minutes:42, directCount:3, leftMinutes:22, rightMinutes:20, feeds:[{hour:2.8,type:'formula'},{hour:7.4,type:'breast'},{hour:11.2,type:'formula'},{hour:15.1,type:'direct'},{hour:19.3,type:'breast'},{hour:23.1,type:'formula'}]},
  {date:'10.17', breast:190, formula:280, minutes:37, directCount:2, leftMinutes:18, rightMinutes:19, feeds:[{hour:4.2,type:'breast'},{hour:9.0,type:'formula'},{hour:13.5,type:'direct'},{hour:18.0,type:'formula'},{hour:22.4,type:'breast'}]},
  {date:'10.18', breast:300, formula:380, minutes:50, directCount:3, leftMinutes:26, rightMinutes:24, feeds:[{hour:3.2,type:'formula'},{hour:7.6,type:'breast'},{hour:10.9,type:'direct'},{hour:14.6,type:'formula'},{hour:18.1,type:'breast'},{hour:22.0,type:'formula'}]},
  {date:'10.19', breast:240, formula:300, minutes:44, directCount:3, leftMinutes:21, rightMinutes:23, feeds:[{hour:4.0,type:'formula'},{hour:8.3,type:'breast'},{hour:12.0,type:'direct'},{hour:16.6,type:'formula'},{hour:21.0,type:'breast'}]},
  {date:'10.20', breast:293, formula:380, minutes:39, directCount:2, leftMinutes:20, rightMinutes:19, feeds:[{hour:3.5,type:'formula'},{hour:7.8,type:'breast'},{hour:11.4,type:'formula'},{hour:15.4,type:'direct'},{hour:19.2,type:'breast'},{hour:23.0,type:'formula'}]},
  {date:'今天', breast:580, formula:120, minutes:42, directCount:3, leftMinutes:24, rightMinutes:18, highlight:true, feeds:[{hour:3.63,type:'formula'},{hour:7.78,type:'formula'},{hour:11.1,type:'breast'},{hour:15.4,type:'direct'},{hour:20.77,type:'formula'}]},
];

function FeedingReviewChart({days=FEEDING_REVIEW_DAYS}){
  const W = 340, H = 168, padL = 32, padR = 12, padT = 14, padB = 27;
  const x0 = padL, x1 = W - padR, y0 = padT, y1 = H - padB;
  const amountMax = 720;
  const durationMax = 60;
  const band = (x1 - x0) / days.length;
  const barWidth = 22;
  const X = i => x0 + band * i + band / 2;
  const YAmount = amount => y1 - amount / amountMax * (y1 - y0);
  const YDuration = minutes => y1 - minutes / durationMax * (y1 - y0);
  const durationPoints = days.map((day, i)=>[X(i), YDuration(day.minutes)]);
  return (
    <svg viewBox="0 0 340 168" preserveAspectRatio="xMidYMid meet" role="img" aria-label="近7天喂奶总量与亲喂时长组合图">
      {[200,400,600].map(tick=>(
        <React.Fragment key={tick}>
          <line x1={x0} y1={YAmount(tick)} x2={x1} y2={YAmount(tick)} stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>
          <text x={x0 - 5} y={YAmount(tick) + 3} textAnchor="end" fontSize="9" fill="#bbbbbf" fontFamily="PingFang SC">{tick}ml</text>
        </React.Fragment>
      ))}
      <line x1={x0} y1={y1} x2={x1} y2={y1} stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
      {days.map((day, i)=>{
        const formulaTop = YAmount(day.formula);
        const totalTop = YAmount(day.formula + day.breast);
        return (
          <React.Fragment key={day.date}>
            <rect x={X(i) - barWidth / 2} y={formulaTop} width={barWidth} height={y1 - formulaTop} rx="9" fill="#ff9a45"/>
            <rect x={X(i) - barWidth / 2} y={totalTop} width={barWidth} height={formulaTop - totalTop - 2} rx="9" fill="#ff8fb3"/>
            <text x={X(i)} y={H - 8} textAnchor="middle" fontSize="9" fontWeight={day.highlight ? '600' : '400'} fill={day.highlight ? '#ff4d88' : '#bbbbbf'} fontFamily="PingFang SC">{day.date}</text>
          </React.Fragment>
        );
      })}
      <path d={reviewSmoothPath(durationPoints)} fill="none" stroke="#ff4d88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {days.map((day, i)=>{
        const isHighest = day.minutes === 50;
        return (
          <React.Fragment key={day.date}>
            <circle cx={X(i)} cy={YDuration(day.minutes)} r={day.highlight ? 4 : 3.2} fill={day.highlight ? '#ff4d88' : '#fff'} stroke="#ff4d88" strokeWidth="2"/>
            {isHighest ? (
              <>
                <rect x={X(i) - 15} y={YDuration(day.minutes) - 22} width="30" height="15" rx="7.5" fill="rgba(255,255,255,0.96)" stroke="#ff8fb3" strokeWidth="0.8"/>
                <text x={X(i)} y={YDuration(day.minutes) - 12} textAnchor="middle" fontSize="9" fontWeight="600" fill="#c72f68" fontFamily="PingFang SC">50分</text>
              </>
            ) : null}
            {day.highlight ? (
              <>
                <rect x={X(i) - 15} y={YDuration(day.minutes) - 22} width="30" height="15" rx="7.5" fill="rgba(255,255,255,0.96)" stroke="#ff8fb3" strokeWidth="0.8"/>
                <text x={X(i)} y={YDuration(day.minutes) - 12} textAnchor="middle" fontSize="9" fontWeight="600" fill="#c72f68" fontFamily="PingFang SC">42分</text>
              </>
            ) : null}
          </React.Fragment>
        );
      })}
    </svg>
  );
}

function FeedingReviewMetric({kind, label}){
  return (
    <div className="review-metric review-feeding-metric">
      {kind === 'average' ? (
        <div className="review-feeding-average-value"><b>599</b><i>ml</i></div>
      ) : null}
      {kind === 'standard' ? (
        <div className="review-feeding-standard-value"><span>✓</span><b>符合标准值</b></div>
      ) : null}
      <div className="review-metric-label">{label}</div>
    </div>
  );
}

function FeedingReviewCard({onOpen,onFullOpen}){
  return (
    <ReviewCard
      title="喂奶"
      iconClass="is-feeding"
      icon={<ReviewBabyIcon kind="feeding"/>}
      chart={<FeedingReviewChart/>}
      legend={(
        <>
          <span className="review-legend-item is-feeding-breast"><i></i>瓶喂母乳</span>
          <span className="review-legend-item is-feeding-formula"><i></i>瓶喂配方奶</span>
          <span className="review-legend-item is-feeding-direct"><i></i>亲喂时长</span>
        </>
      )}
      onOpen={onOpen}
      metrics={(
        <>
          <FeedingReviewMetric kind="average" label="近7天平均"/>
          <FeedingReviewMetric kind="standard" label="喂奶次数"/>
          <FeedingReviewMetric kind="standard" label="喂奶规律"/>
        </>
      )}
      more="查看完整喂奶分析"
      moreIcon={(
        <span className="review-vip-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path className="review-vip-gem" d="M5.2 5.5h13.6l2.4 5.2L12 20 2.8 10.7z"/><path className="review-vip-check" d="M8.2 11.2l2.5 2.5 5.2-5.2"/></svg>
        </span>
      )}
      onMore={onFullOpen}
      headerAction={(
        <button type="button" className="review-card-expand" aria-label="展开喂奶分析" onClick={onOpen}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/></svg>
        </button>
      )}
    />
  );
}

function FeedingAmountDetail({days}){
  const max = Math.max(...days.map(day=>day.breast + day.formula), 1);
  return (
    <>
      <section className="feeding-analysis-module" aria-labelledby="feeding-amount-title">
      <div className="feeding-analysis-module-head"><b id="feeding-amount-title">喂奶量</b><span>统计周期：每日00:00-24:00</span></div>
      <div className="feeding-analysis-insights" aria-label="喂奶量总结">
        <span className="feeding-insight-mark" aria-hidden="true">✦</span>
        <div className="feeding-insight-copy">
          <p>近7天：瓶喂<strong>599ml/天</strong><i>·</i>亲喂<strong>3次/天</strong><i>·</i>次数<em>✓ 符合标准值</em></p>
        </div>
      </div>
      <div className="feeding-direct-block">
        <h3><i/>亲喂母乳</h3>
        <div className="feeding-chart-scroll" role="region" aria-label="亲喂母乳日期数据，可左右滑动" tabIndex="0">
          <div className="feeding-direct-table" style={{width:Math.max(330, 32 + days.length * 52),gridTemplateColumns:`32px repeat(${days.length}, minmax(52px, 1fr))`}}>
            <div className="feeding-direct-labels" aria-hidden="true"><span>次数</span><span>左</span><span>右</span></div>
            {days.map(day=><div className={'feeding-direct-day'+(day.highlight?' is-today':'')} key={day.date}>
              <b>{day.directCount}次</b>
              <span>{day.leftMinutes}分钟</span>
              <span>{day.rightMinutes}分钟</span>
            </div>)}
          </div>
        </div>
      </div>
      <div className="feeding-bottle-title"><i/>瓶喂</div>
      <div className="feeding-amount-legend"><span className="is-breast"><i/>瓶喂母乳</span><span className="is-formula"><i/>瓶喂配方奶</span></div>
      <div className="feeding-chart-scroll" role="region" aria-label="瓶喂量日期图表，可左右滑动" tabIndex="0">
        <div className="feeding-amount-chart" style={{width:Math.max(330, days.length * 52)}}>
          {days.map(day=>{
            const total = day.breast + day.formula;
            const height = Math.max(10, Math.round(total / max * 176));
            const breastHeight = Math.round(day.breast / total * height);
            return <div className={'feeding-amount-day'+(day.highlight?' is-today':'')} key={day.date}>
              <div className="feeding-amount-total">{total}</div>
              <div className="feeding-amount-bar" style={{height}}>
                <span className="is-breast" style={{height:breastHeight}}>{day.breast}</span>
                <span className="is-formula" style={{height:height-breastHeight}}>{day.formula}</span>
              </div>
              <em>{day.date}</em>
            </div>;
          })}
        </div>
      </div>
      </section>
    </>
  );
}

function FeedingPatternDetail({days}){
  const patternScrollRef = React.useRef(null);
  React.useEffect(()=>{
    const scroll = patternScrollRef.current;
    if(!scroll) return;
    const revealAxis = ()=>{ scroll.scrollLeft = Math.max(0, scroll.scrollWidth - scroll.clientWidth); };
    revealAxis();
    const frame = requestAnimationFrame(revealAxis);
    return ()=>cancelAnimationFrame(frame);
  },[days.length]);
  return (
    <>
      <section className="feeding-analysis-module" aria-labelledby="feeding-pattern-title">
      <div className="feeding-analysis-module-head"><b id="feeding-pattern-title">时间规律</b><span>近7天喂养时段</span></div>
      <div className="feeding-analysis-insights" aria-label="时间规律总结">
        <span className="feeding-insight-mark" aria-hidden="true">✦</span>
        <div className="feeding-insight-copy">
          <p>近7天：白天规律<em>✓ 符合标准值</em><i>·</i>夜奶暂无记录</p>
        </div>
      </div>
      <div ref={patternScrollRef} className="feeding-chart-scroll" role="region" aria-label="喂奶时间规律日期图表，可左右滑动" tabIndex="0">
        <div className="feeding-pattern-chart" style={{width:Math.max(330, days.length * 52 + 28)}}>
          <div className="feeding-pattern-grid">
            {days.map(day=><div className={'feeding-pattern-day'+(day.highlight?' is-today':'')} key={day.date}>
              <div className="feeding-pattern-track">
                {day.feeds.map((feed,index)=><span key={index} className={'feeding-pattern-dot is-'+feed.type} style={{top:(feed.hour/24*100)+'%'}} aria-label={feed.hour.toFixed(1)+'时'}/>) }
              </div>
              <em>{day.date}</em>
            </div>)}
            <div className="feeding-pattern-axis">{[0,4,8,12,16,20,24].map(hour=><span key={hour} style={{top:(hour/24*100)+'%'}}>{hour}</span>)}</div>
          </div>
          <div className="feeding-pattern-legend"><span className="is-direct"><i/>亲喂母乳</span><span className="is-formula"><i/>配方奶</span><span className="is-breast"><i/>瓶喂母乳</span></div>
        </div>
      </div>
      </section>
    </>
  );
}

function FeedingAnalysisSheet({open,onClose,days=FEEDING_REVIEW_DAYS}){
  React.useEffect(()=>{
    if(!open) return undefined;
    const handleKey = event=>{ if(event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return ()=>window.removeEventListener('keydown', handleKey);
  },[open,onClose]);
  return (
    <div className={'feeding-analysis-layer'+(open?' is-open':'')} aria-hidden={!open}>
      <button type="button" className="feeding-analysis-scrim" aria-label="关闭喂奶分析" onClick={onClose}/>
      <section className="feeding-analysis-sheet" role="dialog" aria-modal="true" aria-label="喂奶分析">
        <div className="feeding-analysis-handle" aria-hidden="true"/>
        <div className="feeding-analysis-scroll">
          <FeedingAmountDetail days={days}/>
          <FeedingPatternDetail days={days}/>
        </div>
      </section>
    </div>
  );
}

function FeedingRangeRow({title,value,status,statusKind='good',left='偏少',middle='参考值',right='偏多',note}){
  return (
    <section className="feeding-range-row">
      <header><b>{title}<i>?</i></b><strong>{value}</strong><em className={'is-'+statusKind}>{status}</em></header>
      <div className="feeding-range-track"><span/><span/><span/><i/><i/><i/><i/></div>
      <div className="feeding-range-labels"><span>{left}</span><span>{middle}</span><span>{right}</span></div>
      {note ? <p>{note}</p> : null}
    </section>
  );
}

function FeedingFullAnalysisPage({open,onClose}){
  const [week,setWeek] = React.useState(24);
  const reportDates = ['19','20','21','22','23','24','25'];
  return (
    <section className={'feeding-full-page'+(open?' is-open':'')} aria-hidden={!open} aria-label="完整喂奶分析">
      <header className="feeding-full-nav">
        <button type="button" aria-label="返回" onClick={onClose}><ReviewBackIcon/></button>
        <div className="feeding-full-tabs"><b>喂奶</b><span>睡眠</span></div>
      </header>
      <div className="feeding-full-weeks" role="tablist" aria-label="选择周数">
        {[20,21,22,23,24].map(value=><button key={value} type="button" role="tab" aria-selected={week===value} className={week===value?'is-active':''} onClick={()=>setWeek(value)}>第{value}周</button>)}
      </div>
      <div className="feeding-full-scroll">
        <article className="feeding-daily-card">
          <header><span className="feeding-report-icon">▮</span><b>喂养日报</b><em>宝宝第{week}周　（3月19日-3月25日）</em></header>
          <div className="feeding-report-days">
            {reportDates.map(date=><div key={date} className={date==='25'?'is-selected':''}><b>{date}</b><span className={date==='24'?'is-empty':''}><i/>{date==='23'?<em>★</em>:null}</span></div>)}
          </div>
          <div className="feeding-report-wide is-count">
            <span className="feeding-count-ring"><img src="assets/baby-feeding-icons/formula.png" alt=""/></span><div><b>喂奶次数 <strong>10</strong>次</b><p>参考次数　12~14次</p></div><i>›</i>
            <div className="feeding-day-timeline"><span/><span className="is-on"/><span/><span className="is-on"/><span/><span className="is-on"/><span/><span className="is-on"/><span/><span className="is-on"/><span/><small>06:00</small><small>12:00</small><small>18:00</small><small>次日00:00</small></div>
          </div>
          <div className="feeding-report-grid">
            <div><i>›</i><b>白天单次时长</b><strong>11.4<small>分钟</small></strong><span className="feeding-mini-bars is-yellow">{[22,18,31,25,35,20,26,34,19,30].map((h,i)=><i key={i} style={{height:h}}/>)}</span></div>
            <div><i>›</i><b>白天间隔时长</b><strong>2.4<small>小时</small></strong><span className="feeding-mini-interval is-yellow"><i/><i/><i/><i/><i/><i/></span></div>
            <div><i>›</i><b>夜奶次数</b><strong>3<small>次　21:00-次日06:00</small></strong><span className="feeding-mini-dots"><i/><i/><i/><i className="is-on"/><i/><i/><i/></span></div>
            <div><i>›</i><b>夜奶间隔时长</b><strong>2.5<small>小时</small></strong><span className="feeding-mini-interval is-purple"><i/><i/><i/></span></div>
          </div>
        </article>
        <article className="feeding-week-analysis">
          <header><span>Ai</span><b>周规律分析</b></header>
          <h3>3月19日-3月25日，已记录7天</h3>
          <section className="feeding-analysis-copy-block"><h4><i/>0–1月龄重点关注 <span>收起⌃</span></h4><p>本月依旧可以按需喂养，每天吃奶8–12次或更多，夜奶间隔2–3小时吃一次都是适宜的。此外，哺乳期妈妈要多吃瘦肉、蛋奶类、豆制品等高蛋白食物，每天喝2100ml水，有利于乳汁分泌。</p></section>
          <section className="feeding-analysis-copy-block"><h4><i/>周规律解读</h4>
            <FeedingRangeRow title="喂奶次数" value="10.6次" status="符合参考值" note="小豆苗这周每天吃奶次数符合参考值，平均10.6次。妈妈记得多喝水，哺乳间隙多休息。"/>
            <FeedingRangeRow title="白天间隔时长" value="1.3–3.9h" status="偏短" statusKind="warn" left="偏短" right="偏长"/>
            <FeedingRangeRow title="白天单次时长" value="11–68min" status="偏长" statusKind="warn" left="偏短" right="偏长" note="白天规律：小豆苗白天吃奶间隔最短只有35分钟，有52次吃奶不足10分钟，可能存在宝宝频繁短时进食问题。新生儿每次哺乳时长一般在20–30分钟，间隔1.5–3小时。"/>
            <FeedingRangeRow title="夜奶次数" value="2次" status="符合参考值" left="偏少" right="偏多"/>
            <FeedingRangeRow title="夜奶间隔时长" value="9–65min" status="不规律" statusKind="bad" left="偏短" right="偏长" note="夜奶规律：小豆苗白天吃奶间隔最短只有35分钟，有52次吃奶不足10分钟，可能存在宝宝频繁短时进食问题。新生儿每次哺乳时长一般在20–30分钟，间隔1.5–3小时。"/>
          </section>
          <section className="feeding-analysis-copy-block"><h4><i/>原因分析</h4><p>喂养次数多、宝宝频繁短时进食情况，原因可能有：</p><p><b>哺乳效率低：</b>宝宝含接姿势不对，吸吮效果差，乳汁吸不出；或妈妈乳腺管未通，乳汁流出不顺，宝宝吃起来费劲，易频繁松口。</p><p><b>母乳不足：</b>妈妈产后身体未恢复，或饮食过于清淡、营养摄入不足，使得乳汁分泌量暂时无法满足宝宝需求。</p></section>
          <section className="feeding-analysis-copy-block"><h4><i/>下一步建议</h4><p><b>吸空一侧乳房：</b>这样能确保宝宝吃到高脂肪后奶，增加饱腹感。</p><p><b>夜间按需哺乳：</b>如果宝宝体重正常、状态良好，大小便也正常，超3小时未醒可暂不叫醒。</p></section>
        </article>
      </div>
    </section>
  );
}

const SLEEP_REVIEW_DATES = ['7.8','7.9','7.10','7.11','7.12','7.13','今天'];
const SLEEP_REVIEW_COUNTS = [5,4,5,6,5,4,4];
const SLEEP_REVIEW_HOURS = [14.8,15.6,14.3,16.1,15.2,14.7,15.0];
const SLEEP_REVIEW_PERIODS = [
  [[0.4,5.8],[8.2,9.5],[12.1,13.3],[16,17.2],[20.5,24]], [[0,5.4],[8.6,10],[12.8,14],[17.1,18.2],[21,24]],
  [[0.2,6],[9,10.1],[13,14.4],[16.4,17.6],[20.8,24]], [[0,5.7],[8.1,9],[11.4,12.4],[14.8,15.7],[18,19],[21.4,24]],
  [[0.3,6.1],[8.7,10],[12.5,13.7],[16.2,17.4],[20.6,24]], [[0.1,5.5],[9.2,10.6],[13.5,14.7],[17,18.1],[21.2,24]],
  [[0.2,6],[8.5,9.8],[13,14.2],[20.9,24]],
];

function SleepRecordReviewPage({open,onClose}){
  return (
    <section className={'sleep-record-review'+(open?' is-open':'')} aria-hidden={!open} aria-label="喂养记录回顾">
      <header className="sleep-record-nav"><button type="button" aria-label="返回" onClick={onClose}><ReviewBackIcon/></button><b>喂养分析</b><span>参考表</span></header>
      <nav className="sleep-record-tabs" aria-label="喂养分析分类"><span>喂奶</span><b>睡眠</b><span>换尿布</span><span>辅食</span><span>全部</span></nav>
      <div className="sleep-record-scroll">
        <article className="sleep-smart-card">
          <header><span>Ai</span><b>智能分析</b><i>养成规律睡眠，促进智力发育</i><strong>›</strong></header>
          <div className="sleep-smart-body"><div className="sleep-smart-score"><b>每天睡觉</b><strong>10<i>h</i><small>34min</small></strong><span>第24周</span></div><div className="sleep-smart-status"><p>睡眠量　<em className="is-good">符合参考值</em></p><p>白天小睡　<em className="is-attention">建议关注</em></p><p>夜间睡眠　<em>未记录</em></p><button type="button">立即查看</button></div></div>
        </article>
        <article className="sleep-record-module sleep-pattern-first">
          <h2>时间规律</h2>
          <div className="sleep-time-grid"><div className="sleep-time-days">{SLEEP_REVIEW_DATES.map((date,dayIndex)=><span key={date}>{SLEEP_REVIEW_PERIODS[dayIndex].map((period,index)=><i key={index} style={{top:(period[0]/24*100)+'%',height:((period[1]-period[0])/24*100)+'%'}}/>)}</span>)}</div><div className="sleep-time-axis">{[0,2,4,6,8,10,12,14,16,18,20,22,24].map(hour=><span key={hour} style={{top:(hour/24*100)+'%'}}>{hour}</span>)}</div></div>
          <div className="sleep-record-dates">{SLEEP_REVIEW_DATES.map((date,index)=><span key={date} className={index===3||index===4||index===6?'is-hot':''}>{date}</span>)}</div>
          <div className="sleep-record-legend"><i/>睡眠</div>
        </article>
        <article className="sleep-record-module sleep-amount-second">
          <h2>睡眠量</h2>
          <section><h3><i/>总次数</h3><div className="sleep-record-counts">{SLEEP_REVIEW_COUNTS.map((count,index)=><span key={SLEEP_REVIEW_DATES[index]}>{count}次</span>)}</div></section>
          <section><h3><i/>总时长</h3><div className="sleep-duration-empty has-data"><span>近7天平均每天15小时6分钟</span><div>{SLEEP_REVIEW_HOURS.map((hours,index)=><i key={SLEEP_REVIEW_DATES[index]} style={{height:(hours/18*230)}}><b>{hours}h</b></i>)}</div></div><div className="sleep-record-dates">{SLEEP_REVIEW_DATES.map((date,index)=><span key={date} className={index===3||index===4||index===6?'is-hot':''}>{date}</span>)}</div></section>
        </article>
      </div>
    </section>
  );
}

function BabyReviewCard({title, kind}){
  return (
    <ReviewCard
      title={title}
      iconClass="is-placeholder"
      icon={<ReviewBabyIcon kind={kind}/>}
      chart={<ReviewPlaceholderChart/>}
      legend={<span className="review-legend-item is-placeholder"><i></i>记录变化</span>}
      metrics={<ReviewPlaceholderMetrics/>}
      more={'查看完整' + title + '分析'}
    />
  );
}

function ReviewChevron(){
  return <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>;
}

function ReviewBackIcon(){
  return <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>;
}

function ReviewCard({title, iconClass='', icon, chart, legend, metrics, more, moreIcon, sample, onOpen, onMore, headerAction}){
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
          {headerAction ? <div className="review-card-head-action" onClick={event=>event.stopPropagation()}>{headerAction}</div> : null}
        </div>
        <div className="review-chart">{chart}</div>
        <div className="review-legend">{legend}</div>
        <div className="review-metrics">{metrics}</div>
      </div>
      <div className="review-card-more" role="button" aria-label={more} tabIndex={onMore ? 0 : undefined} onClick={event=>{if(onMore){event.stopPropagation();onMore();}}} onKeyDown={event=>{if(onMore&&(event.key==='Enter'||event.key===' ')){event.preventDefault();event.stopPropagation();onMore();}}}>
        <div className="review-card-more-main">{moreIcon}{more}</div>
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
  const [feedingAnalysisOpen, setFeedingAnalysisOpen] = useState(false);
  const [feedingFullOpen, setFeedingFullOpen] = useState(false);
  const [sleepRecordOpen, setSleepRecordOpen] = useState(false);
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

      <FeedingReviewCard onOpen={()=>setFeedingAnalysisOpen(true)} onFullOpen={()=>setFeedingFullOpen(true)}/>
      <SleepReviewCard onFullOpen={()=>setSleepRecordOpen(true)}/>
      <DiaperReviewCard/>
      <FoodReviewCard/>
      </div>
      <CycleDetailPage open={cycleDetailOpen} onClose={()=>setCycleDetailOpen(false)}/>
      <FeedingAnalysisSheet open={feedingAnalysisOpen} onClose={()=>setFeedingAnalysisOpen(false)}/>
      <FeedingFullAnalysisPage open={feedingFullOpen} onClose={()=>setFeedingFullOpen(false)}/>
      <SleepRecordReviewPage open={sleepRecordOpen} onClose={()=>setSleepRecordOpen(false)}/>
    </main>
  );
}

window.ReviewPage = ReviewPage;
