// ============ 记录搜索页 ============

const SEARCH_TAGS = [
  { id: 'cat-period', label: '月经', cat: 'period', emoji: '🩸' },
  { id: 'cat-symptom', label: '症状', cat: 'symptom', emoji: '🤕' },
  { id: 'cat-mood', label: '心情', cat: 'mood', emoji: '💭' },
  { id: 'cat-sleep', label: '睡眠', cat: 'sleep', emoji: '😴' },
  { id: 'cat-diet', label: '饮食', cat: 'diet', emoji: '🥗' },
  { id: 'cat-weight', label: '体重', cat: 'weight', emoji: '⚖️' },
];

const SEARCH_TAG_MAP = {};
SEARCH_TAGS.forEach(t => { SEARCH_TAG_MAP[t.id] = t; });

function flattenSearchableItems(blocks){
  const out = [];
  (blocks || []).forEach(block=>{
    if(block.type !== 'day') return;
    const dayMeta = {
      date: block.date,
      weekday: block.weekday || '',
      phaseTag: block.phaseTag || '',
    };
    (block.items || []).forEach(item=>{
      if(item.kind !== 'rec' && item.kind !== 'voice-card') return;
      const text = (item.body || item.voiceText || '').trim();
      if(!text && !item.photo) return;
      out.push({
        id: item.id,
        dayMeta,
        time: item.time,
        text,
        tags: item.tags || [],
        voice: item.voice,
        photo: item.photo,
      });
    });
  });
  return out;
}

function itemMatchesFilters(item, query, activeTags){
  const q = query.trim().toLowerCase();
  const hasTags = activeTags.length > 0;

  let matchQuery = !q;
  if(q){
    const tagText = (item.tags || []).map(t=>t.label).join(' ');
    const haystack = (item.text + ' ' + tagText).toLowerCase();
    matchQuery = haystack.includes(q);
  }

  let matchTags = !hasTags;
  if(hasTags){
    matchTags = activeTags.some(filter=>{
      const tagHit = (item.tags || []).some(tag=>{
        const r = window.resolveTag(tag);
        if(filter.cat && !filter.matchLabel) return r.cat === filter.cat;
        if(filter.matchLabel){
          if(r.label.includes(filter.matchLabel) || filter.matchLabel.includes(r.label)) return true;
          if(filter.cat && r.cat === filter.cat) return true;
        }
        return false;
      });
      if(tagHit) return true;
      if(filter.matchLabel && item.text.includes(filter.matchLabel)) return true;
      if(filter.cat === 'period' && /月经|经期/.test(item.text)) return true;
      if(filter.cat === 'symptom' && /腹胀|腰酸|疲惫|痛|不适/.test(item.text)) return true;
      if(filter.cat === 'mood' && /心情|情绪|愉快|低落|平静/.test(item.text)) return true;
      if(filter.cat === 'sleep' && /睡/.test(item.text)) return true;
      if(filter.cat === 'weight' && /体重|kg|公斤|斤/.test(item.text)) return true;
      if(filter.cat === 'diet' && /吃|餐|饮食|午饭|晚饭|早餐/.test(item.text)) return true;
      if(filter.cat === 'fitness' && /跑|运动|健身/.test(item.text)) return true;
      return false;
    });
  }

  return matchQuery && matchTags;
}

function highlightQuery(text, query){
  const q = query.trim();
  if(!q || !text) return text;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q.toLowerCase());
  if(idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="search-hl">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function SearchResultCard({item, query}){
  const RecordedTags = window.RecordedTags;
  const excerpt = item.text.length > 72 ? item.text.slice(0, 72) + '…' : item.text;
  const dayLine = [item.dayMeta.date, item.dayMeta.weekday].filter(Boolean).join(' · ');

  return (
    <article className="search-result-card">
      <div className="search-result-meta-row">
        <span className="search-result-date">{dayLine}</span>
        {item.time && <span className="search-result-time">{item.time}</span>}
        {item.voice && (
          <span className="search-result-voice">
            <span aria-hidden="true">🎙</span>
            {item.voice.duration || '语音'}
          </span>
        )}
      </div>
      {item.text && (
        <p className="search-result-body">{highlightQuery(excerpt, query)}</p>
      )}
      {item.tags.length > 0 && (
        <RecordedTags tags={item.tags} layout="t5"/>
      )}
    </article>
  );
}

function SearchPage({timeline, onClose}){
  const [query, setQuery] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState([]);
  const inputRef = React.useRef(null);

  const allItems = React.useMemo(()=>flattenSearchableItems(timeline), [timeline]);
  const activeTags = React.useMemo(
    ()=>selectedIds.map(id=>SEARCH_TAG_MAP[id]).filter(Boolean),
    [selectedIds]
  );
  const hasFilter = !!(query.trim() || selectedIds.length);

  const results = React.useMemo(()=>{
    if(!hasFilter) return [];
    return allItems
      .filter(item=>itemMatchesFilters(item, query, activeTags))
      .slice()
      .reverse();
  }, [allItems, query, activeTags, hasFilter]);

  React.useEffect(()=>{
    const tm = setTimeout(()=>inputRef.current?.focus(), 120);
    return ()=>clearTimeout(tm);
  }, []);

  const toggleTag = (id)=>{
    setSelectedIds(prev=>prev.includes(id) ? prev.filter(x=>x !== id) : [...prev, id]);
  };

  const clearFilters = ()=>{
    setQuery('');
    setSelectedIds([]);
    inputRef.current?.focus();
  };

  const I = window.Icon;

  return (
    <div className="search-page" role="dialog" aria-modal="true" aria-label="搜索">
      <div className="search-nav">
        <button type="button" className="search-back" aria-label="返回" onClick={onClose}>
          <I name="arrow-left" size={22} stroke={2}/>
        </button>
        <h1 className="search-nav-title">搜索</h1>
        {hasFilter && (
          <button type="button" className="search-reset" onClick={clearFilters}>清除</button>
        )}
      </div>

      <div className="search-field-wrap">
        <span className="search-field-ico" aria-hidden="true">
          <I name="search" size={18} stroke={1.8}/>
        </span>
        <input
          ref={inputRef}
          className="search-field"
          type="search"
          enterKeyHint="search"
          placeholder="输入关键字检索"
          value={query}
          onChange={e=>setQuery(e.target.value)}
        />
        {query && (
          <button type="button" className="search-field-clear" aria-label="清空" onClick={()=>setQuery('')}>
            <I name="close" size={14} stroke={2}/>
          </button>
        )}
      </div>

      <div className="search-scroll">
        <section className="search-tags-section" aria-label="标签筛选">
          <div className="search-tags">
            {SEARCH_TAGS.map(tag=>{
              const active = selectedIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  className={'search-tag'+(active ? ' is-active' : '')}
                  aria-pressed={active}
                  onClick={()=>toggleTag(tag.id)}
                >
                  {tag.emoji && <span className="search-tag-emoji" aria-hidden="true">{tag.emoji}</span>}
                  {tag.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="search-results" aria-live="polite">
          {!hasFilter && (
            <div className="search-empty search-empty--idle">
              <p className="search-empty-desc">输入关键字，或点选标签筛选</p>
            </div>
          )}

          {hasFilter && (
            <div className="search-results-head">
              <h2 className="search-results-title">搜索结果</h2>
              <span className="search-results-count">{results.length} 条</span>
            </div>
          )}

          {hasFilter && results.length === 0 && (
            <div className="search-empty">
              <p className="search-empty-title">没有找到相关记录</p>
              <p className="search-empty-desc">换个关键字或标签试试</p>
            </div>
          )}

          <div className="search-result-list">
            {results.map(item=>(
              <SearchResultCard key={item.id} item={item} query={query}/>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

Object.assign(window, { SearchPage, flattenSearchableItems });
