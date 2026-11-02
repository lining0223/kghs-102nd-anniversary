import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { HonorItem } from '../types';

export const HonorRollPage: React.FC = () => {
  const { data } = useApp();
  const { honorRoll } = data;

  // 儲存已展開的比賽項目 ID（預設全部為摺疊狀態）
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getItemContent = (item: HonorItem): string => {
    if (typeof item.content === 'string') return item.content;
    if (item.awards && Array.isArray(item.awards)) {
      return item.awards.map(a => `${a.rank}：${a.awardee}${a.score ? ` ${a.score}` : ''}`).join('\n');
    }
    return '';
  };

  const filteredHonorRoll = honorRoll;

  return (
    <div className="space-y-0 animate-in fade-in duration-300 w-full pb-12">
      {/* 標題與視覺 (直角，和兩邊及上方無間隔) */}
      <PageHero
        title="榮譽榜"
        className="rounded-none m-0 border-x-0 border-t-0 border-b border-[#325291]/35 shadow-none"
      />

      {/* 其餘物件維持原樣與間距 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">

      {/* 榮譽榜 Accordion 列表 */}
      <div className="bg-white rounded-3xl border border-[#e5decb] shadow-xs overflow-hidden divide-y divide-[#e5decb]/60">
        {filteredHonorRoll.length === 0 ? (
          <div className="p-12 text-center text-[#73685e] text-xs sm:text-sm">
            查無相關比賽項目或得獎資料
          </div>
        ) : (
          filteredHonorRoll.map((event) => {
            const isExpanded = expandedIds[event.id] ?? false;
            const content = getItemContent(event);

            return (
              <div key={event.id} className="transition-all">
                {/* 項目標題 (Accordion 觸發按鈕) */}
                <button
                  onClick={() => toggleExpand(event.id)}
                  className="w-full flex items-center justify-between p-5 sm:p-7 text-left hover:bg-[#fbf9f2]/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#cff0eb] text-[#325291] flex items-center justify-center border border-[#bce4de] shrink-0 shadow-2xs">
                      <Trophy className="w-5 h-5 text-[#325291]" />
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-[#09013d]">
                      {event.eventName}
                    </h2>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-[#fbf3c9] flex items-center justify-center text-[#09013d] shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* 項目內部內容：原汁原味呈現換行與內容 */}
                {isExpanded && (
                  <div className="px-6 sm:px-9 pb-6 pt-2 bg-[#fbf9f2]/70 border-t border-[#e5decb]/60">
                    {content.trim() ? (
                      <div className="text-xs sm:text-sm text-[#342d27] whitespace-pre-wrap leading-relaxed font-sans bg-white p-4 sm:p-5 rounded-2xl border border-[#e5decb] shadow-2xs">
                        {content}
                      </div>
                    ) : (
                      <div className="text-xs text-[#9c9387] italic py-2">
                        尚未填寫得獎內容
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      </div>
    </div>
  );
};
