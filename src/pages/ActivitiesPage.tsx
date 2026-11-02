import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy } from 'lucide-react';
import { PageHero } from '../components/PageHero';

export const ActivitiesPage: React.FC = () => {
  const { data } = useApp();
  const { activities } = data;

  return (
    <div className="space-y-0 animate-in fade-in duration-300 w-full pb-12">
      {/* 標題與視覺 (頂部滿版橫幅) */}
      <PageHero
        title="賽事活動簡介"
        showBack={false}
        className="rounded-none m-0 border-x-0 border-t-0 border-b border-[#325291]/35 shadow-none"
      />

      {/* 
        標題下方內容區：
        1. 與標題有一段距離 (pt-6 sm:pt-8)
        2. 與螢幕邊緣有一段距離 (max-w-5xl mx-auto px-4 sm:px-6 lg:px-8)
      */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* 標題下方的區塊 (白底，以網站底色 #fbf9f2 線條分隔，不加個別圓角框) */}
        <section className="bg-white rounded-3xl border border-[#e5decb] shadow-xs overflow-hidden">
          {activities.length === 0 ? (
            <div className="p-12 text-center text-[#73685e] space-y-2">
              <Trophy className="w-8 h-8 text-[#325291]/60 mx-auto" />
              <p className="text-xs sm:text-sm font-medium">目前尚無賽事活動項目</p>
            </div>
          ) : (
            <div className="divide-y-2 divide-[#fbf9f2]">
              {activities.map((act, index) => {
                const formattedIndex = String(index + 1).padStart(2, '0');

                return (
                  <article
                    key={act.id}
                    className="p-6 sm:p-8 space-y-3 hover:bg-[#fbf9f2]/30 transition-colors"
                  >
                    {/* 項目序號與項目名稱 */}
                    <div className="flex items-baseline gap-3.5">
                      <span className="font-mono text-xs sm:text-sm font-bold text-[#325291] tabular-nums shrink-0 bg-[#cff0eb] px-2.5 py-0.5 rounded-lg border border-[#bce4de]">
                        {formattedIndex}
                      </span>
                      <h2 className="text-base sm:text-lg font-bold text-[#09013d] tracking-tight leading-snug">
                        {act.title}
                      </h2>
                    </div>

                    {/* 詳細內容說明 */}
                    <div className="pl-8 sm:pl-11 text-xs sm:text-sm text-[#342d27] leading-relaxed whitespace-pre-line max-w-3xl">
                      {act.description}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
