from decimal import Decimal
from pydantic import BaseModel


class BudgetAnalysis(BaseModel):
    total_spent: Decimal
    remaining_money: Decimal
    spending_percentage: float
    remaining_percentage: float
    budget_health: str