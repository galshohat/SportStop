import React, { useState, useEffect } from 'react';
import Popup from '../Helpers/PopUp/PopUp';
import CircularProgress from '@mui/material/CircularProgress'; 
import './ChangePasswordPopup.css';

const LoadingButton = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={24} style={{ color: 'white' }} />
    </div>
);

const ChangePasswordPopup = ({ isOpen, onClose, onSuccess, onError, userId }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!isOpen) {
            setPassword('');
            setConfirmPassword('');
            setPasswordVisible(false);
            setPasswordTouched(false);
        }
    }, [isOpen]);

    const isPasswordLongEnough = password.length >= 8;
    const hasCapitalAndNumber = /(?=.*[A-Z])(?=.*[0-9])/.test(password);
    const isPasswordValid = isPasswordLongEnough && hasCapitalAndNumber;
    const isButtonEnabled = isPasswordValid && confirmPassword.length > 0;

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordTouched(true);
    };

    const handlePasswordBlur = () => {
        setPasswordTouched(true);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            onError('Passwords do not match.');
        } else if (!isPasswordValid) {
            onError('Password does not meet the requirements.');
        } else {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8000/api/v1/users/change-password/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ password }),
                    credentials: 'include'
                });

                setLoading(false);

                if (response.ok) {
                    onSuccess();
                    onClose(); 
                } else {
                    onError('Failed to change password.');
                }
            } catch (error) {
                setLoading(false);
                console.error('Error changing password:', error);
                onError('An error occurred. Please try again later.');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <Popup onClose={onClose} title="Change Password" isX={true}>
            <div className="password-change-container">
                <div className="input-holder password-input-wrapper">
                    <div className="password-input-container">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            className="details-in"
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={handlePasswordBlur}
                            placeholder=" "
                            required
                           
                        />
                        <label htmlFor="password" className="details-l"  >
                            Password
                        </label>
                        <span
                            className="password-toggle-icon"
                            onClick={togglePasswordVisibility}
                        >
                            {passwordVisible ? "🙈" : "👁️"}
                        </span>
                    </div>
                    <span
                        className={`password-validation-message ${
                            passwordTouched && password !== ""
                                ? isPasswordLongEnough
                                    ? "valid"
                                    : "invalid"
                                : "initial"
                        }`}
                    >
                        <span className="validation-icon">
                            {passwordTouched && password !== ""
                                ? isPasswordLongEnough
                                    ? "✔️"
                                    : "❌"
                                : "✔️"}
                        </span>
                        At least 8 characters
                    </span>
                    <span
                        className={`password-validation-message ${
                            passwordTouched && password !== ""
                                ? hasCapitalAndNumber
                                    ? "valid"
                                    : "invalid"
                                : "initial"
                        }`}
                    >
                        <span className="validation-icon">
                            {passwordTouched && password !== ""
                                ? hasCapitalAndNumber
                                    ? "✔️"
                                    : "❌"
                                : "✔️"}
                        </span>
                        At least one capital letter and one number
                    </span>
                    <div className="password-input-container">
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="details-in"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder=" "
                            required
                        />
                        <label htmlFor="confirmPassword" className="details-l">
                            Confirm Password
                        </label>
                    </div>
                </div>
                <button 
                    onClick={handleSubmit} 
                    className="popup-button"
                    disabled={!isButtonEnabled || loading}
                    style={{ backgroundColor: isButtonEnabled && !loading ? '#1976D2' : '#aaa' }}
                >
                    {loading ? <LoadingButton /> : 'Change Password'}
                </button>
            </div>
        </Popup>
    );
};

export default ChangePasswordPopup;