'use client';
import React, { useState, useEffect } from 'react'; // เพิ่ม useEffect
import { Mail, Lock, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // 🚩 ตรวจสอบสถานะ: ถ้าล็อกอินอยู่แล้ว ให้ดีดไปหน้าแรกทันที
  useEffect(() => {
    const user = Cookies.get('user');
    if (user) {
      router.replace('/'); 
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(), // ล้างช่องว่างป้องกันความผิดพลาด
          password: formData.password
        }),
        credentials: 'include', // รับ HttpOnly Cookie จาก Backend
      });

      const data = await response.json();

      if (response.ok) {
        // เก็บข้อมูล User เบื้องต้นใน Client-side Cookie (เพื่อโชว์ชื่อ/สถานะ)
        Cookies.set('user', JSON.stringify(data.user), { expires: 1 }); 

        alert('เข้าสู่ระบบสำเร็จ!');
        router.replace('/'); 
        router.refresh(); // บังคับให้ Server Components/Navbar โหลดใหม่เพื่อรับค่าสถานะล่าสุด
      } else {
        alert(data.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-black text-white flex items-center justify-center p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-black to-black">
      <div className="w-full max-w-[440px] space-y-7 bg-gray-900/40 p-8 sm:p-10 rounded-[2rem] border border-white/5 backdrop-blur-xl shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">
            GEO<span className="text-red-600 animate-pulse">SPREAD</span>
          </h2>
          <p className="text-gray-400 text-sm font-medium">ยินดีต้อนรับกลับเข้าสู่ระบบ</p>
        </div>

        {/* Google Login (ปุ่ม Mockup) */}
        <button 
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-3.5 rounded-2xl font-bold hover:bg-gray-200 active:scale-[0.98] transition-all duration-200 shadow-lg"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-sm">Sign in with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center py-1">
          <div className="grow border-t border-gray-800"></div>
          <span className="shrink mx-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">หรือใช้บัญชีของคุณ</span>
          <div className="grow border-t border-gray-800"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-all z-10" size={18} />
            <input 
              required 
              name="email" 
              type="email" 
              placeholder=" "
              onChange={handleChange}
              className="peer w-full bg-gray-800/30 border border-gray-700/50 p-4 pl-12 rounded-2xl focus:border-red-600 outline-none transition-all placeholder-transparent text-sm"
            />
            <label className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all pointer-events-none 
              peer-focus:-top-1 peer-focus:left-4 peer-focus:text-[10px] peer-focus:text-red-500
              peer-[:not(:placeholder-shown)]:-top-1 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[10px]">
              อีเมลของคุณ
            </label>
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-all z-10" size={18} />
            <input 
              required 
              name="password" 
              type="password" 
              placeholder=" "
              onChange={handleChange}
              className="peer w-full bg-gray-800/30 border border-gray-700/50 p-4 pl-12 rounded-2xl focus:border-red-600 outline-none transition-all placeholder-transparent text-sm"
            />
            <label className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all pointer-events-none 
              peer-focus:-top-1 peer-focus:left-4 peer-focus:text-[10px] peer-focus:text-red-500
              peer-[:not(:placeholder-shown)]:-top-1 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[10px]">
              รหัสผ่าน
            </label>
          </div>

          <button 
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg shadow-red-900/20 disabled:bg-gray-700"
          >
            {isLoading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"} <LogIn size={18} />
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          ยังไม่มีบัญชี? <Link href="/register" className="text-red-500 font-bold hover:underline">สมัครสมาชิกฟรี</Link>
        </p>
      </div>
    </div>
  );
}