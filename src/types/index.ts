/**
 * 102nd 雄女校慶與運動會／園遊會 - 型別定義
 */

export interface AnnouncementData {
  text: string;
  enabled: boolean;
  type: 'urgent' | 'info' | 'celebrate';
}

// a. 賽事活動簡介 (只需項目名稱與詳細內容說明)
export interface ActivityItem {
  id: string;
  title: string; // 項目名稱
  description: string; // 詳細內容說明
  category?: string; // 舊有相容欄位
  rules?: string;
  location?: string;
  target?: string;
}

// b. 運動會時程表 (只需時間、項目)
export interface ScheduleItem {
  id: string;
  time: string; // 時間 e.g. "08:30"
  title: string; // 項目 e.g. "女子 100 公尺短跑決賽"
  day?: '11/6' | '11/7'; // 預設 11/6 運動會
  location?: string; // 舊有相容欄位
  notes?: string; // 舊有相容欄位
  category?: string; // 舊有相容欄位
}

// b-2. 檢錄時程表 (需有項目，時間，地點)
export interface CheckinScheduleItem {
  id: string;
  title: string; // 項目 e.g. "高一／高二 100 公尺分組預賽"
  time: string; // 時間 e.g. "09:15"
  location: string; // 地點 e.g. "司令台後方檢錄處"
}

// c. 榮譽榜 (比賽項目可變動、增刪，內部內容為單一文字輸入框)
export interface HonorAward {
  id: string;
  rank: string; // "第一名" / "金牌" / "第二名" / "優勝"
  awardee: string; // e.g. "201班 林采璇" 或 "103班"
  score?: string; // e.g. "12秒45" / "破大會紀錄"
}

export interface HonorItem {
  id: string;
  eventName: string; // 比賽項目名稱（可變動、增刪）
  category?: string; // 分類標籤（例如：徑賽、田賽、團體趣味、總錦標等）
  content: string; // 單一文字輸入框內容，例如：第一名：小明 2分58秒180\n第二名：
  awards?: HonorAward[]; // 相容舊版資料結構
}

// d. 採訪 (只需標題和內文，照片可選是否需要加，加在文章後面)
export interface InterviewItem {
  id: string;
  title: string; // 標題
  content: string; // 內文
  imageUrl?: string; // 照片 (選填，位於文章後面)
  grade?: '高一' | '高二' | string; // 相容舊版欄位
  interviewee?: string; // 相容舊版欄位
  quote?: string; // 相容舊版欄位
  publishTime?: string; // 相容舊版欄位
}

// d-2. 現場快報 (排版參照採訪，可增減標題內容，可選要不要加圖片)
export interface LiveNewsItem {
  id: string;
  title: string; // 標題
  content: string; // 內文
  imageUrl?: string; // 照片 (選填，位於文章後面)
  publishTime?: string; // 發布時間
}

// d-3. 校慶週活動 (排版參照採訪，可增減標題內容，可選要不要加圖片)
export interface WeekActivityItem {
  id: string;
  title: string; // 標題
  content: string; // 內文
  imageUrl?: string; // 照片 (選填，位於文章後面)
  publishTime?: string; // 發布時間
}

// e. 相簿 (純雲端外部連結展示)
export interface AlbumLink {
  id: string;
  title: string;
  subtitle: string;
  externalUrl: string;
  coverImage: string;
  photoCount: string;
  provider: 'Google Photos' | 'OneDrive' | 'Flickr';
}

// f. 各班攤位一覽 (嚴格三大元素：班級、品項分類、傳單照片)
export type BoothCategory = string;

export interface BoothItem {
  id: string;
  grade: '高一' | '高二';
  className: string; // 元素 1: 班級 (e.g. "101", "102", "201")
  category: BoothCategory; // 元素 2: 品項分類 (支援多分類以頓號「、」相容字串)
  categories?: string[]; // 支援多選品項分類清單 (例如: ['冷飲', '甜點'])
  flyerUrl: string; // 元素 3: 傳單照片
  boothNumber?: string; // 攤位編號 e.g. "A01"
  description?: string; // 補充說明
}

/**
 * 取得攤位的所有品項分類陣列 (向下相容單一字串與多分類陣列)
 */
export function getBoothCategories(booth?: { category?: string; categories?: string[] } | null): string[] {
  if (!booth) return [];
  if (booth.categories && Array.isArray(booth.categories) && booth.categories.length > 0) {
    return booth.categories.filter(Boolean);
  }
  if (booth.category) {
    return booth.category
      .split(/[,、/ ]/)
      .map(c => c.trim())
      .filter(Boolean);
  }
  return [];
}

export interface HomeCardConfig {
  title?: string;
  desc?: string;
  buttonText?: string;
  imageUrl?: string;
}

// 整個系統狀態
export interface SchoolCelebrationData {
  announcement: AnnouncementData;
  activities: ActivityItem[];
  schedules: ScheduleItem[];
  checkinSchedules?: CheckinScheduleItem[];
  honorRoll: HonorItem[];
  interviews: InterviewItem[];
  liveNews?: LiveNewsItem[];
  weekActivities?: WeekActivityItem[];
  booths: BoothItem[];
  boothCategories?: string[]; // 管理者可自訂編輯品項分類清單
  buttonImages?: Record<string, string>;
  homeCards?: Record<string, HomeCardConfig>; // 首頁功能卡片相片、大標題、內文與按鈕設定
  heroImage?: string;
  boothMapImage?: string;
  albums?: AlbumLink[];
}


