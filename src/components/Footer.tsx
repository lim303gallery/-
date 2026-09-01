/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Instagram, Facebook, BookOpen, MapPin, Phone, Mail } from 'lucide-react';
import { GalleryConfig } from '../types.ts';

interface FooterProps {
  config: GalleryConfig;
}

export default function Footer({ config }: FooterProps) {
  const handleSnsClick = (url: string) => {
    if (url) {
      // Clean click redirection helper
      window.open(url, '_blank', 'noreferrer,noopener');
    }
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 py-16 px-6 font-sans border-t border-zinc-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        
        {/* Gallery Title & Brand Statement */}
        <div className="md:col-span-4 text-left space-y-4">
          <div>
            <span 
              className="text-white text-sm font-extrabold block"
              style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.01em' }}
            >
              {config.siteName}
            </span>
            <span 
              className="text-[8px] tracking-[0.18em] text-zinc-500 font-medium uppercase block mt-0.5"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {config.siteSubName}
            </span>
          </div>
          <p className="text-xs text-zinc-500 font-light leading-relaxed max-w-sm">
            {config.siteDescription}
          </p>
          
          {/* Social Network Icons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => handleSnsClick(config.instagram)}
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700/80 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Instagram"
            >
              <Instagram size={14} />
            </button>
            <button
              onClick={() => handleSnsClick(config.facebook)}
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700/80 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Facebook"
            >
              <Facebook size={14} />
            </button>
            <button
              onClick={() => handleSnsClick(config.naverBlog)}
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700/80 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Naver Blog"
            >
              <BookOpen size={14} />
            </button>
          </div>
        </div>

        {/* Contact info list (4 Columns) */}
        <div className="md:col-span-5 text-left space-y-4">
          <span className="text-white font-bold text-xs tracking-wider uppercase font-sans">Contact & Location</span>
          <div className="space-y-2.5 text-xs text-zinc-500 font-light leading-relaxed">
            <div className="flex items-start space-x-2.5">
              <MapPin size={13} className="text-zinc-600 mt-0.5 shrink-0" />
              <span>주소: {config.address}</span>
            </div>
            <div className="flex items-start space-x-2.5">
              <Phone size={13} className="text-zinc-600 mt-0.5 shrink-0" />
              <span>대표전화: {config.phone}</span>
            </div>
            <div className="flex items-start space-x-2.5">
              <Mail size={13} className="text-zinc-600 mt-0.5 shrink-0" />
              <span>이메일 대관: {config.email}</span>
            </div>
          </div>
        </div>

        {/* Operating Hours (3 Columns) */}
        <div className="md:col-span-3 text-left space-y-4">
          <span className="text-white font-bold text-xs tracking-wider uppercase font-sans">Operating Hours</span>
          <div className="space-y-2 text-xs text-zinc-500 font-light leading-relaxed">
            <p>평일: {config.hoursWeekday}</p>
            <p>주말: {config.hoursWeekend}</p>
            <p className="text-orange-500/80">{config.closedDays}</p>
          </div>
        </div>

      </div>

      {/* Copyright persistent legal rule */}
      <div className="max-w-7xl mx-auto border-t border-zinc-900 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between text-[10px] text-zinc-600 font-mono">
        <div>
          © 2026 {config.siteSubName}. ALL RIGHTS RESERVED.
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0 font-sans">
          <a href="#about" className="hover:text-zinc-400">대관 규약</a>
          <span>•</span>
          <a href="#rental" className="hover:text-zinc-400">개인정보 취급방침</a>
        </div>
      </div>
    </footer>
  );
}
