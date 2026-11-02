import React from 'react';
import { useApp } from '../context/AppContext';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  className?: string;
  showEyebrow?: boolean;
}

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  rightAction,
  className = '',
  showEyebrow = true
}) => {
  const { heroImage, openImagePreview } = useApp();

  return (
    <section
      className={`relative overflow-hidden bg-[#09013d] text-[#fbf9f2] transition-all ${
        className || 'rounded-3xl shadow-sm border border-[#325291]/35 my-2 sm:my-4'
      }`}
    >
      {/* 背景圖片與夜空藍暖調暗幕遮罩 (Midnight Navy #09013d + Deep Indigo Scrim) */}
      <div className="absolute inset-0 z-0">
        {heroImage ? (
          <>
            <img
              src={heroImage}
              alt="高雄女中 102 週年校慶盛況"
              className="w-full h-full object-cover object-center opacity-40 transform scale-102 transition-transform duration-700 ease-out hover:scale-100"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09013d]/95 via-[#09013d]/60 to-[#09013d]/30" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#09013d] via-[#15234f] to-[#325291]" />
        )}
      </div>

      {/* 頂部操作按鈕 (僅外部傳入操作) */}
      {rightAction && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1.5 sm:gap-2">
          {rightAction}
        </div>
      )}

      {/* 標題與引導文案 (左下對齊，大器留白，pt-14 確保手機端與頂部功能按鈕互不遮擋) */}
      <div className="relative z-10 p-5 sm:p-8 md:p-10 pt-14 sm:pt-10 flex flex-col justify-end min-h-[175px] sm:min-h-[220px] max-w-5xl mx-auto w-full">
        <div className="mt-auto max-w-3xl">
          {showEyebrow && (
            <div className="inline-block text-[10px] sm:text-xs tracking-widest uppercase font-semibold text-[#cff0eb] mb-1.5">
              Kaohsiung Girls' Senior High School · 102nd Anniversary
            </div>
          )}

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-medium sm:font-semibold font-signage-maru tracking-normal text-[#fbf3c9] leading-tight text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#d8f0ec] mt-2 font-normal leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
