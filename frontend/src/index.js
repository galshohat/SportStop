import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./Components/Auth&Verify/UserAuth.js";
import { ProductProvider } from "./Components/Auth&Verify/ProductContext.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AuthProvider>
      <ProductProvider>
        <Router>
          <App />
        </Router>
      </ProductProvider>
    </AuthProvider>
);
