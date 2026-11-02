import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  ClipboardCheck,
  Clock
} from 'lucide-react';
import { PageHero } from '../components/PageHero';

export const SchedulePage: React.FC = () => {
  const { data } = useApp();
  const { schedules = [], checkinSchedules = [] } = data;

  const [activeTab, setActiveTab] = useState<'sports' | 'checkin'>('sports');

  // 運動會賽程依時間排序
  const sportsSchedules = [...schedules].sort((a, b) => a.time.localeCompare(b.time));
  const filteredSports = sportsSchedules;

  // 檢錄賽程
  const sortedCheckins = [...checkinSchedules].sort((a, b) => a.time.localeCompare(b.time));
  const filteredCheckins = sortedCheckins;

  return (
    <div className="space-y-0 animate-in fade-in duration-300 w-full pb-12">
      {/* 標題與視覺 (直角，和兩邊及上方無間隔) */}
      <PageHero
        title="賽程"
        className="rounded-none m-0 border-x-0 border-t-0 border-b border-[#325291]/35 shadow-none"
      />

      {/* 其餘物件維持原樣與間距 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">

      {/* 
        時程分類切換列
      */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* 切換按鈕：運動會時程表 / 檢錄時程表 */}
        <div className="inline-flex p-1 bg-[#fbf3c9] rounded-full self-start border border-[#edd995] shadow-2xs">
          <button
            onClick={() => setActiveTab('sports')}
            className={`px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'sports'
                ? 'bg-[#09013d] text-[#fbf3c9] shadow-xs'
                : 'text-[#325291] hover:text-[#09013d]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>運動會時程 ({sportsSchedules.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('checkin')}
            className={`px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'checkin'
                ? 'bg-[#09013d] text-[#fbf3c9] shadow-xs'
                : 'text-[#325291] hover:text-[#09013d]'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>檢錄時程 ({sortedCheckins.length})</span>
          </button>
        </div>
      </div>

      {/* 
        分頁 1: 運動會時程表 (時間、項目)
      */}
      {activeTab === 'sports' && (
        <section className="bg-white rounded-3xl border border-[#e5decb] shadow-xs overflow-hidden">
          <div className="p-6 sm:p-7 border-b border-[#e5decb]/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#cff0eb] text-[#325291] flex items-center justify-center border border-[#bce4de] shadow-2xs">
                <Clock className="w-5 h-5 text-[#325291]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#09013d]">
                  運動會時程表
                </h2>
              </div>
            </div>
          </div>

          {filteredSports.length === 0 ? (
            <div className="p-12 text-center text-[#73685e] text-xs sm:text-sm">
              查無符合條件的運動會時程
            </div>
          ) : (
            <div className="divide-y divide-[#e5decb]/60">
              {filteredSports.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-6 px-6 sm:px-8 py-4 sm:py-5 hover:bg-[#fbf9f2]/70 transition-colors"
                >
                  {/* 時間 */}
                  <div className="w-20 sm:w-24 shrink-0">
                    <span className="font-mono font-bold text-[#09013d] text-sm sm:text-base tabular-nums bg-[#fbf3c9]/80 px-2.5 py-1 rounded-md border border-[#edd995]">
                      {item.time}
                    </span>
                  </div>

                  {/* 項目 */}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#09013d] text-sm sm:text-base">
                      {item.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 
        分頁 2: 檢錄時程表
      */}
      {activeTab === 'checkin' && (
        <section className="bg-white rounded-3xl border border-[#e5decb] shadow-xs overflow-hidden">
          <div className="p-6 sm:p-7 border-b border-[#e5decb]/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fbf3c9] text-[#325291] flex items-center justify-center border border-[#edd995] shadow-2xs">
                <ClipboardCheck className="w-5 h-5 text-[#325291]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#09013d]">
                  選手檢錄時程表
                </h2>
              </div>
            </div>
          </div>

          {filteredCheckins.length === 0 ? (
            <div className="p-12 text-center text-[#73685e] text-xs sm:text-sm">
              查無符合條件的檢錄時程
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fbf9f2] border-b border-[#e5decb] text-[11px] font-bold text-[#325291] uppercase tracking-wider">
                    <th className="py-3.5 px-6 sm:px-8 w-1/2 sm:w-5/12">項目</th>
                    <th className="py-3.5 px-4 sm:px-6 w-1/4 sm:w-3/12">檢錄時間</th>
                    <th className="py-3.5 px-4 sm:px-6 w-1/4 sm:w-4/12">指定地點</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5decb]/60 text-xs sm:text-sm">
                  {filteredCheckins.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#fbf9f2]/70 transition-colors"
                    >
                      <td className="py-4 px-6 sm:px-8">
                        <span className="font-bold text-[#09013d]">
                          {item.title}
                        </span>
                      </td>

                      <td className="py-4 px-4 sm:px-6">
                        <span className="font-mono font-bold text-[#09013d] tabular-nums bg-[#fbf3c9]/80 px-2 py-0.5 rounded border border-[#edd995]">
                          {item.time}
                        </span>
                      </td>

                      <td className="py-4 px-4 sm:px-6">
                        <span className="text-[#342d27] font-medium">
                          {item.location}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
      </div>
    </div>
  );
};
