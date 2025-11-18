import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/authRoutes.js";
import moodRoutes from "./routes/moods.js";
import triggerRoutes from "./routes/triggers.js";
import appointmentRoutes from "./routes/appointments.js";
import medicationRoutes from "./routes/medications.js";

const app = express();
const PORT = 5000;
const __dirname = path.resolve();

// ===== Middleware =====
app.use(cors());
app.use(bodyParser.json());

// ===== Routes =====
app.use("/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/triggers", triggerRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medications", medicationRoutes);

// ===== Serve Frontend =====
const frontendPath = path.join(__dirname, "../Frontend");
app.use(express.static(frontendPath));

// Fallback route for SPA
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📂 Serving frontend from: ${frontendPath}`);
});
