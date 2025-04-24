from typing import Union
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI
app = FastAPI()

origins = [
    'http://localhost:5173'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# In-memory database
todos = {
    "todo": [
        {"id": 1, "title": "Learn Python and Django", "is_completed": False},
        {"id": 2, "title": "Build a project", "is_completed": False},
        {"id": 3, "title": "Write a blog post", "is_completed": False},
        {"id": 4, "title": "Test with pytest", "is_completed": False},
        {"id": 5, "title": "Deploy to Vercel", "is_completed": False}
    ]
}


@app.get("/todos")
async def read_todos():
    """
    Get the list of all todos.
    """
    return todos


@app.get("/todos/{item_id}")
async def get_todo(item_id: int):
    """
    Get a single todo by its ID.
    """
    for item in todos["todo"]:
        if item["id"] == item_id:
            return item
    raise HTTPException(status_code=404, detail="Todo not found")
