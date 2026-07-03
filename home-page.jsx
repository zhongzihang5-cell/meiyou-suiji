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
  { date:'6/22', value:12 },
  { date:'6/23', value:18 },
  { date:'今天', fullDate:'6/24', value:28, today:true },
  { date:'6/25', value:46, nearPeak:true },
  { date:'6/26', value:68, nearPeak:true },
  { date:'6/27', value:86, peak:true },
  { date:'6/28', value:78, nearPeak:true },
  { date:'6/29', value:58, nearPeak:true },
  { date:'6/30', value:39 },
  { date:'7/1', value:26 },
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
  const maxValue = 90;
  return (
    <div className="home-detail-bar-chart" aria-label="过去2天至未来7天下次月经开始几率柱状图">
      {HOME_PERIOD_PROBABILITY.map(item=>{
        const barHeight = Math.max(6, item.value / maxValue * 100) + '%';
        return (
          <div key={item.fullDate || item.date} className={'home-detail-bar-item' + (item.today ? ' is-today' : '') + (item.nearPeak ? ' is-near-peak' : '') + (item.peak ? ' is-peak' : '')} style={{'--bar-height':barHeight}}>
            <div className="home-detail-bar-track">
              <div className="home-detail-bar-value">{item.value}%</div>
              <div className="home-detail-bar-fill" aria-hidden="true"></div>
            </div>
            <div className="home-detail-bar-date">{item.date}</div>
          </div>
        );
      })}
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

function BabyModeTopBar({active='mom', onChange}){
  return (
    <div className="baby-mode-topbar" aria-label="育儿模式首页切换">
      <button type="button" className="baby-mode-icon-btn" aria-label="搜索">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>
        </svg>
      </button>
      <div className="baby-mode-tabs" role="tablist" aria-label="育儿首页类型">
        <button
          type="button"
          role="tab"
          aria-selected={active === 'mom'}
          className={active === 'mom' ? 'is-active' : ''}
          onClick={()=>onChange?.('mom')}
        >
          妈妈
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={active === 'baby'}
          className={active === 'baby' ? 'is-active' : ''}
          onClick={()=>onChange?.('baby')}
        >
          宝宝A
        </button>
      </div>
      <button type="button" className="baby-mode-icon-btn baby-mode-upload" aria-label="上传照片">
        <svg viewBox="0 0 36 36" aria-hidden="true">
          <path d="M19.7 8.2h-3c-1.7 0-3.1 1.4-3.1 3.1h9.2c0-1.7-1.4-3.1-3.1-3.1Z"/>
          <path d="M18.2 17.1a3.8 3.8 0 1 0 0 7.7 3.8 3.8 0 0 0 0-7.7Z"/>
          <path d="M26.4 11.2H10a4 4 0 0 0-4 4v11.4a4 4 0 0 0 4 4h16.4a4 4 0 0 0 4-4V15.6a5.2 5.2 0 0 1-4-4.4Zm-8.2 15.1a5.4 5.4 0 1 1 0-10.7 5.4 5.4 0 0 1 0 10.7Z"/>
          <path d="M34.4 8.6H33V7.1a1.1 1.1 0 1 0-2.2 0v1.5h-1.5a1.1 1.1 0 1 0 0 2.2h1.5v1.5a1.1 1.1 0 1 0 2.2 0v-1.5h1.5a1.1 1.1 0 1 0 0-2.2Z"/>
        </svg>
      </button>
    </div>
  );
}

function HomeMainContent({onOpenDetail, withTopBar=true}){
  return (
    <>
      {withTopBar ? <HomeTopBar/> : null}
      <HomePeriodHero onOpen={onOpenDetail}/>
      <HomeFlowBar/>
      <section className="home-feed" aria-label="推荐内容">
        <HomeFeedCard/>
        <HomeFeedCard kind="second"/>
      </section>
    </>
  );
}

function BabyChangeCard(){
  return (
    <section className="baby-card">
      <div className="baby-card-head">
        <button className="baby-card-pill" type="button">回今天</button>
        <div className="baby-card-date">
          <button className="baby-card-arrow is-prev" type="button" aria-label="上一天">
            <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
          </button>
          <strong className="baby-card-title">第11天(11月29日)</strong>
          <button className="baby-card-arrow" type="button" aria-label="下一天">
            <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        </div>
      </div>
      <p className="baby-card-copy">宝宝变化：妈妈，当你看到我把水杯扔掉时，不要责怪我！我会用杯子喝水，但还掌握不好放杯子的动作，只好把它丢出去。</p>
    </section>
  );
}

function BabyQuickEntry(){
  const entries = [
    ['喂养记录', 'M6 5h12v14H6zM9 8h6M9 12h6M9 16h4'],
    ['发育测评', 'M5 17l4-4 3 3 7-8M5 21h14'],
    ['辅食食谱', 'M7 4v8a5 5 0 0 0 10 0V4M12 14v7'],
    ['记身高体重', 'M8 4h8v16H8zM10 8h2M10 12h3M10 16h2'],
    ['更多', 'M5 12h.01M12 12h.01M19 12h.01'],
  ];
  return (
    <section className="baby-quick-entry" aria-label="育儿快捷入口">
      {entries.map(([label, path])=>(
        <button type="button" className="baby-quick-entry-item" key={label}>
          <span className="baby-quick-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={path}/></svg>
          </span>
          <span>{label}</span>
        </button>
      ))}
    </section>
  );
}

function BabyHomeContent({active, onChange}){
  return (
    <main className="home-page baby-mode-home baby-child-home" aria-label="育儿模式-宝宝首页">
      <BabyModeTopBar active={active} onChange={onChange}/>
      <div className="baby-home-stack">
        <section className="baby-home-hero" aria-label="宝宝档案头图区">
          <div className="baby-hero-profile">
            <div className="baby-profile-left">
              <span className="baby-profile-avatar" aria-hidden="true"></span>
              <div className="baby-profile-text">
                <strong>宝宝 A</strong>
                <span>4个月23天
                  <svg className="baby-profile-edit-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 20h4.5L19 9.5 14.5 5 4 15.5V20z"/><path d="M13 6.5 17.5 11"/>
                  </svg>
                </span>
              </div>
            </div>
            <button className="baby-invite-pill" type="button">邀请亲友</button>
          </div>
        </section>
        <BabyChangeCard/>
        <BabyQuickEntry/>
        <section className="baby-invite-card">
          <strong>我这么可爱，不想给好友晒晒吗</strong>
          <button type="button">立即邀请</button>
        </section>
        <div className="baby-section-title"><strong>今天</strong><span>4个月23天</span></div>
        <section className="baby-timeline-card">
          <div className="baby-timeline-media" aria-hidden="true"></div>
          <div>
            <strong>儿童节快乐~</strong>
            <p>你是 6 月最快乐的崽</p>
            <button type="button">立即查看</button>
          </div>
        </section>
        <div className="baby-section-title"><strong>5月3日</strong><span>3个月23天</span></div>
        <section className="baby-photo-card">
          <div className="baby-photo-grid">
            <span className="baby-photo-swatch" aria-hidden="true"></span>
            <span className="baby-photo-swatch" aria-hidden="true"></span>
          </div>
          <div className="baby-photo-meta">
            <span>妈妈</span>
            <span>5月14日 18:50</span>
            <div className="baby-photo-actions">
              <button className="baby-photo-action is-liked" type="button">
                <svg viewBox="0 0 25 24" aria-hidden="true"><path d="M12.5 21.4 4 13.1a6.4 6.4 0 0 1 0-9.1 6.6 6.6 0 0 1 8.5-.6 6.6 6.6 0 0 1 8.5.6 6.4 6.4 0 0 1 0 9.1l-8.5 8.3Z"/></svg>
                <span>赞</span>
              </button>
              <button className="baby-photo-action" type="button">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 1 8.2 12.7l.6 3a1 1 0 0 1-1.2 1.2l-3-.6A9 9 0 1 1 12 3Z"/><path d="M9 12h.01M15 12h.01"/></svg>
                <span>评论</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function BabyMomCycleCard(){
  return (
    <button className="baby-mom-cycle-card" type="button" aria-label="查看经期详情">
      <div className="baby-mom-cycle-copy">
        <strong>距大姨妈还有1天</strong>
        <p>预测经期开始日10月20日 <HomeChevron/></p>
        <span className="baby-mom-cycle-btn">查看详情</span>
      </div>
      <div className="baby-mom-flower" aria-label="怀孕几率 15.3%">
        <div className="baby-mom-flower-content">
          <span>怀孕几率</span>
          <strong>15<small>.3%</small></strong>
        </div>
      </div>
    </button>
  );
}

function BabyMomListCard(){
  return (
    <section className="baby-mom-list-card" aria-label="快捷记录">
      <div className="baby-mom-list-item">
        <span className="baby-mom-list-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11z"/>
          </svg>
        </span>
        <strong>月经来了</strong>
        <div className="baby-mom-segmented" role="tablist" aria-label="是否选择">
          <button className="is-active" type="button" role="tab" aria-selected="true">是</button>
          <button type="button" role="tab" aria-selected="false">否</button>
        </div>
      </div>
    </section>
  );
}

function BabyMomCommunityCard({kind='record'}){
  const isChat = kind === 'chat';
  return (
    <article className="baby-mom-community-card">
      <span className="baby-mom-community-tag">{isChat ? '# 姐妹聊天' : '# 今日记录'}</span>
      <div className="baby-mom-community-copy">
        <span className="baby-mom-community-text">
          {isChat
            ? '最近开始认真记录周期以后，才发现很多小变化原来都有迹可循。以前只是觉得情绪忽高忽低，现在能把饮食、睡眠和身体感受放在一起看，心里反而踏实很多。也想提醒自己，身体不是突然变糟的，它一直在很努力地发信号。'
            : '今天的状态比昨天轻松一点，早上醒来没有明显不适，喝了热水之后整个人都暖起来了。把症状和心情都记下来，晚上再回看会更清楚地知道身体变化，也能给下一次周期预测多一点参考。'}
        </span>
        <button className="baby-mom-community-more" type="button">全文</button>
      </div>
      <div className="baby-mom-community-images" aria-label="图片">
        <div className="baby-mom-community-image"></div>
        <div className="baby-mom-community-image"></div>
        <div className="baby-mom-community-image"></div>
      </div>
      <div className="baby-mom-community-actions" aria-label="互动数据">
        <span className="baby-mom-community-action">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 1 8.2 12.7l.6 3a1 1 0 0 1-1.2 1.2l-3-.6A9 9 0 1 1 12 3Z"/><path d="M9 12h.01M15 12h.01"/></svg>
          {isChat ? '243' : '128'}
        </span>
        <button className="baby-mom-community-action baby-mom-community-like" type="button" aria-pressed="false">
          <svg viewBox="0 0 25 24" aria-hidden="true"><path d="M12.5 21.4 4 13.1a6.4 6.4 0 0 1 0-9.1 6.6 6.6 0 0 1 8.5-.6 6.6 6.6 0 0 1 8.5.6 6.4 6.4 0 0 1 0 9.1l-8.5 8.3Z"/></svg>
          <span>{isChat ? '197' : '86'}</span>
        </button>
      </div>
    </article>
  );
}

function BabyMomHome({active, onChange, onOpenDetail}){
  return (
    <main className="home-page baby-mode-home baby-mom-home-page" aria-label="育儿模式-妈妈首页">
      <BabyModeTopBar active={active} onChange={onChange}/>
      <div className="baby-mom-home-stack" aria-label="育儿模式-妈妈首页内容">
        <BabyMomCycleCard/>
        <BabyMomListCard/>
        <BabyMomCommunityCard/>
        <BabyMomCommunityCard kind="chat"/>
      </div>
    </main>
  );
}

function HomePage({mode='经期', onDetailOpenChange}={}){
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [babyHomeType, setBabyHomeType] = React.useState('baby');

  React.useEffect(()=>{
    onDetailOpenChange?.(detailOpen);
    return ()=>onDetailOpenChange?.(false);
  }, [detailOpen, onDetailOpenChange]);

  if(detailOpen){
    return <HomePeriodDetail onBack={()=>setDetailOpen(false)}/>;
  }

  if(mode === '育儿'){
    return babyHomeType === 'baby'
      ? <BabyHomeContent active={babyHomeType} onChange={setBabyHomeType}/>
      : <BabyMomHome active={babyHomeType} onChange={setBabyHomeType} onOpenDetail={()=>setDetailOpen(true)}/>;
  }

  return (
    <main className="home-page" aria-label="首页">
      <HomeMainContent onOpenDetail={()=>setDetailOpen(true)}/>
    </main>
  );
}

window.HomePage = HomePage;
