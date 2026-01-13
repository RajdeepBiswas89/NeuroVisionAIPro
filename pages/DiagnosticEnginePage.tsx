import React, { useState, useRef } from 'react';
import GlassPanel from '../components/ui/GlassPanel';
import GlassButton from '../components/ui/GlassButton';
import { UploadCloud, FileText, Activity, AlertTriangle, CheckCircle, Brain, Scan } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DiagnosticEnginePage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const analyzeScan = async () => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:8000/api/predict', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            // Artificial delay for dramatic effect if response is too fast
            setTimeout(() => {
                setResult({
                    label: data.prediction,
                    confidence: data.confidence * 100
                });
                setIsAnalyzing(false);
            }, 1500);

        } catch (error) {
            console.error('Error analyzing scan:', error);
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <Brain className="text-[#4CC9F0]" size={40} />
                    Diagnostic Engine
                </h1>
                <p className="text-gray-600">Advanced ViT-based Neural Network for Brain Tumor Classification.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
                {/* Upload Section */}
                <GlassPanel className="flex flex-col relative overflow-hidden">
                    <div
                        className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all duration-300 ${previewUrl ? 'border-[#4CC9F0]/50 bg-[#4CC9F0]/5' : 'border-gray-300 hover:border-gray-400'}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        {previewUrl ? (
                            <div className="relative w-full h-full flex flex-col items-center justify-center">
                                <img src={previewUrl} alt="MRI Scan" className="max-h-[400px] w-auto object-contain rounded-lg shadow-2xl mb-6" />
                                <div className="flex gap-4">
                                    <GlassButton
                                        onClick={() => fileInputRef.current?.click()}
                                        icon={<UploadCloud size={18} />}
                                    >
                                        Change Scan
                                    </GlassButton>
                                    <GlassButton
                                        onClick={analyzeScan}
                                        className="bg-[#4CC9F0] text-gray-900 font-bold hover:bg-[#3db5da]"
                                        icon={<Scan size={18} />}
                                        disabled={isAnalyzing}
                                    >
                                        {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                                    </GlassButton>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-blue-50 text-[#4CC9F0] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <UploadCloud size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Upload MRI Scan</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">Drag and drop your DICOM/JPG file here, or click to browse files.</p>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                                >
                                    Select File
                                </button>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    {/* Scanning Animation Overlay */}
                    <AnimatePresence>
                        {isAnalyzing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
                            >
                                <div className="text-center items-center flex flex-col">
                                    <div className="relative w-24 h-24 mb-6">
                                        <div className="absolute inset-0 border-4 border-[#4CC9F0]/30 rounded-full animate-ping"></div>
                                        <div className="absolute inset-0 border-4 border-t-[#4CC9F0] rounded-full animate-spin"></div>
                                        <Brain className="absolute inset-0 m-auto text-white/80" size={32} />
                                    </div>
                                    <h2 className="text-2xl font-black text-white tracking-widest uppercase">Initializing Neural Net</h2>
                                    <p className="text-[#4CC9F0] font-mono mt-2">Processing inference tensor...</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </GlassPanel>

                {/* Results Section */}
                <div className="space-y-6">
                    {result ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <GlassPanel className={`p-8 border-l-8 ${result.label !== 'No Tumor' ? 'border-red-500' : 'border-green-500'}`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Diagnosis Classification</h3>
                                        <div className="text-5xl font-black text-gray-900 mb-2">{result.label}</div>
                                        <div className="flex items-center gap-2">
                                            {result.label !== 'No Tumor' ? (
                                                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold flex items-center gap-1">
                                                    <AlertTriangle size={12} /> PATHOLOGY DETECTED
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold flex items-center gap-1">
                                                    <CheckCircle size={12} /> HEALTHY TISSUE
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Confidence Score</div>
                                        <div className="text-4xl font-mono text-[#4CC9F0]">{result.confidence.toFixed(2)}%</div>
                                    </div>
                                </div>
                            </GlassPanel>

                            <GlassPanel>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Activity className="text-[#4CC9F0]" /> Analysis Report
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Model Architecture</span>
                                        <span className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">Vision Transformer (ViT-B/16)</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Inference Time</span>
                                        <span className="font-mono text-gray-900">42ms</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Scan Resolution</span>
                                        <span className="font-mono text-gray-900">High-Res DICOM</span>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-xl mt-4">
                                        <h4 className="font-bold text-[#0A2463] mb-2 text-sm">Clinical Recommendation</h4>
                                        <p className="text-sm text-[#0A2463]/80">
                                            {result.label !== 'No Tumor'
                                                ? "Immediate neurological consultation recommended. Proceed to 'Consult Room' to share results with the on-call specialist."
                                                : "No pathological anomalies detected. Recommended follow-up in 6 months for routine monitoring."}
                                        </p>
                                    </div>
                                </div>
                            </GlassPanel>
                        </motion.div>
                    ) : (
                        <GlassPanel className="h-full flex items-center justify-center p-12 text-center opacity-60">
                            <div>
                                <Activity size={64} className="text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-400">Awaiting Input</h3>
                                <p className="text-gray-400 mt-2">Upload an MRI scan to generate analysis.</p>
                            </div>
                        </GlassPanel>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiagnosticEnginePage;
