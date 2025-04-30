import React, { useState, useEffect } from "react";

const Todos_list = () => {
  const [isTodo, setTodo] = useState();
  const [isError, setIsError] = useState("");

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
      const todos = json_response?.todos;
      
      if (todos) {
        setTodo(todos);
        setIsError("");
      }
    } catch (error) {
      console.error(error);
      setIsError(error.message || "Failed to fetch todos");
    }
  };

  useEffect(() => {
    get_todos();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <>
      {isTodo?.map((todo) => (
        <div key={todo.id} className="mx-20">
          <p className="text-base cursor-pointer my-4 mx-8 hover:scale-95 transition font-medium text-gray-800 bg-gray-100 px-4 py-2 rounded-lg shadow">
            {todo.title}
          </p>
        </div>
      ))}
      {isError && <p className="text-red-500 mx-8">{isError}</p>}
    </>
  );
};

export default Todos_list;