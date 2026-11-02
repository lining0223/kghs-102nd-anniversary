export const Footer: React.FC = () => {
  const credits = [
    { role: '統籌及規劃', team: '雄女訓育組' },
    { role: '文字編輯與採訪', team: '編輯社' },
    { role: '網站架設', team: '資研社' },
    { role: '照片攝影', team: '攝影社' },
    { role: '機動及宣傳', team: '班聯會' }
  ];

  return (
    <footer className="w-full bg-[#09013d] text-[#fbf9f2] border-t border-[#325291]/30 mt-12 py-10 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* 網站標誌與名稱 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#325291] text-white border border-[#233d73] flex items-center justify-center font-bold text-xs tracking-wider shadow-2xs">
                KG
              </div>
              <span className="text-base font-bold text-[#fbf3c9] tracking-tight">
                102nd 雄女校慶官方網站
              </span>
            </div>
            <p className="text-xs text-[#cff0eb]/70 max-w-sm">
              高雄女中 102 週年校慶與運動會／園遊會官方網站
            </p>
          </div>

          {/* 網頁最底下的資訊 (統籌、編輯、架設、攝影、宣傳) */}
          <div className="space-y-2 text-xs text-[#d8f0ec]">
            {credits.map((item, idx) => (
              <div key={idx} className="flex items-baseline gap-1.5">
                <span className="text-[#cff0eb] font-medium">{item.role}：</span>
                <span className="text-[#fbf9f2] font-semibold">{item.team}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
