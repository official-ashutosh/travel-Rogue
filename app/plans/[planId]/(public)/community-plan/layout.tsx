import {getAuthToken} from "../../../../auth";
import Header from "@/frontend/components/plan/Header";
import PlanLayoutContent from "@/frontend/components/plan/PlanLayoutContent";
import {Metadata, ResolvingMetadata} from "next";

export async function generateMetadata(
  {
    params,
  }: {
    params: {planId: string};
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.planId;
  // const token = await getAuthToken();
  try {
    // MERN-style placeholder for fetching a single plan
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ""}/api/plans/${id}?public=true`,
      {
        method: "GET",
        // headers: { Authorization: `Bearer ${token}` },
      }
    );
    const plan = await res.json();
    return {
      title: plan ? plan.nameoftheplace : "Your Plan",
    };
  } catch (error) {
    return {
      title: "Unauthorized Access!",
    };
  }
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {planId: string};
}) {
  return (
    <>
      <Header isPublic={true} />
      <main className="flex min-h-[calc(100svh-4rem)] flex-col items-center bg-blue-50/40 dark:bg-background">
        <PlanLayoutContent planId={params.planId} isPublic={true}>
          {children}
        </PlanLayoutContent>
      </main>
    </>
  );
}
