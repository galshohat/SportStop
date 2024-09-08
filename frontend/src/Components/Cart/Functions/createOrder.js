export const createOrder = async (orderData, setUserInfo, setSessionExpired) => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
      credentials: "include"
    });

    if (response.status === 401) {
      setSessionExpired(true);
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const data = await response.json();
    console.log("created new order");

    const updatedUser = data.updatedUser;
    setUserInfo(updatedUser);
    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};