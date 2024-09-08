import React, { useState } from "react";
import { useValidation } from "./authUtils.js";
import Popup from "../Helpers/PopUp/PopUp.js";

const Signup = ({
  profilePictureHandler,
  profilePicture,
  passwordVisible,
  togglePasswordVisibility,
  setActiveTab,
  setLoginEmail,
  formData,
  setFormData,
}) => {
  const {
    email,
    isEmailValid,
    emailTouched,
    setEmailTouched,
    handleEmailChange,
    handleEmailBlur,
    password,
    isPasswordLongEnough,
    hasCapitalAndNumber,
    passwordTouched,
    handlePasswordChange,
    handlePasswordBlur,
    setPasswordTouched,
    validatePhoneNumber
  } = useValidation();

  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupDescription, setPopupDescription] = useState("");
  const [popupButtonText, setPopupButtonText] = useState("");

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailValid || !isPasswordLongEnough || !hasCapitalAndNumber) {
      setEmailTouched(true);
      setPasswordTouched(true);
      setPopupTitle("Invalid Input");
      setPopupDescription(
        "Please ensure your email and password meet the requirements."
      );
      setPopupButtonText("Close");
      setShowPopup(true);
      return;
    }

    if (!profilePicture) {
      setPopupTitle("No Profile Picture");
      setPopupDescription("Please choose a profile picture before signing up.");
      setPopupButtonText("Close");
      setShowPopup(true);
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      setPopupTitle("Phone is not valid");
      setPopupDescription("Please put a 10 digit number.");
      setPopupButtonText("Close");
      setShowPopup(true);
      return;
    }

    const formDataToSubmit = {
      name: formData.name,
      email: formData.email,
      password: password,
      phone: formData.phone,
      street: formData.street,
      city: formData.city,
      country: formData.country,
      profilePicture: profilePicture,
    };

    try {
      const emailCheckResponse = await fetch(
        `http://localhost:8000/api/v1/users/check-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formDataToSubmit.email }),
          credentials: "include",
        }
      );

      if (emailCheckResponse.ok) {
        const emailExists = await emailCheckResponse.json();

        if (emailExists.exists) {
          setPopupTitle("Email Already Exists");
          setPopupDescription(
            "The email you entered is already registered. Please use a different email address."
          );
          setPopupButtonText("Close");
          setShowPopup(true);
          return;
        }
      } else {
        console.error("Failed to check email:", emailCheckResponse.statusText);
        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/v1/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataToSubmit),
        }
      );

      if (response.ok) {
        setPopupTitle("Success!");
        setPopupDescription(
          "You have successfully signed up. Please proceed to login."
        );
        setPopupButtonText("Proceed to Login");
        setShowPopup(true);
        setLoginEmail(formDataToSubmit.email);
        setActiveTab("login");
      } else {
        const errorData = await response.json();
        let errorMessage = "There was an error signing up. Please try again.";

        if (errorData.message === "A user with this email already exists.") {
          errorMessage =
            "This email is already in use. Please try with a different email.";
        } else if (
          errorData.message === "A user with this name already exists."
        ) {
          errorMessage =
            "This username is already taken. Please choose a different name.";
        }

        setPopupTitle("Signup Failed");
        setPopupDescription(errorMessage);
        setPopupButtonText("Close");
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setPopupTitle("Signup Error");
      setPopupDescription("There was an error signing up. Please try again.");
      setPopupButtonText("Close");
      setShowPopup(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="auth-input-holder">
          <input
            type="text"
            id="name"
            name="name"
            className="auth-details-input"
            placeholder=" "
            required
            value={formData.name}
            onChange={handleChange}
          />
          <label htmlFor="name" id="name-label" className="auth-details-label">
            Username
          </label>
        </div>

        <div className="input-row email-password-row">
          <div className="auth-input-holder email-input">
            <input
              type="text"
              id="email"
              name="email"
              className="auth-details-input"
              value={formData.email}
              onChange={(e) => {
                handleChange(e);
                handleEmailChange(e);
              }}
              onBlur={handleEmailBlur}
              placeholder=" "
              required
            />
            <label
              htmlFor="email"
              id="email-label"
              className="auth-details-label"
            >
              Email
            </label>
            <br />
            <span
              className={`email-validation-message ${
                emailTouched ? (isEmailValid ? "valid" : "invalid") : "initial"
              }`}
            >
              <span className="validation-icon">
                {emailTouched && email !== ""
                  ? isEmailValid
                    ? "✔️"
                    : "❌"
                  : "✔️"}
              </span>
              Valid email address
            </span>
          </div>

          <div className="auth-input-holder password-input">
            <div className="password-input-container">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                className="auth-details-input"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                placeholder=" "
                required
              />
              <label
                htmlFor="password"
                id="password-label"
                className="auth-details-label"
              >
                Password
              </label>
              <span
                className="auth-password-toggle-icon"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? "🙈" : "👁️"}
              </span>
            </div>
            <span
              className={`password-validation-message ${
                passwordTouched
                  ? isPasswordLongEnough
                    ? "valid"
                    : "invalid"
                  : "initial"
              }`}
            >
              <span className="validation-icon">
                {passwordTouched && password !== ""
                  ? isPasswordLongEnough
                    ? "✔️"
                    : "❌"
                  : "✔️"}
              </span>
              At least 8 characters
            </span>
            <br />
            <span
              className={`password-validation-message ${
                passwordTouched
                  ? hasCapitalAndNumber
                    ? "valid"
                    : "invalid"
                  : "initial"
              }`}
            >
              <span className="validation-icon">
                {passwordTouched && password !== ""
                  ? hasCapitalAndNumber
                    ? "✔️"
                    : "❌"
                  : "✔️"}
              </span>
              At least one capital letter and one number
            </span>
          </div>
        </div>

        <div className="input-row phone-country-row">
          <div className="auth-input-holder phone-input">
            <input
              type="text"
              id="phone"
              name="phone"
              className="auth-details-input"
              placeholder=" "
              required
              value={formData.phone}
              onChange={handleChange}
            />
            <label
              htmlFor="phone"
              id="phone-label"
              className="auth-details-label"
            >
              Phone
            </label>
          </div>

          <div className="auth-input-holder country-input">
            <input
              type="text"
              id="country"
              name="country"
              className="auth-details-input"
              placeholder=" "
              value={formData.country}
              onChange={handleChange}
            />
            <label
              htmlFor="country"
              id="country-label"
              className="auth-details-label"
            >
              Country
            </label>
            <span className="optional-span">optional</span>
          </div>
        </div>

        <div className="input-row city-street-row">
          <div className="auth-input-holder city-input">
            <input
              type="text"
              id="city"
              name="city"
              className="auth-details-input"
              placeholder=" "
              value={formData.city}
              onChange={handleChange}
            />
            <label
              htmlFor="city"
              id="city-label"
              className="auth-details-label"
            >
              City
            </label>
            <span className="optional-span">optional</span>
          </div>

          <div className="auth-input-holder street-input">
            <input
              type="text"
              id="street"
              name="street"
              className="auth-details-input"
              placeholder=" "
              value={formData.street}
              onChange={handleChange}
            />
            <label
              htmlFor="street"
              id="street-label"
              className="auth-details-label"
            >
              Street
            </label>
            <span className="optional-span">optional</span>
          </div>
        </div>

        <h3
          style={{ paddingLeft: "7vw", marginTop: "5vh", fontSize: "1.5rem" }}
        >
          Choose Profile Photo:
        </h3>
        <div
          className="profile-picture-options"
          style={{ paddingLeft: "7vw", fontSize: "1.2rem" }}
        >
          <input
            type="radio"
            onChange={() => profilePictureHandler("Smiley")}
            id="smiley"
            className="choose-photo-input"
            name="photo"
            value="smiley"
          />
          <label htmlFor="smiley" className="choose-photo-label">
            Smiley
          </label>
          <br />
          <input
            type="radio"
            onChange={() => profilePictureHandler("Person")}
            id="person"
            className="choose-photo-input"
            name="photo"
            value="person"
          />
          <label htmlFor="person" className="choose-photo-label">
            Person
          </label>
          <br />
          <input
            type="radio"
            onChange={() => profilePictureHandler("PacMan")}
            id="pacman"
            className="choose-photo-input"
            name="photo"
            value="pacman"
          />
          <label htmlFor="pacman" className="choose-photo-label">
            Pac-Man
          </label>
          <br />
          <input
            type="radio"
            onChange={() => profilePictureHandler("Shower")}
            id="shower"
            className="choose-photo-input"
            name="photo"
            value="shower"
          />
          <label htmlFor="shower" className="choose-photo-label">
            Shower
          </label>
        </div>

        {profilePicture && (
          <div id="profile-picture-holder">
            <img src={profilePicture} id="profile-image" alt="profile" />
          </div>
        )}

        <button type="submit" className="auth-button">
          Sign Up
        </button>
      </form>
      
      {showPopup && (
        <Popup
          onClose={handleClosePopup}
          title={popupTitle}
          description={popupDescription}
          buttonText={popupButtonText}
        />
      )}
    </>
  );
};

export default Signup;
