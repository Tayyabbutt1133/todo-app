from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from database import get_db
from schemas import UserCreate, GetUser
from controllers.auth_controls import sign_in, sign_up

router = APIRouter()

@router.post("/sign-up", status_code=201)
def signing_up(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.
    
    This endpoint allows the client to create a new user account
    by providing an email and password.
    
    Parameters:
    ----------
    user_data : UserCreate
        The user input containing email and password.
    db : Session
        Database session dependency injected by FastAPI.
    
    Returns:
    -------
    dict
        A success message or error detail.
    
    Raises:
    ------
    HTTPException
        If the sign-up process fails with an appropriate status code and error message.
    """
    result, status_code = sign_up(db, user_data)
    if status_code != 201:
        raise HTTPException(status_code=status_code, detail=result["message"])
    return result

@router.post("/sign-in")
def signing_in(user_data: GetUser, db: Session = Depends(get_db)):
    """
    Authenticate a user and return an access token.
    
    This endpoint verifies the user's credentials and returns
    a JWT access token on success.
    
    Parameters:
    ----------
    user_data : GetUser
        The user input containing email and password.
    db : Session
        Database session dependency injected by FastAPI.
    
    Returns:
    -------
    dict
        Contains access token and user info if authentication is successful.
    
    Raises:
    ------
    HTTPException
        If authentication fails with the appropriate status code and error message.
    """
    result, status_code = sign_in(db, user_data.email, user_data.password)
    if status_code != 200:
        raise HTTPException(status_code=status_code, detail=result["message"])
    return result

