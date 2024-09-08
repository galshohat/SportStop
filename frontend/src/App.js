import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "./NotFound.js";
import ReadmePage from "./Components/Readme/Readme.js";
import Home from "./Components/Home/Home.js";
import AuthPage from "./Components/Login/AuthPage.js";
import Overview from "./Components/Admin/Overview/Overview.js";
import { AuthProvider } from "./Components/Auth&Verify/UserAuth.js";
import { DataProvider } from "./Components/Auth&Verify/DataContext.js";
import RedirectIfLoggedIn from "./Components/Auth&Verify/RedirectLoggedIn.js";
import RedirectIfNotLoggedIn from "./Components/Auth&Verify/RedirectIfNotLoggedIn.js";
import AdminRoute from "./Components/Auth&Verify/AdminRoute.js";
import EditAccount from "./Components/EditAccount/EditAccount.js";
import Category from "./Components/Admin/Category/Category.js";
import Product from "./Components/Admin/Product/Product.js";
import Size from "./Components/Admin/Size/Size.js";
import Color from "./Components/Admin/Color/Color.js";
import User from "./Components/Admin/User/User.js";
import Cart from "./Components/Cart/Cart.js";
import OrderPage from "./Components/Orders/Orders.js";
import StarsPage from "./Components/Stars/Stars.js";
import Order from "./Components/Admin/Order/Order.js";
import Currency from "./Components/Currency/MainComponent.js";
import SearchResultsPage from "./Components/Search/SearchResults.js";
import QuestionsPage from "./Components/LLM/QuestionsPage.js";
const App = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/auth"
            element={
              <RedirectIfLoggedIn>
                <AuthPage />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/currency"
            element={
              <RedirectIfNotLoggedIn>
                <Currency />
              </RedirectIfNotLoggedIn>
            }
          />
          <Route path="/llm" element={<QuestionsPage />} />
          <Route path="/search-results" element={<SearchResultsPage />} />

          <Route path="/currency" element={<Currency />} />
          <Route
            path="/cart"
            element={
              <RedirectIfNotLoggedIn>
                <Cart />
              </RedirectIfNotLoggedIn>
            }
          />
          <Route
            path="/order"
            element={
              <RedirectIfNotLoggedIn>
                <OrderPage />
              </RedirectIfNotLoggedIn>
            }
          />
          <Route
            path="/edit-account"
            element={
              <RedirectIfNotLoggedIn>
                <EditAccount />
              </RedirectIfNotLoggedIn>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Overview />w
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <Category />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <Product />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/sizes"
            element={
              <AdminRoute>
                <Size />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/colors"
            element={
              <AdminRoute>
                <Color />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <User />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <Order />
              </AdminRoute>
            }
          />

          <Route
            path="/stars"
            element={
              <RedirectIfNotLoggedIn>
                <StarsPage />
              </RedirectIfNotLoggedIn>
            }
          />
          <Route
            path="/auth"
            element={
              <RedirectIfLoggedIn>
                <AuthPage />
              </RedirectIfLoggedIn>
            }
          />
          <Route path="/readme" element={<ReadmePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
