import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/login", async (req, res) => {
  const secretKey = process.env.secretKey;
  const user = await User.findOne({ email: req.body.email })
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

  if (!user) return res.status(404).send({ message: "The user not found" });

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    let maxAge = 30 * 60 * 1000;
    let expireTime = "30m";

    if (req.body.rememberMe) {
      maxAge = 10 * 24 * 60 * 60 * 1000;
      expireTime = "10d";
    }

    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secretKey,
      { expiresIn: expireTime }
    );

    const { password, ...userWithoutSensitiveFields } = user;

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      maxAge: maxAge,
      sameSite: "Lax",
    });


    return res.status(200).send({ user: userWithoutSensitiveFields });
  } else {
    return res.status(401).send({ message: "Invalid password!" });
  }
});

router.post("/logout", async (req, res) => {
  res.status(202).clearCookie("authToken").send("cookie deleted");
});


router.put("/login-activity/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.LoginActivity.push(new Date(Date.now() + 3 * 60 * 60 * 1000));
      await user.save();
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });
  
  router.put("/logout-activity/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.LogoutActivity.push(new Date(Date.now() + 3 * 60 * 60 * 1000));
      await user.save();
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

  router.post("/check-email", async (req, res) => {
    const { email } = req.body;
  
    try {
  
      const user = await User.findOne({ email: email });
  
      if (user) {
  
        return res.status(200).json({ exists: true });
      } else {
  
        return res.status(200).json({ exists: false });
      }
    } catch (error) {
  
      console.error("Error checking email:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

export default router;