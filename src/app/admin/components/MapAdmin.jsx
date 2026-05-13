'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { X, Phone, Navigation, ShieldAlert, UserX, ExternalLink } from 'lucide-react';

const Map = dynamic(() => import('react-map-gl/mapbox').then(m => m.Map), { ssr: false });
const Marker = dynamic(() => import('react-map-gl/mapbox').then(m => m.Marker), { ssr: false });

export default function MapAdmin({
  mapRef,
  incidents,
  selectedIncident,
  setSelectedIncident,
  userLat,
  userLng,
}) {

  const [filter, setFilter] = useState('all'); 
  const [search, setSearch] = useState('');

  useEffect(() => {
    setTimeout(() => {
      if (mapRef?.current) {
        mapRef.current.getMap().resize();
      }
    }, 300);
  }, []);

  const filteredIncidents = incidents
    .filter(i => {
      if (filter === 'sos') return i.type === 'sos';
      if (filter === 'report') return i.type === 'report';
      return true;
    })
    .filter(i =>
      i.title?.toLowerCase().includes(search.toLowerCase()) ||
      i.type?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="relative w-full h-full flex flex-col bg-black">

      {/* 🧭 TOP ADMIN CONTROL BAR */}
      <div className="absolute top-3 left-3 z-50 flex gap-2">
        
        <button onClick={() => setFilter('all')} className="px-3 py-1 bg-zinc-800 rounded text-xs">
          All
        </button>

        <button onClick={() => setFilter('sos')} className="px-3 py-1 bg-red-600 rounded text-xs">
          SOS
        </button>

        <button onClick={() => setFilter('report')} className="px-3 py-1 bg-blue-600 rounded text-xs">
          Reports
        </button>

      </div>

      {/* 🔍 SEARCH */}
      <div className="absolute top-3 right-3 z-50">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search incident..."
          className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-xs"
        />
      </div>

      {/* 🗺️ MAP */}
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: userLng || 100.7482,
          latitude: userLat || 13.6125,
          zoom: 11
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        style={{ width: '100%', height: '100%' }}
      >

        {/* 📍 ADMIN MARKERS */}
        {filteredIncidents.map((inc) => (
          <Marker
            key={inc._id}
            longitude={inc.location.coordinates[0]}
            latitude={inc.location.coordinates[1]}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedIncident(inc);
            }}
          >
            <div className={`
              w-4 h-4 rounded-full border-2 border-white
              ${inc.type === 'sos' ? 'bg-red-600' : 'bg-blue-500'}
              animate-pulse
            `} />
          </Marker>
        ))}

      </Map>

      {/* 📊 ADMIN POPUP PANEL */}
      {selectedIncident && (
        <div className="absolute right-4 top-4 w-96 bg-zinc-900 border border-red-500/40 rounded-2xl z-50 overflow-hidden">

          {/* HEADER */}
          <div className="p-4 border-b border-zinc-800 flex justify-between">
            <div>
              <p className="text-xs text-red-500 font-bold">{selectedIncident.type.toUpperCase()}</p>
              <h3 className="font-bold">{selectedIncident.title}</h3>
            </div>

            <button onClick={() => setSelectedIncident(null)}>
              <X />
            </button>
          </div>

          {/* BODY */}
          <div className="p-4 space-y-2 text-sm">

            <p>👤 User: {selectedIncident.user || 'Unknown'}</p>
            <p>📍 Location: {selectedIncident.location?.name || 'N/A'}</p>
            <p>⚠️ Severity: {selectedIncident.severity}</p>

            <p className="text-xs text-zinc-400">
              {selectedIncident.description}
            </p>

          </div>

          {/* ADMIN ACTIONS */}
          <div className="p-4 flex gap-2">

            <button
              className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded text-xs font-bold"
              onClick={() => alert(`BAN USER: ${selectedIncident.user}`)}
            >
              <UserX size={14} /> BAN
            </button>

            <button
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded text-xs font-bold"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps?q=${selectedIncident.location.coordinates[1]},${selectedIncident.location.coordinates[0]}`
                )
              }
            >
              <Navigation size={14} /> NAV
            </button>

            <button
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-2 rounded text-xs font-bold"
              onClick={() => console.log(selectedIncident)}
            >
              <ExternalLink size={14} /> EXPORT
            </button>

          </div>

        </div>
      )}

    </div>
  );
}