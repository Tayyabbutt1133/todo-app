import React, { useState, useEffect } from "react";
import UpdateTodoModal from "./UpdateTodoModal";

const Todos_list = () => {
  const [isTodo, setTodo] = useState([]);
  const [isError, setIsError] = useState("");
  const [userId, setUserId] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const get_todos = async () => {
    const accessToken = getCookie("access_token");

    if (!accessToken) {
      setIsError("No access without Authorization");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/todos/get-todos", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }

      const json_response = await response.json();
      console.log(json_response);

      const { todos, user_id } = json_response;
      if (todos) {
        setTodo(todos);
        setUserId(user_id);
        setIsError("");
      }
    } catch (error) {
      console.error(error);
      setIsError(error.message || "Failed to fetch todos");
    }
  };

  useEffect(() => {
    get_todos();
  }, []);

  return (
    <>
      {isTodo?.map((todo) => (
        <div
          key={todo.id}
          className="mx-20 flex justify-between items-center text-base cursor-pointer my-4 hover:scale-95 transition font-medium text-gray-800 bg-gray-100 px-4 py-2 rounded-lg shadow"
        >
          <p>{todo.title}</p>
          <button
            onClick={() => setSelectedTodo({ ...todo, user_id: userId })}
            className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      ))}
      {isError && <p className="text-red-500 mx-8">{isError}</p>}

      {selectedTodo && (
        <UpdateTodoModal
          todo={selectedTodo}
          onClose={() => setSelectedTodo(null)}
          onUpdate={get_todos}
        />
      )}
    </>
  );
};

export default Todos_list;
