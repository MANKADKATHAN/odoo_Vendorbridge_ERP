from typing import Optional
from pydantic import BaseModel
from models import VendorStatus

class VendorUpdate(BaseModel):
    company_name: Optional[str] = None
    gst_number: Optional[str] = None
    phone: Optional[str] = None
    category: Optional[str] = None
    rating: Optional[float] = None
    status: Optional[VendorStatus] = None
