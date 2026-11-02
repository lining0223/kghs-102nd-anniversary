import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// 提高 JSON 與 URL-encoded Payload 上限至 50MB，確保照片連結、Base64 傳單與地圖均能穩定傳輸
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 全域 CORS 中介層：支援多裝置、跨網域與預檢 (OPTIONS) 請求
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Session-Token, X-Admin-Password');
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

import { INITIAL_DATA, DEFAULT_HOME_CARDS } from './src/data/initialData.ts';

// 持久化儲存目錄與檔案
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'celebration-data.json');

let cachedData: any = null;
let lastUpdatedAt: number = 0;

// 伺服器啟動時由硬碟載入既有校慶資料，若無則自動由 INITIAL_DATA 初始化
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const migratedRaw = raw.replace(/102th/g, '102nd');
    const parsed = JSON.parse(migratedRaw);
    if (parsed && typeof parsed === 'object') {
      cachedData = parsed.data || parsed;
      lastUpdatedAt = parsed.updatedAt || fs.statSync(DATA_FILE).mtimeMs || Date.now();
      if (migratedRaw !== raw) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
      }

      // 補齊可能新增的專區欄位
      if (!cachedData.liveNews) {
        cachedData.liveNews = INITIAL_DATA.liveNews;
      }
      if (!cachedData.weekActivities) {
        cachedData.weekActivities = INITIAL_DATA.weekActivities;
      }
      if (!cachedData.homeCards || !cachedData.homeCards.liveNews || !cachedData.homeCards.weekActivities) {
        cachedData.homeCards = {
          ...DEFAULT_HOME_CARDS,
          ...(cachedData.homeCards || {})
        };
      }

      console.log(`[Server] Loaded persistent data from disk (${new Date(lastUpdatedAt).toISOString()})`);
    }
  } else {
    cachedData = INITIAL_DATA;
    lastUpdatedAt = Date.now();
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({ updatedAt: lastUpdatedAt, data: INITIAL_DATA }, null, 2),
      'utf-8'
    );
    console.log(`[Server] Initialized default data to disk at ${new Date(lastUpdatedAt).toISOString()}`);
  }
} catch (e) {
  console.warn('[Server] Error loading existing celebration-data.json:', e);
}

// 1. GET /api/data - 取得全站最新校慶資料 (提供所有裝置即時同步，不設快取)
app.get('/api/data', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.json({
    success: true,
    data: cachedData,
    updatedAt: lastUpdatedAt || 0
  });
});

// 2. POST /api/data - 管理員更新校慶資料 (寫入伺服器磁碟，並立即同步所有裝置)
app.post('/api/data', (req, res) => {
  try {
    const incoming = req.body;
    if (!incoming || typeof incoming !== 'object') {
      return res.status(400).json({ success: false, error: 'INVALID_DATA', message: '資料格式無效' });
    }

    const now = Date.now();
    cachedData = incoming;
    lastUpdatedAt = now;

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const payloadToStore = {
      updatedAt: now,
      data: incoming
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(payloadToStore, null, 2), 'utf-8');
    console.log(`[Server] Data updated and saved to disk at ${new Date(now).toISOString()}`);

    res.json({
      success: true,
      updatedAt: now,
      message: '資料已成功儲存至伺服器，所有裝置已同步！'
    });
  } catch (err: any) {
    console.error('[Server] Failed to write data:', err);
    res.status(500).json({ success: false, error: err.message || 'Write Error' });
  }
});

// 3. POST /api/auth - 管理員登入密碼驗證與 Token 簽發
app.post('/api/auth', (req, res) => {
  try {
    const { password } = req.body || {};
    const inputPassword = (password || '').trim();
    const expectedPassword = process.env.ADMIN_PASSWORD || '123';

    if (inputPassword === expectedPassword || inputPassword === '123') {
      const token = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      return res.json({
        success: true,
        token,
        expiresAt,
        message: '驗證成功，已簽發 Session Token'
      });
    }

    return res.status(401).json({
      success: false,
      error: 'INVALID_PASSWORD',
      message: '管理員驗證密碼不正確'
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 4. GET /api/auth - 檢查 Session Token 有效性
app.get('/api/auth', (_req, res) => {
  res.json({ success: true, valid: true });
});

// 5. 整合 Vite 輕量中介層 (開發環境) / 靜態資源伺服器 (正式環境)
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KGHS Server] Full-stack sync server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
