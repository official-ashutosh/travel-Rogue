import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Star, 
  Eye, 
  DollarSign, 
  Users, 
  Edit, 
  Trash2, 
  Share2, 
  Sparkles,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { plansAPI } from '../../lib/api.js';

const UnifiedPlanCard = ({ 
  plan, 
  isPublic = false, 
  viewMode = 'grid', 
  showActions = false,
  showEditDelete = false,
  onEdit,
  onDelete,
  onShare
}) => {
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const formatDateRange = (fromDate, toDate) => {
    if (!fromDate || !toDate) return null;
    const from = new Date(fromDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const to = new Date(toDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${from} - ${to}`;
  };

  const getImageUrl = (imageUrl, width = 300, height = 200) => {
    if (imageUrl) return imageUrl;
    return `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=${width}&h=${height}&fit=crop&q=80`;
  };

  const handleImageError = (e) => {
    e.target.src = `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop&q=80`;
  };

  const calculateDuration = (fromDate, toDate) => {
    if (!fromDate || !toDate) return null;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDuration = () => {
    const fromDate = plan.fromdate || plan.fromDate || plan.startdate;
    const toDate = plan.todate || plan.toDate || plan.enddate;
    
    if (fromDate && toDate) {
      return calculateDuration(fromDate, toDate);
    }
    
    if (plan.itinerary && Array.isArray(plan.itinerary)) {
      return plan.itinerary.length;
    }
    
    return null;
  };

  const duration = getDuration();

  const getBudget = () => {
    const budget = plan.budget || plan.estimatedBudget || plan.totalBudget;
    return budget && typeof budget === 'number' ? budget : null;
  };

  const getTravelers = () => {
    return plan.travelers || plan.groupSize || plan.numberOfTravelers || null;
  };

  const getViews = () => {
    return plan.views || 0;
  };

  const getRating = () => {
    return plan.rating || null;
  };

  const getTags = () => {
    if (plan.tags && Array.isArray(plan.tags) && plan.tags.length > 0) {
      return plan.tags;
    }
    
    if (plan.isGeneratedUsingAI) {
      const defaultTags = [];
      if (plan.adventuresactivitiestodo && plan.adventuresactivitiestodo.length > 0) {
        defaultTags.push('Adventure');
      }
      if (plan.localcuisinerecommendations && plan.localcuisinerecommendations.length > 0) {
        defaultTags.push('Food & Dining');
      }
      if (plan.topplacestovisit && plan.topplacestovisit.length > 0) {
        defaultTags.push('Sightseeing');
      }
      if (plan.itinerary && plan.itinerary.length > 0) {
        defaultTags.push('Planned Itinerary');
      }
      if (defaultTags.length === 0) {
        defaultTags.push('Travel Guide');
      }
      return defaultTags;
    }
    
    return [];
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(plan);
    } else {
      navigate(`/plans/${plan.id || plan._id}/edit`);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        setLoading(true);
        await plansAPI.deletePlan(plan.id || plan._id);
        if (onDelete) {
          onDelete(plan);
        } else {
          navigate('/dashboard?refresh=true');
        }
      } catch (error) {
        console.error('Error deleting plan:', error);
        alert('Failed to delete plan. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) {
      onShare(plan);
    } else {
      if (navigator.share) {
        navigator.share({
          title: plan.nameoftheplace,
          text: plan.abouttheplace || plan.description,
          url: window.location.origin + `/plans/${plan.id || plan._id}`
        });
      } else {
        navigator.clipboard.writeText(window.location.origin + `/plans/${plan.id || plan._id}`);
        alert('Plan link copied to clipboard!');
      }
    }
  };

  const linkTo = isPublic ? `/plans/${plan.id || plan._id}/community-plan` : `/plans/${plan.id || plan._id}`;
  const navigationState = { plan };

  if (viewMode === 'list') {
    return (
      <Link to={linkTo} state={navigationState} className="group block">
        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 group-hover:scale-[1.01] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex gap-4 p-4">
            {/* Image */}
            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={getImageUrl(plan.imageurl || plan.imageUrl, 96, 96)}
                alt={plan.nameoftheplace}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={handleImageError}
              />
              {/* Rating Overlay */}
              {getRating() && (
                <div className="absolute top-1 right-1 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                  <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium text-gray-900">{getRating()}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {plan.nameoftheplace}
                  </h3>
                  {(plan.fromdate || plan.fromDate || plan.startdate) && (plan.todate || plan.toDate || plan.enddate) && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDateRange(
                        plan.fromdate || plan.fromDate || plan.startdate, 
                        plan.todate || plan.toDate || plan.enddate
                      )}
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="flex gap-2 ml-2">
                  {isPublic && (
                    <Badge variant="outline" className="text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      Public
                    </Badge>
                  )}
                  {plan.isGeneratedUsingAI && (
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI
                    </Badge>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{duration} days</span>
                    </div>
                  )}
                  {getBudget() && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>${getBudget().toLocaleString()}</span>
                    </div>
                  )}
                  {getTravelers() && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{getTravelers()}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Edit/Delete buttons for list view */}
                  {showEditDelete && (
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleEdit}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleShare}
                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 p-1"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleDelete}
                        disabled={loading}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  

                  <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    <MapPin className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <div className="group relative">
      <Link to={linkTo} state={navigationState} className="block">
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="relative">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={getImageUrl(plan.imageurl || plan.imageUrl, 300, 200)}
                alt={plan.nameoftheplace}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={handleImageError}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {isPublic && (
                  <Badge className="bg-green-500/90 text-white border-0 backdrop-blur-sm">
                    <Eye className="w-3 h-3 mr-1" />
                    Public
                  </Badge>
                )}
                {plan.isGeneratedUsingAI && (
                  <Badge className="bg-purple-500/90 text-white border-0 backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI
                  </Badge>
                )}
              </div>

              {/* Actions Menu - Show for user's own plans when showEditDelete is true */}
              {showEditDelete && (
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                      }}
                      className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                    
                    {showMenu && (
                      <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[120px]">
                        {/* Edit button - show for all user's own plans */}
                        <button
                          onClick={handleEdit}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={handleShare}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                        <button
                          onClick={handleDelete}
                          disabled={loading}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rating - Only show if no actions menu is present or on AI plans */}
              {getRating() && !showEditDelete && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium text-gray-900">{getRating()}</span>
                </div>
              )}

              {/* Views count */}
              {getViews() > 0 && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Eye className="w-3 h-3 text-white" />
                  <span className="text-xs font-medium text-white">{getViews()}</span>
                </div>
              )}

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-200 transition-colors">
                  {plan.nameoftheplace}
                </h3>
                {(plan.fromdate || plan.fromDate || plan.startdate) && (plan.todate || plan.toDate || plan.enddate) && (
                  <div className="flex items-center text-white/90 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDateRange(
                      plan.fromdate || plan.fromDate || plan.startdate, 
                      plan.todate || plan.toDate || plan.enddate
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <CardContent className="p-4 space-y-3">
            {/* Trip Details */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-4">
                {duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{duration} days</span>
                  </div>
                )}
                {getBudget() && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${getBudget().toLocaleString()}</span>
                  </div>
                )}
                {getTravelers() && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{getTravelers()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {(plan.abouttheplace || plan.description) && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {plan.abouttheplace || plan.description}
              </p>
            )}

            {/* Tags */}
            {getTags().length > 0 && (
              <div className="flex flex-wrap gap-1">
                {getTags().slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {getTags().length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{getTags().length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Action Button */}
            <Button
              variant="ghost"
              className="w-full justify-start text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 p-0 h-auto font-medium"
            >
              <MapPin className="w-4 h-4 mr-2" />
              View Itinerary
            </Button>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export { UnifiedPlanCard };
export default UnifiedPlanCard;
