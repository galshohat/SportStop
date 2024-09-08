import React from "react";
import "./ZoomImage.css";

const ZoomImage = ({ image, onClose }) => {
  return (
    <div className="zoom-image-overlay" onClick={onClose}>
      <div className="zoom-image-container">
        <img src={image} alt="Zoomed" className="zoomed-image" />
      </div>
    </div>
  );
};

export default ZoomImage;