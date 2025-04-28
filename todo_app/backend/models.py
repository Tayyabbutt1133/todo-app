"""
This module defines the SQLAlchemy model for the Todo items.
"""

from sqlalchemy import Boolean, Column, Integer, String, ForeignKey
from database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import expression


class Users(Base):
    """
    Represents a user in the system.

    Attributes:
        id (int): The unique identifier for each user.
        email (str): The user's email address.
        password (str): The user's hashed password.
        is_active (boolean) : By default, user will be always active
        todos (list): A list of Todo items associated with the user.
    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(200), unique=True, index=True, nullable=False)
    hashed_password = Column(String(64), nullable=False)
    is_active = Column(Boolean, default=True)

    # This defines the relationship between the user and their nodes
    todos = relationship("Todos", back_populates="user")


class Todos(Base):
    """
    Represents a todo item for a user.

    Attributes:
        id (int): The unique identifier for each todo item.
        title (str): The title of the todo item.
        is_completed (bool): A flag indicating if the todo item is completed.
        user_id (int): The foreign key linking the todo item to a user.
        owner (User): The user who owns this todo item.
    """

    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), unique=True, index=True)
    is_completed = Column(Boolean, server_default=expression.false(), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationship with the User model. A todo item belongs to one user.
    user = relationship("Users", back_populates="todos")
