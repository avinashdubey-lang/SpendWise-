from sqlalchemy.orm import Session

from app.finances.models import MonthlyFinance
from app.finances.schemas import MonthlyFinanceCreate


def set_monthly_finance(
    db: Session,
    finance_data: MonthlyFinanceCreate,
    user_id: int,
):
    monthly_finance = (
        db.query(MonthlyFinance)
        .filter(
            MonthlyFinance.user_id == user_id,
            MonthlyFinance.month == finance_data.month,
            MonthlyFinance.year == finance_data.year,
        )
        .first()
    )

    if monthly_finance:
        monthly_finance.available_money = finance_data.available_money

    else:
        monthly_finance = MonthlyFinance(
            user_id=user_id,
            month=finance_data.month,
            year=finance_data.year,
            available_money=finance_data.available_money,
        )

        db.add(monthly_finance)

    db.commit()
    db.refresh(monthly_finance)

    return monthly_finance