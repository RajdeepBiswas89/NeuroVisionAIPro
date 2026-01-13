
from typing import Dict, Optional
import random

class PricingService:
    def __init__(self):
        self.base_rates = {
            "BLS": 1500,
            "ALS": 3500,
            "ICU": 5000,
            "NEONATAL": 6000,
            "AIR_AMBULANCE": 50000
        }
        self.per_km_rate = 50
        self.per_min_rate = 10
        
        # Surge Logic
        self.active_surge_multiplier = 1.0
        self.is_disaster_mode = False

    def calculate_fare(self, distance_km: float, duration_min: float, type: str, urgency: str) -> Dict:
        if self.is_disaster_mode:
            multiplier = 1.0
        else:
            multiplier = self.active_surge_multiplier
            if urgency == "CRITICAL":
                multiplier *= 1.2 # Priority Surcharge
            elif urgency == "URGENT":
                multiplier *= 1.1

        base = self.base_rates.get(type, 2000)
        distance_cost = distance_km * self.per_km_rate
        time_cost = duration_min * self.per_min_rate
        
        total = (base + distance_cost + time_cost) * multiplier
        
        return {
            "baseFare": base,
            "distanceFare": round(distance_cost, 2),
            "timeFare": round(time_cost, 2),
            "surgeMultiplier": round(multiplier, 2),
            "totalEstimated": round(total, 2),
            "currency": "INR"
        }

    def get_sla_quote(self, urgency: str) -> Dict:
        """Returns pricing for guaranteed response times"""
        quotes = [
            {"tier": "PLATINUM_8MIN", "guarantee": "8 min", "price_premium": 2000},
            {"tier": "GOLD_12MIN", "guarantee": "12 min", "price_premium": 1000},
            {"tier": "SILVER_20MIN", "guarantee": "20 min", "price_premium": 0}
        ]
        
        # Adjust based on grid load (mocked)
        grid_load = random.random() # 0-1
        if grid_load > 0.8:
            # High demand, premiums increase
            for q in quotes:
                q['price_premium'] *= 1.5
                
        return {"quotes": quotes, "grid_load": round(grid_load, 2)}

pricing_service = PricingService()
