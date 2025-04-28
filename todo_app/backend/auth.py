from sqlalchemy.orm import Session
import hashlib
from fastapi import APIRouter
from models import Users
from schemas import UserCreate
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from fastapi.security import OAuth2PasswordBearer


router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")


# Token generation function
def create_access_token(data: dict, expires_delta: timedelta | None):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

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
    existing_users = db.query(Users).filter(Users.email == user_data.email).first()
    if existing_users:
        return {"status": "Error", "Message": "Email already Registered"}, 400

    # if user not exists
    hashed_password = hashlib.sha256(user_data.password.encode()).hexdigest()
    new_user = Users(
        email=user_data.email, hashed_password=hashed_password, is_active=True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "user_id": new_user.id,
        "status": "success",
        "Message": "User Created Successully",
    }, 201


def sign_in(db: Session, email: str, password: str):
    # Find user by email
    user = db.query(Users).filter(Users.email == email).first()
    if not user:
        return {"status": "error", "message": "No User found"}, 401

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
    }, 200
