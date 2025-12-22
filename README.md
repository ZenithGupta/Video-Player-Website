# Physiotherapy Course & Video Website

A full-stack web application for purchasing and viewing physiotherapy video courses. Built with a robust Django REST API backend, a modern React + Vite frontend, and secured with Nginx and Docker.

## 🏗️ Project Structure

```text
video-player-website/
├── backend/               # Django backend application
│   ├── api/               # API endpoints, models, and serializers
│   ├── backend/           # Project settings and configuration
│   └── requirements.txt   # Python dependencies
├── frontend/              # React + Vite frontend application
│   ├── src/               # Source code
│   └── nginx.conf         # Nginx configuration for the frontend container
├── docker-compose.yml     # Docker Compose configuration (Development with local SSL)
├── docker-compose.prod.yml# Docker Compose overrides for Production (Syslog logging)
└── setup-local-ssl.py     # Script to generate local self-signed SSL certificates
```

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Bootstrap, GSAP (Animations)
- **Backend**: Django 5, Django REST Framework, SimpleJWT
- **Database**: SQLite (Development), PostgreSQL (Recommended for Production)
- **Infrastructure**: Docker, Nginx (Reverse Proxy & Rate Limiting), Gunicorn

## 🚀 Quick Start (Recommended)

The easiest way to run the application is using Docker Compose. Since the application uses Nginx to handle SSL and subdomains locally, you need to generate local certificates first.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Python 3.8+ (to run the SSL generation script)

### 1. SSL Setup
Generate local self-signed SSL certificates and the necessary `.env` file.
```bash
python setup-local-ssl.py
```
*This command creates a `local-certs/` directory and a `.env` file pointing to it.*

### 2. Configuration for Local Development
To ensure the app runs correctly on `https://localhost`, you may need to update a few configuration files:

**Backend (`backend/backend/settings.py`)**
Ensure `https://localhost` is trusted for CSRF:
```python
CSRF_TRUSTED_ORIGINS = ['https://onelastmove.com', 'https://localhost']
```

**Frontend (`frontend/src/config/api.js`)**
Point the API to your local instance (or use the relative path if serving strictly via Nginx):
```javascript
// For local Docker development:
const API_URL = 'https://localhost/api'; 
```

### 3. Run with Docker Compose
Build and start the services:
```bash
docker-compose up --build -d
```

### 4. Access the Application
Open your browser and navigate to:
- **Frontend**: [https://localhost](https://localhost) (Accept the self-signed certificate warning)
- **Backend API**: `https://localhost/api/`
- **Django Admin**: `https://localhost/admin/`

---

## 💻 Manual Setup (Development)

If you prefer running services individually without Docker:

### Backend
1. **Navigate to backend**: `cd backend`
2. **Create virtual env**: `python -m venv venv`
3. **Activate env**:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. **Install deps**: `pip install -r requirements.txt`
5. **Run migrations**: `python manage.py migrate`
6. **Start server**: `python manage.py runserver`
   - *Runs at http://localhost:8000*

### Frontend
1. **Navigate to frontend**: `cd frontend`
2. **Install deps**: `npm install`
3. **Start dev server**: `npm run dev`
   - *Runs at http://localhost:5173 (usually)*
   - *Note: You'll need to configure CORS in backend settings to allow requests from the Vite port.*

---

## 📦 Deployment

### Production vs. Development
- **Development**: Uses `docker-compose.yml`. Configures local SSL and mounts code as volumes for hot-reloading.
- **Production**: Use `docker-compose.yml` + `docker-compose.prod.yml`.
  - Enables Syslog logging.
  - Expects real SSL certificates (from LetsEncrypt) mounted at `/etc/letsencrypt`.

### Deployment Steps
1. **Environment Config**: Ensure `.env` contains secure values (SECRET_KEY, DB credentials).
2. **SSL**: Obtain valid certificates (e.g., via Certbot) and ensure paths in `docker-compose.yml` match.
3. **Run**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
   ```

## 🔗 Key API Endpoints

- `POST /api/token/` - Login (Get JWT)
- `GET /api/courses/` - List Courses
- `GET /api/user/` - User Profile