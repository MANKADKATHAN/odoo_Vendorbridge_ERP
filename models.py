from enum import Enum as PyEnum
from datetime import datetime
from typing import List, Optional
from decimal import Decimal
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, Float, Numeric, Enum
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class UserRole(PyEnum):
    ADMIN = 'ADMIN'
    PROCUREMENT_OFFICER = 'PROCUREMENT_OFFICER'
    VENDOR = 'VENDOR'
    MANAGER = 'MANAGER'

class VendorStatus(PyEnum):
    PENDING = 'PENDING'
    APPROVED = 'APPROVED'
    REJECTED = 'REJECTED'

class RFQStatus(PyEnum):
    DRAFT = 'DRAFT'
    OPEN = 'OPEN'
    CLOSED = 'CLOSED'
    CANCELLED = 'CANCELLED'

class QuotationStatus(PyEnum):
    PENDING = 'PENDING'
    APPROVED = 'APPROVED'
    REJECTED = 'REJECTED'

class ApprovalStatus(PyEnum):
    APPROVED = 'APPROVED'
    REJECTED = 'REJECTED'

class POStatus(PyEnum):
    ISSUED = 'ISSUED'
    FULFILLED = 'FULFILLED'
    CANCELLED = 'CANCELLED'

class InvoiceStatus(PyEnum):
    PENDING = 'PENDING'
    PAID = 'PAID'

class User(Base):
    __tablename__ = 'users'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    vendor: Mapped[Optional["Vendor"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    rfqs: Mapped[List["RFQ"]] = relationship(back_populates="creator", cascade="all, delete-orphan")
    approvals: Mapped[List["Approval"]] = relationship(back_populates="manager", cascade="all, delete-orphan")

class Vendor(Base):
    __tablename__ = 'vendors'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete="CASCADE"), unique=True)
    company_name: Mapped[str] = mapped_column(String(255))
    gst_number: Mapped[str] = mapped_column(String(50), unique=True)
    phone: Mapped[str] = mapped_column(String(20))
    category: Mapped[str] = mapped_column(String(100))
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[VendorStatus] = mapped_column(Enum(VendorStatus), default=VendorStatus.PENDING)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="vendor")
    quotations: Mapped[List["Quotation"]] = relationship(back_populates="vendor", cascade="all, delete-orphan")
    rfq_invitations: Mapped[List["RFQInvitation"]] = relationship(back_populates="vendor", cascade="all, delete-orphan")

class RFQ(Base):
    __tablename__ = 'rfqs'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(Text)
    quantity: Mapped[int] = mapped_column(Integer)
    deadline: Mapped[datetime] = mapped_column(DateTime)
    created_by: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete="CASCADE"))
    status: Mapped[RFQStatus] = mapped_column(Enum(RFQStatus), default=RFQStatus.DRAFT)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    creator: Mapped["User"] = relationship(back_populates="rfqs")
    quotations: Mapped[List["Quotation"]] = relationship(back_populates="rfq", cascade="all, delete-orphan")
    invitations: Mapped[List["RFQInvitation"]] = relationship(back_populates="rfq", cascade="all, delete-orphan")

class RFQInvitation(Base):
    __tablename__ = 'rfq_invitations'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    rfq_id: Mapped[int] = mapped_column(ForeignKey('rfqs.id', ondelete="CASCADE"))
    vendor_id: Mapped[int] = mapped_column(ForeignKey('vendors.id', ondelete="CASCADE"))

    rfq: Mapped["RFQ"] = relationship(back_populates="invitations")
    vendor: Mapped["Vendor"] = relationship(back_populates="rfq_invitations")

class Quotation(Base):
    __tablename__ = 'quotations'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    rfq_id: Mapped[int] = mapped_column(ForeignKey('rfqs.id', ondelete="CASCADE"))
    vendor_id: Mapped[int] = mapped_column(ForeignKey('vendors.id', ondelete="CASCADE"))
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    delivery_days: Mapped[int] = mapped_column(Integer)
    notes: Mapped[Optional[str]] = mapped_column(Text)
    status: Mapped[QuotationStatus] = mapped_column(Enum(QuotationStatus), default=QuotationStatus.PENDING)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    rfq: Mapped["RFQ"] = relationship(back_populates="quotations")
    vendor: Mapped["Vendor"] = relationship(back_populates="quotations")
    approval: Mapped[Optional["Approval"]] = relationship(back_populates="quotation", cascade="all, delete-orphan")
    purchase_order: Mapped[Optional["PurchaseOrder"]] = relationship(back_populates="quotation", cascade="all, delete-orphan")

class Approval(Base):
    __tablename__ = 'approvals'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    quotation_id: Mapped[int] = mapped_column(ForeignKey('quotations.id', ondelete="CASCADE"))
    manager_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete="CASCADE"))
    remarks: Mapped[Optional[str]] = mapped_column(Text)
    status: Mapped[ApprovalStatus] = mapped_column(Enum(ApprovalStatus))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    quotation: Mapped["Quotation"] = relationship(back_populates="approval")
    manager: Mapped["User"] = relationship(back_populates="approvals")

class PurchaseOrder(Base):
    __tablename__ = 'purchase_orders'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    po_number: Mapped[str] = mapped_column(String(100), unique=True)
    quotation_id: Mapped[int] = mapped_column(ForeignKey('quotations.id', ondelete="CASCADE"), unique=True)
    generated_by: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete="CASCADE"))
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    status: Mapped[POStatus] = mapped_column(Enum(POStatus), default=POStatus.ISSUED)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    quotation: Mapped["Quotation"] = relationship(back_populates="purchase_order")
    invoice: Mapped[Optional["Invoice"]] = relationship(back_populates="purchase_order", cascade="all, delete-orphan")

class Invoice(Base):
    __tablename__ = 'invoices'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    invoice_number: Mapped[str] = mapped_column(String(100), unique=True)
    po_id: Mapped[int] = mapped_column(ForeignKey('purchase_orders.id', ondelete="CASCADE"), unique=True)
    tax_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    total_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    status: Mapped[InvoiceStatus] = mapped_column(Enum(InvoiceStatus), default=InvoiceStatus.PENDING)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    purchase_order: Mapped["PurchaseOrder"] = relationship(back_populates="invoice")
