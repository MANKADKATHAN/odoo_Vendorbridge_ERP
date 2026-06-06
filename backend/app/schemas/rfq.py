from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from models import RFQStatus

class RFQUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[int] = None
    deadline: Optional[datetime] = None
    status: Optional[RFQStatus] = None
