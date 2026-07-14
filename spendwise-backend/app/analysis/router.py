from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.users.models import User
from app.auth.dependencies import get_current_user
from app.analysis.schemas import MonthlyAnalysisResponse
from app.analysis.service import get_monthly_analysis
from app.analysis.exceptions import (
    FutureMonthAnalysisError,
    MonthlyFinanceNotFoundError,
)


router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
)


@router.get(
    "/monthly",
    response_model=MonthlyAnalysisResponse,
)
def monthly_analysis(
    month: int = Query(ge=1, le=12),
    year: int = Query(ge=2000, le=2100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return get_monthly_analysis(
            db=db,
            user_id=current_user.id,
            month=month,
            year=year,
        )

    except FutureMonthAnalysisError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Future month analysis is not available",
        )

    except MonthlyFinanceNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Monthly finance not found",
        )
    return analysis