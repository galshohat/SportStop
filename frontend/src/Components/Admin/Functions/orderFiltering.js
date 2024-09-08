import { useEffect } from "react";
export const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "red";
      case "Shipped":
        return "orange";
      case "Completed":
        return "green";
      default:
        return "black";
    }
  };
  
  export const filterOrdersByStatus = (orders, statusFilter) => {
    return orders.filter((order) => statusFilter[order.status]);
  };
  
  export const handleStatusChange = (status, setStatusFilter) => {
    setStatusFilter((prevFilter) => ({
      ...prevFilter,
      [status]: !prevFilter[status],
    }));
  };
  

export const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event || !event.target) return; 

      if (ref.current && !ref.current.contains(event.target)) {
        callback(event); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};