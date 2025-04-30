import React from "react";
import { useState } from "react";
import UpdateTodoModal from "./UpdateTodoModal";
import { memo } from "react";

const Todo = memo(({ todo, userId, onUpdate }) => {
  const [selectedTodo, setSelectedTodo] = useState(null);

  return (
    <>
      <div
        key={todo.id}
        className="flex justify-between items-center text-base cursor-pointer my-4 font-medium text-gray-800 bg-gray-100 px-4 py-2 rounded-lg shadow"
      >
        <p>{todo.title}</p>
        <button
          onClick={() => setSelectedTodo({ ...todo, user_id: userId })}
          className="px-4 py-2 cursor-pointer bg-black text-white rounded hover:bg-slate-900"
        >
          Update
        </button>
      </div>

      {selectedTodo && (
        <UpdateTodoModal
          todo={selectedTodo}
          onClose={() => setSelectedTodo(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
});

export default Todo;
