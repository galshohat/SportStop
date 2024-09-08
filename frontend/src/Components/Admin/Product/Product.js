import React, { useContext, useState, useEffect } from "react";
import AdminNavbar from "../Components/AdminNavbar";
import Popup from "../../Helpers/PopUp/PopUp.js";
import AddProductForm from "./Components/AddProduct.js";
import fetchProducts from "./Functions/fetchProducts";
import UpdateProductForm from "./Components/UpdateProduct.js";
import { ProductContext } from "../../Auth&Verify/ProductContext.js";
import handleDeleteProduct from "./Functions/handleDeleteProduct";
import { handleAddNewClick, handleClosePopup } from "../Functions/handlePopups";
import handleSearchChange from "../Functions/handleSearch";
import {
  handlePreviousPage,
  handleNextPage,
} from "../Functions/handlePagination";
import handleAddProduct from "./Functions/handleAddProduct";
import handleUpdateProduct from "./Functions/handleUpdateProduct";
import ProductTable from "./Components/ProductTable";
import Pagination from "../Components/Pagination";
import ErrorMessage from "../../Helpers/ErrorMessage.js";
import SessionExpiryRedirect from "../../Auth&Verify/SessionExpiryRedirect";
import Loading from "../../Loader/Loader";
import "../Category/Category.css";

const ProductPage = () => {
  const { products, setProducts } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToUpdate, setProductToUpdate] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedProductIds, setHighlightedProductIds] = useState(
    JSON.parse(localStorage.getItem("highlightedIds")) || []
  );
  const productsPerPage = 5;

  useEffect(() => {
    fetchProducts(setProducts, setLoading, false);
  }, [setProducts]);

  useEffect(() => {

    localStorage.setItem(
      "highlightedIds",
      JSON.stringify(highlightedProductIds)
    );
  }, [highlightedProductIds]);


  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categories.some((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleProductAddition = (productData) => {
    handleAddProduct(
      productData,
      setProducts,
      setShowPopup,
      setErrorMessage,
      setSessionExpired,
      setLoading,
      setHighlightedProductIds
    );
  };

  const handleProductUpdate = (updatedData) => {
    handleUpdateProduct(
      updatedData,
      productToUpdate,
      setProducts,
      setShowUpdatePopup,
      setErrorMessage,
      setSessionExpired,
      setLoading
    );
  };

  const removeHighlightedProductId = (ids) => {
    const updatedIds = highlightedProductIds.filter(
      (highlightId) => !ids.includes(highlightId)
    );
    setHighlightedProductIds(updatedIds);
    localStorage.setItem("highlightedIds", JSON.stringify(updatedIds));
  };

  return (
    <div>
      <AdminNavbar />
      {loading ? (
        <Loading />
      ) : (
        <div className="category-container">
          <div className="category-header">
            <h1>Products ({filteredProducts.length})</h1>
            <p>Manage products for your store</p>
            <button
              className="add-new-btn"
              onClick={() => handleAddNewClick(setShowPopup, setErrorMessage)}
            >
              + Add New
            </button>
          </div>
          <div className="category-search">
            <input
              type="text"
              placeholder="Search by product name or category..."
              value={searchTerm}
              onChange={(e) =>
                handleSearchChange(e, setSearchTerm, setCurrentPage)
              }
            />
          </div>
          {filteredProducts.length > 0 ? (
            <ProductTable
              currentProducts={currentProducts}
              confirmUpdateProduct={(product) => {
                setProductToUpdate(product);
                setShowUpdatePopup(true);
              }}
              confirmDeleteProduct={(product) => {
                setProductToDelete(product);
                setShowDeletePopup(true);
              }}
              highlightedProductIds={highlightedProductIds} 
              onHighlightComplete={removeHighlightedProductId}
            />
          ) : (
            <p className="no-categories">
              {searchTerm
                ? "Such product doesn't exist..."
                : "No Products added yet..."}
            </p>
          )}
          {filteredProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              handlePreviousPage={() =>
                handlePreviousPage(currentPage, setCurrentPage)
              }
              handleNextPage={() =>
                handleNextPage(currentPage, setCurrentPage, totalPages)
              }
              totalPages={totalPages}
              disableNext={currentPage >= totalPages || totalPages === 0}
            />
          )}
          {showPopup && (
            <Popup
              onClose={() =>
                handleClosePopup(
                  setShowPopup,
                  setShowDeletePopup,
                  setShowUpdatePopup
                )
              }
              title="Create Product"
              isX="true"
            >
              <ErrorMessage message={errorMessage} />
              <AddProductForm onSubmit={handleProductAddition} />
            </Popup>
          )}
          {showUpdatePopup && (
            <Popup
              onClose={() =>
                handleClosePopup(
                  setShowPopup,
                  setShowDeletePopup,
                  setShowUpdatePopup
                )
              }
              title={`Update Product "${productToUpdate?.name}"`}
              isX="true"
            >
              <p
                className="warning-message"
                style={{ fontSize: "20px", fontWeight: "bold", color: "red" }}
              >
                Changing the details of this product will affect all associated
                data.
              </p>
              <UpdateProductForm
                initialData={productToUpdate}
                onSubmit={handleProductUpdate}
              />
            </Popup>
          )}
          {showDeletePopup && (
            <Popup
              onClose={() =>
                handleClosePopup(
                  setShowPopup,
                  setShowDeletePopup,
                  setShowUpdatePopup
                )
              }
              title="Delete Product"
              isX="true"
            >
              <p
                className="confirmation-message"
                style={{ fontSize: "20px", fontWeight: "bold" }}
              >
                Are you sure you want to delete the "{productToDelete?.name}"
                product?
                <br />
                <br />
                <span style={{ color: "red" }}>
                  This action cannot be undone and will remove the product from
                  your store.
                </span>
              </p>
              <div className="delete-btn-container">
                <button
                  onClick={() =>
                    handleDeleteProduct(
                      productToDelete,
                      setProducts,
                      currentProducts,
                      setCurrentPage,
                      currentPage,
                      setShowDeletePopup,
                      setSessionExpired,
                      setLoading
                    )
                  }
                  className="delete-confirm-btn"
                >
                  Delete
                </button>
              </div>
            </Popup>
          )}
        </div>
      )}
      {sessionExpired && <SessionExpiryRedirect trigger={sessionExpired} />}
    </div>
  );
};

export default ProductPage;
