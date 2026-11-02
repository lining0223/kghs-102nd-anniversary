import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Home,
  Flame,
  CalendarDays,
  Trophy,
  Newspaper,
  Image as ImageIcon,
  Store,
  Zap,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { isSidebarOpen, closeSidebar, currentRoute, navigateTo } = useApp();

  if (!isSidebarOpen) return null;

  const menuItems = [
    { key: 'home', label: '首頁', icon: Home },
    { key: 'activities', label: '賽事活動簡介', icon: Flame },
    { key: 'schedule', label: '賽程表', icon: CalendarDays },
    { key: 'honor', label: '榮譽榜', icon: Trophy },
    { key: 'livenews', label: '現場快報', icon: Zap },
    { key: 'weekactivities', label: '校慶週活動', icon: Sparkles },
    { key: 'interviews', label: '採訪', icon: Newspaper },
    { key: 'albums', label: '相簿', icon: ImageIcon },
    { key: 'booths', label: '各班攤位一覽', icon: Store }
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* 遮罩 Backdrop (Midnight Navy #09013d overlay) */}
      <div
        onClick={closeSidebar}
        className="fixed inset-0 bg-[#09013d]/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* 側邊抽屜 Drawer Container */}
      <div className="relative w-4/5 max-w-xs sm:max-w-sm bg-[#fbf9f2] h-full shadow-2xl flex flex-col z-10 border-r border-[#e5decb] animate-in slide-in-from-left duration-250">
        {/* 抽屜頂部 Header */}
        <div className="p-5 border-b border-[#e5decb] flex items-center justify-between bg-[#fbf3c9]/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#325291] text-white border border-[#233d73] flex items-center justify-center font-bold text-xs tracking-wider shadow-2xs">
              KG
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#09013d] leading-tight">102nd 雄女校慶</h2>
              <p className="text-[11px] text-[#73685e] font-normal">運動會 · 園遊會 官方導航</p>
            </div>
          </div>
          <button
            onClick={closeSidebar}
            aria-label="關閉選單"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#5e544c] hover:text-[#09013d] hover:bg-[#cff0eb]/40 active:scale-95 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 導覽連結清單 Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentRoute === item.key;
            return (
              <button
                key={item.key}
                onClick={() => navigateTo(item.key)}
                className={`w-full min-h-[44px] flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-left transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-[#325291] text-white font-semibold shadow-xs'
                    : 'text-[#342d27] hover:bg-[#cff0eb]/25 hover:text-[#09013d]'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? 'bg-[#09013d] text-[#fbf3c9]' : 'bg-[#fbf3c9] text-[#325291] group-hover:bg-[#cff0eb] group-hover:text-[#09013d]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-medium tracking-tight truncate">{item.label}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
