import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronDown,
  ChevronUp,
  Flame,
  Calendar,
  Trophy,
  Newspaper,
  Image as ImageIcon,
  Store,
  ArrowRight,
  Zap,
  Sparkles
} from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { DEFAULT_HOME_CARDS } from '../data/initialData';

export const HomePage: React.FC = () => {
  const { data, navigateTo, boothMapImage } = useApp();
  const { buttonImages } = data;

  // Accordion 展開狀態
  const [isSportsOpen, setIsSportsOpen] = useState(true);
  const [isFairOpen, setIsFairOpen] = useState(true);

  const sportsCards = [
    {
      key: 'activities',
      title: '賽事活動簡介',
      desc: '田徑、拔河與趣味競賽詳情',
      icon: Flame,
      route: 'activities'
    },
    {
      key: 'schedule',
      title: '賽程',
      desc: '運動會與檢錄精準時間表',
      icon: Calendar,
      route: 'schedule'
    },
    {
      key: 'honor',
      title: '榮譽榜',
      desc: '各項決賽成績與得獎名單',
      icon: Trophy,
      route: 'honor'
    },
    {
      key: 'liveNews',
      title: '現場快報',
      desc: '第一時間掌握賽場即時花絮與精彩速報',
      icon: Zap,
      route: 'livenews'
    },
    {
      key: 'weekActivities',
      title: '校慶週活動',
      desc: '系列主題慶祝活動與特色展覽時程',
      icon: Sparkles,
      route: 'weekactivities'
    },
    {
      key: 'interviews',
      title: '採訪',
      desc: '選手專訪與班級熱血心路',
      icon: Newspaper,
      route: 'interviews'
    },
    {
      key: 'albums',
      title: '相簿',
      desc: '雲端高畫質相片連結回顧',
      icon: ImageIcon,
      route: 'albums'
    }
  ];

  return (
    <div className="space-y-0 animate-in fade-in duration-300 w-full">
      {/* 英雄旗艦視覺 (Hero Showcase - 直角、貼齊邊緣與零空隙) */}
      <PageHero
        title="102nd 雄女校慶"
        showBack={false}
        className="rounded-none m-0 border-x-0 border-t-0 border-b border-[#325291]/35 shadow-none"
      />

      {/* 
        專區 1: 11/6 運動會 (直角、無邊緣空隙)
      */}
      <section className="bg-white rounded-none border-b border-[#e5decb] border-t-0 border-x-0 shadow-none overflow-hidden transition-all w-full">
        {/* 區塊標題列 (Accordion Header) */}
        <button
          onClick={() => setIsSportsOpen(prev => !prev)}
          className="w-full text-left hover:bg-[#fbf9f2] transition-colors cursor-pointer rounded-none"
        >
          <div className="max-w-5xl mx-auto w-full flex items-center justify-between p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-full bg-[#cff0eb] text-[#325291] flex items-center justify-center border border-[#bce4de] shadow-2xs shrink-0">
                <Flame className="w-5 h-5 text-[#325291]" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#325291] font-bold block truncate">
                  Sports Day · 2026.11.06
                </span>
                <span className="text-base sm:text-xl font-semibold text-[#09013d] tracking-tight truncate block">
                  11/6 運動會專區
                </span>
              </div>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#fbf3c9] hover:bg-[#f6ecb3] flex items-center justify-center text-[#09013d] transition-colors shrink-0">
              {isSportsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* 摺疊內容 (5 大功能卡片) */}
        {isSportsOpen && (
          <div className="border-t border-[#e5decb]/70 animate-in fade-in duration-200">
            <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-4 sm:pt-6">
                {sportsCards.map((card) => {
                  const cardConfig = data.homeCards?.[card.key];
                  const defaultConfig = DEFAULT_HOME_CARDS[card.key];
                  const title = cardConfig?.title || card.title;
                  const desc = cardConfig?.desc || card.desc;
                  const buttonText = cardConfig?.buttonText || '查看活動';
                  const imageUrl = cardConfig?.imageUrl || data.buttonImages?.[card.key] || defaultConfig?.imageUrl || '/src/assets/images/hero_kghs_celebration_1792325750838.jpg';

                  return (
                    <div
                      key={card.key}
                      onClick={() => navigateTo(card.route)}
                      className="group flex flex-col rounded-3xl border border-[#e5decb] bg-[#fbf9f2] overflow-hidden hover:border-[#325291]/50 hover:shadow-md transition-all duration-300 cursor-pointer text-left select-none"
                    >
                      {/* 上方相片 (Photo on Top) */}
                      <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-[#e9e5db]">
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                      </div>

                      {/* 下方資訊區 (Headline + Description + Pill Outline Button) */}
                      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between bg-[#fbf9f2]">
                        <div className="mb-5 sm:mb-6">
                          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#09013d] leading-snug group-hover:text-[#325291] transition-colors mb-2.5">
                            {title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#73685e] leading-relaxed font-normal">
                            {desc}
                          </p>
                        </div>

                        <div>
                          <span
                            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-[#342d27] text-xs font-semibold text-[#342d27] group-hover:bg-[#09013d] group-hover:text-[#fbf3c9] group-hover:border-[#09013d] uppercase tracking-wider transition-colors shadow-2xs"
                          >
                            {buttonText}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 
        專區 2: 11/7 園遊會 (直角、無邊緣空隙)
      */}
      <section className="bg-white rounded-none border-b-0 border-t-0 border-x-0 shadow-none overflow-hidden transition-all w-full">
        {/* 區塊標題列 (Accordion Header) */}
        <button
          onClick={() => setIsFairOpen(prev => !prev)}
          className="w-full text-left hover:bg-[#fbf9f2] transition-colors cursor-pointer rounded-none"
        >
          <div className="max-w-5xl mx-auto w-full flex items-center justify-between p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-full bg-[#fbf3c9] text-[#325291] flex items-center justify-center border border-[#edd995] shadow-2xs shrink-0">
                <Store className="w-5 h-5 text-[#325291]" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#325291] font-bold block truncate">
                  Fair & Stalls · 2026.11.07
                </span>
                <span className="text-base sm:text-xl font-semibold text-[#09013d] tracking-tight truncate block">
                  11/7 園遊會專區
                </span>
              </div>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#cff0eb] hover:bg-[#bce6df] flex items-center justify-center text-[#09013d] transition-colors shrink-0">
              {isFairOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* 摺疊內容 (攤位分布圖預覽區塊 + 各班攤位入口) */}
        {isFairOpen && (
          <div className="border-t border-[#e5decb]/70 animate-in fade-in duration-200">
            <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 pt-0 space-y-5 sm:space-y-6">
              {/* 攤位分布圖預覽區塊 */}
              <div className="pt-4 sm:pt-5 space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-bold text-[#09013d] flex items-center min-w-0 truncate">
                    <span className="truncate">園遊會校園攤位分布地圖</span>
                  </span>
                </div>

                {/* 地圖相片：隨本身長寬比縮放，不可切割或變形，寬邊比照手機畫面寬邊 (具適當間隔) */}
                <div className="w-full overflow-hidden rounded-none border border-[#e5decb] bg-[#fbf3c9]/30 shadow-2xs">
                  <img
                    src={boothMapImage}
                    alt="園遊會攤位分布圖"
                    className="w-full h-auto block select-none mx-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* 各班攤位一覽入口卡片 (與設計圖一致的質感排版) */}
              <div className="pt-2 pb-2">
                {(() => {
                  const cardConfig = data.homeCards?.booths;
                  const defaultConfig = DEFAULT_HOME_CARDS.booths;
                  const title = cardConfig?.title || '各班攤位一覽';
                  const desc = cardConfig?.desc || '探索 11/7 園遊會全校各班美食甜點、清涼冷飲與文創娛樂攤位傳單海報與品項分類。';
                  const buttonText = cardConfig?.buttonText || '立即瀏覽各班攤位';
                  const imageUrl = cardConfig?.imageUrl || data.buttonImages?.booths || defaultConfig.imageUrl || '/src/assets/images/fair_food_flyer_1792325751416.jpg';

                  return (
                    <div
                      onClick={() => navigateTo('booths')}
                      className="group flex flex-col md:flex-row rounded-3xl border border-[#e5decb] bg-[#fbf9f2] overflow-hidden hover:border-[#325291]/50 hover:shadow-md transition-all duration-300 cursor-pointer text-left select-none"
                    >
                      <div className="relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden bg-[#e9e5db] min-h-[220px]">
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                      </div>

                      <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between bg-[#fbf9f2]">
                        <div className="mb-6">
                          <div className="text-[10px] sm:text-xs font-bold text-[#325291] uppercase tracking-widest mb-2">
                            Fair & Stalls · 2026.11.07
                          </div>
                          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#09013d] leading-snug group-hover:text-[#325291] transition-colors mb-2.5">
                            {title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#73685e] leading-relaxed font-normal">
                            {desc}
                          </p>
                        </div>

                        <div>
                          <span
                            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-[#342d27] text-xs font-semibold text-[#342d27] group-hover:bg-[#09013d] group-hover:text-[#fbf3c9] group-hover:border-[#09013d] uppercase tracking-wider transition-colors shadow-2xs"
                          >
                            {buttonText}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
