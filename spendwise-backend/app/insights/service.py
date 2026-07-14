from decimal import Decimal

from app.insights.category_rules import (
    NON_ESSENTIAL_CATEGORIES,
)
from app.insights.config import(
    BUDGET_SAFE_THRESHOLD,
    BUDGET_WARNING_THRESHOLD,
    NON_ESSENTIAL_ALERT_THRESHOLD
)

from sqlalchemy.orm import Session

from app.analysis.service import get_monthly_analysis



def generate_monthly_insights(
    analysis: dict,
):
    insights = []

    spending_percentage = analysis["spending_percentage"]

    if spending_percentage < BUDGET_SAFE_THRESHOLD:
        insights.append(
            {
                "priority": "low",
                "title": "Budget Status",
                "message": "You're well within your monthly budget."
            }
        )

    elif spending_percentage < BUDGET_WARNING_THRESHOLD:
        insights.append(
            {
                "priority": "medium",
                "title": "Budget Status",
                "message": "You've used a moderate portion of your monthly budget."
            }
        )

    else:
        insights.append(
            {
                "priority": "high",
                "title": "Budget Status",
                "message": "You're approaching your monthly budget limit."
            }
        )

    projected_overspending = analysis["projected_overspending"]

    if projected_overspending > 0:
        insights.append(
            {
                "priority": "high",
                "title": "Projected Overspending",
                "message": f"At your current spending pace, you're projected to exceed your monthly budget by ₹{projected_overspending:.2f}."
            }
        )

    remaining_daily_allowance = analysis["remaining_daily_allowance"]

    if remaining_daily_allowance > 0:
        insights.append(
            {
                "priority": "low",
                "title": "Daily Spending Guidance",
                "message": f"To stay within budget, try to keep your daily spending around ₹{remaining_daily_allowance:.2f}."
            }
        )

    category_breakdown = analysis["category_breakdown"]

    if category_breakdown:
        largest = max(
            category_breakdown,
            key=lambda item: item["amount"],
        )

        insights.append(
            {
                "priority": "low",
                "title": "Largest Spending Category",
                "message": f"{largest['category']} accounts for {largest['percentage']:.2f}% of your spending this month."
            }
        )

    non_essential_total = Decimal("0")

    for item in category_breakdown:
        if item["category"] in NON_ESSENTIAL_CATEGORIES:
            non_essential_total += item["amount"]

    if analysis["total_spending"] > 0:
        non_essential_percentage = (
            non_essential_total
            / analysis["total_spending"]
        ) * 100
    else:
        non_essential_percentage = Decimal("0")

    if non_essential_percentage >= NON_ESSENTIAL_ALERT_THRESHOLD:
        insights.append(
            {
                "priority": "medium",
                "title": "Discretionary Spending",
                "message": f"{non_essential_percentage:.2f}% of your spending is on non-essential categories. Reducing discretionary expenses could significantly improve your savings."
            }
        )

    return insights


def get_monthly_insights(
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

    insights = generate_monthly_insights(
        analysis
    )

    return {
        "insights": insights,
    }