from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from schemas import VendorCreate, VendorResponse
from app.schemas.vendor import VendorUpdate
from app.services.vendor import VendorService
from app.core.dependencies import get_current_user
from app.core.database import get_db
from models import User

router = APIRouter(prefix="/vendors", tags=["Vendors"])

@router.post(
    "", 
    response_model=VendorResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new vendor profile",
    description="Registers a new vendor profile in the database. Requires authentication."
)
def create_vendor(
    vendor_in: VendorCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return VendorService.create_vendor(db_session=db, vendor_in=vendor_in)

@router.get(
    "", 
    response_model=List[VendorResponse],
    summary="Retrieve all vendor profiles",
    description="Lists all vendors stored in the MySQL database. Requires authentication."
)
def get_vendors(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return VendorService.get_vendors(db_session=db)

@router.get(
    "/{id}", 
    response_model=VendorResponse,
    summary="Retrieve a vendor profile by ID",
    description="Gets a specific vendor profile using its unique integer ID. Requires authentication."
)
def get_vendor(
    id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return VendorService.get_vendor_by_id(db_session=db, vendor_id=id)

@router.put(
    "/{id}", 
    response_model=VendorResponse,
    summary="Update a vendor profile",
    description="Updates information of an existing vendor. Overrides only specified attributes. Requires authentication."
)
def update_vendor(
    id: int, 
    vendor_in: VendorUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return VendorService.update_vendor(db_session=db, vendor_id=id, vendor_in=vendor_in)

@router.delete(
    "/{id}", 
    response_model=VendorResponse,
    summary="Delete a vendor profile",
    description="Removes a vendor record from the database. Requires authentication."
)
def delete_vendor(
    id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return VendorService.delete_vendor(db_session=db, vendor_id=id)
