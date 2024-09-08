const fetchUserOrders = async (userId, setSessionExpired) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/orders/${userId}`, 
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (response.status === 401) {
        setSessionExpired(true);
        return [];
      }
  
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error("Error fetching orders:", error);
      return []; 
    }
  };
  
  export default fetchUserOrders;