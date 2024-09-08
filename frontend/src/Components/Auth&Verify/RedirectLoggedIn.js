import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../Helpers/PopUp/PopUp.js";
import { AuthContext } from "./UserAuth.js";

const RedirectIfLoggedIn = ({ children }) => {
  const isLoggedIn = useContext(AuthContext).isLoggedIn
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate("/"); 
  };

  if (isLoggedIn) {
    if (!showPopup) {
      setShowPopup(true);
    }

    return (
      <>
        {showPopup && (
          <Popup
            onClose={handleClosePopup}
            title="Already Logged In"
            description="You are already logged in. Redirecting to the homepage."
            buttonText="Go to Home"
          />
        )}
      </>
    );
  }

  return children;
};

export default RedirectIfLoggedIn;
