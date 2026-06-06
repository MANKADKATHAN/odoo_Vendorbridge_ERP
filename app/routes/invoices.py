from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from schemas import InvoiceCreate, InvoiceResponse
from app.schemas.invoice import InvoiceUpdate
from app.services.invoices import InvoiceService
from app.core.dependencies import get_current_user
from app.core.database import get_db
from models import User

router = APIRouter(prefix="/invoices", tags=["Invoices"])

@router.post(
    "", 
    response_model=InvoiceResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new Invoice",
    description="Generates an Invoice from an active Purchase Order (PO). Requires authentication."
)
def create_invoice(
    invoice_in: InvoiceCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return InvoiceService.create_invoice(db_session=db, invoice_in=invoice_in)

@router.get(
    "", 
    response_model=List[InvoiceResponse],
    summary="Retrieve all Invoices",
    description="Lists all invoices in the system. Requires authentication."
)
def get_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return InvoiceService.get_invoices(db_session=db)

@router.get(
    "/{id}", 
    response_model=InvoiceResponse,
    summary="Retrieve an Invoice by ID",
    description="Gets detailed specifications of a specific Invoice by integer ID. Requires authentication."
)
def get_invoice(
    id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return InvoiceService.get_invoice_by_id(db_session=db, invoice_id=id)

@router.put(
    "/{id}", 
    response_model=InvoiceResponse,
    summary="Update an Invoice status",
    description="Updates invoice billing or payment status (e.g. from PENDING to PAID) by ID. Requires authentication."
)
def update_invoice(
    id: int, 
    invoice_in: InvoiceUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return InvoiceService.update_invoice(db_session=db, invoice_id=id, invoice_in=invoice_in)

@router.delete(
    "/{id}", 
    response_model=InvoiceResponse,
    summary="Delete an Invoice",
    description="Removes an Invoice from the database. Requires authentication."
)
def delete_invoice(
    id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return InvoiceService.delete_invoice(db_session=db, invoice_id=id)
