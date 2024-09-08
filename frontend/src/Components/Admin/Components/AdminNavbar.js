import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Avatar,
  IconButton,
  Box,
} from "@mui/material";
import {
  ColorLens,
  Group,
  Straighten,
  Category,
  BarChart,
  Inventory,
  ShoppingBag,
} from "@mui/icons-material";
import "../../Navbar/Navbar.css";
import logo from "../../../navbar-logo.png";
import { useNavigate } from "react-router-dom";
import UserMenu from "../../Navbar/UserMenu.js";
import { AuthContext } from "../../Auth&Verify/UserAuth.js";

const AdminNavbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    const response = await fetch("http://localhost:8000/api/v1/users/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.text();

    if (!response.ok) {
      console.log("Error:", data);
    } else {
      console.log("Data:", data);
    }
    logout();
    navigate("/auth");
  };

  const handleLogoClick = () => navigate("/");

  const navigateTo = (path) => () => navigate(path);

  return (
    <AppBar position="static">
      <Toolbar className="navbar" sx={{ minWidth: "320px" }}>
        <img
          src={logo}
          alt="Admin Panel"
          className="navbar-logo"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        />
        <Box className="admin-nav-buttons" sx={{ flexGrow: 1 }}>
          <Button
            onClick={navigateTo("/admin")}
            className="nav-button"
            color="inherit"
            sx={{
              textTransform: "none",
              gap: 1,
              border: "1px solid transparent",
              borderRadius: "10px"
            }}
          >
            <BarChart />
            Overview
          </Button>
          <Button
            onClick={navigateTo("/admin/categories")}
            className="nav-button"
            color="inherit"
            sx={{
              textTransform: "none",
              gap: 1,
              border: "1px solid transparent",
              borderRadius: "10px"
            }}
          >
            <Category />
            Categories
          </Button>
          <Button
            onClick={navigateTo("/admin/sizes")}
            className="nav-button"
            color="inherit"
            sx={{
              textTransform: "none",
              gap: 1,
              border: "1px solid transparent",
              borderRadius: "10px"
            }}
          >
            <Straighten />
            Sizes
          </Button>
          <Button
            onClick={navigateTo("/admin/colors")}
            className="nav-button"
            color="inherit"
            sx={{
              textTransform: "none",
              gap: 1,
              border: "1px solid transparent",
              borderRadius: "10px"
            }}
          >
            <ColorLens />
            Colors
          </Button>
          <Button
            onClick={navigateTo("/admin/products")}
            className="nav-button"
            color="inherit"
            sx={{
              textTransform: "none",
              gap: 1,
              border: "1px solid transparent",
              borderRadius: "10px"
            }}
          >
            <Inventory />
            Products
          </Button>
          <Button
            onClick={navigateTo("/admin/users")}
            className="nav-button"
            color="inherit"
            sx={{
              textTransform: "none",
              gap: 1,
              border: "1px solid transparent",
              borderRadius: "10px"
            }}
          >
            <Group />
            Users
          </Button>
          <Button
            onClick={navigateTo("/admin/orders")}
            className="nav-button"
            color="inherit"
            sx={{
              textTransform: "none",
              gap: 1,
              border: "1px solid transparent",
              borderRadius: "10px"
            }}
          >
            <ShoppingBag />
            Orders
          </Button>
        </Box>
        <Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleProfileMenuOpen}
          >
            <Avatar alt={userInfo.name} src={userInfo.profilePicture} />
          </IconButton>
          <UserMenu
            anchorEl={anchorEl}
            handleMenuClose={handleMenuClose}
            handleLogout={handleLogout}
            user={userInfo}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
