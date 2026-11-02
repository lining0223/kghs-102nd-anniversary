import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, KeyRound, ShieldAlert, CheckCircle2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { PageHero } from '../components/PageHero';

export const LoginPage: React.FC = () => {
  const {
    login,
    loginWithGoogle,
    firebaseUser,
    navigateTo,
    isAdminLoggedIn,
    hasCustomPassword,
    defaultAdminPassword
  } = useApp();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await login(password);
      if (success) {
        setError(false);
      } else {
        setError(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 標題與視覺 */}
      <PageHero
        title="管理者登入"
        subtitle="102nd 雄女校慶 管理者後台身份驗證"
      />

      <div className="w-full bg-white rounded-3xl border border-[#e5decb] shadow-xs p-6 sm:p-12">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#cff0eb] text-[#325291] border border-[#bce4de] mx-auto flex items-center justify-center shadow-2xs">
              <Lock className="w-5 h-5 text-[#325291]" />
            </div>
            <h2 className="text-lg font-bold text-[#09013d]">
              管理員專區登入
            </h2>
            <p className="text-xs text-[#73685e] leading-relaxed">
              請輸入管理員密碼以啟用賽事、賽程、榮譽榜、採訪與攤位內容編輯維護
            </p>
          </div>

          {isAdminLoggedIn ? (
            <div className="p-6 bg-[#fbf3c9]/60 border border-[#edd995] rounded-2xl text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-[#09013d] text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#325291]" />
                <span>
                  {firebaseUser
                    ? `已由 Google 帳號 (${firebaseUser.email}) 登入`
                    : '您目前已具有管理員權限'}
                </span>
              </div>
              <p className="text-xs text-[#73685e]">
                Firebase 雲端資料庫已即時連線，所有變更將即時同步至全站所有裝置。
              </p>
              <button
                onClick={() => navigateTo('admin')}
                className="w-full py-2.5 px-4 bg-[#09013d] hover:bg-[#1a1254] text-[#fbf3c9] font-bold text-xs sm:text-sm rounded-full shadow-xs transition-colors cursor-pointer border border-[#325291]/40"
              >
                進入後台控制面板
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Google 快速登入 (Firebase Auth) */}
              <button
                type="button"
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    await loginWithGoogle();
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-white hover:bg-[#fbf9f2] text-[#09013d] font-semibold text-xs sm:text-sm rounded-full transition-all border border-[#e5decb] flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs active:scale-95 disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>使用 Google 帳號登入 (Firebase 雲端同步)</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#e5decb] w-full" />
                <span className="bg-white px-3 text-[11px] text-[#9c9387] shrink-0 font-medium">
                  或輸入管理員密碼
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#09013d]">
                      管理員密碼 (Admin Password)
                    </label>
                    {hasCustomPassword && (
                      <span className="text-[10px] text-[#325291] bg-[#cff0eb]/50 px-2 py-0.5 rounded-full font-medium">
                        已啟用自訂密碼
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#325291] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(false);
                      }}
                      placeholder={hasCustomPassword ? '請輸入管理員自訂密碼' : `請輸入管理員密碼 (預設: ${defaultAdminPassword})`}
                      className="w-full pl-10 pr-10 py-2.5 bg-[#fbf9f2] border border-[#e5decb] rounded-full text-sm text-[#09013d] placeholder-[#9c9387] focus:outline-none focus:border-[#325291] transition-colors"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#73685e] hover:text-[#09013d] transition-colors cursor-pointer"
                      title={showPassword ? '隱藏密碼' : '顯示密碼'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-[#fbeeed] border border-[#ebd0ce] rounded-xl text-[#843229] text-xs flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#843229] shrink-0" />
                    <span>
                      {hasCustomPassword
                        ? '密碼錯誤，請確認您先前自訂的管理員密碼。'
                        : `密碼錯誤，請確認系統預設管理員密碼 (${defaultAdminPassword})。`}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-[#09013d] hover:bg-[#1a1254] disabled:opacity-70 text-[#fbf3c9] font-bold text-sm rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 border border-[#325291]/40"
                >
                  <Lock className="w-4 h-4 text-[#cff0eb]" />
                  <span>{isSubmitting ? '驗證中...' : '密碼驗證並登入後台'}</span>
                </button>
              </form>
            </div>
          )}

          <div className="pt-2 border-t border-[#e5decb]/60 flex items-center justify-between text-xs text-[#73685e]">
            <button
              onClick={() => navigateTo('home')}
              className="hover:text-[#09013d] inline-flex items-center gap-1 cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>返回前台首頁</span>
            </button>
            <span className="text-[11px] font-mono text-[#325291]">
              {hasCustomPassword ? '（已設定自訂密碼）' : `預設密碼: ${defaultAdminPassword}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
