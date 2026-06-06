# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator

class Settings(BaseSettings):
    API_V1_STR: str = ""
    PROJECT_NAME: str = "VendorBridge Procurement & Vendor Management API"
    
    # Security Settings
    # NOTE: In production, these should be loaded from environment variables
    # E.g. JWT_SECRET_KEY can be set via env var JWT_SECRET_KEY="some-random-guid"
    JWT_SECRET_KEY: str = Field(
        default="5b3f7a1e0bca4876b6de52382c75a89274534ef0da05cf14e7a89270df8276f3", 
        validation_alias="JWT_SECRET_KEY"
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # =========================================================================
    # DATABASE INTEGRATION PLACEHOLDER
    # =========================================================================
    # When you are ready to connect a real database (e.g., PostgreSQL, MySQL, SQLite):
    # 1. Install SQLalchemy or SQLModel: `pip install sqlalchemy` or `pip install sqlmodel`
    # 2. Configure your DB connection string here (e.g., via env var DATABASE_URL).
    # 3. Create a `database.py` file under `app/core/` to instantiate your DB engine and sessionmaker.
    # 4. Modify services in `app/services/` to query the DB session instead of `MockDatabase`.
    DATABASE_URL: str = Field(
        default="mysql+pymysql://root:password@localhost:3306/vendorbridge",
        validation_alias="DATABASE_URL"
    )

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: str) -> str:
        # Railway and Render inject database URLs starting with mysql://
        # We automatically replace this with mysql+pymysql:// for SQLAlchemy
        if isinstance(v, str) and v.startswith("mysql://"):
            return v.replace("mysql://", "mysql+pymysql://", 1)
        return v

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
