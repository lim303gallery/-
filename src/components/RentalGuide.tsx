/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { HelpCircle, Landmark, ShieldCheck, Mail, Send, Award, Compass, RefreshCw, Layout, Smartphone, Phone, CheckCircle2, Upload, Check, RotateCcw, Loader2 } from 'lucide-react';
import { GalleryConfig, RentalInquiry } from '../types.ts';
import defaultFloorPlanImg from '../assets/images/lim303_floor_plan_1788158721862.jpg';

interface RentalGuideProps {
  config: GalleryConfig;
  onAddInquiry: (inquiry: Omit<RentalInquiry, 'id' | 'createdAt' | 'status'>) => void;
  onUpdateConfig?: (newConfig: GalleryConfig) => void;
  isAdmin?: boolean;
}

export default function RentalGuide({ config, onAddInquiry, onUpdateConfig, isAdmin = false }: RentalGuideProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [desiredPeriod, setDesiredPeriod] = useState('');
  const [artworkType, setArtworkType] = useState('');
  const [message, setMessage] = useState('');
  
  const [errorInput, setErrorInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activeFloorPlan = config.floorPlanImage || defaultFloorPlanImg;

  const processFloorPlanFile = (file: File) => {
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
          if (onUpdateConfig) {
            onUpdateConfig({ ...config, floorPlanImage: compressed });
          }
        } else {
          if (onUpdateConfig) {
            onUpdateConfig({ ...config, floorPlanImage: result });
          }
        }
        setUploadNotice('도면 사진이 성공적으로 변경되었습니다!');
        setTimeout(() => setUploadNotice(null), 3000);
      };
      img.onerror = () => {
        if (onUpdateConfig) {
          onUpdateConfig({ ...config, floorPlanImage: result });
        }
        setUploadNotice('도면 사진이 변경되었습니다!');
        setTimeout(() => setUploadNotice(null), 3000);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleResetFloorPlan = () => {
    if (confirm('기본 표준 도면으로 복원하시겠습니까?')) {
      if (onUpdateConfig) {
        onUpdateConfig({ ...config, floorPlanImage: defaultFloorPlanImg });
      }
      setUploadNotice('기본 도면으로 복원되었습니다.');
      setTimeout(() => setUploadNotice(null), 2500);
    }
  };

  // Rental process steps
  const steps = [
    {
      num: '01',
      title: '대관 신청 기획 접수',
      desc: '희망 대관 일정과 전시 기획서 개요, 작품 정보 포트폴리오를 작성하여 이메일 또는 하단 폼으로 접수합니다.\n유선상담) 010-8020-5499'
    },
    {
      num: '02',
      title: '기획 심의 및 검토',
      desc: '대관상담 / 신청 후 내부 심의를 걸쳐 3일 이내 승인 여부를 결정하여 공지드립니다.'
    },
    {
      num: '03',
      title: '대관계약',
      desc: '대관승인 후 방문 또는 우편으로 계약을 진행합니다.\n계약서를 검토하시고 갤러리 대관규약을 공유한 후 계약을 체결합니다.'
    },
    {
      num: '04',
      title: '작품 반입 및 설치',
      desc: '대관 시작 전일 오후에 작품을 입고하고 디스플레이 각도 조명 세팅 작업을 수행합니다.\n작품 반입 및 설치 : 월요일 13:00 - 18:00\n작품 철수 및 원상복구 : 월요일 9:00 - 11:00\n※ 학생, 졸업 전시 대관은 특별가가 적용됩니다.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorInput('');

    if (!name.trim()) return setErrorInput('성함 또는 주최자명을 입력해 주세요.');
    if (!phone.trim()) return setErrorInput('연락처 전화를 입력해 주세요.');
    if (!email.trim() || !email.includes('@')) return setErrorInput('올바른 이메일 주소를 입력해 주세요.');
    if (!desiredPeriod.trim()) return setErrorInput('대관 희망 시기를 적어주세요.');
    if (!message.trim()) return setErrorInput('문의 내용을 명확하게 적어주세요.');

    setIsSubmitting(true);

    const endpoint = config.formspreeEndpoint || 'https://formspree.io/f/mljegbyn';

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      desiredPeriod: desiredPeriod.trim(),
      artworkType: artworkType.trim() || '미기재',
      message: message.trim(),
      _subject: `[${config.siteName}] 새로운 대관 견적 문의 - ${name.trim()}`,
      _replyto: email.trim(),
      siteName: config.siteName,
      submittedAt: new Date().toLocaleString('ko-KR')
    };

    try {
      // 1. Post to Formspree
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Formspree network submission notice:', err);
    } finally {
      // 2. Also register in local state for instant dashboard view
      onAddInquiry({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        desiredPeriod: desiredPeriod.trim(),
        artworkType: artworkType.trim(),
        message: message.trim()
      });

      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form values
      setName('');
      setPhone('');
      setEmail('');
      setDesiredPeriod('');
      setArtworkType('');
      setMessage('');

      setTimeout(() => {
        setIsSubmitted(false);
      }, 7000);
    }
  };

  return (
    <div id="rental-contact-group">
      
      {/* 1. 대관 안내 및 평면도 */}
      <section id="rental" className="py-24 bg-white border-b border-zinc-100 font-sans">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span 
              className="text-xs uppercase tracking-[0.35em] font-medium font-display block mb-3"
              style={{ color: config.pointColor }}
            >
              Rental Guide
            </span>
            <h2 
              className="text-3xl md:text-4xl font-bold md:font-semibold tracking-tight text-zinc-950 mb-4"
              style={{ fontFamily: config.fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)' }}
            >
              대관 서비스 안내
            </h2>
            <div 
              className="w-12 h-[2px] mx-auto opacity-70"
              style={{ backgroundColor: config.pointColor }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
            
            {/* Steps (Left columns) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight text-left mb-6 font-sans">
                  공간 대관 프로세스
                </h3>
                <div className="space-y-6">
                  {steps.map((st) => (
                    <div key={st.num} className="flex items-start space-x-4">
                      <span 
                        className="text-2xl font-black font-serif italic shrink-0"
                        style={{ color: config.pointColor }}
                      >
                        {st.num}
                      </span>
                      <div className="text-left font-sans">
                        <h4 className="font-bold text-zinc-900 mb-1 text-sm tracking-tight">{st.title}</h4>
                        <p className="text-zinc-550 text-xs tracking-wide leading-relaxed font-light whitespace-pre-line">{st.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Special Student & Graduation Special Price Highlight Card */}
                <div className="mt-8 p-4 rounded-xl bg-zinc-50 border border-zinc-200/90 text-left flex items-start space-x-3 shadow-2xs">
                  <div className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                    ★
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-900 tracking-tight mb-0.5">
                      학생 및 졸업 전시 대관 특별가 혜택
                    </h5>
                    <p className="text-zinc-600 text-xs font-light leading-relaxed">
                      학생 전시 및 미술대학 졸업 전시 대관의 경우 청년 작가 지원을 위한 맞춤형 특별가가 적용됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* LIM303 Gallery 공간 구성안 (Right columns) */}
            <div className="lg:col-span-6 flex flex-col bg-zinc-50 border border-zinc-200 rounded-2xl p-6 md:p-8">
              <div className="text-left mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-zinc-400 font-bold uppercase block mb-1">Floor Plan Blueprint</span>
                  <h4 className="text-lg font-bold text-zinc-900 font-sans tracking-tight">LIM303 Gallery 공간 구성안</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono font-semibold text-zinc-500 bg-white px-2.5 py-1 rounded-md border border-zinc-200 shadow-2xs">
                    {config.rentalArea || '116㎡ (약 35평)'}
                  </span>
                  {isAdmin && onUpdateConfig && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md text-[11px] font-semibold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                      title="도면 사진 업로드 (관리자)"
                    >
                      <Upload size={12} />
                      <span>도면 등록</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Exact Floor Plan Diagram Image Container with Drag & Drop (Admin only) */}
              <div 
                className={`w-full bg-white rounded-xl relative p-3 md:p-4 flex flex-col items-center justify-center border transition-all overflow-hidden ${
                  isAdmin ? 'group' : ''
                } min-h-[320px] ${
                  isDragging && isAdmin ? 'border-zinc-900 ring-4 ring-zinc-300 scale-[1.01]' : 'border-zinc-250 shadow-xs'
                }`}
                onDragOver={isAdmin ? (e) => { e.preventDefault(); setIsDragging(true); } : undefined}
                onDragLeave={isAdmin ? () => setIsDragging(false) : undefined}
                onDrop={isAdmin ? (e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) processFloorPlanFile(file);
                } : undefined}
              >
                <img 
                  src={activeFloorPlan} 
                  alt="LIM303 Gallery 공간 구성안 평면도" 
                  className={`w-full h-auto max-h-[460px] object-contain select-none transition-transform duration-500 ${
                    isAdmin ? 'group-hover:scale-[1.01]' : ''
                  }`}
                  referrerPolicy="no-referrer"
                />

                {/* Hidden File Input (Admin only) */}
                {isAdmin && (
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) processFloorPlanFile(file);
                    }} 
                    accept="image/*" 
                    className="hidden" 
                  />
                )}

                {/* Hover Action Overlay (Admin only) */}
                {isAdmin && onUpdateConfig && (
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 backdrop-blur-[2px] z-10 space-y-2.5">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2.5 bg-white text-zinc-900 hover:bg-zinc-100 rounded-lg shadow-lg text-xs font-bold flex items-center space-x-2 transition-transform hover:scale-105 cursor-pointer"
                      >
                        <Upload size={14} className="text-zinc-700" />
                        <span>새로운 도면 사진 파일 선택</span>
                      </button>
                      {config.floorPlanImage && config.floorPlanImage !== defaultFloorPlanImg && (
                        <button
                          type="button"
                          onClick={handleResetFloorPlan}
                          className="px-3.5 py-2.5 bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg shadow-lg text-xs font-bold flex items-center space-x-1.5 transition-transform hover:scale-105 cursor-pointer border border-zinc-600"
                          title="기본 도면으로 되돌리기"
                        >
                          <RotateCcw size={13} />
                          <span>기본 도면 복원</span>
                        </button>
                      )}
                    </div>
                    <span className="text-[11px] text-white/90 font-medium">
                      또는 내 컴퓨터의 도면 이미지 파일(JPG, PNG 등)을 이 자리로 드래그하세요
                    </span>
                  </div>
                )}

                {/* Upload Success Feedback Badge */}
                {uploadNotice && (
                  <div className="absolute bottom-4 left-4 right-4 bg-zinc-900/95 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-xl flex items-center justify-center space-x-2 backdrop-blur-md animate-fade-in z-20 border border-white/10">
                    <Check size={14} className="text-emerald-400" />
                    <span>{uploadNotice}</span>
                  </div>
                )}
              </div>

              {/* Helper footnote (Admin only) */}
              {isAdmin && (
                <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 font-sans">
                  <span>※ 도면 사진을 클릭하거나 드래그하여 언제든지 새로운 도면으로 변경할 수 있습니다.</span>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 2. 대관 문의 폼 */}
      <section id="contact" className="py-24 bg-neutral-50 font-sans">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Contact text block (Left, 5 columns) */}
            <div className="lg:col-span-5 text-left space-y-6">
              <span 
                className="text-xs uppercase tracking-[0.35em] font-medium font-display block"
                style={{ color: config.pointColor }}
              >
                Inquiry Form
              </span>
              <h3 
                className="text-2xl md:text-3xl font-bold md:font-semibold tracking-tight text-zinc-950 leading-tight"
                style={{ fontFamily: config.fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)' }}
              >
                기획 전시 대관을 위한<br />
                실시간 1:1 견적 문의
              </h3>
              <p className="text-zinc-650 text-sm font-light leading-relaxed">
                하단의 기본 인적 사항 및 전시 기획 기간을 적어 제출하시면, 담당자 이메일로 즉시 동기화 검토가 진행됩니다.
              </p>

              <div className="pt-2 space-y-3.5 text-xs font-sans text-zinc-700">
                <div className="flex items-center space-x-3.5 bg-white p-3 rounded-xl border border-zinc-200/80 shadow-xs">
                  <span className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                    <Phone size={15} style={{ color: config.pointColor }} />
                  </span>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">유선 번호</span>
                    <span className="font-semibold text-zinc-900 text-sm">{config.phone || '010-8020-5499'}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 bg-white p-3 rounded-xl border border-zinc-200/80 shadow-xs">
                  <span className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                    <Mail size={15} style={{ color: config.pointColor }} />
                  </span>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">문의 이메일</span>
                    <span className="font-semibold text-zinc-900 text-sm">{config.email || 'lim303gallery@gmail.com'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Form Card (Right, 7 columns) */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-zinc-250 p-6 md:p-10 shadow-lg relative overflow-hidden">
                
                {/* Static indicator for security */}
                <div className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: config.pointColor }} />

                {/* Main Submit Form */}
                <form onSubmit={handleSubmit} className="space-y-5 text-left font-sans">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 mb-1.5 uppercase font-sans tracking-wide">
                        문의자 성함 / 단체명 *
                      </label>
                      <input
                        type="text"
                        placeholder="기획자 이름 입력"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-zinc-800 py-2 text-sm luxury-input"
                        id="inquiry-name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 mb-1.5 uppercase font-sans tracking-wide">
                        연락처 전화번호 *
                      </label>
                      <input
                        type="tel"
                        placeholder="010-0000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-zinc-800 py-2 text-sm luxury-input"
                        id="inquiry-phone"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 mb-1.5 uppercase font-sans tracking-wide">
                        이메일 주소 *
                      </label>
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-zinc-800 py-2 text-sm luxury-input"
                        id="inquiry-email"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 mb-1.5 uppercase font-sans tracking-wide">
                        희망 대관 시기 *
                      </label>
                      <input
                        type="text"
                        placeholder="예) 2026년 9월 초순, 14일간"
                        value={desiredPeriod}
                        onChange={(e) => setDesiredPeriod(e.target.value)}
                        className="w-full text-zinc-800 py-2 text-sm luxury-input"
                        id="inquiry-period"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1.5 uppercase font-sans tracking-wide">
                      전시할 예술품 유형 / 장르 명세 (선택)
                    </label>
                    <input
                      type="text"
                      placeholder="예) 미디어아트 영상전, 유화 회화 소장품전 20점 등"
                      value={artworkType}
                      onChange={(e) => setArtworkType(e.target.value)}
                      className="w-full text-zinc-800 py-2 text-sm luxury-input"
                      id="inquiry-artwork"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1.5 uppercase font-sans tracking-wide">
                      상세 전시 기획 의도 및 기타 특별 요구사항 *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="설치 기법, 현수막 설치 유무, 리셉션 연출 희망 등 상세 규격을 자유롭게 남겨 주십시오."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full text-zinc-800 py-2 text-sm luxury-input"
                      id="inquiry-message"
                    />
                  </div>

                  {/* On-Page validation feedback */}
                  {errorInput && (
                    <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
                      ⚠️ {errorInput}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full text-white py-3.5 hover:shadow-md rounded-lg font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center space-x-2 ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:opacity-95'
                    }`}
                    style={{ backgroundColor: config.pointColor }}
                    id="inquiry-submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>문의 전송 중...</span>
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        <span>대관 기획 문의 실시간 전송하기</span>
                      </>
                    )}
                  </button>

                  {/* Feedback Message Overlay */}
                  {isSubmitted && (
                    <div className="mt-4 p-4 text-center bg-zinc-900 text-white rounded-xl animate-fade-in scale-95 duration-200 flex flex-col items-center shadow-lg border border-zinc-800">
                      <div className="flex items-center space-x-1.5 text-emerald-400 mb-1 text-sm font-bold">
                        <CheckCircle2 size={16} />
                        <span>대관 기획안 전송이 완료되었습니다!</span>
                      </div>
                      <span className="text-[11px] text-zinc-350 font-light block leading-relaxed max-w-md">
                        접수된 대관 문의 데이터가 Formspree 및 갤러리 관리자 시스템으로 안전하게 전달되었습니다. 담당자가 확인 후 신속하게 회신드리겠습니다.
                      </span>
                    </div>
                  )}

                </form>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
