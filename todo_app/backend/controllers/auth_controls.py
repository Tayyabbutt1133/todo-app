import os
from sqlalchemy.orm import Session
import hashlib
from fastapi import APIRouter, status, HTTPException, Depends
from models import Users
from schemas import UserCreate
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer

load_dotenv()

router = APIRouter(prefix="/auth", tags=["auth"])

ALGORITHM = "HS256"
SECRET_KEY = os.getenv("SECRET_KEY")

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/sign-in")

# Token generation function


def create_access_token(data: dict, expires_delta: timedelta | None):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def sign_up(db: Session, user_data: UserCreate):
    """
    Handle user registration logic.

    Checks if a user with the given email already exists in the database.
    If not, it creates a new user with a hashed password and stores the
    user in the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_data (UserCreate): Pydantic model containing user registration data.

    Returns:
        tuple: A dictionary containing the result message and an HTTP status code.
               - If email already exists: ({"status": "Error", "Message": "Email already Registered"}, 400)
               - If user is created successfully: ({"status": "success", "Message": "User Created", "user_id": int}, 200)
    """

    # check if the user exists or not
    existing_users = db.query(Users).filter(
        Users.email == user_data.email).first()
    if existing_users:
        return {"status": "error", "message": "Email already registered"}, 400

    # if user not exists
    hashed_password = hashlib.sha256(user_data.password.encode()).hexdigest()
    new_user = Users(
        email=user_data.email, hashed_password=hashed_password, is_active=True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    # create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": new_user.email, "user_id": new_user.id}, expires_delta=access_token_expires
    )

    return {
        "user_id": new_user.id,
        "status": "success",
        "message": "User created successfully",
        "access_token" : access_token
    }, 201


def sign_in(db: Session, email: str, password: str):
    # Find user by email
    user = db.query(Users).filter(Users.email == email).first()
    if not user:
        return {"status": "error", "message": "No user found"}, 401

    # First, we need to verify password
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    if user.hashed_password != hashed_password:
        return {"status": "error", "message": "Invalid credentials"}, 401

    # create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id}, expires_delta=access_token_expires
    )

    return {
        "status": "success",
        "message": "Login successful",
        "user_id": user.id,
        "access_token": access_token,
        "token_type": "bearer"
    }, 200


async def get_current_user_id(token: str = Depends(oauth2_bearer)):
    """
    Extract and validate user ID from JWT token.

    Args:
        token: The JWT token from the request header

    Returns:
        int: The user ID extracted from the token

    Raises:
        HTTPException: If token is invalid or expired
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
        return user_id

    except JWTError:
        raise credentials_exception
