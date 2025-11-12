import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// 🟩 Register User
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  try {
    const [existingUser] = await db
      .promise()
      .query("SELECT * FROM users WHERE username = ?", [username]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .promise()
      .query("INSERT INTO users (username, password) VALUES (?, ?)", [
        username,
        hashedPassword,
      ]);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

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

    // ✅ Include userId in response
    res.json({ 
      message: "Login successful!", 
      token, 
      userId: user.id 
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
