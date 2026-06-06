from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from schemas import ApprovalCreate, ApprovalResponse
from app.schemas.approval import ApprovalUpdate
from app.services.approvals import ApprovalService
from app.core.dependencies import get_current_user
from app.core.database import get_db
from models import User

router = APIRouter(prefix="/approvals", tags=["Approvals"])

@router.post(
    "", 
    response_model=ApprovalResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new approval request",
    description="Submits a quotation approval request. Requires authentication."
)
def create_approval(
    approval_in: ApprovalCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ApprovalService.create_approval(db_session=db, approval_in=approval_in)

@router.get(
    "", 
    response_model=List[ApprovalResponse],
    summary="Retrieve all approval requests",
    description="Lists all submitted approvals in the database. Requires authentication."
)
def get_approvals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ApprovalService.get_approvals(db_session=db)

@router.get(
    "/{id}", 
    response_model=ApprovalResponse,
    summary="Retrieve an approval request by ID",
    description="Gets detailed specifications of a specific approval request. Requires authentication."
)
def get_approval(
    id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ApprovalService.get_approval_by_id(db_session=db, approval_id=id)

@router.put(
    "/{id}", 
    response_model=ApprovalResponse,
    summary="Approve or reject a request",
    description="Updates approval status and leaves remarks. Automatically synchronizes quotation statuses. Requires authentication."
)
def update_approval(
    id: int, 
    approval_in: ApprovalUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ApprovalService.update_approval(db_session=db, approval_id=id, approval_in=approval_in)

@router.delete(
    "/{id}", 
    response_model=ApprovalResponse,
    summary="Delete an approval request",
    description="Removes an approval request from the database. Requires authentication."
)
def delete_approval(
    id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ApprovalService.delete_approval(db_session=db, approval_id=id)
