"use client";

import {Button} from "@/components/ui/button";
import {TrashIcon} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {useState} from "react";

type ItineraryDayHeaderProps = {
  title: string;
  planId: string;
  allowEdit: boolean;
};

// Add a placeholder for deleteDayInItinerary (replace with your MERN API call)
const deleteDayInItinerary = async (planId: string, dayName: string) => {
  // TODO: Replace with your MERN backend API call
  // Example: await fetch(`/api/plans/${planId}/itinerary/${dayName}`, { method: 'DELETE' })
  alert(`Deleted day '${dayName}' from plan '${planId}' (mock)`);
};

export default function ItineraryDayHeader({title, planId, allowEdit}: ItineraryDayHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between mb-2 text-lg font-bold leading-2 text-foreground ">
      <span>{title}</span>
      {allowEdit && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger>
            <Button
              asChild
              size="icon"
              variant="ghost"
              className="p-1 rounded-full bg-background/50"
              onClick={() => setOpen(true)}
            >
              <TrashIcon className="h-6 w-6 text-red-500 dark:text-foreground dark:hover:text-red-500 hover:scale-105 transition-all duration-300" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the day from your
                Itinerary.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteDayInItinerary(planId, title)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
