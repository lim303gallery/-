/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, User, ArrowUpRight, X, Lock, Unlock, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';
import { GalleryConfig, ExhibitionPost } from '../types.ts';

interface ExhibitionsProps {
  config: GalleryConfig;
  posts: ExhibitionPost[];
  isUnlocked?: boolean;
  onUnlockChange?: (unlocked: boolean) => void;
}

type TabType = 'all' | 'current' | 'upcoming' | 'past' | 'notice';

export default function Exhibitions({ config, posts, isUnlocked: externalUnlocked, onUnlockChange }: ExhibitionsProps) {
  const [internalUnlocked, setInternalUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('lim303_exhibitions_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const isUnlocked = externalUnlocked !== undefined ? externalUnlocked : internalUnlocked;

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedTab, setSelectedTab] = useState<TabType>('all');
  const [selectedPost, setSelectedPost] = useState<ExhibitionPost | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const targetPassword = config.adminPassword || '0821';
    if (passwordInput.trim() === targetPassword.trim()) {
      setInternalUnlocked(true);
      if (onUnlockChange) onUnlockChange(true);
      try {
        sessionStorage.setItem('lim303_exhibitions_unlocked', 'true');
      } catch {
        // ignore
      }
      setPasswordInput('');
    } else {
      setAuthError('비밀번호가 올바르지 않습니다.');
    }
  };

  const handleLock = () => {
    setInternalUnlocked(false);
    if (onUnlockChange) onUnlockChange(false);
    try {
      sessionStorage.removeItem('lim303_exhibitions_unlocked');
    } catch {
      // ignore
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'all', label: '전체' },
    { id: 'current', label: '현재 전시' },
    { id: 'upcoming', label: '예정 전시' },
    { id: 'past', label: '지난 전시' },
    { id: 'notice', label: '공지사항' },
  ];

  const filteredPosts = posts.filter((post) => {
    if (selectedTab === 'all') return true;
    return post.category === selectedTab;
  });

  const getCardStyleClass = () => {
    switch (config.cardStyle) {
      case 'bordered':
        return 'luxury-card border-neutral-200 bg-white';
      case 'shadowed':
        return 'bg-white shadow-md hover:shadow-xl border border-[var(--point-color)]/25';
      case 'minimal':
      default:
        return 'bg-[#FCFAF7] hover:bg-white border border-neutral-200/60 hover:border-[var(--point-color)] rounded-none hover:shadow-md';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'current': return '전시 중';
      case 'upcoming': return '예정 전시';
      case 'past': return '지난 전시';
      case 'notice': return '공지사항';
      default: return '';
    }
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'current':
        return { text: 'text-emerald-700', bg: 'bg-emerald-50 border border-emerald-200/50' };
      case 'upcoming':
        return { text: 'text-amber-700', bg: 'bg-amber-50 border border-amber-200/50' };
      case 'past':
        return { text: 'text-zinc-500', bg: 'bg-zinc-100' };
      case 'notice':
        return { text: 'text-blue-700', bg: 'bg-blue-50 border border-blue-200/50' };
      default:
        return { text: 'text-zinc-800', bg: 'bg-zinc-50' };
    }
  };

  return (
    <section id="exhibitions" className="py-24 bg-neutral-50 border-b border-zinc-100 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 mb-3">
            <span 
              className="text-xs uppercase tracking-[0.35em] font-medium font-display block"
              style={{ color: config.pointColor }}
            >
              Exhibitions & Notices
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700 font-semibold tracking-wider flex items-center space-x-1">
              <Lock size={10} className="inline mr-0.5" />
              <span>관리자 전용</span>
            </span>
          </div>
          <h2 
            className="text-3xl md:text-4xl font-bold md:font-semibold tracking-tight text-zinc-950 mb-4"
            style={{ fontFamily: config.fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)' }}
          >
            전시 및 안내 소식
          </h2>
          <div 
            className="w-12 h-[2px] mx-auto opacity-70"
            style={{ backgroundColor: config.pointColor }}
          />
        </div>

        {/* LOCKED STATE (When not authenticated) */}
        {!isUnlocked ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-neutral-200/80 p-8 md:p-10 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-5 text-zinc-700">
              <KeyRound size={26} style={{ color: config.pointColor }} />
            </div>
            
            <h3 
              className="text-lg font-bold text-zinc-900 mb-2"
              style={{ fontFamily: config.fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)' }}
            >
              관리자 전용 열람 구역
            </h3>
            <p className="text-xs text-zinc-500 font-light leading-relaxed mb-6">
              현재 기획 전시 및 공지 소식은 갤러리 관리자 인증 후 열람하실 수 있습니다. 비밀번호를 입력해 주세요.
            </p>

            <form onSubmit={handleUnlock} className="space-y-4 text-left">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="비밀번호 입력"
                  className="w-full text-zinc-900 py-2.5 px-4 text-sm bg-zinc-50 border border-zinc-250 rounded-xl focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="flex items-center space-x-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-bold text-white shadow-xs transition-all hover:opacity-90 cursor-pointer flex items-center justify-center space-x-1.5"
                style={{ backgroundColor: config.pointColor }}
              >
                <Unlock size={14} />
                <span>인증 및 열람하기</span>
              </button>
            </form>
          </div>
        ) : (
          /* UNLOCKED STATE (Admin authenticated) */
          <div>
            {/* Top Admin Status Bar */}
            <div className="flex items-center justify-between bg-white border border-neutral-200/80 px-4 py-2.5 rounded-xl mb-8 max-w-4xl mx-auto shadow-xs">
              <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>관리자 인증 완료 (열람 모드)</span>
              </div>
              <button
                onClick={handleLock}
                className="px-3 py-1 text-xs font-semibold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                title="다시 잠그기"
              >
                <Lock size={12} />
                <span>열람 잠금</span>
              </button>
            </div>

            {/* Categories Tab Navigation */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
              {tabs.map((tab) => {
                const isActive = selectedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`px-5 py-2 text-xs font-semibold rounded-full tracking-wider border transition-all cursor-pointer ${
                      isActive
                        ? 'white-text shadow-sm'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:text-zinc-900 hover:border-zinc-300'
                    }`}
                    style={isActive ? { backgroundColor: config.pointColor, borderColor: config.pointColor, color: '#fff' } : undefined}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-zinc-100 max-w-2xl mx-auto">
                <p className="text-zinc-400 text-sm font-light mb-2 font-sans">현재 카테고리에 등록된 항목이 없습니다.</p>
                <p className="text-xs font-mono text-zinc-300">NO EXHIBITIONS LOADED IN THIS CATEGORY</p>
              </div>
            )}

            {/* Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => {
                const pill = getCategoryTheme(post.category);
                return (
                  <article
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className={`group rounded-xl overflow-hidden transition-all duration-300 flex flex-col cursor-pointer ${getCardStyleClass()}`}
                  >
                    {/* Card Thumbnail */}
                    <div className="aspect-4/3 w-full bg-zinc-100 relative overflow-hidden shrink-0 border-b border-zinc-100">
                      <img
                        src={post.imageUrl || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 duration-700"
                        referrerPolicy="no-referrer"
                      />
                      {/* Category overlay label */}
                      <span className={`absolute top-4 left-4 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider ${pill.text} ${pill.bg} shadow-xs`}>
                        {getCategoryLabel(post.category)}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-semibold text-zinc-400 block mb-1 text-left">
                          {post.artist}
                        </span>
                        <h3 
                          className="text-lg font-bold text-zinc-900 group-hover:text-zinc-950 line-clamp-1 mb-2 tracking-tight text-left"
                          style={{ fontFamily: config.fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)' }}
                        >
                          {post.title}
                        </h3>
                        <p className="text-zinc-500 text-xs font-light line-clamp-2 text-justify mb-5 leading-relaxed">
                          {post.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-100 text-[11px] font-mono text-zinc-400 font-sans">
                        <span className="flex items-center space-x-1">
                          <Calendar size={11} />
                          <span>{post.period}</span>
                        </span>
                        <span 
                          className="flex items-center space-x-0.5 group-hover:underline font-bold"
                          style={{ color: config.pointColor }}
                        >
                          <span>보기</span>
                          <ArrowUpRight size={10} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Exhibition Modal Detail View */}
      {selectedPost && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl flex flex-col lg:flex-row shadow-2xl scale-95 animate-in fade-in zoom-in-95 duration-200 border border-zinc-100"
          >
            {/* Modal Image block */}
            <div className="lg:w-1/2 min-h-[250px] lg:min-h-full bg-zinc-150 relative">
              <img 
                src={selectedPost.imageUrl} 
                alt={selectedPost.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 bg-white rounded-lg shadow-md border border-zinc-100 ${getCategoryTheme(selectedPost.category).text}`}>
                {getCategoryLabel(selectedPost.category)}
              </span>
            </div>

            {/* Modal Detail Content */}
            <div className="lg:w-1/2 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start pb-4 border-b border-zinc-100 mb-6">
                  <div>
                    <span className="text-xs font-medium text-zinc-400 tracking-wide uppercase font-sans">
                      {selectedPost.artist}
                    </span>
                    <h3 
                      className="text-2xl font-bold text-zinc-950 tracking-tight mt-1"
                      style={{ fontFamily: config.fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)' }}
                    >
                      {selectedPost.title}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-650 hover:bg-zinc-100 transition-colors cursor-pointer"
                    aria-label="닫기"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="bg-zinc-50 rounded-xl p-4 mb-6 space-y-2.5 text-xs text-zinc-650">
                  <div className="flex items-center space-x-2">
                    <User size={13} className="text-zinc-400" />
                    <span className="font-semibold text-zinc-800">작가:</span>
                    <span>{selectedPost.artist}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={13} className="text-zinc-400" />
                    <span className="font-semibold text-zinc-800">전시 기간:</span>
                    <span>{selectedPost.period}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-xs font-bold text-zinc-800 block uppercase font-sans tracking-wide">Exhibition Overview</span>
                  <p className="text-zinc-650 text-sm leading-relaxed whitespace-pre-wrap text-justify font-sans">
                    {selectedPost.description}
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-zinc-150 mt-8 flex justify-end space-x-2">
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="px-6 py-2.5 text-xs font-semibold bg-zinc-100 text-zinc-750 hover:bg-zinc-200 rounded-lg transition-colors font-sans cursor-pointer"
                >
                  닫기
                </button>
                <a 
                  href="#contact"
                  onClick={() => {
                    setSelectedPost(null);
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 text-xs font-semibold text-white rounded-lg hover:opacity-90 transition-opacity font-sans text-center cursor-pointer"
                  style={{ backgroundColor: config.pointColor }}
                >
                  대관 문의하기
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
