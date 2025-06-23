import { useState, useEffect } from 'react';
import { 
  authAPI, 
  userAPI, 
  plansAPI, 
  expensesAPI, 
  feedbackAPI, 
  dashboardAPI,
  invitesAPI,
  paymentsAPI,
  aiAPI,
  weatherAPI,
  communityAPI,
  locationsAPI
} from '../lib/api.js';

// ===============================
// AUTH HOOKS
// ===============================
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await authAPI.getMe();
          setUser(response.data);
        }
      } catch (err) {
        setError(err.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
};

// ===============================
// PLANS HOOKS
// ===============================
export const usePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserPlans = async () => {
    try {
      setLoading(true);
      const response = await plansAPI.getUserPlans();
      setPlans(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async (planData) => {
    try {
      setLoading(true);
      const response = await plansAPI.createPlan(planData);
      setPlans(prev => [...prev, response.data]);
      return { success: true, plan: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create plan');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const updatePlan = async (planId, planData) => {
    try {
      setLoading(true);
      const response = await plansAPI.updatePlan(planId, planData);
      setPlans(prev => prev.map(plan => 
        plan.id === planId ? response.data : plan
      ));
      return { success: true, plan: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update plan');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (planId) => {
    try {
      setLoading(true);
      await plansAPI.deletePlan(planId);
      setPlans(prev => prev.filter(plan => plan.id !== planId));
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete plan');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    plans,
    loading,
    error,
    fetchUserPlans,
    createPlan,
    updatePlan,
    deletePlan,
    setPlans
  };
};

// ===============================
// EXPENSES HOOKS
// ===============================
export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlanExpenses = async (planId) => {
    try {
      setLoading(true);
      const response = await expensesAPI.getPlanExpenses(planId);
      setExpenses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (expenseData) => {
    try {
      setLoading(true);
      const response = await expensesAPI.createExpense(expenseData);
      setExpenses(prev => [...prev, response.data]);
      return { success: true, expense: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create expense');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (expenseId, expenseData) => {
    try {
      setLoading(true);
      const response = await expensesAPI.updateExpense(expenseId, expenseData);
      setExpenses(prev => prev.map(expense => 
        expense.id === expenseId ? response.data : expense
      ));
      return { success: true, expense: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update expense');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      setLoading(true);
      await expensesAPI.deleteExpense(expenseId);
      setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete expense');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    expenses,
    loading,
    error,
    fetchPlanExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    setExpenses
  };
};

// ===============================
// FEEDBACK HOOKS
// ===============================
export const useFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlanFeedback = async (planId) => {
    try {
      setLoading(true);
      const response = await feedbackAPI.getPlanFeedback(planId);
      setFeedback(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (feedbackData) => {
    try {
      setLoading(true);
      const response = await feedbackAPI.createFeedback(feedbackData);
      setFeedback(prev => [...prev, response.data]);
      return { success: true, feedback: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    feedback,
    loading,
    error,
    fetchPlanFeedback,
    submitFeedback,
    setFeedback
  };
};

// ===============================
// DASHBOARD HOOKS
// ===============================
export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getAdminStats();
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admin stats');
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    fetchStats,
    fetchAdminStats
  };
};

// ===============================
// INVITES HOOKS
// ===============================
export const useInvites = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlanInvites = async (planId) => {
    try {
      setLoading(true);
      const response = await invitesAPI.getPlanInvites(planId);
      setInvites(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch invites');
    } finally {
      setLoading(false);
    }
  };

  const createInvite = async (inviteData) => {
    try {
      setLoading(true);
      const response = await invitesAPI.createInvite(inviteData);
      setInvites(prev => [...prev, response.data]);
      return { success: true, invite: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create invite');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    invites,
    loading,
    error,
    fetchPlanInvites,
    createInvite,
    setInvites
  };
};

// ===============================
// PAYMENTS HOOKS
// ===============================
export const usePayments = () => {
  const [packages, setPackages] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCreditPackages = async () => {
    try {
      setLoading(true);
      const response = await paymentsAPI.getCreditPackages();
      setPackages(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await paymentsAPI.getPaymentHistory();
      setPaymentHistory(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payment history');
    } finally {
      setLoading(false);
    }
  };

  const createStripeSession = async (packageData) => {
    try {
      setLoading(true);
      const response = await paymentsAPI.createStripeSession(packageData);
      return { success: true, session: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create payment session');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    packages,
    paymentHistory,
    loading,
    error,
    fetchCreditPackages,
    fetchPaymentHistory,
    createStripeSession
  };
};

// ===============================
// USER PROFILE HOOKS
// ===============================
export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      setProfile(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchCredits = async () => {
    try {
      const response = await userAPI.getCredits();
      setCredits(response.data.credits);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch credits');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await userAPI.updateProfile(profileData);
      setProfile(response.data);
      return { success: true, profile: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    credits,
    loading,
    error,
    fetchProfile,
    fetchCredits,
    updateProfile
  };
};

// ===============================
// AI HOOKS
// ===============================
export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePlan = async (planData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiAPI.generatePlan(planData);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to generate AI plan';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getDestinationSuggestions = async (preferences) => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiAPI.getDestinationSuggestions(preferences);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to get destination suggestions';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generatePlan,
    getDestinationSuggestions
  };
};

// ===============================
// WEATHER HOOKS
// ===============================
export const useWeather = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentWeather = async (location) => {
    try {
      setLoading(true);
      setError(null);
      const response = await weatherAPI.getCurrentWeather(location);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to get weather data';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getWeatherForecast = async (location, days = 5) => {
    try {
      setLoading(true);
      setError(null);
      const response = await weatherAPI.getWeatherForecast(location, days);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to get weather forecast';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getCurrentWeather,
    getWeatherForecast
  };
};

// ===============================
// COMMUNITY HOOKS
// ===============================
export const useCommunity = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCommunityPlans = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await communityAPI.getCommunityPlans(params);
      setPlans(response.data.plans || []);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to get community plans';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getCommunityPlan = async (planId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await communityAPI.getCommunityPlan(planId);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to get community plan';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const likePlan = async (planId) => {
    try {
      const response = await communityAPI.likePlan(planId);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to like plan';
      return { success: false, error: errorMessage };
    }
  };

  const getPopularPlans = async (limit = 6) => {
    try {
      setLoading(true);
      setError(null);
      const response = await communityAPI.getPopularPlans(limit);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to get popular plans';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    plans,
    loading,
    error,
    getCommunityPlans,
    getCommunityPlan,
    likePlan,
    getPopularPlans
  };
};

// ===============================
// LOCATIONS HOOKS
// ===============================
export const useLocations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchLocations = async (query, types = 'geocode') => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationsAPI.searchLocations(query, types);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to search locations';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getPlaceDetails = async (placeId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationsAPI.getPlaceDetails(placeId);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to get place details';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getPopularDestinations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationsAPI.getPopularDestinations();
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to get popular destinations';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    searchLocations,
    getPlaceDetails,
    getPopularDestinations
  };
};
