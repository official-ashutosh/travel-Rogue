import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Wand2, 
  Loader2,
  MessageSquarePlus,
  Heart,
  Camera,
  Utensils,
  Mountain,
  Building,
  Compass
} from 'lucide-react';
import { Button } from './ui/Button.jsx';
import { Input } from './ui/Input.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../lib/api.js';

const NewPlanForm = ({ closeModal }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState([]);
  
  const [formData, setFormData] = useState({
    nameoftheplace: '',
    fromdate: '',
    todate: '',
    budget: '',
    abouttheplace: '',
    companion: '',
    activityPreferences: []
  });

  const activities = [
    { id: 'sightseeing', label: 'Sightseeing', icon: Camera },
    { id: 'adventure', label: 'Adventure', icon: Mountain },
    { id: 'food', label: 'Food & Dining', icon: Utensils },
    { id: 'culture', label: 'Culture & History', icon: Building },
    { id: 'nature', label: 'Nature & Wildlife', icon: Compass },
    { id: 'relaxation', label: 'Relaxation', icon: Heart }
  ];

  const companions = [
    { id: 'solo', label: 'Solo Travel' },
    { id: 'couple', label: 'Couple' },
    { id: 'family', label: 'Family' },
    { id: 'friends', label: 'Friends' },
    { id: 'business', label: 'Business' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleActivity = (activityId) => {
    setSelectedActivities(prev => {
      const updated = prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId];
      
      setFormData(prevForm => ({
        ...prevForm,
        activityPreferences: updated
      }));
      
      return updated;
    });
  };

  const validateForm = () => {
    if (!formData.nameoftheplace.trim()) {
      alert('Please enter a destination');
      return false;
    }
    if (!formData.fromdate || !formData.todate) {
      alert('Please select travel dates');
      return false;
    }
    if (new Date(formData.fromdate) >= new Date(formData.todate)) {
      alert('End date must be after start date');
      return false;
    }
    return true;
  };

  const handleCreatePlan = async (withAI = false) => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const planData = {
        ...formData,
        user_id: user?.id,
        activityPreferences: selectedActivities,
        generateWithAI: withAI
      };

      const response = await api.post('/plans', planData);
      
      if (response.data.success) {
        if (closeModal) closeModal();
        navigate(`/plans/${response.data.plan.id}/plan`);
      } else {
        throw new Error(response.data.message || 'Failed to create plan');
      }
    } catch (error) {
      console.error('Error creating plan:', error);
      alert(error.response?.data?.message || 'Failed to create plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Create Your Travel Plan
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Let's plan your next adventure together
        </p>
      </div>

      <div className="space-y-4">
        {/* Destination Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Search for your destination city
          </label>
          <Input
            type="text"
            placeholder="Where would you like to go?"
            value={formData.nameoftheplace}
            onChange={(e) => handleInputChange('nameoftheplace', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              From Date
            </label>
            <Input
              type="date"
              value={formData.fromdate}
              onChange={(e) => handleInputChange('fromdate', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              To Date
            </label>
            <Input
              type="date"
              value={formData.todate}
              onChange={(e) => handleInputChange('todate', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Budget (Optional)
          </label>
          <Input
            type="number"
            placeholder="Enter your budget"
            value={formData.budget}
            onChange={(e) => handleInputChange('budget', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Travel Companion */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Users className="w-4 h-4 inline mr-2" />
            Who are you travelling with? (Optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {companions.map((companion) => (
              <Button
                key={companion.id}
                variant={formData.companion === companion.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleInputChange('companion', companion.id)}
                className="text-sm"
              >
                {companion.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Activity Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select the kind of activities you want to do (Optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {activities.map((activity) => {
              const Icon = activity.icon;
              const isSelected = selectedActivities.includes(activity.id);
              return (
                <Button
                  key={activity.id}
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => toggleActivity(activity.id)}
                  className="flex items-center gap-2 h-12"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{activity.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tell us about your trip (Optional)
          </label>
          <textarea
            placeholder="What kind of experience are you looking for?"
            value={formData.abouttheplace}
            onChange={(e) => handleInputChange('abouttheplace', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={() => handleCreatePlan(false)}
            disabled={loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Plan...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MessageSquarePlus className="w-4 h-4" />
                <span>Create Your Plan</span>
              </div>
            )}
          </Button>

          <Button
            onClick={() => handleCreatePlan(true)}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating AI Plan...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                <span>Generate AI Plan</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewPlanForm;
