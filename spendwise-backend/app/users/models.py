from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)

    monthly_finances = relationship(
        "MonthlyFinance",
        back_populates="user"
    )

    financial_goals = relationship(
        "FinancialGoal",
        back_populates="user"
    )

    expenses = relationship(
        "Expense",
        back_populates="user"
    )