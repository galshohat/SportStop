import React from "react";
import { Menu, MenuItem, ListItemIcon } from "@mui/material";
import { AccountCircle, Logout, Money } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Price from "../Currency/price";
import { useLocation } from 'react-router-dom';


const UserMenu = ({ anchorEl, handleMenuClose, handleLogout, user }) => {
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin;
  const location = useLocation();
  const currentRoute = location.pathname;

  const handleEditAccount = () => {

    navigate("/edit-account");
    handleMenuClose();
  };

  const handleChangeCurrency = () => {
    console.log(currentRoute)
    sessionStorage.setItem('before-currency', currentRoute);
    navigate("/currency");
    handleMenuClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      {!isAdmin && (
        <MenuItem
          sx={{
            fontSize: "20px",
            marginBottom: "20px",
            textAlign: "center",
            justifyContent: "center",
            pointerEvents: "none",
            "&:hover": { backgroundColor: "white" },
          }}
        >
          Current Stars:
          <br />
          <Price valueInShekels={Math.round(user?.stopPoints)} withSymbol = {false} />
        </MenuItem>
      )}
      <MenuItem onClick={handleChangeCurrency}>
        <ListItemIcon>
          <Money fontSize="small" />
        </ListItemIcon>
        Change Currency
      </MenuItem>
      <MenuItem onClick={handleEditAccount}>
        <ListItemIcon>
          <AccountCircle fontSize="small" />
        </ListItemIcon>
        Edit Account
      </MenuItem>
      <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
        <ListItemIcon>
          <Logout fontSize="small" sx={{ color: "red" }} />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
};

export default UserMenu;