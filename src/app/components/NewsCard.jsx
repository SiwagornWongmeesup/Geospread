'use client';

import { useEffect, useState } from 'react';

export default function ReportCard({ setSelectedReport }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);

    const [userLocation, setUserLocation] = useState({
        lat: null,
        lng: null
    });

    // ================= GET LOCATION =================
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

    // ================= FETCH REPORT =================
    useEffect(() => {
        const fetchReports = async () => {
            if (!userLocation.lat || !userLocation.lng) return;

            setLoading(true);

            try {
                const res = await fetch(
                    `http://localhost:5000/api/incidents?type=report&latitude=${userLocation.lat}&longitude=${userLocation.lng}&radius=15000`,
                    { credentials: 'include' }
                );

                const data = await res.json();

                if (data.success) {
                    setReports(data.data || []);
                }

            } catch (err) {
                console.error('Fetch report error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [userLocation]);

    return (
        <div className="space-y-3">

            {/* LOADING */}
            {loading && (
                <p className="text-center text-gray-500 text-sm py-6">
                    🔄 กำลังโหลดรายงานเหตุ...
                </p>
            )}

            {/* EMPTY */}
            {!loading && reports.length === 0 && (
                <p className="text-center text-gray-500 text-sm py-6">
                    ยังไม่มีรายงานเหตุการณ์
                </p>
            )}

            {/* LIST */}
            {reports.map((report) => (
                <div
                    key={report._id}
                    onClick={() => setSelectedReport?.(report)}
                    className="bg-[#151515] border border-gray-800 rounded-xl p-3 cursor-pointer hover:border-yellow-500 transition-all"
                >

                    {/* TOP */}
                    <div className="flex justify-between mb-1">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400">
                            REPORT
                        </span>

                        <span className="text-[10px] text-gray-500">
                            {report.distance
                                ? (report.distance / 1000).toFixed(1) + ' km'
                                : '--'}
                        </span>
                    </div>

                    {/* TITLE */}
                    <h3 className="text-sm font-bold text-white">
                        {report.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">
                        {report.description}
                    </p>

                    {/* FOOTER */}
                    <div className="flex justify-between mt-2 text-[10px] text-gray-600">
                        <span>📍 report</span>
                        <span>
                            🕒 {new Date(report.createdAt).toLocaleString()}
                        </span>
                    </div>

                </div>
            ))}
        </div>
    );
}