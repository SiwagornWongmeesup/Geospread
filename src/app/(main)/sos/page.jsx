'use client';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import 'mapbox-gl/dist/mapbox-gl.css';


const Map = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.Map), { ssr: false });
const Marker = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.Marker), { ssr: false });

export default function SOSPage() {
    const [viewState, setViewState] = useState({
        latitude: 13.7563,
        longitude: 100.5018,
        zoom: 15
    });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        severity: 'general', // เริ่มต้นที่ระดับต่ำก่อน
        photos: [],
        location: { lat: 13.7563, lng: 100.5018 },
        userLocation: { lat: null, lng: null }
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [addressName, setAddressName] = useState('กรุณาเลือกจุดเกิดเหตุบนแผนที่');
     const [isSubmitting, setIsSubmitting] = useState(false);

    // 🚩 1. ฟังก์ชันสั่งเปิดกล้องอัตโนมัติเมื่อเลือก Critical
    useEffect(() => {
        if (formData.severity === 'critical') {
            const photoInput = document.getElementById('photo-input');
            if (photoInput) {
                photoInput.click(); // สั่งคลิกเปิดกล้องทันที
            }
        }
    }, [formData.severity]); // ทำงานทุกครั้งที่ความรุนแรงเปลี่ยน

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setFormData(prev => ({
                    ...prev,
                    userLocation: { lat: pos.coords.latitude, lng: pos.coords.longitude }
                }));
                setViewState(prev => ({ ...prev, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
            });
        }
    }, []);

    const onMapClick = useCallback((e) => {
        const { lng, lat } = e.lngLat;
        setFormData(prev => ({ ...prev, location: { lat, lng } }));
        reverseGeocode(lng, lat);
    }, []);

    const reverseGeocode = async (lng, lat) => {
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`);
        const data = await res.json();
        if (data.features && data.features.length > 0) {
            setAddressName(data.features[0].place_name);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&limit=1`);
        const data = await res.json();
        if (data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            setViewState(prev => ({ ...prev, latitude: lat, longitude: lng, zoom: 16 }));
            setFormData(prev => ({ ...prev, location: { lat, lng } }));
            setAddressName(data.features[0].place_name);
        }
    };

    const handleIncidentSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!formData.title || !formData.description) return alert("กรุณากรอกหัวข้อและรายละเอียด");
        
        // ถ้าเป็นระดับวิกฤต ต้องมีรูปถ่าย
        if (formData.severity === 'critical' && formData.photos.length === 0) {
            return alert("🆘 กรณีวิกฤต ต้องถ่ายภาพยืนยันเหตุการณ์ด้วยครับ!");
        }

        setIsSubmitting(true);
        try {
            // 🚩 2. สร้างก้อนข้อมูลแบบ FormData (สำคัญมากสำหรับส่งไฟล์)
            const data = new FormData();
            // ใส่ข้อมูลตัวหนังสือ
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('severity', formData.severity);
            data.append('type', 'sos');

            // ใส่พิกัด (แปลงเป็น String เพราะ FormData รับแต่ string หรือ file)
            data.append('location', JSON.stringify({
                type: 'Point',
                coordinates: [formData.location.lng, formData.location.lat]
            }));
            data.append('userLocation', JSON.stringify({
                type: 'Point',
                coordinates: [formData.userLocation.lng, formData.userLocation.lat]
            }));

            formData.photos.forEach((file) =>{
                data.append('photos', file);
            })


            const res = await fetch('http://localhost:5000/api/incidents', {
                method: 'POST',
                body: data,
                credentials: 'include'
            });

            if (res.ok) {
                alert("✅ แจ้งเหตุสำเร็จ!");
                window.location.href = '/';
            } else {
 
                const errorData = await res.json();
                alert(`❌ ส่งข้อมูลล้มเหลว: ${errorData.message || 'เกิดข้อผิดพลาดบางอย่าง'}`);
            }

        } catch (error) {
            alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-black via-gray-900 to-red-900 p-4">
            <div className="max-w-7xl mx-auto bg-gray-800 rounded-2xl shadow-2xl text-gray-100 overflow-hidden border border-white/5">
                <h1 className="text-2xl sm:text-3xl font-black p-6 text-center text-red-600 tracking-tighter italic">
                     ขอความช่วยเหลือ (sos)
                </h1>

                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-2/3 p-4">
                        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[650px] bg-gray-900 rounded-xl overflow-hidden shadow-inner border border-white/10">
                            <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
                                <input 
                                    className="flex-1 bg-gray-800/90 backdrop-blur-md border border-gray-600 p-3 rounded-xl outline-none focus:border-red-500 text-sm shadow-xl"
                                    placeholder="ค้นหาสถานที่เกิดเหตุ..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button onClick={handleSearch} className="bg-red-600 px-4 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors">ค้นหา</button>
                            </div>

                            <Map
                                {...viewState}
                                onMove={evt => setViewState(evt.viewState)}
                                onClick={onMapClick}
                                mapStyle="mapbox://styles/mapbox/dark-v11"
                                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                                style={{ width: '100%', height: '100%' }}
                            >
                                <Marker longitude={formData.location.lng} latitude={formData.location.lat} color="#ef4444" />
                            </Map>

                            <div className="absolute bottom-4 left-4 bg-black/80 p-3 rounded-lg text-[11px] text-red-500 border border-red-500/30 backdrop-blur-md max-w-[80%]">
                                📍 พิกัดที่เลือก: {addressName}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="text-[10px] text-gray-400 font-bold uppercase ml-1">Latitude</label>
                                <input readOnly value={formData.location.lat.toFixed(6)} className="border border-gray-600 p-3 rounded-xl w-full bg-gray-900 text-red-500 font-mono text-sm" />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-400 font-bold uppercase ml-1">Longitude</label>
                                <input readOnly value={formData.location.lng.toFixed(6)} className="border border-gray-600 p-3 rounded-xl w-full bg-gray-900 text-red-500 font-mono text-sm" />
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/3 p-4 bg-gray-800/50 backdrop-blur-sm">
                        <form onSubmit={handleIncidentSubmit} className="space-y-4">
                            <div>
                                <label className="block font-bold text-sm mb-1 text-gray-300">หัวข้อเหตุการณ์</label>
                                <input
                                    placeholder="ระบุสั้นๆ เช่น ไฟไหม้, น้ำท่วมถนน"
                                    className="w-full bg-gray-900 text-gray-100 border border-gray-600 p-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-sm mb-1 text-gray-300">รายละเอียดเหตุการณ์</label>
                                <textarea
                                    rows={4}
                                    placeholder="อธิบายสถานการณ์ที่เกิดขึ้น..."
                                    className="w-full p-3 border border-gray-600 rounded-xl bg-gray-900 text-gray-100 outline-none focus:ring-2 focus:ring-red-500"
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-sm mb-1 text-gray-300">ระดับความรุนแรง</label>
                                <select
                                    className="w-full bg-gray-900 text-gray-100 border border-gray-600 p-3 rounded-xl outline-none"
                                    value={formData.severity}
                                    onChange={e => setFormData({...formData, severity: e.target.value})}
                                >
                                    <option value="general">ต่ำ (ไม่เร่งด่วน)</option>
                                    <option value="urgent">ปานกลาง</option>
                                    <option value="critical">สูง (อันตราย/วิกฤต)</option>
                                </select>
                            </div>

                            {/* Camera Section */}
                            <div className="space-y-2">
                                <label className="block font-bold text-sm text-gray-300">
                                     {formData.severity === 'critical' ? '🚨 ถ่ายภาพยืนยัน (บังคับถ่ายสด)' : '📸 แนบรูปภาพ'}
                                </label>
                                <div 
                                    onClick={() => document.getElementById('photo-input').click()}
                                    className={`border-2 border-dashed p-6 rounded-xl text-center text-xs cursor-pointer transition-all
                                        ${formData.severity === 'critical' ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-gray-600 hover:bg-gray-700'}`}
                                >
                                    {formData.photos.length > 0 ? `✅ เลือกแล้ว ${formData.photos.length} รูป` : '📷 คลิกเพื่อเพิ่มรูปภาพ'}
                                    <input 
                                        id="photo-input"
                                        key={formData.severity}
                                        type="file" 
                                        accept="image/*"
                                       
                                        capture={formData.severity === 'critical' ? 'environment' : undefined}
                                        className="hidden" 
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files);
                                            setFormData({...formData, photos: files});
                                        }}
                                    />
                                </div>
                                
                                {/* Image Previews */}
                                {formData.photos.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto py-2">
                                        {formData.photos.map((file, i) => (
                                            <div key={i} className="min-w-[60px] h-[60px] rounded bg-gray-700 overflow-hidden border border-white/10">
                                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-red-600 text-white font-black px-6 py-4 rounded-xl hover:bg-red-700 mt-4 w-full disabled:opacity-50 transition-all shadow-lg active:scale-95 text-lg"
                            >
                                {isSubmitting ? "⏳ กำลังส่ง..." : "ยืนยันส่งคำขอช่วยเหลือ"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}