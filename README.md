# VendorBridge Procurement & Vendor Management Platform

Centralized procurement platform that streamlines vendor onboarding, quotation management, purchase approvals, order tracking, and analytics, helping organizations digitize and optimize procurement workflows.

---

# 💻 Backend (FastAPI API)

This backend is built as a production-ready FastAPI codebase following **clean architecture** and **modular design** principles. It connects to a live MySQL database on Railway.

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

## Setup & Running Guide (Backend)

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

# 🎨 Frontend (React + Vite)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Setup & Running Guide (Frontend)

1. Navigate to the root folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development build:
   ```bash
   npm run dev
   ```
   The React dashboard will be running on: `http://localhost:5173`.
