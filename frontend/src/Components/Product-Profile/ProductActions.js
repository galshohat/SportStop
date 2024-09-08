import React, {useContext} from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ErrorMessage from "../Helpers/ErrorMessage.js";
import { AuthContext } from "../Auth&Verify/UserAuth.js";

const ProductActions = ({
  product,
  quantity,
  setQuantity,
  selectedSize,
  setSelectedSize,
  onAddToCart,
  errorMessage,
  setErrorMessage,
}) => {
  const isAdmin = useContext(AuthContext).userInfo?.isAdmin;

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setErrorMessage("");
  };

  return (
    <div className="product-popup-details">
      {product.sizes && product.sizes.length > 0 && (
        <>
          <p
            style={{
              color: "black",
              fontWeight: "bold",
              marginTop: "3vh",
              fontSize: "3vh",
            }}
          >
            Choose Your Size:{" "}
            <div className="size-buttons">
              {product.sizes.map((size) =>
                typeof size === "object" ? (
                  <button
                    key={size._id}
                    className={`size-btn ${
                      selectedSize === size.name ? "selected" : ""
                    }`}
                    onClick={() => handleSizeSelect(size.name)}
                  >
                    {size.name}
                  </button>
                ) : (
                  <button
                    key={size}
                    className={`size-btn ${
                      selectedSize === size ? "selected" : ""
                    }`}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </button>
                )
              )}
            </div>
          </p>
          {errorMessage && <ErrorMessage message={errorMessage} />}
        </>
      )}

      {!isAdmin && (
        <div className="product-popup-actions">
          <div className="quantity-wrapper">
            <label className="product-quantity-label" htmlFor="quantity-input">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity-input"
              value={quantity}
              min="1"
              onChange={handleQuantityChange}
              className="product-quantity-input"
            />
            <button className="add-to-cart-btn" onClick={onAddToCart}>
              Add to Cart
              <ShoppingCartIcon style={{ marginLeft: "0.5rem" }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductActions;