/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { MapPin, Clock, CalendarIcon, Mail, Phone, Upload, Check, ChevronLeft, ChevronRight, Plus, Trash2, Image as ImageIcon, ExternalLink, Navigation } from 'lucide-react';
import { GalleryConfig } from '../types.ts';

interface AboutProps {
  config: GalleryConfig;
  onUpdateConfig?: (updated: GalleryConfig) => void;
  isAdmin?: boolean;
}

export default function About({ config, onUpdateConfig, isAdmin = false }: AboutProps) {
  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // Normalize images array
  const rawImages = config.aboutImages && config.aboutImages.length > 0 
    ? config.aboutImages 
    : [config.aboutImage, config.aboutImage2].filter(Boolean);
  const images = rawImages.length > 0 ? rawImages : ['https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1200'];

  const currentIdx = Math.min(activeImageIndex, images.length - 1);

  const processImageFiles = (files: FileList | File[], mode: 'add' | 'replace' = 'add') => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (validFiles.length === 0) {
      alert('이미지 파일(JPG, PNG, WebP 등)만 업로드할 수 있습니다.');
      return;
    }

    const readPromises = validFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (!result) return resolve('');

          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;
            const maxDim = 2048;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', 0.92));
            } else {
              resolve(result);
            }
          };
          img.onerror = () => resolve(result);
          img.src = result;
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then((compressedList) => {
      const validResults = compressedList.filter(Boolean);
      if (validResults.length === 0) return;

      let updatedImages: string[];
      if (mode === 'replace') {
        updatedImages = [...images];
        updatedImages[currentIdx] = validResults[0];
      } else {
        updatedImages = [...images, ...validResults];
      }

      if (onUpdateConfig) {
        onUpdateConfig({
          ...config,
          aboutImages: updatedImages,
          aboutImage: updatedImages[0] || config.aboutImage,
          aboutImage2: updatedImages[1] || config.aboutImage2,
        });
      }

      if (mode === 'add') {
        setActiveImageIndex(updatedImages.length - 1);
        setUploadNotice(`${validResults.length}장의 사진이 소개란에 추가되었습니다!`);
      } else {
        setUploadNotice('대표 사진이 교체되었습니다!');
      }

      setTimeout(() => setUploadNotice(null), 3000);
    });
  };

  const handleDeleteImage = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length <= 1) {
      alert('최소 1장의 대표 사진이 유지되어야 합니다.');
      return;
    }
    const updated = images.filter((_, idx) => idx !== indexToDelete);
    if (onUpdateConfig) {
      onUpdateConfig({
        ...config,
        aboutImages: updated,
        aboutImage: updated[0] || config.aboutImage,
        aboutImage2: updated[1] || config.aboutImage2,
      });
    }
    if (currentIdx >= updated.length) {
      setActiveImageIndex(Math.max(0, updated.length - 1));
    }
    setUploadNotice('사진이 삭제되었습니다.');
    setTimeout(() => setUploadNotice(null), 2500);
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section id="about" className="py-24 bg-white border-b border-zinc-100 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span 
            className="text-xs uppercase tracking-[0.35em] font-medium font-display block mb-3"
            style={{ color: config.pointColor }}
          >
            Introduction
          </span>
          <h2 
            className="text-3xl md:text-4xl font-bold md:font-semibold tracking-tight text-zinc-950 mb-4"
            style={{ fontFamily: config.fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)' }}
          >
            갤러리 소개
          </h2>
          <div 
            className="w-12 h-[2px] mx-auto opacity-70"
            style={{ backgroundColor: config.pointColor }}
          />
        </div>

        {/* 2-Column Split Details (Text & Visuals) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Gallery Description (Left Column) */}
          <div className="lg:col-span-6 space-y-8">
            <h3 
              className="text-2xl font-semibold md:font-medium text-zinc-900 tracking-tight leading-snug"
              style={{ fontFamily: config.fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)' }}
            >
              어둠을 비추는 고귀한 백색의 사유 방식,<br />
              <span className="underline decoration-dotted decoration-zinc-300 underline-offset-8 decoration-2 text-zinc-950">
                그곳이 바로 {config.siteName}입니다.
              </span>
            </h3>

            <p className="text-zinc-600 leading-relaxed font-light text-md text-justify whitespace-pre-wrap">
              {config.aboutText}
            </p>

            {/* Premium Info Panel */}
            <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-6 md:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3 text-sm">
                  <MapPin className="text-zinc-400 mt-0.5 shrink-0" size={16} />
                  <div>
                    <span className="font-bold text-zinc-800 block mb-0.5">위치 안내</span>
                    <span className="text-zinc-700 font-medium">{config.address}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0 pl-7 sm:pl-0">
                  <a
                    href={`https://map.naver.com/p/search/${encodeURIComponent(config.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center space-x-1 transition-colors"
                  >
                    <span>네이버지도</span>
                    <ExternalLink size={11} />
                  </a>
                  <a
                    href={`https://map.kakao.com/link/search/${encodeURIComponent(config.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 text-[11px] font-semibold bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 rounded-lg flex items-center space-x-1 transition-colors"
                  >
                    <span>카카오맵</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-200/50">
                <div className="flex items-start space-x-3 text-sm">
                  <Clock className="text-zinc-400 mt-0.5 shrink-0" size={16} />
                  <div>
                    <span className="font-bold text-zinc-800 block mb-0.5">운영 시간</span>
                    <span className="text-zinc-650 block">평일: {config.hoursWeekday}</span>
                    <span className="text-zinc-650 block">주말: {config.hoursWeekend}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-sm">
                  <CalendarIcon className="text-zinc-400 mt-0.5 shrink-0" size={16} />
                  <div>
                    <span className="font-bold text-zinc-800 block mb-0.5">휴관일</span>
                    <span className="text-zinc-650">{config.closedDays}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-200/50">
                <div className="flex items-start space-x-3 text-sm">
                  <Phone className="text-zinc-400 mt-0.5 shrink-0" size={16} />
                  <div>
                    <span className="font-bold text-zinc-800 block mb-0.5">전화번호</span>
                    <span className="text-zinc-650">{config.phone}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-sm">
                  <Mail className="text-zinc-400 mt-0.5 shrink-0" size={16} />
                  <div>
                    <span className="font-bold text-zinc-800 block mb-0.5">이메일 문의</span>
                    <span className="text-zinc-650">{config.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Multi-Photo Interactive Gallery & Specs (Right Column) */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            
            {/* Main Primary Interactive Photo Stage with Drag & Drop (Admin only) */}
            <div 
              className={`prestige-frame w-full shadow-md relative ${isAdmin ? 'group' : ''} transition-all bg-neutral-900 rounded-xl overflow-hidden ${
                isDragging && isAdmin ? 'ring-4 ring-offset-2 ring-zinc-900 scale-[1.01]' : ''
              }`}
              onDragOver={isAdmin ? (e) => { e.preventDefault(); setIsDragging(true); } : undefined}
              onDragLeave={isAdmin ? () => setIsDragging(false) : undefined}
              onDrop={isAdmin ? (e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  processImageFiles(e.dataTransfer.files, 'add');
                }
              } : undefined}
            >
              <div className="w-full aspect-16/10 relative overflow-hidden flex items-center justify-center bg-zinc-950">
                <img 
                  key={currentIdx}
                  src={images[currentIdx]} 
                  alt={`Gallery Representative Photo ${currentIdx + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 block select-none"
                  referrerPolicy="no-referrer"
                />

                {/* Photo index counter badge */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-full border border-white/10 z-10">
                  {currentIdx + 1} / {images.length}
                </div>

                {/* Left/Right Nav Arrows (if more than 1 image) */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 hover:opacity-100 hover:scale-110 z-10 cursor-pointer"
                      title="이전 사진"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 hover:opacity-100 hover:scale-110 z-10 cursor-pointer"
                      title="다음 사진"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Hidden File Inputs (Admin only) */}
                {isAdmin && (
                  <>
                    <input 
                      type="file" 
                      ref={multiFileInputRef} 
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          processImageFiles(e.target.files, 'add');
                        }
                      }} 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                    />
                    <input 
                      type="file" 
                      ref={replaceFileInputRef} 
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          processImageFiles(e.target.files, 'replace');
                        }
                      }} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </>
                )}

                {/* Hover Management Overlay for Direct Multi-Upload (Admin only) */}
                {isAdmin && onUpdateConfig && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 backdrop-blur-[2px] z-20 space-y-2">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => multiFileInputRef.current?.click()}
                        className="px-3.5 py-2 bg-white text-zinc-900 hover:bg-zinc-100 rounded-lg shadow-lg text-xs font-bold flex items-center space-x-1.5 transition-transform hover:scale-105 cursor-pointer"
                      >
                        <Plus size={14} className="text-zinc-700" />
                        <span>사진 여러 장 추가</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => replaceFileInputRef.current?.click()}
                        className="px-3.5 py-2 bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg shadow-lg text-xs font-bold flex items-center space-x-1.5 transition-transform hover:scale-105 cursor-pointer border border-zinc-700"
                      >
                        <Upload size={14} />
                        <span>현재 사진 바꾸기</span>
                      </button>
                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteImage(currentIdx, e)}
                          className="px-3 py-2 bg-red-600/90 text-white hover:bg-red-600 rounded-lg shadow-lg text-xs font-bold flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer"
                          title="현재 사진 삭제"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    <span className="text-[11px] text-white/85 font-medium pt-1">
                      여러 장의 사진 파일을 드래그하여 한 번에 등록할 수 있습니다.
                    </span>
                  </div>
                )}

                {/* Upload Feedback Toast */}
                {uploadNotice && (
                  <div className="absolute bottom-4 left-4 right-4 bg-zinc-900/95 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-xl flex items-center justify-center space-x-2 backdrop-blur-md animate-fade-in z-30 border border-white/10">
                    <Check size={14} className="text-emerald-400" />
                    <span>{uploadNotice}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Strip & Quick Actions */}
            <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-thin">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-12 rounded-md overflow-hidden shrink-0 cursor-pointer border-2 transition-all ${
                    idx === currentIdx 
                      ? 'border-zinc-900 ring-2 ring-zinc-300 scale-105' 
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={imgUrl} 
                    alt={`Thumbnail ${idx + 1}`} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {images.length > 1 && isAdmin && onUpdateConfig && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteImage(idx, e)}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/70 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      title="사진 삭제"
                    >
                      <Trash2 size={9} />
                    </button>
                  )}
                </div>
              ))}

              {/* Add More Photos thumbnail button (Admin only) */}
              {isAdmin && onUpdateConfig && (
                <button
                  type="button"
                  onClick={() => multiFileInputRef.current?.click()}
                  className="w-16 h-12 rounded-md border-2 border-dashed border-zinc-300 hover:border-zinc-500 bg-zinc-50 hover:bg-zinc-100 flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-800 transition-all shrink-0 cursor-pointer text-[10px] font-bold"
                  title="사진 추가하기"
                >
                  <Plus size={14} />
                  <span>추가</span>
                </button>
              )}
            </div>

            {/* SPACE SPECIFICATION Card */}
            <div className="p-5 rounded-xl border border-neutral-200/80 font-mono text-xs text-zinc-700 leading-relaxed bg-[#FCFAF7] border-l-4 shadow-xs" style={{ borderLeftColor: config.pointColor }}>
              <div className="font-bold text-zinc-950 uppercase tracking-wider mb-2 flex items-center space-x-2 text-[11px]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.pointColor }} />
                <span>SPACE SPECIFICATION</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-sans text-xs text-zinc-800">
                <div className="bg-white/80 p-2.5 rounded-lg border border-neutral-200/60">
                  <span className="text-[10px] font-bold text-zinc-400 block uppercase mb-0.5">면적 / 규모</span>
                  <span className="font-semibold">{config.rentalArea || '116㎡ (약 35평)'}</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-lg border border-neutral-200/60">
                  <span className="text-[10px] font-bold text-zinc-400 block uppercase mb-0.5">천장 높이</span>
                  <span className="font-semibold">{config.rentalHeight || '2.6m ~ 4.0m'}</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-lg border border-neutral-200/60">
                  <span className="text-[10px] font-bold text-zinc-400 block uppercase mb-0.5">동시 수용</span>
                  <span className="font-semibold">{config.rentalCapacity || '최대 60명 동시 수용 가능'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
