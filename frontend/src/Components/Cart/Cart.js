import React, { useEffect, useState, useContext } from "react";
import styles from "./Cart.module.css";
import Loading from "../Loader/Loader.js";
import { fetchCartItems } from "./Functions/fetchCartItems.js";
import { removeCartItem } from "./Functions/removeCartItem.js";
import ErrorMessage from "../Helpers/ErrorMessage.js";
import SessionExpiryRedirect from "../Auth&Verify/SessionExpiryRedirect.js";
import emptyCartImage from "./empty-cart.png";
import Popup from "../Helpers/PopUp/PopUp.js";
import Navbar from "../Navbar/Navbar.js";
import { IconButton, Button } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import EditCartItemModal from "./Components/EditCartItemModel.js";
import Pagination from "../Admin/Components/Pagination.js";
import CheckoutPopup from "./Components/CheckoutPopup.js";
import {
  handlePreviousPage,
  handleNextPage,
} from "../Admin/Functions/handlePagination.js";
import { AuthContext } from "../Auth&Verify/UserAuth.js";
import { handleCouponSubmit } from "./Functions/applyCoupon.js"; 
import Price from "../Currency/price.js";
import convertPriceToString from "../Currency/priceString.js";
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
  });
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [stars, setStars] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);
  const [couponInput, setCouponInput] = useState("");
  const [couponStatus, setCouponStatus] = useState(null);
  const [discountValue, setDiscountValue] = useState(0); 
  const itemsPerPage = 4;
  const { setUserInfo, userInfo } = useContext(AuthContext);
  const userId = useContext(AuthContext).userInfo?._id;
  const currency = useContext(AuthContext).userInfo?.currency;
  const [starsShekels, setStarsShekels] = useState(0); 

  const convertCurrency = async (total) => {
    try {
      const res = await convertPriceToString(total, userInfo, 2, false);
      const convertedTotal = parseFloat(res);
      setOrderTotal(convertedTotal); 
      setDiscountedTotal((convertedTotal * (1 - discountValue / 100)).toFixed(2));
      setStars(Math.round(convertedTotal * 0.1));
    } catch (error) {
      console.error("Error converting currency:", error);
    }
  };

  useEffect(() => {
    setError("");
    fetchCartItems(userId, setCartItems, setLoading, setError, setSessionExpired);
  }, [userId]);

  useEffect(() => {
    const total = cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    if (total > 0) {
      setStarsShekels(Math.round(total * 0.1))
      convertCurrency(total);
    }
  }, [cartItems, discountValue]);


  const handleRemoveItem = (orderItemId) => {
    removeCartItem(
      userId,
      orderItemId,
      setCartItems,
      setError,
      setLoading,
      setSessionExpired,
      setUserInfo
    );
  };

  const showNotification = (message) => {
    setNotification({ visible: true, message });
  };

  const handleCloseNotification = () => {
    setNotification({ visible: false, message: "" });
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleClosePopup = () => {
    setEditingItem(null);
  };

  const handleCheckoutClick = () => {
    setShowCheckoutPopup(true);
  };

  const handlePopupClose = () => {
    setShowCheckoutPopup(false);
  };

  const handleCouponChange = (e) => {
    setCouponInput(e.target.value);
    setCouponStatus(null);
    setDiscountValue(0);
  };

  const handleApplyCoupon = () => {
    handleCouponSubmit(
      userId,
      couponInput,
      setSessionExpired,
      setCouponStatus,
      setDiscountValue
    );
  };

  if (loading) {
    return <Loading />;
  }

  const totalPages = Math.ceil(cartItems.length / itemsPerPage);

  const currentItems = cartItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  return (
    <div>
      <Navbar />
      <div className={styles.cartContainer}>
        <h1 className={styles.shoppingCartTitle}>Shopping Cart</h1>

        <ErrorMessage message={error} />

        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <img src={emptyCartImage} alt="Empty Cart" />
            <p>
              Your cart is empty, take a look at our products and come back :)
            </p>
          </div>
        ) : (
          <div className={styles.cartContent}>
            <div className={styles.cartItems}>
              {currentItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className={styles.cartItemImage}
                  />
                  <div className={styles.cartItemDetails}>
                    <h2>{item.product.name}</h2>
                    <p>Quantity: {item.quantity}</p>
                    <p>
                      Colors:{" "}
                      {item.product.colors
                        .map((color) => color.name)
                        .join(", ")}
                    </p>
                    {item.size && <p>{item.size.name}</p>}
                    <p>
                      Total Price: <Price valueInShekels={(item.product.price * item.quantity)} toFixed={2} withSymbol={true} />
                    </p>
                  </div>
                  <IconButton
                    className={styles.editItemBtn}
                    onClick={() => handleEditItem(item)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    className={styles.removeItemBtn}
                    onClick={() => handleRemoveItem(item.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </div>
              ))}
            </div>

            <div className={styles.orderSummary}>
              <h2>Order Summary</h2>
              <div className={styles.orderSummaryLine}></div>

              {discountValue > 0 ? (
                <div className={styles.orderSummaryTotal}>
                  <span>Order Total</span>
                  <span>
                    <s> {currency}{orderTotal.toFixed(2)}</s>
                  </span>
                </div>
              ) : (
                <div className={styles.orderSummaryTotal}>
                  <span>Order Total</span>
                  <span>{currency}{orderTotal.toFixed(2)}</span>
                </div>
              )}

              {discountValue > 0 && (
                <div className={styles.discountSummary}>
                  <span>{discountValue}% Discount</span>
                  <span>{currency}{discountedTotal}</span>
                </div>
              )}

              <div className={styles.couponSection}>
                <label htmlFor="couponInput" className={styles.couponLabel}>
                  Apply Coupon:
                </label>
                <input
                  type="text"
                  id="couponInput"
                  value={couponInput}
                  onChange={handleCouponChange}
                  className={`${styles.couponInput} ${
                    couponStatus === "valid"
                      ? styles.couponValid
                      : couponStatus === "invalid"
                      ? styles.couponInvalid
                      : ""
                  }`}
                />
                <button
                  className={styles.couponSubmitBtn}
                  onClick={handleApplyCoupon}
                >
                  Confirm
                </button>
              </div>

              <div className={styles.orderSummaryPoints}>
                <span>You will gain {stars} Stars! (10%)</span>
              </div>
              <Button
                className={styles.checkoutBtn}
                onClick={handleCheckoutClick}
              >
                Checkout
              </Button>
            </div>
          </div>
        )}

        {cartItems.length > 0 && (
          <Pagination
            currentPage={currentPage}
            handlePreviousPage={() =>
              handlePreviousPage(currentPage, setCurrentPage)
            }
            handleNextPage={() =>
              handleNextPage(currentPage, setCurrentPage, totalPages)
            }
            totalPages={totalPages}
            wrapperStyle={{ width: "10%" }}
          />
        )}
      </div>

      {sessionExpired && <SessionExpiryRedirect trigger={sessionExpired} />}

      {editingItem && (
        <EditCartItemModal
          onClose={handleClosePopup}
          item={editingItem}
          setCartItems={setCartItems}
          setError={setError}
          setLoading={setLoading}
          setSessionExpired={setSessionExpired}
          userId={userId}
          showNotification={showNotification}
        />
      )}

      {showCheckoutPopup && (
        <CheckoutPopup
          onClose={handlePopupClose}
          cartItems={cartItems}
          currency={currency}
          stars={starsShekels}
          discountedTotal={discountedTotal}
          discountValue={discountValue}
          couponCode={couponStatus === "valid" ? couponInput : null}
          setShowCheckoutPopup={setShowCheckoutPopup}
          orderTotal = {orderTotal}
        />
      )}

      {notification.visible && (
        <Popup
          onClose={handleCloseNotification}
          title="Notification"
          buttonText="Close"
        >
          <p
            style={{
              fontSize: "1.2rem",
              color: notification.message.includes("Quantity updated")
                ? "red"
                : "black",
              fontWeight: "bold",
            }}
          >
            {notification.message}
          </p>
        </Popup>
      )}
    </div>
  );
};

export default Cart;
