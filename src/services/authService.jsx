
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const authService = {
  // Login with username and password
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login/`, {
        username,
        password
      });
      
      if (response.data.token) {
        // Store auth data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Register new user
  register: async (username, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register/`, {
        username,
        email,
        password
      });
      
      if (response.data.token) {
        // Store auth data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },
  
  // Get auth token
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  // Get user profile from API
  getUserProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      const response = await axios.get(`${API_URL}/api/auth/me/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;