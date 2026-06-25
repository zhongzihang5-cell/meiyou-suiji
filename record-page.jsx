const { useState, useRef, useEffect, useCallback } = React;

const MODE_TABS = ['经期', '备孕', '怀孕', '育儿'];
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const PERIOD_DAYS = [14, 15, 16, 17, 18, 19, 20, 21];

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
  { n: 14, period: true, today: true, todayMark: true, marks: ['plus'] },
  { n: 15, period: true },
  { n: 16, period: true },
  { n: 17, predicted: true },
  { n: 18, predicted: true },
  { n: 19, period: true },
  { n: 20, period: true },
  { n: 21, period: true },
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
    recordType: 'add',
  },
];

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

function HealthMorphRecordPane({ item, periodYes, onPeriodYes, onPeriodNo }) {
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

  return (
    <button type="button" className="list-add" aria-label={'新增' + item.label}>
      <PlusIcon/>
    </button>
  );
}

function HealthMorphRow({ item, index, periodYes, onPeriodYes, onPeriodNo }) {
  const delay = (index * 50) + 'ms';

  return (
    <div className="health-morph-row" style={{ '--row-delay': delay }}>
      <div className="health-morph-body">
        <div className="health-morph-left" aria-hidden="true">
          <div className="health-morph-icon-slot">
            {item.id === 'period' ? (
              <PeriodKeyIcon/>
            ) : (
              <span
                className={'mock-list-icon ' + item.iconShape}
                style={{ '--mock-icon-bg': item.iconBg }}
              />
            )}
          </div>
        </div>
        <div className="health-morph-label">{item.label}</div>
        <div className="health-morph-right">
          <HealthMorphRecordPane
            item={item}
            periodYes={periodYes}
            onPeriodYes={onPeriodYes}
            onPeriodNo={onPeriodNo}
          />
        </div>
      </div>
    </div>
  );
}

function HealthMorphList({ periodYes, onPeriodYes, onPeriodNo }) {
  return (
    <div className="health-morph-list" aria-label="健康记录列表">
      {MORPH_ITEMS.map((item, index) => (
        <HealthMorphRow
          key={item.id}
          item={item}
          index={index}
          periodYes={periodYes}
          onPeriodYes={onPeriodYes}
          onPeriodNo={onPeriodNo}
        />
      ))}
    </div>
  );
}

function KitCalendarDayButton({ day, selected, periodLit, onSelect }) {
  if (!day) return <span className="calendar-day" aria-hidden="true"/>;

  const isPeriod = !!(day.period || periodLit);
  const cls = [
    'calendar-day',
    day.fertile ? 'is-fertile' : '',
    isPeriod ? 'is-period' : '',
    periodLit && (day.period || day.predicted) ? 'is-period-lit' : '',
    day.predicted ? 'is-predicted' : '',
    day.today ? 'is-today' : '',
    selected ? 'is-selected' : '',
  ].filter(Boolean).join(' ');

  return (
    <button type="button" className={cls} onClick={() => onSelect(day.n)}>
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
          <span className="calendar-day-number">{day.n}</span>
          <span className="calendar-day-icons" aria-hidden="true">
            {day.marks.map((key) => (
              <img key={key} className="calendar-icon" src={YELLOW_MARK_ICONS[key]} alt=""/>
            ))}
          </span>
        </>
      ) : (
        <span className="calendar-day-number">{day.n}</span>
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
  onPeriodReset,
  periodFlowEnabled = true,
}) {
  const [activeMode, setActiveMode] = useState(0);
  const [selectedDay, setSelectedDay] = useState(14);
  const [periodYes, setPeriodYes] = useState(false);
  const [litDays, setLitDays] = useState([]);
  const [monthOpen, setMonthOpen] = useState(false);
  const [legendCollapsed, setLegendCollapsed] = useState(false);
  const [calendarOffset, setCalendarOffset] = useState(0);
  const dragAreaRef = useRef(null);
  const gridRef = useRef(null);
  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const resetPeriod = useCallback(() => {
    clearTimers();
    setPeriodYes(false);
    setLitDays([]);
    onPeriodReset?.();
  }, [clearTimers, onPeriodReset]);

  const runPeriodAnimation = useCallback(() => {
    clearTimers();
    setLitDays([]);
    PERIOD_DAYS.forEach((d, i) => {
      const t = setTimeout(() => {
        setLitDays((prev) => (prev.includes(d) ? prev : [...prev, d]));
      }, i * 280);
      timersRef.current.push(t);
    });
    const t2 = setTimeout(() => {
      if (periodFlowEnabled) onAnalysisReady?.();
    }, PERIOD_DAYS.length * 280 + 200);
    timersRef.current.push(t2);
  }, [clearTimers, onAnalysisReady, periodFlowEnabled]);

  const handlePeriodToggle = (yes) => {
    if (yes) {
      if (periodYes) return;
      setPeriodYes(true);
      runPeriodAnimation();
      return;
    }
    resetPeriod();
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
                {CALENDAR_DAYS.map((day, i) => (
                  <CalendarDayButton
                    key={i}
                    day={day}
                    selected={day && day.n === selectedDay}
                    periodLit={day && litDays.includes(day.n)}
                    onSelect={handleDaySelect}
                    isView={false}
                    activeFilter="all"
                  />
                ))}
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
            onPeriodYes={() => handlePeriodToggle(true)}
            onPeriodNo={() => handlePeriodToggle(false)}
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
    </div>
  );
}

Object.assign(window, { RecordPage });
