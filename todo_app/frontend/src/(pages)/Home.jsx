import React from "react";
import Todos_list from "../components/Todos_list";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="flex justify-between my-4 mx-4">
        <h1 className="text-4xl font-serif">Todo App</h1>
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
      </div>
      <div className="mt-20">
        <Todos_list />
      </div>
    </>
  );
};

export default Home;
