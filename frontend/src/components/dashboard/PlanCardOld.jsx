import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Star, Share2, Eye, DollarSign } from 'lucide-react';
import { Card, CardContent } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';

const PlanCard = ({ plan, isPublic = false, viewMode = 'grid' }) => {
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

  const duration = calculateDuration(plan.fromdate || plan.fromDate, plan.todate || plan.toDate);

  if (viewMode === 'list') {
    return (
      <Link to={isPublic ? `/plans/${plan.id || plan._id}/community-plan` : `/plans/${plan.id || plan._id}/plan`} className="group block">
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg dark:shadow-gray-900/30 dark:hover:shadow-gray-900/50 transition-all duration-200 group-hover:scale-[1.01] bg-white dark:bg-gray-800">
          <div className="flex gap-4 p-4">
            {/* Image */}
            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={getImageUrl(plan.imageurl || plan.imageUrl, 96, 96)}
                alt={plan.nameoftheplace}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={handleImageError}
              />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {plan.nameoftheplace}
                  </h3>
                  {(plan.fromdate || plan.fromDate) && (plan.todate || plan.toDate) && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDateRange(plan.fromdate || plan.fromDate, plan.todate || plan.toDate)}
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="flex gap-2">
                  {plan.is_published && (
                    <Badge variant="secondary" className="text-xs">
                      <Share2 className="w-3 h-3 mr-1" />
                      Published
                    </Badge>
                  )}
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
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  {duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{duration} days</span>
                    </div>
                  )}
                  {plan.budget && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>${plan.budget}</span>
                    </div>
                  )}
                  {plan.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{plan.rating}</span>
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
    <Link to={isPublic ? `/plans/${plan.id || plan._id}/community-plan` : `/plans/${plan.id || plan._id}/plan`} className="group block">
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70 transition-all duration-300 group-hover:scale-[1.02] bg-white dark:bg-gray-800">
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
              {plan.is_published && (
                <Badge className="bg-blue-500/90 text-white border-0 backdrop-blur-sm">
                  <Share2 className="w-3 h-3 mr-1" />
                  Published
                </Badge>
              )}
              {isPublic && (
                <Badge className="bg-green-500/90 text-white border-0 backdrop-blur-sm">
                  <Eye className="w-3 h-3 mr-1" />
                  Public
                </Badge>
              )}
            </div>

            {/* Rating */}
            {plan.rating && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium text-gray-900 dark:text-white">{plan.rating}</span>
              </div>
            )}

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-200 transition-colors">
                {plan.nameoftheplace}
              </h3>
              {(plan.fromdate || plan.fromDate) && (plan.todate || plan.toDate) && (
                <div className="flex items-center text-white/90 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDateRange(plan.fromdate || plan.fromDate, plan.todate || plan.toDate)}
                </div>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Trip Details */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
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
                  <span>${plan.budget}</span>
                </div>
              )}
            </div>
            {plan.views && (
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Eye className="w-4 h-4" />
                <span>{plan.views}</span>
              </div>
            )}
          </div>

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

export { PlanCard };
export default PlanCard;
