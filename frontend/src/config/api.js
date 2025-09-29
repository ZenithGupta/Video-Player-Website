// Create a new file: frontend/src/config/api.js
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'http://your-production-domain.com/api'  // Replace with your production URL
  : 'http://0.0.0.0:8000/api';  // Use Docker service name for development

export default API_URL;