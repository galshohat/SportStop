import { useState } from "react";

export const usePasswordToggle = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return { passwordVisible, togglePasswordVisibility };
};

export const useValidation = () => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const [password, setPassword] = useState("");
  const [isPasswordLongEnough, setIsPasswordLongEnough] = useState(false);
  const [hasCapitalAndNumber, setHasCapitalAndNumber] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const domainEndingMapping = {
    gmail: ".com",
    yahoo: ".com",
    post: ".runi.ac.il",
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailPattern.test(email)) {
      return false;
    }

    const domainAndEnding = email.split("@")[1];
    if (!domainAndEnding) {
      return false;
    }

    const [domain, ...endingParts] = domainAndEnding.split(".");
    const ending = "." + endingParts.join(".");

    return domainEndingMapping[domain] === ending;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsEmailValid(validateEmail(e.target.value));
    if (e.target.value === "") {
      setEmailTouched(false);
    } else {
      setEmailTouched(true);
    }
  };

  const handleEmailBlur = () => {
    if (email !== "") {
      setEmailTouched(true);
    } else {
      setEmailTouched(false);
    }
  };

  const validatePasswordLength = (password) => {
    return password.length >= 8;
  };

  const validateCapitalAndNumber = (password) => {
    const capitalPattern = /[A-Z]/;
    const numberPattern = /[0-9]/;
    return capitalPattern.test(password) && numberPattern.test(password);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsPasswordLongEnough(validatePasswordLength(newPassword));
    setHasCapitalAndNumber(validateCapitalAndNumber(newPassword));
    if (newPassword === "") {
      setPasswordTouched(false);
    } else {
      setPasswordTouched(true);
    }
  };

  const handlePasswordBlur = () => {
    if (password !== "") {
      setPasswordTouched(true);
    } else {
      setPasswordTouched(false);
    }
  };

  const validatePhoneNumber = (phone) => {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phone);
  };

  return {
    email,
    isEmailValid,
    emailTouched,
    setEmailTouched,
    handleEmailChange,
    handleEmailBlur,
    password,
    isPasswordLongEnough,
    hasCapitalAndNumber,
    passwordTouched,
    setPasswordTouched,
    handlePasswordChange,
    handlePasswordBlur,
    validatePhoneNumber
  };
};