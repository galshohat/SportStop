import React from "react";
import Popup from "../../../Helpers/PopUp/PopUp.js";
import "./OrderProductsPopup.css";

const OrderProductsPopup = ({ products, onClose }) => {
  console.log(products);
  return (
    <Popup onClose={onClose} title="Products to Deliver" isX="true">
      <div className="order-products-popup-container">
        {products.map((product, index) => (
          <div key={index} className="order-product-item">
            <img
              src={product.product.image}
              alt={product.product.name}
              className="order-product-image"
            />
            <div className="order-product-details">
              <p>
                <strong>Name:</strong> {product.product.name}
              </p>
              <p>
                <strong>Quantity:</strong> {product.quantity}
              </p>
              <p>
                <strong>Size:</strong> {product.size ? product.size.name : "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Popup>
  );
};

export default OrderProductsPopup;