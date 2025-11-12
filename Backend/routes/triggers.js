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

// ✅ Save new trigger entry
router.post("/", verifyToken, async (req, res) => {
  const { trigger_type, description } = req.body;
  const userId = req.user.id;

  if (!trigger_type)
    return res.status(400).json({ message: "Trigger type is required" });

  try {
    await db
      .promise()
      .query(
        "INSERT INTO triggers (user_id, trigger_type, description) VALUES (?, ?, ?)",
        [userId, trigger_type, description]
      );
    res.json({ message: "Trigger saved successfully!" });
  } catch (err) {
    console.error("❌ Error saving trigger:", err);
    res.status(500).json({ message: "Server error while saving trigger" });
  }
});

// ✅ Get all triggers for the logged-in user
router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT trigger_type, description, entry_date FROM triggers WHERE user_id = ? ORDER BY entry_date DESC",
        [userId]
      );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching triggers:", err);
    res.status(500).json({ message: "Server error while fetching triggers" });
  }
});

export default router;

