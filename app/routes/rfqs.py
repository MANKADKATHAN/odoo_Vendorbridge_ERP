from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from schemas import RFQCreate, RFQResponse
from app.schemas.rfq import RFQUpdate
from app.services.rfq import RFQService
from app.core.dependencies import get_current_user
from app.core.database import get_db
from models import User

router = APIRouter(prefix="/rfqs", tags=["RFQs"])

@router.post(
    "", 
    response_model=RFQResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new RFQ",
    description="Publishes a new Request for Quotations (RFQ). Requires authentication."
)
def create_rfq(
    rfq_in: RFQCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return RFQService.create_rfq(db_session=db, rfq_in=rfq_in)

@router.get(
    "", 
    response_model=List[RFQResponse],
    summary="Retrieve all RFQs",
    description="Lists all Request for Quotations (RFQs) in the database. Requires authentication."
)
def get_rfqs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return RFQService.get_rfqs(db_session=db)

@router.get(
    "/{id}", 
    response_model=RFQResponse,
    summary="Retrieve an RFQ by ID",
    description="Gets detailed specifications of a specific RFQ using its integer ID. Requires authentication."
)
def get_rfq(
    id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return RFQService.get_rfq_by_id(db_session=db, rfq_id=id)

@router.put(
    "/{id}", 
    response_model=RFQResponse,
    summary="Update an RFQ",
    description="Updates details of an existing RFQ by integer ID. Requires authentication."
)
def update_rfq(
    id: int, 
    rfq_in: RFQUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return RFQService.update_rfq(db_session=db, rfq_id=id, rfq_in=rfq_in)

@router.delete(
    "/{id}", 
    response_model=RFQResponse,
    summary="Delete an RFQ",
    description="Removes an RFQ from the MySQL database. Requires authentication."
)
def delete_rfq(
    id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return RFQService.delete_rfq(db_session=db, rfq_id=id)
