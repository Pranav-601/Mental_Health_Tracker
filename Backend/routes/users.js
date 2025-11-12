import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../db.js";

dotenv.config();

const router = express.Router();

// 🟦 Login User
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM users WHERE username = ?", [username]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Send token to frontend
    res.json({
      message: "Login successful!",
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ✅ Export router (outside all functions!)
export default router;
