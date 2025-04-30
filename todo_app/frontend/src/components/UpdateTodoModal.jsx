import React, { useState } from "react";
import getCookie from "../../utils/getcookie";

const UpdateTodoModal = ({ todo, onClose, onUpdate }) => {
  // Convert boolean to string for dropdown initial value
  const [formData, setFormData] = useState({
    title: todo.title,
    // Make sure is_completed is a boolean initially
    is_completed: Boolean(todo.is_completed)
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("Initial todo state:", todo);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle boolean conversion for is_completed
    const newValue = name === "is_completed" 
      ? value === "true" 
      : value;
    
    console.log(`Setting ${name} to:`, newValue, typeof newValue);
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };
  
  const handleUpdate = async () => {
    const accessToken = getCookie("access_token");
    if (!accessToken) return alert("Access token missing");
    
    setIsLoading(true);
    setError("");
    
    try {
      // Ensure is_completed is sent as a boolean value
      const dataToSend = {
        title: formData.title,
        is_completed: Boolean(formData.is_completed)
      };
      
      console.log("Sending data to server:", dataToSend);
      
      const response = await fetch(`http://127.0.0.1:8000/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify(dataToSend),
      });
      
      const data = await response.json();
      console.log("Server response:", data);
      
      if (response.ok) {
        onUpdate();  // refetch todos in parent
        onClose();   // close modal
      } else {
        setError(data.message || "Failed to update todo");
      }
    } catch (error) {
      console.error("Update failed:", error);
      setError("An error occurred while updating the todo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Update Todo</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border w-full p-2 rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="is_completed"
            value={formData.is_completed.toString()}
            onChange={handleChange}
            className="border w-full p-2 rounded"
          >
            <option value="false">Not Completed</option>
            <option value="true">Completed</option>
          </select>
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
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