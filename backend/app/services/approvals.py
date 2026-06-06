from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models import Approval, Quotation, QuotationStatus, ApprovalStatus
from schemas import ApprovalCreate
from app.schemas.approval import ApprovalUpdate

class ApprovalService:
    @staticmethod
    def create_approval(db_session: Session, approval_in: ApprovalCreate) -> Approval:
        # Check referential integrity
        quotation = db_session.query(Quotation).filter(
            Quotation.id == approval_in.quotation_id
        ).first()
        if not quotation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Quotation with ID '{approval_in.quotation_id}' not found."
            )

        db_approval = Approval(
            quotation_id=approval_in.quotation_id,
            manager_id=approval_in.manager_id,
            remarks=approval_in.remarks,
            status=approval_in.status
        )
        db_session.add(db_approval)
        
        # Synchronize Quotation status based on initial approval status
        if approval_in.status == ApprovalStatus.APPROVED:
            quotation.status = QuotationStatus.APPROVED
        elif approval_in.status == ApprovalStatus.REJECTED:
            quotation.status = QuotationStatus.REJECTED

        db_session.commit()
        db_session.refresh(db_approval)
        return db_approval

    @staticmethod
    def get_approvals(db_session: Session) -> List[Approval]:
        return db_session.query(Approval).all()

    @staticmethod
    def get_approval_by_id(db_session: Session, approval_id: int) -> Approval:
        approval = db_session.query(Approval).filter(Approval.id == approval_id).first()
        if not approval:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Approval request with ID '{approval_id}' not found."
            )
        return approval

    @staticmethod
    def update_approval(
        db_session: Session, 
        approval_id: int, 
        approval_in: ApprovalUpdate
    ) -> Approval:
        approval = ApprovalService.get_approval_by_id(db_session, approval_id)
        approval.status = approval_in.status
        if approval_in.remarks is not None:
            approval.remarks = approval_in.remarks
            
        # Synchronize Quotation status
        quotation = db_session.query(Quotation).filter(
            Quotation.id == approval.quotation_id
        ).first()
        if quotation:
            if approval_in.status == ApprovalStatus.APPROVED:
                quotation.status = QuotationStatus.APPROVED
            elif approval_in.status == ApprovalStatus.REJECTED:
                quotation.status = QuotationStatus.REJECTED
                
        db_session.commit()
        db_session.refresh(approval)
        return approval

    @staticmethod
    def delete_approval(db_session: Session, approval_id: int) -> Approval:
        approval = ApprovalService.get_approval_by_id(db_session, approval_id)
        db_session.delete(approval)
        db_session.commit()
        return approval
