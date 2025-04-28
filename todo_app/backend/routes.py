from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from database import get_db
from schemas import UserCreate, GetUser
from auth import sign_up, sign_in


router = APIRouter()


@router.post("/sign-up")
def signing_up(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.

    This endpoint allows a client to create a new user account
    by providing a email, and password.

    Args:
        user_data (UserCreate): The user input containing email, and password.
        db (Session): Database session dependency injected by FastAPI.

    Returns:
        dict: A success message or error detail.

    Raises:
        HTTPException: If the sign-up process fails, returns an error with appropriate status code.
    """
    result, status_code = sign_up(db, user_data)
    if status_code != 201:
        raise HTTPException(status_code=status_code, detail=result["Message"])
    return result


@router.post("/sign-in")
def signing_in(user_data: GetUser, db: Session = Depends(get_db)):
    result, status_code = sign_in(db, user_data.email, user_data.password)
    if status_code != 200:
        raise HTTPException(status_code=status_code, detail=result["message"])

    response = JSONResponse(content=result)
    # Set the cookie on success
    if status_code == 200:
        response.set_cookie(
            key="access_token", value=result["access_token"], httponly=True
        )

    return response
