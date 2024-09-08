import React, { useState } from 'react';
import Popup from '../Helpers/PopUp/PopUp';
import Loading from '../Loader/Loader';
import './DeleteAccountPopup.css';

const DeleteAccountPopup = ({ isOpen, onClose, onConfirm }) => {
    const [loading, setLoading] = useState(false)


    if (!isOpen) return null;

    const deleteAccount = async () => {
        setLoading(true)
        await onConfirm()
    }
    return (
        <Popup
            onClose={onClose}
            title="Delete Account"
            isX={true} 
        >   
            <div className='delete-account-popup-content'>
            {loading && <Loading className="popup-loading" />} 
            </div>

            {!loading && (
                <>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="popup-buttons-right">
                    <button
                        onClick={deleteAccount}
                        className="delete-button"
                    >
                        I'm Sure
                    </button>
                    </div>
                </>
    
            )}
           


        </Popup>
    );
};

export default DeleteAccountPopup;