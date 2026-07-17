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

function ReviewSupplementIcon(){
  return <svg viewBox="0 0 24 24"><path d="M8.2 5.2a4.2 4.2 0 0 1 5.9 0l4.7 4.7a4.2 4.2 0 0 1-5.9 5.9l-4.7-4.7a4.2 4.2 0 0 1 0-5.9z"/><path d="M10.6 13.5l5.9-5.9"/></svg>;
}

function ReviewWaveIcon(){
  return <svg className="review-wave-icon" viewBox="0 0 20 14" aria-hidden="true"><path d="M1 9l4-5 4 6 4-7 6 5"/></svg>;
}

function ReviewShareIcon(){
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3"/><circle cx="5.5" cy="10" r="2.2"/><circle cx="18.5" cy="10" r="2.2"/><path d="M7.5 19v-1.4c0-2.6 2-4.6 4.5-4.6s4.5 2 4.5 4.6V19M2.5 18v-1c0-1.9 1.3-3.5 3.1-3.8M21.5 18v-1c0-1.9-1.3-3.5-3.1-3.8"/></svg>;
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
      onOpen={onFullOpen}
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

function DiaperReviewCard({onFullOpen}){
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
      onOpen={onFullOpen}
      onMore={onFullOpen}
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

function FoodReviewCard({onFullOpen}){
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
      onOpen={onFullOpen}
      onMore={onFullOpen}
    />
  );
}

const SUPPLEMENT_TYPES = [
  {key:'ad', name:'AD', short:'AD', color:'#ff7f9f'},
  {key:'d3', name:'D3', short:'D3', color:'#f3a638'},
  {key:'probiotic', name:'益生菌', short:'益', color:'#54bd82'},
  {key:'calcium', name:'钙', short:'钙', color:'#6f9ee8'},
  {key:'iron', name:'铁', short:'铁', color:'#e26a62'},
  {key:'zinc', name:'锌', short:'锌', color:'#8b75d1'},
  {key:'dha', name:'DHA', short:'DHA', color:'#42aeb7'},
];

const SUPPLEMENT_REVIEW_DAYS = Array.from({length:30}, (_item,index)=>{
  const patterns = [
    ['ad','d3','probiotic'], ['ad','calcium','dha'], ['ad','d3','iron'],
    ['ad','probiotic','zinc'], ['ad','d3','calcium','dha'], ['ad','iron','zinc'],
  ];
  const missed = index === 6 || index === 18;
  return {
    date:index === 29 ? '今天' : (index < 10 ? '9.' + (22 + index) : '10.' + (index - 9)),
    items:missed ? [] : patterns[index % patterns.length],
    missed,
  };
});

function SupplementReviewChart(){
  const W=340,H=176,padL=42,padR=10,padT=10,padB=27;
  const x0=padL,x1=W-padR,y0=padT,y1=H-padB;
  const band=(x1-x0)/SUPPLEMENT_REVIEW_DAYS.length;
  const row=(y1-y0)/SUPPLEMENT_TYPES.length;
  const X=index=>x0+band*index+band/2;
  const Y=index=>y0+row*index+row/2;
  const dateMarks={0:true,7:true,14:true,21:true,29:true};
  const supplementRuns=SUPPLEMENT_TYPES.map(type=>{
    const activeIndexes=SUPPLEMENT_REVIEW_DAYS.reduce((indexes,day,index)=>day.items.includes(type.key)?indexes.concat(index):indexes,[]);
    return activeIndexes.reduce((runs,index)=>{
      const current=runs[runs.length-1];
      if(current&&index===current[current.length-1]+1) current.push(index);
      else runs.push([index]);
      return runs;
    },[]);
  });
  return (
    <svg viewBox="0 0 340 176" preserveAspectRatio="xMidYMid meet" role="img" aria-label="近30天营养补剂服用类型与漏服记录图">
      {SUPPLEMENT_TYPES.map((type,index)=><React.Fragment key={type.key}><line x1={x0} y1={Y(index)} x2={x1} y2={Y(index)} stroke="rgba(0,0,0,.045)" strokeWidth="1"/><text x={x0-6} y={Y(index)+3} textAnchor="end" fontSize="8.5" fill="#9999a0" fontFamily="PingFang SC">{type.short}</text></React.Fragment>)}
      {SUPPLEMENT_TYPES.map((type,typeIndex)=>supplementRuns[typeIndex].map((run,runIndex)=><line key={type.key+'-'+runIndex} x1={X(run[0])-band*.28} y1={Y(typeIndex)} x2={X(run[run.length-1])+band*.28} y2={Y(typeIndex)} stroke={type.color} strokeWidth="4.6" strokeLinecap="round"/>))}
      {SUPPLEMENT_REVIEW_DAYS.map((day,dayIndex)=>dateMarks[dayIndex]?<text key={day.date} x={X(dayIndex)} y={H-8} textAnchor={dayIndex===0?'start':(dayIndex===29?'end':'middle')} fontSize="9" fontWeight={dayIndex===29?'600':'400'} fill={dayIndex===29?'#e86686':'#bbbbbf'} fontFamily="PingFang SC">{day.date}</text>:null)}
    </svg>
  );
}

function SupplementReviewCard({onFullOpen}){
  return (
    <ReviewCard
      title="营养补剂"
      iconClass="is-supplement"
      icon={<ReviewSupplementIcon/>}
      chart={<SupplementReviewChart/>}
      legend={<>{SUPPLEMENT_TYPES.map(type=><span className="review-legend-item is-supplement" key={type.key}><i style={{background:type.color}}></i>{type.name}</span>)}</>}
      metrics={<><ReviewMetric value="AD" unit="1粒" label="最近补充"/><ReviewMetric value="7" unit="天" label="近7日连续"/><ReviewMetric value="6" unit="次" label="近30天日均"/></>}
      more="查看完整营养补剂变化"
      onOpen={onFullOpen}
      onMore={onFullOpen}
    />
  );
}

const PUMP_REVIEW_DATA = [
  148,156,162,158,171,166,174,169,160,155,164,172,168,176,170,
  163,159,167,173,165,178,171,166,160,169,174,168,162,156,150,
];

function PumpReviewChart(){
  const W = 340, H = 168, padL = 32, padR = 12, padT = 14, padB = 27;
  const x0 = padL, x1 = W-padR, y1 = H-padB;
  const yMin = 120, yMax = 190;
  const X = index=>x0+(x1-x0)*(index/(PUMP_REVIEW_DATA.length-1));
  const Y = value=>y1-(value-yMin)/(yMax-yMin)*(y1-padT);
  const points = PUMP_REVIEW_DATA.map((value,index)=>[X(index),Y(value)]);
  const dateMarks = [{index:0,label:'9.22'},{index:7,label:'9.29'},{index:14,label:'10.6'},{index:21,label:'10.13'},{index:29,label:'今天'}];
  return (
    <svg viewBox="0 0 340 168" preserveAspectRatio="xMidYMid meet" role="img" aria-label="近30天吸奶量折线图">
      {[140,160,180].map(tick=><React.Fragment key={tick}><line x1={x0} y1={Y(tick)} x2={x1} y2={Y(tick)} stroke="rgba(0,0,0,0.05)" strokeWidth="1"/><text x={x0-5} y={Y(tick)+3} textAnchor="end" fontSize="9" fill="#bbbbbf" fontFamily="PingFang SC">{tick}</text></React.Fragment>)}
      <line x1={x0} y1={y1} x2={x1} y2={y1} stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
      <path d={reviewSmoothPath(points)} fill="none" stroke="#c05bd8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {PUMP_REVIEW_DATA.map((value,index)=><circle key={index} cx={X(index)} cy={Y(value)} r={index===PUMP_REVIEW_DATA.length-1?4:2.2} fill="#c05bd8" stroke={index===PUMP_REVIEW_DATA.length-1?'#fff':'none'} strokeWidth="2"/>)}
      <text x={X(29)-3} y={Y(PUMP_REVIEW_DATA[29])-9} textAnchor="end" fontSize="9.5" fontWeight="600" fill="#a849c2" fontFamily="PingFang SC">150ml</text>
      {dateMarks.map(mark=><text key={mark.index} x={X(mark.index)} y={H-8} textAnchor={mark.index===0?'start':(mark.index===29?'end':'middle')} fontSize="9" fontWeight={mark.index===29?'600':'400'} fill={mark.index===29?'#a849c2':'#bbbbbf'} fontFamily="PingFang SC">{mark.label}</text>)}
    </svg>
  );
}

function PumpReviewCard({onFullOpen}){
  return (
    <ReviewCard
      title="吸奶"
      iconClass="is-pump"
      icon={<img className="review-pump-icon" src="assets/baby-feeding-icons/pump.png" alt=""/>}
      chart={<PumpReviewChart/>}
      legend={<span className="review-legend-item is-pump"><i></i>吸奶量（ml）</span>}
      metrics={<><ReviewMetric value="150" unit="ml" label="最近吸奶"/><ReviewMetric value="165" unit="ml" label="近30天平均"/><div className="review-metric"><div className="review-metric-value is-trend is-wave"><ReviewWaveIcon/>波动</div><div className="review-metric-label">整体趋势</div></div></>}
      more="查看完整吸奶变化"
      onOpen={onFullOpen}
      onMore={onFullOpen}
    />
  );
}

const FEEDING_REVIEW_DAYS = [
  {date:'10.15', breast:220, formula:300, minutes:48, directCount:3, leftMinutes:25, rightMinutes:23, feeds:[{hour:1.2,type:'formula'},{hour:8.4,type:'direct'},{hour:13.1,type:'breast'},{hour:18.3,type:'direct'},{hour:22.1,type:'formula'}]},
  {date:'10.16', breast:260, formula:350, minutes:42, directCount:3, leftMinutes:20, rightMinutes:22, feeds:[{hour:.8,type:'formula'},{hour:7.9,type:'direct'},{hour:11.8,type:'breast'},{hour:16.5,type:'formula'},{hour:20.7,type:'direct'},{hour:23,type:'breast'}]},
  {date:'10.17', breast:190, formula:280, minutes:37, directCount:2, leftMinutes:18, rightMinutes:19, feeds:[{hour:2,type:'formula'},{hour:9.2,type:'direct'},{hour:13.8,type:'breast'},{hour:18.8,type:'direct'},{hour:22.4,type:'formula'}]},
  {date:'10.18', breast:300, formula:380, minutes:50, directCount:4, leftMinutes:26, rightMinutes:24, feeds:[{hour:1.4,type:'formula'},{hour:6.8,type:'direct'},{hour:10.5,type:'breast'},{hour:14.2,type:'direct'},{hour:18,type:'formula'},{hour:21.5,type:'direct'},{hour:23.3,type:'breast'}]},
  {date:'10.19', breast:240, formula:300, minutes:44, directCount:3, leftMinutes:22, rightMinutes:22, feeds:[{hour:2.3,type:'formula'},{hour:8.2,type:'direct'},{hour:12.7,type:'breast'},{hour:17.2,type:'direct'},{hour:21.8,type:'formula'}]},
  {date:'10.20', breast:293, formula:380, minutes:39, directCount:3, leftMinutes:20, rightMinutes:19, feeds:[{hour:1.1,type:'formula'},{hour:7.4,type:'direct'},{hour:11.3,type:'breast'},{hour:15.6,type:'formula'},{hour:19.7,type:'direct'},{hour:22.8,type:'breast'}]},
  {date:'今天', breast:580, formula:120, minutes:42, directCount:3, leftMinutes:21, rightMinutes:21, feeds:[{hour:1.5,type:'formula'},{hour:8,type:'direct'},{hour:12.2,type:'breast'},{hour:16.8,type:'direct'},{hour:21.3,type:'breast'}], highlight:true},
];

function FeedingReviewChart(){
  const days = FEEDING_REVIEW_DAYS;
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
      {kind === 'recent' ? (
        <div className="review-feeding-recent-value"><span className="review-feeding-formula-icon" aria-label="瓶喂配方奶"><ReviewFormulaRecordIcon/></span><div><b>120</b><i>ml</i></div></div>
      ) : null}
      {kind === 'average' ? (
        <div className="review-feeding-average-value"><b>599</b><i>ml</i></div>
      ) : null}
      {kind === 'trend' ? (
        <div className="review-feeding-average-value"><b>6.9</b><i>次</i></div>
      ) : null}
      <div className="review-metric-label">{label}</div>
    </div>
  );
}

function FeedingReviewCard({onFullOpen}){
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
      metrics={(
        <>
          <FeedingReviewMetric kind="recent" label="最近记录"/>
          <FeedingReviewMetric kind="average" label="近7天平均"/>
          <FeedingReviewMetric kind="trend" label="近7天平均"/>
        </>
      )}
      more="查看完整喂奶变化"
      onOpen={onFullOpen}
      onMore={onFullOpen}
    />
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

function ReviewCard({title, iconClass='', icon, chart, legend, metrics, more, sample, onOpen, onMore}){
  const isActionable = typeof onOpen === 'function';
  const isMoreActionable = typeof onMore === 'function';
  const handleKeyDown = (event)=>{
    if(!isActionable) return;
    if(event.key === 'Enter' || event.key === ' '){
      event.preventDefault();
      onOpen();
    }
  };
  const handleMoreKeyDown = (event)=>{
    if(!isMoreActionable) return;
    if(event.key === 'Enter' || event.key === ' '){
      event.preventDefault();
      event.stopPropagation();
      onMore();
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
      <div
        className={'review-card-more'+(isMoreActionable?' is-actionable':'')}
        role="button"
        tabIndex={isMoreActionable ? 0 : undefined}
        aria-label={more}
        onClick={isMoreActionable ? (event)=>{ event.stopPropagation(); onMore(); } : undefined}
        onKeyDown={handleMoreKeyDown}
      >
        <div className="review-card-more-main">{more}</div>
        <ReviewChevron/>
      </div>
      {sample}
    </div>
  );
}

function FeedingReviewTabs({active,onChange}){
  return (
    <nav className="feeding-review-tabs" aria-label="喂养分析分类">
      <button type="button" className={active==='feeding'?'is-active':''} aria-current={active==='feeding'?'page':undefined} onClick={()=>onChange('feeding')}>喂奶</button>
      <button type="button" className={active==='sleep'?'is-active':''} aria-current={active==='sleep'?'page':undefined} onClick={()=>onChange('sleep')}>睡眠</button>
      <button type="button" className={active==='diaper'?'is-active':''} aria-current={active==='diaper'?'page':undefined} onClick={()=>onChange('diaper')}>换尿布</button>
      <button type="button" className={active==='food'?'is-active':''} aria-current={active==='food'?'page':undefined} onClick={()=>onChange('food')}>辅食</button>
      <button type="button" className={active==='supplement'?'is-active':''} aria-current={active==='supplement'?'page':undefined} onClick={()=>onChange('supplement')}>营养补充</button>
      <button type="button" className={active==='pump'?'is-active':''} aria-current={active==='pump'?'page':undefined} onClick={()=>onChange('pump')}>吸奶</button>
      <button type="button" className={active==='all'?'is-active':''} aria-current={active==='all'?'page':undefined} onClick={()=>onChange('all')}>全部</button>
    </nav>
  );
}

function FeedingRecordReviewContent(){
  const days = FEEDING_REVIEW_DAYS;
  const maxBottle = Math.max(...days.map(day=>day.breast+day.formula));
  const bottleAverage = Math.round(days.reduce((sum,day)=>sum+day.breast+day.formula,0)/days.length);
  return (
    <div className="feeding-record-scroll" aria-label="喂奶分析内容">
        <article className="feeding-smart-card">
          <header><span>Ai</span><b>小小屁的喂奶规律解读</b><em>VIP</em><strong>›</strong></header>
          <div className="feeding-smart-body">
            <div className="feeding-smart-score"><b>每天喝奶</b><strong>10<i>次</i></strong><span>第24周</span></div>
            <div className="feeding-smart-status"><p>喂奶次数　<em className="is-good">符合参考值</em></p><p>白天规律　<em className="is-attention">建议关注</em></p><p>夜奶规律　<em>未记录</em></p><button type="button">立即查看</button></div>
          </div>
        </article>

        <article className="feeding-record-module">
          <h2>时间规律</h2>
          <div className="feeding-pattern-grid">
            <div className="feeding-pattern-days">{days.map(day=><span key={day.date}>{day.feeds.map((feed,index)=><i key={index} className={'is-'+feed.type} style={{top:(feed.hour/24*100)+'%'}}/>)}</span>)}</div>
            <div className="feeding-pattern-axis">{[0,2,4,6,8,10,12,14,16,18,20,22,24].map(hour=><span key={hour} style={{top:(hour/24*100)+'%'}}>{hour}</span>)}</div>
          </div>
          <div className="feeding-record-dates">{days.map(day=><span key={day.date} className={day.highlight?'is-hot':''}>{day.date}</span>)}</div>
          <div className="feeding-record-legend"><span className="is-direct"><i/>母乳</span><span className="is-formula"><i/>配方奶</span><span className="is-breast"><i/>瓶喂母乳</span></div>
        </article>

        <article className="feeding-record-module feeding-amount-module">
          <header><h2>喂奶量</h2><span>统计周期：每日00:00-24:00</span></header>
          <section><h3><i/>亲喂母乳</h3><div className="feeding-direct-table"><div className="feeding-direct-labels"><span>次数</span><span>左</span><span>右</span></div>{days.map(day=><div key={day.date}><b>{day.directCount}次</b><span>{day.leftMinutes}分钟</span><span>{day.rightMinutes}分钟</span></div>)}</div></section>
          <section><h3><i/>瓶喂</h3><div className="feeding-bottle-chart"><div className="feeding-average-badge">近7天平均每天{bottleAverage}ml</div>{days.map(day=>{const total=day.breast+day.formula;const height=Math.round(total/maxBottle*230);return <div className="feeding-bottle-day" key={day.date}><div className="feeding-bottle-bar" style={{height}}><i className="is-breast" style={{height:(day.breast/total*100)+'%'}}>{day.breast}</i><i className="is-formula" style={{height:(day.formula/total*100)+'%'}}>{day.formula}</i></div></div>;})}</div><div className="feeding-record-dates">{days.map(day=><span key={day.date} className={day.highlight?'is-hot':''}>{day.date}</span>)}</div><div className="feeding-record-legend"><span className="is-breast"><i/>瓶喂母乳</span><span className="is-formula"><i/>瓶喂配方奶</span></div></section>
        </article>
    </div>
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

function SleepRecordReviewContent(){
  return (
    <div className="sleep-record-scroll" aria-label="睡眠分析内容">
        <article className="sleep-smart-card">
          <header><span>Ai</span><b>智能分析</b><em>VIP</em><i>养成规律睡眠，促进智力发育</i><strong>›</strong></header>
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
  );
}

const DIAPER_REVIEW_DAYS = [
  {date:'10.15',time:8.5,count:1},{date:'10.16',time:11.5,count:1},{date:'10.17',time:null,count:0},
  {date:'10.18',time:7.5,count:1,hot:true},{date:'10.19',time:18.5,count:1,hot:true},{date:'10.20',time:9.5,count:1},{date:'今天',time:null,count:0,hot:true},
];

function DiaperRecordReviewContent(){
  return (
    <div className="diaper-record-scroll" aria-label="换尿布分析内容">
      <article className="diaper-record-module">
        <h2>时间规律</h2>
        <div className="diaper-time-grid">
          <div className="diaper-time-days">{DIAPER_REVIEW_DAYS.map(day=><span key={day.date}>{day.time==null?null:<i style={{top:(day.time/24*100)+'%'}}>🩲</i>}</span>)}</div>
          <div className="diaper-time-axis">{[0,2,4,6,8,10,12,14,16,18,20,22,24].map(hour=><span key={hour} style={{top:(hour/24*100)+'%'}}>{hour}</span>)}</div>
        </div>
        <div className="diaper-record-dates">{DIAPER_REVIEW_DAYS.map(day=><span key={day.date} className={day.hot?'is-hot':''}>{day.date}</span>)}</div>
        <div className="diaper-record-legend"><i>🩲</i>换尿布</div>
      </article>

      <article className="diaper-record-module diaper-count-module">
        <h2>换尿布次数</h2>
        <h3><i/>总次数</h3>
        <div className="diaper-count-chart">
          <div className="diaper-count-average">近7天平均每天1.0次</div>
          {DIAPER_REVIEW_DAYS.map(day=><div className="diaper-count-day" key={day.date}>{day.count?<><b>{day.count}次</b><i style={{height:42}}/></>:null}</div>)}
        </div>
        <div className="diaper-record-dates">{DIAPER_REVIEW_DAYS.map(day=><span key={day.date} className={day.hot?'is-hot':''}>{day.date}</span>)}</div>
        <div className="diaper-count-legend"><span className="is-pee"><i/>嘘嘘</span><span className="is-poop"><i/>臭臭</span><span className="is-both"><i/>嘘嘘+臭臭</span><span className="is-diaper"><i/>换尿布</span></div>
      </article>

      <article className="diaper-advice-card">
        <h2>分析与建议</h2>
        <p>昨天臭臭是正常的哦~</p>
        <p>宝宝大便的颜色与食物息息相关，如果发现大便的次数或者稠度有改变的话，要及时调整婴儿以及母亲的饮食。在平时的喂养中，可以给6月龄以上的宝宝适当补充水分，宝宝醒着的时候要多陪他玩耍，增加运动量，必要时为宝宝肚子做做按摩，帮助肠胃蠕动。</p>
        <p>另外，排出好便便的快捷方式是充分摄取膳食纤维，所以宝宝满6月龄添加辅食后，就可以尝试各种新鲜的蔬菜水果，促进健康排便。</p>
      </article>
    </div>
  );
}

const FOOD_DETAIL_DAYS = [
  {date:'10.15',count:1,grams:600,time:10.2},{date:'10.16',count:1,grams:500,time:11.1},{date:'10.17',count:1,grams:600,time:10.6},
  {date:'10.18',count:1,grams:500,time:11.5},{date:'10.19',count:1,grams:600,time:10.8},{date:'10.20',count:1,grams:600,time:11.2},{date:'今天',count:1,grams:600,time:10.5,hot:true},
];

function FoodRecordReviewContent(){
  const maxAmount = Math.max(...FOOD_DETAIL_DAYS.map(day=>day.grams),1);
  return (
    <div className="food-record-scroll" aria-label="辅食分析内容">
      <article className="food-record-module">
        <h2>时间规律</h2>
        <div className="food-time-grid">
          <div className="food-time-days">{FOOD_DETAIL_DAYS.map(day=><span key={day.date}>{day.time==null?null:<i style={{top:(day.time/24*100)+'%'}}>🥣</i>}</span>)}</div>
          <div className="food-time-axis">{[0,2,4,6,8,10,12,14,16,18,20,22,24].map(hour=><span key={hour} style={{top:(hour/24*100)+'%'}}>{hour}</span>)}</div>
        </div>
        <div className="food-record-dates">{FOOD_DETAIL_DAYS.map(day=><span key={day.date} className={day.hot?'is-hot':''}>{day.date}</span>)}</div>
        <div className="food-record-legend"><i>🥣</i>辅食</div>
      </article>

      <article className="food-record-module food-amount-detail">
        <h2>辅食量</h2>
        <section><h3><i/>总次数</h3><div className="food-count-row">{FOOD_DETAIL_DAYS.map(day=><span key={day.date}>{day.count}次</span>)}</div></section>
        <section><h3><i/>总量</h3><div className="food-amount-chart"><div className="food-average-badge">近7天平均每天600克</div>{FOOD_DETAIL_DAYS.map(day=><div className="food-amount-day" key={day.date}>{day.grams?<><b>{day.grams.toFixed(1)}g</b><i style={{height:Math.round(day.grams/maxAmount*230)}}/></>:null}</div>)}</div><div className="food-record-dates">{FOOD_DETAIL_DAYS.map(day=><span key={day.date} className={day.hot?'is-hot':''}>{day.date}</span>)}</div></section>
      </article>
    </div>
  );
}

const SUPPLEMENT_DETAIL_DAYS = [
  {date:'10.15',events:[{time:8.1,type:'ad'},{time:8.7,type:'d3'},{time:19.2,type:'probiotic'}]},
  {date:'10.16',events:[{time:8.4,type:'ad'},{time:12.2,type:'calcium'},{time:19.5,type:'dha'}]},
  {date:'10.17',events:[{time:7.8,type:'ad'},{time:8.5,type:'d3'},{time:18.8,type:'iron'}]},
  {date:'10.18',events:[{time:8.3,type:'ad'},{time:13.1,type:'probiotic'},{time:19.1,type:'zinc'}]},
  {date:'10.19',events:[{time:7.9,type:'ad'},{time:8.6,type:'d3'},{time:12.4,type:'calcium'},{time:19.4,type:'dha'}]},
  {date:'10.20',events:[{time:8.2,type:'ad'},{time:13.3,type:'iron'},{time:19.0,type:'zinc'}]},
  {date:'今天',hot:true,events:[{time:8.0,type:'ad'},{time:8.8,type:'d3'},{time:18.6,type:'probiotic'}]},
];

function SupplementRecordReviewContent(){
  const recentDays = SUPPLEMENT_REVIEW_DAYS.slice(-7);
  const maxCount = Math.max(...recentDays.map(day=>day.items.length),1);
  const average = recentDays.reduce((sum,day)=>sum+day.items.length,0)/recentDays.length;
  const typeByKey = Object.fromEntries(SUPPLEMENT_TYPES.map(type=>[type.key,type]));
  return (
    <div className="supplement-record-scroll" aria-label="营养补充分析内容">
      <article className="supplement-record-module">
        <h2>时间规律</h2>
        <div className="supplement-time-grid">
          <div className="supplement-time-days">{SUPPLEMENT_DETAIL_DAYS.map(day=><span key={day.date}>{day.events.map((event,index)=>{const type=typeByKey[event.type];return <i key={event.type+'-'+index} style={{top:(event.time/24*100)+'%',background:type.color}} aria-label={type.name+' '+event.time.toFixed(1)+'时'}>{type.short}</i>;})}</span>)}</div>
          <div className="supplement-time-axis">{[0,2,4,6,8,10,12,14,16,18,20,22,24].map(hour=><span key={hour} style={{top:(hour/24*100)+'%'}}>{hour}</span>)}</div>
        </div>
        <div className="supplement-record-dates">{SUPPLEMENT_DETAIL_DAYS.map(day=><span key={day.date} className={day.hot?'is-hot':''}>{day.date}</span>)}</div>
        <div className="supplement-detail-legend">{SUPPLEMENT_TYPES.map(type=><span key={type.key}><i style={{background:type.color}}/>{type.name}</span>)}</div>
      </article>
      <article className="supplement-record-module supplement-count-module">
        <h2>补充次数</h2>
        <h3><i/>每日总次数</h3>
        <div className="supplement-count-chart">
          <div className="supplement-count-average">近7天平均每天{average.toFixed(1)}次</div>
          {recentDays.map(day=><div className="supplement-count-day" key={day.date}>{day.items.length?<><b>{day.items.length}次</b><i style={{height:Math.round(day.items.length/maxCount*150)}}/></>:<span>漏服</span>}</div>)}
        </div>
        <div className="supplement-record-dates">{recentDays.map(day=><span key={day.date} className={day.date==='今天'?'is-hot':''}>{day.date}</span>)}</div>
      </article>
    </div>
  );
}

const PUMP_DETAIL_DAYS = [
  {date:'10.15',events:[{time:6.8,amount:85},{time:14.2,amount:70}]},
  {date:'10.16',events:[{time:7.1,amount:70},{time:12.0,amount:48},{time:18.2,amount:50}]},
  {date:'10.17',events:[{time:6.6,amount:82},{time:13.8,amount:72}]},
  {date:'10.18',events:[{time:7.4,amount:75},{time:12.8,amount:45},{time:18.0,amount:55}]},
  {date:'10.19',events:[{time:6.9,amount:88},{time:14.5,amount:76}]},
  {date:'10.20',events:[{time:7.2,amount:92},{time:15.1,amount:81}]},
  {date:'今天',hot:true,events:[{time:7.0,amount:150}]},
];

function PumpRecordReviewContent(){
  const dailyAmounts = PUMP_DETAIL_DAYS.map(day=>day.events.reduce((sum,event)=>sum+event.amount,0));
  const dailyCounts = PUMP_DETAIL_DAYS.map(day=>day.events.length);
  const average = Math.round(dailyAmounts.reduce((sum,amount)=>sum+amount,0)/dailyAmounts.length);
  const W=340,H=220,padL=34,padR=12,padT=48,padB=18;
  const minAmount=Math.min(...dailyAmounts)-10,maxAmount=Math.max(...dailyAmounts)+10;
  const X=index=>padL+(W-padL-padR)*(index/(dailyAmounts.length-1));
  const Y=amount=>padT+(maxAmount-amount)/(maxAmount-minAmount)*(H-padT-padB);
  const linePoints=dailyAmounts.map((amount,index)=>[X(index),Y(amount)]);
  return (
    <div className="pump-record-scroll" aria-label="吸奶分析内容">
      <article className="pump-record-module">
        <h2>时间规律</h2>
        <div className="pump-time-grid">
          <div className="pump-time-days">{PUMP_DETAIL_DAYS.map(day=><span key={day.date}>{day.events.map((event,index)=><i key={index} style={{top:(event.time/24*100)+'%'}} aria-label={event.time.toFixed(1)+'时吸奶'+event.amount+'毫升'}><img src="assets/baby-feeding-icons/pump.png" alt=""/></i>)}</span>)}</div>
          <div className="pump-time-axis">{[0,2,4,6,8,10,12,14,16,18,20,22,24].map(hour=><span key={hour} style={{top:(hour/24*100)+'%'}}>{hour}</span>)}</div>
        </div>
        <div className="pump-record-dates">{PUMP_DETAIL_DAYS.map(day=><span key={day.date} className={day.hot?'is-hot':''}>{day.date}</span>)}</div>
        <div className="pump-record-legend"><i><img src="assets/baby-feeding-icons/pump.png" alt=""/></i>吸奶</div>
      </article>
      <article className="pump-record-module pump-amount-module">
        <h2>吸奶量</h2>
        <h3><i/>总次数</h3>
        <div className="pump-count-row">{dailyCounts.map((count,index)=><span key={PUMP_DETAIL_DAYS[index].date}>{count}次</span>)}</div>
        <h3><i/>每日总量</h3>
        <div className="pump-amount-chart">
          <div className="pump-amount-average">近7天平均每天{average}ml</div>
          <svg viewBox={'0 0 '+W+' '+H} preserveAspectRatio="none" role="img" aria-label="近7天每日吸奶总量折线图">
            {[minAmount,Math.round((minAmount+maxAmount)/2),maxAmount].map(tick=><line key={tick} x1={padL} y1={Y(tick)} x2={W-padR} y2={Y(tick)} className="pump-line-grid"/>)}
            <path d={reviewSmoothPath(linePoints)} className="pump-line-path"/>
            {dailyAmounts.map((amount,index)=><g key={PUMP_DETAIL_DAYS[index].date}><circle cx={X(index)} cy={Y(amount)} r={index===dailyAmounts.length-1?5:4} className={index===dailyAmounts.length-1?'is-hot':''}/><text x={X(index)} y={Y(amount)-10} textAnchor="middle">{amount}ml</text></g>)}
          </svg>
        </div>
        <div className="pump-record-dates">{PUMP_DETAIL_DAYS.map(day=><span key={day.date} className={day.hot?'is-hot':''}>{day.date}</span>)}</div>
      </article>
    </div>
  );
}

const ALL_EVENT_ICONS = {
  direct:'assets/baby-feeding-icons/breast.png', formula:'assets/baby-feeding-icons/formula.png', breast:'assets/baby-feeding-icons/bottle-breast.png',
  diaper:'assets/baby-feeding-icons/diaper.png', food:'assets/baby-feeding-icons/solid-food.png', pump:'assets/baby-feeding-icons/pump.png',
  bath:'assets/baby-feeding-icons/bath.png', play:'assets/baby-feeding-icons/play.png', swim:'assets/baby-feeding-icons/swim.png', other:'assets/baby-feeding-icons/other-event.png',
};
const ALL_DETAIL_DAYS = [
  {date:'9.21',hot:true,sleep:[[10,11],[14.5,17],[21.8,24]],events:[[2.4,'direct'],[3.3,'formula'],[7.4,'direct'],[8.5,'bath'],[9.3,'direct'],[11.6,'direct'],[13.5,'diaper'],[13.7,'formula'],[17.6,'formula'],[18.4,'direct'],[19.4,'direct'],[20.7,'diaper'],[21.4,'formula']]},
  {date:'9.22',sleep:[[0,2.6],[4.2,7.1],[21.7,22.4]],events:[[2.5,'direct'],[3.4,'formula'],[7.3,'direct'],[8.4,'direct'],[9.4,'formula'],[10.9,'direct'],[12.4,'direct'],[13.5,'formula'],[16.1,'direct'],[18.4,'direct'],[19.3,'formula'],[20.7,'direct'],[21.4,'other']]},
  {date:'9.23',sleep:[[13.3,15.7],[17.5,18.5]],events:[[.5,'direct'],[2.4,'direct'],[3.4,'formula'],[6.8,'direct'],[8.4,'direct'],[9.4,'formula'],[10.4,'formula'],[12.5,'direct'],[15.7,'bath'],[16.5,'formula'],[18.4,'direct'],[19.4,'direct'],[20.4,'direct'],[21.4,'formula']]},
  {date:'9.24',sleep:[[10.7,12.5]],events:[[1.4,'direct'],[2.4,'formula'],[2.5,'diaper'],[5.4,'formula'],[7.4,'direct'],[8.4,'bath'],[8.5,'direct'],[9.4,'direct'],[10.4,'formula'],[11.4,'other'],[13.4,'direct'],[14.4,'formula'],[15.4,'direct'],[16.4,'formula'],[17.4,'direct'],[18.4,'direct'],[19.4,'formula'],[20.4,'direct'],[21.4,'formula']]},
  {date:'9.25',sleep:[[13.7,14.1],[20.9,24]],events:[[1.4,'direct'],[2.4,'formula'],[6.5,'formula'],[9.3,'direct'],[12.4,'direct'],[13.4,'formula'],[13.5,'diaper'],[17.4,'pump'],[18.4,'breast'],[19.4,'direct'],[20.4,'other'],[20.5,'formula']]},
  {date:'9.26',sleep:[[0,3.5],[4,6.5],[7.2,8.1],[10.8,12.8],[17.2,19.2],[21.7,24]],events:[[.4,'formula'],[.5,'breast'],[.6,'direct'],[4.4,'pump'],[4.5,'formula'],[6.4,'breast'],[7.4,'direct'],[8.4,'formula'],[9.3,'breast'],[9.4,'pump'],[10.3,'bath'],[13.4,'breast'],[13.5,'direct'],[14.4,'play'],[14.5,'formula'],[17.4,'formula'],[19.4,'play'],[19.5,'formula'],[19.6,'breast'],[20.4,'direct'],[21.4,'formula'],[23.4,'pump']]},
  {date:'9.27',hot:true,sleep:[[0,1.8],[3.2,5.1],[5.8,7.2],[8.2,10.1],[17.3,19.2],[21.8,22.4]],events:[[1.4,'direct'],[2.4,'breast'],[3.4,'formula'],[5.4,'formula'],[7.4,'direct'],[7.5,'bath'],[7.6,'diaper'],[8.4,'formula'],[8.5,'breast'],[11.4,'formula'],[12.4,'direct'],[13.4,'direct'],[15.4,'direct'],[15.5,'diaper'],[16.4,'formula'],[16.5,'breast'],[19.4,'direct'],[19.5,'breast'],[19.6,'direct'],[20.5,'formula'],[22.4,'formula']]},
];

function AllRecordReviewContent(){
  const [filterOpen,setFilterOpen] = React.useState(false);
  const filterItems = ['母乳','配方奶','瓶喂母乳','睡眠','换尿布','辅食','营养补剂','喝水','吸奶','洗澡','玩耍','游泳','其他事件'];
  React.useEffect(()=>{
    if(!filterOpen) return undefined;
    const handleKey = event=>{ if(event.key==='Escape') setFilterOpen(false); };
    window.addEventListener('keydown',handleKey);
    return ()=>window.removeEventListener('keydown',handleKey);
  },[filterOpen]);
  return (
    <>
      <div className="all-record-scroll" aria-label="全部喂养分析内容">
        <article className="all-record-module">
          <header><h2>时间规律</h2><button type="button" className="all-filter-trigger" aria-expanded={filterOpen} onClick={()=>setFilterOpen(true)}><span>筛选</span><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg></button></header>
          <div className="all-time-grid">
            <div className="all-time-days">{ALL_DETAIL_DAYS.map(day=><span key={day.date}>{day.sleep.map((period,index)=><i className="all-sleep-block" key={'sleep'+index} style={{top:(period[0]/24*100)+'%',height:((period[1]-period[0])/24*100)+'%'}}/>)}{day.events.map((event,index)=><i className={'all-event is-'+event[1]} key={'event'+index} style={{top:(event[0]/24*100)+'%'}}><img src={ALL_EVENT_ICONS[event[1]]} alt=""/></i>)}</span>)}</div>
            <div className="all-time-axis">{[0,2,4,6,8,10,12,14,16,18,20,22,24].map(hour=><span key={hour} style={{top:(hour/24*100)+'%'}}>{hour}</span>)}</div>
          </div>
          <div className="all-record-dates">{ALL_DETAIL_DAYS.map(day=><span key={day.date} className={day.hot?'is-hot':''}>{day.date}</span>)}</div>
          <div className="all-record-legend">{[['direct','母乳'],['formula','配方奶'],['breast','瓶喂母乳'],['sleep','睡眠'],['diaper','换尿布'],['food','辅食'],['pump','吸奶'],['bath','洗澡'],['play','玩耍'],['swim','游泳'],['other','其他事件']].map(item=><span key={item[0]}><i className={'is-'+item[0]}>{item[0]==='sleep'?null:<img src={ALL_EVENT_ICONS[item[0]]} alt=""/>}</i>{item[1]}</span>)}</div>
        </article>
      </div>
      <div className={'all-filter-layer'+(filterOpen?' is-open':'')} aria-hidden={!filterOpen}>
        <button type="button" className="all-filter-scrim" aria-label="关闭筛选" onClick={()=>setFilterOpen(false)}/>
        <section className="all-filter-panel" role="dialog" aria-modal="true" aria-label="筛选记录项">
          <header><h2>请筛选记录项</h2><button type="button" className="all-filter-trigger" onClick={()=>setFilterOpen(false)}><span>筛选</span><svg viewBox="0 0 12 12" aria-hidden="true"><path d="m2.5 7.5 3.5-3.5 3.5 3.5"/></svg></button></header>
          <div className="all-filter-options">{filterItems.map(item=><button type="button" key={item}>{item}</button>)}</div>
          <footer><button type="button" className="is-clear" onClick={()=>setFilterOpen(false)}>不筛选</button><button type="button" className="is-confirm" onClick={()=>setFilterOpen(false)}>确定</button></footer>
        </section>
      </div>
    </>
  );
}

function FeedingDetailPage({open,onClose,activeTab,onTabChange}){
  const [pickerOpen,setPickerOpen] = useState(false);
  const pickerItems = [
    {id:'all',label:'全部'}, {id:'feeding',label:'喂奶'}, {id:'sleep',label:'睡眠'},
    {id:'diaper',label:'换尿布'}, {id:'food',label:'辅食'}, {id:'supplement',label:'营养补充'}, {id:'pump',label:'吸奶'},
  ];
  const activeLabel = pickerItems.find(item=>item.id===activeTab)?.label || '喂养';
  const pageTitle = activeLabel;
  React.useEffect(()=>{
    if(!pickerOpen) return undefined;
    const handleKey = event=>{ if(event.key==='Escape') setPickerOpen(false); };
    window.addEventListener('keydown',handleKey);
    return ()=>window.removeEventListener('keydown',handleKey);
  },[pickerOpen]);
  React.useEffect(()=>{ if(!open) setPickerOpen(false); },[open]);
  const selectTab = tab=>{ onTabChange(tab); setPickerOpen(false); };
  return (
    <section className={'feeding-detail-page is-'+activeTab+(open?' is-open':'')} aria-hidden={!open} aria-label="喂养分析">
      <header className="feeding-detail-nav">
        <button type="button" className="feeding-detail-back" aria-label="返回" onClick={onClose}><ReviewBackIcon/></button>
        <button type="button" className={'feeding-detail-title-trigger'+(pickerOpen?' is-open':'')} aria-expanded={pickerOpen} aria-label={'切换分析类型，当前'+activeLabel} onClick={()=>setPickerOpen(value=>!value)}><b>{pageTitle}</b><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg></button>
        <span>参考表</span>
      </header>
      <div className={'feeding-detail-picker'+(pickerOpen?' is-open':'')} aria-hidden={!pickerOpen}>
        <button type="button" className="feeding-detail-picker-scrim" aria-label="关闭分析类型筛选" onClick={()=>setPickerOpen(false)}/>
        <section className="feeding-detail-picker-panel" aria-label="选择分析类型">
          <div>{pickerItems.map(item=><button type="button" key={item.id} className={activeTab===item.id?'is-active':''} aria-current={activeTab===item.id?'page':undefined} onClick={()=>selectTab(item.id)}>{item.label}{activeTab===item.id?<i>✓</i>:null}</button>)}</div>
        </section>
      </div>
      <div className="feeding-detail-content" key={activeTab}>
        {activeTab==='sleep' ? <SleepRecordReviewContent/> : (activeTab==='diaper' ? <DiaperRecordReviewContent/> : (activeTab==='food' ? <FoodRecordReviewContent/> : (activeTab==='supplement' ? <SupplementRecordReviewContent/> : (activeTab==='pump' ? <PumpRecordReviewContent/> : (activeTab==='all' ? <AllRecordReviewContent/> : <FeedingRecordReviewContent/>)))))}
      </div>
    </section>
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

const SHARED_FEEDING_ICONS = {
  formula:'assets/baby-feeding-icons/formula.png',
  breast:'assets/baby-feeding-icons/breast.png',
  diaper:'assets/baby-feeding-icons/diaper.png',
  sleep:'assets/baby-feeding-icons/sleep.png',
  food:'assets/baby-feeding-icons/solid-food.png',
  water:'assets/baby-feeding-icons/water.png',
  bottle:'assets/baby-feeding-icons/bottle-breast.png'
};

const SHARED_FEEDING_KIND_BY_LABEL = {'配方奶':'formula','母乳':'breast','瓶喂母乳':'bottle','换尿布':'diaper','睡眠':'sleep','辅食':'food','喝水':'water'};

function buildSharedFeedingDaysFromTimeline(blocks){
  if(!Array.isArray(blocks)) return [];
  return blocks.filter(block=>block?.type==='day').map(block=>{
    const records = (block.items || block.entries || []).filter(item=>item?.kind==='baby-feeding-card');
    if(!records.length) return null;
    const latestSummary = [...records].reverse().find(item=>Array.isArray(item.summary?.items))?.summary;
    const fallbackStats = new Map();
    records.forEach(item=>{
      const label = item.feedType || String(item.text || '').split('：')[0] || '其他事件';
      const row = fallbackStats.get(label) || {label,count:0,value:[]};
      row.count += 1;
      if(item.value) row.value.push(item.value);
      fallbackStats.set(label,row);
    });
    const summary = latestSummary?.items?.map(row=>[
      SHARED_FEEDING_KIND_BY_LABEL[row.label] || 'formula',
      `${row.label} ${row.value}`
    ]) || [...fallbackStats.values()].map(row=>[
      SHARED_FEEDING_KIND_BY_LABEL[row.label] || 'formula',
      `${row.label} ${row.count}次${row.value[0] ? ` ${row.value[0]}` : ''}`
    ]);
    const normalizedRecords = [...records].sort((a,b)=>String(b.time || '').localeCompare(String(a.time || ''))).map(item=>{
      const label = item.feedType || String(item.text || '').split('：')[0] || '喂养记录';
      let core = item.value || String(item.text || '').replace(new RegExp(`^${label}：?`),'') || '';
      if(Array.isArray(item.detailLines) && item.detailLines.length){
        core = item.detailLines.map(line=>String(line).replace(new RegExp(`^${label}：?`),'')).join('｜');
      }
      return [item.time || '--:--',SHARED_FEEDING_KIND_BY_LABEL[label] || 'formula',label,core,item.creator || '妈妈',item.noteText || item.voiceQuote || ''];
    });
    const rawDate = block.isToday ? '今天' : (block.relativeLabel || block.date || '');
    const date = /^\d{1,2}\/\d{1,2}$/.test(rawDate) ? rawDate.replace('/', '月')+'日' : rawDate;
    return {date,weekday:block.weekday || '',count:normalizedRecords.length,summary,records:normalizedRecords};
  }).filter(Boolean).reverse();
}

function SharedFeedingSummary({items, compact=false}){
  return <div className={'shared-feeding-summary'+(compact?' is-compact':'')}>{items.map(item=><span className={'is-'+item[0]} key={item[1]}><i></i>{item[1]}</span>)}</div>;
}

function SharedFeedingReviewCard({onOpen,day}){
  const previewRecords = day ? day.records.slice(0, 2) : [];
  return (
    <article className="shared-feeding-review-card" role="button" tabIndex="0" onClick={onOpen} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onOpen();}}}>
      <header className="shared-feeding-card-head">
        <span className="shared-feeding-card-icon"><img src="assets/feeding-review-icon.png" alt=""/></span>
        <h2>喂养记录</h2>
        <span className="shared-feeding-card-share-state">3位亲友共享</span>
      </header>
      {day ? <section className="shared-feeding-day shared-feeding-card-day">
        <header><h2>{day.date} <small>{day.weekday}</small></h2></header>
        <SharedFeedingSummary items={day.summary}/>
        <div className="shared-feeding-ledger">
          {previewRecords.map(record=><div className="shared-feeding-ledger-row" key={'card'+record[0]+record[2]}>
            <time>{record[0]}</time><span className={'shared-feeding-dot is-'+record[1]}></span>
            <img src={SHARED_FEEDING_ICONS[record[1]]} alt=""/>
            <div><b>{record[2]}</b><span className="shared-feeding-record-copy"><p>{record[3].split('｜').map((part,index)=><React.Fragment key={part}>{index ? <br/> : null}{part}</React.Fragment>)}</p>{record[5] ? <small>{record[5]}</small> : null}</span></div>
          </div>)}
        </div>
      </section> : <div className="shared-feeding-card-empty">暂无喂养记录</div>}
      <div className="review-card-more shared-feeding-card-more"><div className="review-card-more-main">查看完整喂养记录</div><ReviewChevron/></div>
    </article>
  );
}

function SharedFeedingTimelinePage({open,onClose,timelineBlocks}){
  const liveDays = buildSharedFeedingDaysFromTimeline(timelineBlocks);
  const days = liveDays;
  useEffect(()=>{
    const phone = document.querySelector('.phone');
    phone?.classList.toggle('is-shared-feeding-open', open);
    return ()=>phone?.classList.remove('is-shared-feeding-open');
  },[open]);
  return (
    <section className={'shared-feeding-timeline-page'+(open?' is-open':'')} aria-hidden={!open} aria-label="小豆苗共享喂养时间轴">
      <header className="shared-feeding-detail-nav">
        <button type="button" aria-label="返回回顾" onClick={onClose}><ReviewBackIcon/></button>
        <div className="shared-feeding-detail-title"><b>小豆苗</b><span>3位亲友共享</span></div>
      </header>
      <div className="shared-feeding-detail-scroll">
        {days.length ? days.map(day=><section className="shared-feeding-day" key={day.date}>
          <header><h2>{day.date} <small>{day.weekday}</small></h2><span>{day.count} 条</span></header>
          <SharedFeedingSummary items={day.summary}/>
          <div className="shared-feeding-ledger">
            {day.records.map(record=><div className="shared-feeding-ledger-row" key={day.date+record[0]+record[2]}>
              <time>{record[0]}</time><span className={'shared-feeding-dot is-'+record[1]}></span>
              <img src={SHARED_FEEDING_ICONS[record[1]]} alt=""/>
              <div><b>{record[2]}</b><span className="shared-feeding-record-copy"><p>{record[3].split('｜').map((part,index)=><React.Fragment key={part}>{index ? <br/> : null}{part}</React.Fragment>)}</p>{record[5] ? <small>{record[5]}</small> : null}</span></div>
            </div>)}
          </div>
        </section>) : <div className="shared-feeding-detail-empty">暂无喂养记录</div>}
      </div>
    </section>
  );
}

function ReviewPage({timelineBlocks}){
  const [cycleDetailOpen, setCycleDetailOpen] = useState(false);
  const [sharedFeedingOpen, setSharedFeedingOpen] = useState(false);
  const [feedingDetailOpen, setFeedingDetailOpen] = useState(false);
  const [feedingDetailTab, setFeedingDetailTab] = useState('feeding');
  const openFeedingDetail = tab=>{ setFeedingDetailTab(tab); setFeedingDetailOpen(true); };
  const sharedFeedingDays = buildSharedFeedingDaysFromTimeline(timelineBlocks);
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
        <button className="review-nav-share" type="button" aria-label="查看共享喂养记录" onClick={()=>setSharedFeedingOpen(true)}>
          <ReviewShareIcon/><span>共享</span>
        </button>
      </div>
      <div className="review-content">
        <p className="review-page-greeting">已记录 <b>350 天</b>，共 <b>4 项</b>可回顾</p>

      <SharedFeedingReviewCard day={sharedFeedingDays[0]} onOpen={()=>setSharedFeedingOpen(true)}/>

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

      <FeedingReviewCard onFullOpen={()=>openFeedingDetail('feeding')}/>
      <SleepReviewCard onFullOpen={()=>openFeedingDetail('sleep')}/>
      <DiaperReviewCard onFullOpen={()=>openFeedingDetail('diaper')}/>
      <FoodReviewCard onFullOpen={()=>openFeedingDetail('food')}/>
      <SupplementReviewCard onFullOpen={()=>openFeedingDetail('supplement')}/>
      <PumpReviewCard onFullOpen={()=>openFeedingDetail('pump')}/>
      </div>
      <SharedFeedingTimelinePage open={sharedFeedingOpen} timelineBlocks={timelineBlocks} onClose={()=>setSharedFeedingOpen(false)}/>
      <CycleDetailPage open={cycleDetailOpen} onClose={()=>setCycleDetailOpen(false)}/>
      <FeedingDetailPage open={feedingDetailOpen} onClose={()=>setFeedingDetailOpen(false)} activeTab={feedingDetailTab} onTabChange={setFeedingDetailTab}/>
    </main>
  );
}

window.ReviewPage = ReviewPage;
window.SharedFeedingTimelinePage = SharedFeedingTimelinePage;
