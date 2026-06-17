// ============ 拍照饮食记录 · 饮食反馈卡片 + 等待态 ============

const GALLERY_FALLBACK_PHOTOS = [
  'assets/gallery/IMG_9140-a0794273-c982-414f-8516-52af2c4456e1.png',
  'assets/gallery/IMG_9145_2-72cf62bb-2ea4-45fa-977a-78f80ac3da58.png',
  'assets/gallery/IMG_9139-a36f2639-6b62-453c-bdc1-2d7cd67b4d28.png',
  'assets/gallery/IMG_9128-7218d6e2-498b-4980-8a99-218909c9881d.png',
];

const DIET_SCENARIOS = {
  lunch: {
    mealType: '午餐',
    totalKcal: 510,
    dailyTarget: 1800,
    dailyIntake: 1126,
    items: [
      { name: '香煎鸡胸肉', kcal: 165, portion: '100g' },
      { name: '炒土豆丝', kcal: 120, portion: '1 盘' },
      { name: '炒青菜', kcal: 80, portion: '1 盘' },
      { name: '杂粮饭', kcal: 145, portion: '1 碗' },
    ],
    weekData: [1420, null, 1680, null, 1250, 1560, null],
    daysWithRecord: 5,
    avgKcal: 1380,
  },
  breakfast: {
    mealType: '早餐',
    totalKcal: 350,
    dailyTarget: 1800,
    dailyIntake: 350,
    items: [
      { name: '全麦面包', kcal: 160 },
      { name: '煎蛋', kcal: 90 },
      { name: '牛奶', kcal: 100 },
    ],
    weekData: [null, 1350, null, null, 890, null, null],
    daysWithRecord: 3,
    avgKcal: null,
  },
  dinner: {
    mealType: '晚餐',
    totalKcal: 550,
    dailyTarget: 1800,
    dailyIntake: 1676,
    items: [
      { name: '清蒸鲈鱼', kcal: 180 },
      { name: '蒜蓉西兰花', kcal: 70 },
      { name: '番茄蛋汤', kcal: 60 },
      { name: '米饭', kcal: 240 },
    ],
    weekData: [1200, 980, null, 1450, 1100, 1320, null],
    daysWithRecord: 4,
    avgKcal: null,
  },
  combo2High: {
    mealType: '午餐',
    totalKcal: 820,
    dailyTarget: 1800,
    dailyIntake: 1120,
    items: [
      { name: '米饭', kcal: 240, portion: '1 碗' },
      { name: '红烧肉', kcal: 380 },
      { name: '炒青菜', kcal: 80, portion: '1 盘' },
      { name: '番茄蛋汤', kcal: 120, portion: '1 碗' },
    ],
    weekData: [1420, 1200, 1680, 1350, 1250, 1560, 1120],
    daysWithRecord: 7,
    avgKcal: 1380,
    foodTags: [],
  },
  comboAbfd: {
    mealType: '午餐',
    totalKcal: 680,
    dailyTarget: 1800,
    dailyIntake: 980,
    items: [
      { name: '米饭（一碗）', kcal: 230 },
      { name: '红烧肉', kcal: 350 },
      { name: '炒青菜', kcal: 100 },
    ],
    weekData: [1420, 1200, 1680, 1350, 1250, 1560, 980],
    daysWithRecord: 7,
    avgKcal: 1380,
    foodTags: [],
  },
  milkTea: {
    mealType: '下午茶',
    totalKcal: 520,
    dailyTarget: 1800,
    dailyIntake: 520,
    items: [
      { name: '珍珠奶茶（大杯）', kcal: 520 },
    ],
    weekData: [null, 1350, null, null, 890, null, null],
    daysWithRecord: 3,
    avgKcal: null,
    foodTags: ['甜食高糖'],
  },
  feastMeal: {
    mealType: '午餐',
    totalKcal: 850,
    dailyTarget: 1800,
    dailyIntake: 850,
    items: [
      { name: '米饭', kcal: 240, portion: '1 碗' },
      { name: '红烧肉', kcal: 380 },
      { name: '炒青菜', kcal: 80, portion: '1 盘' },
      { name: '番茄蛋汤', kcal: 150, portion: '1 碗' },
    ],
    weekData: [1200, 980, null, 1450, 1100, 1320, 850],
    daysWithRecord: 4,
    avgKcal: 1380,
    foodTags: [],
  },
  coldDrinkMeal: {
    mealType: '下午茶',
    totalKcal: 180,
    dailyTarget: 1800,
    dailyIntake: 680,
    items: [
      { name: '冰美式', kcal: 80 },
      { name: '冰淇淋', kcal: 100 },
    ],
    weekData: [1200, 980, null, 1450, 1100, 1320, 680],
    daysWithRecord: 4,
    avgKcal: 1380,
    foodTags: ['冷饮冰品'],
  },
};

const PHOTO_ANALYZE_LOADING_MS = 5000;
const DIET_RECOGNITION_MAX_FAILURES = 5;
const DIET_RECOGNITION_SCENARIO_KEY = 'my-demo-diet-recognition-scenario';

function getDietRecognitionMaxFailures(scenario) {
  return DIET_RECOGNITION_MAX_FAILURES;
}

function getDietRecognitionAnalyzeMs(scenario, loadingMs = PHOTO_ANALYZE_LOADING_MS) {
  if (scenario === 'success') return Math.round(loadingMs * 0.52);
  return loadingMs;
}

const DIET_RECOGNITION_SCENARIOS = [
  { value: 'success', label: '场景1 · 进度未满即成功' },
  { value: 'timeout', label: '场景2 · 加载超时' },
  { value: 'not-food', label: '场景3 · 识别非食物' },
];

function readDietRecognitionScenario() {
  try {
    const value = sessionStorage.getItem(DIET_RECOGNITION_SCENARIO_KEY) || 'success';
    if (value === 'success-early') return 'success';
    if (value === 'timeout-exhausted') return 'not-food';
    return value;
  } catch (e) {
    return 'success';
  }
}

function writeDietRecognitionScenario(value) {
  try {
    sessionStorage.setItem(DIET_RECOGNITION_SCENARIO_KEY, value);
    window.dispatchEvent(new Event('dietRecognitionScenarioChange'));
  } catch (e) {
    /* ignore */
  }
}

function mockRecognizeDietPhoto({ scenario, forceSuccess = false } = {}) {
  if (forceSuccess || scenario === 'success') {
    return { ok: true };
  }
  if (scenario === 'not-food') {
    return { ok: false, reason: 'not-food' };
  }
  return { ok: false, reason: 'timeout' };
}

function pickDietScenario() {
  const keys = ['lunch', 'breakfast', 'dinner', 'milkTea'];
  return keys[Math.floor(Math.random() * keys.length)];
}

function pickFallbackPhoto() {
  return GALLERY_FALLBACK_PHOTOS[Math.floor(Math.random() * GALLERY_FALLBACK_PHOTOS.length)];
}

const DIET_TEXT_FOOD_LEXICON = [
  { re: /香煎鸡胸肉|鸡胸肉/, name: '香煎鸡胸肉', kcal: 165, defaultPortion: '100g' },
  { re: /炒土豆丝|土豆丝/, name: '炒土豆丝', kcal: 120, defaultPortion: '1 盘' },
  { re: /炒青菜|青菜/, name: '炒青菜', kcal: 80, defaultPortion: '1 盘' },
  { re: /杂粮饭|米饭/, name: '杂粮饭', kcal: 145, defaultPortion: '1 碗' },
  { re: /全麦面包|面包/, name: '全麦面包', kcal: 160, defaultPortion: '1 片' },
  { re: /煎蛋|鸡蛋/, name: '煎蛋', kcal: 90, defaultPortion: '1 个' },
  { re: /牛奶/, name: '牛奶', kcal: 100, defaultPortion: '1 杯' },
  { re: /三明治/, name: '三明治', kcal: 320, defaultPortion: '1 个' },
  { re: /拿铁|咖啡/, name: '拿铁', kcal: 150, defaultPortion: '1 杯' },
  { re: /珍珠奶茶|奶茶/, name: '珍珠奶茶（大杯）', kcal: 520, defaultPortion: '1 杯' },
  { re: /番茄鸡蛋面|鸡蛋面|面条/, name: '番茄鸡蛋面', kcal: 420, defaultPortion: '1 碗' },
  { re: /清蒸鲈鱼|鲈鱼/, name: '清蒸鲈鱼', kcal: 180, defaultPortion: '1 份' },
  { re: /西兰花/, name: '蒜蓉西兰花', kcal: 70, defaultPortion: '1 盘' },
  { re: /沙拉/, name: '蔬菜沙拉', kcal: 180, defaultPortion: '1 碗' },
];

function textMentionsDiet(text) {
  return /吃了|喝了|早餐|午餐|晚餐|加餐|早饭|午饭|晚饭|早上吃|中午吃|晚上吃|记录.*吃/.test(text || '');
}

function shouldParseAsDietText(text) {
  const t = text || '';
  if (textMentionsDiet(t)) return true;
  if (matchLexiconFoods(t).length > 0) return true;
  if (textHasPortionInfo(t) && /[\u4e00-\u9fa5]{2,}/.test(t)) return true;
  return false;
}

function parsePortionFromSegment(segment) {
  const m = (segment || '').match(/^(.+?)(\d+(?:\.\d+)?\s*(?:g|克|kg|公斤|ml|毫升|碗|盘|杯|个|片|块))$/i);
  if (!m) return { namePart: (segment || '').trim(), portion: null };
  return {
    namePart: m[1].trim(),
    portion: m[2].replace(/\s+/g, ''),
  };
}

function resolveLexiconFood(namePart) {
  const hit = DIET_TEXT_FOOD_LEXICON.find((food) => food.re.test(namePart));
  if (!hit) return null;
  return { ...hit };
}

function parseFoodSegments(text) {
  const clause = extractFoodClause(text);
  return splitFoodSegments(clause)
    .map((segment) => {
      const { namePart, portion } = parsePortionFromSegment(segment);
      const lex = resolveLexiconFood(namePart) || resolveLexiconFood(segment);
      if (lex) {
        return {
          name: lex.name,
          portion: portion || parsePortionForFood(text, namePart) || lex.defaultPortion,
          kcal: lex.kcal,
          matched: lex.kcal != null,
        };
      }
      if (namePart) {
        return { name: namePart, label: namePart, raw: true };
      }
      return null;
    })
    .filter(Boolean);
}

function textHasPortionInfo(text) {
  return /(\d+(?:\.\d+)?)\s*(?:g|克|kg|公斤|斤|碗|盘|杯|个|片|块|ml|毫升)/i.test(text || '');
}

function extractFoodClause(text) {
  const m = (text || '').match(/(?:吃了|喝了)([^。；;\n]+)/);
  return m ? m[1] : text;
}

function splitFoodSegments(clause) {
  return clause
    .split(/[和、与及+,，以及]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/^(一点|一些|两个|一份|一碗|一个|今天|早上|上午|中午|下午|晚上|今早)/, '').trim())
    .filter((s) => s && !/^(早餐|午餐|晚餐|加餐)$/.test(s));
}

function matchLexiconFoods(text) {
  const found = [];
  DIET_TEXT_FOOD_LEXICON.forEach((food) => {
    if (food.re.test(text) && !found.some((f) => f.name === food.name)) {
      found.push({ ...food });
    }
  });
  return found;
}

function parsePortionForFood(text, foodName) {
  const keys = [foodName];
  const lex = DIET_TEXT_FOOD_LEXICON.find((food) => food.name === foodName);
  if (lex) {
    const alias = String(lex.re.source).replace(/^\(\?:\?|\)$|\(\?[:=][^)]+\)/g, '').split('|');
    keys.push(...alias.filter(Boolean));
  }
  for (const key of keys) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const near = text.match(new RegExp(`${escaped}\\s*(\\d+(?:\\.\\d+)?\\s*(?:g|克|kg|公斤|ml|毫升|碗|盘|杯|个|片|块))`, 'i'));
    if (near) return near[1].replace(/\s+/g, '');
  }
  return null;
}

function parseDietFromText(text) {
  if (!shouldParseAsDietText(text)) return null;

  let foods = parseFoodSegments(text);

  if (!foods.length) {
    foods = matchLexiconFoods(text);
  }

  if (!foods.length) {
    const segments = splitFoodSegments(extractFoodClause(text));
    foods = segments.map((name) => ({ name, kcal: null, defaultPortion: null, raw: true }));
  }

  if (!foods.length) return null;

  const withPortion = textHasPortionInfo(text);

  if (!withPortion) {
    const items = foods.map((food) => ({
      name: food.name,
      label: food.name.replace(/（.*）/, ''),
    }));
    return {
      matchStatus: 'names-only',
      foods: items.map((item) => item.label),
      items,
      totalKcal: null,
      foodTags: [],
    };
  }

  const items = foods.map((food) => {
    if (food.raw) {
      return { name: food.name, label: food.label || food.name, matched: false };
    }
    const portion = food.portion || parsePortionForFood(text, food.name) || food.defaultPortion || '1 份';
    return {
      name: food.name,
      portion,
      kcal: food.kcal,
      matched: food.kcal != null,
    };
  });
  const calorieItems = items.filter((item) => item.kcal != null);
  const totalKcal = calorieItems.reduce((sum, item) => sum + (item.kcal || 0), 0);

  return {
    matchStatus: totalKcal > 0 ? 'all' : 'names-only',
    foods: items.map((item) => item.name.replace(/（.*）/, '')),
    items: totalKcal > 0
      ? items
      : items.map((item) => ({ name: item.name, label: item.name.replace(/（.*）/, '') })),
    totalKcal: totalKcal > 0 ? totalKcal : null,
    foodTags: [],
  };
}

function createDietTextFeedbackEntry({ text, voice, parsed } = {}) {
  const lunch = DIET_SCENARIOS.lunch;
  const time = window.formatNowTime?.() || '12:05';
  return {
    kind: 'diet-text-feedback',
    id: 'e-diet-text-' + Date.now(),
    time,
    sourceText: text,
    sourceVoice: voice || null,
    displayScenario: readDietFeedbackDisplayScenario(),
    dietData: {
      time,
      foods: parsed.foods,
      items: parsed.items,
      totalKcal: parsed.totalKcal,
      matchStatus: parsed.matchStatus,
      foodTags: parsed.foodTags || [],
    },
    userContext: buildDietUserContext(lunch),
    isNew: true,
  };
}

function tryCreateDietTextFeedbackEntry(text, recordScenario, voice) {
  if (!window.isDietTextRecordScenario?.(recordScenario)) return null;
  const parsed = parseDietFromText(text);
  if (!parsed) return null;
  return createDietTextFeedbackEntry({ text, voice, parsed });
}

function createDietCaptureGroup({ photoUrl, scenario } = {}) {
  const sceneKey = scenario || pickDietScenario();
  const data = DIET_SCENARIOS[sceneKey] || DIET_SCENARIOS.lunch;
  const id = 'e-diet-' + Date.now();
  const time = window.formatNowTime?.() || '12:05';
  const photo = photoUrl || pickFallbackPhoto();
  const foods = data.items.map(item => item.name.replace(/（.*）/, ''));

  return {
    kind: 'diet-photo-feedback',
    id: id + '-fb',
    time,
    photoUrl: photo,
    recognitionScenario: readDietRecognitionScenario(),
    displayScenario: readDietFeedbackDisplayScenario(),
    dietData: {
      time,
      foods,
      items: data.items,
      totalKcal: data.totalKcal,
      matchStatus: 'all',
      foodTags: data.foodTags || [],
    },
    userContext: buildDietUserContext(data),
  };
}

function createDietTimeoutDemoEntry({ photoUrl, failureCount = 0 } = {}) {
  const entry = createDietCaptureGroup({ photoUrl, scenario: 'lunch' });
  entry.isNew = false;
  entry.recognitionState = 'error';
  entry.failureCount = failureCount;
  entry.recognitionScenario = 'timeout';
  return entry;
}

function createDietNotFoodDemoEntry({ photoUrl } = {}) {
  const entry = createDietCaptureGroup({ photoUrl, scenario: 'lunch' });
  entry.isNew = false;
  entry.recognitionState = 'error';
  entry.recognitionScenario = 'not-food';
  return entry;
}

const DIET_FEEDBACK_DISPLAY_SCENARIO_KEY = 'my-demo-diet-feedback-display-scenario';

const DIET_FEEDBACK_DISPLAY_SCENARIOS = [
  { value: 'dim-a', label: 'A', title: '今日≥2餐 且 近7天<3天' },
  { value: 'dim-b', label: 'B', title: '近7天≥3天' },
  { value: 'dim-c', label: 'C', title: '热量 700–1000 千卡' },
  { value: 'dim-d', label: 'D', title: '经期 × 本餐有冷饮冰品' },
  { value: 'dim-e', label: 'E', title: '今日≥5 种不同食物' },
];

const FEEDBACK_DIM_LEGACY_MAP = {
  guide: 'dim-a',
  trend: 'dim-b',
  'day-total': 'dim-a',
  'day-total-trend': 'dim-b',
  'day-total-trend-avg': 'dim-b',
  'meal-insight': 'dim-c',
  diversity: 'dim-e',
  'cycle-diet': 'dim-d',
  'milestone-100': 'dim-b',
};

function normalizeDietFeedbackDisplayScenario(value) {
  if (!value) return 'dim-a';
  return FEEDBACK_DIM_LEGACY_MAP[value] || value;
}

function getDietFeedbackDisplayConfig(scenario) {
  const dim = normalizeDietFeedbackDisplayScenario(scenario);
  switch (dim) {
    case 'dim-a':
      return { showChart: true, feedbackDim: 'A', plainShell: false };
    case 'dim-b':
      return { showChart: true, feedbackDim: 'B', plainShell: false };
    case 'dim-c':
      return { showChart: true, feedbackDim: 'C', plainShell: false };
    case 'dim-d':
      return { showChart: true, feedbackDim: 'D', plainShell: false };
    case 'dim-e':
      return { showChart: true, feedbackDim: 'E', plainShell: false };
    case 'meal-insight':
      return {
        showGuide: true,
        showChart: false,
        showDayTotal: false,
        showAvg: false,
        showMealInsight: true,
        plainShell: true,
      };
    case 'diversity':
      return {
        showGuide: true,
        showChart: false,
        showDayTotal: false,
        showAvg: false,
        showMealInsight: true,
        showDiversity: true,
        plainShell: true,
      };
    case 'milestone-100':
      return {
        showGuide: false,
        showChart: true,
        showDayTotal: false,
        showAvg: false,
        showMilestone: 100,
        milestoneSurprise: true,
        plainShell: false,
      };
    case 'cycle-diet':
      return {
        showGuide: false,
        showChart: true,
        showDayTotal: true,
        showAvg: true,
        showCycleTip: true,
        plainShell: false,
      };
    case 'combo-bce':
      return {
        useCompactMeal: true,
        showChart: true,
        feedbackDims: ['B', 'C', 'E'],
        plainShell: false,
      };
    case 'combo-acd':
      return {
        useCompactMeal: true,
        showChart: true,
        feedbackDims: ['A', 'C', 'D'],
        plainShell: false,
      };
    case 'combo-bcd':
      return {
        useCompactMeal: true,
        showChart: true,
        feedbackDims: ['B', 'C', 'D'],
        plainShell: false,
      };
    default:
      return getDietFeedbackDisplayConfig('dim-a');
  }
}

function readDietFeedbackDisplayScenario() {
  try {
    const value = sessionStorage.getItem(DIET_FEEDBACK_DISPLAY_SCENARIO_KEY);
    return value ? normalizeDietFeedbackDisplayScenario(value) : null;
  } catch {
    return null;
  }
}

function writeDietFeedbackDisplayScenario(value) {
  try {
    sessionStorage.setItem(DIET_FEEDBACK_DISPLAY_SCENARIO_KEY, value);
    window.dispatchEvent(new Event('dietFeedbackDisplayScenarioChange'));
  } catch {
    /* ignore */
  }
}

function buildDietUserContext(data, {
  daysWithRecord,
  cycleData,
  todayFoodCount,
  totalRecordDays,
  dayMealCount,
  dayTotalKcal,
  weekData,
} = {}) {
  return {
    dayMealCount: dayMealCount ?? (data.dailyIntake != null ? 2 : 1),
    dayTotalKcal: dayTotalKcal ?? data.dailyIntake ?? data.totalKcal,
    weekData: weekData ?? data.weekData,
    daysWithRecord: daysWithRecord ?? data.daysWithRecord,
    avgKcal: data.avgKcal,
    cycleData: cycleData ?? null,
    todayFoodCount: todayFoodCount ?? (data.items?.length || 1),
    totalRecordDays: totalRecordDays ?? data.daysWithRecord,
  };
}

const FEEDBACK_DIM_DEMO_PRESETS = {
  'dim-a': {
    food: 'lunch',
    ctx: {
      daysWithRecord: 2,
      dayMealCount: 2,
      dayTotalKcal: 1126,
      weekData: [null, 980, null, null, null, null, 1126],
    },
  },
  'dim-b': {
    food: 'lunch',
    ctx: { daysWithRecord: 5 },
  },
  'dim-c': {
    food: 'feastMeal',
    ctx: {},
  },
  'dim-d': {
    food: 'coldDrinkMeal',
    ctx: { cycleData: { phase: 'period', day: 2 } },
  },
  'dim-e': {
    food: 'dinner',
    ctx: { todayFoodCount: 5, dayMealCount: 3, dayTotalKcal: 1676 },
  },
};

function createDietFeedbackDisplayDemoEntry(displayScenario) {
  const scenario = normalizeDietFeedbackDisplayScenario(
    displayScenario || readDietFeedbackDisplayScenario() || 'dim-a'
  );
  const preset = FEEDBACK_DIM_DEMO_PRESETS[scenario] || FEEDBACK_DIM_DEMO_PRESETS['dim-a'];
  const data = DIET_SCENARIOS[preset.food] || DIET_SCENARIOS.lunch;
  const entry = createDietCaptureGroup({ scenario: preset.food });
  entry.isNew = false;
  entry.displayScenario = scenario;
  entry.recognitionScenario = 'success';
  entry.userContext = buildDietUserContext(data, preset.ctx);
  return entry;
}

const DIET_FEEDBACK_COMBO_SCENARIOS = [
  { value: 'combo-bce', label: 'BCE示例', title: 'B + C + E 文案合并一行' },
  { value: 'combo-acd', label: 'ACD示例', title: 'A + C + D 文案合并一行' },
  { value: 'combo-bcd', label: 'BCD示例', title: 'B + C + D 文案合并一行' },
];

const COMBO_HINTS = {
  'combo-bce': '柱状图 + B/C/E 三维度文案连续展示（不换行）',
  'combo-acd': '柱状图 + A/C/D 三维度文案连续展示（不换行）',
  'combo-bcd': '柱状图 + B/C/D 三维度文案连续展示（不换行）',
};

const COMBO_PERIOD_CTX = { phase: 'period', day: 2 };

const COMBO_DEMO_PRESETS = {
  'combo-bce': {
    food: 'feastMeal',
    ctx: {
      daysWithRecord: 5,
      todayFoodCount: 5,
      dayMealCount: 3,
      dayTotalKcal: 1676,
    },
  },
  'combo-acd': {
    food: 'feastMeal',
    ctx: {
      daysWithRecord: 2,
      dayMealCount: 2,
      dayTotalKcal: 1126,
      weekData: [null, 980, null, null, null, null, 1126],
      cycleData: COMBO_PERIOD_CTX,
    },
    foodTags: ['冷饮冰品'],
  },
  'combo-bcd': {
    food: 'feastMeal',
    ctx: {
      daysWithRecord: 5,
      cycleData: COMBO_PERIOD_CTX,
    },
    foodTags: ['冷饮冰品'],
  },
};

function createDietFeedbackComboDemoEntry(comboScenario = 'combo-bce') {
  const preset = COMBO_DEMO_PRESETS[comboScenario] || COMBO_DEMO_PRESETS['combo-bce'];
  const data = DIET_SCENARIOS[preset.food] || DIET_SCENARIOS.lunch;
  const entry = createDietCaptureGroup({ scenario: preset.food });
  entry.isNew = false;
  entry.displayScenario = comboScenario;
  entry.recognitionScenario = 'success';
  entry.userContext = buildDietUserContext(data, preset.ctx);
  if (preset.foodTags) {
    entry.dietData.foodTags = preset.foodTags;
  }
  return entry;
}

function DietFeedbackComboScenarioBar() {
  const [value, setValue] = React.useState('combo-bce');

  const handleSelect = (next) => {
    setValue(next);
    window.dispatchEvent(new CustomEvent('dietFeedbackComboDemoInsert', {
      detail: { scenario: next },
    }));
  };

  return (
    <details className="demo-scene-dock demo-scene-dock-details is-dense">
      <summary className="demo-scene-dock-summary">卡片组合示例（3）</summary>
      <div className="demo-scene-dock-options" role="toolbar" aria-label="饮食卡片组合场景">
        {DIET_FEEDBACK_COMBO_SCENARIOS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={'demo-scene-dock-btn' + (value === opt.value ? ' active' : '')}
            aria-pressed={value === opt.value}
            title={opt.title}
            onClick={() => handleSelect(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <p className="demo-scene-dock-hint">{COMBO_HINTS[value] || COMBO_HINTS['combo-bce']}</p>
    </details>
  );
}

function DietRecognitionScenarioBar() {
  const [value, setValue] = React.useState(() => readDietRecognitionScenario());

  React.useEffect(() => {
    const onChange = () => setValue(readDietRecognitionScenario());
    window.addEventListener('dietRecognitionScenarioChange', onChange);
    return () => window.removeEventListener('dietRecognitionScenarioChange', onChange);
  }, []);

  const handleSelect = (next) => {
    writeDietRecognitionScenario(next);
    setValue(next);
  };

  const hintByScenario = {
    success: '拍照后进度未走满即识别成功，直接发布到时间轴',
    timeout: '拍照后模拟识别超时，展示重试与重拍',
    'not-food': '拍照后识别为非食物，展示「没有检测到食物，重拍一张」',
  };

  return (
    <div className="demo-scene-dock" role="toolbar" aria-label="饮食识别场景切换">
      <div className="demo-scene-dock-label">饮食识别</div>
      <div className="demo-scene-dock-options">
        {DIET_RECOGNITION_SCENARIOS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={'demo-scene-dock-btn' + (value === opt.value ? ' active' : '')}
            aria-pressed={value === opt.value}
            onClick={() => handleSelect(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <p className="demo-scene-dock-hint">{hintByScenario[value] || hintByScenario.success}</p>
    </div>
  );
}

function DietFeedbackDisplayScenarioBar() {
  const [value, setValue] = React.useState(
    () => readDietFeedbackDisplayScenario() || 'dim-a'
  );

  React.useEffect(() => {
    const onChange = () => setValue(readDietFeedbackDisplayScenario() || 'dim-a');
    window.addEventListener('dietFeedbackDisplayScenarioChange', onChange);
    return () => window.removeEventListener('dietFeedbackDisplayScenarioChange', onChange);
  }, []);

  const handleSelect = (next) => {
    writeDietFeedbackDisplayScenario(next);
    setValue(next);
    window.dispatchEvent(new CustomEvent('dietFeedbackDisplayDemoInsert', {
      detail: { scenario: next },
    }));
  };

  const hintByScenario = {
    'dim-a': '柱状图 + 今天饮食打卡 N 次，合计总热量千卡',
    'dim-b': '柱状图 + 过去一周平均每天均值千卡',
    'dim-c': '柱状图 + 这顿挺丰盛…相当于慢跑 N 分钟（按 5 分钟取整）',
    'dim-d': '柱状图 + 经期吃冰品提示',
    'dim-e': '柱状图 + 今日食物种类丰富提示',
  };

  return (
    <div className="demo-scene-dock is-dense" role="toolbar" aria-label="反馈维度场景切换">
      <div className="demo-scene-dock-label">反馈维度</div>
      <div className="demo-scene-dock-options">
        {DIET_FEEDBACK_DISPLAY_SCENARIOS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={'demo-scene-dock-btn' + (value === opt.value ? ' active' : '')}
            aria-pressed={value === opt.value}
            title={opt.title}
            onClick={() => handleSelect(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <p className="demo-scene-dock-hint">{hintByScenario[value] || hintByScenario['dim-a']}</p>
    </div>
  );
}

Object.assign(window, {
  createDietCaptureGroup,
  createDietTimeoutDemoEntry,
  createDietNotFoodDemoEntry,
  DIET_SCENARIOS,
  GALLERY_FALLBACK_PHOTOS,
  PHOTO_ANALYZE_LOADING_MS,
  DIET_RECOGNITION_MAX_FAILURES,
  getDietRecognitionMaxFailures,
  getDietRecognitionAnalyzeMs,
  DIET_RECOGNITION_SCENARIOS,
  readDietRecognitionScenario,
  writeDietRecognitionScenario,
  mockRecognizeDietPhoto,
  parseDietFromText,
  textMentionsDiet,
  createDietTextFeedbackEntry,
  tryCreateDietTextFeedbackEntry,
  DIET_FEEDBACK_DISPLAY_SCENARIOS,
  getDietFeedbackDisplayConfig,
  normalizeDietFeedbackDisplayScenario,
  readDietFeedbackDisplayScenario,
  writeDietFeedbackDisplayScenario,
  createDietFeedbackDisplayDemoEntry,
  createDietFeedbackComboDemoEntry,
  buildDietUserContext,
  DIET_FEEDBACK_COMBO_SCENARIOS,
  DietFeedbackDisplayScenarioBar,
  DietFeedbackComboScenarioBar,
  DietRecognitionScenarioBar,
  pickFallbackPhoto,
});
