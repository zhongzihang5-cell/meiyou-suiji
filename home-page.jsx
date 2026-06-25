function HomeChevron(){
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>;
}

function HomeTopBar(){
  return (
    <div className="home-topbar">
      <button type="button" className="home-top-icon" aria-label="搜索">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3" strokeLinecap="round"/></svg>
      </button>
      <div className="home-top-title">美柚</div>
      <button type="button" className="home-post-btn" aria-label="发帖">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4z"/></svg>
        <span>发帖</span>
      </button>
    </div>
  );
}

const HOME_PERIOD_PROBABILITY = [
  { date:'6/22', label:'周一', value:12 },
  { date:'6/23', label:'周二', value:18 },
  { date:'6/24', label:'今天', value:28, today:true, axis:true },
  { date:'6/25', label:'周四', value:46, valueLabel:true },
  { date:'6/26', label:'周五', value:68, valueLabel:true },
  { date:'6/27', label:'周六', value:86, peak:true, valueLabel:true, axis:true },
  { date:'6/28', label:'周日', value:78, valueLabel:true },
  { date:'6/29', label:'周一', value:58, valueLabel:true },
  { date:'6/30', label:'周二', value:39, axis:true },
  { date:'7/1', label:'周三', value:26 },
  { date:'7/2', label:'周四', value:17, axis:true },
  { date:'7/3', label:'周五', value:11 },
  { date:'7/4', label:'周六', value:8, axis:true },
  { date:'7/5', label:'周日', value:6 },
  { date:'7/6', label:'周一', value:5, axis:true },
];

function HomePeriodHero({onOpen}){
  return (
    <button type="button" className="home-period-hero" onClick={onOpen} aria-label="查看经期详情">
      <div className="home-hero-left">
        <div className="home-hero-title">距月经开始还有3天</div>
        <div className="home-hero-sub">预测经期开始日6月27日 <HomeChevron/></div>
      </div>
      <div className="home-hero-cta">查看详情</div>
      <div className="home-prob-card">
        <img className="home-prob-image" src="assets/home-pregnancy-rate-flower-cutout.png" alt="今日怀孕几率图" />
      </div>
    </button>
  );
}

function HomePeriodProbabilityChart(){
  const width = 320;
  const height = 174;
  const padX = 28;
  const padTop = 34;
  const padBottom = 42;
  const chartW = width - padX * 2;
  const chartH = height - padTop - padBottom;
  const maxValue = 90;
  const points = HOME_PERIOD_PROBABILITY.map((item, index)=>{
    const x = padX + (chartW / (HOME_PERIOD_PROBABILITY.length - 1)) * index;
    const y = padTop + (1 - item.value / maxValue) * chartH;
    return {...item, x, y};
  });
  const linePath = points.reduce((path, point, index)=>{
    if(index === 0) return `M${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
    const prev = points[index - 1];
    const beforePrev = points[index - 2] || prev;
    const next = points[index + 1] || point;
    const tension = 0.42;
    const cp1x = prev.x + (point.x - beforePrev.x) * tension / 6;
    const cp1y = prev.y + (point.y - beforePrev.y) * tension / 6;
    const cp2x = point.x - (next.x - prev.x) * tension / 6;
    const cp2y = point.y - (next.y - prev.y) * tension / 6;
    return path + ` C${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  }, '');
  const areaPath = linePath + ` L ${points[points.length - 1].x.toFixed(1)} ${height - padBottom} L ${points[0].x.toFixed(1)} ${height - padBottom} Z`;
  const today = points.find(point=>point.today);
  const peak = points.find(point=>point.peak);
  const ticks = points.filter(point=>point.axis);
  const valueLabels = points.filter(point=>point.peak);

  return (
    <div className="home-detail-line-chart" aria-label="未来15天下次月经开始几率折线图">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="未来15天下次月经开始几率，6月27日最高，今天为6月24日">
        <defs>
          <linearGradient id="homePeriodLineArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff4d88" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#ff4d88" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[90,60,30,0].map((tick)=>(
          <g key={tick}>
            <line className="home-detail-line-grid" x1={padX} x2={width - padX} y1={padTop + (1 - tick / maxValue) * chartH} y2={padTop + (1 - tick / maxValue) * chartH}/>
            <text className="home-detail-line-y-tick" x={padX - 7} y={padTop + (1 - tick / maxValue) * chartH + 3}>{tick}%</text>
          </g>
        ))}
        <path className="home-detail-line-area" d={areaPath}/>
        <path className="home-detail-line-path" d={linePath}/>
        {today && (
          <g className="home-detail-line-today">
            <circle cx={today.x} cy={today.y} r="4"/>
            <text x={today.x} y={today.y - 10}>今天</text>
          </g>
        )}
        {peak && (
          <g className="home-detail-line-peak">
            <circle cx={peak.x} cy={peak.y} r="4.5"/>
            <circle cx={peak.x} cy={peak.y} r="7"/>
          </g>
        )}
        {valueLabels.map(point=>(
          <text key={point.date + '-value'} className={'home-detail-line-value-label' + (point.peak ? ' is-peak' : '')} x={point.x} y={point.y - (point.peak ? 15 : 8)}>{point.value}%</text>
        ))}
        {ticks.map(point=>(
          <text key={point.date} className={'home-detail-line-tick' + (point.peak ? ' is-peak' : '') + (point.today ? ' is-today' : '')} x={point.x} y={height - 14}>{point.date}</text>
        ))}
      </svg>
    </div>
  );
}


function HomePeriodIconRow(){
  const icons = [
    ['小腹胀', 'M8 15c2.5-4 5.5-4 8 0'],
    ['头发出油', 'M8 18c1-6 7-6 8 0'],
  ];
  return (
    <div className="home-detail-icons">
      {icons.map(([label, path])=>(
        <div className="home-detail-icon-item" key={label}>
          <span className="home-detail-round-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d={path}/><circle cx="12" cy="11" r="4" fill="rgba(255,255,255,0.28)" stroke="none"/></svg>
          </span>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function HomePeriodAdviceCard(){
  return (
    <section className="home-detail-card">
      <div className="home-detail-card-title">
        <span className="home-detail-title-dot"></span>
        黄体期 · 生活指南
      </div>
      <div className="home-detail-advice">
        <div className="home-detail-advice-title">经前期知识</div>
        <p>每次来月经前就像变了个人？会出现焦虑抑郁、情绪波动、饮食改变、失眠、乳房胀痛、腰酸背痛等一系列症状。</p>
      </div>
      <div className="home-detail-advice">
        <div className="home-detail-advice-title">饮食建议</div>
        <p>来月经前容易长痘痘？少吃辛辣刺激食物，同时高糖、高脂食物也尽量少吃。</p>
      </div>
      <div className="home-detail-advice">
        <div className="home-detail-advice-title">运动建议</div>
        <p>月经来之前，卵巢内的黄体受挤压后容易破裂出血。建议避免突然改变体位、剧烈运动。</p>
      </div>
    </section>
  );
}

function HomePeriodDetail({onBack}){
  return (
    <main className="home-detail-page" aria-label="今日密报">
      <div className="home-detail-head">
        <div className="home-detail-nav">
          <button type="button" className="home-detail-back" onClick={onBack} aria-label="返回">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M15 6l-6 6 6 6"/></svg>
          </button>
          <div className="home-detail-title">今日密报</div>
          <div className="home-detail-nav-spacer"></div>
        </div>
        <div className="home-detail-days">
          <span>周二(6月23日)</span>
          <span className="is-active">今天(6月24日)</span>
          <span>周四(6月25日)</span>
        </div>
      </div>

      <section className="home-detail-card home-detail-probability-card">
        <div className="home-detail-section home-detail-probability-section">
          <div className="home-detail-section-title">下次月经开始几率</div>
          <div className="home-detail-section-subtitle">距离月经开始（6月27日）还有3天</div>
          <HomePeriodProbabilityChart/>
        </div>
      </section>

      <section className="home-detail-card home-detail-main-card">
        <div className="home-detail-cycle-block">
          <div className="home-detail-cycle-title">你现在处于黄体期 · 第11天 <span>i</span></div>
          <div className="home-detail-orbit">
            <img src="assets/home-period-orbit-detail-cutout.png" alt="周期预测图" />
          </div>
        </div>

        <div className="home-detail-section">
          <div className="home-detail-advice-title">症状预测</div>
          <p>熟悉的小腹坠胀感出现了吗？它可能是在提醒你，再过几天月经就要来了哦。</p>
          <HomePeriodIconRow/>
        </div>

        <div className="home-detail-section">
          <div className="home-detail-advice-title">白带变化</div>
          <p>黄体期快结束这几天，白带可能会进一步变少，质地变干，颜色发白或微微发黄。</p>
        </div>
      </section>

      <HomePeriodAdviceCard/>
    </main>
  );
}

function HomeFlowBar(){
  return (
    <section className="home-flow-bar">
      <div className="home-flow-left">
        <div className="home-flow-icon">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 3s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11z" fill="#ff4d88"/><path d="M9 13a3 3 0 0 0 3 3" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinecap="round" fill="none"/></svg>
        </div>
        <div className="home-flow-label">流量</div>
      </div>
      <button type="button" className="home-flow-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="9" fill="rgba(255,255,255,0.18)"/><path d="M12 8v8M8 12h8"/></svg>
        <span>记录</span>
      </button>
    </section>
  );
}

function HomeFeedCard({kind}){
  if(kind === 'second'){
    return (
      <article className="home-feed-card">
        <div className="home-feed-head">
          <div className="home-avatar is-pink"></div>
          <div className="home-feed-user">
            <div className="home-feed-name">柚柚<span className="home-smile-badge"></span>小公主</div>
            <div className="home-feed-meta">孕10周1天</div>
          </div>
          <div className="home-feed-more">⋮</div>
        </div>
        <div className="home-feed-text">刚洗完澡出来看到这一幕，又搞笑又心酸😔</div>
        <div className="home-feed-images">
          <div className="home-feed-img is-bed"></div>
        </div>
      </article>
    );
  }

  return (
    <article className="home-feed-card">
      <div className="home-feed-head">
        <div className="home-avatar"><span className="home-smile-badge is-large"></span></div>
        <div className="home-feed-user">
          <div className="home-feed-name">曾优秀！</div>
          <div className="home-feed-meta">备孕</div>
        </div>
        <div className="home-feed-more">⋮</div>
      </div>
      <div className="home-feed-text">
        很迷茫，结婚一年多了，没有同过房，人受了两次都失败了，他父母对我很好，他继承他爸的门市，看店，但是没有钱，他爸把钱...<span>全文</span>
      </div>
      <div className="home-feed-images">
        <div className="home-feed-img is-med"></div>
        <div className="home-feed-img is-chart"></div>
      </div>
      <div className="home-feed-actions">
        <div className="home-feed-action">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12c0 4.4-4 8-9 8-1.5 0-2.9-.3-4.1-.9L3 20l1-3.7C3.3 15 3 13.6 3 12c0-4.4 4-8 9-8s9 3.6 9 8z" strokeLinejoin="round"/></svg>
          3485
        </div>
        <div className="home-feed-action">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" strokeLinejoin="round"/></svg>
          2202
        </div>
      </div>
    </article>
  );
}

function HomePage({onDetailOpenChange}={}){
  const [detailOpen, setDetailOpen] = React.useState(false);

  React.useEffect(()=>{
    onDetailOpenChange?.(detailOpen);
    return ()=>onDetailOpenChange?.(false);
  }, [detailOpen, onDetailOpenChange]);
  if(detailOpen){
    return <HomePeriodDetail onBack={()=>setDetailOpen(false)}/>;
  }

  return (
    <main className="home-page" aria-label="首页">
      <HomeTopBar/>
      <HomePeriodHero onOpen={()=>setDetailOpen(true)}/>
      <HomeFlowBar/>
      <section className="home-feed" aria-label="推荐内容">
        <HomeFeedCard/>
        <HomeFeedCard kind="second"/>
      </section>
    </main>
  );
}

window.HomePage = HomePage;
