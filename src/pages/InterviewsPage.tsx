import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquareText } from 'lucide-react';
import { PageHero } from '../components/PageHero';

export const InterviewsPage: React.FC = () => {
  const { data } = useApp();
  const { interviews } = data;

  return (
    <div className="space-y-0 animate-in fade-in duration-300 w-full pb-12">
      {/* 標題與視覺 (直角，和兩邊及上方無間隔) */}
      <PageHero
        title="採訪"
        className="rounded-none m-0 border-x-0 border-t-0 border-b border-[#325291]/35 shadow-none"
      />

      {/* 其餘物件維持原樣與間距 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {interviews.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#e5decb] p-12 text-center text-[#73685e] space-y-2">
            <MessageSquareText className="w-8 h-8 text-[#325291]/60 mx-auto" />
            <p className="text-xs sm:text-sm font-medium">目前尚無採訪內容</p>
          </div>
        ) : (
          interviews.map((iv, index) => {
            const formattedIndex = String(index + 1).padStart(2, '0');
            const hasImage = Boolean(iv.imageUrl && iv.imageUrl.trim().length > 0);

            return (
              <article
                key={iv.id}
                className="bg-white rounded-3xl border border-[#e5decb] p-6 sm:p-10 shadow-xs hover:border-[#325291]/40 transition-all space-y-6"
              >
                {/* 眉標序號與標題 (左右邊距對稱，到達右邊界後自動換行) */}
                <div className="w-full space-y-2">
                  <div className="inline-block text-[11px] font-mono uppercase tracking-widest text-[#325291] font-bold bg-[#cff0eb]/50 px-2.5 py-0.5 rounded-full border border-[#bce4de]">
                    Interview #{formattedIndex}
                  </div>
                  <h2 className="w-full text-lg sm:text-2xl font-bold text-[#09013d] leading-snug tracking-tight break-words">
                    {iv.title}
                  </h2>
                </div>

                {/* 報導內文 (左右邊距與標題一致對稱，自動換行) */}
                <div className="w-full text-sm sm:text-base text-[#342d27] leading-relaxed whitespace-pre-wrap break-words font-sans">
                  {iv.content}
                </div>

                {/* 文章相片 (隨本身長寬比縮放，不可切割或變形，寬邊比照手機畫面寬邊，具適當間隔) */}
                {hasImage && (
                  <div className="pt-2 w-full">
                    <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#e5decb] bg-white shadow-2xs mx-auto">
                      <img
                        src={iv.imageUrl!}
                        alt={iv.title}
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
