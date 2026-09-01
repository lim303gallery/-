/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Sliders, Settings, Plus, Edit, Trash2, X, Check, Globe, Share2, Clipboard, Landmark, Eye, Upload, Image as ImageIcon } from 'lucide-react';
import { GalleryConfig, ExhibitionPost, RentalInquiry } from '../types.ts';
import { INITIAL_CONFIG } from '../data.ts';
import InquiryList from './InquiryList.tsx';

interface CustomizerProps {
  config: GalleryConfig;
  onConfigChange: (updated: GalleryConfig) => void;
  posts: ExhibitionPost[];
  onAddPost: (post: ExhibitionPost) => void;
  onUpdatePost: (post: ExhibitionPost) => void;
  onDeletePost: (id: string) => void;
  inquiries: RentalInquiry[];
  onUpdateInquiryStatus: (id: string, status: 'pending' | 'reviewed' | 'completed') => void;
  onDeleteInquiry: (id: string) => void;
  onClose: () => void;
}

type PanelTab = 'general' | 'design' | 'posts' | 'inquiries' | 'contact' | 'seo';

export default function Customizer({
  config,
  onConfigChange,
  posts,
  onAddPost,
  onUpdatePost,
  onDeletePost,
  inquiries,
  onUpdateInquiryStatus,
  onDeleteInquiry,
  onClose,
}: CustomizerProps) {
  const [activeTab, setActiveTab] = useState<PanelTab>('general');
  
  // Post management helper state
  const [editingPost, setEditingPost] = useState<ExhibitionPost | null>(null);
  const [postFormTitle, setPostFormTitle] = useState('');
  const [postFormArtist, setPostFormArtist] = useState('');
  const [postFormPeriod, setPostFormPeriod] = useState('');
  const [postFormDesc, setPostFormDesc] = useState('');
  const [postFormImg, setPostFormImg] = useState('');
  const [postFormCat, setPostFormCat] = useState<'current' | 'upcoming' | 'past' | 'notice'>('current');
  const [isAddingNewPost, setIsAddingNewPost] = useState(false);

  // Curated elegant color palette presets
  const presets = [
    { name: '프러시안 블루 & 실버 (Prussian Blue)', hex: '#003153', bg: '#F0F4F8' },
    { name: '플래티넘 실버 (Platinum Silver)', hex: '#8A9099', bg: '#F1F2F4' },
    { name: '골드 베이지 (Gold Beige)', hex: '#D4C3A3', bg: '#F7F5F0' },
    { name: '클래식 세이지 (Sage Green)', hex: '#778271', bg: '#F2F4F1' },
    { name: '테라코타 웜 (Clay)', hex: '#AF8072', bg: '#F8F3F1' },
    { name: '모던 오닉스 (Onyx)', hex: '#2B2B2B', bg: '#FAFAFA' },
  ];

  const handlePresetSelect = (hex: string, bg: string) => {
    onConfigChange({
      ...config,
      pointColor: hex,
      pointColorLight: bg,
    });
  };

  const handleFieldChange = (key: keyof GalleryConfig, value: any) => {
    onConfigChange({
      ...config,
      [key]: value,
    });
  };

  const aboutFileInputRef = useRef<HTMLInputElement>(null);
  const aboutFile2InputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const floorPlanFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File, field: 'aboutImage' | 'aboutImage2' | 'heroBackgroundImage' | 'floorPlanImage') => {
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
          const compressed = canvas.toDataURL('image/jpeg', 0.94);
          if (field === 'heroBackgroundImage') {
            onConfigChange({
              ...config,
              heroBackgroundImage: compressed,
              heroBackgroundMode: 'photo',
            });
          } else {
            handleFieldChange(field, compressed);
          }
        } else {
          if (field === 'heroBackgroundImage') {
            onConfigChange({
              ...config,
              heroBackgroundImage: result,
              heroBackgroundMode: 'photo',
            });
          } else {
            handleFieldChange(field, result);
          }
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  // Post Submission Actions
  const handleStartEditPost = (post: ExhibitionPost) => {
    setEditingPost(post);
    setPostFormTitle(post.title || '');
    setPostFormArtist(post.artist || '');
    setPostFormPeriod(post.period || '');
    setPostFormDesc(post.description || '');
    setPostFormImg(post.imageUrl || '');
    setPostFormCat(post.category || 'current');
    setIsAddingNewPost(false);
  };

  const handleStartAddNewPost = () => {
    setEditingPost(null);
    setPostFormTitle('');
    setPostFormArtist('');
    setPostFormPeriod('');
    setPostFormDesc('');
    setPostFormImg('https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800'); // Default elegant placeholder
    setPostFormCat('current');
    setIsAddingNewPost(true);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postFormTitle.trim() || !postFormPeriod.trim()) {
      alert('전시 제목과 기간을 채워주십시오.');
      return;
    }

    if (isAddingNewPost) {
      const newPost: ExhibitionPost = {
        id: 'exhibit-' + Date.now(),
        title: postFormTitle,
        artist: postFormArtist,
        period: postFormPeriod,
        description: postFormDesc,
        imageUrl: postFormImg,
        category: postFormCat,
        createdAt: Date.now(),
      };
      onAddPost(newPost);
    } else if (editingPost) {
      const updatedPost: ExhibitionPost = {
        ...editingPost,
        title: postFormTitle,
        artist: postFormArtist,
        period: postFormPeriod,
        description: postFormDesc,
        imageUrl: postFormImg,
        category: postFormCat,
      };
      onUpdatePost(updatedPost);
    }

    // Reset editing
    setIsAddingNewPost(false);
    setEditingPost(null);
  };

  const menuItems = [
    { id: 'general', label: '기본 정보' },
    { id: 'design', label: '테마 디자인' },
    { id: 'posts', label: '전시/글 관리' },
    { id: 'inquiries', label: '대관 문의 대장' },
    { id: 'contact', label: 'SNS/위치' },
    { id: 'seo', label: '공유/SEO 미리보기' },
  ];

  return (
    <div className="w-full max-w-2xl fixed right-0 top-0 h-full bg-white z-50 shadow-2xl border-l border-zinc-200 flex flex-col justify-between font-sans animate-in slide-in-from-right duration-300">
      
      {/* 1. Header Area */}
      <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
        <div className="flex items-center space-x-2.5 text-zinc-900 text-left">
          <Settings size={18} className="text-zinc-650" />
          <div>
            <h3 className="font-extrabold text-sm tracking-tight font-sans">실시간 웹사이트 편집기</h3>
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider">ADMIN & LAYOUT CUSTOMIZER MODE</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-zinc-200 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* 2. Content View Splitted into Layout Tabs */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sub-Tab Navigation */}
        <div className="w-1/3 border-r border-zinc-100 bg-zinc-50/50 flex flex-col py-4 px-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as PanelTab);
                setEditingPost(null);
                setIsAddingNewPost(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-[11px] font-bold tracking-wide transition-all uppercase flex items-center justify-between cursor-pointer ${
                activeTab === item.id
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-500 hover:text-zinc-850 hover:bg-zinc-100'
              }`}
            >
              <span>{item.label}</span>
              {item.id === 'inquiries' && inquiries.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[8px] font-black bg-orange-500 text-white rounded-full">
                  {inquiries.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right Options list and inputs */}
        <div className="w-2/3 p-6 overflow-y-auto">
          
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-6 text-left">
              <div>
                <h4 className="font-bold text-zinc-900 text-sm tracking-tight mb-4">기본 사이트 타이틀 설명</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      갤러리명 (국문)
                    </label>
                    <input
                      type="text"
                      value={config.siteName}
                      onChange={(e) => handleFieldChange('siteName', e.target.value)}
                      className="w-full text-xs text-zinc-800 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      영문 서브명
                    </label>
                    <input
                      type="text"
                      value={config.siteSubName}
                      onChange={(e) => handleFieldChange('siteSubName', e.target.value)}
                      className="w-full text-xs text-zinc-800 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      메인 슬로건 / 소개말
                    </label>
                    <textarea
                      rows={2}
                      value={config.siteDescription}
                      onChange={(e) => handleFieldChange('siteDescription', e.target.value)}
                      className="w-full text-xs text-zinc-800 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-5">
                <h4 className="font-bold text-zinc-900 text-sm tracking-tight mb-4">기본 소개 (ABOUT) 세부 설명</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      갤러리 심도 깊은 본문 대동 소개
                    </label>
                    <textarea
                      rows={5}
                      value={config.aboutText}
                      onChange={(e) => handleFieldChange('aboutText', e.target.value)}
                      className="w-full text-xs text-zinc-800 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 leading-relaxed"
                    />
                  </div>

                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-zinc-900 uppercase tracking-wider">
                        소개란 대표 사진 갤러리 (다중 업로드)
                      </label>
                      <span className="text-[10px] text-zinc-500 font-medium">여러 장 선택 가능</span>
                    </div>

                    {/* Thumbnail gallery list */}
                    <div className="grid grid-cols-4 gap-2">
                      {(config.aboutImages && config.aboutImages.length > 0 ? config.aboutImages : [config.aboutImage, config.aboutImage2].filter(Boolean)).map((img, idx) => (
                        <div key={idx} className="relative aspect-4/3 rounded-lg overflow-hidden bg-zinc-200 border border-zinc-300 group">
                          <img src={img} alt={`About photo ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <button
                            type="button"
                            onClick={() => {
                              const current = config.aboutImages && config.aboutImages.length > 0 ? config.aboutImages : [config.aboutImage, config.aboutImage2].filter(Boolean);
                              if (current.length <= 1) {
                                alert('최소 1장의 사진이 필요합니다.');
                                return;
                              }
                              const updated = current.filter((_, i) => i !== idx);
                              onConfigChange({
                                ...config,
                                aboutImages: updated,
                                aboutImage: updated[0] || config.aboutImage,
                                aboutImage2: updated[1] || config.aboutImage2,
                              });
                            }}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-600/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="사진 삭제"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <input
                        type="file"
                        ref={aboutFileInputRef}
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            const current = config.aboutImages && config.aboutImages.length > 0 ? config.aboutImages : [config.aboutImage, config.aboutImage2].filter(Boolean);
                            const fileList = Array.from(files) as File[];
                            const promises = fileList.filter((f: File) => f.type.startsWith('image/')).map((file: File) => {
                              return new Promise<string>((resolve) => {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const res = ev.target?.result as string;
                                  if (!res) return resolve('');
                                  const img = new Image();
                                  img.onload = () => {
                                    const canvas = document.createElement('canvas');
                                    let { width, height } = img;
                                    const maxDim = 2048;
                                    if (width > maxDim || height > maxDim) {
                                      if (width > height) { height = Math.round((height * maxDim) / width); width = maxDim; }
                                      else { width = Math.round((width * maxDim) / height); height = maxDim; }
                                    }
                                    canvas.width = width; canvas.height = height;
                                    const ctx = canvas.getContext('2d');
                                    if (ctx) {
                                      ctx.drawImage(img, 0, 0, width, height);
                                      resolve(canvas.toDataURL('image/jpeg', 0.92));
                                    } else resolve(res);
                                  };
                                  img.onerror = () => resolve(res);
                                  img.src = res;
                                };
                                reader.readAsDataURL(file);
                              });
                            });

                            Promise.all(promises).then((results) => {
                              const valid = results.filter(Boolean);
                              if (valid.length > 0) {
                                const updated = [...current, ...valid];
                                onConfigChange({
                                  ...config,
                                  aboutImages: updated,
                                  aboutImage: updated[0] || config.aboutImage,
                                  aboutImage2: updated[1] || config.aboutImage2,
                                });
                              }
                            });
                          }
                        }}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => aboutFileInputRef.current?.click()}
                        className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
                      >
                        <Upload size={13} />
                        <span>대표 사진 여러 장 한번에 추가 (다중 선택)</span>
                      </button>
                      <p className="text-[10px] text-zinc-400">
                        컴퓨터/스마트폰의 이미지 파일들을 여러 개 선택하여 한 번에 등록할 수 있습니다.
                      </p>
                    </div>
                  </div>

                  {/* SPACE SPECIFICATION Controls */}
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3">
                    <label className="block text-[11px] font-bold text-zinc-900 uppercase tracking-wider">
                      SPACE SPECIFICATION (공간 규격 정보)
                    </label>
                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] text-zinc-500 font-medium block mb-1">면적 / 규모</span>
                        <input
                          type="text"
                          value={config.rentalArea}
                          onChange={(e) => handleFieldChange('rentalArea', e.target.value)}
                          placeholder="116㎡ (약 35평)"
                          className="w-full text-xs text-zinc-800 p-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 font-medium block mb-1">천장 높이</span>
                        <input
                          type="text"
                          value={config.rentalHeight}
                          onChange={(e) => handleFieldChange('rentalHeight', e.target.value)}
                          placeholder="2.6m ~ 4.0m"
                          className="w-full text-xs text-zinc-800 p-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 font-medium block mb-1">동시 수용 인원</span>
                        <input
                          type="text"
                          value={config.rentalCapacity}
                          onChange={(e) => handleFieldChange('rentalCapacity', e.target.value)}
                          placeholder="최대 60명 동시 수용 가능"
                          className="w-full text-xs text-zinc-800 p-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* LIM303 Gallery Floor Plan Upload Box */}
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-zinc-900 uppercase tracking-wider">
                        공간 구성안 도면 사진
                      </label>
                      <span className="text-[10px] text-zinc-500 font-medium">직접 업로드 가능</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-zinc-300 shrink-0 p-1 flex items-center justify-center">
                        <img 
                          src={config.floorPlanImage || INITIAL_CONFIG.floorPlanImage} 
                          alt="Floor Plan Preview" 
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="file"
                          ref={floorPlanFileInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'floorPlanImage');
                          }}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => floorPlanFileInputRef.current?.click()}
                          className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
                        >
                          <Upload size={13} />
                          <span>도면 이미지 파일(JPG, PNG) 업로드</span>
                        </button>
                        <p className="text-[10px] text-zinc-400">
                          내 컴퓨터에서 새 도면 사진을 선택하면 즉시 갤러리 안내에 적용됩니다.
                        </p>
                      </div>
                    </div>

                    {config.floorPlanImage && config.floorPlanImage !== INITIAL_CONFIG.floorPlanImage && (
                      <button
                        type="button"
                        onClick={() => handleFieldChange('floorPlanImage', INITIAL_CONFIG.floorPlanImage)}
                        className="text-[10px] text-zinc-500 hover:text-zinc-800 underline block cursor-pointer pt-1"
                      >
                        기본 표준 도면으로 되돌리기
                      </button>
                    )}
                  </div>

                  {/* Formspree Data Collection Integration */}
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
                        Formspree 웹사이트 데이터 수집 연동
                      </label>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-emerald-200/80 text-emerald-800 rounded">
                        연동됨
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-800 font-medium block mb-1">
                        Formspree 엔드포인트 URL
                      </span>
                      <input
                        type="text"
                        value={config.formspreeEndpoint || 'https://formspree.io/f/mljegbyn'}
                        onChange={(e) => handleFieldChange('formspreeEndpoint', e.target.value)}
                        placeholder="https://formspree.io/f/mljegbyn"
                        className="w-full text-xs text-zinc-900 p-2.5 bg-white border border-emerald-300 rounded-lg focus:outline-none focus:border-emerald-600 font-mono"
                      />
                    </div>
                    <p className="text-[10px] text-emerald-700 leading-relaxed font-light">
                      방문자가 '대관 견적 및 문의 폼'을 통해 제출한 모든 데이터가 지정된 Formspree 주소로 실시간 전송되어 안전하게 수집·보관됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DESIGN TAB */}
          {activeTab === 'design' && (
            <div className="space-y-6 text-left">
              <div>
                <h4 className="font-bold text-zinc-900 text-sm tracking-tight mb-3">럭셔리 조명 색상 테마</h4>
                <span className="text-[10px] text-zinc-400 block mb-4">갤러리 메인 아이콘, 테두리, 버튼의 포인트 컬러 배율을 제어합니다.</span>
                
                {/* Presets Grid */}
                <div className="grid grid-cols-1 gap-2.5 mb-6">
                  {presets.map((sh) => (
                    <button
                      key={sh.hex}
                      onClick={() => handlePresetSelect(sh.hex, sh.bg)}
                      className={`flex items-center justify-between p-3 rounded-xl border hover:border-zinc-350 bg-white transition-all text-left group cursor-pointer ${
                        config.pointColor === sh.hex ? 'border-zinc-900 ring-2 ring-zinc-150' : 'border-zinc-200/80'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <span 
                          className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-xs"
                          style={{ backgroundColor: sh.hex }}
                        />
                        <span className="text-xs font-semibold text-zinc-800">{sh.name}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">{sh.hex}</span>
                    </button>
                  ))}
                </div>

                {/* Direct Hex input */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    커스텀 포인트 색상 Hex 코드 선택
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={config.pointColor}
                      onChange={(e) => handleFieldChange('pointColor', e.target.value)}
                      className="w-10 h-10 border border-zinc-200 p-1.5 bg-white rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.pointColor}
                      onChange={(e) => handleFieldChange('pointColor', e.target.value)}
                      placeholder="#003153"
                      className="flex-1 text-xs font-mono text-zinc-800 uppercase p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>
              </div>

              {/* Typography options */}
              <div className="border-t border-zinc-100 pt-5">
                <h4 className="font-bold text-zinc-900 text-sm tracking-tight mb-3">서체 폰트 패밀리 구성</h4>
                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    onClick={() => handleFieldChange('fontFamily', 'serif')}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between cursor-pointer ${
                      config.fontFamily === 'serif' ? 'border-zinc-950 bg-neutral-900 text-white' : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <span className="text-sm font-serif-korean font-bold">바탕체 (Gowun Batang)</span>
                    <span className="text-[9px] font-light mt-1 text-zinc-400 block">전시 슬로건에 최적화된 우아한 여백의 미</span>
                  </button>
                  <button
                    onClick={() => handleFieldChange('fontFamily', 'sans')}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between cursor-pointer ${
                      config.fontFamily === 'sans' ? 'border-zinc-950 bg-neutral-900 text-white' : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <span className="text-sm font-sans-korean font-bold">프리미엄 프리텐다드 (Pretendard)</span>
                    <span className="text-[9px] font-light mt-1 text-zinc-400 block">깔끔하고 가독성이 뛰어난 한국 표준 서체</span>
                  </button>
                </div>
              </div>

              {/* Card visual style preset */}
              <div className="border-t border-zinc-100 pt-5">
                <h4 className="font-bold text-zinc-900 text-sm tracking-tight mb-3">전시 카드 스타일 규격</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {([
                    { id: 'bordered', label: '스트로크 테두리', desc: '테두리 선 정의' },
                    { id: 'shadowed', label: '소프트 입체 음영', desc: '고급스러운 그림자' },
                    { id: 'minimal', label: '미니멀 플랫', desc: '선과 그림자 배제' },
                  ] as const).map((sty) => (
                    <button
                      key={sty.id}
                      onClick={() => handleFieldChange('cardStyle', sty.id)}
                      className={`p-3 rounded-lg border text-center flex flex-col justify-between hover:border-zinc-300 min-h-[70px] cursor-pointer ${
                        config.cardStyle === sty.id ? 'bg-zinc-100 border-zinc-900 text-zinc-950 font-bold' : 'text-zinc-650'
                      }`}
                    >
                      <span className="block">{sty.label}</span>
                      <span className="text-[8px] text-zinc-400 block mt-1 font-normal font-sans">{sty.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hero dynamic height & Background controls */}
              <div className="border-t border-zinc-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-zinc-900 text-sm tracking-tight">메인 화면 배너 높이</h4>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mb-5">
                  {([
                    { id: 'small', label: '컴팩트 플랫' },
                    { id: 'medium', label: '균형 잡힌 메디움' },
                    { id: 'large', label: '와이드 시네마틱' },
                  ] as const).map((h) => (
                    <button
                      key={h.id}
                      onClick={() => handleFieldChange('heroHeight', h.id)}
                      className={`p-2.5 rounded-lg border text-center hover:border-zinc-300 cursor-pointer ${
                        config.heroHeight === h.id ? 'bg-zinc-100 border-zinc-900 text-zinc-950 font-bold' : 'text-zinc-650'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>

                {/* CURRENT EXHIBITION banner toggle */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 mb-5 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-zinc-900">메인 화면 'CURRENT EXHIBITION' 프리뷰 카드</h5>
                    <p className="text-[10px] text-zinc-500 font-light mt-0.5">
                      메인 배너 하단에 현재 진행 중인 대표 전시 정보를 미니 카드로 띄웁니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('showHeroCurrentExhibition', !config.showHeroCurrentExhibition)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      config.showHeroCurrentExhibition ? 'bg-zinc-900' : 'bg-zinc-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        config.showHeroCurrentExhibition ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <h4 className="font-bold text-zinc-900 text-sm tracking-tight mb-3">메인 비주얼 섹션 배경 설정</h4>
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleFieldChange('heroBackgroundMode', 'photo')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        config.heroBackgroundMode === 'photo'
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      사진 배경 (권장)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('heroBackgroundMode', 'pattern')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        config.heroBackgroundMode !== 'photo'
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      미니멀 패턴 배경
                    </button>
                  </div>

                  {config.heroBackgroundMode === 'photo' && (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-zinc-200 border border-zinc-300 shrink-0">
                          <img 
                            src={config.heroBackgroundImage} 
                            alt="Hero Bg Preview" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <input
                            type="file"
                            ref={heroFileInputRef}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, 'heroBackgroundImage');
                            }}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => heroFileInputRef.current?.click()}
                            className="w-full py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
                          >
                            <Upload size={12} />
                            <span>1번 사진 파일로 배경 바꾸기</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <input
                          type="text"
                          value={config.heroBackgroundImage}
                          onChange={(e) => handleFieldChange('heroBackgroundImage', e.target.value)}
                          placeholder="배경 이미지 URL 직접 입력..."
                          className="w-full text-xs text-zinc-800 p-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 font-mono"
                        />
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] text-zinc-400 self-center mr-1">배경 프리셋:</span>
                        {[
                          { label: '1번 사진 (갤러리 화이트홀)', url: INITIAL_CONFIG.heroBackgroundImage },
                          { label: '건축 공간감 뷰', url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1600' },
                          { label: '모던 화이트 큐브', url: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=1600' }
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleFieldChange('heroBackgroundImage', item.url)}
                            className={`text-[10px] px-2 py-1 rounded border transition-colors cursor-pointer ${
                              config.heroBackgroundImage === item.url 
                                ? 'bg-zinc-900 text-white border-zinc-900 font-medium' 
                                : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* POSTS / ARTICLES LIST AND EDITOR */}
          {activeTab === 'posts' && (
            <div className="space-y-6 text-left">
              {/* Not editing a specific post */}
              {!editingPost && !isAddingNewPost ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-1">
                    <h4 className="font-bold text-zinc-950 text-sm">전시 기록 및 안내사항 아카이브</h4>
                    <button
                      onClick={handleStartAddNewPost}
                      className="px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-wider rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                      style={{ backgroundColor: config.pointColor }}
                    >
                      <Plus size={12} />
                      <span>새 게시글 등록</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="p-3 bg-zinc-50 border border-zinc-200 hover:border-zinc-350 rounded-xl flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center space-x-3 text-left">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-11 h-11 object-cover rounded border border-zinc-150 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-zinc-400 block font-bold">
                              {post.category === 'current' && '전시 중'}
                              {post.category === 'upcoming' && '예정 전시'}
                              {post.category === 'past' && '지난 전시'}
                              {post.category === 'notice' && '공지사항'}
                            </span>
                            <span className="text-xs font-bold text-zinc-850 block truncate max-w-[200px]">
                              {post.title}
                            </span>
                            <span className="text-[10px] text-zinc-500 block truncate">
                              {post.artist || '관리자'} • {post.period}
                            </span>
                          </div>
                        </div>

                        {/* Control buttons */}
                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            onClick={() => handleStartEditPost(post)}
                            className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 rounded transition-colors"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('이 전시를 정말 아카이브에서 제거하시겠습니까?')) {
                                onDeletePost(post.id);
                              }
                            }}
                            className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Edit/Add Form Pane */
                <form onSubmit={handleSavePost} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
                    <span className="text-xs font-black uppercase tracking-wider text-zinc-950">
                      {isAddingNewPost ? '새 게시글 추가 양식' : '게시글 상세 정보 수정'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewPost(false);
                        setEditingPost(null);
                      }}
                      className="text-xs text-zinc-500 hover:underline"
                    >
                      취소
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                        전시 또는 공지 분류 카테고리
                      </label>
                      <select
                        value={postFormCat}
                        onChange={(e) => setPostFormCat(e.target.value as any)}
                        className="w-full text-xs text-zinc-800 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950 font-sans"
                      >
                        <option value="current">현재 전시 중 (Current)</option>
                        <option value="upcoming">예정된 전시 (Upcoming)</option>
                        <option value="past">지난 과거 전시 아카이브 (Past)</option>
                        <option value="notice">일반 안내 공유사항 (Notice)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                        게시물 제목 *
                      </label>
                      <input
                        type="text"
                        placeholder="예) 기억의 파편: 흔적을 거닐다"
                        value={postFormTitle}
                        onChange={(e) => setPostFormTitle(e.target.value)}
                        className="w-full text-xs text-zinc-850 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                        참여 작가/필자 이름 (공지 시 생략 가능)
                      </label>
                      <input
                        type="text"
                        placeholder="예) 백지우 작가"
                        value={postFormArtist}
                        onChange={(e) => setPostFormArtist(e.target.value)}
                        className="w-full text-xs text-zinc-850 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                        전시 기간 또는 노출 일자 *
                      </label>
                      <input
                        type="text"
                        placeholder="예) 2026. 05. 20 - 2026. 06. 15"
                        value={postFormPeriod}
                        onChange={(e) => setPostFormPeriod(e.target.value)}
                        className="w-full text-xs text-zinc-850 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                        전시 안내 포스터 대표 이미지 주소 (URL)
                      </label>
                      <input
                        type="text"
                        value={postFormImg}
                        onChange={(e) => setPostFormImg(e.target.value)}
                        className="w-full text-xs font-mono text-zinc-850 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                        전시 상세 개요 및 아티스트 스테이트먼트
                      </label>
                      <textarea
                        rows={4}
                        placeholder="작품의 기획 의도와 설명을 자유롭게 기록해 대중들에게 공유하세요."
                        value={postFormDesc}
                        onChange={(e) => setPostFormDesc(e.target.value)}
                        className="w-full text-xs text-zinc-850 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewPost(false);
                        setEditingPost(null);
                      }}
                      className="flex-1 py-2 bg-zinc-150 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      돌아가기
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 text-white font-bold text-xs rounded-lg hover:opacity-95 transition-all cursor-pointer"
                      style={{ backgroundColor: config.pointColor }}
                    >
                      {isAddingNewPost ? '신규 작성 게시' : '수정 내역 완결'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* RENTAL INQUIRIES HISTORY TABS */}
          {activeTab === 'inquiries' && (
            <InquiryList
              config={config}
              inquiries={inquiries}
              onUpdateStatus={onUpdateInquiryStatus}
              onDeleteInquiry={onDeleteInquiry}
            />
          )}

          {/* CONTACT & HOURS TAB */}
          {activeTab === 'contact' && (
            <div className="space-y-6 text-left">
              <div>
                <h4 className="font-bold text-zinc-900 text-sm tracking-tight mb-4">갤러리 상세 지도 정보</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      지번 및 주소 노출값
                    </label>
                    <input
                      type="text"
                      value={config.address}
                      onChange={(e) => handleFieldChange('address', e.target.value)}
                      className="w-full text-xs text-zinc-850 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      공식 통화 회선 번호
                    </label>
                    <input
                      type="text"
                      value={config.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      className="w-full text-xs text-zinc-850 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      메일 주소
                    </label>
                    <input
                      type="text"
                      value={config.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      className="w-full text-xs text-zinc-850 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-5">
                <h4 className="font-bold text-zinc-900 text-sm tracking-tight mb-4">학예 시간 운영계획</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      평일 시간 계획
                    </label>
                    <input
                      type="text"
                      value={config.hoursWeekday}
                      onChange={(e) => handleFieldChange('hoursWeekday', e.target.value)}
                      className="w-full text-xs text-zinc-850 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      주말 및 공휴일 계획
                    </label>
                    <input
                      type="text"
                      value={config.hoursWeekend}
                      onChange={(e) => handleFieldChange('hoursWeekend', e.target.value)}
                      className="w-full text-xs text-zinc-850 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      정기 휴관 약관
                    </label>
                    <input
                      type="text"
                      value={config.closedDays}
                      onChange={(e) => handleFieldChange('closedDays', e.target.value)}
                      className="w-full text-xs text-zinc-850 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO & SOCIAL SHARING PREVIEW TAB */}
          {activeTab === 'seo' && (
            <div className="space-y-6 text-left font-sans">
              <div>
                <h4 className="font-bold text-zinc-950 text-sm tracking-tight mb-2">실시간 소셜 메타 공유 카드</h4>
                <p className="text-zinc-400 text-[10px] leading-relaxed mb-5">
                  본 링크를 네이버 블로그, 카카오톡 또는 페이스북에 탑재 공유했을 때 수집 봇들이 가로채 렌더링하는 소셜 팝업 카드 실시간 프리뷰입니다.
                </p>

                {/* Shared Social Preview box */}
                <div className="rounded-xl border border-zinc-200 bg-[#f8f9fa] overflow-hidden shadow-xs">
                  <div className="bg-white border-b border-zinc-150 py-2.5 px-4 text-zinc-450 text-[10px] font-mono flex items-center space-x-1.5">
                    <Globe size={11} className="text-zinc-400" />
                    <span>https://{config.siteName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'gallerylim303'}.co.kr</span>
                  </div>
                  
                  {/* Banner inside preview */}
                  <div className="aspect-191/100 w-full bg-zinc-100">
                    <img 
                      src={config.aboutImage} 
                      alt="SEO Banner" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Descriptions inside preview */}
                  <div className="p-4 bg-white text-left font-sans text-xs">
                    <span className="font-extrabold text-[#000000] block mb-1 tracking-tight truncate">
                      {config.siteName} | {config.siteSubName}
                    </span>
                    <p className="text-[#65676b] text-[10px] leading-relaxed line-clamp-2">
                      {config.siteDescription} • {config.address}
                    </p>
                    <span className="text-[9px] tracking-wider text-zinc-400 font-mono font-bold uppercase block mt-2.5">
                      OPEN GRAPH TARGET PREVIEW
                    </span>
                  </div>
                </div>

                {/* Standard copy button to play around with */}
                <div className="mt-5">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${config.siteName} - ${config.siteDescription}`);
                      alert('소셜 최적화 문안이 클립보드에 카피되었습니다!');
                    }}
                    className="w-full py-2.5 border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 size={12} />
                    <span>소셜 홍보 요약 문안 복사</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 3. Bottom persistent summary bar */}
      <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
        <span>STATUS: LIVE AND SYNCED</span>
        <span>SAVED TO LOCAL_STORAGE</span>
      </div>

    </div>
  );
}
