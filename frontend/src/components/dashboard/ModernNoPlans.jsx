import React from 'react';
import { Plane, MapPin, Calendar, Plus, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Card } from '../ui/Card.jsx';
import { Link } from 'react-router-dom';

const ModernNoPlans = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="relative">
          {/* Animated Loading Circle */}
          <div className="w-32 h-32 border-4 border-blue-100 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Plane className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Loading Your Adventures</h3>
          <p className="text-gray-600 dark:text-gray-300">Preparing your travel plans...</p>
        </div>

        {/* Animated Dots */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-4xl p-8 text-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
      {/* Illustration */}
      <div className="mb-8 flex justify-center">
        <div className="relative">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl scale-150"></div>

          {/* Main Icon Container */}
          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 p-12 rounded-full border border-blue-100 dark:border-blue-800">
            <div className="relative">
              <Plane className="w-16 h-16 text-blue-600 dark:text-blue-400 transform rotate-45" />

              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 animate-bounce">
                <div className="w-6 h-6 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>

              <div className="absolute -bottom-1 -left-1 animate-pulse">
                <div className="w-4 h-4 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center">
                  <MapPin className="w-2 h-2 text-white" />
                </div>
              </div>

              <div className="absolute top-1 left-8 animate-ping">
                <div className="w-3 h-3 bg-purple-500 dark:bg-purple-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
            Ready for Your Next
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {" "}
              Adventure?
            </span>
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Create your first travel plan and let our AI help you discover amazing destinations, plan perfect itineraries,
            and make unforgettable memories.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/plans/new">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Plan
            </Button>
          </Link>

          <Link to="/community-plans">
            <Button
              variant="outline"
              size="lg"
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-8 py-3 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 transform hover:scale-105"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Browse Inspiration
            </Button>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
          <div className="text-center space-y-3 p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">AI-Powered</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">Smart recommendations tailored to you</p>
          </div>

          <div className="text-center space-y-3 p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Global Destinations</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">Explore 200+ amazing places</p>
          </div>

          <div className="text-center space-y-3 p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Perfect Timing</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">Optimized schedules and itineraries</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export { ModernNoPlans };
export default ModernNoPlans;
