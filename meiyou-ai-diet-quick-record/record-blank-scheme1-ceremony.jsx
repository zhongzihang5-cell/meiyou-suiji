// ============ 场景三 · 方案一 — 空态 + 首条记录（连续过渡） ============

const { useState, useEffect, useRef } = React;

function RecordBlankScheme1({ ceremonyEntry, dayBlock, onCeremonyComplete }){
  const TlRecCardHead = window.TlRecCardHead;
  const TypewriterText = window.TypewriterText;
  const CycleDayHeader = window.CycleDayHeader;
  const inCeremony = !!ceremonyEntry;
  const [phase, setPhase] = useState(0);
  const [typedDone, setTypedDone] = useState(false);
  const doneRef = useRef(false);
  const entry = ceremonyEntry;
  const text = entry?.voiceText || entry?.body || '';
  const dayBlocks = dayBlock ? [dayBlock] : [];
  const items = entry ? [entry] : [];

  useEffect(()=>{
    if(!inCeremony){
      setPhase(0);
      setTypedDone(false);
      doneRef.current = false;
      return;
    }
    setTypedDone(false);
    doneRef.current = false;
    setPhase(1);
    const timers = [
      setTimeout(()=>setPhase(2), 560),
    ];
    return ()=>timers.forEach(clearTimeout);
  }, [inCeremony, entry?.id]);

  useEffect(()=>{
    if(!typedDone || !entry) return;
    setPhase(3);
    const tm = setTimeout(()=>{
      if(!doneRef.current){
        doneRef.current = true;
        onCeremonyComplete?.(entry);
      }
    }, 1100);
    return ()=>clearTimeout(tm);
  }, [typedDone, entry, onCeremonyComplete]);

  const dotCls = inCeremony
    ? (phase >= 1 ? ' is-settling' : '') + (phase >= 2 ? ' is-settled' : '')
    : '';

  return (
    <div className={'rb-s1-flow'+(inCeremony ? ' is-ceremony' : '')} aria-live="polite">
      {inCeremony ? (
        <div className="rb-s1-axis" aria-hidden="true">
          <span className="rb-s1-axis-rail"/>
          <span className={'rb-s1-axis-dot'+dotCls}/>
        </div>
      ) : null}

      <div className="rb-s1-main">
        <div className={'rb-s1-hero'+(inCeremony ? ' is-exiting' : '')}>
          <h2 className="rb-s1-hero-title">
            生活的点滴
            <br/>
            都值得被记下
          </h2>
          <p className="rb-s1-hero-hint">从记录此刻开始</p>
        </div>

        {inCeremony && entry && (
          <div className="tl-feed tl-rail-continuous rb-s1-timeline">
            {phase >= 3 && dayBlock && (
              <div className="tl-day-section-head tl-rail-break is-today rb-s1-summary-head is-visible">
                <CycleDayHeader day={dayBlock} items={items} dayBlocks={dayBlocks}/>
              </div>
            )}

            <div className="tl-rail-node is-feed-last">
              <div className="tl-rail-marker" aria-hidden="true">
                <span className="tl-rail-dot is-axis-sync"/>
              </div>
              <div className="tl-rail-body">
                <div className={'rb-s1-record-slot'+(phase >= 2 ? ' is-visible' : '')}>
                  <div className="tl-card tl-t5-card">
                    <TlRecCardHead time={entry.time}/>
                    <section className="tl-t5-main">
                      <div className="tl-t5-body">
                        {phase >= 2 ? (
                          <TypewriterText
                            text={text}
                            active={!typedDone}
                            charMs={46}
                            followScroll
                            onComplete={()=>setTypedDone(true)}
                          />
                        ) : null}
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { RecordBlankScheme1, RecordBlankScheme1Ceremony: RecordBlankScheme1 });
