// ============ 点滴搜索 · 时间轴筛选 ============

const SEARCH_DEMO_MONTH = 5;
const SEARCH_LAST_MONTH = SEARCH_DEMO_MONTH === 1 ? 12 : SEARCH_DEMO_MONTH - 1;

function isLastMonthWeightQuery(query) {
  const q = (query || '').trim();
  return /上个月/.test(q) && /体重/.test(q);
}

function isWeightEntry(item, primary) {
  if (primary?.kind === 'weight' || primary?.weightValue) return true;
  return tagMatches(primary, item, (t) => (
    /体重|weight/i.test(t.cat || '') || t.icon === 'weight'
  ));
}

function dayMonthFromBlock(block) {
  const m = String(block?.date || '').match(/^(\d+)\//);
  return m ? parseInt(m[1], 10) : null;
}

const SEARCH_FILTER_MATCHERS = {
  mood(item, primary) {
    if (item.quickMood) return true;
    if (primary?.kind === 'mood') return true;
    return tagMatches(primary, item, (t) => (
      /心情|情绪|mood/i.test(t.cat || '') || t.icon === 'mood'
    ));
  },
  weight(item, primary) {
    if (primary?.kind === 'weight' || primary?.weightValue) return true;
    return tagMatches(primary, item, (t) => (
      /体重|weight/i.test(t.cat || '') || t.icon === 'weight'
    ));
  },
  diet(item, primary) {
    if (primary?.kind === 'image' && (primary?.label || primary?.totalKcal)) return true;
    if (primary?.totalKcal) return true;
    if (tagMatches(primary, item, (t) => (
      /饮食|热量|diet|food/i.test(t.cat || '') || t.icon === 'food' || t.icon === 'flame'
    ))) return true;
    const text = entryText(item, primary);
    return /饭|餐|吃|沙拉|三明治|咖啡|拿铁|饮食|午餐|晚餐|早餐|零食/.test(text);
  },
  fitness(item, primary) {
    if (tagMatches(primary, item, (t) => (
      /运动|fitness|run/i.test(t.cat || '') || t.icon === 'run'
    ))) return true;
    const text = entryText(item, primary);
    return /跑步|公里|运动|健身|三公里/.test(text);
  },
  sleep(item, primary) {
    if (tagMatches(primary, item, (t) => (
      /睡眠|sleep/i.test(t.cat || '') || t.icon === 'sleep'
    ))) return true;
    const text = entryText(item, primary);
    return /睡|失眠|早睡|犯困|醒来/.test(text);
  },
};

function tagMatches(primary, item, pred) {
  const tags = primary?.tags || item.tags || [];
  return tags.some(pred);
}

function entryText(item, primary) {
  return [
    primary?.text,
    item.body,
    item.voiceText,
    primary?.weightValue,
    primary?.label,
  ].filter(Boolean).join(' ');
}

function getSearchableEntry(item) {
  if (!item || ['guide', 'sister-card', 'gap'].includes(item.kind)) return null;
  if (item.kind === 'record-group' && item.primary) {
    return { item, primary: item.primary };
  }
  if (item.primary) return { item, primary: item.primary };
  return { item, primary: item };
}

function itemMatchesText(item, primary, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = (
    entryText(item, primary) + ' '
    + (primary?.tags || item.tags || []).map((t) => `${t.cat || ''}${t.val || ''}`).join(' ')
  ).toLowerCase();
  return haystack.includes(q);
}

function itemMatchesSearch(item, { query = '', filterId = null } = {}) {
  const entry = getSearchableEntry(item);
  if (!entry) return false;
  const { primary } = entry;
  const matcher = filterId ? SEARCH_FILTER_MATCHERS[filterId] : null;
  if (matcher) return matcher(entry.item, primary);
  return itemMatchesText(entry.item, primary, query);
}

function isBabyFeedingEntry(item, primary) {
  if (item?.kind === 'baby-feeding-card') return true;
  if (primary?.kind === 'baby-feeding-card') return true;
  const text = entryText(item, primary);
  return /喂养|配方奶|母乳|瓶喂|换尿布|小豆苗/.test(text);
}

function isSelfHealthEntry(item, primary) {
  if (['guide', 'sister-card', 'gap'].includes(item?.kind)) return false;
  if (isBabyFeedingEntry(item, primary)) return false;
  return !!getSearchableEntry(item);
}

const SELF_PANEL_MATCHERS = {
  爱爱(item, primary) {
    if (primary?.kind === 'love') return true;
    const text = entryText(item, primary);
    return /爱爱|同房|性生活/.test(text) || tagMatches(primary, item, (t) => /爱爱|love/i.test(t.cat || ''));
  },
  心情(item, primary) {
    return SEARCH_FILTER_MATCHERS.mood(item, primary);
  },
  体重(item, primary) {
    return SEARCH_FILTER_MATCHERS.weight(item, primary);
  },
  体温(item, primary) {
    if (primary?.kind === 'temp') return true;
    const text = entryText(item, primary);
    return /体温|°C|℃/.test(text) || tagMatches(primary, item, (t) => /体温|temp/i.test(t.cat || ''));
  },
  症状(item, primary) {
    if (['pain', 'symptom', 'med'].includes(primary?.kind)) return true;
    if (tagMatches(primary, item, (t) => /症状|痛经|腹胀|腰酸|疲惫|用药/i.test(t.cat || ''))) return true;
    const text = entryText(item, primary);
    return /痛经|腹胀|腰酸|疲惫|用药|症状|疼|痛/.test(text);
  },
  饮食(item, primary) {
    return SEARCH_FILTER_MATCHERS.diet(item, primary);
  },
  运动(item, primary) {
    const text = entryText(item, primary);
    return /运动|健身|跑步|游泳|训练/.test(text) || tagMatches(primary, item, (t) => /运动|run/i.test(t.cat || ''));
  },
};

const BABY_PANEL_MATCHERS = {
  母乳(item, primary) {
    const text = entryText(item, primary) + (primary?.feedType || item?.feedType || '');
    return /母乳/.test(text);
  },
  配方奶(item, primary) {
    const text = entryText(item, primary) + (primary?.feedType || item?.feedType || '');
    return /配方奶/.test(text);
  },
  瓶喂母乳(item, primary) {
    const text = entryText(item, primary) + (primary?.feedType || item?.feedType || '');
    return /瓶喂母乳/.test(text);
  },
  换尿布(item, primary) {
    const text = entryText(item, primary) + (primary?.feedType || item?.feedType || '');
    return /换尿布|尿布/.test(text);
  },
  睡眠(item, primary) {
    const text = entryText(item, primary) + (primary?.feedType || item?.feedType || '');
    return /睡眠|睡了/.test(text) || SEARCH_FILTER_MATCHERS.sleep(item, primary);
  },
  营养补剂(item, primary) {
    const text = entryText(item, primary) + (primary?.feedType || item?.feedType || '');
    return /营养/.test(text);
  },
  喝水(item, primary) {
    const text = entryText(item, primary);
    return /喝水/.test(text);
  },
  吸奶(item, primary) {
    const text = entryText(item, primary);
    return /吸奶/.test(text);
  },
  辅食(item, primary) {
    const text = entryText(item, primary);
    return /辅食/.test(text);
  },
  其他事件(item, primary) {
    const text = entryText(item, primary);
    return /其他事件|其他/.test(text);
  },
  洗澡(item, primary) {
    const text = entryText(item, primary);
    return /洗澡/.test(text);
  },
  玩耍(item, primary) {
    const text = entryText(item, primary);
    return /玩耍/.test(text);
  },
  游泳(item, primary) {
    const text = entryText(item, primary);
    return /游泳/.test(text);
  },
};

function itemMatchesPersonPanelFilter(item, { personId, option }) {
  const entry = getSearchableEntry(item);
  if (!entry) return false;
  const { item: row, primary } = entry;

  if (personId === 'personal') {
    if (option === '全部') return true;
    const selfMatcher = SELF_PANEL_MATCHERS[option];
    const babyMatcher = BABY_PANEL_MATCHERS[option];
    return (selfMatcher ? selfMatcher(row, primary) : false)
      || (babyMatcher ? babyMatcher(row, primary) : false);
  }

  if (personId === 'self') {
    if (option === '全部') return isSelfHealthEntry(row, primary);
    const matcher = SELF_PANEL_MATCHERS[option];
    return matcher ? matcher(row, primary) : isSelfHealthEntry(row, primary);
  }

  if (personId === 'elder' || personId === 'younger') {
    if (!isBabyFeedingEntry(row, primary)) return false;
    const targetBabyName = personId === 'elder' ? '小豆苗' : '小豆芽';
    const babyName = primary?.babyName || row?.babyName || '小豆苗';
    if (babyName !== targetBabyName) return false;
    if (option === '全部') return true;
    const matcher = BABY_PANEL_MATCHERS[option];
    return matcher ? matcher(row, primary) : entryText(row, primary).includes(option);
  }

  return true;
}

function filterTimelineForSearch(blocks, criteria) {
  if (!criteria) return blocks;

  if (criteria.personPanelFilter) {
    const { personId, option } = criteria.personPanelFilter;
    const next = [];
    blocks.forEach((block) => {
      if (block.type !== 'day') return;
      const items = (block.items || block.entries || []).filter((item) => (
        itemMatchesPersonPanelFilter(item, { personId, option })
      ));
      if (!items.length) return;
      next.push({ ...block, items, entries: undefined });
    });
    return next;
  }

  if (!criteria.query?.trim() && !criteria.filterId) {
    return blocks;
  }
  const lastMonthWeight = isLastMonthWeightQuery(criteria.query);
  const next = [];
  blocks.forEach((block) => {
    if (block.type !== 'day') return;
    const items = (block.items || block.entries || []).filter((item) => {
      if (lastMonthWeight) {
        if (dayMonthFromBlock(block) !== SEARCH_LAST_MONTH) return false;
        const entry = getSearchableEntry(item);
        if (!entry) return false;
        return isWeightEntry(entry.item, entry.primary);
      }
      return itemMatchesSearch(item, criteria);
    });
    if (!items.length) return;
    next.push({ ...block, items, entries: undefined });
  });
  return next;
}

function countTimelineSearchItems(blocks) {
  let n = 0;
  blocks.forEach((block) => {
    if (block.type !== 'day') return;
    n += (block.items || block.entries || []).length;
  });
  return n;
}

function getSearchAnchorEntryId(blocks) {
  if (!blocks) return null;
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    if (block.type !== 'day') continue;
    const items = block.items || block.entries || [];
    for (let j = 0; j < items.length; j += 1) {
      const item = items[j];
      if (!item || ['guide', 'sister-card', 'gap'].includes(item.kind)) continue;
      const id = item.primary?.id || item.id;
      if (id) return id;
    }
  }
  return null;
}

Object.assign(window, {
  filterTimelineForSearch,
  countTimelineSearchItems,
  getSearchAnchorEntryId,
  SEARCH_FILTER_MATCHERS,
});
