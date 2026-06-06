from pydantic import BaseModel, EmailStr, Field

class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="User email address", json_schema_extra={"example": "admin@vendorbridge.com"})
    password: str = Field(..., description="User password", json_schema_extra={"example": "password123"})

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
