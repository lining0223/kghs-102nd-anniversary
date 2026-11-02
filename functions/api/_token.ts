/**
 * Cloudflare Pages Functions - Session Token 工具
 * 基於標準 Web Crypto API (HMAC-SHA256)，支援 100% 免費 Cloudflare Workers / Pages 邊緣執行環境
 */

export interface TokenPayload {
  role: 'admin';
  iat: number;
  exp: number;
}

export async function createSessionToken(secret: string, expiresInHours = 24): Promise<{ token: string; expiresAt: number }> {
  const expiresAt = Date.now() + expiresInHours * 60 * 60 * 1000;
  const payload: TokenPayload = {
    role: 'admin',
    iat: Date.now(),
    exp: expiresAt,
  };

  const payloadStr = JSON.stringify(payload);
  const encoder = new TextEncoder();
  const data = encoder.encode(payloadStr);

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, data);
  const b64Payload = btoa(payloadStr).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const b64Sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return {
    token: `${b64Payload}.${b64Sig}`,
    expiresAt,
  };
}

export async function verifySessionToken(token: string, secret: string): Promise<{ valid: boolean; payload?: TokenPayload; error?: string }> {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'NO_TOKEN' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'MALFORMED_TOKEN' };
  }

  try {
    const [b64Payload, b64Sig] = parts;
    const jsonStr = atob(b64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(jsonStr) as TokenPayload;

    if (!payload.exp || payload.exp < Date.now()) {
      return { valid: false, error: 'TOKEN_EXPIRED' };
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(jsonStr);
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigStr = atob(b64Sig.replace(/-/g, '+').replace(/_/g, '/'));
    const sigBytes = new Uint8Array(sigStr.length);
    for (let i = 0; i < sigStr.length; i++) {
      sigBytes[i] = sigStr.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, data);
    if (!isValid) {
      return { valid: false, error: 'INVALID_SIGNATURE' };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err?.message || 'VERIFY_FAILED' };
  }
}
