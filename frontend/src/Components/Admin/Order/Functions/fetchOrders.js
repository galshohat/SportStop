const fetchOrders = async (setOrders, setLoading, setSessionExpired) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/orders", {
        method: "GET",
        credentials: "include",
      });
      if (response.status === 401) {
        setSessionExpired(true);
        return;
      }
  
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
  
  export default fetchOrders;