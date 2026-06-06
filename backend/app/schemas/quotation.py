from typing import Optional
from decimal import Decimal
from pydantic import BaseModel
from models import QuotationStatus

class QuotationUpdate(BaseModel):
    price: Optional[Decimal] = None
    delivery_days: Optional[int] = None
    notes: Optional[str] = None
    status: Optional[QuotationStatus] = None
