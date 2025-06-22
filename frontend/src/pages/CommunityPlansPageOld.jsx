import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import PlanCard from '../components/dashboard/PlanCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
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
        d="M275.5 343H204V411.5H275.5V343Z"
        fill="currentColor"
        className="opacity-50"
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
      <path
        d="M209.5 230.5V297C209.5 314.5 223.5 328.5 241 328.5H307"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-50"
      />
      <path
        d="M633 297V230.5C633 213 619 199 601.5 199H535.5"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-50"
      />
    </svg>
  );
}

// No Plans Found Component
function NoPlansFound() {
  return (
    <Card className="mx-auto w-full h-[600px] flex-grow p-8 text-center animate-fade-in">
      <div className="mb-6 flex justify-center">
        <EmptyPlansIllustration className="animate-pulse" />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          🔍 Let's Try Again Together!
        </h2>

        <p className="text-muted-foreground">
          Explore new public plans by updating your filters.
        </p>
      </div>

      <div className="mt-6 text-sm text-muted-foreground/60">
        <p>
          Psst... even astronauts need to adjust their trajectory sometimes 🚀
        </p>
      </div>
    </Card>
  );
}

const CommunityPlansPage = () => {
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("LoadingFirstPage");
  const [offset, setOffset] = useState(0);
  const limit = 8;

  const fetchPlans = async (append = false) => {
    setStatus(append ? "CanLoadMore" : "LoadingFirstPage");
    try {
      const res = await fetch(`/api/community-plans?offset=${append ? offset : 0}&limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        const plans = data.plans || [];
        if (append) {
          setResults((prev) => [...prev, ...plans]);
        } else {
          setResults(plans);
        }
        setOffset((prev) => (append ? prev + plans.length : plans.length));
        setStatus(plans.length < limit ? "Exhausted" : "CanLoadMore");
      } else {
        setStatus("Exhausted");
      }
    } catch {
      setStatus("Exhausted");
    }
  };
  useEffect(() => {
    const initialFetch = async () => {
      setStatus("LoadingFirstPage");
      try {
        const res = await fetch(`/api/community-plans?offset=0&limit=${limit}`);
        if (res.ok) {
          const data = await res.json();
          const plans = data.plans || [];
          setResults(plans);
          setOffset(plans.length);
          setStatus(plans.length < limit ? "Exhausted" : "CanLoadMore");
        } else {
          setStatus("Exhausted");
        }
      } catch {
        setStatus("Exhausted");
      }
    };
    
    initialFetch();
  }, []);

  const loadMore = () => {
    fetchPlans(true);
  };

  const noPlansToShow = results && results.length === 0 && status === "Exhausted";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Community Travel Plans
          </h1>
          <p className="text-lg text-center text-gray-600 dark:text-gray-300">
            Discover amazing travel plans created by our community of adventurers
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {results && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {results.map((plan) => (
                <div key={plan._id} className="animate-fade-in-up">
                  <PlanCard plan={plan} isPublic={true} />
                </div>
              ))}
            </div>
          )}

          {noPlansToShow && <NoPlansFound />}
          
          {status === "LoadingFirstPage" && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          )}
          
          {status === "CanLoadMore" && (
            <div className="flex justify-center py-8">
              <Button
                onClick={loadMore}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full transition-all hover:scale-105"
              >
                Load More Adventures
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPlansPage;
