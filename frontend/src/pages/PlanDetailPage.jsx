import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Share2, 
  Calendar, 
  DollarSign, 
  Eye,
  Clock,
  Plus,
  Wand2,
  Home
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import api from '../lib/api.js';
import { 
  planSections, 
  ACTIVITY_PREFERENCES,
  COMPANION_PREFERENCES 
} from '../lib/constants.js';

// Import section components
import {
  AboutThePlace,
  BestTimeToVisit,
  TopActivities,
  LocalCuisineRecommendations,
  PackingChecklist,
  Weather
} from '../components/sections/index.js';
import EnhancedItinerary from '../components/sections/EnhancedItinerary.jsx';
import EnhancedTopPlacesToVisit from '../components/sections/EnhancedTopPlacesToVisit.jsx';

const PlanDetailPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/plans/${planId}`);
        setPlan(response.data.plan);
      } catch (error) {
        console.error('Error fetching plan:', error);
        // If plan not found, redirect to dashboard 
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlan();
    }
  }, [planId, navigate]);

  const generateWithAI = async () => {
    if (!plan) return;
    
    setIsGeneratingAI(true);
    try {
      // Generate place info (batch 1)
      const placeInfoResponse = await api.post('/api/ai/generate-place-info', {
        promptText: `Generate information about ${plan.nameoftheplace}`
      });

      // Generate recommendations (batch 2)  
      const recommendationsResponse = await api.post('/api/ai/generate-recommendations', {
        userPrompt: `Generate recommendations for ${plan.nameoftheplace}`,
        fromDate: plan.fromdate,
        toDate: plan.todate,
        activityPreferences: [],
        companion: []
      });

      // Generate itinerary (batch 3)
      const itineraryResponse = await api.post('/api/ai/generate-itinerary', {
        userPrompt: `Generate itinerary for ${plan.nameoftheplace}`,
        fromDate: plan.fromdate,
        toDate: plan.todate,
        activityPreferences: [],
        companion: []
      });      // Update plan with AI data
      const updatedPlan = {
        ...plan,
        abouttheplace: placeInfoResponse.data.data.abouttheplace || plan.abouttheplace,
        best_time_to_visit: placeInfoResponse.data.data.besttimetovisit,
        top_adventure_activities: recommendationsResponse.data.data.adventuresactivitiestodo,
        local_cuisine_recommendations: recommendationsResponse.data.data.localcuisinerecommendations,
        packing_checklist: recommendationsResponse.data.data.packingchecklist,
        top_places_to_visit: itineraryResponse.data.data.topplacestovisit,
        itinerary: itineraryResponse.data.data.itinerary
      };      setPlan(updatedPlan);
      
      // Update plan in database
      try {
        await api.put(`/api/plans/${planId}`, {
          best_time_to_visit: updatedPlan.best_time_to_visit,
          top_adventure_activities: updatedPlan.top_adventure_activities,
          local_cuisine_recommendations: updatedPlan.local_cuisine_recommendations,
          packing_checklist: updatedPlan.packing_checklist,
          top_places_to_visit: updatedPlan.top_places_to_visit
        });
        console.log('Plan updated successfully in database');
      } catch (updateError) {
        console.error('Error updating plan in database:', updateError);
      }
      
    } catch (error) {
      console.error('Error generating AI content:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const formatDateRange = (fromDate, toDate) => {
    if (!fromDate || !toDate) return 'Dates not set';
    const from = new Date(fromDate).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
    const to = new Date(toDate).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
    return `${from} - ${to}`;
  };

  const calculateDays = (fromDate, toDate) => {
    if (!fromDate || !toDate) return 0;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getImageUrl = (imageUrl) => {
    return imageUrl || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop&q=80';
  };

  const getStatusColor = (status) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-800 border-blue-200',
      active: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || colors.planning;
  };

  const renderSectionContent = (sectionId) => {
    if (!plan) return null;

    switch (sectionId) {
      case 'abouttheplace':
        return <AboutThePlace content={plan.abouttheplace} planId={planId} allowEdit={true} />;
      
      case 'besttimetovisit':
        return <BestTimeToVisit content={plan.best_time_to_visit} planId={planId} allowEdit={true} />;
      
      case 'adventuresactivitiestodo':
        return <TopActivities activities={plan.top_adventure_activities || []} planId={planId} allowEdit={true} />;
        case 'topplacestovisit':
        return <EnhancedTopPlacesToVisit places={plan.top_places_to_visit || []} planId={planId} allowEdit={true} />;
        case 'itinerary':
        return <EnhancedItinerary itinerary={plan.itinerary || []} planId={planId} allowEdit={true} />;
      
      case 'localcuisinerecommendations':
        return <LocalCuisineRecommendations recommendations={plan.local_cuisine_recommendations || []} planId={planId} allowEdit={true} />;
      
      case 'packingchecklist':
        return <PackingChecklist checklist={plan.packing_checklist || []} planId={planId} allowEdit={true} />;
      
      case 'weather':
        return <Weather weatherInfo={plan.weather_info} planId={planId} allowEdit={true} />;
      
      case 'imagination':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Your Trip Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Share your dreams and expectations for this trip. What makes this journey special to you?
                </p>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {plan.abouttheplace || 'Add your personal thoughts and dreams about this trip...'}
                  </p>
                </div>
                {/* Activity Preferences */}
                <div className="space-y-3">
                  <h4 className="font-medium">Activity Preferences</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {ACTIVITY_PREFERENCES.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <div key={activity.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <Icon className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{activity.displayName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Companion Preferences */}
                <div className="space-y-3">
                  <h4 className="font-medium">Travel Companions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {COMPANION_PREFERENCES.map((companion) => {
                      const Icon = companion.icon;
                      return (
                        <div key={companion.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <Icon className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{companion.displayName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return (
          <Card>
            <CardContent className="text-center py-8 text-gray-500">
              <p>No content available for this section yet.</p>
              <p className="text-sm mt-2">Try generating content with AI!</p>
            </CardContent>
          </Card>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading plan details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Plan Not Found</h1>
            <p className="text-gray-600">The plan you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plans
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const days = calculateDays(plan.fromdate, plan.todate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={getImageUrl(plan.imageurl)}
          alt={plan.nameoftheplace}
          className="w-full h-full object-cover"
          onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop&q=80'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Header Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="secondary" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Plan Title and Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={`${getStatusColor(plan.status)} border`}>
                {plan.status || 'Planning'}
              </Badge>
              {plan.is_published && (
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  <Share2 className="w-3 h-3 mr-1" />
                  Published
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {plan.nameoftheplace}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDateRange(plan.fromdate, plan.todate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{days} {days === 1 ? 'day' : 'days'}</span>
              </div>
              {plan.budget && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  <span>${plan.budget.toLocaleString()}</span>
                </div>
              )}
              {plan.views && (
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span>{plan.views} views</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Home },
              ...planSections.map(section => ({
                id: section.id,
                label: section.name,
                icon: () => section.icon
              })),
              { id: 'expenses', label: 'Expenses', icon: DollarSign }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About this trip</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {plan.abouttheplace || 'No description available for this trip.'}
                  </p>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Trip Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{days}</div>
                      <div className="text-sm text-gray-600">Days</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{plan.top_places_to_visit?.length || 0}</div>
                      <div className="text-sm text-gray-600">Places</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{plan.top_adventure_activities?.length || 0}</div>
                      <div className="text-sm text-gray-600">Activities</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{plan.views || 0}</div>
                      <div className="text-sm text-gray-600">Views</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Plan
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Plan
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline" 
                    onClick={generateWithAI}
                    disabled={isGeneratingAI}
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    {isGeneratingAI ? 'Generating...' : 'Generate with AI'}
                  </Button>
                </CardContent>
              </Card>

              {/* Travel Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Travel Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status || 'Planning'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{days} days</span>
                  </div>
                  {plan.budget && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget</span>
                      <span className="font-medium">${plan.budget.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created</span>
                    <span className="font-medium">
                      {new Date(plan.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Dynamic Plan Sections */}
        {planSections.map((section) => (
          activeTab === section.id && (
            <div key={section.id} className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {section.icon}
                  {section.name}
                </h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Content
                </Button>
              </div>
              
              {/* Render section content using proper components */}
              {renderSectionContent(section.id)}
            </div>
          )
        ))}

        {/* Expenses Section */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                Expenses
              </h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Expense Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No expenses recorded yet.</p>
                  <p className="text-sm">Add your first expense to get started!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanDetailPage;
