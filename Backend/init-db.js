// Database initialization script
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function initializeDatabase() {
  try {
    // First connect without specifying a database to create it if needed
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD,
    });

    console.log("✅ Connected to MySQL server");

    // Create database if it doesn't exist
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || "mental_health_tracker"}`
    );
    console.log(`✅ Database '${process.env.DB_NAME || "mental_health_tracker"}' created or already exists`);

    // Switch to the database
    await connection.query(`USE ${process.env.DB_NAME || "mental_health_tracker"}`);

    // Read and execute the SQL schema file
    const sqlPath = path.join(__dirname, "../moods.sql");
    const sqlContent = fs.readFileSync(sqlPath, "utf8");

    // Split by semicolons and execute each statement
    const statements = sqlContent
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

    for (const statement of statements) {
      if (statement.toUpperCase().includes("CREATE DATABASE") || statement.toUpperCase().includes("USE")) {
        continue; // Skip these as we've already handled them
      }
      await connection.query(statement);
    }

    console.log("✅ Database tables created successfully");

    // Verify tables exist
    const [tables] = await connection.query("SHOW TABLES");
    console.log("\n📊 Tables in database:");
    tables.forEach((table) => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    await connection.end();
    console.log("\n✅ Database initialization complete!");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
}

initializeDatabase();

