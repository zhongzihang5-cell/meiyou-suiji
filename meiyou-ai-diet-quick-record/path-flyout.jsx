// Path App scheme-3 — 弧形快捷菜单（复刻 path-effect-demo）

const PATH_FLYOUT_ITEMS = [
  { id:'diet', label:'饮食' },
  { id:'mood', label:'心情' },
  { id:'weight', label:'体重' },
  { id:'symptom', label:'症状' },
];

function QuickMenuPathFlyout({ onSelectItem, onDietClick, onOpenChange }){
  const QuickCardIcon = window.QuickCardIcon;
  const itemRefs = React.useRef({});
  const [open, setOpen] = React.useState(false);
  const [flyoutClass, setFlyoutClass] = React.useState('path-flyout-init');
  const [clickedId, setClickedId] = React.useState(null);
  const resetTimer = React.useRef(null);

  React.useEffect(()=>()=>{
    if(resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  const clearResetTimer = ()=>{
    if(resetTimer.current){
      clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }
  };

  const closeMenu = (animationClass = 'path-flyout-contract')=>{
    clearResetTimer();
    setOpen(false);
    onOpenChange?.(false);
    setFlyoutClass(animationClass);
    if(animationClass === 'path-flyout-contract'){
      resetTimer.current = setTimeout(()=>{
        setFlyoutClass('path-flyout-init');
        setClickedId(null);
      }, 520);
    }
  };

  const openMenu = ()=>{
    clearResetTimer();
    setClickedId(null);
    setFlyoutClass('path-flyout-expand');
    setOpen(true);
    onOpenChange?.(true);
  };

  const handleFabClick = ()=>{
    if(open) closeMenu('path-flyout-contract');
    else openMenu();
  };

  const handleItemClick = (item)=>{
    clearResetTimer();
    setClickedId(item.id);
    setFlyoutClass('path-flyout-fade');
    setOpen(false);
    onOpenChange?.(false);

    resetTimer.current = setTimeout(()=>{
      if(item.id === 'diet'){
        onDietClick?.(itemRefs.current[item.id], item);
      } else {
        onSelectItem?.(item.id);
      }
      setFlyoutClass('path-flyout-init');
      setClickedId(null);
    }, 480);
  };

  return (
    <div className="path-flyout-wrap">
      <ul className={'path-flyout '+flyoutClass} aria-label="快捷记录">
        {PATH_FLYOUT_ITEMS.map(item=>(
          <li key={item.id}>
            <button
              ref={el=>{ itemRefs.current[item.id] = el; }}
              type="button"
              className={clickedId === item.id ? 'is-clicked' : ''}
              aria-label={item.label}
              onClick={()=>handleItemClick(item)}
            >
              <span className="path-flyout-item-icon">
                <QuickCardIcon kind={item.id} color="var(--my-brand-red)" size={24}/>
              </span>
              <span className="path-flyout-item-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={'path-flyout-btn'+(open ? ' is-open' : '')}
        onClick={handleFabClick}
        aria-expanded={open}
        aria-label={open ? '收起快捷记录' : '快捷记录'}
      >
        <span className="path-flyout-gray-layer" aria-hidden="true"/>
        <span className="path-flyout-plus-icon" aria-hidden="true"/>
      </button>
    </div>
  );
}

Object.assign(window, { QuickMenuPathFlyout });
