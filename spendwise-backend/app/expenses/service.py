from sqlalchemy.orm import Session
from sqlalchemy import func

from app.expenses.models import Expense
from app.expenses.schemas import ExpenseCreate
from datetime import date


def create_expense(
    db: Session,
    expense_data: ExpenseCreate,
    user_id: int,
):
    expense = Expense(
        user_id=user_id,
        amount=expense_data.amount,
        description=expense_data.description,
        category=expense_data.category,
        expense_date=expense_data.expense_date,
    )

    db.add(expense)
    db.commit()
    db.refresh(expense)

    return expense


def get_user_expenses(
    db: Session,
    user_id: int,
    start_date: date | None = None,
    end_date: date | None = None,
    category: str | None = None,
):
    query = db.query(Expense).filter(
        Expense.user_id == user_id
    )

    if start_date is not None:
        query = query.filter(
            Expense.expense_date >= start_date
        )

    if end_date is not None:
        query = query.filter(
            Expense.expense_date <= end_date
        )

    if category is not None:
        query = query.filter(
            Expense.category == category
        )

    return (
        query
        .order_by(Expense.expense_date.desc())
        .all()
    )


def get_total_spending(
    db: Session,
    user_id: int,
    start_date: date | None = None,
    end_date: date | None = None,
):
    query = db.query(
        func.sum(Expense.amount)
    ).filter(
        Expense.user_id == user_id
    )

    if start_date is not None:
        query = query.filter(
            Expense.expense_date >= start_date
        )

    if end_date is not None:
        query = query.filter(
            Expense.expense_date <= end_date
        )

    total = query.scalar()

    return total or 0


def get_recent_expenses(
    db: Session,
    user_id: int,
    limit: int = 5,
):
    return (
        db.query(Expense)
        .filter(
            Expense.user_id == user_id,
        )
        .order_by(
            Expense.expense_date.desc(),
            Expense.id.desc(),
        )
        .limit(limit)
        .all()
    )