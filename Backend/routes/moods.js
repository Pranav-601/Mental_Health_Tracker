import express from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ Middleware: Verify JWT Token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });

    req.user = decoded;
    next();
  });
}

// ✅ Save new mood entry
router.post("/", verifyToken, async (req, res) => {
  const { mood, note } = req.body;
  const userId = req.user.id;

  if (!mood)
    return res.status(400).json({ message: "Mood is required" });

  try {
    await db
      .promise()
      .query(
        "INSERT INTO mood_entries (user_id, mood, note) VALUES (?, ?, ?)",
        [userId, mood, note]
      );
    res.json({ message: "Mood saved successfully!" });
  } catch (err) {
    console.error("❌ Error saving mood:", err);
    res.status(500).json({ message: "Server error while saving mood" });
  }
});

// ✅ Get all moods for the logged-in user
router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT mood, note, entry_date FROM mood_entries WHERE user_id = ? ORDER BY entry_date DESC",
        [userId]
      );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching moods:", err);
    res.status(500).json({ message: "Server error while fetching moods" });
  }
});

export default router;
