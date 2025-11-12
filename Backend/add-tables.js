import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function addTables() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || "mental_health_tracker"
    });

    console.log("✅ Connected to MySQL database");

    // Create triggers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS triggers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        trigger_type VARCHAR(50) NOT NULL,
        description TEXT,
        entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_date (user_id, entry_date)
      )
    `);
    console.log("✅ Triggers table created");

    // Create appointments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        doctor_name VARCHAR(255) NOT NULL,
        notes TEXT,
        reminder_sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_appointment (user_id, appointment_date)
      )
    `);
    console.log("✅ Appointments table created");

    // Show all tables
    const [tables] = await connection.query("SHOW TABLES");
    console.log("\n📊 Tables in database:");
    tables.forEach((table) => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    await connection.end();
    console.log("\n✅ Database update complete!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

addTables();

