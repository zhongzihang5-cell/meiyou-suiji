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

function filterTimelineForSearch(blocks, criteria) {
  if (!criteria || (!criteria.query?.trim() && !criteria.filterId)) {
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
