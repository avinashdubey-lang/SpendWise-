from sqlalchemy.orm import Session

from app.goals.models import FinancialGoal
from app.goals.schemas import FinancialGoalCreate


def create_goal(
    db: Session,
    goal_data: FinancialGoalCreate,
    user_id: int,
):
    goal_count = (
        db.query(FinancialGoal)
        .filter(FinancialGoal.user_id == user_id)
        .count()
    )

    priority_position = goal_count + 1

    goal = FinancialGoal(
        user_id=user_id,
        name=goal_data.name,
        target_amount=goal_data.target_amount,
        deadline=goal_data.deadline,
        reason=goal_data.reason,
        priority_position=priority_position,
    )

    db.add(goal)
    db.commit()
    db.refresh(goal)

    return goal



def get_user_goals(
    db: Session,
    user_id: int,
):
    return (
        db.query(FinancialGoal)
        .filter(FinancialGoal.user_id == user_id)
        .order_by(FinancialGoal.priority_position.asc())
        .all()
    )


def delete_goal(
    db: Session,
    goal_id: int,
    user_id: int,
):
    goal = (
        db.query(FinancialGoal)
        .filter(
            FinancialGoal.id == goal_id,
            FinancialGoal.user_id == user_id,
        )
        .first()
    )

    if goal is None:
        return False

    deleted_priority = goal.priority_position

    db.delete(goal)
    db.flush()

    remaining_goals = (
        db.query(FinancialGoal)
        .filter(
            FinancialGoal.user_id == user_id,
            FinancialGoal.priority_position > deleted_priority,
        )
        .order_by(FinancialGoal.priority_position.asc())
        .all()
    )

    for remaining_goal in remaining_goals:
        remaining_goal.priority_position -= 1

    db.commit()

    return True


def reorder_goal(
    db: Session,
    goal_id: int,
    new_position: int,
    user_id: int,
):
    goals = (
        db.query(FinancialGoal)
        .filter(FinancialGoal.user_id == user_id)
        .order_by(FinancialGoal.priority_position.asc())
        .all()
    )

    goal = next(
        (item for item in goals if item.id == goal_id),
        None,
    )

    if goal is None:
        return None

    if new_position > len(goals):
        return None

    old_position = goal.priority_position

    if old_position == new_position:
        return goal

    goal.priority_position = -1
    db.flush()

    if new_position < old_position:
        affected_goals = [
            item
            for item in goals
            if new_position <= item.priority_position < old_position
            and item.id != goal.id
        ]

        for item in reversed(affected_goals):
            item.priority_position += 1
            db.flush()

    else:
        affected_goals = [
            item
            for item in goals
            if old_position < item.priority_position <= new_position
            and item.id != goal.id
        ]

        for item in affected_goals:
            item.priority_position -= 1
            db.flush()

    goal.priority_position = new_position

    db.commit()
    db.refresh(goal)

    return goal