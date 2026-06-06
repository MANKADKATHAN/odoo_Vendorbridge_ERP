from typing import Dict
from pydantic import BaseModel, Field

class DashboardSummary(BaseModel):
    total_vendors: int = Field(..., description="Total number of registered vendors")
    total_rfqs: int = Field(..., description="Total number of RFQs created")
    total_quotations: int = Field(..., description="Total number of quotations submitted")
    total_spend: float = Field(..., description="Sum of total_amount for all accepted quotations")
    rfq_status_breakdown: Dict[str, int] = Field(..., description="Count of RFQs grouped by status")
    quotation_status_breakdown: Dict[str, int] = Field(..., description="Count of quotations grouped by status")

    class Config:
        json_schema_extra = {
            "example": {
                "total_vendors": 2,
                "total_rfqs": 2,
                "total_quotations": 1,
                "total_spend": 75000.00,
                "rfq_status_breakdown": {
                    "draft": 1,
                    "open": 1,
                    "closed": 0,
                    "awarded": 0
                },
                "quotation_status_breakdown": {
                    "pending": 1,
                    "accepted": 0,
                    "rejected": 0
                }
            }
        }
