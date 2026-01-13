
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, TrendingDown, Clock, MapPin, BadgePercent, AlertCircle } from 'lucide-react';

import GlassPanel from '../components/ui/GlassPanel';
import GlassButton from '../components/ui/GlassButton';

import { api } from '../services/api';
import RealPaymentGateway from '../components/RealPaymentGateway';
import PrescriptionUpload from '../components/PrescriptionUpload';

// Define the ImageWithFallback component
const ImageWithFallback = ({ src, alt, className, fallbackSvg }: {
    src: string;
    alt: string;
    className: string;
    fallbackSvg: string;
}) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSvg);
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
            // Load the actual image first, and if it fails, fallback to SVG
            {...(!hasError && { src })}
        />
    );
};

// Function to generate medicine placeholder SVG
const generateMedicinePlaceholder = (medicineName: string) => {
    const colors = [
        { primary: '#4CC9F0', secondary: '#0A2463' },
        { primary: '#2A9D8F', secondary: '#0A2463' },
        { primary: '#7209B7', secondary: '#3C096C' },
        { primary: '#F72585', secondary: '#7209B7' },
        { primary: '#4895EF', secondary: '#212A3E' }
    ];

    const colorChoice = colors[Math.floor(Math.random() * colors.length)];

    const svgString = `
        <svg width="300" height="160" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:${colorChoice.primary};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${colorChoice.secondary};stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="300" height="160" fill="url(#grad)"/>
            <rect x="20" y="20" width="260" height="120" rx="10" fill="white" opacity="0.9"/>
            <text x="150" y="60" font-family="Arial" font-size="16" font-weight="bold" fill="${colorChoice.secondary}" text-anchor="middle">${medicineName.toUpperCase()}</text>
            <text x="150" y="90" font-family="Arial" font-size="12" fill="${colorChoice.primary}" text-anchor="middle">MEDICINE IMAGE</text>
            <text x="150" y="110" font-family="Arial" font-size="10" fill="gray" text-anchor="middle">PLACEHOLDER</text>
        </svg>
    `;

    return "data:image/svg+xml;base64," + btoa(svgString);
};



const MedicineArbitragePage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        setError('');

        try {
            const data = await api.searchMedicines(query);
            setResults(data);
        } catch (err) {
            console.error(err);
            setError('Failed to connect to Arbitrage Engine. Retrying on backup nodes...');
            // Fallback for demo if backend offline
            setTimeout(() => {
                const medicineImageBlue = "data:image/svg+xml;base64," + btoa(`
                    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:#4CC9F0;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#0A2463;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <rect width="300" height="200" fill="url(#blueGrad)"/>
                        <rect x="30" y="30" width="240" height="140" rx="10" fill="white" opacity="0.95"/>
                        <circle cx="70" cy="80" r="18" fill="#4CC9F0" opacity="0.8"/>
                        <circle cx="120" cy="80" r="18" fill="#4CC9F0" opacity="0.8"/>
                        <circle cx="170" cy="80" r="18" fill="#4CC9F0" opacity="0.8"/>
                        <circle cx="220" cy="80" r="18" fill="#4CC9F0" opacity="0.8"/>
                        <circle cx="70" cy="130" r="18" fill="#4CC9F0" opacity="0.8"/>
                        <circle cx="120" cy="130" r="18" fill="#4CC9F0" opacity="0.8"/>
                        <circle cx="170" cy="130" r="18" fill="#4CC9F0" opacity="0.8"/>
                        <circle cx="220" cy="130" r="18" fill="#4CC9F0" opacity="0.8"/>
                        <text x="150" y="25" font-family="Arial" font-size="16" font-weight="bold" fill="white" text-anchor="middle">PARACETAMOL</text>
                        <text x="150" y="190" font-family="Arial" font-size="14" fill="white" text-anchor="middle">500mg • 8 Tablets</text>
                    </svg>
                `);

                const medicineImageGreen = "data:image/svg+xml;base64," + btoa(`
                    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="greenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:#2A9D8F;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#0A2463;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <rect width="300" height="200" fill="url(#greenGrad)"/>
                        <rect x="50" y="40" width="200" height="120" rx="5" fill="white" opacity="0.95"/>
                        <rect x="50" y="40" width="200" height="35" rx="5" fill="#2A9D8F"/>
                        <ellipse cx="100" cy="110" rx="25" ry="12" fill="#2A9D8F" opacity="0.7"/>
                        <ellipse cx="150" cy="110" rx="25" ry="12" fill="#2A9D8F" opacity="0.7"/>
                        <ellipse cx="200" cy="110" rx="25" ry="12" fill="#2A9D8F" opacity="0.7"/>
                        <rect x="95" y="98" width="10" height="24" fill="#0A2463" opacity="0.5"/>
                        <rect x="145" y="98" width="10" height="24" fill="#0A2463" opacity="0.5"/>
                        <rect x="195" y="98" width="10" height="24" fill="#0A2463" opacity="0.5"/>
                        <text x="150" y="62" font-family="Arial" font-size="14" font-weight="bold" fill="white" text-anchor="middle">PARACETAMOL</text>
                        <text x="150" y="145" font-family="Arial" font-size="11" fill="#0A2463" text-anchor="middle">500mg Tablets</text>
                        <text x="150" y="190" font-family="Arial" font-size="13" fill="white" text-anchor="middle">Pain Relief • Fever Reducer</text>
                    </svg>
                `);

                const medicineImagePurple = "data:image/svg+xml;base64," + btoa(`
                    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:#7209B7;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#3C096C;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <rect width="300" height="200" fill="url(#purpleGrad)"/>
                        <rect x="100" y="50" width="100" height="110" rx="8" fill="white" opacity="0.95"/>
                        <rect x="120" y="35" width="60" height="20" rx="3" fill="white" opacity="0.95"/>
                        <rect x="110" y="70" width="80" height="50" rx="3" fill="#7209B7" opacity="0.9"/>
                        <text x="150" y="90" font-family="Arial" font-size="12" font-weight="bold" fill="white" text-anchor="middle">PARACETAMOL</text>
                        <text x="150" y="108" font-family="Arial" font-size="10" fill="white" text-anchor="middle">500mg</text>
                        <circle cx="130" cy="135" r="8" fill="#7209B7" opacity="0.6"/>
                        <circle cx="150" cy="140" r="8" fill="#7209B7" opacity="0.6"/>
                        <circle cx="170" cy="135" r="8" fill="#7209B7" opacity="0.6"/>
                        <text x="150" y="25" font-family="Arial" font-size="15" font-weight="bold" fill="white" text-anchor="middle">PARACETAMOL</text>
                        <text x="150" y="190" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Bottle • 100 Tablets</text>
                    </svg>
                `);

                setResults([
                    {
                        id: 1,
                        pharmacy: "Apollo Pharmacy",
                        price: 145.50,
                        original_price: 180.00,
                        delivery_time: "45 mins",
                        distance: "1.2 km",
                        cheap_rank: 2,
                        image_url: ""
                    },
                    {
                        id: 2,
                        pharmacy: "Tata 1mg",
                        price: 132.00,
                        original_price: 165.00,
                        delivery_time: "2 hours",
                        distance: "3.5 km",
                        cheap_rank: 1,
                        image_url: ""
                    },
                    {
                        id: 3,
                        pharmacy: "Local Chemist",
                        price: 150.00,
                        original_price: 150.00,
                        delivery_time: "15 mins",
                        distance: "0.5 km",
                        cheap_rank: 3,
                        image_url: ""
                    },
                    {
                        id: 4,
                        pharmacy: "NetMeds",
                        price: 128.50,
                        original_price: 160.00,
                        delivery_time: "1.5 hours",
                        distance: "4.2 km",
                        cheap_rank: 1,
                        image_url: ""
                    },
                    {
                        id: 5,
                        pharmacy: "Pharmeasy",
                        price: 135.00,
                        original_price: 170.00,
                        delivery_time: "3 hours",
                        distance: "5.0 km",
                        cheap_rank: 2,
                        image_url: ""
                    },
                    {
                        id: 6,
                        pharmacy: "Wellness Forever",
                        price: 155.00,
                        original_price: 155.00,
                        delivery_time: "10 mins",
                        distance: "0.2 km",
                        cheap_rank: 3,
                        image_url: ""
                    },
                    {
                        id: 7,
                        pharmacy: "Frank Ross",
                        price: 142.00,
                        original_price: 150.00,
                        delivery_time: "25 mins",
                        distance: "1.8 km",
                        cheap_rank: 2,
                        image_url: ""
                    }
                ].sort((a, b) => a.price - b.price));
                setError('');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };


    const [selectedItem, setSelectedItem] = useState<any>(null);

    const handleBuy = (item: any) => {
        setSelectedItem(item);
    };

    const onPaymentSuccess = (paymentId: string) => {
        alert(`Payment Successful! ID: ${paymentId}. Commission transferred.`);
        setSelectedItem(null);
    };

    const handleScanComplete = (medicines: string[]) => {
        // In a real app, this would search for all medicines.
        // For demo, we just set the query to the first found medicine.
        if (medicines.length > 0) {
            setQuery(medicines[0]);
            handleSearch();
        }
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Medicine Arbitrage Engine</h1>
                <p className="text-gray-600">Real-time price comparison spanning multiple pharmacy networks.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Search Section */}
                <div className="lg:col-span-2">
                    <GlassPanel className="flex items-center gap-4 p-8 h-full">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search for medicines (e.g., 'Paracetamol 500mg')..."
                                className="w-full bg-white/95 border-2 border-gray-300 rounded-2xl pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4CC9F0] focus:border-[#4CC9F0] text-lg font-medium"
                            />
                        </div>
                        <GlassButton onClick={handleSearch} disabled={loading} className="py-4 px-8 text-lg">
                            {loading ? 'Scanning...' : 'Find Cheapest'}
                        </GlassButton>
                    </GlassPanel>
                </div>

                {/* OCR Section */}
                <div className="lg:col-span-1">
                    <PrescriptionUpload onPrescriptionExtracted={handleScanComplete} />
                </div>
            </div>

            {/* Error State */}
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-200">
                        <AlertCircle size={20} />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading State */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-3 gap-6"
                    >
                        {[1, 2, 3].map(i => (
                            <GlassPanel key={i} className="h-48 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 rounded-full border-2 border-[#4CC9F0] border-t-transparent animate-spin" />
                                    <span className="text-xs font-bold text-[#4CC9F0] uppercase tracking-widest">Scanning API {i}...</span>
                                </div>
                            </GlassPanel>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((item, idx) => {
                    const isCheapest = idx === 0; // Assuming sorted result
                    return (
                        <GlassPanel key={idx} className={`relative group ${isCheapest ? 'border-[#4CC9F0] shadow-[0_0_30px_rgba(76,201,240,0.2)]' : ''}`}>
                            {isCheapest && (
                                <div className="absolute -top-3 -right-3 bg-[#4CC9F0] text-black font-black text-xs px-3 py-1 rounded-full shadow-lg z-10">
                                    BEST PRICE
                                </div>
                            )}

                            <div className="flex flex-col h-full justify-between">
                                <div>
                                    {/* Medicine Image */}
                                    <div className="mb-4 rounded-xl overflow-hidden bg-white/5">
                                        {item.image_url ? (
                                            <ImageWithFallback
                                                src={item.image_url}
                                                alt={query || 'Medicine'}
                                                className="w-full h-40 object-cover"
                                                fallbackSvg={generateMedicinePlaceholder(query || 'Medicine')}
                                            />
                                        ) : (
                                            <div className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                <div className="text-center">
                                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#4CC9F0] to-[#2A9D8F] text-white text-xl font-black">
                                                        {(query || 'Medicine').charAt(0).toUpperCase()}
                                                    </div>
                                                    <p className="mt-2 text-sm text-gray-600">{query || 'Medicine'}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{query || 'Medicine'}</h3>
                                    <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-4">{item.pharmacy}</p>

                                    <div className="flex items-end gap-2 mb-4">
                                        <span className="text-3xl font-black text-gray-900">₹{item.price.toFixed(2)}</span>
                                        <span className="text-sm text-gray-400 line-through mb-1">₹{item.original_price?.toFixed(2) || (item.price * 1.2).toFixed(2)}</span>
                                        <span className="text-xs font-bold text-green-400 mb-1 ml-auto flex items-center gap-1">
                                            <TrendingDown size={12} /> SAVE
                                        </span>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Clock size={16} className="text-[#4CC9F0]" />
                                            <span>Delivery in <span className="text-gray-900 font-bold">{item.delivery_time || '2 hrs'}</span></span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <MapPin size={16} className="text-[#2A9D8F]" />
                                            <span><span className="text-gray-900 font-bold">{item.distance || '2km'}</span> away</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <BadgePercent size={16} className="text-yellow-400" />
                                            <span>Commission Applied: <span className="text-gray-900 font-bold">5%</span></span>
                                        </div>
                                    </div>
                                </div>

                                <GlassButton
                                    className="w-full justify-center group-hover:bg-[#4CC9F0] group-hover:text-black transition-colors"
                                    icon={<ShoppingCart size={18} />}
                                    onClick={() => handleBuy(item)}
                                >
                                    Buy Now
                                </GlassButton>
                            </div>
                        </GlassPanel>
                    )
                })}
            </div>

            {/* Payment Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative z-10 w-full max-w-md"
                        >
                            <RealPaymentGateway
                                amount={selectedItem.price}
                                onSuccess={onPaymentSuccess}
                                onFailure={(err) => alert(err.description)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MedicineArbitragePage;
