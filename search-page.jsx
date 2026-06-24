// ============ 点滴内联搜索浮层（非独立页面） ============

const SEARCH_FILTER_TAGS = [
  { id: 'mood', label: '心情', emoji: '😊' },
  { id: 'weight', label: '体重', emoji: '⚖️' },
  { id: 'diet', label: '饮食', emoji: '🍽️' },
  { id: 'fitness', label: '运动', emoji: '🏃' },
  { id: 'sleep', label: '睡眠', emoji: '😴' },
];

const SEARCH_VOICE_DEMO_TEXT = '今天有点累，肚子也有点胀';

const IOS_KB_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

function IosSearchKeyboard({ onKey, onBackspace, onSpace }) {
  const I = window.Icon;
  return (
    <div className="ios-search-keyboard" aria-hidden="true">
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
          <span className="ios-kb-key ios-kb-key--fn ios-kb-key--search">
            <I name="search" size={16} stroke={2}/>
          </span>
        </div>
      </div>
      <div className="ios-kb-accessory">
        <span className="ios-kb-globe" aria-hidden="true">🌐</span>
        <span className="ios-kb-mic" aria-hidden="true">
          <I name="mic" size={18} stroke={1.8}/>
        </span>
      </div>
    </div>
  );
}

function StreamSearchOverlay({ onClose }) {
  const [query, setQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState(null);
  const [voiceListening, setVoiceListening] = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (voiceListening) {
      inputRef.current?.blur();
      return undefined;
    }
    const tm = setTimeout(() => inputRef.current?.focus(), 180);
    return () => clearTimeout(tm);
  }, [voiceListening]);

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const appendKey = (key) => setQuery((prev) => prev + key);
  const handleBackspace = () => setQuery((prev) => prev.slice(0, -1));
  const handleSpace = () => setQuery((prev) => (prev && !/\s$/.test(prev) ? prev + ' ' : prev));

  const handleVoiceInput = () => {
    if (voiceListening) {
      setVoiceListening(false);
      setQuery(SEARCH_VOICE_DEMO_TEXT);
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }
    inputRef.current?.blur();
    setVoiceListening(true);
  };

  const handleFilterClick = (tag) => {
    setActiveFilter(tag.id);
    setQuery(tag.label);
    if (voiceListening) setVoiceListening(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    onClose?.();
  };

  const micActive = voiceListening;
  const showKeyboard = !voiceListening;
  const canSend = !!query.trim();
  const I = window.Icon;

  return (
    <div className="ios-search-overlay" role="presentation">
      <div className="ios-search-top">
        <div className="ios-search-bar-row">
          <div className={'ios-search-field-wrap' + (voiceListening ? ' is-listening' : '')}>
            {voiceListening ? (
              <div className="ios-search-listening" aria-live="polite">
                <span className="ios-search-listening-text">正在听</span>
                <span className="ios-search-listening-waves" aria-hidden="true">
                  {Array.from({ length: 12 }, (_, i) => <span key={i}></span>)}
                </span>
              </div>
            ) : (
              <React.Fragment>
                <span className="ios-search-field-ico" aria-hidden="true">
                  <I name="search" size={17} stroke={1.8}/>
                </span>
                <input
                  ref={inputRef}
                  className="ios-search-field"
                  type="search"
                  enterKeyHint="search"
                  placeholder="搜索"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="搜索"
                />
              </React.Fragment>
            )}
            <button
              type="button"
              className={'ios-search-mic' + (micActive ? ' is-active' : '')}
              aria-label="语音输入"
              aria-pressed={micActive}
              onClick={handleVoiceInput}
            >
              <I name="mic" size={18} stroke={1.7}/>
            </button>
          </div>
          <button
            type="button"
            className={'ios-search-send' + (canSend ? ' is-ready' : '')}
            aria-label="发送"
            disabled={!canSend}
            onClick={handleSubmit}
          >
            <I name="send" size={16} stroke={2}/>
          </button>
        </div>

        <div className="ios-search-panel">
          <div className="ios-search-filters" aria-label="按类型筛选">
            <p className="ios-search-filter-label">按类型筛选</p>
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
      </div>

      {showKeyboard ? (
        <IosSearchKeyboard onKey={appendKey} onBackspace={handleBackspace} onSpace={handleSpace}/>
      ) : null}
    </div>
  );
}

Object.assign(window, { StreamSearchOverlay, SearchPage: StreamSearchOverlay });
