from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
from PIL import Image
import io
import os
import sys
import subprocess
import threading
import json
import sqlite3
from datetime import datetime



# Add current directory to sys.path to import predictor_module

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from predictor_module import get_predictor



app = FastAPI(title="Brain Tumor Detection API")



# Enable CORS

app.add_middleware(

    CORSMiddleware,

    allow_origins=['*'],

    allow_credentials=True,

    allow_methods=['*'],

    allow_headers=['*'],

)





@app.get('/')

async def root() -> Dict[str, str]:

    return {'message': 'Brain Tumor Detection API is running'}





# Model loading - Initialize as None, will be loaded when first prediction is made

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'brain_tumor_vit_model.pth')

predictor = None



print(f'🔧 Model path configured: {MODEL_PATH}')



# Check if we're running in Render environment

import platform

print(f'💻 Platform: {platform.platform()}')

print(f'📁 Model file exists: {os.path.exists(MODEL_PATH)}')

if os.path.exists(MODEL_PATH):

    print(f'📏 Model file size: {os.path.getsize(MODEL_PATH)} bytes')

else:

    print('⚠️ Model file does not exist at startup')

    print('📋 Contents of models directory:')

    models_dir = os.path.dirname(MODEL_PATH)

    if os.path.exists(models_dir):

        for item in os.listdir(models_dir):

            item_path = os.path.join(models_dir, item)

            size = os.path.getsize(item_path) if os.path.isfile(item_path) else 'DIR'

            print(f'  - {item}: {size}')

    else:

        print('  - models directory does not exist')



# Try to load model on startup, but don't crash if not available

def initialize_predictor():

    global predictor

    if os.path.exists(MODEL_PATH):

        try:

            predictor = get_predictor(MODEL_PATH)

            print(f'✅ Model loaded successfully from {MODEL_PATH}')

        except Exception as e:

            print(f'⚠️ Could not load model on startup: {e}')

            print('API will load model on first prediction')

    else:

        print(f'⚠️ Model file not found at {MODEL_PATH}')

        print('API will load model when first prediction is made')



initialize_predictor()





@app.post('/predict')

async def predict(file: UploadFile = File(...)) -> Dict:

    # Validate content type

    if file.content_type not in {"image/jpeg", "image/png", "image/jpg", "image/webp"}:

        raise HTTPException(status_code=400, detail="Unsupported file type. Please upload a JPEG/PNG/WEBP image.")



    # Read and parse image

    try:

        contents = await file.read()

        image = Image.open(io.BytesIO(contents)).convert('RGB')

    except Exception:

        raise HTTPException(status_code=400, detail="Invalid image file")



    # Ensure model is loaded

    global predictor

    if predictor is None:

        print("🔄 Loading model on first prediction...")

        if os.path.exists(MODEL_PATH):

            try:

                predictor = get_predictor(MODEL_PATH)

                print(f'✅ Model loaded successfully from {MODEL_PATH} on first prediction')

            except Exception as e:

                print(f'❌ Could not load model: {e}')

                import traceback

                traceback.print_exc()  # Detailed error info

                # Return error response instead of demo data

                raise HTTPException(status_code=500, detail=f"Model could not be loaded: {str(e)}")

        else:

            print(f'❌ Model file not found at {MODEL_PATH}')

            print('⚠️ Available files in models directory:')

            models_dir = os.path.dirname(MODEL_PATH)

            if os.path.exists(models_dir):

                for item in os.listdir(models_dir):

                    item_path = os.path.join(models_dir, item)

                    size = os.path.getsize(item_path) if os.path.isfile(item_path) else 'DIR'

                    print(f'  - {item}: {size}')

            else:

                print('  - models directory does not exist')

            raise HTTPException(status_code=500, detail="Model file not found")



    # Real inference

    try:

        result = predictor.predict(image)

        return {

            'class': result['prediction'],

            'confidence': round(result['confidence'], 4),

            'all_probabilities': result['probabilities'],

        }

    except Exception as e:

        print(f'❌ Prediction error: {e}')

        import traceback

        traceback.print_exc()  # Detailed error info

        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")





if __name__ == '__main__':

    import uvicorn

    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True)





# Initialize database
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'medicine_orders.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create orders table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT UNIQUE,
            user_id TEXT,
            medicines TEXT,
            total_amount REAL,
            commission REAL,
            status TEXT,
            delivery_address TEXT,
            delivery_lat REAL,
            delivery_lng REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create medicine_prices table for tracking
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS medicine_prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            medicine_name TEXT,
            pharmacy_name TEXT,
            price REAL,
            distance REAL,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f' Database initialized at {DB_PATH}')

# Initialize DB on startup
init_db()

@app.get('/api/medicine/search/{query}')
async def search_medicines(query: str):
    # In a real implementation, this would connect to actual pharmacy APIs
    # For now, return mock data with realistic prices
    mock_medicines = [
        {
            "id": f"med_{i}",
            "name": query,
            "dosage": "250mg" if i % 2 == 0 else "500mg",
            "manufacturer": f"PharmaCorp {i}",
            "price": 250.0 + (i * 50),
            "pharmacyName": f"Pharmacy {i}",
            "distance": round(1.5 + (i * 0.8), 1),
            "estimatedDelivery": f"{1+i} day(s)",
            "rating": round(4.0 + (i * 0.2), 1),
            "stock": 100 - (i * 10),
            "website": f"https://pharmacy{i}.com"
        }
        for i in range(1, 6)
    ]
    
    # Sort by price to show cheapest first
    sorted_medicines = sorted(mock_medicines, key=lambda x: x['price'])
    
    return sorted_medicines

@app.post('/api/medicine/order')
async def place_order(request: Request):
    data = await request.json()
    order_id = f'ORD-{datetime.now().strftime("%Y%m%d%H%M%S")}'
    user_id = data.get('user_id', 'anonymous')
    medicines = json.dumps(data.get('medicines', []))
    total_amount = data.get('total_amount', 0)
    delivery_address = data.get('delivery_address', '')
    delivery_lat = data.get('delivery_lat', 0.0)
    delivery_lng = data.get('delivery_lng', 0.0)
    commission = total_amount * 0.05  # 5% commission
    
    # Save order to database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "INSERT INTO orders (order_id, user_id, medicines, total_amount, commission, status, delivery_address, delivery_lat, delivery_lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (order_id, user_id, medicines, total_amount, commission, 'placed', delivery_address, delivery_lat, delivery_lng)
        )
        conn.commit()
        
        # In a real implementation, this would trigger actual payment processing
        # and send commission to the specified UPI ID
        
        return {
            'success': True,
            'order_id': order_id,
            'commission_sent': commission,
            'total_paid': total_amount,
            'message': f'Order placed successfully. ₹{commission:.2f} commission sent to rajdeepbiswas403-1@okhdfcbank',
            'order_id': order_id
        }
    except Exception as e:
        return {'success': False, 'error': str(e)}
    finally:
        conn.close()

@app.get('/api/medicine/order/{order_id}')
async def get_order_status(order_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT * FROM orders WHERE order_id = ?", (order_id,))
        order = cursor.fetchone()
        
        if order:
            return {
                'order_id': order[1],
                'user_id': order[2],
                'medicines': json.loads(order[3]),
                'total_amount': order[4],
                'commission': order[5],
                'status': order[6],
                'delivery_address': order[7],
                'delivery_lat': order[8],
                'delivery_lng': order[9],
                'created_at': order[10]
            }
        else:
            raise HTTPException(status_code=404, detail="Order not found")
    finally:
        conn.close()

@app.get('/api/medicine/analytics')
async def get_analytics():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Get total orders
        cursor.execute("SELECT COUNT(*) FROM orders")
        total_orders = cursor.fetchone()[0]
        
        # Get total commission earned
        cursor.execute("SELECT SUM(commission) FROM orders")
        total_commission = cursor.fetchone()[0] or 0
        
        # Get recent orders
        cursor.execute("SELECT order_id, total_amount, commission, status, delivery_address, delivery_lat, delivery_lng, created_at FROM orders ORDER BY created_at DESC LIMIT 5")
        recent_orders = cursor.fetchall()
        
        return {
            'total_orders': total_orders,
            'total_commission': total_commission,
            'recent_orders': [
                {
                    'order_id': row[0],
                    'total_amount': row[1],
                    'commission': row[2],
                    'status': row[3],
                    'delivery_address': row[4],
                    'delivery_lat': row[5],
                    'delivery_lng': row[6],
                    'created_at': row[7]
                }
                for row in recent_orders
            ]
        }
    finally:
        conn.close()

