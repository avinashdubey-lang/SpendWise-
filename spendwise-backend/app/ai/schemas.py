from pydantic import BaseModel

from app.analysis.schemas import MonthlyAnalysisResponse
from app.insights.schemas import MonthlyInsightsResponse
from app.goals.schemas import FinancialGoalResponse
from app.expenses.schemas import ExpenseResponse


class AIContext(BaseModel):
    analysis: MonthlyAnalysisResponse
    insights: MonthlyInsightsResponse
    goals: list[FinancialGoalResponse]
    recent_expenses: list[ExpenseResponse]