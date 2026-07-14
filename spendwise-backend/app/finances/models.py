from sqlalchemy import (
    Column,
    Integer,
    Numeric,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.database import Base


class MonthlyFinance(Base):
    __tablename__ = "monthly_finances"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "month",
            "year",
            name="uq_user_month_year"
        ),
    )

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    available_money = Column(Numeric, nullable=False)

    user = relationship(
        "User",
        back_populates="monthly_finances"
    )