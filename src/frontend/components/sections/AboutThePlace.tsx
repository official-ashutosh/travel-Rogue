"use client";
import SectionWrapper from "@/frontend/components/sections/SectionWrapper";

import {Skeleton} from "@/frontend/components/ui/skeleton";
import {Info} from "lucide-react";
import {useState} from "react";
import EditText from "@/frontend/components/shared/EditText";
import HeaderWithEditIcon from "@/frontend/components/shared/HeaderWithEditIcon";

// Add a placeholder for updateAboutThePlace (replace with your MERN API call)
const updateAboutThePlace = async ({planId, data}: {planId: string; data: string}) => {
  // TODO: Replace with your MERN backend API call
  // Example: await fetch(`/api/plans/${planId}/about`, { method: 'PUT', body: JSON.stringify({ data }) })
  return Promise.resolve();
};

type AboutThePlaceProps = {
  content: string | undefined;
  isLoading: boolean;
  planId: string;
  allowEdit: boolean;
};

export default function AboutThePlace({content, isLoading, planId, allowEdit}: AboutThePlaceProps) {
  const [editMode, setEditMode] = useState(false);

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };

  const updateAboutThePlaceContent = (updatedContent: string) => {
    updateAboutThePlace({
      planId: planId,
      data: updatedContent.trim(),
    }).then(() => {
      handleToggleEditMode();
    });
  };

  return (
    <SectionWrapper id="abouttheplace">
      <HeaderWithEditIcon
        shouldShowEditIcon={!editMode && allowEdit}
        handleToggleEditMode={handleToggleEditMode}
        hasData={typeof content === "string" && content.length > 0}
        icon={<Info className="mr-2" />}
        title="About the Place"
        isLoading={isLoading}
      />
      <div className="ml-8">
        {!isLoading ? (
          editMode ? (
            <EditText
              content={content ?? ""}
              toggleEditMode={handleToggleEditMode}
              updateContent={updateAboutThePlaceContent}
            />
          ) : (
            content || (
              <div className=" flex justify-center items-center">
                Click + to add about the place
              </div>
            )
          )
        ) : (
          <Skeleton className="w-full h-full" />
        )}
      </div>
    </SectionWrapper>
  );
}
