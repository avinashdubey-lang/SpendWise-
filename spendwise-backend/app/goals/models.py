from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    Date,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.database import Base


class FinancialGoal(Base):
    __tablename__ = "financial_goals"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "priority_position",
            name="uq_user_goal_priority"
        ),
    )

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    target_amount = Column(Numeric, nullable=False)
    deadline = Column(Date, nullable=False)
    reason = Column(String, nullable=False)
    priority_position = Column(Integer, nullable=False)

    user = relationship(
        "User",
        back_populates="financial_goals"
    )