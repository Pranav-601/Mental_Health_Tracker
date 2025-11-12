# ✅ MySQL Backend Setup Complete!

Your Mental Health Tracker backend is now fully connected to MySQL database!

## What Was Done

### 1. Database Configuration
- ✅ Updated `Backend/db.js` to use environment variables from `.env`
- ✅ Cleaned up `.env` file with correct credentials
- ✅ Added `dotenv` configuration to all route files

### 2. Database Schema
- ✅ Created complete SQL schema in `moods.sql`
  - **users** table: stores user accounts with hashed passwords
  - **mood_entries** table: stores moods and notes with foreign key to users
  - Indexes for optimal query performance

### 3. Database Initialization Script
- ✅ Created `Backend/init-db.js` - automated database setup script
- ✅ Added npm scripts to `package.json`:
  - `npm run init-db` - Initialize database
  - `npm run start` - Start the server

### 4. Database Status
- ✅ Database `mental_health_tracker` created
- ✅ Tables `users` and `mood_entries` created
- ✅ Server successfully connects to MySQL

## How to Use

### Starting Your Server

```powershell
cd "C:\Users\Pranav\Mental Health Tracker\Backend"
node server.js
```

You should see:
```
✅ Connected to MySQL database (mental_health_tracker).
✅ Server running on http://localhost:5000
```

### API Endpoints Available

#### Authentication
- **POST** `/api/auth/register` - Register new user
  ```json
  {
    "username": "myusername",
    "password": "mypassword"
  }
  ```

- **POST** `/api/auth/login` - Login and get token
  ```json
  {
    "username": "myusername",
    "password": "mypassword"
  }
  ```
  Returns: `{ "token": "...", "userId": 123 }`

#### Mood Tracking
- **POST** `/api/moods` - Save mood entry (requires Bearer token)
  ```json
  {
    "mood": "happy",
    "note": "Had a great day!"
  }
  ```

- **GET** `/api/moods` - Get all moods for logged-in user (requires Bearer token)
  Returns array of mood entries with timestamps

### Frontend Integration

Your frontend should:
1. Store the JWT token after login (e.g., in localStorage)
2. Include the token in API requests:
   ```javascript
   fetch('http://localhost:5000/api/moods', {
     headers: {
       'Authorization': `Bearer ${token}`
     }
   })
   ```

## Database Schema

### users table
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment user ID |
| username | VARCHAR(255) | Unique username |
| password | VARCHAR(255) | Bcrypt hashed password |
| created_at | TIMESTAMP | Account creation time |

### mood_entries table
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment entry ID |
| user_id | INT (FK) | References users(id) |
| mood | VARCHAR(50) | Mood value (e.g., "happy", "sad") |
| note | TEXT | Optional user note |
| entry_date | TIMESTAMP | When mood was recorded |

## Environment Variables (.env)

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=pranav61
DB_NAME=mental_health_tracker
JWT_SECRET=supersecretkey123
PORT=5000
```

## Troubleshooting

### PowerShell Script Execution Error
If you see script execution errors with npm, use `node` directly:
```powershell
node server.js
node init-db.js
```

### Database Connection Failed
1. Verify MySQL is running
2. Check credentials in `.env` file
3. Ensure MySQL is on localhost:3306

### Reset Database
```powershell
# Run in MySQL client or Workbench
DROP DATABASE mental_health_tracker;

# Then re-initialize
node init-db.js
```

## Next Steps

1. ✅ Database is ready
2. ✅ Backend is configured
3. 🔄 Test your frontend by registering a user and saving moods
4. 🔄 Verify data is being saved by checking the database

To verify data in MySQL:
```sql
USE mental_health_tracker;
SELECT * FROM users;
SELECT * FROM mood_entries;
```

## Files Modified/Created

- ✅ `Backend/db.js` - Updated to use environment variables
- ✅ `Backend/.env` - Cleaned up configuration
- ✅ `Backend/routes/moods.js` - Added dotenv import
- ✅ `Backend/routes/authRoutes.js` - Added dotenv import
- ✅ `moods.sql` - Complete database schema
- ✅ `Backend/init-db.js` - Database initialization script
- ✅ `Backend/package.json` - Added npm scripts
- ✅ `DATABASE_SETUP.md` - Detailed setup instructions
- ✅ `Backend/test-api.js` - API testing script

Your backend is now fully connected to MySQL and ready to store moods and notes! 🎉

