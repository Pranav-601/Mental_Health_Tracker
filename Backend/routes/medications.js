import express from "express";
import db from "../db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟩 Add Medication
router.post("/", verifyToken, async (req, res) => {
  const { name, dosage, frequency, time_of_day, start_date } = req.body;

  if (!name)
    return res.status(400).json({ message: "Medication name required" });

  try {
    await db
      .promise()
      .query(
        `INSERT INTO medications (user_id, name, dosage, frequency, time_of_day, start_date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [req.user.id, name, dosage, frequency, time_of_day, start_date]
      );

    res.json({ message: "Medication added successfully!" });
  } catch (err) {
    console.error("❌ Add medication error:", err);
    res.status(500).json({ message: "Server error adding medication" });
  }
});

// 🟦 Get User Medications
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM medications WHERE user_id = ?", [req.user.id]);

    res.json(rows);
  } catch (err) {
    console.error("❌ Fetch medications error:", err);
    res.status(500).json({ message: "Server error fetching medications" });
  }
});

// 🟨 Mark as Taken
router.post("/taken/:id", verifyToken, async (req, res) => {
  const medId = req.params.id;

  try {
    await db
      .promise()
      .query(
        `INSERT INTO medication_log (medication_id, user_id)
         VALUES (?, ?)`,
        [medId, req.user.id]
      );

    res.json({ message: "Marked as taken!" });
  } catch (err) {
    console.error("❌ Took medication error:", err);
    res.status(500).json({ message: "Error marking medication as taken" });
  }
});

// 🟧 Delete Medication
router.delete("/:id", verifyToken, async (req, res) => {
  const medId = req.params.id;

  try {
    await db
      .promise()
      .query("DELETE FROM medications WHERE id = ? AND user_id = ?", [
        medId,
        req.user.id,
      ]);

    res.json({ message: "Medication deleted" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Error deleting medication" });
  }
});

export default router;
