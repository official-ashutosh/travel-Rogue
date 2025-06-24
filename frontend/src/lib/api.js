import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// ===============================
// AUTH API ENDPOINTS
// ===============================
export const authAPI = {
  // Public routes
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  
  // Protected routes
  getMe: () => api.get('/auth/me'),
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
};

// ===============================
// USER API ENDPOINTS
// ===============================
export const userAPI = {
  // Profile management
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  
  // Credits management
  getCredits: () => api.get('/users/credits'),
  reduceCredits: (amount) => api.post('/users/credits/reduce', { amount }),
  
  // Admin routes
  getAllUsers: () => api.get('/users/all'),
  addCredits: (userId, amount) => api.post(`/users/${userId}/credits/add`, { amount }),
  
  // Account management
  deactivateAccount: () => api.post('/users/deactivate'),
  deleteAccount: () => api.delete('/users/delete'),
};

// ===============================
// PLANS API ENDPOINTS
// ===============================
export const plansAPI = {
  // Public routes
  getPublicPlans: () => api.get('/plans/public'),
  
  // Protected routes
  createPlan: (planData) => api.post('/plans', planData),
  getUserPlans: () => api.get('/plans/my-plans'),
  getPlan: (planId) => api.get(`/plans/${planId}`),
  updatePlan: (planId, planData) => api.put(`/plans/${planId}`, planData),
  deletePlan: (planId) => api.delete(`/plans/${planId}`),
  
  // Plan visibility
  togglePlanVisibility: (planId) => api.post(`/plans/${planId}/toggle-visibility`),
};

// ===============================
// EXPENSES API ENDPOINTS
// ===============================
export const expensesAPI = {
  createExpense: (expenseData) => api.post('/expenses', expenseData),
  getUserExpenses: () => api.get('/expenses/my-expenses'),
  getPlanExpenses: (planId) => api.get(`/expenses/plan/${planId}`),
  getExpenseAnalytics: (planId) => api.get(`/expenses/plan/${planId}/analytics`),
  updateExpense: (expenseId, expenseData) => api.put(`/expenses/${expenseId}`, expenseData),
  deleteExpense: (expenseId) => api.delete(`/expenses/${expenseId}`),
};

// ===============================
// FEEDBACK API ENDPOINTS
// ===============================
export const feedbackAPI = {
  createFeedback: (feedbackData) => api.post('/feedback', feedbackData),
  getUserFeedback: () => api.get('/feedback/my-feedback'),
  getPlanFeedback: (planId) => api.get(`/feedback/plan/${planId}`),
  
  // Admin routes
  getAllFeedback: () => api.get('/feedback/all'),
  updateFeedback: (feedbackId, feedbackData) => api.put(`/feedback/${feedbackId}`, feedbackData),
  deleteFeedback: (feedbackId) => api.delete(`/feedback/${feedbackId}`),
};

// ===============================
// DASHBOARD API ENDPOINTS
// ===============================
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getAdminStats: () => api.get('/dashboard/admin/stats'),
};

// ===============================
// INVITES API ENDPOINTS
// ===============================
export const invitesAPI = {
  // Public routes
  getInviteDetails: (token) => api.get(`/invites/${token}`),
  acceptInvite: (token) => api.post(`/invites/${token}/accept`),
  rejectInvite: (token) => api.post(`/invites/${token}/reject`),
  
  // Protected routes
  createInvite: (inviteData) => api.post('/invites', inviteData),
  getPlanInvites: (planId) => api.get(`/invites/plan/${planId}`),
  cancelInvite: (inviteId) => api.post(`/invites/${inviteId}/cancel`),
  resendInvite: (inviteId) => api.post(`/invites/${inviteId}/resend`),
};

// ===============================
// PAYMENTS API ENDPOINTS
// ===============================
export const paymentsAPI = {
  // Public routes
  getCreditPackages: () => api.get('/payments/packages'),
  
  // Protected routes
  createStripeSession: (packageData) => api.post('/payments/stripe/create-session', packageData),
  createRazorpayOrder: (packageData) => api.post('/payments/razorpay/create-order', packageData),
  verifyStripePayment: (sessionId) => api.post('/payments/stripe/verify', { sessionId }),
  verifyRazorpayPayment: (paymentData) => api.post('/payments/razorpay/verify', paymentData),
  getPaymentHistory: () => api.get('/payments/history'),
};

// ===============================
// HEALTH CHECK
// ===============================
export const healthAPI = {
  check: () => api.get('/health'),
};

// ===============================
// AI API ENDPOINTS
// ===============================
export const aiAPI = {
  generatePlan: (planData) => api.post('/ai/generate-plan', planData),
  getDestinationSuggestions: (preferences) => api.post('/ai/suggest-destinations', preferences),
};

// ===============================
// WEATHER API ENDPOINTS
// ===============================
export const weatherAPI = {
  getCurrentWeather: (location) => api.get(`/weather/current/${encodeURIComponent(location)}`),
  getWeatherForecast: (location, days = 5) => api.get(`/weather/forecast/${encodeURIComponent(location)}?days=${days}`),
};

// ===============================
// COMMUNITY API ENDPOINTS
// ===============================
export const communityAPI = {
  getCommunityPlans: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/community${queryString ? `?${queryString}` : ''}`);
  },
  getCommunityPlan: (planId) => api.get(`/community/${planId}`),
  likePlan: (planId) => api.post(`/community/${planId}/like`),
  getPopularPlans: (limit = 6) => api.get(`/community/popular/trending?limit=${limit}`),
};

// ===============================
// LOCATIONS API ENDPOINTS
// ===============================
export const locationsAPI = {
  searchLocations: (query, types = 'geocode') => api.get(`/locations/search?query=${encodeURIComponent(query)}&types=${types}`),
  getPlaceDetails: (placeId) => api.get(`/locations/details/${placeId}`),
  getPopularDestinations: () => api.get('/locations/popular'),
};

// Default export for backward compatibility
export default api;
