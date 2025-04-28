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
