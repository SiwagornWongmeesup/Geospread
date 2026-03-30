'use client';
import { useState, useEffect } from 'react';
import NewsCard from './NewsCard'; 
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'; // นำเข้าเพื่อสั่งเด้งหน้า

export default function TabbedPanel({ incidents, setSelectedIncident, isLoggedIn }) {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false); //ใช้ State คุมสถานะ Auth
    
    
   useEffect(() => {
    const hasCookie = Cookies.get('user');
    
    // 🚩 ใช้ setTimeout เพื่อให้ React วาดรอบแรก (Mount) เสร็จก่อน 
    // แล้วค่อยเปลี่ยนสถานะ IsAuth ในเสี้ยววินาทีต่อมา
    const timer = setTimeout(() => {
        if (isLoggedIn || hasCookie) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }, 0); 

    // ล้าง Timer เมื่อ Component ปิดลง (กัน Memory Leak)
    return () => clearTimeout(timer);
}, [isLoggedIn]);
    
    const [activeTab, setActiveTab] = useState('help');
    
    const emergencyIncidents = incidents?.filter(i => i.type === 'emergency') || [];
    const emergencyCount = emergencyIncidents.length;

    return (
        <div className="flex flex-col h-full w-full bg-black/40 backdrop-blur-md">
            
            {/* ✨ 1. ส่วนหัว: Tabs ✨ */}
            <div className="flex border-b border-gray-800/80 pt-2 px-2 shrink-0 bg-gray-900/50">
                <button 
                    onClick={() => setActiveTab('help')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 ${
                        activeTab === 'help' ? 'text-red-500 border-red-500' : 'text-gray-500 border-transparent hover:text-gray-400'
                    }`}
                >
                    🚨 ช่วยเหลือ ({emergencyCount})
                </button>
                <button 
                    onClick={() => setActiveTab('news')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 ${
                        activeTab === 'news' ? 'text-red-500 border-red-500' : 'text-gray-500 border-transparent hover:text-gray-400'
                    }`}
                >
                    📰 ข่าวสาร
                </button>
            </div> 

            {/* ✨ 2. พื้นที่เนื้อหา ✨ */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                
                {activeTab === 'help' && (
                    <div className="space-y-3">
                        {/* 🚩 ใช้ตัวแปรเช็คสถานะรวม (isAuth) */}
                        {isAuth ? (
                            emergencyIncidents.length > 0 ? (
                                emergencyIncidents.map((incident) => (
                                    <div 
                                        key={incident._id} 
                                        className="p-3 bg-red-900/20 border border-red-700/30 rounded-xl cursor-pointer hover:bg-red-800/40 transition-all group shadow-md"
                                        onClick={() => setSelectedIncident(incident)}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">ด่วนมาก</span>
                                            <span className="text-gray-400 text-[10px]">1.2 กม.</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-red-400 mt-1">{incident.title}</h3>
                                        <p className="text-[10px] text-gray-400 line-clamp-2 mt-1">{incident.description}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center text-sm mt-6 italic">ไม่มีคำขอความช่วยเหลือด่วน</p>
                            )
                        ) : (
                            // 🔒 ส่วนคนยังไม่ Login
                            <div className="text-center py-10 px-4 bg-gray-900/30 rounded-2xl border border-gray-800 border-dashed">
                                <p className="text-gray-400 text-xs mb-4 italic">กรุณาเข้าสู่ระบบเพื่อดูรายละเอียดการขอความช่วยเหลือ</p>
                                <button 
                                    onClick={() => router.push('/login')}
                                    className="bg-red-600/20 text-red-500 text-[11px] px-4 py-2 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-all"
                                >
                                    เข้าสู่ระบบตอนนี้
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'news' && (
                    <div className="space-y-4">
                        <NewsCard />
                    </div>
                )}
            </div>
        </div>
    );
}