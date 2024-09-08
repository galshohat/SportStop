import React, { useEffect, useState, useContext } from "react";
import Popup from "../Helpers/PopUp/PopUp.js";
import SessionExpiryRedirect from "../Auth&Verify/SessionExpiryRedirect.js";
import "./Stars.css";
import { AuthContext } from "../Auth&Verify/UserAuth.js";
import {
  fetchUserCoupons,
  updateUserCoupons,
} from "./Functions/handleCoupons.js";
import Navbar from "../Navbar/Navbar.js";
import convertPriceToString from "../Currency/priceString.js";
import Price from "../Currency/price.js";
import discountImage5 from "./Photos/5p.png";
import discountImage10 from "./Photos/10p.png";
import discountImage15 from "./Photos/15p.png";
import discountImage20 from "./Photos/20p.png";

const StarsPage = () => {
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [userCoupons, setUserCoupons] = useState(userInfo.coupons || []);
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    value: null,
  });

  useEffect(() => {
    const cards = document.querySelectorAll(".discount-product-card");

    cards.forEach((card) => {
      card.addEventListener("animationend", (event) => {
        if (event.animationName === "fadeInLeft") {
          card.classList.add("hover-ready");
        }
      });
    });
  }, []);

  const showNotification = (message, value = null) => {
    setNotification({ visible: true, message, value });
  };

  const handleCloseNotification = () => {
    setNotification({
      visible: false,
      message: "",
      value: null,
    });
  };

  const discountProducts = [
    {
      id: 1,
      tag: "5%",
      name: "5% Discount",
      image: discountImage5,
      price: 100,
      discount: 5,
    },
    {
      id: 2,
      tag: "10%",
      name: "10% Discount",
      image: discountImage10,
      price: 250,
      discount: 10,
    },
    {
      id: 3,
      tag: "15%",
      name: "15% Discount",
      image: discountImage15,
      price: 350,
      discount: 15,
    },
    {
      id: 4,
      tag: "20%",
      name: "20% Discount",
      image: discountImage20,
      price: 500,
      discount: 20,
    },
  ];

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const coupons = await fetchUserCoupons(userInfo._id, setSessionExpired);
        setUserCoupons(coupons);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };
    fetchCoupons();
  }, [userInfo._id]);

  const handleCouponPurchase = async (product) => {
    if (userInfo.stopPoints < product.price) {
      const price = await convertPriceToString(product.price - userInfo.stopPoints, userInfo, 0, false)
      showNotification(
        `You can't purchase ${product.tag} coupon. You are missing ${
          price
        } stars.`
      );
      return;
    }

    const price = await convertPriceToString(product.price, userInfo, 0, false)
    console.log(price)
    showNotification(
      `Are you sure you want to purchase the ${product.tag} coupon for ${price} stars?`,
      product
    );
  };

  const confirmPurchase = async (product) => {
    const couponCode = generateCouponCode(userCoupons || []);
    try {
      await updateUserCoupons(
        userInfo._id,
        couponCode,
        product.discount,
        product.price,
        setSessionExpired,
        setUserInfo,
        setUserCoupons
      );
      if (!sessionExpired) {
        showNotification(
          `You have received a ${product.tag} discount coupon: ${couponCode}`
        );
      }
    } catch (error) {
      console.error("Error purchasing coupon:", error);
    }
  };

  const generateCouponCode = (existingCoupons) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let couponCode;
    let isUnique = false;

    while (!isUnique) {
      couponCode = Array.from({ length: 8 }, () =>
        characters.charAt(Math.floor(Math.random() * characters.length))
      ).join("");

      isUnique = !existingCoupons.some((coupon) => coupon.code === couponCode);
    }

    return couponCode;
  };

  return (
    <div className="stars-page">
      <Navbar />
      <h1 className="stars-header">Stars Page</h1>
      <p className="stars-description">
        Welcome to the Stars Page! Here, you can use your store points (Stars)
        to get exclusive discount coupons. Each coupon can be used once and is
        linked to your account.
      </p>

      <div className="coupon-section">
        <h2>Your Coupons</h2>
        {Array.isArray(userCoupons) && userCoupons.length === 0 ? (
          <p>No coupons available. Start earning stars to get discounts!</p>
        ) : (
          <ul>
            {Array.isArray(userCoupons) && userCoupons.length > 0 ? (
              userCoupons.map((coupon, index) => (
                <li key={index} className="coupon">
                  {coupon.code} - {coupon.discount}%
                </li>
              ))
            ) : (
              <li className="coupon">No coupons available</li>
            )}
          </ul>
        )}
      </div>
      <h3>Your Available Stars: {<Price valueInShekels={Math.round(userInfo.stopPoints)} toFixed={0} withSymbol={false}/>} </h3>
      <div className="discount-cards">
        {discountProducts.map((product) => (
          <div key={product.id} className="discount-product-card">
            <img src={product.image} alt={product.name} />
            <div className="discount-badge">{product.tag}</div>
            <p className="stars-product-name">{product.name}</p>
            <button
              className="purchase-button"
              onClick={() => handleCouponPurchase(product)}
            >
              Purchase
            </button>
          </div>
        ))}
      </div>

      {notification.visible && (
        <Popup
          CloseX={handleCloseNotification}
          onClose={() => confirmPurchase(notification.value)}
          title="Notification"
          isX={true}
          buttonText={notification.value ? "Confirm" : null}
        >
          <p
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: notification.message.includes("missing") ? "red" : "black",
            }}
          >
            {notification.message}
          </p>
        </Popup>
      )}
      {sessionExpired && <SessionExpiryRedirect trigger={sessionExpired} />}
    </div>
  );
};

export default StarsPage;
