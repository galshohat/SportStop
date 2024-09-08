import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../../Helpers/PopUp/PopUp";
import styles from "./CheckoutPopup.module.css";
import paymentImage from "./payment.png";
import shippedImage from "./shipped.png";
import ErrorMessage from "../../Helpers/ErrorMessage.js";
import Loading from "../../Loader/Loader.js";
import {
  validateCardNumber,
  validateExpiryDate,
  validateCVC,
  validateEmail,
} from "../Functions/checkoutValidation";
import { createOrder } from "../Functions/createOrder";
import { checkTokenUniqueness } from "../Functions/checkTokenUniqueness";
import SessionExpiryRedirect from "../../Auth&Verify/SessionExpiryRedirect.js";
import { AuthContext } from "../../Auth&Verify/UserAuth.js";
import Price from "../../Currency/price.js";
const CheckoutPopup = ({
  onClose,
  cartItems,
  currency,
  stars,
  discountedTotal,
  discountValue,
  couponCode,
  setShowCheckoutPopup,
  orderTotal,
}) => {
  const [paymentDone, setPaymentDone] = useState(false);
  const [orderToken, setOrderToken] = useState("");
  const [email, setEmail] = useState(
    useContext(AuthContext).userInfo.email || ""
  );
  const [sessionExpired, setSessionExpired] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCVC] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [isPaymentDisabled, setIsPaymentDisabled] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const userId = useContext(AuthContext).userInfo._id;
  const phone = useContext(AuthContext).userInfo.phone;
  const user = useContext(AuthContext).userInfo;
  const { setUserInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const allFieldsValid =
      validateEmail(email) &&
      validateCardNumber(cardNumber) &&
      validateExpiryDate(expiryDate) &&
      validateCVC(cvc) &&
      cardholderName.trim() !== "" &&
      street.trim() !== "" &&
      city.trim() !== "" &&
      country.trim() !== "";
    setIsPaymentDisabled(!allFieldsValid);
  }, [
    email,
    cardNumber,
    expiryDate,
    cvc,
    cardholderName,
    street,
    city,
    country,
  ]);

  console.log(stars)
  const generateUniqueToken = async () => {
    let token;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique) {
      token = Math.random().toString(36).substring(2, 12).toUpperCase();

      try {
        isUnique = await checkTokenUniqueness(token, setSessionExpired);

        if (!isUnique && attempts >= 5) {
          throw new Error(
            "Failed to generate a unique token after multiple attempts"
          );
        }
        attempts++;
      } catch (error) {
        console.error("Error generating unique token:", error);
        break;
      }
    }

    return token;
  };

  const handleCardNumberChange = (e) => {
    let input = e.target.value.replace(/\D/g, "");
    input = input.substring(0, 16);

    if (input.length > 0) {
      input = input.match(/.{1,4}/g).join(" ");
    }

    setCardNumber(input);
  };

  const handlePayment = async () => {
    if (isPaymentDisabled) return;

    setError("");

    setTimeout(async () => {
      const token = await generateUniqueToken();
      setOrderToken(token);
      const orderData = {
        orderItems: cartItems.map((item) => ({
          id: item.id,
          product: {
            id: item.product.id,
            price: item.product.price,
          },
          quantity: item.quantity,
          size: item.size?.id || null,
        })),
        shippingAddress: street,
        city,
        country,
        phone,
        user: userId,
        token,
        stars,
        discount: (100 - discountValue) / 100,
        couponCode
      };

      try {
        await createOrder(orderData, setUserInfo, setSessionExpired);
        setPaymentDone(true);
        setIsImageLoaded(false);
      } catch (err) {
        console.error("Failed to create order:", err.message);
        setError("Failed to create order. Please try again.");
      }
    }, 200);
  };

  const handleExpiryDateChange = (e) => {
    let input = e.target.value.replace(/\D/g, "");
    if (input.length > 4) {
      input = input.slice(0, 4);
    }

    if (input.length > 2) {
      input = input.slice(0, 2) + " / " + input.slice(2);
    }

    setExpiryDate(input);
  };

  const handleAutofill = () => {
    if (user.street || user.city || user.country) {
      setStreet(user.street || "");
      setCity(user.city || "");
      setCountry(user.country || "");
    } else {
      setError("Your profile address is empty.");
    }
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handlePopupClose = () => {
    setShowCheckoutPopup(false);
    navigate("/");
  };

  return (
    <Popup
      onClose={paymentDone ? handlePopupClose : onClose}
      title={
        paymentDone ? "Thank You for Your Payment!" : "Complete Your Payment"
      }
      buttonText={paymentDone ? "Close" : ""}
      {...(!paymentDone && { isX: "true" })}
    >
      {!paymentDone ? (
        <div className={styles.paymentForm}>
          <div className={styles.cartSummary}>
            <h2>Order Summary</h2>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <span>{`${item.product.name} (Q: ${item.quantity})`}</span>
                <span>
                  <Price valueInShekels={item.product.price * item.quantity} withSymbol={true} toFixed={2} />
                </span>
              </div>
            ))}
            {discountValue > 0 && (
              <div className={styles.cartItem}>
                <span style={{ fontWeight: "bold", color: "green" }}>
                  {discountValue}% Discount Applied
                </span>
                <span
                  style={{ fontWeight: "bold", color: "green" }}
                > -{currency+(orderTotal - discountedTotal).toFixed(2)}</span>
              </div>
            )}
            <div className={styles.total}>
              <strong>
                Total: {currency + (discountedTotal || orderTotal)}
              </strong>
            </div>
            <img
              src={paymentImage}
              alt="Payment Methods"
              className={styles.paymentImage}
            />
          </div>

          <div className={styles.verticalLine}></div>

          <div className={styles.paymentDetails}>
            <label>Contact Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
            />
            <label>Card Information</label>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 1234 1234 1234"
            />
            <input
              type="text"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              placeholder="MM / YY"
            />
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCVC(e.target.value)}
              placeholder="CVC (3 Digits)"
              maxLength={3}
            />
            <label>Cardholder Name</label>
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="Name on Card"
            />
            <div className={styles.billingAddressContainer}>
              <label style={{ marginBottom: "0" }}>Billing Address</label>
              <button
                type="button"
                onClick={handleAutofill}
                className={styles.infoButton}
              >
                Info from Profile
              </button>
            </div>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Street Address"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
            />
            <button
              className={styles.payButton}
              onClick={handlePayment}
              disabled={isPaymentDisabled} 
            >
              Pay Now
            </button>
            {error && <ErrorMessage message={error} />}
          </div>
        </div>
      ) : (
        <div className={styles.thankYouMessage}>
          {!isImageLoaded && <Loading />}{" "}

          <img
            src={shippedImage}
            alt="Order Shipped"
            className={styles.shippedImage}
            onLoad={handleImageLoad} 
            style={{ display: isImageLoaded ? "block" : "none" }}
          />
          <p>Thank you for your payment!</p>
          <p>Your order has been processed successfully.</p>
          <p>
            Your order token is: <strong>{orderToken}</strong>
          </p>
        </div>
      )}
      {sessionExpired && <SessionExpiryRedirect trigger={sessionExpired} />}
    </Popup>
  );
};

export default CheckoutPopup;
