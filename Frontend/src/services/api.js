import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  changePassword: (data) => api.put('/auth/password', data),
  logout: () => api.post('/auth/logout')
};

// Analytics endpoints
export const analyticsAPI = {
  getSummary: (params) => api.get('/analytics/summary', { params }),
  getTrends: (params) => api.get('/analytics/trends', { params }),
  getPlatforms: (params) => api.get('/analytics/platforms', { params }),
  getKPIs: (params) => api.get('/analytics/kpis', { params }),
  sync: (platform) => api.post('/analytics/sync', { platform })
};

// Campaign endpoints
export const campaignAPI = {
  getAll: (params) => api.get('/campaigns', { params }),
  getById: (id) => api.get(`/campaigns/${id}`),
  create: (data) => api.post('/campaigns', data),
  update: (id, data) => api.put(`/campaigns/${id}`, data),
  delete: (id) => api.delete(`/campaigns/${id}`),
  getStats: (id) => api.get(`/campaigns/${id}/stats`),
  updateStatus: (id, status) => api.patch(`/campaigns/${id}/status`, { status })
};

// User endpoints
export const userAPI = {
  getPreferences: () => api.get('/users/preferences'),
  updatePreferences: (data) => api.put('/users/preferences', data),
  getPlatforms: () => api.get('/users/platforms'),
  connectPlatform: (platform) => api.post('/users/platforms/connect', { platform }),
  disconnectPlatform: (platform) => api.delete(`/users/platforms/${platform}`),
  deleteAccount: (password) => api.delete('/users/account', { data: { password } })
};

// Feed endpoints
export const feedAPI = {
  getFeed: (params) => api.get('/feed', { params }),
  createEvent: (data) => api.post('/feed', data),
  deleteEvent: (id) => api.delete(`/feed/${id}`)
};

export default api;


