import React from "react";
import "./OrderSearchBar.css";

const OrderSearchBar = ({ setSearchTerm }) => {
  return (
    <div className="order-search-bar">
      <input
        type="text"
        placeholder="Search your order by token..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default OrderSearchBar;