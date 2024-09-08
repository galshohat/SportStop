const fetchUserData = async (userId, setSessionExpired) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/users/user-data/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          },
        credentials: "include"
      });
        
        if (response.status === 401) {
            setSessionExpired(true);
            return;
        }
  
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
};
  
export default fetchUserData;