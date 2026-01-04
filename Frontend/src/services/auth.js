// src/services/auth.js
import axios from 'axios';

// Spring Boot typically runs on port 8080 by default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const authService = {
  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data) {
        // 1. Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        
        // 2. Handle token if your backend provides one
        if (response.data.token) {
           localStorage.setItem('token', response.data.token);
           api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        
        // 🚨 THE CRITICAL SYNC FIX:
        // This manually triggers the 'storage' event so the Navbar.jsx 
        // listener catches the change immediately without a page refresh.
        window.dispatchEvent(new Event("storage"));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        const enhancedError = new Error(error.response.data?.message || 'Login failed');
        enhancedError.status = error.response.status;
        enhancedError.data = error.response.data;
        throw enhancedError;
      }
      throw error;
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    
    // Notify Navbar to show "Log In/Sign Up" again
    window.dispatchEvent(new Event("storage"));
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Check if user has specific role
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  },

  // Role Checks
  isAdmin() { return this.hasRole('ADMINISTRATEUR'); },
  isInstructor() { return this.hasRole('INSTRUCTEUR'); },
  isStudent() { return this.hasRole('ETUDIANT'); },

  // API instance for other components to use
  api,
};

export default authService;