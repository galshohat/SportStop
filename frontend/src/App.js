import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home/Home.js";
import Signup from "./Components/Signup/Signup.js";

const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};

export default App;
