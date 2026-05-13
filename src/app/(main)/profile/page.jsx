'use client';

import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  MapPin,
  History,
  LogOut,
  ChevronRight,
  Award,
  Camera,
} from 'lucide-react';

export default function ProfilePage() {

  const [profileImage, setProfileImage] = useState(
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Fiew'
  );

  const fileInputRef = useRef(null);

  const user = {
    name: 'ศิวกร',
    role: 'Volunteer Elite',
    trustScore: 100, // 🔥 out of 100
    joinedDate: 'December 2025',
    stats: {
      reports: 12,
      helped: 3,
      impact: 85,
    },
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans pb-20">

      {/* HEADER */}
      <div className="relative h-32 bg-gradient-to-b from-red-900/40 to-black" />

      <div className="px-6 relative -top-14">

        {/* PROFILE */}
        <div className="flex flex-col items-center">

          <div className="relative">

            <div className="w-28 h-28 rounded-3xl bg-zinc-800 border-4 border-black overflow-hidden shadow-2xl">
              <img
                src={profileImage}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-1.5 rounded-xl border-4 border-black">
              <ShieldCheck size={16} className="text-white" />
            </div>

            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute top-0 right-0 bg-zinc-900 border border-zinc-700 p-2 rounded-xl hover:bg-zinc-800 transition"
            >
              <Camera size={14} />
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <h1 className="mt-4 text-2xl font-black italic tracking-tight">
            {user.name}
          </h1>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold bg-red-500/10 text-red-500 px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-widest">
              {user.role}
            </span>

            <span className="text-zinc-500 text-xs">
              • Joined {user.joinedDate}
            </span>
          </div>
        </div>

        {/* TRUST SCORE */}
        <div className="mt-8 bg-zinc-900/50 rounded-3xl p-6 border border-zinc-800 shadow-inner">

          <div className="flex justify-between items-end mb-4">

            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">
                Trust Score
              </p>

              <h2 className="text-3xl font-black text-emerald-500">
                {user.trustScore}/100
              </h2>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">
                Rank
              </p>

              <p className="text-sm font-bold text-zinc-300">
                Top Performer
              </p>
            </div>

          </div>

          {/* PROGRESS BAR */}
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
              style={{ width: `${user.trustScore}%` }}
            />
          </div>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3 mt-4">

          {[
            {
              label: 'Reports',
              value: user.stats.reports,
              icon: <MapPin size={14} />,
              color: 'text-blue-400',
            },
            {
              label: 'Helped',
              value: user.stats.helped,
              icon: <Award size={14} />,
              color: 'text-red-400',
            },
            {
              label: 'Impact',
              value: user.stats.impact,
              icon: <History size={14} />,
              color: 'text-emerald-400',
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center justify-center"
            >
              <span className={`mb-1 ${stat.color}`}>
                {stat.icon}
              </span>

              <span className="text-lg font-black">
                {stat.value}
              </span>

              <span className="text-[9px] text-zinc-500 uppercase font-bold">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* MENU */}
        <div className="mt-8 space-y-2">

          <p className="px-2 text-[12px] font-black text-zinc-500 uppercase mb-3">
            Activity Logs
          </p>

          {[
            {
              title: 'Incident History',
              icon: <History size={20} />,
              count: '12',
            },
            {
              title: 'Helped Cases',
              icon: <ShieldCheck size={20} />,
              count: '45',
            },
            {
              title: 'Volunteer Cases',
              icon: <Award size={20} />,
              count: '5',
            },
          ].map((item, i) => (
            <button
              key={i}
              className="w-full bg-zinc-900/40 p-4 rounded-2xl flex items-center justify-between border border-transparent hover:border-zinc-800 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-zinc-800 rounded-xl text-zinc-400">
                  {item.icon}
                </div>

                <span className="text-sm font-bold text-zinc-200">
                  {item.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-600">
                  {item.count}
                </span>
                <ChevronRight size={16} className="text-zinc-700" />
              </div>
            </button>
          ))}
        </div>

        {/* LOGOUT */}
        <button className="mt-10 w-full py-4 rounded-2xl border border-red-900/30 text-red-500 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/5 transition">

          <LogOut size={16} />
          Sign Out

        </button>

      </div>
    </div>
  );
}