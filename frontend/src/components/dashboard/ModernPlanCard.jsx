import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Star, Eye, DollarSign, Users } from 'lucide-react';
import { Card, CardContent } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';

const ModernPlanCard = ({ plan, isPublic = false, viewMode = 'grid' }) => {
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

  const duration = calculateDuration(
    plan.fromdate || plan.fromDate || plan.startdate, 
    plan.todate || plan.toDate || plan.enddate
  );
    const linkTo = isPublic ? `/plans/${plan.id || plan._id}/community-plan` : `/plans/${plan.id || plan._id}`;
  const navigationState = { plan }; // Pass plan data through router state

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
              {plan.rating && (
                <div className="absolute top-1 right-1 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                  <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium text-gray-900">{plan.rating}</span>
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
                  {(plan.fromdate || plan.startdate) && (plan.todate || plan.enddate) && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDateRange(
                        plan.fromdate || plan.startdate, 
                        plan.todate || plan.enddate
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
                  {plan.budget && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>${plan.budget.toLocaleString()}</span>
                    </div>
                  )}
                  {plan.travelers && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{plan.travelers}</span>
                    </div>
                  )}
                </div>

                <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  <MapPin className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }
  return (
    <Link to={linkTo} state={navigationState} className="group block">
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
            </div>

            {/* Rating */}
            {plan.rating && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium text-gray-900">{plan.rating}</span>
              </div>
            )}

            {/* Views count */}
            {plan.views && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                <Eye className="w-3 h-3 text-white" />
                <span className="text-xs font-medium text-white">{plan.views}</span>
              </div>
            )}

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-200 transition-colors">
                {plan.nameoftheplace}
              </h3>
              {(plan.fromdate || plan.startdate) && (plan.todate || plan.enddate) && (
                <div className="flex items-center text-white/90 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDateRange(
                    plan.fromdate || plan.startdate, 
                    plan.todate || plan.enddate
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
              {plan.budget && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>${plan.budget.toLocaleString()}</span>
                </div>
              )}
              {plan.travelers && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{plan.travelers}</span>
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
          {plan.tags && plan.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {plan.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {plan.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{plan.tags.length - 3}
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
  );
};

export { ModernPlanCard };
export default ModernPlanCard;
