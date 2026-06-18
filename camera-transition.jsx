// ============ 相机转场动效 · FLIP 卡片形变 ============

const TRANSITION_DURATION = 520;
const TRANSITION_EASING = 'cubic-bezier(0.5, 0.02, 0.1, 1)';
const OVERLAY_FADE_DURATION = Math.round(TRANSITION_DURATION * 0.55);

function measureElementRect(el, container) {
  if (!el || !container) return null;
  
  const elRect = el.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  
  return {
    left: elRect.left - containerRect.left,
    top: elRect.top - containerRect.top,
    width: elRect.width,
    height: elRect.height,
  };
}

// 模拟相册照片数据（真实用户图片）
const MOCK_PHOTOS = [
  { id: 'p1', date: '2026-06-03', time: '12:35', thumb: 'assets/gallery/IMG_9140-a0794273-c982-414f-8516-52af2c4456e1.png', type: 'food' },
  { id: 'p2', date: '2026-06-03', time: '11:20', thumb: 'assets/gallery/IMG_9145_2-72cf62bb-2ea4-45fa-977a-78f80ac3da58.png', type: 'food' },
  { id: 'p3', date: '2026-06-03', time: '10:15', thumb: 'assets/gallery/IMG_9139-a36f2639-6b62-453c-bdc1-2d7cd67b4d28.png', type: 'food' },
  { id: 'p4', date: '2026-06-03', time: '09:30', thumb: 'assets/gallery/IMG_9144-803d342e-cc05-4834-943e-4c52e0bad0d3.png', type: 'food' },
  { id: 'p5', date: '2026-06-02', time: '19:30', thumb: 'assets/gallery/IMG_9128-7218d6e2-498b-4980-8a99-218909c9881d.png', type: 'food' },
  { id: 'p6', date: '2026-06-02', time: '12:45', thumb: 'assets/gallery/IMG_9137-a082d61f-1417-483d-9122-37c8ebcb2861.png', type: 'food' },
  { id: 'p7', date: '2026-06-02', time: '08:00', thumb: 'assets/gallery/IMG_9129-0b57a26b-182e-49cc-ad71-7b972274a436.png', type: 'food' },
  { id: 'p8', date: '2026-06-01', time: '20:15', thumb: 'assets/gallery/IMG_9130-49592824-80e2-4ef5-a0c4-d094130b01d4.png', type: 'food' },
  { id: 'p9', date: '2026-06-01', time: '13:00', thumb: 'assets/gallery/IMG_9127-d09a43af-ea30-4eea-b165-d501765c5244.png', type: 'food' },
  { id: 'p10', date: '2026-06-01', time: '07:45', thumb: 'assets/gallery/1779691515990-7a645e8f-02b5-44f1-8fe5-7c60f1f4cc40.png', type: 'food' },
];

const PHOTO_PICKER_PLACEHOLDERS = Array.from({ length: 17 }, (_, index) => ({
  id: `placeholder-${index}`,
  placeholder: true,
  thumb: MOCK_PHOTOS[index % MOCK_PHOTOS.length].thumb,
}));

const PHOTO_PICKER_ITEMS = [...MOCK_PHOTOS, ...PHOTO_PICKER_PLACEHOLDERS];

function PhotoPicker({ onSelect, onClose }) {
  const I = window.Icon;
  const [activeTab, setActiveTab] = React.useState('photos');

  return (
    <div className="photo-picker">
      <div className="photo-picker-header">
        <button type="button" className="photo-picker-close" onClick={onClose} aria-label="关闭">
          <I name="x" size={20} stroke={2.2} />
        </button>
        <div className="photo-picker-tabs" role="tablist" aria-label="相册类型">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'photos'}
            className={'photo-picker-tab' + (activeTab === 'photos' ? ' is-active' : '')}
            onClick={() => setActiveTab('photos')}
          >
            照片
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'collections'}
            className={'photo-picker-tab' + (activeTab === 'collections' ? ' is-active' : '')}
            onClick={() => setActiveTab('collections')}
          >
            精选集
          </button>
        </div>
        <div className="photo-picker-header-spacer" aria-hidden="true" />
      </div>

      <div className="photo-picker-content">
        {activeTab === 'photos' ? (
          <div className="photo-grid">
            {PHOTO_PICKER_ITEMS.map(photo => (
              photo.placeholder ? (
                <div
                  key={photo.id}
                  className="photo-item is-placeholder"
                  aria-hidden="true"
                >
                  <img src={photo.thumb} alt="" loading="lazy" />
                </div>
              ) : (
                <button
                  key={photo.id}
                  type="button"
                  className="photo-item"
                  onClick={() => onSelect(photo)}
                >
                  <img src={photo.thumb} alt="" loading="lazy" />
                </button>
              )
            ))}
          </div>
        ) : (
          <div className="photo-picker-empty">暂无精选集</div>
        )}
      </div>

      <div className="photo-picker-floats">
        <button type="button" className="photo-picker-float-btn" aria-label="更多">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 4.5h12M3 9h12M3 13.5h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>
        <button type="button" className="photo-picker-float-btn" aria-label="搜索">
          <I name="search" size={18} stroke={2} />
        </button>
      </div>
    </div>
  );
}

function PhotoPickerSheet({ onSelect, onClose }) {
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={'photo-picker-sheet' + (entered ? ' is-open' : '')}>
      <button
        type="button"
        className="photo-picker-sheet-backdrop"
        onClick={onClose}
        aria-label="关闭相册"
      />
      <div className="photo-picker-sheet-panel">
        <PhotoPicker onSelect={onSelect} onClose={onClose} />
      </div>
    </div>
  );
}

const CAMERA_HELP_TEXT = '确保食物在辅助框内';
const SHOOT_EXAMPLE_GOOD = 'assets/camera/shoot-example-good.png';
const SHOOT_EXAMPLE_BAD = 'assets/camera/shoot-example-bad.png';
function CameraShootingGuideSheet({ onClose }) {
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={'camera-guide-sheet' + (entered ? ' is-open' : '')}>
      <button
        type="button"
        className="camera-guide-sheet-backdrop"
        onClick={onClose}
        aria-label="关闭拍摄示例"
      />
      <div className="camera-guide-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="camera-guide-title">
        <h2 id="camera-guide-title" className="camera-guide-title">拍摄示例</h2>
        <p className="camera-guide-subtitle">请上传或拍摄如左图所示的食物照片</p>
        <div className="camera-guide-examples">
          <div className="camera-guide-example">
            <div className="camera-guide-example-photo">
              <img src={SHOOT_EXAMPLE_GOOD} alt="推荐拍摄示例" loading="lazy" />
            </div>
            <div className="camera-guide-badge is-good" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4.5 9.2l2.6 2.6 6.4-6.8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="camera-guide-example">
            <div className="camera-guide-example-photo">
              <img src={SHOOT_EXAMPLE_BAD} alt="不推荐拍摄示例" loading="lazy" />
            </div>
            <div className="camera-guide-badge is-bad" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M5.4 5.4l7.2 7.2M12.6 5.4l-7.2 7.2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
        <button type="button" className="camera-guide-confirm" onClick={onClose}>
          知道了
        </button>
      </div>
    </div>
  );
}

const CAMERA_PERMISSION_SCENARIO_KEY = 'my-demo-camera-permission-scenario';

const CAMERA_PERMISSION_SCENARIOS = [
  { value: 'unauthorized', label: '场景1 · 未授权' },
  { value: 'authorized', label: '场景2 · 已授权' },
  // text-diet（原场景3 · 文字/语音饮食）已从演示条隐藏，逻辑仍保留在 isDietTextRecordScenario
];

function isCameraPermissionScenario(value) {
  return value === 'unauthorized' || value === 'authorized';
}

function isDietTextRecordScenario(value) {
  return value === 'text-diet'
    || value === 'text-names-only'
    || value === 'text-with-portion';
}

function readCameraPermissionScenario() {
  try {
    const value = sessionStorage.getItem(CAMERA_PERMISSION_SCENARIO_KEY) || 'unauthorized';
    if (value === 'text-diet' || value === 'text-names-only' || value === 'text-with-portion') {
      return 'authorized';
    }
    return value;
  } catch {
    return 'unauthorized';
  }
}

function writeCameraPermissionScenario(value) {
  try {
    sessionStorage.setItem(CAMERA_PERMISSION_SCENARIO_KEY, value);
    window.dispatchEvent(new Event('cameraPermissionScenarioChange'));
  } catch {}
}

function CameraPermissionIcon() {
  return (
    <div className="camera-perm-icon" aria-hidden="true">
      <div className="camera-perm-icon-main">
        <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
          <path
            d="M3 6.5A2.5 2.5 0 015.5 4h4.2l2.2-2.4A1.2 1.2 0 0012.6 1h2.8c.4 0 .8.2 1 .5L18.6 4H23A2.5 2.5 0 0125.5 6.5v11A2.5 2.5 0 0123 20H5.5A2.5 2.5 0 013 17.5v-11z"
            fill="#fff"
          />
          <circle cx="14.5" cy="12" r="4.2" fill="#8E8E93"/>
          <circle cx="14.5" cy="12" r="2.6" fill="#fff"/>
        </svg>
      </div>
      <div className="camera-perm-icon-badge">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect width="14" height="14" rx="3" fill="#007AFF"/>
          <path
            d="M4.2 6.8c0-1 .8-1.8 1.8-1.8h.4c.5 0 .9.4.9.9v.2c0 .5-.4.9-.9.9h-.4c-.2 0-.4.2-.4.4v2.2c0 .3.2.5.5.5h.6c.3 0 .5.2.5.5v.2c0 .5-.4.9-.9.9H5.5c-.5 0-.9-.4-.9-.9V6.8z"
            fill="#fff"
          />
          <path
            d="M8.8 4.8c0-.5.4-.9.9-.9h.8c.5 0 .9.4.9.9v5.6c0 .5-.4.9-.9.9h-.8c-.5 0-.9-.4-.9-.9V4.8z"
            fill="#fff"
          />
          <path d="M8.3 9.8h2.8v1.4H8.3V9.8z" fill="#fff"/>
        </svg>
      </div>
    </div>
  );
}

function CameraPermissionDialog({ onAllow, onDeny }) {
  return (
    <div className="camera-perm-overlay" role="dialog" aria-modal="true" aria-labelledby="camera-perm-title">
      <div className="camera-perm-dialog">
        <CameraPermissionIcon/>
        <h2 id="camera-perm-title" className="camera-perm-title">美柚想访问相机</h2>
        <p className="camera-perm-subtitle">为您提供记录食物及热量分析功能，请允许APP访问相机拍摄食物照片</p>
        <div className="camera-perm-actions">
          <button type="button" className="camera-perm-btn" onClick={onDeny}>不允许</button>
          <button type="button" className="camera-perm-btn" onClick={onAllow}>允许</button>
        </div>
      </div>
    </div>
  );
}

function PhotoLibraryIcon() {
  return (
    <div className="photo-lib-perm-icon" aria-hidden="true">
      <svg className="photo-lib-perm-icon-main" width="56" height="56" viewBox="0 0 56 56" fill="none">
        <rect width="56" height="56" rx="13" fill="url(#photoLibGrad)"/>
        <path d="M28 16c-5.2 0-9.4 4-9.4 8.9 0 4.2 2.8 7.7 6.6 8.7-1.1.8-1.8 2.1-1.8 3.5 0 2.5 2.1 4.5 4.6 4.5s4.6-2 4.6-4.5c0-1.4-.7-2.7-1.8-3.5 3.8-1 6.6-4.5 6.6-8.7C37.4 20 33.2 16 28 16z" fill="#fff" opacity="0.95"/>
        <circle cx="20" cy="22" r="3" fill="#FFD60A"/>
        <circle cx="36" cy="34" r="2.5" fill="#34C759"/>
        <circle cx="31" cy="24" r="2" fill="#FF9500"/>
        <defs>
          <linearGradient id="photoLibGrad" x1="8" y1="6" x2="48" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF7BAC"/>
            <stop offset="0.35" stopColor="#FFD56A"/>
            <stop offset="0.65" stopColor="#65D6FF"/>
            <stop offset="1" stopColor="#B58BFF"/>
          </linearGradient>
        </defs>
      </svg>
      <span className="photo-lib-perm-icon-badge">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="9" fill="#007AFF"/>
          <path d="M6.2 8.4c0-.8.6-1.4 1.4-1.4h.3c.4 0 .7.3.7.7v.2c0 .4-.3.7-.7.7h-.3c-.2 0-.3.1-.3.3v1.8c0 .2.2.4.4.4h.5c.2 0 .4.2.4.4v.2c0 .4-.3.7-.7.7H6.9c-.4 0-.7-.3-.7-.7V8.4z" fill="#fff"/>
          <path d="M10.8 6.6c0-.4.3-.7.7-.7h.6c.4 0 .7.3.7.7v4.6c0 .4-.3.7-.7.7h-.6c-.4 0-.7-.3-.7-.7V6.6z" fill="#fff"/>
        </svg>
      </span>
    </div>
  );
}

function PhotoLibraryPermissionDialog({ onAllowFull, onLimit, onDeny }) {
  const previewPhotos = MOCK_PHOTOS.slice(0, 8);

  return (
    <div className="photo-lib-perm-overlay" role="dialog" aria-modal="true" aria-labelledby="photo-lib-perm-title">
      <div className="photo-lib-perm-dialog">
        <PhotoLibraryIcon/>
        <h2 id="photo-lib-perm-title" className="photo-lib-perm-title">“美柚”想完全访问你的照片图库。</h2>
        <p className="photo-lib-perm-subtitle">为了分析图片识别热量。请授予相册访问权限。</p>
        <div className="photo-lib-perm-grid">
          {previewPhotos.map((photo) => (
            <div key={photo.id} className="photo-lib-perm-grid-item">
              <img src={photo.thumb} alt="" loading="lazy" />
            </div>
          ))}
        </div>
        <p className="photo-lib-perm-stats">32,414 张照片、924 个视频</p>
        <p className="photo-lib-perm-note">照片可能包含与位置、景深信息、说明和音频关联的数据。</p>
        <div className="photo-lib-perm-actions">
          <button type="button" className="photo-lib-perm-btn" onClick={onLimit}>限制访问...</button>
          <button type="button" className="photo-lib-perm-btn" onClick={onAllowFull}>允许完全访问</button>
          <button type="button" className="photo-lib-perm-btn" onClick={onDeny}>不允许</button>
        </div>
      </div>
    </div>
  );
}

function PermissionPrivacyNote() {
  return (
    <p className="camera-perm-blocked-privacy">
      <svg className="camera-perm-blocked-shield" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2.5l7.5 3.75V11c0 4.55-3.1 8.35-7.5 9.25-4.4-.9-7.5-4.7-7.5-9.25V6.25L12 2.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M9.5 12.2l1.8 1.8 3.7-3.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>美柚将保护你的隐私，你也可随时关闭授权</span>
    </p>
  );
}

function CameraPermissionBlocked({ onEnable }) {
  const I = window.Icon;

  return (
    <div className="camera-perm-blocked">
      <div className="camera-perm-blocked-body">
        <h2 className="camera-perm-blocked-title">允许开启以下权限即可记录饮食</h2>
        <div className="camera-perm-blocked-col">
          <PermissionPrivacyNote />
          <div className="camera-perm-blocked-list">
            <div className="camera-perm-blocked-item">
              <span className="camera-perm-blocked-item-ico" aria-hidden="true">
                <I name="camera" size={20} stroke={1.5} />
              </span>
              <div className="camera-perm-blocked-item-text">
                <span className="camera-perm-blocked-item-title">允许访问相机</span>
                <span className="camera-perm-blocked-item-desc">用于拍摄照片</span>
              </div>
            </div>
          </div>
          <button type="button" className="camera-perm-blocked-enable" onClick={onEnable}>
            立即开启
          </button>
        </div>
      </div>
    </div>
  );
}

function CameraCaptureAnalyzePanel({
  phase,
  progress = 0,
  errorKind = null,
  onRetry,
  onRetake,
  showRetry,
  isExhausted,
}) {
  const isLoading = phase === 'loading';
  const isTimeoutError = phase === 'error' && errorKind === 'timeout';
  const isNotFoodError = phase === 'error' && errorKind === 'not-food';

  return (
    <div className={'camera-analyze-sheet' + (isLoading ? ' is-loading' : '') + (phase === 'error' ? ' is-error' : '') + (isNotFoodError ? ' is-not-food' : '')}>
      <div className="camera-analyze-progress-track" aria-hidden={!isLoading}>
        <div
          className="camera-analyze-progress-fill"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>
      <div className="camera-analyze-status-row">
        {isLoading && (
          <>
            <span className="camera-analyze-status-text">正在识别食物......</span>
            <span className="camera-analyze-status-icon" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="#007AFF"/>
                <path d="M5 8.2l1.8 1.8L11 5.8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </>
        )}
        {isTimeoutError && !isExhausted && (
          <>
            <span className="camera-analyze-status-text">AI识别遇到点小问题</span>
            <div className="camera-analyze-actions">
              {showRetry && (
                <button type="button" className="camera-analyze-action-btn" onClick={onRetry}>
                  重试
                </button>
              )}
              <button type="button" className="camera-analyze-action-btn" onClick={onRetake}>
                重拍
              </button>
            </div>
          </>
        )}
        {isTimeoutError && isExhausted && (
          <>
            <span className="camera-analyze-status-text camera-analyze-status-text--muted">
              识别失败，请重拍一张
            </span>
            <button type="button" className="camera-analyze-action-btn" onClick={onRetake}>
              重拍
            </button>
          </>
        )}
        {isNotFoodError && (
          <>
            <span className="camera-analyze-status-text">没有检测到食物，重拍一张</span>
            <button type="button" className="camera-analyze-action-btn" onClick={onRetake}>
              重拍
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function useDietPhotoAnalyze({ onSuccess, onAnalyzeStart }) {
  const loadingMs = window.PHOTO_ANALYZE_LOADING_MS || 5000;
  const mockRecognize = window.mockRecognizeDietPhoto || (() => ({ ok: true }));
  const readScenario = window.readDietRecognitionScenario || (() => 'success');
  const getMaxFailures = window.getDietRecognitionMaxFailures || (() => 5);
  const resolveAnalyzeMs = window.getDietRecognitionAnalyzeMs || ((scenario, ms) => ms);

  const [phase, setPhase] = React.useState(null);
  const [photoUrl, setPhotoUrl] = React.useState(null);
  const [progress, setProgress] = React.useState(0);
  const [failureCount, setFailureCount] = React.useState(0);
  const [errorKind, setErrorKind] = React.useState(null);
  const analyzeTimerRef = React.useRef(null);
  const progressTimerRef = React.useRef(null);
  const finishTimerRef = React.useRef(null);

  const scenario = readScenario();
  const maxFailures = getMaxFailures(scenario);
  const isExhausted = phase === 'error' && errorKind === 'timeout' && failureCount >= maxFailures;

  const clearTimers = React.useCallback(() => {
    if (analyzeTimerRef.current) {
      window.clearTimeout(analyzeTimerRef.current);
      analyzeTimerRef.current = null;
    }
    if (progressTimerRef.current) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    if (finishTimerRef.current) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
  }, []);

  const reset = React.useCallback(() => {
    clearTimers();
    setPhase(null);
    setPhotoUrl(null);
    setProgress(0);
    setFailureCount(0);
    setErrorKind(null);
  }, [clearTimers]);

  const runAnalyze = React.useCallback(({ url, isRetry = false, forceSuccess = false, meta } = {}) => {
    if (!url) return;
    clearTimers();
    setPhotoUrl(url);
    setPhase('loading');
    setProgress(6);
    setErrorKind(null);
    if (!isRetry) setFailureCount(0);
    onAnalyzeStart?.();

    const activeScenario = readScenario();
    const analyzeMs = resolveAnalyzeMs(activeScenario, loadingMs);
    const isEarlySuccess = activeScenario === 'success';
    const startedAt = Date.now();
    progressTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const pct = Math.min(isEarlySuccess ? 58 : 92, 6 + (elapsed / loadingMs) * 86);
      setProgress(pct);
    }, 100);

    analyzeTimerRef.current = window.setTimeout(() => {
      clearTimers();
      const result = mockRecognize({ scenario: readScenario(), forceSuccess });
      if (result?.ok) {
        finishTimerRef.current = window.setTimeout(() => {
          onSuccess?.({ photoUrl: url, ...meta });
          reset();
        }, 160);
        return;
      }
      setProgress(0);
      setPhase('error');
      setErrorKind(result?.reason === 'not-food' ? 'not-food' : 'timeout');
      if (isRetry && result?.reason !== 'not-food') {
        setFailureCount((count) => count + 1);
      }
    }, analyzeMs);
  }, [clearTimers, loadingMs, mockRecognize, onAnalyzeStart, onSuccess, readScenario, reset, resolveAnalyzeMs]);

  const handleRetry = React.useCallback((event) => {
    if (phase !== 'error' || errorKind !== 'timeout' || failureCount >= maxFailures || !photoUrl) return;
    const forceSuccess = !!(event?.altKey || event?.metaKey);
    runAnalyze({ url: photoUrl, isRetry: true, forceSuccess });
  }, [errorKind, failureCount, maxFailures, phase, photoUrl, runAnalyze]);

  const handleRetake = React.useCallback(() => {
    clearTimers();
    setPhase(null);
    setPhotoUrl(null);
    setProgress(0);
    setFailureCount(0);
    setErrorKind(null);
  }, [clearTimers]);

  React.useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    phase,
    photoUrl,
    progress,
    failureCount,
    maxFailures,
    errorKind,
    isExhausted,
    runAnalyze,
    handleRetry,
    handleRetake,
    reset,
    isAnalyzing: phase != null,
  };
}

function CameraView({
  onCapture,
  onClose,
  onOpenGallery,
  visible,
  permPending,
  permDenied,
  showPhotoPermDialog,
  showGallery,
  onCloseGallery,
  onSelectPhoto,
  onPermissionAllow,
  onPermissionDeny,
  onPermissionEnable,
  onPhotoPermAllowFull,
  onPhotoPermLimit,
  onPhotoPermDeny,
  analyzePhase = null,
  capturedPhotoUrl = null,
  analyzeProgress = 0,
  analyzeFailureCount = 0,
  analyzeMaxFailures = 5,
  analyzeExhausted = false,
  analyzeErrorKind = null,
  onAnalyzeRetry,
  onAnalyzeRetake,
}) {
  const I = window.Icon;
  const [flash, setFlash] = React.useState(false);
  
  const handleCapture = () => {
    if (permPending || permDenied || analyzePhase) return;
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
      onCapture?.();
    }, 150);
  };

  const showAnalyze = !!analyzePhase;
  const showPreview = !!capturedPhotoUrl;
  
  return (
    <div className={'camera-view' + (visible ? ' is-visible' : '') + (permPending ? ' is-perm-pending' : '') + (permDenied ? ' is-perm-denied' : '') + (showGallery ? ' is-gallery-open' : '') + (showAnalyze ? ' is-analyzing' : '')}>
      <button type="button" className="camera-close-btn" onClick={onClose} aria-label="返回">
        <I name="chevron-left" size={24} stroke={2.2} />
      </button>
      
      <div className="camera-main">
        {permDenied ? (
          <CameraPermissionBlocked onEnable={onPermissionEnable} />
        ) : showPreview ? (
          <div className="camera-capture-stage">
            <img src={capturedPhotoUrl} alt="" className="camera-capture-photo"/>
            <span className="camera-frame-corner tl"/>
            <span className="camera-frame-corner tr"/>
            <span className="camera-frame-corner bl"/>
            <span className="camera-frame-corner br"/>
            {analyzePhase === 'loading' && <div className="camera-scan-line" aria-hidden="true"/>}
          </div>
        ) : (
          <>
            <div className="camera-frame">
              {permPending && (
                <CameraPermissionDialog
                  onAllow={onPermissionAllow}
                  onDeny={onPermissionDeny}
                />
              )}
              <span className="camera-frame-corner tl"/>
              <span className="camera-frame-corner tr"/>
              <span className="camera-frame-corner bl"/>
              <span className="camera-frame-corner br"/>
            </div>
            <div className="camera-hint">{CAMERA_HELP_TEXT}</div>
          </>
        )}
        {flash && <div className="camera-flash" />}
      </div>

      {showPhotoPermDialog && (
        <PhotoLibraryPermissionDialog
          onAllowFull={onPhotoPermAllowFull}
          onLimit={onPhotoPermLimit}
          onDeny={onPhotoPermDeny}
        />
      )}

      {showGallery && (
        <PhotoPickerSheet
          onSelect={onSelectPhoto}
          onClose={onCloseGallery}
        />
      )}

      <div className="camera-bottom-bar">
        {showAnalyze ? (
          <CameraCaptureAnalyzePanel
            phase={analyzePhase}
            progress={analyzeProgress}
            errorKind={analyzeErrorKind}
            onRetry={onAnalyzeRetry}
            onRetake={onAnalyzeRetake}
            showRetry={analyzeFailureCount < analyzeMaxFailures}
            isExhausted={analyzeExhausted}
          />
        ) : (
          <div className="camera-controls">
            {!showGallery && (
              <button type="button" className="camera-gallery-btn" onClick={onOpenGallery} aria-label="相册">
                <I name="image" size={24} stroke={1.5} />
              </button>
            )}
            {!permDenied && (
              <button
                type="button"
                className={'camera-shutter' + (permPending ? ' is-disabled' : '')}
                onClick={handleCapture}
                aria-label="拍照"
                disabled={permPending}
              >
                <span className="camera-shutter-ring"/>
                <span className="camera-shutter-inner"/>
              </button>
            )}
            {!showGallery && (
              <span className="camera-controls-side" aria-hidden="true"/>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CameraTransition({ 
  active, 
  sourceRect, 
  cardContent,
  containerRef,
  onCaptureSuccess,
  onClose,
  onSelectPhoto,
  onActiveChange,
}) {
  const [phase, setPhase] = React.useState('idle');
  const [showGallery, setShowGallery] = React.useState(false);
  const [permScenario, setPermScenario] = React.useState(() => readCameraPermissionScenario());
  const [sessionGranted, setSessionGranted] = React.useState(false);
  const [sessionDenied, setSessionDenied] = React.useState(false);
  const [photoPermGranted, setPhotoPermGranted] = React.useState(false);
  const [showPhotoPermDialog, setShowPhotoPermDialog] = React.useState(false);
  const wrapperRef = React.useRef(null);

  const containerSize = React.useMemo(() => {
    const el = containerRef?.current;
    if (!el) return { width: 402, height: 742 };
    const body = el.querySelector?.('.phone-body') || el;
    return {
      width: body.offsetWidth || el.offsetWidth,
      height: body.offsetHeight || el.offsetHeight,
    };
  }, [containerRef, active]);

  React.useLayoutEffect(() => {
    if (active && sourceRect && phase === 'idle') {
      setPhase('initial');
      setShowGallery(false);
      setPermScenario(readCameraPermissionScenario());
      setSessionGranted(false);
      setSessionDenied(false);
      setPhotoPermGranted(false);
      setShowPhotoPermDialog(false);
    }
  }, [active, sourceRect, phase]);

  React.useEffect(() => {
    const onScenarioChange = () => {
      setPermScenario(readCameraPermissionScenario());
      setSessionGranted(false);
      setSessionDenied(false);
      setPhotoPermGranted(false);
      setShowPhotoPermDialog(false);
    };
    window.addEventListener('cameraPermissionScenarioChange', onScenarioChange);
    return () => window.removeEventListener('cameraPermissionScenarioChange', onScenarioChange);
  }, []);
  
  React.useEffect(() => {
    if (phase === 'initial') {
      const timer = setTimeout(() => {
        setPhase('animating');
        setTimeout(() => {
          setPhase('complete');
        }, TRANSITION_DURATION);
      }, 20);
      return () => clearTimeout(timer);
    }
    
    if (!active && phase === 'complete') {
      setPhase('closing');
    }
    
    if (phase === 'closing') {
      const timer = setTimeout(() => {
        setPhase('idle');
        setShowGallery(false);
      }, TRANSITION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [active, phase]);

  React.useEffect(() => {
    onActiveChange?.(phase !== 'idle');
  }, [phase, onActiveChange]);

  const mounted = phase !== 'idle';
  const isInitialPosition = phase === 'initial' || phase === 'closing';
  const showCamera = phase === 'animating' || phase === 'complete';
  const showPermissionDialog = showCamera
    && !showGallery
    && permScenario === 'unauthorized'
    && !sessionGranted
    && !sessionDenied;
  const showPermissionBlocked = showCamera
    && !showGallery
    && permScenario === 'unauthorized'
    && !sessionGranted
    && sessionDenied;

  const handlePermissionAllow = () => {
    setSessionGranted(true);
    setSessionDenied(false);
  };

  const handlePermissionDeny = () => {
    setSessionDenied(true);
  };

  const handlePermissionEnable = () => {
    setSessionGranted(true);
    setSessionDenied(false);
  };
  
  const handleOpenGallery = () => {
    if (photoPermGranted) {
      setShowGallery(true);
      return;
    }
    setShowPhotoPermDialog(true);
  };

  const handlePhotoPermAllowFull = () => {
    setPhotoPermGranted(true);
    setShowPhotoPermDialog(false);
    setShowGallery(true);
  };

  const handlePhotoPermLimit = () => {
    setShowPhotoPermDialog(false);
  };

  const handlePhotoPermDeny = () => {
    setShowPhotoPermDialog(false);
  };
  
  const handleCloseGallery = () => {
    setShowGallery(false);
  };

  const handleAnalyzeSuccess = React.useCallback((payload) => {
    onCaptureSuccess?.(payload);
    onClose?.();
  }, [onCaptureSuccess, onClose]);

  const analyze = useDietPhotoAnalyze({ onSuccess: handleAnalyzeSuccess });

  const handleCameraClose = () => {
    if (showGallery) {
      handleCloseGallery();
      return;
    }
    analyze.reset();
    onClose?.();
  };

  const handleCapturePhoto = () => {
    const photoUrl = window.pickFallbackPhoto?.() || null;
    analyze.runAnalyze({ url: photoUrl, meta: { type: 'capture' } });
  };
  
  const handleSelectPhoto = (photo) => {
    setShowGallery(false);
    const photoUrl = photo?.thumb || photo?.url || window.pickFallbackPhoto?.() || null;
    analyze.runAnalyze({ url: photoUrl, meta: { type: 'select', photo } });
  };

  if (!mounted || !sourceRect) return null;

  const rect = sourceRect;
  
  // 使用 absolute 定位，相对于 .phone 容器
  const wrapperStyle = isInitialPosition ? {
    position: 'absolute',
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    borderRadius: 12,
  } : {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    borderRadius: 0,
  };
  
  const innerOffset = isInitialPosition ? {
    x: -rect.left,
    y: -rect.top,
  } : {
    x: 0,
    y: 0,
  };

  const isFullScreen = phase === 'animating' || phase === 'complete';

  const content = (
    <div 
      ref={wrapperRef}
      className={'camera-transition-wrapper phase-' + phase}
      style={{
        ...wrapperStyle,
        overflow: 'hidden',
        zIndex: 9999,
        background: '#000',
        transition: phase === 'animating' || phase === 'closing' || phase === 'closed' 
          ? `left ${TRANSITION_DURATION}ms ${TRANSITION_EASING}, 
             top ${TRANSITION_DURATION}ms ${TRANSITION_EASING}, 
             width ${TRANSITION_DURATION}ms ${TRANSITION_EASING}, 
             height ${TRANSITION_DURATION}ms ${TRANSITION_EASING}, 
             border-radius ${TRANSITION_DURATION}ms ${TRANSITION_EASING}` 
          : 'none',
      }}
    >
      <div 
        className="camera-transition-inner"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: isFullScreen ? '100%' : containerSize.width,
          height: isFullScreen ? '100%' : containerSize.height,
          transform: `translate(${innerOffset.x}px, ${innerOffset.y}px)`,
          transition: phase === 'animating' || phase === 'closing' || phase === 'closed'
            ? `transform ${TRANSITION_DURATION}ms ${TRANSITION_EASING}` 
            : 'none',
        }}
      >
        <CameraView 
            onCapture={handleCapturePhoto} 
            onClose={handleCameraClose}
            onOpenGallery={handleOpenGallery}
            visible={showCamera}
            permPending={showPermissionDialog}
            permDenied={showPermissionBlocked}
            showPhotoPermDialog={showPhotoPermDialog}
            showGallery={showGallery}
            onCloseGallery={handleCloseGallery}
            onSelectPhoto={handleSelectPhoto}
            onPermissionAllow={handlePermissionAllow}
            onPermissionDeny={handlePermissionDeny}
            onPermissionEnable={handlePermissionEnable}
            onPhotoPermAllowFull={handlePhotoPermAllowFull}
            onPhotoPermLimit={handlePhotoPermLimit}
            onPhotoPermDeny={handlePhotoPermDeny}
            analyzePhase={analyze.phase}
            capturedPhotoUrl={analyze.photoUrl}
            analyzeProgress={analyze.progress}
            analyzeFailureCount={analyze.failureCount}
            analyzeMaxFailures={analyze.maxFailures}
            analyzeExhausted={analyze.isExhausted}
            analyzeErrorKind={analyze.errorKind}
            onAnalyzeRetry={analyze.handleRetry}
            onAnalyzeRetake={analyze.handleRetake}
          />
      </div>
      
      <div 
        className="camera-transition-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '0 20px 0 16px',
          gap: 10,
          borderRadius: 'inherit',
          opacity: isInitialPosition ? 1 : 0,
          transition: `opacity ${OVERLAY_FADE_DURATION}ms ${TRANSITION_EASING}`,
          pointerEvents: 'none',
        }}
      >
        {cardContent}
      </div>
    </div>
  );

  const portalTarget = containerRef?.current?.closest?.('.phone') || containerRef?.current;
  if (portalTarget && window.ReactDOM?.createPortal) {
    return window.ReactDOM.createPortal(content, portalTarget);
  }
  return content;
}

function CameraPermissionScenarioBar() {
  const [value, setValue] = React.useState(() => readCameraPermissionScenario());

  React.useEffect(() => {
    const onChange = () => setValue(readCameraPermissionScenario());
    window.addEventListener('cameraPermissionScenarioChange', onChange);
    return () => window.removeEventListener('cameraPermissionScenarioChange', onChange);
  }, []);

  const handleChange = (next) => {
    writeCameraPermissionScenario(next);
    setValue(next);
  };

  return (
    <div className="demo-scene-dock" role="toolbar" aria-label="相机权限场景切换">
      <div className="demo-scene-dock-label">相机权限</div>
      <div className="demo-scene-dock-options">
        {CAMERA_PERMISSION_SCENARIOS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={'demo-scene-dock-btn' + (value === opt.value ? ' active' : '')}
            aria-pressed={value === opt.value}
            onClick={() => handleChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <p className="demo-scene-dock-hint">
        {{
          unauthorized: '未授权：每次进入饮食相机都会先弹出权限弹窗；点「不允许」后显示权限引导页',
          authorized: '已授权：进入饮食相机不再弹出权限弹窗',
        }[value] || ''}
      </p>
    </div>
  );
}

Object.assign(window, {
  CameraView,
  CameraTransition,
  PhotoPicker,
  PhotoPickerSheet,
  CameraPermissionDialog,
  CameraPermissionBlocked,
  PhotoLibraryPermissionDialog,
  CameraPermissionScenarioBar,
  measureElementRect,
  readCameraPermissionScenario,
  writeCameraPermissionScenario,
  isCameraPermissionScenario,
  isDietTextRecordScenario,
  CAMERA_PERMISSION_SCENARIOS,
});
