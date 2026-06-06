# VendorBridge Procurement & Vendor Management Platform

Centralized procurement platform that streamlines vendor onboarding, quotation management, purchase approvals, order tracking, and analytics, helping organizations digitize and optimize procurement workflows.

---

# 📂 Project Folder Structure

This repository is organized into distinct frontend and backend directories:
```
odoo_Vendorbridge_ERP/
├── backend/                  # FastAPI Application
│   ├── app/                  # Route, schema, and service definitions
│   ├── requirements.txt      # Python dependencies
│   ├── database.py           # DB connection layer
│   ├── models.py             # ORM models (SQLAlchemy)
│   ├── main.py               # API startup entry point
│   └── .env                  # Backend environment variables
└── frontend/                 # React Vite Client
    ├── src/                  # React components, contexts, and pages
    ├── public/               # Public icons and logos
    ├── package.json          # Node dependencies
    └── vite.config.js        # Vite compilation configurations
```

---

# 💻 Backend Setup & Running Guide (FastAPI)

The backend is built using FastAPI following a clean modular design. It connects to a live MySQL instance on Railway.

### 1. Create and Activate Virtual Environment
From the root directory:
```powershell
# Create venv at root if not already done:
python -m venv venv-312

# On Windows (PowerShell):
.\venv-312\Scripts\Activate.ps1
# On Linux/macOS:
source venv-312/bin/activate
```

### 2. Install Dependencies
```powershell
cd backend
pip install -r requirements.txt
```

### 3. Run the Backend Server
```powershell
# Make sure you are inside the backend directory:
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Once running, the API is accessible at: `http://127.0.0.1:8000`

### 4. Interactive Swagger Documentation
Open your browser and navigate to: **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)** to test endpoints interactively.

---

# 🎨 Frontend Setup & Running Guide (React + Vite)

The frontend client is built using React, Vite, and TailwindCSS, communicating with the FastAPI backend.

### 1. Navigate and Install Dependencies
From the root directory:
```bash
cd frontend
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The frontend dashboard will be active on: **[http://localhost:5173](http://localhost:5173)**.

---

# ☁️ Cloud Deployments Configuration

When deploying this repository to cloud platforms, ensure you configure the subdirectory root settings:

- **Vercel (Frontend Client):** Set the **Project Root Directory** to `frontend`.
- **Render / Heroku (Backend API):** Set the **Web Service Root Directory** to `backend`.
