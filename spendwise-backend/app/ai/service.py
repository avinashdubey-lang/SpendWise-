from sqlalchemy.orm import Session

from app.ai.schemas import AIContext

from app.analysis.service import get_monthly_analysis
from app.insights.service import get_monthly_insights
from app.goals.service import get_user_goals
from app.expenses.service import get_recent_expenses

def build_ai_context(
    db: Session,
    user_id: int,
    month: int,
    year: int,
):
    analysis = get_monthly_analysis(
        db=db,
        user_id=user_id,
        month=month,
        year=year,
    )

    insights = get_monthly_insights(
        db=db,
        user_id=user_id,
        month=month,
        year=year,
    )

    goals = get_user_goals(
        db=db,
        user_id=user_id,
    )

    recent_expenses = get_recent_expenses(
        db=db,
        user_id=user_id,
    )

    return AIContext(
        analysis=analysis,
        insights=insights,
        goals=goals,
        recent_expenses=recent_expenses,
    )