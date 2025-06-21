"use client";

import SectionWrapper from "@/components/sections/SectionWrapper";
import EditList from "@/components/shared/EditList";
import HeaderWithEditIcon from "@/components/shared/HeaderWithEditIcon";
import List from "@/components/shared/List";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {PencilIcon, PlusIcon, Sailboat} from "lucide-react";
import {useState} from "react";

// MERN-style placeholder for updating top activities
const updateActivities = async (planId: string, updatedArray: string[]) => {
  // TODO: Replace with your actual MERN backend API call
  await fetch("/api/plan/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planId, key: "adventuresactivitiestodo", data: updatedArray }),
  });
};

type TopActivitiesProps = {
  activities: string[] | undefined;
  planId: string;
  isLoading: boolean;
  allowEdit: boolean;
};

export default function TopActivities({
  activities,
  planId,
  isLoading,
  allowEdit,
}: TopActivitiesProps) {
  const [editMode, setEditMode] = useState(false);

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };

  const updateActivitiesToDo = async (updatedArray: string[]) => {
    await updateActivities(planId, updatedArray);
    handleToggleEditMode();
  };

  return (
    <SectionWrapper id="adventuresactivitiestodo">
      <HeaderWithEditIcon
        shouldShowEditIcon={!editMode && allowEdit}
        handleToggleEditMode={handleToggleEditMode}
        hasData={activities != null && activities.length != 0}
        icon={<Sailboat className="mr-2" />}
        title="Top activities to look for"
        isLoading={isLoading}
      />
      {!isLoading && activities ? (
        <div className="ml-8">
          {editMode ? (
            <EditList
              arrayData={activities}
              handleToggleEditMode={handleToggleEditMode}
              updateData={updateActivitiesToDo}
            />
          ) : (
            <List list={activities} />
          )}
        </div>
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </SectionWrapper>
  );
}
