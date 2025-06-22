import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper.jsx';
import EditText from '../shared/EditText.jsx';
import HeaderWithEditIcon from '../shared/HeaderWithEditIcon.jsx';
import { Info } from 'lucide-react';

const AboutThePlace = ({ 
  content = '', 
  planId, 
  isLoading = false, 
  allowEdit = true 
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (updatedContent) => {
    try {
      // TODO: Replace with actual API call
      console.log('Saving about content:', updatedContent);
      // await api.put(`/plans/${planId}/about`, { content: updatedContent });
    } catch (error) {
      console.error('Failed to save about content:', error);
    }
  };

  if (isLoading) {
    return (
      <SectionWrapper id="abouttheplace">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="abouttheplace">
      <HeaderWithEditIcon
        title={
          <div className="flex items-center space-x-2">
            <Info className="w-6 h-6 text-blue-500" />
            <span>About the Place</span>
          </div>
        }
        onEdit={() => setIsEditing(true)}
        allowEdit={allowEdit}
      />
      
      <div className="mt-4">
        {isEditing ? (
          <EditText
            value={content}
            onSave={handleSave}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            placeholder="Tell us about this place..."
          />
        ) : (
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {content || 'No description available.'}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default AboutThePlace;
