'use client';

import React, { useState } from 'react';
import { ChevronLeft, Calendar, MapPin, MessageSquare, MoreVertical, Eye, History } from 'lucide-react';

export default function ReportHistory({ reports = [], onBack }) {
  // สมมติข้อมูลจำลอง (เดี๋ยวบอสดึงจาก API: GET /api/incidents/user มาใส่นะ)
  const mockReports = [
    {
      id: 1,
      title: "น้ำท่วมขังรอการระบาย",
      description: "บริเวณหน้าปากซอย 5 น้ำสูงประมาณ 20 ซม.",
      date: "25 มี.ค. 2026",
      status: "pending", // pending, verified, resolved
      impact: "area",
      likes: 15
    },
    {
      id: 2,
      title: "ต้นไม้ล้มขวางทาง",
      description: "ลมแรงทำให้ต้นไม้ใหญ่ล้มทับเสาไฟฟ้า",
      date: "20 มี.ค. 2026",
      status: "resolved",
      impact: "wide",
      likes: 42
    }
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'resolved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'verified': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans">
      {/* 1. Top Navigation */}
      <div className="p-6 flex items-center gap-4 border-b border-zinc-900 sticky top-0 bg-black/80 backdrop-blur-md z-10">
        <button onClick={onBack} className="p-2 bg-zinc-900 rounded-xl text-zinc-400">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-black italic">My Reports</h1>
      </div>

      {/* 2. List Area */}
      <div className="p-6 space-y-4 pb-24">
        {mockReports.map((report) => (
          <div key={report.id} className="bg-zinc-900/40 rounded-3xl border border-zinc-800/50 overflow-hidden group active:scale-[0.98] transition-all">
            <div className="p-5">
              {/* Header: Date & Status */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  <Calendar size={12} />
                  {report.date}
                </div>
                <span className={`text-[9px] font-black px-2 py-1 rounded border uppercase ${getStatusStyle(report.status)}`}>
                  {report.status}
                </span>
              </div>

              {/* Body: Title & Desc */}
              <h3 className="text-lg font-bold mb-1 text-zinc-200 group-hover:text-red-500 transition-colors">
                {report.title}
              </h3>
              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-4">
                {report.description}
              </p>

              {/* Footer: Stats & Action */}
              <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <MessageSquare size={14} className="text-zinc-600" />
                    <span className="text-xs font-bold">{report.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <MapPin size={14} className="text-zinc-600" />
                    <span className="text-[10px] font-bold uppercase">{report.impact}</span>
                  </div>
                </div>
                
                <button className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-tighter bg-blue-500/5 px-3 py-2 rounded-xl border border-blue-500/10 hover:bg-blue-500 hover:text-white transition-all">
                  <Eye size={14} />
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State (ถ้าไม่มีข้อมูล) */}
        {mockReports.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
             <div className="p-6 bg-zinc-900/30 rounded-full mb-4 border border-zinc-800">
                <History size={40} />
             </div>
             <p className="text-sm font-medium">ยังไม่มีประวัติการแจ้งเหตุ</p>
          </div>
        )}
      </div>
    </div>
  );
}