export const addToCart = async (
  userId,
  productId,
  quantity,
  size,
  setSessionExpired,
  setShowPopupMessage,
  setUserInfo
) => {
  if (!userId) {
    setShowPopupMessage("You must log in before adding to cart");
    return;
  }
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/users/cart/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
          size,
        }),
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
      } else if (data.message.includes("Cannot add more items")) {
        setShowPopupMessage(data.message);
        return;
      } else {
        throw new Error(data.message || "Failed to add product to cart.");
      }
    }

    setUserInfo(data.updatedUser);

    if (data.message === "Product quantity updated in cart.") {
      setShowPopupMessage("Product already in cart. Quantity updated.");
    } else {
      setShowPopupMessage("Product added to cart successfully.");
    }

    console.log("Cart updated successfully.");
  } catch (error) {
    console.error("Error during add to cart:", error);
  }
};
