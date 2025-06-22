import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Grid, 
  List, 
  Plus, 
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Share2
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import api from '../lib/api.js';

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/plans');
      setPlans(response.data.plans || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPlans = useCallback(() => {
    let filtered = [...plans];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(plan => 
        plan.nameoftheplace.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.abouttheplace?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(plan => plan.status === filterStatus);
    }

    // Sort plans
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.nameoftheplace.localeCompare(b.nameoftheplace));
        break;
      case 'budget':
        filtered.sort((a, b) => (b.budget || 0) - (a.budget || 0));
        break;
      case 'date':
        filtered.sort((a, b) => new Date(a.fromdate || 0) - new Date(b.fromdate || 0));
        break;
      default:
        break;
    }

    setFilteredPlans(filtered);
  }, [plans, searchTerm, sortBy, filterStatus]);

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    filterAndSortPlans();
  }, [filterAndSortPlans]);

  const deletePlan = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await api.delete(`/api/plans/${planId}`);
        setPlans(plans.filter(plan => plan.id !== planId));
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  const formatDateRange = (fromDate, toDate) => {
    if (!fromDate || !toDate) return 'Dates not set';
    const from = new Date(fromDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const to = new Date(toDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${from} - ${to}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      planning: { color: 'bg-blue-100 text-blue-800', label: 'Planning' },
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      completed: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };
    const config = statusConfig[status] || statusConfig.planning;
    return (
      <Badge className={`${config.color} text-xs`}>
        {config.label}
      </Badge>
    );
  };

  const PlanCard = ({ plan }) => {
    const getImageUrl = (imageUrl) => {
      return imageUrl || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&q=80';
    };

    if (viewMode === 'list') {
      return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
          <div className="flex gap-4 p-4">
            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={getImageUrl(plan.imageurl)}
                alt={plan.nameoftheplace}
                className="w-full h-full object-cover"
                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&q=80'}
              />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {plan.nameoftheplace}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {plan.abouttheplace || 'No description available'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(plan.status)}
                  {plan.is_published && (
                    <Badge className="bg-purple-100 text-purple-800 text-xs">
                      <Share2 className="w-3 h-3 mr-1" />
                      Published
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateRange(plan.fromdate, plan.todate)}</span>
                  </div>
                  {plan.budget && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>${plan.budget.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/plans/${plan.id}/plan`}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deletePlan(plan.id)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="relative">
          <div className="relative h-48 overflow-hidden">
            <img
              src={getImageUrl(plan.imageurl)}
              alt={plan.nameoftheplace}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&q=80'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute top-3 left-3 flex gap-2">
              {getStatusBadge(plan.status)}
              {plan.is_published && (
                <Badge className="bg-purple-500/90 text-white border-0 backdrop-blur-sm">
                  <Share2 className="w-3 h-3 mr-1" />
                  Published
                </Badge>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl font-bold text-white mb-1">
                {plan.nameoftheplace}
              </h3>
              <div className="flex items-center text-white/90 text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDateRange(plan.fromdate, plan.todate)}
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">
            {plan.abouttheplace || 'No description available'}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              {plan.budget && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>${plan.budget.toLocaleString()}</span>
                </div>
              )}
              {plan.views && (
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{plan.views}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to={`/plans/${plan.id}/plan`}>
                <Eye className="w-4 h-4 mr-1" />
                View
              </Link>
            </Button>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => deletePlan(plan.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Travel Plans
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Manage and organize all your travel adventures
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {filteredPlans.length} {filteredPlans.length === 1 ? 'Plan' : 'Plans'}
              </Badge>
              <Button asChild>
                <Link to="/plans/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Plan
                </Link>
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="alphabetical">A-Z</option>
                <option value="budget">Budget</option>
                <option value="date">Travel Date</option>
              </select>

              <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3 py-2 rounded-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3 py-2 rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading your plans...</p>
            </div>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-6xl mb-4">✈️</div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                {searchTerm ? 'No plans found' : 'No travel plans yet'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Start planning your next adventure today!'
                }
              </p>
              {!searchTerm && (
                <Button asChild className="mt-4">
                  <Link to="/plans/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Plan
                  </Link>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredPlans.map((plan, index) => (
              <div
                key={plan.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PlanCard plan={plan} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansPage;
