
import React from 'react';
import GlassPanel from '../components/ui/GlassPanel';
import { Target, Activity, Brain, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

const NeuroAnalysisPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Neuro-Aggressiveness Analysis</h1>
                <p className="text-gray-600">Advanced mapping and invasion tendency scoring.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Aggressiveness Score */}
                <GlassPanel className="flex flex-col items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />

                    <h3 className="absolute top-8 left-8 text-xl font-bold text-white flex items-center gap-2">
                        <AlertOctagon className="text-red-500" /> Aggression Index
                    </h3>

                    <div className="relative w-64 h-64 flex items-center justify-center">
                        {/* Rotating Rings */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 border-4 border-dashed border-red-500/20 rounded-full"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-4 border-4 border-dashed border-orange-500/20 rounded-full"
                        />

                        <div className="text-center z-10">
                            <div className="text-6xl font-black text-white glow-text-red">8.4</div>
                            <div className="text-xs font-bold text-red-400 uppercase tracking-[0.3em]">HIGH GRADE</div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-8 w-full text-center">
                        <div>
                            <div className="text-2xl font-bold text-white">92%</div>
                            <div className="text-[10px] text-white/40 uppercase font-black">Mitotic Rate</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">High</div>
                            <div className="text-[10px] text-white/40 uppercase font-black">Vascularity</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">Yes</div>
                            <div className="text-[10px] text-white/40 uppercase font-black">Necrosis</div>
                        </div>
                    </div>
                </GlassPanel>

                {/* Brain Mapping */}
                <GlassPanel className="p-8 relative">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Brain className="text-[#4CC9F0]" /> Region Mapping
                    </h3>

                    <div className="relative h-[400px] bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-20 pointer-events-none">
                            {Array.from({ length: 144 }).map((_, i) => (
                                <div key={i} className="border-[0.5px] border-white/20" />
                            ))}
                        </div>

                        {/* Abstract Brain Map Overlay */}
                        <div className="relative w-64 h-64 bg-[#0A2463]/50 rounded-full blur-sm">
                            {/* Tumor Location */}
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute top-1/4 right-1/4 w-8 h-8 bg-red-500 rounded-full blur-md"
                            />
                            <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-white rounded-full translate-x-2.5 translate-y-2.5 shadow-[0_0_20px_rgba(255,0,0,1)]" />

                            {/* Crosshair */}
                            <div className="absolute top-1/4 right-1/4 w-32 h-[1px] bg-red-500/50 -translate-x-12 translate-y-4 rotate-45" />
                            <div className="absolute top-1/4 right-1/4 h-32 w-[1px] bg-red-500/50 translate-x-4 -translate-y-12 rotate-45" />
                        </div>

                        <div className="absolute bottom-6 left-6 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-white">
                                <Target size={16} className="text-red-500" />
                                <span>Distance to Motor Cortex: <strong>4.2mm</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white">
                                <Activity size={16} className="text-orange-500" />
                                <span>Functional Risk: <strong>Critical</strong></span>
                            </div>
                        </div>
                    </div>
                </GlassPanel>

            </div>
        </div>
    );
};

export default NeuroAnalysisPage;
