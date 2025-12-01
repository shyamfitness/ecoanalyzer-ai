import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data but don't redirect (we use view-based routing)
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Dispatch custom event for components to handle
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updatePreferences: async (preferences) => {
    const response = await api.put('/auth/preferences', preferences);
    return response.data;
  },
};

// Analysis API
export const analysisAPI = {
  analyzeText: async (productData) => {
    const response = await api.post('/analyze/text', productData);
    return response.data;
  },

  analyzeImage: async (formData) => {
    const response = await api.post('/analyze/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  analyzeBarcode: async (barcodeData) => {
    const response = await api.post('/analyze/barcode', barcodeData);
    return response.data;
  },

  getHistory: async (params = {}) => {
    const response = await api.get('/history', { params });
    return response.data;
  },

  getAnalysis: async (id) => {
    const response = await api.get(`/analyze/${id}`);
    return response.data;
  },

  deleteAnalysis: async (id) => {
    const response = await api.delete(`/history/${id}`);
    return response.data;
  },
};

// User API
export const userAPI = {
  getAnalytics: async () => {
    const response = await api.get('/users/analytics');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/users/account');
    return response.data;
  },
};

export default api;
