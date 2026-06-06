from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes import auth, vendors, rfqs, quotations, dashboard

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Production-ready FastAPI backend skeleton for the VendorBridge Procurement and Vendor Management platform. Built using clean modular architecture, Pydantic schemas, and a service-layer abstraction pattern.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware
# Essential for allowing frontend teams working on React/Vue/Next.js to query the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specific domains in a production deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global catch-all Exception Handler to ensure the API returns REST-compliant JSON errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Logs can be added here
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": f"Internal Server Error: {str(exc)}"},
    )

# Register all modular routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(vendors.router, prefix=settings.API_V1_STR)
app.include_router(rfqs.router, prefix=settings.API_V1_STR)
app.include_router(quotations.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)

@app.get(
    "/", 
    tags=["Health"],
    summary="Health check / root endpoint"
)
def health_check():
    """
    Base health check verifying the API is up and running.
    """
    return {
        "status": "healthy",
        "message": "Welcome to VendorBridge Procurement & Vendor Management API skeleton.",
        "documentation": "/docs"
    }
