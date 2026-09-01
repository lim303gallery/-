/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Lock, Unlock, Eye, HelpCircle } from 'lucide-react';
import { GalleryConfig } from '../types.ts';

interface HeaderProps {
  config: GalleryConfig;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Header({
  config,
  isAdmin,
  setIsAdmin,
  activeSection,
  setActiveSection,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      setIsAdmin(true);
      setShowPasswordPrompt(false);
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError('비밀번호가 올바르지 않습니다. (초기 비밀번호: 1234)');
    }
  };

  const toggleAdminMode = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setShowPasswordPrompt(true);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 border-b ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md py-3 shadow-xs'
            : 'bg-white/60 backdrop-blur-xs py-5'
        }`}
        style={{ borderColor: isScrolled ? `color-mix(in srgb, ${config.pointColor} 30%, transparent)` : `color-mix(in srgb, ${config.pointColor} 10%, transparent)` }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo / Title */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-start group focus:outline-none text-left"
            id="nav-logo"
          >
            <span 
              className="text-sm md:text-base font-extrabold text-zinc-900 group-hover:opacity-75"
              style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.01em' }}
            >
              {config.siteName}
            </span>
            <span 
              className="text-[8px] md:text-[9px] font-medium tracking-[0.18em] text-zinc-400 uppercase -mt-0.5"
              style={{ fontFamily: 'var(--font-inter)' }}
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
                className={`relative py-2 text-zinc-600 hover:text-zinc-900 tracking-wider transition-colors ${
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
          </nav>

          {/* Client / Admin Toggle Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              id="admin-mode-toggle"
              onClick={toggleAdminMode}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider border transition-all ${
                isAdmin
                  ? 'bg-orange-50 text-orange-700 border-orange-200/60 shadow-xs'
                  : 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800 hover:border-zinc-800'
              }`}
            >
              {isAdmin ? (
                <>
                  <Unlock size={12} className="text-orange-600" />
                  <span>관리자 모드 실행 중</span>
                </>
              ) : (
                <>
                  <Lock size={12} className="opacity-80" />
                  <span>관리자 로그인 (1234)</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={toggleAdminMode}
              className={`p-2 rounded-full border transition-colors ${
                isAdmin 
                  ? 'bg-orange-50 text-orange-700 border-orange-200' 
                  : 'bg-zinc-100 text-zinc-700 border-zinc-200'
              }`}
              id="mobile-admin-toggle"
            >
              {isAdmin ? <Unlock size={15} /> : <Lock size={15} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-850 hover:text-zinc-900 bg-zinc-50 rounded-md border border-zinc-100"
              id="mobile-menu-burger"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white/95 backdrop-blur-lg z-50 shadow-2xl p-6 flex flex-col justify-between border-l border-zinc-100 md:hidden">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
              <div className="flex flex-col text-left">
                <span 
                  className="text-sm font-extrabold text-zinc-900"
                  style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.01em' }}
                >
                  {config.siteName}
                </span>
                <span 
                  className="text-[8px] font-medium tracking-[0.18em] text-zinc-400 uppercase -mt-0.5"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {config.siteSubName}
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
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
            <div className="text-xs text-zinc-400 font-mono text-center">
              © 2026 {config.siteSubName}
            </div>
          </div>
        </div>
      )}

      {/* Admin Password Modal Prompt */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-zinc-100 scale-95 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-5">
              <div className="flex items-center space-x-2">
                <Shield size={18} className="text-zinc-900" />
                <h3 className="font-bold text-zinc-950 font-sans tracking-tight">관리자 인증</h3>
              </div>
              <button
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setPassword('');
                  setPasswordError('');
                }}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAdminAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider font-sans">
                  비밀번호 입력 (초기값: 1234)
                </label>
                <input
                  type="password"
                  placeholder="••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-bold py-2.5 px-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:outline-none transition-all font-mono"
                  autoFocus
                />
              </div>

              {passwordError && (
                <p className="text-xs text-red-500 bg-red-50 py-2 px-3 rounded-lg border border-red-100 font-sans-korean">
                  {passwordError}
                </p>
              )}

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordPrompt(false);
                    setPassword('');
                    setPasswordError('');
                  }}
                  className="flex-1 py-2.5 bg-zinc-100 text-zinc-700 font-semibold text-xs rounded-xl hover:bg-zinc-200 transition-colors font-sans"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-white font-semibold text-xs rounded-xl hover:opacity-95 transition-all font-sans"
                  style={{ backgroundColor: config.pointColor }}
                >
                  로그인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
