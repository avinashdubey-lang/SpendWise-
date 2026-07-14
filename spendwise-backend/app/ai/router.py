from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy.orm import Session

from app.database import get_db
from app.users.models import User
from app.auth.dependencies import get_current_user

from app.analysis.exceptions import (
    FutureMonthAnalysisError,
    MonthlyFinanceNotFoundError,
)

from app.ai.schemas import (
    AIContext,
    AIChatRequest,
    AIChatResponse,
)

from app.ai.service import (
    build_ai_context,
    generate_ai_response,
)


router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.get(
    "/context",
    response_model=AIContext,
)
def get_ai_context(
    month: int = Query(ge=1, le=12),
    year: int = Query(ge=2000, le=2100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return build_ai_context(
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
    

@router.post(
    "/chat",
    response_model=AIChatResponse,
)
def chat_with_ai(
    chat_data: AIChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        response = generate_ai_response(
            db=db,
            user_id=current_user.id,
            month=chat_data.month,
            year=chat_data.year,
            question=chat_data.question,
        )

        return {
            "response": response,
        }

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