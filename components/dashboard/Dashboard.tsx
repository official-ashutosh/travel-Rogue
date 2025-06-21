"use client";
import { useEffect, useState } from "react";
import { NoPlans } from "@/components/dashboard/NoPlans";
import PlanCard from "@/components/dashboard/PlanCard";
import { GeneratePlanDrawerWithDialog } from "@/components/shared/DrawerWithDialogGeneric";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Dashboard() {
  const [searchPlanText, setSearchPlanText] = useState("");
  const [plans, setPlans] = useState<any[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanAbout, setNewPlanAbout] = useState("");

  useEffect(() => {
    // TODO: Replace with real userId from auth/session
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId) return;
    setLoading(true);
    fetch(`/api/plans?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setPlans(data.plans || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const finalPlans = filteredPlans ?? plans;

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

  // CREATE
  const handleCreatePlan = async () => {
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId || !newPlanName) return;
    const res = await fetch("/api/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameoftheplace: newPlanName, abouttheplace: newPlanAbout, userId }),
    });
    const data = await res.json();
    if (data.plan) setPlans((prev) => [data.plan, ...prev]);
    setNewPlanName("");
    setNewPlanAbout("");
  };

  // DELETE
  const handleDelete = async (planId: string) => {
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId) return;
    await fetch("/api/plans", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, userId }),
    });
    setPlans((prev) => prev.filter((p) => p.id !== planId));
  };

  // UPDATE
  const handleUpdate = async (planId: string, name: string, about: string) => {
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId) return;
    const res = await fetch("/api/plans", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, nameoftheplace: name, abouttheplace: about, userId }),
    });
    const data = await res.json();
    if (data.plan) setPlans((prev) => prev.map((p) => (p.id === planId ? data.plan : p)));
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
      <div className="flex flex-col gap-2 p-4">
        <div className="flex gap-2 mb-4">
          <Input
            value={newPlanName}
            onChange={(e) => setNewPlanName(e.target.value)}
            placeholder="New plan name"
          />
          <Input
            value={newPlanAbout}
            onChange={(e) => setNewPlanAbout(e.target.value)}
            placeholder="About this plan"
          />
          <button className="btn btn-primary" onClick={handleCreatePlan}>
            Add Plan
          </button>
        </div>
      </div>
      <div className="flex h-full w-full px-4 lg:px-20 flex-1">
        <div className="mt-5 mx-auto bg-background dark:border-2 dark:border-border/50 rounded-sm flex-1" style={{ flex: "1 1 auto" }}>
          {loading || !finalPlans || finalPlans.length === 0 ? (
            <NoPlans isLoading={loading} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-6 gap-5 p-10 justify-center">
              {finalPlans?.map((plan) => (
                <PlanCard key={plan.id} plan={plan} onDelete={handleDelete} onUpdate={handleUpdate} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}