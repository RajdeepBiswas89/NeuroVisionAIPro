import React, { useState, useEffect } from 'react';

interface PharmacyLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance: number; // in km
  estimatedDelivery: string; // in minutes
  rating: number;
  contact: string;
}

const PharmacyMap: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<PharmacyLocation[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyLocation | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Mock data for nearby pharmacies
  useEffect(() => {
    const mockPharmacies: PharmacyLocation[] = [
      {
        id: '1',
        name: 'Apollo Pharmacy',
        address: '123 Medical Plaza, Mumbai',
        lat: 19.0760,
        lng: 72.8777,
        distance: 1.2,
        estimatedDelivery: '30',
        rating: 4.5,
        contact: '+91-22-12345678'
      },
      {
        id: '2',
        name: 'Fortis Medical Store',
        address: '456 Health Avenue, Mumbai',
        lat: 19.0650,
        lng: 72.8820,
        distance: 2.5,
        estimatedDelivery: '45',
        rating: 4.7,
        contact: '+91-22-87654321'
      },
      {
        id: '3',
        name: 'Max Healthcare Pharmacy',
        address: '789 Wellness Street, Mumbai',
        lat: 19.0800,
        lng: 72.8700,
        distance: 0.8,
        estimatedDelivery: '25',
        rating: 4.3,
        contact: '+91-22-56789012'
      },
      {
        id: '4',
        name: 'MedPlus',
        address: '321 Care Road, Mumbai',
        lat: 19.0720,
        lng: 72.8850,
        distance: 1.8,
        estimatedDelivery: '35',
        rating: 4.2,
        contact: '+91-22-34567890'
      }
    ];

    setPharmacies(mockPharmacies);
    
    // Mock user location (Mumbai city center)
    setUserLocation({
      lat: 19.0760,
      lng: 72.8777
    });
  }, []);

  const handlePharmacySelect = (pharmacy: PharmacyLocation) => {
    setSelectedPharmacy(pharmacy);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6">
      <h2 className="text-2xl font-bold text-[#0A2463] mb-4">Find Nearby Pharmacies</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Visualization */}
        <div className="lg:col-span-2 bg-gray-100 rounded-xl h-96 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block bg-white p-4 rounded-full shadow-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#2A9D8F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-700">Interactive Map</p>
              <p className="text-gray-500">Showing nearby pharmacies</p>
            </div>
            
            {/* Mock markers for pharmacies */}
            {pharmacies.map((pharmacy, index) => (
              <div 
                key={pharmacy.id}
                className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                  selectedPharmacy?.id === pharmacy.id 
                    ? 'bg-red-500 ring-4 ring-red-300 scale-125' 
                    : 'bg-blue-500'
                }`}
                style={{
                  left: `${20 + index * 20}%`,
                  top: `${30 + (index % 2) * 30}%`
                }}
                onClick={() => handlePharmacySelect(pharmacy)}
              >
                {index + 1}
              </div>
            ))}
            
            {/* Mock user location marker */}
            {userLocation && (
              <div 
                className="absolute w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-green-500 ring-4 ring-green-300 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: '50%',
                  top: '50%'
                }}
              >
                U
              </div>
            )}
          </div>
        </div>

        {/* Pharmacy List */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-[#0A2463]">Nearby Pharmacies</h3>
          
          <div className="max-h-96 overflow-y-auto space-y-3">
            {pharmacies.map(pharmacy => (
              <div 
                key={pharmacy.id}
                className={`border rounded-xl p-4 cursor-pointer transition-all ${
                  selectedPharmacy?.id === pharmacy.id
                    ? 'border-[#2A9D8F] bg-blue-50 ring-2 ring-[#2A9D8F]'
                    : 'border-gray-200 hover:border-[#4CC9F0]'
                }`}
                onClick={() => handlePharmacySelect(pharmacy)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#0A2463]">{pharmacy.name}</h4>
                    <p className="text-sm text-gray-600">{pharmacy.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-gray-700">{pharmacy.rating}</span>
                    </div>
                    <p className="text-sm text-gray-500">{pharmacy.distance}km</p>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Delivery in {pharmacy.estimatedDelivery} mins</span>
                  <span className="text-sm font-semibold text-[#2A9D8F]">{pharmacy.contact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Pharmacy Details */}
      {selectedPharmacy && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-[#4CC9F0]">
          <h3 className="font-bold text-lg text-[#0A2463] mb-2">Selected Pharmacy</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-semibold">{selectedPharmacy.name}</p>
              <p className="text-sm text-gray-600">{selectedPharmacy.address}</p>
            </div>
            <div>
              <p className="text-sm"><span className="font-semibold">Distance:</span> {selectedPharmacy.distance}km</p>
              <p className="text-sm"><span className="font-semibold">Delivery:</span> {selectedPharmacy.estimatedDelivery} mins</p>
            </div>
            <div>
              <p className="text-sm"><span className="font-semibold">Rating:</span> {selectedPharmacy.rating}/5</p>
              <p className="text-sm"><span className="font-semibold">Contact:</span> {selectedPharmacy.contact}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 bg-[#2A9D8F] text-white rounded-lg font-semibold hover:bg-[#0A2463]">
              View Medicines
            </button>
            <button className="px-4 py-2 border border-[#0A2463] text-[#0A2463] rounded-lg font-semibold hover:bg-[#0A2463] hover:text-white">
              Get Directions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyMap;