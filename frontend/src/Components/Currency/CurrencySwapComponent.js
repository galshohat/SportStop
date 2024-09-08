import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import './CurrencySwap.css';
import CurrencyImage from './currency-image.png'; 

const currencies = [
  { symbol: '₪', name: 'Shekel', code: 'ILS' },
  { symbol: '$', name: 'Dollar', code: 'USD' },
  { symbol: '€', name: 'Euro', code: 'EUR' },
  { symbol: '£', name: 'Pound', code: 'GBP' },
  { symbol: '¥', name: 'Yen', code: 'JPY' },
];

const CurrencySwap = ({ currentCurrency, onCurrencyChange }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(
    currencies.find((currency) => currency.symbol === currentCurrency) || currencies[0]
  );
  const containerRef = useRef(null);

  useEffect(() => {

    let index = 0;
    const maxSymbols = 50;
    const interval = setInterval(() => {
      if (index < maxSymbols) {
        createFallingSymbol(selectedCurrency.symbol);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [selectedCurrency]);

  const createFallingSymbol = (symbol) => {
    const symbolElement = document.createElement('div');
    symbolElement.className = 'raining-symbol';
    symbolElement.style.left = `${Math.random() * 100}vw`;
    symbolElement.style.transform = `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 20 - 10}vw)`;
    symbolElement.textContent = symbol;

    if (containerRef.current) {
      containerRef.current.appendChild(symbolElement);

      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.removeChild(symbolElement);
        }
      }, 2000); 
    }
  };

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
  };

  const handleSubmit = async () => {
    try {
      await onCurrencyChange(selectedCurrency.symbol);
    } catch (error) {
      console.error('Error changing currency:', error);
      alert('Failed to change currency');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f0f0f0"
      position="relative"
      overflow="hidden"
      ref={containerRef}
    >
      <Paper elevation={3} className="currency-swap-paper">
        <Box className="currency-content">
          <Box className="currency-options-container">
            <Typography variant="h4" className="currency-swap-title" gutterBottom>
              Choose Your Currency
            </Typography>
            <Box className="currency-boxes">
              {currencies.map((currency) => (
                <Box
                  key={currency.code}
                  className={`currency-box ${
                    selectedCurrency.code === currency.code ? 'selected' : ''
                  }`}
                  onClick={() => handleCurrencySelect(currency)}
                >
                  <Typography variant="h5" className="currency-symbol">
                    {currency.symbol}
                  </Typography>
                  <Typography variant="subtitle1" className="currency-name">
                    {currency.name}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Button
              onClick={handleSubmit}
              className="submit-button"
              variant="contained"
              color="primary"
              style={{ marginTop: '20px', width: '100%' }}
            >
              Save Changes
            </Button>
          </Box>
          <Box className="currency-image-container">
            <img src={CurrencyImage} alt="Currency" className="currency-image" />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CurrencySwap;