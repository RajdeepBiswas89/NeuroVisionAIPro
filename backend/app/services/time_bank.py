
from typing import Dict

class TimeBankService:
    def __init__(self):
        # Initial Credit Allocations (Minutes)
        self.accounts = {
            "CITIZEN_DEFAULT": {"balance": 60, "tier": "Citizen"}, # Every user starts with 1 hour
            "CORP_TATA": {"balance": 5000, "tier": "Enterprise"},
            "GOV_MUMBAI": {"balance": 1000000, "tier": "Government"}
        }

    def get_balance(self, entity_id: str) -> Dict:
        return self.accounts.get(entity_id, {"balance": 0, "tier": "Guest"})

    def transaction(self, from_id: str, amount: float, reason: str) -> bool:
        account = self.accounts.get(from_id)
        if not account:
            return False
            
        if account['balance'] >= amount:
            account['balance'] -= amount
            # Logic to log transaction 'reason'
            return True
        return False

time_bank = TimeBankService()
