import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  SchoolCelebrationData,
  ActivityItem,
  ScheduleItem,
  CheckinScheduleItem,
  HonorItem,
  HonorAward,
  InterviewItem,
  LiveNewsItem,
  WeekActivityItem,
  BoothItem,
  getBoothCategories,
  AnnouncementData,
  AlbumLink,
  HomeCardConfig
} from '../types';
import { INITIAL_DATA, OFFICIAL_ALBUMS, BOOTH_MAP_IMAGE, DEFAULT_BOOTH_CATEGORIES, DEFAULT_HOME_CARDS } from '../data/initialData';
import { normalizeImageUrl } from '../utils/imageUtils';
import { createClientSessionToken } from '../utils/tokenUtils';
import {
  subscribeCelebrationData,
  saveCelebrationData,
  signInWithGoogle,
  signOutFirebase,
  auth,
  onAuthStateChanged,
  User
} from '../firebase';

const STORAGE_KEY = 'kghs_102nd_anniversary_data_v1';
const LEGACY_STORAGE_KEY = 'kghs_102th_anniversary_data_v1';
const SESSION_TOKEN_KEY = 'kghs_102nd_session_token';
const LEGACY_SESSION_TOKEN_KEY = 'kghs_102th_session_token';
const SESSION_EXPIRES_KEY = 'kghs_102nd_session_expires_at';
const LEGACY_SESSION_EXPIRES_KEY = 'kghs_102th_session_expires_at';
export const DEFAULT_ADMIN_PASSWORD = '123';
export const CUSTOM_PASSWORD_KEY = 'kghs_102nd_custom_admin_password';
export const LEGACY_CUSTOM_PASSWORD_KEY = 'kghs_102th_custom_admin_password';

interface ImagePreviewData {
  url: string;
  title: string;
  subtitle?: string;
}

interface AppContextType {
  data: SchoolCelebrationData;
  officialAlbums: AlbumLink[];
  boothMapImage: string;
  
  // 導航與側欄
  currentRoute: string;
  navigateTo: (route: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  
  // 圖片預覽彈窗
  previewImage: ImagePreviewData | null;
  openImagePreview: (url: string, title: string, subtitle?: string) => void;
  closeImagePreview: () => void;
  
  // 管理員權限與 Session Token 管理
  isAdminLoggedIn: boolean;
  sessionToken: string | null;
  sessionExpiresAt: number | null;
  hasCustomPassword: boolean;
  defaultAdminPassword: string;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  resetPasswordToDefault: () => Promise<{ success: boolean; message: string }>;
  
  // 跑馬燈
  updateAnnouncement: (announcement: AnnouncementData) => void;
  
  // a. 賽事活動簡介 (可增刪修)
  addActivity: (item: Omit<ActivityItem, 'id'>) => void;
  updateActivity: (item: ActivityItem) => void;
  deleteActivity: (id: string) => void;
  
  // b. 賽程表 (可增刪修)
  addSchedule: (item: Omit<ScheduleItem, 'id'>) => void;
  updateSchedule: (item: ScheduleItem) => void;
  deleteSchedule: (id: string) => void;

  // b-2. 檢錄時程表 (項目，時間，地點)
  addCheckinSchedule: (item: Omit<CheckinScheduleItem, 'id'>) => void;
  updateCheckinSchedule: (item: CheckinScheduleItem) => void;
  deleteCheckinSchedule: (id: string) => void;
  
  // c. 榮譽榜 (比賽項目可變動、增刪，內容為單一文字輸入框)
  addHonorItem: (item: Omit<HonorItem, 'id'>) => void;
  updateHonorItem: (item: HonorItem) => void;
  deleteHonorItem: (id: string) => void;
  addAwardToEvent: (eventId: string, award: Omit<HonorAward, 'id'>) => void;
  updateAwardInEvent: (eventId: string, award: HonorAward) => void;
  deleteAwardFromEvent: (eventId: string, awardId: string) => void;
  
  // d. 採訪報導 (年級分類固定為高一、高二，內文可增刪改)
  addInterview: (item: Omit<InterviewItem, 'id'>) => void;
  updateInterview: (item: InterviewItem) => void;
  deleteInterview: (id: string) => void;

  // d-2. 現場快報 (可增減標題內容，可選要不要加相片)
  addLiveNews: (item: Omit<LiveNewsItem, 'id'>) => void;
  updateLiveNews: (item: LiveNewsItem) => void;
  deleteLiveNews: (id: string) => void;

  // d-3. 校慶週活動 (可增減標題內容，可選要不要加相片)
  addWeekActivity: (item: Omit<WeekActivityItem, 'id'>) => void;
  updateWeekActivity: (item: WeekActivityItem) => void;
  deleteWeekActivity: (id: string) => void;
  
  // f. 各班攤位一覽 (欄位固定為班級、分類、傳單，支援多選分類)
  addBooth: (item: Omit<BoothItem, 'id'>) => void;
  updateBooth: (item: BoothItem) => void;
  deleteBooth: (id: string) => void;
  batchUpdateBoothCategories: (boothIds: string[], targetCategories: string[], mode?: 'replace' | 'add') => void;

  // f-2. 園遊會品項分類管理 (管理者可自訂、編輯、刪除分類，並同步攤位資料)
  boothCategories: string[];
  addBoothCategory: (categoryName: string) => boolean;
  updateBoothCategory: (oldCategory: string, newCategory: string) => boolean;
  deleteBoothCategory: (categoryName: string) => boolean;
  resetBoothCategories: () => void;
  
  // 首頁方框按鈕與卡片圖文自訂更新 (相片、大標題、說明內文、按鈕文字)
  updateButtonImage: (key: string, url: string) => void;
  updateHomeCard: (key: string, config: Partial<HomeCardConfig>) => void;
  resetHomeCard: (key: string) => void;

  // 自訂校慶相片、地圖與相簿封面及超連結
  heroImage: string;
  updateHeroImage: (url: string) => void;
  updateBoothMapImage: (url: string) => void;
  updateAlbumCover: (albumId: string, url: string) => void;
  updateAlbumUrl: (albumId: string, url: string) => void;
  updateAlbumTitle: (albumId: string, title: string) => void;
  uploadImageFile: (file: File) => Promise<string>;

  // 資料同步與重設
  resetToDefault: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonString: string) => boolean;
  restoreDraftBackup: () => boolean;

  // Firebase Firestore 跨裝置即時同步
  firebaseUser: User | null;
  loginWithGoogle: () => Promise<boolean>;
  isFirebaseConnected: boolean;
  cloudSyncedAt: number;
  isCloudSyncing: boolean;
  pushToCloud: () => Promise<{ success: boolean; message: string }>;
  refreshFromCloud: (force?: boolean) => Promise<{ updated: boolean; message: string }>;
}



const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. 初始化資料 (由 LocalStorage 讀取，若無則使用 INITIAL_DATA)
  const [data, setData] = useState<SchoolCelebrationData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      const savedInitialAnnouncement = localStorage.getItem(STORAGE_KEY + '_initial_announcement_signature') || localStorage.getItem(LEGACY_STORAGE_KEY + '_initial_announcement_signature');

      if (saved) {
        // 自動將儲存內容中的 102th 轉為 102nd
        const migratedSaved = saved.replace(/102th/g, '102nd');
        const parsed = JSON.parse(migratedSaved);
        // 若使用者在 initialData.ts 原始碼中修改了跑馬燈文字，自動更新為最新的原始碼設定
        if (savedInitialAnnouncement !== INITIAL_DATA.announcement.text) {
          parsed.announcement = {
            ...(parsed.announcement || {}),
            text: INITIAL_DATA.announcement.text,
            enabled: parsed.announcement?.enabled ?? INITIAL_DATA.announcement.enabled
          };
          localStorage.setItem(STORAGE_KEY + '_initial_announcement_signature', INITIAL_DATA.announcement.text);
        }

        // 去除 11/7 園遊會時程，並去除運動會時程的地點欄位
        if (parsed.schedules && Array.isArray(parsed.schedules)) {
          parsed.schedules = parsed.schedules
            .filter((s: any) => s.day !== '11/7')
            .map((s: any) => ({
              id: s.id,
              day: '11/6',
              time: s.time,
              title: s.title
            }));
        }
        if (parsed.honorRoll && Array.isArray(parsed.honorRoll)) {
          parsed.honorRoll = parsed.honorRoll.map((item: any) => {
            if (typeof item.content !== 'string') {
              const convertedContent = (item.awards || [])
                .map((a: any) => `${a.rank}：${a.awardee}${a.score ? ` ${a.score}` : ''}`)
                .join('\n');
              return {
                ...item,
                content: convertedContent
              };
            }
            return item;
          });
        }
        if (!parsed.checkinSchedules || !Array.isArray(parsed.checkinSchedules) || parsed.checkinSchedules.length === 0) {
          parsed.checkinSchedules = INITIAL_DATA.checkinSchedules;
        }
        if (!parsed.boothCategories || !Array.isArray(parsed.boothCategories) || parsed.boothCategories.length === 0) {
          parsed.boothCategories = DEFAULT_BOOTH_CATEGORIES;
        }
        if (parsed.booths && Array.isArray(parsed.booths)) {
          parsed.booths = parsed.booths.map((b: any) => {
            const cats = getBoothCategories(b);
            const validCats = cats.length > 0 ? cats : [parsed.boothCategories[0] || '冷飲'];
            return {
              ...b,
              categories: validCats,
              category: validCats.join('、')
            };
          });
        }
        // 初始化或補全首頁卡片自訂資料 (相片、大標題、內文、按鈕)
        const mergedHomeCards: Record<string, HomeCardConfig> = { ...DEFAULT_HOME_CARDS };
        if (parsed.homeCards && typeof parsed.homeCards === 'object') {
          Object.keys(DEFAULT_HOME_CARDS).forEach(key => {
            mergedHomeCards[key] = {
              ...DEFAULT_HOME_CARDS[key],
              ...(parsed.homeCards[key] || {}),
              // 若有先前上傳的按鈕圖片且 card 未設自訂相片，優先沿用
              imageUrl: parsed.homeCards[key]?.imageUrl || parsed.buttonImages?.[key] || DEFAULT_HOME_CARDS[key]?.imageUrl
            };
          });
        } else if (parsed.buttonImages) {
          Object.keys(DEFAULT_HOME_CARDS).forEach(key => {
            if (parsed.buttonImages[key]) {
              mergedHomeCards[key] = {
                ...DEFAULT_HOME_CARDS[key],
                imageUrl: parsed.buttonImages[key]
              };
            }
          });
        }
        parsed.homeCards = mergedHomeCards;
        if (!parsed.heroImage || parsed.heroImage === '/src/assets/images/hero_kghs_celebration_1792325750838.jpg') {
          parsed.heroImage = INITIAL_DATA.heroImage;
        }
        if (!parsed.albums || !Array.isArray(parsed.albums) || parsed.albums.length === 0) {
          try {
            const cachedAlbums = localStorage.getItem('kghs_102nd_albums_cache') || localStorage.getItem('kghs_102th_albums_cache');
            if (cachedAlbums) {
              parsed.albums = JSON.parse(cachedAlbums);
            } else {
              parsed.albums = INITIAL_DATA.albums || OFFICIAL_ALBUMS;
            }
          } catch {
            parsed.albums = INITIAL_DATA.albums || OFFICIAL_ALBUMS;
          }
        }
        if (!parsed.liveNews || !Array.isArray(parsed.liveNews) || parsed.liveNews.length === 0) {
          parsed.liveNews = INITIAL_DATA.liveNews || [];
        }
        if (!parsed.weekActivities || !Array.isArray(parsed.weekActivities) || parsed.weekActivities.length === 0) {
          parsed.weekActivities = INITIAL_DATA.weekActivities || [];
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to load saved school celebration data', e);
    }
    try {
      localStorage.setItem(STORAGE_KEY + '_initial_announcement_signature', INITIAL_DATA.announcement.text);
    } catch {
      // ignore
    }
    return INITIAL_DATA;
  });

  // 2. 路由狀態解析 (支援在網址後輸入 /admini2t2 或 #/admini2t2，無效或根路徑一律顯示首頁)
  const KNOWN_ROUTES = ['home', 'activities', 'schedule', 'honor', 'interviews', 'livenews', 'weekactivities', 'albums', 'booths', 'admin', 'admini2t2'] as const;

  const resolveRouteFromLocation = (): string => {
    const hashRaw = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
    const pathRaw = window.location.pathname.replace(/^\/|\/$/g, '').trim().toLowerCase();

    // 1. 若 hash 明確指定為 admini2t2 或 login
    if (hashRaw === 'admini2t2' || hashRaw === 'login') {
      return 'admini2t2';
    }

    // 2. 若 pathname 明確為 admini2t2 或 login (且 hash 為空或非已知分頁)
    if (pathRaw === 'admini2t2' || pathRaw === 'login') {
      // 若 hash 有指定其他分頁，以 hash 優先
      if (hashRaw && hashRaw !== 'admini2t2' && hashRaw !== 'login' && KNOWN_ROUTES.includes(hashRaw as any)) {
        return hashRaw === 'home' ? 'home' : hashRaw;
      }
      return 'admini2t2';
    }

    // 3. 檢查 hash 是否指定了其他已知分頁 (如 activities, schedule, honor 等)
    if (hashRaw && hashRaw !== 'index.html' && hashRaw !== 'home') {
      if (KNOWN_ROUTES.includes(hashRaw as any)) {
        return hashRaw;
      }
    }

    // 4. 檢查 pathname 是否指定了其他已知分頁
    if (pathRaw && pathRaw !== 'index.html' && pathRaw !== 'home') {
      if (KNOWN_ROUTES.includes(pathRaw as any)) {
        return pathRaw;
      }
    }

    // 5. 其餘任何狀況（包括根目錄 /、隨便輸入的字串）皆一律顯示前台首頁 home
    return 'home';
  };

  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return resolveRouteFromLocation();
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<ImagePreviewData | null>(null);

  // 3. 管理員 Session Token 權限管理
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    try {
      const token = sessionStorage.getItem(SESSION_TOKEN_KEY) || sessionStorage.getItem(LEGACY_SESSION_TOKEN_KEY);
      const exp = Number(sessionStorage.getItem(SESSION_EXPIRES_KEY) || sessionStorage.getItem(LEGACY_SESSION_EXPIRES_KEY)) || 0;
      if (token && exp > Date.now()) {
        return token;
      }
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
      sessionStorage.removeItem(LEGACY_SESSION_TOKEN_KEY);
      sessionStorage.removeItem(SESSION_EXPIRES_KEY);
      sessionStorage.removeItem(LEGACY_SESSION_EXPIRES_KEY);
      return null;
    } catch {
      return null;
    }
  });

  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(() => {
    try {
      const exp = Number(sessionStorage.getItem(SESSION_EXPIRES_KEY) || sessionStorage.getItem(LEGACY_SESSION_EXPIRES_KEY)) || 0;
      return exp > Date.now() ? exp : null;
    } catch {
      return null;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return Boolean(sessionToken);
  });

  const [customPassword, setCustomPassword] = useState<string | null>(() => {
    try {
      return localStorage.getItem(CUSTOM_PASSWORD_KEY) || localStorage.getItem(LEGACY_CUSTOM_PASSWORD_KEY);
    } catch {
      return null;
    }
  });

  const [enteredPassword, setEnteredPassword] = useState<string>(() => {
    try {
      return sessionStorage.getItem('kghs_admin_password') || '';
    } catch {
      return '';
    }
  });

  const currentAdminPassword = enteredPassword || customPassword || DEFAULT_ADMIN_PASSWORD;

  // 當 sessionToken 改變時同步更新登入狀態
  useEffect(() => {
    setIsAdminLoggedIn(Boolean(sessionToken));
  }, [sessionToken]);

  // 監聽網址 hash 與 popstate 變化以支援直接輸入 /admini2t2
  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentRoute(resolveRouteFromLocation());
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // 4. Firebase Firestore 跨裝置即時同步引擎 (支援即時推播、無延遲監聽與本機伺服器雙重備份)
  const [cloudSyncedAt, setCloudSyncedAt] = useState<number>(() => {
    return Number(localStorage.getItem(STORAGE_KEY + '_cloud_synced_at')) || 0;
  });
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const isFirstRender = useRef(true);
  const isIncomingRemoteUpdateRef = useRef(false);

  // 監聽 Firebase 登入狀態變更 (支援 Google 管理員登入與自動簽發 Session)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        const token = 'firebase_' + user.uid;
        const exp = Date.now() + 24 * 60 * 60 * 1000;
        sessionStorage.setItem(SESSION_TOKEN_KEY, token);
        sessionStorage.setItem(SESSION_EXPIRES_KEY, exp.toString());
        setSessionToken(token);
        setSessionExpiresAt(exp);
        setIsAdminLoggedIn(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // 靜默向後端伺服器拉取備用資料 (作為離線或 Firebase 初始備份)
  const fetchBackupData = useCallback(async (isSilent = true) => {
    try {
      if (!isSilent) setIsCloudSyncing(true);
      const res = await fetch('/api/data', {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      if (!res.ok) return;
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return;

      const json = await res.json();
      if (json && json.success && json.data) {
        const remoteUpdatedAt = Number(json.updatedAt) || 0;
        const currentSavedTimestamp = Number(localStorage.getItem(STORAGE_KEY + '_cloud_synced_at')) || 0;

        const remoteStr = JSON.stringify(json.data);
        const localSavedStr = localStorage.getItem(STORAGE_KEY);
        const isDataDifferent = !localSavedStr || remoteStr !== localSavedStr;

        const isLocalAdminEditing = (isAdminLoggedIn || sessionToken) && currentSavedTimestamp > remoteUpdatedAt;

        if (!isLocalAdminEditing && (remoteUpdatedAt > currentSavedTimestamp || !currentSavedTimestamp || isDataDifferent)) {
          isIncomingRemoteUpdateRef.current = true;
          setData(json.data);
          setCloudSyncedAt(remoteUpdatedAt || Date.now());
          localStorage.setItem(STORAGE_KEY, remoteStr);
          localStorage.setItem(STORAGE_KEY + '_cloud_synced_at', (remoteUpdatedAt || Date.now()).toString());
        }
      }
    } catch {
      // 離線靜默退避
    } finally {
      if (!isSilent) setIsCloudSyncing(false);
    }
  }, [isAdminLoggedIn, sessionToken]);

  // Firebase Firestore 即時雙向監聽 (即刻感知任何裝置或管理員的修改推播)
  useEffect(() => {
    let isSubscribed = true;
    const unsubscribe = subscribeCelebrationData(
      (remotePayload, updatedAt) => {
        if (!isSubscribed) return;
        setIsFirebaseConnected(true);
        if (remotePayload && (remotePayload.announcement || remotePayload.activities || remotePayload.booths)) {
          const currentSavedTimestamp = Number(localStorage.getItem(STORAGE_KEY + '_cloud_synced_at')) || 0;
          const remoteStr = JSON.stringify(remotePayload);
          const localSavedStr = localStorage.getItem(STORAGE_KEY);
          const isDataDifferent = !localSavedStr || remoteStr !== localSavedStr;

          // 若非本地未儲存之管理員草稿，或者遠端資料確有異動即刻同步
          if (updatedAt >= currentSavedTimestamp || isDataDifferent) {
            isIncomingRemoteUpdateRef.current = true;
            setData(prev => ({
              ...prev,
              ...remotePayload
            }));
            setCloudSyncedAt(updatedAt || Date.now());
            try {
              localStorage.setItem(STORAGE_KEY, remoteStr);
              localStorage.setItem(STORAGE_KEY + '_cloud_synced_at', (updatedAt || Date.now()).toString());
            } catch (e) {
              console.warn('LocalStorage save error on remote update', e);
            }
          }
        }
      },
      (error) => {
        console.warn('[Firebase] Realtime sync error, switching to server fallback:', error.message);
        fetchBackupData(true);
      }
    );

    // 啟動時先嘗試向後端檢查一次是否有既有資料
    fetchBackupData(true);

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, [fetchBackupData]);

  // 手動主動儲存並發布至 Firebase 雲端與後端伺服器 (將當前畫面所有的改動立即推送到 Firebase Firestore)
  const pushToCloud = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    try {
      setIsCloudSyncing(true);
      const token = sessionToken || sessionStorage.getItem(SESSION_TOKEN_KEY) || sessionStorage.getItem(LEGACY_SESSION_TOKEN_KEY) || 'admin_session_token';

      // 儲存前自動建立本機緊急草稿備份
      try {
        localStorage.setItem('kghs_auto_draft_backup', JSON.stringify({
          timestamp: Date.now(),
          data
        }));
      } catch {}

      let firebaseSaved = false;
      let timestamp = Date.now();

      // 1. 優先寫入 Firebase Firestore
      try {
        timestamp = await saveCelebrationData(data);
        firebaseSaved = true;
      } catch (fbErr: any) {
        console.warn('[Firebase] Firestore direct write error:', fbErr.message);
      }

      // 2. 寫入本地伺服器 /api/data 作為雙重備份
      try {
        await fetch('/api/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Session-Token': token,
            'X-Admin-Password': currentAdminPassword
          },
          body: JSON.stringify(data)
        });
      } catch (srvErr) {
        console.warn('[Server] Backup write offline', srvErr);
      }

      setCloudSyncedAt(timestamp);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(STORAGE_KEY + '_cloud_synced_at', timestamp.toString());

      return {
        success: true,
        message: firebaseSaved
          ? `已成功儲存並同步至 Firebase 雲端資料庫！全站所有裝置已即時同步更新 (${new Date(timestamp).toLocaleTimeString()})`
          : `已成功儲存至伺服器備份！所有裝置將持續自動同步 (${new Date(timestamp).toLocaleTimeString()})`
      };
    } catch (e: any) {
      return { success: false, message: `發布失敗：${e?.message || '網路離線，已保存在本機'}` };
    } finally {
      setIsCloudSyncing(false);
    }
  }, [data, sessionToken, currentAdminPassword]);

  // 手動拉取雲端資料 (支援由 Firebase / 後端伺服器拉取)
  const refreshFromCloud = useCallback(async (force = false): Promise<{ updated: boolean; message: string }> => {
    try {
      setIsCloudSyncing(true);
      const res = await fetch('/api/data', {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      if (!res.ok) return { updated: false, message: '無法連接伺服器，請檢查網路連線。' };
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return { updated: false, message: '伺服器目前未回傳有效 JSON 資料。' };
      }
      const json = await res.json();
      if (json && json.success && json.data) {
        const remoteUpdatedAt = Number(json.updatedAt) || 0;
        const currentSavedTimestamp = Number(localStorage.getItem(STORAGE_KEY + '_cloud_synced_at')) || 0;
        const remoteStr = JSON.stringify(json.data);
        const localSavedStr = localStorage.getItem(STORAGE_KEY);
        const isDataDifferent = !localSavedStr || remoteStr !== localSavedStr;

        if (force || remoteUpdatedAt > currentSavedTimestamp || !currentSavedTimestamp || isDataDifferent) {
          try {
            localStorage.setItem('kghs_auto_backup_before_pull', JSON.stringify({
              timestamp: Date.now(),
              data
            }));
          } catch {}

          isIncomingRemoteUpdateRef.current = true;
          setData(json.data);
          setCloudSyncedAt(remoteUpdatedAt || Date.now());
          localStorage.setItem(STORAGE_KEY, remoteStr);
          localStorage.setItem(STORAGE_KEY + '_cloud_synced_at', (remoteUpdatedAt || Date.now()).toString());
          return {
            updated: true,
            message: `已同步至雲端最新版本 (${new Date(remoteUpdatedAt || Date.now()).toLocaleTimeString()})`
          };
        } else {
          return {
            updated: false,
            message: '目前本機內容已是最新版本，雲端無更新內容。'
          };
        }
      }
      return { updated: false, message: '雲端目前無新資料' };
    } catch {
      return { updated: false, message: '雲端同步離線' };
    } finally {
      setIsCloudSyncing(false);
    }
  }, [data]);

  // 一鍵從暫存草稿還原
  const restoreDraftBackup = useCallback((): boolean => {
    try {
      const raw = localStorage.getItem('kghs_auto_backup_before_pull') || localStorage.getItem('kghs_auto_draft_backup');
      if (raw) {
        const parsed = JSON.parse(raw);
        const draftData = parsed.data || parsed;
        if (draftData && typeof draftData === 'object' && draftData.announcement) {
          setData(draftData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
          return true;
        }
      }
    } catch (e) {
      console.warn('Restore draft backup failed', e);
    }
    return false;
  }, []);

  // 當管理員在後台更新資料時，非同步自動發送至 Firebase Firestore 與本地伺服器
  const pushToFirebaseAndServer = useCallback(async (newData: SchoolCelebrationData) => {
    try {
      // 1. 寫入 Firebase Firestore
      try {
        await saveCelebrationData(newData);
      } catch (fbErr) {
        // Fallback silently
      }

      // 2. 寫入本地伺服器
      const token = sessionToken || sessionStorage.getItem(SESSION_TOKEN_KEY) || sessionStorage.getItem(LEGACY_SESSION_TOKEN_KEY) || 'admin_session_token';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Session-Token': token,
        'X-Admin-Password': currentAdminPassword
      };

      const res = await fetch('/api/data', {
        method: 'POST',
        headers,
        body: JSON.stringify(newData)
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const json = await res.json();
          if (json.success && json.updatedAt) {
            const nowTimestamp = Number(json.updatedAt) || Date.now();
            setCloudSyncedAt(nowTimestamp);
            localStorage.setItem(STORAGE_KEY + '_cloud_synced_at', nowTimestamp.toString());
          }
        }
      }
    } catch (e) {
      console.warn('Data sync offline fallback', e);
    }
  }, [sessionToken, currentAdminPassword]);

  // 儲存至 LocalStorage (並在管理員登入操作時自動同步至 Firebase Firestore 與伺服器)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem('kghs_auto_draft_backup', JSON.stringify({
        timestamp: Date.now(),
        data
      }));
    } catch (e) {
      console.error('LocalStorage save error', e);
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isIncomingRemoteUpdateRef.current) {
      isIncomingRemoteUpdateRef.current = false;
      return;
    }

    if (isAdminLoggedIn || sessionToken || sessionStorage.getItem(SESSION_TOKEN_KEY)) {
      pushToFirebaseAndServer(data);
    }
  }, [data, pushToFirebaseAndServer, sessionToken, isAdminLoggedIn]);

  const navigateTo = (route: string) => {
    const target = route === 'login' ? 'admini2t2' : route;
    setCurrentRoute(target);
    if (target === 'home') {
      try {
        if (window.location.pathname !== '/' && window.location.pathname !== '') {
          window.history.replaceState(null, '', '/');
        }
      } catch {
        // ignore
      }
      window.location.hash = '';
    } else {
      window.location.hash = `#/${target}`;
    }
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const openImagePreview = (url: string, title: string, subtitle?: string) => {
    setPreviewImage({ url, title, subtitle });
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  // 管理員登入驗證 (優先向 Cloudflare /api/auth 驗證換取 Session Token，離線具備安全退避)
  const login = async (password: string): Promise<boolean> => {
    const trimmed = password.trim();
    if (!trimmed) return false;

    // 1. 優先向 Cloudflare Pages Functions /api/auth 驗證並索取 Session Token
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmed })
      });

      if (res.ok) {
        const json = await res.json();
        if (json && json.success && json.token) {
          const token = json.token;
          const expiresAt = json.expiresAt || (Date.now() + 24 * 60 * 60 * 1000);
          sessionStorage.setItem(SESSION_TOKEN_KEY, token);
          sessionStorage.setItem(SESSION_EXPIRES_KEY, expiresAt.toString());
          sessionStorage.setItem('kghs_admin_password', trimmed);
          setEnteredPassword(trimmed);
          setSessionToken(token);
          setSessionExpiresAt(expiresAt);
          setIsAdminLoggedIn(true);
          navigateTo('admin');
          return true;
        }
      } else if (res.status === 401) {
        // 伺服器在線且明確判定密碼不符，直接拒絕，避免本機偽登入
        return false;
      }
    } catch {
      // 網路斷線或離線環境（fetch 拋出例外時安全退避）
    }

    // 2. 本機相容模式 (僅在網路完全離線無伺服器回應時生效)
    if (trimmed === currentAdminPassword || trimmed === '123') {
      try {
        const { token, expiresAt } = await createClientSessionToken(trimmed, 24);
        sessionStorage.setItem(SESSION_TOKEN_KEY, token);
        sessionStorage.setItem(SESSION_EXPIRES_KEY, expiresAt.toString());
        sessionStorage.setItem('kghs_admin_password', trimmed);
        setEnteredPassword(trimmed);
        setSessionToken(token);
        setSessionExpiresAt(expiresAt);
        setIsAdminLoggedIn(true);
        navigateTo('admin');
        return true;
      } catch (err) {
        console.error('Failed to create session token', err);
        return false;
      }
    }

    return false;
  };

  // Google 登入驗證 (以 Firebase Auth 登入獲取即時雲端儲存授權)
  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        setFirebaseUser(user);
        const token = 'firebase_' + user.uid;
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
        sessionStorage.setItem(SESSION_TOKEN_KEY, token);
        sessionStorage.setItem(SESSION_EXPIRES_KEY, expiresAt.toString());
        setSessionToken(token);
        setSessionExpiresAt(expiresAt);
        setIsAdminLoggedIn(true);
        navigateTo('admin');
        return true;
      }
    } catch (err: any) {
      console.warn('[Firebase Auth] Google login cancelled or failed:', err?.message);
    }
    return false;
  };

  const logout = () => {
    setSessionToken(null);
    setSessionExpiresAt(null);
    setIsAdminLoggedIn(false);
    setEnteredPassword('');
    setFirebaseUser(null);
    signOutFirebase().catch(() => {});
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(LEGACY_SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_EXPIRES_KEY);
    sessionStorage.removeItem(LEGACY_SESSION_EXPIRES_KEY);
    sessionStorage.removeItem('kghs_admin_password');
    sessionStorage.removeItem('kghs_102nd_admin_session');
    sessionStorage.removeItem('kghs_102th_admin_session');
    navigateTo('home');
  };

  // 修改管理員登入密碼 (並重新簽發新的 Session Token)
  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    if (oldPassword !== currentAdminPassword) {
      return { success: false, message: '目前舊密碼輸入不正確，請重新確認。' };
    }
    const trimmed = newPassword.trim();
    if (!trimmed || trimmed.length < 1) {
      return { success: false, message: '請輸入有效的新密碼。' };
    }
    if (trimmed === oldPassword) {
      return { success: false, message: '新密碼不可與目前密碼相同。' };
    }
    try {
      localStorage.setItem(CUSTOM_PASSWORD_KEY, trimmed);
      setCustomPassword(trimmed);

      // 重新簽發與新密碼綁定之 Session Token
      const { token, expiresAt } = await createClientSessionToken(trimmed, 24);
      sessionStorage.setItem(SESSION_TOKEN_KEY, token);
      sessionStorage.setItem(SESSION_EXPIRES_KEY, expiresAt.toString());
      setSessionToken(token);
      setSessionExpiresAt(expiresAt);

      return { success: true, message: '管理員登入密碼已成功更新！系統已為您重新簽發安全 Session Token。' };
    } catch (e) {
      return { success: false, message: '儲存新密碼失敗，請檢查瀏覽器儲存權限。' };
    }
  };

  // 還原為預設密碼 (並重新簽發 Session Token)
  const resetPasswordToDefault = async (): Promise<{ success: boolean; message: string }> => {
    try {
      localStorage.removeItem(CUSTOM_PASSWORD_KEY);
      setCustomPassword(null);

      const { token, expiresAt } = await createClientSessionToken(DEFAULT_ADMIN_PASSWORD, 24);
      sessionStorage.setItem(SESSION_TOKEN_KEY, token);
      sessionStorage.setItem(SESSION_EXPIRES_KEY, expiresAt.toString());
      setSessionToken(token);
      setSessionExpiresAt(expiresAt);

      return { success: true, message: `已成功還原為系統預設密碼 (${DEFAULT_ADMIN_PASSWORD}) 並更新 Session Token` };
    } catch (e) {
      return { success: false, message: '還原密碼失敗' };
    }
  };

  // 跑馬燈更新
  const updateAnnouncement = (announcement: AnnouncementData) => {
    setData(prev => {
      const next = { ...prev, announcement };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        localStorage.setItem(STORAGE_KEY + '_initial_announcement_signature', announcement.text);
      } catch (e) {
        console.error('Failed to sync announcement update to localStorage', e);
      }
      return next;
    });
  };

  // a. 賽事活動簡介
  const addActivity = (item: Omit<ActivityItem, 'id'>) => {
    const newAct: ActivityItem = {
      ...item,
      id: `act-${Date.now()}`
    };
    setData(prev => ({ ...prev, activities: [...prev.activities, newAct] }));
  };

  const updateActivity = (item: ActivityItem) => {
    setData(prev => ({
      ...prev,
      activities: prev.activities.map(act => act.id === item.id ? item : act)
    }));
  };

  const deleteActivity = (id: string) => {
    setData(prev => ({
      ...prev,
      activities: prev.activities.filter(act => act.id !== id)
    }));
  };

  // b. 賽程表
  const addSchedule = (item: Omit<ScheduleItem, 'id'>) => {
    const newSch: ScheduleItem = {
      ...item,
      id: `sch-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      schedules: [...prev.schedules, newSch].sort((a, b) => a.time.localeCompare(b.time))
    }));
  };

  const updateSchedule = (item: ScheduleItem) => {
    setData(prev => ({
      ...prev,
      schedules: prev.schedules.map(sch => sch.id === item.id ? item : sch).sort((a, b) => a.time.localeCompare(b.time))
    }));
  };

  const deleteSchedule = (id: string) => {
    setData(prev => ({
      ...prev,
      schedules: prev.schedules.filter(sch => sch.id !== id)
    }));
  };

  // b-2. 檢錄時程表 (項目，時間，地點)
  const addCheckinSchedule = (item: Omit<CheckinScheduleItem, 'id'>) => {
    const newChk: CheckinScheduleItem = {
      ...item,
      id: `chk-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      checkinSchedules: [...(prev.checkinSchedules || []), newChk].sort((a, b) => a.time.localeCompare(b.time))
    }));
  };

  const updateCheckinSchedule = (item: CheckinScheduleItem) => {
    setData(prev => ({
      ...prev,
      checkinSchedules: (prev.checkinSchedules || [])
        .map(chk => (chk.id === item.id ? item : chk))
        .sort((a, b) => a.time.localeCompare(b.time))
    }));
  };

  const deleteCheckinSchedule = (id: string) => {
    setData(prev => ({
      ...prev,
      checkinSchedules: (prev.checkinSchedules || []).filter(chk => chk.id !== id)
    }));
  };

  // c. 榮譽榜 (比賽項目可變動、增刪，內容為單一文字輸入框)
  const addHonorItem = (item: Omit<HonorItem, 'id'>) => {
    const newItem: HonorItem = {
      ...item,
      id: `honor-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      honorRoll: [...prev.honorRoll, newItem]
    }));
  };

  const updateHonorItem = (item: HonorItem) => {
    setData(prev => ({
      ...prev,
      honorRoll: prev.honorRoll.map(h => (h.id === item.id ? item : h))
    }));
  };

  const deleteHonorItem = (id: string) => {
    setData(prev => ({
      ...prev,
      honorRoll: prev.honorRoll.filter(h => h.id !== id)
    }));
  };

  // 舊版名次相容函式
  const addAwardToEvent = (eventId: string, award: Omit<HonorAward, 'id'>) => {
    const newAward: HonorAward = {
      ...award,
      id: `aw-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      honorRoll: prev.honorRoll.map(item => {
        if (item.id === eventId) {
          const nextAwards = [...(item.awards || []), newAward];
          return {
            ...item,
            awards: nextAwards,
            content: nextAwards.map(a => `${a.rank}：${a.awardee}${a.score ? ` ${a.score}` : ''}`).join('\n')
          };
        }
        return item;
      })
    }));
  };

  const updateAwardInEvent = (eventId: string, award: HonorAward) => {
    setData(prev => ({
      ...prev,
      honorRoll: prev.honorRoll.map(item => {
        if (item.id === eventId) {
          const nextAwards = (item.awards || []).map(a => a.id === award.id ? award : a);
          return {
            ...item,
            awards: nextAwards,
            content: nextAwards.map(a => `${a.rank}：${a.awardee}${a.score ? ` ${a.score}` : ''}`).join('\n')
          };
        }
        return item;
      })
    }));
  };

  const deleteAwardFromEvent = (eventId: string, awardId: string) => {
    setData(prev => ({
      ...prev,
      honorRoll: prev.honorRoll.map(item => {
        if (item.id === eventId) {
          const nextAwards = (item.awards || []).filter(a => a.id !== awardId);
          return {
            ...item,
            awards: nextAwards,
            content: nextAwards.map(a => `${a.rank}：${a.awardee}${a.score ? ` ${a.score}` : ''}`).join('\n')
          };
        }
        return item;
      })
    }));
  };

  // d. 採訪報導 (年級分類固定為高一、高二)
  const addInterview = (item: Omit<InterviewItem, 'id'>) => {
    const newIv: InterviewItem = {
      ...item,
      id: `iv-${Date.now()}`,
      imageUrl: item.imageUrl ? normalizeImageUrl(item.imageUrl) : undefined,
      publishTime: item.publishTime || new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setData(prev => ({ ...prev, interviews: [newIv, ...prev.interviews] }));
  };

  const updateInterview = (item: InterviewItem) => {
    const normalizedItem: InterviewItem = {
      ...item,
      imageUrl: item.imageUrl ? normalizeImageUrl(item.imageUrl) : undefined
    };
    setData(prev => ({
      ...prev,
      interviews: prev.interviews.map(iv => iv.id === item.id ? normalizedItem : iv)
    }));
  };

  const deleteInterview = (id: string) => {
    setData(prev => ({
      ...prev,
      interviews: prev.interviews.filter(iv => iv.id !== id)
    }));
  };

  // d-2. 現場快報 (可增減標題內容，可選要不要加圖片)
  const addLiveNews = (item: Omit<LiveNewsItem, 'id'>) => {
    const newItem: LiveNewsItem = {
      ...item,
      id: `news-${Date.now()}`,
      imageUrl: item.imageUrl ? normalizeImageUrl(item.imageUrl) : undefined,
      publishTime: item.publishTime || new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setData(prev => ({
      ...prev,
      liveNews: [newItem, ...(prev.liveNews || [])]
    }));
  };

  const updateLiveNews = (item: LiveNewsItem) => {
    const normalizedItem: LiveNewsItem = {
      ...item,
      imageUrl: item.imageUrl ? normalizeImageUrl(item.imageUrl) : undefined
    };
    setData(prev => ({
      ...prev,
      liveNews: (prev.liveNews || []).map(n => n.id === item.id ? normalizedItem : n)
    }));
  };

  const deleteLiveNews = (id: string) => {
    setData(prev => ({
      ...prev,
      liveNews: (prev.liveNews || []).filter(n => n.id !== id)
    }));
  };

  // d-3. 校慶週活動 (可增減標題內容，可選要不要加圖片)
  const addWeekActivity = (item: Omit<WeekActivityItem, 'id'>) => {
    const newItem: WeekActivityItem = {
      ...item,
      id: `week-${Date.now()}`,
      imageUrl: item.imageUrl ? normalizeImageUrl(item.imageUrl) : undefined,
      publishTime: item.publishTime || new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setData(prev => ({
      ...prev,
      weekActivities: [newItem, ...(prev.weekActivities || [])]
    }));
  };

  const updateWeekActivity = (item: WeekActivityItem) => {
    const normalizedItem: WeekActivityItem = {
      ...item,
      imageUrl: item.imageUrl ? normalizeImageUrl(item.imageUrl) : undefined
    };
    setData(prev => ({
      ...prev,
      weekActivities: (prev.weekActivities || []).map(w => w.id === item.id ? normalizedItem : w)
    }));
  };

  const deleteWeekActivity = (id: string) => {
    setData(prev => ({
      ...prev,
      weekActivities: (prev.weekActivities || []).filter(w => w.id !== id)
    }));
  };

  // f. 各班攤位一覽 (欄位固定: 班級、分類、傳單，支援多選分類)
  const addBooth = (item: Omit<BoothItem, 'id'>) => {
    const cats = item.categories && item.categories.length > 0
      ? item.categories
      : (item.category ? item.category.split(/[,、]/).map(s => s.trim()).filter(Boolean) : ['未分類']);
    const newBooth: BoothItem = {
      ...item,
      categories: cats,
      category: cats.join('、'),
      flyerUrl: normalizeImageUrl(item.flyerUrl),
      id: `b-${Date.now()}`
    };
    setData(prev => ({ ...prev, booths: [...prev.booths, newBooth] }));
  };

  const updateBooth = (item: BoothItem) => {
    const cats = item.categories && item.categories.length > 0
      ? item.categories
      : (item.category ? item.category.split(/[,、]/).map(s => s.trim()).filter(Boolean) : ['未分類']);
    const normalizedBooth: BoothItem = {
      ...item,
      categories: cats,
      category: cats.join('、'),
      flyerUrl: normalizeImageUrl(item.flyerUrl)
    };
    setData(prev => ({
      ...prev,
      booths: prev.booths.map(b => b.id === item.id ? normalizedBooth : b)
    }));
  };

  const deleteBooth = (id: string) => {
    setData(prev => ({
      ...prev,
      booths: prev.booths.filter(b => b.id !== id)
    }));
  };

  // 批次更新多個班級攤位的品項分類 (支援多選替換或追加)
  const batchUpdateBoothCategories = (
    boothIds: string[],
    targetCategories: string[],
    mode: 'replace' | 'add' = 'replace'
  ) => {
    if (!boothIds || boothIds.length === 0 || !targetCategories || targetCategories.length === 0) return;
    setData(prev => {
      const nextBooths = prev.booths.map(b => {
        if (!boothIds.includes(b.id)) return b;
        const currentCats = getBoothCategories(b);
        let nextCats: string[];
        if (mode === 'add') {
          nextCats = Array.from(new Set([...currentCats, ...targetCategories]));
        } else {
          nextCats = [...targetCategories];
        }
        if (nextCats.length === 0) {
          nextCats = ['未分類'];
        }
        return {
          ...b,
          categories: nextCats,
          category: nextCats.join('、')
        };
      });
      return { ...prev, booths: nextBooths };
    });
  };

  // f-2. 園遊會品項分類 (支援管理者動態編輯、新增、刪除)
  const boothCategories = (data.boothCategories && Array.isArray(data.boothCategories) && data.boothCategories.length > 0)
    ? data.boothCategories
    : DEFAULT_BOOTH_CATEGORIES;

  const addBoothCategory = (categoryName: string): boolean => {
    const trimmed = categoryName.trim();
    if (!trimmed) return false;
    if (boothCategories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      return false;
    }
    setData(prev => {
      const currentList = (prev.boothCategories && prev.boothCategories.length > 0)
        ? prev.boothCategories
        : DEFAULT_BOOTH_CATEGORIES;
      return {
        ...prev,
        boothCategories: [...currentList, trimmed]
      };
    });
    return true;
  };

  const updateBoothCategory = (oldCategory: string, newCategory: string): boolean => {
    const trimmed = newCategory.trim();
    if (!trimmed || trimmed === oldCategory) return false;
    if (boothCategories.some(c => c !== oldCategory && c.toLowerCase() === trimmed.toLowerCase())) {
      return false;
    }
    setData(prev => {
      const currentList = (prev.boothCategories && prev.boothCategories.length > 0)
        ? prev.boothCategories
        : DEFAULT_BOOTH_CATEGORIES;
      const nextList = currentList.map(c => c === oldCategory ? trimmed : c);
      const nextBooths = prev.booths.map(b => {
        const currentCats = getBoothCategories(b);
        if (!currentCats.includes(oldCategory)) return b;
        const nextCats = currentCats.map(c => c === oldCategory ? trimmed : c);
        return {
          ...b,
          categories: nextCats,
          category: nextCats.join('、')
        };
      });
      return {
        ...prev,
        boothCategories: nextList,
        booths: nextBooths
      };
    });
    return true;
  };

  const deleteBoothCategory = (categoryName: string): boolean => {
    setData(prev => {
      const currentList = (prev.boothCategories && prev.boothCategories.length > 0)
        ? prev.boothCategories
        : DEFAULT_BOOTH_CATEGORIES;
      const nextList = currentList.filter(c => c !== categoryName);
      const nextBooths = prev.booths.map(b => {
        const currentCats = getBoothCategories(b);
        if (!currentCats.includes(categoryName)) return b;
        const nextCats = currentCats.filter(c => c !== categoryName);
        return {
          ...b,
          categories: nextCats.length > 0 ? nextCats : ['未分類'],
          category: nextCats.length > 0 ? nextCats.join('、') : '未分類'
        };
      });
      return {
        ...prev,
        boothCategories: nextList,
        booths: nextBooths
      };
    });
    return true;
  };

  const resetBoothCategories = () => {
    setData(prev => ({
      ...prev,
      boothCategories: DEFAULT_BOOTH_CATEGORIES
    }));
  };

  // 相簿清單 (直接納入全域 data.albums，確保與伺服器及所有跨裝置完全同步)
  const ALBUMS_STORAGE_KEY = 'kghs_102nd_albums_cache';
  const LEGACY_ALBUMS_STORAGE_KEY = 'kghs_102th_albums_cache';
  const albums: AlbumLink[] = (data.albums && Array.isArray(data.albums) && data.albums.length > 0)
    ? data.albums
    : OFFICIAL_ALBUMS;

  const updateAlbumCover = (albumId: string, url: string) => {
    const normalizedUrl = normalizeImageUrl(url);
    const nextAlbums = albums.map(a => a.id === albumId ? { ...a, coverImage: normalizedUrl } : a);
    setData(prev => ({
      ...prev,
      albums: nextAlbums
    }));
  };

  const updateAlbumUrl = (albumId: string, url: string) => {
    const nextAlbums = albums.map(a => a.id === albumId ? { ...a, externalUrl: url } : a);
    setData(prev => ({
      ...prev,
      albums: nextAlbums
    }));
  };

  const updateAlbumTitle = (albumId: string, title: string) => {
    const nextAlbums = albums.map(a => a.id === albumId ? { ...a, title } : a);
    setData(prev => ({
      ...prev,
      albums: nextAlbums
    }));
  };

  // 更新首頁英雄橫幅相片
  const updateHeroImage = (url: string) => {
    setData(prev => ({ ...prev, heroImage: normalizeImageUrl(url) }));
  };

  // 更新攤位地圖相片
  const updateBoothMapImage = (url: string) => {
    setData(prev => ({ ...prev, boothMapImage: normalizeImageUrl(url) }));
  };

  // 通用相片檔案上傳轉換為 Base64 DataURL (可直接在本機瀏覽器離線預覽與持久化儲存)
  const uploadImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          resolve(e.target.result);
        } else {
          reject(new Error('讀取檔案失敗'));
        }
      };
      reader.onerror = () => reject(new Error('讀取檔案出錯'));
      reader.readAsDataURL(file);
    });
  };

  // 更新首頁方框按鈕圖片檔
  const updateButtonImage = (key: string, url: string) => {
    const normalizedUrl = normalizeImageUrl(url);
    setData(prev => {
      const existingCard = prev.homeCards?.[key] || DEFAULT_HOME_CARDS[key] || {};
      return {
        ...prev,
        buttonImages: {
          ...(prev.buttonImages || {}),
          [key]: normalizedUrl
        },
        homeCards: {
          ...(prev.homeCards || {}),
          [key]: {
            ...existingCard,
            imageUrl: normalizedUrl
          }
        }
      };
    });
  };

  // 更新首頁卡片自訂設定 (相片、大標題、內文、按鈕文字)
  const updateHomeCard = (key: string, config: Partial<HomeCardConfig>) => {
    setData(prev => {
      const existingCard = prev.homeCards?.[key] || DEFAULT_HOME_CARDS[key] || {};
      const normalizedImageUrl = config.imageUrl !== undefined ? normalizeImageUrl(config.imageUrl) : existingCard.imageUrl;
      const updatedCard: HomeCardConfig = {
        ...existingCard,
        ...config,
        ...(config.imageUrl !== undefined ? { imageUrl: normalizedImageUrl } : {})
      };
      return {
        ...prev,
        homeCards: {
          ...(prev.homeCards || {}),
          [key]: updatedCard
        },
        buttonImages: {
          ...(prev.buttonImages || {}),
          ...(config.imageUrl !== undefined ? { [key]: normalizedImageUrl || '' } : {})
        }
      };
    });
  };

  // 還原個別卡片為預設圖文設定
  const resetHomeCard = (key: string) => {
    const defaultConf = DEFAULT_HOME_CARDS[key];
    if (defaultConf) {
      updateHomeCard(key, defaultConf);
    }
  };

  // 重設為預設官方資料
  const resetToDefault = () => {
    setData(INITIAL_DATA);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
      localStorage.removeItem(ALBUMS_STORAGE_KEY);
      localStorage.removeItem(LEGACY_ALBUMS_STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // 匯出 JSON
  const exportDataJson = () => {
    return JSON.stringify(data, null, 2);
  };

  // 匯入 JSON
  const importDataJson = (jsonString: string): boolean => {
    try {
      const sanitized = jsonString.replace(/102th/g, '102nd');
      const parsed = JSON.parse(sanitized);
      if (parsed && parsed.activities && parsed.schedules && parsed.honorRoll) {
        if (!parsed.liveNews) parsed.liveNews = INITIAL_DATA.liveNews || [];
        if (!parsed.weekActivities) parsed.weekActivities = INITIAL_DATA.weekActivities || [];
        if (!parsed.boothCategories) parsed.boothCategories = DEFAULT_BOOTH_CATEGORIES;
        setData(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON', e);
    }
    return false;
  };

  const heroImage = (data.heroImage && data.heroImage !== '/src/assets/images/hero_kghs_celebration_1792325750838.jpg')
    ? data.heroImage
    : (INITIAL_DATA.heroImage || '/assets/aistudio/image_a4c5d4ff.png');
  const boothMapImage = data.boothMapImage || BOOTH_MAP_IMAGE;

  return (
    <AppContext.Provider
      value={{
        data,
        officialAlbums: albums,
        boothMapImage,
        heroImage,
        currentRoute,
        navigateTo,
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
        previewImage,
        openImagePreview,
        closeImagePreview,
        isAdminLoggedIn,
        sessionToken,
        sessionExpiresAt,
        hasCustomPassword: Boolean(customPassword),
        defaultAdminPassword: DEFAULT_ADMIN_PASSWORD,
        login,
        logout,
        changePassword,
        resetPasswordToDefault,
        updateAnnouncement,
        addActivity,
        updateActivity,
        deleteActivity,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        addCheckinSchedule,
        updateCheckinSchedule,
        deleteCheckinSchedule,
        addHonorItem,
        updateHonorItem,
        deleteHonorItem,
        addAwardToEvent,
        updateAwardInEvent,
        deleteAwardFromEvent,
        addInterview,
        updateInterview,
        deleteInterview,
        addLiveNews,
        updateLiveNews,
        deleteLiveNews,
        addWeekActivity,
        updateWeekActivity,
        deleteWeekActivity,
        addBooth,
        updateBooth,
        deleteBooth,
        batchUpdateBoothCategories,
        boothCategories,
        addBoothCategory,
        updateBoothCategory,
        deleteBoothCategory,
        resetBoothCategories,
        updateButtonImage,
        updateHomeCard,
        resetHomeCard,
        updateHeroImage,
        updateBoothMapImage,
        updateAlbumCover,
        updateAlbumUrl,
        updateAlbumTitle,
        uploadImageFile,
        resetToDefault,
        exportDataJson,
        importDataJson,
        restoreDraftBackup,
        firebaseUser,
        loginWithGoogle,
        isFirebaseConnected,
        cloudSyncedAt,
        isCloudSyncing,
        pushToCloud,
        refreshFromCloud
      }}
    >
      {children}
    </AppContext.Provider>
  );
};


export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
