from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models import RFQ
from schemas import RFQCreate
from app.schemas.rfq import RFQUpdate

class RFQService:
    @staticmethod
    def create_rfq(db_session: Session, rfq_in: RFQCreate) -> RFQ:
        db_rfq = RFQ(
            title=rfq_in.title,
            description=rfq_in.description,
            quantity=rfq_in.quantity,
            deadline=rfq_in.deadline,
            created_by=rfq_in.created_by,
            status=rfq_in.status
        )
        db_session.add(db_rfq)
        db_session.commit()
        db_session.refresh(db_rfq)
        return db_rfq

    @staticmethod
    def get_rfqs(db_session: Session) -> List[RFQ]:
        return db_session.query(RFQ).all()

    @staticmethod
    def get_rfq_by_id(db_session: Session, rfq_id: int) -> RFQ:
        rfq = db_session.query(RFQ).filter(RFQ.id == rfq_id).first()
        if not rfq:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"RFQ with ID '{rfq_id}' not found"
            )
        return rfq

    @staticmethod
    def update_rfq(
        db_session: Session, 
        rfq_id: int, 
        rfq_in: RFQUpdate
    ) -> RFQ:
        rfq = RFQService.get_rfq_by_id(db_session, rfq_id)
        
        update_data = rfq_in.model_dump(exclude_unset=True)
        for key, val in update_data.items():
            setattr(rfq, key, val)
            
        db_session.commit()
        db_session.refresh(rfq)
        return rfq

    @staticmethod
    def delete_rfq(db_session: Session, rfq_id: int) -> RFQ:
        rfq = RFQService.get_rfq_by_id(db_session, rfq_id)
        db_session.delete(rfq)
        db_session.commit()
        return rfq
