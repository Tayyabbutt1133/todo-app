from sqlalchemy.orm import Session
from models import Todos
from schemas import TodosCreate

def create_todo(db: Session, todo_data: TodosCreate, user_id: int):
    try:
        # Check if todo with same title already exists for this user
        existing_todo = (
            db.query(Todos)
            .filter(Todos.title == todo_data.title, Todos.user_id == user_id)
            .first()
        )
        
        if existing_todo:
            return {
                "status": "error",
                "message": "Todo with this title already exists",
            }, 400
        
        # Create new todo
        new_todo = Todos(
            title=todo_data.title, is_completed=todo_data.is_completed, user_id=user_id
        )
        
        db.add(new_todo)
        db.commit()
        db.refresh(new_todo)
        
        return {
            "status": "success",
            "message": "Todo created successfully",
            "todo": {
                "id": new_todo.id,
                "title": new_todo.title,
                "is_completed": new_todo.is_completed,
            },
        }, 201
    
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": f"Failed to create todo: {str(e)}"}, 500

def get_todos(db: Session, user_id: int):
    try:
        todos = db.query(Todos).filter(Todos.user_id == user_id).all()
        
        todo_list = []
        for todo in todos:
            todo_list.append(
                {"id": todo.id, "title": todo.title, "is_completed": todo.is_completed}
            )
        
        return {"status": "success", "todos": todo_list}, 200
    
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to retrieve todos: {str(e)}",
        }, 500

def get_todo_by_id(db: Session, todo_id: int, user_id: int):
    try:
        todo = (
            db.query(Todos)
            .filter(Todos.id == todo_id, Todos.user_id == user_id)
            .first()
        )
        
        if not todo:
            return {"status": "error", "message": "Todo not found"}, 404
        
        return {
            "status": "success",
            "todo": {
                "id": todo.id,
                "title": todo.title,
                "is_completed": todo.is_completed,
            },
        }, 200
    
    except Exception as e:
        return {"status": "error", "message": f"Failed to retrieve todo: {str(e)}"}, 500

