import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

const router = express.Router();

const domainEndingMapping = {
  gmail: ".com",
  yahoo: ".com",
  post: ".runi.ac.il",
};

const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return false;
  }

  const domainAndEnding = email.split("@")[1];
  if (!domainAndEnding) {
    return false;
  }

  const [domain, ...endingParts] = domainAndEnding.split(".");
  const ending = "." + endingParts.join(".");

  return domainEndingMapping[domain] === ending;
};

const validatePasswordLength = (password) => {
  return password.length >= 8;
};

const validateCapitalAndNumber = (password) => {
  const capitalPattern = /[A-Z]/;
  const numberPattern = /[0-9]/;
  return capitalPattern.test(password) && numberPattern.test(password);
};

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, street, city, country, profilePicture } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format or domain." });
    }

    if (!validatePasswordLength(password) || !validateCapitalAndNumber(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long, contain a capital letter, and a number.",
      });
    }

    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res.status(400).json({ message: "A user with this email already exists." });
    }

    let user = new User({
      name,
      email,
      password: bcrypt.hashSync(password, 5),
      phone,
      street,
      city,
      country,
      profilePicture,
    });

    user = await user.save();
    if (!user) {
      return res.status(500).send("The user cannot be created");
    }

    res.send(user);
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("There was an error creating the user");
  }
});

export default router;