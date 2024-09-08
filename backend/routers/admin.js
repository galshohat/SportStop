import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const token = req.cookies.authToken;
    const secretKey = process.env.secretKey;
    if (!token) {
      console.error("No token provided");
      return res
        .status(401)
        .send({ message: "Access denied. No token provided." });
    }
    const decoded = jwt.verify(token, secretKey);
    if (decoded.isAdmin) {
      return res.status(200).send({ isAdmin: true });
    } else {
      return res
        .status(403)
        .send({ isAdmin: false, message: "User is not an admin." });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(400)
      .send({ message: "Invalid token or session expired." });
  }
});

export default router;
