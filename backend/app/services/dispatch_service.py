
import math
import time
import threading
import asyncio
from typing import List, Dict, Optional
from datetime import datetime
import random

# Data Models (mirroring TypeScript types)
class GeoLocation:
    def __init__(self, lat: float, lng: float):
        self.lat = lat
        self.lng = lng

class Ambulance:
    def __init__(self, id: str, call_sign: str, type: str, lat: float, lng: float):
        self.id = id
        self.call_sign = call_sign
        self.type = type
        self.status = "IDLE"
        self.location = GeoLocation(lat, lng)
        self.heading = 0
        self.target_location: Optional[GeoLocation] = None

class DispatchService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DispatchService, cls).__new__(cls)
            cls._instance.ambulances = {} # id -> Ambulance
            cls._instance._initialize_fleet()
            cls._instance._start_simulation()
        return cls._instance

    def _initialize_fleet(self):
        """Seed the city with ambulances"""
        initial_positions = [
            (19.0760, 72.8777), # Mumbai Center
            (19.0800, 72.8900), # Ghatkopar
            (19.0500, 72.8300), # Bandra
            (19.1200, 72.8500), # Andheri
            (19.0200, 72.8500), # Dadar
        ]
        
        types = ["ALS", "BLS", "ICU", "NEONATAL"]
        
        for i, pos in enumerate(initial_positions):
            amb_id = f"AMB-{100+i}"
            amb = Ambulance(
                id=amb_id,
                call_sign=f"Unit-{100+i}",
                type=random.choice(types),
                lat=pos[0],
                lng=pos[1]
            )
            self.ambulances[amb_id] = amb
            print(f"Initialized {amb.call_sign} at {amb.location.lat}, {amb.location.lng}")

    def get_all_ambulances(self) -> List[Dict]:
        return [self._serialize_ambulance(a) for a in self.ambulances.values()]

    def _serialize_ambulance(self, amb: Ambulance) -> Dict:
        return {
            "id": amb.id,
            "callSign": amb.call_sign,
            "type": amb.type,
            "status": amb.status,
            "location": {
                "lat": amb.location.lat,
                "lng": amb.location.lng
            },
            "heading": amb.heading
        }

    def find_nearest_ambulance(self, patient_lat: float, patient_lng: float, required_type: str = None) -> Optional[str]:
        """Finds the nearest IDLE ambulance using Haversine distance"""
        min_dist = float('inf')
        nearest_id = None
        
        for amb_id, amb in self.ambulances.items():
            if amb.status != "IDLE":
                continue
            if required_type and amb.type != required_type:
                # Basic matching: ICU can do ALS/BLS, but BLS cannot do ICU
                pass # Simplify for prototype
                
            dist = self._haversine_distance(amb.location.lat, amb.location.lng, patient_lat, patient_lng)
            if dist < min_dist:
                min_dist = dist
                nearest_id = amb_id
                
        return nearest_id

    def dispatch_ambulance(self, ambulance_id: str, target_lat: float, target_lng: float):
        if ambulance_id in self.ambulances:
            amb = self.ambulances[ambulance_id]
            amb.status = "EN_ROUTE_TO_PICKUP"
            amb.target_location = GeoLocation(target_lat, target_lng)
            return True
        return False

    def _haversine_distance(self, lat1, lon1, lat2, lon2):
        R = 6371 # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat/2) * math.sin(dlat/2) + math.cos(math.radians(lat1)) \
            * math.cos(math.radians(lat2)) * math.sin(dlon/2) * math.sin(dlon/2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return R * c

    def _start_simulation(self):
        """Background thread to move ambulances"""
        t = threading.Thread(target=self._simulation_loop, daemon=True)
        t.start()

    def _simulation_loop(self):
        print("Starting Simulation Loop...")
        while True:
            time.sleep(1) # 1Hz update
            for amb in self.ambulances.values():
                if amb.status == "EN_ROUTE_TO_PICKUP" and amb.target_location:
                    # Move towards target
                    self._move_towards(amb, amb.target_location)
                elif amb.status == "IDLE":
                     # Random jitter to show aliveness
                     amb.location.lat += random.uniform(-0.0001, 0.0001)
                     amb.location.lng += random.uniform(-0.0001, 0.0001)

    def _move_towards(self, amb: Ambulance, target: GeoLocation):
        speed = 0.0005 # Approx 50m/s simulation speed
        
        dy = target.lat - amb.location.lat
        dx = target.lng - amb.location.lng
        distance = math.sqrt(dx*dx + dy*dy)
        
        if distance < speed:
            amb.location.lat = target.lat
            amb.location.lng = target.lng
            amb.status = "ON_SCENE"
            amb.target_location = None
        else:
            ratio = speed / distance
            amb.location.lat += dy * ratio
            amb.location.lng += dx * ratio
            # Calculate heading
            amb.heading = math.degrees(math.atan2(dx, dy))

dispatch_service = DispatchService()
