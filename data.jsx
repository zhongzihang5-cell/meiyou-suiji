// ---------- Keyword dictionary ----------
const KEYWORDS = [
  { match:['月经','姨妈','大姨妈','来了','来例假','MC'], label:'月经', kind:'period', syncLabel:'月经',
    analysis:{ tone:'brand', title:'已标记本次经期开始',
      points:[
        {icon:'🩸', text:'今天为本次经期的第 1 天，已更新周期数据。'},
        {icon:'☕', text:'今天少喝凉的、辛辣，多喝温水。'},
      ]} },
  { match:['痛','肚子疼','腹痛','痛经','疼','不舒服'], label:'痛经', kind:'pain', syncLabel:'痛经',
    analysis:{ tone:'warn', title:'痛经记录已提醒',
      points:[
        {icon:'⚠️', text:'上周期同期没有痛经记录，这次需要留意。'},
        {icon:'💡', text:'热敷下腹 15 分钟，可有效缓解。'},
      ]} },
  { match:['量多','量大','换了','漏','满了'], label:'经量偏多', kind:'flow', syncLabel:'经量',
    analysis:{ tone:'warn', title:'经量偏多',
      points:[
        {icon:'📊', text:'第 2-3 天量多比较常见，会持续追踪。'},
        {icon:'🥬', text:'建议补充含铁食物（菠菜、红肉、动物肝脏）。'},
      ]} },
  { match:['量少','少','点点'], label:'经量偏少', kind:'flow-low', syncLabel:'经量',
    analysis:{ tone:'good', title:'经期接近尾声',
      points:[
        {icon:'✓', text:'经量减少属于正常的经期收尾。'},
        {icon:'🏃', text:'明天可恢复轻度运动。'},
      ]} },
  { match:['睡','失眠','没睡','醒','困','累','疲惫','乏力','没力气'], label:'睡眠', kind:'sleep', syncLabel:'睡眠',
    analysis:{ tone:'good', title:'睡眠波动属于周期反应',
      points:[
        {icon:'🌙', text:'近 3 个周期，你在经期前 2 天都记录了睡眠变差。'},
        {icon:'🌿', text:'激素波动期间，可早 30 分钟入睡缓解。'},
      ]} },
  { match:['情绪','烦','焦虑','哭','难过','心情','低落','开心','高兴'], label:'心情', kind:'mood', syncLabel:'心情',
    analysis:{ tone:'good', title:'情绪波动是正常的周期反应',
      points:[
        {icon:'💛', text:'激素波动期间情绪起伏很正常。'},
        {icon:'☁️', text:'今晚可以早一点睡，给自己一点温柔。'},
      ]} },
  { match:['布洛芬','止痛药','吃药'], label:'用药', kind:'med', syncLabel:'用药',
    analysis:{ tone:'warn', title:'已记录用药',
      points:[
        {icon:'💊', text:'本周期第 1 次服止痛药，比上次提前 1 天。'},
        {icon:'📋', text:'连续 2 周期后会汇总给你看。'},
      ]} },
  { match:['体重','称重','kg','公斤','斤'], label:'体重', kind:'weight', syncLabel:'体重',
    analysis:{ tone:'good', title:'已记录体重',
      points:[{icon:'⚖️', text:'会纳入本周体重趋势分析。'}]} },
  { match:['卡路里','热量','kcal','吃了','午餐','晚餐','早餐','沙拉','鸡胸'], label:'饮食', kind:'food', syncLabel:'卡路里',
    analysis:{ tone:'good', title:'饮食记录',
      points:[{icon:'🍽️', text:'AI 正在估算热量与营养结构。'}]} },
];

// 内容类型 — 日记 / 心事 / 情绪 / 身体 / 人际（非社交标签）
const CONTENT_TYPES = [
  { match:['日记','今天想','记录一下','写下','备忘'], label:'日记', emoji:'📔', kind:'diary' },
  { match:['心事','心里','纠结','委屈','说不出口','想念','多想','放不下'], label:'心事', emoji:'💭', kind:'heart' },
  { match:['朋友','老公','男友','女朋友','爸妈','同事','吵架','婆婆','关系'], label:'人际', emoji:'🤝', kind:'relation' },
  { match:['烦','焦虑','低落','开心','哭','情绪','心情'], label:'情绪', emoji:'💛', kind:'emotion' },
  { match:['肚子','头','腰','皮肤','睡','疼','累','身体','经'], label:'身体', emoji:'🌿', kind:'body' },
];

function extractContentTypes(text){
  const hits = []; const seen = new Set();
  for(const c of CONTENT_TYPES){
    for(const m of c.match){
      if(new RegExp(m,'i').test(text) && !seen.has(c.kind)){
        hits.push(c); seen.add(c.kind); break;
      }
    }
  }
  return hits;
}

function extractKeywords(text){
  const hits = []; const seen = new Set();
  for(const k of KEYWORDS){
    for(const m of k.match){
      const re = new RegExp(m,'i');
      if(re.test(text) && !seen.has(k.kind)){
        hits.push(k); seen.add(k.kind); break;
      }
    }
  }
  return hits;
}
function chooseAnalysis(hits){
  if(!hits.length) return null;
  const warn = hits.find(h=>h.analysis.tone==='warn');
  return (warn||hits[0]).analysis;
}

function buildSyncDisplayLabel(hit, text){
  if(hit.kind==='period' && /来了|来例假|来姨妈|大姨妈来/.test(text)) return '月经来了';
  if(hit.kind==='period') return '经期开始';
  return hit.syncLabel || hit.label;
}

function pickFollowUp(hits, ctx){
  const kinds = new Set(hits.map(h=>h.kind));
  if(kinds.has('period') && kinds.has('pain')){
    return {
      text:'今天还疼吗？量怎么样？',
      chips:['好多了','还是有点疼','量挺多的'],
    };
  }
  if(kinds.has('period')){
    return {
      text:'量怎么样？有没有哪里不舒服？',
      chips:['量正常','有点疼','量挺多'],
    };
  }
  if(kinds.has('pain')){
    return {
      text:'是隐隐作痛，还是阵发性疼？',
      chips:['隐隐的','比较疼','吃了止痛药'],
    };
  }
  if(kinds.has('sleep')){
    return {
      text:'是入睡难，还是容易醒？',
      chips:['入睡难','容易醒','睡够了但累'],
    };
  }
  return { text: ctx.followUp, chips: ctx.chips.slice(0, 3) };
}

const WEEKDAY_ZH = ['周日','周一','周二','周三','周四','周五','周六'];

function formatTodayDateLabel(d = new Date()){
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function buildTodayDayBlock(ctx){
  const scene = ctx || SCENE_CONTEXT.period;
  const cycle = scene.cycle || {};
  const d = new Date();
  const phaseTag = cycle.label && cycle.sub
    ? `${cycle.label}${cycle.sub}`
    : (cycle.label || '');
  return {
    type:'day',
    id:'d-today',
    date: formatTodayDateLabel(d),
    weekday: WEEKDAY_ZH[d.getDay()],
    isToday: true,
    phaseTag,
    phaseKind: cycle.kind || 'period',
    cycleDay: parseInt(String(cycle.dayNum || '').replace(/\D/g, ''), 10) || 1,
    items: [],
  };
}

function buildT5TagsFromText(text, hits){
  const tags = [];
  const seen = new Set();

  const push = (label, cat, key)=>{
    const k = key || `${cat}:${label}`;
    if(seen.has(k)) return;
    seen.add(k);
    tags.push({ label, cat });
  };

  hits.forEach(h=>{
    if(seen.has(h.kind)) return;
    seen.add(h.kind);
    if(h.kind === 'period'){
      push(buildSyncDisplayLabel(h, text), 'period', 'period');
    } else if(h.kind === 'pain'){
      push('痛经', 'symptom', 'pain');
    } else if(h.kind === 'flow'){
      push('经量 偏多', 'flow', 'flow');
    } else if(h.kind === 'flow-low'){
      push('经量 偏少', 'flow', 'flow-low');
    } else if(h.kind === 'sleep'){
      push(/没睡|失眠|醒|偏少/.test(text) ? '睡眠偏少' : '睡眠', 'sleep', 'sleep');
    } else if(h.kind === 'mood'){
      push(/低落|烦|焦虑|难过|哭/.test(text) ? '心情 低落' : '心情 平静', 'mood', 'mood');
    } else if(h.kind === 'med'){
      push('用药', 'symptom', 'med');
    } else if(h.kind === 'weight'){
      push('体重', 'weight', 'weight');
    } else if(h.kind === 'food'){
      push('饮食', 'diet', 'food');
    }
  });

  if(/腹胀|肚子胀/.test(text)) push('腹胀', 'symptom', 'bloat');
  if(/腰酸|腰痛/.test(text)) push('腰酸', 'symptom', 'back');
  if(/累|疲惫|乏力|没力气/.test(text) && !seen.has('sleep')) push('疲惫', 'symptom', 'tired');
  if(/跑步|跑了|三公里|公里/.test(text)) push('跑步', 'fitness', 'run');
  if(/三明治|午饭|午餐|晚餐|早餐|吃了/.test(text) && !seen.has('food')) push('饮食', 'diet', 'food-extra');
  if(/愉快|开心|高兴/.test(text) && !seen.has('mood')) push('心情 愉快', 'mood', 'mood-extra');

  return tags;
}

function getTimelineEmpty(ctx){
  return [buildTodayDayBlock(ctx || SCENE_CONTEXT.period)];
}

const BABY_DEMO_RECORDS = {
  formula:{recordType:'formula', feedType:'配方奶', color:'#FF7A66', icon:'🍼', iconSrc:'assets/baby-feeding-icons/formula.png'},
  breast:{recordType:'breast', feedType:'母乳', color:'#FF8EB8', icon:'🤱', iconSrc:'assets/baby-feeding-icons/breast.png'},
  sleep:{recordType:'sleep', feedType:'睡眠', color:'#8E7BD9', icon:'🌙', iconSrc:'assets/baby-feeding-icons/sleep.png'},
  diaper:{recordType:'diaper', feedType:'换尿布', color:'#E8A23D', icon:'🧷', iconSrc:'assets/baby-feeding-icons/diaper.png'},
  bottle:{recordType:'bottle-breast', feedType:'瓶喂母乳', color:'#FF8EB8', icon:'🍼', iconSrc:'assets/baby-feeding-icons/bottle-breast.png'},
  solid:{recordType:'solid-food', feedType:'辅食', color:'#F2A65A', icon:'🥣', iconSrc:'assets/baby-feeding-icons/solid-food.png'},
  water:{recordType:'water', feedType:'喝水', color:'#5B8DEF', icon:'💧', iconSrc:'assets/baby-feeding-icons/water.png'},
  bath:{recordType:'bath', feedType:'洗澡', color:'#5FCAD1', icon:'🛁', iconSrc:'assets/baby-feeding-icons/bath.png'},
  play:{recordType:'play', feedType:'玩耍', color:'#F4B45F', icon:'🧸', iconSrc:'assets/baby-feeding-icons/play.png'},
  nutrition:{recordType:'nutrition', feedType:'营养补剂', color:'#3CB88C', icon:'💊', iconSrc:'assets/baby-feeding-icons/nutrition.png'},
};

function buildBabyDemoCard(dayOffset, index, spec){
  const [time, type, value, note, durationMinutes, babyName] = spec;
  const base = BABY_DEMO_RECORDS[type];
  const text = `${base.feedType}：${value}`;
  const card = {
    kind:'baby-feeding-card',
    id:`baby-demo-${dayOffset}-${index}`,
    time,
    ...base,
    value,
    text,
    railDot:'baby',
    creator:'妈妈',
    creatorId:'self',
    isOwnRecord:true,
    showCreator:false,
    showBabyTag:true,
    babyName:babyName || '小豆苗',
  };
  if(note) card.noteText = note;
  if(durationMinutes) card.statDurationMinutes = durationMinutes;
  if(type === 'breast'){
    const right = Math.max(1, Math.floor(durationMinutes / 2));
    const left = Math.max(1, durationMinutes - right);
    card.leftMinutes = left;
    card.rightMinutes = right;
    card.detailLines = [`母乳：左${left}分钟，右${right}分钟`];
  }
  if(['sleep','bath','play'].includes(type)) card.detailLines = [`${base.feedType}：${value}`];
  return card;
}

function buildBabyDemoDay(dayOffset, specs){
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - dayOffset);
  return {
    type:'day',
    id:dayOffset === 0 ? 'd-today-baby-demo' : `d-baby-demo-minus-${dayOffset}`,
    date:formatTodayDateLabel(date),
    weekday:WEEKDAY_ZH[date.getDay()],
    isToday:dayOffset === 0,
    relativeLabel:dayOffset === 1 ? '昨天' : undefined,
    relativeDaysAgo:dayOffset,
    items:specs.map((spec, index)=>buildBabyDemoCard(dayOffset, index, spec)),
  };
}

function buildBabyDemoDays(){
  return [
    buildBabyDemoDay(3, [
      ['01:40','sleep','3小时10分钟','夜里睡得很安稳',190],
      ['05:10','formula','120ml','一口气喝完了'],
      ['06:20','breast','16分钟','小豆芽清晨母乳，左8分钟，右8分钟',16,'小豆芽'],
      ['07:35','diaper','臭臭 黄色、膏状','晨起换尿布'],
      ['09:20','breast','18分钟','吃完很满足',18],
      ['11:30','water','50ml','上午喝水'],
      ['13:05','solid','米粉，菠菜，20g','第一次尝试菠菜米粉'],
      ['15:25','diaper','嘘嘘','尿量正常'],
      ['17:40','formula','140ml','傍晚奶量不错'],
      ['18:50','diaper','嘘嘘','小豆芽傍晚换尿布',undefined,'小豆芽'],
      ['20:10','bath','13分钟','洗完澡很开心',13],
      ['21:35','sleep','8小时05分钟','夜间长睡眠',485],
    ]),
    buildBabyDemoDay(2, [
      ['02:05','breast','20分钟','夜奶后很快睡着',20],
      ['05:30','formula','130ml','清晨奶'],
      ['06:40','formula','110ml','小豆芽清晨配方奶',undefined,'小豆芽'],
      ['07:50','diaper','臭臭 墨绿色、膏状','便便状态正常'],
      ['09:40','sleep','1小时25分钟','上午小睡',85],
      ['11:35','bottle','90ml','瓶喂母乳'],
      ['13:15','solid','米粉，南瓜，25g','南瓜米粉吃得不错'],
      ['15:10','water','60ml','午后补水'],
      ['17:25','diaper','嘘嘘','换了1片尿布'],
      ['18:40','sleep','1小时10分钟','小豆芽傍晚小睡',70,'小豆芽'],
      ['20:00','formula','150ml','睡前奶'],
      ['21:20','play','30分钟','和妈妈一起玩积木',30],
    ]),
    buildBabyDemoDay(1, [
      ['01:55','sleep','3小时20分钟','后半夜睡眠',200],
      ['05:25','formula','135ml','清晨喝奶'],
      ['06:30','breast','18分钟','小豆芽清晨母乳，左9分钟，右9分钟',18,'小豆芽'],
      ['07:40','diaper','臭臭 黄绿色、软便','晨起便便'],
      ['09:35','breast','22分钟','左右两侧都吃了',22],
      ['11:50','solid','米粉，香蕉，30g','香蕉米粉'],
      ['14:10','sleep','1小时40分钟','午睡',100],
      ['16:20','water','50ml','睡醒后喝水'],
      ['17:10','solid','米粉，南瓜，20g','小豆芽吃了南瓜米粉',undefined,'小豆芽'],
      ['18:15','diaper','嘘嘘','傍晚换尿布'],
      ['20:30','formula','150ml','睡前喝得很好'],
      ['21:45','nutrition','维生素D3，50mg','今日营养补剂'],
    ]),
    buildBabyDemoDay(0, [
      ['02:00','breast','20分钟','凌晨母乳，左10分钟，右10分钟',20],
      ['03:00','breast','16分钟','小豆芽凌晨母乳，左8分钟，右8分钟',16,'小豆芽'],
      ['05:00','formula','130ml','凌晨5点喝了130毫升配方奶'],
      ['06:00','formula','110ml','小豆芽早上6点喝了110毫升配方奶',undefined,'小豆芽'],
    ]),
  ];
}

// ---------- Scene context ----------
const SCENE_CONTEXT = {
  period: {
    weather:{ icon:'☁️', text:'多云 22°C', mood:'偏凉' },
    cycle:{ label:'经期', sub:'第 1 天', kind:'period', dayNum:'D1' },
    status:'good', healthTitle:'本次周期正常', healthDesc:'经量偏少，整体状态平稳',
    openPrompt:'早上好～今天身体怎么样？昨晚睡得好吗？',
    followUp:'是身体感受，还是饮食或睡眠？',
    chips:['身体还好','有点不舒服','睡得很好','没睡好'],
  },
  follicular: {
    weather:{ icon:'🌤', text:'晴 26°C', mood:'舒适' },
    cycle:{ label:'卵泡期', sub:'距经期约 16 天', kind:'foll', dayNum:'D9' },
    status:'good', healthTitle:'卵泡期 · 状态良好', healthDesc:'精力通常较充沛',
    openPrompt:'今天天气不错，处于卵泡期。今天状态怎么样？',
    followUp:'有什么想随手记下来的吗？',
    chips:['状态不错','写点日记','有点心事','想运动'],
  },
  pregnancy: {
    weather:{ icon:'🌧', text:'小雨 20°C', mood:'潮湿' },
    cycle:{ label:'孕 24 周', sub:'孕中期', kind:'preg', dayNum:'W24' },
    status:'good', healthTitle:'孕况正常', healthDesc:'本周产检指标良好',
    openPrompt:'今天小雨，孕 24 周。宝宝或身体有什么变化？',
    followUp:'是身体不舒服，还是情绪上需要说说？',
    chips:['胎动正常','有点腰酸','睡不太好','胃口不错'],
  },
  parenting: {
    weather:{ icon:'☀️', text:'晴 28°C', mood:'炎热' },
    cycle:{ label:'宝宝 8 月', sub:'育儿期', kind:'baby', dayNum:'M8' },
    status:'good', healthTitle:'发育正常', healthDesc:'近 7 天喂养规律',
    openPrompt:'今天晴热，宝宝 8 个月了。想记录点什么？',
    followUp:'是关于宝宝，还是你也需要被关心一下？',
    chips:['喂养正常','睡眠倒退','拉了两次','今天很开心'],
  },
};

// ---------- 场景时间轴 — V3v2 日章节 Demo（1:1 record-tab-v3plus） ----------
const TIMELINE_BLOCKS = [
  { type:'gap', id:'gap-top' },
  {
    type:'day', id:'d-4-28', date:'4/28', weekday:'周一',
    items:[
      {
        kind:'record-group', id:'e-428-w-g',
        primary:{
          id:'e-428-w', time:'08:20', kind:'weight',
          text:'',
          weightLabel:'体重',
          weightValue:'53.6公斤',
          tags:[],
        },
      },
    ],
  },
  {
    type:'day', id:'d-5-13', date:'5/13', weekday:'周二',
    items:[
      {
        kind:'record-group', id:'e-513-sleep-g',
        primary:{
          id:'e-513-sleep', time:'23:20', kind:'text',
          text:'昨晚翻来覆去到一点才睡着，今天起来还是有点昏。',
          tags:[{ cat:'症状', icon:'sym' }],
        },
      },
      {
        kind:'record-group', id:'e-513-w-g',
        primary:{
          id:'e-513-w', time:'07:10', kind:'weight',
          text:'',
          weightLabel:'体重',
          weightValue:'53.1公斤',
          tags:[],
        },
      },
    ],
  },
  {
    type:'day', id:'d-5-14', date:'5/14', weekday:'周四',
    items:[
      {
        kind:'record-group', id:'e-514-1-g',
        primary:{
          id:'e-514-1', time:'07:45', kind:'text',
          text:'今天状态不错，去跑了三公里，出汗之后心情也好了很多。',
          tags:[
            { cat:'运动', icon:'run' },
            { cat:'心情', icon:'mood' },
          ],
        },
      },
      {
        kind:'record-group', id:'e-514-diet-g',
        primary:{
          id:'e-514-diet', time:'12:30', kind:'text',
          text:'午饭吃了鸡胸肉沙拉，没喝咖啡。',
          tags:[
            { cat:'饮食', icon:'food' },
          ],
        },
      },
      {
        kind:'record-group', id:'t5-g-514',
        primary:{
          id:'t5', time:'09:30', kind:'weight',
          text:'',
          weightLabel:'体重',
          weightValue:'52.3公斤',
          tags:[],
        },
        ai:{
          id:'t6', time:'09:31', kind:'chart', chartType:'weightTrend',
          title:'近7天体重变化',
          weightUnit:'kg',
          noteParts:{
            prefix:'比昨天 ',
            delta:'-0.5 公斤',
            emphasize:true,
            tail:'，下降属正常波动，黄体期受孕激素影响身体容易潴留水分。',
          },
          chartData:[
            { d:'周六', v:52.8 },
            { d:'周日', v:52.0 },
            { d:'周一', v:52.2 },
            { d:'周二', v:52.5 },
            { d:'周三', v:53.4 },
            { d:'周四', v:52.8 },
            { d:'今天', v:52.3, isToday:true },
          ],
        },
        aiDefaultOpen:true,
      },
    ],
  },
  {
    type:'day', id:'d-5-15', date:'5/15', weekday:'周五',
    items:[
      {
        kind:'record-group', id:'y1-g',
        primary:{
          id:'y1', time:'21:10', kind:'voice',
          duration:'0:08',
          text:'晚饭吃了沙拉，喝了两杯水',
          tags:[
            { cat:'饮食', icon:'food' },
            { cat:'喝水', icon:'water' },
          ],
        },
      },
      {
        kind:'record-group', id:'e-519-podcast-g',
        primary:{
          id:'e-519-podcast', time:'21:20', kind:'text',
          text:'晚上听了会儿播客，整个人慢下来不少，打算十一点前睡。',
          tags:[],
        },
      },
    ],
  },
  {
    type:'day', id:'d-5-16', date:'5/16', weekday:'周六',
    items:[
      {
        kind:'record-group', id:'t3-g',
        primary:{
          id:'t3', time:'12:05', kind:'image', label:'午餐',
          useRealImage:true,
          photo:{ src:'assets/meal-519.png', alt:'午餐记录' },
          text:'香煎鸡胸肉 100g；炒土豆丝 1 盘；炒青菜 1 盘；杂粮饭 1 碗',
          totalKcal:766,
        },
        ai:{
          id:'t4', time:'12:06', kind:'chart', chartType:'caloriePanel',
          title:'今日卡路里摄入量', note:'日目标 1800 · 已摄入 1126',
        },
        aiDefaultOpen:true,
      },
      {
        kind:'record-group', id:'t1-g',
        primary:{
          id:'t1', time:'14:23', kind:'voice',
          duration:'0:18',
          text:'今天有点累，肚子也有点胀，午饭吃了三明治和拿铁，下午还一直有点犯困。',
          tags:[
            { cat:'症状', icon:'sym' },
            { cat:'饮食', icon:'food' },
          ],
        },
      },
    ],
  },
  ...buildBabyDemoDays(),
];

// 场景二：新用户空值 — 运行时生成「今天」分日（与场景一时间轴头一致）
const TIMELINE_EMPTY = getTimelineEmpty();

// 旧场景二数据（含历史时间轴，保留供参考）
const TIMELINE_RECORD_DIRECT = TIMELINE_BLOCKS.filter(
  (b) => b.type !== 'day' || b.id !== 'd-5-18',
);

// Legacy daily cards (kept for reference)
const DAILY_CARDS = [
  {
    id:'d-5-19', date:'19', month:'5月', weekday:'周一', isToday:true,
    weather:'☁️ 22°', phase:'经期 D3', phaseKind:'period',
    summary:'量比昨天少了一些，整体感觉还行。',
    tags:['经量偏少','状态平稳'], entryCount:1, hasPhoto:false,
    insight:'经量减少符合本周期趋势',
    gradient:'linear-gradient(135deg, rgba(255,77,136,0.12) 0%, rgba(255,255,255,0.95) 60%)',
  },
  {
    id:'d-5-18', date:'18', month:'5月', weekday:'周日',
    weather:'🌧 19°', phase:'经期 D2', phaseKind:'period',
    summary:'下午开会时肚子突然很疼，吃了布洛芬。量挺多，换了三次。',
    tags:['痛经·重度','用药','经量多'], entryCount:2, hasPhoto:false,
    insight:'已连续 2 个周期第 2 天最痛',
    gradient:'linear-gradient(135deg, rgba(255,149,0,0.10) 0%, rgba(255,255,255,0.95) 60%)',
  },
  {
    id:'d-5-17', date:'17', month:'5月', weekday:'周六',
    weather:'☀️ 24°', phase:'经期 D1', phaseKind:'period',
    summary:'来啦～ 肚子隐隐有点不舒服，但还行。',
    tags:['经期开始','轻微不适'], entryCount:1, hasPhoto:true,
    insight:'开始状态平稳，与过去 5 个周期一致',
    gradient:'linear-gradient(135deg, rgba(0,204,153,0.10) 0%, rgba(255,255,255,0.95) 60%)',
  },
  {
    id:'d-5-13', date:'13', month:'5月', weekday:'周二',
    weather:'☁️ 21°', phase:'黄体期', phaseKind:'lut',
    summary:'吃完火锅拉肚子了，不知道跟快来月经有没有关系。',
    tags:['辛辣','腹泻'], entryCount:1, hasPhoto:false,
    insight:'经前腹泻是常见反应',
    gradient:'linear-gradient(135deg, rgba(255,149,0,0.08) 0%, rgba(255,255,255,0.95) 60%)',
  },
  {
    id:'d-5-08', date:'8', month:'5月', weekday:'周四',
    weather:'🌤 25°', phase:'卵泡期', phaseKind:'foll',
    summary:'最近皮肤状态巨好，痘痘全消了。',
    tags:['皮肤变好'], entryCount:1, hasPhoto:true,
    insight:null,
    gradient:'linear-gradient(135deg, rgba(79,124,174,0.10) 0%, rgba(255,255,255,0.95) 60%)',
  },
  {
    id:'d-4-22', date:'22', month:'4月', weekday:'周二',
    weather:'☀️ 23°', phase:'经期 D1', phaseKind:'period',
    summary:'这次经期来了，量正常。',
    tags:['经期开始'], entryCount:1, hasPhoto:false,
    insight:null,
    gradient:'linear-gradient(135deg, rgba(255,77,136,0.08) 0%, rgba(255,255,255,0.95) 60%)',
  },
];

window.KEYWORDS = KEYWORDS;
window.extractKeywords = extractKeywords;
window.extractContentTypes = extractContentTypes;
window.CONTENT_TYPES = CONTENT_TYPES;
window.chooseAnalysis = chooseAnalysis;
window.buildSyncDisplayLabel = buildSyncDisplayLabel;
window.buildT5TagsFromText = buildT5TagsFromText;
window.buildTodayDayBlock = buildTodayDayBlock;
window.getTimelineEmpty = getTimelineEmpty;
window.formatTodayDateLabel = formatTodayDateLabel;
window.pickFollowUp = pickFollowUp;
window.SCENE_CONTEXT = SCENE_CONTEXT;
window.TIMELINE_BLOCKS = TIMELINE_BLOCKS;
window.TIMELINE_EMPTY = TIMELINE_EMPTY;
window.TIMELINE_RECORD_DIRECT = TIMELINE_RECORD_DIRECT;
window.DAILY_CARDS = DAILY_CARDS;
