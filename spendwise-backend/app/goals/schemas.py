from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class FinancialGoalCreate(BaseModel):
    name: str
    target_amount: Decimal = Field(gt=0)
    saved_amount: Decimal = Field(default=0, ge=0)
    deadline: date
    reason: str


class FinancialGoalUpdate(BaseModel):
    name: str | None = None
    target_amount: Decimal | None = Field(default=None, gt=0)
    saved_amount: Decimal | None = Field(default=None, ge=0)
    deadline: date | None = None
    reason: str | None = None


class FinancialGoalResponse(BaseModel):
    id: int
    user_id: int
    name: str
    target_amount: Decimal
    saved_amount: Decimal
    deadline: date
    reason: str
    priority_position: int

    model_config = ConfigDict(from_attributes=True)


class GoalReorderRequest(BaseModel):
    new_position: int = Field(ge=1)


class GoalAnalysisResponse(BaseModel):
    goal_name: str
    target_amount: Decimal
    saved_amount: Decimal
    remaining_amount: Decimal
    progress_percentage: Decimal
    months_remaining: int
    required_monthly_saving: Decimal
    status: str