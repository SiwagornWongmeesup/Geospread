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
        severity: 'general',
        photos: [],
        location: { lat: 13.7563, lng: 100.5018 },
        userLocation: { lat: null, lng: null }
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [addressName, setAddressName] = useState('Please select incident location on the map');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (formData.severity === 'critical') {
            const photoInput = document.getElementById('photo-input');
            if (photoInput) photoInput.click();
        }
    }, [formData.severity]);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setFormData(prev => ({
                    ...prev,
                    userLocation: {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    }
                }));

                setViewState(prev => ({
                    ...prev,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }));
            });
        }
    }, []);

    const onMapClick = useCallback((e) => {
        const { lng, lat } = e.lngLat;
        setFormData(prev => ({ ...prev, location: { lat, lng } }));
        reverseGeocode(lng, lat);
    }, []);

    const reverseGeocode = async (lng, lat) => {
        const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
        );
        const data = await res.json();
        if (data.features?.length > 0) {
            setAddressName(data.features[0].place_name);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery) return;

        const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&limit=1`
        );

        const data = await res.json();

        if (data.features.length > 0) {
            const [lng, lat] = data.features[0].center;

            setViewState(prev => ({
                ...prev,
                latitude: lat,
                longitude: lng,
                zoom: 16
            }));

            setFormData(prev => ({
                ...prev,
                location: { lat, lng }
            }));

            setAddressName(data.features[0].place_name);
        }
    };

    const handleIncidentSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!formData.title || !formData.description) {
            return alert("Please fill in title and description");
        }

        if (formData.severity === 'critical' && formData.photos.length === 0) {
            return alert("Critical incidents require photo evidence");
        }

        setIsSubmitting(true);

        try {
            const data = new FormData();

            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('severity', formData.severity);
            data.append('type', 'sos');

            data.append('location', JSON.stringify({
                type: 'Point',
                coordinates: [formData.location.lng, formData.location.lat]
            }));

            data.append('userLocation', JSON.stringify({
                type: 'Point',
                coordinates: [formData.userLocation.lng, formData.userLocation.lat]
            }));

            formData.photos.forEach((file) => {
                data.append('photos', file);
            });

            const res = await fetch('http://localhost:5000/api/incidents', {
                method: 'POST',
                body: data,
                credentials: 'include'
            });

            if (res.ok) {
                alert("Report submitted successfully!");
                window.location.href = '/';
            } else {
                const errorData = await res.json();
                alert(`Failed: ${errorData.message || 'Something went wrong'}`);
            }

        } catch (error) {
            alert("Error submitting request");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-black via-gray-900 to-red-900 p-4">
            <div className="max-w-7xl mx-auto bg-gray-800 rounded-2xl shadow-2xl text-gray-100 overflow-hidden border border-white/5">

                <h1 className="text-2xl sm:text-3xl font-black p-6 text-center text-red-600 tracking-tighter italic">
                    Emergency Assistance (SOS)
                </h1>

                <div className="flex flex-col md:flex-row">

                    <div className="w-full md:w-2/3 p-4">

                        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[650px] bg-gray-900 rounded-xl overflow-hidden shadow-inner border border-white/10">

                            <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
                                <input
                                    className="flex-1 bg-gray-800/90 backdrop-blur-md border border-gray-600 p-3 rounded-xl outline-none focus:border-red-500 text-sm shadow-xl"
                                    placeholder="Search incident location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />

                                <button
                                    onClick={handleSearch}
                                    className="bg-red-600 px-4 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
                                >
                                    Search
                                </button>
                            </div>

                            <Map
                                {...viewState}
                                onMove={evt => setViewState(evt.viewState)}
                                onClick={onMapClick}
                                mapStyle="mapbox://styles/mapbox/dark-v11"
                                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                                style={{ width: '100%', height: '100%' }}
                            >
                                <Marker
                                    longitude={formData.location.lng}
                                    latitude={formData.location.lat}
                                    color="#ef4444"
                                />
                            </Map>

                            <div className="absolute bottom-4 left-4 bg-black/80 p-3 rounded-lg text-[11px] text-red-500 border border-red-500/30 backdrop-blur-md max-w-[80%]">
                                📍 Selected location: {addressName}
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
                                <label className="block font-bold text-sm mb-1 text-gray-300">Incident Title</label>
                                <input
                                    placeholder="e.g. Fire, Flood, Accident"
                                    className="w-full bg-gray-900 text-gray-100 border border-gray-600 p-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-sm mb-1 text-gray-300">Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe the situation..."
                                    className="w-full p-3 border border-gray-600 rounded-xl bg-gray-900 text-gray-100 outline-none focus:ring-2 focus:ring-red-500"
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-sm mb-1 text-gray-300">Severity Level</label>
                                <select
                                    className="w-full bg-gray-900 text-gray-100 border border-gray-600 p-3 rounded-xl outline-none"
                                    value={formData.severity}
                                    onChange={e => setFormData({ ...formData, severity: e.target.value })}
                                >
                                    <option value="general">Low</option>
                                    <option value="urgent">Medium</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block font-bold text-sm text-gray-300">
                                    {formData.severity === 'critical'
                                        ? 'Capture Photo (Required)'
                                        : 'Upload Photos'}
                                </label>

                                <div
                                    onClick={() => document.getElementById('photo-input').click()}
                                    className="border-2 border-dashed p-6 rounded-xl text-center text-xs cursor-pointer"
                                >
                                    {formData.photos.length > 0
                                        ? `Selected ${formData.photos.length} photos`
                                        : 'Click to add photos'}

                                    <input
                                        id="photo-input"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files);
                                            setFormData({ ...formData, photos: files });
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-red-600 text-white font-black px-6 py-4 rounded-xl hover:bg-red-700 mt-4 w-full disabled:opacity-50"
                            >
                                {isSubmitting ? "Submitting..." : "Send SOS Request"}
                            </button>

                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}