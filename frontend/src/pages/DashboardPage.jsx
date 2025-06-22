import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Grid, 
  List, 
  TrendingUp,
  MapPin,
  Users,
  Plus,
  Calendar,
  Clock,
  Star,
  DollarSign
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import PlanCard from '../components/dashboard/PlanCard.jsx';
import NoPlans from '../components/dashboard/NoPlans.jsx';
import GeneratePlanButton from '../components/GeneratePlanButton.jsx';
import api from '../lib/api.js';

const DashboardPage = () => {
  const { user } = useAuth();
  const [searchPlanText, setSearchPlanText] = useState("");
  const [plans, setPlans] = useState([]);
  const [communityPlans, setCommunityPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchPlans();
    fetchCommunityPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/plans');
      setPlans(response.data.plans || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityPlans = async () => {
    try {
      const response = await api.get('/community-plans');
      setCommunityPlans(response.data.plans || []);
    } catch (error) {
      console.error('Error fetching community plans:', error);
      setCommunityPlans([]);
    }
  };

  const sortPlans = (plansToSort, sortOption) => {
    const sorted = [...plansToSort];
    switch (sortOption) {
      case 'recent':
        return sorted.sort((a, b) => 
          new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        );
      case 'alphabetical':
        return sorted.sort((a, b) => 
          a.nameoftheplace.localeCompare(b.nameoftheplace)
        );
      case 'budget':
        return sorted.sort((a, b) => (b.budget || 0) - (a.budget || 0));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  };

  const getFilteredAndSortedPlans = () => {
    let plansToProcess = filteredPlans ?? plans;
    return sortPlans(plansToProcess, sortBy);
  };

  const finalPlans = getFilteredAndSortedPlans();
  const shouldShowCommunityPlans = !loading && plans.length < 5;

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchPlanText(value);
    if (!plans || !plans.length) {
      return;
    }
    if (!value) {
      setFilteredPlans(null);
      return;
    }
    const filteredResults = plans.filter((plan) => {
      return plan.nameoftheplace.toLowerCase().includes(value.toLowerCase()) ||
             plan.abouttheplace?.toLowerCase().includes(value.toLowerCase());
    });
    setFilteredPlans(filteredResults);
  };

  const getTotalBudget = () => {
    return plans.reduce((total, plan) => total + (plan.budget || 0), 0);
  };

  const getActivePlans = () => {
    return plans.filter(plan => {
      const endDate = new Date(plan.todate || plan.enddate);
      return endDate >= new Date();
    }).length;
  };

  const getTotalDestinations = () => {
    const destinations = new Set(plans.map(plan => plan.nameoftheplace));
    return destinations.size;
  };  return (
    <main className="flex min-h-[calc(100svh-4rem)] flex-col items-center bg-blue-50/40 dark:bg-gray-900 transition-colors">
      <div className="w-full lg:px-20 px-5 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center">            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                Your Travel Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Plan your next adventure and manage your trips
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <GeneratePlanButton />
              <Link to="/plans/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Plan
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                onChange={handleSearch}
                value={searchPlanText}
                placeholder="Search plans, destinations..."
                type="search"
                className="pl-10 bg-white border-slate-200"
                disabled={loading || !plans.length}
              />
            </div>
            
            <div className="flex gap-2">
              <div className="flex border border-slate-200 rounded-lg overflow-hidden">
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

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="alphabetical">A-Z</option>
                <option value="budget">Budget</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600">Loading your travel plans...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Cards */}
            {plans.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{plans.length}</div>
                    <p className="text-xs text-muted-foreground">Plans created</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{getActivePlans()}</div>
                    <p className="text-xs text-muted-foreground">Upcoming trips</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${getTotalBudget().toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Planned expenses</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Destinations</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{getTotalDestinations()}</div>
                    <p className="text-xs text-muted-foreground">Cities planned</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* User's Personal Plans */}
            {finalPlans && finalPlans.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-slate-800">
                      Your Travel Plans
                    </h2>
                  </div>
                  {searchPlanText && (
                    <Badge variant="outline" className="text-xs">
                      {finalPlans.length} results
                    </Badge>
                  )}
                </div>

                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }>
                  {finalPlans.map((plan) => (
                    <PlanCard 
                      key={plan.id}
                      plan={plan} 
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Community Plans Section */}
            {shouldShowCommunityPlans && communityPlans.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                  <h2 className="text-xl font-semibold text-slate-800">
                    Community Inspiration
                  </h2>
                  <Badge variant="secondary" className="text-xs">
                    Popular
                  </Badge>
                </div>
                
                <p className="text-slate-600 text-sm">
                  Discover amazing travel plans created by our community
                </p>

                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }>
                  {communityPlans.slice(0, 6).map((plan) => (
                    <PlanCard 
                      key={plan.id}
                      plan={plan} 
                      isPublic={true} 
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                <div className="text-center pt-4">
                  <Button variant="outline" asChild>
                    <Link to="/community-plans" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Explore All Community Plans
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!finalPlans.length && !communityPlans.length && (
              <NoPlans isLoading={false} />
            )}

            {/* Search No Results */}
            {searchPlanText && finalPlans.length === 0 && plans.length > 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    No plans found
                  </h3>
                  <p className="text-slate-600">
                    Try adjusting your search terms or create a new plan
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchPlanText("")}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default DashboardPage;
