'use client';

import React, { useState } from 'react';
import { ChevronLeft, Camera, ShieldCheck, MapPin, Tooltip, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterVolunteer() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    skills: [],
    experience: ''
  });

  const skillsList = ["ปฐมพยาบาล", "กู้ภัยทางน้ำ", "ดับเพลิง", "ช่างยนต์", "โดรนค้นหา"];

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill) 
        : [...prev.skills, skill]
    }));
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans pb-10">
      
      {/* 1. Header Area */}
      <div className="p-6 flex items-center gap-4 border-b border-zinc-900 sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <Link href="/profile">
          <button className="p-2 bg-zinc-900 rounded-xl text-zinc-400">
            <ChevronLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-black italic text-red-500 uppercase tracking-tighter">Volunteer Registry</h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">ลงทะเบียนเพื่อเป็นฮีโร่ Geospread</p>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto">
        
        {/* 2. Step Indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]' : 'bg-zinc-800'}`} />
          ))}
        </div>

        {/* 3. Form Content */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-black mb-2 italic">ข้อมูลส่วนตัว</h2>
            <p className="text-xs text-zinc-500 mb-6 font-medium">กรุณากรอกข้อมูลจริงเพื่อใช้ในการยืนยันตัวตน</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 mb-1 block">Full Name (ชื่อ-นามสกุล)</label>
                <input 
                  type="text" 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                  placeholder="เช่น นายสมชาย สายลุย"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 mb-1 block">Phone Number (เบอร์ติดต่อ)</label>
                <input 
                  type="tel" 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm focus:border-red-500 outline-none"
                  placeholder="08X-XXX-XXXX"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-black mb-2 italic">ความสามารถพิเศษ</h2>
            <p className="text-xs text-zinc-500 mb-6 font-medium">เลือกทักษะที่บอสมี เพื่อให้เราส่งเคสได้ถูกต้อง</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {skillsList.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    formData.skills.includes(skill) 
                    ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/20' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 mb-1 block">ประสบการณ์กู้ภัย (ถ้ามี)</label>
            <textarea 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm h-32 outline-none focus:border-red-500"
              placeholder="ระบุประสบการณ์ หรือหน่วยงานที่เคยสังกัด..."
            />
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right duration-300 text-center">
            <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
              <Camera size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-black mb-2 italic">ยืนยันตัวตน</h2>
            <p className="text-xs text-zinc-500 mb-8 font-medium italic">กรุณาถ่ายรูปคู่กับบัตรประชาชน หรือบัตรอาสาสมัคร</p>
            
            <div className="aspect-video w-full bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center gap-3 group hover:border-red-500/50 transition-colors cursor-pointer">
              <div className="p-3 bg-zinc-800 rounded-full text-zinc-500 group-hover:text-red-500 transition-colors">
                <Camera size={24} />
              </div>
              <span className="text-[10px] font-black uppercase text-zinc-600">Click to Upload Photo</span>
            </div>

            <div className="mt-6 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 flex items-start gap-3 text-left">
              <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                ข้อมูลของท่านจะถูกเก็บเป็นความลับและใช้เพื่อการตรวจสอบสิทธิ์การเป็นอาสาสมัครในระบบ Geospread เท่านั้น
              </p>
            </div>
          </div>
        )}

        {/* 4. Action Buttons */}
        <div className="mt-10 flex gap-3">
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="flex-1 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all"
            >
              Back
            </button>
          )}
          
          <button 
            onClick={() => step < 3 ? setStep(step + 1) : alert('ส่งข้อมูลสำเร็จ! รอการตรวจสอบ')}
            className="flex-[2] py-4 bg-red-600 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-red-900/40 active:scale-95 transition-all"
          >
            {step === 3 ? 'Submit Application' : 'Next Step'}
          </button>
        </div>

      </div>
    </div>
  );
}