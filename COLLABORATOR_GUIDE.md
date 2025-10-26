# 協作者管理使用指南

## 概述

本系統現已支援協作者管理功能，允許管理員控制誰可以訪問和管理問卷回應。

## 角色說明

系統提供三種角色權限：

### 1. Viewer（檢視者）
- **權限**：只能查看問卷回應
- **適用對象**：需要查看數據但不需要修改的團隊成員

### 2. Editor（編輯者）
- **權限**：可以查看和編輯問卷回應
- **適用對象**：需要處理和管理問卷數據的團隊成員

### 3. Admin（管理員）
- **權限**：完整權限，包括管理其他使用者
- **適用對象**：系統管理員和團隊負責人

## 快速開始

### 登入系統

1. 訪問 `http://localhost:5000/login`
2. 使用預設管理員帳號登入：
   - 使用者名稱：`admin`
   - 密碼：`admin123`

### 查看問卷回應

1. 登入後，會自動導向管理後台 `/admin`
2. 預設顯示「問卷回覆」標籤頁
3. 表格顯示所有問卷提交記錄，包含：
   - 提交時間
   - 身份（潛在/已合作）
   - 公司名稱
   - 聯絡人
   - 合作意願

### 管理協作者（僅限 Admin）

1. 點擊「協作者管理」標籤頁
2. 查看目前所有使用者列表

#### 新增協作者

1. 點擊「新增協作者」按鈕
2. 填寫以下資訊：
   - 使用者名稱
   - 密碼
   - Email
   - 角色（Viewer/Editor/Admin）
3. 點擊「新增」完成

#### 更改使用者角色

1. 在使用者列表中找到目標使用者
2. 點擊角色下拉選單
3. 選擇新的角色
4. 系統會自動儲存變更

#### 刪除協作者

1. 在使用者列表中找到目標使用者
2. 點擊該列的垃圾桶圖示
3. 使用者將被立即刪除

**注意**：無法刪除或修改當前登入的帳號

## API 使用範例

### 登入

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c cookies.txt
```

### 查看問卷回應（需要登入）

```bash
curl -X GET http://localhost:5000/api/admin/responses \
  -b cookies.txt
```

### 新增使用者（需要 Admin 權限）

```bash
curl -X POST http://localhost:5000/api/admin/users \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "username":"newuser",
    "password":"password123",
    "email":"newuser@example.com",
    "role":"viewer"
  }'
```

### 更新使用者角色（需要 Admin 權限）

```bash
curl -X PATCH http://localhost:5000/api/admin/users/newuser/role \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"role":"editor"}'
```

### 刪除使用者（需要 Admin 權限）

```bash
curl -X DELETE http://localhost:5000/api/admin/users/newuser \
  -b cookies.txt
```

### 登出

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

## 常見問題

### Q: 忘記管理員密碼怎麼辦？

A: 目前系統使用記憶體儲存，重啟伺服器後會恢復預設的 admin/admin123 帳號。生產環境建議實作密碼重設功能。

### Q: 可以有多個管理員嗎？

A: 可以。Admin 可以將其他使用者的角色設定為 Admin。

### Q: Viewer 和 Editor 的實際權限差異是什麼？

A: 目前兩者都只能查看問卷回應。未來版本可以擴展 Editor 角色來支援編輯和刪除回應的功能。

### Q: 如何在生產環境部署？

A: 請參閱 README.md 中的「安全性注意事項」章節，確保實作密碼加密、CSRF 防護、Rate Limiting 等安全措施。

## 技術細節

### 身份驗證流程

1. 使用者提交登入表單（username + password）
2. 伺服器使用 Passport.js Local Strategy 驗證憑證
3. 驗證成功後，建立 Session 並設定 Cookie
4. 後續請求會自動攜帶 Cookie 進行身份驗證
5. 中介軟體檢查使用者角色，確保有足夠權限

### Session 管理

- 使用 `express-session` 管理會話
- 目前使用 `memorystore` 儲存 Session（記憶體）
- Session 有效期：24 小時
- 生產環境建議使用 Redis 或資料庫儲存

### 資料儲存

- 使用者資料目前儲存在記憶體中（Map）
- 支援 PostgreSQL 資料庫（需設定 DATABASE_URL）
- 問卷回應同樣儲存在記憶體中

## 後續擴展建議

1. 實作密碼重設功能
2. 加入 Email 驗證
3. 實作 2FA 雙因素驗證
4. 加入操作日誌記錄
5. 實作批量操作功能
6. 加入資料匯出功能（CSV/Excel）
7. 實作問卷回應的編輯和刪除功能
