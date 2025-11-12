import express from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🟩 Middleware: Verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 🟦 Add mood entry
router.post("/add", verifyToken, async (req, res) => {
  const { mood, note } = req.body;
  const userId = req.user.id;

  try {
    await db
      .promise()
      .query("INSERT INTO moods (user_id, mood, note, date) VALUES (?, ?, ?, CURDATE())", [
        userId,
        mood,
        note,
      ]);
    res.status(201).json({ message: "Mood saved successfully!" });
  } catch (err) {
    console.error("❌ Error saving mood:", err);
    res.status(500).json({ message: "Server error while saving mood" });
  }
});

// 🟨 Get moods for logged-in user
router.get("/list", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM moods WHERE user_id = ? ORDER BY date DESC", [userId]);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching moods:", err);
    res.status(500).json({ message: "Server error while fetching moods" });
  }
});

export default router;
