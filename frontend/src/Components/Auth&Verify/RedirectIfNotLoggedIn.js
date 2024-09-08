import React, { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../Helpers/PopUp/PopUp.js";
import { AuthContext } from "./UserAuth.js";

const RedirectIfNotLoggedIn = ({ children }) => {
  const isLoggedIn = useContext(AuthContext).isLoggedIn
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate("/auth");
  };

  if (!isLoggedIn) {
    if (!showPopup) {
      setShowPopup(true);
    }
    
    return (
      <>
        {showPopup && (
          <Popup
            onClose={handleClosePopup}
            title="Not Logged In"
            description="You must be logged in to access this page. Redirecting to the login page."
            buttonText="Go to Login"
          />
        )}
      </>
    );
  }

  return children;
};

export default RedirectIfNotLoggedIn;