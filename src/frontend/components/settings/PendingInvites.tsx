"use client";

import { Button } from "@/frontend/components/ui/button";
import { useToast } from "@/frontend/components/ui/use-toast";
import { getDisplayName } from "@/shared/lib/utils";
import { useEffect, useState, useTransition } from "react";

interface Invite {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

const PendingInvites = ({ planId }: { planId: string }) => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const res = await fetch(`/api/invites?planId=${planId}`);
        if (res.ok) {
          const data = await res.json();
          setInvites(data.invites || []);
        }
      } catch (error) {
        // Optionally handle fetch error
      }
    };
    fetchInvites();
  }, [planId]);

  if (!invites || invites.length === 0) return null;

  const revokeEmailInvite = async (id: string, email: string) => {
    try {
      startTransition(async () => {
        const res = await fetch(`/api/invites?inviteId=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setInvites((prev) => prev.filter((invite) => invite._id !== id));
          toast({
            variant: "default",
            description: `Invite to ${email} has been revoked.`,
          });
        } else {
          const errorData = await res.json();
          toast({
            title: "Error",
            description: errorData?.message || "Something went wrong!",
          });
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="mt-5">
      <div className="mb-2 font-bold text-sm">Pending Invites</div>
      <div className="flex flex-col gap-3 max-w-lg">
        {invites.map((invite) => (
          <div
            key={invite._id}
            className="px-5 py-2 border border-solid border-border shadow-sm rounded-md flex gap-5 justify-between items-center"
          >
            <span className="text-sm text-muted-foreground">
              {getDisplayName(
                invite.firstName,
                invite?.lastName,
                invite?.email
              )}
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => revokeEmailInvite(invite._id, invite.email)}
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

export default PendingInvites;
