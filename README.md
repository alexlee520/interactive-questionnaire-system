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
- **協作者管理：支援多使用者權限管理系統**
- **身份驗證：使用 Passport.js 實現安全的登入系統**
- **角色權限控制：支援 Viewer、Editor、Admin 三種角色**

## 技術棧

**前端**
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- React Query + Vite

**後端**
- Express.js + Node.js
- Zod 資料驗證
- Google Sheets API
- Passport.js 身份驗證
- Express Session 管理

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
│   ├── auth.ts               # 身份驗證與權限管理
│   ├── db.ts                 # 資料庫結構定義
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

### 管理後台

訪問 `http://localhost:5000/admin` 來管理問卷回應和協作者

**預設管理員帳號：**
- 使用者名稱：`admin`
- 密碼：`admin123`

**角色說明：**
- **Viewer**：僅能查看問卷回應
- **Editor**：可查看和編輯問卷回應
- **Admin**：完整權限，包含管理協作者

### 構建生產版本
```bash
npm run build
npm start
```

## API 端點

### 公開端點
- `POST /api/responses` - 提交問卷回應

### 身份驗證端點
- `POST /api/auth/login` - 登入
- `POST /api/auth/logout` - 登出
- `GET /api/auth/me` - 取得目前使用者資訊

### 管理員端點（需要身份驗證）
- `GET /api/admin/responses` - 取得所有問卷回應（需要 Viewer 權限）
- `GET /api/admin/responses/:id` - 取得特定問卷回應（需要 Viewer 權限）
- `GET /api/admin/users` - 取得所有使用者（需要 Admin 權限）
- `POST /api/admin/users` - 新增使用者（需要 Admin 權限）
- `DELETE /api/admin/users/:username` - 刪除使用者（需要 Admin 權限）
- `PATCH /api/admin/users/:username/role` - 更新使用者角色（需要 Admin 權限）

## 環境變數

如使用 Google Sheets 整合，建立 `.env` 檔案：

```
REPLIT_CONNECTORS_HOSTNAME=<Replit 連接器主機名>
REPL_IDENTITY=<Repl 身份>
SESSION_SECRET=<自訂 Session 密鑰>
DATABASE_URL=<PostgreSQL 資料庫連接字串（選用）>
```

**注意事項：**
- `SESSION_SECRET`：建議在生產環境中設定強密鑰
- `DATABASE_URL`：如需使用 PostgreSQL 儲存使用者資料，請設定此變數（目前使用記憶體儲存）

## 授權

MIT License
