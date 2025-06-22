import { useState } from 'react';

// Hook for itinerary form management
const useItineraryForm = (initialItinerary = []) => {
  const [itinerary, setItinerary] = useState(initialItinerary);
  const [isEditing, setIsEditing] = useState(false);

  // Add new day to itinerary
  const addDay = () => {
    const newDay = {
      id: Date.now(),
      day: itinerary.length + 1,
      date: '',
      activities: [
        { time: 'Morning', activity: '', description: '' },
        { time: 'Afternoon', activity: '', description: '' },
        { time: 'Evening', activity: '', description: '' },
      ],
    };
    setItinerary(prev => [...prev, newDay]);
  };

  // Remove day from itinerary
  const removeDay = (dayId) => {
    setItinerary(prev => {
      const filtered = prev.filter(day => day.id !== dayId);
      // Renumber days
      return filtered.map((day, index) => ({ ...day, day: index + 1 }));
    });
  };

  // Update day data
  const updateDay = (dayId, updates) => {
    setItinerary(prev =>
      prev.map(day =>
        day.id === dayId ? { ...day, ...updates } : day
      )
    );
  };

  // Add activity to a day
  const addActivity = (dayId) => {
    setItinerary(prev =>
      prev.map(day =>
        day.id === dayId
          ? {
              ...day,
              activities: [
                ...day.activities,
                { time: 'Custom', activity: '', description: '' },
              ],
            }
          : day
      )
    );
  };

  // Update activity in a day
  const updateActivity = (dayId, activityIndex, updates) => {
    setItinerary(prev =>
      prev.map(day =>
        day.id === dayId
          ? {
              ...day,
              activities: day.activities.map((activity, index) =>
                index === activityIndex ? { ...activity, ...updates } : activity
              ),
            }
          : day
      )
    );
  };

  // Remove activity from a day
  const removeActivity = (dayId, activityIndex) => {
    setItinerary(prev =>
      prev.map(day =>
        day.id === dayId
          ? {
              ...day,
              activities: day.activities.filter((_, index) => index !== activityIndex),
            }
          : day
      )
    );
  };

  // Reset itinerary
  const resetItinerary = () => {
    setItinerary(initialItinerary);
    setIsEditing(false);
  };

  // Get total days
  const totalDays = itinerary.length;

  // Get total activities
  const totalActivities = itinerary.reduce((total, day) => total + day.activities.length, 0);

  return {
    itinerary,
    setItinerary,
    isEditing,
    setIsEditing,
    addDay,
    removeDay,
    updateDay,
    addActivity,
    updateActivity,
    removeActivity,
    resetItinerary,
    totalDays,
    totalActivities,
  };
};

export default useItineraryForm;
