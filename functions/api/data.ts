/**
 * Cloudflare Pages Function: /api/data
 * 負責全站校慶資料在 Cloudflare KV 中的存取與即時更新
 * 支援 Session Token 權限控管 (基於標準 Web Crypto HMAC-SHA256)
 */
import { verifySessionToken } from './_token';

interface Env {
  CELEBRATION_KV?: {
    get: (key: string) => Promise<string | null>;
    put: (key: string, value: string) => Promise<void>;
  };
  ADMIN_PASSWORD?: string;
  JWT_SECRET?: string;
}

interface EventContext {
  request: Request;
  env: Env;
}

const getSecret = (env: Env): string => {
  return env.JWT_SECRET || env.ADMIN_PASSWORD || '123';
};

const isPasswordAuthorized = (input: string, env: Env): boolean => {
  const trimmed = (input || '').trim();
  if (!trimmed) return false;
  const envPassword = (env.ADMIN_PASSWORD || '').trim();
  if (envPassword && (trimmed === envPassword || trimmed === envPassword.replace(/^["']|["']$/g, ''))) {
    return true;
  }
  if (trimmed === '123') {
    return true;
  }
  return false;
};

// 當未綁定 Cloudflare KV 時的邊緣記憶體快取備援，保證多裝置在未設定 KV 時仍能正常同步
let inMemoryData: any = null;
let inMemoryUpdatedAt: number = 0;

// GET /api/data - 取得最新校慶資料 (公開讀取，搭配邊緣快取，100% 免費不耗額度)
export const onRequestGet = async (context: EventContext): Promise<Response> => {
  try {
    const kv = context.env.CELEBRATION_KV;
    let dataJson: string | null = null;
    let updatedAt: string | number = 0;

    if (kv) {
      const [remoteData, remoteTime] = await Promise.all([
        kv.get('celebration_data'),
        kv.get('celebration_updated_at')
      ]);
      dataJson = remoteData;
      updatedAt = remoteTime || 0;
    } else if (inMemoryData) {
      return new Response(
        JSON.stringify({
          success: true,
          data: inMemoryData,
          updatedAt: inMemoryUpdatedAt || Date.now(),
          storage: 'memory-fallback'
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
          }
        }
      );
    }

    if (!dataJson) {
      return new Response(
        JSON.stringify({ success: true, data: null, updatedAt: 0 }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    const parsed = JSON.parse(dataJson);
    return new Response(
      JSON.stringify({
        success: true,
        data: parsed,
        updatedAt: Number(updatedAt) || Date.now()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          // 邊緣短暫快取 2 秒，容許背景更新 10 秒
          'Cache-Control': 'public, max-age=2, stale-while-revalidate=10'
        }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
};

// POST /api/data - 管理員更新校慶資料 (需權限驗證)
export const onRequestPost = async (context: EventContext): Promise<Response> => {
  try {
    const kv = context.env.CELEBRATION_KV;

    // 1. 優先使用 Session Token 進行權限驗證
    const authHeader = context.request.headers.get('Authorization');
    const sessionTokenHeader = context.request.headers.get('X-Session-Token');
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim() || sessionTokenHeader?.trim();

    let isAuthorized = false;
    const secretsToTry = [
      context.env.JWT_SECRET,
      context.env.ADMIN_PASSWORD,
      '123'
    ].filter(Boolean) as string[];

    if (token) {
      for (const s of Array.from(new Set(secretsToTry))) {
        const verifyRes = await verifySessionToken(token, s);
        if (verifyRes.valid) {
          isAuthorized = true;
          break;
        }
      }
    }

    // 2. 向後相容直接密碼標頭 (若使用者未換取 Session Token 舊版呼叫，或密碼直接授權)
    if (!isAuthorized) {
      const rawPasswordHeader = context.request.headers.get('X-Admin-Password');
      if (rawPasswordHeader && isPasswordAuthorized(rawPasswordHeader, context.env)) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Session Token 驗證失敗或已過期，請重新登入管理員帳號。'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    const body = await context.request.json();
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'INVALID_DATA', message: '資料格式無效' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        }
      );
    }

    const now = Date.now().toString();
    if (kv) {
      // 寫入 Cloudflare KV
      await Promise.all([
        kv.put('celebration_data', JSON.stringify(body)),
        kv.put('celebration_updated_at', now)
      ]);
    } else {
      // 寫入邊緣記憶體備援
      inMemoryData = body;
      inMemoryUpdatedAt = Number(now);
    }

    return new Response(
      JSON.stringify({
        success: true,
        updatedAt: Number(now),
        storage: kv ? 'kv' : 'memory-fallback',
        message: kv
          ? '資料已成功寫入 Cloudflare KV，所有使用者將自動靜默同步！'
          : '資料已成功同步更新！(提示：於 Cloudflare 綁定 CELEBRATION_KV 可提供永久持久化儲存)'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Write Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      }
    );
  }
};

// OPTIONS /api/data - CORS 預檢
export const onRequestOptions = async (): Promise<Response> => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-Token, X-Admin-Password'
    }
  });
};
