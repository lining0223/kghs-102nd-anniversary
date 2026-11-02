/**
 * 圖片網址標準化處理工具
 * 自動將 Google Drive 分享連結或 Dropbox 連結轉換為可以直接在網頁 <img> 標籤中載入的高清直連網址
 */
export function normalizeImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // 若為 Base64 Data URL 或一般本地路徑，直接返回
  if (trimmed.startsWith('data:') || trimmed.startsWith('/') || trimmed.startsWith('./')) {
    return trimmed;
  }

  // 1. Google Drive 分享連結轉換
  // 形式 1: https://drive.google.com/file/d/{FILE_ID}/view...
  const driveFileRegex = /https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const matchFile = trimmed.match(driveFileRegex);
  if (matchFile && matchFile[1]) {
    return `https://lh3.googleusercontent.com/d/${matchFile[1]}`;
  }

  // 形式 2: https://drive.google.com/open?id={FILE_ID} 或 id= 參數
  const driveIdRegex = /https?:\/\/(?:drive|docs)\.google\.com\/(?:uc\?export=view&id=|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/;
  const matchId = trimmed.match(driveIdRegex);
  if (matchId && matchId[1]) {
    return `https://lh3.googleusercontent.com/d/${matchId[1]}`;
  }

  // 2. Dropbox 連結轉換 (?dl=0 -> ?raw=1)
  if (trimmed.includes('dropbox.com') && trimmed.includes('dl=0')) {
    return trimmed.replace('dl=0', 'raw=1');
  }

  return trimmed;
}
