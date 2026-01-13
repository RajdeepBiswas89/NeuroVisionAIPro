
from typing import Any, Callable, Dict, List, Optional
from pydantic import BaseModel
import time
import math

class UrgencyScalar(float):
    """
    A continuous value [0.0, infinity) representing the gradient of necessity.
    0.0 = Irrelevant
    1.0 = Standard
    10.0 = Critical
    100.0 = Existence-Threatening
    """
    pass

class DecayFunction(BaseModel):
    """
    Describes how the utility of a result fades over time.
    V(t) = V0 * e^(-lambda * t)
    """
    initial_value: float = 1.0
    half_life_seconds: float = 5.0
    
    def calculate_utility(self, elapsed_seconds: float) -> float:
        lambda_val = 0.693 / self.half_life_seconds
        return self.initial_value * math.exp(-lambda_val * elapsed_seconds)

class CorrectnessThreshold(float):
    """
    The minimum acceptable precision required.
    If Urgency is high, this threshold drops.
    """
    pass

class ResultVial(BaseModel):
    """
    A container for a computation result that knows its own freshness.
    """
    value: Any
    fidelity: float # 0.0 to 1.0
    created_at: float = time.time()
    decay_fn: DecayFunction
    
    @property
    def current_utility(self) -> float:
        age = time.time() - self.created_at
        return self.decay_fn.calculate_utility(age)
