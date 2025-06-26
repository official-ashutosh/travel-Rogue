"use client"

import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"
import {
  Search,
  Grid,
  List,
  TrendingUp,
  MapPin,
  Users,
  DollarSign,
  CreditCard,
  MessageSquare,
  Sparkles,
  BarChart3,
} from "lucide-react"
import { Button } from "../components/ui/Button.jsx"
import { Input } from "../components/ui/Input.jsx"
import { Badge } from "../components/ui/Badge.jsx"
import { Card, CardContent } from "../components/ui/Card.jsx"
import UnifiedPlanCard from "../components/ui/UnifiedPlanCard.jsx"
import ModernNoPlans from "../components/dashboard/ModernNoPlans.jsx"
import GeneratePlanButton from "../components/GeneratePlanButton.jsx"
import { plansAPI, dashboardAPI, userAPI, feedbackAPI } from "../lib/api.js"

const DashboardPage = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchPlanText, setSearchPlanText] = useState("")
  const [plans, setPlans] = useState([])
  const [communityPlans, setCommunityPlans] = useState([])
  const [filteredPlans, setFilteredPlans] = useState(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("recent")
  const [dashboardStats, setDashboardStats] = useState(null)
  const [userFeedback, setUserFeedback] = useState([])
  const [userCredits, setUserCredits] = useState({
    credits: 0,
    freeCredits: 0,
    totalCredits: 0
  })

  useEffect(() => {
    fetchPlans()
    fetchCommunityPlans()
    fetchDashboardStats()
    fetchUserCredits()
    fetchUserFeedback()
  }, [])

  // Handle refresh parameter from URL (e.g., coming back from plan creation)
  useEffect(() => {
    const refreshParam = searchParams.get('refresh')
    if (refreshParam === 'true') {
      // Force refresh by clearing the parameter and refetching data
      setSearchParams({})
      fetchPlans()
      fetchUserCredits()
    }
  }, [searchParams, setSearchParams])

  // Refresh credits when focus returns to window (user might have used AI elsewhere)
  useEffect(() => {
    const handleFocus = () => {
      fetchUserCredits()
      fetchUserFeedback()
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardAPI.getStats()
      setDashboardStats(response.data)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    }
  }

  const fetchUserCredits = async () => {
    try {
      const response = await userAPI.getCredits()
      const creditsData = response.data.data || response.data
      setUserCredits({
        credits: creditsData.credits || 0,
        freeCredits: creditsData.freeCredits || 0,
        totalCredits: creditsData.totalCredits || (creditsData.credits || 0) + (creditsData.freeCredits || 0)
      })
    } catch (error) {
      console.error("Error fetching user credits:", error)
    }
  }

  const fetchUserFeedback = async () => {
    try {
      const response = await feedbackAPI.getUserFeedback()
      const feedbackData = response.data.data?.feedback || response.data.feedback || []
      setUserFeedback(feedbackData)
    } catch (error) {
      console.error("Error fetching user feedback:", error)
      setUserFeedback([])
    }
  }
  const fetchPlans = async () => {
    try {
      const response = await plansAPI.getUserPlans()
      // Backend returns { ownPlans, sharedPlans, pagination }
      const data = response.data?.data || response.data
      const allPlans = [...(data.ownPlans || []), ...(data.sharedPlans || [])]
      setPlans(allPlans)
    } catch (error) {
      console.error("Error fetching plans:", error)
      setPlans([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCommunityPlans = async () => {
    try {
      const response = await plansAPI.getPublicPlans()
      setCommunityPlans(response.data || [])
    } catch (error) {
      console.error("Error fetching community plans:", error)
      setCommunityPlans([])
    }
  }

  const sortPlans = (plansToSort, sortOption) => {
    const safePlans = Array.isArray(plansToSort) ? plansToSort : []
    const sorted = [...safePlans]
    switch (sortOption) {
      case "recent":
        return sorted.sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime())
      case "alphabetical":
        return sorted.sort((a, b) => a.nameoftheplace.localeCompare(b.nameoftheplace))
      case "budget":
        return sorted.sort((a, b) => (b.budget || 0) - (a.budget || 0))
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      default:
        return sorted
    }
  }

  const getFilteredAndSortedPlans = () => {
    let plansToProcess = filteredPlans ?? plans
    if (!Array.isArray(plansToProcess)) plansToProcess = []
    return sortPlans(plansToProcess, sortBy)
  }

  const finalPlans = getFilteredAndSortedPlans()
  const shouldShowCommunityPlans = !loading && plans.length < 5

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchPlanText(value)
    if (!plans || !plans.length) {
      return
    }
    if (!value) {
      setFilteredPlans(null)
      return
    }
    const filteredResults = plans.filter((plan) => {
      return (
        plan.nameoftheplace.toLowerCase().includes(value.toLowerCase()) ||
        plan.abouttheplace?.toLowerCase().includes(value.toLowerCase())
      )
    })
    setFilteredPlans(filteredResults)
  }

  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 w-full min-h-screen flex-1 flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-slate-200/50 dark:border-gray-700/50 sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center lg:px-20 px-6 py-6">
          {/* Title and Stats */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Your Travel Dashboard
              </h1>
              {!loading && (
                <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/30 animate-pulse-slow">
                  {plans.length} Plans
                </Badge>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
              Manage your travel plans and discover new adventures with AI-powered insights
            </p>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="searchPlan"
                name="searchPlan"
                onChange={handleSearch}
                value={searchPlanText}
                placeholder="Search plans, tags, or destinations..."
                type="search"
                className="pl-10 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-slate-200/50 dark:border-gray-600/50 focus:bg-white dark:focus:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 rounded-xl"
                disabled={loading || !plans.length}
              />
            </div>

            <div className="flex gap-2">
              {/* View Toggle */}
              <div className="flex border border-slate-200/50 dark:border-gray-600/50 rounded-xl overflow-hidden bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-sm">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-none ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                      : "hover:bg-slate-100 dark:hover:bg-gray-600"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-none ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                      : "hover:bg-slate-100 dark:hover:bg-gray-600"
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200/50 dark:border-gray-600/50 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 shadow-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="alphabetical">A-Z</option>
                <option value="budget">Budget</option>
              </select>

              {user?.role === 'user' && <GeneratePlanButton />}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Moved to top */}
      <div className="lg:px-20 px-6 py-6 bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-950/50 border-b border-slate-200/30 dark:border-gray-700/30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* AI Credits Card */}
          <Card className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-700 -skew-x-12"></div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">AI Credits</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{userCredits.totalCredits}</p>
                    {userCredits.freeCredits > 0 && (
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {userCredits.freeCredits} free
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
              </div>
              <Link
                to="/payments"
                className="text-blue-100 hover:text-white text-xs font-medium mt-2 inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
              >
                Purchase more →
              </Link>
            </CardContent>
          </Card>

          {/* Total Expenses Card */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-slate-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Expenses</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                    ${dashboardStats?.totalExpenses || "0.00"}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </div>
              <Link
                to="/expenses"
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs font-medium mt-2 inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
              >
                View details →
              </Link>
            </CardContent>
          </Card>

          {/* Community Plans Card */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-slate-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Community Plans</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                    {communityPlans.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
              <Link
                to="/community-plans"
                className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-xs font-medium mt-2 inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
              >
                Explore →
              </Link>
            </CardContent>
          </Card>

          {/* Feedback Card */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-slate-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Feedback</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    {userFeedback.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
              </div>
              <Link
                to="/feedback"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-xs font-medium mt-2 inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
              >
                Submit →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 lg:px-20 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Loading your travel plans...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* User's Personal Plans */}
            {finalPlans && finalPlans.length > 0 && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">Your Travel Plans</h2>
                  </div>
                  {searchPlanText && (
                    <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/30 text-xs">
                      {finalPlans.length} results
                    </Badge>
                  )}
                </div>

                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {finalPlans.map((plan, index) => (
                    <div
                      key={plan.id || plan._id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <UnifiedPlanCard 
                        plan={{ ...plan, _id: plan.id || plan._id || "" }} 
                        viewMode={viewMode} 
                        showEditDelete={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Community Plans Section */}
            {shouldShowCommunityPlans && communityPlans.length > 0 && (
              <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">
                      Community Inspiration
                    </h2>
                  </div>
                  <Badge className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30 text-xs animate-pulse-slow">
                    Popular
                  </Badge>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Discover amazing travel plans created by our community
                </p>

                <div
                  className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
                >
                  {communityPlans.slice(0, 6).map((plan, index) => (
                    <div
                      key={plan.id || plan._id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${(index + 3) * 100}ms` }}
                    >
                      <UnifiedPlanCard
                        plan={{ ...plan, _id: plan.id || plan._id || "" }}
                        isPublic={true}
                        viewMode={viewMode}
                      />
                    </div>
                  ))}
                </div>

                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    asChild
                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-slate-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300"
                  >
                    <Link to="/community-plans" className="flex items-center gap-2">
                      <Users className="h-4 w-4 group-hover:animate-bounce" />
                      Explore All Community Plans
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!finalPlans.length && !communityPlans.length && (
              <div className="animate-fade-in-up">
                <ModernNoPlans isLoading={false} />
              </div>
            )}

            {/* Search No Results */}
            {searchPlanText && finalPlans.length === 0 && plans.length > 0 && (
              <div className="text-center py-12 animate-fade-in-up">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <Search className="w-8 h-8 text-slate-500 dark:text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">No plans found</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Try adjusting your search terms or create a new plan
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSearchPlanText("")}
                    className="mt-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-slate-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    Clear Search
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default DashboardPage
