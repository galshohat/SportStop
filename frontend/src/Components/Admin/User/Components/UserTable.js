import React from "react";
import { Delete, AccountCircle } from "@mui/icons-material";

const UserTable = ({ currentUsers, confirmDeleteUser, onViewUserProfile }) => {
  return (
    <table className="category-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Activity / Delete</th>
        </tr>
      </thead>
      <tbody>
        {currentUsers.map((user, index) => (
          <tr key={index}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td className="action-buttons-cell">
              <div className="action-buttons">
                <AccountCircle
                  className="info-icon"
                  style={{ color: "var(--main-bg-color)", cursor: "pointer" }}
                  onClick={() => onViewUserProfile(user._id)}
                />
                <Delete
                  className="delete-icon"
                  onClick={() => confirmDeleteUser(user)}
                  style={{
                    color: "red",
                    cursor: "pointer",
                    marginLeft: "0.25vw",
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

export default UserTable;