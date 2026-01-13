
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Ambulance, AmbulanceStatus, AmbulanceType, GeoLocation } from '../../types';

// Custom Marker Icons (using DivIcon for CSS/SVG rendering)
const createAmbulanceIcon = (type: AmbulanceType, status: AmbulanceStatus) => {
    let color = '#4CC9F0'; // Default Blue
    if (status === AmbulanceStatus.EN_ROUTE_TO_PICKUP) color = '#FF0000'; // Red
    else if (status === AmbulanceStatus.TRANSPORTING) color = '#F72585'; // Pink

    return new DivIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 10px ${color}; border: 2px solid white;"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });
};

const userIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    className: 'rounded-full border-2 border-white'
});


interface AmbulanceMapProps {
    ambulances: Ambulance[];
    userLocation: GeoLocation | null;
    routes?: GeoLocation[][];
}

const ZoomHandler: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 14, { duration: 2 });
        }
    }, [center, map]);
    return null;
};


const AmbulanceMap: React.FC<AmbulanceMapProps> = ({ ambulances, userLocation, routes }) => {
    const [center, setCenter] = useState<[number, number]>([19.0760, 72.8777]); // Mumbai

    useEffect(() => {
        if (userLocation) {
            setCenter([userLocation.lat, userLocation.lng]);
        }
    }, [userLocation]);

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl">
            <MapContainer
                center={center}
                zoom={14}
                style={{ height: "100%", width: "100%", background: '#0a0a0a' }}
                zoomControl={false}
            >
                {/* Dark Futuristic Map Tiles */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                />

                <ZoomHandler center={center} />

                {/* User Location */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                        <Popup className="glass-popup">
                            <div className="font-bold text-black">Your Location</div>
                        </Popup>
                    </Marker>
                )}

                {/* Live Ambulances */}
                {ambulances.map(amb => (
                    <Marker
                        key={amb.id}
                        position={[amb.location.lat, amb.location.lng]}
                        icon={createAmbulanceIcon(amb.type, amb.status)}
                    >
                        <Popup className="glass-popup">
                            <div className="text-slate-900 min-w-[150px]">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-black text-sm uppercase">{amb.callSign}</span>
                                    <span className="text-[10px] bg-black text-white px-1 rounded">{amb.type}</span>
                                </div>
                                <div className="text-xs text-slate-500 font-medium">
                                    Status: <span className="font-bold text-blue-600">{amb.status}</span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Active Routes (Polylines) */}
                {routes?.map((route, idx) => (
                    <Polyline
                        key={idx}
                        positions={route.map(pt => [pt.lat, pt.lng])}
                        pathOptions={{ color: '#4CC9F0', weight: 4, opacity: 0.6, dashArray: '10, 10' }}
                    />
                ))}

            </MapContainer>

            {/* Simulated Live Location Indicator */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 z-[1000] flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_green]" />
                <span className="text-[10px] uppercase font-black tracking-widest text-white/80">Live Grid V2.0</span>
            </div>
        </div>
    );
};

export default AmbulanceMap;
