from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models import Quotation, Vendor, RFQ
from schemas import QuotationCreate
from app.schemas.quotation import QuotationUpdate

class QuotationService:
    @staticmethod
    def create_quotation(db_session: Session, quot_in: QuotationCreate) -> Quotation:
        # Check referential integrity inside database
        vendor_exists = db_session.query(Vendor).filter(Vendor.id == quot_in.vendor_id).first()
        if not vendor_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Referenced Vendor with ID '{quot_in.vendor_id}' does not exist."
            )
        rfq_exists = db_session.query(RFQ).filter(RFQ.id == quot_in.rfq_id).first()
        if not rfq_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Referenced RFQ with ID '{quot_in.rfq_id}' does not exist."
            )

        db_quotation = Quotation(
            rfq_id=quot_in.rfq_id,
            vendor_id=quot_in.vendor_id,
            price=quot_in.price,
            delivery_days=quot_in.delivery_days,
            notes=quot_in.notes,
            status=quot_in.status
        )
        db_session.add(db_quotation)
        db_session.commit()
        db_session.refresh(db_quotation)
        return db_quotation

    @staticmethod
    def get_quotations(db_session: Session) -> List[Quotation]:
        return db_session.query(Quotation).all()

    @staticmethod
    def get_quotation_by_id(db_session: Session, quotation_id: int) -> Quotation:
        quotation = db_session.query(Quotation).filter(Quotation.id == quotation_id).first()
        if not quotation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Quotation with ID '{quotation_id}' not found"
            )
        return quotation

    @staticmethod
    def update_quotation(
        db_session: Session, 
        quotation_id: int, 
        quot_in: QuotationUpdate
    ) -> Quotation:
        quotation = QuotationService.get_quotation_by_id(db_session, quotation_id)
        
        update_data = quot_in.model_dump(exclude_unset=True)
        for key, val in update_data.items():
            setattr(quotation, key, val)
            
        db_session.commit()
        db_session.refresh(quotation)
        return quotation

    @staticmethod
    def delete_quotation(db_session: Session, quotation_id: int) -> Quotation:
        quotation = QuotationService.get_quotation_by_id(db_session, quotation_id)
        db_session.delete(quotation)
        db_session.commit()
        return quotation
