import React, { useState, useContext } from "react";
import "./ProductPopup.css";
import Popup from "../Helpers/PopUp/PopUp.js";
import ProductImages from "./ProductImages";
import ProductDetails from "./ProductDetails";
import ProductActions from "./ProductActions";
import ZoomImage from "./ZoomImage";
import { addToCart } from "../Cart/Functions/addToCart.js";
import { AuthContext } from "../Auth&Verify/UserAuth.js";

const ProductPopup = ({
  product,
  onClose,
  ErrorMessage,
  showNotification,
  setSessionExpired
}) => {
  const [mainImage, setMainImage] = useState(product.image);
  const [thumbnails, setThumbnails] = useState(product.images || []);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [errorMessage, setErrorMessage] = useState(ErrorMessage || "");
  const [isZoomed, setIsZoomed] = useState(false);
  const userId = useContext(AuthContext).userInfo?._id;
  const { setUserInfo } = useContext(AuthContext);

  const handleThumbnailClick = (img) => {
    const newThumbnails = thumbnails.map((thumbnail) =>
      thumbnail === img ? mainImage : thumbnail
    );
    setMainImage(img);
    setThumbnails(newThumbnails);
  };

  const handleAddToCart = async () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setErrorMessage("Please select a size.");
      return;
    }
    try {
      await addToCart(
        userId,
        product.id,
        quantity,
        selectedSize,
        setSessionExpired,
        showNotification,
        setUserInfo
      );
      onClose();
    } catch (error) {
      console.error("Error during add to cart:", error);
    }
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <>
      <Popup
        onClose={onClose}
        title={product.name}
        description={product.description}
        buttonText=""
        isX={true}
      >
        <div className="product-popup-container">
          <div className="product-popup-left">
            <ProductImages
              mainImage={mainImage}
              thumbnails={thumbnails}
              onThumbnailClick={handleThumbnailClick}
              onMainImageClick={handleZoomToggle}
            />
          </div>
          <div className="product-popup-details">
            <ProductDetails product={product} />
            <ProductActions
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              onAddToCart={handleAddToCart}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          </div>
        </div>
      </Popup>
      {isZoomed && <ZoomImage image={mainImage} onClose={handleZoomToggle} />}
    </>
  );
};

export default ProductPopup;
