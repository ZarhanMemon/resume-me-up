# Solo Leveling Resume Builder - Complete Setup Guide

## 🎯 Project Overview
A MERN stack resume builder with Solo Leveling anime theme, featuring JWT authentication, Zustand state management, and Tailwind CSS.

## 📁 Project Structure
```
resume-builder/
├── frontend/
│   ├── public/  
│   ├── src/
│   │   ├── components/
|   |   |        |── Card.js
|   |   |        |── LoginForm.js
|   |   |        |── SignupForm.js
|   |   |        |── Modal.js
│   │   ├── pages/
│   │   │   ├── LandingPage.js
│   │   │   ├── Auth.js
│   │   │   ├── Dashboard.js
│   │   │   └── ResumeBuilder.js
│   │   ├── stores/
│   │   │   ├── authStore.js
│   │   │   └── resumeStore.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Resume.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── resumes.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. **Create backend directory and initialize**
```bash
mkdir resume-builder-backend
cd resume-builder-backend
npm init -y
```

2. **Install dependencies**
```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv multer express-validator helmet express-rate-limit
npm install -D nodemon
```

3. **Create .env file**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume_builder
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRE=30d
```

4. **Update package.json scripts**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

5. **Create all backend files** (Use the backend code provided above)

6. **Start backend server**
```bash
npm run dev
```

### Frontend Setup

1. **Create React app**
```bash
npx create-react-app resume-builder-frontend
cd resume-builder-frontend
```

2. **Install dependencies**
```bash
npm install react-router-dom zustand axios lucide-react react-hot-toast jspdf html2canvas
npm install -D tailwindcss autoprefixer postcss
```

3. **Initialize Tailwind CSS**
```bash
npx tailwindcss init -p
```

4. **Configure Tailwind** (Use config provided above)

5. **Create all frontend files** (Use the frontend code provided above)

6. **Start frontend server**
```bash
npm start
```

## 🔧 Additional Configuration Files

### Frontend - public/index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#8b5cf6" />
    <meta name="description" content="Solo Leveling themed resume builder" />
    <title>ResumeForge - Level Up Your Career</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

### Frontend - src/index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useAuthStore } from './stores/authStore';

// Initialize auth on app start
useAuthStore.getState().initializeAuth();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Frontend - postcss.config.js
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 🎨 Solo Leveling Theme Features

### Color Scheme
- **Primary Purple**: `#8b5cf6` (Solo Leveling signature color)
- **Secondary Blue**: `#3b82f6` 
- **Dark Background**: `#0a0a0a`, `#1f2937`
- **Accent Colors**: Purple gradients and glowing effects

### UI Elements
- **Glass morphism**: Backdrop blur effects
- **Glow effects**: Purple/blue glowing borders
- **Gradient backgrounds**: Dark mystical themes
- **Hunter terminology**: "Arsenal", "Guild", "Shadow Monarch"
- **Level system**: User progression with XP and ranks

### Animations
- **Hover effects**: Scale transforms and color transitions
- **Loading states**: Pulse animations
- **Smooth transitions**: All interactive elements

## 🔐 Authentication Flow

1. **Registration**: User creates account with name, email, password
2. **Login**: JWT token generated and stored
3. **Protected Routes**: Middleware checks token validity
4. **Auto-logout**: Token expiration handling
5. **Persistent Sessions**: Zustand with localStorage

## 📊 Features Implemented

### ✅ Completed Features
- User authentication (register/login/logout)
- JWT token management
- Responsive dashboard with Solo Leveling theme
- Resume CRUD operations
- Template selection
- User profile management
- Analytics tracking (views, downloads)
- Level/rank system for users

### 🚧 Features to Extend
- **Resume Builder Sections**: 
  - Experience editor
  - Education editor
  - Projects editor
  - Skills management
  - Certifications
- **PDF Generation**: Complete implementation
- **Template System**: More template variations
- **File Upload**: Profile pictures, document attachments
- **Sharing**: Public resume links
- **Analytics**: Detailed user statistics

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Resumes
- `GET /api/resumes` - Get user resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/:id` - Get specific resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/resumes/:id/duplicate` - Duplicate resume

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/dashboard` - Get dashboard data

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured for frontend URL
   - Check if frontend is running on correct port

2. **MongoDB Connection**
   - Verify MongoDB is running
   - Check connection string in .env

3. **JWT Errors**
   - Ensure JWT_SECRET is set in .env
   - Check token format in requests

4. **Tailwind Not Working**
   - Verify tailwind.config.js setup
   - Check if CSS classes are properly imported

## 🚀 Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Update CORS origins for production
3. Use MongoDB Atlas for database

### Frontend (Vercel/Netlify)
1. Update API URLs for production
2. Set build command: `npm run build`
3. Configure redirects for SPA

## 🎯 Next Steps

1. **Complete Resume Builder**: Implement all sections
2. **PDF Generation**: Add proper PDF export
3. **Template Engine**: Create more templates
4. **User Uploads**: Profile pictures and attachments
5. **Analytics Dashboard**: Detailed statistics
6. **Social Features**: Resume sharing and feedback
7. **Mobile App**: React Native version

## 📝 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  hunterRank: String (E-Rank to SSS-Rank),
  level: Number (1-100),
  experience: Number,
  avatar: String,
  isActive: Boolean,
  lastLogin: Date
}
```

### Resume Model
```javascript
{
  user: ObjectId (ref: User),
  title: String,
  template: String,
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    // ... other fields
  },
  experience: [ExperienceSchema],
  education: [EducationSchema],
  projects: [ProjectSchema],
  skills: Object,
  status: String (draft/active/archived),
  views: Number,
  downloads: Number
}
```

## 🎨 Customization Guide

### Adding New Templates
1. Create template component in `/components/templates/`
2. Add template metadata to store
3. Implement template-specific styling
4. Add to template selection

### Extending Color Scheme
1. Update `tailwind.config.js` with new colors
2. Add CSS variables for dynamic theming
3. Implement theme switcher if needed

### Adding New Sections
1. Create section component
2. Add to resume schema
3. Implement CRUD operations
4. Add to builder navigation

---

## 🏆 Solo Leveling Easter Eggs

- **Hunter Ranks**: E, D, C, B, A, S, SSS
- **Experience System**: Gain XP for actions
- **Shadow Terminology**: Throughout the UI
- **Dark Aesthetic**: Mystical, gaming-inspired design
- **Level Progression**: Visual progress indicators

Ready to level up your resume game! 🎮⚔️
