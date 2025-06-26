"use client"
import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import {
  ArrowLeft,
  Edit,
  Share2,
  Trash2,
  Calendar,
  DollarSign,
  Eye,
  Clock,
  Home,
  MapPin,
  Star,
  Heart,
  ChefHat,
  Backpack,
  Cloud,
  Users,
  Building2,
  Navigation,
  CheckCircle,
  Plus,
  X,
} from "lucide-react"
import { Button } from "../components/ui/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx"
import { Badge } from "../components/ui/Badge.jsx"
import { plansAPI } from "../lib/api.js"

// Component for rendering About Section
const AboutSection = ({ plan, isPublic, editingSection, editingContent, setEditingContent, handleEditSection, handleSaveSection, handleCancelEdit, saveLoading }) => (
  <Card className="border border-slate-200/50 dark:border-gray-700/50 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
    <CardHeader className="border-b border-slate-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          About {plan.nameoftheplace}
        </CardTitle>
        {!isPublic && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditSection('abouttheplace')}
            className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        )}
      </div>
    </CardHeader>
    <CardContent className="p-6">
      {editingSection === 'abouttheplace' ? (
        <div className="space-y-4">
          <textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            className="w-full h-32 p-3 border border-slate-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter description about this place..."
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSaveSection}
              disabled={saveLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {saveLoading ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handleCancelEdit}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {plan.abouttheplace || "No description available for this destination."}
        </p>
      )}
    </CardContent>
  </Card>
);

// Component for rendering Itinerary Section with improved structure
const ItinerarySection = ({ plan }) => {
  // console.log("Itinerary:", plan.itinerary.length);
  const renderTimeSlot = (activities, slotName) => {
    if (!activities || activities.length === 0) {
      return (
        <div className="text-sm text-slate-500 dark:text-slate-400 italic p-2">
          No {slotName.toLowerCase()} activities planned
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {activities.map((activity, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300 p-3 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-lg border border-indigo-200/50 dark:border-indigo-800/30 backdrop-blur-sm"
          >
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex-shrink-0 mt-2"></div>
            <div>
              <p className="font-medium">{activity.itineraryItem}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{activity.briefDescription}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="border border-slate-200/50 dark:border-gray-700/50 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
      <CardHeader className="border-b border-slate-200/50 dark:border-gray-700/50 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/30 dark:to-blue-950/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            Daily Itinerary
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {plan.itinerary?.length > 0 ? (
          <div className="space-y-6">
            {plan.itinerary.map((day, index) => (
              <div key={index} className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-semibold shadow-md">
                      {index + 1}
                    </div>
                    {index < plan.itinerary.length - 1 && (
                      <div className="w-px h-12 bg-gradient-to-b from-indigo-300 to-blue-300 dark:from-indigo-600 dark:to-blue-600 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-4">{day.title}</h3>
                    <div className="space-y-4">
                      {['morning', 'afternoon', 'evening'].map((slot) => (
                        day.activities?.[slot] && (
                          <div
                            key={slot}
                            className="bg-gradient-to-r from-indigo-50/30 to-blue-50/30 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-lg p-3 border border-indigo-100/50 dark:border-indigo-800/30"
                          >
                            <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2 capitalize flex items-center gap-2">
                              <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full"></div>
                              {slot}
                            </h4>
                            {renderTimeSlot(day.activities[slot], slot)}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No itinerary available.</p>
        )}
      </CardContent>
    </Card>
  );
};


// Component for rendering Local Cuisine Section
const LocalCuisineSection = ({ plan, isPublic, editingSection, editingListContent, handleEditSection, handleSaveSection, handleCancelEdit, saveLoading, addListItem, updateListItem, removeListItem }) => (
  <Card className="border border-slate-200/50 dark:border-gray-700/50 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
    <CardHeader className="border-b border-slate-200/50 dark:border-gray-700/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/30">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <ChefHat className="w-4 h-4 text-white" />
          </div>
          Local Cuisine Recommendations
        </CardTitle>
        {!isPublic && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditSection('localcuisinerecommendations')}
            className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        )}
      </div>
    </CardHeader>
    <CardContent className="p-6">
      {editingSection === 'localcuisinerecommendations' ? (
        <div className="space-y-4">
          <div className="space-y-3">
            {editingListContent.map((cuisine, index) => (
              <div key={index} className="border border-slate-200 dark:border-gray-600 rounded-lg p-4 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={typeof cuisine === 'object' ? cuisine.dish || '' : cuisine}
                    onChange={(e) => {
                      const newCuisine = typeof cuisine === 'object' 
                        ? { ...cuisine, dish: e.target.value }
                        : { dish: e.target.value, description: '', price: '' };
                      updateListItem(index, newCuisine);
                    }}
                    className="flex-1 p-3 border border-slate-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Dish name..."
                  />
                  <input
                    type="text"
                    value={typeof cuisine === 'object' ? cuisine.price || '' : ''}
                    onChange={(e) => {
                      const newCuisine = typeof cuisine === 'object' 
                        ? { ...cuisine, price: e.target.value }
                        : { dish: cuisine, description: '', price: e.target.value };
                      updateListItem(index, newCuisine);
                    }}
                    className="w-24 p-3 border border-slate-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Price..."
                  />
                  <Button
                    onClick={() => removeListItem(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <textarea
                  value={typeof cuisine === 'object' ? cuisine.description || '' : ''}
                  onChange={(e) => {
                    const newCuisine = typeof cuisine === 'object' 
                      ? { ...cuisine, description: e.target.value }
                      : { dish: cuisine, description: e.target.value, price: '' };
                    updateListItem(index, newCuisine);
                  }}
                  className="w-full p-3 border border-slate-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  rows="2"
                  placeholder="Description..."
                />
              </div>
            ))}
          </div>
          <Button
            onClick={() => addListItem({ dish: '', description: '', price: '' })}
            variant="outline"
            className="w-full border-dashed border-amber-300 text-amber-600 hover:bg-amber-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Cuisine
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={handleSaveSection}
              disabled={saveLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {saveLoading ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handleCancelEdit}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : plan.localcuisinerecommendations?.length > 0 ? (
        <div className="space-y-4">
          {Array.isArray(plan.localcuisinerecommendations) ? plan.localcuisinerecommendations.map((cuisine, index) => (
            <div
              key={index}
              className="p-4 border border-slate-200/50 dark:border-gray-700/50 rounded-xl bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-800/50 dark:to-amber-950/20 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                  <ChefHat className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {typeof cuisine === 'object' ? cuisine.dish : cuisine}
                    </h3>
                    {typeof cuisine === 'object' && cuisine.price && (
                      <span className="text-sm font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full border border-amber-200/50 dark:border-amber-800/30">
                        {cuisine.price}
                      </span>
                    )}
                  </div>
                  {typeof cuisine === 'object' && cuisine.description && (
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                      {cuisine.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center text-slate-500 py-4">
              No cuisine recommendations available
            </div>
          )}
        </div>
      ) : (
        <p className="text-slate-500 text-center py-8">No cuisine recommendations available.</p>
      )}
    </CardContent>
  </Card>
);

const PlanDetailPage = ({ isPublic = false }) => {
  const { planId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  const [editingContent, setEditingContent] = useState("")
  const [saveLoading, setSaveLoading] = useState(false)
  const [editingListContent, setEditingListContent] = useState([])
  const [editingItineraryContent, setEditingItineraryContent] = useState([])

  const handleDeletePlan = async () => {
    if (!window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(true);
      await plansAPI.deletePlan(plan.id || plan._id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditSection = (sectionName) => {
    // Set the section to edit mode and populate content
    setEditingSection(sectionName);
    
    if (sectionName === 'topplacestovisit' || sectionName === 'adventuresactivitiestodo' || sectionName === 'packingchecklist') {
      // For array content, set the array content
      const currentContent = plan[sectionName] || [];
      setEditingListContent(Array.isArray(currentContent) ? currentContent : []);
    } else if (sectionName === 'localcuisinerecommendations') {
      // For cuisine content, ensure proper object structure
      const currentContent = plan[sectionName] || [];
      const formattedContent = Array.isArray(currentContent) 
        ? currentContent.map(item => {
            if (typeof item === 'string') {
              return { dish: item, description: '', price: '' };
            }
            return { dish: item.dish || '', description: item.description || '', price: item.price || '' };
          })
        : [];
      setEditingListContent(formattedContent);
    } else if (sectionName === 'itinerary') {
      // For itinerary, ensure proper structure with time slots
      const currentContent = plan[sectionName] || [];
      const formattedContent = Array.isArray(currentContent) 
        ? currentContent.map(day => ({
            day: day.day || 1,
            title: day.title || '',
            morning: Array.isArray(day.morning) ? day.morning : (day.activities ? day.activities.slice(0, Math.ceil(day.activities.length / 3)) : []),
            afternoon: Array.isArray(day.afternoon) ? day.afternoon : (day.activities ? day.activities.slice(Math.ceil(day.activities.length / 3), Math.ceil(2 * day.activities.length / 3)) : []),
            evening: Array.isArray(day.evening) ? day.evening : (day.activities ? day.activities.slice(Math.ceil(2 * day.activities.length / 3)) : [])
          }))
        : [];
      setEditingItineraryContent(formattedContent);
    } else {
      // For text content
      const currentContent = plan[sectionName] || "";
      setEditingContent(currentContent);
    }
  };

  const handleSaveSection = async () => {
    try {
      setSaveLoading(true);
      
      // Determine what content to save based on section type
      let updateData = {};
      if (editingSection === 'topplacestovisit' || editingSection === 'adventuresactivitiestodo' || editingSection === 'packingchecklist') {
        updateData[editingSection] = editingListContent;
      } else if (editingSection === 'itinerary') {
        updateData[editingSection] = editingItineraryContent;
      } else {
        updateData[editingSection] = editingContent;
      }
      
      console.log('Updating plan with data:', updateData);
      const response = await plansAPI.updatePlan(plan.id || plan._id, updateData);
      console.log('Update response:', response);
      
      // Update local state
      setPlan({
        ...plan,
        ...updateData
      });
      
      // Exit edit mode
      setEditingSection(null);
      setEditingContent("");
      setEditingListContent([]);
      setEditingItineraryContent([]);
      
      console.log('Section updated successfully');
      
    } catch (error) {
      console.error('Error updating section:', error);
      alert('Failed to update section. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditingContent("");
    setEditingListContent([]);
    setEditingItineraryContent([]);
  };

  const addListItem = (defaultValue = "") => {
    if (editingSection === 'localcuisinerecommendations') {
      setEditingListContent([...editingListContent, { dish: '', description: '', price: '' }]);
    } else {
      setEditingListContent([...editingListContent, defaultValue]);
    }
  };

  const updateListItem = (index, value) => {
    const newList = [...editingListContent];
    newList[index] = value;
    setEditingListContent(newList);
  };

  const removeListItem = (index) => {
    const newList = editingListContent.filter((_, i) => i !== index);
    setEditingListContent(newList);
  };
  
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true)

        // Check if plan data was passed through router state first
        if (location.state && location.state.plan) {
          console.log("Using plan data from router state:", location.state.plan)
          setPlan(location.state.plan)
          setLoading(false)
          return
        }

        // Otherwise, fetch from API
        let response

        if (isPublic) {
          // Fetch from community API for public plans
          response = await plansAPI.getPlan(planId)
          console.log("Fetched public plan:", response.data)
          setPlan(response.data.data.plan)
        } else {
          // Fetch from plans API for user plans
          response = await plansAPI.getPlan(planId)
          console.log("Fetched private plan:", response.data.data.plan)
          setPlan(response.data.data.plan)
        }
      } catch (error) {
        console.error("Error fetching plan:", error)
        // If plan not found, redirect to dashboard
        navigate("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    if (planId) {
      fetchPlan()
    }
  }, [planId, navigate, isPublic, location.state])

  const getImageUrl = (imageUrl) => {
    if (imageUrl) return imageUrl
    return "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop&q=80"
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* About Section */}
            <AboutSection 
              plan={plan}
              isPublic={isPublic}
              editingSection={editingSection}
              editingContent={editingContent}
              setEditingContent={setEditingContent}
              handleEditSection={handleEditSection}
              handleSaveSection={handleSaveSection}
              handleCancelEdit={handleCancelEdit}
              saveLoading={saveLoading}
            />

            {/* Trip Statistics */}
            <Card className="border border-slate-200/50 dark:border-gray-700/50 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
              <CardHeader className="border-b border-slate-200/50 dark:border-gray-700/50 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/30">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Trip Statistics</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200/50 dark:border-blue-800/30 rounded-xl backdrop-blur-sm">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                      {plan.itinerary?.length || "N/A"} days
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Duration</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border border-emerald-200/50 dark:border-emerald-800/30 rounded-xl backdrop-blur-sm">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                      {plan.topplacestovisit?.length || 0}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Destinations</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border border-purple-200/50 dark:border-purple-800/30 rounded-xl backdrop-blur-sm">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                      {plan.adventuresactivitiestodo?.length || 0}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Activities</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50 border border-indigo-200/50 dark:border-indigo-800/30 rounded-xl backdrop-blur-sm">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{plan.views || 0}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Views</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plan Author */}
            {plan.userId && (
              <Card className="border border-slate-200/50 dark:border-gray-700/50 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
                <CardHeader className="border-b border-slate-200/50 dark:border-gray-700/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-950/30 dark:to-blue-950/30">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    Plan Author
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-md">
                      {plan.userId.firstName?.[0]}
                      {plan.userId.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {plan.userId.firstName} {plan.userId.lastName}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Created on{" "}
                        {new Date(plan.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case "besttimetovisit":
        return (
          <div className="space-y-6">
            <Card className="border border-slate-200/50 dark:border-gray-700/50 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
              <CardHeader className="border-b border-slate-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    Best Time to Visit {plan.nameoftheplace}
                  </CardTitle>
                  {!isPublic && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSection('besttimetovisit')}
                      className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {editingSection === 'besttimetovisit' ? (
                  <div className="space-y-4">
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full h-32 p-3 border border-slate-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Enter information about the best time to visit..."
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveSection}
                        disabled={saveLoading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {saveLoading ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : plan.besttimetovisit ? (
                  <div className="space-y-4">
                    {typeof plan.besttimetovisit === 'string' ? (
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {plan.besttimetovisit}
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {plan.besttimetovisit.overview && (
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {plan.besttimetovisit.overview}
                          </p>
                        )}
                        {plan.besttimetovisit.seasons && plan.besttimetovisit.seasons.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">
                              Seasonal Information:
                            </h4>
                            <div className="grid gap-3">
                              {plan.besttimetovisit.seasons.map((season, index) => (
                                <div key={index} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                                  <h5 className="font-medium text-slate-700 dark:text-slate-300">
                                    {season.season} ({season.months})
                                  </h5>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    {season.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No information about the best time to visit.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case "topplacestovisit":
        return (
          <div className="space-y-6">
            <Card className="border border-slate-200/50 dark:border-gray-700/50 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
              <CardHeader className="border-b border-slate-200/50 dark:border-gray-700/50 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    Key Destinations in {plan.nameoftheplace}
                  </CardTitle>
                  {!isPublic && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSection('topplacestovisit')}
                      className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {editingSection === 'topplacestovisit' ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {editingListContent.map((place, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={typeof place === 'string' ? place : place.name || ''}
                            onChange={(e) => updateListItem(index, typeof place === 'string' ? e.target.value : { ...place, name: e.target.value })}
                            className="flex-1 p-3 border border-slate-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Enter place name..."
                          />
                          <Button
                            onClick={() => removeListItem(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={addListItem}
                      variant="outline"
                      className="w-full border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Place
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveSection}
                        disabled={saveLoading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {saveLoading ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : plan.topplacestovisit?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.isArray(plan.topplacestovisit) ? plan.topplacestovisit.map((place, index) => (
                      <div
                        key={index}
                        className="group p-4 border border-slate-200/50 dark:border-gray-700/50 rounded-xl bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-800/50 dark:to-emerald-950/20 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                                <MapPin className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                  {place.name}
                                </h3>
                                {place.coordinates && (
                                  <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full w-fit border border-emerald-200/50 dark:border-emerald-800/30">
                                    <Navigation className="w-3 h-3" />
                                    <span>Lat: {place.coordinates.lat}, Lng: {place.coordinates.lng}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {place.coordinates && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300"
                                onClick={() => {
                                  const url = `https://www.google.com/maps?q=${place.coordinates.lat},${place.coordinates.lng}&z=15`;
                                  window.open(url, '_blank');
                                }}
                              >
                                <MapPin className="w-4 h-4 mr-2" />
                                View on Google Maps
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center text-slate-500 py-4">
                        No places to visit available
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No destinations listed.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case "adventuresactivitiestodo":
        return (
          <div className="space-y-6">
            <Card className="border border-slate-200/50 dark:border-gray-700/50 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
              <CardHeader className="border-b border-slate-200/50 dark:border-gray-700/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    Activities & Experiences
                  </CardTitle>
                  {!isPublic && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSection('adventuresactivitiestodo')}
                      className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {editingSection === 'adventuresactivitiestodo' ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {editingListContent.map((activity, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={activity}
                            onChange={(e) => updateListItem(index, e.target.value)}
                            className="flex-1 p-3 border border-slate-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter activity..."
                          />
                          <Button
                            onClick={() => removeListItem(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={addListItem}
                      variant="outline"
                      className="w-full border-dashed border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Activity
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveSection}
                        disabled={saveLoading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {saveLoading ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : plan.adventuresactivitiestodo?.length > 0 ? (                  <div className="space-y-3">
                    {Array.isArray(plan.adventuresactivitiestodo) ? plan.adventuresactivitiestodo.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 border border-slate-200/50 dark:border-gray-700/50 rounded-xl bg-gradient-to-r from-white to-purple-50/30 dark:from-gray-800/50 dark:to-purple-950/20 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>                        <span className="text-slate-700 dark:text-slate-300">{activity}</span>
                      </div>
                    )) : (
                      <div className="text-center text-slate-500 py-4">
                        No adventures/activities available
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No activities listed.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case "itinerary":
        return (
          <div className="space-y-6">
            <ItinerarySection
              plan={plan}
              isPublic={isPublic}
            />
          </div>
        );


      case "localcuisinerecommendations":
        return (
          <div className="space-y-6">
            <LocalCuisineSection 
              plan={plan}
              isPublic={isPublic}
              editingSection={editingSection}
              editingListContent={editingListContent}
              handleEditSection={handleEditSection}
              handleSaveSection={handleSaveSection}
              handleCancelEdit={handleCancelEdit}
              saveLoading={saveLoading}
              addListItem={addListItem}
              updateListItem={updateListItem}
              removeListItem={removeListItem}
            />
          </div>
        )

      case "packingchecklist":
        return (
          <div className="space-y-6">
            <Card className="border border-slate-200/50 dark:border-gray-700/50 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
              <CardHeader className="border-b border-slate-200/50 dark:border-gray-700/50 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 dark:from-teal-950/30 dark:to-cyan-950/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <Backpack className="w-4 h-4 text-white" />
                    </div>
                    Packing Checklist
                  </CardTitle>
                  {!isPublic && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSection('packingchecklist')}
                      className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {editingSection === 'packingchecklist' ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {editingListContent.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateListItem(index, e.target.value)}
                            className="flex-1 p-3 border border-slate-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Enter packing item..."
                          />
                          <Button
                            onClick={() => removeListItem(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={addListItem}
                      variant="outline"
                      className="w-full border-dashed border-teal-300 text-teal-600 hover:bg-teal-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveSection}
                        disabled={saveLoading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {saveLoading ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : plan.packingchecklist?.length > 0 ? (
                  <div className="space-y-2">
                    {Array.isArray(plan.packingchecklist) ? plan.packingchecklist.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-cyan-50/50 dark:hover:from-teal-950/30 dark:hover:to-cyan-950/30 rounded-lg transition-all duration-300 border border-transparent hover:border-teal-200/50 dark:hover:border-teal-800/30"
                      >
                        <input
                          type="checkbox"
                          id={`item-${index}`}
                          className="w-4 h-4 text-teal-600 bg-white dark:bg-gray-700 border-slate-300 dark:border-gray-600 rounded focus:ring-teal-500 focus:ring-2"
                        />
                        <label
                          htmlFor={`item-${index}`}
                          className="flex-1 text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          {item}                        </label>
                      </div>
                    )) : (
                      <div className="text-center text-slate-500 py-4">
                        No packing checklist available
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No packing checklist available.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case "weather":
        return (
          <div className="space-y-6">
            <Card className="border border-slate-200/50 dark:border-gray-700/50 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
              <CardHeader className="border-b border-slate-200/50 dark:border-gray-700/50 bg-gradient-to-r from-sky-50/50 to-blue-50/50 dark:from-sky-950/30 dark:to-blue-950/30">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Cloud className="w-4 h-4 text-white" />
                  </div>
                  Weather Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {plan.weatherData ? (
                  <div className="space-y-6">
                    {/* Current Weather */}
                    {plan.weatherData.current && (
                      <div className="bg-gradient-to-r from-sky-50/50 to-blue-50/50 dark:from-sky-950/30 dark:to-blue-950/30 rounded-xl p-4 border border-sky-200/50 dark:border-sky-800/30">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Current Weather</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                              {plan.weatherData.current.temperature}°C
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Temperature</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                              {plan.weatherData.current.feels_like}°C
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Feels like</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                              {plan.weatherData.current.humidity}%
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Humidity</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                              {plan.weatherData.current.wind_speed} m/s
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Wind Speed</div>
                          </div>
                        </div>
                        <div className="mt-3 text-center">
                          <div className="text-slate-700 dark:text-slate-300 capitalize">
                            {plan.weatherData.current.description}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Weather Forecast */}
                    {plan.weatherData.forecast && plan.weatherData.forecast.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">5-Day Forecast</h3>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                          {plan.weatherData.forecast.map((day, index) => (
                            <div key={index} className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-slate-200/50 dark:border-gray-700/50 text-center">
                              <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                              </div>
                              <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                {day.temperature.max}° / {day.temperature.min}°
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400 capitalize mt-1">
                                {day.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Seasonal Information */}
                    {plan.weatherData.seasonal && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Seasonal Weather</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(plan.weatherData.seasonal).map(([season, info]) => (
                            <div key={season} className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 border border-slate-200/50 dark:border-gray-700/50">
                              <div className="font-semibold text-slate-800 dark:text-slate-200 capitalize mb-2">
                                {season}
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                {info.temperature_range}
                              </div>
                              <div className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                                {info.description}
                              </div>
                              {info.activities && info.activities.length > 0 && (
                                <div className="text-xs text-slate-600 dark:text-slate-400">
                                  <strong>Activities:</strong> {info.activities.join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 p-4 bg-gradient-to-r from-sky-50/50 to-blue-50/50 dark:from-sky-950/30 dark:to-blue-950/30 rounded-xl border border-sky-200/50 dark:border-sky-800/30 backdrop-blur-sm">
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Cloud className="w-4 h-4 text-white" />
                    </div>
                    <p>
                      Weather information is not available for this plan. Weather data is automatically generated for AI-created plans.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="space-y-6">
            <Card className="border border-slate-200/50 dark:border-gray-700/50 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
              <CardContent className="text-center py-12">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-500">Select a section from the sidebar to view details.</p>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading plan details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4 max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl flex items-center justify-center mx-auto">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Plan Not Found</h1>
            <p className="text-slate-600 dark:text-slate-400">The plan you're looking for doesn't exist.</p>
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plans
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Navigation items for sidebar
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home, color: "from-blue-500 to-purple-600" },
    { id: "besttimetovisit", label: "Best Time to Visit", icon: Calendar, color: "from-blue-500 to-indigo-600" },
    { id: "topplacestovisit", label: "Key Destinations", icon: MapPin, color: "from-emerald-500 to-teal-600" },
    { id: "adventuresactivitiestodo", label: "Activities", icon: Star, color: "from-purple-500 to-pink-600" },
    { id: "itinerary", label: "Itinerary", icon: Clock, color: "from-indigo-500 to-blue-600" },
    { id: "localcuisinerecommendations", label: "Local Cuisine", icon: ChefHat, color: "from-amber-500 to-orange-600" },
    { id: "packingchecklist", label: "Packing List", icon: Backpack, color: "from-teal-500 to-cyan-600" },
    { id: "weather", label: "Weather", icon: Cloud, color: "from-sky-500 to-blue-600" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {/* Professional Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={getImageUrl(plan.imageurl) || "/placeholder.svg"}
          alt={plan.nameoftheplace}
          className="w-full h-full object-cover"
          onError={(e) =>
            (e.target.src = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop&q=80")
          }
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />

        {/* Header Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="bg-white/90 hover:bg-white text-slate-900 border-0 shadow-lg backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white text-slate-900 border-0 shadow-lg backdrop-blur-md"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            {!isPublic && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 hover:bg-white text-slate-900 border-0 shadow-lg backdrop-blur-md"
                  onClick={() => navigate(`/plans/${plan.id || plan._id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {!plan.isGeneratedUsingAI && (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={deleteLoading}
                    className="bg-red-50/90 hover:bg-red-100 text-red-700 border-0 shadow-lg backdrop-blur-md"
                    onClick={handleDeletePlan}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Plan Title and Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-3 py-1 text-xs font-medium shadow-md">
                {plan.isGeneratedUsingAI ? "AI Plan" : (plan.status || "Community Plan")}
              </Badge>
              {plan.rating && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 px-3 py-1 text-xs font-medium shadow-md">
                  ★ {plan.rating}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg">{plan.nameoftheplace}</h1>

            <div className="flex flex-wrap gap-6 text-white text-sm">
              {plan.duration && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span>{plan.duration}</span>
                </div>
              )}
              {plan.budget && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                  <DollarSign className="w-4 h-4" />
                  <span>${plan.budget.toLocaleString()}</span>
                </div>
              )}
              {plan.views && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                  <Eye className="w-4 h-4" />
                  <span>{plan.views} views</span>
                </div>
              )}
              {plan.likes && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                  <Heart className="w-4 h-4" />
                  <span>{plan.likes} likes</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Professional Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-8">
              <Card className="border border-slate-200/50 dark:border-gray-700/50 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
                <CardHeader className="border-b border-slate-200/50 dark:border-gray-700/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-950/30 dark:to-blue-950/30 py-4">
                  <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
                    Plan Sections
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav>
                    {sidebarItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-all duration-300 border-r-2 group ${
                            activeTab === item.id
                              ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 text-slate-900 dark:text-white border-blue-500 dark:border-blue-400"
                              : "text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 dark:hover:from-slate-950/30 dark:hover:to-blue-950/30 border-transparent"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                              activeTab === item.id
                                ? `bg-gradient-to-br ${item.color} shadow-md`
                                : "bg-slate-100 dark:bg-gray-700 group-hover:bg-slate-200 dark:group-hover:bg-gray-600"
                            }`}
                          >
                            <Icon
                              className={`w-3 h-3 ${
                                activeTab === item.id ? "text-white" : "text-slate-600 dark:text-slate-400"
                              }`}
                            />
                          </div>
                          <span>{item.label}</span>
                        </button>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}

export default PlanDetailPage
