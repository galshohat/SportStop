import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../Helpers/PopUp/PopUp.js";
import { AuthContext } from "./UserAuth.js"; 
import SessionExpiryRedirect from "./SessionExpiryRedirect.js"

const AdminRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [sessionExpired, setSessionExpiry] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/admin", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        } else {
          if (response.status === 401) {
            setSessionExpiry(true);
            return;
          }
          setIsAdmin(false);
          setShowPopup(true);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setShowPopup(true);
      }
    };

    if (isLoggedIn) {
      checkAdminStatus();
    } else {
      setShowPopup(true);
    }
  }, [isLoggedIn]);

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate("/");
  };

  if (!isAdmin) {
    return (
      <>
        {showPopup && (
          <Popup
            onClose={handleClosePopup}
            title="Access Denied"
            description="You are not authorized to access this page."
            buttonText="Go to Home"
          />
        )}
         {sessionExpired && <SessionExpiryRedirect trigger={sessionExpired} />}
      </>
    );
  }

  return children;
};

export default AdminRoute;