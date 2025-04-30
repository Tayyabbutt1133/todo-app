import React from "react";
import { useSearchParams } from "react-router-dom";

const TodoFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get("filter") || "all";

  const handleFilterChange = (filter) => {
    setSearchParams({ filter });
  };

  return (
    <div className="flex justify-center my-4 gap-2">
      <button
        onClick={() => handleFilterChange("all")}
        className={`px-4 py-2 rounded-full ${
          currentFilter === "all"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        All
      </button>
      <button
        onClick={() => handleFilterChange("completed")}
        className={`px-4 py-2 rounded-full ${
          currentFilter === "completed"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Completed
      </button>
      <button
        onClick={() => handleFilterChange("not-completed")}
        className={`px-4 py-2 rounded-full ${
          currentFilter === "not-completed"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Not Completed
      </button>
    </div>
  );
};

export default TodoFilters;
