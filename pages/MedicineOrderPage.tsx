import React, { useState } from 'react';
import MedicineOrderService from '../components/MedicineOrderService';
import PharmacyMap from '../components/PharmacyMap';

const MedicineOrderPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'order' | 'map'>('order');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFDFE] to-[#E6F4FF] py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A2463] mb-4">
            Brain Tumor Medicine Ordering
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Order prescribed medicines for brain tumor treatment with convenient delivery and secure UPI payment
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-lg inline-flex">
            <button
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'order'
                  ? 'bg-[#2A9D8F] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#2A9D8F]'
              }`}
              onClick={() => setActiveTab('order')}
            >
              Order Medicines
            </button>
            <button
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'map'
                  ? 'bg-[#2A9D8F] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#2A9D8F]'
              }`}
              onClick={() => setActiveTab('map')}
            >
              Find Pharmacies
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'order' ? (
          <div className="mb-12">
            <MedicineOrderService />
          </div>
        ) : (
          <div className="mb-12">
            <PharmacyMap />
          </div>
        )}

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#2A9D8F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#0A2463] mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Get your medicines delivered to your doorstep within 30-45 minutes
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#2A9D8F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#0A2463] mb-2">Secure Payment</h3>
            <p className="text-gray-600">
              Pay securely using UPI with bank-level encryption
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#2A9D8F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#0A2463] mb-2">Verified Pharmacies</h3>
            <p className="text-gray-600">
              All partner pharmacies are verified and licensed
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-[#0A2463] mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#4CC9F0] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="font-bold text-lg text-[#0A2463] mb-2">Search Medicines</h3>
              <p className="text-gray-600">Find brain tumor medicines by name or prescription</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#4CC9F0] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="font-bold text-lg text-[#0A2463] mb-2">Select Pharmacy</h3>
              <p className="text-gray-600">Choose from nearby verified pharmacies</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#4CC9F0] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="font-bold text-lg text-[#0A2463] mb-2">Secure Payment</h3>
              <p className="text-gray-600">Pay via UPI with hospital commission</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#4CC9F0] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">4</div>
              <h3 className="font-bold text-lg text-[#0A2463] mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Receive medicines at your doorstep</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineOrderPage;