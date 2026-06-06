from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models import PurchaseOrder, Quotation, QuotationStatus
from schemas import PurchaseOrderCreate
from app.schemas.purchase_order import PurchaseOrderUpdate

class PurchaseOrderService:
    @staticmethod
    def create_purchase_order(db_session: Session, po_in: PurchaseOrderCreate) -> PurchaseOrder:
        # Check referential integrity
        quotation = db_session.query(Quotation).filter(
            Quotation.id == po_in.quotation_id
        ).first()
        if not quotation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Referenced Quotation with ID '{po_in.quotation_id}' not found."
            )
            
        # Verify quotation has been approved
        if quotation.status != QuotationStatus.APPROVED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A Purchase Order can only be generated from an APPROVED Quotation."
            )

        # Check unique constraint (1 PO per Quotation)
        existing_po = db_session.query(PurchaseOrder).filter(
            PurchaseOrder.quotation_id == po_in.quotation_id
        ).first()
        if existing_po:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"A Purchase Order has already been generated for Quotation ID '{po_in.quotation_id}'."
            )

        db_po = PurchaseOrder(
            po_number=po_in.po_number,
            quotation_id=po_in.quotation_id,
            generated_by=po_in.generated_by,
            amount=po_in.amount,
            status=po_in.status
        )
        db_session.add(db_po)
        db_session.commit()
        db_session.refresh(db_po)
        return db_po

    @staticmethod
    def get_purchase_orders(db_session: Session) -> List[PurchaseOrder]:
        return db_session.query(PurchaseOrder).all()

    @staticmethod
    def get_purchase_order_by_id(db_session: Session, po_id: int) -> PurchaseOrder:
        po = db_session.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
        if not po:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Purchase Order with ID '{po_id}' not found."
            )
        return po

    @staticmethod
    def update_purchase_order(
        db_session: Session, 
        po_id: int, 
        po_in: PurchaseOrderUpdate
    ) -> PurchaseOrder:
        po = PurchaseOrderService.get_purchase_order_by_id(db_session, po_id)
        
        update_data = po_in.model_dump(exclude_unset=True)
        for key, val in update_data.items():
            setattr(po, key, val)
            
        db_session.commit()
        db_session.refresh(po)
        return po

    @staticmethod
    def delete_purchase_order(db_session: Session, po_id: int) -> PurchaseOrder:
        po = PurchaseOrderService.get_purchase_order_by_id(db_session, po_id)
        db_session.delete(po)
        db_session.commit()
        return po
