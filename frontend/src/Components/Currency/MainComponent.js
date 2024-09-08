import React, { useContext, useState } from 'react';
import CurrencySwap from './CurrencySwapComponent';
import Navbar from '../Navbar/Navbar';
import { AuthContext } from '../Auth&Verify/UserAuth';
import { useNavigate } from 'react-router-dom';
import SessionExpiryRedirect from '../Auth&Verify/SessionExpiryRedirect';


const Currency = () => {
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate()

  const onUpdateCurrency = async (newCurrency) => {
    if (!userInfo) return;

    try {

      const response = await fetch(`http://localhost:8000/api/v1/users/change-currency/${userInfo._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currency: newCurrency }), 
        credentials: 'include',
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        setUserInfo(updatedUserData.user);
        if (sessionStorage.getItem('before-currency') && sessionStorage.getItem('before-currency') !== '/search-results'){
          navigate(sessionStorage.getItem('before-currency'))
        }
        else{
          navigate('/')
        }
      } else {
        if (response.status === 401) {
          setSessionExpired(true);
          return;
        }
        console.error('Failed to update currency');
      }
    } catch (error) {
      console.error('Error updating currency:', error);
    }
  };

  if (!userInfo) return <p>Loading user data...</p>; 

  return (
    <div>
      <Navbar/>
      <CurrencySwap currentCurrency={userInfo.currency} onCurrencyChange={onUpdateCurrency} />
      {sessionExpired && <SessionExpiryRedirect trigger={sessionExpired} />}
    </div>
  );
};

export default Currency;