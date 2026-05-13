'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  Search,
  MapPin,
  Download,
  ArrowUpRight,
  Bell,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';

import Chart from 'chart.js/auto';
import Sidebar from '../components/Sidebar';

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('help_requests');

  const severityRef = useRef(null);
  const trustRef = useRef(null);

  // ===== DATA =====
  const stats = [
    { title: 'ผู้ใช้งานทั้งหมด', value: '7', icon: Users, color: 'text-blue-500' },
    { title: 'คำขอช่วยเหลือ', value: '4', icon: AlertTriangle, color: 'text-red-500' },
    { title: 'รายงานเหตุการณ์', value: '9', icon: ShieldAlert, color: 'text-orange-500' },
    { title: 'สำเร็จแล้ว', value: '3', icon: CheckCircle2, color: 'text-green-500' },
  ];

  const helpRequests = [
    { id: 'REQ-001', user: 'วิชัย', type: 'ไฟไหม้', location: 'บางนา', status: 'pending' },
    { id: 'REQ-002', user: 'สมศรี', type: 'รถชน', location: 'รังสิต', status: 'in_progress' },
    { id: 'REQ-003', user: 'มานะ', type: 'หมดสติ', location: 'ลาดพร้าว', status: 'done' },
  ];

  const filtered = helpRequests.filter(
    (r) =>
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ===== CHART =====
  useEffect(() => {
    if (!severityRef.current || !trustRef.current) return;

    const severityChart = new Chart(severityRef.current, {
      type: 'bar',
      data: {
        labels: ['High', 'Medium', 'Low'],
        datasets: [
          {
            label: 'Incidents',
            data: [24, 45, 12],
            backgroundColor: ['#ef4444', '#f97316', '#3b82f6'],
            borderRadius: 10,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#94a3b8' } },
          y: { ticks: { color: '#94a3b8' } },
        },
      },
    });

    const trustChart = new Chart(trustRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Trusted', 'Normal', 'Risk'],
        datasets: [
          {
            data: [65, 23, 12],
            backgroundColor: ['#22c55e', '#3b82f6', '#ef4444'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: '70%',
        plugins: {
          legend: { labels: { color: '#94a3b8' } },
        },
      },
    });

    return () => {
      severityChart.destroy();
      trustChart.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              GeoSpread Admin
            </h1>
            <p className="text-slate-500">Emergency Control Dashboard</p>
          </div>

          <button className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-xl font-bold">
            <Download size={18} />
            Export
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <div className="flex justify-between">
                <s.icon className={s.color} />
                <ArrowUpRight size={16} className="text-green-500" />
              </div>
              <p className="text-slate-500 text-sm mt-3">{s.title}</p>
              <h2 className="text-2xl font-bold text-white">{s.value}</h2>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
            <h3 className="mb-4 font-bold text-white">Severity Analysis</h3>
            <canvas ref={severityRef} />
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
            <h3 className="mb-4 font-bold text-white">Trust Overview</h3>
            <canvas ref={trustRef} />
          </div>

        </div>

        {/* TABLE */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">

          {/* TOP BAR */}
          <div className="p-5 flex justify-between items-center border-b border-slate-800">

            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('help_requests')}
                className={`font-bold ${activeTab === 'help_requests' ? 'text-white' : 'text-slate-500'}`}
              >
                Help Requests
              </button>

              <button
                onClick={() => setActiveTab('incidents')}
                className={`font-bold ${activeTab === 'incidents' ? 'text-white' : 'text-slate-500'}`}
              >
                Incidents
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-500" size={18} />
              <input
                className="bg-slate-950 border border-slate-800 pl-10 pr-3 py-2 rounded-xl"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

          </div>

          {/* ROWS */}
          <div className="divide-y divide-slate-800">

            {filtered.map((r) => (
              <div key={r.id} className="p-5 flex justify-between items-center">

                <div>
                  <p className="text-red-500 text-xs">{r.id}</p>
                  <p className="text-white font-bold">{r.user}</p>
                  <p className="text-slate-500 text-sm">{r.type}</p>
                </div>

                <div className="text-slate-400 flex items-center gap-2">
                  <MapPin size={14} />
                  {r.location}
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-slate-800">
                  {r.status}
                </span>

                <button className="p-2 border border-slate-700 rounded-xl">
                  <ExternalLink size={16} />
                </button>

              </div>
            ))}

          </div>
        </div>

      </main>
    </div>
  );
}