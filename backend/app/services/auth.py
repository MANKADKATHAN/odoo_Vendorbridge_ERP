from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.core.security import verify_password, get_password_hash
from models import User
from schemas import UserCreate
from app.schemas.auth import UserLogin

class AuthService:
    @staticmethod
    def register_user(db_session: Session, user_in: UserCreate) -> User:
        # Check if email is already in the database
        existing_user = db_session.query(User).filter(User.email == user_in.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
            
        # Hash user password
        hashed_password = get_password_hash(user_in.password)
        
        # Instantiate user model
        db_user = User(
            name=user_in.name,
            email=user_in.email,
            password_hash=hashed_password,
            role=user_in.role
        )
        
        db_session.add(db_user)
        db_session.commit()
        db_session.refresh(db_user)
        return db_user

    @staticmethod
    def authenticate_user(db_session: Session, login_in: UserLogin) -> User:
        user = db_session.query(User).filter(User.email == login_in.email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect email or password"
            )
            
        if not verify_password(login_in.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect email or password"
            )
            
        return user
