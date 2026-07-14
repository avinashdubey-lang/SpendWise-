from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class MonthlyFinanceCreate(BaseModel):
    month: int = Field(ge=1, le=12)
    year: int = Field(ge=2000, le=2100)
    available_money: Decimal = Field(gt=0)


class MonthlyFinanceResponse(BaseModel):
    id: int
    user_id: int
    month: int
    year: int
    available_money: Decimal

    model_config = ConfigDict(from_attributes=True)