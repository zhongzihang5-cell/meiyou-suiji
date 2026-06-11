# HANDOFF.md — 会话交接文档

## 项目当前状态

### 分支
`UX_+&mood`

### 最近 10 次 commit
```
db3e241 日期格式统一为X月X日 + 下拉查看更多文案与动效
2016e79 调整时间轴日期结构：新增4/18、改5/19→5/15、5/20→5/16、修正条数显示
0972650 语音演示流程：按住说话→6阶段流式生成3条记录卡片
34b0529 恢复编辑页演示场景切换器，与URL参数共存
6b7b330 合并编辑页：iframe全屏浮层方案
7f0010c 卡片更多菜单、顶部栏置顶、底部栏图标替换、Tab图标替换
b331e01 3项调整
d4c5aad Fix dev server: switch to Ruby WEBrick to bypass macOS permission error
1b6dc74 Create launch.json
6daa200 Refine scene 4 quick-record demo with radial menu and mood picker.
```

### 未提交改动
无（clean working tree）

### 项目目录结构（关键文件）
```
.
├── index.html              # 主入口，含 iframe 编辑浮层 + resetDemo 按钮
├── app.jsx                 # React App 根组件，演示流程 6 阶段逻辑
├── cloud-publisher.jsx     # 底部 Dock：输入栏 + 语音按钮 + 浮层指示器
├── cloud.css               # Dock 样式 + 演示动效 CSS
├── timeline.jsx            # TimelineStream 渲染 + appendTimelineEntry
├── timeline.css            # 时间轴样式 + 卡片入场动效 + 下拉提示动画
├── timeline-modules.jsx    # CycleDayHeader + summarizeDayItems + 日期格式
├── timeline-sister-cards.jsx # CardMoreMenu + DemoVoiceCard + SegmentedRecordCard
├── timeline-v3v2-cards.jsx # V3v2Card + V3v2Header + sourceFrom 渲染
├── data.jsx                # TIMELINE_BLOCKS 数据定义
├── demo-scenes.jsx         # 场景配置 + getTimeline()
├── components.jsx          # TabBar + StatusBar
├── quick-pickers.jsx       # MoodQuickOverlay + 心情选择器
├── diandi_edit.html        # 编辑页（独立 HTML，iframe 加载）
├── CLAUDE.md               # 项目规范（锁定组件列表）
├── serve.py                # Python HTTP 服务器（备用）
├── .claude/launch.json     # Ruby WEBrick 服务器配置（端口 8765）
└── assets/                 # 图片资源
```

---

## 已完成的工作（时间倒序）

### 8. 日期格式统一 + 下拉查看更多动效
- **描述**: 日期从 `5/14` 改为 `5月14日`；gap 文案改为 `↓ 下拉查看更多` + 呼吸浮动动画
- **文件**: `timeline-modules.jsx`, `timeline.jsx`, `timeline.css`, `app.jsx`, `index.html`
- **核心位置**: `resolveDayTitleLabel()` L75, `.tl-pull-hint` + `@keyframes pullDownHint`
- **验证**: 截图确认所有 day block 格式正确，动画循环正常

### 7. 时间轴日期结构调整
- **描述**: 新增 4/18 周五 day block，5/19→5/15，5/20→5/16，月经卡从 5/18 迁到 4/18，修正条数动态计算
- **文件**: `data.jsx`, `timeline-modules.jsx`, `demo-scenes.jsx`, `app.jsx`, `index.html`
- **核心位置**: `TIMELINE_BLOCKS` L239, `summarizeDayItems()` L27（删除 summaryStats 短路）
- **验证**: 截图覆盖全时间轴 4 帧，顺序和条数正确

### 6. 语音演示流程（6 阶段）
- **描述**: 按住说话→松开→模拟 ASR→插入 3 条记录卡片 + 流式打字 + 标签淡入 + 来源回填
- **文件**: `app.jsx`, `cloud-publisher.jsx`, `cloud.css`, `demo-scenes.jsx`, `timeline-sister-cards.jsx`, `timeline-v3v2-cards.jsx`, `index.html`
- **核心位置**: `runDemoFlow()` app.jsx:349, `DemoVoiceCard` timeline-sister-cards.jsx:487, `.dock-voice-float` cloud.css
- **验证**: 完整流程截图序列，3 条卡片正确生成

### 5. 编辑页场景切换器恢复
- **描述**: 恢复 `.demo-controls` 演示切换器，与 URL 参数共存
- **文件**: `diandi_edit.html`
- **验证**: 4 个场景切换截图

### 4. 编辑页 iframe 浮层合并
- **描述**: 从 ··· 菜单点编辑→iframe 全屏浮层→postMessage 通信退出
- **文件**: `index.html`, `timeline-sister-cards.jsx`, `timeline-v3v2-cards.jsx`, `diandi_edit.html`
- **核心位置**: `openEditModal` index.html:963, `notifyParent()` diandi_edit.html:1043, `CardMoreMenu.onEdit` timeline-sister-cards.jsx:112
- **验证**: 4 个场景截图（编辑→关闭→保存→删除）

### 3. 卡片 ··· 更多菜单
- **描述**: 每张卡片右上角增加 ··· 按钮，弹出编辑/删除菜单，新卡片延迟 600ms 显示
- **文件**: `timeline-sister-cards.jsx`, `timeline-v3v2-cards.jsx`, `timeline.css`
- **核心位置**: `CardMoreMenu` L66, `.card-more-menu` CSS
- **验证**: 菜单弹出截图

### 2. 顶部栏 + 底部栏 + Tab 图标改版
- **描述**: 顶部栏标题居中+去日历+置顶；底部栏语音/键盘圆形SVG图标+去相机；Tab 美柚(柚子花瓣)/记录(日历3)图标
- **文件**: `app.jsx`, `cloud-publisher.jsx`, `timeline.css`, `components.jsx`, `index.html`
- **核心位置**: `.stream-header`(position:absolute), `DockVoiceCircleIco`, `DockKbdCircleIco`, TabBar icons
- **验证**: 截图确认

### 1. 心情选择器 Bug 修复 + 项目规范
- **描述**: 修复点击心情按钮后自动选中的 click-through bug；创建 CLAUDE.md 锁定组件规范
- **文件**: `quick-pickers.jsx`, `CLAUDE.md`
- **核心位置**: `MoodQuickOverlay` ready 延迟 + pointer-events 守卫
- **验证**: 截图确认 5 个心情选项正常展示

---

## 关键设计决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 编辑页合并方式 | iframe 全屏浮层（方案 B） | 主原型 DOM 状态完整保留，无白屏闪烁，CSS 隔离无冲突 |
| 编辑页退出通信 | postMessage | iframe 与父页面松耦合，编辑页可独立打开调试 |
| 演示模式 | 永远走演示流程，不接真实 ASR | 给老板演示用的原型，所有数据写死 |
| 演示文本 | 固定为「昨天下午来了姨妈，来之前，上午就开始头痛。」 | 覆盖月经+症状两种记录类型 |
| 日期格式 | 统一「X月X日」中文格式 | 符合美柚产品调性，中文用户习惯 |
| 时间轴排序 | 正序，底部最新 | 符合聊天流 / 日记流习惯 |
| 5-17 周日 | 初始不存在，演示流程动态创建 | 初始态不应有空 day block |
| 卡片类型推断 | `voice→mixed, photo→image, body→text, else→quick` | 用已有字段推断，不加新标记 |
| 新卡片 ··· 按钮 | 延迟 600ms 后显示 | 等流式输出完成再展示操作入口 |
| 顶部栏置顶 | position:absolute（非 sticky） | `.phone` 的 `overflow:hidden` 破坏 sticky |

---

## 关键代码位置索引

### 演示流程
| 位置 | 说明 |
|------|------|
| `app.jsx:349` `runDemoFlow()` | 6 阶段演示流程主函数 |
| `app.jsx:317` `clearDemoCards()` | 清除上一轮演示卡片 |
| `app.jsx:458` `submitVoice()` | 语音提交入口，触发演示流程 |
| `app.jsx:77` `window.__resetDemo` | 全局重置函数 |
| `app.jsx:439` `sourceFrom` 回填 | 阶段 6 来源标签 |
| `cloud-publisher.jsx:72` `DEMO_VOICE_LINE` | 演示文本常量 |
| `cloud-publisher.jsx:434` `.dock-voice-float` | 录音浮层 JSX |
| `timeline-sister-cards.jsx:487` `DemoVoiceCard` | 演示语音卡（打字机+标签动效） |

### 卡片系统
| 位置 | 说明 |
|------|------|
| `timeline-sister-cards.jsx:66` `CardMoreMenu` | ··· 更多菜单组件 |
| `timeline-sister-cards.jsx:124` `TlRecCardHead` | 卡片头（时间+···按钮） |
| `timeline-sister-cards.jsx:547` `SegmentedRecordCard` | 主卡片组件（含演示分支） |
| `timeline-v3v2-cards.jsx:457` `V3v2Card` | V3 双层卡片 |
| `timeline-v3v2-cards.jsx:330` `V3v2Header` | V3 卡片头（含 ···） |
| `timeline-v3v2-cards.jsx:538` `sourceFrom` 渲染 | 来源标签底部小字 |

### 时间轴渲染
| 位置 | 说明 |
|------|------|
| `timeline-modules.jsx:68` `resolveDayTitleLabel()` | day block 标题（今天/X月X日） |
| `timeline-modules.jsx:79` `formatDayMeta()` | day block 副标题（周几） |
| `timeline-modules.jsx:27` `summarizeDayItems()` | 动态计算条数/kcal/kg |
| `timeline-modules.jsx:89` `CycleDayHeader` | day block 头部组件 |
| `timeline.jsx:115` `TimelineStream` | 时间轴主渲染 |
| `timeline.jsx:148` gap 渲染 | 「↓ 下拉查看更多」 |
| `timeline.jsx:204` `appendTimelineEntry()` | 追加卡片到指定 day block |

### 数据层
| 位置 | 说明 |
|------|------|
| `data.jsx:239` `TIMELINE_BLOCKS` | 时间轴数据定义 |
| `demo-scenes.jsx:12` `getTimeline()` | 场景初始化（深拷贝 + 修改） |

### 编辑页
| 位置 | 说明 |
|------|------|
| `index.html:950` `#edit-modal-layer` | iframe 浮层容器 |
| `index.html:963` `openEditModal()` | 打开编辑浮层 |
| `index.html:980` `message` 监听 | postMessage 退出处理 |
| `diandi_edit.html:1001` URL 参数读取 | scene 初始化 |
| `diandi_edit.html:1043` `notifyParent()` | postMessage 退出 |
| `diandi_edit.html:1046` `handleClose()` | 关闭逻辑 |
| `diandi_edit.html:1062` `handleSave()` | 保存逻辑 |

### UI 组件
| 位置 | 说明 |
|------|------|
| `cloud-publisher.jsx:205` `DockPublisher` | 底部 Dock 主组件 |
| `cloud-publisher.jsx:4` `DockVoiceCircleIco` | 语音圆形图标 SVG |
| `cloud-publisher.jsx:23` `DockKbdCircleIco` | 键盘圆形图标 SVG |
| `components.jsx:210` `TabBar` | 底部 Tab 栏 |
| `app.jsx:529(约)` `.stream-header` | 顶部栏（标题居中+搜索） |

---

## 已知未完成 / 待办

1. **编辑页保存后的数据回写**: 当前保存只显示 toast，不实际修改 timeline 数据
2. **删除确认弹窗**: 卡片 ··· 菜单的「删除」目前只是 `setOpen(false)`，没有实际删除逻辑
3. **演示流程中间帧截图**: 用户要求的 12 帧逐帧截图序列未完整录制（流程跑太快，部分帧合并）
4. **4/18 的 sister-card 分析**: 迁移过来的 sister-card 会展开 AI 分析，如果不需要可考虑移除
5. **编辑页 diandi_edit.html 中的日期**: 编辑页内部日期（如「今天 14:30」）未改成「X月X日」格式，因为那是独立 HTML

---

## 下一步可能的工作方向

1. **编辑页功能完善**: 编辑保存后真正修改 timeline 数据（时间、文字）；删除记录项后同步 timeline
2. **演示流程优化**: 调整各阶段时序、增加中间过渡动画、录制完整演示视频
3. **新场景/页面**: 记录 tab（日历页）、美柚 tab 首页、返现 tab 等其他 tab 的原型
4. **卡片交互增强**: 卡片展开/收起动效、AI 分析卡片的交互细化
5. **真实 ASR 接入准备**: 把演示流程中的写死数据替换为 ASR 返回值，提取关键词接口对接

---

## 环境与约定

### 项目根目录
`/Users/wangyingyue/Documents/diandi_record`

### 技术栈
- React 18 + Babel Standalone（浏览器内编译 JSX，无构建步骤）
- 纯 CSS（无预处理器）
- Ruby WEBrick HTTP 服务器（端口 8765）
- 所有组件通过 `Object.assign(window, {...})` 导出到全局

### 开发服务器
```bash
ruby -e "require 'webrick'; s=WEBrick::HTTPServer.new(:Port=>8765,:DocumentRoot=>'/Users/wangyingyue/Documents/diandi_record'); trap('INT'){s.shutdown}; s.start"
```
或通过 `.claude/launch.json` 的 preview 配置启动。

### 代码风格约定（摘自 CLAUDE.md）
- **锁定组件**: 顶部栏、底部输入栏、底部 Tab、加号扇形菜单 — 默认不改，需明确指出才可修改
- 修改锁定组件后需在回复中标注「已修改锁定组件：xxx」
- 文件版本号在 index.html 中通过 `?v=YYYYMMDD-vNNN` 控制缓存

### Git 提交约定
- 中文 commit message，简明描述改动
- 尾部附加 `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`
- 不使用 --amend，总是新建 commit
- 不 force push

### 浏览器验证
- 通过 Claude in Chrome 扩展驱动 Chrome 浏览器
- 截图通过 `computer screenshot save_to_disk:true` 保存
- JS 交互通过 `javascript_tool` 在页面上下文执行
