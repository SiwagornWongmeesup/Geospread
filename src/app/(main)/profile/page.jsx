'use client';

import React from 'react';
import Link from 'next/link';
import { 
  User, 
  ShieldCheck, 
  MapPin, 
  History, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Award 
} from 'lucide-react';

export default function ProfilePage() {
  // สมมติข้อมูล User (เดี๋ยวบอสดึงจาก Cookies/Context มาใส่นะ)
  const user = {
    name: "Fiew Tech",
    role: "Volunteer Elite",
    trustScore: 850,
    joinedDate: "ธันวาคม 2025",
    stats: {
      reports: 12,
      helped: 45,
      impact: "1.2k"
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans pb-20">
      
      {/* 1. Header & Cover Area */}
      <div className="relative h-20 bg-gradient-to-b from-red-900/40 to-black  ">
        <div className="absolute top-6 right-6 flex gap-3">
        </div>
      </div>

      {/* 2. User Info Card */}
      <div className="px-6 relative -top-12">
        <div className="flex flex-col items-center">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-zinc-800 border-4 border-black overflow-hidden shadow-2xl">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Fiew" 
                alt="profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-1.5 rounded-xl border-4 border-black">
              <ShieldCheck size={16} className="text-white" />
            </div>
          </div>

          {/* Name & Badge */}
          <h1 className="mt-4 text-2xl font-black italic tracking-tight">{user.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold bg-red-500/10 text-red-500 px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-widest">
              {user.role}
            </span>
            <span className="text-zinc-500 text-xs">• Joined {user.joinedDate}</span>
          </div>
        </div>

        {/* 3. Trust Score Section */}
        <div className="mt-8 bg-zinc-900/50 rounded-3xl p-6 border border-zinc-800 shadow-inner">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">Trust Score</p>
              <h2 className="text-3xl font-black text-emerald-500">{user.trustScore}</h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">Rank</p>
              <p className="text-sm font-bold text-zinc-300">Top 5% in Area</p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
              style={{ width: '85%' }}
            ></div>
          </div>
        </div>

        {/* 4. Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Reports', value: user.stats.reports, icon: <MapPin size={14}/>, color: 'text-blue-400' },
            { label: 'Helped', value: user.stats.helped, icon: <Award size={14}/>, color: 'text-red-400' },
            { label: 'Impact', value: user.stats.impact, icon: <History size={14}/>, color: 'text-emerald-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center justify-center">
              <span className={`mb-1 ${stat.color}`}>{stat.icon}</span>
              <span className="text-lg font-black">{stat.value}</span>
              <span className="text-[9px] text-zinc-500 uppercase font-bold">{stat.label}</span>
            </div>
          ))}
        </div>

        {!user.isVolunteer && (
          <div className="mt-6 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-5 shadow-lg shadow-red-900/20 border border-white/10 relative overflow-hidden group active:scale-95 transition-all cursor-pointer">
            {/* Background Decor */}
            <div className="absolute right-[-5%] top-[-15%] opacity-20 group-hover:scale-110 transition-transform text-white">
                <ShieldCheck size={100} />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-lg font-black italic text-white uppercase tracking-tighter">Become a Hero</h3>
              <p className="text-[11px] text-white/80 mb-4 max-w-[200px]">สมัครเป็นอาสาสมัครกู้ภัย เพื่อรับสิทธิ์เข้าช่วยเหลือและเพิ่ม Trust Score</p>
              
              <Link href="/profile/register-volunteer">
                <button className="bg-white text-red-600 px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-zinc-100 transition-colors">
                  สมัครตอนนี้
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* 5. Menu List */}
        <div className="mt-8 space-y-2">
          <p className="px-2 text-[12px] font-black text-zinc-500 uppercase mb-3">บันทึกทั่วไป</p>
          
          {[
            { title: 'ประวัติการแจ้งเหตุ', icon: <History size={20}/>, count: '12' },
            { title: 'เคสที่รับช่วยเหลือ', icon: <ShieldCheck size={20}/>, count: '45' },
            { title: 'เคสที่เสนอตัวช่วยเหลือ', icon: <div className="text-emerald-500"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 11 3 3-3 3"/><path d="M10 10 5 7 3 9l3 6 7 5 9-7V8l-4-4z"/><path d="m7.1 13 4.6-4.6"/><path d="m9.2 15.1 4.6-4.6"/><path d="m11.3 17.2 4.6-4.6"/></svg></div>, 
              count: '5' },
    
          ].map((item, i) => (
            <button key={i} className="w-full bg-zinc-900/40 p-4 rounded-2xl flex items-center justify-between border border-transparent hover:border-zinc-800 active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-zinc-800 rounded-xl text-zinc-400">{item.icon}</div>
                <span className="text-sm font-bold text-zinc-200">{item.title}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.count && <span className="text-xs font-bold text-zinc-600">{item.count}</span>}
                <ChevronRight size={16} className="text-zinc-700" />
              </div>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button className="mt-10 w-full py-4 rounded-2xl border border-red-900/30 text-red-500 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/5">
          <LogOut size={16} />
          Sign Out From Geospread
        </button>
      </div>
    </div>
  );
}