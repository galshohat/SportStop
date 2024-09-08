export const validateCardNumber = (cardNumber) => {
  const regex = /^(\d{4} \d{4} \d{4} \d{4})$/;
  return regex.test(cardNumber);
};

export const validateExpiryDate = (expiryDate) => {
  const regex = /^(0[1-9]|1[0-2])\s\/\s([0-9]{2})$/;
  return regex.test(expiryDate);
};

export const validateCVC = (cvc) => {
  const regex = /^[0-9]{3}$/;
  return regex.test(cvc);
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

