
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import GlassPanel from './ui/GlassPanel';
import GlassButton from './ui/GlassButton';
import { Navigation } from 'lucide-react';

// Fix for default Leaflet icon not showing
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const InteractiveMap: React.FC = () => {
    const [userLocation, setUserLocation] = useState<[number, number]>([19.0760, 72.8777]); // Mumbai Default
    const [pharmacies, setPharmacies] = useState([
        { id: 1, name: "Apollo Pharmacy", position: [19.0760, 72.8777], stock: "High" },
        { id: 2, name: "Tata 1mg Hub", position: [19.0800, 72.8900], stock: "Medium" },
        { id: 3, name: "Wellness Forever", position: [19.0600, 72.8500], stock: "Low" }
    ]);

    return (
        <div className="space-y-6 h-full">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-gray-900">Live Pharmacy Tracker</h1>
                <GlassButton icon={<Navigation size={18} />}>Recenter Map</GlassButton>
            </div>

            <GlassPanel className="h-[600px] p-0 overflow-hidden border-2 border-gray-200 relative z-0 bg-white">
                {/* Map Wrapper */}
                <MapContainer
                    center={userLocation}
                    zoom={13}
                    style={{ height: "100%", width: "100%", zIndex: 0 }}
                >
                    {/* Dark Matter / Neon Tile Layer */}
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />

                    <Marker position={userLocation} icon={customIcon}>
                        <Popup>
                            <div className="text-black font-bold">You are here</div>
                        </Popup>
                    </Marker>

                    {pharmacies.map(pharma => (
                        <Marker key={pharma.id} position={pharma.position as [number, number]} icon={customIcon}>
                            <Popup>
                                <div className="text-slate-900">
                                    <strong>{pharma.name}</strong><br />
                                    Stock Level: {pharma.stock}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Overlay Stats */}
                <div className="absolute top-4 right-4 z-[400] bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10">
                    <h4 className="text-[#4CC9F0] font-bold text-xs uppercase tracking-widest mb-2">Live Logistics</h4>
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm text-white gap-8">
                            <span>Active Riders</span>
                            <span className="font-bold">24</span>
                        </div>
                        <div className="flex justify-between text-sm text-white gap-8">
                            <span>Avg Delivery</span>
                            <span className="font-bold">18 min</span>
                        </div>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
};

export default InteractiveMap;
