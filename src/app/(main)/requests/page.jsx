'use client';

import React from 'react';
import { ChevronLeft, ShieldCheck, Star, MapPin, Check, X, Phone } from 'lucide-react';

export default function VolunteerRequests({ volunteers = [], onAccept, onReject, onBack }) {
  // สมมติข้อมูลจำลอง (เดี๋ยวบอสดึงจาก incident.volunteers ใน DB นะบอส)
  const mockVolunteers = [
    {
      id: "v1",
      name: "พี่สมชาย สายบู๊",
      trustScore: 950,
      distance: "1.2 กม.",
      status: "pending",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai",
      bio: "กู้ภัยอาสา ประสบการณ์ 5 ปี มีอุปกรณ์ปฐมพยาบาลครบครับ"
    },
    {
      id: "v2",
      name: "น้องบี ไอที",
      trustScore: 420,
      distance: "300 เมตร",
      status: "pending",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bee",
      bio: "อยู่ใกล้ๆ ตรงนี้เลยครับ ไปช่วยดูสถานการณ์เบื้องต้นได้"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans pb-20">
      
      {/* 1. Header: เน้นความด่วน */}
      <div className="p-6 bg-red-600/10 border-b border-red-500/20 sticky top-0 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-black/40 rounded-xl text-white">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black italic text-red-500 uppercase tracking-tighter">Volunteer Inbox</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">มีคนเสนอตัวช่วย {mockVolunteers.length} รายการ</p>
          </div>
        </div>
      </div>

      {/* 2. List Area */}
      <div className="p-6 space-y-4">
        {mockVolunteers.map((vol) => (
          <div key={vol.id} className="bg-zinc-900/60 rounded-3xl border border-zinc-800 p-5 relative overflow-hidden group">
            
            {/* Background Decor (แต้มบุญสูงจะเรืองแสง) */}
            {vol.trustScore > 800 && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl -z-10" />
            )}

            <div className="flex gap-4">
              {/* Profile Image */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 overflow-hidden">
                  <img src={vol.avatar} alt="volunteer" className="w-full h-full object-cover" />
                </div>
                {vol.trustScore > 700 && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 p-1 rounded-lg border-2 border-zinc-900">
                    <ShieldCheck size={12} className="text-white" />
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-black truncate text-zinc-200">{vol.name}</h3>
                  <div className="flex items-center gap-1 bg-zinc-800 px-2 py-0.5 rounded-lg border border-zinc-700">
                    <Star size={10} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-black text-zinc-300">{vol.trustScore}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold mt-1">
                  <span className="flex items-center gap-1"><MapPin size={10}/> {vol.distance}</span>
                  <span>•</span>
                  <span className="text-emerald-500">พร้อมช่วยเหลือ</span>
                </div>

                <p className="mt-3 text-[11px] text-zinc-400 leading-relaxed italic border-l-2 border-zinc-800 pl-3">
                  "{vol.bio}"
                </p>
              </div>
            </div>

            {/* 3. Action Buttons: ยอมรับ หรือ ปฏิเสธ */}
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => onReject(vol.id)}
                className="flex-1 py-3 bg-zinc-800 rounded-xl text-[10px] font-black uppercase text-zinc-400 border border-zinc-700 hover:bg-zinc-700 transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  <X size={14} /> ปฏิเสธ
                </div>
              </button>
              
              <button 
                onClick={() => onAccept(vol.id)}
                className="flex-[2] py-3 bg-red-600 rounded-xl text-[10px] font-black uppercase text-white shadow-lg shadow-red-900/40 hover:bg-red-500 active:scale-95 transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  <Check size={14} /> ตอบรับความช่วยเหลือ
                </div>
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {mockVolunteers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 opacity-30">
            <div className="animate-pulse flex flex-col items-center">
               <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 mb-4" />
               <p className="text-xs font-black uppercase tracking-widest">Waiting for Heroes...</p>
               <p className="text-[10px] italic mt-2">กำลังรออาสาสมัครตอบรับ</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}