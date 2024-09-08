import express from "express";
import mongoose from "mongoose";
import User from "../models/user.js";
const router = express.Router();

router.post("/change-currency/:id", async (req, res) => {
  const { currency } = req.body;

  if (!currency) {
    return res.status(400).send("Currency is required");
  }

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid user ID");
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.currency = currency;
    await user.save();

    res.status(200).json({ success: true, message: "Currency updated successfully", user });
  } catch (error) {
    console.error("Error updating currency:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while trying to update the currency",
    });
  }
});

export default router;