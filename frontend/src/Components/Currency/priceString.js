import getExchangeRateToShekels from "./exchangeRate";

const convertPriceToString = async (valueInShekels, userInfo, toFixed = 2, withSymbol = true) => {
    try {
      const currencySymbol = userInfo?.currency || '₪';
  
      if (currencySymbol === '₪') {
        return `${withSymbol ? currencySymbol : ''}${Math.round(valueInShekels).toFixed(toFixed)}`;
      }
  
      const exchangeRate = await getExchangeRateToShekels(currencySymbol);
      const convertedValue = valueInShekels * exchangeRate;
  
      return `${withSymbol ? currencySymbol : ''}${Math.round(convertedValue).toFixed(toFixed)}`;
    } catch (error) {
      console.error('Error converting price:', error);

      return `${withSymbol ? '₪' : ''}${Math.round(valueInShekels).toFixed(toFixed)}`;
    }
  };


export default convertPriceToString;