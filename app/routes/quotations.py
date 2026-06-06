from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from schemas import QuotationCreate, QuotationResponse
from app.schemas.quotation import QuotationUpdate
from app.services.quotation import QuotationService
from app.core.dependencies import get_current_user
from app.core.database import get_db
from models import User

router = APIRouter(prefix="/quotations", tags=["Quotations"])

@router.post(
    "", 
    response_model=QuotationResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="Submit a new quotation",
    description="Submits a vendor quotation bid in response to an active RFQ. Requires authentication."
)
def create_quotation(
    quot_in: QuotationCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return QuotationService.create_quotation(db_session=db, quot_in=quot_in)

@router.get(
    "", 
    response_model=List[QuotationResponse],
    summary="Retrieve all quotations",
    description="Lists all submitted bids in the MySQL database. Requires authentication."
)
def get_quotations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return QuotationService.get_quotations(db_session=db)

@router.get(
    "/{id}", 
    response_model=QuotationResponse,
    summary="Retrieve a quotation by ID",
    description="Gets detailed information about a specific quotation by integer ID. Requires authentication."
)
def get_quotation(
    id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return QuotationService.get_quotation_by_id(db_session=db, quotation_id=id)

@router.put(
    "/{id}", 
    response_model=QuotationResponse,
    summary="Update a quotation",
    description="Updates bidding parameters or approves/rejects a quotation. Requires authentication."
)
def update_quotation(
    id: int, 
    quot_in: QuotationUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return QuotationService.update_quotation(db_session=db, quotation_id=id, quot_in=quot_in)

@router.delete(
    "/{id}", 
    response_model=QuotationResponse,
    summary="Delete a quotation",
    description="Removes a quotation record from the database. Requires authentication."
)
def delete_quotation(
    id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return QuotationService.delete_quotation(db_session=db, quotation_id=id)
