// ---------- Keyword dictionary (unchanged) ----------
const KEYWORDS = [
  { match:['月经','姨妈','大姨妈','来了','来例假','MC'], label:'月经开始', kind:'period',
    analysis:{ tone:'brand', title:'已标记本次经期开始',
      points:[
        {icon:'🩸', text:'今天为本次经期的第 1 天，已更新周期数据。'},
        {icon:'☕', text:'今天少喝凉的、辛辣，多喝温水。'},
      ]} },
  { match:['痛','肚子疼','腹痛','痛经','疼'], label:'痛经', kind:'pain',
    analysis:{ tone:'warn', title:'痛经记录已提醒',
      points:[
        {icon:'⚠️', text:'上周期同期没有痛经记录，这次需要留意。'},
        {icon:'💡', text:'热敷下腹 15 分钟，可有效缓解。'},
      ]} },
  { match:['量多','量大','换了','漏','满了'], label:'经量偏多', kind:'flow',
    analysis:{ tone:'warn', title:'经量偏多',
      points:[
        {icon:'📊', text:'第 2-3 天量多比较常见，会持续追踪。'},
        {icon:'🥬', text:'建议补充含铁食物（菠菜、红肉、动物肝脏）。'},
      ]} },
  { match:['量少','少','点点'], label:'经量偏少', kind:'flow-low',
    analysis:{ tone:'good', title:'经期接近尾声',
      points:[
        {icon:'✓', text:'经量减少属于正常的经期收尾。'},
        {icon:'🏃', text:'明天可恢复轻度运动。'},
      ]} },
  { match:['睡','失眠','没睡','醒','困'], label:'睡眠', kind:'sleep',
    analysis:{ tone:'good', title:'睡眠波动属于周期反应',
      points:[
        {icon:'🌙', text:'近 3 个周期，你在经期前 2 天都记录了睡眠变差。'},
        {icon:'🌿', text:'激素波动期间，可早 30 分钟入睡缓解。'},
      ]} },
  { match:['情绪','烦','焦虑','哭','难过','心情','低落'], label:'情绪低落', kind:'mood',
    analysis:{ tone:'good', title:'情绪波动是正常的周期反应',
      points:[
        {icon:'💛', text:'激素波动期间情绪起伏很正常。'},
        {icon:'☁️', text:'今晚可以早一点睡，给自己一点温柔。'},
      ]} },
  { match:['累','疲惫','乏力','没力气'], label:'疲劳', kind:'fatigue',
    analysis:{ tone:'good', title:'经期能量消耗较大',
      points:[
        {icon:'🛌', text:'今天的运动可以减半。'},
        {icon:'🍯', text:'适量补充碳水可缓解疲劳。'},
      ]} },
  { match:['布洛芬','止痛药','吃药'], label:'用药', kind:'med',
    analysis:{ tone:'warn', title:'已记录用药',
      points:[
        {icon:'💊', text:'本周期第 1 次服止痛药，比上次提前 1 天。'},
        {icon:'📋', text:'连续 2 周期后会汇总给你看。'},
      ]} },
];

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

// ---------- Timeline events ----------
// type: 'phase' | 'entry' | 'gap' | 'cycle-report' | 'guide'
// Today is 5/19, period D3, cycle started 5/17
const TIMELINE = [
  // today
  { type:'day', id:'d-5-19', date:'5/19', weekday:'周一', isToday:true },
  { type:'guide' },

  // 5/18
  { type:'day', id:'d-5-18', date:'5/18', weekday:'周日' },
  { type:'entry', id:'e-5-18-1', time:'21:30',
    title:'肚子疼到不行', emoji:'😣',
    body:'下午开会的时候肚子突然很疼，吃了颗布洛芬才扛过去。量挺多的，换了三次。',
    tags:[{label:'痛经·重度',auto:true},{label:'布洛芬',auto:true},{label:'经量多',auto:true}],
    analysis:{ tone:'warn', title:'痛经有加重趋势',
      points:[
        {icon:'⚠️', text:'已连续 2 个周期第 2 天最痛，这次比上周期提前 1 天用药。'},
        {icon:'💡', text:'建议连续记录 3 个周期后做一次健康分析。'},
      ]},
  },
  { type:'entry', id:'e-5-18-2', time:'08:12',
    body:'昨晚又没睡好，半夜醒了两次。',
    voice:{duration:'0:12'},
    tags:[{label:'睡眠差',auto:true},{label:'夜醒 2 次',auto:true}],
    analysis:{ tone:'good', title:'睡眠波动符合周期规律',
      points:[
        {icon:'🌙', text:'过去 3 个周期，你在经期前 2 天都记录了睡眠变差。'},
        {icon:'🌿', text:'可能与激素波动相关，无需担心。'},
      ]},
  },

  // 5/17 — period started
  { type:'phase', phase:'period', label:'本次经期开始 · D1' },
  { type:'day', id:'d-5-17', date:'5/17', weekday:'周六' },
  { type:'entry', id:'e-5-17-1', time:'14:20',
    body:'来啦～ 肚子隐隐有点不舒服，但还行。',
    photo:'rose',
    tags:[{label:'经期开始',auto:true},{label:'轻微不适',auto:true}],
    analysis:{ tone:'good', title:'开始状态平稳',
      points:[
        {icon:'✓', text:'第 1 天轻微不适，与过去 5 个周期一致。'},
      ]},
  },

  // gap into luteal phase
  { type:'gap', days:3 },
  { type:'phase', phase:'lut', label:'黄体期 · 5/3 - 5/16' },

  { type:'day', id:'d-5-13', date:'5/13', weekday:'周二', dim:true },
  { type:'entry', id:'e-5-13-1', time:'20:45',
    body:'吃完火锅拉肚子了，不知道跟快来月经有没有关系。',
    tags:[{label:'辛辣',auto:false},{label:'腹泻',auto:true}],
    analysis:{ tone:'good', title:'经前腹泻是常见反应',
      points:[
        {icon:'📅', text:'上个周期经前 3 天也有类似记录。'},
        {icon:'🔬', text:'与前列腺素升高有关，无需担心。'},
      ]},
  },

  { type:'gap', days:5 },
  { type:'phase', phase:'ov', label:'排卵日 · 5/3' },

  { type:'day', id:'d-5-08', date:'5/8', weekday:'周四', dim:true },
  { type:'entry', id:'e-5-08-1', time:'19:20',
    body:'最近皮肤状态巨好，痘痘全消了。',
    tags:[{label:'皮肤变好',auto:true}],
  },

  // previous cycle boundary
  { type:'phase', phase:'foll', label:'卵泡期 · 4/22 - 5/2' },
  { type:'cycle-report', tone:'good',
    title:'4 月周期 · 整体正常', range:'4/22 - 5/16 · 25 天',
    stats:[
      {num:'25', lbl:'周期天数'},
      {num:'5', lbl:'经期'},
      {num:'×1', lbl:'痛经'},
    ],
    summary:'与过去 6 个周期相比规律性持续改善。痛经次数较 3 月减少。',
  },

  // dim past entries
  { type:'gap', days:14 },
  { type:'day', id:'d-4-22', date:'4/22', weekday:'周二', dim:true, dateTag:'上次经期开始' },
  { type:'entry', id:'e-4-22-1', time:'09:30',
    body:'这次经期来了，量正常。',
    tags:[{label:'经期开始',auto:true}],
  },

  { type:'cycle-report', tone:'warn',
    title:'3 月周期 · 轻微波动', range:'3/25 - 4/21 · 28 天',
    stats:[
      {num:'28', lbl:'周期天数'},
      {num:'7', lbl:'经期', tone:'warn'},
      {num:'×2', lbl:'痛经', tone:'warn'},
    ],
    summary:'经期延长 2 天，经量偏多。痛经记录 2 次，建议持续追踪。',
  },
];

window.KEYWORDS = KEYWORDS;
window.extractKeywords = extractKeywords;
window.chooseAnalysis = chooseAnalysis;
window.TIMELINE = TIMELINE;
