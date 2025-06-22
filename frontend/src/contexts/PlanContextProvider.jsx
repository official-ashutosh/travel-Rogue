import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import usePlan from '../hooks/usePlan.js';
import AccessDenied from '../components/plan/AccessDenied.jsx';

// Plan content generation state interface
const defaultPlanState = {
  imagination: false,
  abouttheplace: false,
  adventuresactivitiestodo: false,
  topplacestovisit: false,
  itinerary: false,
  localcuisinerecommendations: false,
  packingchecklist: false,
  besttimetovisit: false,
  weather: false,
};

const PlanContext = createContext({
  planState: defaultPlanState,
  setPlanState: () => {},
  shouldShowAlert: false,
  plan: null,
  isLoading: false,
  error: null,
});

export const usePlanContext = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlanContext must be used within a PlanContextProvider');
  }
  return context;
};

export const PlanContextProvider = ({ children, planId, isPublic = false }) => {
  const [planState, setPlanState] = useState(defaultPlanState);
  const [searchParams] = useSearchParams();
  const isNewPlan = Boolean(searchParams && searchParams.get("isNewPlan"));
  
  const { shouldShowAlert, plan, isLoading, error } = usePlan(
    planId,
    isNewPlan,
    isPublic
  );

  // Update plan state when plan data changes
  useEffect(() => {
    if (isLoading || !plan) return;
    setPlanState(prev => ({
      ...defaultPlanState,
      ...plan.contentGenerationState,
      weather: prev.weather, // Preserve weather state
    }));
  }, [plan, isLoading]);

  const value = {
    planState,
    setPlanState,
    shouldShowAlert,
    plan,
    isLoading,
    error,
  };

  return (
    <PlanContext.Provider value={value}>
      {error ? <AccessDenied /> : children}
    </PlanContext.Provider>
  );
};

export default PlanContextProvider;
