"use client"
import { Plane, MapPin, Calendar, Users, Star, Globe, Camera, Compass } from "lucide-react"
import GeneratePlanButton from "@/frontend/components/GeneratePlanButton"

const ModernTravelHero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">        {/* Floating Clouds */}
        <div className="absolute left-10 animate-float">
          <div className="w-16 h-10 bg-white/30 dark:bg-white/10 rounded-full blur-sm"></div>
        </div>
        <div className="absolute top-32 right-20 animate-float-delayed">
          <div className="w-20 h-12 bg-white/20 dark:bg-white/5 rounded-full blur-sm"></div>
        </div>
        <div className="absolute top-40 left-1/3 animate-float-slow">
          <div className="w-12 h-8 bg-white/25 dark:bg-white/8 rounded-full blur-sm"></div>
        </div>        {/* Animated Travel Icons */}
        <div className="absolute top-1/4 right-1/4 animate-bounce-slow">
          <div className="p-3 bg-blue-500/10 dark:bg-blue-400/20 rounded-full backdrop-blur-sm">
            <Plane className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="absolute top-1/3 left-1/4 animate-pulse-slow">
          <div className="p-3 bg-green-500/10 dark:bg-green-400/20 rounded-full backdrop-blur-sm">
            <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="absolute bottom-1/3 right-1/3 animate-wiggle">
          <div className="p-3 bg-purple-500/10 dark:bg-purple-400/20 rounded-full backdrop-blur-sm">
            <Camera className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="absolute bottom-1/4 left-1/5 animate-spin-slow">
          <div className="p-3 bg-orange-500/10 dark:bg-orange-400/20 rounded-full backdrop-blur-sm">
            <Compass className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}          <div className="space-y-8">
            <div className="space-y-4">              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                <Globe className="w-4 h-4" />
                AI Travel Rogue - Your Adventure Companion
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Uncover Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  {" "}
                  AI Travel Rogue
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Your AI-powered travel companion that crafts personalized adventures, uncovers hidden gems, and creates unforgettable journeys tailored just for you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">              <GeneratePlanButton />
              <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-colors">
                Explore Destinations
              </button>
            </div>            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">200+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">4.9</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  Rating
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Travel Illustration */}
          <div className="relative">            {/* Main Travel Card */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl dark:shadow-gray-900/50 p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="space-y-6">
                {/* Destination Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Tokyo, Japan</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">7 days trip</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">$1,299</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">per person</div>
                  </div>
                </div>                {/* Trip Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">March 15 - March 22, 2024</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">2 Adults, 1 Child</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Plane className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Round-trip flights included</span>
                  </div>
                </div>                {/* Activities Preview */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Planned Activities</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Visit Tokyo Skytree
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Explore Shibuya Crossing
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Traditional Tea Ceremony
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-3 animate-bounce">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>

            <div className="absolute -bottom-4 -left-4 bg-green-500 rounded-full p-3 animate-pulse">
              <Camera className="w-5 h-5 text-white" />
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute -z-10 top-10 right-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -z-10 bottom-10 left-10 w-24 h-24 bg-gradient-to-br from-green-200 to-blue-200 rounded-full blur-2xl opacity-50"></div>
          </div>
        </div>
      </div>      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" fill="none" className="w-full h-20">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="white" fillOpacity="0.1" className="dark:fill-gray-800" />
        </svg>
      </div>
    </div>
  )
}

export default ModernTravelHero
