import React, { useEffect, useState, useContext } from "react";
import OrderProfile from "./Components/OrderProfile.js";
import OrderSearchBar from "./Components/OrderSearchBar";
import OrderHistorySection from "./Components/OrderHistorySection";
import fetchUserOrders from "./Functions/fetchUserOrders.js";
import "./Orders.css";
import Loading from "../Loader/Loader";
import Navbar from "../Navbar/Navbar.js";
import SessionExpiryRedirect from "../Auth&Verify/SessionExpiryRedirect.js";
import MessengerPopup from "../Helpers/Messanger/MessengerPopup.js";
import noOrders from "./no-orders.png"
import { AuthContext } from "../Auth&Verify/UserAuth.js";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const { userInfo } = useContext(AuthContext);
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await fetchUserOrders(userInfo._id, setSessionExpired);

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo]);

  const handleOpenMessenger = (order) => {
    setSelectedOrder(order);
    setIsMessengerOpen(true);
  };

  const handleCloseMessenger = () => {
    setIsMessengerOpen(false);
    setSelectedOrder(null);
  };

  const toggleOrder = (order) => {
    if (expandedOrder && expandedOrder.id === order.id) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(order);
    }
  };

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) =>
        order.token?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const completedOrders = filteredOrders.filter(
    (order) => order.status === "Completed"
  );
  const activeOrders = filteredOrders.filter(
    (order) => order.status !== "Completed"
  );

  return (
    <div className="order-screen-container">
      <Navbar />
      <div className="order-info-header">
        <div className="orders-token-display">
          <h4>Order Tokens:</h4>
          <div className="order-tokens">
            {filteredOrders.map((order) => (
              <span key={order.id} className="order-token">
                {order.token}
              </span>
            ))}
          </div>
          <div className="total-orders-counter">
            <p>Total Orders: {filteredOrders.length}</p>
          </div>
        </div>
      </div>
      <h1 className="order-title">My Orders</h1>
      <OrderSearchBar setSearchTerm={setSearchTerm} />

      {loading ? (
        <Loading />
      ) : filteredOrders.length === 0 ? (
        <div className="empty-order-page">
          <img
            src={noOrders}
            alt="No Orders"
            className="empty-order-image"
          />
          <h2 className="empty-order-title">You have no orders yet!</h2>
          <p className="empty-order-text">
            Explore our products and place your first order.
          </p>
          <button
            className="explore-products-button"
            onClick={() => { navigate("/")
            }}
          >
            Explore Products
          </button>
        </div>
      ) : (
        <>
          {completedOrders.length > 0 && (
            <OrderHistorySection
              completedOrders={completedOrders}
              selectedOrder={expandedOrder}
              toggleOrder={toggleOrder}
              setSessionExpired={setSessionExpired}
              onOpenMessenger={handleOpenMessenger}
            />
          )}
          <div className="orders-container">
            {activeOrders.map((order) => (
              <OrderProfile
                key={order.id}
                order={order}
                setSessionExpired={setSessionExpired}
                onOpenMessenger={handleOpenMessenger}
              />
            ))}
          </div>
        </>
      )}

      {sessionExpired && <SessionExpiryRedirect trigger={sessionExpired} />}

      {isMessengerOpen && (
        <div className="messenger-popup-overlay">
          <MessengerPopup
            order={selectedOrder}
            onClose={handleCloseMessenger}
            setSessionExpired={setSessionExpired}
          />
        </div>
      )}
    </div>
  );
};

export default OrderPage;