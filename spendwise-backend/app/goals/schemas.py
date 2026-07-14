from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class FinancialGoalCreate(BaseModel):
    name: str
    target_amount: Decimal = Field(gt=0)
    deadline: date
    reason: str


class FinancialGoalResponse(BaseModel):
    id: int
    user_id: int
    name: str
    target_amount: Decimal
    deadline: date
    reason: str
    priority_position: int

    model_config = ConfigDict(from_attributes=True)


class GoalReorderRequest(BaseModel):
    new_position: int = Field(ge=1)