import Timeline from "@/frontend/components/Timeline";
import SectionWrapper from "@/frontend/components/sections/SectionWrapper";
import { AddIternaryDay } from "@/frontend/components/addNewItineraryDay/AddIternaryDay";
import { Button } from "@/frontend/components/ui/button";
import { Skeleton } from "@/frontend/components/ui/skeleton";
import { Navigation, PlusCircle, PlusCircleIcon, PlusIcon } from "lucide-react";

// Define a local Itinerary type
export type ItineraryDay = {
  title: string;
  activities: {
    morning: any[];
    afternoon: any[];
    evening: any[];
  };
  // Add other fields as needed
};

type ItineraryProps = {
  itinerary: ItineraryDay[] | undefined;
  planId: string;
  isLoading: boolean;
  allowEdit: boolean;
};

const Itinerary = ({ itinerary, planId, isLoading, allowEdit }: ItineraryProps) => {
  return (
    <SectionWrapper id="itinerary">
      <div className="mb-2 flex justify-between items-center">
        <h2
          className="text-lg font-semibold
                tracking-wide flex items-center"
        >
          <Navigation className="mr-2" /> Itinerary
        </h2>
        {allowEdit && !isLoading && <AddIternaryDay planId={planId} />}
      </div>
      {!isLoading ? (
        <Timeline itinerary={itinerary} planId={planId} allowEdit={allowEdit}/>
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </SectionWrapper>
  );
};

export default Itinerary;
