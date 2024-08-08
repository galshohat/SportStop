import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  TextField,
  Box,
  Autocomplete,
  InputAdornment,
  Typography,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  ShoppingCart,
  Search,
  AccountCircle,
  Logout,
  Lightbulb,
  Money,
  Upload,
  LockOpen,
  AccountBalance,
} from "@mui/icons-material";
import "./Navbar.css";
import logo from "../../navbar-logo.png"; // Updated path to the logo
import { useNavigate } from "react-router-dom";

const products = [
  { name: "Football", category: "Football" },
  { name: "Basketball", category: "Basketball" },
  { name: "Tennis Racket", category: "Tennis" },
  { name: "Running Shoes", category: "Running" },
  { name: "Baseball Bat", category: "Baseball" },
  { name: "Swimming Goggles", category: "Swimming" },
  // Add more products as needed
];

const categories = [
  { label: "All", value: "all" },
  { label: "Football", value: "Football" },
  { label: "Basketball", value: "Basketball" },
  { label: "Tennis", value: "Tennis" },
  { label: "Running", value: "Running" },
  { label: "Baseball", value: "Baseball" },
  { label: "Swimming", value: "Swimming" },
  // Add more categories as needed
];

const Navbar = ({ isLoggedIn, user, cartItemCount }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate()

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = async () => {
    await new Promise(r => setTimeout(r, 50));
    setAnchorEl(null);
  };

  const handleSearchChange = (event, newValue) => {
    setSearchValue(newValue);
  };

  const handleOptionSelect = (event, newValue) => {
    if (newValue && newValue.name) {
      setSearchValue(newValue.name);
    }
  };

  const SignupClick = () => {
    navigate('/signup')
  }

  const options =
    searchValue === ""
      ? [{ label: "Shop by Categories", type: "comment" }, ...categories]
      : products.filter((product) =>
          product.name.toLowerCase().includes(searchValue.toLowerCase())
        );

  const renderOption = (props, option) => {
    if (option.type === "comment") {
      return (
        <li
          {...props}
          style={{
            fontStyle: "italic",
            fontWeight: "bold",
            color: "gray",
            pointerEvents: "none",
          }}
        >
          {option.label}
        </li>
      );
    } else if (option.value) {
      return (
        <li {...props} style={{ fontStyle: "italic" }}>
          {option.label}
        </li>
      );
    } else {
      return (
        <ListItem
          {...props}
          secondaryAction={
            <Typography variant="body2" sx={{ color: "gray" }}>
              {option.category}
            </Typography>
          }
        >
          <ListItemText primary={option.name} />
        </ListItem>
      );
    }
  };

  const menuId = "primary-search-account-menu";

  return (
    <AppBar position="static">
      <Toolbar className="navbar" sx={{ minWidth: '320px' }}>
        <img src={logo} alt="SportStop" className="navbar-logo" />
        <Box
          className="search-wrapper"
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            maxWidth: "1000px"
          }}
        >
          <Autocomplete
            options={options}
            getOptionLabel={(option) => option.label || option.name}
            inputValue={searchValue}
            onInputChange={handleSearchChange}
            onChange={handleOptionSelect}
            freeSolo
            renderOption={renderOption}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search…"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "white" }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  style: { color: "white" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 40,
                    color: "white",
                    "& fieldset": {
                      borderColor: "white"
                    },
                    "&:hover fieldset": {
                      borderColor: "white"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white"
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "white"
                  },
                }}
              />
            )}
            sx={{ flexGrow: 1 }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginLeft: "auto",
          }}
        >
          {!isLoggedIn ? (
            <>
              <Button onClick={SignupClick}
                className="nav-button"
                color="inherit"
                sx={{
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  border: "1px solid transparent",
                  "&:hover": { variant: "outlined" },
                  whiteSpace: "nowrap",
                }}
              >
                <Upload />
                Sign Up
              </Button>
              <Button
                className="nav-button"
                color="inherit"
                sx={{
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  border: "1px solid transparent",
                  "&:hover": { variant: "outlined" },
                  whiteSpace: "nowrap",
                }}
              >
                <LockOpen />
                Login
              </Button>
            </>
          ) : (
            <>
              <Button
                className="nav-button"
                color="inherit"
                sx={{
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  border: "1px solid transparent",
                  "&:hover": { variant: "outlined" },
                  whiteSpace: "nowrap", 
                }}
              >
                <Lightbulb />
                Product Suggestions
              </Button>
              <Button
                className="nav-button"
                  color="inherit"
                  sx={{
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    border: "1px solid transparent",
                    "&:hover": { variant: "outlined" },
                    whiteSpace: "nowrap", 
                  }}
              >
                  <AccountBalance />
                Update Balance
              </Button>
              <IconButton color="inherit">
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleProfileMenuOpen}
              >
                <Avatar alt={user.name} src={user.profilePicture} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                id={menuId}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}
                  sx={{
                    fontSize: "20px",
                    marginBottom: "20px",
                    textAlign: "center",
                    "&:hover": {backgroundColor : "white"}
                  }}
                >
                  Current Balance:
                  <br />
                  {user.balance}
                  {user.currency}
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <Money fontSize="small" />
                    </ListItemIcon>
                    Change Currency
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  Edit Account
                </MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ color: "red" }}>
                  <ListItemIcon>
                    <Logout fontSize="small" sx={{ color: "red" }} />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
