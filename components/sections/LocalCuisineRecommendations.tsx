"use client";
import SectionWrapper from "@/components/sections/SectionWrapper";
import EditList from "@/components/shared/EditList";
import HeaderWithEditIcon from "@/components/shared/HeaderWithEditIcon";
import List from "@/components/shared/List";
import {Skeleton} from "@/components/ui/skeleton";
import {Utensils} from "lucide-react";
import {useState} from "react";

type LocalCuisineRecommendationsProps = {
  recommendations: string[] | undefined;
  planId: string;
  isLoading: boolean;
  allowEdit: boolean;
};

// Add a placeholder for updateLocalCuisineRecommendations (replace with your MERN API call)
const updateLocalCuisineRecommendations = async ({ planId, data }: { planId: string; data: string[] }) => {
  // TODO: Replace with your MERN backend API call
  // Example: await fetch(`/api/plans/${planId}/local-cuisine`, { method: 'PUT', body: JSON.stringify({ data }) })
  return Promise.resolve();
};

export default function LocalCuisineRecommendations({
  recommendations,
  isLoading,
  planId,
  allowEdit,
}: LocalCuisineRecommendationsProps) {
  const [editMode, setEditMode] = useState(false);

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };

  const updateLocalCuisines = (updatedArray: string[]) => {
    updateLocalCuisineRecommendations({
      planId: planId,
      data: updatedArray,
    }).then(() => {
      handleToggleEditMode();
    });
  };

  return (
    <SectionWrapper id="localcuisinerecommendations">
      <HeaderWithEditIcon
        shouldShowEditIcon={!editMode && allowEdit}
        handleToggleEditMode={handleToggleEditMode}
        hasData={recommendations != null && recommendations.length != 0}
        icon={<Utensils className="mr-2" />}
        title="Local Cuisine Recommendations"
        isLoading={isLoading}
      />

      {!isLoading && recommendations ? (
        <div className="ml-8">
          {editMode ? (
            <EditList
              arrayData={recommendations}
              handleToggleEditMode={handleToggleEditMode}
              updateData={updateLocalCuisines}
            />
          ) : (
            <List list={recommendations} />
          )}
        </div>
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </SectionWrapper>
  );
}
