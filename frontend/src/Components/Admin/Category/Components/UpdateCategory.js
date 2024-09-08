import React, { useState } from "react";
import "./Components.css"; 

const UpdateCategoryForm = ({ initialName, onSubmit }) => {
  const [categoryName, setCategoryName] = useState(initialName);

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
        <button type="submit" className="create-btn" disabled={categoryName === initialName}>
          Update
        </button>
      </div>
    </form>
  );
};

export default UpdateCategoryForm;