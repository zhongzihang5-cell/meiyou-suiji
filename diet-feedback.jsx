// ============ 饮食反馈卡片 — 基于规则表的多维度反馈 ============
// 维度A：识别结果 | 维度B：当日汇总与趋势 | 维度C：热量解读
// 维度D：周期关联 | 维度E：饮食多样性 | 维度F：记录里程碑
// 展示上限：最多3个维度，优先级 A > B > C > D > E > F

const DIET_FB_PRIMARY = '#ff4d88';
const DIET_FB_GREEN = '#00cc99';
const DIET_FB_ORANGE = '#ff8c42';

// ===== 工具函数 =====
function formatKcal(n){ return n != null ? n.toLocaleString() : '—'; }

// ===== 7日热量柱状图 =====
function DietTrendChart({ data, todayKcal }){
  const days = ['周一','周二','周三','周四','周五','周六','今天'];
  const maxVal = Math.max(2000, ...data.map(d => d || 0), todayKcal || 0);
  const barW = 30;
  const gap = 10;
  const chartW = 340;
  const chartH = 100;
  const baseY = 100;
  
  const getBarHeight = (val) => val ? (val / maxVal) * 80 : 0;
  const getBarY = (val) => baseY - getBarHeight(val);
  
  return (
    <div className="diet-fb-chart-box">
      <svg viewBox="0 0 340 120" preserveAspectRatio="none">
        {/* 参考线 */}
        <line x1="20" y1="15" x2="330" y2="15" stroke="rgba(0,0,0,0.03)" strokeWidth=".5"/>
        <line x1="20" y1="40" x2="330" y2="40" stroke="rgba(0,0,0,0.03)" strokeWidth=".5"/>
        <line x1="20" y1="65" x2="330" y2="65" stroke="rgba(0,0,0,0.03)" strokeWidth=".5"/>
        <text x="18" y="18" fontSize="8" fill="rgba(0,0,0,0.2)" textAnchor="end" fontFamily="PingFang SC">2000</text>
        <text x="18" y="43" fontSize="8" fill="rgba(0,0,0,0.2)" textAnchor="end" fontFamily="PingFang SC">1500</text>
        <text x="18" y="68" fontSize="8" fill="rgba(0,0,0,0.2)" textAnchor="end" fontFamily="PingFang SC">1000</text>
        
        {/* 柱状图 */}
        {data.map((val, i) => {
          const x = 32 + i * 40;
          const isToday = i === 6;
          const displayVal = isToday ? todayKcal : val;
          if(!displayVal) return null;
          
          const h = getBarHeight(displayVal);
          const y = getBarY(displayVal);
          
          return (
            <g key={i}>
              <rect 
                x={x} 
                y={y} 
                width={barW} 
                height={h} 
                rx="4" 
                fill={DIET_FB_PRIMARY} 
                opacity={isToday ? 0.7 : 0.25}
                className="diet-fb-bar-anim"
                style={{ animationDelay: `${i * 60}ms` }}
              />
              {isToday && displayVal && (
                <text 
                  x={x + barW/2} 
                  y={y - 4} 
                  fontSize="9" 
                  fill={DIET_FB_PRIMARY} 
                  fontWeight="500" 
                  textAnchor="middle" 
                  fontFamily="PingFang SC"
                >
                  {displayVal}
                </text>
              )}
            </g>
          );
        })}
        
        {/* X轴标签 */}
        {days.map((day, i) => {
          const x = 32 + i * 40 + barW/2;
          const hasData = i === 6 ? todayKcal : data[i];
          const isToday = i === 6;
          return (
            <text 
              key={i}
              x={x} 
              y="112" 
              fontSize={isToday ? "8.5" : "8"} 
              fill={isToday ? DIET_FB_PRIMARY : (hasData ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.15)")}
              fontWeight={isToday ? "500" : "400"}
              textAnchor="middle" 
              fontFamily="PingFang SC"
            >
              {day}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function DietSecBHeader({ title = '近 7 日饮食热量' }){
  return (
    <div className="diet-fb-b-header">
      <span className="diet-fb-ai-badge">
        <svg viewBox="0 0 16 16" fill="none">
          <rect x="1" y="10" width="3" height="5" rx="1" fill="currentColor" opacity=".4"/>
          <rect x="6" y="6" width="3" height="9" rx="1" fill="currentColor" opacity=".6"/>
          <rect x="11" y="2" width="3" height="13" rx="1" fill="currentColor"/>
        </svg>
        AI
      </span>
      <span className="diet-fb-b-title">{title}</span>
    </div>
  );
}

function DietAiChevron({ open }){
  return (
    <svg
      className={'diet-fb-ai-chevron' + (open ? ' is-open' : '')}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DietDayTotalSummary({ dayMealCount = 2, dayTotalKcal }){
  if (dayTotalKcal == null) return null;
  return (
    <div className="diet-fb-day-total diet-fb-day-total-in-ai">
      今天已记录 {dayMealCount} 餐，合计约 <b>{formatKcal(dayTotalKcal)} kcal</b>
    </div>
  );
}

function DietCycleDietTip({ text, subText, icon = '🩸' }){
  return (
    <div className="diet-fb-cycle-tip">
      <span className="diet-fb-cycle-tip-icon" aria-hidden="true">{icon}</span>
      <div className="diet-fb-cycle-tip-body">
        <p className="diet-fb-cycle-tip-text">{text}</p>
        {subText && <p className="diet-fb-cycle-tip-sub">{subText}</p>}
      </div>
    </div>
  );
}

function getCycleDietTipDisplay(cycleData){
  const day = cycleData?.day ?? 2;
  return {
    text: getCycleDietTipText(),
    subText: `当前经期第 ${day} 天`,
  };
}

function getCycleDietTipText(){
  return '经期可以适当多吃些含铁食物，比如红肉、菠菜、黑木耳，帮助补充流失的铁元素。';
}

function getUnlockTrendGuideText(daysWithRecord = 0){
  const daysLeft = Math.max(0, 3 - daysWithRecord);
  return `再记录 ${daysLeft} 天饮食，即可解锁热量趋势图。`;
}

function DietGuideBelowTotal({ daysWithRecord = 0 }){
  return (
    <p className="diet-fb-guide-below-total diet-fb-stagger-in">
      {getUnlockTrendGuideText(daysWithRecord)}
    </p>
  );
}

function getDiversityInlineSuffix(count){
  if (count == null || count < 5) return null;
  return { count };
}

function roundRunMinutes(kcal){
  if (kcal == null) return 0;
  const raw = Math.round(kcal / 8);
  return Math.max(5, Math.round(raw / 5) * 5);
}

function getFeedbackDimCopy(dim, {
  dayMealCount = 0,
  dayTotalKcal,
  avgKcal,
  mealKcal,
  todayFoodCount = 0,
} = {}){
  switch (dim) {
    case 'A':
      if (dayTotalKcal == null) return null;
      return `今天饮食打卡 ${dayMealCount} 次，合计 ${formatKcal(dayTotalKcal)} 千卡。`;
    case 'B':
      if (avgKcal == null) return null;
      return `过去一周平均每天 ${formatKcal(avgKcal)} 千卡。`;
    case 'C':
      if (mealKcal == null) return null;
      return `这顿挺丰盛的，约 ${formatKcal(mealKcal)} 千卡，相当于慢跑 ${roundRunMinutes(mealKcal)} 分钟。`;
    case 'D':
      return '经期吃冰品因人而异，如果你容易痛经，减少冰品可能会舒服一些。';
    case 'E':
      if (todayFoodCount < 5) return null;
      return `今天吃了 ${todayFoodCount} 种食物，种类很丰富。多样性能确保微量元素不缺乏。`;
    default:
      return null;
  }
}

function getFeedbackDimComboCopy(dims, ctx){
  if (!dims?.length) return null;
  const parts = dims
    .map((dim) => getFeedbackDimCopy(dim, ctx))
    .filter(Boolean);
  return parts.length ? parts.join('') : null;
}

function DietFeedbackDimCopy({ dim, dims, dayMealCount, dayTotalKcal, avgKcal, mealKcal, todayFoodCount }){
  const ctx = { dayMealCount, dayTotalKcal, avgKcal, mealKcal, todayFoodCount };
  const text = dims?.length
    ? getFeedbackDimComboCopy(dims, ctx)
    : getFeedbackDimCopy(dim, ctx);
  if (!text) return null;
  return <p className="diet-fb-b-stats">{text}</p>;
}

function DietAiAvgStats({ avgKcal, diversityCount, cycleText, cycleSplitParagraph }){
  const diversity = getDiversityInlineSuffix(diversityCount);
  const cycleInline = cycleText && !cycleSplitParagraph;

  return (
    <>
      <p className="diet-fb-b-stats">
        7日日均约{' '}
        <span className="diet-fb-stat-accent">{formatKcal(avgKcal)} kcal</span>
        {diversity && (
          <>
            ，今天吃了 <span className="diet-fb-stat-accent">{diversity.count}</span> 种食物，饮食多样性不错。
          </>
        )}
        {cycleInline && <>，{cycleText}</>}
      </p>
      {cycleSplitParagraph && cycleText && (
        <p className="diet-fb-b-stats-followup">{cycleText}</p>
      )}
    </>
  );
}

function resolveShowAiInsights({ showAi, displayCfg, hasInlineCalorieInsight }){
  if (!showAi) return false;
  if (displayCfg) return shouldShowDisplayAi(displayCfg);
  return !hasInlineCalorieInsight;
}

function shouldShowMealDiversity(displayCfg){
  return !!(
    displayCfg?.showDiversity
    && displayCfg?.diversityPlacement !== 'inline-after-avg'
  );
}

function shouldShowGuideBelowTotal(displayCfg){
  return !!displayCfg?.showGuideBelowTotal;
}

function shouldShowDisplayAi(cfg){
  if (!cfg) return false;
  return !!(
    cfg.feedbackDim ||
    (cfg.feedbackDims && cfg.feedbackDims.length) ||
    cfg.showGuide ||
    cfg.showChart ||
    cfg.showDayTotal ||
    cfg.showAvg ||
    cfg.showCycleTip ||
    cfg.showMilestone
  );
}

function DietDiversityTip({ count, placement = 'ai' }){
  if (count < 5) return null;
  const placementClass = placement === 'meal'
    ? ' diet-fb-diversity-tip--meal diet-fb-stagger-in diet-fb-stagger-in-delay'
    : '';
  return (
    <div className={'diet-fb-diversity-tip' + placementClass}>
      <div className="diet-fb-diversity-tip-inner">
        <span className="diet-fb-diversity-tip-icon" aria-hidden="true">🥗</span>
        <p className="diet-fb-diversity-tip-text">
          今天吃了 <strong>{count}</strong> 种食物，饮食多样性不错 <span className="diet-fb-diversity-tip-emoji">👍</span>
        </p>
      </div>
    </div>
  );
}

function DietMilestoneTip({ milestone, surprise = false }){
  const textByMilestone = {
    7: '已经连续记录 7 天饮食了！坚持记录能帮你更好地了解自己的饮食习惯 🎉',
    30: '饮食记录满 30 天！你对自己的饮食习惯已经有很好的了解了 📊',
    100: '饮食记录满 100 天，这份坚持本身就值得为自己鼓掌 💪',
  };
  const iconByMilestone = { 7: '🎉', 30: '📊', 100: '🎉' };
  const text = textByMilestone[milestone];
  if (!text) return null;
  return (
    <div className={'diet-fb-milestone-tip' + (surprise ? ' diet-fb-milestone-tip--surprise' : '')}>
      <div className="diet-fb-milestone-tip-inner">
        <span className="diet-fb-milestone-tip-icon" aria-hidden="true">{iconByMilestone[milestone] || '💪'}</span>
        <p className="diet-fb-milestone-tip-text">{text}</p>
      </div>
    </div>
  );
}

const DEFAULT_AI_BLOCK_ORDER = ['dayTotal', 'guide', 'chart', 'avg', 'milestone', 'cycleTip'];

function DietCalorieAiBody({
  weekData = [],
  todayKcal,
  daysWithRecord = 0,
  avgKcal,
  dayMealCount = 2,
  dayTotalKcal,
  mealKcal,
  displayScenario,
  cycleData = null,
  todayFoodCount = 0,
}){
  const getConfig = window.getDietFeedbackDisplayConfig;
  const cfg = displayScenario && getConfig
    ? getConfig(displayScenario)
    : null;

  if (cfg?.feedbackDim || cfg?.feedbackDims?.length) {
    return (
      <>
        <DietTrendChart data={weekData} todayKcal={todayKcal}/>
        <DietFeedbackDimCopy
          dim={cfg.feedbackDim}
          dims={cfg.feedbackDims}
          dayMealCount={dayMealCount}
          dayTotalKcal={dayTotalKcal ?? todayKcal}
          avgKcal={avgKcal}
          mealKcal={mealKcal ?? todayKcal}
          todayFoodCount={todayFoodCount}
        />
      </>
    );
  }

  const renderAiBlock = (blockType) => {
    if (!cfg) return null;
    switch (blockType) {
      case 'dayTotal':
        if (!cfg.showDayTotal) return null;
        return (
          <DietDayTotalSummary
            key="dayTotal"
            dayMealCount={dayMealCount}
            dayTotalKcal={dayTotalKcal ?? todayKcal}
          />
        );
      case 'guide':
        if (!cfg.showGuide) return null;
        return (
          <div key="guide" className="diet-fb-guide-text">
            {getUnlockTrendGuideText(daysWithRecord)}
          </div>
        );
      case 'chart':
        if (!cfg.showChart) return null;
        return <DietTrendChart key="chart" data={weekData} todayKcal={todayKcal}/>;
      case 'avg':
        if (!cfg.showAvg || avgKcal == null) return null;
        return (
          <DietAiAvgStats
            key="avg"
            avgKcal={avgKcal}
            diversityCount={
              cfg.showDiversity && cfg.diversityPlacement === 'inline-after-avg'
                ? todayFoodCount
                : null
            }
            cycleText={
              cfg.showCycleTip && cfg.cycleTipPlacement === 'inline-after-avg'
                ? getCycleDietTipText()
                : null
            }
            cycleSplitParagraph={!!cfg.cycleTipSplitParagraph}
          />
        );
      case 'milestone':
        if (!cfg.showMilestone) return null;
        return (
          <DietMilestoneTip
            key="milestone"
            milestone={cfg.showMilestone}
            surprise={!!cfg.milestoneSurprise}
          />
        );
      case 'cycleTip':
        if (!cfg.showCycleTip || cfg.cycleTipPlacement === 'inline-after-avg') return null;
        return <DietCycleDietTip key="cycleTip" {...getCycleDietTipDisplay(cycleData)}/>;
      default:
        return null;
    }
  };

  if (cfg) {
    const blockOrder = cfg.aiBlockOrder || DEFAULT_AI_BLOCK_ORDER;
    return <>{blockOrder.map((blockType) => renderAiBlock(blockType))}</>;
  }

  const showChart = daysWithRecord >= 3;
  const showAvg = daysWithRecord >= 5;

  if (showChart) {
    return (
      <>
        <DietTrendChart data={weekData} todayKcal={todayKcal}/>
        {showAvg && avgKcal ? (
          <div className="diet-fb-b-stats">7日日均约 <strong>{formatKcal(avgKcal)} kcal</strong></div>
        ) : (
          <div className="diet-fb-b-stats hint">再记录 {Math.max(0, 5 - daysWithRecord)} 天，解锁 7 日均值分析</div>
        )}
      </>
    );
  }

  return (
    <div className="diet-fb-guide-text">再记录 {Math.max(0, 3 - daysWithRecord)} 天饮食，即可解锁热量趋势图。</div>
  );
}

function DietAiInsightsShell({ displayScenario, isNew, children }){
  const getConfig = window.getDietFeedbackDisplayConfig;
  const plainShell = displayScenario && getConfig?.(displayScenario)?.plainShell;

  if (plainShell) {
    return (
      <>
        <div className="diet-fb-divider"/>
        <div className={'diet-fb-sec-b-plain' + (isNew ? ' diet-fb-stagger-in' : '')}>
          {children}
        </div>
      </>
    );
  }

  return (
    <DietAiCollapsibleSection defaultOpen animateIn={isNew}>
      {children}
    </DietAiCollapsibleSection>
  );
}

function DietAiCollapsibleSection({
  title = '近 7 日饮食热量',
  defaultOpen = true,
  animateIn = false,
  embedded = false,
  children,
}){
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <>
      <div className={'diet-fb-divider' + (embedded ? ' diet-fb-divider-bleed' : '')}/>
      <div className={'diet-fb-ai-collapsible' + (embedded ? ' is-embedded' : '') + (animateIn ? ' diet-fb-stagger-in' : '')}>
        <button
          type="button"
          className="diet-fb-ai-toggle"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
        >
          <span className="diet-fb-ai-badge">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1" y="10" width="3" height="5" rx="1" fill="currentColor" opacity=".4"/>
              <rect x="6" y="6" width="3" height="9" rx="1" fill="currentColor" opacity=".6"/>
              <rect x="11" y="2" width="3" height="13" rx="1" fill="currentColor"/>
            </svg>
            AI
          </span>
          <span className="diet-fb-b-title">{title}</span>
          <DietAiChevron open={open}/>
        </button>
        <div className={'diet-fb-ai-panel' + (open ? ' is-open' : '')} aria-hidden={!open}>
          <div className="diet-fb-ai-panel-inner">
            <div className="diet-fb-sec-b-content">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function formatFoodTagLabel(item){
  if (typeof item === 'string') return item;
  if (item?.label) return item.label;
  if (item?.portion) return `${item.name} ${item.portion}`;
  if (item?.kcal != null) return `${item.name} ${item.kcal} kcal`;
  return item?.name || '';
}

function formatFoodItemText(item){
  if (typeof item === 'string') return item;
  const name = item?.label || item?.name || '';
  if (item?.kcal != null) return `${name} ${formatKcal(item.kcal)}千卡`;
  return name;
}

function DietMealInsightCard({ insight }){
  if (!insight) return null;

  let content = null;
  if (insight.type === 'high-meal') {
    content = (
      <>
        这顿热量比较高，约 <strong>{insight.kcal}</strong> kcal，相当于慢跑 <strong>{insight.runMin}</strong> 分钟，
        <span className="diet-fb-meal-insight-soft">偶尔吃一顿大餐没关系～</span>
      </>
    );
  } else if (insight.type === 'feast') {
    content = (
      <>
        这顿挺丰盛的，约 <strong>{insight.kcal}</strong> kcal，相当于慢跑 <strong>{insight.runMin}</strong> 分钟
      </>
    );
  } else if (insight.type === 'light') {
    content = (
      <>这顿比较清淡，约 <strong>{insight.kcal}</strong> kcal，注意营养要均衡哦</>
    );
  }
  if (!content) return null;

  return (
    <div className="diet-fb-meal-insight diet-fb-stagger-in">
      <div className="diet-fb-meal-insight-inner">
        <span className="diet-fb-meal-insight-icon" aria-hidden="true">{insight.icon}</span>
        <p className="diet-fb-meal-insight-text">{content}</p>
      </div>
    </div>
  );
}

function DietFoodResultSummary({
  items = [],
  totalKcal,
  revealStep = 3,
  calorieInsight = null,
  diversityCount = null,
  compact = false,
  guideBelowTotalDays = null,
}){
  const showDiversity = revealStep >= 1 && diversityCount != null && diversityCount >= 5;
  const showTotal = revealStep >= 1 && totalKcal != null;
  const showCalorieInsight = revealStep >= 1 && calorieInsight;
  const showFoodList = (compact ? revealStep >= 1 : revealStep >= 2) && items.length > 0;
  const showGuideBelowTotal = revealStep >= 1 && guideBelowTotalDays != null;
  const foodListText = items.map(formatFoodItemText).filter(Boolean).join('，');

  return (
    <div className={'diet-fb-sec-a' + (compact ? ' is-compact' : '')}>
      {showFoodList && (
        <p className="diet-fb-food-list diet-fb-stagger-in">{foodListText}</p>
      )}
      {showTotal && (
        <p className="diet-fb-total-line diet-fb-stagger-in">
          <span className="diet-fb-total-label">总热量：</span>
          <span className="diet-fb-total-value">{formatKcal(totalKcal)} 千卡</span>
        </p>
      )}
      {showGuideBelowTotal && (
        <DietGuideBelowTotal daysWithRecord={guideBelowTotalDays}/>
      )}
      {showCalorieInsight && <DietMealInsightCard insight={calorieInsight}/>}
      {showDiversity && (
        <DietDiversityTip count={diversityCount} placement="meal"/>
      )}
    </div>
  );
}

function DietSecALoading(){
  return (
    <div className="diet-fb-sec-a diet-fb-sec-loading" aria-hidden="true">
      <div className="diet-fb-skeleton-food-list">
        <div className="diet-fb-skeleton-line lg"/>
        <div className="diet-fb-skeleton-line md"/>
      </div>
      <div className="diet-fb-skeleton-total">
        <div className="diet-fb-skeleton-line xs"/>
      </div>
    </div>
  );
}

function DietSecAPhotoResult(props){
  return <DietFoodResultSummary {...props}/>;
}

function DietSecBLoading(){
  return (
    <div className="diet-fb-sec-b diet-fb-sec-loading" aria-live="polite">
      <div className="diet-fb-b-header diet-fb-ai-loading-line">
        <span className="diet-fb-ai-badge">
          <svg viewBox="0 0 16 16" fill="none">
            <rect x="1" y="10" width="3" height="5" rx="1" fill="currentColor" opacity=".4"/>
            <rect x="6" y="6" width="3" height="9" rx="1" fill="currentColor" opacity=".6"/>
            <rect x="11" y="2" width="3" height="13" rx="1" fill="currentColor"/>
          </svg>
          AI
        </span>
      </div>
      <div className="diet-fb-recog">
        <span className="diet-fb-recog-dot"/>
        <span className="diet-fb-recog-dot"/>
        <span className="diet-fb-recog-dot"/>
        <span className="diet-fb-recog-text">识别中</span>
      </div>
    </div>
  );
}

function DietSecErrorRetry({ onRetry, showRetry, retrying }){
  return (
    <div className="diet-fb-sec-a diet-fb-sec-error">
      <div className="diet-fb-error-row">
        <span className="diet-fb-error-text">AI识别遇到点小问题</span>
        {showRetry && (
          <button
            type="button"
            className="diet-fb-retry-btn"
            onClick={onRetry}
            disabled={retrying}
          >
            重试
          </button>
        )}
      </div>
    </div>
  );
}

function DietPhotoFeedbackCard({
  photoUrl,
  data,
  userContext,
  isNew = false,
  onAnalysisComplete,
  recognitionScenario: recognitionScenarioProp,
  recognitionState: recognitionStateProp,
  failureCount: failureCountProp = 0,
  displayScenario: displayScenarioProp,
}){
  const loadingMs = window.PHOTO_ANALYZE_LOADING_MS || 5000;
  const readScenario = window.readDietRecognitionScenario || (() => 'success');
  const readDisplayScenario = window.readDietFeedbackDisplayScenario || (() => null);
  const resolveMaxFailures = window.getDietRecognitionMaxFailures || (() => 5);
  const mockRecognize = window.mockRecognizeDietPhoto || (() => ({ ok: true }));
  const activeScenario = recognitionScenarioProp || readScenario();
  const maxFailures = resolveMaxFailures(activeScenario);

  const initialPhase = (() => {
    if (recognitionStateProp === 'error') return 'error';
    if (recognitionStateProp === 'ready') return 'ready';
    if (isNew) return 'loading';
    return 'ready';
  })();

  const [phase, setPhase] = React.useState(initialPhase);
  const [revealStep, setRevealStep] = React.useState(() => {
    if (initialPhase === 'ready' && recognitionStateProp !== 'ready') return 3;
    return 0;
  });
  const [failureCount, setFailureCount] = React.useState(
    recognitionStateProp === 'error' ? Math.max(0, failureCountProp) : 0
  );
  const recognizeTimerRef = React.useRef(null);
  const revealTimersRef = React.useRef([]);
  const finishRecognitionRef = React.useRef(null);

  const {
    time,
    foods = [],
    items = [],
    totalKcal,
    matchStatus = 'all',
    foodTags = [],
  } = data || {};
  const ctx = userContext || {};

  const clearRevealTimers = React.useCallback(() => {
    revealTimersRef.current.forEach((id) => window.clearTimeout(id));
    revealTimersRef.current = [];
  }, []);

  const startSuccessReveal = React.useCallback(() => {
    clearRevealTimers();
    setRevealStep(1);
    revealTimersRef.current.push(window.setTimeout(() => setRevealStep(2), 420));
    revealTimersRef.current.push(window.setTimeout(() => {
      setRevealStep(3);
      onAnalysisComplete?.();
      requestAnimationFrame(() => {
        if (typeof window.scrollTimelineToBottom === 'function') {
          window.scrollTimelineToBottom('smooth');
        }
      });
    }, 840));
  }, [clearRevealTimers, onAnalysisComplete]);

  const finishRecognition = React.useCallback((result, { forceSuccess = false, isRetry = false } = {}) => {
    const scenario = readScenario();
    const ok = result?.ok ?? mockRecognize({ scenario, forceSuccess }).ok;

    if (ok) {
      setFailureCount(0);
      setPhase('ready');
      startSuccessReveal();
      return;
    }

    setPhase('error');
    if (isRetry) {
      setFailureCount((count) => count + 1);
    }
    setRevealStep(0);
  }, [mockRecognize, readScenario, startSuccessReveal]);

  finishRecognitionRef.current = finishRecognition;

  const runRecognition = React.useCallback((options = {}) => {
    if (recognizeTimerRef.current) {
      window.clearTimeout(recognizeTimerRef.current);
    }
    setPhase('loading');
    setRevealStep(0);
    recognizeTimerRef.current = window.setTimeout(() => {
      recognizeTimerRef.current = null;
      const scenario = readScenario();
      const result = mockRecognize({ scenario, forceSuccess: options.forceSuccess });
      finishRecognitionRef.current?.(result, options);
    }, loadingMs);
  }, [loadingMs, mockRecognize, readScenario]);

  React.useEffect(() => {
    if (!isNew) return undefined;
    if (recognitionStateProp === 'ready') {
      startSuccessReveal();
      return () => clearRevealTimers();
    }
    if (recognitionStateProp === 'error') return undefined;
    runRecognition();
    return () => {
      if (recognizeTimerRef.current) {
        window.clearTimeout(recognizeTimerRef.current);
        recognizeTimerRef.current = null;
      }
      clearRevealTimers();
    };
  // 仅在新卡片挂载时触发一次，避免 revealStep 变化导致重复识别
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, recognitionStateProp]);

  const handleRetry = React.useCallback((event) => {
    if (phase === 'loading' || failureCount >= maxFailures) return;
    const forceSuccess = !!(event?.altKey || event?.metaKey);
    runRecognition({ forceSuccess, isRetry: true });
  }, [failureCount, maxFailures, phase, runRecognition]);

  if (matchStatus === 'fail') {
    return (
      <div className={'diet-fb-card diet-fb-photo-card' + (isNew ? ' is-new' : '')}>
        {time && <div className="diet-fb-ts">{time}</div>}
        {photoUrl && (
          <div className="diet-fb-photo-wrap">
            <img src={photoUrl} alt="" className="diet-fb-photo"/>
          </div>
        )}
        <DietSecFail/>
      </div>
    );
  }

  const interpretation = revealStep >= 3 ? getCalorieInterpretation(totalKcal) : null;
  const cycleInsight = revealStep >= 3 ? getCycleInsight(ctx.cycleData, foodTags) : null;
  const isLoading = phase === 'loading';
  const isError = phase === 'error';
  const isExhausted = isError && failureCount >= maxFailures;
  const showAi = phase === 'ready' && revealStep >= 3;
  const showErrorAction = isError && failureCount < maxFailures;
  const displayScenario = displayScenarioProp || readDisplayScenario();
  const displayCfg = displayScenario && window.getDietFeedbackDisplayConfig
    ? window.getDietFeedbackDisplayConfig(displayScenario)
    : null;
  const usesFeedbackDim = !!(displayCfg?.feedbackDim || displayCfg?.feedbackDims?.length);
  const calorieInsight = !usesFeedbackDim && revealStep >= 1
    ? resolveCalorieInsightBelowTotal(totalKcal, displayCfg)
    : null;
  const diversityCount = shouldShowMealDiversity(displayCfg) && revealStep >= 1
    ? (ctx.todayFoodCount ?? 0)
    : null;
  const guideBelowTotalDays = shouldShowGuideBelowTotal(displayCfg) && revealStep >= 1
    ? (ctx.daysWithRecord ?? 0)
    : null;
  const hasInlineCalorieInsight = !!(displayCfg?.showMealInsight || displayCfg?.showCalorieInsightCard);
  const showAiInsights = resolveShowAiInsights({ showAi, displayCfg, hasInlineCalorieInsight });
  const mealInterpretation = !usesFeedbackDim && showAiInsights && !hasInlineCalorieInsight
    ? interpretation
    : null;

  return (
    <>
      <div className={'diet-fb-card diet-fb-photo-card' + (isNew ? ' is-new' : '') + (isLoading ? ' is-loading' : '') + (isError ? ' is-error' : '') + (isExhausted ? ' is-exhausted' : '') + (phase === 'ready' ? ' is-ready' : '')}>
        {time && <div className="diet-fb-ts">{time}</div>}
        {photoUrl && (
          <div className="diet-fb-photo-wrap">
            <img src={photoUrl} alt="" className="diet-fb-photo"/>
          </div>
        )}
        {isLoading && <DietSecALoading/>}
        {phase === 'ready' && revealStep >= 1 && (
          <DietSecAPhotoResult
            items={items}
            totalKcal={totalKcal}
            revealStep={revealStep}
            calorieInsight={calorieInsight}
            diversityCount={diversityCount}
            compact={!!displayCfg?.useCompactMeal}
            guideBelowTotalDays={guideBelowTotalDays}
          />
        )}
        {isLoading && (
          <>
            <div className="diet-fb-divider"/>
            <DietSecBLoading/>
          </>
        )}
        {showErrorAction && (
          <DietSecErrorRetry
            onRetry={handleRetry}
            showRetry
            retrying={false}
          />
        )}
        {showAiInsights && (
          <DietAiInsightsShell displayScenario={displayScenario} isNew={isNew}>
            <DietCalorieAiBody
              weekData={ctx.weekData || []}
              todayKcal={ctx.dayTotalKcal || totalKcal}
              daysWithRecord={ctx.daysWithRecord || 0}
              avgKcal={ctx.avgKcal}
              dayMealCount={ctx.dayMealCount || 2}
              dayTotalKcal={ctx.dayTotalKcal}
              mealKcal={totalKcal}
              displayScenario={displayScenario}
              cycleData={ctx.cycleData}
              todayFoodCount={ctx.todayFoodCount ?? 0}
            />
          </DietAiInsightsShell>
        )}
        {showAiInsights && cycleInsight && !displayCfg?.showCycleTip && !usesFeedbackDim && (
          <>
            <div className="diet-fb-divider"/>
            <div className="diet-fb-stagger-in">
              <DietSecD {...cycleInsight}/>
            </div>
          </>
        )}
      </div>
      {showAiInsights && mealInterpretation && (
        <div className="diet-fb-outer-text diet-fb-stagger-in diet-fb-stagger-in-delay">{mealInterpretation}</div>
      )}
    </>
  );
}

function DietTextFeedbackCard({
  sourceText,
  sourceVoice,
  data,
  userContext,
  isNew = false,
  displayScenario: displayScenarioProp,
}){
  const {
    time,
    items = [],
    totalKcal,
    matchStatus = 'all',
    foodTags = [],
  } = data || {};
  const ctx = userContext || {};
  const readDisplayScenario = window.readDietFeedbackDisplayScenario || (() => null);
  const displayScenario = displayScenarioProp || readDisplayScenario();
  const showCalories = matchStatus !== 'names-only' && totalKcal != null;
  const TlVoiceInline = window.TlVoiceInline;

  const [revealStep, setRevealStep] = React.useState(isNew ? 0 : 3);

  React.useEffect(() => {
    if (!isNew) return undefined;
    if (showCalories) {
      setRevealStep(1);
      const tagsTimer = window.setTimeout(() => setRevealStep(2), 420);
      const aiTimer = window.setTimeout(() => setRevealStep(3), 840);
      return () => {
        window.clearTimeout(tagsTimer);
        window.clearTimeout(aiTimer);
      };
    }
    const tagsTimer = window.setTimeout(() => setRevealStep(2), 280);
    return () => window.clearTimeout(tagsTimer);
  }, [isNew, showCalories]);

  const tagItems = showCalories
    ? items
    : items.map((item) => (typeof item === 'string' ? item : (item.label || item.name)));
  const displayCfg = displayScenario && window.getDietFeedbackDisplayConfig
    ? window.getDietFeedbackDisplayConfig(displayScenario)
    : null;
  const usesFeedbackDim = !!(displayCfg?.feedbackDim || displayCfg?.feedbackDims?.length);
  const calorieInsight = !usesFeedbackDim && revealStep >= 1 && showCalories
    ? resolveCalorieInsightBelowTotal(totalKcal, displayCfg)
    : null;
  const diversityCount = shouldShowMealDiversity(displayCfg) && revealStep >= 1 && showCalories
    ? (ctx.todayFoodCount ?? 0)
    : null;
  const guideBelowTotalDays = shouldShowGuideBelowTotal(displayCfg) && revealStep >= 1 && showCalories
    ? (ctx.daysWithRecord ?? 0)
    : null;
  const hasInlineCalorieInsight = !!(displayCfg?.showMealInsight || displayCfg?.showCalorieInsightCard);
  const showAiInsights = resolveShowAiInsights({
    showAi: showCalories && revealStep >= 3,
    displayCfg,
    hasInlineCalorieInsight,
  });
  const interpretation = !usesFeedbackDim && showAiInsights && !hasInlineCalorieInsight
    ? getCalorieInterpretation(totalKcal)
    : null;

  return (
    <>
      <div className={'diet-fb-card diet-fb-text-card' + (isNew ? ' is-new' : '') + (showCalories ? ' is-ready' : ' is-names-only')}>
        {time && <div className="diet-fb-ts">{time}</div>}
        {sourceVoice && TlVoiceInline ? (
          <div className="diet-fb-source-voice">
            <TlVoiceInline voice={sourceVoice} text={sourceText}/>
          </div>
        ) : sourceText ? (
          <p className="diet-fb-source-text">{sourceText}</p>
        ) : null}
        <DietFoodResultSummary
          items={tagItems}
          totalKcal={showCalories ? totalKcal : null}
          revealStep={revealStep}
          calorieInsight={calorieInsight}
          diversityCount={diversityCount}
          compact={!!displayCfg?.useCompactMeal}
          guideBelowTotalDays={guideBelowTotalDays}
        />
        {showAiInsights && (
          <DietAiInsightsShell displayScenario={displayScenario} isNew={isNew}>
            <DietCalorieAiBody
              weekData={ctx.weekData || []}
              todayKcal={ctx.dayTotalKcal || totalKcal}
              daysWithRecord={ctx.daysWithRecord || 0}
              avgKcal={ctx.avgKcal}
              dayMealCount={ctx.dayMealCount || 2}
              dayTotalKcal={ctx.dayTotalKcal}
              mealKcal={totalKcal}
              displayScenario={displayScenario}
              cycleData={ctx.cycleData}
              todayFoodCount={ctx.todayFoodCount ?? 0}
            />
          </DietAiInsightsShell>
        )}
      </div>
      {interpretation && (
        <div className="diet-fb-outer-text diet-fb-stagger-in diet-fb-stagger-in-delay">{interpretation}</div>
      )}
    </>
  );
}

// ===== 维度A：识别结果卡片 =====
function DietSecA({ foods, totalKcal, items, dayMealCount, dayTotalKcal, matchStatus }){
  const foodsText = foods.join(' · ');
  
  return (
    <div className="diet-fb-sec-a">
      <div className="diet-fb-foods">🍽️ {foodsText}</div>
      {matchStatus === 'all' && totalKcal != null && (
        <div className="diet-fb-kcal">合计约 <b>{formatKcal(totalKcal)} kcal</b></div>
      )}
      {matchStatus === 'partial' && totalKcal != null && (
        <div className="diet-fb-kcal">已匹配食物合计约 <b>{formatKcal(totalKcal)} kcal</b></div>
      )}
      {matchStatus === 'none' && (
        <div className="diet-fb-kcal">已记录</div>
      )}
      
      {/* 食物明细 */}
      {items && items.length > 0 && (
        <div className="diet-fb-detail">
          {items.map((item, i) => (
            <div key={i} className="diet-fb-item">
              <span className={`name${item.matched === false ? ' unmatch' : ''}`}>{item.name}</span>
              {item.kcal != null && <span className="kcal">约 {item.kcal} kcal</span>}
            </div>
          ))}
        </div>
      )}
      
      {/* 当日汇总 */}
      {dayMealCount >= 2 && dayTotalKcal != null && (
        <div className="diet-fb-day-total">
          今天已记录 {dayMealCount} 餐，合计约 <b>{formatKcal(dayTotalKcal)} kcal</b>
        </div>
      )}
    </div>
  );
}

// ===== 维度B：7日趋势 =====
function DietSecB({ weekData, todayKcal, daysWithRecord, avgKcal, defaultOpen = true }){
  return (
    <DietAiCollapsibleSection defaultOpen={defaultOpen}>
      <DietCalorieAiBody
        weekData={weekData}
        todayKcal={todayKcal}
        daysWithRecord={daysWithRecord}
        avgKcal={avgKcal}
      />
    </DietAiCollapsibleSection>
  );
}

// ===== 维度C：热量解读 =====
function DietSecC({ kcal, interpretation }){
  if(!interpretation) return null;
  return (
    <div className="diet-fb-outer-text">{interpretation}</div>
  );
}

// ===== 维度D：周期关联 =====
function DietSecD({ type, text, subText }){
  const iconMap = {
    'iron-suggest': { icon: '🩸', cls: 'cycle' },
    'iron-confirm': { icon: '👍', cls: 'good' },
    'cold-warn': { icon: '🧊', cls: 'tip' },
    'luteal-sweet': { icon: '🍬', cls: 'tip' },
  };
  const { icon, cls } = iconMap[type] || { icon: '💡', cls: 'tip' };
  
  return (
    <div className="diet-fb-sec-insight">
      <div className="diet-fb-insight-line">
        <div className={`diet-fb-ins-icon ${cls}`}>{icon}</div>
        <div className="diet-fb-ins-text">
          {text}
          {subText && <span className="diet-fb-ins-sub">{subText}</span>}
        </div>
      </div>
    </div>
  );
}

// ===== 维度E：饮食多样性 =====
function DietSecE({ count }){
  if(count < 5) return null;
  return (
    <div className="diet-fb-diversity">
      <div className="diet-fb-diversity-text">
        今天吃了 {count} 种食物，饮食多样性不错 👍
      </div>
    </div>
  );
}

// ===== 维度F：里程碑 =====
function DietSecF({ days, milestone }){
  const milestoneText = {
    7: '已经连续记录 7 天饮食了！坚持记录能帮你更好地了解自己的饮食习惯 🎉',
    30: '饮食记录满 30 天！你对自己的饮食习惯已经有很好的了解了 📊',
    100: '饮食记录满 100 天，这份坚持本身就值得为自己鼓掌 💪',
  };
  
  if(!milestoneText[milestone]) return null;
  
  return (
    <div className="diet-fb-milestone">
      <div className="diet-fb-milestone-text">
        {milestoneText[milestone]}
      </div>
    </div>
  );
}

// ===== 识别失败 =====
function DietSecFail(){
  return (
    <div className="diet-fb-fail">
      <div className="diet-fb-fail-text">没有识别到食物，试试拍清晰一点？</div>
      <div className="diet-fb-fail-hint">确保食物在画面中清晰可见</div>
    </div>
  );
}

// ===== 热量解读规则 =====
function getCalorieInterpretation(kcal){
  if(kcal == null) return null;
  if(kcal < 300){
    return `🥗 这顿比较清淡，约 ${kcal} kcal，注意营养要均衡哦`;
  }
  if(kcal >= 300 && kcal <= 700){
    return null; // 常规餐不特别解读
  }
  if(kcal > 700 && kcal <= 1000){
    const runMin = Math.round(kcal / 8);
    return `🍽️ 这顿挺丰盛的，约 ${kcal} kcal，相当于慢跑 ${runMin} 分钟`;
  }
  if(kcal > 1000){
    return `⚡ 这顿热量较高（约 ${kcal} kcal），建议搭配适量运动`;
  }
  return null;
}

function getMealCalorieInsight(kcal){
  if(kcal == null) return null;
  return {
    type: 'high-meal',
    icon: '🏃‍♀️',
    kcal: formatKcal(kcal),
    runMin: Math.round(kcal / 8),
  };
}

function getCalorieInsightCard(kcal){
  if(kcal == null) return null;
  if(kcal < 300){
    return {
      type: 'light',
      icon: '🥗',
      kcal: formatKcal(kcal),
    };
  }
  if(kcal >= 700){
    return {
      type: 'feast',
      icon: '🍽️',
      kcal: formatKcal(kcal),
      runMin: Math.round(kcal / 8),
    };
  }
  return null;
}

function resolveCalorieInsightBelowTotal(totalKcal, displayCfg){
  if(!displayCfg || totalKcal == null) return null;
  if(displayCfg.showMealInsight) return getMealCalorieInsight(totalKcal);
  if(displayCfg.showCalorieInsightCard) return getCalorieInsightCard(totalKcal);
  return null;
}

// ===== 周期关联规则 =====
function getCycleInsight(cycleData, foodTags){
  if(!cycleData) return null;
  
  const { phase, day } = cycleData;
  const hasIronFood = foodTags?.includes('含铁食物');
  const hasColdDrink = foodTags?.includes('冷饮冰品');
  const hasSweetFood = foodTags?.includes('甜食高糖');
  
  if(phase === 'period'){
    if(hasColdDrink){
      return {
        type: 'cold-warn',
        text: '经期吃冷饮因人而异，如果你容易痛经，减少冷饮可能会舒服一些',
        subText: `当前经期第 ${day} 天`,
      };
    }
    if(hasIronFood){
      return {
        type: 'iron-confirm',
        text: '经期吃含铁食物很不错，有助于补充铁元素 👍',
        subText: `当前经期第 ${day} 天`,
      };
    }
    return {
      type: 'iron-suggest',
      text: '经期可以适当多吃些含铁食物，比如红肉、菠菜、黑木耳，帮助补充流失的铁元素',
      subText: `当前经期第 ${day} 天`,
    };
  }
  
  if(phase === 'luteal-late' && hasSweetFood){
    return {
      type: 'luteal-sweet',
      text: '黄体期特别想吃甜食是很正常的，和孕激素波动有关。适量满足不用有负罪感～',
      subText: null,
    };
  }
  
  return null;
}

// ===== 主反馈卡片组件 =====
function DietFeedbackCard({ 
  data, 
  userContext,
  isNew = false,
  isStream = false,
}){
  const {
    time,
    foods = [],
    items = [],
    totalKcal,
    matchStatus = 'all', // 'all' | 'partial' | 'none' | 'fail'
    foodTags = [],
  } = data || {};
  
  const {
    dayMealCount = 1,
    dayTotalKcal,
    weekData = [null, null, null, null, null, null, null],
    daysWithRecord = 0,
    avgKcal,
    cycleData,
    todayFoodCount = 1,
    totalRecordDays = 1,
    newMilestone,
  } = userContext || {};
  
  // 识别失败
  if(matchStatus === 'fail'){
    return (
      <div className={`diet-fb-card${isNew ? ' is-new' : ''}`}>
        <DietSecFail/>
      </div>
    );
  }
  
  // 收集所有维度
  const sections = [];
  
  // 维度A：识别结果（必展示）
  sections.push({
    priority: 'A',
    render: () => (
      <DietSecA 
        key="sec-a"
        foods={foods}
        totalKcal={totalKcal}
        items={items}
        dayMealCount={dayMealCount}
        dayTotalKcal={dayTotalKcal}
        matchStatus={matchStatus}
      />
    ),
  });
  
  // 维度B：趋势图/引导
  sections.push({
    priority: 'B',
    render: () => (
      <DietSecB
        key="sec-b"
        weekData={weekData}
        todayKcal={dayTotalKcal || totalKcal}
        daysWithRecord={daysWithRecord}
        avgKcal={avgKcal}
      />
    ),
  });
  
  // 维度C：热量解读
  const interpretation = getCalorieInterpretation(totalKcal);
  if(interpretation){
    sections.push({
      priority: 'C',
      isOuter: true,
      render: () => <DietSecC key="sec-c" kcal={totalKcal} interpretation={interpretation}/>,
    });
  }
  
  // 维度D：周期关联
  const cycleInsight = getCycleInsight(cycleData, foodTags);
  if(cycleInsight){
    sections.push({
      priority: 'D',
      render: () => (
        <React.Fragment key="sec-d">
          <div className="diet-fb-divider"/>
          <DietSecD {...cycleInsight}/>
        </React.Fragment>
      ),
    });
  }
  
  // 维度E：饮食多样性
  if(todayFoodCount >= 5){
    sections.push({
      priority: 'E',
      render: () => (
        <React.Fragment key="sec-e">
          <div className="diet-fb-divider"/>
          <DietSecE count={todayFoodCount}/>
        </React.Fragment>
      ),
    });
  }
  
  // 维度F：里程碑
  if(newMilestone){
    sections.push({
      priority: 'F',
      render: () => (
        <React.Fragment key="sec-f">
          <div className="diet-fb-divider"/>
          <DietSecF days={totalRecordDays} milestone={newMilestone}/>
        </React.Fragment>
      ),
    });
  }
  
  // 按优先级排序，最多展示3个维度
  const cardSections = sections.filter(s => !s.isOuter).slice(0, 3);
  const outerSections = sections.filter(s => s.isOuter).slice(0, Math.max(0, 3 - cardSections.length));
  
  return (
    <>
      <div className={`diet-fb-card${isNew ? ' is-new' : ''}${isStream ? ' is-stream' : ''}`}>
        {time && <div className="diet-fb-ts">{time}</div>}
        {cardSections.map(s => s.render())}
      </div>
      {outerSections.map(s => s.render())}
    </>
  );
}

// ===== 示例数据生成 =====
function createDietFeedbackDemo(scenario){
  if(scenario === 'mature'){
    // 成熟用户：经期 + 多天记录
    return {
      data: {
        time: '12:35',
        foods: ['米饭', '红烧肉', '炒青菜'],
        items: [
          { name: '米饭（一碗）', kcal: 230 },
          { name: '红烧肉', kcal: 350 },
          { name: '炒青菜', kcal: 100 },
        ],
        totalKcal: 680,
        matchStatus: 'all',
        foodTags: [],
      },
      userContext: {
        dayMealCount: 2,
        dayTotalKcal: 980,
        weekData: [1420, null, 1680, null, 1250, 1560, null],
        daysWithRecord: 5,
        avgKcal: 1380,
        cycleData: { phase: 'period', day: 2 },
        todayFoodCount: 6,
        totalRecordDays: 15,
      },
    };
  }
  
  if(scenario === 'medium'){
    // 中等用户：无经期 + 高热量食物
    return {
      data: {
        time: '15:20',
        foods: ['珍珠奶茶（大杯）'],
        items: [
          { name: '珍珠奶茶（大杯）', kcal: 520 },
        ],
        totalKcal: 520,
        matchStatus: 'all',
        foodTags: ['甜食高糖'],
      },
      userContext: {
        dayMealCount: 1,
        dayTotalKcal: 520,
        weekData: [null, 1350, null, null, 890, null, null],
        daysWithRecord: 3,
        avgKcal: null,
        cycleData: null,
        todayFoodCount: 1,
        totalRecordDays: 8,
      },
    };
  }
  
  if(scenario === 'new'){
    // 新用户：首次记录
    return {
      data: {
        time: '19:45',
        foods: ['番茄鸡蛋面'],
        items: [
          { name: '番茄鸡蛋面', kcal: 420 },
        ],
        totalKcal: 420,
        matchStatus: 'all',
        foodTags: [],
      },
      userContext: {
        dayMealCount: 1,
        dayTotalKcal: 420,
        weekData: [null, null, null, null, null, null, null],
        daysWithRecord: 1,
        avgKcal: null,
        cycleData: null,
        todayFoodCount: 1,
        totalRecordDays: 1,
      },
    };
  }
  
  return null;
}

// ===== 创建时间轴饮食反馈条目 =====
function createDietFeedbackEntry(options){
  const {
    id,
    time,
    foods,
    items,
    totalKcal,
    matchStatus = 'all',
    foodTags = [],
    userContext = {},
  } = options;
  
  return {
    id: id || `diet-fb-${Date.now()}`,
    kind: 'diet-feedback',
    time,
    dietData: {
      time,
      foods,
      items,
      totalKcal,
      matchStatus,
      foodTags,
    },
    userContext,
    isNew: true,
  };
}

// ===== 模拟饮食识别结果 =====
function simulateDietRecognition(photoDescription){
  const foodPatterns = [
    { pattern: /米饭|白饭/, name: '米饭（一碗）', kcal: 230 },
    { pattern: /红烧肉/, name: '红烧肉', kcal: 350 },
    { pattern: /青菜|蔬菜|炒菜/, name: '炒青菜', kcal: 100 },
    { pattern: /奶茶/, name: '珍珠奶茶（大杯）', kcal: 520, tags: ['甜食高糖'] },
    { pattern: /面|面条/, name: '番茄鸡蛋面', kcal: 420 },
    { pattern: /鸡蛋|蛋/, name: '煎蛋', kcal: 90 },
    { pattern: /牛奶/, name: '牛奶', kcal: 120, tags: ['含钙食物'] },
    { pattern: /菠菜/, name: '菠菜', kcal: 50, tags: ['含铁食物'] },
    { pattern: /冰淇淋|雪糕/, name: '冰淇淋', kcal: 280, tags: ['冷饮冰品', '甜食高糖'] },
    { pattern: /沙拉/, name: '蔬菜沙拉', kcal: 180 },
    { pattern: /汉堡/, name: '牛肉汉堡', kcal: 650 },
    { pattern: /薯条/, name: '薯条', kcal: 380 },
  ];
  
  const recognized = [];
  const tags = new Set();
  
  foodPatterns.forEach(fp => {
    if(fp.pattern.test(photoDescription)){
      recognized.push({
        name: fp.name,
        kcal: fp.kcal,
        matched: true,
      });
      (fp.tags || []).forEach(t => tags.add(t));
    }
  });
  
  if(recognized.length === 0){
    return { matchStatus: 'fail', foods: [], items: [], totalKcal: null, foodTags: [] };
  }
  
  const totalKcal = recognized.reduce((sum, r) => sum + r.kcal, 0);
  const foods = recognized.map(r => r.name.replace(/（.*）/, ''));
  
  return {
    matchStatus: 'all',
    foods,
    items: recognized,
    totalKcal,
    foodTags: Array.from(tags),
  };
}

// 导出到全局
Object.assign(window, {
  DietFeedbackCard,
  DietPhotoFeedbackCard,
  DietTextFeedbackCard,
  DietFoodResultSummary,
  DietAiInsightsShell,
  DietAiCollapsibleSection,
  DietCalorieAiBody,
  DietAiChevron,
  DietTrendChart,
  DietSecA,
  DietSecB,
  DietSecC,
  DietSecD,
  DietSecE,
  DietSecF,
  createDietFeedbackDemo,
  createDietFeedbackEntry,
  simulateDietRecognition,
  getCalorieInterpretation,
  getMealCalorieInsight,
  getCycleDietTipDisplay,
  getCycleInsight,
});
