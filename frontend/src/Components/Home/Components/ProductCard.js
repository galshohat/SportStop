import React, { useState, useContext } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { addToCart } from "../../Cart/Functions/addToCart.js";
import { AuthContext } from "../../Auth&Verify/UserAuth.js";
import Price from "../../Currency/price.js";

const ProductCard = ({ product, onViewProduct, showNotification, setSessionExpired }) => {

  const [loading, setLoading] = useState(false);
  const userId = useContext(AuthContext).userInfo?._id;
  const isAdmin = useContext(AuthContext).userInfo?.isAdmin;
  const { setUserInfo } = useContext(AuthContext);
  
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (product.sizes && product.sizes.length > 0) {
      onViewProduct(product, "You must choose a size for this product.");
      return;
    }

    setLoading(true);
    try {
      await addToCart(
        userId,
        product.id,
        1,
        null,
        setSessionExpired,
        showNotification,
        setUserInfo
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error during add to cart:", error);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-overlay">
          <button
            className="product-btn"
            onClick={(e) => {
              e.stopPropagation();
              onViewProduct(product);
            }}
          >
            <VisibilityIcon style={{ color: "#000" }} />
          </button>
          {!isAdmin && (
            <button
              className="product-btn"
              onClick={handleAddToCart}
              disabled={loading}
            >
              <ShoppingCartIcon style={{ color: "#000" }} />
            </button>
          )}
        </div>
      </div>
      <p className="product-name">{product.name}</p>
      <p className="product-price">
        {userId ? <Price valueInShekels={product.price} toFixed={2} withSymbol={true} /> : '₪'+product.price.toFixed(2)}
      </p>
    </div>
  );
};

export default ProductCard;