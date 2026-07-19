from datetime import date
from decimal import Decimal

from sqlalchemy.orm import Session

from sqlalchemy import func
from app.dashboard.schemas import (
    DashboardSummaryResponse,
    CategorySpendingResponse,
)
from app.expenses.models import Expense
from app.finances.models import MonthlyFinance


def get_dashboard_summary(
    db: Session,
    user_id: int,
) -> DashboardSummaryResponse:

    today = date.today()

    finance = (
        db.query(MonthlyFinance)
        .filter(
            MonthlyFinance.user_id == user_id,
            MonthlyFinance.month == today.month,
            MonthlyFinance.year == today.year,
        )
        .first()
    )

    expenses = (
        db.query(Expense)
        .filter(
            Expense.user_id == user_id,
            Expense.expense_date >= date(today.year, today.month, 1),
            Expense.expense_date <= today,
        )
        .all()
    )

    total_spent = sum(
        expense.amount
        for expense in expenses
    )

    if finance is None:
        return DashboardSummaryResponse(
            monthly_allowance=Decimal("0"),
            total_spent=Decimal("0"),
            remaining_balance=Decimal("0"),
            savings_rate=0.0,
        )

    remaining_balance = finance.available_money

    monthly_allowance = (
        remaining_balance + total_spent
    )

    if monthly_allowance == 0:
        savings_rate = 0.0
    else:
        savings_rate = float(
            (remaining_balance / monthly_allowance) * 100
        )

    return DashboardSummaryResponse(
        monthly_allowance=monthly_allowance,
        total_spent=total_spent,
        remaining_balance=remaining_balance,
        savings_rate=round(savings_rate, 2),
    )


def get_spending_by_category(
    db: Session,
    user_id: int,
) -> list[CategorySpendingResponse]:

    today = date.today()

    category_totals = (
        db.query(
            Expense.category,
            func.sum(Expense.amount).label("amount"),
        )
        .filter(
            Expense.user_id == user_id,
            Expense.expense_date >= date(today.year, today.month, 1),
            Expense.expense_date <= today,
        )
        .group_by(Expense.category)
        .all()
    )

    total_spent = sum(
        category.amount
        for category in category_totals
    )

    if total_spent == 0:
        return []

    return [
        CategorySpendingResponse(
            category=category.category,
            amount=category.amount,
            percentage=round(
                float(category.amount / total_spent * 100),
                2,
            ),
        )
        for category in category_totals
    ]