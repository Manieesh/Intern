import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (credential, city) => api.post('/auth/google', { credential, city }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Service APIs
export const serviceAPI = {
  createService: (data) => api.post('/services', data),
  getProviderServices: (providerId) => api.get(`/services/provider/${providerId}`),
  getServicesByCategory: (category, params) => api.get(`/services/category/${category}`, { params }),
  searchServices: (params) => api.get('/services/search', { params }),
  getServiceDetails: (serviceId) => api.get(`/services/${serviceId}`),
  updateService: (serviceId, data) => api.put(`/services/${serviceId}`, data),
  deleteService: (serviceId) => api.delete(`/services/${serviceId}`)
};

// Booking APIs
export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: (params) => api.get('/bookings/my-bookings', { params }),
  getProviderBookings: (params) => api.get('/bookings/provider-bookings', { params }),
  getBookingDetails: (bookingId) => api.get(`/bookings/${bookingId}`),
  updateBookingStatus: (bookingId, data) => api.put(`/bookings/${bookingId}/status`, data),
  cancelBooking: (bookingId, data) => api.put(`/bookings/${bookingId}/cancel`, data)
};

// Review APIs
export const reviewAPI = {
  createReview: (data) => api.post('/reviews', data),
  getServiceReviews: (serviceId, params) => api.get(`/reviews/service/${serviceId}`, { params }),
  getProviderReviews: (providerId) => api.get(`/reviews/provider/${providerId}`),
  updateReview: (reviewId, data) => api.put(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`)
};

// Payment APIs
export const paymentAPI = {
  initializePayment: (data) => api.post('/payments/initialize', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getPaymentDetails: (paymentId) => api.get(`/payments/${paymentId}`),
  refundPayment: (paymentId) => api.post(`/payments/${paymentId}/refund`)
};

// Admin APIs
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  verifyServiceProvider: (userId) => api.put(`/admin/users/${userId}/verify`),
  suspendUser: (userId, data) => api.put(`/admin/users/${userId}/suspend`, data),
  reactivateUser: (userId) => api.put(`/admin/users/${userId}/reactivate`),
  getAllBookings: (params) => api.get('/admin/bookings', { params }),
  getFlaggedReviews: () => api.get('/admin/reviews/flagged'),
  getPaymentStats: () => api.get('/admin/payments/stats')
};

export default api;
