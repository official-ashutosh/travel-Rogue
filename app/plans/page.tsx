// app/plans/page.tsx
import dynamic from "next/dynamic";
import Link from "next/link";

const PlansClient = dynamic(() => import("./PlansClient"), { ssr: false });

export default function PlansPage() {
  return (
    <div style={{ padding: 32 }}>
      <h1 className="text-2xl font-bold mb-4">Your Travel Plans</h1>
      <p>This is the plans list page. You can list all user plans here.</p>
      <div className="mt-8 mb-8">
        <Link href="/plans/new">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Create Travel Plan
          </button>
        </Link>
      </div>
      <PlansClient />
    </div>
  );
}
