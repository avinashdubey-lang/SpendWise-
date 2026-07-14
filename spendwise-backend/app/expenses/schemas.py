from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class ExpenseCreate(BaseModel):
    amount: Decimal
    description: str
    category: str
    expense_date: date


class ExpenseResponse(BaseModel):
    id: int
    user_id: int
    amount: Decimal
    description: str
    category: str
    expense_date: date

    model_config = ConfigDict(from_attributes=True)


class SpendingSummaryResponse(BaseModel):
    total_spending: Decimal