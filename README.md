# Personal Notes & Bookmark Manager

A full-stack web application for managing personal notes and bookmarks with advanced search, tagging, and user authentication features.

## Project Overview

This application demonstrates modern full-stack development with:

### **Core Features**
- **Notes Management**: Create, edit, delete, and organize personal notes with rich text content
- **Bookmarks Management**: Save website bookmarks with automatic title fetching from URLs
- **Advanced Search**: Full-text search across content with tag-based filtering
- **User Authentication**: Secure JWT-based registration and login system
- **Favorites System**: Mark and organize important notes and bookmarks
- **Responsive Design**: Mobile-first UI that works seamlessly across all devices

### **Technical Highlights**
- **RESTful API Design**: Well-structured endpoints with proper HTTP methods and status codes
- **Data Validation**: Comprehensive input validation and error handling
- **Real-time Features**: Auto-fetching bookmark titles using web scraping
- **Security**: Password hashing, JWT tokens, and user data isolation
- **Modern UI/UX**: Clean, intuitive interface built with Tailwind CSS

## Tech Stack

### **Backend Architecture**
- **Node.js** + **Express.js** - RESTful API server with middleware support
- **MongoDB** + **Mongoose** - Document database with ODM for data modeling
- **JWT (jsonwebtoken)** - Stateless authentication and authorization
- **bcryptjs** - Secure password hashing with salt rounds
- **express-validator** - Request validation and sanitization
- **Axios** + **Cheerio** - Web scraping for automatic bookmark title fetching
- **CORS** - Cross-origin resource sharing configuration

### **Frontend Architecture**
- **Next.js 14** - React framework with SSR, routing, and optimization
- **React 18** - Component-based UI with hooks and context
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Axios** - HTTP client for API communication
- **js-cookie** - Client-side cookie management for token storage
- **react-hot-toast** - User-friendly notification system

### **Development Tools**
- **nodemon** - Backend auto-restart during development
- **ESLint** - Code linting and style enforcement
- **PostCSS** - CSS processing and Tailwind compilation

## Quick Setup Guide

### **Prerequisites**
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Local installation or [MongoDB Atlas](https://www.mongodb.com/atlas) cloud instance
- **Git** - For cloning the repository
- **npm** or **yarn** - Package manager (comes with Node.js)

### **Step 1: Clone and Setup**
# Clone the repository
git clone <repository-url>
cd bookmarker

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install

### **Step 2: Environment Configuration**

#### Backend Environment (backend/.env)
NODE_ENV=development
PORT=5000
# For MongoDB Atlas (Cloud - Recommended):
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bookmarker?retryWrites=true&w=majority
# For Local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/bookmarker
JWT_SECRET=bookmarker_super_secret_key_2025_dev_only_change_in_production
JWT_EXPIRE=7d

#### Frontend Environment (frontend/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

### **Step 3: Database Setup**

#### **Option A: MongoDB Atlas (Cloud - Recommended)**

1. **Create Free Account:**
   - Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create new project

2. **Create Database Cluster:**
   - Click "Build a Database" 
   - Select "FREE" M0 Sandbox
   - Choose cloud provider and region
   - Create cluster (takes 3-5 minutes)

3. **Setup Database User:**
   - Go to "Database Access" → "Add New Database User"
   - Create username and strong password
   - Grant "Read and write to any database" privileges

4. **Configure Network Access:**
   - Go to "Network Access" → "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add your specific IP for better security

5. **Get Connection String:**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `bookmarker`

6. **Update your `.env` file:**
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/bookmarker?retryWrites=true&w=majority

#### **Option B: Local MongoDB**
# Install MongoDB locally
# Windows: Download from mongodb.com
# macOS: brew install mongodb-community
# Linux: Follow MongoDB installation guide

# Start MongoDB service

# Use in .env:

### **Step 4: Start the Application**

#### Terminal 1 - Backend Server
cd backend
npm run dev
# Server runs on http://localhost:5000

#### Terminal 2 - Frontend Application  
cd frontend
npm run dev
# Application runs on http://localhost:3000

### **Step 5: Access the Application**
Open your browser and navigate to: **http://localhost:3000** or deployed URL

🎉 **You're ready to go!** Register a new account and start managing your notes and bookmarks.

### **Sample cURL Requests**

#### Register and Login Flow
# 1. Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# 2. Login (copy the token from response)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com", 
    "password": "password123"
  }'

# 3. Create a note (replace YOUR_JWT_TOKEN)
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Note",
    "content": "This is my first note created via API",
    "tags": ["test", "api"]
  }'

# 4. Create a bookmark with auto-fetch title
curl -X POST http://localhost:5000/api/bookmarks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "url": "https://github.com",
    "title": "",
    "description": "GitHub homepage",
    "tags": ["development", "git"]
  }'

# 5. Search notes
curl -X GET "http://localhost:5000/api/notes?q=test&tags=api" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

## 📥 Postman Collection

A complete Postman collection is included for easy API testing:

**File:** `Bookmarker_API_Collection.postman_collection.json`

### **Import Instructions:**
1. Open Postman
2. Click "Import" → "Upload Files"
3. Select the `Bookmarker_API_Collection.postman_collection.json` file
4. The collection will be imported with all endpoints

### **Usage:**
1. **Start your backend server** (`npm run dev` in backend folder)
2. **Register/Login** using the Authentication endpoints
3. **Copy the JWT token** from the login response
4. **Set the `authToken` variable** in Postman:
   - Click on the collection → Variables tab
   - Set `authToken` value to your JWT token
5. **Test all endpoints** - they will automatically use your token

### **Collection Includes:**
- All authentication endpoints (register, login, get user)
- Complete CRUD operations for notes and bookmarks
- Search and filtering examples
- Auto-fetch bookmark title demonstration
- Proper error handling examples

### **Postman Collection JSON Example**

You can import this collection into Postman for easy API testing:

   json
{
  "info": {
    "name": "Bookmarker API",
    "description": "Personal Notes & Bookmark Manager API Collection"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "authToken", 
      "value": "{{jwt_token}}"
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "{{baseUrl}}/auth/register",
            "body": {
              "raw": "{\n  \"username\": \"testuser\",\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
            }
          }
        },
        {
          "name": "Login", 
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "{{baseUrl}}/auth/login",
            "body": {
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
            }
          }
        }
      ]
    }
  ]
}

**To use with Postman:**
1. Copy the JSON above
2. Open Postman → Import → Raw Text → Paste and Import
3. Update the `authToken` variable with your JWT token after login

## Project Architecture & Code Structure

### **Backend Architecture**

backend/
├── models/                 # Data Models & Database Schemas
│   ├── User.js            # User schema with authentication fields
│   ├── Note.js            # Note schema with text indexing
│   └── Bookmark.js        # Bookmark schema with URL validation
├── routes/                # API Route Handlers  
│   ├── auth.js            # Authentication endpoints
│   ├── notes.js           # Notes CRUD operations
│   └── bookmarks.js       # Bookmarks CRUD + web scraping
├── middleware/            # Custom Middleware
│   └── auth.js            # JWT token verification
├── server.js              # Express app configuration
├── package.json           # Dependencies & scripts
└── .env                   # Environment variables


### **Frontend Architecture**

frontend/
├── components/            # Reusable React Components
│   └── Layout.js          # Navigation & layout wrapper
├── context/              # React Context Providers
│   └── AuthContext.js     # Global authentication state
├── pages/                # Next.js File-based Routing
│   ├── _app.js           # App wrapper with providers
│   ├── index.js          # Dashboard/home page
│   ├── login.js          # Login form with validation
│   ├── register.js       # Registration form
│   ├── notes.js          # Notes management page
│   └── bookmarks.js      # Bookmarks management page
├── styles/               # CSS & Styling
│   └── globals.css       # Tailwind base + custom components
├── package.json          # Dependencies & build scripts
├── next.config.js        # Next.js configuration
└── tailwind.config.js    # Tailwind CSS customization
```

##  Technical Features Demonstrated

### **REST API Design**
-  **RESTful Endpoints**: Proper HTTP methods (GET, POST, PUT, DELETE)
-  **Resource-based URLs**: `/api/notes`, `/api/bookmarks`, `/api/auth`
-  **HTTP Status Codes**: 200, 201, 400, 401, 404, 500 with appropriate usage
-  **Request/Response Structure**: Consistent JSON format
-  **Query Parameters**: Search (`?q=term`) and filtering (`?tags=tag1,tag2`)

### **Data Validation & Error Handling**
-  **Input Validation**: express-validator for all endpoints
-  **Schema Validation**: Mongoose schema validation
-  **Error Responses**: Structured error messages with field-specific details
-  **Authentication Errors**: Proper 401 responses for protected routes
-  **Validation Feedback**: Client-side error display with toast notifications

### **React/Next.js Implementation**
- **File-based Routing**: Next.js pages for automatic routing
- **State Management**: React Context for global auth state
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Form Handling**: Controlled components with validation
- **Real-time Updates**: State updates after API operations
- **Loading States**: User feedback during async operations

### **Tailwind CSS & UI/UX**
- **Responsive Design**: Mobile-first approach with breakpoints
- **Component Classes**: Custom utility classes for consistency
- **Interactive Elements**: Hover states, focus rings, transitions
- **Clean Layout**: Card-based design with proper spacing
- **User Feedback**: Toast notifications for all actions
- **Accessibility**: Proper form labels and semantic HTML

### **Real-world Data Modeling**
- **User Relationships**: Notes/bookmarks linked to specific users
- **Data Indexing**: Text search indexes on content fields
- **Tag System**: Array-based tagging with lowercase normalization
- **Timestamps**: Automatic createdAt/updatedAt tracking
- **Data Validation**: URL validation, length limits, required fields

##  Detailed Project Structure

### Backend

bookmarker/
├── backend/                 # Node.js/Express API
│   ├── models/             # Mongoose models
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   ├── server.js          # Main server file
│   └── README.md          # Backend documentation
├── frontend/               # Next.js React app
│   ├── components/        # React components
│   ├── context/          # React context providers
│   ├── pages/            # Next.js pages
│   ├── styles/           # CSS and Tailwind styles
│   └── README.md         # Frontend documentation
└── README.md             # This file


##  Key Features

### Notes Management
- Create, read, update, delete notes
- Rich text content support
- Tag-based organization
- Full-text search
- Mark as favorites
- User-specific data isolation

### Bookmarks Management
- Save website URLs with validation
- Automatic title fetching from web pages
- Custom descriptions and tags
- Search and filter capabilities
- Mark as favorites
- Direct link access

### User Authentication
- User registration with validation
- Secure login with JWT tokens
- Password hashing with bcryptjs
- Protected routes and API endpoints
- User session management

### Search & Filtering
- Text search across titles and content
- Tag-based filtering
- Real-time search results
- Pagination support
- Combined search parameters

### Responsive UI
- Mobile-first design
- Modern, clean interface
- Toast notifications
- Loading states
- Error handling

##  Testing & Evaluation

### **CRUD Functionality Testing**
1. **User Registration & Authentication**
   - Register new account → Verify JWT token generation
   - Login with credentials → Check session persistence
   - Access protected routes → Confirm authentication middleware

2. **Notes Management**
   - Create note with tags → Verify database storage
   - Edit note content → Check update functionality
   - Delete note → Confirm removal and UI update
   - Search notes → Test full-text search capability

3. **Bookmarks Management**
   - Add bookmark with URL → Test URL validation
   - Auto-fetch title → Verify web scraping works
   - Filter by tags → Check query parameter handling
   - Mark as favorite → Test state management