import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';

export const ImageModal: React.FC = () => {
  const { previewImage, closeImagePreview } = useApp();
  const [scale, setScale] = useState(1);

  if (!previewImage) return null;

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.75));
  const handleReset = () => setScale(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 bg-[#09013d]/95 backdrop-blur-md animate-in fade-in duration-200">
      {/* 頂部操作列 (Midnight Navy + Vanilla Cream Bar) */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between text-[#fbf9f2] z-10 pointer-events-auto bg-[#09013d]/85 border-b border-[#325291]/40 px-4 sm:px-6 py-3">
        <div className="max-w-[65%] sm:max-w-md">
          <h3 className="text-xs sm:text-sm font-semibold text-[#fbf3c9] truncate">{previewImage.title}</h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZoomIn}
            aria-label="放大"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#cff0eb] hover:text-white hover:bg-[#325291]/40 active:scale-95 transition-all cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            aria-label="縮小"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#cff0eb] hover:text-white hover:bg-[#325291]/40 active:scale-95 transition-all cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            aria-label="重設縮放"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#cff0eb] hover:text-white hover:bg-[#325291]/40 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <a
            href={previewImage.url}
            download={`${previewImage.title}.jpg`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="下載圖片"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#cff0eb] hover:text-white hover:bg-[#325291]/40 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={closeImagePreview}
            aria-label="關閉預覽"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[#325291] text-[#fbf3c9] hover:bg-[#253f70] active:scale-95 transition-all cursor-pointer shadow-xs ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 圖片展示主體 */}
      <div
        className="w-full h-full flex items-center justify-center p-4 pt-16 pb-8 overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onClick={closeImagePreview}
      >
        <img
          src={previewImage.url}
          alt={previewImage.title}
          onClick={(e) => e.stopPropagation()}
          style={{ transform: `scale(${scale})` }}
          className="max-w-[95%] max-h-[85vh] object-contain transition-transform duration-200 rounded-none shadow-2xl"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* 底部輔助提示 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#09013d]/80 border border-[#325291]/40 rounded-full text-[11px] text-[#cff0eb] pointer-events-none backdrop-blur-xs">
        可使用上方按鈕縮放檢視，或點擊任意空白處關閉
      </div>
    </div>
  );
};
