from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from database import get_db
from schemas import TodosCreate
from controllers.todos_controls import (
    create_todo, 
    get_todos, 
    get_todo_by_id, 
)
from controllers.auth_controls import get_current_user_id

router = APIRouter(prefix="/todos", tags=["todos"])

@router.post("/create", status_code=201)
async def create_new_todo(
    todo_data: TodosCreate, 
    db: Session = Depends(get_db), 
    user_id: int = Depends(get_current_user_id)
):
    """
    Create a new todo item for the authenticated user.
    
    Parameters:
    ----------
    todo_data : TodosCreate
        Todo data including title and completion status.
    db : Session
        Database session.
    user_id : int
        ID of the authenticated user.
        
    Returns:
    -------
    JSONResponse
        Response with the created todo data or error.
    """
    response, code = create_todo(db=db, todo_data=todo_data, user_id=user_id)
    return JSONResponse(status_code=code, content=response)

@router.get("/get-todos", status_code=200)
async def get_all_todos(
    db: Session = Depends(get_db), 
    user_id: int = Depends(get_current_user_id)
):
    """
    Get all todos for the authenticated user.
    
    Parameters:
    ----------
    db : Session
        Database session.
    user_id : int
        ID of the authenticated user.
        
    Returns:
    -------
    JSONResponse
        Response with the list of todos or error.
    """
    response, code = get_todos(db=db, user_id=user_id)
    return JSONResponse(status_code=code, content=response)

@router.get("/{todo_id}", status_code=200)
async def get_single_todo(
    todo_id: int, 
    db: Session = Depends(get_db), 
    user_id: int = Depends(get_current_user_id)
):
    """
    Get a specific todo by ID for the authenticated user.
    
    Parameters:
    ----------
    todo_id : int
        ID of the todo to retrieve.
    db : Session
        Database session.
    user_id : int
        ID of the authenticated user.
        
    Returns:
    -------
    JSONResponse
        Response with the todo data or error.
    """
    response, code = get_todo_by_id(db=db, todo_id=todo_id, user_id=user_id)
    return JSONResponse(status_code=code, content=response)

