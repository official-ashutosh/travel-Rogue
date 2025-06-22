"use client";
import { useEffect, useState } from "react";
import { NoPlans } from "@/frontend/components/dashboard/NoPlans";
import PlanCard from "@/frontend/components/dashboard/PlanCard";
import { GeneratePlanDrawerWithDialog } from "@/frontend/components/shared/DrawerWithDialogGeneric";
import { Input } from "@/frontend/components/ui/input";
import { Search } from "lucide-react";
export default function Dashboard() {
  const [searchPlanText, setSearchPlanText] = useState("");
  const [plans, setPlans] = useState<any[]>([]);
  const [communityPlans, setCommunityPlans] = useState<any[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<any[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with real userId from auth/session
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId) {
      // Set a default userId for testing
      const defaultUserId = "test-user-1";
      localStorage.setItem("userId", defaultUserId);
      console.log("⚠️ No userId found, setting default:", defaultUserId);
    }
    
    const finalUserId = userId || "test-user-1";
    setLoading(true);
    
    // Fetch user's personal plans
    const fetchPersonalPlans = fetch(`/api/plans?userId=${finalUserId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Personal plans fetched successfully:", data);
        setPlans(data.plans || []);
        return data.plans || [];
      })
      .catch((error) => {
        console.error("❌ Failed to fetch personal plans:", error);
        setPlans([]);
        return [];
      });

    // Fetch community plans (sample plans for inspiration)
    const fetchCommunityPlans = fetch('/api/community-plans?limit=6')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Community plans fetched successfully:", data);
        setCommunityPlans(data.plans || []);
        return data.plans || [];
      })
      .catch((error) => {
        console.error("❌ Failed to fetch community plans:", error);
        setCommunityPlans([]);
        return [];
      });

    // Wait for both requests to complete
    Promise.all([fetchPersonalPlans, fetchCommunityPlans]).finally(() => {
      setLoading(false);
    });
  }, []);

  const finalPlans = filteredPlans ?? plans;
  const shouldShowCommunityPlans = !loading && plans.length < 3; // Show community plans when user has few personal plans

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchPlanText(value);
    if (!plans || !plans.length) {
      return;
    }
    if (!value) {
      setFilteredPlans(undefined);
      return;
    }
    const filteredResults = plans.filter((plan) => {
      return plan.nameoftheplace.toLowerCase().includes(value.toLowerCase());
    });
    setFilteredPlans(filteredResults);
  };

  return (
    <section className="bg-stone-200 w-full h-full flex-1 flex flex-col dark:bg-background">
      <div className="flex justify-between gap-5 bg-stone-50 items-center lg:px-20 px-7 py-4 border-b dark:bg-background sticky top-0">
        <div className="relative ml-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
          <Input
            id="searchPlan"
            name="searchPlan"
            onChange={handleSearch}
            value={searchPlanText}
            placeholder="Search Travel Plan..."
            type="search"
            className="w-full cursor-pointer rounded-lg bg-background pl-8 transition-colors hover:bg-accent hover:text-accent-foreground  text-muted-foreground"
            disabled={loading || !plans.length}
          />
        </div>
        <GeneratePlanDrawerWithDialog />
      </div>
      <div className="flex h-full w-full px-4 lg:px-20 flex-1">
        <div className="mt-5 mx-auto bg-background dark:border-2 dark:border-border/50 rounded-sm flex-1" style={{ flex: "1 1 auto" }}>
          {loading ? (
            <NoPlans isLoading={true} />
          ) : (
            <div className="space-y-8">
              {/* User's Personal Plans */}
              {finalPlans && finalPlans.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 px-10">Your Travel Plans</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-6 gap-5 px-10">
                    {finalPlans.map((plan) => (
                      <PlanCard key={plan.id || plan._id} plan={{ ...plan, _id: plan.id || plan._id }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Community Plans for Inspiration */}
              {shouldShowCommunityPlans && communityPlans.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 px-10">Community Plans for Inspiration</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-6 gap-5 px-10">
                    {communityPlans.map((plan) => (
                      <PlanCard key={plan._id} plan={plan} isPublic={true} />
                    ))}
                  </div>
                  <div className="text-center mt-6">
                    <a 
                      href="/community-plans" 
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View All Community Plans
                    </a>
                  </div>
                </div>
              )}

              {/* Show NoPlans only when no personal plans and no community plans */}
              {!finalPlans.length && !communityPlans.length && (
                <NoPlans isLoading={false} />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}