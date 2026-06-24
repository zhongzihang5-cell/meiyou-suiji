// Tiny line-icon set used across the app
const Icon = ({name, size=20, stroke=1.6, ...p}) => {
  const common = {
    width:size, height:size, viewBox:"0 0 24 24",
    fill:"none", stroke:"currentColor", strokeWidth:stroke,
    strokeLinecap:"round", strokeLinejoin:"round", ...p
  };
  switch(name){
    case 'calendar': return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="16" rx="2.5"/>
        <path d="M3 10h18M8 3v4M16 3v4"/>
      </svg>
    );
    case 'settings': return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 5l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
      </svg>
    );
    case 'search': return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7"/>
        <path d="m20 20-3.5-3.5"/>
      </svg>
    );
    case 'camera': return (
      <svg {...common}>
        <path d="M3 7h3l2-2.5h8L18 7h3a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 21 20H3a1.5 1.5 0 0 1-1.5-1.5v-10A1.5 1.5 0 0 1 3 7z"/>
        <circle cx="12" cy="13" r="3.5"/>
      </svg>
    );
    case 'mic': return (
      <svg {...common}>
        <rect x="9" y="3" width="6" height="12" rx="3"/>
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>
      </svg>
    );
    case 'smile': return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9"/>
        <path d="M8.5 14a4 4 0 0 0 7 0"/>
        <circle cx="9" cy="10" r="0.6" fill="currentColor"/>
        <circle cx="15" cy="10" r="0.6" fill="currentColor"/>
      </svg>
    );
    case 'send': return (
      <svg {...common} strokeWidth="2">
        <path d="M5 12h14M13 6l6 6-6 6"/>
      </svg>
    );
    case 'arrow': return (
      <svg {...common}>
        <path d="M9 6l6 6-6 6"/>
      </svg>
    );
    case 'arrow-left': return (
      <svg {...common}>
        <path d="M15 6l-6 6 6 6"/>
      </svg>
    );
    case 'sparkle': return (
      <svg {...common} fill="currentColor" stroke="none">
        <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z"/>
      </svg>
    );
    case 'wand': return (
      <svg {...common} strokeWidth={Math.max(stroke, 2.2)}>
        <path d="M4 20L13 11"/>
        <path
          d="M14.2 2.8l1.6 3.7 3.7 1.6-3.7 1.6-1.6 3.7-1.6-3.7-3.7-1.6 3.7-1.6z"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    );
    case 'plus': return (
      <svg {...common} strokeWidth="2">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    );
    case 'home': return (
      <svg {...common}>
        <path d="M4 11l8-7 8 7v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 20z"/>
        <path d="M10 21v-7h4v7"/>
      </svg>
    );
    case 'gift': return (
      <svg {...common}>
        <rect x="3" y="9" width="18" height="12" rx="1.5"/>
        <path d="M3 13h18M12 9v12M8 9a3 3 0 0 1 4-3 3 3 0 0 1 4 3"/>
      </svg>
    );
    case 'line-chart': return (
      <svg {...common}>
        <path d="M4 19V5"/>
        <path d="M4 19h16"/>
        <path d="M7 15l3.2-3.4 3 2.4L18 8"/>
        <circle cx="7" cy="15" r="0.9" fill="currentColor" stroke="none"/>
        <circle cx="10.2" cy="11.6" r="0.9" fill="currentColor" stroke="none"/>
        <circle cx="13.2" cy="14" r="0.9" fill="currentColor" stroke="none"/>
        <circle cx="18" cy="8" r="0.9" fill="currentColor" stroke="none"/>
      </svg>
    );
    case 'user': return (
      <svg {...common}>
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 21a8 8 0 0 1 16 0"/>
      </svg>
    );
    case 'pen': return (
      <svg {...common}>
        <path d="M14 5l5 5-10 10H4v-5z"/>
        <path d="M13 6l5 5"/>
      </svg>
    );
    case 'image': return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="16" rx="2"/>
        <circle cx="9" cy="10" r="1.5"/>
        <path d="M21 16l-5-5-8 8"/>
      </svg>
    );
    case 'close': return (
      <svg {...common} strokeWidth="2">
        <path d="M6 6l12 12M18 6L6 18"/>
      </svg>
    );
    case 'check': return (
      <svg {...common} strokeWidth="2.4">
        <path d="M5 12l5 5L20 7"/>
      </svg>
    );
    case 'play': return (
      <svg {...common} fill="currentColor" stroke="none">
        <path d="M9 7.5v9l8-4.5-8-4.5z"/>
      </svg>
    );
    case 'pause': return (
      <svg {...common} fill="currentColor" stroke="none">
        <rect x="8" y="7" width="3" height="10" rx="0.5"/>
        <rect x="13" y="7" width="3" height="10" rx="0.5"/>
      </svg>
    );
    case 'leaf': return (
      <svg {...common}>
        <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z"/>
        <path d="M5 19c4-4 8-8 14-14"/>
      </svg>
    );
    case 'heart': return (
      <svg {...common}>
        <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>
      </svg>
    );
    default: return null;
  }
};

window.Icon = Icon;
