/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, Calendar, Trash2, CheckCircle, Clock, AlertCircle, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { RentalInquiry, GalleryConfig } from '../types.ts';

interface InquiryListProps {
  config: GalleryConfig;
  inquiries: RentalInquiry[];
  onUpdateStatus: (id: string, status: 'pending' | 'reviewed' | 'completed') => void;
  onDeleteInquiry: (id: string) => void;
}

export default function InquiryList({
  config,
  inquiries,
  onUpdateStatus,
  onDeleteInquiry,
}: InquiryListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'completed'>('all');

  const formspreeUrl = config.formspreeEndpoint || 'https://formspree.io/f/mljegbyn';

  const filtered = inquiries.filter((inq) => {
    if (filter === 'all') return true;
    return inq.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: '답변완료', class: 'bg-green-50 text-green-700 border border-green-200' };
      case 'reviewed':
        return { text: '검토중', class: 'bg-blue-50 text-blue-700 border border-blue-200' };
      case 'pending':
      default:
        return { text: '미확인', class: 'bg-amber-50 text-amber-700 border border-amber-200' };
    }
  };

  return (
    <div className="space-y-5 font-sans text-left">
      
      {/* Formspree Connection Status Card */}
      <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-950">Formspree 실시간 데이터 수집 연동 활성화</span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-emerald-200/60 text-emerald-800 rounded">LIVE</span>
            </div>
            <p className="text-[11px] text-emerald-800/80 font-light font-mono truncate max-w-sm mt-0.5">
              {formspreeUrl}
            </p>
          </div>
        </div>
        <a
          href="https://formspree.io/forms/mljegbyn/submissions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-emerald-900 bg-white hover:bg-emerald-100/50 border border-emerald-300 font-semibold px-2.5 py-1 rounded-lg flex items-center space-x-1 shrink-0 transition-colors shadow-2xs"
        >
          <span>Formspree 확인</span>
          <ExternalLink size={11} />
        </a>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div>
          <h4 className="font-bold text-zinc-900 text-sm tracking-tight">수신된 대관 문의 목록</h4>
          <p className="text-zinc-405 text-xs">작품 기획자들의 대관 접수 내역을 실시간으로 관리합니다.</p>
        </div>

        {/* Status filters */}
        <div className="flex bg-zinc-50 border border-zinc-200 p-1 rounded-lg text-xs self-start sm:self-center">
          {(['all', 'pending', 'reviewed', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-md font-semibold ${
                filter === st
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/50'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {st === 'all' && '전체'}
              {st === 'pending' && '미확인'}
              {st === 'reviewed' && '검토중'}
              {st === 'completed' && '답변완료'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center text-zinc-400 text-xs">
          표시할 대관 문의 건수가 없습니다.
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {filtered.map((inq) => {
            const statusBadge = getStatusBadge(inq.status);
            return (
              <div
                key={inq.id}
                className="bg-white rounded-xl border border-zinc-200/80 p-5 hover:border-zinc-350 transition-all space-y-3"
              >
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <span className="font-extrabold text-zinc-900 text-sm">{inq.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusBadge.class}`}>
                        {statusBadge.text}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      접수시간: {new Date(inq.createdAt).toLocaleString('ko-KR')}
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => {
                      if (confirm('이 문의 내역을 영구 삭제하시겠습니까?')) {
                        onDeleteInquiry(inq.id);
                      }
                    }}
                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-neutral-50 rounded"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Details layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-zinc-50 p-3 rounded-lg text-xs leading-5">
                  <div className="flex items-center space-x-2 text-zinc-650">
                    <Phone size={12} className="text-zinc-400" />
                    <span className="font-semibold text-zinc-800">연락처:</span>
                    <span>{inq.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-zinc-650">
                    <Mail size={12} className="text-zinc-400" />
                    <span className="font-semibold text-zinc-800">이메일:</span>
                    <span>{inq.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-zinc-650 col-span-1 md:col-span-2">
                    <Calendar size={12} className="text-zinc-400" />
                    <span className="font-semibold text-zinc-800">희망 대관일:</span>
                    <span>{inq.desiredPeriod}</span>
                  </div>
                  {inq.artworkType && (
                    <div className="col-span-2 text-zinc-650 flex items-start space-x-2">
                      <AlertCircle size={12} className="text-zinc-400 mt-1" />
                      <div>
                        <span className="font-semibold text-zinc-800">전시품 성격:</span>
                        <p className="inline pl-1">{inq.artworkType}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Question text */}
                <div className="text-xs text-zinc-700 leading-relaxed pt-1 whitespace-pre-wrap">
                  {inq.message}
                </div>

                {/* Actions bottom row */}
                <div className="flex justify-end space-x-1.5 pt-3 border-t border-zinc-100">
                  <button
                    onClick={() => onUpdateStatus(inq.id, 'pending')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${
                      inq.status === 'pending'
                        ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                        : 'bg-zinc-50 text-zinc-650 hover:bg-zinc-100'
                    }`}
                    disabled={inq.status === 'pending'}
                  >
                    미확인 처리
                  </button>
                  <button
                    onClick={() => onUpdateStatus(inq.id, 'reviewed')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${
                      inq.status === 'reviewed'
                        ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                        : 'bg-zinc-50 text-zinc-650 hover:bg-zinc-100'
                    }`}
                    disabled={inq.status === 'reviewed'}
                  >
                    검토중 표시
                  </button>
                  <button
                    onClick={() => onUpdateStatus(inq.id, 'completed')}
                    className={`px-3 py-1 text-[10px] font-bold text-white rounded-md transition-all ${
                      inq.status === 'completed'
                        ? 'bg-zinc-150 text-zinc-350 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                    disabled={inq.status === 'completed'}
                  >
                    답변완료 완료
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
