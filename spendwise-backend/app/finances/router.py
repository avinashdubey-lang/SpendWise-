from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.users.models import User
from app.auth.dependencies import get_current_user
from app.finances.schemas import (
    MonthlyFinanceCreate,
    MonthlyFinanceResponse,
)
from app.finances.service import set_monthly_finance


router = APIRouter(
    prefix="/finances",
    tags=["Finances"],
)


@router.put(
    "/monthly",
    response_model=MonthlyFinanceResponse,
)
def set_finance(
    finance_data: MonthlyFinanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return set_monthly_finance(
        db=db,
        finance_data=finance_data,
        user_id=current_user.id,
    )