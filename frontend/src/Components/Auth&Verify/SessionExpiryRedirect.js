import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../Helpers/PopUp/PopUp.js";
import { AuthContext } from "./UserAuth.js";

const SessionExpiryRedirect = ({ trigger }) => {
  const [showPopup, setShowPopup] = useState(true);
  const { logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleClosePopup = async () => {
    setShowPopup(false);
    const response = await fetch("http://localhost:8000/api/v1/users/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });

    const data = await response.text();

    if (!response.ok) {
      console.log("Error:", data);
    } else {
      console.log("Data:", data);
    }
    logout();
    navigate("/auth");
  };

  return (
    <>
      {showPopup && (
        <Popup
          onClose={handleClosePopup}
          title="Session Expired"
          description="Your session has expired. Please log in again."
          buttonText="Go to Login"
        />
      )}
    </>
  );
};

export default SessionExpiryRedirect;
