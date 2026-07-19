from decimal import Decimal

from pydantic import BaseModel


class DashboardSummaryResponse(BaseModel):
    monthly_allowance: Decimal
    total_spent: Decimal
    remaining_balance: Decimal
    savings_rate: float


class CategorySpendingResponse(BaseModel):
    category: str
    amount: Decimal
    percentage: float


