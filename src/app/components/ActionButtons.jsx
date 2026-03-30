'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react'; 
import Cookies from 'js-cookie'; 

export default function ActionButtons({ isLoggedIn }) {
    const router = useRouter();
    
    // ฟังก์ชันเช็ค Auth ถ้าผ่านให้เปลี่ยนหน้าไปที่ /sos
    const handleSOSClick = (path) => {
        const hasCookie = Cookies.get('user');

        if (!isLoggedIn && !hasCookie) {
            const confirmLogin = confirm(`🔒 กรุณาเข้าสู่ระบบก่อนกำเนินการ\nท่านต้องการไปหน้าเข้าสู่ระบบตอนนี้เลยไหม?`);
            if (confirmLogin) {
                router.push('/login');
            }
            return;
        }
        router.push(path); 
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
            {/* 🆘 ปุ่ม SOS */}
            <button 
                onClick={() => handleSOSClick('/sos')}
                className="bg-linear-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white py-3 rounded-xl font-bold text-[10px] border border-red-500 shadow-lg active:scale-95 transition-all"
            >
                🆘 ขอความช่วยเหลือ
            </button>


            {/* ปุ่มแจ้งเหตุภัยพิบัติ */}
            <button 
                onClick={() =>handleSOSClick('/report')}
                className="bg-linear-to-r from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 text-white py-3 rounded-xl font-bold text-[10px] border border-yellow-500 shadow-lg active:scale-95 transition-all"
            >
                🛡️ แจ้งเหตุภัยพิบัติ
            </button>
        </div>
    );
}