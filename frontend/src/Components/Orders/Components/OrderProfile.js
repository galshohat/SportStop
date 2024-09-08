import React, { useState } from "react";
import "./OrderProfile.css";
import { motion } from "framer-motion";
import { Chat } from "@mui/icons-material"; 
import MessengerPopup from "../../Helpers/Messanger/MessengerPopup.js"; 
import Pagination from "../../Admin/Components/Pagination.js"; 
import {
  handlePreviousPage,
  handleNextPage,
} from "../../Admin/Functions/handlePagination.js";
import Price from "../../Currency/price.js";

const OrderProfile = ({ order, setSessionExpired, onOpenMessenger }) => {
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;


  const handleCloseMessenger = () => {
    setIsMessengerOpen(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = order.orderItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(order.orderItems.length / itemsPerPage);

  const getStatus = (status) => {
    switch (status) {
      case "Pending":
        return { pending: true, shipped: false, completed: false };
      case "Shipped":
        return { pending: true, shipped: true, completed: false };
      case "Completed":
        return { pending: true, shipped: true, completed: true };
      default:
        return { pending: false, shipped: false, completed: false };
    }
  };

  const status = getStatus(order.status);

  return (
    <>
      <motion.div
        className="order-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="order-header">
          <h2>Order Token: {order.token}</h2>
          <p>Status: {order.status}</p>
          <Chat
            className="messenger-icon"
            onClick={() => {
              if (order.status !== "Completed") {
                onOpenMessenger(order);
              }
            }}
            style={{
              cursor: order.status === "Completed" ? "not-allowed" : "pointer",
              marginLeft: "10px",
              color: order.status === "Completed" ? "#ccc" : "#1976d2",
            }}
            titleAccess={
              order.status === "Completed"
                ? "Chat is disabled for completed orders"
                : "Open Messenger"
            }
          />
        </div>
        <div className="progress-bar">
          <div
            className={`progress-circle pending ${
              status.pending ? "active" : ""
            }`}
          ></div>
          <div
            className={`progress-connector ${
              status.shipped ? "shipped active" : ""
            }`}
          ></div>
          <div
            className={`progress-circle shipped ${
              status.shipped ? "active" : ""
            }`}
          ></div>
          <div
            className={`progress-connector ${
              status.completed ? "completed active" : ""
            }`}
          ></div>
          <div
            className={`progress-circle completed ${
              status.completed ? "active" : ""
            }`}
          ></div>
        </div>
        <div className="order-details">
          <h3>Order Details:</h3>
          <div className="order-grid">
            {currentItems.map((item, index) => (
              <div key={index} className="order-item">
                <img src={item.product.image} alt={item.product.name} />
                <div>
                  <p>{item.product.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>
                    Price: <Price valueInShekels={item.product.price} toFixed={2} withSymbol={true}/>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          handlePreviousPage={() =>
            handlePreviousPage(currentPage, setCurrentPage)
          }
          handleNextPage={() =>
            handleNextPage(currentPage, setCurrentPage, totalPages)
          }
          totalPages={totalPages}
          wrapperStyle={{ marginTop: "2rem" }}
        />
      </motion.div>

      {isMessengerOpen && (
        <MessengerPopup
          order={order}
          onClose={handleCloseMessenger}
          setSessionExpired={setSessionExpired}
        />
      )}
    </>
  );
};

export default OrderProfile;