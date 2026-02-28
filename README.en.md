# Job Interview Review Assistant (Chinese-first / English Mirror)

[中文 README](./README.md)

This project is built primarily for Chinese-speaking developers and job seekers.  
It connects post-interview review with pre-interview preparation through a reusable evidence-backed knowledge library.

## Positioning

- Chinese-first product and documentation
- English mirror for open-source collaboration
- Initial target users: product manager candidates

## Key Features

- 3-part post-interview review (summary / mistakes / next actions)
- Deep Research import (manual + browser-assisted auto capture)
- Experience library (search, dedup, OCR import)
- Pre-interview strategy generation
- Evidence traceability (strategy item -> clickable sources)
- Strict closed-loop E2E checks (auto-start server + 10-chain validation)

## Project Layout

- Web app: `/app`
- Product docs: repository root `*.md`
- Dev log: `/开发日志.md`

## Quick Start

```bash
cd app
npm install
cp .env.example .env.local
npm run dev
```

Open: `http://localhost:3000`

## Strict Closed-loop Test

```bash
cd app
npm run test:closed-loop
```

Expected result:
- `Total: 10, Passed: 10, Failed: 0`
