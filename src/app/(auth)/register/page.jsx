'use client';
import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // 1. เช็คความครบถ้วน
    if (!formData.name || !formData.email || !formData.password) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // 2. เช็คความยาวรหัสผ่าน (ต้องใช้ .length)
    if (formData.password.length < 8) {
      alert("กรุณากรอกรหัสผ่านอย่างน้อย 8 ตัว");
      return;
    }

    // 3. เช็คการยอมรับเงื่อนไข
    if (!acceptTerms) {
      alert('กรุณายอมรับเงื่อนไขการใช้งาน');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('สมัครสมาชิกสำเร็จ!');
        router.push('/login');
      } else {
        alert(data.message || data.detail || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-black text-white flex items-center justify-center p-4 sm:p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-black to-black">
      <div className="w-full max-w-[440px] space-y-8 bg-gray-900/40 p-6 sm:p-10 rounded-[2rem] border border-white/5 backdrop-blur-xl shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black tracking-tighter uppercase italic tracking-widest">
            GEO<span className="text-red-600 animate-pulse">SPREAD</span>
          </h2>
          <p className="text-gray-400 text-sm">ร่วมเป็นส่วนหนึ่งของเครือข่ายการช่วยเหลือ</p>
        </div>

        {/* Google Register */}
        <button type="button" className="w-full flex items-center justify-center gap-3 bg-white text-black py-3.5 rounded-xl font-bold hover:bg-gray-200 active:scale-[0.98] transition-all duration-200">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </button>

        <div className="relative flex items-center text-gray-800">
          <div className="grow border-t border-current"></div>
          <span className="shrink mx-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">หรือสมัครด้วยอีเมล</span>
          <div className="grow border-t border-current"></div>
        </div>

        <form onSubmit={handleRegister} className="space-y-7">
          {[
            { label: 'ชื่อผู้ใช้งาน', name: 'name', type: 'text', icon: User },
            { label: 'อีเมล', name: 'email', type: 'email', icon: Mail },
            { label: 'รหัสผ่าน', name: 'password', type: 'password', icon: Lock },
          ].map((field) => (
            <div key={field.name} className="relative group">
              <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-all z-20" size={18} />
              <input 
                required
                name={field.name}
                type={field.type} 
                placeholder=" " 
                onChange={handleChange}
                className="peer w-full bg-gray-800/30 border border-gray-700/50 p-4 pl-12 rounded-2xl focus:border-red-600 focus:bg-gray-800/80 outline-none transition-all duration-300 placeholder-transparent text-sm z-10"
              />
              <label className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-300 pointer-events-none z-20
                peer-focus:-top-2 peer-focus:left-4 peer-focus:text-[10px] peer-focus:text-red-500 peer-focus:font-bold
                peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-red-400">
                {field.label}
              </label>
            </div>
          ))}

          {/* Checkbox ส่วนที่แก้ไข */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center mt-1">
              <input
                type="checkbox"
                required
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)} // 👈 เพิ่ม onChange ตรงนี้
                className="peer appearance-none w-5 h-5 border-2 border-gray-700 rounded-md bg-transparent 
                           checked:bg-red-600 checked:border-red-600 transition-all duration-200 cursor-pointer"
              />
              <svg 
                className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity" 
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span className="text-sm text-gray-400 leading-tight select-none">
              ฉันยอมรับ{' '}
              <Link href="/terms" target="_blank" className="text-red-500 hover:text-red-400 font-bold underline underline-offset-4 decoration-red-900/50 transition-colors">
                เงื่อนไขการใช้งาน
              </Link>
              {' '}และนโยบายความเป็นส่วนตัว
            </span>
          </label>

          <button 
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-700 py-4 rounded-2xl font-black text-sm uppercase tracking-widest mt-2 flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-[0_10px_20px_rgba(220,38,38,0.2)]"
          >
            {isLoading ? "กำลังประมวลผล..." : "สร้างบัญชีใหม่"}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 font-medium pt-2">
          มีบัญชีอยู่แล้ว? <Link href="/login" className="text-red-500 hover:text-red-400 font-bold transition-colors underline-offset-4 hover:underline">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
}