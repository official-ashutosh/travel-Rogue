import React, { useState } from 'react';
import { X, Sparkles, Plus, Users } from 'lucide-react';
import NewPlanForm from '../components/NewPlanForm.jsx';
import { Button } from '../components/ui/Button.jsx';

const NewPlanPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Create Your Dream Adventure
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Plan Your Next
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {" "}Adventure
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Whether you're dreaming of a solo adventure, romantic getaway, or family vacation, 
            our AI-powered travel planner will help you create the perfect itinerary.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-300 group">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  AI-Powered Planning
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Let our AI create a personalized itinerary with recommendations for activities, 
                  restaurants, and hidden gems based on your preferences.
                </p>
              </div>
              
              <Button
                onClick={() => setShowModal(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Create AI Plan
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-300 group">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Manual Planning
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Prefer to plan yourself? Create a custom travel plan from scratch 
                  and build your itinerary step by step.
                </p>
              </div>
              
              <Button
                onClick={() => setShowModal(true)}
                variant="outline"
                className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950/20 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Manual Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Recommendations</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered suggestions for activities, restaurants, and attractions</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Flexible Planning</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Build your own itinerary or let AI do the work</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Share & Collaborate</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Share your plans with friends and family</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Plan
              </h2>
              <Button
                onClick={() => setShowModal(false)}
                variant="ghost"
                size="sm"
                className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6">
              <NewPlanForm closeModal={() => setShowModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPlanPage;