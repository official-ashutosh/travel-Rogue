import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper.jsx';
import EditList from '../shared/EditList.jsx';
import HeaderWithEditIcon from '../shared/HeaderWithEditIcon.jsx';
import List from '../shared/List.jsx';
import { MapPin } from 'lucide-react';

const TopPlacesToVisit = ({ 
  topPlacesToVisit = [], 
  planId, 
  isLoading = false, 
  allowEdit = true 
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (updatedPlaces) => {
    try {
      // TODO: Replace with actual API call
      console.log('Saving places:', updatedPlaces);
      // await api.put(`/plans/${planId}/places`, { places: updatedPlaces });
    } catch (error) {
      console.error('Failed to save places:', error);
    }
  };

  if (isLoading) {
    return (
      <SectionWrapper id="topplacestovisit">
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
    <SectionWrapper id="topplacestovisit">
      <HeaderWithEditIcon
        title={
          <div className="flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-blue-500" />
            <span>Top Places to Visit</span>
          </div>
        }
        onEdit={() => setIsEditing(true)}
        allowEdit={allowEdit}
      />
      
      <div className="mt-4">
        {isEditing ? (
          <EditList
            items={topPlacesToVisit}
            onSave={handleSave}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            placeholder="Add a place to visit..."
          />
        ) : (
          <List items={topPlacesToVisit} />
        )}
      </div>
    </SectionWrapper>
  );
};

export default TopPlacesToVisit;
