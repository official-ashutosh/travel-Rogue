import ExpenseSection from "@/frontend/components/expenseTracker/ExpenseSection";

export default async function ExpenseTracker({params}: {params: {planId: string}}) {
  const {planId} = params;

  return <ExpenseSection planId={planId} />;
}
