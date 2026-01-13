
import React, { useState, useEffect } from 'react';
import GlassPanel from '../components/ui/GlassPanel';
import { Layers, Activity, Wind, Waves } from 'lucide-react';
import AmbulanceMap from '../components/ambulance/AmbulanceMap';
import { Ambulance, GeoLocation, FieldTensor } from '../types';

const AmbulancePage: React.FC = () => {
    // PDF State
    const [fieldData, setFieldData] = useState<FieldTensor | null>(null);
    const [systemEntropy, setSystemEntropy] = useState<number>(0);
    const [biasActive, setBiasActive] = useState(false);

    // Legacy / Shared State
    const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
    const [userLocation] = useState<GeoLocation>({ lat: 19.0720, lng: 72.8800 });
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Connect to Real-Time Dispatch Engine (still useful for fleet viz)
        const ws = new WebSocket('ws://localhost:8000/ws/dispatch');

        ws.onopen = () => setIsConnected(true);
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'INIT_FLEET' || message.type === 'FLEET_UPDATE') {
                setAmbulances(message.data);
            }
        };
        ws.onclose = () => setIsConnected(false);

        // Poll for Topology Data (The Field)
        const interval = setInterval(fetchTopology, 1000);

        return () => {
            ws.close();
            clearInterval(interval);
        };
    }, []);

    const fetchTopology = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/field/entropy');
            const data = await res.json();
            setSystemEntropy(data.stability_index);
            // In a real app, we'd fetch the full matrix here
        } catch (e) {
            console.error("Field Unreachable", e);
        }
    };

    const injectExistentialBias = async () => {
        setBiasActive(true);
        try {
            await fetch('http://localhost:8000/api/field/bias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lat: userLocation.lat, lng: userLocation.lng, type: 'SURVIVAL_WELL' })
            });
            setTimeout(() => setBiasActive(false), 2000);
        } catch (e) {
            console.error(e);
            setBiasActive(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <Waves className="text-[#4CC9F0] animate-pulse" size={32} />
                        Pre-Decision Field
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">
                        Unobservable Topology of Survival
                    </p>
                </div>
                <div className="flex gap-4">
                    <GlassPanel className="py-2 px-4 flex items-center gap-2 border border-[#4CC9F0]/30 shadow-[0_0_15px_#4CC9F0/20]">
                        <Activity size={16} className="text-[#4CC9F0]" />
                        <span className="text-xs font-bold text-gray-900">ENTROPY STABILITY: <span className="text-[#4CC9F0] font-mono">{(systemEntropy * 100).toFixed(1)}%</span></span>
                    </GlassPanel>
                    <GlassPanel className="py-2 px-4 flex items-center gap-2">
                        <Layers size={16} className="text-[#2A9D8F]" />
                        <span className="text-xs font-bold text-gray-900">FIELD: <span className={`${isConnected ? 'text-[#2A9D8F]' : 'text-red-500'}`}>{isConnected ? 'COHERENT' : 'DECOHERENT'}</span></span>
                    </GlassPanel>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
                {/* Main Interactive Map (Visualizing the Field) */}
                <div className="col-span-8 h-full relative group">
                    <AmbulanceMap
                        ambulances={ambulances}
                        userLocation={userLocation}
                        routes={[]}
                    />

                    {/* Field Overlay */}
                    <div className="absolute inset-0 pointer-events-none z-[400] opacity-30 bg-gradient-to-t from-[#4CC9F0]/10 to-transparent mix-blend-overlay" />

                    {biasActive && (
                        <div className="absolute inset-0 z-[500] flex items-center justify-center pointer-events-none">
                            <div className="w-96 h-96 rounded-full bg-[#4CC9F0]/20 blur-3xl animate-pulse" />
                        </div>
                    )}
                </div>

                {/* Control Panel (The Observer) */}
                <div className="col-span-4 h-full flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    <GlassPanel className="p-6">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Field Manipulation</h3>
                        <div className="space-y-3">
                            <button
                                onClick={injectExistentialBias}
                                className="w-full p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-4 hover:bg-emerald-500/20 transition-all group relative overflow-hidden"
                            >
                                <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-lg border border-emerald-500/50">
                                    <Wind size={24} />
                                </div>
                                <div className="text-left relative z-10">
                                    <p className="font-black text-gray-900 text-lg leading-none">Inject Survival Bias</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Warp Probability Manifold</p>
                                </div>
                            </button>
                        </div>
                        <div className="mt-6 text-xs text-white/30 italic">
                            "The system does not respond. It merely ensures that the path to survival is the path of least resistance."
                        </div>
                    </GlassPanel>

                    <GlassPanel className="p-6 flex-1">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Latent Resource Clusters</h3>
                        <div className="space-y-4">
                            {ambulances.map(amb => (
                                <div key={amb.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${amb.status === 'IDLE' ? 'bg-emerald-500' : 'bg-amber-500'} shadow-[0_0_8px_currentColor]`} />
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">{amb.callSign}</p>
                                            <p className="text-[10px] text-gray-500 uppercase">Field Coupling: {(Math.random() * 0.5 + 0.5).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
};

export default AmbulancePage;
