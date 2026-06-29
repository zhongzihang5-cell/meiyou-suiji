const { useState, useRef, useEffect, useCallback } = React;

const MODE_TABS = ['经期', '备孕', '怀孕', '育儿'];
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const PERIOD_DAYS = [14, 15, 16, 17, 18];
const PERIOD_END_DAYS = [19, 20, 21];
const PERIOD_FLOW_LEVELS = [40, 80, 60, 30, 20];
const PERIOD_FLOW_FILL_AT_MS = 1550;
const PERIOD_FLOW_SETTLE_AT_MS = 1900;
const PERIOD_FLOW_MIN_START_GAP_MS = 118;
const PERIOD_FLOW_OVERLAP_PROGRESS = 0.65;

function getPeriodFlowDuration(level) {
  return Math.round(125 + level * 5.3);
}

function getPeriodFlowTiming(index) {
  const level = PERIOD_FLOW_LEVELS[index];
  return {
    level,
    delay: 0,
    duration: getPeriodFlowDuration(level),
  };
}

function getPeriodFlowStartDelay(index) {
  let delay = 0;
  for (let i = 0; i < index; i += 1) {
    delay += Math.max(
      Math.round(getPeriodFlowDuration(PERIOD_FLOW_LEVELS[i]) * PERIOD_FLOW_OVERLAP_PROGRESS),
      PERIOD_FLOW_MIN_START_GAP_MS
    );
  }
  return delay;
}

const ICON_HEART = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIgMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTkuMjYxNzkgMS44NTA2QzEwLjg2MzIgMi43MzY1MSAxMS40MzY4IDQuOTAwMjUgMTAuNjUwNiA2LjcyODM2QzEwLjE0NDQgNy45MDU0MyA5LjI2NjQgOC44MDgyNiA4LjQyNjcyIDkuNDQ5ODZDOC4wMTEyOCA5Ljc2NzMgNy40MDU4MiAxMC4wODE2IDYuOTA3MTggMTAuMzE1M0M2LjM0OTE1IDEwLjU3NjkgNS43MDc1MSAxMC41NzY3IDUuMTQ2NzggMTAuMzIxQzQuNjIwODcgMTAuMDgxMSAzLjk4MDgxIDkuNzYwMTcgMy41ODY3MiA5LjQ2MDE3QzIuNzQyOTggOC44MTc4OCAxLjg1ODM0IDcuOTExNzEgMS4zNDk0MiA2LjcyODM2QzAuNTYzMjAxIDQuOTAwMjUgMS4xMzY3NSAyLjczNjUxIDIuNzM4MjEgMS44NTA2QzMuNjAzMzUgMS4zNzIwMSA0LjU5NDY5IDEuMzc5NSA1LjM5NDU5IDEuODk3MDVDNS40NjcyNyAxLjk0NDA3IDUuNTY5NjMgMi4wMjU3MyA1LjY2OTU0IDIuMTA5NzZDNS44NjEwNiAyLjI3MDg0IDYuMTQyMDcgMi4yNzQxIDYuMzM1NDUgMi4xMTUyNkM2LjQ0NzI0IDIuMDIzNDQgNi41NjM3IDEuOTMxODMgNi42NDQzNiAxLjg3ODlDNy40MDUzMSAxLjM3OTUgOC40MTAyIDEuMzc5NSA5LjI2MTc5IDEuODUwNloiIGZpbGw9IiNmZjk0YjgiLz48L3N2Zz4=';

const ICON_OVULATION = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIgMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTguMTIwODMgMi4zMzUyN0M4LjEyNTA3IDIuMzQzOCA4LjEyOTMyIDIuMzUyNzMgOC4xMzM1OCAyLjM2MTk4QzguMjkwNCAyLjcwMjY3IDguNjA1NzEgMi45MzkxNyA4Ljk3ODExIDIuOTgzNjJDOS4wMDMzIDIuOTg2NjMgOS4wMjcwMSAyLjk5MDEzIDkuMDQ4NjYgMi45OTQxOEM5LjUwODA5IDMuMDgwMDkgOS45NDc2IDMuMzA1MTcgMTAuMzAyOCAzLjY2OTQzQzExLjIzMjcgNC42MjMxNiAxMS4yMzI0IDYuMTY5ODMgMTAuMzAyIDcuMTI0MDFDMTAuMjkzNiA3LjEzMjYxIDEwLjI4NDYgNy4xNDE0MyAxMC4yNzUyIDcuMTUwNDJDMTAuMDA5NCA3LjQwMzgxIDkuODgzOTEgNy43Njk4MyA5Ljk2MDE1IDguMTI5MDhDOS45NjY3NyA4LjE2MDI3IDkuOTcyMTQgOC4xODk3MiA5Ljk3NTgzIDguMjE2NDlDMTAuMDQyMSA4LjY5NjQ0IDkuOTcwMzMgOS4yMDEzIDkuNzM5ODQgOS42NjU5M0M5LjE0MzM3IDEwLjg2ODMgNy43MDk5MyAxMS4zNDU5IDYuNTM4MTcgMTAuNzMyN0M2LjUyNzc5IDEwLjcyNzMgNi41MTcwNSAxMC43MjE0IDYuNTA2MDEgMTAuNzE1QzYuMTkwNzkgMTAuNTM1MSA1LjgxMjk1IDEwLjU0MjMgNS40OTQxMyAxMC43MTU4QzUuMDU0MzUgMTAuOTU1IDQuNTM4MTIgMTEuMDU1NCA0LjAwODgxIDEwLjk2OTVDMi43MTAyMiAxMC43NTg5IDEuODI0NjYgOS41MDc0IDIuMDMwODYgOC4xNzQyMkMyLjAzMjk0IDguMTYwNzkgMi4wMzU0MyA4LjE0NjcxIDIuMDM4MjggOC4xMzIxMUMyLjEwOSA3Ljc2OTcyIDEuOTg0NiA3LjQwNjE3IDEuNzIxMyA3LjE0NzMyQzEuNzE5MTMgNy4xNDUxOCAxLjcxNjk5IDcuMTQzMDYgMS43MTQ4OSA3LjE0MDk1QzEuMzYyMDEgNi43ODY2NiAxLjExMzA2IDYuMzE3MjIgMS4wMjk3NiA1Ljc3ODY3QzAuODIzNjY0IDQuNDQ2MTIgMS43MDk4IDMuMTk1MDUgMy4wMDkgMi45ODQzM0MzLjA0MjI4IDIuOTc4OTQgMy4wODAyOCAyLjk3NDg2IDMuMTIwODMgMi45NzE4M0MzLjQzNjI0IDIuOTQ4MjQgMy43MDAwNCAyLjc0MTQ4IDMuODI1NjEgMi40NTExOUM0LjAzOTQ5IDEuOTU2NzcgNC40MTM3NSAxLjUzMTczIDQuOTE5NjUgMS4yNjY5N0M2LjA5MDg2IDAuNjU0MDI5IDcuNTI0MDggMS4xMzIzMiA4LjEyMDgzIDIuMzM1MjdaIiBmaWxsPSIjYjk3MmZmIi8+PC9zdmc+';

const ICON_TODAY = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIgMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQuNDcwMDMgMEM0LjgzNzAyIDAgNS4xNTQ0MSAwLjEzNzA2MSA1LjQzMDA3IDAuMzg3Nzk3QzcuMDIwNjUgMi4wMjMxNyA4LjI1OTc2IDQuMDAyNDUgOC45Mjk1MiA2LjI1MjgyQzkuMDc0NjIgNi43MzI3NiA4Ljk2NTYxIDcuMjE3MTMgOC44NzA5NSA3LjQwNTYzQzguNzI1NTIgNy42NjYxMiA4LjU3ODU0IDcuOTA0NzcgOC4wNTU5MyA4LjA5ODI0QzcuMzkyMDkgOC4zMTcxNSA1LjY0MDE1IDguNSA0LjQ3OTAyIDguNUMzLjMxNzg5IDguNSAxLjYyNTM2IDguMzQ3OTMgMC45Mzc0NTIgOC4wODg0M0MwLjQ4ODcyMyA3Ljg5ODQ3IDAuMjgwMjE1IDcuNjU1NjkgMC4xMzk0MzEgNy40MDU2M0MwLjAzNjY2MSA3LjIyMzA5IC0wLjA3OTQxOCA2LjcyNiAwLjA3NDYzNTUgNi4yNTI4MkMwLjc0NjczMSA0LjAxNzgxIDEuOTQ2NTMgMi4wMTM3NCAzLjUyODEgMC4zODc2NjVDMy43ODk3MiAwLjEzNzA2MSA0LjEwMzA0IDAgNC40NzAwMyAwWiIgZmlsbD0iI2ZmZDkxOSIgdHJhbnNmb3JtPSJtYXRyaXgoMCAxIC0xIDAgMTAuNSAxLjUpIi8+PC9zdmc+';

const ICON_YELLOW_PLUS = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIgMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYgMTFDNi45NjY1IDExIDcuNzUgMTAuMjE2NSA3Ljc1IDkuMjVWNy43NUg5LjI1QzEwLjIxNjUgNy43NSAxMSA2Ljk2NjUgMTEgNkMxMSA1LjAzMzUgMTAuMjE2NSA0LjI1IDkuMjUgNC4yNUg3Ljc1VjIuNzVDNy43NSAxLjc4MzUgNi45NjY1IDEgNiAxQzUuMDMzNSAxIDQuMjUgMS43ODM1IDQuMjUgMi43NVY0LjI1SDIuNzVDMS43ODM1IDQuMjUgMSA1LjAzMzUgMSA2QzEgNi45NjY1IDEuNzgzNSA3Ljc1IDIuNzUgNy43NUg0LjI1VjkuMjVDNC4yNSAxMC4yMTY1IDUuMDMzNSAxMSA2IDExWiIgZmlsbD0iI2ZmZDkxOSIvPjwvc3ZnPg==';
const ICON_YELLOW_BOTTLE = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIgMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQuOTY1NzMgMS41MjQzQzUuMTg0ODEgMS4xMTg5MyA1LjY1MzE0IDAuOTE2NDk1IDYuMDk4NTEgMS4wMzQ2NkM2LjU2NzQ2IDEuMTU5MDkgNi44Nzg3NSAxLjYwMzAzIDYuODM1OTMgMi4wODYzMUw2LjY2NzU1IDMuOTg2NEg4LjQ5OTk5QzkuNjcwMzcgMy45ODY0IDEwLjU5MDcgNC45ODY5NiAxMC40OTMgNi4xNTMyN0wxMC4yNDA3IDkuMTY2NzVDMTAuMTU0IDEwLjIwMyA5LjI4NzU3IDEwLjk5OTkgOC4yNDc2OSAxMC45OTk5SDMuMzY4OTFWMTFIMy4zNDkzNkgzLjI4NDA1VjEwLjk5ODFDMi4yOTEyNyAxMC45NTM3IDEuNSAxMC4xMzQ4IDEuNSA5LjEzMTA4VjYuNTA0ODlDMS41IDUuNTAxMTUgMi4yOTEyNyA0LjY4MjIzIDMuMjg0MDUgNC42Mzc4N1Y0LjYzNTg4TDMuMjg0MzYgNC42MzU1NEw0Ljk2NTczIDEuNTI0M1oiIGZpbGw9IiNmZmQ5MTkiLz48L3N2Zz4=';
const ICON_YELLOW_BARS = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIgMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUgMi41QzUgMS45NDc3MiA1LjQ0NzcyIDEuNSA2IDEuNUM2LjU1MjI4IDEuNSA3IDEuOTQ3NzIgNyAyLjVWOS41QzcgMTAuMDUyMyA2LjU1MjI4IDEwLjUgNiAxMC41QzUuNDQ3NzIgMTAuNSA1IDEwLjA1MjMgNSA5LjVWMi41WiIgZmlsbD0iI2ZmZDkxOSIvPjxwYXRoIGQ9Ik04LjI1IDQuNjI1QzguMjUgNC4wNzI3MiA4LjY5NzcyIDMuNjI1IDkuMjUgMy42MjVDOS44MDIyOCAzLjYyNSAxMC4yNSA0LjA3MjcyIDEwLjI1IDQuNjI1VjkuNUMxMC4yNSAxMC4wNTIzIDkuODAyMjggMTAuNSA5LjI1IDEwLjVDOC42OTc3MiAxMC41IDguMjUgMTAuMDUyMyA4LjI1IDkuNVY0LjYyNVoiIGZpbGw9IiNmZmQ5MTkiLz48cGF0aCBkPSJNMS43NSA1Ljg3NUMxLjc1IDUuMzIyNzIgMi4xOTc3MiA0Ljg3NSAyLjc1IDQuODc1QzMuMzAyMjggNC44NzUgMy43NSA1LjMyMjcyIDMuNzUgNS44NzVWOS41QzMuNzUgMTAuMDUyMyAzLjMwMjI4IDEwLjUgMi43NSAxMC41QzIuMTk3NzIgMTAuNSAxLjc1IDEwLjA1MjMgMS43NSA5LjVWNS44NzVaIiBmaWxsPSIjZmZkOTE5Ii8+PC9zdmc+';
const ICON_YELLOW_LIKE = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIgMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUuMiA1LjJWNy41SDMuNUMzLjIyMzkgNy41IDMgNy43MjQgMyA4VjEwLjVIMy41VjEwLjI1SDUuMlY1LjJaIiBmaWxsPSIjZmZkOTE5Ii8+PHBhdGggZD0iTTUuMiA1LjJDNi4xIDMuOCA3LjggMy4yIDkuMSA0LjFDMTAuMyA1IDkuOCA2LjggOC41IDcuNkw4LjIgOC4ySDUuMlY1LjJaIiBmaWxsPSIjZmZkOTE5Ii8+PC9zdmc+';

const YELLOW_MARK_ICONS = {
  plus: ICON_YELLOW_PLUS,
  bottle: ICON_YELLOW_BOTTLE,
  bars: ICON_YELLOW_BARS,
  like: ICON_YELLOW_LIKE,
};

// business-record-calendar（kit-519 + 分散记录图标）
const CALENDAR_DAYS = [
  null, null, null,
  { n: 1, fertile: true, marks: ['plus'] },
  { n: 2, fertile: true, heart: true, marks: ['plus', 'like', 'bars'] },
  { n: 3, fertile: true, marks: ['like'] },
  { n: 4, heart: true, marks: ['like', 'bars'] },
  { n: 5, marks: ['bars'] },
  { n: 6, heart: true, marks: ['plus'] },
  { n: 7, marks: ['bottle', 'like'] },
  { n: 8, marks: ['plus'] },
  { n: 9, heart: true, marks: ['bars'] },
  { n: 10, marks: ['like', 'plus'] },
  { n: 11, marks: ['bottle'] },
  { n: 12, heart: true, marks: ['like'] },
  { n: 13, marks: ['bars', 'plus'] },
  { n: 14, period: true, today: true },
  { n: 15, period: true },
  { n: 16, period: true },
  { n: 17, predicted: true },
  { n: 18, predicted: true },
  { n: 19 },
  { n: 20 },
  { n: 21 },
  { n: 22 },
  { n: 23 },
  { n: 24 },
  { n: 25 },
  { n: 26 },
  { n: 27, fertile: true },
  { n: 28, fertile: true },
  { n: 29, fertile: true },
  { n: 30, fertile: true },
  { n: 31, fertile: true, ovulation: true },
  null,
];

const FILTER_OPTIONS = [
  { key: 'all', label: '全部', color: '#ff4d88' },
  { key: 'period', label: '经期', color: '#ff4d88' },
  { key: 'love', label: '爱爱', color: '#ff6b9d' },
  { key: 'weight', label: '体重', color: '#c8a882' },
];

const RECORD_TYPES = [
  ...FILTER_OPTIONS,
  { key: 'mood', label: '心情', color: '#c8a882' },
  { key: 'symptom', label: '症状', color: '#4f7cae' },
  { key: 'sleep', label: '睡眠', color: '#8d54ff' },
  { key: 'diet', label: '饮食', color: '#00cc99' },
  { key: 'stool', label: '便便', color: '#b972ff' },
];

const CALENDAR_ICON_TYPES = ['period', 'love', 'weight'];

const DAY_RECORDS = {
  1: ['weight'],
  2: ['love'],
  3: ['weight', 'love'],
  4: ['love'],
  5: ['weight'],
  6: ['love', 'weight'],
  7: ['weight'],
  8: ['love'],
  9: ['weight', 'love'],
  10: ['love'],
  11: ['weight'],
  12: ['love', 'weight'],
  13: ['weight'],
  14: ['period', 'love', 'weight'],
  15: ['period', 'mood', 'weight', 'love', 'symptom', 'diet'],
};

function getFilterType(key) {
  return RECORD_TYPES.find((t) => t.key === key) || FILTER_OPTIONS[0];
}

function getDayRecordTypes(dayN, isPeriod) {
  const types = [...(DAY_RECORDS[dayN] || [])];
  if (isPeriod && !types.includes('period')) types.unshift('period');
  return types;
}

function getCalendarRecordTypes(dayN, isPeriod) {
  if (dayN > 14) return [];
  let types = (DAY_RECORDS[dayN] || []).filter((t) => CALENDAR_ICON_TYPES.includes(t));
  if (isPeriod && !types.includes('period')) types = ['period', ...types];
  return types;
}

function getFilteredRecords(records, activeFilter) {
  if (activeFilter === 'all') return records;
  return records.includes(activeFilter) ? [activeFilter] : [];
}

function dayHasFilteredRecord(records, activeFilter) {
  if (activeFilter === 'all') return records.length > 0;
  return records.includes(activeFilter);
}

const RECORD_ITEMS = [
  { id: 'period', label: '月经来了', type: 'segment' },
  { id: 'love', label: '爱爱', iconBg: '#fff0c9', iconShape: 'is-circle' },
  { id: 'symptom', label: '症状', iconBg: '#dff3ff', iconShape: 'is-square' },
  { id: 'mood', label: '心情', iconBg: '#eadfff', iconShape: 'is-pill' },
  { id: 'discharge', label: '白带', iconBg: '#dff5ec', iconShape: 'is-diamond' },
  { id: 'temp', label: '体温', iconBg: '#ffe1d2', iconShape: 'is-bar' },
  { id: 'weight', label: '体重', iconBg: '#e2ebff', iconShape: 'is-circle' },
  { id: 'diary', label: '日记', iconBg: '#f7e1ff', iconShape: 'is-square' },
  { id: 'habit', label: '好习惯', iconBg: '#e4f7d9', iconShape: 'is-pill' },
  { id: 'stool', label: '便便', iconBg: '#ffe7ef', iconShape: 'is-diamond' },
  { id: 'plan', label: '计划', iconBg: '#e8eef6', iconShape: 'is-bar' },
  { id: 'diet', label: '饮食', iconBg: '#ffe7d6', iconShape: 'is-circle' },
];

// 记录列表项
const MORPH_ITEMS = [
  {
    id: 'period',
    label: '月经来了',
    iconBg: '#ffe8f0',
    iconShape: 'is-square',
    recordType: 'segment',
    usePeriodIcon: true,
  },
  {
    id: 'period-time',
    label: '记下具体时间',
    iconBg: '#ffe8f0',
    iconShape: 'is-circle',
    recordType: 'add',
  },
  {
    id: 'flow',
    label: '流量',
    iconBg: '#ffe8f0',
    iconShape: 'is-square',
    recordType: 'add',
  },
  {
    id: 'color',
    label: '颜色',
    iconBg: '#ffe8f0',
    iconShape: 'is-circle',
    recordType: 'add',
  },
  {
    id: 'cramps',
    label: '痛经',
    iconBg: '#ffe8f0',
    iconShape: 'is-circle',
    recordType: 'add',
  },
  {
    id: 'love',
    label: '爱爱',
    iconBg: '#fff0c9',
    iconShape: 'is-circle',
    recordType: 'add',
  },
  {
    id: 'symptom',
    label: '症状',
    iconBg: '#dff3ff',
    iconShape: 'is-square',
    iconSrc: 'assets/symptom-icon.png',
    recordType: 'add',
  },
  {
    id: 'mood',
    label: '心情',
    iconBg: '#fff3c9',
    iconShape: 'is-circle',
    recordType: 'mood',
  },
  {
    id: 'discharge',
    label: '白带',
    iconBg: '#eadfff',
    iconShape: 'is-pill',
    recordType: 'add',
  },
  {
    id: 'temp',
    label: '体温',
    iconBg: '#e8e0ff',
    iconShape: 'is-circle',
    recordType: 'add',
  },
  {
    id: 'weight',
    label: '体重',
    iconBg: '#e2ebff',
    iconShape: 'is-circle',
    recordType: 'add',
  },
  {
    id: 'diary',
    label: '日记',
    iconBg: '#fff3c9',
    iconShape: 'is-square',
    recordType: 'diary',
  },
  {
    id: 'habit',
    label: '好习惯',
    iconBg: '#dff3ff',
    iconShape: 'is-circle',
    recordType: 'habit',
  },
  {
    id: 'stool',
    label: '便便',
    iconBg: '#ffe7ef',
    iconShape: 'is-diamond',
    recordType: 'add',
  },
  {
    id: 'plan',
    label: '计划',
    iconBg: '#e8eef6',
    iconShape: 'is-bar',
    recordType: 'add',
  },
  {
    id: 'diet',
    label: '饮食',
    iconBg: '#ffe7d6',
    iconShape: 'is-circle',
    recordType: 'diet',
  },
];

const SYM_ICON_C = 'var(--sym-picker-coral)';
const SYM_ICON_CD = 'var(--sym-picker-coral-deep)';
const SYM_ICON_SKIN = '#ffd9c6';
const SYM_ICON_HAIR = '#5b4a52';

const SYMPTOM_PICKER_ICONS = {
  none: `<svg viewBox="0 0 48 48"><path d="M16 22h-3a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3V22z" fill="${SYM_ICON_CD}"/><path d="M16 22l5-9c.6-1 2-1.4 3-.8 1 .5 1.4 1.6 1.1 2.7L24 21h7.5a3 3 0 0 1 3 3.4l-1.4 8.5a3 3 0 0 1-3 2.5H16V22z" fill="${SYM_ICON_C}"/></svg>`,
  yaosuan: `<svg viewBox="0 0 48 48"><path d="M18 12h12c1 0 1.8.8 1.9 1.8l1.6 18c.1 1.2-.8 2.2-2 2.2H18.5c-1.2 0-2.1-1-2-2.2l1.6-18C18.2 12.8 19 12 20 12z" fill="${SYM_ICON_C}"/><path d="M24 12c2.4 0 4.4 1.6 4.4 3.6S26.4 19 24 19s-4.4-1.4-4.4-3.4S21.6 12 24 12z" fill="#fff" opacity=".55"/><path d="M22 27l4 .5-3 3 4 .5" stroke="${SYM_ICON_CD}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  futong: `<svg viewBox="0 0 48 48"><path d="M16 14h16c1 0 1.8.8 1.9 1.8l1.4 16c.1 1.2-.8 2.2-2 2.2H16.7c-1.2 0-2.1-1-2-2.2l1.4-16C16.2 14.8 17 14 18 14z" fill="${SYM_ICON_C}"/><path d="M25 20l-4 6h4l-3 5" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  zhuizhang: `<svg viewBox="0 0 48 48"><path d="M16 14h16c1 0 1.8.8 1.9 1.8l1.4 16c.1 1.2-.8 2.2-2 2.2H16.7c-1.2 0-2.1-1-2-2.2l1.4-16C16.2 14.8 17 14 18 14z" fill="${SYM_ICON_C}"/><circle cx="24" cy="29" r="1.6" fill="#fff"/><path d="M24 19v6" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>`,
  ruxiong: `<svg viewBox="0 0 48 48"><path d="M14 17c3-2 7-2.5 10-2.5S31 15 34 17v9c0 5-4.5 8-10 8s-10-3-10-8v-9z" fill="${SYM_ICON_C}"/><circle cx="19.5" cy="25" r="2" fill="#fff" opacity=".7"/><circle cx="28.5" cy="25" r="2" fill="#fff" opacity=".7"/></svg>`,
  shentisuan: `<svg viewBox="0 0 48 48"><circle cx="24" cy="14" r="3.4" fill="${SYM_ICON_C}"/><path d="M24 18c-3 0-5 1.6-5 4l1 7-1.5 8h3l1.5-7 1.5 7h3L26 29l1-7c0-2.4-2-4-5-4z" fill="${SYM_ICON_C}"/><path d="M14 18l-2-2M34 18l2-2M13 25h-2M35 25h2" stroke="${SYM_ICON_CD}" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  toutong: `<svg viewBox="0 0 48 48"><path d="M24 13c5.5 0 9 3.6 9 9 0 3-1.2 4.8-1.2 7.2 0 2-1.4 3-3 3h-9.6c-1.6 0-3-1-3-3 0-2.4-1.2-4.2-1.2-7.2 0-5.4 3.5-9 10-9z" fill="${SYM_ICON_SKIN}"/><path d="M15.5 19c0-4 4-7 8.5-7s8.5 3 8.5 7c-3-1.5-6-2.2-8.5-2.2S18.5 17.5 15.5 19z" fill="${SYM_ICON_HAIR}"/><path d="M27 20l-3 4h3l-2.5 4" stroke="${SYM_ICON_CD}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  xuanyun: `<svg viewBox="0 0 48 48"><path d="M24 17c5 0 8 3.4 8 8 0 2.8-1 4.4-1 6.6 0 1.8-1.3 2.8-2.8 2.8h-8.4c-1.5 0-2.8-1-2.8-2.8 0-2.2-1-3.8-1-6.6 0-4.6 3-8 8-8z" fill="${SYM_ICON_SKIN}"/><path d="M16.5 23c0-4 3.5-7 7.5-7s7.5 3 7.5 7c-2.6-1.4-5.2-2-7.5-2s-4.9.6-7.5 2z" fill="${SYM_ICON_HAIR}"/><circle cx="21" cy="27" r="1.1" fill="${SYM_ICON_HAIR}"/><circle cx="27" cy="27" r="1.1" fill="${SYM_ICON_HAIR}"/><path d="M15 14c1.5-1.5 4-1.5 5.5 0M27.5 14c1.5-1.5 4-1.5 5.5 0" stroke="${SYM_ICON_CD}" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,
  shimian: `<svg viewBox="0 0 48 48"><path d="M24 16c5 0 8 3.4 8 8 0 2.8-1 4.4-1 6.6 0 1.8-1.3 2.8-2.8 2.8h-8.4c-1.5 0-2.8-1-2.8-2.8 0-2.2-1-3.8-1-6.6 0-4.6 3-8 8-8z" fill="${SYM_ICON_SKIN}"/><path d="M16.5 22c0-4 3.5-7 7.5-7s7.5 3 7.5 7c-2.6-1.4-5.2-2-7.5-2s-4.9.6-7.5 2z" fill="${SYM_ICON_HAIR}"/><path d="M19.5 27c.6-1 2.4-1 3 0M25.5 27c.6-1 2.4-1 3 0" stroke="${SYM_ICON_HAIR}" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M30 17l3 0-3 3h3" stroke="${SYM_ICON_CD}" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  fenci: `<svg viewBox="0 0 48 48"><path d="M24 16c5 0 8 3.4 8 8 0 2.8-1 4.4-1 6.6 0 1.8-1.3 2.8-2.8 2.8h-8.4c-1.5 0-2.8-1-2.8-2.8 0-2.2-1-3.8-1-6.6 0-4.6 3-8 8-8z" fill="${SYM_ICON_SKIN}"/><path d="M16.5 22c0-4 3.5-7 7.5-7s7.5 3 7.5 7c-2.6-1.4-5.2-2-7.5-2s-4.9.6-7.5 2z" fill="${SYM_ICON_HAIR}"/><circle cx="20" cy="28" r="1.4" fill="${SYM_ICON_CD}"/><circle cx="28" cy="26" r="1.2" fill="${SYM_ICON_CD}"/><circle cx="26" cy="30" r="1" fill="${SYM_ICON_CD}"/><circle cx="22" cy="24" r="1" fill="${SYM_ICON_CD}"/></svg>`,
  ganzao: `<svg viewBox="0 0 48 48"><path d="M24 16c5 0 8 3.4 8 8 0 2.8-1 4.4-1 6.6 0 1.8-1.3 2.8-2.8 2.8h-8.4c-1.5 0-2.8-1-2.8-2.8 0-2.2-1-3.8-1-6.6 0-4.6 3-8 8-8z" fill="${SYM_ICON_SKIN}"/><path d="M16.5 22c0-4 3.5-7 7.5-7s7.5 3 7.5 7c-2.6-1.4-5.2-2-7.5-2s-4.9.6-7.5 2z" fill="${SYM_ICON_HAIR}"/><path d="M19 26l2 1.5M27 25l-1.6 1.8M21 30l1.6-1.4M26 30l1.2-1.6" stroke="${SYM_ICON_CD}" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  shiyu: `<svg viewBox="0 0 48 48"><path d="M24 16c5 0 8 3.4 8 8 0 2.8-1 4.4-1 6.6 0 1.8-1.3 2.8-2.8 2.8h-8.4c-1.5 0-2.8-1-2.8-2.8 0-2.2-1-3.8-1-6.6 0-4.6 3-8 8-8z" fill="${SYM_ICON_SKIN}"/><path d="M16.5 22c0-4 3.5-7 7.5-7s7.5 3 7.5 7c-2.6-1.4-5.2-2-7.5-2s-4.9.6-7.5 2z" fill="${SYM_ICON_HAIR}"/><circle cx="20.5" cy="26" r="1.1" fill="${SYM_ICON_HAIR}"/><circle cx="27.5" cy="26" r="1.1" fill="${SYM_ICON_HAIR}"/><path d="M21 31c1.5-1.4 4.5-1.4 6 0" stroke="${SYM_ICON_CD}" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,
  lengyin: `<svg viewBox="0 0 48 48"><path d="M18 18h12l-1.4 14a2 2 0 0 1-2 1.8h-5.2a2 2 0 0 1-2-1.8L18 18z" fill="${SYM_ICON_C}"/><path d="M17 18h14" stroke="${SYM_ICON_CD}" stroke-width="2" stroke-linecap="round"/><path d="M24 9v7M24 9l-2.2 2.2M24 9l2.2 2.2M20.8 11.5l3.2 1.8 3.2-1.8" stroke="#7fd4ff" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  fuxie: `<svg viewBox="0 0 48 48"><rect x="15" y="15" width="18" height="9" rx="4.5" fill="${SYM_ICON_C}"/><rect x="20" y="24" width="8" height="11" rx="2" fill="#fff" stroke="${SYM_ICON_C}" stroke-width="1.6"/><path d="M24 17v5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><circle cx="24" cy="19.5" r="1.4" fill="${SYM_ICON_CD}"/></svg>`,
  bianmi: `<svg viewBox="0 0 48 48"><path d="M16 18h16v5c0 4-3 7-8 7s-8-3-8-7v-5z" fill="${SYM_ICON_C}"/><path d="M19 30l-1.5 5M29 30l1.5 5" stroke="${SYM_ICON_C}" stroke-width="2.4" stroke-linecap="round"/><circle cx="22" cy="23" r="1.3" fill="${SYM_ICON_CD}"/><circle cx="27" cy="22" r="1.1" fill="${SYM_ICON_CD}"/><circle cx="25" cy="26" r="1" fill="${SYM_ICON_CD}"/></svg>`,
  pibei: `<svg viewBox="0 0 48 48"><path d="M24 16c5 0 8 3.4 8 8 0 2.8-1 4.4-1 6.6 0 1.8-1.3 2.8-2.8 2.8h-8.4c-1.5 0-2.8-1-2.8-2.8 0-2.2-1-3.8-1-6.6 0-4.6 3-8 8-8z" fill="${SYM_ICON_SKIN}"/><path d="M16.5 22c0-4 3.5-7 7.5-7s7.5 3 7.5 7c-2.6-1.4-5.2-2-7.5-2s-4.9.6-7.5 2z" fill="${SYM_ICON_HAIR}"/><path d="M18.5 26l3 1M26.5 27l3-1" stroke="${SYM_ICON_HAIR}" stroke-width="1.3" stroke-linecap="round"/><path d="M21 31c1.5-1 4.5-1 6 0" stroke="${SYM_ICON_CD}" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M32 18c1.5 0 2.4 1.4 1.4 2.6-.9 1-2.6.5-2.6-.8" stroke="#7fc8ff" stroke-width="1.3" fill="none" stroke-linecap="round"/></svg>`,
  brown: `<svg viewBox="0 0 48 48"><path d="M24 14c3 3 7 5.5 7 11 0 4.4-3.1 8-7 8s-7-3.6-7-8c0-5.5 4-8 7-11z" fill="#9a5b3a"/><ellipse cx="21.5" cy="24" rx="2.2" ry="3" fill="#fff" opacity=".25"/></svg>`,
  bleed: `<svg viewBox="0 0 48 48"><path d="M20 15c2 2.2 4 4.2 4 7 0 2.6-1.8 4.6-4 4.6s-4-2-4-4.6c0-2.8 2-4.8 4-7z" fill="#ff4d4d"/><path d="M29 22c1.4 1.6 2.8 3 2.8 5 0 1.9-1.3 3.3-2.8 3.3s-2.8-1.4-2.8-3.3c0-2 1.4-3.4 2.8-5z" fill="#ff6b6b"/><path d="M24 28c1.2 1.4 2.4 2.6 2.4 4.4 0 1.6-1.1 2.8-2.4 2.8s-2.4-1.2-2.4-2.8c0-1.8 1.2-3 2.4-4.4z" fill="#ff4d4d"/></svg>`,
  clot: `<svg viewBox="0 0 48 48"><path d="M21 16c2.5-1 5 .6 5.4 2.8.4-1.6 2.4-2.4 3.8-1.4 1.6 1.1 1.4 3.2-.2 4 1.8.4 2.6 2.6 1.2 4-1.2 1.2-3 .8-3.8-.6-.4 1.8-2.6 2.6-4.2 1.4-.6 1.4-2.4 1.8-3.6.8-1.4-1.2-1-3.4.8-3.8-1.6-.8-1.8-3 0-4 1.2-.6 2.6-.2 3.2.8-.2-1.6 1-3.4 1.6-4z" fill="#c2334a"/><circle cx="23" cy="24" r="1.4" fill="#8a1f33"/><circle cx="28" cy="26" r="1.2" fill="#8a1f33"/></svg>`,
  white: `<svg viewBox="0 0 48 48"><path d="M24 14c3 3 7 5.5 7 11 0 4.4-3.1 8-7 8s-7-3.6-7-8c0-5.5 4-8 7-11z" fill="#fbf3e4" stroke="#e7d9c2" stroke-width="1.2"/><ellipse cx="21.5" cy="24" rx="2" ry="2.8" fill="#fff"/></svg>`,
  zhangqi: `<svg viewBox="0 0 48 48"><path d="M16 16h16c1 0 1.8.8 1.9 1.8l1.2 14c.1 1.2-.8 2.2-2 2.2H16.9c-1.2 0-2.1-1-2-2.2l1.2-14C16.2 16.8 17 16 18 16z" fill="${SYM_ICON_C}"/><circle cx="21" cy="25" r="2.2" fill="#fff" opacity=".7"/><circle cx="27" cy="23" r="1.6" fill="#fff" opacity=".7"/><circle cx="25.5" cy="29" r="1.8" fill="#fff" opacity=".7"/></svg>`,
};

const SYMPTOM_PICKER_GROUPS = [
  {
    id: 'body',
    title: '身体症状',
    items: [
      { id: 'no_symptom', name: '没有症状', icon: 'none', imgSrc: 'assets/symptom-picker-none.png', exclusive: true },
      { id: 'back_ache', name: '腰酸', icon: 'yaosuan', imgSrc: 'assets/symptom-back.png' },
      { id: 'cramps', name: '腹痛', icon: 'futong', imgSrc: 'assets/symptom-cramp.png' },
      { id: 'bloat_low', name: '小腹坠胀', icon: 'zhuizhang', imgSrc: 'assets/symptom-bloat.png' },
      { id: 'breast_pain', name: '乳房胀痛', icon: 'ruxiong', imgSrc: 'assets/symptom-breast.png' },
      { id: 'body_ache', name: '身体酸痛', icon: 'shentisuan', imgSrc: 'assets/symptom-sore.png' },
      { id: 'headache', name: '头痛', icon: 'toutong', imgSrc: 'assets/symptom-picker-headache.png' },
      { id: 'dizzy', name: '眩晕', icon: 'xuanyun', imgSrc: 'assets/symptom-picker-dizzy.png' },
      { id: 'insomnia', name: '失眠', icon: 'shimian', imgSrc: 'assets/symptom-insomnia.png' },
      { id: 'acne', name: '粉刺', icon: 'fenci', imgSrc: 'assets/symptom-acne.png' },
      { id: 'dry_skin', name: '皮肤干燥', icon: 'ganzao', imgSrc: 'assets/symptom-picker-dry-skin.png' },
      { id: 'no_appetite', name: '食欲不振', icon: 'shiyu', imgSrc: 'assets/symptom-picker-no-appetite.png' },
      { id: 'cold_crave', name: '贪冷饮', icon: 'lengyin', imgSrc: 'assets/symptom-picker-cold-crave.png' },
      { id: 'diarrhea', name: '腹泻', icon: 'fuxie', imgSrc: 'assets/symptom-diarrhea.png' },
      { id: 'constipation', name: '便秘', icon: 'bianmi', imgSrc: 'assets/symptom-picker-constipation.png' },
      { id: 'fatigue', name: '疲惫', icon: 'pibei', imgSrc: 'assets/symptom-tired.png' },
    ],
  },
  {
    id: 'discharge',
    title: '阴道分泌物',
    items: [
      { id: 'discharge_brown', name: '褐色分泌物', icon: 'brown', imgSrc: 'assets/symptom-discharge.png' },
      { id: 'discharge_blood', name: '出血', icon: 'bleed', imgSrc: 'assets/symptom-picker-bleeding.png' },
      { id: 'discharge_clot', name: '有血块', icon: 'clot', imgSrc: 'assets/symptom-picker-blood-clot.png' },
      { id: 'discharge_more', name: '白带增多', icon: 'white', imgSrc: 'assets/symptom-picker-discharge-more.png' },
    ],
  },
  {
    id: 'more',
    title: '更多症状',
    editable: true,
    items: [
      { id: 'gas', name: '胃肠胀气', icon: 'zhangqi', imgSrc: 'assets/symptom-picker-gas.png', removable: true },
    ],
  },
];

const SYMPTOM_PICKER_ITEM_MAP = SYMPTOM_PICKER_GROUPS
  .flatMap((group) => group.items)
  .reduce((map, item) => ({ ...map, [item.id]: item }), {});

const DIET_MEAL_TYPES = [
  { id: 'breakfast', label: '早餐', defaultTime: '08:00' },
  { id: 'morning-snack', label: '早加餐', defaultTime: '10:30' },
  { id: 'lunch', label: '午餐', defaultTime: '12:30' },
  { id: 'afternoon-snack', label: '午加餐', defaultTime: '15:30' },
  { id: 'dinner', label: '晚餐', defaultTime: '18:30' },
  { id: 'evening-snack', label: '晚加餐', defaultTime: '22:00' },
  { id: 'drink', label: '饮品', defaultTime: '15:00' },
  { id: 'other', label: '其他', defaultTime: '12:00' },
];

function getDietDefaultTime(mealTypeId) {
  const item = DIET_MEAL_TYPES.find((m) => m.id === mealTypeId);
  return item ? item.defaultTime : '08:00';
}

const MONTH_BLOCKS_2025 = [
  { title: '10月', days: [null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
  { title: '11月', days: [null, null, null, null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
  { title: '12月', days: [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
];

const MONTH_BLOCKS_2026 = [
  { title: '1月', days: [null, null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
  { title: '2月', days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28] },
  { title: '3月', days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, { n: 16, period: true }, { n: 17, period: true }, { n: 18, period: true }, { n: 19, period: true }, { n: 20, period: true }, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
  { title: '4月', days: [null, null, null, 1, 2, 3, 4, 5, 6, { n: 7, period: true }, { n: 8, period: true }, { n: 9, period: true }, { n: 10, period: true }, { n: 11, period: true }, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
  { title: '5月', days: [null, null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, { n: 12, period: true }, { n: 13, period: true }, { n: 14, period: true }, { n: 15, period: true }, { n: 16, period: true }, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
  { title: '6月', days: [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, { n: 16, period: true }, { n: 17, period: true }, { n: 18, period: true }, { n: 19, period: true }, { n: 20, period: true }, 21, 22, 23, { n: 24, today: true }, 25, 26, 27, 28, 29, 30] },
  { title: '7月', days: [null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, { n: 15, period: true }, { n: 16, period: true }, { n: 17, period: true }, { n: 18, period: true }, { n: 19, period: true }, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
  { title: '8月', days: [null, null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, { n: 12, period: true }, { n: 13, period: true }, { n: 14, period: true }, { n: 15, period: true }, { n: 16, period: true }, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
  { title: '9月', days: [null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, { n: 16, period: true }, { n: 17, period: true }, { n: 18, period: true }, { n: 19, period: true }, { n: 20, period: true }, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
  { title: '10月', days: [null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, { n: 12, period: true }, { n: 13, period: true }, { n: 14, period: true }, { n: 15, period: true }, { n: 16, period: true }, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
  { title: '11月', days: [null, null, null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, { n: 12, period: true }, { n: 13, period: true }, { n: 14, period: true }, { n: 15, period: true }, { n: 16, period: true }, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
  { title: '12月', days: [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, { n: 15, period: true }, { n: 16, period: true }, { n: 17, period: true }, { n: 18, period: true }, { n: 19, period: true }, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
];

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 7v10M7 12h10"/>
    </svg>
  );
}

function PeriodKeyIcon() {
  return (
    <svg className="period-keyicon" viewBox="0 0 26 26" aria-hidden="true">
      <circle cx="13" cy="13" r="12" fill="#ffdbe7"/>
      <path
        d="M13 7C10 7 8 9.5 8 12.2 8 15.5 13 21 13 21 18 15.5 18 12.2 18 9.5 16 7 13 7Z"
        fill="#ff4d88"
        transform="rotate(180 13 13)"
      />
    </svg>
  );
}

function DietKeyIcon() {
  return (
    <span
      className="mock-list-icon is-circle diet-keyicon"
      style={{ '--mock-icon-bg': '#ffe7d6' }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 4v6" fill="none" stroke="#ff9a3c" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6.5 4h3" stroke="#ff9a3c" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6.5 4V3M8 4V3M9.5 4V3" stroke="#ff9a3c" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M8 10v9.5" stroke="#ff9a3c" strokeWidth="1.5" strokeLinecap="round"/>
        <path
          d="M15 4c0 2.5-1.8 4.5-3 4.5s-3-2-3-4.5"
          fill="none"
          stroke="#ff9a3c"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M12 8.5v11" stroke="#ff9a3c" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </span>
  );
}

function isPeriodDay(day) {
  return day != null && typeof day === 'object' && day.period;
}

function MonthDayCell({ day, index, days }) {
  if (day == null) return <span className="is-empty" aria-hidden="true"/>;

  const n = typeof day === 'object' ? day.n : day;
  const isPeriod = isPeriodDay(day);
  const isToday = typeof day === 'object' && day.today;
  const prevPeriod = isPeriodDay(days[index - 1]);
  const nextPeriod = isPeriodDay(days[index + 1]);

  const cls = [
    isPeriod ? 'is-period' : '',
    isPeriod && !prevPeriod ? 'is-period-start' : '',
    isPeriod && !nextPeriod ? 'is-period-end' : '',
    isToday ? 'is-today-label' : '',
  ].filter(Boolean).join(' ');

  return (
    <span className={cls || undefined}>
      {isToday ? '今' : n}
    </span>
  );
}

function MonthBlock({ block }) {
  return (
    <article className="record-month-block">
      <h4>{block.title}</h4>
      <div className="record-month-week">
        {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
      </div>
      <div className="record-month-days">
        {block.days.map((day, i) => (
          <MonthDayCell key={i} day={day} index={i} days={block.days}/>
        ))}
      </div>
    </article>
  );
}

function AnalysisNavIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="13" width="3.2" height="7" rx="1" fill="currentColor"/>
      <rect x="10.4" y="9" width="3.2" height="11" rx="1" fill="currentColor"/>
      <rect x="16.8" y="5" width="3.2" height="15" rx="1" fill="currentColor"/>
      <circle cx="17" cy="17" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M20 20l2 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function RecordViewFilterBar({
  activeFilter,
  activeFilterLabel,
  filterMenuOpen,
  onToggleMenu,
  onCloseMenu,
  onSelectFilter,
}) {
  return (
    <div className="record-view-filter-bar">
      <div className="record-mode-menu">
        <button
          type="button"
          className="record-filter-pill"
          aria-expanded={filterMenuOpen}
          aria-haspopup="listbox"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu();
          }}
        >
          {activeFilterLabel}
          <svg className="record-mode-chev" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 10l5 5 5-5"/>
          </svg>
        </button>
        {filterMenuOpen ? (
          <div className="record-filter-dropdown" role="listbox" aria-label="记录筛选">
            {FILTER_OPTIONS.map((item) => (
              <button
                key={item.key}
                type="button"
                role="option"
                aria-selected={activeFilter === item.key}
                className={activeFilter === item.key ? 'is-active' : ''}
                onClick={() => onSelectFilter(item.key)}
              >
                <span className="record-filter-option-icon" aria-hidden="true">
                  <RecordTypeIcon type={item.key} size={16}/>
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {filterMenuOpen ? (
        <button
          type="button"
          className="record-mode-menu-backdrop"
          aria-label="关闭菜单"
          onClick={onCloseMenu}
        />
      ) : null}
    </div>
  );
}

function RecordIcon() {
  return (
    <svg className="record-view-record-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  );
}

function RecordTypeIcon({ type, size = 12, color }) {
  const fill = color || getFilterType(type === 'all' ? 'all' : type).color;
  const props = {
    className: 'record-type-icon',
    viewBox: '0 0 24 24',
    width: size,
    height: size,
    'aria-hidden': true,
  };

  switch (type) {
    case 'all':
      return (
        <svg {...props}>
          <circle cx="7" cy="7" r="2.2" fill={fill}/>
          <circle cx="17" cy="7" r="2.2" fill={fill}/>
          <circle cx="7" cy="17" r="2.2" fill={fill}/>
          <circle cx="17" cy="17" r="2.2" fill={fill}/>
        </svg>
      );
    case 'period':
      return (
        <svg {...props}>
          <path
            d="M12 5.5C9.6 5.5 7.8 7.8 7.8 10.4c0 4.2 4.2 10.1 4.2 10.1s4.2-5.9 4.2-10.1c0-2.6-1.8-4.9-4.2-4.9z"
            fill={fill}
            transform="rotate(180 12 12)"
          />
        </svg>
      );
    case 'weight':
      return (
        <svg {...props} fill={fill}>
          <rect x="5" y="15" width="14" height="4.5" rx="1.5"/>
          <path d="M8.5 15V10a3.5 3.5 0 0 1 7 0v5"/>
          <rect x="10.5" y="7.5" width="3" height="2.5" rx="1"/>
        </svg>
      );
    case 'mood':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" fill={fill} opacity="0.18"/>
          <circle cx="9" cy="10" r="1.2" fill={fill}/>
          <circle cx="15" cy="10" r="1.2" fill={fill}/>
          <path d="M8.5 15c1.2 1.4 2.6 2 3.5 2s2.3-.6 3.5-2" fill="none" stroke={fill} strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      );
    case 'symptom':
      return (
        <svg {...props} fill="none" stroke={fill} strokeWidth="2" strokeLinecap="round">
          <rect x="5" y="5" width="14" height="14" rx="3"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
      );
    case 'sleep':
      return (
        <svg {...props}>
          <path d="M18 14.5A7.5 7.5 0 1 1 10.5 5a6 6 0 1 0 7.5 9.5z" fill={fill}/>
        </svg>
      );
    case 'diet':
      return (
        <svg {...props}>
          <path d="M12 3c-3 4-4 7-4 10a4 4 0 0 0 8 0c0-3-1-6-4-10z" fill={fill}/>
          <path d="M12 20v1" stroke={fill} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case 'love':
      return (
        <svg {...props}>
          <path
            d="M12 19.2S5.5 14.8 5.5 9.6C5.5 7.2 7.4 5.5 9.6 5.5c1.3 0 2.4.6 3.1 1.5.7-.9 1.8-1.5 3.1-1.5 2.2 0 4.1 1.7 4.1 4.1 0 5.2-6.5 9.6-6.5 9.6z"
            fill={fill}
          />
        </svg>
      );
    case 'stool':
      return (
        <svg {...props}>
          <path d="M8.5 8.5c0-2 1.6-3.5 3.5-3.5s3.5 1.5 3.5 3.5c1.8.4 3 2 3 3.8 0 2.2-1.8 4-4 4h-5c-2.2 0-4-1.8-4-4 0-1.8 1.2-3.4 3-3.8z" fill={fill}/>
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="4" fill={fill}/>
        </svg>
      );
  }
}

function CalendarRecordMarks({ records, activeFilter, isView, isSelected }) {
  const visible = activeFilter === 'all'
    ? records.slice(0, 3)
    : getFilteredRecords(records, activeFilter);

  if (!visible.length) return null;

  return (
    <span
      className={'calendar-day-records' + (isView ? ' is-view' : '')}
      aria-hidden="true"
    >
      {visible.map((type) => (
        <RecordTypeIcon
          key={type}
          type={type}
          size={11}
          color={isView && isSelected ? '#ffffff' : getFilterType(type).color}
        />
      ))}
    </span>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="diet-add-chevron" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const PERIOD_PICKER_FLOW = ['非常少量', '少量', '中量', '大量', '非常大量'];
const PERIOD_PICKER_COLOR = ['浅红色', '鲜红色', '深红色', '褐色', '黑色'];
const PERIOD_PICKER_CRAMPS = ['完全不痛', '轻微痛', '比较痛', '非常痛', '痛到极致'];
const PERIOD_DETAIL_PICKERS = {
  flow: { title: '流量', group: 'flow', options: PERIOD_PICKER_FLOW },
  color: { title: '颜色', group: 'color', options: PERIOD_PICKER_COLOR },
  cramps: { title: '痛经', group: 'cramps', options: PERIOD_PICKER_CRAMPS },
};

function PickerCheckIcon() {
  return (
    <span className="prp-ck" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M5 12.5 L10 17 L19 7.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

function PeriodPickerIcon({ type, index }) {
  if (type === 'flow') {
    const reds = ['#f4a9bb', '#ef85a0', '#ea5e82', '#e63d6b', '#e01f5b'];
    const marks = [
      { rx: 3.4, ry: 5.5, cy: 28 },
      { rx: 4.6, ry: 8.5, cy: 30 },
      { rx: 6.2, ry: 11, cy: 31 },
      { rx: 7.8, ry: 13.5, cy: 32 },
      { rx: 9.2, ry: 16, cy: 32 },
    ];
    const mark = marks[index];
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="20" y="14" width="24" height="38" rx="12" fill="#fff" stroke="rgba(255,77,136,.16)" strokeWidth="1"/>
        <path
          d={`M32 ${mark.cy - mark.ry} C ${32 + mark.rx * 1.1} ${mark.cy - mark.ry * 0.4}, ${32 + mark.rx * 1.05} ${mark.cy + mark.ry * 0.7}, 32 ${mark.cy + mark.ry} C ${32 - mark.rx * 1.05} ${mark.cy + mark.ry * 0.7}, ${32 - mark.rx * 1.1} ${mark.cy - mark.ry * 0.4}, 32 ${mark.cy - mark.ry} Z`}
          fill={reds[index]}
        />
      </svg>
    );
  }

  if (type === 'color') {
    const drop = ['#f08a86', '#e94b3f', '#c0202b', '#7d3a1e', '#2c1a16'][index];
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M32 17 C32 25 44 33 44 41 C44 48 38.6 53 32 53 C25.4 53 20 48 20 41 C20 33 32 25 32 17 Z" fill={drop}/>
        <ellipse cx="27" cy="40" rx="2.8" ry="4.4" fill="rgba(255,255,255,.34)"/>
      </svg>
    );
  }

  const sym = '#ec3f80';
  const symbols = [
    <g key="sprout">
      <path d="M32 45 C32 39 32 36 32 32" stroke={sym} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M32 38 C28.2 38 25.2 36 24 31.6 C28.2 31.6 31 33.8 32 38 Z" fill={sym}/>
      <path d="M32 35 C35.8 35 38.8 33 40 28.6 C35.8 28.6 33 30.8 32 35 Z" fill={sym}/>
    </g>,
    <g key="bow" fill={sym}>
      <path d="M32 36 L21.5 30 L21.5 42 Z"/>
      <path d="M32 36 L42.5 30 L42.5 42 Z"/>
      <circle cx="32" cy="36" r="3.2"/>
    </g>,
    <path key="bolt" d="M35.5 28 L26 40.5 L31.2 40.5 L29 48 L39 34 L33.4 34 Z" fill={sym}/>,
    <g key="spark" fill={sym}>
      <path d="M32 28 C33 34 34 35 40 37 C34 39 33 40 32 46 C31 40 30 39 24 37 C30 35 31 34 32 28 Z"/>
      <circle cx="42.6" cy="29.6" r="1.8"/>
      <circle cx="22.4" cy="44" r="1.5"/>
    </g>,
    <g key="swirl" stroke={sym} strokeWidth="2.2" fill="none" strokeLinecap="round">
      <path d="M27.6 34 C24 34 22.8 37.6 25.2 39.8 C27.4 41.8 30.9 40.2 30.4 36.9 C30.1 34.6 28.2 33.7 26.4 35"/>
      <path d="M36.4 34 C40 34 41.2 37.6 38.8 39.8 C36.6 41.8 33.1 40.2 33.6 36.9 C33.9 34.6 35.8 33.7 37.6 35"/>
    </g>,
  ];
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M18 22 L46 22 Q49.5 22 49.5 25.5 L49.5 31 C49.5 39.5 43.5 45 38.5 44.4 C35.4 44 33.4 42 32 40.6 C30.6 42 28.6 44 25.5 44.4 C20.5 45 14.5 39.5 14.5 31 L14.5 25.5 Q14.5 22 18 22 Z" fill="#fcdccf"/>
      {symbols[index]}
    </svg>
  );
}

function PeriodPickerOptions({ title, group, options, value, onChange }) {
  return (
    <section className="prp-card">
      <h3 className="prp-sec-title">{title}</h3>
      <div className="prp-row">
        {options.map((label, index) => {
          const selected = value === index;
          return (
            <button
              key={label}
              type="button"
              className={'prp-opt' + (selected ? ' sel' : '')}
              aria-pressed={selected}
              aria-label={label}
              onClick={() => onChange(selected ? null : index)}
            >
              <span className="prp-ic">
                <span className="prp-ic-inner">
                  <PeriodPickerIcon type={group} index={index}/>
                </span>
                <PickerCheckIcon/>
              </span>
              <span className="prp-lb">{label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function PeriodRecordPicker({ open, onCancel, onConfirm }) {
  const [portalTarget] = useState(() => document.querySelector('.phone'));
  const [flow, setFlow] = useState(null);
  const [color, setColor] = useState(null);
  const [cramps, setCramps] = useState(null);
  const [hour, setHour] = useState(10);
  const [minute, setMinute] = useState(0);
  const timeDragRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setFlow(null);
    setColor(null);
    setCramps(null);
    setHour(10);
    setMinute(0);
  }, [open]);

  useEffect(() => {
    const phone = portalTarget;
    if (!phone) return undefined;
    if (open) phone.classList.add('is-period-picker-open');
    else phone.classList.remove('is-period-picker-open');
    return () => phone.classList.remove('is-period-picker-open');
  }, [open, portalTarget]);

  const value = {
    flow: flow != null ? PERIOD_PICKER_FLOW[flow] : null,
    color: color != null ? PERIOD_PICKER_COLOR[color] : null,
    cramps: cramps != null ? PERIOD_PICKER_CRAMPS[cramps] : null,
    time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
  };

  const changeTimePart = (part, delta) => {
    const apply = (current, max) => Math.max(0, Math.min(max, current + delta));
    if (part === 'hour') setHour((current) => apply(current, 23));
    if (part === 'minute') setMinute((current) => apply(current, 59));
  };

  const updateTimeDrag = (clientY) => {
    const drag = timeDragRef.current;
    if (!drag) return;
    drag.carry += clientY - drag.lastY;
    drag.lastY = clientY;
    const step = 18;
    while (drag.carry <= -step) {
      changeTimePart(drag.part, 1);
      drag.carry += step;
    }
    while (drag.carry >= step) {
      changeTimePart(drag.part, -1);
      drag.carry -= step;
    }
  };

  const startTimeDragAt = (part, clientY, pointerId = null, source = 'mouse') => {
    timeDragRef.current = {
      part,
      pointerId,
      source,
      lastY: clientY,
      carry: 0,
    };
  };

  const startTimeDrag = (part, event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    startTimeDragAt(part, event.clientY, event.pointerId, 'pointer');
  };

  const moveTimeDrag = (event) => {
    const drag = timeDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    updateTimeDrag(event.clientY);
  };

  const stopTimeDrag = (event) => {
    const drag = timeDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    timeDragRef.current = null;
  };

  useEffect(() => {
    if (!open) return undefined;
    const onMouseMove = (event) => {
      if (!timeDragRef.current || timeDragRef.current.source === 'pointer') return;
      event.preventDefault();
      updateTimeDrag(event.clientY);
    };
    const onTouchMove = (event) => {
      if (!timeDragRef.current || timeDragRef.current.source === 'pointer') return;
      event.preventDefault();
      updateTimeDrag(event.touches[0]?.clientY ?? timeDragRef.current.lastY);
    };
    const end = () => {
      timeDragRef.current = null;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: false });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', end);
    window.addEventListener('touchcancel', end);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', end);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', end);
      window.removeEventListener('touchcancel', end);
    };
  }, [open]);

  if (!open || !portalTarget) return null;

  const picker = (
    <div className="prp-mask" onClick={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <div className="prp-sheet" role="dialog" aria-modal="true" aria-label="今日经期记录">
        <header className="prp-bar">
          <button type="button" className="prp-cancel" onClick={onCancel}>取消</button>
          <h2 className="prp-title">今日经期记录</h2>
          <button type="button" className="prp-confirm" onClick={() => onConfirm(value)}>确定</button>
        </header>
        <div className="prp-body">
          <PeriodPickerOptions title="流量" group="flow" options={PERIOD_PICKER_FLOW} value={flow} onChange={setFlow}/>
          <PeriodPickerOptions title="颜色" group="color" options={PERIOD_PICKER_COLOR} value={color} onChange={setColor}/>
          <PeriodPickerOptions title="痛经" group="cramps" options={PERIOD_PICKER_CRAMPS} value={cramps} onChange={setCramps}/>
          <section className="prp-card prp-time-card">
            <h3 className="prp-sec-title">时间</h3>
            <div className="prp-wheel-wrap">
              <div className="prp-fixed-time" aria-label={`时间 ${value.time}`}>
                <button
                  type="button"
                  className="prp-time-number"
                  aria-label="调整小时"
                  onPointerDown={(event) => startTimeDrag('hour', event)}
                  onPointerMove={moveTimeDrag}
                  onPointerUp={stopTimeDrag}
                  onPointerCancel={stopTimeDrag}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    startTimeDragAt('hour', event.clientY, null, 'mouse');
                  }}
                  onTouchStart={(event) => {
                    startTimeDragAt('hour', event.touches[0]?.clientY ?? 0, null, 'touch');
                  }}
                >
                  {String(hour).padStart(2, '0')}
                </button>
                <span className="prp-colon">:</span>
                <button
                  type="button"
                  className="prp-time-number"
                  aria-label="调整分钟"
                  onPointerDown={(event) => startTimeDrag('minute', event)}
                  onPointerMove={moveTimeDrag}
                  onPointerUp={stopTimeDrag}
                  onPointerCancel={stopTimeDrag}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    startTimeDragAt('minute', event.clientY, null, 'mouse');
                  }}
                  onTouchStart={(event) => {
                    startTimeDragAt('minute', event.touches[0]?.clientY ?? 0, null, 'touch');
                  }}
                >
                  {String(minute).padStart(2, '0')}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  if (window.ReactDOM?.createPortal) {
    return window.ReactDOM.createPortal(picker, portalTarget);
  }
  return picker;
}

function PeriodSinglePicker({ open, type, value, onCancel, onConfirm }) {
  const [portalTarget] = useState(() => document.querySelector('.phone'));
  const [selected, setSelected] = useState(null);
  const config = PERIOD_DETAIL_PICKERS[type];

  useEffect(() => {
    if (!open || !config) return;
    const index = config.options.indexOf(value);
    setSelected(index >= 0 ? index : null);
  }, [open, config, value]);

  useEffect(() => {
    const phone = portalTarget;
    if (!phone) return undefined;
    if (open) phone.classList.add('is-period-picker-open');
    else phone.classList.remove('is-period-picker-open');
    return () => phone.classList.remove('is-period-picker-open');
  }, [open, portalTarget]);

  if (!open || !portalTarget || !config) return null;

  const picker = (
    <div className="prp-mask" onClick={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <div className="prp-sheet prp-sheet-single" role="dialog" aria-modal="true" aria-label={config.title}>
        <header className="prp-bar">
          <button type="button" className="prp-cancel" onClick={onCancel}>取消</button>
          <h2 className="prp-title">{config.title}</h2>
          <button
            type="button"
            className="prp-confirm"
            disabled={selected == null}
            onClick={() => {
              if (selected == null) return;
              onConfirm({ type, value: config.options[selected] });
            }}
          >
            确定
          </button>
        </header>
        <div className="prp-body">
          <PeriodPickerOptions
            title={config.title}
            group={config.group}
            options={config.options}
            value={selected}
            onChange={setSelected}
          />
        </div>
      </div>
    </div>
  );

  if (window.ReactDOM?.createPortal) {
    return window.ReactDOM.createPortal(picker, portalTarget);
  }
  return picker;
}

function DietAddSheet({ open, onClose, onDone }) {
  const [mealType, setMealType] = useState('breakfast');
  const [time, setTime] = useState('08:00');
  const [foodName, setFoodName] = useState('');
  const [amount, setAmount] = useState('');
  const [amountUnit, setAmountUnit] = useState('g');
  const [calories, setCalories] = useState('');
  const [photos, setPhotos] = useState([]);
  const [portalTarget] = useState(() => document.querySelector('.phone'));
  const timeInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const photosRef = useRef([]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    if (!open) return;
    setMealType('breakfast');
    setTime('08:00');
    setFoodName('');
    setAmount('');
    setAmountUnit('g');
    setCalories('');
    setPhotos([]);
  }, [open]);

  useEffect(() => {
    const phone = portalTarget;
    if (!phone) return undefined;
    if (open) phone.classList.add('is-diet-sheet-open');
    else phone.classList.remove('is-diet-sheet-open');
    return () => phone.classList.remove('is-diet-sheet-open');
  }, [open, portalTarget]);

  const releasePhotos = () => {
    photosRef.current.forEach((url) => URL.revokeObjectURL(url));
  };

  const handleClose = () => {
    releasePhotos();
    onClose();
  };

  const handleMealTypeChange = (id) => {
    setMealType(id);
    setTime(getDietDefaultTime(id));
    setAmountUnit(id === 'drink' ? 'ml' : 'g');
  };

  const handlePhotoPick = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const urls = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...urls]);
    event.target.value = '';
  };

  const handleDone = () => {
    onDone?.({
      mealType,
      time,
      foodName: foodName.trim(),
      amount: amount.trim(),
      amountUnit,
      calories: calories.trim(),
      photos,
    });
    handleClose();
  };

  if (!open || !portalTarget) return null;

  const sheet = (
    <>
      <div className="diet-add-mask" onClick={handleClose} aria-hidden="true"/>
      <div className="diet-add-sheet" role="dialog" aria-modal="true" aria-label="添加饮食">
        <header className="diet-add-header">
          <button type="button" className="diet-add-header-btn" onClick={handleClose}>取消</button>
          <h2 className="diet-add-title">添加饮食</h2>
          <button type="button" className="diet-add-header-btn is-primary" onClick={handleDone}>完成</button>
        </header>

        <div className="diet-add-body">
          <section className="diet-add-card">
            <h3 className="diet-add-card-title">餐式类型</h3>
            <div className="diet-meal-grid" role="listbox" aria-label="餐式类型">
              {DIET_MEAL_TYPES.map((meal) => (
                <button
                  key={meal.id}
                  type="button"
                  role="option"
                  aria-selected={mealType === meal.id}
                  className={'diet-meal-chip' + (mealType === meal.id ? ' is-active' : '')}
                  onClick={() => handleMealTypeChange(meal.id)}
                >
                  {meal.label}
                </button>
              ))}
            </div>
          </section>

          <section className="diet-add-card diet-add-form-card">
            <div className="diet-add-row is-link">
              <span className="diet-add-label">时间</span>
              <button
                type="button"
                className="diet-add-time-btn"
                onClick={() => timeInputRef.current?.showPicker?.() || timeInputRef.current?.click()}
              >
                <span>{time}</span>
                <ChevronRightIcon/>
                <input
                  ref={timeInputRef}
                  type="time"
                  className="diet-add-time-input"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  aria-label="选择时间"
                />
              </button>
            </div>
            <div className="diet-add-row">
              <span className="diet-add-label">食物名称</span>
              <input
                type="text"
                className="diet-add-input"
                placeholder="请输入"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                aria-label="食物名称"
              />
            </div>
            <div className="diet-add-row">
              <span className="diet-add-label">数量</span>
              <div className="diet-add-row-end">
                <input
                  type="text"
                  inputMode="decimal"
                  className="diet-add-input diet-add-input-short"
                  placeholder="请输入"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  aria-label="数量"
                />
                <div className="diet-unit-toggle" role="group" aria-label="数量单位">
                  <button
                    type="button"
                    className={amountUnit === 'g' ? 'is-active' : ''}
                    onClick={() => setAmountUnit('g')}
                  >
                    克
                  </button>
                  <button
                    type="button"
                    className={amountUnit === 'ml' ? 'is-active' : ''}
                    onClick={() => setAmountUnit('ml')}
                  >
                    毫升
                  </button>
                </div>
              </div>
            </div>
            <div className="diet-add-row">
              <span className="diet-add-label">总热量</span>
              <div className="diet-add-row-end">
                <input
                  type="text"
                  inputMode="decimal"
                  className="diet-add-input diet-add-input-short"
                  placeholder="请输入"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  aria-label="总热量"
                />
                <span className="diet-add-unit">千卡</span>
              </div>
            </div>
          </section>

          <section className="diet-add-card diet-add-photo-card">
            <h3 className="diet-add-card-title">饮食备注</h3>
            <div className="diet-photo-grid">
              {photos.map((url, index) => (
                <div key={url} className="diet-photo-thumb">
                  <img src={url} alt="" />
                  <button
                    type="button"
                    className="diet-photo-remove"
                    aria-label="删除照片"
                    onClick={() => {
                      const url = photos[index];
                      if (url) URL.revokeObjectURL(url);
                      setPhotos((prev) => prev.filter((_, i) => i !== index));
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="diet-photo-add"
                onClick={() => photoInputRef.current?.click()}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 8h3l1.5-2h7L17 8h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="13" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span>添加照片</span>
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                multiple
                className="diet-photo-file"
                onChange={handlePhotoPick}
                aria-hidden="true"
                tabIndex={-1}
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );

  if (window.ReactDOM?.createPortal) {
    return window.ReactDOM.createPortal(sheet, portalTarget);
  }
  return sheet;
}

function SymptomPickerGlyph({ icon, imgSrc, label }) {
  if (imgSrc) return <img src={imgSrc} alt="" draggable={false} />;
  return <span dangerouslySetInnerHTML={{ __html: SYMPTOM_PICKER_ICONS[icon] || '' }} />;
}

function SymptomPickerSheet({ open, value = [], onCancel, onConfirm }) {
  const [portalTarget] = useState(() => document.querySelector('.phone'));
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [editing, setEditing] = useState(false);
  const [removedIds, setRemovedIds] = useState(new Set());
  const [toast, setToast] = useState('');
  const toastTimerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setSelectedIds(new Set((value || []).map((item) => item.id)));
    setEditing(false);
    setRemovedIds(new Set());
    setToast('');
  }, [open, value]);

  useEffect(() => {
    const phone = portalTarget;
    if (!phone) return undefined;
    if (open) phone.classList.add('is-symptom-picker-open');
    else phone.classList.remove('is-symptom-picker-open');
    return () => phone.classList.remove('is-symptom-picker-open');
  }, [open, portalTarget]);

  useEffect(() => () => clearTimeout(toastTimerRef.current), []);

  const showToast = (text) => {
    setToast(text);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(''), 1800);
  };

  const toggleItem = (item) => {
    if (editing && item.removable) {
      setRemovedIds((prev) => new Set([...prev, item.id]));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
      showToast('已移除「' + item.name + '」');
      return;
    }

    setSelectedIds((prev) => {
      const next = new Set(prev);
      const isOn = next.has(item.id);
      if (item.exclusive) {
        next.clear();
        if (!isOn) next.add(item.id);
        return next;
      }
      SYMPTOM_PICKER_GROUPS
        .flatMap((group) => group.items)
        .filter((candidate) => candidate.exclusive)
        .forEach((candidate) => next.delete(candidate.id));
      if (isOn) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
  };

  const confirm = () => {
    if (selectedIds.size === 0) {
      showToast('未选择任何症状');
      return;
    }
    const selected = [...selectedIds]
      .map((id) => SYMPTOM_PICKER_ITEM_MAP[id])
      .filter(Boolean);
    onConfirm?.(selected);
  };

  if (!open || !portalTarget) return null;

  const picker = (
    <>
      <div className="symptom-picker-mask" onClick={onCancel} aria-hidden="true"/>
      <div className="symptom-picker-sheet" role="dialog" aria-modal="true" aria-label="症状">
        <header className="symptom-picker-nav">
          <button type="button" className="symptom-picker-nav-btn" onClick={onCancel}>取消</button>
          <h2 className="symptom-picker-title">症状</h2>
          <button type="button" className="symptom-picker-nav-btn is-primary" onClick={confirm}>确定</button>
        </header>
        <div className="symptom-picker-scroll">
          {SYMPTOM_PICKER_GROUPS.map((group) => {
            const items = group.items.filter((item) => !removedIds.has(item.id));
            return (
              <section
                key={group.id}
                className={'symptom-picker-card' + (editing && group.editable ? ' editing' : '')}
              >
                <div className="symptom-picker-card-head">
                  <h3 className="symptom-picker-card-title">{group.title}</h3>
                  {group.editable ? (
                    <button
                      type="button"
                      className={'symptom-picker-edit' + (editing ? ' is-active' : '')}
                      onClick={() => setEditing((current) => !current)}
                    >
                      {editing ? '完成' : '编辑'}
                    </button>
                  ) : null}
                </div>
                <div className="symptom-picker-grid">
                  {items.map((item) => {
                    const selected = selectedIds.has(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={
                          'symptom-picker-cell'
                          + (selected ? ' is-selected' : '')
                          + (item.removable ? ' removable' : '')
                        }
                        aria-pressed={selected}
                        onClick={() => toggleItem(item)}
                      >
                        <span className="symptom-picker-check" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        <span className="symptom-picker-del" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none"><path d="M6 12h12" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></svg>
                        </span>
                        <span className="symptom-picker-icon" aria-hidden="true">
                          <SymptomPickerGlyph icon={item.icon} imgSrc={item.imgSrc} label={item.name}/>
                        </span>
                        <span className="symptom-picker-label">{item.name}</span>
                      </button>
                    );
                  })}
                  {group.editable ? (
                    <button type="button" className="symptom-picker-cell add" onClick={() => showToast('打开「添加自定义症状」')}>
                      <span className="symptom-picker-icon" aria-hidden="true">
                        <svg viewBox="0 0 48 48"><path d="M24 17v14M17 24h14" stroke="#bdbdc2" strokeWidth="2.4" strokeLinecap="round"/></svg>
                      </span>
                      <span className="symptom-picker-label">添加症状</span>
                    </button>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
        <div className={'symptom-picker-toast' + (toast ? ' show' : '')}>{toast}</div>
      </div>
    </>
  );

  if (window.ReactDOM?.createPortal) {
    return window.ReactDOM.createPortal(picker, portalTarget);
  }
  return picker;
}

function HealthMorphRecordPane({
  item,
  periodYes,
  onPeriodYes,
  onPeriodNo,
  onDietAdd,
  onSymptomAdd,
  onPeriodDetailAdd,
  periodDetailDemoEnabled,
  periodDetailValues,
  symptomValues,
}) {
  if (item.recordType === 'segment') {
    return (
      <div className="ios26-segmented" role="tablist" aria-label="是否选择">
        <button
          type="button"
          role="tab"
          aria-selected={periodYes}
          className={periodYes ? 'is-active' : ''}
          onClick={onPeriodYes}
        >
          是
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!periodYes}
          className={!periodYes ? 'is-active' : ''}
          onClick={onPeriodNo}
        >
          否
        </button>
      </div>
    );
  }

  if (item.recordType === 'mood') {
    return (
      <div className="list-mood-actions">
        <span className="list-mood-emojis" aria-hidden="true">
          <span>🥳</span>
          <span>👻</span>
          <span>😐</span>
          <span>🐼</span>
          <span>😎</span>
        </span>
        <button type="button" className="list-add" aria-label={'新增' + item.label}>
          <PlusIcon/>
        </button>
      </div>
    );
  }

  if (item.recordType === 'diary') {
    return (
      <div className="list-diary-actions">
        <svg className="list-camera" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 8h3l1.5-2h7L17 8h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"/>
          <circle cx="12" cy="13" r="3.2"/>
        </svg>
        <svg className="list-chevron" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    );
  }

  if (item.recordType === 'habit') {
    return (
      <div className="list-habit-actions">
        <span className="list-habit-icons" aria-hidden="true">🍞🍎🥤⚾</span>
      </div>
    );
  }

  if (item.recordType === 'diet') {
    return (
      <button type="button" className="list-add" onClick={onDietAdd} aria-label={'新增' + item.label}>
        <PlusIcon/>
      </button>
    );
  }

  if (item.id === 'symptom') {
    return (
      <div className="list-symptom-actions">
        {symptomValues?.length ? (
          <div className="list-symptom-tags" aria-label="已选症状">
            {symptomValues.slice(0, 2).map((symptom) => (
              <span key={symptom.id}>{symptom.name}</span>
            ))}
            {symptomValues.length > 2 ? <span>+{symptomValues.length - 2}</span> : null}
          </div>
        ) : null}
        <button type="button" className="list-add" onClick={onSymptomAdd} aria-label={'新增' + item.label}>
          <PlusIcon/>
        </button>
      </div>
    );
  }

  if (['flow', 'color', 'cramps'].includes(item.id)) {
    const currentValue = periodDetailValues?.[item.id];
    return (
      <div className="list-period-detail-actions">
        {currentValue ? <span className="list-period-detail-value">{currentValue}</span> : null}
        <button
          type="button"
          className="list-add"
          disabled={!periodDetailDemoEnabled}
          onClick={() => onPeriodDetailAdd?.(item.id)}
          aria-label={'新增' + item.label}
        >
          <PlusIcon/>
        </button>
      </div>
    );
  }

  return (
    <button type="button" className="list-add" aria-label={'新增' + item.label}>
      <PlusIcon/>
    </button>
  );
}

function HealthMorphRow({
  item,
  index,
  periodYes,
  periodEndMode,
  onPeriodYes,
  onPeriodNo,
  onDietAdd,
  onSymptomAdd,
  onPeriodDetailAdd,
  periodDetailDemoEnabled,
  periodDetailValues,
  symptomValues,
}) {
  const delay = (index * 50) + 'ms';
  const label = item.id === 'period' && periodEndMode ? '月经走喽' : item.label;

  return (
    <div className="health-morph-row" style={{ '--row-delay': delay }}>
      <div className="health-morph-body">
        <div className="health-morph-left" aria-hidden="true">
          <div className="health-morph-icon-slot">
            {item.id === 'period' ? (
              <PeriodKeyIcon/>
            ) : item.id === 'diet' ? (
              <DietKeyIcon/>
            ) : (
              item.iconSrc ? (
                <img className="mock-list-img" src={item.iconSrc} alt="" />
              ) : (
                <span
                  className={'mock-list-icon ' + item.iconShape}
                  style={{ '--mock-icon-bg': item.iconBg }}
                />
              )
            )}
          </div>
        </div>
        <div className="health-morph-label">{label}</div>
        <div className="health-morph-right">
          <HealthMorphRecordPane
            item={item}
            periodYes={periodYes}
            onPeriodYes={onPeriodYes}
            onPeriodNo={onPeriodNo}
            onDietAdd={onDietAdd}
            onSymptomAdd={onSymptomAdd}
            onPeriodDetailAdd={onPeriodDetailAdd}
            periodDetailDemoEnabled={periodDetailDemoEnabled}
            periodDetailValues={periodDetailValues}
            symptomValues={symptomValues}
          />
        </div>
      </div>
    </div>
  );
}

function HealthMorphList({
  periodYes,
  periodEndMode,
  onPeriodYes,
  onPeriodNo,
  onDietAdd,
  onSymptomAdd,
  onPeriodDetailAdd,
  periodDetailDemoEnabled,
  periodDetailValues,
  symptomValues,
}) {
  return (
    <div className="health-morph-list" aria-label="健康记录列表">
      {MORPH_ITEMS.map((item, index) => (
        <HealthMorphRow
          key={item.id}
          item={item}
          index={index}
          periodYes={periodYes}
          periodEndMode={periodEndMode}
          onPeriodYes={onPeriodYes}
          onPeriodNo={onPeriodNo}
          onDietAdd={onDietAdd}
          onSymptomAdd={onSymptomAdd}
          onPeriodDetailAdd={onPeriodDetailAdd}
          periodDetailDemoEnabled={periodDetailDemoEnabled}
          periodDetailValues={periodDetailValues}
          symptomValues={symptomValues}
        />
      ))}
    </div>
  );
}

function CalendarDayLabel({ day }) {
  return (
    <>
      <span className="calendar-day-number">{day.n}</span>
      {day.today ? <b>今天</b> : null}
    </>
  );
}

function PeriodStartPlayIcon() {
  return (
    <span className="period-start-play" aria-hidden="true">
      <svg viewBox="0 0 12 12">
        <path d="M4.2 2.8v6.4L9 6 4.2 2.8z"/>
      </svg>
    </span>
  );
}

function KitCalendarDayButton({ day, selected, periodLit, periodFlow, periodStartSettled, onSelect }) {
  if (!day) return <span className="calendar-day" aria-hidden="true"/>;

  const isPeriod = !!(day.period || periodLit);
  const flowStyle = periodFlow ? {
    '--period-liquid-level': `${periodFlow.level}%`,
    '--period-liquid-duration': `${periodFlow.duration}ms`,
  } : undefined;
  const cls = [
    'calendar-day',
    day.fertile ? 'is-fertile' : '',
    isPeriod ? 'is-period' : '',
    periodLit ? 'is-period-lit' : '',
    periodFlow ? 'is-period-flow' : '',
    periodFlow?.phase === 'filling' ? 'is-period-flow-filling' : '',
    periodStartSettled ? 'is-period-start-settled' : '',
    day.predicted ? 'is-predicted' : '',
    day.today ? 'is-today' : '',
    selected ? 'is-selected' : '',
  ].filter(Boolean).join(' ');

  return (
    <button type="button" className={cls} style={flowStyle} onClick={() => onSelect(day.n)}>
      {periodFlow ? (
        <span className="calendar-liquid" aria-hidden="true">
          <span className="calendar-liquid-label">
            <CalendarDayLabel day={day}/>
          </span>
        </span>
      ) : null}
      {periodStartSettled ? <PeriodStartPlayIcon/> : null}
      {day.heart ? (
        <img className="calendar-icon is-floating" src={ICON_HEART} alt=""/>
      ) : null}
      {day.ovulation ? (
        <img className="calendar-icon is-floating" src={ICON_OVULATION} alt=""/>
      ) : null}
      {day.todayMark ? (
        <img className="calendar-icon is-today-mark" src={ICON_TODAY} alt=""/>
      ) : null}
      {day.marks?.length ? (
        <>
          <CalendarDayLabel day={day}/>
          <span className="calendar-day-icons" aria-hidden="true">
            {day.marks.map((key) => (
              <img key={key} className="calendar-icon" src={YELLOW_MARK_ICONS[key]} alt=""/>
            ))}
          </span>
        </>
      ) : (
        <CalendarDayLabel day={day}/>
      )}
    </button>
  );
}

function CalendarDayButton({ day, selected, periodLit, onSelect, isView, activeFilter }) {
  if (!isView) {
    return (
      <KitCalendarDayButton
        day={day}
        selected={selected}
        periodLit={periodLit}
        periodFlow={day?.periodFlow}
        periodStartSettled={day?.periodStartSettled}
        onSelect={onSelect}
      />
    );
  }

  if (!day) return <span className="calendar-day is-empty" aria-hidden="true"/>;

  const isPeriod = !!(day.period || periodLit);
  const records = getCalendarRecordTypes(day.n, isPeriod);
  const hasFilteredRecord = dayHasFilteredRecord(records, activeFilter);
  const showOvulation = !!day.ovulation;
  const cls = [
    'calendar-day',
    day.fertile ? 'is-fertile' : '',
    isPeriod ? 'is-period' : '',
    periodLit ? 'is-period-lit' : '',
    day.today ? 'is-today' : '',
    selected ? 'is-selected' : '',
    isView ? 'is-view-cell' : '',
    hasFilteredRecord ? 'has-records' : '',
  ].filter(Boolean).join(' ');

  const recordSlot = hasFilteredRecord ? (
    <CalendarRecordMarks
      records={records}
      activeFilter={activeFilter}
      isView={isView}
      isSelected={selected}
    />
  ) : (
    <span
      className={'calendar-day-records is-slot' + (isView ? ' is-view' : '')}
      aria-hidden="true"
    />
  );

  return (
    <button type="button" className={cls} onClick={() => onSelect(day.n)}>
      <span
        className={'calendar-day-ovulation' + (showOvulation ? '' : ' is-slot')}
        aria-hidden="true"
      >
        {showOvulation ? (
          <img className="calendar-icon is-ovulation" src={ICON_OVULATION} alt=""/>
        ) : null}
      </span>
      <span className="calendar-day-number">{day.n}</span>
      {recordSlot}
    </button>
  );
}

function RecordPage({
  onAnalysisReady,
  onPeriodEndAnalysisReady,
  onPeriodReset,
  onPeriodRecordSubmit,
  onPeriodDetailRecordSubmit,
  onSymptomRecordSubmit,
  periodDetailValues,
  periodDetailDemoEnabled = false,
  periodFlowEnabled = true,
  periodEndRecordReady = false,
  periodEndRecordCompleted = false,
}) {
  const settledPeriodDays = React.useMemo(
    () => periodEndRecordCompleted ? [...PERIOD_DAYS, ...PERIOD_END_DAYS] : PERIOD_DAYS,
    [periodEndRecordCompleted]
  );
  const [activeMode, setActiveMode] = useState(0);
  const [selectedDay, setSelectedDay] = useState(periodEndRecordReady ? 21 : 14);
  const [periodYes, setPeriodYes] = useState(false);
  const [litDays, setLitDays] = useState(periodEndRecordReady ? settledPeriodDays : []);
  const [periodFlowLevels, setPeriodFlowLevels] = useState({});
  const [periodFlowPhase, setPeriodFlowPhase] = useState('idle');
  const [monthOpen, setMonthOpen] = useState(false);
  const [legendCollapsed, setLegendCollapsed] = useState(false);
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [dietSheetOpen, setDietSheetOpen] = useState(false);
  const [symptomSheetOpen, setSymptomSheetOpen] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [periodPickerOpen, setPeriodPickerOpen] = useState(false);
  const [singlePickerType, setSinglePickerType] = useState(null);
  const dragAreaRef = useRef(null);
  const gridRef = useRef(null);
  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    if (!periodEndRecordReady) return;
    clearTimers();
    setSelectedDay(21);
    setPeriodYes(false);
    setLitDays(settledPeriodDays);
    setPeriodFlowLevels({});
    setPeriodFlowPhase('settled');
    setPeriodPickerOpen(false);
  }, [clearTimers, periodEndRecordReady, settledPeriodDays]);

  const resetPeriod = useCallback(() => {
    clearTimers();
    setPeriodYes(false);
    setLitDays([]);
    setPeriodFlowLevels({});
    setPeriodFlowPhase('idle');
    setPeriodPickerOpen(false);
    onPeriodReset?.();
  }, [clearTimers, onPeriodReset]);

  const runPeriodAnimation = useCallback(() => {
    clearTimers();
    setLitDays([]);
    setPeriodFlowLevels({});
    setPeriodFlowPhase('rising');
    PERIOD_DAYS.forEach((d, i) => {
      const startDelay = getPeriodFlowStartDelay(i);
      const startTimer = setTimeout(() => {
        setPeriodFlowLevels((prev) => ({ ...prev, [d]: 0 }));
      }, startDelay);
      const riseTimer = setTimeout(() => {
        setPeriodFlowLevels((prev) => ({ ...prev, [d]: PERIOD_FLOW_LEVELS[i] }));
      }, startDelay + 24);
      timersRef.current.push(startTimer, riseTimer);
    });
    const fillTimer = setTimeout(() => {
      setPeriodFlowPhase('filling');
      setPeriodFlowLevels(() => {
        const next = {};
        PERIOD_DAYS.forEach((d) => {
          next[d] = 100;
        });
        return next;
      });
    }, PERIOD_FLOW_FILL_AT_MS);
    timersRef.current.push(fillTimer);
    const settleTimer = setTimeout(() => {
      setPeriodFlowLevels({});
      setPeriodFlowPhase('settled');
      setLitDays([14]);
      if (periodFlowEnabled) onAnalysisReady?.();
    }, PERIOD_FLOW_SETTLE_AT_MS);
    timersRef.current.push(settleTimer);
  }, [clearTimers, onAnalysisReady, periodFlowEnabled]);

  const runPeriodEndAnimation = useCallback(() => {
    clearTimers();
    setPeriodYes(true);
    setPeriodPickerOpen(false);
    setPeriodFlowLevels({});
    setPeriodFlowPhase('settled');
    setLitDays(PERIOD_DAYS);
    PERIOD_END_DAYS.forEach((d, i) => {
      const timer = setTimeout(() => {
        setLitDays((prev) => prev.includes(d) ? prev : [...prev, d]);
      }, 220 + i * 260);
      timersRef.current.push(timer);
    });
    const noticeTimer = setTimeout(() => {
      onPeriodEndAnalysisReady?.();
    }, 220 + PERIOD_END_DAYS.length * 260 + 220);
    timersRef.current.push(noticeTimer);
  }, [clearTimers, onPeriodEndAnalysisReady]);

  const handlePeriodToggle = (yes) => {
    if (yes) {
      if (periodYes) return;
      if (periodEndRecordReady) {
        runPeriodEndAnimation();
        return;
      }
      setPeriodYes(true);
      clearTimers();
      setLitDays([]);
      setPeriodFlowLevels({});
      setPeriodFlowPhase('idle');
      setPeriodPickerOpen(true);
      return;
    }
    resetPeriod();
  };

  const continuePeriodFlow = (recordValue) => {
    onPeriodRecordSubmit?.(recordValue);
    setPeriodPickerOpen(false);
    runPeriodAnimation();
  };

  const openPeriodDetailPicker = (type) => {
    if (!periodDetailDemoEnabled) return;
    setSinglePickerType(type);
  };

  const confirmPeriodDetail = ({ type, value }) => {
    setSinglePickerType(null);
    onPeriodDetailRecordSubmit?.({ type, value });
  };

  const syncCalendarOffset = useCallback(() => {
    if (!dragAreaRef.current || !gridRef.current) return;
    const focusedBtn = gridRef.current.querySelector('.calendar-day.is-selected');
    if (legendCollapsed && focusedBtn) {
      dragAreaRef.current.style.height = `${focusedBtn.offsetHeight + 8}px`;
      setCalendarOffset(-focusedBtn.offsetTop + 4);
      return;
    }
    dragAreaRef.current.style.height = '';
    setCalendarOffset(0);
  }, [legendCollapsed]);

  useEffect(() => {
    syncCalendarOffset();
  }, [selectedDay, legendCollapsed, syncCalendarOffset]);

  const handleDaySelect = (n) => {
    setSelectedDay(n);
  };

  const handleLegendClick = (event) => {
    if (event.target.closest('span, i, img, svg')) return;
    setLegendCollapsed((v) => !v);
  };

  return (
    <div
      className={
        'record-page-root'
        + (monthOpen ? ' record-month-open' : '')
      }
      aria-label="记录页"
    >
      <div className="record-stack">
        <div className="record-sticky-title" data-record-sticky-title>
          <div className="record-calendar-titlebar">
            <div className="mock-nav nav-tabs-layout">
              <button
                type="button"
                className="icon-button small record-month-back"
                aria-label="打开月年视图"
                onClick={() => setMonthOpen(true)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                <span>6月</span>
              </button>
              <span className="nav-flex-space" aria-hidden="true"/>
              <div className="nav-primary-tabs" role="tablist" aria-label="模式选择">
                {MODE_TABS.map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    role="tab"
                    aria-selected={activeMode === i}
                    className={activeMode === i ? 'is-active' : ''}
                    onClick={() => setActiveMode(i)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <span className="nav-flex-space" aria-hidden="true"/>
              <span className="nav-spacer" aria-hidden="true"/>
            </div>
            <div className="calendar-weekdays" aria-label="星期">
              {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
            </div>
          </div>
        </div>

        <div className="record-calendar-panel" data-record-calendar>
          <div className="record-calendar">
            <div className="calendar-scroll-window" ref={dragAreaRef} data-calendar-drag>
              <div
                className="calendar-grid"
                ref={gridRef}
                aria-label="记录日历"
                style={{ '--calendar-offset-y': `${calendarOffset}px` }}
              >
                {CALENDAR_DAYS.map((day, i) => {
                  const displayDay = day
                    ? { ...day, today: periodEndRecordReady ? day.n === 21 : day.today }
                    : day;
                  const flowIndex = day ? PERIOD_DAYS.indexOf(day.n) : -1;
                  const hasFlowLevel = !!(day && Object.prototype.hasOwnProperty.call(periodFlowLevels, day.n));
                  const periodFlow = flowIndex >= 0 && hasFlowLevel
                    ? { ...getPeriodFlowTiming(flowIndex), level: periodFlowLevels[day.n], phase: periodFlowPhase }
                    : null;
                  const periodStartSettled = !!(
                    day
                    && day.n === 14
                    && periodYes
                    && periodFlowPhase === 'settled'
                  );
                  return (
                    <CalendarDayButton
                      key={i}
                      day={displayDay ? { ...displayDay, periodFlow, periodStartSettled } : displayDay}
                      selected={displayDay && displayDay.n === selectedDay}
                      periodLit={displayDay && litDays.includes(displayDay.n)}
                      onSelect={handleDaySelect}
                      isView={false}
                      activeFilter="all"
                    />
                  );
                })}
              </div>
            </div>
            <div className="calendar-legend" onClick={handleLegendClick}>
              <span><i/>月经期</span>
              <span><i className="period-soft"/>预测经期</span>
              <span><i className="fertile"/>易孕期</span>
              <span>
                <img className="calendar-legend-icon" src={ICON_OVULATION} alt=""/>
                排卵日
              </span>
              <svg className="calendar-more" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="record-page-content">
          <HealthMorphList
            periodYes={periodYes}
            periodEndMode={periodEndRecordReady}
            onPeriodYes={() => handlePeriodToggle(true)}
            onPeriodNo={() => handlePeriodToggle(false)}
            onDietAdd={() => setDietSheetOpen(true)}
            onSymptomAdd={() => setSymptomSheetOpen(true)}
            onPeriodDetailAdd={openPeriodDetailPicker}
            periodDetailDemoEnabled={periodDetailDemoEnabled}
            periodDetailValues={periodDetailValues}
            symptomValues={selectedSymptoms}
          />
        </div>
      </div>

      <section className="record-month-view" aria-label="月视图" aria-hidden={!monthOpen}>
        <div className="month-view-nav">
          <button
            type="button"
            className="month-back-today"
            onClick={() => setMonthOpen(false)}
          >
            回今天
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
        <div className="record-month-scroll">
          <div className="record-month-grid" aria-label="2025日历">
            {MONTH_BLOCKS_2025.map((block) => (
              <MonthBlock key={block.title} block={block}/>
            ))}
          </div>
          <div className="record-month-year-row">
            <h3 className="record-month-year">2026年</h3>
            <div className="record-month-legend"><i/><span>经期</span></div>
          </div>
          <div className="record-month-grid" aria-label="2026日历">
            {MONTH_BLOCKS_2026.map((block) => (
              <MonthBlock key={'2026-' + block.title} block={block}/>
            ))}
          </div>
        </div>
      </section>

      <DietAddSheet
        open={dietSheetOpen}
        onClose={() => setDietSheetOpen(false)}
      />
      <SymptomPickerSheet
        open={symptomSheetOpen}
        value={selectedSymptoms}
        onCancel={() => setSymptomSheetOpen(false)}
        onConfirm={(symptoms) => {
          setSelectedSymptoms(symptoms);
          setSymptomSheetOpen(false);
          onSymptomRecordSubmit?.(symptoms.map((symptom) => ({
            ...symptom,
            label: symptom.label || symptom.name,
          })));
        }}
      />
      <PeriodRecordPicker
        open={periodPickerOpen}
        onCancel={continuePeriodFlow}
        onConfirm={continuePeriodFlow}
      />
      <PeriodSinglePicker
        open={!!singlePickerType}
        type={singlePickerType}
        value={singlePickerType ? periodDetailValues?.[singlePickerType] : null}
        onCancel={() => setSinglePickerType(null)}
        onConfirm={confirmPeriodDetail}
      />
    </div>
  );
}

Object.assign(window, { RecordPage });
