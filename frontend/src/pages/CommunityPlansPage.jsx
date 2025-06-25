import React, { useState, useEffect, useCallback } from 'react';
import { Search, Grid, List, Users, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import UnifiedPlanCard from '../components/ui/UnifiedPlanCard.jsx';
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

// Sample data for 12 community plans with comprehensive details
const samplePlans = [
  {
    _id: '1',
    nameoftheplace: 'Tokyo, Japan',
    abouttheplace: 'Experience the vibrant culture, amazing food, and modern technology of Tokyo. From traditional temples to bustling streets, Tokyo offers an incredible blend of old and new. Discover hidden gems in Shibuya, explore the serene gardens of the Imperial Palace, and immerse yourself in the electric atmosphere of this magnificent city.',
    imageurl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    views: 1250,
    likes: 89,
    rating: 4.8,
    budget: 2800,
    duration: '7 days',
    userId: { firstName: 'Sarah', lastName: 'Chen' },
    createdAt: '2024-01-15',
    besttimetovisit: {
      overview: "Spring (March-May) and autumn (September-November) are ideal for visiting Tokyo with mild temperatures and beautiful seasonal changes.",
      seasons: [
        { season: "Spring", months: "March - May", description: "Cherry blossom season with mild weather and beautiful sakura blooms" },
        { season: "Summer", months: "June - August", description: "Hot and humid with occasional typhoons, but great for festivals" },
        { season: "Autumn", months: "September - November", description: "Cool temperatures and stunning fall foliage" },
        { season: "Winter", months: "December - February", description: "Cold but clear skies, perfect for illuminations and hot springs" }
      ]
    },
    adventuresactivitiestodo: [
      "Visit Senso-ji Temple in Asakusa",
      "Experience the crossing at Shibuya",
      "Explore Tsukiji Outer Market",
      "Take a day trip to Mount Fuji",
      "Visit teamLab Borderless digital art museum",
      "Enjoy cherry blossoms at Ueno Park",
      "Shop in Harajuku and Omotesando",
      "Experience a traditional tea ceremony"
    ],
    localcuisinerecommendations: [
      { dish: "Sushi", description: "Fresh sushi at Tsukiji or high-end restaurants in Ginza", price: "$50-200" },
      { dish: "Ramen", description: "Try different styles from Hakata tonkotsu to Tokyo shoyu", price: "$8-15" },
      { dish: "Tempura", description: "Light and crispy tempura at traditional restaurants", price: "$30-80" },
      { dish: "Yakitori", description: "Grilled chicken skewers in cozy izakayas", price: "$15-30" },
      { dish: "Wagyu Beef", description: "Premium Japanese beef at upscale restaurants", price: "$100-300" },
      { dish: "Takoyaki", description: "Octopus balls from street vendors", price: "$5-8" }
    ],
    packingchecklist: [
      "Comfortable walking shoes",
      "Portable wifi device or SIM card",
      "Cash (Japan is still cash-heavy)",
      "Pocket tissues and hand sanitizer",
      "Umbrella for rainy season",
      "Camera for all the Instagram spots",
      "JR Pass for train travel",
      "Portable phone charger",
      "Light layers for changing weather",
      "Small backpack for day trips"
    ],
    topplacestovisit: [
      { name: "Senso-ji Temple", description: "Tokyo's oldest temple in historic Asakusa district", duration: "2-3 hours" },
      { name: "Shibuya Crossing", description: "World's busiest pedestrian crossing", duration: "1 hour" },
      { name: "Tokyo Skytree", description: "Tallest structure in Japan with panoramic views", duration: "2-3 hours" },
      { name: "Meiji Shrine", description: "Peaceful Shinto shrine surrounded by forest", duration: "1-2 hours" },
      { name: "Tsukiji Outer Market", description: "Fresh seafood and street food paradise", duration: "2-3 hours" },
      { name: "Ginza", description: "Upscale shopping and dining district", duration: "Half day" }
    ],
    itinerary: [
      { day: 1, title: "Arrival & Asakusa", activities: ["Arrive at Narita/Haneda", "Check into hotel", "Visit Senso-ji Temple", "Explore Asakusa district", "Traditional Japanese dinner"] },
      { day: 2, title: "Modern Tokyo", activities: ["Shibuya Crossing", "Harajuku shopping", "Meiji Shrine", "Omotesando Hills", "Robot Restaurant show"] },
      { day: 3, title: "Cultural Day", activities: ["Tokyo National Museum", "Ueno Park", "Traditional tea ceremony", "Yanaka old town", "Izakaya dinner"] },
      { day: 4, title: "Mount Fuji Day Trip", activities: ["Early train to Kawaguchi-ko", "Mount Fuji views", "Chureito Pagoda", "Hot springs (onsen)", "Return to Tokyo"] },
      { day: 5, title: "Food & Markets", activities: ["Tsukiji Outer Market", "Sushi breakfast", "teamLab Borderless", "Ginza shopping", "High-end dining"] },
      { day: 6, title: "Day Trip Options", activities: ["Choose: Nikko temples", "OR Kamakura Buddha", "OR Hakone hot springs", "Return for farewell dinner"] },
      { day: 7, title: "Departure", activities: ["Last-minute shopping", "Airport departure", "Sayonara Tokyo!"] }
    ]
  },  {
    _id: '2',
    nameoftheplace: 'Paris, France',
    abouttheplace: 'Romantic getaway through the City of Light. Visit iconic landmarks, enjoy world-class cuisine, and explore charming neighborhoods. From the majestic Eiffel Tower to the artistic streets of Montmartre, Paris enchants visitors with its timeless beauty, rich history, and unparalleled culinary scene.',
    imageurl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
    views: 2100,
    likes: 156,
    rating: 4.9,
    budget: 3200,
    duration: '5 days',
    userId: { firstName: 'Marie', lastName: 'Dubois' },
    createdAt: '2024-01-20',
    besttimetovisit: {
      overview: "Late spring (April-June) and early fall (September-October) offer the best weather and fewer crowds.",
      seasons: [
        { season: "Spring", months: "April - June", description: "Perfect weather, blooming gardens, and outdoor café season" },
        { season: "Summer", months: "July - August", description: "Warm weather but crowded and expensive, many locals on vacation" },
        { season: "Autumn", months: "September - November", description: "Mild temperatures, beautiful fall colors, and cultural events" },
        { season: "Winter", months: "December - March", description: "Cool and sometimes rainy, but magical holiday decorations and cozy indoor activities" }
      ]
    },
    adventuresactivitiestodo: [
      "Climb the Eiffel Tower at sunset",
      "Explore the Louvre Museum",
      "Stroll through Montmartre and Sacré-Cœur",
      "Take a Seine River cruise",
      "Visit Notre-Dame Cathedral (exterior)",
      "Wander through Le Marais district",
      "Shop on Champs-Élysées",
      "Day trip to Palace of Versailles"
    ],
    localcuisinerecommendations: [
      { dish: "Croissants & Café", description: "Fresh pastries from local boulangeries", price: "$3-8" },
      { dish: "French Onion Soup", description: "Classic bistro soup with melted cheese", price: "$12-18" },
      { dish: "Coq au Vin", description: "Traditional chicken braised in wine", price: "$25-35" },
      { dish: "Escargots", description: "Snails in garlic butter - a true French experience", price: "$15-25" },
      { dish: "Macarons", description: "Colorful almond cookies from Ladurée or Pierre Hermé", price: "$2-5 each" },
      { dish: "Wine & Cheese", description: "French wines paired with artisanal cheeses", price: "$20-50" }
    ],
    packingchecklist: [
      "Comfortable walking shoes (lots of cobblestones)",
      "Stylish outfit for nice restaurants",
      "Light scarf for layering",
      "Umbrella or rain jacket",
      "Crossbody bag (pickpocket prevention)",
      "Portable charger for photo-taking",
      "Basic French phrases book/app",
      "Sunglasses for sunny days",
      "Camera for iconic shots",
      "Reusable water bottle"
    ],
    topplacestovisit: [
      { name: "Eiffel Tower", description: "Iconic iron lattice tower and symbol of Paris", duration: "2-3 hours" },
      { name: "Louvre Museum", description: "World's largest art museum, home to Mona Lisa", duration: "Half day" },
      { name: "Notre-Dame Cathedral", description: "Gothic masterpiece (currently under restoration)", duration: "1 hour" },
      { name: "Sacré-Cœur Basilica", description: "Beautiful church atop Montmartre hill", duration: "2 hours" },
      { name: "Arc de Triomphe", description: "Triumphal arch with panoramic city views", duration: "1-2 hours" },
      { name: "Seine River", description: "Romantic boat cruise through the heart of Paris", duration: "1-2 hours" }
    ],
    itinerary: [
      { day: 1, title: "Classic Paris Icons", activities: ["Arrive and check in", "Eiffel Tower visit", "Seine River cruise", "Dinner in Saint-Germain", "Evening stroll along the river"] },
      { day: 2, title: "Art & Culture", activities: ["Louvre Museum morning", "Lunch at café", "Notre-Dame exterior", "Sainte-Chapelle", "Latin Quarter exploration"] },
      { day: 3, title: "Montmartre & Sacré-Cœur", activities: ["Montmartre morning", "Sacré-Cœur Basilica", "Artist squares", "Le Marais afternoon", "Traditional bistro dinner"] },
      { day: 4, title: "Versailles Day Trip", activities: ["Palace of Versailles", "Gardens exploration", "Marie Antoinette's Estate", "Return to Paris", "Champs-Élysées shopping"] },
      { day: 5, title: "Final Impressions", activities: ["Arc de Triomphe", "Last-minute shopping", "Farewell lunch", "Departure preparation", "Au revoir Paris!"] }
    ]
  },  {
    _id: '3',
    nameoftheplace: 'Bali, Indonesia',
    abouttheplace: 'Tropical paradise with stunning beaches, ancient temples, and lush rice terraces. Perfect for relaxation and adventure. Experience the spiritual heart of Indonesia with its Hindu temples, traditional villages, world-class surfing, and vibrant arts scene.',
    imageurl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&h=300&fit=crop',
    views: 1850,
    likes: 134,
    rating: 4.7,
    budget: 1800,
    duration: '10 days',
    userId: { firstName: 'Kadek', lastName: 'Surya' },
    createdAt: '2024-01-25',
    besttimetovisit: {
      overview: "Dry season (April to October) is best for outdoor activities, while wet season offers lush landscapes and fewer crowds.",
      seasons: [
        { season: "Dry Season", months: "April - October", description: "Perfect for beach activities, temple visits, and outdoor adventures" },
        { season: "Wet Season", months: "November - March", description: "Lush green landscapes, occasional rain showers, lower prices" }
      ]
    },
    adventuresactivitiestodo: [
      "Sunrise trek to Mount Batur volcano",
      "Explore ancient temples of Tanah Lot and Uluwatu",
      "Visit traditional Ubud markets and rice terraces",
      "Snorkeling or diving in crystal-clear waters",
      "Traditional Balinese cooking class",
      "Yoga retreat in jungle settings",
      "White water rafting on Ayung River",
      "Beach hopping in Seminyak and Kuta"
    ],
    localcuisinerecommendations: [
      { dish: "Nasi Goreng", description: "Indonesian fried rice with vegetables and protein", price: "$3-8" },
      { dish: "Rendang", description: "Slow-cooked beef in coconut curry", price: "$5-12" },
      { dish: "Gado-Gado", description: "Indonesian salad with peanut sauce", price: "$3-6" },
      { dish: "Satay", description: "Grilled meat skewers with peanut sauce", price: "$4-8" },
      { dish: "Bebek Betutu", description: "Slow-roasted spiced duck, Balinese specialty", price: "$8-15" },
      { dish: "Tropical Fruits", description: "Fresh mangosteen, rambutan, and dragon fruit", price: "$1-3" }
    ],
    packingchecklist: [
      "Lightweight, breathable clothing",
      "Reef-safe sunscreen (high SPF)",
      "Insect repellent for jungle areas",
      "Waterproof phone case",
      "Comfortable sandals and hiking shoes",
      "Light rain jacket for wet season",
      "Respectful temple attire (sarong)",
      "Snorkeling gear (optional)",
      "First aid kit with stomach remedies",
      "Portable water purification tablets"
    ],
    topplacestovisit: [
      { name: "Ubud", description: "Cultural heart with rice terraces, temples, and art markets", duration: "2-3 days" },
      { name: "Tanah Lot Temple", description: "Iconic temple on rock formation in the sea", duration: "2-3 hours" },
      { name: "Mount Batur", description: "Active volcano perfect for sunrise trekking", duration: "Full day" },
      { name: "Uluwatu Temple", description: "Clifftop temple with ocean views and monkey inhabitants", duration: "Half day" },
      { name: "Seminyak Beach", description: "Trendy beach area with upscale resorts and dining", duration: "1-2 days" },
      { name: "Sekumpul Waterfall", description: "Hidden waterfall requiring jungle trek", duration: "Half day" }
    ],
    itinerary: [
      { day: 1, title: "Arrival in Seminyak", activities: ["Airport pickup", "Check into beach resort", "Sunset at Seminyak Beach", "Welcome dinner", "Beach walk"] },
      { day: 2, title: "Beach Day", activities: ["Beach relaxation", "Surfing lessons", "Spa treatment", "Beachfront dining", "Nightlife exploration"] },
      { day: 3, title: "Cultural Exploration", activities: ["Visit Tanah Lot Temple", "Traditional lunch", "Art village tours", "Local market shopping", "Cultural show"] },
      { day: 4, title: "Move to Ubud", activities: ["Transfer to Ubud", "Rice terrace walk", "Ubud market", "Cooking class", "Traditional massage"] },
      { day: 5, title: "Ubud Adventures", activities: ["Mount Batur sunrise trek", "Natural hot springs", "Coffee plantation tour", "Rest and recovery", "Healthy dinner"] },
      { day: 6, title: "Temples & Nature", activities: ["Uluwatu Temple", "Kecak fire dance", "Beach time at Jimbaran", "Seafood dinner on beach", "Sunset viewing"] },
      { day: 7, title: "Water Activities", activities: ["Snorkeling trip", "Nusa Penida day tour", "Crystal Bay beach", "Local island lunch", "Return to mainland"] },
      { day: 8, title: "Adventure Day", activities: ["White water rafting", "Sekumpul waterfall trek", "Traditional village visit", "Local home dinner", "Stargazing"] },
      { day: 9, title: "Relaxation", activities: ["Yoga session", "Spa day", "Final shopping", "Farewell feast", "Beach sunset"] },
      { day: 10, title: "Departure", activities: ["Last-minute souvenirs", "Airport transfer", "Selamat jalan (goodbye) Bali!"] }
    ]
  },
  {
    _id: '4',
    nameoftheplace: 'New York City, USA',
    abouttheplace: 'The city that never sleeps! Broadway shows, world-class museums, iconic skyline, and diverse neighborhoods to explore.',
    imageurl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
    views: 1950,
    likes: 112,
    rating: 4.6,
    budget: 3500,
    duration: '6 days',
    userId: { firstName: 'Alex', lastName: 'Johnson' },
    createdAt: '2024-02-01'
  },
  {
    _id: '5',
    nameoftheplace: 'Santorini, Greece',
    abouttheplace: 'Breathtaking sunsets, white-washed buildings, and crystal-clear waters. A perfect Mediterranean escape.',
    imageurl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
    views: 2200,
    likes: 178,
    rating: 4.9,
    budget: 2500,
    duration: '8 days',
    userId: { firstName: 'Elena', lastName: 'Papadopoulos' },
    createdAt: '2024-02-05'
  },
  {
    _id: '6',
    nameoftheplace: 'Swiss Alps, Switzerland',
    abouttheplace: 'Majestic mountain peaks, pristine lakes, and charming alpine villages. Perfect for hiking and winter sports.',
    imageurl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    views: 1650,
    likes: 95,
    rating: 4.8,
    budget: 4200,
    duration: '9 days',
    userId: { firstName: 'Hans', lastName: 'Mueller' },
    createdAt: '2024-02-10'
  },
  {
    _id: '7',
    nameoftheplace: 'Marrakech, Morocco',
    abouttheplace: 'Vibrant souks, stunning architecture, and rich cultural heritage. Experience the magic of North Africa.',
    imageurl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73469?w=400&h=300&fit=crop',
    views: 1400,
    likes: 87,
    rating: 4.5,
    budget: 1600,
    duration: '7 days',
    userId: { firstName: 'Youssef', lastName: 'Alami' },
    createdAt: '2024-02-15'
  },
  {
    _id: '8',
    nameoftheplace: 'Iceland Ring Road',
    abouttheplace: 'Epic road trip through glaciers, waterfalls, geysers, and volcanic landscapes. Nature at its most dramatic.',
    imageurl: 'https://images.unsplash.com/photo-1539066484628-7ca4b8b2b0d2?w=400&h=300&fit=crop',
    views: 1750,
    likes: 124,
    rating: 4.9,
    budget: 3800,
    duration: '12 days',
    userId: { firstName: 'Björk', lastName: 'Sigurdsson' },
    createdAt: '2024-02-20'
  },
  {
    _id: '9',
    nameoftheplace: 'Costa Rica Adventure',
    abouttheplace: 'Rainforests, wildlife, volcanoes, and beaches. Perfect for eco-tourism and adventure activities.',
    imageurl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
    views: 1300,
    likes: 76,
    rating: 4.7,
    budget: 2200,
    duration: '10 days',
    userId: { firstName: 'Carlos', lastName: 'Vargas' },
    createdAt: '2024-02-25'
  },
  {
    _id: '10',
    nameoftheplace: 'Seoul, South Korea',
    abouttheplace: 'Modern metropolis with traditional temples, K-culture, amazing street food, and cutting-edge technology.',
    imageurl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    views: 1450,
    likes: 98,
    rating: 4.6,
    budget: 2600,
    duration: '8 days',
    userId: { firstName: 'Min-jun', lastName: 'Kim' },
    createdAt: '2024-03-01'
  },
  {
    _id: '11',
    nameoftheplace: 'Scottish Highlands',
    abouttheplace: 'Dramatic landscapes, ancient castles, whisky distilleries, and Highland culture. A journey through history.',
    imageurl: 'https://images.unsplash.com/photo-1552059562-51848c21268b?w=400&h=300&fit=crop',
    views: 1150,
    likes: 67,
    rating: 4.4,
    budget: 2900,
    duration: '7 days',
    userId: { firstName: 'Duncan', lastName: 'MacLeod' },
    createdAt: '2024-03-05'
  },
  {
    _id: '12',
    nameoftheplace: 'Kyoto, Japan',
    abouttheplace: 'Traditional Japan at its finest. Ancient temples, bamboo forests, geisha districts, and seasonal beauty.',
    imageurl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
    views: 1800,
    likes: 142,
    rating: 4.8,
    budget: 2400,
    duration: '6 days',
    userId: { firstName: 'Hiroshi', lastName: 'Tanaka' },
    createdAt: '2024-03-10'
  }
];

const CommunityPlansPage = () => {
  const [filteredResults, setFilteredResults] = useState(samplePlans);
  const [status, setStatus] = useState("Exhausted");
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState('grid');

  const fetchPlans = useCallback(async (append = false) => {
    // Using sample data instead of API call
    setStatus("Exhausted"); // All data is already loaded
  }, []);
  useEffect(() => {
    // Initialize with sample data
    setFilteredResults(samplePlans);
    setStatus("Exhausted");
  }, []);

  useEffect(() => {
    if (!searchText) {
      setFilteredResults(samplePlans);
    } else {
      const filtered = samplePlans.filter(plan =>
        plan.nameoftheplace.toLowerCase().includes(searchText.toLowerCase()) ||
        plan.abouttheplace?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredResults(filtered);
    }
  }, [searchText]);

  const loadMore = () => {
    fetchPlans(true);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const noPlansToShow = filteredResults && filteredResults.length === 0 && status !== "LoadingFirstPage";
  return (
    <main className="flex min-h-[calc(100svh-4rem)] flex-col items-center bg-blue-50/40 dark:bg-gray-900 transition-colors">
      <div className="w-full lg:px-20 px-5 py-6">        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Community Plans
              </h1>
            </div>
            
            {/* Search and Controls moved to right */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  onChange={handleSearch}
                  value={searchText}
                  placeholder="Search destinations..."
                  type="search"
                  className="pl-10 w-64 bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-600 dark:text-white"
                />
              </div>
              
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
          
          <p className="text-muted-foreground dark:text-gray-400 mb-6">
            Discover amazing travel plans shared by fellow travellers around the world
          </p>          {/* Stats */}
          {filteredResults.length > 0 && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>{filteredResults.length} plans shared</span>
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
            }>              {filteredResults.map((plan) => (
                <UnifiedPlanCard 
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
