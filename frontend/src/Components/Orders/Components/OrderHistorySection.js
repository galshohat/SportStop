import React from "react";
import OrderProfile from "./OrderProfile.js";
import { Close } from "@mui/icons-material";
import "./OrderHistorySection.css";

const OrderHistorySection = ({
  completedOrders,
  selectedOrder,
  toggleOrder,
  setSessionExpired,
}) => {
  return (
    <div className="order-history-section">
      <h2>Order History - Completed</h2>
      {completedOrders.map((order) => (
        <div
          key={order.id}
          className={`history-card ${selectedOrder?.id === order.id ? "open" : "closed"}`}
          onClick={() => toggleOrder(order)}
        >
          {selectedOrder?.id !== order.id ? (
            <p>Order Token: {order.token}</p>
          ) : (
            <Close
              className="close-icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleOrder(order);
              }}
            />
          )}
          {selectedOrder?.id === order.id && (
            <div
              className="expanded-card"
              onClick={(e) => e.stopPropagation()} 
            >
              <OrderProfile
                order={order}
                setSessionExpired={setSessionExpired}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderHistorySection;