from calendar import monthrange
from datetime import date

from sqlalchemy.orm import Session

from app.finances.models import MonthlyFinance
from app.expenses.service import get_total_spending

from app.analysis.exceptions import (
    FutureMonthAnalysisError,
    MonthlyFinanceNotFoundError,
)

from decimal import Decimal

from sqlalchemy import func
from app.expenses.models import Expense

from app.utils.money import round_money


def get_category_breakdown(
    db: Session,
    user_id: int,
    start_date: date,
    end_date: date,
):
    results = (
        db.query(
            Expense.category,
            func.sum(Expense.amount),
        )
        .filter(
            Expense.user_id == user_id,
            Expense.expense_date >= start_date,
            Expense.expense_date <= end_date,
        )
        .group_by(Expense.category)
        .all()
    )

    return results


def get_monthly_analysis(
    db: Session,
    user_id: int,
    month: int,
    year: int,
):
    
    today = date.today()

    requested_month = (year, month)
    current_month = (today.year, today.month)

    if requested_month > current_month:
        raise FutureMonthAnalysisError
    
    monthly_finance = (
        db.query(MonthlyFinance)
        .filter(
            MonthlyFinance.user_id == user_id,
            MonthlyFinance.month == month,
            MonthlyFinance.year == year,
        )
        .first()
    )

    if monthly_finance is None:
        raise MonthlyFinanceNotFoundError

    start_date = date(year, month, 1)

    last_day = monthrange(year, month)[1]


    if requested_month == current_month:
        days_for_average = today.day
    else:
        days_for_average = last_day

    end_date = date(year, month, last_day)

    total_spending = get_total_spending(
        db=db,
        user_id=user_id,
        start_date=start_date,
        end_date=end_date,
    )


    category_results = get_category_breakdown(
        db=db,
        user_id=user_id,
        start_date=start_date,
        end_date=end_date,
    )


    category_breakdown = []

    for category, amount in category_results:
        if total_spending > 0:
            percentage = (amount / total_spending) * 100
        else:
            percentage = Decimal("0")

        category_breakdown.append(
            {
                "category": category,
                "amount": round_money(amount),
                "percentage": round_money(percentage),
            }
        )
    

    spending_percentage = (
        total_spending
        / monthly_finance.available_money
    ) * 100

    average_daily_spending = (
        total_spending / days_for_average
    )

    projected_month_end_spending = (
        average_daily_spending * last_day
    )

    projected_overspending = max(
        projected_month_end_spending
        - monthly_finance.available_money,
        Decimal("0"),
    )

    remaining_money = (
        monthly_finance.available_money - total_spending
    )

    overspent_amount = max(
        total_spending - monthly_finance.available_money,
        Decimal("0"),
    )

    if requested_month == current_month:
        remaining_days = last_day - today.day + 1
    else:
        remaining_days = 0

    if remaining_days > 0 and remaining_money > 0:
        remaining_daily_allowance = (
            remaining_money / remaining_days
        )
    else:
        remaining_daily_allowance = Decimal("0")

    return {
        "available_money": round_money(monthly_finance.available_money),
        "total_spending": round_money(total_spending),
        "remaining_money": round_money(remaining_money),
        "spending_percentage": round_money(spending_percentage),
        "average_daily_spending": round_money(average_daily_spending),
        "remaining_daily_allowance": round_money(
            Decimal(str(remaining_daily_allowance))
        ),
        "overspent_amount": round_money(overspent_amount),
        "projected_month_end_spending": round_money(
            projected_month_end_spending
        ),
        "projected_overspending": round_money(
            projected_overspending
        ),
        "category_breakdown": category_breakdown,
    }