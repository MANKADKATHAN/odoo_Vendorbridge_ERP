from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from schemas import PurchaseOrderCreate, PurchaseOrderResponse
from app.schemas.purchase_order import PurchaseOrderUpdate
from app.services.purchase_orders import PurchaseOrderService
from app.core.dependencies import get_current_user
from app.core.database import get_db
from models import User

router = APIRouter(prefix="/purchase-orders", tags=["Purchase Orders"])

@router.post(
    "", 
    response_model=PurchaseOrderResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new Purchase Order",
    description="Generates a Purchase Order (PO) from an approved quotation. Requires authentication."
)
def create_purchase_order(
    po_in: PurchaseOrderCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return PurchaseOrderService.create_purchase_order(db_session=db, po_in=po_in)

@router.get(
    "", 
    response_model=List[PurchaseOrderResponse],
    summary="Retrieve all Purchase Orders",
    description="Lists all purchase orders in the system. Requires authentication."
)
def get_purchase_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return PurchaseOrderService.get_purchase_orders(db_session=db)

@router.get(
    "/{id}", 
    response_model=PurchaseOrderResponse,
    summary="Retrieve a Purchase Order by ID",
    description="Gets detailed information about a specific Purchase Order by integer ID. Requires authentication."
)
def get_purchase_order(
    id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return PurchaseOrderService.get_purchase_order_by_id(db_session=db, po_id=id)

@router.put(
    "/{id}", 
    response_model=PurchaseOrderResponse,
    summary="Update a Purchase Order",
    description="Updates PO status (e.g. fulfilled/cancelled) or amount by ID. Requires authentication."
)
def update_purchase_order(
    id: int, 
    po_in: PurchaseOrderUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return PurchaseOrderService.update_purchase_order(db_session=db, po_id=id, po_in=po_in)

@router.delete(
    "/{id}", 
    response_model=PurchaseOrderResponse,
    summary="Delete a Purchase Order",
    description="Removes a Purchase Order from the database. Requires authentication."
)
def delete_purchase_order(
    id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return PurchaseOrderService.delete_purchase_order(db_session=db, po_id=id)
