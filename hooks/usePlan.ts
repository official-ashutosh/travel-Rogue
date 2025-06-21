import { useEffect, useState } from "react";

interface PlanContentGenerationState {
  [key: string]: boolean;
}

interface Plan {
  _id: string;
  isGeneratedUsingAI?: boolean;
  contentGenerationState: PlanContentGenerationState;
  // ...other plan fields
}

const usePlan = (planId: string, isNewPlan: boolean, isPublic: boolean) => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/plans/${planId}?public=${isPublic}`);
        if (!res.ok) throw new Error("Failed to fetch plan");
        const data = await res.json();
        setPlan(data.plan || null);
        setError(null);
      } catch (err: any) {
        setPlan(null);
        setError(err.message || "Something went wrong!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, [planId, isPublic]);

  const shouldShowAlert =
    plan?.isGeneratedUsingAI &&
    isNewPlan &&
    plan &&
    Object.values(plan.contentGenerationState).some((value) => value === false)
      ? true
      : false;

  return {
    shouldShowAlert,
    plan,
    isLoading,
    error,
  };
};

export default usePlan;
