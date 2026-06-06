import os
import sys
from datetime import datetime, timedelta
from decimal import Decimal
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Import models
from models import (
    Base, User, Vendor, RFQ, RFQInvitation, Quotation, Approval, PurchaseOrder, Invoice,
    UserRole, VendorStatus, RFQStatus, QuotationStatus, ApprovalStatus, POStatus, InvoiceStatus
)

# Raw data provided by the user
RAW_DATA = [
    {"po_id": "PO-00001", "supplier": "Alpha_Inc", "order_date": "17/10/2023", "delivery_date": "25/10/2023", "category": "Office Supplies", "status": "Cancelled", "qty": 1176, "unit_price": 20.13, "neg_price": 17.81, "defective": None, "compliance": "Yes"},
    {"po_id": "PO-00002", "supplier": "Delta_Logistics", "order_date": "25/04/2022", "delivery_date": "05/05/2022", "category": "Office Supplies", "status": "Delivered", "qty": 1509, "unit_price": 39.32, "neg_price": 37.34, "defective": 235, "compliance": "Yes"},
    {"po_id": "PO-00003", "supplier": "Gamma_Co", "order_date": "26/01/2022", "delivery_date": "15/02/2022", "category": "MRO", "status": "Delivered", "qty": 910, "unit_price": 95.51, "neg_price": 92.26, "defective": 41, "compliance": "Yes"},
    {"po_id": "PO-00004", "supplier": "Beta_Supplies", "order_date": "09/10/2022", "delivery_date": "28/10/2022", "category": "Packaging", "status": "Delivered", "qty": 1344, "unit_price": 99.85, "neg_price": 95.52, "defective": 112, "compliance": "Yes"},
    {"po_id": "PO-00005", "supplier": "Delta_Logistics", "order_date": "08/09/2022", "delivery_date": "20/09/2022", "category": "Raw Materials", "status": "Delivered", "qty": 1180, "unit_price": 64.07, "neg_price": 60.53, "defective": 171, "compliance": "No"},
    {"po_id": "PO-00006", "supplier": "Epsilon_Group", "order_date": "17/08/2022", "delivery_date": "29/08/2022", "category": "MRO", "status": "Delivered", "qty": 1145, "unit_price": 69.21, "neg_price": 63.57, "defective": 39, "compliance": "Yes"},
    {"po_id": "PO-00007", "supplier": "Gamma_Co", "order_date": "23/05/2022", "delivery_date": "03/06/2022", "category": "MRO", "status": "Delivered", "qty": 1774, "unit_price": 51.37, "neg_price": 47.82, "defective": 96, "compliance": "No"},
    {"po_id": "PO-00008", "supplier": "Alpha_Inc", "order_date": "15/04/2022", "delivery_date": "29/04/2022", "category": "MRO", "status": "Delivered", "qty": 1094, "unit_price": 36.93, "neg_price": 32.78, "defective": 22, "compliance": "Yes"},
    {"po_id": "PO-00009", "supplier": "Gamma_Co", "order_date": "24/11/2023", "delivery_date": "28/11/2023", "category": "Raw Materials", "status": "Partially Delivered", "qty": 1688, "unit_price": 43.93, "neg_price": 39.89, "defective": 89, "compliance": "Yes"},
    {"po_id": "PO-00010", "supplier": "Gamma_Co", "order_date": "13/07/2023", "delivery_date": "25/07/2023", "category": "Raw Materials", "status": "Pending", "qty": 171, "unit_price": 76.87, "neg_price": 70.2, "defective": 8, "compliance": "Yes"},
    {"po_id": "PO-00011", "supplier": "Epsilon_Group", "order_date": "31/03/2022", "delivery_date": "15/04/2022", "category": "Raw Materials", "status": "Delivered", "qty": 5000, "unit_price": 78.49, "neg_price": 73.68, "defective": 18, "compliance": "Yes"},
    {"po_id": "PO-00012", "supplier": "Beta_Supplies", "order_date": "28/08/2023", "delivery_date": "11/09/2023", "category": "Raw Materials", "status": "Delivered", "qty": 5000, "unit_price": 88.96, "neg_price": 86.58, "defective": 115, "compliance": "Yes"},
    {"po_id": "PO-00013", "supplier": "Beta_Supplies", "order_date": "09/03/2023", "delivery_date": "26/03/2023", "category": "Electronics", "status": "Pending", "qty": 5000, "unit_price": 86.74, "neg_price": 74.86, "defective": 51, "compliance": "Yes"},
    {"po_id": "PO-00014", "supplier": "Beta_Supplies", "order_date": "02/02/2022", "delivery_date": None, "category": "MRO", "status": "Delivered", "qty": 5000, "unit_price": 18.3, "neg_price": 16.88, "defective": None, "compliance": "Yes"},
    {"po_id": "PO-00015", "supplier": "Delta_Logistics", "order_date": "31/01/2022", "delivery_date": "18/02/2022", "category": "Electronics", "status": "Pending", "qty": 5000, "unit_price": 54.5, "neg_price": 48.45, "defective": 22, "compliance": "Yes"},
    {"po_id": "PO-00016", "supplier": "Beta_Supplies", "order_date": "06/04/2022", "delivery_date": "21/04/2022", "category": "Packaging", "status": "Delivered", "qty": 5000, "unit_price": 15.41, "neg_price": 15.12, "defective": None, "compliance": "Yes"},
    {"po_id": "PO-00017", "supplier": "Delta_Logistics", "order_date": "12/08/2022", "delivery_date": "31/08/2022", "category": "MRO", "status": "Delivered", "qty": 1173, "unit_price": 61.54, "neg_price": 55.49, "defective": 172, "compliance": "No"},
    {"po_id": "PO-00018", "supplier": "Epsilon_Group", "order_date": "27/08/2022", "delivery_date": "04/09/2022", "category": "Raw Materials", "status": "Delivered", "qty": 921, "unit_price": 51.48, "neg_price": 50.61, "defective": None, "compliance": "Yes"},
    {"po_id": "PO-00019", "supplier": "Gamma_Co", "order_date": "02/06/2023", "delivery_date": "05/06/2023", "category": "Raw Materials", "status": "Partially Delivered", "qty": 1737, "unit_price": 97.53, "neg_price": 87.37, "defective": 79, "compliance": "Yes"},
    {"po_id": "PO-00020", "supplier": "Delta_Logistics", "order_date": "09/09/2023", "delivery_date": "24/09/2023", "category": "Raw Materials", "status": "Delivered", "qty": 180, "unit_price": 45.74, "neg_price": 38.89, "defective": None, "compliance": "No"},
    {"po_id": "PO-00021", "supplier": "Epsilon_Group", "order_date": "28/01/2022", "delivery_date": "12/02/2022", "category": "Electronics", "status": "Cancelled", "qty": 1735, "unit_price": 20.54, "neg_price": 19.69, "defective": 49, "compliance": "Yes"},
    {"po_id": "PO-00022", "supplier": "Delta_Logistics", "order_date": "29/07/2023", "delivery_date": "11/08/2023", "category": "Raw Materials", "status": "Delivered", "qty": 1382, "unit_price": 24.93, "neg_price": 23.75, "defective": None, "compliance": "Yes"},
    {"po_id": "PO-00023", "supplier": "Epsilon_Group", "order_date": "23/07/2022", "delivery_date": "08/08/2022", "category": "MRO", "status": "Delivered", "qty": 819, "unit_price": 80.89, "neg_price": 77.03, "defective": 29, "compliance": "Yes"},
    {"po_id": "PO-00024", "supplier": "Beta_Supplies", "order_date": "28/10/2023", "delivery_date": "03/11/2023", "category": "Office Supplies", "status": "Partially Delivered", "qty": 393, "unit_price": 72.53, "neg_price": 66.31, "defective": 42, "compliance": "No"},
    {"po_id": "PO-00025", "supplier": "Beta_Supplies", "order_date": "20/12/2023", "delivery_date": "01/01/2024", "category": "MRO", "status": "Delivered", "qty": 1565, "unit_price": 21.3, "neg_price": 20.09, "defective": 161, "compliance": "Yes"},
    {"po_id": "PO-00026", "supplier": "Epsilon_Group", "order_date": "13/07/2023", "delivery_date": "24/07/2023", "category": "Packaging", "status": "Delivered", "qty": 1487, "unit_price": 19.15, "neg_price": 17.24, "defective": None, "compliance": "Yes"},
    {"po_id": "PO-00027", "supplier": "Alpha_Inc", "order_date": "06/03/2023", "delivery_date": "26/03/2023", "category": "MRO", "status": "Delivered", "qty": 855, "unit_price": 78.2, "neg_price": 67.16, "defective": 17, "compliance": "Yes"},
    {"po_id": "PO-00028", "supplier": "Epsilon_Group", "order_date": "14/08/2022", "delivery_date": "23/08/2022", "category": "Raw Materials", "status": "Delivered", "qty": 435, "unit_price": 17.13, "neg_price": 15.84, "defective": 8, "compliance": "Yes"},
    {"po_id": "PO-00029", "supplier": "Delta_Logistics", "order_date": "05/04/2023", "delivery_date": "22/04/2023", "category": "MRO", "status": "Delivered", "qty": 1265, "unit_price": 90.26, "neg_price": 79.47, "defective": 187, "compliance": "Yes"}
]

# Database connection setup
# Use environment variable DATABASE_URL if provided, else default to sqlite local db
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///vendorbridge.db")

print(f"Connecting to database: {DATABASE_URL}")
# For sqlite, we need check_same_thread=False
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def parse_date(date_str):
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%d/%m/%Y")
    except ValueError:
        return None

def seed_database():
    # Re-create tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # 1. Create a default Procurement Officer & Manager with dummy data
        procurement_user = User(
            name="Procurement Officer",
            email="procurement@vendorbridge.com",
            password_hash="pbkdf2:sha256:default_hashed_password_procurement",
            role=UserRole.PROCUREMENT_OFFICER,
            created_at=datetime.utcnow() - timedelta(days=365)
        )
        manager_user = User(
            name="Procurement Manager",
            email="manager@vendorbridge.com",
            password_hash="pbkdf2:sha256:default_hashed_password_manager",
            role=UserRole.MANAGER,
            created_at=datetime.utcnow() - timedelta(days=365)
        )
        db.add_all([procurement_user, manager_user])
        db.commit()
        db.refresh(procurement_user)
        db.refresh(manager_user)
        
        # Keep track of created vendors to reuse
        vendors_cache = {}
        
        # 2. Iterate through raw data
        for row in RAW_DATA:
            supplier_name = row["supplier"]
            
            # Check if vendor exists, if not create vendor user & profile
            if supplier_name not in vendors_cache:
                vendor_user = User(
                    name=supplier_name.replace("_", " "),
                    email=f"{supplier_name.lower()}@vendorbridge.com",
                    password_hash=f"pbkdf2:sha256:default_hashed_password_{supplier_name.lower()}",
                    role=UserRole.VENDOR,
                    created_at=datetime.utcnow() - timedelta(days=365)
                )
                db.add(vendor_user)
                db.commit()
                db.refresh(vendor_user)
                
                # Generate unique GST number and dummy attributes
                gst_number = f"27{supplier_name.upper()[:10]:_<10}1Z5"
                vendor = Vendor(
                    user_id=vendor_user.id,
                    company_name=supplier_name.replace("_", " "),
                    gst_number=gst_number,
                    phone="+1-555-01" + str(100 + len(vendors_cache)),
                    category=row["category"],
                    rating=4.5,
                    status=VendorStatus.APPROVED,
                    created_at=datetime.utcnow() - timedelta(days=360)
                )
                db.add(vendor)
                db.commit()
                db.refresh(vendor)
                vendors_cache[supplier_name] = vendor
            
            vendor = vendors_cache[supplier_name]
            
            # Parse Dates
            order_date = parse_date(row["order_date"])
            delivery_date = parse_date(row["delivery_date"])
            if not delivery_date:
                delivery_date = order_date + timedelta(days=14) if order_date else datetime.utcnow()
            
            # If order_date parse failed, fallback
            if not order_date:
                order_date = datetime.utcnow() - timedelta(days=30)
            
            # 3. Create RFQ
            rfq_status = RFQStatus.CLOSED
            if row["status"] == "Pending":
                rfq_status = RFQStatus.OPEN
            
            rfq = RFQ(
                title=f"RFQ for {row['category']}",
                description=f"Request for {row['qty']} units of {row['category']} at negotiable price.",
                quantity=row["qty"],
                deadline=delivery_date,
                created_by=procurement_user.id,
                status=rfq_status,
                created_at=order_date - timedelta(days=7) # RFQ created 7 days before order
            )
            db.add(rfq)
            db.commit()
            db.refresh(rfq)
            
            # 4. Create RFQ Invitation
            invitation = RFQInvitation(
                rfq_id=rfq.id,
                vendor_id=vendor.id
            )
            db.add(invitation)
            
            # 5. Create Quotation
            price = Decimal(str(row["neg_price"])) * row["qty"]
            delivery_days = (delivery_date - order_date).days
            if delivery_days <= 0:
                delivery_days = 10
                
            quotation_status = QuotationStatus.APPROVED
            if row["status"] == "Cancelled":
                quotation_status = QuotationStatus.REJECTED
                
            quotation = Quotation(
                rfq_id=rfq.id,
                vendor_id=vendor.id,
                price=price,
                delivery_days=delivery_days,
                notes=f"Quotation with negotiated price of {row['neg_price']} per unit.",
                status=quotation_status,
                created_at=order_date - timedelta(days=5) # Quotation submitted 5 days before order
            )
            db.add(quotation)
            db.commit()
            db.refresh(quotation)
            
            # 6. Create Approval
            approval_status = ApprovalStatus.APPROVED
            if row["status"] == "Cancelled":
                approval_status = ApprovalStatus.REJECTED
                
            approval = Approval(
                quotation_id=quotation.id,
                manager_id=manager_user.id,
                remarks=f"Approval status determined by system record. Condition compliance: {row['compliance']}.",
                status=approval_status,
                created_at=order_date - timedelta(days=2) # Approved 2 days before order
            )
            db.add(approval)
            
            # 7. Create Purchase Order (only if approved / cancelled / delivered / pending)
            po_status = POStatus.ISSUED
            if row["status"] == "Cancelled":
                po_status = POStatus.CANCELLED
            elif row["status"] in ["Delivered", "Partially Delivered"]:
                po_status = POStatus.FULFILLED
            
            po = PurchaseOrder(
                po_number=row["po_id"],
                quotation_id=quotation.id,
                generated_by=procurement_user.id,
                amount=price,
                status=po_status,
                created_at=order_date
            )
            db.add(po)
            db.commit()
            db.refresh(po)
            
            # 8. Create Invoice
            invoice_status = InvoiceStatus.PENDING
            if row["status"] in ["Delivered", "Partially Delivered"]:
                invoice_status = InvoiceStatus.PAID
                
            tax_amount = price * Decimal("0.18") # 18% Tax
            total_amount = price + tax_amount
            
            invoice = Invoice(
                invoice_number=f"INV-{row['po_id']}",
                po_id=po.id,
                tax_amount=tax_amount,
                total_amount=total_amount,
                status=invoice_status,
                created_at=delivery_date
            )
            db.add(invoice)
            db.commit()
            
        print("Database successfully seeded with 29 Purchase Orders!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
