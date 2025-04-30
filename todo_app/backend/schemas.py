from pydantic import BaseModel, EmailStr, StrictBool


class GetUser(BaseModel):
    """
    Schema representing a user for response purposes.

    Attributes:
        email (EmailStr): The email address of the user.
        password (str) : Password of the user
    """

    email: EmailStr
    password: str

    class Config:
        """
        Configuration to allow ORM mode for compatibility
        with SQLAlchemy models.
        """

        orm_mode = True


class UserCreate(BaseModel):
    """
    Schema for creating a new user.

    Attributes:
        email (EmailStr): The email address of the new user.
        password (str): The password for the new user.
    """

    email: EmailStr
    password: str


class GET_Todos(BaseModel):
    """
    Schema representing the Todo model for response purposes.

    Attributes:
        id (int): The unique identifier of the todo item.
        title (str): The title of the todo item.
        is_completed (StrictBool): Whether the todo item is completed.
    """

    id: int
    title: str
    is_completed: StrictBool

    class Config:
        """
        Configuration to allow ORM mode for compatibility
        with SQLAlchemy models.
        """

        orm_mode = True


class TodosCreate(BaseModel):
    """
    Schema for creating a todo item.

    Attributes:
        title (str): The title of the todo item.
        is_completed (StrictBool): Whether the todo item is completed.
                                     Defaults to False.
    """

    title: str
    is_completed: StrictBool = False
