
import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear auth on unauthorized
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Goal service
export const goalService = {
  getGoals: () => api.get('/goals/'),
  getGoal: (id) => api.get(`/goals/${id}/`),
  createGoal: (goalData) => api.post('/goals/', goalData),
  updateGoal: (id, goalData) => api.put(`/goals/${id}/`, goalData),
  deleteGoal: (id) => api.delete(`/goals/${id}/`)
};

// Profile service
export const profileService = {
  getMyProfile: () => api.get('/profiles/my-profile/'),
  updateProfile: (profileData) => api.put('/profiles/my-profile/', profileData),
  createProfile: (profileData) => api.post('/profiles/', profileData)
};

export default api;