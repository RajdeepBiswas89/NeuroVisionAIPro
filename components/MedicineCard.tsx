import React from 'react';
import { ShoppingCart, Star, TrendingDown, Zap } from 'lucide-react';

interface MedicineCardProps {
    name: string;
    dosage: string;
    manufacturer: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    reviews: number;
    inStock: boolean;
    fastDelivery?: boolean;
    imageUrl?: string;
    onAddToCart: () => void;
}

const MedicineCard: React.FC<MedicineCardProps> = ({
    name,
    dosage,
    manufacturer,
    price,
    originalPrice,
    discount,
    rating,
    reviews,
    inStock,
    fastDelivery,
    imageUrl,
    onAddToCart
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-[#4CC9F0] group">
            {/* Image Section */}
            <div className="relative h-48 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-[#4CC9F0] to-[#2A9D8F] rounded-full flex items-center justify-center text-white text-4xl font-black">
                            {name.charAt(0)}
                        </div>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {discount && discount > 0 && (
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <TrendingDown size={14} />
                            {discount}% OFF
                        </div>
                    )}
                    {fastDelivery && (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <Zap size={14} />
                            Fast Delivery
                        </div>
                    )}
                </div>

                {/* Stock Badge */}
                {!inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5">
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-[#4CC9F0] transition-colors">
                    {name}
                </h3>

                {/* Dosage & Manufacturer */}
                <p className="text-sm text-gray-600 mb-3">
                    {dosage} • {manufacturer}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-600">
                        {rating.toFixed(1)} ({reviews} reviews)
                    </span>
                </div>

                {/* Price Section */}
                <div className="flex items-end justify-between mb-4">
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-[#2A9D8F]">
                                ₹{price.toLocaleString()}
                            </span>
                            {originalPrice && originalPrice > price && (
                                <span className="text-sm text-gray-400 line-through">
                                    ₹{originalPrice.toLocaleString()}
                                </span>
                            )}
                        </div>
                        {discount && discount > 0 && (
                            <p className="text-xs text-green-600 font-semibold mt-1">
                                You save ₹{((originalPrice || price) - price).toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={onAddToCart}
                    disabled={!inStock}
                    className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${inStock
                            ? 'bg-gradient-to-r from-[#4CC9F0] to-[#2A9D8F] hover:shadow-xl hover:scale-105'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                >
                    <ShoppingCart size={18} />
                    {inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
};

export default MedicineCard;
