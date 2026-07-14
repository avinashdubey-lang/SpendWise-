from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app.expenses.schemas import ExpenseCreate, ExpenseResponse, SpendingSummaryResponse
from app.expenses.service import (
    create_expense,
    get_user_expenses,
    get_total_spending
)
from app.users.models import User
from app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"],
)


@router.post(
        "/", 
        response_model=ExpenseResponse,
        status_code=status.HTTP_201_CREATED,
)
def add_expense(
    expense_data: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_expense(
        db=db,
        expense_data=expense_data,
        user_id=current_user.id,
    )


@router.get(
    "/",
    response_model=list[ExpenseResponse],
)
def list_expenses(
    start_date: date | None = None,
    end_date: date | None = None,
    category: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_expenses(
        db=db,
        user_id=current_user.id,
        start_date=start_date,
        end_date=end_date,
        category=category,
    )


@router.get(
    "/summary",
    response_model=SpendingSummaryResponse,
)
def spending_summary(
    start_date: date | None = None,
    end_date: date | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total = get_total_spending(
        db=db,
        user_id=current_user.id,
        start_date=start_date,
        end_date=end_date,
    )

    return {
        "total_spending": total,
    }