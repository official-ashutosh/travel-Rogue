import dynamic from "next/dynamic";

const PlansClient = dynamic(() => import("../PlansClient"), { ssr: false });

export default function NewPlanPage() {
  return (
    <div style={{ padding: 32 }}>
      <h1 className="text-2xl font-bold mb-4">Create a New Travel Plan</h1>
      <PlansClient />
    </div>
  );
}
