import express from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.js";

const router = express.Router();

router.put("/change-password/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send("Invalid user id");
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("User not found");

  user.password = bcrypt.hashSync(req.body.password, 5);
  const updatedUser = await user.save();
  if (!updatedUser) return res.status(500).send("The password could not be updated");
  res.send(updatedUser);
});

router.put("/update/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid user id");
  }

  const existingUser = await User.findById(req.params.id);
  if (!existingUser) {
    return res.status(404).send("User not found");
  }


  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name || existingUser.name,
      email: req.body.email || existingUser.email,
      phone: req.body.phone || existingUser.phone,
      street: req.body.street || existingUser.street,
      city: req.body.city || existingUser.city,
      country: req.body.country || existingUser.country,
      profilePicture: req.body.profilePicture || existingUser.profilePicture,
    },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(500).send("The user could not be updated");
  }

  res.send(updatedUser);
});


router.get("/", async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select("-password")
      .populate({
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
      })
      .lean();

    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send("Invalid user id");
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate({
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
    })
    .lean();

  if (!user) return res.status(400).send("Invalid user id");
  res.send(user);
});

router.delete("/delete-account/:id", async (req, res) => {
  
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid user ID");
  }

  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "The user account has been deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({
      success: false,
      error: "An error occurred while trying to delete the user",
    });
  }
});

router.get("/user-data/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid user id");
  }

  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(400).send("Invalid user id");
  }

  res.send(user);
});

export default router;