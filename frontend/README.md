# Bookmarker Frontend

A modern, responsive web application for managing personal notes and bookmarks built with Next.js and Tailwind CSS.

## Features

- User authentication (login/register)
- Notes management with rich text content
- Bookmarks management with URL validation
- Search and filtering capabilities
- Tag-based organization
- Favorite marking
- Responsive design with Tailwind CSS
- Real-time toast notifications

## Technologies Used

- Next.js 14
- React 18
- Tailwind CSS
- Axios for API calls
- js-cookie for token management
- react-hot-toast for notifications

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env.local` file in the root directory:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Build for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Project Structure

```
frontend/
├── components/
│   └── Layout.js           # Main layout component with navigation
├── context/
│   └── AuthContext.js      # Authentication context and state management
├── pages/
│   ├── _app.js            # Next.js app wrapper
│   ├── index.js           # Home page
│   ├── login.js           # Login page
│   ├── register.js        # Registration page
│   ├── notes.js           # Notes management page
│   └── bookmarks.js       # Bookmarks management page
├── styles/
│   └── globals.css        # Global styles with Tailwind CSS
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Pages & Features

### Authentication
- **Login (`/login`)**: User login with email and password
- **Register (`/register`)**: New user registration with username, email, and password
- **Protected Routes**: Automatic redirect to login for unauthenticated users

### Dashboard
- **Home (`/`)**: Welcome page with navigation to notes and bookmarks

### Notes Management (`/notes`)
- Create, edit, and delete notes
- Rich text content support
- Tag-based organization
- Search functionality
- Mark notes as favorites
- Real-time search and filtering

### Bookmarks Management (`/bookmarks`)
- Create, edit, and delete bookmarks
- URL validation
- Automatic title fetching (backend feature)
- Description and tags support
- Search and filtering
- Mark bookmarks as favorites
- Direct links to bookmarked sites

## Key Components

### AuthContext
Manages global authentication state:
- User login/logout
- Token management with cookies
- Protected route handling
- User data persistence

### Layout Component
Provides consistent navigation and layout:
- Responsive navigation bar
- User information display
- Logout functionality
- Mobile-friendly design

## Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Tailwind CSS utility classes
- Flexible grid layouts
- Touch-friendly interactive elements

## State Management

- React Context for authentication
- Local state for component data
- Cookie-based token persistence
- Real-time UI updates

## API Integration

All API calls are handled through Axios with:
- Automatic JWT token attachment
- Error handling with toast notifications
- RESTful API communication
- Search and filtering parameters

## Styling

Built with Tailwind CSS featuring:
- Custom color palette
- Reusable component classes
- Responsive breakpoints
- Dark/light theme ready structure

### Custom CSS Classes

```css
.btn - Base button styling
.btn-primary - Primary action buttons
.btn-secondary - Secondary action buttons
.btn-danger - Destructive action buttons
.input - Form input styling
.textarea - Textarea styling
.card - Card container styling
```

## Development Guidelines

### Adding New Pages
1. Create page component in `/pages` directory
2. Add navigation link in `Layout.js`
3. Implement authentication check if needed

### API Calls
Use the established pattern with try/catch blocks and toast notifications:

```javascript
try {
  const response = await axios.get(`${API_URL}/endpoint`)
  // Handle success
  toast.success('Operation successful')
} catch (error) {
  toast.error(error.response?.data?.message || 'Operation failed')
}
```

### Styling
Follow Tailwind CSS conventions and use the custom component classes defined in `globals.css`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Next.js automatic code splitting
- Optimized production builds
- Efficient re-rendering with React
- Lazy loading of components
