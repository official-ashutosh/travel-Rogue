import {Dispatch, SetStateAction} from "react";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";

import useItineraryForm from "@/hooks/useItineraryForm";

import {ItineraryValidationSchema} from "@/components/addNewItineraryDay/ItineraryValidationSchema";

import {Sun, Sunrise, Sunset} from "lucide-react";
import CustomTabContent from "@/components/addNewItineraryDay/CustomTabContent";

export type ItineraryType = z.infer<typeof ItineraryValidationSchema>["itinerary"];

type ItineraryDayFormProps = {
  planId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const ItineraryDayForm = ({planId, setOpen}: ItineraryDayFormProps) => {
  const {
    register,
    handleSubmit,
    handleTabChange,
    morningFields,
    afternoonFields,
    eveningFields,
    addNewControl,
    getFieldState,
    removeMorning,
    removeAfternoon,
    removeEvening,
    isValid,
    errors,
    isDirty,
  } = useItineraryForm(planId);

  // REMOVE: import { useMutation } from "convex/react";
  // REMOVE: import { api } from "@/convex/_generated/api";
  // REMOVE: import { Doc } from "@/convex/_generated/dataModel";

  // Add a placeholder for updateItinerary (replace with your MERN API call)
  const updateItinerary = async ({planId, itineraryDay}: {planId: string; itineraryDay: ItineraryType}) => {
    // TODO: Replace with your MERN backend API call
    // Example: await fetch(`/api/plans/${planId}/itinerary`, { method: 'POST', body: JSON.stringify({ itineraryDay }) })
    return Promise.resolve();
  };

  const onSaveEditList = (data: {itinerary: ItineraryType}) => {
    if (!planId) return;
    if (
      data.itinerary.activities.morning.length === 0 &&
      data.itinerary.activities.afternoon.length === 0 &&
      data.itinerary.activities.evening.length === 0
    )
      return;

    updateItinerary({
      planId: planId,
      itineraryDay: data.itinerary,
    }).then((_) => setOpen(false));
  };

  return (
    <form onSubmit={handleSubmit(onSaveEditList)} className="flex flex-col gap-1">
      <h2>New Day</h2>
      <Tabs defaultValue="morning" className="" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="morning">
            <Sunrise className="w-4 h-4 text-blue-500 mr-2" /> Morning
          </TabsTrigger>
          <TabsTrigger value="afternoon">
            <Sun className="w-4 h-4 text-yellow-500 mr-2" /> Afternoon
          </TabsTrigger>
          <TabsTrigger value="evening">
            <Sunset className="w-4 h-4 text-gray-600 mr-2" /> Evening
          </TabsTrigger>
        </TabsList>
        <CustomTabContent
          fields={morningFields}
          addNewControl={addNewControl}
          errors={errors}
          getFieldState={getFieldState}
          tabName="morning"
          register={register}
          remove={removeMorning}
        />

        <CustomTabContent
          fields={afternoonFields}
          addNewControl={addNewControl}
          errors={errors}
          getFieldState={getFieldState}
          tabName="afternoon"
          register={register}
          remove={removeAfternoon}
        />

        <CustomTabContent
          fields={eveningFields}
          addNewControl={addNewControl}
          errors={errors}
          getFieldState={getFieldState}
          tabName="evening"
          register={register}
          remove={removeEvening}
        />
      </Tabs>

      <div className="flex justify-start items-center gap-2 mt-5">
        <Button size="sm" variant="outline" disabled={!isValid && isDirty}>
          Save
        </Button>
        <Button onClick={() => setOpen(false)} size="sm" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ItineraryDayForm;
