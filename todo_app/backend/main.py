"""
This module contains the main application logic for the Todos API.
It defines routes, initializes the FastAPI app, sets up CORS middleware,
and handles basic in-memory todo operations.
"""

from typing import Annotated
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from routes.auth_routes import router as auth_routers
from routes.todo_routes import router as todo_routers
from database import engine, get_db
from models import Base

# Initialize FastAPI app
app = FastAPI()
Base.metadata.create_all(bind=engine)

# Configure CORS
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Type annotation for dependency injection
db_dependency = Annotated[Session, Depends(get_db)]


@app.get("/")
async def root():
    """
    Root route for the API.

    Returns:
        str: A welcome message.
    """
    root_message = "Welcome to fastapi API Development Zone"
    return root_message


# Include additional routers (e.g., auth, user, todo routes)
app.include_router(auth_routers)
app.include_router(todo_routers)
