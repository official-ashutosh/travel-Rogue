import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import { 
  Users, 
  MapPin, 
  DollarSign, 
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Calendar,
  Eye,
  Settings,
  Shield
} from 'lucide-react';
import { 
  useDashboard
} from '../../hooks/useApiHooks.js';
import { 
  userAPI, 
  feedbackAPI,
  plansAPI 
} from '../../lib/api.js';

const AdminDashboard = () => {
  const {
    stats,
    loading,
    error,
    fetchAdminStats
  } = useDashboard();

  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [publicPlans, setPublicPlans] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    fetchAdminStats();
    loadAdminData();
  }, [fetchAdminStats]);

  const loadAdminData = async () => {
    try {
      setLoadingData(true);
      
      // Fetch all users
      const usersResponse = await userAPI.getAllUsers();
      setUsers(usersResponse.data || []);
      
      // Fetch all feedback
      const feedbackResponse = await feedbackAPI.getAllFeedback();
      setFeedback(feedbackResponse.data || []);
      
      // Fetch public plans
      const plansResponse = await plansAPI.getPublicPlans();
      setPublicPlans(plansResponse.data || []);
      
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const addCreditsToUser = async (userId, amount) => {
    try {
      await userAPI.addCredits(userId, amount);
      alert(`Successfully added ${amount} credits to user`);
      loadAdminData(); // Refresh data
    } catch (err) {
      alert('Failed to add credits: ' + err.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading admin dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, plans, and system settings</p>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          System Settings
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-red-600 p-3 bg-red-50 rounded-md border border-red-200">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats?.totalUsers || users.length}
                </p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  {stats?.userGrowth || '+12%'} this month
                </div>
              </div>
              <Users className="h-12 w-12 text-blue-600 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Travel Plans</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats?.totalPlans || publicPlans.length}
                </p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  {stats?.planGrowth || '+8%'} this week
                </div>
              </div>
              <MapPin className="h-12 w-12 text-green-600 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-purple-600">
                  ${stats?.totalRevenue || '12,450'}
                </p>
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <TrendingDown className="h-3 w-3" />
                  {stats?.revenueChange || '-3%'} from last month
                </div>
              </div>
              <DollarSign className="h-12 w-12 text-purple-600 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Feedback</p>
                <p className="text-3xl font-bold text-orange-600">
                  {feedback.length}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MessageSquare className="h-3 w-3" />
                  {feedback.filter(f => !f.reviewed).length} unreviewed
                </div>
              </div>
              <MessageSquare className="h-12 w-12 text-orange-600 opacity-75" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingData ? (
            <div className="text-center py-4">Loading users...</div>
          ) : (
            <div className="space-y-4">
              {users.slice(0, 10).map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-medium text-blue-600">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {user.credits || 0} credits
                      </div>
                      <div className="text-xs text-gray-500">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addCreditsToUser(user.id, 10)}
                      >
                        +10 Credits
                      </Button>
                      <Badge 
                        variant={user.status === 'active' ? 'success' : 'secondary'}
                      >
                        {user.status || 'Active'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          {feedback.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No feedback received yet
            </div>
          ) : (
            <div className="space-y-4">
              {feedback.slice(0, 5).map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.user_name || 'Anonymous'}</span>
                      <Badge variant="outline">
                        {item.type || 'General'}
                      </Badge>
                      {item.rating && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              className={`text-sm ${
                                i < item.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">
                    {item.message || item.feedback}
                  </p>
                  {!item.reviewed && (
                    <Button size="sm" className="mt-2">
                      Mark as Reviewed
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Popular Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Popular Public Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          {publicPlans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No public plans available
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicPlans.slice(0, 6).map((plan) => (
                <div key={plan.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium truncate">{plan.title || plan.nameoftheplace}</h3>
                    <Badge variant="outline" className="text-xs">
                      Public
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {plan.description || plan.abouttheplace}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {plan.views || 0} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(plan.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
