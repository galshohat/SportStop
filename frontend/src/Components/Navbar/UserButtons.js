import React from "react";
import { Button, IconButton, Badge } from "@mui/material";
import { Star, Telegram, ShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const UserButtons = ({ cartItemCount, couponAmount }) => {
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleStarsPageClick = () => {
    navigate("/stars");
  };

  const handleOrderClick = () => {
    navigate("/order");
  };

  return (
    <>
      <Badge badgeContent={couponAmount} color="error">
        <Button
          className="nav-button"
          color="inherit"
          onClick={handleStarsPageClick}
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
          <Star />
          Stars Coupons
        </Button>
      </Badge>
      <Button
        className="nav-button"
        onClick={handleOrderClick}
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
        <Telegram />
        My Orders
      </Button>
      <IconButton color="inherit" onClick={handleCartClick}>
        <Badge badgeContent={cartItemCount} color="error">
          <ShoppingCart />
        </Badge>
      </IconButton>
    </>
  );
};

export default UserButtons;
