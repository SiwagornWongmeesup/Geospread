'use client';

import { useState, useEffect } from 'react'; // 1. เพิ่ม useEffect เข้ามา
import Image from 'next/image';
import Link from 'next/link';
import { Bell, History, LogOut, User, Menu, X } from 'lucide-react';
import Cookies from 'js-cookie'; // 2. import js-cookie
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null); // เก็บข้อมูล User ไว้โชว์ชื่อ
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 3. ใช้ useEffect เช็คสถานะตอนหน้าเว็บโหลด
    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            setTimeout(() => {
           try {
                const parsedUser = JSON.parse(userCookie);
                setIsLoggedIn(true);
                setUserData(parsedUser);
            } catch (error) {
                console.error("Cookie ข้อมูลพัง:", error);
                Cookies.remove('user'); // ลบแม่งทิ้งเลยถ้าข้อมูลอ่านไม่ได้
            }
        }, 0);
          
        }
    }, []);

    // 4. ฟังก์ชันออกจากระบบ
    const handleLogout = async () => {
        try {
            // เรียก API Logout ฝั่ง Backend เพื่อล้าง HttpOnly Cookie
            await fetch('http://localhost:5000/api/users/logout', { 
                method: 'POST',
                credentials: 'include' 
            });
            
            // ล้าง Cookie ฝั่งหน้าบ้าน (ที่เก็บข้อมูล user)
            Cookies.remove('user');
            
            setIsLoggedIn(false);
            setUserData(null);
            setIsMobileMenuOpen(false);
            
            // กลับไปหน้า Login หรือ Home
            router.push('/');
            router.refresh(); // บังคับให้หน้าเว็บโหลดใหม่เพื่อเคลียร์สถานะทั้งหมด
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <nav className="bg-black/95 backdrop-blur-sm text-white z-100 relative border-b border-red-900/30">
            <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
                
                {/* 🚩 ฝั่งซ้าย: Logo เหมือนเดิม */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 transform group-hover:scale-110 transition-transform">
                        <Image src="/Geospread.png" alt="GeoSpread Logo" fill className="object-contain" sizes="40px" />
                    </div>
                    <h1 className="text-xl font-black text-red-600 tracking-tighter uppercase">GeoSpread</h1>
                </Link>

                {/* 🛠️ ฝั่งขวา (Desktop) */}
                <div className="hidden md:flex items-center gap-6">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-5">
                            <Link href="/requests">
                                <button className="relative p-1 hover:bg-gray-800 rounded-full transition-colors group">
                                    <Bell size={22} className="text-gray-400 group-hover:text-red-500" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full border-2 border-black"></span>
                                </button>
                            </Link>
                            <Link href="/history" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white">
                                <History size={18} />
                                <span>ประวัติแจ้งเหตุ</span>
                            </Link>
                            <div className="w-px h-6 bg-gray-800"></div>
                            
                            {/* แสดงชื่อย่อหรือชื่อจริง */}
                            <span className="text-sm font-medium text-gray-300">
                                {userData?.name}
                            </span>

                            <Link href="/profile" className="w-9 h-9 bg-linear-to-tr from-red-900 to-red-600 rounded-full border border-red-500 flex items-center justify-center">
                                <User size={20} />
                            </Link>
                            
                            {/* 5. เปลี่ยนมาใช้ handleLogout ที่เราสร้างไว้ */}
                            <button onClick={handleLogout} className="p-2 hover:text-red-500 transition-all">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="text-sm font-medium hover:text-red-500">เข้าสู่ระบบ</Link>
                            <Link href="/register" className="px-4 py-2 text-sm font-bold bg-red-600 hover:bg-red-700 rounded-full shadow-lg">สมัครสมาชิก</Link>
                        </div>
                    )}
                </div>

                {/* 📱 ฝั่งขวา (Mobile) */}
                <div className='md:hidden'>
                    {!isLoggedIn ? (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className="text-[13px] font-medium px-2 py-1.5 hover:text-red-500 transition-colors">เข้าสู่ระบบ</Link>
                            <Link href="/register" className="text-[13px] font-bold bg-red-600 px-3 py-1.5 rounded-full shadow-md">สมัครสมาชิก</Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/profile" className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center border border-red-400">
                                <User size={18} />
                            </Link>
                            <button className="p-1 text-gray-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 📋 Mobile Dropdown Menu */}
            {isLoggedIn && isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-black/98 border-b border-red-900/50 p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl mb-2 border border-gray-800/50">
                        {/* 6. ใช้ตัวอักษรแรกจากชื่อจริงที่ดึงมาจาก Cookie */}
                        <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                            {userData?.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{userData?.name}</p>
                            <p className="text-[10px] text-gray-500">สถานะ: {userData?.role}</p>
                        </div>
                    </div>
                    {/* ... ลิงก์อื่นๆ เหมือนเดิม ... */}
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-500/10 rounded-lg mt-2 border-t border-gray-800 pt-4"
                    >
                        <LogOut size={20} /> <span>ออกจากระบบ</span>
                    </button>
                </div>
            )}
        </nav>
    );
}