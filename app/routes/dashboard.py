from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.dashboard import DashboardSummary
from app.services.dashboard import DashboardService
from app.core.dependencies import get_current_user
from app.core.database import get_db
from models import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get(
    "/summary", 
    response_model=DashboardSummary,
    summary="Get procurement dashboard summary",
    description="Aggregates live counts of vendors, RFQs, quotations, active procurement spend, and status charts from MySQL. Requires authentication."
)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return DashboardService.get_summary(db_session=db)
