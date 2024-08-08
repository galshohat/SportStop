import React, { useState } from "react";
import Navbar from "../Navbar/Navbar.js";
import "./Home.css"

const Home = () => {
  const [isLoggedIn,SetIsLoggedIn] = useState(false); // Change to false to test logged-out state
  const user = {
    name: "John Doe",
    profilePicture: "https://via.placeholder.com/150",
    balance: 0,
    currency: "$"
  };
  const cartItemCount = 1;
  // home screen
  return (
    <div>
      <Navbar
        isLoggedIn={isLoggedIn}
        user={user}
        cartItemCount={cartItemCount}
      />
      <div>
        <h1>Welcome to SportStop</h1> 
      </div>
    </div>
  );
};

export default Home;
