'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Sidebar from '.././components/Sidebar';
import ActionButtons from '.././components/ActionButtons.jsx';
import TabbedPanel from '.././components/TabbedPanel.jsx';
import Cookies from 'js-cookie'; 
import { Navigation, Phone, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MapArea = dynamic(() => import('../components/MapArea'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
            <p className="text-red-500 font-bold animate-pulse">กำลังโหลดแผนที่ Geospread...</p>
        </div>
    )
});

export default function GeospreadMap() {
    const [incidents, setIncidents] = useState([]);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const router = useRouter();

    const mapRef = useRef(null);
    const userLat = 13.6125;
    const userLng = 100.7482;
    const searchRadius = 50;

    // เช็คสถานะ Login
  useEffect(() => {
        const userData = Cookies.get('user');
        
        if (userData) {
            try {
                const user = JSON.parse(userData);

                // ✅ แก้ไข: เขียน setIsLoggedIn ให้ถูกต้องใน setTimeout
                // ใช้ 0 เพื่อให้รันต่อจากคิวหลักของ React
                setTimeout(() => {
                    setIsLoggedIn(true);
                }, 0);

                // 🚦 เช็ค Role
                if (user.role === 'admin') {
                   router.push('/admin-panel');
                }
            } catch (error) {
                console.error("แกะกล่อง JSON ไม่สำเร็จ:", error);
            }
        } else {
          setTimeout(() => {
                    setIsLoggedIn(false);
                }, 0);
        }
    }, []);

    

    // ดึงข้อมูลเหตุการณ์
    useEffect(() => {
        const fetchIncidents = async () => {
            if (!userLat || !userLng) return;
            try {
                const response = await fetch(`http://localhost:5000/api/incidents?latitude=${userLat}&longitude=${userLng}&radius=${searchRadius}`, {
                    credentials: 'include' 
                });
                const result = await response.json();
                if (result.success) setIncidents(result.data);
            } catch (error) { 
                console.error("Fetch error:", error); 
            }
        };
        fetchIncidents();
    }, [userLat, userLng]);

    const handleOfferHelp = async (incidentId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/incidents/${incidentId}/offer`, {
                method: 'PUT',
                credentials: 'include'
            });
            if (response.ok) { 
                const result = await response.json();
                alert("✅ เสนอตัวช่วยเหลือสำเร็จ!"); 

                setIncidents(prev => prev.map(inc => 
                    inc._id === incidentId ? result.data : inc
                ));

                setSelectedIncident(null); 
            }
        } catch (error) { console.error(error); }
    };

    const handleLike = async (incidentId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/incidents/${incidentId}/like`, {
            method: 'PUT',
            credentials: 'include'
        });

        if (response.ok) {
            // อัปเดตเลขไลก์ในถังข้อมูลหลัก (incidents)
            setIncidents(prev => prev.map(inc => 
                inc._id === incidentId ? { ...inc, likes: (inc.likes || 0) + 1 } : inc
            ));
            
            // ถ้ากำลังเปิด Popup อันนี้อยู่ ก็อัปเดตตัวที่เลือกด้วย
            setSelectedIncident(prev => 
                prev && prev._id === incidentId ? { ...prev, likes: (prev.likes || 0) + 1 } : prev
            );
        }
    } catch (error) {
        console.error("Like error:", error);
    }
};

    return (
        <div className="flex flex-col h-screen w-full bg-black text-white overflow-hidden font-sans">
            <main className="flex-1 flex overflow-hidden relative w-full">
                
                {/* 1. Sidebar (PC Only) */}
                <Sidebar 
                    isSidebarOpen={isSidebarOpen} 
                    incidents={incidents} 
                    setSelectedIncident={setSelectedIncident} 
                    isLoggedIn={isLoggedIn} 
                />

                {/* 🗺️ 2. ส่วนแสดงผลหลัก (Map + Bottom UI) */}
                <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden"> 
                    
                    {/* ปุ่มเปิด/ปิด Sidebar (PC Only) */}
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-40 w-6 h-12 bg-red-900/90 backdrop-blur-md border border-red-500/50 border-l-0 rounded-r-lg items-center justify-center"
                    >
                        <span className={`transition-transform ${isSidebarOpen ? '' : 'rotate-180'}`}>◀</span>
                    </button>

                    {/* 📍 ส่วนของแผนที่: ใช้ flex-1 เพื่อให้ขยายพื้นที่เต็มที่ */}
                    <div className="flex-1 w-full relative z-0 min-h-0">
                        <MapArea 
                            mapRef={mapRef}
                            incidents={incidents}
                            selectedIncident={selectedIncident}
                            setSelectedIncident={setSelectedIncident}
                            userLng={userLng}
                            userLat={userLat}
                            handleOfferHelp={handleOfferHelp}
                            isSidebarOpen={isSidebarOpen}
                            handleLike={handleLike}
                        />
                    </div>

                    {/* 📱 3. ส่วนควบคุมด้านล่าง (Mobile Only) */}
                    <div className="md:hidden bg-zinc-950 border-t border-red-900/50 shrink-0 z-50">
                        {selectedIncident ? (
                /* 🚨 [โหมด A] เมื่อจิ้มหมุดบนมือถือ: แสดงรายละเอียด + ข้อมูล Report + ปุ่ม Action */
                <div className="p-6 animate-in slide-in-from-bottom duration-300">
                    
                    {/* 1. ส่วนหัว: Emoji + ชื่อเรื่อง + Badge สถานะ/Severity */}
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-black text-white italic truncate mr-2">
                            {selectedIncident.type === 'sos' ? '🚨' : '📊'} {selectedIncident.title}
                        </h3>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase border ${
                            selectedIncident.type === 'sos' 
                            ? 'text-red-500 bg-red-500/10 border-red-500/20' 
                            : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                        }`}>
                            {selectedIncident.type === 'sos' ? selectedIncident.severity : 'Active'}
                        </span>
                    </div>

                   

                    {/* 2. คำอธิบาย: จำกัดบรรทัดเพื่อไม่ให้ดันปุ่มตกจอ */}
                    <p className="text-xs text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
                        {selectedIncident.description}
                    </p>

                     {/* 3. Metadata: ชื่อผู้แจ้ง และ เวลา (สำคัญมากสำหรับมือถือ) */}
                    {(selectedIncident.reporterID?.name || selectedIncident.createdAt) && (
                        <div className="flex justify-between text-[12px] text-zinc-500 mb-3 italic">
                            <span>👤 {selectedIncident.type === 'sos' ? 'ผู้ร้องขอ:' : 'โดย:'} {selectedIncident.reporterID?.name || 'ไม่ระบุชื่อ'}</span>
                            <span>🕒 {selectedIncident.createdAt 
                                ? new Date(selectedIncident.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
                                : '--:--'}</span>
                        </div>
                    )}

                    {/* 4. สถิติเฉพาะ Report (โชว์แบบแถวเดียวประหยัดพื้นที่) */}
                    {selectedIncident.type === 'report' && (
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            <div className="bg-zinc-900/50 p-2 rounded-xl border border-white/5 flex justify-between items-center px-3">
                                <span className="text-[8px] text-zinc-500 uppercase font-black">Reliability</span>
                                <span className="text-yellow-500 text-[10px] font-bold">⭐️ 4.5</span>
                            </div>
                            <div className="bg-zinc-900/50 p-2 rounded-xl border border-white/5 flex justify-between items-center px-3">
                                <span className="text-[8px] text-zinc-500 uppercase font-black">Impact</span>
                                <span className="text-blue-400 text-[10px] font-bold">
                                    {selectedIncident.impact === 'wide' ? 'วงกว้าง' : 'ปานกลาง'}
                                </span>
                            </div>
                        </div>
                    )}
                    
                    {/* 5. แผงปุ่มกด: แยกตามประเภท SOS / Report */}
                    <div className="flex gap-3">
                        {selectedIncident.type === 'sos' ? (
                            <button 
                                onClick={() => handleOfferHelp(selectedIncident._id)} 
                                className="flex-1 py-4 bg-red-600 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-red-900/40 active:scale-95 text-white"
                            >
                                รับเคสช่วยเหลือ
                            </button>
                        ) : (
                            <>
                                {/* ปุ่มนิ้วโป้งสำหรับ Report */}
                                <button 
                                    onClick={() => handleLike(selectedIncident._id)}
                                    className="flex-1 py-4 bg-emerald-600/20 text-emerald-500 rounded-2xl text-[10px] font-black uppercase border border-emerald-500/30 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    👍 ({selectedIncident.likes || 0})
                                </button>
                                {/* ปุ่มแชร์สำหรับ Report */}
                                <button 
                                    onClick={() => {/* Logic Share เหมือนเดิม */}}
                                    className="w-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 border border-zinc-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                                </button>
                            </>
                        )}

                        {/* ปุ่มนำทาง (มาตรฐาน) */}
                        <button 
                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedIncident.location.coordinates[1]},${selectedIncident.location.coordinates[0]}`, '_blank')}
                            className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-blue-500 border border-zinc-700 shadow-md"
                        >
                            <Navigation size={22} />
                        </button>
                    </div>
                </div>
            ) : (
                            /* 🆘 [โหมด B] ถ้ายังไม่กดหมุด: โชว์ปุ่ม SOS / ข่าวสาร */
                            <div className="flex flex-col">
                                <div className="p-5 border-b border-white/5">
                                    <ActionButtons isLoggedIn={isLoggedIn} />
                                </div>
                                <div className="h-[200px] overflow-hidden">
                                    <TabbedPanel incidents={incidents} setSelectedIncident={setSelectedIncident} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}