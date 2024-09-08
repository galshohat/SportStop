import express from "express";
import User from "../models/user.js";

const router = express.Router();

router.get("/:userId/coupons", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user.coupons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch coupons", error });
  }
});

router.post("/:userId/coupons", async (req, res) => {
  const { couponCode, discount, stars } = req.body;

  try {
    const user = await User.findById(req.params.userId).populate({
      path: "cart",
      populate: [
        {
          path: "product",
          select: "name price image colors sizes",
          populate: [
            { path: "sizes", select: "name" },
            { path: "colors", select: "name" },
          ],
        },
        { path: "size", select: "name" },
      ],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.stopPoints < stars) {
      return res.status(400).json({ message: "Insufficient stars" });
    }
    user.stopPoints = Math.round(user.stopPoints - stars);
    user.coupons.push({ code: couponCode, discount });
    await user.save();

    return res.json({ message: "Coupon added successfully", user: user, coupons: user.coupons });
  } catch (error) {
    res.status(500).json({ message: "Failed to update coupons", error });
  }
});

export default router;