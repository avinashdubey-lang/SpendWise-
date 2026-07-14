from pydantic import BaseModel, Field

from app.analysis.schemas import MonthlyAnalysisResponse
from app.insights.schemas import MonthlyInsightsResponse
from app.goals.schemas import FinancialGoalResponse
from app.expenses.schemas import ExpenseResponse


class AIContext(BaseModel):
    analysis: MonthlyAnalysisResponse
    insights: MonthlyInsightsResponse
    goals: list[FinancialGoalResponse]
    recent_expenses: list[ExpenseResponse]


class AIChatRequest(BaseModel):
    month: int = Field(ge=1, le=12)
    year: int = Field(ge=2000, le=2100)
    question: str = Field(min_length=1, max_length=1000)


class AIChatResponse(BaseModel):
    response: str