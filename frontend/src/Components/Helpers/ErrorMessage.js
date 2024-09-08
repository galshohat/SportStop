import React from 'react';
import "../Admin/Category/Category.css"

const ErrorMessage = ({ message }) => {
    return message ? <p style={{fontWeight:"bold", color: "red", fontSize:"20px"}}>{message}</p> : null;
};

export default ErrorMessage;