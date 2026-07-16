from decimal import Decimal
from datetime import date

from dateutil.relativedelta import relativedelta

from app.goals.models import FinancialGoal
from app.goals.schemas import GoalAnalysisResponse


def calculate_remaining_amount(
    target_amount: Decimal,
    saved_amount: Decimal,
) -> Decimal:

    remaining_amount = target_amount - saved_amount

    return max(
        remaining_amount,
        Decimal("0"),
    )


def calculate_progress_percentage(
    target_amount: Decimal,
    saved_amount: Decimal,
) -> Decimal:

    if target_amount <= Decimal("0"):
        return Decimal("0")

    progress = (
        saved_amount / target_amount
    ) * Decimal("100")

    return min(
        progress,
        Decimal("100"),
    )


def calculate_months_remaining(
    deadline: date,
) -> int:

    today = date.today()

    if deadline < today:
        return 0

    difference = relativedelta(
        deadline,
        today,
    )

    months_remaining = (
        difference.years * 12
        + difference.months
    )

    if difference.days > 0:
        months_remaining += 1

    return max(
        months_remaining,
        1,
    )


def calculate_required_monthly_saving(
    target_amount: Decimal,
    saved_amount: Decimal,
    months_remaining: int,
) -> Decimal:

    remaining_amount = calculate_remaining_amount(
        target_amount,
        saved_amount,
    )

    if remaining_amount == Decimal("0"):
        return Decimal("0")

    if months_remaining <= 0:
        return remaining_amount

    return remaining_amount / Decimal(
        months_remaining,
    )


def analyze_goal(
    goal: FinancialGoal,
) -> GoalAnalysisResponse:
    
    remaining_amount = calculate_remaining_amount(
        target_amount=goal.target_amount,
        saved_amount=goal.saved_amount,
    )

    progress_percentage = calculate_progress_percentage(
        target_amount=goal.target_amount,
        saved_amount=goal.saved_amount,
    )

    months_remaining = calculate_months_remaining(
        deadline=goal.deadline,
    )

    required_monthly_saving = calculate_required_monthly_saving(
        target_amount=goal.target_amount,
        saved_amount=goal.saved_amount,
        months_remaining=months_remaining,
    )

    if remaining_amount == Decimal("0"):
        status = "completed"

    elif months_remaining == 0:
        status = "overdue"

    else:
        status = "on_track"

    return GoalAnalysisResponse(
        goal_name=goal.name,
        target_amount=goal.target_amount,
        saved_amount=goal.saved_amount,
        remaining_amount=remaining_amount,
        progress_percentage=progress_percentage,
        months_remaining=months_remaining,
        required_monthly_saving=required_monthly_saving,
        status=status,
    )