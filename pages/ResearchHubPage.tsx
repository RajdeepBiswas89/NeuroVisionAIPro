import React, { useState } from 'react';
import { BookOpen, FlaskConical, Stethoscope, ArrowRight, Video, FileText, Globe, Star, GraduationCap, PlayCircle, ExternalLink } from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import GlassButton from '../components/ui/GlassButton';
import { motion, AnimatePresence } from 'framer-motion';

const ResearchHubPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'updates' | 'videos' | 'scholar'>('updates');

    const articles = [
        {
            id: 1,
            category: 'Clinical Trial',
            title: 'CAR-T Cell Therapy for Glioblastoma',
            summary: 'New Phase II trial shows 40% reduction in tumor volume using EGFRvIII-targeted CAR-T cells.',
            source: 'Journal of Neuro-Oncology',
            date: '2 Days Ago',
            tags: ['Immunotherapy', 'Phase II', 'Recruiting']
        },
        {
            id: 2,
            category: 'Breakthrough',
            title: 'Non-Invasive Liquid Biopsy Protocol',
            summary: 'FDA approves new blood-based biomarker test for early detection of glioma recurrence.',
            source: 'Nature Medicine',
            date: '1 Week Ago',
            tags: ['Diagnostics', 'FDA Approved']
        },
        {
            id: 3,
            category: 'Treatment Update',
            title: 'Proton Beam Therapy Guidelines',
            summary: 'Updated guidelines for pediatric ependymoma suggesting reduced long-term cognitive side effects.',
            source: 'Lancet Oncology',
            date: '2 Weeks Ago',
            tags: ['Radiology', 'Pediatric']
        }
    ];

    const videos = [
        {
            id: 1,
            title: 'Glioblastoma Multiforme: Pathogenesis and Treatment',
            duration: '12:45',
            channel: 'Osmosis',
            thumbnail: 'https://img.youtube.com/vi/1H2g8C7M5U4/maxresdefault.jpg', // Placeholder ID
            link: 'https://www.youtube.com/results?search_query=glioblastoma+treatment'
        },
        {
            id: 2,
            title: 'Understanding Meningiomas: Benign vs Malignant',
            duration: '08:30',
            channel: 'NeuroSurgical TV',
            thumbnail: 'https://img.youtube.com/vi/ExMpToVqg6U/maxresdefault.jpg', // Placeholder ID
            link: 'https://www.youtube.com/results?search_query=meningioma+explanation'
        },
        {
            id: 3,
            title: 'Pituitary Adenomas: Surgery and Recovery',
            duration: '15:20',
            channel: 'Mayo Clinic',
            thumbnail: 'https://img.youtube.com/vi/7qW5y9yY5Zg/maxresdefault.jpg', // Placeholder ID
            link: 'https://www.youtube.com/results?search_query=pituitary+tumor+surgery'
        },
        {
            id: 4,
            title: 'Advances in Brain Tumor Immunotherapy',
            duration: '45:00',
            channel: 'TEDx',
            thumbnail: 'https://img.youtube.com/vi/8jC4geHdDSw/maxresdefault.jpg', // Placeholder ID
            link: 'https://www.youtube.com/results?search_query=brain+tumor+immunotherapy'
        }
    ];

    const papers = [
        {
            id: 1,
            title: "Deep Learning for Brain Tumor Segmentation in MRI: A Review",
            authors: "Smith J. et al.",
            journal: "IEEE Transactions on Medical Imaging",
            year: 2024,
            citations: 145,
            link: "#"
        },
        {
            id: 2,
            title: "Molecular profiling of H3 K27M-mutant diffuse midline glioma",
            authors: "K. Cohen et al.",
            journal: "Nature Genetics",
            year: 2023,
            citations: 89,
            link: "#"
        },
        {
            id: 3,
            title: "Efficacy of Tumor Treating Fields (TTFields) in Glioblastoma",
            authors: "Stupp R. et al.",
            journal: "JAMA Oncology",
            year: 2023,
            citations: 210,
            link: "#"
        },
        {
            id: 4,
            title: "AI-Driven Radiogenomics for Non-Invasive Classification",
            authors: "Rajdeep et al.",
            journal: "NeuroVision Journal",
            year: 2025,
            citations: 42,
            link: "#"
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <FlaskConical className="text-[#4CC9F0]" size={40} />
                    Research & Treatment Hub
                </h1>
                <p className="text-gray-600">Latest scientific breakthroughs, clinical trials, and multimedia resources.</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 border-b border-gray-200 pb-2">
                <button
                    onClick={() => setActiveTab('updates')}
                    className={`pb-2 px-4 font-bold text-sm transition-all ${activeTab === 'updates' ? 'text-[#4CC9F0] border-b-2 border-[#4CC9F0]' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Latest Updates
                </button>
                <button
                    onClick={() => setActiveTab('videos')}
                    className={`pb-2 px-4 font-bold text-sm transition-all ${activeTab === 'videos' ? 'text-[#4CC9F0] border-b-2 border-[#4CC9F0]' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Video Library
                </button>
                <button
                    onClick={() => setActiveTab('scholar')}
                    className={`pb-2 px-4 font-bold text-sm transition-all ${activeTab === 'scholar' ? 'text-[#4CC9F0] border-b-2 border-[#4CC9F0]' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Scholar Portal (PhD)
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {activeTab === 'updates' && (
                            <motion.div
                                key="updates"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                {articles.map((article) => (
                                    <GlassPanel key={article.id} className="p-0 transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer group relative overflow-hidden flex flex-col md:flex-row h-full md:h-48">
                                        {/* Article Image */}
                                        <div className="w-full md:w-48 h-32 md:h-full relative shrink-0">
                                            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                                            <div className="absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm">
                                                {article.category}
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col justify-between flex-1">
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                                        <Globe size={10} /> {article.source}
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-400">{article.date}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#4CC9F0] transition-colors leading-tight">{article.title}</h3>
                                                <p className="text-gray-600 text-sm line-clamp-2">{article.summary}</p>
                                            </div>

                                            <div className="flex gap-2 mt-3">
                                                {article.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </GlassPanel>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'videos' && (
                            <motion.div
                                key="videos"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                {videos.map((video) => (
                                    <a href={video.link} target="_blank" rel="noopener noreferrer" key={video.id} className="block group">
                                        <GlassPanel className="overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                                            <div className="aspect-video bg-gray-900 relative">
                                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <PlayCircle className="text-white w-8 h-8 opacity-90" fill="currentColor" />
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1 rounded">
                                                    {video.duration}
                                                </div>
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col">
                                                <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-[#4CC9F0]">{video.title}</h3>
                                                <p className="text-xs text-gray-500 mt-auto">{video.channel}</p>
                                            </div>
                                        </GlassPanel>
                                    </a>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'scholar' && (
                            <motion.div
                                key="scholar"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-4">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <GraduationCap className="text-blue-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0A2463]">PhD Scholar Access</h3>
                                        <p className="text-xs text-blue-800/70">Institutional access enabled. Full-text PDFs available for download.</p>
                                    </div>
                                </div>

                                {papers.map((paper) => (
                                    <GlassPanel key={paper.id} className="p-6 group hover:border-[#4CC9F0] cursor-pointer transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0A2463] mb-1">{paper.title}</h3>
                                                <p className="text-sm text-gray-600 mb-2">{paper.authors}</p>
                                                <div className="flex items-center gap-3 text-xs text-gray-400 font-bold uppercase">
                                                    <span>{paper.journal}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span>{paper.year}</span>
                                                </div>
                                            </div>
                                            <GlassButton className="shrink-0" icon={<ExternalLink size={14} />}>
                                                PDF
                                            </GlassButton>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                            <span className="text-xs font-bold text-gray-500">{paper.citations} Citations</span>
                                        </div>
                                    </GlassPanel>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <GlassPanel className="p-6 bg-gradient-to-br from-[#0A2463] to-[#4361EE] text-white border-none relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-10">
                            <GraduationCap size={120} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 relative z-10">Submit Research</h3>
                        <p className="text-sm text-white/70 mb-4 relative z-10">
                            Are you a researcher? Submit your findings to the NeuroVision global registry for peer review.
                        </p>
                        <button className="w-full py-2 bg-white text-[#0A2463] font-bold rounded-xl text-sm hover:bg-gray-100 transition-colors relative z-10">
                            Submit Manuscript
                        </button>
                    </GlassPanel>

                    <GlassPanel className="p-6">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Video size={16} /> Featured Webinars
                        </h3>
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="group cursor-pointer">
                                    <div className="aspect-video bg-gray-100 rounded-lg mb-2 relative overflow-hidden">
                                        <img
                                            src={`https://picsum.photos/seed/webinar${i}/300/200`}
                                            alt="Webinar Thumbnail"
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                                                <PlayCircle className="text-white w-6 h-6" fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#4CC9F0]">Advances in Immunotherapy</h4>
                                    <p className="text-xs text-gray-500">Dr. Sarah Chen • 45 min</p>
                                </div>
                            ))}
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
};

export default ResearchHubPage;
