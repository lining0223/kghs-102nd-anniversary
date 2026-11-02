# 102nd 雄女校慶官方網站 - Cloudflare 免費部署完整指南 (Zero Cost Deployment Guide)

本專案已針對 **Cloudflare Pages** 與 **Pages Functions** 進行全面最佳化，相容 Cloudflare 免費方案（Free Plan，每月 500 次構建、無流量限制、每日 100,000 次邊緣無伺服器函式呼叫），並採用 Web Crypto API 簽發的 **Session Token** 進行管理者安全權限控管。

---

## 快速部署步驟（3 分鐘內完成）

### 步驟 1：上傳程式碼至 GitHub
1. 將本專案的所有檔案推送到您的 GitHub 儲存庫（Repository，公開或私有皆可）。

---

### 步驟 2：登入 Cloudflare 並建立 Pages 專案
1. 開啟 [Cloudflare Dashboard](https://dash.cloudflare.com/) 並登入免費帳號。
2. 在左側選單點選 **Workers & Pages** -> **Create application** -> 切換至 **Pages** 分頁。
3. 點選 **Connect to Git**（連接到 Git）。
4. 選擇您剛才上傳的 GitHub 儲存庫並點擊 **Begin setup**。

---

### 步驟 3：設定建置命令與輸出目錄 (Build Settings)
請在建置設定中填入以下內容：

- **Framework preset**: `Vite` (或 None)
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (留空即可)

---

### 步驟 4：設定管理員密碼與安全性環境變數 (Environment Variables)
在下方 **Environment variables** (環境變數) 區塊新增：

| 變數名稱 | 預設值/建議值 | 說明 |
| :--- | :--- | :--- |
| `ADMIN_PASSWORD` | `123` (或您自訂的強密碼) | 管理者登入驗證專用密碼 |
| `JWT_SECRET` | 任意 32 位以上亂數字串 | 用於 Web Crypto HMAC-SHA256 簽署 Session Token（若未設定會自動使用 `ADMIN_PASSWORD`） |

點選 **Save and Deploy**，Cloudflare Pages 即會自動完成首次構建並提供一個免費的 `*.pages.dev` 網址！

---

### 步驟 5（關鍵！）：建立並綁定免費 Cloudflare KV 資料庫 (跨裝置即時同步)
為了讓您在管理員後台編輯的賽程、榮譽榜、攤位、採訪等內容能永久保存並即時同步給所有前台訪客，請綁定 Cloudflare 免費 KV：

1. 在 Cloudflare Dashboard 左側點選 **Workers & Pages** -> **KV**。
2. 點擊 **Create a namespace**，名稱輸入：`celebration-storage`，點擊 **Add**。
3. 回到您的 Pages 專案：點選 **Workers & Pages** -> 點入剛才建立的 Pages 專案。
4. 點選上方頁籤 **Settings** -> **Functions**。
5. 向下滾動到 **KV namespace bindings**（KV 命名空間綁定），點擊 **Add binding**：
   - **Variable name（變數名稱，必須完全相符）**: `CELEBRATION_KV`
   - **KV namespace（命名空間）**: 選擇剛才建立的 `celebration-storage`
6. 點選 **Save** 儲存。
7. 在上方 **Deployments** 標籤，點選最新一次部署右側的 `...` -> **Retry deployment**（或重新推送一個 commit），即可正式生效！

> **備註**：即便尚未綁定 KV，前台網站依然能順暢運行並展示預設校慶內容與本機快取；一旦綁定 KV，後台發布的所有改動將自動寫入 Cloudflare 全球邊緣網路！

---

## 常見部署錯誤與排查清單 (Troubleshooting)

若 Cloudflare 在 **Build & Deploy** 階段出現紅字失敗，通常是以下 3 個原因之一：

### 1. `npm error code ERESOLVE` / Peer Dependency 衝突
- **原因**：Vite 8 與舊版套件的同儕依賴衝突。
- **解法**：專案已為您建立 `.npmrc`（內含 `legacy-peer-deps=true`）並更新了 `package.json` 與 `package-lock.json`。請確認這三個檔案都有推送到 GitHub。

### 2. Node.js 版本過舊 (Vite 8 需要 Node 18+ 或 20+)
- **原因**：Cloudflare 預設 Node 版本若較舊，會出現語法或套件不支援的錯誤。
- **解法**：
  1. 專案根目錄已包含 `.nvmrc`（設定為 `20`）。
  2. 也可以至 Cloudflare Pages 專案的 **Settings** -> **Environment variables**，新增一個環境變數：
     - Variable name: `NODE_VERSION`
     - Value: `20`
  3. 儲存後重新 Deploy。

### 3. Build output directory 設定錯誤
- **原因**：找不到輸出目錄。
- **解法**：請確認 **Build output directory** 填寫為 `dist`（全部小寫，請勿填 build 或 public）。
- **Build command**: 請填寫 `npm run build`。

### 4. `Invalid _redirects configuration: Infinite loop detected in this rule [code: 100324]`
- **原因**：Cloudflare Pages 邊緣伺服器會自動規範化 URL（自動去除副檔名 `.html` 與 `/index`）。舊版 `_redirects` 寫法 `/* /index.html 200` 會被 Cloudflare 視為迴圈陷阱而拒絕部署。
- **解法**：專案已移除容易產生衝突的 `_redirects` 檔案，改用 Cloudflare Pages 官方原生的 **SPA Fallback 機制**（建置時自動產生 `dist/200.html`，且無 `404.html` 阻擋），能完美支援 `/admini2t2` 與各項前端路徑直接重新整理，100% 避免部署報錯。

### 5. 設定變數時跳出「Update your Wrangler configuration with these changes to keep deployments in sync.」
- **狀況**：在 Cloudflare 後台儲存環境變數（`ADMIN_PASSWORD`、`JWT_SECRET` 等）時，畫面上方跳出這行訊息。
- **原因**：**這是純資訊提示（Info Notification），不是報錯！** 您的變數已經成功儲存。Cloudflare 會顯示這段話，只是提醒習慣使用命令列工具（Wrangler CLI）的開發者「您在網頁上改了設定，若本機有 wrangler 設定檔記得同步」，避免日後用指令覆蓋掉。
- **如何處理**：直接忽略此提示即可，變數已生效。

### 6. 設定變數時跳出「Variables cannot be added to a Worker that only has static assets.」
- **狀況**：在專案設定新增變數時，Cloudflare 出現此警告並阻止新增。
- **原因**：
  1. **建立專案時選到了「Worker」而非「Pages」**：在 Cloudflare 後台若建立了 Worker 專案，且專案內只有靜態前端檔案（`dist`），Cloudflare 為了省資源，預設不會啟動 Worker JavaScript 執行環境，因此會跳出此提示表示「純靜態網站沒有腳本可以讀取變數」。
- **解法（兩者皆可）**：
  - **方案 A（推薦！本專案已為您配置好）**：我們已在專案中建立了 `worker.ts` 與 `wrangler.jsonc`。當您將最新程式碼推送到 GitHub 後，Cloudflare 會檢測到入口腳本 `worker.ts`，確認有程式碼要執行，**該警告將立刻消失，變數與 KV 即可正常新增與綁定！**
  - **方案 B（若使用 Pages 專案）**：若您是在 Cloudflare Dashboard 的 **Workers & Pages** -> **Create application**，請確認切換到 **Pages** 分頁（點擊 **Connect to Git**），Pages 原生支援前端靜態檔案與 `/functions` API 路由。

### 7. 在 Settings 裡面找不到「Functions」選項？
- **原因 1：您目前處於 Cloudflare Worker 專案（最常見）**
  - 在 **Workers** 專案中，**本來就沒有 Functions 這個選項**（因為 Worker 本身就是一個無伺服器 Function！）。
  - **在 Workers 專案綁定 KV 的位置**：
    👉 點選 **`Settings`（設定）** ➔ 點選 **`Bindings`（綁定）** ➔ 點擊 **`Add`（新增）** ➔ 選擇 **`KV namespace`** ➔ 變數名稱填寫 `CELEBRATION_KV`，並選取您的 KV 庫。
- **原因 2：Cloudflare 儀表板新版介面改版**
  - 在新版 Cloudflare UI 中，原本的 Functions 綁定已統一整合到 **`Settings` ➔ `Bindings`**（或位於 `Variables and Secrets` 內）。
  - 請直接尋找 **`Bindings`** 或 **`KV namespace bindings`** 即可。


---

## 權限與 Session Token 驗證機制說明

1. **後台入口路徑**：
   - 瀏覽器網址列輸入：`https://您的網址/admini2t2`（或 `#/admini2t2`）。
   - 首頁 KG 圖樣已不再具備 3 連擊隱藏跳轉功能，只有透過專屬路徑才能存取登入驗證頁面。

2. **Session Token 安全驗證架構**：
   - 使用者在 `/admini2t2` 輸入管理員密碼後，前端向 `/api/auth` 請求核驗。
   - 驗證成功後，由 Cloudflare Pages Functions 透過標準 **Web Crypto HMAC-SHA256** 邊緣加密簽發 24 小時有效的 Session Token。
   - 所有後續對 `/api/data` 的更新請求均透過 `Authorization: Bearer <session_token>` 進行驗證，不再於傳輸過程攜帶或暴露明文密碼。
   - 當 Token 過期或在後台點選「登出管理員」時，Session Token 即刻銷毀。

3. **SPA 單頁路由與 404 重定向防護**：
   - 本專案採用 Cloudflare Pages 原生 SPA 機制，建置階段會自動產生 `dist/200.html`。在 Cloudflare Pages 上直接重新整理或輸入 `/admini2t2` 均能由邊緣節點以 200 狀態碼精確響應，不會產生任何 404 錯誤或重新導向迴圈。
