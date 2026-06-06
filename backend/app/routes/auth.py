from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from schemas import UserCreate, UserResponse
from app.schemas.auth import UserLogin, Token
from app.services.auth import AuthService
from app.core.security import create_access_token
from app.core.dependencies import get_current_user
from app.core.database import get_db
from models import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post(
    "/register", 
    response_model=UserResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Registers a new user inside the MySQL database and hashes their password."
)
def register(
    user_in: UserCreate, 
    db: Session = Depends(get_db)
):
    return AuthService.register_user(db_session=db, user_in=user_in)

@router.post(
    "/login", 
    response_model=Token,
    summary="Log in and retrieve token",
    description="Authenticates the user's email/password and returns a signed JWT access token."
)
def login(
    login_in: UserLogin, 
    db: Session = Depends(get_db)
):
    user = AuthService.authenticate_user(db_session=db, login_in=login_in)
    # The JWT subject holds the primary key ID of the user record
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get(
    "/me", 
    response_model=UserResponse,
    summary="Retrieve current user profile",
    description="Decodes the OAuth2 Bearer token and returns the current user profile from the database."
)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user
