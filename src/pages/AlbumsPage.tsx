import React from 'react';
import { useApp } from '../context/AppContext';
import { ExternalLink } from 'lucide-react';
import { PageHero } from '../components/PageHero';

export const AlbumsPage: React.FC = () => {
  const { officialAlbums } = useApp();

  // 僅保留一個超連結，網址預設使用第一個相簿連結（後續可由提供者填入更新）
  const downloadUrl = officialAlbums[0]?.externalUrl || 'https://photos.google.com/';

  return (
    <div className="space-y-0 animate-in fade-in duration-300 w-full pb-12">
      {/* 標題與視覺 (直角，和兩邊及上方無間隔) */}
      <PageHero
        title="相簿"
        showEyebrow={true}
        className="rounded-none m-0 border-x-0 border-t-0 border-b border-[#325291]/35 shadow-none"
      />

      {/* 單一超連結：照片下載專區 (按鈕置於區塊上方，維持垂直長度) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <section className="min-h-[360px] sm:min-h-[460px] flex items-start justify-center pt-2 sm:pt-4 pb-12 sm:pb-20">
          <div className="w-full max-w-2xl">
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 sm:p-5 bg-white border border-[#e5decb] hover:border-[#325291] rounded-2xl text-[#09013d] hover:text-[#325291] font-semibold text-sm sm:text-base transition-all group shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer"
            >
              <span className="tracking-wide">照片下載專區</span>
              <ExternalLink className="w-4 h-4 text-[#325291] shrink-0 ml-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
