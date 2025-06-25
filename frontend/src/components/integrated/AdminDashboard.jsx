"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Grid,
  List,
  Users,
  MapPin,
  MessageSquare,
  Shield,
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Plus,
  Download,
  BarChart3,
  Globe,
  AlertTriangle,
  Clock,
  DollarSign,
  RefreshCw,
  Filter,
} from "lucide-react"
import { Button } from "../ui/Button.jsx"
import { Input } from "../ui/Input.jsx"
import { Badge } from "../ui/Badge.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card.jsx"
import UnifiedPlanCard from "../ui/UnifiedPlanCard.jsx"
import { userAPI, plansAPI, feedbackAPI, dashboardAPI } from "../../lib/api.js"

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchText, setSearchText] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [filterStatus, setFilterStatus] = useState("all")
  const [users, setUsers] = useState([])
  const [plans, setPlans] = useState([])
  const [feedback, setFeedback] = useState([])
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalPlans: 0,
    communityPlans: 0,
    pendingFeedback: 0,
    totalRevenue: 0,
    activeUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  const refreshData = async () => {
    try {
      const [statsResponse, usersResponse, plansResponse, feedbackResponse] = await Promise.all([
        dashboardAPI.getAdminStats().catch(() => null),
        userAPI.getAllUsers().catch(() => null),
        plansAPI.getAllPlans().catch(() => null),
        feedbackAPI.getAllFeedback().catch(() => null)
      ])

      if (statsResponse) {
        const stats = statsResponse.data?.data?.stats?.overview || statsResponse.data?.stats?.overview || {};
        setAdminStats({
          totalUsers: stats.totalUsers || 0,
          totalPlans: stats.totalPlans || 0,
          communityPlans: stats.publicPlans || 0,
          pendingFeedback: stats.pendingFeedback || 0,
          totalRevenue: stats.totalRevenue || 0,
          activeUsers: stats.activeUsers || 0,
        })
      }

      if (usersResponse) {
        console.log('Refresh users response:', usersResponse) // Debug log
        const usersData = usersResponse.data?.data?.users || usersResponse.data?.users || []
        setUsers(Array.isArray(usersData) ? usersData : [])
      }

      if (plansResponse) {
        const plansData = plansResponse.data?.data?.plans || plansResponse.data?.plans || []
        setPlans(Array.isArray(plansData) ? plansData : [])
      }

      if (feedbackResponse) {
        const feedbackData = feedbackResponse.data?.data?.feedback || feedbackResponse.data?.feedback || []
        setFeedback(Array.isArray(feedbackData) ? feedbackData : [])
      }
    } catch (error) {
      console.error('Error refreshing data:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        try {
          const statsResponse = await dashboardAPI.getAdminStats()
          const stats = statsResponse.data?.data?.stats?.overview || statsResponse.data?.stats?.overview || {};
          setAdminStats({
            totalUsers: stats.totalUsers || 0,
            totalPlans: stats.totalPlans || 0,
            communityPlans: stats.publicPlans || 0,
            pendingFeedback: stats.pendingFeedback || 0,
            totalRevenue: stats.totalRevenue || 0,
            activeUsers: stats.activeUsers || 0,
          })
        } catch (error) {
          console.error("Error fetching admin stats:", error)
        }

        try {
          const usersResponse = await userAPI.getAllUsers()
          const usersData = usersResponse.data?.data?.users || usersResponse.data?.users || []
          console.log('Parsed users:', usersData) // Debug log
          setUsers(Array.isArray(usersData) ? usersData : [])
        } catch (error) {
          console.error("Error fetching users:", error)
          setUsers([])
        }

        // Fetch plans
        try {
          const plansResponse = await plansAPI.getAllPlans()
          console.log('Plans response:', plansResponse) // Debug log
          console.log('Plans data:', plansResponse.data) // Debug log
          const plansData = plansResponse.data?.data?.plans || plansResponse.data?.plans || []
          console.log('Parsed plans:', plansData) // Debug log
          setPlans(Array.isArray(plansData) ? plansData : [])
        } catch (error) {
          console.error("Error fetching plans:", error)
          setPlans([])
        }

        // Fetch feedback
        try {
          const feedbackResponse = await feedbackAPI.getAllFeedback()
          console.log('Feedback response:', feedbackResponse) // Debug log
          console.log('Feedback data:', feedbackResponse.data) // Debug log
          const feedbackData = feedbackResponse.data?.data?.feedback || feedbackResponse.data?.feedback || []
          console.log('Parsed feedback:', feedbackData) // Debug log
          setFeedback(Array.isArray(feedbackData) ? feedbackData : [])
        } catch (error) {
          console.error("Error fetching feedback:", error)
          setFeedback([])
        }

      } catch (error) {
        console.error("Error fetching admin data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = (e) => {
    setSearchText(e.target.value)
  }

  // Filter functions
  const getFilteredUsers = () => {
    if (!Array.isArray(users)) return [];
    return users.filter(user => {
      const matchesSearch = 
        user.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchText.toLowerCase())
      
      return matchesSearch
    })
  }

  const getFilteredPlans = () => {
    if (!Array.isArray(plans)) return [];
    return plans.filter(plan => {
      const matchesSearch = 
        plan.nameoftheplace?.toLowerCase().includes(searchText.toLowerCase()) ||
        plan.abouttheplace?.toLowerCase().includes(searchText.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || plan.status === filterStatus
      
      return matchesSearch && matchesStatus
    })
  }

  const getFilteredFeedback = () => {
    if (!Array.isArray(feedback)) return [];
    return feedback.filter(item => {
      const matchesSearch = 
        item.subject?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.message?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.userId?.email?.toLowerCase().includes(searchText.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'high' && item.priority === 'high') ||
        item.status === filterStatus
      
      return matchesSearch && matchesStatus
    })
  }

  const handleUserAction = async (action, user) => {
    try {
      switch (action) {
        case 'suspend':
          await userAPI.updateUserStatus(user._id, 'suspended')
          await refreshData()
          alert(`User ${user.firstName} ${user.lastName} has been suspended.`)
          break
        case 'activate':
          await userAPI.updateUserStatus(user._id, 'active')
          await refreshData()
          alert(`User ${user.firstName} ${user.lastName} has been activated.`)
          break
        case 'delete':
          if (window.confirm(`Are you sure you want to delete user ${user.firstName} ${user.lastName}? This action cannot be undone.`)) {
            await userAPI.deleteUser(user._id)
            await refreshData()
            alert(`User ${user.firstName} ${user.lastName} has been deleted.`)
          }
          break
        case 'view':
          // Navigate to user details or show modal
          alert(`Viewing details for ${user.firstName} ${user.lastName}`)
          break
        default:
          console.log(`${action} user:`, user)
      }
    } catch (error) {
      console.error(`Error performing ${action} on user:`, error)
      alert(`Failed to ${action} user. Please try again.`)
    }
  }

  const handlePlanAction = async (action, plan) => {
    try {
      switch (action) {
        case 'approve':
          await plansAPI.updatePlanStatus(plan._id, 'published')
          await refreshData()
          alert(`Plan "${plan.nameoftheplace}" has been approved and published.`)
          break
        case 'reject':
          await plansAPI.updatePlanStatus(plan._id, 'rejected')
          await refreshData()
          alert(`Plan "${plan.nameoftheplace}" has been rejected.`)
          break
        case 'delete':
          if (window.confirm(`Are you sure you want to delete the plan "${plan.nameoftheplace}"? This action cannot be undone.`)) {
            await plansAPI.deletePlanAdmin(plan._id)
            await refreshData()
            alert(`Plan "${plan.nameoftheplace}" has been deleted.`)
          }
          break
        case 'feature':
          await plansAPI.updatePlanStatus(plan._id, 'featured')
          await refreshData()
          alert(`Plan "${plan.nameoftheplace}" has been featured.`)
          break
        default:
          console.log(`${action} plan:`, plan)
      }
    } catch (error) {
      console.error(`Error performing ${action} on plan:`, error)
      alert(`Failed to ${action} plan. Please try again.`)
    }
  }

  const handleFeedbackAction = async (action, feedbackItem) => {
    try {
      switch (action) {
        case 'resolve':
          await feedbackAPI.updateFeedbackStatus(feedbackItem._id, 'resolved')
          await refreshData()
          alert(`Feedback "${feedbackItem.subject}" has been marked as resolved.`)
          break
        case 'respond':
          const response = prompt(`Enter your response to "${feedbackItem.subject}":`)
          if (response) {
            await feedbackAPI.respondToFeedback(feedbackItem._id, response)
            alert(`Response sent to ${feedbackItem.userId?.email || 'user'}.`)
          }
          break
        case 'delete':
          if (window.confirm(`Are you sure you want to delete this feedback? This action cannot be undone.`)) {
            await feedbackAPI.deleteFeedback(feedbackItem._id)
            await refreshData()
            alert('Feedback has been deleted.')
          }
          break
        case 'priority':
          const priority = prompt('Enter priority (high, medium, low):')
          if (priority && ['high', 'medium', 'low'].includes(priority)) {
            await feedbackAPI.updateFeedback(feedbackItem._id, { priority })
            await refreshData()
            alert(`Priority updated to ${priority}.`)
          }
          break
        default:
          console.log(`${action} feedback:`, feedbackItem)
      }
    } catch (error) {
      console.error(`Error performing ${action} on feedback:`, error)
      alert(`Failed to ${action} feedback. Please try again.`)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color:
          "bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/30",
        label: "Active",
      },
      suspended: {
        color:
          "bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-700 dark:text-red-300 border-red-200/50 dark:border-red-800/30",
        label: "Suspended",
      },
      pending: {
        color:
          "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/30",
        label: "Pending",
      },
      published: {
        color:
          "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/30",
        label: "Published",
      },
    }
    const config = statusConfig[status] || statusConfig.pending
    return <Badge className={`${config.color} text-xs border`}>{config.label}</Badge>
  }

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: {
        color:
          "bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-700 dark:text-red-300 border-red-200/50 dark:border-red-800/30",
        label: "High",
      },
      medium: {
        color:
          "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/30",
        label: "Medium",
      },
      low: {
        color:
          "bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/30",
        label: "Low",
      },
    }
    const config = priorityConfig[priority] || priorityConfig.medium
    return <Badge className={`${config.color} text-xs border`}>{config.label}</Badge>
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-700 -skew-x-12"></div>
          <CardContent className="p-4 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold">{(adminStats.totalUsers || 0).toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-slate-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Plans</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  {(adminStats.totalPlans || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <MapPin className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-slate-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Community Plans</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                  {adminStats.communityPlans || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <Globe className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-slate-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Pending Feedback</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  {adminStats.pendingFeedback || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-slate-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
                  ${(adminStats.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-slate-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Active Users</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  {adminStats.activeUsers || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border border-slate-200/50 dark:border-gray-700/50 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
          <CardHeader className="border-b border-slate-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              Recent User Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {getFilteredUsers().slice(0, 3).map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-950/30 dark:to-blue-950/30 rounded-xl border border-slate-200/50 dark:border-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Last login: {formatDate(user.lastLogin)}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(user.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/50 dark:border-gray-700/50 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
          <CardHeader className="border-b border-slate-200/50 dark:border-gray-700/50 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/30">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Plans awaiting approval</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">2 community plans need review</p>
                </div>
                <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/30">
                  2
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border border-purple-200/50 dark:border-purple-800/30">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Feedback to review</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">High priority issues pending</p>
                </div>
                <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/30">
                  {adminStats.pendingFeedback || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">User Management</h2>
        <div className="flex gap-2">
          <Button 
            onClick={exportUsers}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </Button>
          <Button 
            onClick={refreshData}
            variant="outline"
            className="border-blue-200 hover:bg-blue-50 text-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {getFilteredUsers().map((user) => (
          <Card
            key={user._id}
            className="border border-slate-200/50 dark:border-gray-700/50 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-md">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                      <span>Joined: {formatDate(user.createdAt)}</span>
                      <span>Plans: {user.plansCount}</span>
                      <span>Last login: {formatDate(user.lastLogin)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(user.status)}
                  <Badge
                    className={
                      user.subscription === "premium"
                        ? "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/30"
                        : "bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-900/30 dark:to-gray-900/30 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-gray-800/30"
                    }
                  >
                    {user.subscription}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUserAction("view", user)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {user.status === 'active' ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUserAction("suspend", user)}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-700"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUserAction("activate", user)}
                        className="bg-green-100 hover:bg-green-200 text-green-700"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUserAction("delete", user)}
                      className="bg-red-100 hover:bg-red-200 text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderPlans = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Plans Management</h2>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200/50 dark:border-gray-600/50 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 shadow-sm"
          >
            <option value="all">All Plans</option>
            <option value="pending">Pending</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
            <option value="featured">Featured</option>
          </select>
          <Button 
            onClick={refreshData}
            variant="outline"
            className="border-green-200 hover:bg-green-50 text-green-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={handleAddCommunityPlan}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Community Plan
          </Button>
        </div>
      </div>

      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {getFilteredPlans().map((plan) => {
          console.log('Admin plan data:', plan); // Debug log to see plan structure
          return (
            <div key={plan._id} className="relative">
              <UnifiedPlanCard
                plan={plan}
                viewMode={viewMode}
                isPublic={plan.isPublic}
              />
              <div className="absolute top-3 left-3 z-10">{getStatusBadge(plan.status)}</div>
              {plan.status === "pending" && (
                <div className="absolute top-3 right-3 z-10 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handlePlanAction("approve", plan)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handlePlanAction("reject", plan)}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-md"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {plan.status === "published" && (
                <div className="absolute top-3 right-3 z-10 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handlePlanAction("feature", plan)}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handlePlanAction("delete", plan)}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {(plan.status === "rejected" || plan.status === "featured") && (
                <div className="absolute top-3 right-3 z-10 flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handlePlanAction("delete", plan)}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )

  const renderFeedback = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Feedback Management</h2>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200/50 dark:border-gray-600/50 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 shadow-sm"
          >
            <option value="all">All Feedback</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="high">High Priority</option>
          </select>
          <Button 
            onClick={refreshData}
            variant="outline"
            className="border-purple-200 hover:bg-purple-50 text-purple-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {getFilteredFeedback().map((item) => (
          <Card
            key={item._id}
            className="border border-slate-200/50 dark:border-gray-700/50 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-900 dark:text-white">{item.subject}</h3>
                      {getPriorityBadge(item.priority)}
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{item.message}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span>
                        From: {item.userId.firstName} {item.userId.lastName}
                      </span>
                      <span>Email: {item.userId.email}</span>
                      <span>Date: {formatDate(item.createdAt)}</span>
                      <Badge className="bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/30">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleFeedbackAction("respond", item)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Respond
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleFeedbackAction("resolve", item)}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFeedbackAction("priority", item)}
                      className="border-orange-200 hover:bg-orange-50 text-orange-700"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Priority
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFeedbackAction("delete", item)}
                      className="border-red-200 hover:bg-red-50 text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // Export functionality
  const exportUsers = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,First Name,Last Name,Email,Status,Subscription,Created At,Last Login\n"
      + getFilteredUsers().map(user => 
          `${user._id},${user.firstName},${user.lastName},${user.email},${user.status},${user.subscription || 'free'},${user.createdAt},${user.lastLogin || 'Never'}`
        ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle admin actions
  const handleAddCommunityPlan = () => {
    // This could open a modal or navigate to a plan creation page
    alert('Feature to add community plan will be implemented. For now, users can create plans that admins can approve.')
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "plans", label: "Plans", icon: MapPin },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
  ]

  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 w-full min-h-screen flex-1 flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-slate-200/50 dark:border-gray-700/50 sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center lg:px-20 px-6 py-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 dark:from-red-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <Badge className="bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-700 dark:text-red-300 border border-red-200/50 dark:border-red-800/30 animate-pulse-slow">
                Administrator
              </Badge>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
              Manage users, plans, community content, and platform feedback
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                onChange={handleSearch}
                value={searchText}
                placeholder="Search users, plans, feedback..."
                type="search"
                className="pl-10 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-slate-200/50 dark:border-gray-600/50 focus:bg-white dark:focus:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 rounded-xl"
              />
            </div>

            {(activeTab === "plans" || activeTab === "users") && (
              <div className="flex gap-2">
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
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="lg:px-20 px-6 pb-4">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                      : "hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 lg:px-20 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Loading admin data...</p>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            {activeTab === "overview" && renderOverview()}
            {activeTab === "users" && renderUsers()}
            {activeTab === "plans" && renderPlans()}
            {activeTab === "feedback" && renderFeedback()}
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminDashboardPage
