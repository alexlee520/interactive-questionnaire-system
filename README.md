# 互動式商家合作問卷系統

一個基於 React + Express 的互動式網頁問卷系統，用於評估潛在合作商家的合作意願，以及評估已合作商家的合作績效與回饋。

## 功能特性

### 雙路徑問卷流程

系統根據受訪者的合作關係分為兩條主要路徑：

**分支 A：潛在合作商家問卷**
- 問題 A1: 合作意願評估 (是/否)
- 問題 A2-A5: 若有意願，收集公司名稱、聯絡人姓名、職稱、聯絡方式
- 問題 A6: 若無意願，詢問原因 (可複選)
- 結束語 A/B: 根據意願程度顯示相應的感謝語

**分支 B：已合作商家問卷**
- 問題 B1: 合作時間
- 問題 B2: 帶來的新用戶數量
- 問題 B3-B6: 各維度評分 (1-5分)
  - 整體成效評分
  - 提升客戶滿意度方面的效果
  - 帶動訂單增長方面的效果
  - 品質維持方面的表現
- 結束語 C: 感謝語

### 技術特點

- 智能跳題邏輯：根據用戶回答自動跳轉到相應問題
- 進度條顯示：實時顯示問卷完成進度
- 響應式設計：支援桌面和行動裝置
- 深色/淺色主題：支援主題切換
- 資料驗證：前端和後端雙重驗證
- Google Sheets 整合：自動將回應匯出到 Google Sheets

## 技術棧

**前端**
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- React Query + Vite

**後端**
- Express.js + Node.js
- Zod 資料驗證
- Google Sheets API

## 專案結構

```
WebScrapeAudit/
├── client/                    # 前端應用
│   ├── src/
│   │   ├── components/steps/  # 問卷步驟組件
│   │   ├── pages/             # 頁面
│   │   └── ...
│   └── package.json
├── server/                    # 後端應用
│   ├── index.ts              # 伺服器入口
│   ├── routes.ts             # API 路由
│   ├── storage.ts            # 資料儲存
│   └── googleSheets.ts       # Google Sheets 整合
├── shared/                    # 共享程式碼
│   └── schema.ts             # Zod 資料結構定義
├── package.json
└── README.md
```

## 快速開始

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```

應用將在 `http://localhost:5000` 啟動

### 構建生產版本
```bash
npm run build
npm start
```

## API 端點

- `POST /api/responses` - 提交問卷回應
- `GET /api/responses` - 取得所有問卷回應
- `GET /api/responses/:id` - 取得特定問卷回應

## 環境變數

如使用 Google Sheets 整合，建立 `.env` 檔案：

```
REPLIT_CONNECTORS_HOSTNAME=<Replit 連接器主機名>
REPL_IDENTITY=<Repl 身份>
```

## 授權

MIT License
