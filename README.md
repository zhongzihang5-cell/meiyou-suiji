# 美柚 · 随记 Tab 原型

美柚 App 第三屏「随记」交互与高保真原型，独立于 `~/Downloads/随记` 维护。

## 本地预览

在项目根目录启动静态服务后打开 `index.html`：

```bash
cd /Users/zhongzihang/Projects/meiyou-suiji
python3 -m http.server 8765
```

浏览器访问：<http://localhost:8765>

## 项目结构

```
meiyou-suiji/
├── index.html          # 入口（样式 + React/Babel CDN）
├── app.jsx             # 主应用、场景切换
├── components.jsx      # UI 组件（时间轴、输入条、Tab 栏等）
├── data.jsx            # 时间轴 mock 数据、关键词识别
├── icons.jsx           # 图标
├── tweaks-panel.jsx    # 原型调试面板（场景切换）
├── design/             # 美柚设计规范参考
├── docs/               # 产品文档（定位、策略）
└── uploads/            # 历史 HTML 备份
```

## 原型调试

页面右下角 **Tweaks** 面板可切换场景：

- 经期中
- 卵泡期（非经期日常）
- 需关注（黄灯）

## 相关讨论

产品形态讨论见 `docs/` 目录（待补充 PRD 摘要）。
