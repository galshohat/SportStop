import React, { useState } from "react";
import "../../Category/Components/Components.css"

const UpdateSizeForm = ({ initialName, initialValue, onSubmit }) => {
  const [name, setName] = useState(initialName);
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name, value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder=" "
          required
        />
        <label className="form-label">Name</label>
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder=" "
          required
        />
        <label className="form-label">Value</label>
      </div>
      <button
        type="submit"
        className="create-btn"
        disabled={name === initialName && value === initialValue}
      >
        Update
      </button>
    </form>
  );
};

export default UpdateSizeForm;
