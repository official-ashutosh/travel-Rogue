"use client";
import usePlan from "@/hooks/usePlan";
import { useSearchParams } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

import AccessDenied from "@/components/plan/AccessDenied";

// Local types for plan and plan settings
interface PlanSettings {
  activityPreferences?: string[];
  companion?: string;
  fromDate?: number;
  toDate?: number;
  isPublished?: boolean;
}

interface PlanContentGenerationState {
  imagination: boolean;
  abouttheplace: boolean;
  adventuresactivitiestodo: boolean;
  topplacestovisit: boolean;
  itinerary: boolean;
  localcuisinerecommendations: boolean;
  packingchecklist: boolean;
  besttimetovisit: boolean;
  weather: boolean;
}

interface Plan {
  contentGenerationState: PlanContentGenerationState;
  isSharedPlan: boolean;
  // ...other plan fields
}

type planStateType = PlanContentGenerationState;

type PlanContextType = {
  planState: planStateType;
  setPlanState: Dispatch<SetStateAction<planStateType>>;
  shouldShowAlert: boolean;
  plan:
    | (Plan & PlanSettings)
    | null
    | undefined;
  isLoading: boolean;
};

const defaultPlanState: planStateType = {
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

const PlanContext = createContext<PlanContextType | undefined>({
  planState: defaultPlanState,
  setPlanState: () => {},
  shouldShowAlert: false,
  plan: undefined,
  isLoading: false,
});

export const usePlanContext = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error("usePlanContext must be used within a PlanContextProvider");
  }
  return context;
};

const PlanContextProvider = ({
  children,
  planId,
  isPublic,
}: {
  children: React.ReactNode;
  planId: string;
  isPublic: boolean;
}) => {
  const [planState, setPlanState] = useState<planStateType>(defaultPlanState);
  const searchParams = useSearchParams();
  const isNewPlan = Boolean(searchParams.get("isNewPlan"));
  const { shouldShowAlert, plan, isLoading, error } = usePlan(
    planId,
    isNewPlan,
    isPublic
  );
  useEffect(() => {
    if (isLoading || !plan) return;
    setPlanState((state) => ({
      ...plan.contentGenerationState,
      weather: state.weather,
    }));
  }, [plan]);
  return (
    <PlanContext.Provider
      value={{ planState, shouldShowAlert, plan, isLoading, setPlanState }}
    >
      {error ? <AccessDenied /> : children}
    </PlanContext.Provider>
  );
};

export default PlanContextProvider;
