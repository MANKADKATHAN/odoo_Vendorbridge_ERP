from typing import Optional
from decimal import Decimal
from pydantic import BaseModel
from models import InvoiceStatus

class InvoiceUpdate(BaseModel):
    status: Optional[InvoiceStatus] = None
    tax_amount: Optional[Decimal] = None
    total_amount: Optional[Decimal] = None
