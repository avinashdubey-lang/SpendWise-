from sqlalchemy.orm import Session

from app.ai.schemas import AIContext

from app.analysis.service import get_monthly_analysis
from app.insights.service import get_monthly_insights
from app.goals.service import get_goal_analysis
from app.expenses.service import get_recent_expenses

from app.ai.client import client
from app.ai.prompts import (
    SPENDWISE_SYSTEM_PROMPT,
    build_user_prompt,
)

from fastapi import HTTPException, status

from google.genai.errors import (
    ServerError,
    ClientError,
)

import logging

from google.genai import types

logger = logging.getLogger(__name__)

def build_ai_context(
    db: Session,
    user_id: int,
    month: int,
    year: int,
):
    analysis = get_monthly_analysis(
        db=db,
        user_id=user_id,
        month=month,
        year=year,
    )

    insights = get_monthly_insights(
        db=db,
        user_id=user_id,
        month=month,
        year=year,
    )

    goal_analysis = get_goal_analysis(
        db=db,
        user_id=user_id,
    )

    recent_expenses = get_recent_expenses(
        db=db,
        user_id=user_id,
    )

    return AIContext(
        analysis=analysis,
        insights=insights,
        goal_analysis=goal_analysis,
        recent_expenses=recent_expenses,
    )


def generate_ai_response(
    db: Session,
    user_id: int,
    month: int,
    year: int,
    question: str,
):
    context = build_ai_context(
        db=db,
        user_id=user_id,
        month=month,
        year=year,
    )

    user_prompt = build_user_prompt(
        context=context,
        question=question,
    )

    try:
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=SPENDWISE_SYSTEM_PROMPT,
            ),
        )

        return response.text

    except ServerError as e:
        logger.exception(e)

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service is temporarily unavailable. Please try again later.",
        )

    except ClientError as e:
        logger.exception(e)

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to process the AI request.",
        )

    except Exception as e:
        logger.exception(e)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unexpected AI service error.",
        )
