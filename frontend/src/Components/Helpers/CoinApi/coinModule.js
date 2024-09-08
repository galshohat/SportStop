async function fetchWithRetry(url, options = {}, retries = 3, backoff = 3000) {
    try {
        const response = await fetch(url, options);
        if (!response.ok && retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff);
        }
        return response;
    } catch (error) {
        if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff);
        } else {
            throw error;
        }
    }
}

async function convertShekelToUSD() {
    try {
        const response = await fetchWithRetry('https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=ils');
        const data = await response.json();
        console.log(`1 USD = ${data.usd.ils} ILS`);
    } catch (error) {
        console.error('Error fetching conversion rate:', error);
    }
}

export default convertShekelToUSD