
import random
from typing import List, Dict
from datetime import datetime
import json
from sqlalchemy.orm import Session
from app.db.base import Order

class MedicineArbitrageService:
    def __init__(self):
        # Simulated pharmacy APIs
        self.pharmacies = [
            {"name": "Apollo Pharmacy", "base_price_factor": 1.0, "delivery_time": 30},
            {"name": "Pharmeasy", "base_price_factor": 0.95, "delivery_time": 45},
            {"name": "Tata 1mg", "base_price_factor": 0.98, "delivery_time": 60},
            {"name": "Local Chemist", "base_price_factor": 1.1, "delivery_time": 20}
        ]
        
    async def find_cheapest_medicine(self, medicine_name: str) -> List[Dict]:
        """
        Simulates scanning multiple vendors to find the best price.
        In a real app, this would call external APIs concurrently.
        """
        results = []
        base_price = random.randint(50, 500) # Mock base price
        
        for pharmacy in self.pharmacies:
            price = round(base_price * pharmacy["base_price_factor"] * (random.uniform(0.9, 1.1)), 2)
            results.append({
                "pharmacy_name": pharmacy["name"],
                "medicine_name": medicine_name,
                "price": price,
                "original_price": round(price * 1.2, 2), # Mock MSRP
                "delivery_time": pharmacy["delivery_time"],
                "in_stock": True
            })
            
        # Sort by price ascending
        return sorted(results, key=lambda x: x['price'])
        
    async def create_order(self, db: Session, user_id: str, items: List[Dict], total_amount: float, delivery_address: str):
        # Calculate commission (Arbitrage profit)
        # We charge user 'total_amount'. Actual cost might be lower if we auto-select cheapest.
        # For simplicity here, we assume 5% flat commission.
        commission = total_amount * 0.05
        
        order_id = f"ORD-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{random.randint(100,999)}"
        
        new_order = Order(
            order_id=order_id,
            user_id=user_id,
            medicines=json.dumps(items),
            total_amount=total_amount,
            commission=commission,
            status="placed",
            delivery_address=delivery_address
        )
        
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        
        return new_order

arbitrage_service = MedicineArbitrageService()
