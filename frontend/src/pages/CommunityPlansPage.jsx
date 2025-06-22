import React, { useState, useEffect } from 'react';
import { Search, Grid, List, Users, MapPin, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import PlanCard from '../components/dashboard/PlanCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import api from '../lib/api.js';
import { cn } from '../lib/utils.js';

// Empty Plans Illustration Component
function EmptyPlansIllustration({ className }) {
  return (
    <svg
      viewBox="0 0 839 559"
      className={cn("h-48 w-48 text-primary/20", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M634.5 206H563V274.5H634.5V206Z"
        fill="currentColor"
        className="opacity-50"
      />
      <path
        d="M653.5 343H582V411.5H653.5V343Z"
        fill="currentColor"
        className="opacity-30"
      />
      <path
        d="M388.5 133H317V201.5H388.5V133Z"
        fill="currentColor"
        className="opacity-30"
      />
      <path
        d="M475.096 282.603C433.404 282.603 399.5 316.507 399.5 358.199C399.5 399.891 433.404 433.795 475.096 433.795C516.788 433.795 550.692 399.891 550.692 358.199C550.692 316.507 516.788 282.603 475.096 282.603Z"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-50"
      />
      <path
        d="M522.5 358.199L496 344.199V372.199L522.5 358.199Z"
        fill="currentColor"
        className="opacity-50"
      />
    </svg>
  );
}

// No Plans Found Component
function NoPlansFound() {
  return (
    <div className="mx-auto w-full max-w-lg p-8 text-center">
      <div className="mb-6 flex justify-center">
        <EmptyPlansIllustration className="animate-pulse" />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          No Community Plans Found
        </h2>

        <p className="text-muted-foreground">
          There are no published community plans yet. Be the first to share your travel adventure!
        </p>
      </div>

      <div className="mt-6">
        <Button className="bg-blue-600 hover:bg-blue-700">
          Create & Share Your Plan
        </Button>
      </div>
    </div>
  );
}

// Loading Plans Component
function LoadingPlans() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-6 gap-5 px-4 py-2">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </Card>
      ))}
    </div>
  );
}

const CommunityPlansPage = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [status, setStatus] = useState("LoadingFirstPage");
  const [offset, setOffset] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState('grid');
  const limit = 12;

  const fetchPlans = async (append = false) => {
    setStatus(append ? "CanLoadMore" : "LoadingFirstPage");
    try {
      const response = await api.get(`/community-plans?offset=${append ? offset : 0}&limit=${limit}`);
      if (response.data && response.data.plans) {
        const plans = response.data.plans;
        if (append) {
          setResults(prev => [...prev, ...plans]);
        } else {
          setResults(plans);
        }
        setOffset((prev) => (append ? prev + plans.length : plans.length));
        setStatus(plans.length < limit ? "Exhausted" : "CanLoadMore");
      } else {
        setStatus("Exhausted");
      }
    } catch (error) {
      console.error('Error fetching community plans:', error);
      setStatus("Exhausted");
    }
  };

  useEffect(() => {
    fetchPlans(false);
  }, []);

  useEffect(() => {
    if (!searchText) {
      setFilteredResults(results);
    } else {
      const filtered = results.filter(plan =>
        plan.nameoftheplace.toLowerCase().includes(searchText.toLowerCase()) ||
        plan.abouttheplace?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredResults(filtered);
    }
  }, [searchText, results]);

  const loadMore = () => {
    fetchPlans(true);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const noPlansToShow = filteredResults && filteredResults.length === 0 && status !== "LoadingFirstPage";
  return (
    <main className="flex min-h-[calc(100svh-4rem)] flex-col items-center bg-blue-50/40 dark:bg-gray-900 transition-colors">
      <div className="w-full lg:px-20 px-5 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Community Plans
            </h1>
          </div>
          <p className="text-muted-foreground dark:text-gray-400 mb-6">
            Discover amazing travel plans shared by fellow travellers around the world
          </p>

          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />              <Input
                onChange={handleSearch}
                value={searchText}
                placeholder="Search destinations, activities..."
                type="search"
                className="pl-10 bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="flex gap-2">
              <div className="flex border border-slate-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3 py-2 rounded-none dark:text-white"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3 py-2 rounded-none dark:text-white"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          {results.length > 0 && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>{results.length} plans shared</span>
              </div>
              {searchText && (
                <Badge variant="outline">
                  {filteredResults.length} results for "{searchText}"
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {status === "LoadingFirstPage" && <LoadingPlans />}
        
        {filteredResults && filteredResults.length > 0 && (
          <div className="space-y-6">
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {filteredResults.map((plan) => (
                <PlanCard 
                  key={plan.id || plan._id} 
                  plan={plan} 
                  isPublic={true}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {status === "CanLoadMore" && (
              <div className="text-center pt-6">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full"
                  onClick={loadMore}
                >
                  Load More Plans
                </Button>
              </div>
            )}
          </div>
        )}

        {noPlansToShow && <NoPlansFound />}
      </div>
    </main>
  );
};

export default CommunityPlansPage;
