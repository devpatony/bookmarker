# Bookmarker Backend

A REST API for managing personal notes and bookmarks built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Notes management with tags and search
- Bookmarks management with automatic title fetching
- Search and filtering capabilities
- Favorite marking for notes and bookmarks
- Input validation and error handling

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Axios & Cheerio for web scraping
- express-validator for input validation

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Install dependencies:**
   npm install

2. **Environment Setup:**
   Create a .env file in the backend directory with these variables:
   NODE_ENV=development
   PORT=5000
   # For MongoDB Atlas (Cloud):
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bookmarker?retryWrites=true&w=majority
    !I have used clould but for local:
   # For Local MongoDB:
   # MONGODB_URI=mongodb://localhost:27017/bookmarker
   JWT_SECRET=bookmarker_super_secret_key_2025_dev_only_change_in_production
   JWT_EXPIRE=7d
   ```

3. **Database Setup (Choose One):**

   #### Option A: MongoDB Atlas (Cloud - Recommended)
   
   1. **Create MongoDB Atlas Account:**
      - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
      - Sign up for a free account
      - Create a new project
   
   2. **Create a Cluster:**
      - Click "Build a Database"
      - Choose "FREE" shared cluster
      - Select your preferred cloud provider and region
      - Click "Create Cluster"
   
   3. **Setup Database Access:**
      - Go to "Database Access" in the left sidebar
      - Click "Add New Database User"
      - Choose "Password" authentication
      - Create username and password (save these!)
      - Set privileges to "Read and write to any database"
      - Click "Add User"
   
   4. **Setup Network Access:**
      - Go to "Network Access" in the left sidebar
      - Click "Add IP Address"
      - Choose "Allow Access from Anywhere" (0.0.0.0/0)
      - Or add your specific IP address for better security
      - Click "Confirm"
   
   5. **Get Connection String:**
      - Go to "Database" in the left sidebar
      - Click "Connect" on your cluster
      - Choose "Connect your application"
      - Copy the connection string
      - Replace <password> with your database user password
      - Replace <dbname> with bookmarker
   
   6. **Update .env file:**
      MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bookmarker?retryWrites=true&w=majority

   #### Option B: Local MongoDB
   - Install MongoDB locally on your system
   - Make sure MongoDB service is running
   - Use: `MONGODB_URI=mongodb://localhost:27017/bookmarker`

4. **Run the server:**
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Notes

- `GET /api/notes` - Get all notes (with optional search and tag filtering)
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Bookmarks

- `GET /api/bookmarks` - Get all bookmarks (with optional search and tag filtering)
- `GET /api/bookmarks/:id` - Get single bookmark
- `POST /api/bookmarks` - Create new bookmark
- `PUT /api/bookmarks/:id` - Update bookmark
- `DELETE /api/bookmarks/:id` - Delete bookmark

## Request Examples

### Create a Note
POST /api/notes
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "title": "My First Note",
  "content": "This is the content of my note",
  "tags": ["personal", "important"],
  "isFavorite": false
}

### Create a Bookmark
POST /api/bookmarks
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "url": "https://example.com",
  "title": "", // Leave empty to auto-fetch title
  "description": "A useful website",
  "tags": ["tools", "development"],
  "isFavorite": false
}

### Search Notes/Bookmarks
GET /api/notes?q=searchTerm&tags=tag1,tag2
GET /api/bookmarks?q=searchTerm&tags=tag1,tag2

## Project Structure

backend/
├── models/
│   ├── User.js          # User model
│   ├── Note.js          # Note model
│   └── Bookmark.js      # Bookmark model
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── notes.js         # Notes CRUD routes
│   └── bookmarks.js     # Bookmarks CRUD routes
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── server.js            # Main server file
├── package.json
└── .env                 # Environment variables

## Features

### Auto Title Fetching
When creating a bookmark without a title, the API automatically fetches the page title from the URL using web scraping.

### Search & Filtering
- Full-text search across title and content/description
- Tag filtering support
- Pagination support

### Security
- Password hashing with bcryptjs
- JWT-based authentication
- Input validation with express-validator
- CORS enabled for frontend integration

## Development

For development, use:
npm run dev

This starts the server with nodemon for automatic restarts on file changes.

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes:
- 400: Bad Request (validation errors)
- 401: Unauthorized (authentication required)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error

## Troubleshooting

### MongoDB Atlas Connection Issues

1. **"MongoNetworkError" or "Authentication Failed"**
   - Check your username and password in the connection string
   - Ensure the database user has proper permissions
   - Verify your IP address is whitelisted in Network Access

2. **"Connection Timeout"**
   - Check if your IP address is allowed in Atlas Network Access
   - Try using "Allow Access from Anywhere" (0.0.0.0/0) temporarily
   - Ensure your firewall isn't blocking the connection

3. **"Database not found"**
   - MongoDB will automatically create the database when you first insert data
   - Make sure the database name in your connection string matches

### Quick Test Connection
# Test if your MongoDB connection works
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => { console.log('✅ Connected to MongoDB'); process.exit(0); })
  .catch(err => { console.error('❌ Connection failed:', err.message); process.exit(1); });
"

### Common Atlas Setup Mistakes
- Forgetting to replace `<password>` with actual password
- Not whitelisting your IP address
- Using incorrect database user credentials
- Firewall blocking outbound connections on port 27017

