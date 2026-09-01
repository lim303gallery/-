/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { GalleryConfig } from '../types.ts';

interface HeaderProps {
  config: GalleryConfig;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Header({
  config,
  activeSection,
  setActiveSection,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { id: 'about', label: '갤러리 소개' },
    { id: 'exhibitions', label: '전시 안내' },
    { id: 'rental', label: '대관 안내' },
    { id: 'contact', label: '대관 문의' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 border-b ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md py-3 shadow-xs'
            : 'bg-white/70 backdrop-blur-xs py-5'
        }`}
        style={{ borderColor: isScrolled ? `color-mix(in srgb, ${config.pointColor} 20%, transparent)` : `color-mix(in srgb, ${config.pointColor} 10%, transparent)` }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo / Title */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-start group focus:outline-none text-left cursor-pointer"
            id="nav-logo"
          >
            <span 
              className="text-sm md:text-base font-extrabold text-zinc-900 group-hover:opacity-75 tracking-tight transition-opacity"
              style={{ fontFamily: config.fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)', letterSpacing: '-0.01em' }}
            >
              {config.siteName}
            </span>
            <span 
              className="text-[8px] md:text-[9px] font-medium tracking-[0.2em] text-zinc-400 uppercase -mt-0.5"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {config.siteSubName}
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10 text-sm font-medium">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative py-2 text-zinc-600 hover:text-zinc-900 tracking-wider transition-colors cursor-pointer ${
                  activeSection === item.id ? 'text-zinc-950 font-semibold' : ''
                }`}
                style={{ fontFamily: 'var(--font-sans)' }}
                id={`nav-${item.id}`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ backgroundColor: config.pointColor }}
                  />
                )}
              </button>
            ))}

            <button
              onClick={() => handleNavClick('contact')}
              className="px-4 py-2 rounded-full text-xs font-semibold text-white tracking-wider transition-all hover:opacity-90 shadow-xs cursor-pointer"
              style={{ backgroundColor: config.pointColor }}
            >
              대관 신청하기
            </button>
          </nav>

          {/* Mobile Menu Icon */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={() => handleNavClick('contact')}
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold text-white tracking-wider shadow-xs"
              style={{ backgroundColor: config.pointColor }}
            >
              문의하기
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-800 hover:text-zinc-950 bg-zinc-50 rounded-md border border-zinc-200"
              id="mobile-menu-burger"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white/95 backdrop-blur-lg z-50 shadow-2xl p-6 flex flex-col justify-between border-l border-zinc-100 md:hidden animate-in slide-in-from-right duration-200">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
              <div className="flex flex-col text-left">
                <span 
                  className="text-sm font-extrabold text-zinc-900"
                  style={{ fontFamily: config.fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)', letterSpacing: '-0.01em' }}
                >
                  {config.siteName}
                </span>
                <span 
                  className="text-[8px] font-medium tracking-[0.18em] text-zinc-400 uppercase -mt-0.5"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {config.siteSubName}
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
                aria-label="메뉴 닫기"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="mt-8 flex flex-col space-y-5 text-md font-medium">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-left py-2 px-3 rounded-lg hover:bg-zinc-50 border-l-2 border-transparent hover:border-zinc-300 text-zinc-700 hover:text-zinc-900 transition-all font-sans"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-zinc-100 space-y-4">
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full py-3 rounded-xl text-center text-xs font-bold text-white shadow-xs"
              style={{ backgroundColor: config.pointColor }}
            >
              대관 신청하기
            </button>
            <div className="text-xs text-zinc-400 font-mono text-center">
              © 2026 {config.siteSubName}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
