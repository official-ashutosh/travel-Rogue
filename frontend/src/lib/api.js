import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401s for non-auth endpoints to avoid conflicts
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      
      // Don't auto-redirect for auth endpoints - let AuthContext handle them
      if (!url.includes('/auth/') && !url.includes('/login') && !url.includes('/register')) {
        const currentPath = window.location.pathname;
        
        // Only clear and redirect if not already on auth pages
        if (!['/login', '/signup', '/forgot-password', '/'].includes(currentPath)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Use setTimeout to avoid immediate redirect conflicts
          setTimeout(() => {
            window.location.href = '/login';
          }, 100);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  getMe: () => api.get('/auth/me'),
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  getCredits: () => api.get('/users/credits'),
  reduceCredits: (amount) => api.post('/users/credits/reduce', { amount }),
  getAllUsers: () => api.get('/users/all'),
  addCredits: (userId, amount) => api.post(`/users/${userId}/credits/add`, { amount }),
  updateUserStatus: (userId, status) => api.put(`/users/${userId}/status`, { status }),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  getUserStats: (userId) => api.get(`/users/${userId}/stats`),
  deactivateAccount: () => api.post('/users/deactivate'),
  deleteAccount: () => api.delete('/users/delete'),
};

export const plansAPI = {
  getPublicPlans: () => api.get('/plans/public'),
  createPlan: (planData) => api.post('/plans', planData),
  getUserPlans: () => api.get(`/plans/my-plans?_t=${Date.now()}`),
  getPlan: (planId) => api.get(`/plans/${planId}?_t=${Date.now()}`),
  updatePlan: (planId, planData) => api.put(`/plans/${planId}`, planData),
  deletePlan: (planId) => api.delete(`/plans/${planId}`),
  togglePlanVisibility: (planId) => api.post(`/plans/${planId}/toggle-visibility`),
  getAllPlans: () => api.get('/plans/all'),
  updatePlanStatus: (planId, status) => api.put(`/plans/${planId}/status`, { status }),
  deletePlanAdmin: (planId) => api.delete(`/plans/${planId}/admin`),
};

export const expensesAPI = {
  createExpense: (expenseData) => api.post('/expenses', expenseData),
  getUserExpenses: () => api.get('/expenses/my-expenses'),
  getPlanExpenses: (planId) => api.get(`/expenses/plan/${planId}`),
  getExpenseAnalytics: (planId) => api.get(`/expenses/plan/${planId}/analytics`),
  updateExpense: (expenseId, expenseData) => api.put(`/expenses/${expenseId}`, expenseData),
  deleteExpense: (expenseId) => api.delete(`/expenses/${expenseId}`),
};

export const feedbackAPI = {
  createFeedback: (feedbackData) => api.post('/feedback', feedbackData),
  getUserFeedback: () => api.get('/feedback/my-feedback'),
  getPlanFeedback: (planId) => api.get(`/feedback/plan/${planId}`),
  getAllFeedback: () => api.get('/feedback/all'),
  updateFeedback: (feedbackId, feedbackData) => api.put(`/feedback/${feedbackId}`, feedbackData),
  deleteFeedback: (feedbackId) => api.delete(`/feedback/${feedbackId}`),
  updateFeedbackStatus: (feedbackId, status) => api.put(`/feedback/${feedbackId}/status`, { status }),
  respondToFeedback: (feedbackId, response) => api.post(`/feedback/${feedbackId}/respond`, { response }),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getAdminStats: () => api.get('/dashboard/admin/stats'),
};

export const invitesAPI = {
  getInviteDetails: (token) => api.get(`/invites/${token}`),
  acceptInvite: (token) => api.post(`/invites/${token}/accept`),
  rejectInvite: (token) => api.post(`/invites/${token}/reject`),
  createInvite: (inviteData) => api.post('/invites', inviteData),
  getPlanInvites: (planId) => api.get(`/invites/plan/${planId}`),
  cancelInvite: (inviteId) => api.post(`/invites/${inviteId}/cancel`),
  resendInvite: (inviteId) => api.post(`/invites/${inviteId}/resend`),
};

export const paymentsAPI = {
  getCreditPackages: () => api.get('/payments/packages'),
  createStripeSession: (packageData) => api.post('/payments/stripe/create-session', packageData),
  createRazorpayOrder: (packageData) => api.post('/payments/razorpay/create-order', packageData),
  verifyStripePayment: (sessionId) => api.post('/payments/stripe/verify', { sessionId }),
  verifyRazorpayPayment: (paymentData) => api.post('/payments/razorpay/verify', paymentData),
  getPaymentHistory: () => api.get('/payments/history'),
};

export const healthAPI = {
  check: () => api.get('/health'),
};

export const aiAPI = {
  generatePlan: (planData) => api.post('/ai/generate-plan', planData),
  getDestinationSuggestions: (preferences) => api.post('/ai/suggest-destinations', preferences),
};

export const weatherAPI = {
  getCurrentWeather: (location) => api.get(`/weather/current/${encodeURIComponent(location)}`),
  getWeatherForecast: (location, days = 5) => api.get(`/weather/forecast/${encodeURIComponent(location)}?days=${days}`),
};

export const communityAPI = {
  getCommunityPlans: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/community${queryString ? `?${queryString}` : ''}`);
  },
  getCommunityPlan: (planId) => api.get(`/community/${planId}`),
  likePlan: (planId) => api.post(`/community/${planId}/like`),
  getPopularPlans: (limit = 6) => api.get(`/community/popular/trending?limit=${limit}`),
};

export const locationsAPI = {
  searchLocations: (query, types = 'geocode') => api.get(`/locations/search?query=${encodeURIComponent(query)}&types=${types}`),
  getPlaceDetails: (placeId) => api.get(`/locations/details/${placeId}`),
  getPopularDestinations: () => api.get('/locations/popular'),
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getPlans: () => api.get('/admin/plans'),
  getFeedback: () => api.get('/admin/feedback'),
  getStats: () => api.get('/admin/stats'),
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  deletePlan: (planId) => api.delete(`/admin/plans/${planId}`),
  deleteFeedback: (feedbackId) => api.delete(`/admin/feedback/${feedbackId}`),
  respondToFeedback: (feedbackId, response) => api.put(`/admin/feedback/${feedbackId}/respond`, { response }),
};

export default api;