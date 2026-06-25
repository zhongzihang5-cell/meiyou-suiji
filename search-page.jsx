// ============ 点滴内联搜索面板（顶部下推） ============

const SEARCH_FILTER_TAGS = [
  { id: 'date', label: '按日期', icon: 'calendar' },
  { id: 'mood', label: '心情', emoji: '😊' },
  { id: 'weight', label: '体重', emoji: '⚖️' },
  { id: 'diet', label: '饮食', emoji: '🍽️' },
  { id: 'fitness', label: '运动', emoji: '🏃' },
  { id: 'sleep', label: '睡眠', emoji: '😴' },
];

const SEARCH_VOICE_DEMO_TEXT = '上个月体重';
const SEARCH_VOICE_CHAR_MS = 52;
const SEARCH_VOICE_CHAR_JITTER = 38;
const SEARCH_SUGGESTIONS = ['活动', '事件', '会议', '比赛', '展览', '访问'];
const SEARCH_CALENDAR_WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const SEARCH_SWIPE_CLOSE_THRESHOLD = 48;
const SEARCH_CLOSE_MS = 260;
const SEARCH_PANEL_OPEN_MS = 300;

const TIMELINE_INTERACTIVE_SELECTOR = [
  'button',
  'a',
  'input',
  'textarea',
  'select',
  'label',
  '[role="button"]',
  '[data-entry-id]',
  '[data-day-id]',
  '.tl-card',
  '.tl-mood-insight',
  '.weekly-card',
  '.cycle-sum',
  '.cycle-card',
  '.signal-card',
  '.health',
  '.guide',
  '.stream-health',
  '.card-more-wrap',
  '.tl-voice-pill',
  '.tl-search-empty',
].join(', ');

function isTimelineBlankClick(target) {
  const stream = document.querySelector('.suiji-stream');
  if (!stream || !target || !stream.contains(target)) return false;
  if (target.closest('.ios-search-push, .ios-search-keyboard, .dock-wrap, .stream-header, .tabbar, .quick-float-wrap')) {
    return false;
  }
  if (target.closest(TIMELINE_INTERACTIVE_SELECTOR)) return false;
  return true;
}

const IOS_KB_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

function padCalendarNumber(n) {
  return String(n).padStart(2, '0');
}

function makeCalendarKey(year, monthIndex, day) {
  return `${year}-${padCalendarNumber(monthIndex + 1)}-${padCalendarNumber(day)}`;
}

function parseTimelineDayDate(day, fallbackYear) {
  const dateText = String(day?.date || '');
  const slash = dateText.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (slash) {
    return {
      year: fallbackYear,
      monthIndex: Number(slash[1]) - 1,
      day: Number(slash[2]),
    };
  }
  const monthText = String(day?.month || '');
  const month = monthText.match(/^(\d{1,2})月$/);
  const singleDay = dateText.match(/^(\d{1,2})$/);
  if (month && singleDay) {
    return {
      year: fallbackYear,
      monthIndex: Number(month[1]) - 1,
      day: Number(singleDay[1]),
    };
  }
  return null;
}

function hasTimelineRecords(day) {
  const items = day?.items || day?.entries || [];
  return items.some((item) => item && !['guide', 'gap', 'sister-card'].includes(item.kind));
}

function buildTimelineDateMap(timeline) {
  const year = new Date().getFullYear();
  const dateMap = new Map();
  (timeline || []).forEach((block) => {
    if (block?.type !== 'day' || !hasTimelineRecords(block)) return;
    const parsed = parseTimelineDayDate(block, year);
    if (!parsed) return;
    const key = makeCalendarKey(parsed.year, parsed.monthIndex, parsed.day);
    dateMap.set(key, {
      key,
      year: parsed.year,
      monthIndex: parsed.monthIndex,
      day: parsed.day,
      dayId: block.id,
      block,
    });
  });
  return dateMap;
}

function resolveInitialCalendarMonth(dateMap) {
  const today = new Date();
  const current = { year: today.getFullYear(), monthIndex: today.getMonth() };
  const hasCurrentMonthRecord = Array.from(dateMap.values()).some(
    (item) => item.year === current.year && item.monthIndex === current.monthIndex,
  );
  if (hasCurrentMonthRecord || dateMap.size === 0) return current;
  const latest = Array.from(dateMap.values()).sort((a, b) => (
    new Date(b.year, b.monthIndex, b.day) - new Date(a.year, a.monthIndex, a.day)
  ))[0];
  return { year: latest.year, monthIndex: latest.monthIndex };
}

function SearchDatePicker({ timeline, onPickDate }) {
  const I = window.Icon;
  const today = new Date();
  const recordDateMap = React.useMemo(() => buildTimelineDateMap(timeline), [timeline]);
  const initialMonth = React.useMemo(() => resolveInitialCalendarMonth(recordDateMap), [recordDateMap]);
  const [viewMonth, setViewMonth] = React.useState(initialMonth);

  React.useEffect(() => {
    setViewMonth(initialMonth);
  }, [initialMonth.year, initialMonth.monthIndex]);

  const daysInMonth = new Date(viewMonth.year, viewMonth.monthIndex + 1, 0).getDate();
  const firstWeekday = new Date(viewMonth.year, viewMonth.monthIndex, 1).getDay();
  const cells = [
    ...Array.from({ length: firstWeekday }, (_, i) => ({ type: 'empty', key: `e-${i}` })),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const key = makeCalendarKey(viewMonth.year, viewMonth.monthIndex, day);
      return { type: 'day', key, day, record: recordDateMap.get(key) || null };
    }),
  ];

  const shiftMonth = (delta) => {
    setViewMonth((prev) => {
      const next = new Date(prev.year, prev.monthIndex + delta, 1);
      return { year: next.getFullYear(), monthIndex: next.getMonth() };
    });
  };

  return (
    <div className="ios-search-date-picker" role="dialog" aria-label="按日期查找">
      <div className="ios-search-date-head">
        <button type="button" className="ios-search-date-nav" aria-label="上个月" onClick={() => shiftMonth(-1)}>
          <I name="arrow-left" size={18} stroke={2}/>
        </button>
        <div className="ios-search-date-title">{viewMonth.year}年{viewMonth.monthIndex + 1}月</div>
        <button type="button" className="ios-search-date-nav" aria-label="下个月" onClick={() => shiftMonth(1)}>
          <I name="arrow" size={18} stroke={2}/>
        </button>
      </div>
      <div className="ios-search-date-weekdays" aria-hidden="true">
        {SEARCH_CALENDAR_WEEKDAYS.map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="ios-search-date-grid">
        {cells.map((cell) => {
          if (cell.type === 'empty') return <span key={cell.key} className="ios-search-date-cell is-empty"/>;
          const isToday = viewMonth.year === today.getFullYear()
            && viewMonth.monthIndex === today.getMonth()
            && cell.day === today.getDate();
          const hasRecord = !!cell.record;
          return (
            <button
              key={cell.key}
              type="button"
              className={'ios-search-date-cell' + (isToday ? ' is-today' : '') + (hasRecord ? ' has-record' : '')}
              aria-label={`${cell.day}日${hasRecord ? '，有记录' : ''}`}
              disabled={!hasRecord}
              onClick={() => { if (cell.record) onPickDate(cell.record); }}
            >
              <span>{isToday ? '今' : cell.day}</span>
              {hasRecord ? <i aria-hidden="true"/> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function IosSearchKeyboard({ query, onKey, onBackspace, onSpace, onSearch, onVoice, isVoiceActive }) {
  const I = window.Icon;
  const canSearch = !!query.trim();
  return (
    <div className="ios-search-keyboard" aria-hidden="true">
      {query ? (
        <div className="ios-kb-suggestions">
          {SEARCH_SUGGESTIONS.map((word) => (
            <button
              key={word}
              type="button"
              className="ios-kb-suggestion"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onKey(word)}
            >
              {word}
            </button>
          ))}
        </div>
      ) : null}
      <div className="ios-kb-rows">
        {IOS_KB_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="ios-kb-row">
            {rowIndex === 2 ? (
              <span className="ios-kb-key ios-kb-key--wide ios-kb-key--ghost">⇧</span>
            ) : null}
            {row.map((key) => (
              <button
                key={key}
                type="button"
                className="ios-kb-key"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onKey(key)}
              >
                {key}
              </button>
            ))}
            {rowIndex === 2 ? (
              <button
                type="button"
                className="ios-kb-key ios-kb-key--wide ios-kb-key--ghost"
                onMouseDown={(e) => e.preventDefault()}
                onClick={onBackspace}
                aria-label="删除"
              >
                ⌫
              </button>
            ) : null}
          </div>
        ))}
        <div className="ios-kb-row ios-kb-row--bottom">
          <span className="ios-kb-key ios-kb-key--fn">123</span>
          <button
            type="button"
            className="ios-kb-key ios-kb-key--space"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onSpace}
          >
            拼
          </button>
          <button
            type="button"
            className={'ios-kb-key ios-kb-key--fn ios-kb-key--search' + (canSearch ? ' is-ready' : '')}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { if (canSearch) onSearch(); }}
            aria-label="搜索"
            disabled={!canSearch}
          >
            <I name="search" size={16} stroke={2.2}/>
          </button>
        </div>
      </div>
      <div className="ios-kb-accessory">
        <span className="ios-kb-globe" aria-hidden="true">🌐</span>
        <button
          type="button"
          className={'ios-kb-mic' + (isVoiceActive ? ' is-active' : '')}
          aria-label="语音输入"
          aria-pressed={isVoiceActive}
          onMouseDown={(e) => e.preventDefault()}
          onClick={onVoice}
        >
          <I name="mic" size={18} stroke={1.8}/>
        </button>
      </div>
    </div>
  );
}

function StreamSearchOverlay({ timeline, onClose, onSearch, onSearchClear, onDateSelect }) {
  const [query, setQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState(null);
  const [phase, setPhase] = React.useState('compose'); // compose | results
  const [showKeyboard, setShowKeyboard] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [voiceListening, setVoiceListening] = React.useState(false);
  const [panelActive, setPanelActive] = React.useState(false);
  const [panelClosing, setPanelClosing] = React.useState(false);
  const inputRef = React.useRef(null);
  const voiceStreamRef = React.useRef(null);
  const swipeStartYRef = React.useRef(null);
  const closeTimerRef = React.useRef(null);

  const stopVoiceStream = React.useCallback(() => {
    if (voiceStreamRef.current) {
      clearTimeout(voiceStreamRef.current);
      voiceStreamRef.current = null;
    }
    setVoiceListening(false);
  }, []);

  const requestClose = React.useCallback(() => {
    if (panelClosing) return;
    stopVoiceStream();
    setShowKeyboard(false);
    setPanelActive(false);
    setPanelClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      setPanelClosing(false);
      onClose();
    }, SEARCH_CLOSE_MS);
  }, [onClose, panelClosing, stopVoiceStream]);

  React.useLayoutEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setPanelActive(true));
    });
    const kbTimer = setTimeout(() => {
      setShowKeyboard(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    }, SEARCH_PANEL_OPEN_MS);
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      clearTimeout(kbTimer);
    };
  }, []);

  React.useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (voiceStreamRef.current) clearTimeout(voiceStreamRef.current);
    document.querySelector('.suiji-shell')?.classList.remove('is-search-kb-open', 'is-search-date-open');
  }, []);

  React.useEffect(() => {
    const shell = document.querySelector('.suiji-shell.is-search-open');
    if (!shell) return undefined;
    shell.classList.toggle('is-search-kb-open', showKeyboard);
    shell.classList.toggle('is-search-date-open', datePickerOpen);
    return () => shell.classList.remove('is-search-kb-open', 'is-search-date-open');
  }, [showKeyboard, datePickerOpen]);

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [requestClose]);

  React.useEffect(() => {
    const stream = document.querySelector('.suiji-stream');
    if (!stream) return undefined;
    const onStreamClick = (event) => {
      if (panelClosing || !isTimelineBlankClick(event.target)) return;
      requestClose();
    };
    stream.addEventListener('click', onStreamClick);
    return () => stream.removeEventListener('click', onStreamClick);
  }, [requestClose, panelClosing]);

  const handleSwipeStart = (event) => {
    swipeStartYRef.current = event.touches[0].clientY;
  };

  const handleSwipeEnd = (event) => {
    const startY = swipeStartYRef.current;
    swipeStartYRef.current = null;
    if (startY == null) return;
    const deltaY = event.changedTouches[0].clientY - startY;
    if (deltaY < -SEARCH_SWIPE_CLOSE_THRESHOLD) requestClose();
  };

  const dismissKeyboard = () => {
    setShowKeyboard(false);
    inputRef.current?.blur();
  };

  const openKeyboard = () => {
    setDatePickerOpen(false);
    setShowKeyboard(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const appendKey = (key) => {
    stopVoiceStream();
    setDatePickerOpen(false);
    if (phase === 'results') onSearchClear?.();
    setPhase('compose');
    setQuery((prev) => prev + key);
  };
  const handleBackspace = () => {
    stopVoiceStream();
    setDatePickerOpen(false);
    if (phase === 'results') onSearchClear?.();
    setPhase('compose');
    setQuery((prev) => prev.slice(0, -1));
  };
  const handleSpace = () => {
    stopVoiceStream();
    setDatePickerOpen(false);
    if (phase === 'results') onSearchClear?.();
    setPhase('compose');
    setQuery((prev) => (prev && !/\s$/.test(prev) ? prev + ' ' : prev));
  };
  const handleClear = () => {
    stopVoiceStream();
    setQuery('');
    setActiveFilter(null);
    setPhase('compose');
    onSearchClear?.();
    openKeyboard();
  };

  const handleVoiceInput = () => {
    if (voiceListening) return;
    setDatePickerOpen(false);
    if (phase === 'results') onSearchClear?.();
    setActiveFilter(null);
    setPhase('compose');
    setQuery('');
    setShowKeyboard(true);
    setVoiceListening(true);
    inputRef.current?.focus();

    const chars = Array.from(SEARCH_VOICE_DEMO_TEXT);
    let i = 0;
    const tick = () => {
      i += 1;
      if (i > chars.length) {
        voiceStreamRef.current = null;
        setVoiceListening(false);
        setPhase('results');
        onSearch?.({ query: SEARCH_VOICE_DEMO_TEXT, filterId: null });
        dismissKeyboard();
        return;
      }
      setQuery(chars.slice(0, i).join(''));
      voiceStreamRef.current = setTimeout(
        tick,
        SEARCH_VOICE_CHAR_MS + Math.random() * SEARCH_VOICE_CHAR_JITTER,
      );
    };
    voiceStreamRef.current = setTimeout(tick, 120);
  };

  const handleFilterClick = (tag) => {
    stopVoiceStream();
    if (tag.id === 'date') {
      setActiveFilter('date');
      setPhase('compose');
      setDatePickerOpen(true);
      onSearchClear?.();
      dismissKeyboard();
      return;
    }
    setDatePickerOpen(false);
    setActiveFilter(tag.id);
    setQuery(tag.label);
    setPhase('results');
    onSearch?.({ query: tag.label, filterId: tag.id });
    dismissKeyboard();
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    stopVoiceStream();
    setDatePickerOpen(false);
    setPhase('results');
    onSearch?.({ query: query.trim(), filterId: activeFilter });
    dismissKeyboard();
  };

  const handleDatePick = (recordDate) => {
    stopVoiceStream();
    setDatePickerOpen(false);
    setActiveFilter(null);
    setQuery('');
    setPhase('compose');
    onSearchClear?.();
    onDateSelect?.(recordDate);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const I = window.Icon;
  const panelClass = [
    'ios-search-push',
    panelActive ? 'is-active' : '',
    panelClosing ? 'is-closing' : '',
    datePickerOpen ? 'is-date-picker-open' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <div
        className={panelClass}
        role="search"
        onTouchStart={handleSwipeStart}
        onTouchEnd={handleSwipeEnd}
      >
        <div className="ios-search-push-inner">
          <div className="ios-search-sheet">
            {datePickerOpen ? (
              <SearchDatePicker timeline={timeline} onPickDate={handleDatePick}/>
            ) : (
              <>
                <div className="ios-search-bar-row">
                  <div className={'ios-search-field-wrap' + (voiceListening ? ' is-voice-active' : '')}>
                    <span className="ios-search-field-ico" aria-hidden="true">
                      <I name="search" size={17} stroke={1.8}/>
                    </span>
                    <input
                      ref={inputRef}
                      className="ios-search-field"
                      type="text"
                      enterKeyHint="search"
                      placeholder="试试搜「上个月体重」"
                      value={query}
                      onFocus={openKeyboard}
                      onClick={openKeyboard}
                      onChange={(e) => {
                        stopVoiceStream();
                        setQuery(e.target.value);
                        if (phase === 'results') {
                          setPhase('compose');
                          onSearchClear?.();
                        }
                      }}
                      onKeyDown={handleInputKeyDown}
                      aria-label="搜索"
                    />
                    {voiceListening ? (
                      <div className="ios-search-voice-pill" aria-hidden="true">
                        <I name="mic" size={11} stroke={2.2}/>
                        <span>普</span>
                      </div>
                    ) : null}
                    {query ? (
                      <button
                        type="button"
                        className="ios-search-clear"
                        aria-label="清除"
                        onClick={handleClear}
                      >
                        <I name="close" size={10} stroke={2.4}/>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={'ios-search-mic' + (voiceListening ? ' is-active' : '')}
                        aria-label="语音输入"
                        aria-pressed={voiceListening}
                        onClick={handleVoiceInput}
                      >
                        <I name="mic" size={18} stroke={1.7}/>
                      </button>
                    )}
                  </div>
                  <button type="button" className="ios-search-dismiss" aria-label="关闭" onClick={requestClose}>
                    <I name="close" size={14} stroke={2.2}/>
                  </button>
                </div>

                {phase === 'compose' ? (
                  <div className="ios-search-panel">
                    <div className="ios-search-filters" aria-label="类型筛选">
                      <div className="ios-search-filter-tags">
                        {SEARCH_FILTER_TAGS.map((tag) => {
                          const active = activeFilter === tag.id;
                          return (
                            <button
                              key={tag.id}
                              type="button"
                              className={'ios-search-filter-tag' + (active ? ' is-active' : '')}
                              aria-pressed={active}
                              onClick={() => handleFilterClick(tag)}
                            >
                              {tag.icon ? <I name={tag.icon} size={14} stroke={1.8}/> : null}
                              {tag.emoji ? <span className="ios-search-filter-emoji" aria-hidden="true">{tag.emoji}</span> : null}
                              {tag.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>

      {showKeyboard && !datePickerOpen ? (
        <IosSearchKeyboard
          query={query}
          onKey={appendKey}
          onBackspace={handleBackspace}
          onSpace={handleSpace}
          onSearch={handleSubmit}
          onVoice={handleVoiceInput}
          isVoiceActive={voiceListening}
        />
      ) : null}
    </>
  );
}

Object.assign(window, { StreamSearchOverlay, SearchPage: StreamSearchOverlay });
