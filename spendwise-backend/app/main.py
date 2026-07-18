from fastapi import FastAPI

from app.database import engine
from app.users import models as user_models
from app.finances import models as finance_models
from app.goals import models as goal_models
from app.expenses import models as expense_models

from app.users.router import router as user_router
from app.expenses.router import router as expense_router
from app.auth.router import router as auth_router
from app.finances.router import router as finance_router
from app.goals.router import router as goal_router
from app.analysis.router import router as analysis_router
from app.insights.router import router as insights_router
from app.ai.router import router as ai_router
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(expense_router)
app.include_router(auth_router)
app.include_router(finance_router)
app.include_router(goal_router)
app.include_router(analysis_router)
app.include_router(insights_router)
app.include_router(ai_router)