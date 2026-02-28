# 求职面试复盘助手（中文主 / English Available）

[English README](./README.en.md)

一个以中文开发者为核心用户的求职辅助项目：  
把「面试后复盘」和「面试前准备」打通，形成可追溯、可复用的经验库闭环。

## 项目定位

- 中文为主：默认中文界面、中文文档、中文策略输出
- 中英并行：提供英文 README，便于国际协作和开源展示
- 目标人群：正在求职、希望持续提升面试表现的候选人（先聚焦产品经理）

## 核心能力

- 面试后三段式复盘（摘要 / 问题清单 / 下次行动）
- Deep Research 结果导入（手动 + 自动抓取）
- 经验库沉淀、检索、去重、OCR 导入
- 面试前策略生成（高概率问题 / 风险点 / 行动清单）
- 策略证据可追溯（条目可点击到来源）
- 严格闭环测试（自动拉起服务 + 10 项链路回归）

## 代码结构

- Web 应用：`/app`
- 产品文档：仓库根目录下 `*.md`
- 开发日志：`/开发日志.md`

## 快速开始

```bash
cd app
npm install
cp .env.example .env.local
npm run dev
```

访问：`http://localhost:3000`

## 自动闭环测试（推荐）

```bash
cd app
npm run test:closed-loop
```

默认严格模式，目标是：
- `Total: 10, Passed: 10, Failed: 0`

## 文档入口

- 中文主文档：`/app/README.md`
- 英文简版：`/README.en.md`
- 多视角审视：`/多视角产品审视与优化方案-v3.md`
