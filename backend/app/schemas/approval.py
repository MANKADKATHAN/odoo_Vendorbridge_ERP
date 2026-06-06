from typing import Optional
from pydantic import BaseModel
from models import ApprovalStatus

class ApprovalUpdate(BaseModel):
    status: ApprovalStatus
    remarks: Optional[str] = None
