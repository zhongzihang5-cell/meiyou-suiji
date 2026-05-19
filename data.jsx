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

// ---------- 场景时间轴 — 分日叙事 Demo ----------
// 经前记录在上，5/18 经期第 1 天为最底部最新记录（语音 + 周期分析 + 晚间记录）
const TIMELINE_BLOCKS = [
  { type:'gap', id:'gap-top', label:'上个周期 · 4/22 – 5/13' },
  {
    type:'day', id:'d-5-14', date:'5/14', weekday:'周三',
    phaseTag:'卵泡期第 8 天', phaseKind:'foll', cycleDay:22, cycleLen:28,
    items:[
      {
        kind:'rec', id:'e-514-1', time:'07:45',
        body:'今天状态不错，去跑了三公里，出汗之后心情也好了很多。',
        tags:[
          { label:'跑步', cat:'fitness' },
          { label:'心情 愉快', cat:'mood' },
        ],
      },
      {
        kind:'rec', id:'e-514-2', time:'21:20',
        body:'晚上听了会儿播客，整个人慢下来不少，打算十一点前睡。',
        tags:[
          { label:'心情 放松', cat:'mood' },
        ],
        aiNote:{
          tone:'green',
          icon:'💡',
          text:'卵泡期睡眠相对稳定时，第二天精力往往更好；你今晚准备早睡，是个不错的习惯。',
        },
      },
    ],
  },
  {
    type:'day', id:'d-5-15', date:'5/15', weekday:'周四',
    phaseTag:'黄体期第 8 天', phaseKind:'lut', cycleDay:27, cycleLen:28,
    items:[
      {
        kind:'rec', id:'e-515-2', time:'12:00',
        photo:{ src:'assets/meal-519.png', alt:'午餐记录' },
        tags:[{ label:'饮食', cat:'diet' }],
        aiNote:{
          tone:'green',
          items:[
            '香煎鸡胸肉 100g',
            '炒土豆丝 1 盘',
            '炒青菜 1 盘',
            '杂粮饭 1 碗',
          ],
          total:'总卡路里 766 kcal',
        },
      },
      {
        kind:'weekly', id:'w-515', time:'18:00',
        range:'5/9 – 5/15',
        overview:'本周心情整体平稳，经前一日略有低落。',
        panels:[
          {
            id:'mood', type:'mood', icon:'💜', title:'心情趋势',
            moodTrend:[
              {d:'一', v:3},{d:'二', v:4},{d:'三', v:3},
              {d:'四', v:2},{d:'五', v:3},{d:'六', v:3},{d:'日', v:3},
            ],
            summary:'本周心情整体平稳，经前一日（周四）略有低落，与经前激素变化一致。',
          },
          {
            id:'weight', type:'weight', icon:'⚖️', title:'体重变化',
            weightDelta:'↓ 0.4 kg',
            weightTrend:[
              {d:'一', v:52.9},{d:'二', v:52.8},{d:'三', v:52.7},
              {d:'四', v:52.6},{d:'五', v:52.5},{d:'六', v:52.4},{d:'日', v:52.4},
            ],
            summary:'体重较上周缓降 0.4kg，处于经前正常波动范围，无需过度关注。',
          },
          {
            id:'sleep', type:'sleep', icon:'😴', title:'睡眠时长',
            sleepTrend:[
              {d:'一', v:7.5},{d:'二', v:7.0},{d:'三', v:6.8},
              {d:'四', v:6.2},{d:'五', v:6.5},{d:'六', v:6.8},{d:'日', v:6.5},
            ],
            summary:'本周平均睡眠约 6.7 小时，经前一晚偏短，建议睡前减少屏幕时间。',
          },
        ],
      },
    ],
  },
  {
    type:'day', id:'d-5-17', date:'5/17', weekday:'周六',
    phaseTag:'黄体期第 9 天', phaseKind:'lut', cycleDay:28, cycleLen:28,
    items:[
      {
        kind:'rec', id:'e-517-w', time:'08:00',
        voice:{ duration:'0:35' },
        body:'早上称了一下 52.4，比昨天轻了一点。昨晚睡得不太好，大概六个半钟头吧。',
        tags:[
          { label:'体重', cat:'weight' },
          { label:'睡眠', cat:'sleep' },
        ],
      },
      {
        kind:'wellness', id:'t-517', time:'08:00',
        cardLabel:'体重 · 睡眠分析',
        cardLabelKind:'ai',
        overview:'体重略降、睡眠偏少，经前均属正常波动。',
        panels:[
          {
            id:'weight', type:'weight', icon:'⚖️', title:'体重变化',
            weightDelta:'↓ 0.1 kg',
            weightTrend:[
              {d:'一', v:52.9},{d:'二', v:52.8},{d:'三', v:52.7},
              {d:'四', v:52.6},{d:'五', v:52.5},{d:'六', v:52.4},
            ],
            summary:'较昨日略降 0.1kg，处于经前正常波动范围。',
          },
          {
            id:'sleep', type:'sleep', icon:'😴', title:'睡眠时长',
            sleepTrend:[
              {d:'一', v:7.5},{d:'二', v:7.0},{d:'三', v:6.8},
              {d:'四', v:6.2},{d:'五', v:6.5},{d:'六', v:6.5},
            ],
            summary:'昨晚约 6.5 小时，较前几日偏短。',
          },
        ],
      },
    ],
  },
  {
    type:'day', id:'d-5-18', date:'5/18', weekday:'周日', isToday:true,
    phaseTag:'经期第 1 天', phaseKind:'period', cycleDay:1, periodLen:5,
    items:[
      {
        kind:'voice-card', id:'e-518-1a', time:'16:00',
        voice:{ duration:'12"' },
        voiceText:'今天月经来了，量不算多，肚子有点闷闷的胀，腰也有点酸，心情还行就是有点懒得动。',
        tags:[
          { label:'月经来了', cat:'period' },
          { label:'经量 偏少', cat:'flow' },
          { label:'腹胀', cat:'symptom' },
          { label:'腰酸', cat:'symptom' },
          { label:'心情 平静', cat:'mood' },
        ],
      },
      {
        kind:'sister-card', id:'e-518-1b', time:'16:00', railDot:'ai',
      },
      {
        kind:'guide', id:'g-518-post', time:'16:05',
        hiddenUntilSisterDone:true,
        tone:'soft',
        text:'经期刚开始，肚子和腰有点不舒服很正常。今晚想怎么照顾自己？',
        chips:['热敷一下','早点休息','还行，不用特别做什么'],
      },
    ],
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
