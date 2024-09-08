import React, { useState, useEffect, useContext } from "react";
import AdminNavbar from "../Components/AdminNavbar";
import Popup from "../../Helpers/PopUp/PopUp.js";
import AddCategoryForm from "./Components/AddCategory.js";
import UpdateCategoryForm from "./Components/UpdateCategory.js";
import fetchCategories from "./Functions/fetchCategories";
import handleDeleteCategory from "./Functions/handleDeleteCategory.js";
import fetchProductsByCategory from "./Functions/fetchProductsByCategory"; 
import { ProductContext } from "../../Auth&Verify/ProductContext.js";
import {
  handleAddNewClick,
  handleClosePopup,
} from "../Functions/handlePopups.js";
import handleSearchChange from "../Functions/handleSearch.js";
import {
  handlePreviousPage,
  handleNextPage,
} from "../Functions/handlePagination.js";
import handleAddCategory from "./Functions/handleAddCategory.js";
import handleUpdateCategory from "./Functions/handleUpdateCategory.js";
import CategoryTable from "./Components/CategoryTable.js";
import Pagination from "../Components/Pagination";
import ErrorMessage from "../../Helpers/ErrorMessage.js";
import SessionExpiryRedirect from "../../Auth&Verify/SessionExpiryRedirect.js";
import Loading from "../../Loader/Loader.js";
import "./Category.css";

const Category = () => {
  const { setProducts } = useContext(ProductContext);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); 
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryToUpdate, setCategoryToUpdate] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedCategoryIds, setHighlightedCategoryIds] = useState([]); 
  const [productsToDelete, setProductsToDelete] = useState([]); 
  const [loadingProducts, setLoadingProducts] = useState(false); 
  const categoriesPerPage = 5;

  useEffect(() => {
    fetchCategories(setCategories, setLoading);

    const storedHighlightedIds =
      JSON.parse(localStorage.getItem("highlightedIds")) || [];
    setHighlightedCategoryIds(storedHighlightedIds);
  }, []);

  const confirmDeleteCategory = async (category) => {
    await fetchProductsByCategory(
      category.id,
      setProductsToDelete,
      setLoadingProducts
    );
    setCategoryToDelete(category);
    setShowDeletePopup(true);
  };

  const handleHighlightComplete = (ids) => {
    const updatedIds = highlightedCategoryIds.filter(
      (highlightId) => !ids.includes(highlightId)
    );
    setHighlightedCategoryIds(updatedIds);
    localStorage.setItem("highlightedIds", JSON.stringify(updatedIds));
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name &&
      category.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  return (
    <div>
      <AdminNavbar />
      {loading ? (
        <Loading />
      ) : (
        <div className="category-container">
          <div className="category-header">
            <h1>Categories ({filteredCategories.length})</h1>
            <p>Manage categories for your store</p>
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
              placeholder="Search by category name..."
              value={searchTerm}
              onChange={(e) =>
                handleSearchChange(e, setSearchTerm, setCurrentPage)
              }
            />
          </div>

          {filteredCategories.length > 0 ? (
            <CategoryTable
              currentCategories={currentCategories}
              confirmUpdateCategory={(category) => {
                setCategoryToUpdate(category);
                setShowUpdatePopup(true);
              }}
              confirmDeleteCategory={confirmDeleteCategory} 
              highlightedCategoryIds={highlightedCategoryIds} 
              onHighlightComplete={handleHighlightComplete}
            />
          ) : (
            <p className="no-categories">
              {searchTerm
                ? "Such category doesn't exist..."
                : "No Categories added yet..."}
            </p>
          )}

          {filteredCategories.length > 0 && (
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
              title="Create Category"
              isX="true"
            >
              <ErrorMessage message={errorMessage} />
              <AddCategoryForm
                onSubmit={(categoryName) =>
                  handleAddCategory(
                    categoryName,
                    setCategories,
                    setShowPopup,
                    setErrorMessage,
                    setSessionExpired,
                    setHighlightedCategoryIds
                  )
                }
              />
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
              title={`Update Category "${categoryToUpdate?.name}"`}
              isX="true"
            >
              <p
                className="warning-message"
                style={{ fontSize: "20px", fontWeight: "bold", color: "red" }}
              >
                Changing the name of this category will affect all associated
                products.
              </p>
              <UpdateCategoryForm
                initialName={categoryToUpdate?.name}
                onSubmit={(updatedName) =>
                  handleUpdateCategory(
                    updatedName,
                    categoryToUpdate,
                    setCategories,
                    setShowUpdatePopup,
                    setErrorMessage,
                    setSessionExpired
                  )
                }
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
              title="Delete Category"
              isX="true"
            >
              {loadingProducts ? (
                <Loading />
              ) : (
                <>
                  <p
                    className="confirmation-message"
                    style={{ fontSize: "20px", fontWeight: "bold" }}
                  >
                    Are you sure you want to delete the "
                    {categoryToDelete?.name}" category?
                    <br />
                    <br />
                    <span style={{ color: "red" }}>
                      Each product that is associated with this category will be
                      deleted!
                    </span>
                  </p>
                  <p
                    className="to-be-deleted-message"
                    style={{
                      fontSize: "20px",
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    To be deleted:{" "}
                    {productsToDelete.length > 0 ? (
                      productsToDelete.map((product, index) => (
                        <span key={index}>
                          "{product.name}"
                          {index < productsToDelete.length - 1 ? ", " : ""}
                        </span>
                      ))
                    ) : (
                      <span>No products found.</span>
                    )}
                  </p>
                  <div className="delete-btn-container">
                    <button
                      onClick={() =>
                        handleDeleteCategory(
                          categoryToDelete,
                          setCategories,
                          currentCategories,
                          setCurrentPage,
                          currentPage,
                          setShowDeletePopup,
                          setProducts
                        )
                      }
                      className="delete-confirm-btn"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </Popup>
          )}
        </div>
      )}
      {sessionExpired && <SessionExpiryRedirect trigger={sessionExpired} />}
    </div>
  );
};

export default Category;
