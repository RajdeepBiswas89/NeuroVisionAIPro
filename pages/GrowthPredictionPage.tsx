
import React, { useState } from 'react';
import GlassPanel from '../components/ui/GlassPanel';
import GlassButton from '../components/ui/GlassButton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Calendar, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';

const mockGrowthData = [
    { date: '2023-11', size: 12.5, risk: 20 },
    { date: '2023-12', size: 13.2, risk: 25 },
    { date: '2024-01', size: 14.8, risk: 35 },
    { date: '2024-02', size: 15.1, risk: 38 },
    { date: '2024-03', size: 16.5, risk: 55 },
    { date: '2024-04', size: 18.2, risk: 65 },
    { date: '2024-05', size: 21.0, risk: 85 }, // Predicted
];

const GrowthPredictionPage: React.FC = () => {
    const [predictionMode, setPredictionMode] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Tumor Growth Prediction</h1>
                <p className="text-gray-600">AI-driven predictive modeling of tumor volumetric evolution.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2">
                    <GlassPanel className="h-[500px] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <TrendingUp className="text-[#4CC9F0]" /> Growth Trajectory
                            </h3>
                            <GlassButton
                                onClick={() => setPredictionMode(!predictionMode)}
                                className={predictionMode ? 'bg-red-500/20 border-red-500 text-red-100' : ''}
                            >
                                {predictionMode ? 'Hide AI Prediction' : 'Show 6-Month AI Forecast'}
                            </GlassButton>
                        </div>

                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={mockGrowthData}>
                                    <defs>
                                        <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4361EE" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4361EE" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
                                    <XAxis dataKey="date" stroke="#00000050" />
                                    <YAxis stroke="#00000050" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000000cc', border: '1px solid #ffffff20', borderRadius: '12px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="size"
                                        stroke="#4361EE"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorSize)"
                                    />
                                    {predictionMode && (
                                        <Line
                                            type="monotone"
                                            dataKey="risk"
                                            stroke="#EF4444"
                                            strokeDasharray="5 5"
                                            strokeWidth={2}
                                            name="Risk Index"
                                        />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassPanel>
                </div>

                {/* Info Panel */}
                <div className="space-y-6">
                    <GlassPanel className="relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="text-red-500" size={20} /> Reliability Score
                        </h3>
                        <div className="text-4xl font-black text-gray-900 mb-2">92<span className="text-sm text-gray-400">%</span></div>
                        <p className="text-sm text-gray-600">
                            The AI confidence interval suggests a high probability of accelerated growth if untreated within 30 days.
                        </p>
                    </GlassPanel>

                    <GlassPanel>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="text-[#2A9D8F]" size={20} /> Next Predicted Milestone
                        </h3>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-gray-50 rounded-xl text-center min-w-[60px]">
                                <div className="text-xs text-gray-400 uppercase font-black">MAY</div>
                                <div className="text-xl font-bold text-gray-900">15</div>
                            </div>
                            <div>
                                <div className="text-gray-900 font-bold">Critical Volume Threshold</div>
                                <div className="text-xs text-gray-500">Predicted size: 21.0mm³</div>
                            </div>
                        </div>
                        <GlassButton className="w-full justify-center text-xs uppercase tracking-widest" icon={<ArrowRight size={14} />}>
                            View Treatment Options
                        </GlassButton>
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
};

export default GrowthPredictionPage;
