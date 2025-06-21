// app/plans/[planId]/plan/page.tsx

"use client";

import { useParams } from "next/navigation";

export default function PlanDetailPage() {
  const params = useParams();
  const planId = params?.planId;
  console.log("[PlanDetailPage] planId:", planId);

  if (!planId || typeof planId !== "string" || planId === "undefined" || planId === "null") {
    return (
      <div style={{ padding: 32 }}>
        <h1 className="text-2xl font-bold mb-4">Plan Not Found</h1>
        <p>Invalid or missing plan ID. Please check your link or try again.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      <h1 className="text-2xl font-bold mb-4">Plan Details</h1>
      <p>Plan ID: {planId}</p>
      <p>This is the plan details page. You can fetch and display plan info here.</p>
    </div>
  );
}
