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

// ---------- Scene context ----------
const SCENE_CONTEXT = {
  period: {
    weather:{ icon:'☁️', text:'多云 22°C', mood:'偏凉' },
    cycle:{ label:'经期', sub:'第 3 天', kind:'period', dayNum:'D3' },
    status:'good', healthTitle:'本次周期正常', healthDesc:'较上周期更规律',
    openPrompt:'今天阴天，经期第 3 天。此刻身体有什么感受？',
    followUp:'是身体累，还是心里也压着什么事？',
    chips:['身体还好','有点心事','昨天月经来了，肚子不舒服','睡不太好'],
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

// ---------- Timeline blocks (分日 + 单条记录) — 旧→新，越往下越近 ----------
const TIMELINE_BLOCKS = [
  {
    type:'cycle-sum', id:'cs-prev', tone:'warn',
    icon:'🟡',
    title:'上次周期总结 · 轻微波动',
    body:'周期 30 天，较前次延长 2 天。经期持续 6 天，经量偏多。痛经记录 2 次。建议关注趋势变化。',
    link:'查看完整分析 ›',
  },
  { type:'gap', id:'gap-2', label:'上个周期' },
  {
    type:'day', id:'d-5-08', date:'5/8', weekday:'周四',
    phaseTag:'卵泡期', phaseKind:'foll',
    entries:[
      {
        id:'e-508-1', time:'19:20',
        body:'今天心情不错，就是有点想偷懒，体重好像轻了一斤。',
        tags:[
          {emoji:'💛', label:'情绪', content:true},
          {emoji:'⚖️', label:'体重'},
        ],
      },
    ],
  },
  { type:'gap', id:'gap-1', label:'4 天前' },
  {
    type:'day', id:'d-5-13', date:'5/13', weekday:'周二',
    entries:[
      {
        id:'e-513-1', time:'20:45',
        body:'吃完火锅拉肚子了 😂 不知道跟快来月经有没有关系',
        tags:[
          {emoji:'🍽️', label:'辛辣'},
          {emoji:'🚽', label:'腹泻'},
        ],
      },
    ],
  },
  {
    type:'day', id:'d-5-17', date:'5/17', weekday:'周六',
    phaseTag:'经期第1天', phaseKind:'period',
    extras:[
      {
        type:'cycle-sum', id:'cs-517',
        icon:'🟢',
        title:'本次周期开始 · 整体正常',
        body:'周期 28 天，与上次持平。基于过去 6 个周期数据，周期规律性持续改善。',
        link:'查看完整分析 ›',
      },
    ],
    entries:[
      {
        id:'e-517-1', time:'14:20',
        body:'来啦～ 肚子隐隐有点不舒服但还行',
        tags:[
          {emoji:'🩸', label:'经期开始'},
          {emoji:'😖', label:'轻微不适'},
        ],
      },
    ],
  },
  {
    type:'day', id:'d-5-18', date:'5/18', weekday:'周日',
    phaseTag:'经期第2天', phaseKind:'period',
    entries:[
      {
        id:'e-518-2', time:'08:12',
        voice:{ duration:'0:18' },
        body:'昨晚又没睡好，半夜醒了两次，心里有点烦，翻来覆去的。',
        tags:[
          {emoji:'😴', label:'睡眠差'},
          {emoji:'💭', label:'心事', content:true},
        ],
      },
      {
        id:'e-518-1', time:'21:30',
        body:'下午开会的时候肚子突然很疼，吃了颗布洛芬才扛过去。量还挺多的，换了三次 😩',
        tags:[
          {emoji:'🌿', label:'身体', content:true},
          {emoji:'😖', label:'痛经·重度'},
          {emoji:'💊', label:'布洛芬'},
          {emoji:'🩸', label:'经量多'},
          {emoji:'⏰', label:'午后发作', ai:true},
        ],
        aiNote:{
          tone:'yellow', icon:'⚠️',
          text:'上个周期全程没有服药，这次第 2 天就需要止痛，痛经有加重趋势。已连续 2 个周期第 2 天最痛。',
        },
      },
      {
        id:'e-518-3', time:'22:40',
        body:'不知道为什么今天特别容易多想，躺在床上一直在想工作上的事，有点烦。',
        tags:[
          {emoji:'💭', label:'心事', content:true},
          {emoji:'💛', label:'情绪', content:true},
        ],
      },
    ],
  },
  {
    type:'day', id:'d-5-19', date:'5/19', weekday:'周一', isToday:true,
    phaseTag:'经期第3天', phaseKind:'period',
    entries:[],
  },
];

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
window.pickFollowUp = pickFollowUp;
window.SCENE_CONTEXT = SCENE_CONTEXT;
window.TIMELINE_BLOCKS = TIMELINE_BLOCKS;
window.DAILY_CARDS = DAILY_CARDS;
