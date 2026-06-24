const { useState, useRef, useEffect, useCallback } = React;

const MODE_TABS = ['经期', '备孕', '怀孕', '育儿'];
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const PERIOD_DAYS = [14, 15, 16, 19, 20, 21];

const ICON_HEART = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIgMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTkuMjYxNzkgMS44NTA2QzEwLjg2MzIgMi43MzY1MSAxMS40MzY4IDQuOTAwMjUgMTAuNjUwNiA2LjcyODM2QzEwLjE0NDQgNy45MDU0MyA5LjI2NjQgOC44MDgyNiA4LjQyNjcyIDkuNDQ5ODZDOC4wMTEyOCA5Ljc2NzMgNy40MDU4MiAxMC4wODE2IDYuOTA3MTggMTAuMzE1M0M2LjM0OTE1IDEwLjU3NjkgNS43MDc1MSAxMC41NzY3IDUuMTQ2NzggMTAuMzIxQzQuNjIwODcgMTAuMDgxMSAzLjk4MDgxIDkuNzYwMTcgMy41ODY3MiA5LjQ2MDE3QzIuNzQyOTggOC44MTc4OCAxLjg1ODM0IDcuOTExNzEgMS4zNDk0MiA2LjcyODM2QzAuNTYzMjAxIDQuOTAwMjUgMS4xMzY3NSAyLjczNjUxIDIuNzM4MjEgMS44NTA2QzMuNjAzMzUgMS4zNzIwMSA0LjU5NDY5IDEuMzc5NSA1LjM5NDU5IDEuODk3MDVDNS40NjcyNyAxLjk0NDA3IDUuNTY5NjMgMi4wMjU3MyA1LjY2OTU0IDIuMTA5NzZDNS44NjEwNiAyLjI3MDg0IDYuMTQyMDcgMi4yNzQxIDYuMzM1NDUgMi4xMTUyNkM2LjQ0NzI0IDIuMDIzNDQgNi41NjM3IDEuOTMxODMgNi42NDQzNiAxLjg3ODlDNy40MDUzMSAxLjM3OTUgOC40MTAyIDEuMzc5NSA5LjI2MTc5IDEuODUwNloiIGZpbGw9IiNmZjk0YjgiLz48L3N2Zz4=';

const ICON_OVULATION = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIgMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTguMTIwODMgMi4zMzUyN0M4LjEyNTA3IDIuMzQzOCA4LjEyOTMyIDIuMzUyNzMgOC4xMzM1OCAyLjM2MTk4QzguMjkwNCAyLjcwMjY3IDguNjA1NzEgMi45MzkxNyA4Ljk3ODExIDIuOTgzNjJDOS4wMDMzIDIuOTg2NjMgOS4wMjcwMSAyLjk5MDEzIDkuMDQ4NjYgMi45OTQxOEM5LjUwODA5IDMuMDgwMDkgOS45NDc2IDMuMzA1MTcgMTAuMzAyOCAzLjY2OTQzQzExLjIzMjcgNC42MjMxNiAxMS4yMzI0IDYuMTY5ODMgMTAuMzAyIDcuMTI0MDFDMTAuMjkzNiA3LjEzMjYxIDEwLjI4NDYgNy4xNDE0MyAxMC4yNzUyIDcuMTUwNDJDMTAuMDA5NCA3LjQwMzgxIDkuODgzOTEgNy43Njk4MyA5Ljk2MDE1IDguMTI5MDhDOS45NjY3NyA4LjE2MDI3IDkuOTcyMTQgOC4xODk3MiA5Ljk3NTgzIDguMjE2NDlDMTAuMDQyMSA4LjY5NjQ0IDkuOTcwMzMgOS4yMDEzIDkuNzM5ODQgOS42NjU5M0M5LjE0MzM3IDEwLjg2ODMgNy43MDk5MyAxMS4zNDU5IDYuNTM4MTcgMTAuNzMyN0M2LjUyNzc5IDEwLjcyNzMgNi41MTcwNSAxMC43MjE0IDYuNTA2MDEgMTAuNzE1QzYuMTkwNzkgMTAuNTM1MSA1LjgxMjk1IDEwLjU0MjMgNS40OTQxMyAxMC43MTU4QzUuMDU0MzUgMTAuOTU1IDQuNTM4MTIgMTEuMDU1NCA0LjAwODgxIDEwLjk2OTVDMi43MTAyMiAxMC43NTg5IDEuODI0NjYgOS41MDc0IDIuMDMwODYgOC4xNzQyMkMyLjAzMjk0IDguMTYwNzkgMi4wMzU0MyA4LjE0NjcxIDIuMDM4MjggOC4xMzIxMUMyLjEwOSA3Ljc2OTcyIDEuOTg0NiA3LjQwNjE3IDEuNzIxMyA3LjE0NzMyQzEuNzE5MTMgNy4xNDUxOCAxLjcxNjk5IDcuMTQzMDYgMS43MTQ4OSA3LjE0MDk1QzEuMzYyMDEgNi43ODY2NiAxLjExMzA2IDYuMzE3MjIgMS4wMjk3NiA1Ljc3ODY3QzAuODIzNjY0IDQuNDQ2MTIgMS43MDk4IDMuMTk1MDUgMy4wMDkgMi45ODQzM0MzLjA0MjI4IDIuOTc4OTQgMy4wODAyOCAyLjk3NDg2IDMuMTIwODMgMi45NzE4M0MzLjQzNjI0IDIuOTQ4MjQgMy43MDAwNCAyLjc0MTQ4IDMuODI1NjEgMi40NTExOUM0LjAzOTQ5IDEuOTU2NzcgNC40MTM3NSAxLjUzMTczIDQuOTE5NjUgMS4yNjY5N0M2LjA5MDg2IDAuNjU0MDI5IDcuNTI0MDggMS4xMzIzMiA4LjEyMDgzIDIuMzM1MjdaIiBmaWxsPSIjYjk3MmZmIi8+PC9zdmc+';

const ICON_TODAY = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIgMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQuNDcwMDMgMEM0LjgzNzAyIDAgNS4xNTQ0MSAwLjEzNzA2MSA1LjQzMDA3IDAuMzg3Nzk3QzcuMDIwNjUgMi4wMjMxNyA4LjI1OTc2IDQuMDAyNDUgOC45Mjk1MiA2LjI1MjgyQzkuMDc0NjIgNi43MzI3NiA4Ljk2NTYxIDcuMjE3MTMgOC44NzA5NSA3LjQwNTYzQzguNzI1NTIgNy42NjYxMiA4LjU3ODU0IDcuOTA0NzcgOC4wNTU5MyA4LjA5ODI0QzcuMzkyMDkgOC4zMTcxNSA1LjY0MDE1IDguNSA0LjQ3OTAyIDguNUMzLjMxNzg5IDguNSAxLjYyNTM2IDguMzQ3OTMgMC45Mzc0NTIgOC4wODg0M0MwLjQ4ODcyMyA3Ljg5ODQ3IDAuMjgwMjE1IDcuNjU1NjkgMC4xMzk0MzEgNy40MDU2M0MwLjAzNjY2MSA3LjIyMzA5IC0wLjA3OTQxOCA2LjcyNiAwLjA3NDYzNTUgNi4yNTI4MkMwLjc0NjczMSA0LjAxNzgxIDEuOTQ2NTMgMi4wMTM3NCAzLjUyODEgMC4zODc2NjVDMy43ODk3MiAwLjEzNzA2MSA0LjEwMzA0IDAgNC40NzAwMyAwWiIgZmlsbD0iI2ZmZDkxOSIgdHJhbnNmb3JtPSJtYXRyaXgoMCAxIC0xIDAgMTAuNSAxLjUpIi8+PC9zdmc+';

const CALENDAR_DAYS = [
  null, null, null,
  { n: 1, fertile: true },
  { n: 2, fertile: true },
  { n: 3, fertile: true },
  { n: 4 },
  { n: 5 }, { n: 6 }, { n: 7 }, { n: 8 }, { n: 9 }, { n: 10 },
  { n: 11 }, { n: 12 }, { n: 13 },
  { n: 14, period: true },
  { n: 15, today: true, selected: true, period: true },
  { n: 16, period: true },
  { n: 17 }, { n: 18 },
  { n: 19, period: true }, { n: 20, period: true }, { n: 21, period: true },
  { n: 22 }, { n: 23 }, { n: 24 }, { n: 25 },
  { n: 26 },
  { n: 27, fertile: true }, { n: 28, fertile: true }, { n: 29, fertile: true },
  { n: 30, fertile: true }, { n: 31, fertile: true, ovulation: true },
  null,
];

const DIET_MEAL_IMAGES = [
  'assets/diet-meal-1.png',
  'assets/diet-meal-2.png',
  'assets/diet-meal-3.png',
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

const JUNE_2026_FIRST_WEEKDAY = 3; // 6月1日是周三

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

function EyeIcon() {
  return (
    <svg className="record-view-eye" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
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

function getJuneWeekdayLabel(day) {
  return '周' + WEEKDAYS[(JUNE_2026_FIRST_WEEKDAY + day - 1) % 7];
}

function hasViewRecords(day) {
  const isPeriod = day >= 14 && day <= 21;
  return getDayRecordTypes(day, isPeriod).length > 0;
}

function getViewRecordCount(day) {
  const isPeriod = day >= 14 && day <= 21;
  return getDayRecordTypes(day, isPeriod).length;
}

function ViewRecordCards() {
  return (
    <div className="record-view-grid" aria-label="当日记录">
      <article className="record-view-card">
        <header className="record-view-card-head">
          <i className="is-period"/>
          <span>经期</span>
        </header>
        <div className="record-view-value">第3天</div>
        <div className="record-view-tags">
          <span className="record-view-tag is-period">流量中</span>
          <span className="record-view-tag is-period">鲜红</span>
          <span className="record-view-tag is-period">痛经轻</span>
        </div>
      </article>

      <article className="record-view-card">
        <header className="record-view-card-head">
          <i className="is-mood"/>
          <span>心情</span>
        </header>
        <div className="record-view-moods" aria-hidden="true">
          <span className="record-view-mood-chip" style={{ background: '#fff3c9' }}>😊</span>
          <span className="record-view-mood-chip" style={{ background: '#ffe3ef' }}>💗</span>
          <span className="record-view-mood-chip" style={{ background: '#e4f7d9' }}>🌿</span>
        </div>
      </article>

      <article className="record-view-card">
        <header className="record-view-card-head">
          <i className="is-weight"/>
          <span>体重</span>
        </header>
        <div className="record-view-metric">
          <strong>52.3</strong>
          <em>kg</em>
        </div>
      </article>

      <article className="record-view-card">
        <header className="record-view-card-head">
          <i className="is-love"/>
          <span>爱爱</span>
        </header>
        <div className="record-view-value">1次</div>
        <div className="record-view-tags">
          <span className="record-view-tag is-love">无措施爱爱</span>
          <span className="record-view-tag is-love">11:57分</span>
        </div>
      </article>

      <article className="record-view-card">
        <header className="record-view-card-head">
          <i className="is-symptom"/>
          <span>症状</span>
        </header>
        <div className="record-view-tags">
          <span className="record-view-tag is-symptom">痛经</span>
          <span className="record-view-tag is-symptom">疲劳</span>
          <span className="record-view-tag is-symptom">腹胀</span>
        </div>
      </article>

      <article className="record-view-card">
        <header className="record-view-card-head">
          <i className="is-diet"/>
          <span>饮食</span>
        </header>
        <div className="record-view-diet-summary">3餐 · 1680kcal</div>
        <div className="record-view-meals" aria-hidden="true">
          {DIET_MEAL_IMAGES.map((src, i) => (
            <img key={src} className="record-view-meal-photo" src={src} alt={'饮食记录' + (i + 1)}/>
          ))}
        </div>
      </article>
    </div>
  );
}

function CalendarDayButton({ day, selected, periodLit, onSelect, isView, activeFilter }) {
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
  const [selectedDay, setSelectedDay] = useState(15);
  const [periodYes, setPeriodYes] = useState(false);
  const [litDays, setLitDays] = useState([]);
  const [monthOpen, setMonthOpen] = useState(false);
  const [legendCollapsed, setLegendCollapsed] = useState(false);
  const [isView, setIsView] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
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

  const toggleView = useCallback(() => {
    setFlipping(true);
    setModeMenuOpen(false);
    setFilterMenuOpen(false);
    setTimeout(() => {
      setIsView((v) => {
        if (v) setActiveFilter('all');
        return !v;
      });
      setTimeout(() => setFlipping(false), 50);
    }, 280);
  }, []);

  const activeFilterLabel = getFilterType(activeFilter).label;
  const headerMenuOpen = isView ? filterMenuOpen : modeMenuOpen;

  const closeHeaderMenu = () => {
    setModeMenuOpen(false);
    setFilterMenuOpen(false);
  };

  return (
    <div
      className={
        'record-page-root'
        + (monthOpen ? ' record-month-open' : '')
        + (isView ? ' is-view-mode' : '')
        + (flipping ? ' is-flipping' : '')
      }
      aria-label="记录页"
    >
      <div className="record-stack">
        <div className="record-sticky-title">
          <div className="record-titlebar-top">
            <button
              type="button"
              className="record-year-nav"
              aria-label="打开月年视图"
              onClick={() => setMonthOpen(true)}
            >
              <span className="record-year-chev" aria-hidden="true">‹</span>
              <span>2026年</span>
            </button>
            <div className="record-titlebar-actions">
              <div className="record-mode-menu">
                {isView ? (
                  <>
                    <button
                      type="button"
                      className="record-filter-pill"
                      aria-expanded={filterMenuOpen}
                      aria-haspopup="listbox"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilterMenuOpen((v) => !v);
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
                            onClick={() => {
                              setActiveFilter(item.key);
                              setFilterMenuOpen(false);
                            }}
                          >
                            <span className="record-filter-option-icon" aria-hidden="true">
                              <RecordTypeIcon type={item.key} size={16}/>
                            </span>
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="record-mode-pill"
                      aria-expanded={modeMenuOpen}
                      aria-haspopup="listbox"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModeMenuOpen((v) => !v);
                      }}
                    >
                      {MODE_TABS[activeMode]}
                      <svg className="record-mode-chev" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 10l5 5 5-5"/>
                      </svg>
                    </button>
                    {modeMenuOpen ? (
                      <div className="record-mode-dropdown" role="listbox" aria-label="模式选择">
                        {MODE_TABS.map((label, i) => (
                          <button
                            key={label}
                            type="button"
                            role="option"
                            aria-selected={activeMode === i}
                            className={activeMode === i ? 'is-active' : ''}
                            onClick={() => {
                              setActiveMode(i);
                              setModeMenuOpen(false);
                            }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
              <button
                type="button"
                className="record-mode-toggle"
                aria-label={isView ? '切换到记录' : '切换到查看'}
                onClick={toggleView}
              >
                {isView ? <RecordIcon/> : <EyeIcon/>}
                {isView ? '记录' : '查看'}
              </button>
            </div>
          </div>
        </div>

        {headerMenuOpen ? (
          <button
            type="button"
            className="record-mode-menu-backdrop"
            aria-label="关闭菜单"
            onClick={closeHeaderMenu}
          />
        ) : null}

        <div className="record-calendar-panel" data-record-calendar>
          <div className="record-titlebar-heading">
            <h2>6月</h2>
          </div>
          <div className="calendar-weekdays" aria-label="星期">
            {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
          </div>
          <div className="record-calendar">
            <div className="record-calendar-flip">
              <div className={'record-calendar-flip-inner' + (flipping ? ' is-flipping' : '')}>
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
                        isView={isView}
                        activeFilter={isView ? activeFilter : 'all'}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {!isView ? (
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
            ) : null}
          </div>
        </div>

        <div className="record-page-content">
        {isView ? (
          <div className="record-view-panel" aria-label="查看记录">
            <div className="record-view-day">
              <div className="record-view-day-date">
                <span className="record-view-day-main">6月{selectedDay}日</span>
                <span className="record-view-day-week">{getJuneWeekdayLabel(selectedDay)}</span>
              </div>
              <em className="record-view-day-count">
                {hasViewRecords(selectedDay)
                  ? getViewRecordCount(selectedDay) + '项记录'
                  : '0条记录'}
              </em>
            </div>
            {hasViewRecords(selectedDay) ? (
              <ViewRecordCards/>
            ) : (
              <div className="record-view-empty">
                <span aria-hidden="true">📝</span>
                <p>无记录</p>
              </div>
            )}
          </div>
        ) : (
        <div className="business-list-group" aria-label="记录入口">
          {RECORD_ITEMS.map((item) => (
            <div key={item.id} className="list-item">
              <span className="list-icon" aria-hidden="true">
                {item.type === 'segment' ? (
                  <PeriodKeyIcon/>
                ) : (
                  <span
                    className={'mock-list-icon ' + item.iconShape}
                    style={{ '--mock-icon-bg': item.iconBg }}
                  />
                )}
              </span>
              <div><strong>{item.label}</strong></div>
              {item.type === 'segment' ? (
                <div className="ios26-segmented" role="tablist" aria-label="是否选择">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={periodYes}
                    className={periodYes ? 'is-active' : ''}
                    onClick={() => handlePeriodToggle(true)}
                  >
                    是
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={!periodYes}
                    className={!periodYes ? 'is-active' : ''}
                    onClick={() => handlePeriodToggle(false)}
                  >
                    否
                  </button>
                </div>
              ) : (
                <button type="button" className="list-add" aria-label={'新增' + item.label}>
                  <PlusIcon/>
                </button>
              )}
            </div>
          ))}
        </div>
        )}
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
