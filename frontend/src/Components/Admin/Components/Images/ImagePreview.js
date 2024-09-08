import React, { useState, useEffect } from "react";
import "./ImagePreview.css";

const ImagePreview = ({ mainImage, additionalImages, onDeleteMainImage, onDeleteAdditionalImage }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (additionalImages.length > 0 && currentImageIndex >= additionalImages.length) {
      setCurrentImageIndex(additionalImages.length - 1);
    }
  }, [additionalImages.length, currentImageIndex]);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => Math.min(prevIndex + 1, additionalImages.length - 1));
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div className="image-preview-row">
      <div className="main-image-section">
        {mainImage && (
          <div className="image-preview-container">
            <img
              src={typeof mainImage === "string" ? mainImage : URL.createObjectURL(mainImage)}
              alt="Main Preview"
              className="image-preview"
            />
            <button className="delete-button" onClick={onDeleteMainImage} type="button">
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="additional-images-section">
        {additionalImages.length > 0 && (
          <div className="additional-images-carousel">
            {additionalImages[currentImageIndex] && (
              <div key={currentImageIndex} className="image-preview-container">
                <img
                  src={typeof additionalImages[currentImageIndex] === "string"
                    ? additionalImages[currentImageIndex]
                    : URL.createObjectURL(additionalImages[currentImageIndex])
                  }
                  alt={`Additional Preview ${currentImageIndex + 1}`}
                  className="additional-image-preview"
                />
                <div className="carousel-controls">
                  <button
                    className={`carousel-arrow left ${currentImageIndex === 0 ? "disabled" : ""}`}
                    onClick={handlePreviousImage}
                    disabled={currentImageIndex === 0}
                    type="button"
                  >
                    {"<"}
                  </button>
                  <button className="delete-button" onClick={() => onDeleteAdditionalImage(currentImageIndex)} type="button">
                    Delete
                  </button>
                  <button
                    className={`carousel-arrow right ${currentImageIndex === additionalImages.length - 1 ? "disabled" : ""}`}
                    onClick={handleNextImage}
                    disabled={currentImageIndex === additionalImages.length - 1}
                    type="button"
                  >
                    {">"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;