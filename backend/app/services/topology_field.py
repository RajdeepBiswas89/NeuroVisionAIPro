
import math
import random
from typing import List, Dict

class TopologyEngine:
    def __init__(self, size: int = 20):
        self.size = size # 20x20 grid for the city
        self.base_resistance = 0.5 # Default friction
        # The Field: A continuous matrix of "Resistance" (0.0 to 1.0)
        # Low Resistance = Life-Preserving Pathway
        # High Resistance = Fatal/Blocked Outcome
        self.field = [[self.base_resistance for _ in range(size)] for _ in range(size)]
        self.bias_vectors = [] 

    def get_field_snapshot(self) -> Dict:
        return {
            "resolution": self.size,
            "matrix": self.field,
            "entropy": self._calculate_entropy()
        }

    def _calculate_entropy(self) -> float:
        """Sum of all resistance in the system. Lower is better."""
        total = 0
        for r in self.field:
            total += sum(r)
        return total

    def warp_field(self, lat: float, lng: float, radius: int, intensity: float):
        """
        Creates a 'Gravity Well' of low resistance at a location.
        Resources will naturally drift here without orders.
        """
        grid_x, grid_y = self._latlng_to_grid(lat, lng)
        
        for x in range(self.size):
            for y in range(self.size):
                dist = math.sqrt((x - grid_x)**2 + (y - grid_y)**2)
                if dist < radius:
                    # Curve reality towards 0.0 (Frictionless)
                    delta = (1.0 - (dist / radius)) * intensity
                    self.field[x][y] = max(0.0, self.field[x][y] - delta)

    def get_gradient_at(self, lat: float, lng: float) -> Dict:
        """Returns the slope of the field at a point."""
        x, y = self._latlng_to_grid(lat, lng)
        # Simple gradient calculation based on neighbors
        dx = 0
        dy = 0
        
        if x > 0 and x < self.size - 1:
            dx = self.field[x+1][y] - self.field[x-1][y]
        if y > 0 and y < self.size - 1:
            dy = self.field[x][y+1] - self.field[x][y-1]
            
        return {"dx": dx, "dy": dy}

    def _latlng_to_grid(self, lat: float, lng: float):
        # Mock mapping for Mumbai coordinates to 20x20 grid
        # Center approx 19.07, 72.87
        lat_norm = (lat - 19.00) * 100 
        lng_norm = (lng - 72.80) * 100
        return int(lat_norm % self.size), int(lng_norm % self.size)

topology_field = TopologyEngine()
