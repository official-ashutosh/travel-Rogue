"use client";

import {Loading} from "@/frontend/components/shared/Loading";
import {AlertDialogAction, AlertDialogCancel} from "@/frontend/components/ui/alert-dialog";
import {Button} from "@/frontend/components/ui/button";
import {useToast} from "@/frontend/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function DeletePlanButtons({planId}: {planId: string}) {
  const router = useRouter();
  const {toast} = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePlan = async () => {
    try {
      setIsDeleting(true);
      const {id, dismiss} = toast({
        title: "Deleting Plan",
        description: "Your plan is being deleted. Please wait...",
      });
      // REST API call to delete plan
      const res = await fetch(`/api/plans?planId=${planId}`, {
        method: "DELETE",
      });
      dismiss();
      setIsDeleting(false);
      if (!res.ok) {
        const errorData = await res.json();
        toast({
          title: "Not Allowed",
          variant: "destructive",
          description: errorData?.message || "Something went wrong!",
        });
        return;
      }
      router.push("/dashboard");
    } catch (error) {
      setIsDeleting(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: (error as Error).message || "Something went wrong!",
      });
    }
  };

  return (
    <>
      <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
      <AlertDialogAction asChild className="destructive">
        <Button
          variant="destructive"
          className="bg-red-500 text-white hover:text-white hover:bg-red-700 flex gap-2 justify-center items-center"
          disabled={isDeleting}
          onClick={handleDeletePlan}
        >
          {isDeleting && <Loading className="h-4 w-4 text-white" />}
          <span>{isDeleting ? "Deleting..." : "Delete"}</span>
        </Button>
      </AlertDialogAction>
    </>
  );
}
