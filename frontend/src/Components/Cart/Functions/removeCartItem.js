export const removeCartItem = async (
  userId,
  orderItemId,
  setCartItems,
  setError,
  setLoading,
  setSessionExpired,
  setUserInfo
) => {
  try {
    setLoading(true);

    const response = await fetch(
      `http://localhost:8000/api/v1/users/cart-items/${userId}/${orderItemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.status === 401) {
      setSessionExpired(true);
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to remove cart item");
    }

    const updatedUser = await response.json();

    setCartItems(updatedUser.cart);

    setUserInfo(updatedUser);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
