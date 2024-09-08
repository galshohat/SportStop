import React, { useState, useEffect, useContext } from 'react';
import getExchangeRateToShekels from './exchangeRate';
import { AuthContext } from '../Auth&Verify/UserAuth'; 

const Price = ({ valueInShekels, toFixed = 0, withSymbol = true, roundPrice = true }) => {
  const { userInfo } = useContext(AuthContext); 
  const [convertedValue, setConvertedValue] = useState(null);

  useEffect(() => {
    const convertPrice = async () => {
      try {
        const currencySymbol = userInfo.currency || "₪";

        const shekelsValue = Number(valueInShekels);

        if (isNaN(shekelsValue)) {
          throw new Error('Invalid valueInShekels: Not a number');
        }

        if (!currencySymbol || currencySymbol === '₪') {
          setConvertedValue(shekelsValue.toFixed(toFixed));
          return;
        }

        let exchangeRate;
        if (userInfo.currency === "₪") {
          exchangeRate = 1;
        } else {
          exchangeRate = await getExchangeRateToShekels(currencySymbol);
        }
        
        let converted = shekelsValue * exchangeRate;

        if (roundPrice) {
          converted = Math.round(converted);
        }

        setConvertedValue(converted.toFixed(toFixed)); 
      } catch (error) {
        console.error('Error converting price:', error);
        setConvertedValue(Number(valueInShekels).toFixed(toFixed));
      }
    };

    if (userInfo) {
      convertPrice();
    }
  }, [userInfo, valueInShekels, toFixed, roundPrice]);

  return (
    <>
      {convertedValue !== null ? (
        <>
          {withSymbol && userInfo.currency}{convertedValue}
        </>
      ) : (
        'Calculating...'
      )}
    </>
  );
};

export default Price;