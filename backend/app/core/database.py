from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# 1. Create engine connection to MySQL/MariaDB (or other SQL DB)
# pool_pre_ping=True prevents connection drop exceptions on idle timeouts (very common in MySQL)
engine = create_engine(
    settings.DATABASE_URL, 
    pool_pre_ping=True
)

# 2. Setup thread-local session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. Dependency helper yielding database session contexts to endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
