
import React, { useState, useEffect } from 'react';
import GlassPanel from '../components/ui/GlassPanel';
import GlassButton from '../components/ui/GlassButton';
import { ShieldCheck, XCircle, AlertOctagon, FileText, CheckCircle2, Activity, Fingerprint } from 'lucide-react';
import { reasoningService } from '../services/NeuroReasoningService';
import { ClinicalProposal } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const ClinicianDashboard: React.FC = () => {
    const [proposals, setProposals] = useState<ClinicalProposal[]>([]);
    const [selectedProposal, setSelectedProposal] = useState<ClinicalProposal | null>(null);
    const [signature, setSignature] = useState('');
    const [signing, setSigning] = useState(false);

    useEffect(() => {
        loadProposals();
    }, []);

    const loadProposals = async () => {
        const data = await reasoningService.getPendingProposals();
        setProposals(data);
    };

    const handleApprove = async () => {
        if (!signature) {
            alert("Digital Signature Required");
            return;
        }
        if (selectedProposal) {
            setSigning(true);
            await new Promise(r => setTimeout(r, 1500)); // Simulate cryptographic signing
            await reasoningService.signProposal(selectedProposal.id, signature);
            setSigning(false);
            setSignature('');
            setSelectedProposal(null);
            loadProposals(); // Refresh
            alert(`Proposal ${selectedProposal.id} authorized by Dr. ${signature}`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <ShieldCheck className="text-[#4CC9F0]" /> Clinician Cockpit
                </h1>
                <p className="text-gray-600">Human-in-the-Loop Oversight & Authorization Layer.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Worklist */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2">Pending Review ({proposals.length})</h3>
                    {proposals.length === 0 && <div className="text-gray-500 italic">All caught up. No pending AI proposals.</div>}

                    {proposals.map(prop => (
                        <GlassPanel
                            key={prop.id}
                            onClick={() => setSelectedProposal(prop)}
                            className={`cursor-pointer transition-all hover:bg-gray-50 border-l-4 bg-white border border-gray-200 ${selectedProposal?.id === prop.id ? 'bg-blue-50 border-l-[#4CC9F0]' : 'border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${prop.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {prop.riskLevel} Risk
                                </span>
                                <span className="text-xs text-gray-500 font-mono">{prop.id}</span>
                            </div>
                            <div className="font-bold text-gray-900 mb-1">{prop.type} PROPOSAL</div>
                            <div className="text-sm text-gray-600 line-clamp-2">{prop.description}</div>
                        </GlassPanel>
                    ))}
                </div>

                {/* Detail View */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {selectedProposal ? (
                            <motion.div
                                key={selectedProposal.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <GlassPanel className="h-full min-h-[500px] flex flex-col bg-white border border-gray-200">
                                    <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProposal.description}</h2>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 text-sm text-[#4CC9F0]">
                                                    <Activity size={16} /> AI Confidence: {(selectedProposal.aiConfidence * 100).toFixed(1)}%
                                                </div>
                                            </div>
                                        </div>
                                        <Activity className="text-gray-200" size={64} />
                                    </div>

                                    {/* Reasoning Trace */}
                                    <div className="flex-1 space-y-4 mb-8">
                                        <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-4">AI Reasoning Trace</h3>
                                        {selectedProposal.reasoningTraces.map((trace, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-2 h-2 rounded-full bg-[#4CC9F0]" />
                                                    {i < selectedProposal.reasoningTraces.length - 1 && <div className="w-0.5 h-full bg-[#4CC9F0]/20 my-1" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-gray-900 font-bold">{trace.step}</span>
                                                        <span className="text-xs text-[#4CC9F0] border border-[#4CC9F0]/30 px-1.5 rounded">
                                                            {(trace.confidence * 100).toFixed(0)}% Conf
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">{trace.rationale}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Area */}
                                    <div className="bg-gray-50 -m-8 mt-auto p-8 border-t border-gray-200">
                                        <div className="flex items-center gap-4 mb-4">
                                            <Fingerprint className={signature ? 'text-green-500' : 'text-gray-400'} />
                                            <input
                                                type="password"
                                                placeholder="Enter Digital Signature ID to Authorize"
                                                value={signature}
                                                onChange={e => setSignature(e.target.value)}
                                                className="bg-white border-b-2 border-gray-300 px-2 py-1 text-gray-900 w-full focus:outline-none focus:border-[#4CC9F0]"
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <GlassButton
                                                onClick={handleApprove}
                                                disabled={signing || !signature}
                                                className="flex-1 justify-center bg-green-500 hover:bg-green-600 border-0"
                                                icon={signing ? <Activity className="animate-spin" /> : <CheckCircle2 />}
                                            >
                                                {signing ? 'Verifying Signature...' : 'Authorize Action'}
                                            </GlassButton>
                                            <GlassButton
                                                className="flex-1 justify-center bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/10"
                                                icon={<XCircle />}
                                            >
                                                Reject & Flag
                                            </GlassButton>
                                        </div>
                                    </div>
                                </GlassPanel>
                            </motion.div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 font-bold text-lg uppercase tracking-widest border-2 border-dashed border-gray-300 rounded-3xl">
                                Select a Proposal to Review
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ClinicianDashboard;
