import React, { useState } from "react";
import "./UpdateOrderStatusForm.css"

const UpdateOrderStatusForm = ({ initialStatus, onSubmit }) => {
  const [status, setStatus] = useState(initialStatus);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status !== initialStatus) {
      onSubmit(status);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="edit-status">
        <label htmlFor="orderStatus" className="status-label">
          Status
        </label>
        <select
          id="orderStatus"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="status-select"
          required
        >
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="create-btn-container">
        <button
          type="submit"
          className="create-btn"
          disabled={status === initialStatus}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default UpdateOrderStatusForm;