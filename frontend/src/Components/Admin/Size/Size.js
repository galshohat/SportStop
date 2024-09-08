import React, { useState, useEffect } from "react";
import AdminNavbar from "../Components/AdminNavbar.js";
import Popup from "../../Helpers/PopUp/PopUp.js";
import AddSizeForm from "./Components/AddSize.js";
import UpdateSizeForm from "./Components/UpdateSize.js";
import fetchSizes from "./Functions/fetchSizes.js";
import handleDeleteSize from "./Functions/handleDeleteSize.js";
import {
  handleAddNewClick,
  handleClosePopup,
} from "../Functions/handlePopups.js";
import handleSearchChange from "../Functions/handleSearch.js";
import {
  handlePreviousPage,
  handleNextPage,
} from "../Functions/handlePagination.js";
import handleAddSize from "./Functions/handleAddSize.js";
import handleUpdateSize from "./Functions/handleUpdateSize.js";
import SizeTable from "./Components/SizeTable.js";
import Pagination from "../Components/Pagination.js";
import ErrorMessage from "../../Helpers/ErrorMessage.js";
import SessionExpiryRedirect from "../../Auth&Verify/SessionExpiryRedirect.js";
import Loading from "../../Loader/Loader.js";
import "../Category/Category.css";

const Size = () => {
  const [sizes, setSizes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [sizeToDelete, setSizeToDelete] = useState(null);
  const [sizeToUpdate, setSizeToUpdate] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedSizeIds, setHighlightedSizeIds] = useState(() => {
    return JSON.parse(localStorage.getItem("highlightedIds")) || [];
  });
  const sizesPerPage = 5;

  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    fetchSizes(setSizes, setLoading);
  }, []);

  const filteredSizes = sizes.filter(
    (size) =>
      size.name && size.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const indexOfLastSize = currentPage * sizesPerPage;
  const indexOfFirstSize = indexOfLastSize - sizesPerPage;
  const currentSizes = filteredSizes.slice(indexOfFirstSize, indexOfLastSize);

  const totalPages = Math.ceil(filteredSizes.length / sizesPerPage);

  const handleHighlightComplete = (ids) => {
    const updatedIds = highlightedSizeIds.filter(
      (highlightId) => !ids.includes(highlightId)
    );
    setHighlightedSizeIds(updatedIds);
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
            <h1>Sizes ({filteredSizes.length})</h1>
            <p>Manage sizes for your store</p>
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
              placeholder="Search by size name..."
              value={searchTerm}
              onChange={(e) =>
                handleSearchChange(e, setSearchTerm, setCurrentPage)
              }
            />
          </div>

          {filteredSizes.length > 0 ? (
            <SizeTable
              currentSizes={currentSizes}
              confirmUpdateSize={(size) => {
                setSizeToUpdate(size);
                setName(size.name);
                setValue(size.value);
                setShowUpdatePopup(true);
              }}
              confirmDeleteSize={(size) => {
                setSizeToDelete(size);
                setShowDeletePopup(true);
              }}
              highlightedSizeIds={highlightedSizeIds}
              onHighlightComplete={handleHighlightComplete}
            />
          ) : (
            <p className="no-categories">
              {searchTerm
                ? "Such size doesn't exist..."
                : "No Sizes added yet..."}
            </p>
          )}

            {filteredSizes.length > 0 && <Pagination
              currentPage={currentPage}
              handlePreviousPage={() =>
                handlePreviousPage(currentPage, setCurrentPage)
              }
              handleNextPage={() =>
                handleNextPage(currentPage, setCurrentPage, totalPages)
              }
              totalPages={totalPages}
              disableNext={currentPage >= totalPages || totalPages === 0}
            />}

          {showPopup && (
            <Popup
              onClose={() =>
                handleClosePopup(
                  setShowPopup,
                  setShowDeletePopup,
                  setShowUpdatePopup
                )
              }
              title="Create Size"
              isX="true"
            >
              <ErrorMessage message={errorMessage} />
              <AddSizeForm
                onSubmit={(sizeName, sizeValue) =>
                  handleAddSize(
                    sizeName,
                    sizeValue,
                    setSizes,
                    setShowPopup,
                    setErrorMessage,
                    setSessionExpired,
                    setHighlightedSizeIds
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
              title={`Update Size "${sizeToUpdate?.name}"`}
              isX="true"
            >
              <p
                className="warning-message"
                style={{ fontSize: "20px", fontWeight: "bold", color: "red" }}
              >
                Changing the name of this size will affect all associated
                products.
              </p>
              <UpdateSizeForm
                initialName={name}
                initialValue={value}
                onSubmit={(updatedName, updatedValue) =>
                  handleUpdateSize(
                    updatedName,
                    updatedValue,
                    sizeToUpdate,
                    setName,
                    setValue,
                    setSizes,
                    setShowUpdatePopup,
                    setErrorMessage,
                    setSessionExpired,
                    setLoading
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
              title="Delete Size"
              isX="true"
            >
              <p
                className="confirmation-message"
                style={{ fontSize: "20px", fontWeight: "bold" }}
              >
                Are you sure you want to delete the "{sizeToDelete?.name}" size?
                <br />
                <br />
                <span style={{ color: "red" }}>
                  This size would be deleted from all products!
                </span>
              </p>
              <div className="delete-btn-container">
                <button
                  onClick={() =>
                    handleDeleteSize(
                      sizeToDelete,
                      setName,
                      setValue,
                      setSizes,
                      setShowDeletePopup,
                      setErrorMessage,
                      setSessionExpired,
                      () => {
                        if (currentSizes.length === 1 && currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                        }
                      }
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

export default Size;
