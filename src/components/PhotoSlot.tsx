import React, { useRef } from 'react';
import { Image as ImageIcon, Camera, Upload, Maximize2, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PhotoSlotProps {
  imageUrl?: string | null;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | 'auto';
  className?: string;
  onUpload?: (dataUrl: string) => void;
  onPreview?: () => void;
  placeholderLabel?: string;
  placeholderHint?: string;
  showChangeButton?: boolean;
  rounded?: string;
}

export const PhotoSlot: React.FC<PhotoSlotProps> = ({
  imageUrl,
  alt,
  aspectRatio = 'square',
  className = '',
  onUpload,
  onPreview,
  placeholderLabel,
  placeholderHint,
  showChangeButton = true,
  rounded = 'rounded-none'
}) => {
  const { uploadImageFile } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultLabel = onUpload ? '點選上傳相片' : '尚未發布相片';
  const defaultHint = onUpload ? '支援 JPG、PNG 或 WebP 影像檔案' : '待管理員或班級上傳後發布';
  const resolvedLabel = placeholderLabel || defaultLabel;
  const resolvedHint = placeholderHint || defaultHint;

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'video':
        return 'aspect-16/9';
      case 'portrait':
        return 'aspect-3/4';
      case 'wide':
        return 'aspect-21/9';
      case 'auto':
      default:
        return '';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      try {
        const dataUrl = await uploadImageFile(file);
        onUpload(dataUrl);
      } catch (err) {
        console.error('Photo upload failed', err);
      }
    }
  };

  const handleTriggerUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const hasValidImage = Boolean(imageUrl && imageUrl.trim().length > 0);

  return (
    <div
      className={`relative group overflow-hidden bg-[#fbf3c9]/30 border border-[#e5decb] transition-all duration-300 ${getAspectClass()} ${rounded} ${className}`}
    >
      {/* 隱藏原生檔案選擇器 (僅在管理端提供 onUpload 時渲染) */}
      {onUpload && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      )}

      {hasValidImage ? (
        <>
          {/* 照片呈現：隨長寬比縮放，不切割不變形 */}
          <img
            src={imageUrl!}
            alt={alt}
            className={`w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02] block mx-auto select-none ${
              onPreview ? 'cursor-pointer' : ''
            }`}
            onClick={onPreview}
            referrerPolicy="no-referrer"
          />

          {/* 浮動操作層 (柔和懸浮交互按鈕) */}
          <div className="absolute inset-0 bg-[#09013d]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex items-center justify-center gap-2 p-3">
            {onPreview && (
              <button
                type="button"
                onClick={onPreview}
                className="pointer-events-auto px-3 py-1.5 bg-[#09013d]/90 text-[#fbf3c9] text-xs font-medium rounded-full shadow-sm hover:bg-[#09013d] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xs border border-[#325291]/50"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#cff0eb]" />
                <span>放大檢視</span>
              </button>
            )}

            {/* 更換相片僅在管理端且傳入 onUpload 時呈現 */}
            {onUpload && showChangeButton && (
              <button
                type="button"
                onClick={handleTriggerUpload}
                className="pointer-events-auto px-3 py-1.5 bg-[#325291]/90 text-[#fbf3c9] text-xs font-medium rounded-full shadow-sm hover:bg-[#325291] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xs border border-[#cff0eb]/40"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#cff0eb]" />
                <span>更換相片</span>
              </button>
            )}
          </div>
        </>
      ) : (
        /* 極簡暖調空白相片佔位器 (訪客端純提示，管理端才具備上傳按鈕) */
        <div
          onClick={onUpload ? handleTriggerUpload : undefined}
          className={`w-full h-full min-h-[160px] flex flex-col items-center justify-center p-6 text-center select-none transition-colors ${
            onUpload ? 'cursor-pointer hover:bg-[#fbf3c9]/50' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-[#cff0eb]/60 text-[#325291] border border-[#bde4dd] flex items-center justify-center mb-3 transition-transform group-hover:scale-105 shadow-2xs">
            {onUpload ? (
              <Camera className="w-5 h-5 text-[#325291]" />
            ) : (
              <ImageIcon className="w-5 h-5 text-[#325291]" />
            )}
          </div>

          <p className="text-xs sm:text-sm font-semibold text-[#09013d] tracking-wide mb-1">
            {resolvedLabel}
          </p>

          <p className="text-[11px] text-[#73685e] max-w-[200px] leading-relaxed mb-3">
            {resolvedHint}
          </p>

          {/* 選擇相片按鈕 (嚴格僅在管理端 onUpload 存在時顯示) */}
          {onUpload && (
            <button
              type="button"
              onClick={handleTriggerUpload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#e5decb] text-[#09013d] text-xs font-semibold rounded-full shadow-2xs hover:bg-[#fbf3c9] hover:border-[#edd995] transition-all cursor-pointer active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-[#325291]" />
              <span>選擇相片</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
