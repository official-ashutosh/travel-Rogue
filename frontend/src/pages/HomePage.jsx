"use client"
import { Link, useNavigate } from "react-router-dom"
import {
  Plane,
  MapPin,
  Calendar,
  Users,
  Star,
  Globe,
  Lightbulb,
  LogIn,
  PlaneTakeoff,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
} from "lucide-react"
import { Button } from "../components/ui/Button.jsx"
import { Card, CardContent } from "../components/ui/Card.jsx"
import { useAuth } from "../contexts/AuthContext.jsx"

const HomePage = () => {
  const { user } = useAuth()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {/* Hero Section */}
      <HeroSection user={user} />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Public Plans Section */}
      <PublicPlansSection />

      {/* Pricing Section */}
      <PricingSection />
    </div>
  )
}

const HeroSection = ({ user }) => {
  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 overflow-hidden">
      {/* Sophisticated Background Elements */}
      <div className="absolute inset-0">
        {/* Elegant geometric shapes */}
        <div className="absolute top-32 left-32 w-72 h-72 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-900/15 dark:to-indigo-900/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-gradient-to-br from-purple-100/20 to-pink-100/20 dark:from-purple-900/15 dark:to-pink-900/15 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Perfectly positioned floating professional icons */}
        <div className="absolute top-[15%] right-[8%] animate-float">
          <div className="p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-md border border-white/30 dark:border-gray-700/30">
            <Plane className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="absolute top-[35%] left-[8%] animate-float-delayed">
          <div className="p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-md border border-white/30 dark:border-gray-700/30">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>

        <div className="absolute bottom-[25%] right-[25%] animate-float-slow">
          <div className="p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-md border border-white/30 dark:border-gray-700/30">
            <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="absolute top-[50%] right-[8%] animate-float">
          <div className="p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg shadow-sm border border-white/40 dark:border-gray-700/40">
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        {/* MapPin positioned to the right of "Into" text */}
        <div className="absolute top-[42%] right-[52%] animate-float-delayed">
          <div className="p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg shadow-sm border border-white/40 dark:border-gray-700/40">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[75vh]">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium border border-slate-200/50 dark:border-gray-700/50 shadow-sm">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                AI-Powered Travel Intelligence
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                Transform Your Travel Dreams Into
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Perfect Adventures
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Transform your travel planning experience with our sophisticated AI platform. Create detailed
                itineraries, optimize budgets, and discover extraordinary destinations with enterprise-grade precision.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <GeneratePlanButton user={user} />
              <Button
                variant="outline"
                className="px-6 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-500 text-slate-700 dark:text-slate-300 font-medium group transition-all duration-300"
              >
                Explore Platform
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Enhanced Professional Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200/50 dark:border-gray-700/50">
              <div className="text-center group cursor-pointer">
                <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1 group-hover:scale-105 transition-transform">
                  50K+
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Global Users</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1 group-hover:scale-105 transition-transform">
                  200+
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Destinations</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1 group-hover:scale-105 transition-transform">
                  4.9
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  Rating
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Premium Travel Card */}
          <div className="relative">
            <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500">
              <div className="space-y-6">
                {/* Destination Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">Tokyo, Japan</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Premium 7-day experience</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-900 dark:text-white">$1,299</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">per person</div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                      March 15 - March 22, 2024
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">2 Adults, 1 Child</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Plane className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                      Premium flights included
                    </span>
                  </div>
                </div>

                {/* Activities Preview */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-base text-slate-900 dark:text-white">Curated Experiences</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      Tokyo Skytree VIP Experience
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                      Private Shibuya District Tour
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      Authentic Tea Ceremony
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating accent elements */}
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center animate-bounce-slow shadow-md">
              <Star className="w-3 h-3 text-white fill-white" />
            </div>
            <div className="absolute -bottom-3 -left-3 w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg animate-pulse shadow-md"></div>

            {/* Background glow */}
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

const GeneratePlanButton = ({ user }) => {
  const navigate = useNavigate()
  
  const handleClick = () => {
    if (user) {
      navigate("/dashboard")
    } else {
      navigate("/signup")
    }
  }
  
  return (
    <Button 
      onClick={handleClick}
      className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold text-base px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden transform hover:scale-105"
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-700 -skew-x-12"></div>

      {/* Content */}
      <div className="relative flex items-center gap-2">
        <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
        <span>Start Your Journey</span>
        <div className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md">FREE</div>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-40 blur-lg group-hover:opacity-60 transition-opacity duration-300 -z-10"></div>
    </Button>
  )
}

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <LogIn className="h-6 w-6 text-slate-600 dark:text-slate-400" />,
      title: "Smart Authentication",
      description: "Secure login with advanced authentication to protect your travel data and preferences.",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-slate-600 dark:text-slate-400" />,
      title: "AI-Powered Planning",
      description: "Our intelligent system analyzes your preferences to create personalized travel experiences.",
    },
    {
      icon: <PlaneTakeoff className="h-6 w-6 text-slate-600 dark:text-slate-400" />,
      title: "Premium Execution",
      description: "Receive comprehensive itineraries with real-time updates and premium recommendations.",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4 border border-blue-200/50 dark:border-blue-800/50">
            <TrendingUp className="w-4 h-4" />
            How It Works
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Your Journey to Perfect Travel
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Starts Here
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experience the future of travel planning with our intelligent platform that turns your wanderlust into
            reality
          </p>
        </div>

        <div className="flex items-center justify-center gap-12 lg:gap-20 flex-col lg:flex-row max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center relative group">
              <div className="w-16 h-16 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                {step.icon}
              </div>
              <div className="space-y-3 max-w-xs">
                <h3 className="font-bold text-lg md:text-xl text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute -right-16 lg:-right-28 top-8 opacity-30 hidden lg:block">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500"></div>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const PublicPlansSection = () => {
  const publicPlans = [
    {
      id: 1,
      name: "Tokyo Explorer",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
      duration: "7 days",
      budget: "$2,800",
      rating: 4.8,
      tags: ["Culture", "Technology", "Premium"],
    },
    {
      id: 2,
      name: "Paris Excellence",
      image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop&auto=format",
      duration: "5 days",
      budget: "$3,200",
      rating: 4.9,
      tags: ["Luxury", "Art", "Culture"],
    },
    {
      id: 3,
      name: "Bali Retreat",
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&h=300&fit=crop",
      duration: "10 days",
      budget: "$1,800",
      rating: 4.7,
      tags: ["Wellness", "Nature", "Relaxation"],
    },
  ]
  return (
    <section id="community-plans" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-blue-950">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium mb-4 border border-slate-200/50 dark:border-gray-700/50 shadow-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            Featured Experiences
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Handcrafted Adventures
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Await Your Discovery
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Dive into extraordinary journeys curated by fellow travelers who've turned dreams into unforgettable
            memories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {publicPlans.map((plan) => (
            <Card
              key={plan.id}
              className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 rounded-2xl overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={plan.image || "/placeholder.svg"}
                  alt={plan.name}
                  className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src =
                      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&auto=format"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl px-2 py-1 text-sm font-medium flex items-center gap-1 shadow-md border border-white/20 dark:border-gray-700/50">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-slate-900 dark:text-white">{plan.rating}</span>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{plan.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400 text-sm">{plan.duration}</span>
                  <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    {plan.budget}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {plan.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full font-medium border border-blue-200/50 dark:border-blue-800/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/community-plans"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg border border-slate-200/50 dark:border-gray-700/50 group"
          >
            <span>Explore All Plans</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}

const PricingSection = () => {
  const features = [
    "Advanced AI trip planning",
    "Personalized recommendations",
    "Smart budget optimization",
    "Real-time travel updates",
    "Premium community access",
    "Comprehensive expense tracking",
  ]

  const plans = [
    {
      name: "Starter",
      credits: "2 AI Credit",
      originalPrice: "$10",
      price: "$0",
      description: "Perfect for exploring our platform",
      popular: false,
    },
    {
      name: "Explorer",
      credits: "10 AI Credits",
      originalPrice: "$50",
      price: "$2",
      description: "Ideal for frequent travelers",
      popular: true,
    },  ]

  return (
    <section id="pricing" className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium mb-4 border border-emerald-200/50 dark:border-emerald-800/50">
            <Zap className="w-4 h-4" />
            Pricing Plans
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Unlock Unlimited
            <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Travel Possibilities
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Choose your adventure level with flexible credit packages designed to fuel your wanderlust
          </p>
        </div>

        <div className="flex gap-6 flex-col lg:flex-row justify-center items-center max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative w-full max-w-sm rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                plan.popular
                  ? "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800 scale-105"
                  : "bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-slate-200/50 dark:border-gray-700/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                    Most Popular
                  </div>
                </div>
              )}

              <CardContent className="p-6 space-y-6">
                <div className="text-center space-y-3">
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white">{plan.name}</h3>
                  <div className="text-slate-600 dark:text-slate-400 text-base">{plan.credits}</div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="line-through text-lg text-slate-400 dark:text-slate-500">
                      {plan.originalPrice}
                    </span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{plan.description}</p>
                </div>

                <ul className="space-y-3">
                  {features.map((feature, featureIndex) => (
                    <li
                      className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300"
                      key={featureIndex}
                    >
                      <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-3 font-medium text-base rounded-xl transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
                      : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg border-0"
                  }`}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomePage
