import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper.jsx';
import EditList from '../shared/EditList.jsx';
import HeaderWithEditIcon from '../shared/HeaderWithEditIcon.jsx';
import List from '../shared/List.jsx';
import { Utensils } from 'lucide-react';

const LocalCuisineRecommendations = ({ 
  recommendations = [], 
  planId, 
  isLoading = false, 
  allowEdit = true 
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (updatedRecommendations) => {
    try {
      // TODO: Replace with actual API call
      console.log('Saving cuisine recommendations:', updatedRecommendations);
      // await api.put(`/plans/${planId}/cuisine`, { recommendations: updatedRecommendations });
    } catch (error) {
      console.error('Failed to save cuisine recommendations:', error);
    }
  };

  if (isLoading) {
    return (
      <SectionWrapper id="localcuisinerecommendations">
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
    <SectionWrapper id="localcuisinerecommendations">
      <HeaderWithEditIcon
        title={
          <div className="flex items-center space-x-2">
            <Utensils className="w-6 h-6 text-blue-500" />
            <span>Local Cuisine Recommendations</span>
          </div>
        }
        onEdit={() => setIsEditing(true)}
        allowEdit={allowEdit}
      />
      
      <div className="mt-4">
        {isEditing ? (
          <EditList
            items={recommendations}
            onSave={handleSave}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            placeholder="Add a food recommendation..."
          />
        ) : (
          <List items={recommendations} />
        )}
      </div>
    </SectionWrapper>
  );
};

export default LocalCuisineRecommendations;
