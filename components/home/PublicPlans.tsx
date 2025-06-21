import PlanCard from "@/components/dashboard/PlanCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

async function fetchPublicPlans() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const res = await fetch(`${baseUrl}/api/plans?public=true`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.plans || [];
}

export default async function PublicPlans() {
  const plans = await fetchPublicPlans();

  return (
    <section
      id="public-plans"
      className="min-h-[100svh]
                     bg-background/90
                     w-full 
                     flex justify-center items-end
                     px-5 md:px-0 py-10 md:py-0"
    >
      <div className="flex flex-col gap-2 w-full">
        <h2 className="text-blue-500 text-center text-lg font-bold tracking-wide">
          Our Community's Favorite Trips
        </h2>

        <div
          className="grid grid-cols-1 
                      md:grid-cols-2 lg:grid-cols-3
                      xl:grid-cols-4 4xl:grid-cols-6
                      gap-2 p-10 justify-center"
        >
          {plans?.map((plan: any) => (
            <PlanCard key={plan.id} plan={plan} isPublic />
          ))}
        </div>
        <Link
          href="/community-plans"
          className="flex gap-1 justify-center items-center w-fit mx-auto text-xs underline-offset-4 hover:text-primary hover:underline"
        >
          <span>View All Community Plans</span>
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
