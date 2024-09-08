import React from "react";

const ProductDetails = ({ product }) => {
  const categoryLabel = product.categories?.length === 1 ? "Category" : "Categories";
  const colorLabel = product.colors?.length === 1 ? "Color" : "Colors";

  return (
    <div className="product-popup-details">
      <div className="product-popup-metadata">
        {product.categories && product.categories.length > 0 && (
          <p>
            {categoryLabel}:{" "}
            {product.categories
              .map((cat) => (typeof cat === "object" ? cat.name : cat))
              .join(", ")}
          </p>
        )}
        {product.colors && product.colors.length > 0 && (
          <p>
            {colorLabel}:{" "}
            {product.colors
              .map((color) => (typeof color === "object" ? color.name : color))
              .join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;