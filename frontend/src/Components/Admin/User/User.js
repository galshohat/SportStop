import React, { useState, useEffect } from "react";
import AdminNavbar from "../Components/AdminNavbar";
import Popup from "../../Helpers/PopUp/PopUp.js";
import fetchUsers from "./Functions/fetchUsers";
import handleDeleteUser from "./Functions/handleDeleteUser";
import handleSearchChange from "../Functions/handleSearch";
import {
  handlePreviousPage,
  handleNextPage,
} from "../Functions/handlePagination";
import UserTable from "./Components/UserTable";
import Pagination from "../Components/Pagination";
import ErrorMessage from "../../Helpers/ErrorMessage.js";
import SessionExpiryRedirect from "../../Auth&Verify/SessionExpiryRedirect";
import Loading from "../../Loader/Loader";
import UserProfile from "./Components/UserProfile";
import "../Category/Category.css";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showUserProfilePopup, setShowUserProfilePopup] = useState(false); 
  const [selectedUserId, setSelectedUserId] = useState(null); 
  const [userToDelete, setUserToDelete] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers(setUsers, setLoading, setSessionExpired);
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name && user.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div>
      <AdminNavbar />
      {loading ? (
        <Loading />
      ) : (
        <div className="category-container">
          <div className="category-header">
            <h1>Users ({filteredUsers.length})</h1>
            <p>Manage users for your store</p>
          </div>
          <div className="category-search">
            <input
              type="text"
              placeholder="Search by user name..."
              value={searchTerm}
              onChange={(e) =>
                handleSearchChange(e, setSearchTerm, setCurrentPage)
              }
            />
          </div>
          {filteredUsers.length > 0 ? (
            <UserTable
              currentUsers={currentUsers}
              confirmDeleteUser={(user) => {
                setUserToDelete(user);
                setShowDeletePopup(true);
              }}
              onViewUserProfile={(userId) => {
                setSelectedUserId(userId);
                setShowUserProfilePopup(true);
              }}
            />
          ) : (
            <p className="no-categories">
              {searchTerm ? "Such user doesn't exist..." : "No Users found..."}
            </p>
          )}
            {filteredUsers.length > 0 && <Pagination
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
          {showDeletePopup && (
            <Popup
              onClose={() => setShowDeletePopup(false)}
              title="Delete User"
              isX="true"
            >
              <ErrorMessage message={errorMessage} />
              <p
                className="confirmation-message"
                style={{ fontSize: "20px", fontWeight: "bold" }}
              >
                Are you sure you want to delete the "{userToDelete?.name}"
                user?
                <br />
                <br />
                <span style={{ color: "red" }}>
                  This action cannot be undone and will remove the user from
                  your store.
                </span>
              </p>
              <div className="delete-btn-container">
                <button
                  onClick={() =>
                    handleDeleteUser(
                      userToDelete,
                      setUsers,
                      currentUsers,
                      setCurrentPage,
                      currentPage,
                      setShowDeletePopup,
                      setSessionExpired,
                      setLoading,
                      setErrorMessage
                    )
                  }
                  className="delete-confirm-btn"
                >
                  Delete
                </button>
              </div>
            </Popup>
          )}
          {showUserProfilePopup && (
            <UserProfile
              onClose={() => setShowUserProfilePopup(false)}
              userId={selectedUserId} 
              setSessionExpired={setSessionExpired}
            />
          )}
        </div>
      )}
      {sessionExpired && <SessionExpiryRedirect trigger={sessionExpired} />}
    </div>
  );
};

export default UserPage;
