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
      
      if (response.data && response.data.token) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);
        
        // Set default authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      
      // Enhance error object with status if available
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
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Get auth token
  getToken() {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Check if user has specific role
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  },

  // Check if user is admin
  isAdmin() {
    return this.hasRole('ADMINISTRATEUR');
  },

  // Check if user is instructor
  isInstructor() {
    return this.hasRole('INSTRUCTEUR');
  },

  // Check if user is student
  isStudent() {
    const user = this.getCurrentUser();
    return user && !['ADMINISTRATEUR', 'INSTRUCTEUR'].includes(user.role);
  },

  // API instance for other components to use
  api,
};

export default authService;