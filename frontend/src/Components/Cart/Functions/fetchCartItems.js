export const fetchCartItems = async (userId, setCartItems, setLoading, setError , setSessionExpired) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/users/cart-items/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
        
        if (response.status === 401) {
            setSessionExpired(true);
            return;
       } 
  
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }
  
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
};