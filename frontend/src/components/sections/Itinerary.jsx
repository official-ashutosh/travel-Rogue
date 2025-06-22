import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper.jsx';
import EditList from '../shared/EditList.jsx';
import HeaderWithEditIcon from '../shared/HeaderWithEditIcon.jsx';
import List from '../shared/List.jsx';
import { Navigation } from 'lucide-react';

const Itinerary = ({ 
  itinerary = [], 
  planId, 
  isLoading = false, 
  allowEdit = true 
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (updatedItinerary) => {
    try {
      // TODO: Replace with actual API call
      console.log('Saving itinerary:', updatedItinerary);
      // await api.put(`/plans/${planId}/itinerary`, { itinerary: updatedItinerary });
    } catch (error) {
      console.error('Failed to save itinerary:', error);
    }
  };

  if (isLoading) {
    return (
      <SectionWrapper id="itinerary">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="itinerary">
      <HeaderWithEditIcon
        title={
          <div className="flex items-center space-x-2">
            <Navigation className="w-6 h-6 text-blue-500" />
            <span>Itinerary</span>
          </div>
        }
        onEdit={() => setIsEditing(true)}
        allowEdit={allowEdit}
      />
      
      <div className="mt-4">
        {isEditing ? (
          <EditList
            items={itinerary}
            onSave={handleSave}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            placeholder="Add an itinerary item..."
          />
        ) : (
          <List items={itinerary} />
        )}
      </div>
    </SectionWrapper>
  );
};

export default Itinerary;
