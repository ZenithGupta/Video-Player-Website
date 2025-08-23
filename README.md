# Physiotherapy Course & Video Website

A full-stack web application for selling and viewing physiotherapy video courses, built with a Django REST API backend and React frontend.

## 🏗️ Project Structure

```
video-player-website/
├── api/                   # Django REST Framework API app
├── backend/               # Django project settings
├── frontend/              # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
└── manage.py              # Django management script
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/ZenithGupta/Video-Player-Website.git
cd Video-Player-Website
```

### 2. Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies (assuming requirements.txt is in the backend folder)
pip install -r requirements.txt

# Run migrations
python ../manage.py makemigrations
python ../manage.py migrate

# Create superuser (optional)
python ../manage.py createsuperuser

# Start backend server
python ../manage.py runserver
```
**Backend runs at:** `http://localhost:8000`

### 3. Frontend Setup
```bash
# In a new terminal
cd frontend

# Install dependencies
npm install

# Start frontend development server (check package.json for the exact script)
npm start
```
**Frontend runs at:** `http://localhost:3000`

## 📋 Features

### Backend API
- **User Authentication**: Secure user registration and login.
- **Course Management**: API for creating, retrieving, and managing physiotherapy courses.
- **Video Management**: Endpoints for uploading and streaming course videos.
- **Admin Interface**: Django admin for data management.

### Frontend Application
- **Modern React UI**: Responsive design for browsing and viewing courses.
- **User Authentication**: Login and registration forms.
- **Course Catalog**: View available physiotherapy courses.
- **Video Player**: Secure video player for enrolled users to watch course content.
- **User Dashboard**: Manage purchased courses and user profile.

## 🔗 API Endpoints

### Authentication
- `POST /api/token/` - Obtain JWT token (Login)
- `POST /api/token/refresh/` - Refresh JWT token
- `POST /api/register/` - User registration

### Users
- `GET /api/user/` - Retrieve the current authenticated user's data

### Courses
- `GET /api/courses/` - List all available courses

### Pain Assessment
- `POST /api/submit-assessment/` - Submit pain assessment data

## 🛠️ Development

### Backend Development
```bash
cd backend

# Activate virtual environment
# Windows: venv\Scripts\activate | macOS/Linux: source venv/bin/activate

# Run tests
python ../manage.py test

# Create migrations
python ../manage.py makemigrations
```

### Frontend Development
```bash
cd frontend

# Development server with hot reload
npm start

# Build for production
npm run build
```

## 🚀 Deployment

### Backend (Django)
1.  Set environment variables for production (SECRET_KEY, DATABASE_URL).
2.  Configure a production database (e.g., PostgreSQL).
3.  Set `DEBUG = False` in `backend/settings.py`.
4.  Configure static files serving.
5.  Deploy to a platform like Heroku, Vercel, or AWS.

### Frontend (React)
1.  Update your code with the production API URL.
2.  Build the static files: `npm run build`.
3.  Deploy the `build` folder to a static hosting service like Netlify, Vercel, or GitHub Pages.

## 🧪 Testing

### Backend Tests
```bash
cd backend
python ../manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📁 Key Files

### Backend
- `api/views.py` - API view logic
- `api/serializers.py` - Data serialization
- `backend/settings.py` - Django project configuration
- `backend/urls.py` - Root URL configuration

### Frontend
- `frontend/src/App.js` - Main React component
- `frontend/src/index.js` - Application entry point
- `frontend/package.json` - Dependencies and scripts

## 🤝 Contributing

1.  Fork the repository
2.  Create a feature branch: `git checkout -b feature/new-feature`
3.  Commit your changes: `git commit -m 'Add some new feature'`
4.  Push to the branch: `git push origin feature/new-feature`
5.  Open a Pull Request

## 🏥 About

This project provides a platform for users to purchase and view physiotherapy video courses. It is built with a robust Django backend and a responsive React frontend, offering a seamless user experience.