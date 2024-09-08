import React, { useState, useRef } from "react";
import {
  Delete,
  FilterList,
  Inventory,
  ArrowUpward,
  ArrowDownward,
  Message,
} from "@mui/icons-material";
import formatDate from "../../../Helpers/FormatDate";
import "./OrderTable.css";
import {
  getStatusColor,
  filterOrdersByStatus,
  handleStatusChange,
  useClickOutside,
} from "../../Functions/orderFiltering.js";
import IconButton from "@mui/material/IconButton"; 
import MessengerPopup from "../../../Helpers/Messanger/MessengerPopup.js"; 
import Price from "../../../Currency/price.js";


const OrderTable = ({
  currentOrders,
  confirmDeleteOrder,
  confirmUpdateOrder,
  confirmViewOrderItems,
}) => {
  const [statusFilter, setStatusFilter] = useState({
    Pending: true,
    Shipped: true,
    Completed: true,
  });
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isDateAscending, setIsDateAscending] = useState(false);
  const dropdownRef = useRef(null);
  const filterButtonRef = useRef(null);
  const sortIconRef = useRef(null);
  const [showMessenger, setShowMessenger] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const toggleFilterDropdown = () => {
    setShowFilterDropdown((prev) => !prev);
  };

  const toggleDateSorting = () => {
    setIsDateAscending((prev) => !prev);
  };

  useClickOutside(dropdownRef, (event) => {
    if (
      !filterButtonRef.current.contains(event.target) &&
      !sortIconRef.current.contains(event.target)
    ) {
      setShowFilterDropdown(false);
    }
  });

  const handleMessengerOpen = (order) => {
    setSelectedOrder(order);
    setShowMessenger(true);
  };

  const filteredOrders = filterOrdersByStatus(currentOrders, statusFilter).sort(
    (a, b) => {
      const dateA = new Date(a.orderDate);
      const dateB = new Date(b.orderDate);

      return isDateAscending ? dateA - dateB : dateB - dateA;
    }
  );

  return (
    <div>
      <table className="category-table">
        <thead>
          <tr>
            <th>Order To</th>
            <th>Country</th>
            <th>City</th>
            <th>Street</th>
            <th>Order Price</th>
            <th>Token</th>
            <th className="date-header">
              Order Date
              {isDateAscending ? (
                <ArrowUpward
                  ref={sortIconRef}
                  className="sort-icon"
                  onClick={toggleDateSorting}
                  style={{
                    cursor: "pointer",
                    marginLeft: "0.5vw",
                    verticalAlign: "bottom",
                  }}
                />
              ) : (
                <ArrowDownward
                  ref={sortIconRef}
                  className="sort-icon"
                  onClick={toggleDateSorting}
                  style={{
                    cursor: "pointer",
                    marginLeft: "0.5vw",
                    verticalAlign: "bottom",
                  }}
                />
              )}
            </th>
            <th className="status-header">
              Status
              <FilterList
                ref={filterButtonRef}
                className="filter-icon"
                onClick={toggleFilterDropdown}
                style={{
                  cursor: "pointer",
                  marginLeft: "0.5vw",
                  verticalAlign: "bottom",
                }}
              />
              {showFilterDropdown && (
                <div className="status-filter-dropdown" ref={dropdownRef}>
                  <label>
                    <input
                      type="checkbox"
                      checked={statusFilter.Pending}
                      onChange={() =>
                        handleStatusChange("Pending", setStatusFilter)
                      }
                    />
                    Pending
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={statusFilter.Shipped}
                      onChange={() =>
                        handleStatusChange("Shipped", setStatusFilter)
                      }
                    />
                    Shipped
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={statusFilter.Completed}
                      onChange={() =>
                        handleStatusChange("Completed", setStatusFilter)
                      }
                    />
                    Completed
                  </label>
                </div>
              )}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id} id={`order-${order.id}`}>
              <td>{order.user.name}</td>
              <td>{order.country}</td>
              <td>{order.city}</td>
              <td>{order.shippingAddress}</td>
              <td><Price valueInShekels={order.orderPrice} toFixed={2} withSymbol={true} roundPrice={false}/></td>
              <td>{order.token}</td>
              <td>{formatDate(order.orderDate)}</td>
              <td style={{ color: getStatusColor(order.status) }}>
                {order.status}
              </td>
              <td className="action-buttons-cell">
                <div className="action-buttons">
                  <button
                    className="action-btn"
                    onClick={() => confirmUpdateOrder(order)}
                  >
                    ...
                  </button>
                  <Inventory
                    className="items-icon"
                    onClick={() => confirmViewOrderItems(order)}
                    style={{
                      color: "gray",
                      cursor: "pointer",
                      marginLeft: "0.25vw",
                    }}
                  />
                  {order.status !== "Completed" && (
                    <Delete
                      className="delete-icon"
                      onClick={() => confirmDeleteOrder(order)}
                      style={{
                        color: "red",
                        cursor: "pointer",
                        marginLeft: "0.25vw",
                      }}
                    />
                  )}

                  <IconButton
                    onClick={() => handleMessengerOpen(order)}
                    color="primary"
                  >
                    <Message />
                  </IconButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showMessenger && selectedOrder && (
        <MessengerPopup
          order={selectedOrder}
          onClose={() => setShowMessenger(false)}
        />
      )}
    </div>
  );
};

export default OrderTable;