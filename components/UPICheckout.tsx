import React, { useState } from 'react';

// Mock implementation due to type resolution issue
const motion = {
  div: (props: any) => <div {...props} />,
  span: (props: any) => <span {...props} />
};

interface OrderSummary {
  subtotal: number;
  deliveryFee: number;
  commission: number;
  total: number;
  medicines: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const UPICheckout: React.FC<{ orderSummary: OrderSummary; onPaymentSuccess: () => void }> = ({ 
  orderSummary, 
  onPaymentSuccess 
}) => {
  const [upiId, setUpiId] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  const handlePayment = () => {
    if (!upiId) {
      alert('Please enter your UPI ID');
      return;
    }

    setPaymentLoading(true);
    
    // Simulate UPI payment processing
    setTimeout(() => {
      setPaymentLoading(false);
      // Randomly simulate success/failure for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate
      
      if (isSuccess) {
        setPaymentStatus('success');
        onPaymentSuccess();
      } else {
        setPaymentStatus('failed');
        alert('Payment failed. Please try again with a valid UPI ID.');
      }
    }, 3000);
  };

  const calculateCommission = () => {
    return orderSummary.total * 0.05; // 5% commission
  };

  if (paymentStatus === 'success') {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-[#0A2463] mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-4">
          ₹{orderSummary.total.toFixed(2)} has been debited from your account.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Hospital commission of ₹{calculateCommission().toFixed(2)} has been transferred to our UPI ID.
        </p>
        <button
          onClick={() => setPaymentStatus('idle')}
          className="px-6 py-2 bg-[#2A9D8F] text-white rounded-lg font-bold hover:bg-[#0A2463]"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6">
      <h3 className="text-2xl font-bold text-[#0A2463] mb-6">Complete Your Payment</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-bold text-lg text-[#0A2463] mb-4">Order Summary</h4>
          
          <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
            {orderSummary.medicines.map((medicine, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <p className="font-medium">{medicine.name}</p>
                  <p className="text-sm text-gray-500">Qty: {medicine.quantity}</p>
                </div>
                <p className="font-medium">₹{(medicine.price * medicine.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{orderSummary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>₹{orderSummary.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#2A9D8F] font-semibold">
              <span>Hospital Commission (5%):</span>
              <span>₹{orderSummary.commission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total:</span>
              <span>₹{orderSummary.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Payment Form */}
        <div>
          <h4 className="font-bold text-lg text-[#0A2463] mb-4">UPI Payment</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter UPI ID
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="your-upi-id@bank"
              className="w-full px-4 py-3 border-2 border-[#4CC9F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] text-lg"
            />
            <p className="mt-2 text-sm text-gray-500">
              Enter your UPI ID (e.g., yourname@upi, yourname@bank)
            </p>
          </div>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-[#4CC9F0]">
            <h5 className="font-semibold text-[#0A2463] mb-2">Hospital UPI Details</h5>
            <p className="text-sm">
              <span className="font-medium">UPI ID:</span> rajdeepbiswas403-1@okhdfcbank
            </p>
            <p className="text-sm">
              <span className="font-medium">Commission:</span> 5% of total order value
            </p>
          </div>
          
          <button
            onClick={handlePayment}
            disabled={paymentLoading}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg ${
              paymentLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#4CC9F0] hover:bg-[#2A9D8F]'
            }`}
          >
            {paymentLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </div>
            ) : (
              `Pay ₹${orderSummary.total.toFixed(2)} via UPI`
            )}
          </button>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Secured by Razorpay Payment Gateway
            </p>
            <div className="flex justify-center mt-2 space-x-2">
              <div className="w-8 h-5 bg-gray-300 rounded-sm"></div>
              <div className="w-8 h-5 bg-gray-300 rounded-sm"></div>
              <div className="w-8 h-5 bg-gray-300 rounded-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPICheckout;