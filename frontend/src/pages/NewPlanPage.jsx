"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Wand2,
  Loader2,
  MessageSquarePlus,
  Sparkles,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Target,
} from "lucide-react"
import { Button } from "../components/ui/Button.jsx"
import { Input } from "../components/ui/Input.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx"
import api from "../lib/api.js"
import LocationAutoComplete from "../components/LocationAutoComplete.jsx"
import { ACTIVITY_PREFERENCES, COMPANION_PREFERENCES } from "../lib/constants.js"

const NewPlanPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [selectedActivities, setSelectedActivities] = useState([])

  const [formData, setFormData] = useState({
    nameoftheplace: "",
    fromdate: "",
    todate: "",
    budget: "",
    abouttheplace: "",
    companion: "",
    activityPreferences: [],
  })

  const activities = ACTIVITY_PREFERENCES.map((activity) => ({
    id: activity.id,
    label: activity.displayName,
    icon: activity.icon,
  }))

  const companions = COMPANION_PREFERENCES.map((companion) => ({
    id: companion.id,
    label: companion.displayName,
  }))

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const toggleActivity = (activityId) => {
    setSelectedActivities((prev) => {
      const updated = prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId]

      setFormData((prevForm) => ({
        ...prevForm,
        activityPreferences: updated,
      }))

      return updated
    })
  }

  const validateForm = () => {
    if (!formData.nameoftheplace.trim()) {
      alert("Please enter a destination")
      return false
    }
    if (!formData.fromdate || !formData.todate) {
      alert("Please select travel dates")
      return false
    }
    if (new Date(formData.fromdate) >= new Date(formData.todate)) {
      alert("End date must be after start date")
      return false
    }
    return true
  }

  const handleCreatePlan = async (withAI = false) => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const planData = {
        nameoftheplace: formData.nameoftheplace,
        userPrompt: formData.abouttheplace || `I want to visit ${formData.nameoftheplace}`,
        isGeneratedUsingAI: withAI,
        startDate: formData.fromdate,
        endDate: formData.todate,
        budgetRange: formData.budget ? `$${formData.budget}` : null,
        travelStyle: formData.companion || "solo",
        interests: selectedActivities,
        numberOfDays:
          formData.fromdate && formData.todate
            ? Math.ceil((new Date(formData.todate) - new Date(formData.fromdate)) / (1000 * 60 * 60 * 24))
            : null,
      }

      const response = await api.post("/plans", planData)

      if (response.data.status === "success") {
        setTimeout(() => {
          navigate("/dashboard?refresh=true")
        }, 500)
      } else {
        throw new Error(response.data.message || "Failed to create plan")
      }
    } catch (error) {
      console.error("Error creating plan:", error)
      alert(error.response?.data?.message || error.message || "Failed to create plan. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Intelligence",
      description: "Smart recommendations based on your preferences and travel style",
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: Target,
      title: "Personalized Planning",
      description: "Tailored itineraries that match your interests and budget",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Clock,
      title: "Time Optimization",
      description: "Efficient scheduling to make the most of your travel time",
      color: "from-amber-500 to-orange-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-32 w-72 h-72 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-900/15 dark:to-indigo-900/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-gradient-to-br from-purple-100/20 to-pink-100/20 dark:from-purple-900/15 dark:to-pink-900/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-slate-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6 border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            Create Your Dream Adventure
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Plan Your Next
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Extraordinary Adventure
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl mx-auto">
            Whether you're dreaming of a solo adventure, romantic getaway, or family vacation, our AI-powered travel
            planner will help you create the perfect itinerary.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-base md:text-lg text-slate-900 dark:text-white mb-2">{feature.title}</h4>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Main Form */}
        <Card className="max-w-6xl mx-auto border border-slate-200/50 dark:border-gray-700/50 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-950/30 dark:to-blue-950/30 border-b border-slate-200/50 dark:border-gray-700/50">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Create Your Travel Plan
            </CardTitle>
            <p className="text-slate-600 dark:text-slate-400">Let's plan your next adventure together</p>
          </CardHeader>

          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Destination Input */}
                <div className="space-y-3">
                  <label className="flex items-center text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                      <MapPin className="w-3 h-3 text-white" />
                    </div>
                    Where would you like to go?
                  </label>
                  <LocationAutoComplete
                    placeholder="Search for your destination city..."
                    onLocationSelect={(location) => handleInputChange("nameoftheplace", location.name)}
                    className="w-full h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-slate-200/50 dark:border-gray-600/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  />
                </div>

                {/* Date Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="flex items-center text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-2">
                        <Calendar className="w-3 h-3 text-white" />
                      </div>
                      Departure Date
                    </label>
                    <Input
                      type="date"
                      value={formData.fromdate}
                      onChange={(e) => handleInputChange("fromdate", e.target.value)}
                      className="w-full h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-slate-200/50 dark:border-gray-600/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 rounded-xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-2">
                        <Calendar className="w-3 h-3 text-white" />
                      </div>
                      Return Date
                    </label>
                    <Input
                      type="date"
                      value={formData.todate}
                      onChange={(e) => handleInputChange("todate", e.target.value)}
                      className="w-full h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-slate-200/50 dark:border-gray-600/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-3">
                  <label className="flex items-center text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mr-2">
                      <DollarSign className="w-3 h-3 text-white" />
                    </div>
                    Budget (Optional)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter your budget in USD"
                    value={formData.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                    className="w-full h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-slate-200/50 dark:border-gray-600/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 rounded-xl"
                  />
                </div>

                {/* Travel Companion */}
                <div className="space-y-4">
                  <label className="flex items-center text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-2">
                      <Users className="w-3 h-3 text-white" />
                    </div>
                    Who are you travelling with? (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {companions.map((companion) => (
                      <Button
                        key={companion.id}
                        variant={formData.companion === companion.id ? "default" : "outline"}
                        onClick={() => handleInputChange("companion", companion.id)}
                        className={`h-12 transition-all duration-300 ${
                          formData.companion === companion.id
                            ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md hover:shadow-lg"
                            : "bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-slate-200/50 dark:border-gray-600/50 hover:bg-slate-100 dark:hover:bg-gray-600"
                        }`}
                      >
                        <span className="text-xs md:text-sm">{companion.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Activity Preferences */}
                <div className="space-y-4">
                  <label className="flex items-center text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mr-2">
                      <Target className="w-3 h-3 text-white" />
                    </div>
                    What activities interest you? (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {activities.map((activity) => {
                      const Icon = activity.icon
                      const isSelected = selectedActivities.includes(activity.id)
                      return (
                        <Button
                          key={activity.id}
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => toggleActivity(activity.id)}
                          className={`flex items-center gap-2 h-12 transition-all duration-300 ${
                            isSelected
                              ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md hover:shadow-lg"
                              : "bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-slate-200/50 dark:border-gray-600/50 hover:bg-slate-100 dark:hover:bg-gray-600"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-xs md:text-sm font-medium">{activity.label}</span>
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <label className="flex items-center text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center mr-2">
                      <MessageSquarePlus className="w-3 h-3 text-white" />
                    </div>
                    Tell us about your trip (Optional)
                  </label>
                  <textarea
                    placeholder="What kind of experience are you looking for? Any specific requirements or preferences?"
                    value={formData.abouttheplace}
                    onChange={(e) => handleInputChange("abouttheplace", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-slate-900 dark:text-white transition-all duration-300 resize-none"
                    rows={6}
                  />
                </div>

                {/* Help Text */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <div className="text-xs md:text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-medium mb-1 text-sm md:text-base">Pro Tip:</p>
                      <p>
                        Choose "Generate AI Plan" for a complete itinerary with recommendations, or "Create Manual Plan"
                        to build your own custom adventure step by step.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Full Width */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t border-slate-200/50 dark:border-gray-700/50">
              <Button
                onClick={() => handleCreatePlan(false)}
                disabled={loading}
                className="flex-1 h-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 group relative overflow-hidden"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-700 -skew-x-12"></div>

                {loading ? (
                  <div className="flex items-center gap-2 relative z-10">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Plan...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 relative z-10">
                    <Plus className="w-5 h-5" />
                    <span className="text-sm md:text-base">Create Manual Plan</span>
                  </div>
                )}
              </Button>

              <Button
                onClick={() => handleCreatePlan(true)}
                disabled={loading}
                className="flex-1 h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 group relative overflow-hidden"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-700 -skew-x-12"></div>

                {loading ? (
                  <div className="flex items-center gap-2 relative z-10">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating AI Plan...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 relative z-10">
                    <Wand2 className="w-5 h-5" />
                    <span className="text-sm md:text-base">Generate AI Plan</span>
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NewPlanPage
