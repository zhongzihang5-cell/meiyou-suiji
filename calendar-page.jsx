const { useState, useRef, useEffect } = React;

const CAL_WEEKS = [
  [
    null,null,null,null,
    {n:1, cls:'green'},
    {n:2, cls:'green'},
    {n:3, cls:'today', today:true},
  ],
  [
    {n:4, cls:'green', dayId:4},
    {n:5, cls:'green', dayId:5},
    {n:6, cls:'green', dayId:6},
    {n:7, cls:'green', dayId:7},
    {n:8, cls:'green'},
    {n:9, cls:'green', dayId:9},
    {n:10, cls:'green', dayId:10},
  ],
  [
    {n:11, cls:'green', dayId:11},
    {n:12, cls:'green', dayId:12},
    {n:13, cls:'green', dayId:13},
    {n:14, cls:'green', dayId:14},
    {n:15, cls:'green', dayId:15},
    {n:16, cls:'green', dayId:16},
    {n:17, cls:'green'},
  ],
  [
    {n:18, cls:'green'},
    {n:19, cls:'ovulation'},
    {n:20, cls:'ovulation'},
    {n:21, cls:'ovulation'},
    {n:22, cls:'ovulation'},
    {n:23, cls:'ovulation'},
    {n:24, cls:'ovulation-day'},
  ],
  [
    {n:25, cls:'ovulation'},
    {n:26, cls:'green'},
    {n:27, cls:'green'},
    {n:28, cls:'green'},
    {n:29, cls:'green'},
    {n:30, cls:'green'},
    null,
  ],
];

const PERIOD_DAYS = [3, 4, 5, 6, 7];

function FloatNotice({show, title = '结合近期记录，已为你生成周期状态分析', onOpen, onClose}){
  return (
    <div
      className={'float-notice'+(show?' show':'')}
      onClick={onOpen}
      role="button"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      aria-label={title}
    >
      <button
        type="button"
        className="fn-close"
        aria-label="关闭"
        onClick={(e)=>{ e.stopPropagation(); onClose(); }}
      >×</button>
      <div className="fn-avatar" aria-hidden="true"/>
      <p className="fn-message">
        <span className="fn-title">{title}</span>
      </p>
    </div>
  );
}

function CalDayCell({cell, periodLit}){
  if(!cell){
    return <div className="cal-day empty"><div className="cell"></div></div>;
  }
  const cls = [
    'cal-day',
    cell.cls,
    periodLit ? 'period-lit' : '',
  ].filter(Boolean).join(' ');
  return (
    <div className={cls} data-day={cell.dayId || undefined}>
      <div className="cell">
        {cell.n}
        {cell.today && <span className="today-label">今天</span>}
      </div>
    </div>
  );
}

function CalendarPage({onAnalysisReady, onPeriodReset, periodFlowEnabled = true}){
  const [periodYes, setPeriodYes] = useState(false);
  const [litDays, setLitDays] = useState([]);
  const timersRef = useRef([]);

  const clearTimers = ()=>{
    timersRef.current.forEach(t=>clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(()=>()=>clearTimers(), []);

  const resetPeriod = ()=>{
    clearTimers();
    setPeriodYes(false);
    setLitDays([]);
    onPeriodReset?.();
  };

  const runPeriodAnimation = ()=>{
    clearTimers();
    setLitDays([]);
    PERIOD_DAYS.forEach((d, i)=>{
      const t = setTimeout(()=>{
        setLitDays(prev=>{
          if(prev.includes(d)) return prev;
          return [...prev, d];
        });
      }, i * 280);
      timersRef.current.push(t);
    });
    const t2 = setTimeout(()=>{
      if(periodFlowEnabled) onAnalysisReady?.();
    }, PERIOD_DAYS.length * 280 + 200);
    timersRef.current.push(t2);
  };

  const handleToggle = (yes)=>{
    if(yes){
      if(periodYes) return;
      setPeriodYes(true);
      runPeriodAnimation();
    } else {
      resetPeriod();
    }
  };

  return (
    <div className="cal-page">
      <div className="cal-top-nav">
        <div className="cal-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15 6l-6 6 6 6"/></svg>
          4月
        </div>
        <div className="cal-tabs">
          <div className="cal-tab active">经期</div>
          <div className="cal-tab">备孕</div>
          <div className="cal-tab">怀孕</div>
          <div className="cal-tab">育儿</div>
        </div>
        <div className="cal-analysis">
          <svg viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>
          分析
        </div>
      </div>

      <div className="cal-calendar">
        <div className="cal-week-header">
          {['日','一','二','三','四','五','六'].map(w=>(
            <div key={w}>{w}</div>
          ))}
        </div>
        {CAL_WEEKS.map((row, ri)=>(
          <div key={ri} className="cal-week-row">
            {row.map((cell, ci)=>(
              <CalDayCell
                key={ci}
                cell={cell}
                periodLit={cell && litDays.includes(cell.dayId || cell.n)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="cal-legend">
        <div className="cal-legend-item"><span className="sq" style={{background:'#ff4d88'}}></span>月经期</div>
        <div className="cal-legend-item"><span className="sq" style={{background:'#fde0ea'}}></span>预测经期</div>
        <div className="cal-legend-item"><span className="sq" style={{background:'#9b6fdb'}}></span>排卵期</div>
        <div className="cal-legend-item"><span className="sq" style={{background:'#b388e8', clipPath:'polygon(50% 0,100% 100%,0 100%)'}}></span>排卵日</div>
        <div className="arrow">›</div>
      </div>

      <div className="cal-records">
        <div className="cal-row">
          <div className="icon ic-period">🩸</div>
          <div className="label">月经来了</div>
          <div className="right">
            <div className="cal-toggle">
              <span
                className={periodYes?' active':''}
                onClick={()=>handleToggle(true)}
                role="button"
                tabIndex={0}
              >是</span>
              <span
                className={!periodYes?' active':''}
                onClick={()=>handleToggle(false)}
                role="button"
                tabIndex={0}
              >否</span>
            </div>
          </div>
        </div>

        <div className="cal-row">
          <div className="icon ic-love">💗</div>
          <div className="label">爱爱</div>
          <div className="right"><div className="cal-plus">+</div></div>
        </div>

        <div className="cal-row">
          <div className="icon ic-symptom">➕</div>
          <div className="label">症状</div>
          <div className="right"><div className="cal-plus">+</div></div>
        </div>

        <div className="cal-row">
          <div className="icon ic-mood">☺</div>
          <div className="label">心情</div>
          <div className="right">
            <div className="cal-moods">
              {['😣','😖','😐','😶','🙂'].map(m=>(
                <div key={m} className="cal-mood">{m}</div>
              ))}
            </div>
            <div className="cal-plus">+</div>
          </div>
        </div>

        <div className="cal-row">
          <div className="icon ic-discharge">⏳</div>
          <div className="label">白带</div>
          <div className="right"><div className="cal-plus">+</div></div>
        </div>

        <div className="cal-row">
          <div className="icon ic-temp">🌡</div>
          <div className="label">体温</div>
          <div className="right"><div className="cal-plus">+</div></div>
        </div>

        <div className="cal-row">
          <div className="icon ic-weight">⚖</div>
          <div className="label">体重</div>
          <div className="right"><div className="cal-plus">+</div></div>
        </div>

        <div className="cal-row diary">
          <div className="icon ic-diary">📔</div>
          <div className="label">日记</div>
          <div className="right">📷 ›</div>
        </div>

        <div className="cal-row habit">
          <div className="icon ic-habit">👍</div>
          <div className="label">好习惯</div>
          <div className="right">
            <div className="cal-habit-icons">
              <div>💧</div><div>🍎</div><div>☕</div><div>🏃</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

Object.assign(window, { CalendarPage, FloatNotice });
