
import React, { useState } from 'react';
import GlassButton from './ui/GlassButton';
import GlassPanel from './ui/GlassPanel';
import { FileText, Download, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReportGeneratorProps {
    scanId: string;
    patientName: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ scanId, patientName }) => {
    const [generating, setGenerating] = useState(false);
    const [complete, setComplete] = useState(false);

    const generateReport = async () => {
        setGenerating(true);

        // Simulate complex PDF generation process
        await new Promise(r => setTimeout(r, 2500));

        setGenerating(false);
        setComplete(true);

        // Trigger download (Mock)
        const element = document.createElement("a");
        const file = new Blob(["NeuroVision AI Report - Encrypted Content"], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `NeuroVision_Report_${scanId}.txt`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    };

    return (
        <GlassPanel className="p-6">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <FileText className="text-[#4CC9F0]" />
                </div>
                <div>
                    <h3 className="font-bold text-white">AI Diagnostic Report</h3>
                    <p className="text-xs text-white/40">Includes Heatmaps & Probabilities</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!complete ? (
                    <GlassButton
                        onClick={generateReport}
                        disabled={generating}
                        className="w-full justify-center"
                        icon={generating ? <Loader2 className="animate-spin" /> : <Download />}
                    >
                        {generating ? 'Generating PDF...' : 'Download Report'}
                    </GlassButton>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-500/20 border border-green-500/50 rounded-xl p-3 flex items-center justify-center gap-2 text-green-200 font-bold"
                    >
                        <Check size={16} /> Report Downloaded
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassPanel>
    );
};

export default ReportGenerator;
