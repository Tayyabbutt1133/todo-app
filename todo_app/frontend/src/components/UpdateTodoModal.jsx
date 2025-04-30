import React, { useState } from "react";

const UpdateTodoModal = ({ todo, onClose, onUpdate }) => {
  const [title, setTitle] = useState(todo.title);
  const [isCompleted, setIsCompleted] = useState(todo.is_completed);
  const [isLoading, setIsLoading] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const handleUpdate = async () => {
    const accessToken = getCookie("access_token");
    if (!accessToken) return alert("Access token missing");

    setIsLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          is_completed: isCompleted,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        onUpdate();  // refetch todos in parent
        onClose();   // close modal
      } else {
        alert(data.message || "Failed to update todo");
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Update Todo</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border w-full p-2 mb-4 rounded"
        />
        <select
          value={isCompleted}
          onChange={(e) => setIsCompleted(e.target.value === "true")}
          className="border w-full p-2 mb-4 rounded"
        >
          <option value="false">Uncompleted</option>
          <option value="true">Completed</option>
        </select>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className={`px-4 py-2 bg-blue-600 cursor-pointer text-white rounded hover:bg-blue-700 ${
              isLoading ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTodoModal;
