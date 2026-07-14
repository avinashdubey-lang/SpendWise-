from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Numeric, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)
    expense_date = Column(Date, nullable=False)

    user = relationship(
        "User",
        back_populates="expenses"
    )