import React, { useState, useEffect } from "react";
import "./Components.css"; 

const AddCategoryForm = ({ onSubmit, initialName = "", isUpdate = false }) => {
  const [categoryName, setCategoryName] = useState(initialName);

  useEffect(() => {
    setCategoryName(initialName);
  }, [initialName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryName !== initialName) {
      onSubmit(categoryName);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          id="categoryName"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="form-input"
          placeholder=" "
          required
        />
        <label htmlFor="categoryName" className="form-label">
          Name
        </label>
      </div>
      <div className="create-btn-container">
        <button
          type="submit"
          className="create-btn"
          disabled={categoryName === initialName}
        >
          {isUpdate ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default AddCategoryForm;