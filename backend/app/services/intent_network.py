
import math
from typing import List, Dict, Optional
import uuid
from datetime import datetime
from app.services.dispatch_service import dispatch_service, Ambulance

class IntentResolutionEngine:
    def __init__(self):
        self.active_intents = {} # id -> IntentPacket
        self.resolutions = {} # intent_id -> Resolution

    def inject_intent(self, packet: Dict) -> Dict:
        """
        Receives an Intent Packet and creates a Resolution Strategy.
        Instead of just "Finding a car", it negotiates a solution.
        """
        intent_id = packet.get('id') or str(uuid.uuid4())
        packet['id'] = intent_id
        packet['status'] = 'NEGOTIATING'
        self.active_intents[intent_id] = packet

        # 1. Analyze Context
        urgency = packet.get('urgency', 0.5)
        loc = packet.get('location')

        # 2. Negotiate Resources (Simplify: Find best ambulance logic + extras)
        best_amb_id = dispatch_service.find_nearest_ambulance(loc['lat'], loc['lng'])
        
        actions = []
        if best_amb_id:
            # Action 1: Re-task Physical Asset
            actions.append({
                "id": str(uuid.uuid4()),
                "type": "REROUTE_ASSET",
                "targetResourceId": best_amb_id,
                "parameters": {"lat": loc['lat'], "lng": loc['lng']},
                "status": "PENDING"
            })
            
            # Action 2: (Simulated) Signal Pre-emption
            actions.append({
                 "id": str(uuid.uuid4()),
                 "type": "SIGNAL_PREEMPTION",
                 "targetResourceId": "SIG-GRID-A7",
                 "parameters": {"corridor": "MAIN_ST_NORTH"},
                 "status": "PENDING"
            })

        # 3. Formulate Resolution
        resolution = {
            "resolutionId": str(uuid.uuid4()),
            "intentId": intent_id,
            "actions": actions,
            "costInTimeCredits": 15 if urgency > 0.8 else 5, # Dynamic Cost
            "estimatedOutcome": {
                "arrivalIn": 6.5, # Reduced due to signal pre-emption
                "probabilityOfSuccess": 0.98
            }
        }
        
        self.resolutions[intent_id] = resolution
        
        # 4. Execute (Trigger Dispatch Service)
        if best_amb_id:
            dispatch_service.dispatch_ambulance(best_amb_id, loc['lat'], loc['lng'])
            
        return resolution

    def get_network_state(self):
        return {
            "activeIntents": len(self.active_intents),
            "resolutionsPending": len(self.resolutions)
        }

intent_network = IntentResolutionEngine()
