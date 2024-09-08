import React, { useEffect, useContext } from "react";
import { Delete } from "@mui/icons-material";
import formatDate from "../../../Helpers/FormatDate";
import { highlightRows } from "../../Functions/highlightRows";
import { AuthContext } from "../../../Auth&Verify/UserAuth";
import Price from "../../../Currency/price";
const ProductTable = ({
  currentProducts,
  confirmUpdateProduct,
  confirmDeleteProduct,
  highlightedProductIds,
  onHighlightComplete,
}) => {
  useEffect(() => {
    const cleanup = highlightRows(
      highlightedProductIds,
      currentProducts,
      onHighlightComplete,
      "product"
    );

    return cleanup;
  }, [highlightedProductIds, currentProducts, onHighlightComplete]);
  const currency = useContext(AuthContext).userInfo.currency
  return (
    <table className="category-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Categories</th>
          <th>Gender</th>
          <th>Featured</th>
          <th>Price {`(${currency})`}</th>
          <th>Sizes</th>
          <th>Colors</th>
          <th>Last Modified</th>
          <th>In Stock</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {currentProducts.map((product, index) => (
          <tr
            key={index}
            id={`product-${product.id}`}
            className={
              Array.isArray(highlightedProductIds) &&
              highlightedProductIds.includes(product.id)
                ? "highlighted-row"
                : ""
            }
          >
            <td>{product.name}</td>
            <td>
              {product.categories.map((category) => category.name).join(", ")}
            </td>
            <td>{product.gender ? product.gender.replace(",", ", ") : "N/A"}</td>
            <td>{product.isFeatured === true ? "Yes" : "No"}</td>
            <td>{<Price valueInShekels={product.price} withSymbol = {false}  />}</td>
            <td>
              {product.sizes.length > 0
                ? product.sizes.map((size) => size.name).join(", ")
                : "N/A"}
            </td>
            <td>
              {product.colors.length > 0
                ? product.colors.map((color) => color.name).join(", ")
                : "N/A"}
            </td>
            <td>{formatDate(product.dateModified)}</td>
            <td
              style={{
                color: product.countStock === 0 ? "red" : "inherit",
                fontWeight: product.countStock === 0 ? "bold" : "normal"
              }}
            >
              {product.countStock}
            </td>
            <td className="action-buttons-cell">
              <div className="action-buttons">
                <button
                  className="action-btn"
                  onClick={() => confirmUpdateProduct(product)}
                >
                  ...
                </button>
                <Delete
                  className="delete-icon"
                  onClick={() => confirmDeleteProduct(product)}
                  style={{
                    color: "red",
                    cursor: "pointer",
                    marginLeft: "0.25vw",
                    marginTop: "1vh",
                  }}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;