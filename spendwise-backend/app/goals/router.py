from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.users.models import User
from app.auth.dependencies import get_current_user
from app.goals.schemas import (
    FinancialGoalCreate,
    FinancialGoalResponse,
    GoalReorderRequest,
)
from app.goals.service import (
    create_goal,
    get_user_goals,
    delete_goal,
    reorder_goal,
)


router = APIRouter(
    prefix="/goals",
    tags=["Goals"],
)


@router.post(
    "/",
    response_model=FinancialGoalResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_goal(
    goal_data: FinancialGoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_goal(
        db=db,
        goal_data=goal_data,
        user_id=current_user.id,
    )


@router.get(
    "/",
    response_model=list[FinancialGoalResponse],
)
def list_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_goals(
        db=db,
        user_id=current_user.id,
    )


@router.delete(
    "/{goal_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = delete_goal(
        db=db,
        goal_id=goal_id,
        user_id=current_user.id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found",
        )
    

@router.put(
    "/{goal_id}/priority",
    response_model=FinancialGoalResponse,
)
def change_goal_priority(
    goal_id: int,
    reorder_data: GoalReorderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = reorder_goal(
        db=db,
        goal_id=goal_id,
        new_position=reorder_data.new_position,
        user_id=current_user.id,
    )

    if goal is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid goal or priority position",
        )

    return goal