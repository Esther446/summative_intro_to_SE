import axios from 'axios';

// Create axios instance with base URL pointing to your backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically attach JWT token to every request if one exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
