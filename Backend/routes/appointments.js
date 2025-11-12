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

// ✅ Create new appointment
router.post("/", verifyToken, async (req, res) => {
  const { appointment_date, appointment_time, doctor_name, notes } = req.body;
  const userId = req.user.id;

  if (!appointment_date || !appointment_time || !doctor_name)
    return res.status(400).json({ message: "Date, time, and doctor name are required" });

  try {
    await db
      .promise()
      .query(
        "INSERT INTO appointments (user_id, appointment_date, appointment_time, doctor_name, notes) VALUES (?, ?, ?, ?, ?)",
        [userId, appointment_date, appointment_time, doctor_name, notes]
      );
    res.json({ message: "Appointment saved successfully!" });
  } catch (err) {
    console.error("❌ Error saving appointment:", err);
    res.status(500).json({ message: "Server error while saving appointment" });
  }
});

// ✅ Get all appointments for the logged-in user
router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT id, appointment_date, appointment_time, doctor_name, notes, reminder_sent, created_at FROM appointments WHERE user_id = ? ORDER BY appointment_date ASC, appointment_time ASC",
        [userId]
      );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching appointments:", err);
    res.status(500).json({ message: "Server error while fetching appointments" });
  }
});

// ✅ Delete appointment
router.delete("/:id", verifyToken, async (req, res) => {
  const appointmentId = req.params.id;
  const userId = req.user.id;

  try {
    const [result] = await db
      .promise()
      .query(
        "DELETE FROM appointments WHERE id = ? AND user_id = ?",
        [appointmentId, userId]
      );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted successfully!" });
  } catch (err) {
    console.error("❌ Error deleting appointment:", err);
    res.status(500).json({ message: "Server error while deleting appointment" });
  }
});

// ✅ Update appointment reminder status
router.patch("/:id/reminder", verifyToken, async (req, res) => {
  const appointmentId = req.params.id;
  const userId = req.user.id;

  try {
    const [result] = await db
      .promise()
      .query(
        "UPDATE appointments SET reminder_sent = TRUE WHERE id = ? AND user_id = ?",
        [appointmentId, userId]
      );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Reminder status updated!" });
  } catch (err) {
    console.error("❌ Error updating reminder:", err);
    res.status(500).json({ message: "Server error while updating reminder" });
  }
});

export default router;

