from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.dashboard.schemas import DashboardSummaryResponse
from app.dashboard.schemas import (
    DashboardSummaryResponse,
    CategorySpendingResponse,
)

from app.dashboard.service import (
    get_dashboard_summary,
    get_spending_by_category,
)
from app.database import get_db
from app.users.models import User

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
)
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_dashboard_summary(
        db=db,
        user_id=current_user.id,
    )


@router.get(
    "/by-category",
    response_model=list[CategorySpendingResponse],
)
def spending_by_category(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_spending_by_category(
        db=db,
        user_id=current_user.id,
    )