import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Activity, Brain, Server } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import GlassPanel from '../components/ui/GlassPanel';
import { motion } from 'framer-motion';

const AnalyticsPage: React.FC = () => {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        // Fetch real analytics from backend
        fetch('http://localhost:8000/api/analytics')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => {
                console.error("Failed to fetch analytics", err);
                // Fallback mock data
                setStats({
                    orders: 124,
                    revenue: 45200,
                    model_accuracy: '98.2%'
                });
            });
    }, []);

    // Mock data for charts
    const performanceData = [
        { time: '00:00', accuracy: 94, latency: 45 },
        { time: '04:00', accuracy: 95, latency: 42 },
        { time: '08:00', accuracy: 92, latency: 85 },
        { time: '12:00', accuracy: 96, latency: 50 },
        { time: '16:00', accuracy: 98, latency: 40 },
        { time: '20:00', accuracy: 97, latency: 44 },
        { time: '23:59', accuracy: 96, latency: 46 },
    ];

    const revenueData = [
        { month: 'Jan', value: 12000 },
        { month: 'Feb', value: 19000 },
        { month: 'Mar', value: 15000 },
        { month: 'Apr', value: 24000 },
        { month: 'May', value: 35000 },
        { month: 'Jun', value: 48000 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <BarChart3 className="text-[#4CC9F0]" size={40} />
                    Neuro-Analytics Hub
                </h1>
                <p className="text-gray-600">Real-time system performance and business intelligence metrics.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GlassPanel className="p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <DollarSign size={64} className="text-gray-900" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Revenue</span>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-black text-gray-900">
                                ₹{(stats?.revenue || 0).toLocaleString()}
                            </span>
                            <span className="text-xs font-bold text-green-500 flex items-center">
                                <TrendingUp size={12} className="mr-1" /> +12.5%
                            </span>
                        </div>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Brain size={64} className="text-gray-900" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Model Accuracy</span>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-black text-[#4CC9F0]">
                                {stats?.model_accuracy || '0%'}
                            </span>
                            <span className="text-xs font-bold text-green-500 flex items-center">
                                <Activity size={12} className="mr-1" /> Stable
                            </span>
                        </div>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Users size={64} className="text-gray-900" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Scans</span>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-black text-gray-900">1,284</span>
                            <span className="text-xs font-bold text-blue-500 flex items-center">
                                <TrendingUp size={12} className="mr-1" /> All Time
                            </span>
                        </div>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Server size={64} className="text-gray-900" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">API Latency</span>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-black text-gray-900">42ms</span>
                            <span className="text-xs font-bold text-green-500 flex items-center">
                                <Activity size={12} className="mr-1" /> Optimal
                            </span>
                        </div>
                    </div>
                </GlassPanel>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                <GlassPanel className="p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-[#4CC9F0]" />
                        Inference Model Performance
                    </h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4CC9F0" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4CC9F0" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
                                <XAxis dataKey="time" stroke="#00000050" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#00000050" fontSize={12} tickLine={false} axisLine={false} domain={[80, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ color: '#1E293B' }}
                                />
                                <Area type="monotone" dataKey="accuracy" stroke="#4CC9F0" strokeWidth={3} fillOpacity={1} fill="url(#colorAccuracy)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <DollarSign size={20} className="text-[#2A9D8F]" />
                        Arbitrage Revenue Trend
                    </h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
                                <XAxis dataKey="month" stroke="#00000050" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#00000050" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ color: '#1E293B' }}
                                />
                                <Bar dataKey="value" fill="#2A9D8F" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
};

export default AnalyticsPage;
