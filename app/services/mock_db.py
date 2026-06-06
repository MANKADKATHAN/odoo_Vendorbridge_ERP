import threading
from typing import Dict, Any
from datetime import datetime, timezone
from app.core.security import get_password_hash

class MockDatabase:
    """
    A thread-safe, in-memory datastore acting as a mock database.
    This simulates database tables/collections during the hackathon.
    
    HOW TO REPLACE THIS WITH A REAL DATABASE LATER:
    1. Import your ORM Model classes (e.g., SQLAlchemy or SQLModel).
    2. Instead of calling this singleton `db` in your services:
       - Inject the database session dependency (e.g., `Session = Depends(get_db)`).
       - Query the database using standard ORM query operations (e.g., `db_session.query(Vendor).all()`).
       - Commit changes using `db_session.commit()`.
    """
    def __init__(self):
        self._lock = threading.Lock()
        
        # In-memory collections (simulating DB tables)
        self.users: Dict[str, Dict[str, Any]] = {}
        self.vendors: Dict[str, Dict[str, Any]] = {}
        self.rfqs: Dict[str, Dict[str, Any]] = {}
        self.quotations: Dict[str, Dict[str, Any]] = {}
        
        # Primary key auto-increment values
        self._user_counter = 1
        self._vendor_counter = 1
        self._rfq_counter = 1
        self._quotation_counter = 1
        
        # Seed the mock database with initial mock records
        self._seed_data()
        
    def _seed_data(self):
        # 1. Seed an Admin User
        # Default credentials for testing: admin@vendorbridge.com / password123
        admin_pass = get_password_hash("password123")
        self.users["1"] = {
            "id": "1",
            "username": "admin",
            "email": "admin@vendorbridge.com",
            "hashed_password": admin_pass,
            "full_name": "System Administrator",
            "role": "admin",
            "created_at": datetime.now(timezone.utc)
        }
        self._user_counter = 2
        
        # 2. Seed Vendor profiles
        self.vendors["1"] = {
            "id": "1",
            "name": "Global Tech Logistics",
            "contact_name": "John Doe",
            "email": "john.doe@globaltech.com",
            "phone": "+1-555-0199",
            "address": "123 Logistics Way, Silicon Valley, CA",
            "website": "https://globaltech.com",
            "status": "active",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        self.vendors["2"] = {
            "id": "2",
            "name": "Acme Industrial Supplies",
            "contact_name": "Jane Smith",
            "email": "jane.smith@acmesupplies.com",
            "phone": "+1-555-0142",
            "address": "456 Manufacturer Rd, Chicago, IL",
            "website": "https://acmesupplies.com",
            "status": "active",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        self._vendor_counter = 3
        
        # 3. Seed RFQ profiles
        self.rfqs["1"] = {
            "id": "1",
            "title": "Procurement of Laptops for Engineering",
            "description": "Request for quotation for 50 high-end development laptops.",
            "status": "open",
            "deadline": datetime.now(timezone.utc).replace(year=2026, month=12, day=31),
            "items": [
                {"name": "Dev Laptop Model X", "quantity": 50, "description": "32GB RAM, 1TB SSD"}
            ],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        self.rfqs["2"] = {
            "id": "2",
            "title": "Office Desks and Chairs Setup",
            "description": "Request for quotation for new building floor furniture setup.",
            "status": "draft",
            "deadline": datetime.now(timezone.utc).replace(year=2026, month=11, day=15),
            "items": [
                {"name": "Ergonomic Chairs", "quantity": 100, "description": "Black mesh back"},
                {"name": "Standing Desks", "quantity": 80, "description": "Dual motor adjust"}
            ],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        self._rfq_counter = 3
        
        # 4. Seed Quotation profiles
        self.quotations["1"] = {
            "id": "1",
            "rfq_id": "1",
            "vendor_id": "1",
            "total_amount": 75000.0,
            "details": "We offer Laptop Model X with complete 3 year warranty and immediate support.",
            "delivery_date": datetime.now(timezone.utc).replace(year=2026, month=7, day=15),
            "status": "pending",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        self._quotation_counter = 2

    # Thread-safe utility methods to generate incremental string IDs
    def next_user_id(self) -> str:
        with self._lock:
            val = str(self._user_counter)
            self._user_counter += 1
            return val

    def next_vendor_id(self) -> str:
        with self._lock:
            val = str(self._vendor_counter)
            self._vendor_counter += 1
            return val

    def next_rfq_id(self) -> str:
        with self._lock:
            val = str(self._rfq_counter)
            self._rfq_counter += 1
            return val

    def next_quotation_id(self) -> str:
        with self._lock:
            val = str(self._quotation_counter)
            self._quotation_counter += 1
            return val

# Global instance simulating a persistent singleton database session
db = MockDatabase()
