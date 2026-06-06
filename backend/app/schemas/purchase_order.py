from typing import Optional
from decimal import Decimal
from pydantic import BaseModel
from models import POStatus

class PurchaseOrderUpdate(BaseModel):
    status: Optional[POStatus] = None
    amount: Optional[Decimal] = None
