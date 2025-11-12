# Database Setup Instructions

## Prerequisites
- MySQL Server installed and running on your machine
- MySQL credentials (username and password)

## Setup Steps

### 1. Verify MySQL is Running
Make sure your MySQL server is running. You can check by opening MySQL Workbench or running:
```powershell
mysql -u root -p
```

### 2. Configure Environment Variables
The `.env` file in the `Backend` folder is already configured with:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=pranav61
DB_NAME=mental_health_tracker
JWT_SECRET=supersecretkey123
PORT=5000
```

**Important:** If your MySQL password is different, update `DB_PASSWORD` in the `.env` file.

### 3. Initialize the Database
From the Backend directory, run:
```powershell
cd "C:\Users\Pranav\Mental Health Tracker\Backend"
npm run init-db
```

This script will:
- Connect to MySQL server
- Create the `mental_health_tracker` database (if it doesn't exist)
- Create the `users` table
- Create the `mood_entries` table
- Create indexes and foreign keys

### 4. Start the Server
```powershell
npm start
```

You should see:
```
✅ Connected to MySQL database (mental_health_tracker).
✅ Server running on http://localhost:5000
```

## Database Schema

### Users Table
- `id` - Primary key (auto-increment)
- `username` - Unique username
- `password` - Hashed password
- `created_at` - Registration timestamp

### Mood Entries Table
- `id` - Primary key (auto-increment)
- `user_id` - Foreign key to users table
- `mood` - Mood value (e.g., "happy", "sad", "anxious")
- `note` - Optional text note
- `entry_date` - Timestamp of the mood entry

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Moods
- `POST /api/moods` - Save new mood entry (requires authentication)
- `GET /api/moods` - Get all mood entries for logged-in user (requires authentication)

## Troubleshooting

### Connection Failed
If you see "Database connection failed", check:
1. MySQL server is running
2. Username and password in `.env` are correct
3. MySQL is listening on localhost:3306

### Table Already Exists
The SQL script uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run multiple times.

### Reset Database
To completely reset the database:
```sql
DROP DATABASE mental_health_tracker;
```
Then run `npm run init-db` again.

