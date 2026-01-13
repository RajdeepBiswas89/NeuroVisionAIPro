import React, { useState } from 'react';
import { CreditCard, Smartphone, Wallet, DollarSign, CheckCircle, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentGatewayProps {
    amount: number;
    commission: number;
    onPaymentSuccess: (transactionId: string) => void;
    onCancel: () => void;
}

type PaymentMethod = 'upi' | 'card' | 'wallet' | 'cod';

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
    amount,
    commission,
    onPaymentSuccess,
    onCancel
}) => {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
    const [processing, setProcessing] = useState(false);
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVV, setCardCVV] = useState('');

    const paymentMethods = [
        { id: 'upi' as PaymentMethod, name: 'UPI', icon: Smartphone, popular: true },
        { id: 'card' as PaymentMethod, name: 'Card', icon: CreditCard, popular: false },
        { id: 'wallet' as PaymentMethod, name: 'Wallet', icon: Wallet, popular: false },
        { id: 'cod' as PaymentMethod, name: 'Cash on Delivery', icon: DollarSign, popular: false }
    ];

    const handlePayment = async () => {
        setProcessing(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        const transactionId = `TXN${Date.now()}`;
        setProcessing(false);
        onPaymentSuccess(transactionId);
    };

    return (
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl mx-auto overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4CC9F0] to-[#2A9D8F] p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Complete Payment</h2>
                        <p className="text-sm opacity-90 mt-1">Secure & encrypted transaction</p>
                    </div>
                    <Shield size={40} className="opacity-80" />
                </div>
                <div className="mt-4 bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Total Amount</span>
                        <span className="text-3xl font-black">₹{amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm opacity-90">
                        <span>Hospital Commission (5%)</span>
                        <span>₹{commission.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Payment Method Selection */}
                <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-4">Select Payment Method</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {paymentMethods.map((method) => (
                            <button
                                key={method.id}
                                onClick={() => setSelectedMethod(method.id)}
                                className={`relative p-4 rounded-xl border-2 transition-all ${selectedMethod === method.id
                                        ? 'border-[#4CC9F0] bg-blue-50'
                                        : 'border-gray-200 hover:border-[#4CC9F0]/50'
                                    }`}
                            >
                                {method.popular && (
                                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                        Popular
                                    </span>
                                )}
                                <method.icon className={`mx-auto mb-2 ${selectedMethod === method.id ? 'text-[#4CC9F0]' : 'text-gray-400'
                                    }`} size={32} />
                                <p className={`font-semibold text-sm ${selectedMethod === method.id ? 'text-gray-900' : 'text-gray-600'
                                    }`}>
                                    {method.name}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Payment Forms */}
                <AnimatePresence mode="wait">
                    {selectedMethod === 'upi' && (
                        <motion.div
                            key="upi"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    UPI ID
                                </label>
                                <input
                                    type="text"
                                    placeholder="yourname@upi"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4CC9F0] focus:outline-none"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button className="flex-1 py-3 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Pay_Logo_%282020%29.svg" alt="GPay" className="h-6 mx-auto" />
                                </button>
                                <button className="flex-1 py-3 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/PhonePe_Logo.svg" alt="PhonePe" className="h-6 mx-auto" />
                                </button>
                                <button className="flex-1 py-3 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="h-6 mx-auto" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {selectedMethod === 'card' && (
                        <motion.div
                            key="card"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    maxLength={19}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4CC9F0] focus:outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Expiry (MM/YY)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="12/25"
                                        value={cardExpiry}
                                        onChange={(e) => setCardExpiry(e.target.value)}
                                        maxLength={5}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4CC9F0] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CVV
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="123"
                                        value={cardCVV}
                                        onChange={(e) => setCardCVV(e.target.value)}
                                        maxLength={3}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4CC9F0] focus:outline-none"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {selectedMethod === 'wallet' && (
                        <motion.div
                            key="wallet"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-3"
                        >
                            <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                                Pay with Paytm Wallet
                            </button>
                            <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                                Pay with PhonePe Wallet
                            </button>
                            <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                                Pay with Amazon Pay
                            </button>
                        </motion.div>
                    )}

                    {selectedMethod === 'cod' && (
                        <motion.div
                            key="cod"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center"
                        >
                            <DollarSign className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
                            <h4 className="font-bold text-gray-900 mb-2">Cash on Delivery</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Pay ₹{amount.toFixed(2)} in cash when your order is delivered
                            </p>
                            <p className="text-xs text-gray-500">
                                ₹{commission.toFixed(2)} hospital commission will be deducted from pharmacy payment
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePayment}
                        disabled={processing}
                        className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${processing
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[#4CC9F0] to-[#2A9D8F] hover:shadow-xl'
                            }`}
                    >
                        {processing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                Pay ₹{amount.toFixed(2)}
                            </>
                        )}
                    </button>
                </div>

                {/* Security Badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Shield size={16} className="text-green-600" />
                    <span>Secured by 256-bit SSL encryption</span>
                </div>
            </div>
        </div>
    );
};

export default PaymentGateway;
