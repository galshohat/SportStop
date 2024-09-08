import { fetchUserCoupons } from "../../Stars/Functions/handleCoupons.js";

export const handleCouponSubmit = async (
  userId,
  couponInput,
  setSessionExpired,
  setCouponStatus,
  setDiscountValue,
) => {
  try {
    const userCoupons = await fetchUserCoupons(userId, setSessionExpired);
    const validCoupon = userCoupons.find(
      (coupon) => coupon.code === couponInput
    );

    if (validCoupon) {
      setCouponStatus("valid");
      setDiscountValue(validCoupon.discount);
    } else {
      setCouponStatus("invalid");
      setDiscountValue(0);
    }
  } catch (error) {
    console.error("Error validating coupon:", error);
    setCouponStatus("invalid");
    setDiscountValue(0);
  }
};