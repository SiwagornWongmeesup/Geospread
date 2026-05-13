  'use client';

  import { useRef, useState, useMemo, useEffect } from 'react';
  import MapAreaAdmin from '../components/MapAdmin';
  import Sidebar from '../components/Sidebar';

  // 👇 MOCK INCIDENTS
  const mockIncidents = [
    {
      _id: 'i1',
      userId: 'u1',
      title: 'Fire in house',
      type: 'sos',
      severity: 'high',
      location: { coordinates: [100.7482, 13.6125] },
    },
    {
      _id: 'i2',
      userId: 'u2',
      title: 'Fake bomb report',
      type: 'sos',
      severity: 'critical',
      location: { coordinates: [100.752, 13.615] },
    },
    {
      _id: 'i3',
      userId: 'u3',
      title: 'Flood report',
      type: 'report',
      severity: 'medium',
      location: { coordinates: [100.74, 13.61] },
    },
  ];

  export default function AdminDashboard() {
    const mapRef = useRef(null);

    const [mounted, setMounted] = useState(false);
    const [incidents] = useState(mockIncidents);
    const [selectedIncident, setSelectedIncident] = useState(null);

    // ✅ FIX HYDRATION SAFETY
    useEffect(() => {
      setMounted(true);
    }, []);

    // 📊 safe incidents
    const validIncidents = useMemo(() => {
      return incidents.filter((inc) => inc?.location?.coordinates);
    }, [incidents]);

    // 🚨 prevent hydration mismatch
    if (!mounted) return null;

    return (
      <div className="flex h-screen bg-black text-white overflow-hidden">

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAP ONLY AREA */}
        <div className="flex-1 relative">

          <MapAreaAdmin
            mapRef={mapRef}
            incidents={validIncidents}
            selectedIncident={selectedIncident}
            setSelectedIncident={setSelectedIncident}
          />

        </div>

      </div>
    );
  }