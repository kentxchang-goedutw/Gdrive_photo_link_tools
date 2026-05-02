# Google Drive 圖片連結提取器 (Modern Web Version)

這是一個簡單、快速且美觀的網頁工具，專為老師與開發者設計。透過 **Google Apps Script (GAS)** 技術，將 Google 雲端硬碟資料夾內的圖片自動轉換為可直接在網頁（如 HTML `<img>` 標籤）中使用的嵌入連結。

---

## 📖 專案由來

本專案的靈感與需求源自於 [阿剛老師的異想世界：圖片不用再找免費圖床了：來試試我開發的這個Google 文件圖片提取器！](https://kentxchang.blogspot.com/2025/10/google.html)。

原有的做法是透過提取 Google 文件的圖片快取連結來達成，但隨著 Google 安全政策與權杖（Token）機制的更新，原本的快取連結變得容易失效且有權限限制。為了尋求更穩定的解決方案，**阿剛老師與 AI 協作討論**，開發了這個全新的版本。

### 主要改進：
*   **穩定性**：改用 Google Apps Script 讀取原始檔案 ID，生成的 `thumbnail` 格式連結在網頁嵌入中更為穩定。
*   **自動化**：不需手動開啟文件，直接讀取整個雲端資料夾。
*   **現代化 UI**：採用 Tailwind CSS 與 React 開發，具備響應式設計與本地儲存功能。

---

## ✨ 核心功能

*   **免金鑰模式**：透過自建的 GAS 腳本，無需申請複雜的 Google Cloud API Key。
*   **持久化設置**：系統設定（GAS 網址）會自動儲存於瀏覽器的 `localStorage`，下次開啟無需重複輸入。
*   **批次處理**：一鍵複製資料夾內所有圖片的「網頁嵌入碼」或「原始下載連結」。
*   **穩定預覽**：解決 Google Drive 連結在外部網頁容易破圖（CORS 限制）的問題。

---

## 🛠️ 使用教學

### 第一步：部署 Google Apps Script (GAS)
這是程式的「後端」，負責讀取您的資料夾權限。

1.  前往 [Google Apps Script 官網](https://script.google.com/) 並點擊「新專案」。
2.  刪除原本內容，貼上以下代碼：
    ```javascript
    function doGet(e) {
      const folderId = e.parameter.folderId;
      const folder = DriveApp.getFolderById(folderId);
      const files = folder.getFiles();
      const results = [];
      while (files.hasNext()) {
        const file = files.next();
        const mime = file.getMimeType();
        if (mime.includes('image/')) {
          results.push({ id: file.getId(), name: file.getName(), mimeType: mime });
        }
      }
      return ContentService.createTextOutput(JSON.stringify({status: 'success', files: results}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    ```
3.  點擊右上方「部署」 > 「新部署」。
4.  類型選擇「網頁應用程式」。
5.  **最重要：** 「誰有權存取」務必選擇 **「所有人 (Anyone)」**。
6.  點擊部署後，複製產生的「網頁應用程式網址」。

### 第二步：設定工具
1.  下載並開啟本專案的 `google_drive_extractor.html`。
2.  點擊右上角的 **「⚙️ 設定」** 按鈕。
3.  在 **「GAS 部署網址」** 欄位貼上您剛剛複製的網址並關閉設定視窗。

### 第三步：開始提取
1.  在主畫面的欄位中貼上您的 **Google Drive 資料夾共用連結**。
    *   *註：資料夾必須設定為「知道連結的使用者皆可檢視」。*
2.  點擊「立即抓取圖片」。
3.  系統會列出所有圖片，您可以選擇「複製單張嵌入碼」或「複製全部嵌入碼」。

---

## 📁 檔案說明

*   `google_drive_extractor.html`: 包含 UI 介面與邏輯的單一 HTML 檔案，可直接下載到本地使用。

---

## ⚖️ 授權說明

本專案採 **[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh_TW)** 授權（姓名標示—非商業性—相同方式分享）。

*   **作者**：阿剛老師
*   **部落格**：[阿剛老師的異想世界](https://kentxchang.blogspot.tw)

---

## 🤝 鳴謝

感謝 AI 協助優化程式邏輯與現代化 UI 設計，讓教育工具開發更加直覺且高效。