import React from 'react';
import SectionWrapper from './SectionWrapper.jsx';
import { Image as ImageIcon } from 'lucide-react';

const ImageSection = ({ 
  imageUrl = '', 
  placeName = '', 
  userPrompt = '',
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <SectionWrapper>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <div className="text-center">
        {imageUrl ? (
          <div className="relative">
            <img
              src={imageUrl}
              alt={placeName || 'Travel destination'}
              className="w-full h-64 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div 
              className="hidden w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg items-center justify-center"
            >
              <div className="text-center text-gray-500 dark:text-gray-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                <p>Image not available</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-2" />
              <p>No image available</p>
            </div>
          </div>
        )}
        
        {placeName && (
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            {placeName}
          </h1>
        )}
        
        {userPrompt && (
          <p className="text-gray-600 dark:text-gray-400 mt-2 italic">
            "{userPrompt}"
          </p>
        )}
      </div>
    </SectionWrapper>
  );
};

export default ImageSection;
