from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime
from typing import Optional, List
from decimal import Decimal
from models import (
    UserRole, VendorStatus, RFQStatus, QuotationStatus,
    ApprovalStatus, POStatus, InvoiceStatus
)

class ConfigBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

# ----------------- Users -----------------
class UserBase(ConfigBase):
    name: str
    email: EmailStr
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

# ----------------- Vendors -----------------
class VendorBase(ConfigBase):
    company_name: str
    gst_number: str
    phone: str
    category: str
    rating: float = 0.0
    status: VendorStatus = VendorStatus.PENDING

class VendorCreate(VendorBase):
    user_id: int

class VendorResponse(VendorBase):
    id: int
    user_id: int
    created_at: datetime

# ----------------- RFQs -----------------
class RFQBase(ConfigBase):
    title: str
    description: Optional[str] = None
    quantity: int
    deadline: datetime
    status: RFQStatus = RFQStatus.DRAFT

class RFQCreate(RFQBase):
    created_by: int

class RFQResponse(RFQBase):
    id: int
    created_by: int
    created_at: datetime

# ----------------- RFQ Invitations -----------------
class RFQInvitationBase(ConfigBase):
    rfq_id: int
    vendor_id: int

class RFQInvitationCreate(RFQInvitationBase):
    pass

class RFQInvitationResponse(RFQInvitationBase):
    id: int

# ----------------- Quotations -----------------
class QuotationBase(ConfigBase):
    price: Decimal
    delivery_days: int
    notes: Optional[str] = None
    status: QuotationStatus = QuotationStatus.PENDING

class QuotationCreate(QuotationBase):
    rfq_id: int
    vendor_id: int

class QuotationResponse(QuotationBase):
    id: int
    rfq_id: int
    vendor_id: int
    created_at: datetime

# ----------------- Approvals -----------------
class ApprovalBase(ConfigBase):
    remarks: Optional[str] = None
    status: ApprovalStatus

class ApprovalCreate(ApprovalBase):
    quotation_id: int
    manager_id: int

class ApprovalResponse(ApprovalBase):
    id: int
    quotation_id: int
    manager_id: int
    created_at: datetime

# ----------------- Purchase Orders -----------------
class PurchaseOrderBase(ConfigBase):
    po_number: str
    amount: Decimal
    status: POStatus = POStatus.ISSUED

class PurchaseOrderCreate(PurchaseOrderBase):
    quotation_id: int
    generated_by: int

class PurchaseOrderResponse(PurchaseOrderBase):
    id: int
    quotation_id: int
    generated_by: int
    created_at: datetime

# ----------------- Invoices -----------------
class InvoiceBase(ConfigBase):
    invoice_number: str
    tax_amount: Decimal
    total_amount: Decimal
    status: InvoiceStatus = InvoiceStatus.PENDING

class InvoiceCreate(InvoiceBase):
    po_id: int

class InvoiceResponse(InvoiceBase):
    id: int
    po_id: int
    created_at: datetime
