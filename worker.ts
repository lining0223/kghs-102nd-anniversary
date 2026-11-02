/**
 * Cloudflare Worker Entrypoint
 * 提供 Cloudflare Workers (搭配 Static Assets) 與 Pages 雙重相容性
 * 解決「Variables cannot be added to a Worker that only has static assets」問題
 */
import { onRequestGet as getAuth, onRequestPost as postAuth, onRequestOptions as optionsAuth } from './functions/api/auth';
import { onRequestGet as getData, onRequestPost as postData, onRequestOptions as optionsData } from './functions/api/data';

export interface Env {
  ASSETS?: {
    fetch: (request: Request | string) => Promise<Response>;
  };
  CELEBRATION_KV?: any;
  ADMIN_PASSWORD?: string;
  JWT_SECRET?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. API 路由分發: /api/auth
    if (url.pathname === '/api/auth' || url.pathname.startsWith('/api/auth/')) {
      const context = { request, env };
      if (request.method === 'POST') return postAuth(context as any);
      if (request.method === 'GET') return getAuth(context as any);
      if (request.method === 'OPTIONS') return optionsAuth();
      return new Response('Method Not Allowed', { status: 405 });
    }

    // 2. API 路由分發: /api/data
    if (url.pathname === '/api/data' || url.pathname.startsWith('/api/data/')) {
      const context = { request, env };
      if (request.method === 'GET') return getData(context as any);
      if (request.method === 'POST') return postData(context as any);
      if (request.method === 'OPTIONS') return optionsData();
      return new Response('Method Not Allowed', { status: 405 });
    }

    // 3. 靜態資源 (SPA 前端畫面由 Cloudflare ASSETS 處理)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
