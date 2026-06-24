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

function HomePeriodHero(){
  const bars = [
    ['7/4','17%', false],
    ['7/5','50%', false],
    ['7/6','100%', true],
    ['7/7','83%', false],
    ['7/8','50%', false],
  ];
  return (
    <section className="home-period-hero">
      <div className="home-hero-left">
        <div className="home-hero-title">经期第4天</div>
        <div className="home-hero-sub">预计在明天结束 <HomeChevron/></div>
      </div>
      <div className="home-hero-cta">查看详情</div>
      <div className="home-prob-card">
        <div className="home-prob-label">下次月经几率</div>
        <div className="home-prob-bars">
          {bars.map(([day, height, peak])=>(
            <div key={day} className={'home-prob-bar' + (peak ? ' is-peak' : '')}>
              <div className="home-prob-col"><div className="home-prob-fill" style={{height}}></div></div>
              <div className="home-prob-day">{day}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
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

function HomePage(){
  return (
    <main className="home-page" aria-label="首页">
      <HomeTopBar/>
      <HomePeriodHero/>
      <HomeFlowBar/>
      <section className="home-feed" aria-label="推荐内容">
        <HomeFeedCard/>
        <HomeFeedCard kind="second"/>
      </section>
    </main>
  );
}

window.HomePage = HomePage;
