import { useState, useEffect } from 'react';
import api from '../lib/api.js';

const usePlan = (planId, isNewPlan = false, isPublic = false) => {
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shouldShowAlert, setShouldShowAlert] = useState(false);

  // Fetch plan data
  const fetchPlan = async () => {
    if (!planId || isNewPlan) return;

    setIsLoading(true);
    setError(null);

    try {
      let response;
      if (isPublic) {
        response = await api.get(`/community-plans/${planId}`);
      } else {
        response = await api.get(`/plans/${planId}`);
      }
      
      setPlan(response.data);
    } catch (err) {
      console.error('Failed to fetch plan:', err);
      setError(err.response?.data?.error || 'Failed to load plan');
    } finally {
      setIsLoading(false);
    }
  };

  // Update plan
  const updatePlan = async (updates) => {
    if (!planId) return;

    try {
      const response = await api.put(`/plans/${planId}`, updates);
      setPlan(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to update plan:', err);
      throw err;
    }
  };

  // Delete plan
  const deletePlan = async () => {
    if (!planId) return;

    try {
      await api.delete(`/plans/${planId}`);
      return true;
    } catch (err) {
      console.error('Failed to delete plan:', err);
      throw err;
    }
  };

  // Create new plan
  const createPlan = async (planData) => {
    try {
      const response = await api.post('/plans', planData);
      setPlan(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to create plan:', err);
      throw err;
    }
  };

  // Check if should show alert based on plan state
  useEffect(() => {
    if (plan?.contentGenerationState) {
      const hasGeneratingContent = Object.values(plan.contentGenerationState).some(state => state === true);
      setShouldShowAlert(hasGeneratingContent);
    }
  }, [plan]);

  // Load plan when planId changes
  useEffect(() => {
    fetchPlan();
  }, [planId, isNewPlan, isPublic]);

  return {
    plan,
    isLoading,
    error,
    shouldShowAlert,
    updatePlan,
    deletePlan,
    createPlan,
    refetch: fetchPlan,
  };
};

export default usePlan;
