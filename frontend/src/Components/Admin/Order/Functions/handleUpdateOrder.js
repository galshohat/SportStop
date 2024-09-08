const handleUpdateOrder = async (
    updatedStatus,
    orderToUpdate,
    setOrders,
    setShowUpdatePopup,
    setErrorMessage,
    setSessionExpired
  ) => {
    if (!orderToUpdate || orderToUpdate.status === updatedStatus) return;
  
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/orders/${orderToUpdate._id}/admin`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: updatedStatus }),
          credentials: "include",
        }
      );
  
      if (response.status === 401) {
        setSessionExpired(true);
        return;
      }
  
      if (!response.ok) {
        const responseText = await response.clone().text();
        console.error("Failed to update order status:", responseText);
        setErrorMessage("Failed to update order status. Please try again.");
        return;
      }
  
      const updatedOrder = await response.json();
      console.log("Order status updated:", updatedOrder);
  
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
  
        return updatedOrders;
      });
  
      setTimeout(() => {
        const element = document.getElementById(`order-${updatedOrder.id}`);
        console.log(element)
        if (element) {
          element.classList.add("highlighted-row");
          setTimeout(() => {
            element.classList.remove("highlighted-row");
          }, 1000);
        }
      }, 0);
  
      setErrorMessage("");
      setShowUpdatePopup(false);
    } catch (error) {
      console.error("Error updating order:", error);
      setErrorMessage("An error occurred while updating the order.");
    }
  };
  
  export default handleUpdateOrder;