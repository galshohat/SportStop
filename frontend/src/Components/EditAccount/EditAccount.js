import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import ProfileImagePopup from './ProfileImagePopup';
import ChangePasswordPopup from './ChangePasswordPopup';
import DeleteAccountPopup from './DeleteAccountPopup';
import SessionExpiryRedirect from '../Auth&Verify/SessionExpiryRedirect';
import Loading from '../Loader/Loader'; 
import { AuthContext } from '../Auth&Verify/UserAuth';
import Popup from '../Helpers/PopUp/PopUp';
import './EditAccount.css';

const EditAccount = () => {
    const { userInfo, setUserInfo, logout } = useContext(AuthContext);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialUser, setInitialUser] = useState(null);
    const [user, setUser] = useState({
        id: '',
        name: '',
        email: '',
        country: '',
        city: '',
        street: '',
        phone: '',
        profilePicture: ''
    });

    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [isDeleteAccountDialogOpen, setIsDeleteAccountOpen] = useState(false);
    const [popup, setPopup] = useState({ isOpen: false, title: '', description: '' });
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo) {
            setUser({
                id: userInfo._id,
                name: userInfo.name || '',
                email: userInfo.email || '',
                country: userInfo.country || '',
                city: userInfo.city || '',
                street: userInfo.street || '',
                phone: userInfo.phone || '',
                profilePicture: userInfo.profilePicture || ''
            });
            setInitialUser(userInfo);
        }
    }, [userInfo]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [id]: value
        }));
    };

    const hasChanges = () => {
        if (!initialUser) return false;
        return (
            user.name !== initialUser.name ||
            user.email !== initialUser.email ||
            user.country !== initialUser.country ||
            user.city !== initialUser.city ||
            user.street !== initialUser.street ||
            user.phone !== initialUser.phone ||
            user.profilePicture !== initialUser.profilePicture
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (user.email !== initialUser.email) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(user.email)) {
                setPopup({
                    isOpen: true,
                    title: 'Invalid Email',
                    description: 'Please enter a valid email address.'
                });
                return;
            }
    
            try {
                const emailCheckResponse = await fetch('http://localhost:8000/api/v1/users/check-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: user.email }),
                });
    
                const emailCheckData = await emailCheckResponse.json();
    
                if (emailCheckData.exists) {
                    setPopup({
                        isOpen: true,
                        title: 'Email Exists',
                        description: 'This email is already associated with another account. Please use a different email.'
                    });
                    return;
                }
            } catch (error) {
                console.error('Error checking email:', error);
                return;
            }
        }
    
        try {
            const response = await saveAccount(user);
    
            if (response.ok) {
                const updatedUser = await response.json();
                setUserInfo(updatedUser);
                setPopup({
                    isOpen: true,
                    title: 'Success',
                    description: 'Account details updated successfully.'
                });
                navigate('/');
            }
        } catch (error) {
            console.error('Error updating account details:', error);
        }
    };

    const isPhoneNumberValid = (phone) => {
        return phone.length === 10 && !isNaN(phone);
    };

    const openProfileDialog = () => {
        setIsProfileDialogOpen(true);
    };

    const closeProfileDialog = () => {
        setIsProfileDialogOpen(false);
    };

    const openPasswordDialog = () => {
        setIsPasswordDialogOpen(true);
    };

    const closePasswordDialog = () => {
        setIsPasswordDialogOpen(false);
    };

    const openDeleteAccountDialog = () => {
        setIsDeleteAccountOpen(true);
    };

    const closeDeleteAccountDialog = () => {
        setIsDeleteAccountOpen(false);
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/delete-account/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (response.ok) {
                setPopup({
                    isOpen: true,
                    title: 'Success',
                    description: 'Account deleted successfully.'
                });
                logout();
                navigate('/auth');
            } else {
                const errorData = await response.json();
                console.error('Failed to delete account:', errorData.message);
            }
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const saveAccount = async (userData) => {
        const response = await fetch(`http://localhost:8000/api/v1/users/update/${userData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                street: userData.street,
                city: userData.city,
                country: userData.country,
                profilePicture: userData.profilePicture
            }),
            credentials: 'include'
        });

        if (response.status === 401) {
            setSessionExpired(true);
        }

        return response;
    };

    const handleProfilePictureSelect = async (picture) => {
        try {
            const updatedUser = { ...user, profilePicture: picture };

            const response = await saveAccount(updatedUser);

            if (response.ok) {
                const updatedUserFromServer = await response.json();
                setUserInfo(updatedUserFromServer);
                setPopup({
                    isOpen: true,
                    title: 'Success',
                    description: 'Profile picture updated successfully.'
                });
            } 
        } catch (error) {
            setLoading(false);
            console.error('Error updating profile picture:', error);
        }
    };

    const handlePasswordChangeSuccess = () => {
        setPopup({
            isOpen: true,
            title: 'Success',
            description: 'Password changed successfully.'
        });
        closePasswordDialog();
    };

    const handlePasswordChangeError = (errorMessage) => {
        setPopup({
            isOpen: true,
            title: 'Error',
            description: errorMessage
        });
    };

    return (
        <>
            <Navbar isLoggedIn={false} user={user} cartItemCount={0} />

            {loading && <Loading />}

            <div className="edit-account-container">
                <aside className="sidebar">
                    <div className="profile-picture-container" onClick={openProfileDialog}>
                        <img src={user.profilePicture} alt="User Profile" className="profile-picture" />
                        <div className="profile-edit-overlay">Edit</div>
                    </div>
                    <nav className="menu">
                        <a href="#" className="menu-item" onClick={openPasswordDialog}>Change Password</a>
                        <a href="#" className="menu-item" onClick={openDeleteAccountDialog}>Delete Account</a>
                    </nav>
                </aside>

                <main className="account-details">
                    <h1>Account Settings</h1>
                    <form className="account-form" onSubmit={handleSubmit}>
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={user.name}
                            onChange={handleInputChange}
                            required
                        />

                        <label htmlFor="email">Email address</label>
                        <input
                            type="email"
                            id="email"
                            value={user.email}
                            onChange={handleInputChange}
                            required
                        />

                        <label htmlFor="country">Country</label>
                        <input type="text" id="country" value={user.country} onChange={handleInputChange} />

                        <label htmlFor="city">City</label>
                        <input type="text" id="city" value={user.city} onChange={handleInputChange} />

                        <label htmlFor="street">Street</label>
                        <input type="text" id="street" value={user.street} onChange={handleInputChange} />

                        <label htmlFor="phone">Phone</label>
                        <input type="text" id="phone" value={user.phone} onChange={handleInputChange} />

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={!hasChanges() || !isPhoneNumberValid(user.phone)}
                            style={{ backgroundColor: hasChanges() && isPhoneNumberValid(user.phone) ? '#1976D2' : '#aaa' }}
                        >
                            Save Changes
                        </button>
                    </form>
                </main>
                {sessionExpired && <SessionExpiryRedirect trigger={sessionExpired} />}
            </div>
        
        <ProfileImagePopup
            isOpen={isProfileDialogOpen}
            onClose={closeProfileDialog}
            onSelect={handleProfilePictureSelect}
        />

        <ChangePasswordPopup
            isOpen={isPasswordDialogOpen}
            onClose={closePasswordDialog}
            onSuccess={handlePasswordChangeSuccess}
            onError={handlePasswordChangeError}
            userId={user.id}
        />

        <DeleteAccountPopup
            isOpen={isDeleteAccountDialogOpen}
            onClose={closeDeleteAccountDialog}
            onConfirm={handleDeleteAccount}
        />

        {popup.isOpen && (
            <Popup
                onClose={() => setPopup({ isOpen: false, title: '', description: '' })}
                title={popup.title}
                description={popup.description}
                buttonText="Close"
                isX={true}
            />
        )}
    </>
);
};



export default EditAccount;