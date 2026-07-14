from decimal import Decimal

from pydantic import BaseModel


class MonthlyAnalysisResponse(BaseModel):
    available_money: Decimal
    total_spending: Decimal
    remaining_money: Decimal
    spending_percentage: Decimal
    average_daily_spending: Decimal
    remaining_daily_allowance: Decimal
    overspent_amount: Decimal
    projected_month_end_spending: Decimal
    projected_overspending: Decimal
    category_breakdown: list[CategoryBreakdownItem]


class CategoryBreakdownItem(BaseModel):
    category: str
    amount: Decimal
    percentage: Decimal