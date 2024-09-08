import React, { useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import "./PopUp.css";

const Popup = ({ onClose, CloseX, title, description, buttonText, children, isX }) => {
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="popup-overlay">
      <div className="popup-content"> 
        {isX && (
          <CloseIcon 
            onClick={CloseX ? CloseX : onClose} 
            className="popup-close-btn" 
            aria-label="Close" 
          />
        )}
        <div className="popup-header">
          <h2 className="popup-title">{title}</h2>
        </div>
        {description && (
          <p className="popup-description">{description}</p>
        )}
        <div className="popup-body">
          {children} 
        </div>
        {buttonText && (
          <button onClick={onClose} className="popup-button">
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Popup;