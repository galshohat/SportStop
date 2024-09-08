import React from 'react';

const ProductImages = ({ mainImage, thumbnails, onThumbnailClick, onMainImageClick }) => {
  return (
    <div className="product-popup-left">
      <div className="product-popup-main-image" onClick={onMainImageClick} style={{ cursor: 'zoom-in' }}>
        <img src={mainImage} alt="Selected" className="zoomable-image" />
      </div>
      <div className="product-popup-thumbnails">
        {thumbnails.map((image, index) => (
          <img 
            key={index} 
            src={image} 
            alt={`Thumbnail ${index + 1}`} 
            className={`thumbnail ${image === mainImage ? 'active' : ''}`}
            onClick={() => onThumbnailClick(image)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImages;