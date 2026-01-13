
from app.services.topology_field import topology_field
from typing import Dict

class EntropyDaemonService:
    def __init__(self):
        self.integral_history = []

    def measure_system_stress(self) -> Dict:
        """
        Calculates the Total Existence Resistance (Integral of Field).
        Lower values mean reality is 'smoother' for survival.
        """
        snapshot = topology_field.get_field_snapshot()
        current_entropy = snapshot['entropy']
        
        self.integral_history.append(current_entropy)
        if len(self.integral_history) > 100:
            self.integral_history.pop(0)

        return {
            "current_entropy": round(current_entropy, 4),
            "stability_index": self._calculate_stability(),
            "field_resolution": snapshot['resolution']
        }

    def _calculate_stability(self):
        if not self.integral_history:
            return 1.0
        # If entropy is decreasing, stability is high.
        avg = sum(self.integral_history) / len(self.integral_history)
        current = self.integral_history[-1]
        
        if current < avg:
            return 1.0 # Improving
        return max(0.0, 1.0 - (current - avg))

entropy_daemon = EntropyDaemonService()
