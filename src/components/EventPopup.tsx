/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Calendar, Phone, Mail, ArrowRight, Check } from 'lucide-react';
import { GalleryConfig } from '../types.ts';

interface EventPopupProps {
  config: GalleryConfig;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function EventPopup({ config, isOpen: controlledIsOpen, onClose: controlledOnClose }: EventPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [doNotShowToday, setDoNotShowToday] = useState(false);

  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setIsOpen(controlledIsOpen);
      return;
    }

    const hideExpiry = localStorage.getItem('lim303_hide_open_event_popup');
    if (hideExpiry) {
      const expiryTime = parseInt(hideExpiry, 10);
      if (Date.now() < expiryTime) {
        setIsOpen(false);
        return;
      }
    }

    // Show popup shortly after loading for a smooth entry animation
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [controlledIsOpen]);

  const handleClose = () => {
    if (doNotShowToday) {
      // Hide for 24 hours
      const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('lim303_hide_open_event_popup', expiryTime.toString());
    }
    setIsOpen(false);
    if (controlledOnClose) {
      controlledOnClose();
    }
  };

  const handleInquiryClick = () => {
    handleClose();
    setTimeout(() => {
      const el = document.getElementById('contact') || document.getElementById('rental');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-300">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200/80 animate-in zoom-in-95 duration-200"
      >
        {/* Top Accent Header Bar - Refined Warm Gallery Navy / Indigo theme */}
        <div 
          className="relative text-white p-6 sm:p-7 text-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
          }}
        >
          {/* Subtle geometric pattern overlay */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Decorative subtle ambient circle */}
          <div 
            className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl opacity-30 pointer-events-none"
            style={{ backgroundColor: config.pointColor || '#f59e0b' }}
          />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
            aria-label="팝업 닫기"
          >
            <X size={18} />
          </button>

          <div className="relative z-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-white/15 text-amber-200 border border-white/20 mb-3 shadow-2xs">
              <Sparkles size={11} className="text-amber-300" />
              <span>GRAND OPENING EVENT</span>
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5 font-sans">
              오픈이벤트 <span className="text-amber-300">30%</span> 특별 할인
            </h3>

            <p className="text-slate-200 text-xs sm:text-sm font-light tracking-tight">
              {config.siteName} 개관 기념 기간 한정 대관 프로모션
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-5 text-left">
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 sm:p-5 space-y-3.5">
            <div className="flex items-start space-x-3.5">
              <div 
                className="w-5 h-5 rounded-full text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-2xs"
                style={{ backgroundColor: config.pointColor || '#1e293b' }}
              >
                ✓
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">전시 대관료 30% 즉시 할인</h4>
                <p className="text-xs text-slate-600 font-light mt-0.5 leading-relaxed">
                  개관 기념 신규 전시 대관 신청 시 총 대관 비용의 30% 할인 혜택을 적용해 드립니다.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 pt-3 border-t border-slate-200/80">
              <div 
                className="w-5 h-5 rounded-full text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-2xs"
                style={{ backgroundColor: config.pointColor || '#1e293b' }}
              >
                ✓
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">학생 &amp; 졸업 전시 대관 특별가 추가 우대</h4>
                <p className="text-xs text-slate-600 font-light mt-0.5 leading-relaxed">
                  미술대학 학생 및 졸업 전시회는 청년 예술가 지원을 위해 맞춤형 특별가가 별도 제공됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* Contact quick strip */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 font-sans gap-2 px-1">
            <span className="flex items-center space-x-1.5">
              <Phone size={13} className="text-slate-700" />
              <strong className="text-slate-900">유선상담:</strong> {config.phone || '010-8020-5499'}
            </span>
            <span className="flex items-center space-x-1.5">
              <Mail size={13} className="text-slate-700" />
              <strong className="text-slate-900">문의:</strong> {config.email || 'lim303gallery@gmail.com'}
            </span>
          </div>

          {/* Action CTA Button */}
          <button
            type="button"
            onClick={handleInquiryClick}
            className="w-full py-3.5 px-4 text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg cursor-pointer hover:opacity-95"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            }}
          >
            <span>30% 할인 대관 견적 문의하기</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Footer with '오늘 하루 보지 않기' option */}
        <div className="bg-slate-100/90 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={doNotShowToday}
              onChange={(e) => setDoNotShowToday(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-800 cursor-pointer"
            />
            <span className="text-slate-700 text-xs font-medium">오늘 하루 동안 보지 않기</span>
          </label>

          <button
            type="button"
            onClick={handleClose}
            className="text-slate-700 hover:text-slate-950 font-bold px-3 py-1 rounded hover:bg-slate-200 transition-colors cursor-pointer text-xs"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
