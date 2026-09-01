/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { ChevronDown, Upload, Check, Compass, ArrowUpRight } from 'lucide-react';
import { GalleryConfig, ExhibitionPost } from '../types.ts';
import vibrantBlueWatercolor from '../assets/images/vibrant_blue_watercolor_1788156473836.jpg';

interface HeroProps {
  config: GalleryConfig;
  currentExhibit?: ExhibitionPost;
  onExploreClick: () => void;
  onUpdateConfig?: (newConfig: GalleryConfig) => void;
  isAdmin?: boolean;
}

export default function Hero({ config, currentExhibit, onExploreClick, onUpdateConfig, isAdmin = false }: HeroProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // Height determination
  const heightClass = {
    small: 'min-h-[60vh] pt-28 pb-14',
    medium: 'min-h-[85vh] pt-36 pb-20',
    large: 'min-h-[96vh] pt-40 pb-24'
  }[config.heroHeight || 'medium'];

  const handleHeroFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(JPG, PNG, WebP 등)만 업로드할 수 있습니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDim = 2560;
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
          const compressed = canvas.toDataURL('image/jpeg', 0.92);
          if (onUpdateConfig) {
            onUpdateConfig({ 
              ...config, 
              heroBackgroundImage: compressed,
              heroBackgroundMode: 'photo'
            });
          }
        } else {
          if (onUpdateConfig) {
            onUpdateConfig({ 
              ...config, 
              heroBackgroundImage: result,
              heroBackgroundMode: 'photo'
            });
          }
        }
        setUploadNotice('비주얼 배경이 성공적으로 변경되었습니다.');
        setTimeout(() => setUploadNotice(null), 3000);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const isPhotoBg = (config.heroBackgroundMode || 'photo') === 'photo' && config.heroBackgroundImage;

  return (
    <section 
      id="hero" 
      className={`relative w-full ${heightClass} bg-[#FAF8F5] flex flex-col justify-between overflow-hidden border-b border-zinc-200 text-zinc-900 transition-all ${
        isDragging && isAdmin ? 'ring-4 ring-inset ring-zinc-900/30' : ''
      }`}
      onDragOver={isAdmin ? (e) => { e.preventDefault(); setIsDragging(true); } : undefined}
      onDragLeave={isAdmin ? () => setIsDragging(false) : undefined}
      onDrop={isAdmin ? (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleHeroFileUpload(file);
      } : undefined}
    >
      {/* Vibrant Blue Fluid Watercolor Bleed - Fully saturated and filled at the right edge (1/3 width), seamlessly fading toward the left text */}
      <div 
        className="absolute top-0 right-0 bottom-0 w-full md:w-1/2 lg:w-5/12 xl:w-1/3 pointer-events-none overflow-hidden select-none z-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0) 100%)',
          maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0) 100%)',
        }}
      >
        <img 
          src={vibrantBlueWatercolor} 
          alt="Vibrant Blue Watercolor Bleed" 
          className="w-full h-full object-cover object-left opacity-100 mix-blend-multiply filter contrast-[1.08] brightness-[1.0]"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Hidden file input for hero bg upload (Admin only) */}
      {isAdmin && (
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleHeroFileUpload(file);
          }} 
          accept="image/*" 
          className="hidden" 
        />
      )}

      {/* Upload notice toast */}
      {uploadNotice && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-zinc-900 text-white text-xs font-semibold py-2.5 px-4 rounded-full shadow-2xl flex items-center space-x-2 backdrop-blur-md animate-fade-in">
          <Check size={15} className="text-emerald-400" />
          <span>{uploadNotice}</span>
        </div>
      )}
      
      {/* Inner wrapper */}
      <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col justify-center relative z-10">
        <div className="max-w-3xl">
          {/* Subtle Accent Title */}
          <div className="inline-flex items-center space-x-1.5 mb-5 md:mb-6">
            <span 
              className="w-8 h-[1px] md:w-12"
              style={{ backgroundColor: config.pointColor }}
            />
            <span 
              className="text-[10px] md:text-sm font-medium tracking-[0.3em] font-display uppercase"
              style={{ color: config.pointColor }}
            >
              PREMIUM ART RENTAL GALLERY
            </span>
          </div>

          {/* Dynamic Site Name and Slogan */}
          <h1 
            className="text-3xl md:text-5xl font-bold md:font-semibold tracking-tight text-zinc-900 leading-[1.15] mb-6 whitespace-pre-line"
            style={{ fontFamily: config.fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)' }}
          >
            {config.siteName}
          </h1>
          <p className="text-md md:text-xl text-zinc-600 font-light tracking-wide leading-relaxed font-sans mb-10 max-w-2xl">
            {config.siteDescription}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap gap-4 font-sans text-sm">
            <button
              onClick={onExploreClick}
              className="px-8 py-3.5 text-white font-medium text-xs tracking-wider rounded-md hover:shadow-md transition-all uppercase cursor-pointer"
              style={{ backgroundColor: config.pointColor }}
            >
              전시 및 대관 둘러보기
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-8 py-3.5 text-zinc-800 font-medium text-xs tracking-wider rounded-md bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all uppercase cursor-pointer"
            >
              실시간 대관 문의
            </button>
          </div>
        </div>
      </div>

      {/* Featured Artwork Preview (if enabled) under hero */}
      {config.showHeroCurrentExhibition && currentExhibit && (
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 mt-auto hidden lg:block">
          <div className="bg-white/80 backdrop-blur-md accent-border-subtle border-l-4 py-3.5 px-6 max-w-xl inline-flex items-center space-x-4 mb-2 shadow-xs rounded-r-lg border border-zinc-200/50">
            <img 
              src={currentExhibit.imageUrl} 
              alt={currentExhibit.title} 
              className="w-12 h-12 object-cover rounded border border-zinc-100 pointer-events-none"
              referrerPolicy="no-referrer"
            />
            <div className="text-left font-sans">
              <span className="text-[10px] tracking-wider font-bold text-zinc-400 block uppercase mb-1">CURRENT EXHIBITION</span>
              <span className="text-xs font-bold text-zinc-850 block truncate max-w-[280px]">
                {currentExhibit.title}
              </span>
              <span className="text-[10px] text-zinc-500 block truncate">
                {currentExhibit.artist} • {currentExhibit.period}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bounce Button to explore */}
      <div className="w-full flex justify-center pb-6 relative z-10">
        <button 
          onClick={onExploreClick}
          className="p-2 rounded-full border border-zinc-200 bg-white shadow-xs hover:bg-zinc-50 text-zinc-500 hover:text-zinc-800 transition-all animate-bounce"
          aria-label="아래로 스크롤"
        >
          <ChevronDown size={14} />
        </button>
      </div>
    </section>
  );
}

