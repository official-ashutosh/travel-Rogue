import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Globe, 
  Camera, 
  Compass, 
  Lightbulb, 
  LogIn, 
  PlaneTakeoff,
  CheckCircle2,
  ChevronRight,
  Sparkles 
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const HomePage = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">      
      {/* Hero Section */}
      <HeroSection user={user} />
      
      {/* How It Works Section */}
      <HowItWorksSection />
      
      {/* Public Plans Section */}
      <PublicPlansSection />
      
      {/* Pricing Section */}
      <PricingSection />
    </div>
  );
};

const HeroSection = ({ user }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 overflow-hidden transition-colors">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Clouds */}
        <div className="absolute left-10 top-20 animate-bounce">
          <div className="w-16 h-10 bg-white/30 dark:bg-white/10 rounded-full blur-sm"></div>
        </div>        <div className="absolute top-32 right-20 animate-pulse">
          <div className="w-20 h-12 bg-white/20 dark:bg-white/10 rounded-full blur-sm"></div>
        </div>
        <div className="absolute top-40 left-1/3 animate-bounce">
          <div className="w-12 h-8 bg-white/25 dark:bg-white/15 rounded-full blur-sm"></div>
        </div>
        
        {/* Animated Travel Icons */}
        <div className="absolute top-1/4 right-1/4 animate-bounce">
          <div className="p-3 bg-blue-500/10 dark:bg-blue-400/20 rounded-full backdrop-blur-sm">
            <Plane className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="absolute top-1/3 left-1/4 animate-pulse">
          <div className="p-3 bg-green-500/10 dark:bg-green-400/20 rounded-full backdrop-blur-sm">
            <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="absolute bottom-1/3 right-1/3 animate-spin">
          <div className="p-3 bg-purple-500/10 dark:bg-purple-400/20 rounded-full backdrop-blur-sm">
            <Camera className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="absolute bottom-1/4 left-1/5 animate-bounce">
          <div className="p-3 bg-orange-500/10 dark:bg-orange-400/20 rounded-full backdrop-blur-sm">
            <Compass className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8">            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
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
            </div>            <div className="flex flex-col sm:flex-row gap-4">
              <GeneratePlanButton user={user} />
              <Button variant="outline" className="px-8 py-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Explore Destinations
              </Button>
            </div>

            {/* Stats */}
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
          </div>          {/* Right Content - Travel Card */}
          <div className="relative">
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 border dark:border-gray-700">
              <div className="space-y-6">
                {/* Destination Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Tokyo, Japan</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">7 days trip</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">$1,299</div>
                    <div className="text-sm text-gray-500">per person</div>
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
                </div>

                {/* Activities Preview */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Planned Activities</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Visit Tokyo Skytree
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Explore Shibuya Crossing
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
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
            </div>            {/* Background Decorative Elements */}
            <div className="absolute -z-10 top-10 right-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -z-10 bottom-10 left-10 w-24 h-24 bg-gradient-to-br from-green-200 to-blue-200 dark:from-green-800 dark:to-blue-800 rounded-full blur-2xl opacity-50"></div>
          </div>
        </div>
      </div>      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" fill="none" className="w-full h-20">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="white" fillOpacity="0.1" className="dark:fill-gray-800" />
        </svg>
      </div>
    </div>
  );
};

const GeneratePlanButton = ({ user }) => {
  return (
    <Link to={user ? "/plans/new" : "/auth/login"}>
      <Button
        className="group relative bg-gradient-to-r from-blue-600 to-blue-700 
                   hover:from-blue-700 hover:to-blue-800
                   text-white font-bold text-lg px-8 py-4
                   rounded-2xl shadow-lg hover:shadow-xl
                   transition-all duration-300 ease-in-out
                   border-0 overflow-hidden
                   transform hover:scale-105"
      >
        {/* Background shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                        opacity-0 group-hover:opacity-100 group-hover:animate-pulse
                        transition-opacity duration-500"></div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center gap-3">
          <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
          <span>Start Your Adventure</span>
          <div className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full ml-2">
            FREE
          </div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-blue-600 opacity-50 blur-xl group-hover:opacity-70 transition-opacity duration-300 -z-10"></div>
      </Button>
    </Link>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {      icon: <LogIn className="h-8 w-8 text-blue-500 dark:text-blue-400" />,
      title: "Login",
      description: "Log in to start your journey."
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-blue-500 dark:text-blue-400" />,
      title: "Key in the travel idea", 
      description: "Tell us about your ideal trip"
    },
    {
      icon: <PlaneTakeoff className="h-8 w-8 text-blue-500 dark:text-blue-400" />,
      title: "Get AI Plan",
      description: "Get your AI-driven tailored travel plan"
    }
  ];
  return (
    <section className="min-h-screen bg-white/90 dark:bg-gray-800/90 w-full flex justify-center items-center px-5 py-20 transition-colors">
      <div className="flex flex-col gap-20">
        <div className="flex flex-col gap-5">
          <h2 className="text-blue-500 dark:text-blue-400 text-center text-lg font-bold tracking-wide">
            How it works?
          </h2>
          <h3 className="text-gray-900 dark:text-white text-center md:text-3xl text-xl font-bold">
            Craft Your Ideal Journey Swiftly
          </h3>
        </div>
        <div className="flex items-center justify-center gap-28 w-full h-full flex-col md:flex-row">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center justify-center gap-5 relative">
              <div className="bg-gray-100 dark:bg-gray-700 w-24 h-24 rounded-2xl shadow-2xl items-center flex justify-center transition-colors">
                {step.icon}
              </div>
              <span className="font-bold tracking-wide text-lg mt-5 text-gray-900 dark:text-white">{step.title}</span>
              <span className="text-sm w-2/3 text-center text-gray-600 dark:text-gray-400">{step.description}</span>
              {index < steps.length - 1 && (
                <ChevronRight className="absolute -right-[120px] top-[15%] opacity-40 hidden md:block text-gray-600 dark:text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PublicPlansSection = () => {
  const publicPlans = [
    {
      id: 1,
      name: "Swiss Alps Explorer",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      duration: "9 days",
      budget: "$2,800",
      rating: 4.7,
      tags: ["Adventure", "Mountains", "Nature"]
    },
    {
      id: 2,
      name: "NYC Food Tour", 
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
      duration: "5 days",
      budget: "$2,100", 
      rating: 4.5,
      tags: ["Food", "Urban", "Culture"]
    },
    {
      id: 3,
      name: "Bali Retreat",
      image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop", 
      duration: "14 days",
      budget: "$1,800",
      rating: 4.9,
      tags: ["Beach", "Relaxation", "Nature"]
    }
  ];
  return (
    <section className="min-h-screen bg-white/90 dark:bg-gray-800/90 w-full flex justify-center items-center px-5 py-20 transition-colors">
      <div className="flex flex-col gap-10 w-full">
        <h2 className="text-blue-500 dark:text-blue-400 text-center text-lg font-bold tracking-wide">
          Our Community's Favorite Trips
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10 justify-center max-w-6xl mx-auto">
          {publicPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow dark:bg-gray-700 dark:border-gray-600">
              <div className="relative">
                <img 
                  src={plan.image} 
                  alt={plan.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-900 dark:text-white">{plan.rating}</span>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{plan.duration}</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{plan.budget}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {plan.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Link
          to="/community-plans"
          className="flex gap-1 justify-center items-center w-fit mx-auto text-sm underline-offset-4 hover:text-blue-600 hover:underline"
        >
          <span>View All Community Plans</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

const PricingSection = () => {
  const features = [
    "AI-powered trip planning",
    "Personalized itineraries", 
    "Budget optimization",
    "Real-time weather updates",
    "Community plan sharing",
    "Expense tracking"
  ];

  const plans = [
    {
      name: "Free Plan",
      credits: "1 Credit",
      originalPrice: "₹400",
      price: "₹0",
      description: "Free Plan. No subscription"
    },
    {
      name: "Paid Plan", 
      credits: "5 Credits",
      originalPrice: "₹400", 
      price: "₹80",
      description: "One-time payment. No subscription"
    }
  ];
  return (
    <section className="min-h-screen bg-white dark:bg-gray-900 w-full flex flex-col gap-5 justify-center items-center px-5 py-20 transition-colors">
      <div className="flex flex-col gap-2">
        <h2 className="text-blue-500 dark:text-blue-400 text-center text-lg font-bold tracking-wide">Pricing</h2>
        <h3 className="text-gray-900 dark:text-white text-center md:text-3xl text-xl font-bold">
          Make your Travel Plan Today
        </h3>
      </div>
      <div className="flex gap-5 flex-col md:flex-row">
        {plans.map((plan, index) => (
          <Card key={index} className="flex flex-col justify-between flex-1 min-w-96 md:min-w-80 ring-1 ring-gray-200 dark:ring-gray-600 rounded-3xl p-8 shadow-xl dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col">
              <div className="font-semibold text-gray-900 dark:text-white">{plan.name}</div>
              <h3 className="text-blue-500 dark:text-blue-400 text-2xl font-extrabold leading-8">
                {plan.credits}
              </h3>
              <p className="mt-3 flex items-baseline gap-x-1">
                <span className="line-through text-2xl font-sans text-gray-400 dark:text-gray-500">{plan.originalPrice}</span>
                <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {plan.price}
                </span>
              </p>
            </div>
            <div className="flex flex-col">
              <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-900 dark:text-gray-300 xl:mt-10">
                {features.map((feature, featureIndex) => (
                  <li className="flex gap-x-3 text-base" key={featureIndex}>
                    <CheckCircle2 className="h-6 w-5 flex-none text-blue-600 dark:text-blue-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-5">
                {plan.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HomePage;
