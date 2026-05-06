'use client';

import { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import ActionButtons from './ActionButtons'; 

export default function TabbedPanel({ setSelectedIncident, isLoggedIn }) {
    const router = useRouter();

    const [isAuth, setIsAuth] = useState(false);
    const [activeTab, setActiveTab] = useState('help');

    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(false);

    const [userLocation, setUserLocation] = useState({
        lat: null,
        lng: null
    });

    // ================= AUTH =================
    useEffect(() => {
        const hasCookie = Cookies.get('user');

        const timer = setTimeout(() => {
            setIsAuth(isLoggedIn || hasCookie);
        }, 0);

        return () => clearTimeout(timer);
    }, [isLoggedIn]);

    // ================= LOCATION =================
    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
            },
            (err) => console.error(err),
            { enableHighAccuracy: true }
        );
    }, []);

    // ================= FETCH =================
    useEffect(() => {
        const fetchIncidents = async () => {
            if (!userLocation.lat || !userLocation.lng) return;

            setLoading(true);

            try {
                const res = await fetch(
                    `http://localhost:5000/api/incidents?latitude=${userLocation.lat}&longitude=${userLocation.lng}&radius=15000`,
                    { credentials: 'include' }
                );

                const data = await res.json();

                if (data.success) {
                    setIncidents(data.data || []);
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchIncidents();
    }, [userLocation]);

    const emergencyIncidents = incidents.filter(
        (i) => i.severity === 'critical' || i.type === 'emergency' || i.type === 'sos'
    );

    return (
        <div className="flex flex-col h-full w-full bg-black/40 backdrop-blur-md">

            {/* ================= TAB ================= */}
            <div className="flex border-b border-gray-800/80 pt-2 px-2 shrink-0 bg-gray-900/50">

                <button
                    onClick={() => setActiveTab('help')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 ${
                        activeTab === 'help'
                            ? 'text-red-500 border-red-500'
                            : 'text-gray-500 border-transparent'
                    }`}
                >
                    🚨 คำขอช่วยเหลือ ({emergencyIncidents.length})
                </button>

                <button
                    onClick={() => setActiveTab('news')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 ${
                        activeTab === 'news'
                            ? 'text-red-500 border-red-500'
                            : 'text-gray-500 border-transparent'
                    }`}
                >
                    📰 รายงานสถานการณ์
                </button>
            </div>

            {/* ================= CONTENT ================= */}
            <div className="flex flex-col flex-1 min-h-0">

                {/* SCROLL AREA */}
                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">

                    {activeTab === 'help' && (
                        <div className="space-y-3">

                            {loading && (
                                <div className="text-center text-gray-500 text-sm py-10">
                                    🔄 กำลังโหลด...
                                </div>
                            )}

                            {!isAuth ? (
                                <div className="text-center py-10 px-4 bg-gray-900/30 rounded-2xl border border-gray-800 border-dashed">
                                    <p className="text-gray-400 text-xs mb-4 italic">
                                        กรุณาเข้าสู่ระบบเพื่อดูรายละเอียด
                                    </p>
                                    <button
                                        onClick={() => router.push('/login')}
                                        className="bg-red-600/20 text-red-500 text-[11px] px-4 py-2 rounded-lg font-bold"
                                    >
                                        เข้าสู่ระบบ
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {emergencyIncidents.map((incident) => (
                                        <div
                                            key={incident._id}
                                            onClick={() => setSelectedIncident(incident)}
                                            className="p-3 bg-[#151515] border border-gray-800 rounded-xl cursor-pointer"
                                        >
                                            <div className="flex justify-between mb-1">
                                                <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded">
                                                    {incident.type}
                                                </span>
                                                <span className="text-[10px] text-gray-500">
                                                    {incident.distance
                                                        ? (incident.distance / 1000).toFixed(1) + ' km'
                                                        : '--'}
                                                </span>
                                            </div>

                                            <h3 className="text-sm font-bold text-white">
                                                {incident.title}
                                            </h3>

                                            <p className="text-[11px] text-gray-400">
                                                {incident.description}
                                            </p>

                                             <div className="flex justify-between mt-2 text-[10px] text-gray-600">
                                                <span>📍 sos</span>
                                                <span>
                                                    🕒 {new Date(incident.createdAt).toLocaleString()}
                                                </span>
                                            </div>

                                        </div>
                                    ))}
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

                

                {/* ================= FIXED BOTTOM BUTTON ================= */}
           

            </div>
        </div>
    );
}