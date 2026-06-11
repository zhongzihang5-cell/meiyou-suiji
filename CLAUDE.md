# 项目规范

## 锁定组件（默认不调整）

以下组件已定稿，任何任务中 **默认不做修改**。  
如需调整，必须在任务描述中 **明确指出** 要修改哪个锁定组件，否则一律保持现状。

| 序号 | 组件 | 涉及文件 | 说明 |
|------|------|----------|------|
| 1 | 顶部栏 | `app.jsx` (stream-header)、`timeline.css` (.stream-header) | "点滴"标题居中 + 右侧搜索，position absolute 置顶 |
| 2 | 底部文字/语音输入栏 | `cloud-publisher.jsx` (DockPublisher, dock-bar)、`cloud.css` (.dock-*) | 语音圆形图标 + 键盘圆形图标，无相机按钮 |
| 3 | 底部 Tab | `components.jsx` (TabBar)、`index.html` (.tabbar) | 美柚(柚子花瓣) / 记录(日历3) / 点滴(麦克风) / 返现 / 我 |
| 4 | 加号（快捷发布扇形菜单） | `cloud-publisher.jsx` (QuickCardFan)、`cloud.css` (.quick-card-fan, .quick-card-fab) | 右下粉色 + 按钮，展开 4 项扇形卡片 |

### 执行规则

- 收到任务时，先检查是否涉及上述组件。
- 若任务未明确提及要修改锁定组件，则 **跳过** 对该组件的任何改动。
- 若任务明确写出如"调整顶部栏"、"修改底部 tab 图标"等，视为解锁，可以修改。
- 修改锁定组件后，需在回复中标注"已修改锁定组件：xxx"。
