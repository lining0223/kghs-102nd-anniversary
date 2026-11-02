import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles } from 'lucide-react';
import { PageHero } from '../components/PageHero';

export const WeekActivitiesPage: React.FC = () => {
  const { data } = useApp();
  const weekActivities = data.weekActivities || [];

  return (
    <div className="space-y-0 animate-in fade-in duration-300 w-full pb-12">
      {/* 標題與視覺 (直角，和兩邊及上方無間隔) */}
      <PageHero
        title="校慶週活動"
        className="rounded-none m-0 border-x-0 border-t-0 border-b border-[#325291]/35 shadow-none"
      />

      {/* 內容區塊 (排版參照採訪) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {weekActivities.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#e5decb] p-12 text-center text-[#73685e] space-y-2">
            <Sparkles className="w-8 h-8 text-[#325291]/60 mx-auto" />
            <p className="text-xs sm:text-sm font-medium">目前尚無校慶週活動發布</p>
          </div>
        ) : (
          weekActivities.map((act) => {
            const hasImage = Boolean(act.imageUrl && act.imageUrl.trim().length > 0);

            return (
              <article
                key={act.id}
                className="bg-white rounded-3xl border border-[#e5decb] p-6 sm:p-10 shadow-xs hover:border-[#325291]/40 transition-all space-y-6"
              >
                {/* 標題 (左右邊距對稱，到達右邊界後自動換行) */}
                <div className="w-full">
                  <h2 className="w-full text-lg sm:text-2xl font-bold text-[#09013d] leading-snug tracking-tight break-words">
                    {act.title}
                  </h2>
                </div>

                {/* 活動詳情內文 (左右邊距與標題一致對稱，自動換行) */}
                <div className="w-full text-sm sm:text-base text-[#342d27] leading-relaxed whitespace-pre-wrap break-words font-sans">
                  {act.content}
                </div>

                {/* 活動相片 (隨本身長寬比縮放，不可切割或變形，寬邊比照手機畫面寬邊，具適當間隔) */}
                {hasImage && (
                  <div className="pt-2 w-full">
                    <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#e5decb] bg-white shadow-2xs mx-auto">
                      <img
                        src={act.imageUrl!}
                        alt={act.title}
                        className="w-full h-auto block select-none mx-auto"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
