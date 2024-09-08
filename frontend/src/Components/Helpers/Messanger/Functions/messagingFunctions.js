export const fetchMessages = async (orderId, setSessionExpired) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/messages/${orderId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
  
      if (response.status === 401) {
        setSessionExpired(true);
        return;
      }
  
      if (!response.ok) throw new Error("Failed to fetch messages");
      return await response.json();
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  };
  
  export const sendMessage = async (orderId, sender, text, setSessionExpired) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId, sender, text }),
      });
  
      if (response.status === 401) {
        setSessionExpired(true);
        return;
      }
  
      if (!response.ok) throw new Error("Failed to send message");
      return await response.json();
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };