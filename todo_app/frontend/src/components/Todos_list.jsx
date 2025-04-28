import React, { useState } from "react";
import { useEffect } from "react";

const Todos_list = () => {
  const [isTodo, setTodo] = useState();
  const [isError, setIsError] = useState();

  const get_todos = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/todos");

      const json_response = await response.json();
      const todos = json_response?.todo;
      console.log(todos);
      if (todos) {
        setTodo(todos);
      }
    } catch (error) {
      console.error(error);
      setIsError("Failed to fetch Error !");
    }
  };

  useEffect(() => {
    get_todos();
  }, []);

  return (
    <>
      {isTodo?.map((todo) => (
        <div key={todo.id} className="">
          <p className="text-base cursor-pointer my-4 mx-8 hover:scale-95 transition font-medium text-gray-800 bg-gray-100 px-4 py-2 rounded-lg shadow">
            {todo.title}
          </p>
        </div>
      ))}
      {isError ? <p>{isError}</p> : ""}
    </>
  );
};

export default Todos_list;
