import React, { useState, useEffect } from 'react';
import { Truck, Package, CheckCircle, Clock, MapPin, Phone, User } from 'lucide-react';

interface OrderStatus {
    status: 'placed' | 'confirmed' | 'preparing' | 'dispatched' | 'delivered';
    timestamp: string;
    message: string;
}

interface DeliveryPerson {
    name: string;
    phone: string;
    rating: number;
    vehicleNumber: string;
}

interface OrderTrackerProps {
    orderId: string;
    estimatedDelivery: string;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ orderId, estimatedDelivery }) => {
    const [currentStatus, setCurrentStatus] = useState<OrderStatus['status']>('placed');
    const [deliveryPerson] = useState<DeliveryPerson>({
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        rating: 4.8,
        vehicleNumber: 'MH 02 AB 1234'
    });

    const statuses: OrderStatus[] = [
        { status: 'placed', timestamp: new Date().toISOString(), message: 'Order placed successfully' },
        { status: 'confirmed', timestamp: '', message: 'Pharmacy confirmed your order' },
        { status: 'preparing', timestamp: '', message: 'Medicines being prepared' },
        { status: 'dispatched', timestamp: '', message: 'Out for delivery' },
        { status: 'delivered', timestamp: '', message: 'Order delivered' }
    ];

    const statusIndex = statuses.findIndex(s => s.status === currentStatus);

    // Simulate status updates
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStatus(prev => {
                const currentIndex = statuses.findIndex(s => s.status === prev);
                if (currentIndex < statuses.length - 1) {
                    return statuses[currentIndex + 1].status;
                }
                return prev;
            });
        }, 10000); // Update every 10 seconds for demo

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Track Your Order</h3>
                    <p className="text-sm text-gray-600">Order ID: #{orderId}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                    <p className="text-lg font-bold text-[#2A9D8F]">{estimatedDelivery}</p>
                </div>
            </div>

            {/* Timeline */}
            <div className="space-y-6 mb-6">
                {statuses.map((status, index) => {
                    const isCompleted = index <= statusIndex;
                    const isCurrent = index === statusIndex;

                    return (
                        <div key={status.status} className="flex gap-4">
                            {/* Icon */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                                            ? 'bg-gradient-to-r from-[#4CC9F0] to-[#2A9D8F] text-white'
                                            : 'bg-gray-200 text-gray-400'
                                        } ${isCurrent ? 'ring-4 ring-[#4CC9F0]/30 scale-110' : ''}`}
                                >
                                    {status.status === 'placed' && <Package size={24} />}
                                    {status.status === 'confirmed' && <CheckCircle size={24} />}
                                    {status.status === 'preparing' && <Clock size={24} />}
                                    {status.status === 'dispatched' && <Truck size={24} />}
                                    {status.status === 'delivered' && <CheckCircle size={24} />}
                                </div>
                                {index < statuses.length - 1 && (
                                    <div
                                        className={`w-0.5 h-12 transition-colors duration-300 ${isCompleted ? 'bg-[#4CC9F0]' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-6">
                                <h4 className={`font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {status.message}
                                </h4>
                                {status.timestamp && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(status.timestamp).toLocaleString()}
                                    </p>
                                )}
                                {isCurrent && (
                                    <div className="mt-2 text-sm text-[#4CC9F0] font-medium animate-pulse">
                                        In Progress...
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Delivery Person Info */}
            {currentStatus === 'dispatched' && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200 animate-fadeIn">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <User size={20} className="text-[#4CC9F0]" />
                        Delivery Partner
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-semibold text-gray-900">{deliveryPerson.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Rating</p>
                            <p className="font-semibold text-gray-900">⭐ {deliveryPerson.rating}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Vehicle</p>
                            <p className="font-semibold text-gray-900">{deliveryPerson.vehicleNumber}</p>
                        </div>
                        <div>
                            <a
                                href={`tel:${deliveryPerson.phone}`}
                                className="flex items-center gap-2 px-3 py-2 bg-[#4CC9F0] text-white rounded-lg font-semibold hover:bg-[#2A9D8F] transition-colors"
                            >
                                <Phone size={16} />
                                Call
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Live Location (Mock) */}
            {currentStatus === 'dispatched' && (
                <div className="mt-4 bg-gray-100 rounded-xl p-4 h-48 flex items-center justify-center border border-gray-200">
                    <div className="text-center">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium">Live tracking map</p>
                        <p className="text-sm text-gray-500">2.3 km away</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTracker;
