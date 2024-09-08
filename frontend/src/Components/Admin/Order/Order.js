import React, { useEffect, useState } from "react";
import AdminNavbar from "../Components/AdminNavbar";
import Pagination from "../Components/Pagination";
import {
  handlePreviousPage,
  handleNextPage,
} from "../Functions/handlePagination.js";
import handleSearchChange from "../Functions/handleSearch";
import Loading from "../../Loader/Loader";
import fetchOrders from "./Functions/fetchOrders";
import OrderTable from "./Components/OrderTable";
import ErrorMessage from "../../Helpers/ErrorMessage.js";
import SessionExpiryRedirect from "../../Auth&Verify/SessionExpiryRedirect";
import Popup from "../../Helpers/PopUp/PopUp.js";
import handleDeleteOrder from "./Functions/handleDeleteOrder";
import handleUpdateOrder from "./Functions/handleUpdateOrder";
import UpdateOrderStatusForm from "./Components/UpdateOrderStatusForm";
import OrderProductsPopup from "./Components/OrderProductsPopup";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showOrderProductsPopup, setShowOrderProductsPopup] = useState(false); 
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [productsToView, setProductsToView] = useState([]); 

  useEffect(() => {
    fetchOrders(setOrders, setLoading, setSessionExpired);
  }, []);

    const confirmDeleteOrder = (order) => {
      console.log(order)
    setOrderToDelete(order);
    setShowDeletePopup(true);
  };

  const confirmUpdateOrder = (order) => {
    setOrderToUpdate(order);
    setShowUpdatePopup(true);
  };

  const confirmViewOrderItems = (order) => {
    setProductsToView(order.orderItems);
    setShowOrderProductsPopup(true);
  };

  const deleteOrder = () => {
    handleDeleteOrder(
      orderToDelete,
      setOrders,
      orders,
      setErrorMessage,
      setShowDeletePopup,
      setOrderToDelete
    );
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders
    .filter(
      (order) =>
        order.user.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        order.token.startsWith(searchTerm)
    )
    .slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div>
      <AdminNavbar />
      {loading ? (
        <Loading />
      ) : (
        <div className="category-container">
          {errorMessage && <ErrorMessage message={errorMessage} />}
          <div className="category-header">
            <h1>Orders ({orders.length})</h1>
            <p>Manage orders for your store</p>
          </div>

          <div className="category-search">
            <input
              type="text"
              placeholder="Search orders by user name or token..."
              value={searchTerm}
              onChange={(e) =>
                handleSearchChange(e, setSearchTerm, setCurrentPage)
              }
            />
          </div>

          {currentOrders.length > 0 ? (
            <div className="order-table-container">
              <OrderTable
                currentOrders={currentOrders}
                confirmDeleteOrder={confirmDeleteOrder}
                confirmUpdateOrder={confirmUpdateOrder}
                confirmViewOrderItems={confirmViewOrderItems}
              />
            </div>
          ) : (
            <p className="no-categories">
              {searchTerm
                ? "Such order doesn't exist..."
                : "No Orders added yet..."}
            </p>
          )}

          {currentOrders.length > 0 && (
            <Pagination
              currentPage={currentPage}
              handlePreviousPage={() =>
                handlePreviousPage(currentPage, setCurrentPage)
              }
              handleNextPage={() =>
                handleNextPage(currentPage, setCurrentPage, totalPages)
              }
              totalPages={totalPages}
              disableNext={currentPage >= totalPages || totalPages === 0}
            />
          )}
        </div>
      )}
      {sessionExpired && <SessionExpiryRedirect trigger={sessionExpired} />}

      {showDeletePopup && (
        <Popup
          onClose={() => setShowDeletePopup(false)}
          title="Delete Order"
          isX="true"
        >
          <p
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
            }}
          >
            Are you sure you want to delete this order?
          </p>
          <p
            style={{
              fontSize: "1.5rem",
              color: "red",
                          fontWeight: "bold",
              marginTop: "1vh"
            }}
          >
            The user will be "refunded" and deducted {orderToDelete.orderPrice * 0.1} stars
          </p>
          <div>
            <button style={{ width: "40%" }} onClick={deleteOrder}>
              Delete
            </button>
          </div>
        </Popup>
      )}

      {showUpdatePopup && (
        <Popup
          onClose={() => setShowUpdatePopup(false)}
          title={`Order Status "${orderToUpdate?.token}"`}
          isX="true"
        >
          <UpdateOrderStatusForm
            initialStatus={orderToUpdate?.status}
            onSubmit={(updatedStatus) =>
              handleUpdateOrder(
                updatedStatus,
                orderToUpdate,
                setOrders,
                setShowUpdatePopup,
                setErrorMessage,
                setSessionExpired
              )
            }
          />
        </Popup>
      )}

      {showOrderProductsPopup && (
        <OrderProductsPopup
          products={productsToView} 
          onClose={() => setShowOrderProductsPopup(false)}
        />
      )}
    </div>
  );
};

export default Orders;
