-- Mental Health Tracker Database Schema
-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS mental_health_tracker;
USE mental_health_tracker;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mood entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  mood VARCHAR(50) NOT NULL,
  note TEXT,
  entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_date (user_id, entry_date)
);

-- Triggers table for emotional reactions
CREATE TABLE IF NOT EXISTS triggers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  trigger_type VARCHAR(50) NOT NULL,
  description TEXT,
  entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_date (user_id, entry_date)
);

-- Appointments table for doctor appointments
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
);

-- Optional: View to get user mood statistics
CREATE OR REPLACE VIEW user_mood_stats AS
SELECT 
  u.id AS user_id,
  u.username,
  COUNT(m.id) AS total_entries,
  m.mood,
  COUNT(*) AS mood_count
FROM users u
LEFT JOIN mood_entries m ON u.id = m.user_id
GROUP BY u.id, u.username, m.mood;
