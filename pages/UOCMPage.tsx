
import React, { useState } from 'react';
import GlassPanel from '../components/ui/GlassPanel';
import { Zap, GitMerge, Clock, AlertTriangle, Cpu } from 'lucide-react';

const UOCMPage: React.FC = () => {
    const [urgency, setUrgency] = useState<number>(1.0);
    const [result, setResult] = useState<any>(null);
    const [isCollapsing, setIsCollapsing] = useState(false);

    const collapseGraph = async (appliedUrgency: number) => {
        setIsCollapsing(true);
        setUrgency(appliedUrgency);
        try {
            const res = await fetch(`http://localhost:8000/api/uocm/collapse?urgency=${appliedUrgency}`, {
                method: 'POST'
            });
            const data = await res.json();
            // Artificial delay to show the "computation"
            setTimeout(() => {
                setResult(data);
                setIsCollapsing(false);
            }, 600);
        } catch (e) {
            console.error(e);
            setIsCollapsing(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Cpu className="text-[#F72585] animate-pulse" size={32} />
                        Urgency-Oriented Computer
                    </h1>
                    <p className="text-white/40 font-medium mt-1">
                        GradientRuntime v1.0 • Correctness Expires
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8 flex-1">
                {/* Controls */}
                <div className="col-span-4 flex flex-col gap-4">
                    <GlassPanel className="p-6">
                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-6">Apply Urgency Pressure</h3>

                        <div className="space-y-4">
                            <button
                                onClick={() => collapseGraph(1.0)}
                                className="w-full text-left p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-emerald-400 font-bold">Standard Urgency (1.0)</span>
                                    <Clock size={16} className="text-emerald-400" />
                                </div>
                                <p className="text-xs text-white/40">Time is abundant. The graph will select the most precise path.</p>
                            </button>

                            <button
                                onClick={() => collapseGraph(5.5)}
                                className="w-full text-left p-4 rounded-xl border border-amber-500/30 hover:bg-amber-500/10 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-amber-500 font-bold">Elevated Urgency (5.5)</span>
                                    <GitMerge size={16} className="text-amber-500" />
                                </div>
                                <p className="text-xs text-white/40">Time is scarce. Heuristics are preferred over deep analysis.</p>
                            </button>

                            <button
                                onClick={() => collapseGraph(10.0)}
                                className="w-full text-left p-4 rounded-xl border border-[#F72585]/30 hover:bg-[#F72585]/10 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-[#F72585]/5 animate-pulse" />
                                <div className="relative z-10 flex items-center justify-between mb-2">
                                    <span className="text-[#F72585] font-bold">CRITICAL (10.0)</span>
                                    <Zap size={16} className="text-[#F72585]" />
                                </div>
                                <p className="text-xs text-white/60 relative z-10">Existence threatening. Precision is sacrificed for immediate survival.</p>
                            </button>
                        </div>
                    </GlassPanel>
                </div>

                {/* Visualizer */}
                <div className="col-span-8 relative">
                    <GlassPanel className="h-full p-8 flex flex-col items-center justify-center border-white/10 relative overflow-hidden">

                        {/* Graph Lines Background */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <svg className="w-full h-full">
                                <circle cx="50%" cy="20%" r="5" fill="white" />
                                <circle cx="20%" cy="80%" r="5" fill="white" />
                                <circle cx="80%" cy="80%" r="5" fill="white" />
                                <line x1="50%" y1="20%" x2="20%" y2="80%" stroke="white" strokeWidth="2" />
                                <line x1="50%" y1="20%" x2="80%" y2="80%" stroke="white" strokeWidth="2" />
                            </svg>
                        </div>

                        {!result && !isCollapsing && (
                            <div className="text-center">
                                <Cpu size={64} className="text-white/10 mx-auto mb-4" />
                                <p className="text-white/20 font-mono">WAITING FOR URGENCY GRADIENT...</p>
                            </div>
                        )}

                        {isCollapsing && (
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-4 border-[#F72585] border-t-transparent animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-[#F72585] animate-pulse">
                                    {(urgency).toFixed(1)}
                                </div>
                            </div>
                        )}

                        {result && !isCollapsing && (
                            <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
                                <div className={`p-6 rounded-2xl border ${result.urgency_applied > 5.0 ? 'border-[#F72585] bg-[#F72585]/10' : 'border-emerald-500 bg-emerald-500/10'}`}>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-black text-white">{result.fidelity_result === 1.0 ? 'PRECISE' : 'APPROXIMATE'}</h2>
                                        <div className="text-right">
                                            <p className="text-[10px] text-white/50 uppercase">Decay Forecast</p>
                                            <p className="text-white font-mono">{result.decay_forecast}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
                                            <span className="text-white/60">Selected Path</span>
                                            <span className="font-mono text-white bg-white/10 px-2 py-1 rounded">{result.selected_path}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
                                            <span className="text-white/60">Fidelity</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${result.fidelity_result === 1.0 ? 'bg-emerald-500' : 'bg-[#F72585]'}`}
                                                        style={{ width: `${result.fidelity_result * 100}%` }}
                                                    />
                                                </div>
                                                <span className="font-bold text-white">{(result.fidelity_result * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
};

export default UOCMPage;
