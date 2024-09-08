function getCurrencyCodeFromSymbol(symbol) {
    const symbolToCodeMap = {
      '₪': 'ILS', 
      '$': 'USD', 
      '€': 'EUR', 
      '£': 'GBP', 
      '¥': 'JPY', 
    };
  
    return symbolToCodeMap[symbol];
  }
  
  async function getExchangeRateToShekels(symbol) {
    const currencyCode = getCurrencyCodeFromSymbol(symbol); 
    const baseCurrency = 'ILS'; 
  
    if (!currencyCode) {
      throw new Error('Unsupported currency symbol');
    }
  
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
      );
      const data = await response.json();
  
      const exchangeRate = data.rates[currencyCode];
  
      if (exchangeRate) {
        console.log(`Exchange rate from Shekels to ${currencyCode}: ${exchangeRate}`);
        return exchangeRate;
      } else {
        throw new Error('Currency code not found');
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      throw error;
    }
  }
  
  export default getExchangeRateToShekels;