import React, { useState } from "react";
import Navbar from "../Navbar/Navbar.js";
import "./Signup.css";
import logo from "../../navbar-logo.png";
import PacMan from "../Profile-photos/pacman.png";
import Smiley from "../Profile-photos/smiley.png";
import Person from "../Profile-photos/person.png";
import Shower from "../Profile-photos/shower.png";
import NoScrollWrapper from "../Helpers/NoScrollWrapper.js"
import MinWidthWrapper from "../Helpers/MinWidthWrapper.js";

const Signup = () => {
  const [isLoggedIn, SetIsLoggedIn] = useState(false); // Change to false to test logged-out state
  const [profilePicture, setProfilePicture] = useState(""); // State for profile picture
  const user = {
    name: "John Doe",
    profilePicture: "https://via.placeholder.com/150",
    balance: 0,
    currency: "$",
  };
  const cartItemCount = 1;

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
      <div>
        <MinWidthWrapper/>
        <NoScrollWrapper />
      <Navbar
        isLoggedIn={isLoggedIn}
        user={user}
        cartItemCount={cartItemCount}
      />
      <div class="flex-container">
        <div class="container clearfix">
          <div id="image">
            <img src={logo} alt="logo photo" id="logo" />
          </div>
          <h1>Sign up to shop</h1>
          <form method="post">
            <div id="details">
              <div className="input-holder">
                <input
                  type="text"
                  id="name"
                  className="details-input"
                  required
                />
                <label for="name" className="details-label">
                  Full Name
                </label>
              </div>
              <div className="input-holder">
                <input
                  type="email"
                  id="email"
                  className="details-input"
                  required
                />
                <label for="email" className="details-label">
                  Email
                </label>
              </div>
              <div className="input-holder">
                <input
                  type="password"
                  id="password"
                  className="details-input"
                  required
                />
                <label for="password" className="details-label">
                  Password
                </label>
              </div>
              <div className="input-holder">
                <input
                  type="text"
                  id="phone"
                  className="details-input"
                  required
                />
                <label for="phone" className="details-label">
                  Phone
                </label>
              </div>
              <div className="input-holder">
                <input
                  type="text"
                  id="country"
                  className="details-input"
                  required
                />
                <label for="country" className="details-label">
                  Country
                </label>
              </div>
              <div className="input-holder">
                <input
                  type="text"
                  id="city"
                  className="details-input"
                  required
                />
                <label for="city" className="details-label">
                  City
                </label>
              </div>
              <div className="input-holder">
                <input
                  type="text"
                  id="street"
                  className="details-input"
                  required
                />
                <label for="street" className="details-label">
                  Street
                </label>
              </div>
            </div>
            <div id="profile-picture">
              <h3>Choose Profile Photo:</h3>
              <input
                type="radio"
                onChange={() => profilePictureHandler("Smiley")}
                id="smiley"
                className="choose-photo-input"
                name="photo"
                value="smiley"
              />
              <label for="smiley" className="choose-photo-label">
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
              <label for="person" className="choose-photo-label">
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
              <label for="pacman" className="choose-photo-label">
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
              <label for="shower" className="choose-photo-label">
                Shower
              </label>
              <br />
              <div id="profile-picture-holder">
                <img src={profilePicture} id="profile-image" />
              </div>
            </div>
            <div id="button-div">
              <button type="submit" id="submit-button">
                Sign Up
              </button>
            </div>
          </form>
        </div>
        <div id="background-div"></div>
      </div>
    </div>
  );
};

export default Signup;
