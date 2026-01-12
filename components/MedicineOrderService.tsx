import React, { useState, useEffect } from 'react';
import { MedicineService } from './MedicineAPIService';

// Mock implementation due to type resolution issue
const motion = {
  div: (props: any) => <div {...props} />,
  input: (props: any) => <input {...props} />,
  button: (props: any) => <button {...props} />,
  textarea: (props: any) => <textarea {...props} />,
  span: (props: any) => <span {...props} />
};

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  manufacturer: string;
  price: number;
  pharmacyName: string;
  distance: number; // in km
  estimatedDelivery: string; // in minutes
  rating: number;
  stock: number;
}

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  manufacturer: string;
  price: number;
  pharmacyName: string;
  distance: number; // in km
  estimatedDelivery: string; // in minutes
  rating: number;
  stock: number;
}

interface OrderDetails {
  id: string;
  medicines: Medicine[];
  totalAmount: number;
  deliveryAddress: string;
  status: 'pending' | 'confirmed' | 'processing' | 'dispatched' | 'delivered';
  orderDate: string;
  commission: number;
}

const MedicineOrderService: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<Medicine[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load initial medicines
  useEffect(() => {
    const fetchInitialMedicines = async () => {
      try {
        const initialMedicines = await MedicineService.comparePrices('Temozolomide');
        setMedicines(initialMedicines);
        setFilteredMedicines(initialMedicines);
      } catch (error) {
        console.error('Failed to load initial medicines:', error);
        // Fallback to mock data
        const mockMedicines = [
          {
            id: '1',
            name: 'Temozolomide',
            dosage: '5mg',
            manufacturer: 'Intas Pharmaceuticals',
            price: 2450,
            pharmacyName: 'Apollo Pharmacy',
            distance: 1.2,
            estimatedDelivery: '30',
            rating: 4.5,
            stock: 10
          },
          {
            id: '2',
            name: 'Bevacizumab',
            dosage: '100mg',
            manufacturer: 'Roche',
            price: 8500,
            pharmacyName: 'Fortis Medical Store',
            distance: 2.5,
            estimatedDelivery: '45',
            rating: 4.7,
            stock: 5
          },
          {
            id: '3',
            name: 'Carmustine',
            dosage: '100mg',
            manufacturer: 'Sun Pharmaceutical',
            price: 3200,
            pharmacyName: 'Max Healthcare Pharmacy',
            distance: 0.8,
            estimatedDelivery: '25',
            rating: 4.3,
            stock: 8
          },
          {
            id: '4',
            name: 'Lomustine',
            dosage: '10mg',
            manufacturer: 'Dr. Reddy\'s',
            price: 1800,
            pharmacyName: 'MedPlus',
            distance: 1.8,
            estimatedDelivery: '35',
            rating: 4.2,
            stock: 15
          },
          {
            id: '5',
            name: 'Procarbazine',
            dosage: '50mg',
            manufacturer: 'Cipla',
            price: 1200,
            pharmacyName: 'Apollo Pharmacy',
            distance: 1.2,
            estimatedDelivery: '30',
            rating: 4.4,
            stock: 20
          }
        ];
        setMedicines(mockMedicines);
        setFilteredMedicines(mockMedicines);
      }
    };
    
    fetchInitialMedicines();
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      try {
        // Search using API service
        const searchResults = await MedicineService.searchMedicines(query);
        setFilteredMedicines(searchResults);
      } catch (error) {
        console.error('Search failed:', error);
        // Fallback to client-side filtering
        const filtered = medicines.filter(
          medicine => 
            medicine.name.toLowerCase().includes(query.toLowerCase()) ||
            medicine.dosage.toLowerCase().includes(query.toLowerCase()) ||
            medicine.manufacturer.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredMedicines(filtered);
      }
    } else {
      // Reset to all medicines when search is cleared
      setFilteredMedicines(medicines);
    }
  };

  const addToCart = (medicine: Medicine) => {
    if (selectedMedicines.some(item => item.id === medicine.id)) {
      // Already in cart, remove it
      setSelectedMedicines(selectedMedicines.filter(item => item.id !== medicine.id));
    } else {
      // Add to cart
      setSelectedMedicines([...selectedMedicines, medicine]);
    }
  };

  const calculateTotal = () => {
    return selectedMedicines.reduce((sum, medicine) => sum + medicine.price, 0);
  };

  const calculateCommission = () => {
    const total = calculateTotal();
    // 5% commission
    return total * 0.05;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      // Prepare order data
      const orderData = {
        user_id: 'current_user', // In a real app, this would come from auth
        medicines: selectedMedicines,
        total_amount: calculateTotal() + 50, // Including delivery fee
        delivery_address: deliveryAddress,
        upi_transaction_id: `TXN${Date.now()}` // Simulated transaction ID
      };
      
      // Place order via API
      const response = await MedicineService.placeOrder(orderData);
      
      if (response.success) {
        alert(response.message); // Shows commission sent to your UPI
        setOrderPlaced(true);
        setShowPayment(false);
        setSelectedMedicines([]);
      } else {
        alert('Order placement failed. Please try again.');
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Order placement failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayWithUPI = () => {
    // Simulate UPI payment
    alert('Redirecting to UPI payment gateway...');
    handlePlaceOrder();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-2xl p-6 max-w-6xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-[#0A2463] mb-6 text-center">
        Brain Tumor Medicine Ordering Service
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Section */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search for brain tumor medicines..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-3 border-2 border-[#4CC9F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] text-lg"
            />
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {filteredMedicines.map(medicine => (
              <motion.div
                key={medicine.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`border-2 rounded-xl p-4 ${
                  selectedMedicines.some(item => item.id === medicine.id)
                    ? 'border-[#2A9D8F] bg-green-50'
                    : 'border-[#4CC9F0]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl text-[#0A2463]">{medicine.name}</h3>
                    <p className="text-gray-600">{medicine.dosage} • {medicine.manufacturer}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-gray-700">{medicine.rating}</span>
                      <span className="mx-2">•</span>
                      <span className="text-green-600 font-semibold">In Stock: {medicine.stock}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#2A9D8F]">₹{medicine.price}</p>
                    <p className="text-sm text-gray-500">{medicine.pharmacyName}</p>
                    <p className="text-sm text-gray-500">{medicine.distance}km • {medicine.estimatedDelivery}min</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <button
                    onClick={() => addToCart(medicine)}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      selectedMedicines.some(item => item.id === medicine.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-[#4CC9F0] text-white hover:bg-[#2A9D8F]'
                    }`}
                  >
                    {selectedMedicines.some(item => item.id === medicine.id) ? 'Remove' : 'Add to Cart'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cart & Payment Section */}
        <div className="bg-gray-50 rounded-xl p-6 h-fit">
          <h3 className="text-xl font-bold text-[#0A2463] mb-4">Your Order</h3>
          
          {selectedMedicines.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No medicines added to cart</p>
          ) : (
            <>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {selectedMedicines.map(medicine => (
                  <div key={medicine.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-semibold">{medicine.name}</p>
                      <p className="text-sm text-gray-500">{medicine.dosage}</p>
                    </div>
                    <p className="font-bold text-[#2A9D8F]">₹{medicine.price}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Delivery Fee:</span>
                  <span>₹50</span>
                </div>
                <div className="flex justify-between mb-2 text-[#2A9D8F] font-semibold">
                  <span>Hospital Commission (5%):</span>
                  <span>₹{calculateCommission().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{(calculateTotal() + 50).toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CC9F0]"
                  rows={3}
                />
              </div>

              <button
                onClick={() => setShowPayment(true)}
                disabled={selectedMedicines.length === 0 || !deliveryAddress.trim()}
                className={`w-full py-3 rounded-xl font-bold text-white ${
                  selectedMedicines.length === 0 || !deliveryAddress.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#2A9D8F] hover:bg-[#0A2463]'
                }`}
              >
                Proceed to Payment
              </button>
            </>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-2xl font-bold text-[#0A2463] mb-4">Complete Your Payment</h3>
            
            <div className="mb-4">
              <p className="text-lg">Total Amount: <span className="font-bold text-[#2A9D8F]">₹{(calculateTotal() + 50).toFixed(2)}</span></p>
              <p className="text-md">Hospital Commission: <span className="font-bold text-[#2A9D8F]">₹{calculateCommission().toFixed(2)}</span></p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UPI ID for Hospital Commission
              </label>
              <input
                type="text"
                placeholder="rajdeepbiswas403-1@okhdfcbank"
                defaultValue="rajdeepbiswas403-1@okhdfcbank"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CC9F0]"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePayWithUPI}
                disabled={loading}
                className="flex-1 py-2 bg-[#4CC9F0] text-white rounded-lg font-bold hover:bg-[#2A9D8F] disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Pay with UPI'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Order Confirmation */}
      {orderPlaced && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white rounded-2xl p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#0A2463] mb-2">Order Placed Successfully!</h3>
            <p className="text-gray-600 mb-4">
              Your medicines will be delivered in approximately {(Math.max(...selectedMedicines.map(m => parseInt(m.estimatedDelivery))) + 10)} minutes.
            </p>
            <button
              onClick={() => setOrderPlaced(false)}
              className="px-6 py-2 bg-[#2A9D8F] text-white rounded-lg font-bold hover:bg-[#0A2463]"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MedicineOrderService;