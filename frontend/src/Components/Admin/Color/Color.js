import React, { useState, useEffect } from "react";
import AdminNavbar from "../Components/AdminNavbar.js";
import Popup from "../../Helpers/PopUp/PopUp.js";
import AddColorForm from "./Components/AddColorForm.js";
import UpdateColorForm from "./Components/UpdateColorForm.js";
import fetchColors from "./Functions/fetchColors.js";
import handleDeleteColor from "./Functions/handleDeleteColor.js";
import {
  handleAddNewClick,
  handleClosePopup,
} from "../Functions/handlePopups.js";
import handleSearchChange from "../Functions/handleSearch.js";
import {
  handlePreviousPage,
  handleNextPage,
} from "../Functions/handlePagination.js";
import handleAddColor from "./Functions/handleAddColor.js";
import handleUpdateColor from "./Functions/handleUpdateColor.js";
import ColorTable from "./Components/ColorTable.js";
import Pagination from "../Components/Pagination.js";
import ErrorMessage from "../../Helpers/ErrorMessage.js";
import SessionExpiryRedirect from "../../Auth&Verify/SessionExpiryRedirect.js";
import Loading from "../../Loader/Loader.js";
import "../Category/Category.css";

const Color = () => {
  const [colors, setColors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [colorToDelete, setColorToDelete] = useState(null);
  const [colorToUpdate, setColorToUpdate] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const colorsPerPage = 5;

  const [highlightedColorsIds, setHighlightedColorsIds] = useState(() => {
    return JSON.parse(localStorage.getItem("highlightedIds")) || [];
  });

  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    fetchColors(setColors, setLoading);
  }, []);

  const filteredColors = colors.filter(
    (color) =>
      color.name &&
      color.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const indexOfLastColor = currentPage * colorsPerPage;
  const indexOfFirstColor = indexOfLastColor - colorsPerPage;
  const currentColors = filteredColors.slice(
    indexOfFirstColor,
    indexOfLastColor
  );

  const totalPages = Math.ceil(filteredColors.length / colorsPerPage);

  const handleHighlightComplete = (ids) => {
    const updatedIds = highlightedColorsIds.filter(
      (highlightId) => !ids.includes(highlightId)
    );
    setHighlightedColorsIds(updatedIds);
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
            <h1>Colors ({filteredColors.length})</h1>
            <p>Manage colors for your store</p>
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
              placeholder="Search by color name..."
              value={searchTerm}
              onChange={(e) =>
                handleSearchChange(e, setSearchTerm, setCurrentPage)
              }
            />
          </div>

          {filteredColors.length > 0 ? (
            <ColorTable
              currentColors={currentColors}
              confirmUpdateColor={(color) => {
                setColorToUpdate(color);
                setName(color.name);
                setValue(color.value);
                setShowUpdatePopup(true);
              }}
              confirmDeleteColor={(color) => {
                setColorToDelete(color);
                setShowDeletePopup(true);
              }}
              highlightedColorIds={highlightedColorsIds} 
              onHighlightComplete={handleHighlightComplete}
            />
          ) : (
            <p className="no-categories">
              {searchTerm
                ? "Such color doesn't exist..."
                : "No Colors added yet..."}
            </p>
          )}

            {filteredColors.length > 0 && <Pagination
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
              title="Create Color"
              isX="true"
            >
              <ErrorMessage message={errorMessage} />
              <AddColorForm
                onSubmit={(colorName, colorValue) =>
                  handleAddColor(
                    colorName,
                    colorValue,
                    setColors,
                    setShowPopup,
                    setErrorMessage,
                    setSessionExpired,
                    setHighlightedColorsIds
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
              title={`Update Color "${colorToUpdate?.name}"`}
              isX="true"
            >
              <p
                className="warning-message"
                style={{ fontSize: "20px", fontWeight: "bold", color: "red" }}
              >
                Changing the name of this color will affect all associated
                products.
              </p>
              <UpdateColorForm
                initialName={name}
                initialValue={value}
                onSubmit={(updatedName, updatedValue) =>
                  handleUpdateColor(
                    updatedName,
                    updatedValue,
                    colorToUpdate,
                    setColors,
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
              title="Delete Color"
              isX="true"
            >
              <p
                className="confirmation-message"
                style={{ fontSize: "20px", fontWeight: "bold" }}
              >
                Are you sure you want to delete the "{colorToDelete?.name}"
                color?
                <br />
                <br />
                <span style={{ color: "red" }}>
                  This color would be deleted from all products!
                </span>
              </p>
              <div className="delete-btn-container">
                <button
                  onClick={() =>
                    handleDeleteColor(
                      colorToDelete,
                      setColors,
                      setShowDeletePopup,
                      setErrorMessage,
                      setSessionExpired,
                      setLoading,
                      () => {

                        if (currentColors.length === 1 && currentPage > 1) {
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

export default Color;
