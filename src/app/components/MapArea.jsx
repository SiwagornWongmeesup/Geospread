'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'mapbox-gl/dist/mapbox-gl.css';
import { X, Phone, Navigation } from 'lucide-react';
import React from 'react';

const Map = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.Map), { ssr: false });
const Marker = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.Marker), { ssr: false });
const Source = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.Source), { ssr: false });
const Layer = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.Layer), { ssr: false });

export default function MapArea({
    mapRef, 
    incidents, 
    selectedIncident,  
    setSelectedIncident, 
    userLng, 
    userLat, 
    handleOfferHelp,
    isSidebarOpen,
    handleLike,
}) {

    useEffect(() => {
        const timer = setTimeout(() => {
            if (mapRef.current) mapRef.current.getMap().resize();
        }, 300);
        return () => clearTimeout(timer);
    }, [isSidebarOpen, mapRef]);

    const handleNavigation = (lat, lng) => {
        window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    };  

    return (
        <div className="flex-1 relative w-full h-full min-h-0 overflow-hidden bg-zinc-950 flex flex-col">
            
            {/* 🗺️ ส่วนของแผนที่ */}
            <div className="relative flex-1 min-h-0">
                <Map
                    ref={mapRef}
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                    initialViewState={{ longitude: userLng, latitude: userLat, zoom: 12 }}
                    mapStyle="mapbox://styles/mapbox/streets-v12"
                    style={{ width: '100%', height: '100%' }}
                    
                    interactiveLayerIds={incidents.map(inc => `layer-radius-${inc._id}`)}
                    onClick={(e) => {
                    // เช็คว่าจุดที่คลิก มี "Features" (ข้อมูล Layer) อยู่ใต้เม้าส์ไหม
                    const feature = e.features && e.features[0];

                    if (feature) {
                        // ถ้าจิ้มโดน Layer 
                        // ดึง ID จาก properties 
                        const incidentId = feature.layer.id.replace('layer-radius-', '');
                        const clickedIncident = incidents.find(inc => inc._id === incidentId);
                        
                        if (clickedIncident) {
                            setSelectedIncident(clickedIncident); //โชว์ Popup
                        }
                    } else {
                        // ถ้าจิ้มที่ว่างบนแผนที่ (ไม่โดนหมุด/วงกลม) ให้ปิด Popup
                        setSelectedIncident(null);
                    }
    }}
                >
                    
                    {/* 🔄 ลูปแสดงผลเหตุการณ์ทั้งหมด */}
                    {incidents
                        .filter(incident => !incident.isFlagged)
                        .map((incident) => (
                            <React.Fragment key={incident._id}>
                                
                                {/* 🔴 1. ถ้าเป็น SOS -> แสดงเป็นหมุด (Marker) */}
                                {incident.type === 'sos' && (
                                    <Marker 
                                        longitude={incident.location.coordinates[0]} 
                                        latitude={incident.location.coordinates[1]} 
                                        color={incident.severity === 'critical' ? '#dc2626' : incident.severity === 'urgent' ? '#f97316' : '#eab308'} 
                                        onClick={(e) => { 
                                            e.originalEvent.stopPropagation(); 
                                            setSelectedIncident(incident); 
                                        }} 
                                    />
                                )}

                                {/* 🟠 2. ถ้าเป็น Report -> แสดงเป็นรัศมี (Circle Layer) */}
                                {incident.type === 'report' && (
                                    <Source 
                                        id={`source-${incident._id}`} 
                                        type="geojson" 
                                        data={{
                                            type: 'Feature',
                                            geometry: {
                                                type: 'Point',
                                                coordinates: incident.location.coordinates
                                            }
                                        }}
                                    >
                                     <Layer 
                                        id={`layer-radius-${incident._id}`} // 💡 ต้องมี ID เฉพาะตัว
                                        type="circle" 
                                        paint={{
                                        'circle-radius': incident.impact === 'wide' ? 80 : incident.impact === 'area' ? 40 : 15,
                                        'circle-color': incident.impact === 'wide' ? '#ff0000' : incident.impact === 'area' ? '#f97316' : '#22c55e',
                                        'circle-opacity': 0.3,
                                        'circle-blur': 1 // ✨ เพิ่มความฟุ้งให้เหมือนหน้า Report
                                    }} 
                                    />

                                {/* 🟠 ชั้นที่ 2: จุดไข่แดงตรงกลาง (เพื่อให้คนรู้ว่าจุดศูนย์กลางอยู่ไหน) */}
                                <Layer 
                                id={`layer-center-${incident._id}`} 
                                type="circle" 
                                paint={{
                                    'circle-radius': 6,
                                    'circle-color': incident.impact === 'wide' ? '#ff0000' : incident.impact === 'area' ? '#f97316' : '#22c55e',
                                    'circle-stroke-width': 2,
                                    'circle-stroke-color': '#ffffff'
                                }} 
                                />
                            </Source>
                            )}
                            </React.Fragment>
                        ))
                    }

                </Map>

                {/* 📸 [MOBILE] Popup */}
                {selectedIncident && (
                <>
                    <div className="md:hidden absolute inset-x-4 top-20 z-50 animate-in fade-in zoom-in duration-300">
                        <div className="relative h-40 bg-zinc-900 rounded-3xl overflow-hidden border border-red-500/30 shadow-2xl">
                            {selectedIncident.photos?.length > 0 ? (
                                <img src={selectedIncident.photos[0]} alt="incident" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full w-full bg-zinc-800/40 gap-2">
                                    <div className="p-3 rounded-full bg-zinc-900/50 border border-zinc-700/50 text-zinc-600 animate-pulse">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M10.3 21 21 10.3"/><path d="m2 21 21-21"/></svg>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">No Media Available</p>
                                        <p className="text-[9px] text-zinc-600 italic font-sans">ไม่มีพยานหลักฐานเป็นรูปภาพ</p>
                                    </div>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-900/40 to-transparent"></div>
                            <button onClick={() => setSelectedIncident(null)} className="absolute top-3 right-3 p-1.5 bg-black/50 rounded-full text-white z-10 hover:bg-red-600 transition-colors"><X size={18}/></button>
                        </div>
                    </div>
                

                {/* 🚨 [PC] Popup Details */}
                    <div className="hidden md:block absolute top-10 right-10 w-96 bg-zinc-900 border border-red-500/50 rounded-3xl overflow-hidden shadow-2xl z-50 animate-in zoom-in duration-200 text-white font-sans">
                        <div className="relative h-48 bg-zinc-800">
                            {selectedIncident.photos?.length > 0 ? (
                                <img src={selectedIncident.photos[0]} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full w-full bg-zinc-800/50 gap-3">
                                    <div className="p-4 rounded-full bg-zinc-900/60 border border-zinc-700/50 text-zinc-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M10.3 21 21 10.3"/><path d="m2 21 21-21"/></svg>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Visual Data Missing</p>
                                        <p className="text-[11px] text-zinc-500 italic mt-1 font-sans font-medium text-red-500/70">ยังไม่มีการอัปโหลดรูปภาพประกอบ</p>
                                    </div>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/50 to-transparent"></div>
                            <button onClick={() => setSelectedIncident(null)} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white transition-all active:scale-90 z-10 hover:bg-red-600"><X size={22}/></button>
                            <span className="absolute top-4 left-4 text-[10px] font-black text-white bg-red-600 px-2 py-0.5 rounded uppercase tracking-widest z-10 shadow-lg shadow-red-900/50">{selectedIncident.severity}</span>
                        </div>
                       <div className="p-6 relative top-[-20px] bg-zinc-900 rounded-t-3xl">

                    {/* 1. ส่วนหัว: แยก Emoji และโชว์ Badge สถานะเฉพาะ Report */}
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold leading-tight">
                            {selectedIncident.type === 'sos' ? '🚨' : '📊'} {selectedIncident.title}
                        </h3>
                        {selectedIncident.type === 'report' && (
                            <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-tighter">
                                Active Situation
                            </span>
                        )}
                    </div>

                <p className="text-xs text-gray-400 mb-3 leading-relaxed line-clamp-3">
                    {selectedIncident.description}
                </p>

                 {/*  Metadata: ชื่อผู้แจ้งและเวลา (โชว์เฉพาะ Report เพื่อความน่าเชื่อถือ) */}
                    {(selectedIncident.reporterID?.name || selectedIncident.createdAt) && (
                    <div className="flex justify-between text-[12px] text-zinc-500 mb-3 italic">
                        {/* เช็คว่ามีชื่อไหม ถ้าไม่มีให้ขึ้นว่า "ไม่ระบุชื่อ" */}
                        <span>👤 {selectedIncident.type === 'sos' ? 'ผู้ร้องขอ:' : 'โดย:'} {selectedIncident.reporterID?.name || 'ไม่ระบุชื่อ'}</span>
                       {console.log("เช็คชื่อใน JSX:", selectedIncident.reporterID?.name)}
                        
                        {/* เช็คว่ามีเวลาไหม */}
                        <span>🕒 {selectedIncident.createdAt 
                            ? new Date(selectedIncident.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
                            : 'ไม่ระบุเวลา'}
                        </span>
                    </div>
                )}

                {/* 3. ส่วนสถิติเฉพาะ Report: คะแนนความน่าเชื่อถือ และ รัศมี */}
                {selectedIncident.type === 'report' && (
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-zinc-800/50 p-3 rounded-2xl border border-white/5 shadow-inner text-center">
                            <p className="text-[9px] text-zinc-500 uppercase font-black mb-1">จำนวนคนกดถูกใจ</p>
                            <div className="text-yellow-500 text-sm font-bold">👍 4.5</div>
                        </div>
                        <div className="bg-zinc-800/50 p-3 rounded-2xl border border-white/5 shadow-inner text-center">
                            <p className="text-[9px] text-zinc-500 uppercase font-black mb-1">พื้นที่ผลกระทบ</p>
                            <p className="text-blue-400 text-xs font-bold">
                                {selectedIncident.impact === 'wide' ? 'วงกว้าง' : selectedIncident.impact === 'area' ? 'ปานกลาง' : 'เฉพาะจุด'}
                            </p>
                        </div>
                    </div>
                )}

                {/* 4. แผงปุ่มกด: แยกปุ่มหลักตามประเภท */}
                <div className="flex gap-3">
                    {selectedIncident.type === 'sos' ? (
                        // ปุ่มของ SOS: เน้นเข้าช่วยเหลือ
                        <button 
                            onClick={() => handleOfferHelp(selectedIncident._id)} 
                            className="flex-1 py-4 bg-red-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg shadow-red-900/40 active:scale-95 text-white"
                        >
                            รับเคสช่วยเหลือ
                        </button>
                    ) : (
                    <>
            {/* 👍 ปุ่มมีประโยชน์ (Upvote) */}
            <button 
                onClick={() => handleLike(selectedIncident._id)} // เดี๋ยวเราไปสร้างฟังก์ชันนี้กัน
                className="flex-1 py-4 bg-emerald-600/20 text-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                <span className="text-sm">👍</span>
                มีประโยชน์ ({selectedIncident.likes || 0})
            </button>

            {/* 🔗 ปุ่มแชร์ (Share API) */}
            <button 
                onClick={() => {
                    if (navigator.share) {
                        navigator.share({
                            title: `Geospread: ${selectedIncident.title}`,
                            text: selectedIncident.description,
                            url: window.location.href,
                        });
                    } else {
                        // ถ้า Browser ไม่รองรับ ให้ก๊อปปี้ลิงก์แทน
                        navigator.clipboard.writeText(window.location.href);
                        alert("คัดลอกลิงก์เหตุการณ์นี้แล้ว!");
                    }
                }}
                className="w-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 border border-zinc-700 hover:text-white hover:border-zinc-500 transition-all"
            >
                {/* Lucide icon สำหรับ Share หรือใช้ SVG ก็ได้ */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
            </button>
        </>
        )}

        {/* ปุ่มมาตรฐาน (มีทั้งคู่): นำทาง และ โทร */}
                        <button 
                            onClick={() => handleNavigation(selectedIncident.location.coordinates[1], selectedIncident.location.coordinates[0])} 
                            className="w-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-blue-500 border border-zinc-700 hover:bg-zinc-700 transition-colors"
                        >
                            <Navigation size={20}/>
                        </button>
                        <button className="w-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-red-500 border border-zinc-700 hover:bg-zinc-700 transition-colors">
                            <Phone size={20}/>
                        </button>
                    </div>
                </div>
                    </div>
                </>
                )}
            </div>
        </div>
    );
}