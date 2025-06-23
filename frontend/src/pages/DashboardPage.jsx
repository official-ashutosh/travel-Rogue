import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Grid, 
  List, 
  TrendingUp,
  MapPin,
  Users
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import ModernPlanCard from '../components/dashboard/ModernPlanCard.jsx';
import ModernNoPlans from '../components/dashboard/ModernNoPlans.jsx';
import GeneratePlanButton from '../components/GeneratePlanButton.jsx';
import api from '../lib/api.js';

const DashboardPage = () => {
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
    });    setFilteredPlans(filteredResults);
  };

  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 w-full min-h-screen flex-1 flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center lg:px-20 px-6 py-6">
          {/* Title and Stats */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Your Travel Dashboard
              </h1>
              {!loading && (
                <Badge variant="outline" className="animate-pulse-slow">
                  {plans.length} Plans
                </Badge>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
              Manage your travel plans and discover new adventures
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
                className="pl-10 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200"
                disabled={loading || !plans.length}
              />
            </div>
            
            <div className="flex gap-2">
              {/* View Toggle */}
              <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
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

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="alphabetical">A-Z</option>
                <option value="budget">Budget</option>
                <option value="rating">Rating</option>
              </select>

              <GeneratePlanButton />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 lg:px-20 py-8">        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading your travel plans...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* User's Personal Plans */}
            {finalPlans && finalPlans.length > 0 && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-xl lg:text-2xl font-semibold text-slate-800 dark:text-slate-200">
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
                  {finalPlans.map((plan, index) => (
                    <div
                      key={plan.id || plan._id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >                      <ModernPlanCard 
                        plan={{ ...plan, _id: plan.id || plan._id || '' }} 
                        viewMode={viewMode}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Community Plans Section */}
            {shouldShowCommunityPlans && communityPlans.length > 0 && (
              <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    <h2 className="text-xl lg:text-2xl font-semibold text-slate-800 dark:text-slate-200">
                      Community Inspiration
                    </h2>
                  </div>
                  <Badge variant="secondary" className="text-xs animate-pulse-slow">
                    Popular
                  </Badge>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Discover amazing travel plans created by our community
                </p>

                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }>
                  {communityPlans.slice(0, 6).map((plan, index) => (
                    <div
                      key={plan.id || plan._id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${(index + 3) * 100}ms` }}
                    >                      <ModernPlanCard 
                        plan={{ ...plan, _id: plan.id || plan._id || '' }} 
                        isPublic={true} 
                        viewMode={viewMode}
                      />
                    </div>
                  ))}
                </div>

                <div className="text-center pt-4">
                  <Button variant="outline" asChild className="group">
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
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                    No plans found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
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
    </section>
  );
};

export default DashboardPage;
