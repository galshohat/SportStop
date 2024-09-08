export const checkTokenUniqueness = async (token, setSessionExpired) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/orders/check-token/${token}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (response.status === 401) {
      setSessionExpired(true);
      return false; 
    }

    if (!response.ok) {
      throw new Error("Failed to check token uniqueness");
    }

    const data = await response.json();
    return data.isUnique;
  } catch (error) {
    console.error("Error checking token uniqueness:", error);
    return false; 
  }
};