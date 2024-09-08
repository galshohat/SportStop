export const fetchUserCoupons = async (userId, setSessionExpired) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/users/${userId}/coupons`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        setSessionExpired(true);
        return;
      }
      throw new Error("Failed to fetch coupons");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};

export const updateUserCoupons = async (
  userId,
  couponCode,
  discount,
  stars,
  setSessionExpired,
  setUserInfo,
  setUserCoupons
) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/users/${userId}/coupons`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponCode, discount, stars }),
        credentials: "include",
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        setSessionExpired(true);
        return;
      }
      throw new Error("Failed to update coupons");
    }

    const data = await response.json();
    setUserInfo(data.user);
    setUserCoupons(data.coupons);
  } catch (error) {
    console.error("Error updating coupons:", error);
    throw error;
  }
};
