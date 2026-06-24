// ============ 点滴内联搜索浮层（非独立页面） ============

const SEARCH_FILTER_TAGS = [
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

const IOS_KB_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

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

function StreamSearchOverlay({ onClose, onSearch, onSearchClear }) {
  const [query, setQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState(null);
  const [phase, setPhase] = React.useState('compose'); // compose | results
  const [showKeyboard, setShowKeyboard] = React.useState(true);
  const [voiceListening, setVoiceListening] = React.useState(false);
  const inputRef = React.useRef(null);
  const voiceStreamRef = React.useRef(null);

  const stopVoiceStream = React.useCallback(() => {
    if (voiceStreamRef.current) {
      clearTimeout(voiceStreamRef.current);
      voiceStreamRef.current = null;
    }
    setVoiceListening(false);
  }, []);

  React.useEffect(() => {
    const tm = setTimeout(() => {
      inputRef.current?.focus();
      setShowKeyboard(true);
    }, 180);
    return () => clearTimeout(tm);
  }, []);

  React.useEffect(() => {
    const shell = document.querySelector('.suiji-shell.is-search-open');
    if (!shell) return undefined;
    shell.classList.toggle('is-search-kb-open', showKeyboard);
    return () => shell.classList.remove('is-search-kb-open');
  }, [showKeyboard]);

  React.useEffect(() => () => {
    if (voiceStreamRef.current) clearTimeout(voiceStreamRef.current);
    document.querySelector('.suiji-shell')?.classList.remove('is-search-kb-open');
  }, []);

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const dismissKeyboard = () => {
    setShowKeyboard(false);
    inputRef.current?.blur();
  };

  const openKeyboard = () => {
    setShowKeyboard(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const appendKey = (key) => {
    stopVoiceStream();
    if (phase === 'results') onSearchClear?.();
    setPhase('compose');
    setQuery((prev) => prev + key);
  };
  const handleBackspace = () => {
    stopVoiceStream();
    if (phase === 'results') onSearchClear?.();
    setPhase('compose');
    setQuery((prev) => prev.slice(0, -1));
  };
  const handleSpace = () => {
    stopVoiceStream();
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
    setActiveFilter(tag.id);
    setQuery(tag.label);
    setPhase('results');
    onSearch?.({ query: tag.label, filterId: tag.id });
    dismissKeyboard();
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    stopVoiceStream();
    setPhase('results');
    onSearch?.({ query: query.trim(), filterId: activeFilter });
    dismissKeyboard();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const I = window.Icon;

  return (
    <div className="ios-search-overlay" role="presentation">
      <div className="ios-search-top">
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
          <button type="button" className="ios-search-dismiss" aria-label="关闭" onClick={onClose}>
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
                      {tag.emoji ? <span className="ios-search-filter-emoji" aria-hidden="true">{tag.emoji}</span> : null}
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {showKeyboard ? (
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
    </div>
  );
}

Object.assign(window, { StreamSearchOverlay, SearchPage: StreamSearchOverlay });
