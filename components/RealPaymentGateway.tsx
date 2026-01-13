
import React, { useEffect, useState } from 'react';
import GlassButton from './ui/GlassButton';
import GlassPanel from './ui/GlassPanel';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RealPaymentGatewayProps {
    amount: number;
    onSuccess: (paymentId: string) => void;
    onFailure: (error: any) => void;
}

const RealPaymentGateway: React.FC<RealPaymentGatewayProps> = ({ amount, onSuccess, onFailure }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load Razorpay SDK
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        if (!window.Razorpay) {
            alert('Razorpay SDK failed to load');
            return;
        }

        setLoading(true);

        const options = {
            key: "rzp_test_YourTestKey", // Replace with real Sandbox Key
            amount: amount * 100, // Amount in paise
            currency: "INR",
            name: "NeuroVision AI",
            description: "Medical Diagnostics & Delivery",
            image: "https://your-logo-url.png",
            handler: function (response: any) {
                setLoading(false);
                onSuccess(response.razorpay_payment_id);
            },
            prefill: {
                name: "Rajdeep",
                email: "rajdeep@example.com",
                contact: "9999999999"
            },
            notes: {
                address: "NeuroVision HQ"
            },
            theme: {
                color: "#2A9D8F"
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response: any) {
            setLoading(false);
            onFailure(response.error);
        });
        rzp1.open();
    };

    return (
        <GlassPanel className="p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-4">Secure Payment Gateway</h3>
            <div className="flex justify-center mb-6">
                <CreditCard size={48} className="text-[#4CC9F0]" />
            </div>
            <p className="text-white/60 mb-6">Total Amount: <span className="text-white font-black text-lg">₹{amount.toFixed(2)}</span></p>

            <GlassButton
                onClick={handlePayment}
                disabled={loading}
                className="w-full justify-center"
            >
                {loading ? 'Processing...' : 'Pay with Razorpay'}
            </GlassButton>

            <p className="text-[10px] text-white/40 mt-4 uppercase tracking-widest">
                Powered by Razorpay Sandbox
            </p>
        </GlassPanel>
    );
};

export default RealPaymentGateway;
