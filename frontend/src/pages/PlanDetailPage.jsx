import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Share2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Eye,
  Clock,
  Star,
  Plus,
  Navigation,
  Sunrise,
  Sun,
  Sunset,
  ChevronRight,
  Wand2,
  Home,
  Mountain
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import api from '../lib/api.js';

const PlanDetailPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/plans/${planId}`);
        setPlan(response.data.plan);
      } catch (error) {
        console.error('Error fetching plan:', error);
        // If plan not found, redirect to plans page
        navigate('/plans');
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlan();
    }
  }, [planId, navigate]);

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

  const mockItinerary = [
    {
      day: 1,
      title: 'Arrival Day',
      activities: {
        morning: [
          { name: 'Airport pickup', description: 'Arrive at destination airport' },
          { name: 'Hotel check-in', description: 'Check into hotel and freshen up' }
        ],
        afternoon: [
          { name: 'City orientation', description: 'Walking tour of the main area' },
          { name: 'Local lunch', description: 'Try authentic local cuisine' }
        ],
        evening: [
          { name: 'Welcome dinner', description: 'Dinner at a recommended restaurant' },
          { name: 'Early rest', description: 'Rest to recover from travel' }
        ]
      }
    },
    {
      day: 2,
      title: 'Exploration Day',
      activities: {
        morning: [
          { name: 'Main attractions', description: 'Visit top-rated tourist spots' },
          { name: 'Guided tour', description: 'Professional guided tour' }
        ],
        afternoon: [
          { name: 'Museum visit', description: 'Explore local history and culture' },
          { name: 'Shopping', description: 'Browse local markets and shops' }
        ],
        evening: [
          { name: 'Sunset viewing', description: 'Watch sunset from best viewpoint' },
          { name: 'Cultural show', description: 'Attend local cultural performance' }
        ]
      }
    }
  ];

  const mockActivities = [
    'City walking tour',
    'Local food tasting',
    'Museum visits',
    'Photography sessions',
    'Shopping at local markets',
    'Cultural experiences',
    'Adventure activities',
    'Relaxation time'
  ];

  const mockPlaces = [
    { name: 'Historic Old Town', coordinates: [0, 0] },
    { name: 'Central Museum', coordinates: [0, 0] },
    { name: 'Local Market Square', coordinates: [0, 0] },
    { name: 'Scenic Viewpoint', coordinates: [0, 0] },
    { name: 'Cultural Center', coordinates: [0, 0] }
  ];

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
            <Button onClick={() => navigate('/plans')}>
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
          <Button variant="secondary" onClick={() => navigate('/plans')}>
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
              { id: 'itinerary', label: 'Itinerary', icon: Navigation },
              { id: 'activities', label: 'Activities', icon: Mountain },
              { id: 'places', label: 'Places', icon: MapPin },
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
                      <div className="text-2xl font-bold text-green-600">{mockPlaces.length}</div>
                      <div className="text-sm text-gray-600">Places</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{mockActivities.length}</div>
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
                  <Button className="w-full" variant="outline">
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate with AI
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

        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Day-by-Day Itinerary</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Day
              </Button>
            </div>

            {mockItinerary.map((day) => (
              <Card key={day.day}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Day {day.day}: {day.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Morning */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 font-medium text-blue-600">
                        <Sunrise className="w-4 h-4" />
                        Morning
                      </div>
                      <div className="grid gap-3 ml-6">
                        {day.activities.morning.map((activity, idx) => (
                          <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                            <h4 className="font-medium">{activity.name}</h4>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Afternoon */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 font-medium text-yellow-600">
                        <Sun className="w-4 h-4" />
                        Afternoon
                      </div>
                      <div className="grid gap-3 ml-6">
                        {day.activities.afternoon.map((activity, idx) => (
                          <div key={idx} className="p-3 bg-yellow-50 rounded-lg">
                            <h4 className="font-medium">{activity.name}</h4>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Evening */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 font-medium text-purple-600">
                        <Sunset className="w-4 h-4" />
                        Evening
                      </div>
                      <div className="grid gap-3 ml-6">
                        {day.activities.evening.map((activity, idx) => (
                          <div key={idx} className="p-3 bg-purple-50 rounded-lg">
                            <h4 className="font-medium">{activity.name}</h4>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Activities & Experiences</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockActivities.map((activity, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{activity}</h3>
                        <p className="text-sm text-gray-600">Recommended activity</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'places' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Places to Visit</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Place
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockPlaces.map((place, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{place.name}</h3>
                          <p className="text-sm text-gray-600">Must-visit location</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Expense Tracking</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${plan.budget ? plan.budget.toLocaleString() : '0'}
                  </div>
                  <div className="text-sm text-gray-600">Total Budget</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600">$0</div>
                  <div className="text-sm text-gray-600">Spent</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    ${plan.budget ? plan.budget.toLocaleString() : '0'}
                  </div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No expenses recorded yet</p>
                  <p className="text-sm">Start tracking your travel expenses</p>
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
