const handleDeleteOrder = async (orderToDelete, setOrders, orders, setErrorMessage, setShowDeletePopup, setOrderToDelete) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/orders/${orderToDelete._id}/admin`,
        {
            method: "DELETE",
            credentials: "include"
        }
      );
  
      if (response.ok) {
        setOrders(orders.filter((order) => order._id !== orderToDelete._id));
        setShowDeletePopup(false);
        setOrderToDelete(null);
      } else {
        setErrorMessage("Failed to delete the order. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };
  
  export default handleDeleteOrder;