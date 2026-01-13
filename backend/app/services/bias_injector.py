
from typing import Dict
from app.services.topology_field import topology_field
import random

class BiasInjectorService:
    def __init__(self):
        self.active_biases = []

    def inject_bias(self, lat: float, lng: float, type: str = "SURVIVAL_WELL"):
        """
        Does not command anyone.
        Merely tilts the floor so balls roll towards this point.
        """
        if type == "SURVIVAL_WELL":
            # Create a massive dip in resistance
            topology_field.warp_field(lat, lng, radius=5, intensity=0.4)
            self.active_biases.append({"lat": lat, "lng": lng, "type": type})
            
    def apply_drift(self, resource_location: Dict) -> Dict:
        """
        Calculates the subtle nudge to apply to an agent based on the field gradient.
        """
        grad = topology_field.get_gradient_at(resource_location['lat'], resource_location['lng'])
        
        # Agents move 'downhill' (towards lower resistance)
        # So we add negative gradient
        return {
            "lat_bias": -grad['dx'] * 0.001,
            "lng_bias": -grad['dy'] * 0.001
        }

bias_injector = BiasInjectorService()
