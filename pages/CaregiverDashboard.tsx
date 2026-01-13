
import React from 'react';
import GlassPanel from '../components/ui/GlassPanel';
import GlassButton from '../components/ui/GlassButton';
import { Heart, Bell, Calendar, Phone, Activity, ShieldCheck } from 'lucide-react';

const CaregiverDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Family Care Portal</h1>
                <p className="text-gray-600">Real-time monitoring and management for caregivers.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Patient Status */}
                <GlassPanel className="lg:col-span-2 bg-white border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Heart className="text-red-500" /> Patient Status: John Doe
                        </h3>
                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-green-200">
                            <Activity size={14} /> Stable
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-200">
                            <div className="text-2xl font-black text-gray-900">98%</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold">Adherence</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-200">
                            <div className="text-2xl font-black text-gray-900">Normal</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold">Vitals</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-200">
                            <div className="text-2xl font-black text-gray-900">4</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold">Days Left (Meds)</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-200">
                            <div className="text-2xl font-black text-gray-900">Next</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold">Appt: May 15</div>
                        </div>
                    </div>

                    <h4 className="font-bold text-gray-900 mb-4">Adherence Timeline</h4>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5, 6, 7].map(d => (
                            <div key={d} className={`flex-1 h-2 rounded-full ${d < 6 ? 'bg-green-500' : 'bg-gray-300'}`} />
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500 font-bold uppercase">
                        <span>Mon</span><span>Sun</span>
                    </div>
                </GlassPanel>

                {/* Action Center */}
                <div className="space-y-6">
                    <GlassPanel className="bg-red-500/10 border-red-500/30">
                        <h3 className="font-bold text-red-200 mb-4 flex items-center gap-2">
                            <Bell className="animate-bounce" /> Emergency
                        </h3>
                        <p className="text-xs text-red-100/60 mb-4">
                            Instant line to Dr. Smith and Emergency Services.
                        </p>
                        <GlassButton className="w-full justify-center bg-red-500 hover:bg-red-600 text-white border-0" icon={<Phone size={16} />}>
                            SOS Call
                        </GlassButton>
                    </GlassPanel>

                    <GlassPanel className="bg-white border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <ShieldCheck className="text-[#4CC9F0]" /> Medicine Refill
                        </h3>
                        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-700 font-bold">Rx</div>
                            <div>
                                <div className="font-bold text-gray-900 text-sm">Levipil 500</div>
                                <div className="text-xs text-red-600 font-bold">Refill needed in 4 days</div>
                            </div>
                        </div>
                        <GlassButton className="w-full justify-center" icon={<Calendar size={16} />}>
                            Order Refill
                        </GlassButton>
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
};

export default CaregiverDashboard;
