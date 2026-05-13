'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Sidebar from '../components/Sidebar';
import ActionButtons from '../components/ActionButtons.jsx';
import TabbedPanel from '../components/TabbedPanel.jsx';
import Cookies from 'js-cookie';
import { Navigation } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MapArea = dynamic(() => import('../components/MapArea'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
            <p className="text-red-500 font-bold animate-pulse">
                กำลังโหลดแผนที่ Geospread...
            </p>
        </div>
    )
});

export default function GeospreadMap() {
    const [incidents, setIncidents] = useState([]);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 📍 LOCATION STATE
    const [userLat, setUserLat] = useState(null);
    const [userLng, setUserLng] = useState(null);
    const [locationDenied, setLocationDenied] = useState(false);

    const router = useRouter();
    const mapRef = useRef(null);

    const searchRadius = 5000; // 5km

    // 🔐 CHECK LOGIN
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
                   router.push('/admin/dashboard');
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

    // 📍 GET USER LOCATION
    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLat(position.coords.latitude);
                setUserLng(position.coords.longitude);
            },
            (error) => {
                console.error("Location denied:", error);
                setLocationDenied(true);

                // fallback (สมุทรปราการ)
                setUserLat(13.6125);
                setUserLng(100.7482);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }, []);

    // 📦 FETCH INCIDENTS NEARBY
    useEffect(() => {
        const fetchIncidents = async () => {
            if (!userLat || !userLng) return;

            try {
                const response = await fetch(
                    `http://localhost:5000/api/incidents?latitude=${userLat}&longitude=${userLng}&radius=${searchRadius}`,
                    { credentials: 'include' }
                );

                const result = await response.json();

                if (result.success) {
                    setIncidents(result.data);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchIncidents();
    }, [userLat, userLng]);

    // 🤝 OFFER HELP
    const handleOfferHelp = async (incidentId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/incidents/${incidentId}/offer`,
                {
                    method: 'PUT',
                    credentials: 'include'
                }
            );

            if (response.ok) {
                const result = await response.json();

                setIncidents(prev =>
                    prev.map(inc =>
                        inc._id === incidentId ? result.data : inc
                    )
                );

                setSelectedIncident(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 👍 LIKE
    const handleLike = async (incidentId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/incidents/${incidentId}/like`,
                {
                    method: 'PUT',
                    credentials: 'include'
                }
            );

            if (response.ok) {
                setIncidents(prev =>
                    prev.map(inc =>
                        inc._id === incidentId
                            ? { ...inc, likes: (inc.likes || 0) + 1 }
                            : inc
                    )
                );

                setSelectedIncident(prev =>
                    prev && prev._id === incidentId
                        ? { ...prev, likes: (prev.likes || 0) + 1 }
                        : prev
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col h-screen w-full bg-black text-white overflow-hidden">

            {/* ⚠️ LOCATION WARNING */}
            {locationDenied && (
                <div className="absolute top-2 left-2 z-50 bg-red-900/40 text-red-400 text-xs p-2 rounded">
                    ⚠️ กรุณาเปิดตำแหน่งเพื่อใช้งานเต็มฟีเจอร์
                </div>
            )}

            <main className="flex-1 flex overflow-hidden relative">

                {/* SIDEBAR */}
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    incidents={incidents}
                    setSelectedIncident={setSelectedIncident}
                    isLoggedIn={isLoggedIn}
                />

                {/* MAIN */}
                <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">

                    {/* TOGGLE SIDEBAR */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-40 w-6 h-12 bg-red-900/90 border border-red-500/50 rounded-r-lg items-center justify-center"
                    >
                        ◀
                    </button>

                    {/* MAP */}
                    <div className="flex-1 w-full relative z-0">
                        <MapArea
                            mapRef={mapRef}
                            incidents={incidents}
                            selectedIncident={selectedIncident}
                            setSelectedIncident={setSelectedIncident}
                            userLng={userLng ?? 100.7482}
                            userLat={userLat ?? 13.6125}
                            handleOfferHelp={handleOfferHelp}
                            isSidebarOpen={isSidebarOpen}
                            handleLike={handleLike}
                        />
                    </div>

                    {/* MOBILE PANEL */}
                    <div className="md:hidden bg-zinc-950 border-t border-red-900/50">

                        {selectedIncident ? (
                            <div className="p-6">

                                <h3 className="text-lg font-bold">
                                    {selectedIncident.title}
                                </h3>

                                <p className="text-xs text-gray-400 mt-2">
                                    {selectedIncident.description}
                                </p>

                                <div className="flex gap-3 mt-4">

                                    <button
                                        onClick={() => handleLike(selectedIncident._id)}
                                        className="flex-1 bg-emerald-600/20 text-emerald-500 p-2 rounded"
                                    >
                                        👍 {selectedIncident.likes || 0}
                                    </button>

                                    <button
                                        onClick={() =>
                                            window.open(
                                                `https://www.google.com/maps/dir/?api=1&destination=${selectedIncident.location.coordinates[1]},${selectedIncident.location.coordinates[0]}`,
                                                '_blank'
                                            )
                                        }
                                        className="w-12 bg-zinc-800 rounded flex items-center justify-center"
                                    >
                                        <Navigation size={18} />
                                    </button>

                                </div>

                            </div>
                        ) : (
                            <div className="p-4">
                                <ActionButtons isLoggedIn={isLoggedIn} />

                                <div className="h-[200px] overflow-hidden mt-2">
                                    <TabbedPanel
                                        incidents={incidents}
                                        setSelectedIncident={setSelectedIncident}
                                        isLoggedIn={isLoggedIn}
                                    />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
}