"""
This module sets up the database engine, session, and base model
for SQLAlchemy in the Todos backend API.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Database connection URL
DATABASE_URL = "mysql+pymysql://root:PAK03*pearl12@localhost:3306/todo_app"

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create a configured "SessionLocal" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all ORM models
Base = declarative_base()


def get_db():
    """
    Dependency function to get a SQLAlchemy database session.
    Ensures the session is properly closed after the request.

    Yields:
        Session: SQLAlchemy database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
