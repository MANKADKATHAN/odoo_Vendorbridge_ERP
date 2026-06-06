# VendorBridge Procurement & Vendor Management Backend

Welcome to the backend API skeleton for **VendorBridge** - a procurement and vendor management platform.

This skeleton is built as a production-ready FastAPI codebase following **clean architecture** and **modular design** principles. It segregates logic into Routers, Schemas, Services, and Utilities. All storage is currently managed by a thread-safe, in-memory mock database that can be easily plugged into a real SQL or NoSQL database later.

---

## Project Folder Structure

```
odoo_Vendorbridge_ERP/
├── app/
│   ├── __init__.py
│   ├── main.py                  # API entry point, CORS, middlewares, global exception handling
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py            # Pydantic Settings (manages configs & JWT secrets)
│   │   ├── security.py          # Password hashing context (bcrypt) & JWT operations
│   │   └── dependencies.py      # Injection dependencies (OAuth2 schema, get_current_user)
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py              # Register, Login, Me endpoints
│   │   ├── vendors.py           # CRUD endpoints for Vendors
│   │   ├── rfqs.py              # CRUD endpoints for RFQs
│   │   ├── quotations.py        # CRUD endpoints for Quotations
│   │   └── dashboard.py         # Summary analytics dashboard
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py              # User inputs, login, and response structures
│   │   ├── vendor.py            # Vendor CRUD schemas
│   │   ├── rfq.py               # RFQ and line item structures
│   │   ├── quotation.py         # Quotation CRUD schemas
│   │   └── dashboard.py         # Dashboard analytics schemas
│   ├── services/
│   │   ├── __init__.py
│   │   ├── mock_db.py           # Thread-safe in-memory database with seeded mock records
│   │   ├── auth.py              # User registration and verification logic
│   │   ├── vendor.py            # Vendor business CRUD operations
│   │   ├── rfq.py               # RFQ business CRUD operations
│   │   ├── quotation.py         # Quotation business CRUD operations
│   │   └── dashboard.py         # Metrics calculations and analytics
│   └── utils/
│       ├── __init__.py
│       └── helpers.py           # General utility helpers (empty package ready for helpers)
├── requirements.txt             # Project library dependencies
└── README.md                    # Backend setup and documentation
```

---

## Setup & Running Guide

### 1. Create and Activate Virtual Environment
```powershell
python -m venv venv
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Run the Backend Server
```powershell
uvicorn app.main:app --reload
```
Once the server is running, the API will be available at: `http://127.0.0.1:8000`

### 4. Interactive Swagger Documentation
Open your browser and navigate to:
**[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**
Here you can interactively test every endpoint with visual payloads and authentication triggers.

---

## Database Integration Plug-In Plan

To transition from the current in-memory mock database to a real database (e.g. PostgreSQL or MySQL):
1. **Configure Environment Connection:** Add your database URL in `app/core/config.py` (via the `DATABASE_URL` settings property or a `.env` file).
2. **Setup Session Dependency:** Create a database connection helper under `app/core/` (e.g. `database.py` utilizing SQLAlchemy or SQLModel) to yield a `Session` object.
3. **Generate ORM Models:** Create database tables corresponding to the entities using your ORM framework.
4. **Modify Service Methods:** In each file under `app/services/` (such as `vendor.py`, `rfq.py`, etc.), swap the queries targeting `db.vendors` or `db.rfqs` with standard ORM queries (e.g. `db_session.query(Vendor).all()`). No route endpoints or Pydantic validation rules need to change.

---

## Sample API Requests & Responses

### 1. Authentication

#### **Register User (`POST /auth/register`)**
* **Request Body:**
  ```json
  {
    "username": "buyer_bob",
    "email": "bob@vendorbridge.com",
    "password": "password123",
    "full_name": "Bob Buyer",
    "role": "buyer"
  }
  ```
* **Response (HTTP 201):**
  ```json
  {
    "id": "2",
    "username": "buyer_bob",
    "email": "bob@vendorbridge.com",
    "full_name": "Bob Buyer",
    "role": "buyer",
    "created_at": "2026-06-06T09:48:25.123456Z"
  }
  ```

#### **Login User (`POST /auth/login`)**
* **Request Body:**
  ```json
  {
    "username_or_email": "admin@vendorbridge.com",
    "password": "password123"
  }
  ```
* **Response (HTTP 200):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
  ```

#### **Get Logged-in User Profile (`GET /auth/me`)**
* **Headers:** `Authorization: Bearer <token>`
* **Response (HTTP 200):**
  ```json
  {
    "id": "1",
    "username": "admin",
    "email": "admin@vendorbridge.com",
    "full_name": "System Administrator",
    "role": "admin",
    "created_at": "2026-06-06T09:46:00Z"
  }
  ```

---

### 2. Vendor Management

#### **Create Vendor (`POST /vendors`)**
* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
  ```json
  {
    "name": "Consolidated Parts Inc.",
    "contact_name": "Alice Vance",
    "email": "alice@consolidated.com",
    "phone": "+1-202-555-0143",
    "address": "789 Industrial Blvd, Detroit, MI",
    "website": "https://consolidatedparts.com"
  }
  ```
* **Response (HTTP 201):**
  ```json
  {
    "id": "3",
    "name": "Consolidated Parts Inc.",
    "contact_name": "Alice Vance",
    "email": "alice@consolidated.com",
    "phone": "+1-202-555-0143",
    "address": "789 Industrial Blvd, Detroit, MI",
    "website": "https://consolidatedparts.com",
    "status": "active",
    "created_at": "2026-06-06T09:50:00Z",
    "updated_at": "2026-06-06T09:50:00Z"
  }
  ```

#### **Get Vendor by ID (`GET /vendors/{id}`)**
* **Headers:** `Authorization: Bearer <token>`
* **Response (HTTP 200):**
  ```json
  {
    "id": "1",
    "name": "Global Tech Logistics",
    "contact_name": "John Doe",
    "email": "john.doe@globaltech.com",
    "phone": "+1-555-0199",
    "address": "123 Logistics Way, Silicon Valley, CA",
    "website": "https://globaltech.com",
    "status": "active",
    "created_at": "2026-06-06T09:46:00Z",
    "updated_at": "2026-06-06T09:46:00Z"
  }
  ```

---

### 3. RFQ Management

#### **Create RFQ (`POST /rfqs`)**
* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
  ```json
  {
    "title": "Purchase of Office Moniters",
    "description": "RFQ for 30 IPS monitors 27 inch 4K.",
    "deadline": "2026-10-31T23:59:59Z",
    "items": [
      {
        "name": "27-inch 4K Monitor",
        "quantity": 30,
        "description": "IPS panel, color calibrated"
      }
    ]
  }
  ```
* **Response (HTTP 201):**
  ```json
  {
    "id": "3",
    "title": "Purchase of Office Moniters",
    "description": "RFQ for 30 IPS monitors 27 inch 4K.",
    "deadline": "2026-10-31T23:59:59Z",
    "items": [
      {
        "name": "27-inch 4K Monitor",
        "quantity": 30,
        "description": "IPS panel, color calibrated"
      }
    ],
    "status": "open",
    "created_at": "2026-06-06T09:51:00Z",
    "updated_at": "2026-06-06T09:51:00Z"
  }
  ```

---

### 4. Quotation Management

#### **Submit Quotation (`POST /quotations`)**
* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
  ```json
  {
    "rfq_id": "1",
    "vendor_id": "1",
    "total_amount": 72500.0,
    "details": "Offer with free shipping and bulk discount.",
    "delivery_date": "2026-08-01T12:00:00Z"
  }
  ```
* **Response (HTTP 201):**
  ```json
  {
    "id": "2",
    "rfq_id": "1",
    "vendor_id": "1",
    "total_amount": 72500.0,
    "details": "Offer with free shipping and bulk discount.",
    "delivery_date": "2026-08-01T12:00:00Z",
    "status": "pending",
    "created_at": "2026-06-06T09:52:00Z",
    "updated_at": "2026-06-06T09:52:00Z"
  }
  ```

#### **Accept Quotation (`PUT /quotations/{id}`)**
* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
  ```json
  {
    "status": "accepted"
  }
  ```
* **Response (HTTP 200):**
  ```json
  {
    "id": "1",
    "rfq_id": "1",
    "vendor_id": "1",
    "total_amount": 75000.0,
    "details": "We offer Laptop Model X with complete 3 year warranty and immediate support.",
    "delivery_date": "2026-07-15T00:00:00Z",
    "status": "accepted",
    "created_at": "2026-06-06T09:46:00Z",
    "updated_at": "2026-06-06T09:53:00Z"
  }
  ```

---

### 5. Dashboard Summary

#### **Get Summary Metrics (`GET /dashboard/summary`)**
* **Headers:** `Authorization: Bearer <token>`
* **Response (HTTP 200):**
  ```json
  {
    "total_vendors": 2,
    "total_rfqs": 2,
    "total_quotations": 1,
    "total_spend": 75000.0,
    "rfq_status_breakdown": {
      "draft": 1,
      "open": 1,
      "closed": 0,
      "awarded": 0
    },
    "quotation_status_breakdown": {
      "pending": 0,
      "accepted": 1,
      "rejected": 0
    }
  }
  ```
