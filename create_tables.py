from app.core.database import engine
from models import Base

def init_db():
    print("Connecting to the database and creating tables...")
    # Base.metadata.create_all binds to the SQL engine and runs DDL statements
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    init_db()
