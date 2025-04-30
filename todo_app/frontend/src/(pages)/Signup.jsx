import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
  const [isFormData, setIsFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    // changing specific state of form data while maintaining other state
    setIsFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(isFormData);

    try {
      const response = await fetch("http://127.0.0.1:8000/sign-up", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isFormData),
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const json_response = await response.json();
      console.log("Response from sign-up server :", json_response);

      // Store the access token in cookies (without HttpOnly flag)
      document.cookie = `access_token=${json_response.access_token}; path=/; secure`;

      // Navigate to the home page after successful login
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="w-full my-28 border max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md">
        <div className="px-6 py-4">
          <p className="mt-1 text-center text-gray-500">
            Create account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="w-full mt-4">
              <input
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg"
                type="email"
                name="email"
                placeholder="Email Address"
                aria-label="Email Address"
              />
            </div>

            <div className="w-full mt-4">
              <input
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg"
                type="password"
                name="password"
                placeholder="Password"
                aria-label="Password"
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-black rounded-lg hover:bg-slate-900 cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-center py-4 text-center bg-gray-50 dark:bg-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-200">
            Already have an account?{" "}
          </span>

          <Link
            to={"/sign-in"}
            className="mx-2 text-sm font-bold text-blue-500  hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default Signup;
