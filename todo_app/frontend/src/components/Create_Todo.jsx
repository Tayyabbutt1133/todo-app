import React, { useState } from "react";

const Create_Todo = ({ onTodoCreated }) => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to get cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Please enter a todo title");
      return;
    }

    // Retrieve access_token from cookies
    const accessToken = getCookie('access_token');
    if (!accessToken) {
      alert("No access token found");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/todos/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        credentials: "include",
        body: JSON.stringify({
          title: title,
          is_completed: false,
        }),
      });

      const data = await response.json();
      console.log("Response after creating todo:", data);
      
      if (response.ok) {
        setTitle("");
        if (onTodoCreated) onTodoCreated(data.todo);
      } else {
        alert(data.message || "Error creating todo");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of the component remains unchanged
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCreate();
  };

  return (
    <div className="flex mx-24 mb-6">
      <input
        type="text"
        placeholder="Enter todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border border-gray-300 w-full rounded-l px-3 py-2"
        disabled={isLoading}
      />
      <button
        onClick={handleCreate}
        className={`bg-black text-white px-4 py-2 rounded-r hover:bg-gray-800 transition ${
          isLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create"}
      </button>
    </div>
  );
};

export default Create_Todo;