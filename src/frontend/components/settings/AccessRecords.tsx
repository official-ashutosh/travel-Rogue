"use client";
import { Button } from "@/frontend/components/ui/button";
import { useToast } from "@/frontend/components/ui/use-toast";
import { getDisplayName } from "@/shared/lib/utils";
import { useTransition } from "react";

const AccessRecords = ({ planId }: { planId: string }) => {
  // TODO: Replace with your own backend logic or props
  const records: any[] = [];
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const revokeEmailInvite = async (id: string, email: string) => {
    startTransition(async () => {
      // TODO: Implement your own revoke logic here
    });
    toast({
      variant: "default",
      description: `Access of this plan from ${email} has been revoked.`,
    });
  };

  if (!records || records.length === 0) return null;
  return (
    <div className="mt-5">
      <div className="mb-2 font-bold text-sm">
        People having access to this plan
      </div>
      <div className="flex flex-col gap-3 max-w-lg">
        {records.map((record) => (
          <div
            key={record._id}
            className="px-5 py-2 
                        border border-solid border-border 
                        rounded-lg flex items-center justify-between"
          >
            <span>{getDisplayName(record.email)}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => revokeEmailInvite(record._id, record.email)}
              disabled={isPending}
            >
              Revoke
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccessRecords;
