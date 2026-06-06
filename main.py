from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import os
from typing import List

from database import get_db, engine
import models
import schemas

# Ensure tables are created
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="VendorBridge ERP API")

security_scheme = HTTPBearer()

TOKEN_DEFAULT = "5b3f7a1e0bca4876b6de52382c75a89274534ef0da05cf14e7a89270df8276f3"
AUTH_TOKEN = os.getenv("AUTH_TOKEN", TOKEN_DEFAULT)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)):
    if credentials.credentials != AUTH_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing authentication token"
        )
    return credentials.credentials

# Vendors endpoints
@app.get("/vendors", response_model=List[schemas.VendorResponse])
def get_vendors(
    db: Session = Depends(get_db),
    token: str = Depends(verify_token)
):
    vendors = db.query(models.Vendor).all()
    return vendors

@app.post("/vendors", response_model=schemas.VendorResponse, status_code=status.HTTP_201_CREATED)
def create_vendor(
    vendor_in: schemas.VendorCreate,
    db: Session = Depends(get_db),
    token: str = Depends(verify_token)
):
    user = db.query(models.User).filter(models.User.id == vendor_in.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    existing_vendor = db.query(models.Vendor).filter(models.Vendor.user_id == vendor_in.user_id).first()
    if existing_vendor:
        raise HTTPException(status_code=400, detail="Vendor profile already exists for this user")
        
    db_vendor = models.Vendor(**vendor_in.model_dump())
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

# RFQs endpoints
@app.get("/rfqs", response_model=List[schemas.RFQResponse])
def get_rfqs(
    db: Session = Depends(get_db),
    token: str = Depends(verify_token)
):
    rfqs = db.query(models.RFQ).all()
    return rfqs

@app.post("/rfqs", response_model=schemas.RFQResponse, status_code=status.HTTP_201_CREATED)
def create_rfq(
    rfq_in: schemas.RFQCreate,
    db: Session = Depends(get_db),
    token: str = Depends(verify_token)
):
    user = db.query(models.User).filter(models.User.id == rfq_in.created_by).first()
    if not user:
        raise HTTPException(status_code=404, detail="Creator user not found")
        
    db_rfq = models.RFQ(**rfq_in.model_dump())
    db.add(db_rfq)
    db.commit()
    db.refresh(db_rfq)
    return db_rfq
