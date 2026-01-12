from flask import Blueprint, request, jsonify
import requests
import sqlite3
from datetime import datetime
import json

medicine_bp = Blueprint('medicine_bp', __name__)

# In-memory medicine database (would be replaced with actual DB in production)
medicine_db = [
    {
        "id": "1",
        "name": "Temozolomide",
        "dosage": "5mg",
        "manufacturer": "Intas Pharmaceuticals",
        "price": 2450,
        "pharmacyName": "Apollo Pharmacy",
        "pharmacy_address": "123 Medical Plaza, Mumbai",
        "latitude": 19.0760,
        "longitude": 72.8777,
        "distance": 1.2,
        "estimatedDelivery": "30",
        "rating": 4.5,
        "stock": 10,
        "website": "https://apollopharmacy.com"
    },
    {
        "id": "2",
        "name": "Bevacizumab",
        "dosage": "100mg",
        "manufacturer": "Roche",
        "price": 8500,
        "pharmacyName": "Fortis Medical Store",
        "pharmacy_address": "456 Health Avenue, Mumbai",
        "latitude": 19.0650,
        "longitude": 72.8820,
        "distance": 2.5,
        "estimatedDelivery": "45",
        "rating": 4.7,
        "stock": 5,
        "website": "https://fortismedical.com"
    },
    {
        "id": "3",
        "name": "Carmustine",
        "dosage": "100mg",
        "manufacturer": "Sun Pharmaceutical",
        "price": 3200,
        "pharmacyName": "Max Healthcare Pharmacy",
        "pharmacy_address": "789 Wellness Street, Mumbai",
        "latitude": 19.0800,
        "longitude": 72.8700,
        "distance": 0.8,
        "estimatedDelivery": "25",
        "rating": 4.3,
        "stock": 8,
        "website": "https://maxhealthcarepharma.com"
    },
    {
        "id": "4",
        "name": "Lomustine",
        "dosage": "10mg",
        "manufacturer": "Dr. Reddy's",
        "price": 1800,
        "pharmacyName": "MedPlus",
        "pharmacy_address": "321 Care Road, Mumbai",
        "latitude": 19.0720,
        "longitude": 72.8850,
        "distance": 1.8,
        "estimatedDelivery": "35",
        "rating": 4.2,
        "stock": 15,
        "website": "https://medplusindia.com"
    },
    {
        "id": "5",
        "name": "Procarbazine",
        "dosage": "50mg",
        "manufacturer": "Cipla",
        "price": 1200,
        "pharmacyName": "Apollo Pharmacy",
        "pharmacy_address": "123 Medical Plaza, Mumbai",
        "latitude": 19.0760,
        "longitude": 72.8777,
        "distance": 1.2,
        "estimatedDelivery": "30",
        "rating": 4.4,
        "stock": 20,
        "website": "https://apollopharmacy.com"
    }
]

# Database initialization
def init_db():
    conn = sqlite3.connect('medicine_orders.db')
    cursor = conn.cursor()
    
    # Create orders table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            medicines TEXT,
            total_amount REAL,
            commission REAL,
            delivery_address TEXT,
            status TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            upi_transaction_id TEXT
        )
    ''')
    
    # Create medicine_price_history table for tracking price changes
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS medicine_price_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            medicine_id TEXT,
            name TEXT,
            dosage TEXT,
            price REAL,
            pharmacy_name TEXT,
            scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

@medicine_bp.route('/search', methods=['GET'])
def search_medicines():
    query = request.args.get('q', '').lower()
    filters = {
        'min_price': request.args.get('min_price'),
        'max_price': request.args.get('max_price'),
        'pharmacy': request.args.get('pharmacy', ''),
        'sort_by': request.args.get('sort_by', 'price')  # price, rating, distance
    }
    
    # Filter medicines based on query
    results = []
    for med in medicine_db:
        if (query in med['name'].lower() or 
            query in med['dosage'].lower() or 
            query in med['manufacturer'].lower()):
            
            # Apply additional filters
            if filters['min_price'] and float(filters['min_price']) > med['price']:
                continue
            if filters['max_price'] and float(filters['max_price']) < med['price']:
                continue
            if filters['pharmacy'] and filters['pharmacy'].lower() not in med['pharmacyName'].lower():
                continue
                
            results.append(med)
    
    # Sort results
    if filters['sort_by'] == 'price':
        results.sort(key=lambda x: x['price'])
    elif filters['sort_by'] == 'rating':
        results.sort(key=lambda x: x['rating'], reverse=True)
    elif filters['sort_by'] == 'distance':
        results.sort(key=lambda x: x['distance'])
    
    return jsonify(results)

@medicine_bp.route('/compare_prices/<medicine_name>', methods=['GET'])
def compare_prices(medicine_name):
    """Compare prices of a specific medicine across different pharmacies"""
    results = []
    for med in medicine_db:
        if medicine_name.lower() in med['name'].lower():
            results.append({
                'id': med['id'],
                'name': med['name'],
                'dosage': med['dosage'],
                'price': med['price'],
                'pharmacyName': med['pharmacyName'],
                'rating': med['rating'],
                'distance': med['distance'],
                'estimatedDelivery': med['estimatedDelivery'],
                'stock': med['stock'],
                'website': med['website']
            })
    
    # Sort by price to show cheapest first
    results.sort(key=lambda x: x['price'])
    
    return jsonify(results)

@medicine_bp.route('/place_order', methods=['POST'])
def place_order():
    data = request.json
    
    order_id = f"ORD-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    user_id = data.get('user_id', 'anonymous')
    medicines = json.dumps(data.get('medicines', []))
    total_amount = data.get('total_amount', 0)
    commission = total_amount * 0.05  # 5% commission
    delivery_address = data.get('delivery_address', '')
    upi_transaction_id = data.get('upi_transaction_id', '')
    
    # Save order to database
    conn = sqlite3.connect('medicine_orders.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO orders 
        (id, user_id, medicines, total_amount, commission, delivery_address, status, upi_transaction_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (order_id, user_id, medicines, total_amount, commission, delivery_address, 'confirmed', upi_transaction_id))
    
    conn.commit()
    conn.close()
    
    # Record price history for analytics
    for med in json.loads(medicines):
        conn = sqlite3.connect('medicine_orders.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO medicine_price_history 
            (medicine_id, name, dosage, price, pharmacy_name)
            VALUES (?, ?, ?, ?, ?)
        ''', (med.get('id'), med.get('name'), med.get('dosage'), med.get('price'), med.get('pharmacyName')))
        conn.commit()
        conn.close()
    
    # Simulate successful payment
    return jsonify({
        'success': True,
        'order_id': order_id,
        'commission_sent': commission,
        'total_paid': total_amount,
        'message': f'Order placed successfully. ₹{commission:.2f} commission sent to rajdeepbiswas403-1@okhdfcbank'
    })

@medicine_bp.route('/order_status/<order_id>', methods=['GET'])
def get_order_status(order_id):
    conn = sqlite3.connect('medicine_orders.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM orders WHERE id = ?', (order_id,))
    order = cursor.fetchone()
    
    conn.close()
    
    if order:
        return jsonify({
            'order_id': order[0],
            'user_id': order[1],
            'medicines': json.loads(order[2]),
            'total_amount': order[3],
            'commission': order[4],
            'delivery_address': order[5],
            'status': order[6],
            'created_at': order[7],
            'upi_transaction_id': order[8]
        })
    else:
        return jsonify({'error': 'Order not found'}), 404

@medicine_bp.route('/analytics', methods=['GET'])
def get_analytics():
    conn = sqlite3.connect('medicine_orders.db')
    cursor = conn.cursor()
    
    # Total orders
    cursor.execute('SELECT COUNT(*) FROM orders')
    total_orders = cursor.fetchone()[0]
    
    # Total commission earned
    cursor.execute('SELECT SUM(commission) FROM orders')
    total_commission = cursor.fetchone()[0] or 0
    
    # Recent orders
    cursor.execute('SELECT id, total_amount, commission, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5')
    recent_orders = cursor.fetchall()
    
    conn.close()
    
    return jsonify({
        'total_orders': total_orders,
        'total_commission': total_commission,
        'recent_orders': [
            {'id': row[0], 'amount': row[1], 'commission': row[2], 'status': row[3], 'date': row[4]}
            for row in recent_orders
        ]
    })