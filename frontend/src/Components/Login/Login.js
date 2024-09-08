import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth&Verify/UserAuth";
import Popup from "../Helpers/PopUp/PopUp.js";
import "./AuthPage.css";

const LoginForm = ({ email: initialEmail = "", togglePasswordVisibility, passwordVisible }) => {
  const [email, setEmail] = useState(initialEmail); 
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); 
  const [popupTitle, setPopupTitle] = useState("");
  const [popupDescription, setPopupDescription] = useState("");
  const [popupButtonText, setPopupButtonText] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
        credentials: "include"
      });

      const data = await response.json();
      if (response.ok) {
        login(data.user); 
        navigate("/");
      } else {
        if (data.message.includes("not found")) {
          setPopupTitle("Login Error");
          setPopupDescription("The user was not found. Please check your email.");
          setPopupButtonText("Close");
        } else if (data.message.includes("Invalid password")) {
          setPopupTitle("Login Error");
          setPopupDescription("The password you entered is incorrect.");
          setPopupButtonText("Close");
        } else {
          setPopupTitle("Login Error");
          setPopupDescription("An unexpected error occurred. Please try again.");
          setPopupButtonText("Close");
        }
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setPopupTitle("Login Error");
      setPopupDescription("An unexpected error occurred. Please try again.");
      setPopupButtonText("Close");
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="auth-input-holder">
          <input
            type="text"
            id="login-email"
            className="auth-details-input"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="login-email" className="auth-details-label">
            Email
          </label>
        </div>
        <div className="auth-input-holder">
          <input
            type={passwordVisible ? "text" : "password"}
            id="login-password"
            className="auth-details-input"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="login-password" className="auth-details-label">
            Password
          </label>
          <span
            className="auth-password-toggle-icon"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? "🙈" : "👁️"}
          </span>
        </div>
        <div className="auth-input-holder">
          <input
            type="checkbox"
            id="remember-me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember-me" className="remember-me-label">
            Remember Me For 30 Days
          </label>
        </div>
        <button type="submit" className="auth-button">
          Login
        </button>
      </form>

      {showPopup && (
        <Popup
          onClose={handleClosePopup}
          title={popupTitle}
          description={popupDescription}
          buttonText={popupButtonText}
          isX={true}
        />
      )}
    </>
  );
};

export default LoginForm;