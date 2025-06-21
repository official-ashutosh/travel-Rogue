"use client";
import SectionWrapper from "@/components/sections/SectionWrapper";
import EditList from "@/components/shared/EditList";
import HeaderWithEditIcon from "@/components/shared/HeaderWithEditIcon";
import List from "@/components/shared/List";
import {Skeleton} from "@/components/ui/skeleton";
import {Backpack} from "lucide-react";
import {useState} from "react";

// MERN-style placeholder for updating the packing checklist
const updatePackingChecklist = async (planId: string, updatedArray: string[]) => {
  // TODO: Replace with your actual MERN backend API call
  // Example: await fetch(`/api/plan/update`, { method: 'POST', body: JSON.stringify({ planId, key: 'packingchecklist', data: updatedArray }) })
  await fetch("/api/plan/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planId, key: "packingchecklist", data: updatedArray }),
  });
};

type PackingChecklistProps = {
  checklist: string[] | undefined;
  planId: string;
  isLoading: boolean;
  allowEdit: boolean;
};

export default function PackingChecklist({
  checklist,
  isLoading,
  planId,
  allowEdit,
}: PackingChecklistProps) {
  const [editMode, setEditMode] = useState(false);

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };

  const updateChecklist = async (updatedArray: string[]) => {
    await updatePackingChecklist(planId, updatedArray);
    handleToggleEditMode();
  };

  return (
    <SectionWrapper id="packingchecklist">
      <HeaderWithEditIcon
        shouldShowEditIcon={!editMode && allowEdit}
        handleToggleEditMode={handleToggleEditMode}
        hasData={checklist != null && checklist.length != 0}
        icon={<Backpack className="mr-2" />}
        title="Packing Checklist"
        isLoading={isLoading}
      />

      {!isLoading && checklist ? (
        <div className="ml-8">
          {editMode ? (
            <EditList
              arrayData={checklist}
              handleToggleEditMode={handleToggleEditMode}
              updateData={updateChecklist}
            />
          ) : (
            <List list={checklist} />
          )}
        </div>
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </SectionWrapper>
  );
}
