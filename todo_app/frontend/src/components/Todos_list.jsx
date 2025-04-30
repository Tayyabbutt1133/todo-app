import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import getCookie from "../../utils/getcookie";
import Todo from "./Todo";
import TodoFilters from "./TodoFilters";

const Todos_list = ({ todos, get_todos }) => {
  const [userId, setUserId] = useState(null);

  // Get the current filter from URL search params
  const [searchParams] = useSearchParams();
  const currentFilter = searchParams.get("filter") || "all";

  // Filter todos based on the current filter
  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === "completed") {
      return todo.is_completed === true;
    } else if (currentFilter === "not-completed") {
      return todo.is_completed === false;
    }
    return true;
  });

  // Count todos by status for the filter summary
  const completedCount = todos.filter((todo) => todo.is_completed).length;
  const notCompletedCount = todos.length - completedCount;

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      {/* Filter Component */}
      <TodoFilters />

      {/* Filter Count track Summary - Better UI Experience */}
      <div className="text-sm text-gray-500 text-center mb-4">
        <>
          Showing {currentFilter === "all" ? "all" : currentFilter} todos (
          {filteredTodos.length})
          <div className="text-xs mt-1">
            {completedCount} completed, {notCompletedCount} pending
          </div>
        </>
      </div>

      <div className="space-y-3">
        {filteredTodos.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            userId={userId}
            onUpdate={get_todos}
          />
        ))}
      </div>
    </div>
  );
};

export default Todos_list;
