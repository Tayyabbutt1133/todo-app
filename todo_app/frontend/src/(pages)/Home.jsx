import React, { useState, useEffect } from "react";
import Todos_list from "../components/Todos_list";
import { Link } from "react-router-dom";
import Create_Todo from "../components/Create_Todo";
import getCookie from "../../utils/getcookie";
import deleteCookie from "../../utils/deletecookie";
import { useNavigate } from "react-router-dom";
import Authcheck from "../components/Authcheck";

const Home = () => {
  const [isaccessToken, setAcccessToken] = useState("");
  const [todos, setTodos] = useState([]);

  const TodoList_WithAuthCheck = Authcheck(Todos_list);


  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie("access_token");
    if (token) {
      setAcccessToken(token);
    }
  }, []);

  const handleLogout = () => {
    deleteCookie("access_token");
    setAcccessToken("");
    navigate("/sign-in");
  };


  // Temporary Method to fetch todos in Home--To make sure that child component get's re-render, if change comes in parent so that our latest todo_list comes if new one created

  const fetchTodos = async () => {
    const token = getCookie("access_token");
    if (!token) return;

    const response = await fetch("http://127.0.0.1:8000/todos/get-todos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      setTodos(data.todos);
    }
  };


  useEffect(() => {
    fetchTodos();
  }, []);
  

  return (
    <>
      <div className="flex justify-between my-4 mx-4">
        <h1 className="text-4xl font-serif">Todo App</h1>

        {isaccessToken ? (
          <button
            onClick={handleLogout}
            className="cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out rounded-md w-28 bg-black h-10 text-white"
          >
            Log out
          </button>
        ) : (
          <div className="flex gap-3 items-center justify-center">
            <Link to={"/sign-in"}>
              <button className="cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out rounded-md w-28 bg-black h-10 text-white">
                Login
              </button>
            </Link>
            <Link to={"/sign-up"}>
              <button className="cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out rounded-md w-28 bg-black h-10 text-white">
                Sign up
              </button>
            </Link>
          </div>
        )}
      </div>
      <div className="mt-20">
        <Create_Todo  onTodoCreated={fetchTodos}/>
        <TodoList_WithAuthCheck todos={todos} get_todos={fetchTodos} />
      </div>
    </>
  );
};

export default Home;
