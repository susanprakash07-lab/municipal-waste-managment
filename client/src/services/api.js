import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically inject JWT token
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

// Response interceptor to catch unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// API Service Methods
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const userService = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const segregationService = {
  getAll: (params) => api.get('/segregation', { params }),
  getById: (id) => api.get(`/segregation/${id}`),
  create: (data) => api.post('/segregation', data),
  update: (id, data) => api.put(`/segregation/${id}`, data),
  delete: (id) => api.delete(`/segregation/${id}`),
};

export const collectionService = {
  getAll: (params) => api.get('/collections', { params }),
  getById: (id) => api.get(`/collections/${id}`),
  create: (data) => api.post('/collections', data),
  update: (id, data) => api.put(`/collections/${id}`, data),
  delete: (id) => api.delete(`/collections/${id}`),
};

export const processingService = {
  getAll: (params) => api.get('/processing', { params }),
  getById: (id) => api.get(`/processing/${id}`),
  create: (data) => api.post('/processing', data),
  update: (id, data) => api.put(`/processing/${id}`, data),
  delete: (id) => api.delete(`/processing/${id}`),
};

export const recyclingService = {
  getAll: (params) => api.get('/recycling-plants', { params }),
  getById: (id) => api.get(`/recycling-plants/${id}`),
  create: (data) => api.post('/recycling-plants', data),
  update: (id, data) => api.put(`/recycling-plants/${id}`, data),
  delete: (id) => api.delete(`/recycling-plants/${id}`),
};

export const landfillService = {
  getAll: (params) => api.get('/landfills', { params }),
  getById: (id) => api.get(`/landfills/${id}`),
  create: (data) => api.post('/landfills', data),
  update: (id, data) => api.put(`/landfills/${id}`, data),
  delete: (id) => api.delete(`/landfills/${id}`),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
};

export const reportsService = {
  getReports: (params) => api.get('/reports', { params }),
};

export const searchService = {
  search: (params) => api.get('/search', { params }),
};

export default api;
