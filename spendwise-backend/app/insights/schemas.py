from pydantic import BaseModel


class Insight(BaseModel):
    priority: str
    title: str
    message: str


class MonthlyInsightsResponse(BaseModel):
    insights: list[Insight]