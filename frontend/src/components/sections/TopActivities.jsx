import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper.jsx';
import EditList from '../shared/EditList.jsx';
import HeaderWithEditIcon from '../shared/HeaderWithEditIcon.jsx';
import List from '../shared/List.jsx';
import { Sailboat } from 'lucide-react';

const TopActivities = ({ 
  activities = [], 
  planId, 
  isLoading = false, 
  allowEdit = true 
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (updatedActivities) => {
    try {
      // TODO: Replace with actual API call
      console.log('Saving activities:', updatedActivities);
      // await api.put(`/plans/${planId}/activities`, { activities: updatedActivities });
    } catch (error) {
      console.error('Failed to save activities:', error);
    }
  };

  if (isLoading) {
    return (
      <SectionWrapper id="adventuresactivitiestodo">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="adventuresactivitiestodo">
      <HeaderWithEditIcon
        title={
          <div className="flex items-center space-x-2">
            <Sailboat className="w-6 h-6 text-blue-500" />
            <span>Top Activities & Adventures</span>
          </div>
        }
        onEdit={() => setIsEditing(true)}
        allowEdit={allowEdit}
      />
      
      <div className="mt-4">
        {isEditing ? (
          <EditList
            items={activities}
            onSave={handleSave}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            placeholder="Add an activity..."
          />
        ) : (
          <List items={activities} />
        )}
      </div>
    </SectionWrapper>
  );
};

export default TopActivities;
