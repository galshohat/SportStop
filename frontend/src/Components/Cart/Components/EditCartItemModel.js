import React, { useState, useContext } from "react";
import { AuthContext } from "../../Auth&Verify/UserAuth.js";
import Popup from "../../Helpers/PopUp/PopUp.js";
import { updateCartItem } from "../Functions/updateCartItem.js"; 
import "./EditCartItemModel.css";

const EditCartItemModal = ({
  onClose,
  item,
  setCartItems,
  setError,
  setLoading,
  setSessionExpired,
  userId,
  showNotification,
}) => {
  const { setUserInfo } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(item.quantity);
  const [selectedSize, setSelectedSize] = useState(item.size?.id || "");
  const handleSaveChanges = async () => {
    if (item.quantity === quantity && item.size?.id === selectedSize) {
      onClose();
      return;
    }
    setLoading(true);
    try {
      await updateCartItem(
        userId,
        item.id,
        quantity,
        selectedSize,
        setCartItems,
        setError,
        setSessionExpired,
        showNotification,
        setUserInfo
      );
      onClose(); 
    } catch (error) {
      setError("Failed to update cart item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popup
      onClose={handleSaveChanges} 
      CloseX={onClose}
      title={`Edit Item "${item.product.name}"`}
      description="Update the quantity or size of your item"
      buttonText="Save"
      isX={true}
    >
      <div className="edit-cart-item-modal">
        {item.product.sizes.length > 0 && (
          <>
            <label htmlFor="size" style={{ marginBottom: "1vh" }}>
              Size:
            </label>
            <select
              id="size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="size-select"
            >
              {item.product.sizes.map((size) => (
                <option key={size._id} value={size._id}>
                  {size.name}
                </option>
              ))}
            </select>
          </>
        )}
        <label
          htmlFor="quantity"
          style={{ marginBottom: "1vh", marginTop: "2vh" }}
        >
          Quantity:
        </label>
        <input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          className="quantity-input"
        />
      </div>
    </Popup>
  );
};

export default EditCartItemModal;
