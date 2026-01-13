
from typing import List, Dict, Callable
from pydantic import BaseModel
from app.uocm.primitives import UrgencyScalar, DecayFunction

class ComputationNode(BaseModel):
    id: str
    description: str
    estimated_cost_ms: float
    base_fidelity: float = 1.0 # 1.0 = Perfect Precision
    
    # The actual work (for simulation, this is abstract)
    # In a real system, this would be a function pointer or WASM blob
    
    def calculate_effective_urgency(self, inbound_urgency: UrgencyScalar) -> UrgencyScalar:
        """
        Urgency amplifies as it moves upstream (pull-based).
        If output is critical, inputs are HYPER-critical.
        """
        return inbound_urgency * 1.5 # Simple amplification factor

class UrgencyEdge(BaseModel):
    source_id: str
    target_id: str
    conductivity: float = 1.0 # How well urgency propagates

class UrgencyGraph:
    def __init__(self):
        self.nodes: Dict[str, ComputationNode] = {}
        self.edges: List[UrgencyEdge] = []
        
    def add_node(self, node: ComputationNode):
        self.nodes[node.id] = node
        
    def add_dependency(self, upstream: str, downstream: str, conductivity: float = 1.0):
        self.edges.append(UrgencyEdge(source_id=upstream, target_id=downstream, conductivity=conductivity))

    def get_upstream_nodes(self, node_id: str) -> List[str]:
        return [e.source_id for e in self.edges if e.target_id == node_id]
