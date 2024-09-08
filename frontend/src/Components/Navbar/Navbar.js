import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Avatar,
  IconButton,
  TextField,
  Box,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import { Search, LockOpen, Build, MenuBook } from "@mui/icons-material";
import "./Navbar.css";
import logo from "../../navbar-logo.png";
import { useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";
import UserButtons from "./UserButtons";
import { AuthContext } from "../Auth&Verify/UserAuth.js";
import SearchProducts from "./searchAlgorithm";
import { debounce } from "../Helpers/debounce.js";
import { DataContext } from "../Auth&Verify/DataContext.js";

const Navbar = () => {
  const { isLoggedIn, userInfo, logout } = useContext(AuthContext);
  const { products, categories, colors, sizes } = useContext(DataContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const sanitizeValue = (value) => {
    if (typeof value !== "string") return "";
    return value
      .replace(/(<([^>]+)>)/gi, "")
      .replace(/^(Product|Category):\s*/, "");
  };

  const debouncedSearch = debounce(async (newValue) => {
    if (newValue.length === 0) {
      setOptions(
        categories.map((cat) => ({
          label: cat.name,
          value: cat.name,
          type: "category",
        }))
      );
      return;
    }

    if (newValue.length < 2) {
      setOptions([]);
      return;
    }

    const { products: filteredProducts, categories: filteredCategories } =
      await SearchProducts(newValue, products, categories);

    const prioritizedProducts = (filteredProducts || []).sort((a, b) => {
      const aHighlighted = a.highlightedName !== a.name;
      const bHighlighted = b.highlightedName !== b.name;
      if (aHighlighted && !bHighlighted) return -1;
      if (!aHighlighted && bHighlighted) return 1;
      return 0;
    });

    const searchOptions = [
      ...filteredCategories.map((cat) => ({
        label: cat.name,
        value: cat.name,
        type: "category",
      })),
      ...prioritizedProducts.slice(0, 5).map((product) => ({
        label: product.highlightedName,
        value: product.name,
        type: "product",
        categoryLabel:
          Array.isArray(product.categories) && product.categories.length > 0
            ? product.categories.map((cat) => cat.name).join(", ")
            : "Unknown Category",
      })),
    ];

    setOptions(searchOptions);
  }, 100);

  const handleSearchChange = (event, newValue) => {
    setSearchValue(sanitizeValue(newValue));
    debouncedSearch(newValue);
  };

  const handleFocus = () => {
    if (searchValue.length > 0) {
      debouncedSearch(searchValue);
    } else {
      setOptions(
        categories.map((cat) => ({
          label: cat.name,
          value: cat.name,
          type: "category",
        }))
      );
    }
  };

  const handleOptionSelect = (event, newValue) => {
    if (newValue) {
      const sanitizedValue = sanitizeValue(newValue.label || newValue.value);
      setSearchValue(sanitizedValue);
      handleSearchClick(sanitizedValue);
    }
  };

  const handleSearchIconClick = () => {
    handleSearchClick(searchValue);
  };

  const handleSearchClick = async (value) => {
    const searchQuery = value || searchValue;
    if (searchQuery) {
      try {
        const { products: filteredProducts } = await SearchProducts(
          searchQuery,
          products,
          categories
        );

        const prioritizedProducts = (filteredProducts || []).sort((a, b) => {
          const aHighlighted = a.highlightedName !== a.name;
          const bHighlighted = b.highlightedName !== b.name;
          if (aHighlighted && !bHighlighted) return -1;
          if (!aHighlighted && bHighlighted) return 1;
          return 0;
        });

        navigate("/search-results", {
          state: {
            foundProducts: prioritizedProducts,
            availableFilters: {
              Colors: colors.map((color) => color.name),
              Sizes: sizes.map((size) => size.name),
              Categories: categories.map((category) => category.name),
              Gender: ["Men", "Women"],
            },
            searchText: searchQuery,
          },
        });
      } catch (error) {
        console.error("Error performing search:", error);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  };

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

  const LoginClick = () => navigate("/auth");
  const handleLogoClick = () => navigate("/");
  const handleReadmeClick = () => navigate("/readme");

  return (
    <AppBar position="static">
      <Toolbar className="navbar" sx={{ minWidth: "320px" }}>
        <img
          src={logo}
          alt="SportStop"
          className="navbar-logo"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        />
        <Button
          onClick={handleReadmeClick}
          className="nav-button"
          color="inherit"
          sx={{
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            gap: 1,
            border: "1px solid transparent",
            borderRadius: "10px",
            "&:hover": { variant: "outlined" },
            whiteSpace: "nowrap",
            minWidth: "8vw"
          }}
        >
          <MenuBook /> Readme
        </Button>
        <Box
          className="search-wrapper"
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            maxWidth: "1000px",
          }}
        >
          <Autocomplete
            options={options}
            getOptionLabel={(option) => option.label || option.value || ""}
            inputValue={searchValue}
            onInputChange={handleSearchChange}
            onChange={handleOptionSelect}
            onFocus={handleFocus}
            freeSolo
            renderOption={(props, option) => (
              <li {...props} key={option.value || option.label}>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <span
                    style={{ textAlign: "left", flexGrow: 1 }}
                    dangerouslySetInnerHTML={{ __html: option.label }}
                  ></span>
                  {option.type === "product" && (
                    <span
                      style={{
                        color: "lightgray",
                        fontStyle: "italic",
                        textAlign: "right",
                        marginLeft: "auto",
                      }}
                    >
                      {option.categoryLabel || ""}
                    </span>
                  )}
                </span>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search…"
                variant="outlined"
                fullWidth
                onKeyDown={handleKeyPress}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search
                        sx={{ color: "white", cursor: "pointer" }}
                        onClick={handleSearchIconClick}
                      />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ style: { color: "white" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 40,
                    color: "white",
                    "& fieldset": { borderColor: "white" },
                    "&:hover fieldset": { borderColor: "white" },
                    "&.Mui-focused fieldset": { borderColor: "white" },
                  },
                  "& .MuiInputLabel-root": { color: "white" },
                }}
              />
            )}
            sx={{ flexGrow: 1 }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: "auto" }}>
          {!isLoggedIn ? (
            <Button
              onClick={LoginClick}
              className="nav-button"
              color="inherit"
              sx={{
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                gap: 1,
                border: "1px solid transparent",
                borderRadius: "10px",
                "&:hover": { variant: "outlined" },
                whiteSpace: "nowrap",
              }}
            >
              <LockOpen />
              Login / Sign Up
            </Button>
          ) : (
            <>
              {userInfo?.isAdmin ? (
                <Button
                  onClick={() => navigate("/admin")}
                  className="nav-button"
                  color="inherit"
                  sx={{
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    border: "1px solid transparent",
                    borderRadius: "10px",
                    "&:hover": { variant: "outlined" },
                    whiteSpace: "nowrap",
                  }}
                >
                  <Build />
                  Admin Screen
                </Button>
              ) : (
                <UserButtons
                  cartItemCount={userInfo.cart?.length}
                  couponAmount={userInfo.coupons?.length}
                />
              )}
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleProfileMenuOpen}
              >
                <Avatar alt={userInfo?.name} src={userInfo.profilePicture} />
              </IconButton>
              <UserMenu
                anchorEl={anchorEl}
                handleMenuClose={handleMenuClose}
                handleLogout={handleLogout}
                user={userInfo}
              />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;