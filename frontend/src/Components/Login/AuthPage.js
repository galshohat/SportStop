import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import LoginForm from "../Login/Login";
import SignupForm from "./Signup.js";
import Smiley from "../Profile-photos/smiley.png";
import PacMan from "../Profile-photos/pacman.png";
import Person from "../Profile-photos/person.png";
import Shower from "../Profile-photos/shower.png";
import { usePasswordToggle } from "./authUtils.js";
import "./AuthPage.css";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [profilePicture, setProfilePicture] = useState("");
  const [loginEmail, setLoginEmail] = useState(""); 
  const [signupFormData, setSignupFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    street: "",
    city: "",
    country: "",
  }); 

  const { passwordVisible, togglePasswordVisibility } = usePasswordToggle();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const profilePictureHandler = (image) => {
    switch (image) {
      case "Smiley":
        setProfilePicture(Smiley);
        break;
      case "PacMan":
        setProfilePicture(PacMan);
        break;
      case "Person":
        setProfilePicture(Person);
        break;
      case "Shower":
        setProfilePicture(Shower);
        break;
      default:
        setProfilePicture("");
    }
  };

  return (
    <div className="auth-page-body">
      <Navbar isLoggedIn={false} />

      <div className="auth-page">
        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => handleTabClick("login")}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => handleTabClick("signup")}
          >
            Create Account
          </button>
        </div>

        <div className="auth-content">
          {activeTab === "login" ? (
            <LoginForm
              email={loginEmail}
              togglePasswordVisibility={togglePasswordVisibility}
              passwordVisible={passwordVisible}
            />
          ) : (
            <SignupForm
              profilePicture={profilePicture}
              profilePictureHandler={profilePictureHandler}
              togglePasswordVisibility={togglePasswordVisibility}
              passwordVisible={passwordVisible}
              setActiveTab={setActiveTab}
              setLoginEmail={setLoginEmail}
              formData={signupFormData} 
              setFormData={setSignupFormData} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;