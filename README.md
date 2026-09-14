# 16 型人格：認識自己，也理解和你不一樣的人

「世界的真相與人性」國中課堂延伸教材，繁體中文（台灣用語）。

這是一套可直接上傳 GitHub Pages 的純前端網站。解壓縮後直接用瀏覽器開啟 `index.html`，就能在自己的電腦使用；部署時也不需要安裝 Node.js、npm、框架或資料庫。

## 開始使用

1. 解壓縮 `personality-explorer.zip`。
2. 開啟資料夾內的 `index.html`。
3. 在總覽點選人格卡片，或依測驗結果選取前四個字母。
4. 看完後，用「返回 16 型人格」、Escape 或瀏覽器上一頁繼續探索。

若另有收到 `personality-explorer-preview.html`，那是方便預覽的單檔版本，直接開啟即可。正式維護請使用下列分檔專案；修改資料後，單檔預覽不會自動同步。

## 檔案用途

| 檔案 | 用途 |
| --- | --- |
| `index.html` | 網站入口、首頁與不執行 JavaScript 時的基本總覽 |
| `styles.css` | 四色、排版、手機與平板規則、動畫及減少動態設定 |
| `script.js` | 卡片展開、hash 導覽、返回、快速找人格與頁面產生 |
| `personality-data.js` | 全部 16 型內容、字母解說、群組與來源 |
| `personality_site_style.yaml` | 使用者提供的風格規格，保留原內容 |
| `README.md` | 本使用與部署說明 |
| `TEST_REPORT.md` | 已完成檢查、測試限制與裝置驗收項目 |
| `.nojekyll` | 告訴 GitHub Pages 直接提供靜態檔案 |

圖示與幾何視覺已寫在 HTML / JavaScript 中，無額外圖片或字型下載。網站使用系統可用的中文字型，不依賴外部 CDN。JavaScript 關閉時仍能看到標題、基本說明、16 張卡片與來源。

## 發布到 GitHub Pages

### 1. 建立 Repository

登入 GitHub，選 **New repository**，例如命名為 `personality-explorer`。

若使用 GitHub Free，可建立 **Public** repository 來使用 GitHub Pages，詳見 [GitHub 官方說明](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)。網站會公開給持有網址的學生閱讀。本專案沒有學生個資或測驗結果的蒐集功能。

### 2. 上傳檔案到根目錄

在 repository 中選 **Add file → Upload files**，上傳解壓縮後資料夾「裡面」的檔案，再按 **Commit changes**。

完成後，repository 第一層應直接看得到 `index.html`、`styles.css`、`script.js`、`personality-data.js` 等檔案。不要只上傳 ZIP，也不要多包一層資料夾。

`.nojekyll` 是可隨專案一併上傳的設定檔；若系統未顯示它，也可以在 GitHub 用 **Add file → Create new file** 建立名為 `.nojekyll` 的空檔案。

### 3. 啟用 Pages

進入 **Repository → Settings → Pages**，在 **Build and deployment** 設定：

| 項目 | 選擇 |
| --- | --- |
| Source | **Deploy from a branch** |
| Branch | **main** |
| Folder | **/ (root)**，也就是 repository 根目錄 |

按 **Save**。介面的 root 表示根目錄，不是要建立一個名為 `root` 的資料夾。

### 4. 取得學生用網址

部署完成後，回到 **Settings → Pages**，使用 **Visit site** 的實際網址，通常形式為：

```text
https://USERNAME.github.io/personality-explorer/
```

`USERNAME` 必須替換為你的 GitHub 帳號；這是格式示例，不是已建立的網站。剛儲存時可能需要等候數分鐘，也可以在 repository 的 **Actions** 查看部署狀態。

本次交付尚未登入或寫入你的 GitHub，也未產生公開 GitHub Pages 網址。

### 5. 上線後驗收

先用實際 Pages 網址測試首頁，再測試：

```text
https://USERNAME.github.io/personality-explorer/#intj
https://USERNAME.github.io/personality-explorer/#enfp
```

直接開啟應顯示相應人格。網站只使用 hash 與相對路徑，支援 `/personality-explorer/` 這類 repository 子路徑，不需要伺服器改寫路由。

部署設定參考 [GitHub 官方：設定發布來源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) 與 [建立 GitHub Pages 網站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)（查閱日期：2026-09-14）。

## QR Code 給學生掃描

等取得實際公開網址後，將「首頁網址」轉成 QR Code。課堂主要 QR Code 建議不含 hash，讓學生從總覽開始。

若課堂有指定閱讀，也可以把含 `#intj` 等 hash 的完整網址製成 QR Code。請用手機實際掃描一次，確認看到的不是 GitHub 程式碼頁面。

目前沒有你的 GitHub 帳號與 repository 實際網址，因此沒有產生指向示例地址的 QR Code。取得 Pages 網址後即可製作。

## 更新內容與快取

1. 編輯相應檔案，然後在 GitHub 上 **Commit changes** 到 `main`；或從電腦 push 到 `main`。
2. 等待 Pages 重新部署。
3. 若仍看到舊版，重新整理、關閉頁面重開，或使用無痕視窗。
4. 若需要更新 CSS / JS 的快取版本，將 `index.html` 中三個資源的 `?v=1` 一起改為 `?v=2`：

```html
<link rel="stylesheet" href="./styles.css?v=2">
<script src="./personality-data.js?v=2" defer></script>
<script src="./script.js?v=2" defer></script>
```

修改 `personality-data.js` 後，互動總覽及詳細頁都會使用新內容。`index.html` 另保留不執行 JavaScript 時的基本卡片文字；如果更改「稱號或短標語」，請也更新 HTML 中相應卡片，讓離線基本總覽保持一致。完整人格正文僅集中在資料檔，無須修改 HTML 版面。

## 如何修改人格資料

在 `personality-data.js` 搜尋小寫代號，例如 `intj:`。每型使用相同欄位：

| 欄位 | 對應內容 |
| --- | --- |
| `nickname` / `tagline` | 稱號 / 短摘要 |
| `overview` | 兩段看世界的方式 |
| `schoolLife` | 學校情境，格式為 `[標題, 說明]` |
| `learning` | 投入、卡點、期限、獨立與合作、策略 |
| `teamwork` | 朋友與團隊合作 |
| `strengths` / `blindspots` | 各四項標題與說明 |
| `stress` | 壓力情境與可試方法 |
| `growth` | 三項成長方向 |
| `scenarios` | 兩則生活情境 |
| 共用 `reflections` | 三題反思 |

保留引號、逗號與中括號。文字不接受 HTML；顯示前會跳脫特殊字元，降低誤貼標記影響版面的風險。

## 放進 WordPress

先將網站發布到 GitHub Pages，再於 WordPress 的自訂 HTML 區塊加入以下內容，並替換 `src`：

```html
<iframe
  src="https://USERNAME.github.io/personality-explorer/"
  title="16 型人格互動教材"
  style="width:100%;height:1000px;border:0;border-radius:16px;"
  loading="lazy">
</iframe>
```

也可以直接提供網站連結，讓學生在新分頁完整閱讀。不同 WordPress 編輯器或權限可能會過濾 iframe；若預覽沒有保留，使用外連方式。

## 教學與資料原則

- 紫／綠／藍／黃及四個角色分組沿用 16Personalities 的識別方式；不是傳統 MBTI 官方的四大群組。
- 清楚區分 16Personalities 的五向度 NERIS 模型與正式 MBTI。A / T 是前者的 Identity 向度；末尾 -T 也不同於 Thinking 的 T。
- 類型介紹依公開來源重新整理。學校例子、學習策略、合作建議和壓力情境是教育性延伸，並非經研究驗證的個別學生預測。
- 原站的自我描述不是獨立學術證據。本教材不主張每個人的人格可完整分為 16 個離散類別，也不以類型推論能力、職涯、心理診斷或人際配對。
- 圖像均為原創簡單幾何圖示，未使用 16Personalities 的 Logo、HTML / CSS 或角色插畫。
- 不需要學生登入，不保存反思答案或人格選擇，也沒有追蹤分析碼。
- 鼓勵學生找到符合與不符合自身經驗的例子，並用實際溝通確認他人的需要。

全部研究來源與存取日期可在網站頁尾「資料來源與延伸閱讀」展開查看。

## 測試狀態

程式語法、資料完整性、相對路徑、指定文字色彩對比，以及 11 組 DOM 整合檢查已通過，包括全部 16 型的開啟與返回。

**瀏覽器預覽遭環境阻擋，因此本次未完成真實瀏覽器的動畫、鍵盤操作、手機／平板版面與 Safari／Edge 實测。DOM 測試不等於裝置或視覺驗收。** 詳細結果與待驗項目見 `TEST_REPORT.md`。請在正式課堂使用前，於自己的瀏覽器和學生裝置依清單驗收。
