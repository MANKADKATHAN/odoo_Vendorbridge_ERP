from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models import Vendor
from schemas import VendorCreate
from app.schemas.vendor import VendorUpdate

class VendorService:
    @staticmethod
    def create_vendor(db_session: Session, vendor_in: VendorCreate) -> Vendor:
        # Validate unique constraints (GST number and single vendor per user_id)
        existing_gst = db_session.query(Vendor).filter(
            Vendor.gst_number == vendor_in.gst_number
        ).first()
        if existing_gst:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="GST number already registered"
            )
            
        existing_user_vendor = db_session.query(Vendor).filter(
            Vendor.user_id == vendor_in.user_id
        ).first()
        if existing_user_vendor:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A vendor profile is already associated with this User ID"
            )
            
        db_vendor = Vendor(
            user_id=vendor_in.user_id,
            company_name=vendor_in.company_name,
            gst_number=vendor_in.gst_number,
            phone=vendor_in.phone,
            category=vendor_in.category,
            rating=vendor_in.rating,
            status=vendor_in.status
        )
        
        db_session.add(db_vendor)
        db_session.commit()
        db_session.refresh(db_vendor)
        return db_vendor

    @staticmethod
    def get_vendors(db_session: Session) -> List[Vendor]:
        return db_session.query(Vendor).all()

    @staticmethod
    def get_vendor_by_id(db_session: Session, vendor_id: int) -> Vendor:
        vendor = db_session.query(Vendor).filter(Vendor.id == vendor_id).first()
        if not vendor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Vendor with ID '{vendor_id}' not found"
            )
        return vendor

    @staticmethod
    def update_vendor(
        db_session: Session, 
        vendor_id: int, 
        vendor_in: VendorUpdate
    ) -> Vendor:
        vendor = VendorService.get_vendor_by_id(db_session, vendor_id)
        
        update_data = vendor_in.model_dump(exclude_unset=True)
        for key, val in update_data.items():
            setattr(vendor, key, val)
            
        db_session.commit()
        db_session.refresh(vendor)
        return vendor

    @staticmethod
    def delete_vendor(db_session: Session, vendor_id: int) -> Vendor:
        vendor = VendorService.get_vendor_by_id(db_session, vendor_id)
        db_session.delete(vendor)
        db_session.commit()
        return vendor
