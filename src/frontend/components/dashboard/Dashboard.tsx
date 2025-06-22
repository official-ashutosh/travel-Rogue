"use client";
import { useEffect, useState } from "react";
import { ModernNoPlans } from "@/src/frontend/components/dashboard/NoPlans";
import { ModernPlanCard } from "@/src/frontend/components/dashboard/PlanCard";
import { GeneratePlanDrawerWithDialog } from "@/frontend/components/shared/DrawerWithDialogGeneric";
import { Input } from "@/frontend/components/ui/input";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  TrendingUp,
  MapPin,
  Calendar,
  Users,
  Star,
  SortAsc,
  SortDesc
} from "lucide-react";

interface Plan {
  id?: string;
  _id?: string;
  nameoftheplace: string;
  startdate?: string;
  enddate?: string;
  fromDate?: string;
  toDate?: string;
  budget?: number;
  status?: string;
  imageUrl?: string;
  tags?: string[];
  description?: string;
  createdAt?: string;
  rating?: number;
  isPublic?: boolean;
  isSharedPlan?: boolean;
  duration?: number;
  travelers?: number;
  views?: number;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'recent' | 'alphabetical' | 'budget' | 'rating';

export default function ModernDashboard() {
  const [searchPlanText, setSearchPlanText] = useState("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [communityPlans, setCommunityPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {    // Mock data for demonstration - replace with real API calls
    const mockPersonalPlans: Plan[] = [
      {
        id: "1",
        _id: "1",
        nameoftheplace: "Tokyo Adventure",
        startdate: "2024-03-15",
        enddate: "2024-03-22",
        fromDate: "2024-03-15",
        toDate: "2024-03-22",
        budget: 2500,
        status: "active",
        imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
        tags: ["Culture", "Food", "Urban"],
        description: "Explore the vibrant culture and amazing food of Tokyo",
        createdAt: "2024-01-15T10:30:00Z",
        rating: 4.8,
        isSharedPlan: false,
        duration: 7,
        travelers: 2,
        views: 152
      },
      {
        id: "2",
        _id: "2",
        nameoftheplace: "Paris Romance",
        startdate: "2024-04-10",
        enddate: "2024-04-17",
        fromDate: "2024-04-10",
        toDate: "2024-04-17",
        budget: 3200,
        status: "planning",
        imageUrl: "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&h=300&fit=crop",
        tags: ["Romance", "Art", "History"],
        description: "A romantic getaway to the City of Light",
        createdAt: "2024-02-01T14:20:00Z",
        rating: 4.6,
        isSharedPlan: true,
        duration: 7,
        travelers: 2,
        views: 89
      },
      {
        id: "3",
        _id: "3",
        nameoftheplace: "Bali Retreat",
        startdate: "2024-05-01",
        enddate: "2024-05-14",
        fromDate: "2024-05-01",
        toDate: "2024-05-14",
        budget: 1800,
        status: "completed",
        imageUrl: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop",
        tags: ["Beach", "Relaxation", "Nature"],
        description: "Peaceful retreat in tropical paradise",
        createdAt: "2024-01-20T09:15:00Z",
        rating: 4.9,
        isSharedPlan: false,
        duration: 14,
        travelers: 1,
        views: 203
      }
    ];    
    const mockCommunityPlans: Plan[] = [
      {
        _id: "c1",
        nameoftheplace: "Swiss Alps Explorer",
        startdate: "2024-06-01",
        enddate: "2024-06-10",
        fromDate: "2024-06-01",
        toDate: "2024-06-10",
        budget: 2800,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        tags: ["Adventure", "Mountains", "Nature"],
        description: "Epic mountain adventure in Switzerland",
        rating: 4.7,
        isPublic: true,
        isSharedPlan: true,
        duration: 9,
        travelers: 4,
        views: 567
      },
      {
        _id: "c2",
        nameoftheplace: "NYC Food Tour",
        startdate: "2024-07-15",
        enddate: "2024-07-20",
        fromDate: "2024-07-15",
        toDate: "2024-07-20",
        budget: 2100,
        imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
        tags: ["Food", "Urban", "Culture"],
        description: "Culinary journey through New York City",
        rating: 4.5,
        isPublic: true,
        isSharedPlan: true,
        duration: 5,
        travelers: 2,
        views: 423
      }
    ];

    // Simulate loading delay
    setTimeout(() => {
      setPlans(mockPersonalPlans);
      setCommunityPlans(mockCommunityPlans);
      setLoading(false);
    }, 1000);
  }, []);

  const sortPlans = (plansToSort: Plan[], sortOption: SortOption): Plan[] => {
    const sorted = [...plansToSort];
    switch (sortOption) {
      case 'recent':
        return sorted.sort((a, b) => 
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchPlanText(value);
    if (!plans || !plans.length) {
      return;
    }
    if (!value) {
      setFilteredPlans(undefined);
      return;
    }
    const filteredResults = plans.filter((plan) => {
      return plan.nameoftheplace.toLowerCase().includes(value.toLowerCase()) ||
             plan.tags?.some(tag => tag.toLowerCase().includes(value.toLowerCase())) ||
             plan.description?.toLowerCase().includes(value.toLowerCase());
    });
    setFilteredPlans(filteredResults);
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'planning': return 'secondary'; 
      case 'completed': return 'outline';
      default: return 'secondary';
    }
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
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="alphabetical">A-Z</option>
                <option value="budget">Budget</option>
                <option value="rating">Rating</option>
              </select>

              <GeneratePlanDrawerWithDialog />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 lg:px-20 py-8">
        {loading ? (
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
                  {finalPlans.map((plan, index) => (                    <div
                      key={plan.id || plan._id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <ModernPlanCard 
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
                  {communityPlans.map((plan, index) => (
                    <div
                      key={plan._id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${(index + 3) * 100}ms` }}
                    >                      <ModernPlanCard 
                        plan={{ ...plan, _id: plan._id || '' }} 
                        isPublic={true} 
                        viewMode={viewMode}
                      />
                    </div>
                  ))}
                </div>

                <div className="text-center pt-4">
                  <Button variant="outline" asChild className="group">
                    <a href="/community-plans" className="flex items-center gap-2">
                      <Users className="h-4 w-4 group-hover:animate-bounce" />
                      Explore All Community Plans
                    </a>
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
}
