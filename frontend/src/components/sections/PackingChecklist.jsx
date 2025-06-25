import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper.jsx';
import EditList from '../shared/EditList.jsx';
import HeaderWithEditIcon from '../shared/HeaderWithEditIcon.jsx';
import List from '../shared/List.jsx';
import { Backpack } from 'lucide-react';

const PackingChecklist = ({ 
  checklist = [], 
  planId, 
  isLoading = false, 
  allowEdit = true 
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (updatedChecklist) => {
    try {
      console.log('Saving packing checklist:', updatedChecklist);
    } catch (error) {
      console.error('Failed to save packing checklist:', error);
    }
  };

  if (isLoading) {
    return (
      <SectionWrapper id="packingchecklist">
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
    <SectionWrapper id="packingchecklist">
      <HeaderWithEditIcon
        title={
          <div className="flex items-center space-x-2">
            <Backpack className="w-6 h-6 text-blue-500" />
            <span>Packing Checklist</span>
          </div>
        }
        onEdit={() => setIsEditing(true)}
        allowEdit={allowEdit}
      />
      
      <div className="mt-4">
        {isEditing ? (
          <EditList
            items={checklist}
            onSave={handleSave}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            placeholder="Add a packing item..."
          />
        ) : (
          <List items={checklist} />
        )}
      </div>
    </SectionWrapper>
  );
};

export default PackingChecklist;
