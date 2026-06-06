from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models import Invoice, PurchaseOrder
from schemas import InvoiceCreate
from app.schemas.invoice import InvoiceUpdate

class InvoiceService:
    @staticmethod
    def create_invoice(db_session: Session, invoice_in: InvoiceCreate) -> Invoice:
        # Check referential integrity
        po = db_session.query(PurchaseOrder).filter(PurchaseOrder.id == invoice_in.po_id).first()
        if not po:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Referenced Purchase Order with ID '{invoice_in.po_id}' not found."
            )
            
        # Check unique constraint (1 Invoice per PO)
        existing_invoice = db_session.query(Invoice).filter(
            Invoice.po_id == invoice_in.po_id
        ).first()
        if existing_invoice:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"An Invoice has already been generated for Purchase Order ID '{invoice_in.po_id}'."
            )

        db_invoice = Invoice(
            invoice_number=invoice_in.invoice_number,
            po_id=invoice_in.po_id,
            tax_amount=invoice_in.tax_amount,
            total_amount=invoice_in.total_amount,
            status=invoice_in.status
        )
        db_session.add(db_invoice)
        db_session.commit()
        db_session.refresh(db_invoice)
        return db_invoice

    @staticmethod
    def get_invoices(db_session: Session) -> List[Invoice]:
        return db_session.query(Invoice).all()

    @staticmethod
    def get_invoice_by_id(db_session: Session, invoice_id: int) -> Invoice:
        invoice = db_session.query(Invoice).filter(Invoice.id == invoice_id).first()
        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Invoice with ID '{invoice_id}' not found."
            )
        return invoice

    @staticmethod
    def update_invoice(
        db_session: Session, 
        invoice_id: int, 
        invoice_in: InvoiceUpdate
    ) -> Invoice:
        invoice = InvoiceService.get_invoice_by_id(db_session, invoice_id)
        
        update_data = invoice_in.model_dump(exclude_unset=True)
        for key, val in update_data.items():
            setattr(invoice, key, val)
            
        db_session.commit()
        db_session.refresh(invoice)
        return invoice

    @staticmethod
    def delete_invoice(db_session: Session, invoice_id: int) -> Invoice:
        invoice = InvoiceService.get_invoice_by_id(db_session, invoice_id)
        db_session.delete(invoice)
        db_session.commit()
        return invoice
