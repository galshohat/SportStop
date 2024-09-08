export const updateCartItem = async (
  userId,
  orderItemId,
  quantity,
  size,
  setCartItems,
  setError,
  setSessionExpired,
  setShowPopupMessage,
  setUserInfo
) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/users/cart-items/${userId}/${orderItemId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity, size }),
        credentials: "include",
      }
    );

    if (response.status === 401) {
      setSessionExpired(true);
      return;
    }
    const data = await response.json();
    
    if (!response.ok) {
      if (data.message.includes("please change the quantity")) {
        setShowPopupMessage(data.message);
        return;
      } else {
        throw new Error(data.message || "Failed to add product to cart.");
      }
    }

    const updatedUser = data.user;

    setCartItems(updatedUser.cart);

    setUserInfo(updatedUser);
    setError("")
    return updatedUser;
  } catch (error) {
    setError(error.message);
  }
};
