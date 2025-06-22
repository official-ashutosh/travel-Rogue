import CurrencySelector from "@/frontend/components/settings/CurrencySelector";
import DangerZone from "@/frontend/components/settings/DangerZone";
import DisplayName from "@/frontend/components/settings/DisplayName";

export default function PlanSettings({params: {planId}}: {params: {planId: string}}) {
  return (
    <section className="flex flex-col gap-5">
      <CurrencySelector planId={planId} />
      <DisplayName />
      <DangerZone planId={planId} />
    </section>
  );
}
