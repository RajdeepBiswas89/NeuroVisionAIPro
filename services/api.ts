
import { ScanResult } from '../types';

const API_BASE_URL = 'http://localhost:8000/api'; // Adjust if backend runs on different port

export const api = {
    // Tumor Prediction
    predictTumor: async (file: File): Promise<ScanResult> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Prediction failed');
        }

        return response.json();
    },

    // Medicine Arbitrage
    searchMedicines: async (query: string) => {
        const response = await fetch(`${API_BASE_URL}/medicine/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        return response.json();
    },

    placeOrder: async (orderData: any) => {
        const response = await fetch(`${API_BASE_URL}/medicine/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) throw new Error('Order failed');
        return response.json();
    },


    // Chat
    chat: async (message: string) => {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });
        if (!response.ok) throw new Error('Chat failed');
        return response.json();
    },

    // Analytics
    getAnalytics: async () => {

        const response = await fetch(`${API_BASE_URL}/analytics`);
        if (!response.ok) throw new Error('Failed to fetch analytics');
        return response.json();
    }
};
