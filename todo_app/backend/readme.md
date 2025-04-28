# Current Folder Structure 
- Main.py - Handling FastAPI Server/Routes/Entry Point
- Database.py - Initializing Instance with MySQL Database
- Schemas.py - Defining data type to make sure correctness of data while requesting/responding
- Models.py - Tables in MySQL
- Auth.py - Functions for API Routes
- Routes.py - API Routes
- dummy_todos.py - Currently storing in-memory todos (temporary)
- readme.md - Guide to setup backend locally
- Requirements.txt - Packages to Install to get this app running !

# Features
- JWT-based authentication
- In-memory todo management
- User login with HttpOnly cookie
- User Signup
- Token-based protected routes


## Tech Stack

- Python 3.9+
- FastAPI [standard]
- Uvicorn (dev server)
- HTTPOnly cookie auth
- MySQL / In-memory DB (temporary)
- Pydantic for Data Validation
- SqlAlchemy ORM

## Installation

git clone https://github.com/Tayyabbutt1133/todo-app
cd repo_directory



## Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate


# Installing Dependencies(MUST)
pip install -r requirements.txt


# Run the Server
fastapi dev main.py


