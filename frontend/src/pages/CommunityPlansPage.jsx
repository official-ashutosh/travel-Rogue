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
    weatherInfo: {
      current: {
        temperature: 18,
        feels_like: 16,
        humidity: 65,
        description: "partly cloudy",
        icon: "02d",
        wind_speed: 3.2,
        timestamp: new Date()
      },
      forecast: [
        { date: "Mon Jan 15", temperature: { min: 8, max: 20 }, description: "sunny", icon: "01d", humidity: 60, wind_speed: 2.8 },
        { date: "Tue Jan 16", temperature: { min: 10, max: 22 }, description: "partly cloudy", icon: "02d", humidity: 65, wind_speed: 3.5 },
        { date: "Wed Jan 17", temperature: { min: 12, max: 18 }, description: "cloudy", icon: "03d", humidity: 70, wind_speed: 4.1 },
        { date: "Thu Jan 18", temperature: { min: 9, max: 17 }, description: "light rain", icon: "10d", humidity: 80, wind_speed: 2.9 },
        { date: "Fri Jan 19", temperature: { min: 11, max: 21 }, description: "sunny", icon: "01d", humidity: 55, wind_speed: 2.3 }
      ],
      seasonal: {
        spring: {
          temperature_range: "10-20°C (50-68°F)",
          description: "Mild and pleasant with cherry blossoms",
          activities: ["Cherry blossom viewing", "Temple visits", "Outdoor festivals"]
        },
        summer: {
          temperature_range: "25-35°C (77-95°F)",
          description: "Hot and humid with frequent rain",
          activities: ["Indoor attractions", "Summer festivals", "Beach trips"]
        },
        autumn: {
          temperature_range: "15-25°C (59-77°F)",
          description: "Cool and comfortable with beautiful fall colors",
          activities: ["Fall foliage viewing", "Hiking", "Cultural activities"]
        },
        winter: {
          temperature_range: "5-15°C (41-59°F)",
          description: "Cold and dry with occasional snow",
          activities: ["Hot springs", "Winter illuminations", "Indoor dining"]
        }
      }
    },
    besttimetovisit: "Spring (March-May) and autumn (September-November) are ideal for visiting Tokyo with mild temperatures and beautiful seasonal changes.",
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
      { 
        name: "Senso-ji Temple", 
        coordinates: { lat: 35.7148, lng: 139.7967 }
      },
      { 
        name: "Shibuya Crossing", 
        coordinates: { lat: 35.6598, lng: 139.7006 }
      },
      { 
        name: "Tokyo Skytree", 
        coordinates: { lat: 35.7101, lng: 139.8107 }
      },
      { 
        name: "Meiji Shrine", 
        coordinates: { lat: 35.6762, lng: 139.6993 }
      },
      { 
        name: "Tsukiji Outer Market", 
        coordinates: { lat: 35.6654, lng: 139.7707 }
      },
      { 
        name: "Ginza", 
        coordinates: { lat: 35.6762, lng: 139.7625 }
      }
    ],
    itinerary: [
      { 
        title: "Day 1: Arrival & Asakusa", 
        activities: {
          morning: [
            { itineraryItem: "Arrive at Narita/Haneda Airport", briefDescription: "Immigration and customs procedures" },
            { itineraryItem: "Airport express train to city center", briefDescription: "Take Narita Express or Keikyu Line to central Tokyo" }
          ],
          afternoon: [
            { itineraryItem: "Check into hotel in Asakusa district", briefDescription: "Settle into traditional Tokyo neighborhood" },
            { itineraryItem: "Visit Senso-ji Temple", briefDescription: "Explore Tokyo's oldest and most significant Buddhist temple" },
            { itineraryItem: "Explore Nakamise Shopping Street", briefDescription: "Browse traditional crafts, snacks, and souvenirs" }
          ],
          evening: [
            { itineraryItem: "Traditional Japanese dinner", briefDescription: "Experience authentic cuisine at local restaurant" },
            { itineraryItem: "Evening stroll along Sumida River", briefDescription: "Peaceful riverside walk with city views" }
          ]
        }
      },
      { 
        title: "Day 2: Modern Tokyo", 
        activities: {
          morning: [
            { itineraryItem: "Breakfast at hotel", briefDescription: "Traditional Japanese breakfast to start the day" },
            { itineraryItem: "Travel to Shibuya", briefDescription: "Experience Tokyo's efficient train system" },
            { itineraryItem: "Experience Shibuya Crossing", briefDescription: "Witness the world's busiest pedestrian crossing" }
          ],
          afternoon: [
            { itineraryItem: "Harajuku street fashion exploration", briefDescription: "Discover Japan's unique youth culture and fashion trends" },
            { itineraryItem: "Visit Meiji Shrine", briefDescription: "Find peace in this sacred forest shrine dedicated to Emperor Meiji" },
            { itineraryItem: "Lunch at trendy Omotesando cafe", briefDescription: "Enjoy modern Japanese cuisine in stylish setting" }
          ],
          evening: [
            { itineraryItem: "Explore Omotesando Hills", briefDescription: "High-end shopping in architecturally stunning mall" },
            { itineraryItem: "Experience Tokyo nightlife in Shinjuku", briefDescription: "Discover vibrant evening entertainment district" }
          ]
        }
      },
      { 
        title: "Day 3: Cultural Immersion", 
        activities: {
          morning: [
            { itineraryItem: "Visit Tokyo National Museum", briefDescription: "Explore Japan's largest collection of cultural artifacts" },
            { itineraryItem: "Explore Ueno Park", briefDescription: "Stroll through Tokyo's cultural heart with museums and temples" }
          ],
          afternoon: [
            { itineraryItem: "Traditional tea ceremony experience", briefDescription: "Learn about Japanese cultural traditions and mindfulness" },
            { itineraryItem: "Walk through historic Yanaka district", briefDescription: "Experience old Tokyo atmosphere in preserved neighborhood" }
          ],
          evening: [
            { itineraryItem: "Authentic izakaya dinner", briefDescription: "Try various Japanese sake and traditional small plates" }
          ]
        }
      },
      { 
        title: "Day 4: Mount Fuji Day Trip", 
        activities: {
          morning: [
            { itineraryItem: "Early train to Kawaguchi-ko", briefDescription: "Scenic 2-hour journey to Mount Fuji region" }
          ],
          afternoon: [
            { itineraryItem: "Mount Fuji 5th Station visit", briefDescription: "Get as close as possible to Japan's sacred mountain" },
            { itineraryItem: "Chureito Pagoda photography", briefDescription: "Capture iconic Mount Fuji views with traditional pagoda" }
          ],
          evening: [
            { itineraryItem: "Traditional onsen experience", briefDescription: "Relax in natural hot springs with mountain views" },
            { itineraryItem: "Return to Tokyo by evening train", briefDescription: "Reflect on the day's mountain adventures" }
          ]
        }
      },
      { 
        title: "Day 5: Food Culture & Innovation", 
        activities: {
          morning: [
            { itineraryItem: "Early visit to Tsukiji Outer Market", briefDescription: "Experience the world's largest fish market atmosphere" },
            { itineraryItem: "Fresh sushi breakfast", briefDescription: "Taste the freshest seafood from renowned sushi masters" }
          ],
          afternoon: [
            { itineraryItem: "teamLab Borderless digital art museum", briefDescription: "Immerse yourself in cutting-edge interactive digital art" }
          ],
          evening: [
            { itineraryItem: "Ginza district exploration", briefDescription: "Upscale shopping and dining in Tokyo's luxury district" }
          ]
        }
      },
      { 
        title: "Day 6: Choose Your Adventure", 
        activities: {
          morning: [
            { itineraryItem: "Day trip to Nikko, Kamakura, or Hakone", briefDescription: "Choose from UNESCO temples, giant Buddha, or hot spring resort" }
          ],
          afternoon: [
            { itineraryItem: "Full exploration of chosen destination", briefDescription: "Deep dive into Japanese history and culture outside Tokyo" }
          ],
          evening: [
            { itineraryItem: "Farewell dinner at special restaurant", briefDescription: "Celebrate your Tokyo journey with memorable meal" }
          ]
        }
      },
      { 
        title: "Day 7: Departure", 
        activities: {
          morning: [
            { itineraryItem: "Final breakfast at hotel", briefDescription: "Last taste of Japanese hospitality and cuisine" },
            { itineraryItem: "Check out and travel to airport", briefDescription: "Departure from Tokyo with unforgettable memories" }
          ],
          afternoon: [],
          evening: []
        }
      }
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
    weatherInfo: {
      current: {
        temperature: 15,
        feels_like: 13,
        humidity: 72,
        description: "light rain",
        icon: "10d",
        wind_speed: 4.1,
        timestamp: new Date()
      },
      forecast: [
        { date: "Mon Jan 20", temperature: { min: 8, max: 16 }, description: "cloudy", icon: "03d", humidity: 75, wind_speed: 3.8 },
        { date: "Tue Jan 21", temperature: { min: 10, max: 18 }, description: "partly cloudy", icon: "02d", humidity: 68, wind_speed: 2.9 },
        { date: "Wed Jan 22", temperature: { min: 12, max: 20 }, description: "sunny", icon: "01d", humidity: 60, wind_speed: 2.5 },
        { date: "Thu Jan 23", temperature: { min: 9, max: 17 }, description: "light rain", icon: "10d", humidity: 80, wind_speed: 4.2 },
        { date: "Fri Jan 24", temperature: { min: 11, max: 19 }, description: "partly cloudy", icon: "02d", humidity: 65, wind_speed: 3.1 }
      ],
      seasonal: {
        spring: {
          temperature_range: "10-20°C (50-68°F)",
          description: "Mild weather with occasional showers and blooming gardens",
          activities: ["Park visits", "Outdoor cafés", "Garden tours"]
        },
        summer: {
          temperature_range: "20-25°C (68-77°F)",
          description: "Warm and pleasant with long daylight hours",
          activities: ["River cruises", "Outdoor dining", "Street festivals"]
        },
        autumn: {
          temperature_range: "10-18°C (50-64°F)",
          description: "Cool and romantic with beautiful fall colors",
          activities: ["Museum visits", "Cozy café culture", "Wine tasting"]
        },
        winter: {
          temperature_range: "3-8°C (37-46°F)",
          description: "Cold but charming with holiday decorations",
          activities: ["Indoor museums", "Christmas markets", "Theater shows"]
        }
      }
    },
    besttimetovisit: "Late spring (April-June) and early fall (September-October) offer the best weather and fewer crowds.",
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
      "Croissants & Café: Fresh pastries from local boulangeries",
      "French Onion Soup: Classic bistro soup with melted cheese",
      "Coq au Vin: Traditional chicken braised in wine",
      "Escargots: Snails in garlic butter - a true French experience",
      "Macarons: Colorful almond cookies from Ladurée or Pierre Hermé",
      "Wine & Cheese: French wines paired with artisanal cheeses"
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
      { 
        name: "Eiffel Tower", 
        coordinates: { lat: 48.8584, lng: 2.2945 }
      },
      { 
        name: "Louvre Museum", 
        coordinates: { lat: 48.8606, lng: 2.3376 }
      },
      { 
        name: "Notre-Dame Cathedral", 
        coordinates: { lat: 48.8530, lng: 2.3499 }
      },
      { 
        name: "Sacré-Cœur Basilica", 
        coordinates: { lat: 48.8867, lng: 2.3431 }
      },
      { 
        name: "Arc de Triomphe", 
        coordinates: { lat: 48.8738, lng: 2.2950 }
      },
      { 
        name: "Seine River", 
        coordinates: { lat: 48.8566, lng: 2.3522 }
      }
    ],
    itinerary: [
      { 
        title: "Day 1: Classic Paris Icons", 
        activities: {
          morning: [
            { itineraryItem: "Arrive at Charles de Gaulle Airport", briefDescription: "Immigration and customs procedures" },
            { itineraryItem: "Airport transfer to city center", briefDescription: "RER train or taxi to central Paris accommodation" }
          ],
          afternoon: [
            { itineraryItem: "Check into hotel in central Paris", briefDescription: "Settle in and get oriented in the city" },
            { itineraryItem: "Visit iconic Eiffel Tower", briefDescription: "Explore the symbol of Paris and climb to observation decks" },
            { itineraryItem: "Trocadéro Gardens photography", briefDescription: "Capture perfect Eiffel Tower photos from across the river" }
          ],
          evening: [
            { itineraryItem: "Romantic Seine River cruise", briefDescription: "See Paris landmarks illuminated from the water" },
            { itineraryItem: "Dinner in Saint-Germain district", briefDescription: "Traditional French cuisine in charming neighborhood" }
          ]
        }
      },
      { 
        title: "Day 2: Art & Culture", 
        activities: {
          morning: [
            { itineraryItem: "Early entry to Louvre Museum", briefDescription: "Avoid crowds at world's largest art museum" },
            { itineraryItem: "See Mona Lisa and Venus de Milo", briefDescription: "Visit the museum's most famous masterpieces" }
          ],
          afternoon: [
            { itineraryItem: "Explore Egyptian and Greek antiquities", briefDescription: "Discover ancient civilizations through artifacts" },
            { itineraryItem: "Visit Notre-Dame Cathedral exterior", briefDescription: "Admire Gothic architecture (currently under restoration)" },
            { itineraryItem: "Explore Sainte-Chapelle's stained glass", briefDescription: "Marvel at medieval stained glass masterpiece" }
          ],
          evening: [
            { itineraryItem: "Walk through historic Latin Quarter", briefDescription: "Explore student district with winding medieval streets" },
            { itineraryItem: "Traditional French bistro dinner", briefDescription: "Authentic Parisian dining experience" }
          ]
        }
      },
      { 
        title: "Day 3: Montmartre & Bohemian Paris", 
        activities: {
          morning: [
            { itineraryItem: "Funicular ride up to Montmartre", briefDescription: "Scenic journey to Paris's highest point" },
            { itineraryItem: "Visit Sacré-Cœur Basilica", briefDescription: "Explore beautiful white stone basilica with panoramic views" },
            { itineraryItem: "Artists' squares at Place du Tertre", briefDescription: "Watch street artists and portrait painters at work" }
          ],
          afternoon: [
            { itineraryItem: "Lunch at traditional Montmartre café", briefDescription: "Experience authentic Parisian café culture" },
            { itineraryItem: "Walk through Le Marais district", briefDescription: "Explore historic Jewish quarter and trendy boutiques" }
          ],
          evening: [
            { itineraryItem: "Wine tasting experience", briefDescription: "Learn about French wines from sommelier" },
            { itineraryItem: "Traditional bistro dinner", briefDescription: "Enjoy classic French dishes in cozy atmosphere" }
          ]
        }
      },
      { 
        title: "Day 4: Versailles Royal Experience", 
        activities: {
          morning: [
            { itineraryItem: "Train journey to Palace of Versailles", briefDescription: "45-minute RER train ride to royal palace" },
            { itineraryItem: "Audio-guided tour of palace rooms", briefDescription: "Explore opulent royal apartments and chambers" }
          ],
          afternoon: [
            { itineraryItem: "Hall of Mirrors exploration", briefDescription: "Walk through the palace's most famous room" },
            { itineraryItem: "Explore magnificent palace gardens", briefDescription: "Stroll through formal French gardens and fountains" },
            { itineraryItem: "Visit Marie Antoinette's Estate", briefDescription: "Discover the Queen's private retreat and hamlet" }
          ],
          evening: [
            { itineraryItem: "Return train to Paris", briefDescription: "Evening journey back to the capital" },
            { itineraryItem: "Champs-Élysées evening stroll", briefDescription: "Walk down the world's most famous avenue" }
          ]
        }
      },
      { 
        title: "Day 5: Final Impressions", 
        activities: {
          morning: [
            { itineraryItem: "Climb Arc de Triomphe", briefDescription: "Panoramic views over the Champs-Élysées and city" },
            { itineraryItem: "Final souvenir shopping", briefDescription: "Last-minute gifts and mementos from Paris" }
          ],
          afternoon: [
            { itineraryItem: "Farewell lunch at brasserie", briefDescription: "Final taste of Parisian culinary tradition" },
            { itineraryItem: "Pack and prepare for departure", briefDescription: "Check out and organize luggage" }
          ],
          evening: [
            { itineraryItem: "Airport transfer and departure", briefDescription: "Au revoir Paris - departure with lifetime memories" }
          ]
        }
      }
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
    weatherInfo: {
      current: {
        temperature: 28,
        feels_like: 32,
        humidity: 85,
        description: "partly cloudy",
        icon: "02d",
        wind_speed: 2.1,
        timestamp: new Date()
      },
      forecast: [
        { date: "Mon Jan 25", temperature: { min: 24, max: 30 }, description: "sunny", icon: "01d", humidity: 80, wind_speed: 1.8 },
        { date: "Tue Jan 26", temperature: { min: 25, max: 31 }, description: "partly cloudy", icon: "02d", humidity: 82, wind_speed: 2.3 },
        { date: "Wed Jan 27", temperature: { min: 23, max: 29 }, description: "light rain", icon: "10d", humidity: 90, wind_speed: 2.8 },
        { date: "Thu Jan 28", temperature: { min: 24, max: 30 }, description: "partly cloudy", icon: "02d", humidity: 85, wind_speed: 2.1 },
        { date: "Fri Jan 29", temperature: { min: 25, max: 32 }, description: "sunny", icon: "01d", humidity: 78, wind_speed: 1.9 }
      ],
      seasonal: {
        spring: {
          temperature_range: "24-30°C (75-86°F)",
          description: "Warm and humid with occasional tropical showers",
          activities: ["Beach activities", "Temple visits", "Outdoor adventures"]
        },
        summer: {
          temperature_range: "25-32°C (77-90°F)",
          description: "Hot and humid, perfect for water activities",
          activities: ["Surfing", "Diving", "Beach relaxation"]
        },
        autumn: {
          temperature_range: "24-31°C (75-88°F)",
          description: "Warm with increasing rainfall",
          activities: ["Cultural tours", "Spa treatments", "Indoor cooking classes"]
        },
        winter: {
          temperature_range: "23-29°C (73-84°F)",
          description: "Rainy season with lush green landscapes",
          activities: ["Yoga retreats", "Art workshops", "Museum visits"]
        }
      },
    },
    besttimetovisit: "Dry season (April to October) is best for outdoor activities, while wet season offers lush landscapes and fewer crowds.",
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
      "Nasi Goreng: Indonesian fried rice with vegetables and protein",
      "Rendang: Slow-cooked beef in coconut curry",
      "Gado-Gado: Indonesian salad with peanut sauce",
      "Satay: Grilled meat skewers with peanut sauce",
      "Bebek Betutu: Slow-roasted spiced duck, Balinese specialty",
      "Tropical Fruits: Fresh mangosteen, rambutan, and dragon fruit"
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
      { 
        name: "Ubud", 
        coordinates: { lat: -8.5069, lng: 115.2625 }
      },
      { 
        name: "Tanah Lot Temple", 
        coordinates: { lat: -8.6211, lng: 115.0868 }
      },
      { 
        name: "Mount Batur", 
        coordinates: { lat: -8.2422, lng: 115.3753 }
      },
      { 
        name: "Uluwatu Temple", 
        coordinates: { lat: -8.8290, lng: 115.0847 }
      },
      { 
        name: "Seminyak Beach", 
        coordinates: { lat: -8.6905, lng: 115.1663 }
      },
      { 
        name: "Sekumpul Waterfall", 
        coordinates: { lat: -8.1539, lng: 115.1925 }
      }
    ],
    itinerary: [
      { 
        title: "Day 1: Arrival in Seminyak", 
        activities: {
          morning: [
            { itineraryItem: "Arrive at Ngurah Rai International Airport", briefDescription: "Immigration and customs procedures in tropical Bali" },
            { itineraryItem: "Airport pickup service", briefDescription: "Private transfer to luxury beach resort" }
          ],
          afternoon: [
            { itineraryItem: "Check into oceanfront resort in Seminyak", briefDescription: "Settle into tropical paradise accommodation" },
            { itineraryItem: "Resort orientation and facilities tour", briefDescription: "Explore resort amenities and services" },
            { itineraryItem: "Relaxation by infinity pool", briefDescription: "Unwind after journey with ocean views" }
          ],
          evening: [
            { itineraryItem: "Spectacular sunset viewing at Seminyak Beach", briefDescription: "Watch breathtaking Balinese sunset over Indian Ocean" },
            { itineraryItem: "Welcome dinner at beachfront restaurant", briefDescription: "First taste of authentic Indonesian cuisine" }
          ]
        }
      },
      { 
        title: "Day 2: Beach Paradise", 
        activities: {
          morning: [
            { itineraryItem: "Tropical breakfast with ocean views", briefDescription: "Fresh fruits and Indonesian specialties" },
            { itineraryItem: "Professional surfing lessons", briefDescription: "Learn to ride the famous Balinese waves" }
          ],
          afternoon: [
            { itineraryItem: "Traditional Balinese spa treatment", briefDescription: "Rejuvenating massage with natural oils and herbs" },
            { itineraryItem: "Poolside lunch and relaxation", briefDescription: "Healthy tropical cuisine by the pool" }
          ],
          evening: [
            { itineraryItem: "Fresh seafood dinner at beachfront venue", briefDescription: "Grilled fish and prawns with feet in the sand" },
            { itineraryItem: "Explore Seminyak nightlife scene", briefDescription: "Experience Bali's trendy bars and clubs" }
          ]
        }
      },
      { 
        title: "Day 3: Cultural Immersion", 
        activities: {
          morning: [
            { itineraryItem: "Visit iconic Tanah Lot Temple", briefDescription: "Explore temple perched on rock formation in the sea" },
            { itineraryItem: "Learn about Balinese Hindu traditions", briefDescription: "Understand local spiritual practices and customs" }
          ],
          afternoon: [
            { itineraryItem: "Traditional Indonesian lunch", briefDescription: "Sample authentic local dishes" },
            { itineraryItem: "Explore traditional art villages", briefDescription: "Visit local craftsmen and workshops" }
          ],
          evening: [
            { itineraryItem: "Traditional Kecak fire dance performance", briefDescription: "Watch mesmerizing traditional Balinese performance" },
            { itineraryItem: "Authentic Balinese dinner", briefDescription: "Experience local flavors and cooking techniques" }
          ]
        }
      },
      { 
        title: "Day 4: Move to Ubud Cultural Heart", 
        activities: {
          morning: [
            { itineraryItem: "Scenic transfer to Ubud", briefDescription: "Journey through rice terraces to cultural center" },
            { itineraryItem: "Check into jungle resort", briefDescription: "Luxury accommodation surrounded by tropical forest" }
          ],
          afternoon: [
            { itineraryItem: "Famous Tegallalang Rice Terrace walk", briefDescription: "Explore stunning stepped rice field landscape" },
            { itineraryItem: "Traditional Ubud market exploration", briefDescription: "Browse local produce, spices, and handicrafts" },
            { itineraryItem: "Authentic Balinese cooking class", briefDescription: "Learn to prepare traditional Indonesian dishes" }
          ],
          evening: [
            { itineraryItem: "Traditional Balinese massage therapy", briefDescription: "Relaxing treatment in jungle spa setting" },
            { itineraryItem: "Organic dinner at farm-to-table restaurant", briefDescription: "Fresh, locally-sourced Indonesian cuisine" }
          ]
        }
      },
      { 
        title: "Day 5: Volcano Adventure", 
        activities: {
          morning: [
            { itineraryItem: "Early Mount Batur sunrise trek", briefDescription: "Pre-dawn climb to active volcano summit for sunrise" },
            { itineraryItem: "Summit breakfast with volcanic views", briefDescription: "Breakfast cooked using volcanic steam" }
          ],
          afternoon: [
            { itineraryItem: "Natural hot springs relaxation", briefDescription: "Soak in volcanic hot springs with mountain views" },
            { itineraryItem: "Coffee plantation educational tour", briefDescription: "Learn about Balinese coffee cultivation and processing" },
            { itineraryItem: "Traditional luwak coffee tasting", briefDescription: "Try famous Indonesian civet coffee" }
          ],
          evening: [
            { itineraryItem: "Healthy organic dinner", briefDescription: "Nutritious meal after active day" },
            { itineraryItem: "Traditional gamelan music performance", briefDescription: "Listen to traditional Indonesian orchestral music" }
          ]
        }
      },
      { 
        title: "Day 6: Clifftop Temples", 
        activities: {
          morning: [
            { itineraryItem: "Visit dramatic Uluwatu Temple", briefDescription: "Explore clifftop temple with spectacular ocean views" },
            { itineraryItem: "Monkey forest interaction", briefDescription: "Observe playful temple monkeys in their habitat" }
          ],
          afternoon: [
            { itineraryItem: "Beach time at pristine Jimbaran Bay", briefDescription: "Relax on beautiful white sand beach" },
            { itineraryItem: "Fresh grilled seafood lunch on beach", briefDescription: "Catch of the day prepared by local fishermen" }
          ],
          evening: [
            { itineraryItem: "Traditional Kecak fire dance performance", briefDescription: "Watch hypnotic traditional dance at sunset" },
            { itineraryItem: "Romantic candlelit seafood dinner on beach", briefDescription: "Dining under stars with ocean waves" }
          ]
        }
      },
      { 
        title: "Day 7: Water Paradise", 
        activities: {
          morning: [
            { itineraryItem: "Full-day Nusa Penida island excursion", briefDescription: "Boat trip to pristine neighboring island" },
            { itineraryItem: "Snorkeling in crystal-clear waters", briefDescription: "Explore colorful coral reefs and marine life" }
          ],
          afternoon: [
            { itineraryItem: "Crystal Bay beach relaxation", briefDescription: "Swim and sunbathe on pristine tropical beach" },
            { itineraryItem: "Underwater photography", briefDescription: "Capture memories of tropical marine paradise" }
          ],
          evening: [
            { itineraryItem: "Return boat journey to mainland", briefDescription: "Sunset boat ride back to Bali" },
            { itineraryItem: "Farewell dinner at resort", briefDescription: "Final celebration of Balinese adventure" }
          ]
        }
      },
      { 
        title: "Day 8-10: Free Choice & Departure", 
        activities: {
          morning: [
            { itineraryItem: "Choose your adventure", briefDescription: "Select from yoga retreat, surfing, or cultural exploration" }
          ],
          afternoon: [
            { itineraryItem: "Final beach time or shopping", briefDescription: "Last-minute relaxation or souvenir hunting" }
          ],
          evening: [
            { itineraryItem: "Departure preparations", briefDescription: "Pack and prepare for journey home with memories" }
          ]
        }
      }
    ]
  },
  {
    _id: '4',
    nameoftheplace: 'New York City, USA',
    abouttheplace: 'The city that never sleeps! Broadway shows, world-class museums, iconic skyline, and diverse neighborhoods to explore. From the bright lights of Times Square to the tranquil paths of Central Park, NYC offers an unparalleled urban experience with world-class dining, shopping, and culture.',
    imageurl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
    views: 1950,
    likes: 112,
    rating: 4.6,
    budget: 3500,
    duration: '6 days',
    userId: { firstName: 'Alex', lastName: 'Johnson' },
    createdAt: '2024-02-01',
    weatherInfo: {
      current: {
        temperature: 8,
        feels_like: 4,
        humidity: 65,
        description: "clear sky",
        icon: "01d",
        wind_speed: 3.5,
        timestamp: new Date()
      },
      forecast: [
        { date: "Thu Feb 01", temperature: { min: 2, max: 10 }, description: "sunny", icon: "01d", humidity: 60, wind_speed: 3.2 },
        { date: "Fri Feb 02", temperature: { min: 4, max: 12 }, description: "partly cloudy", icon: "02d", humidity: 65, wind_speed: 4.1 },
        { date: "Sat Feb 03", temperature: { min: 1, max: 8 }, description: "snow", icon: "13d", humidity: 85, wind_speed: 5.2 },
        { date: "Sun Feb 04", temperature: { min: -2, max: 6 }, description: "cloudy", icon: "03d", humidity: 70, wind_speed: 3.8 },
        { date: "Mon Feb 05", temperature: { min: 3, max: 11 }, description: "partly cloudy", icon: "02d", humidity: 62, wind_speed: 2.9 }
      ],
      seasonal: {
        spring: {
          temperature_range: "10-20°C (50-68°F)",
          description: "Mild weather perfect for walking and outdoor activities",
          activities: ["Central Park visits", "Outdoor dining", "Street festivals"]
        },
        summer: {
          temperature_range: "20-28°C (68-82°F)",
          description: "Warm and humid with occasional thunderstorms",
          activities: ["Rooftop bars", "Outdoor concerts", "Beach trips"]
        },
        autumn: {
          temperature_range: "8-18°C (46-64°F)",
          description: "Cool and crisp with beautiful fall colors",
          activities: ["Park walks", "Theater season", "Holiday shopping"]
        },
        winter: {
          temperature_range: "-2-8°C (28-46°F)",
          description: "Cold with possible snow and holiday decorations",
          activities: ["Indoor museums", "Broadway shows", "Ice skating"]
        }
      },
    },
    besttimetovisit: "Spring (April-June) and Fall (September-November) offer the best weather for exploring the city.",
    adventuresactivitiestodo: [
      "Climb to the top of the Empire State Building",
      "Watch a Broadway show in Times Square",
      "Explore Central Park by bike or on foot",
      "Visit the Metropolitan Museum of Art",
      "Take the Staten Island Ferry for Statue of Liberty views",
      "Walk across the Brooklyn Bridge",
      "Explore diverse neighborhoods like SoHo and Greenwich Village",
      "Experience the High Line elevated park"
    ],
    localcuisinerecommendations: [
      "New York Pizza: Classic thin-crust slices from local pizzerias",
      "Bagels with Lox: Fresh bagels with cream cheese and smoked salmon",
      "Deli Sandwiches: Pastrami on rye from traditional Jewish delis",
      "Hot Dogs: Street cart hot dogs with all the fixings",
      "Cheesecake: New York-style cheesecake from famous bakeries", 
      "International Cuisine: Everything from authentic ethnic food in Queens"
    ],
    packingchecklist: [
      "Comfortable walking shoes (lots of walking!)",
      "Metro card or contactless payment",
      "Weather-appropriate layers",
      "Crossbody bag for safety and convenience",
      "Portable phone charger",
      "Camera for iconic photos",
      "Light jacket for air-conditioned spaces",
      "Cash for tips and street vendors"
    ],
    topplacestovisit: [
      { 
        name: "Empire State Building", 
        coordinates: { lat: 40.7484, lng: -73.9857 }
      },
      { 
        name: "Central Park", 
        coordinates: { lat: 40.7829, lng: -73.9654 }
      },
      { 
        name: "Times Square", 
        coordinates: { lat: 40.7580, lng: -73.9855 }
      },
      { 
        name: "Brooklyn Bridge", 
        coordinates: { lat: 40.7061, lng: -73.9969 }
      },
      { 
        name: "Statue of Liberty", 
        coordinates: { lat: 40.6892, lng: -74.0445 }
      },
      { 
        name: "Metropolitan Museum of Art", 
        coordinates: { lat: 40.7794, lng: -73.9632 }
      }
    ],
    itinerary: [
      { 
        title: "Day 1: Manhattan Icons", 
        activities: {
          morning: [
            { itineraryItem: "Arrive at JFK/LGA/Newark Airport", briefDescription: "Immigration and customs procedures" },
            { itineraryItem: "Airport transfer to Midtown Manhattan", briefDescription: "Taxi, subway, or airport express to hotel" }
          ],
          afternoon: [
            { itineraryItem: "Check into hotel in Midtown", briefDescription: "Drop off luggage and get oriented" },
            { itineraryItem: "Visit Times Square", briefDescription: "Experience the crossroads of the world" },
            { itineraryItem: "Explore Broadway Theater District", briefDescription: "See where the magic of Broadway happens" }
          ],
          evening: [
            { itineraryItem: "Broadway show experience", briefDescription: "Watch a world-class theatrical performance" },
            { itineraryItem: "Late dinner in Hell's Kitchen", briefDescription: "Diverse dining options near Theater District" }
          ]
        }
      },
      { 
        title: "Day 2: Culture & Art", 
        activities: {
          morning: [
            { itineraryItem: "Breakfast at classic NYC diner", briefDescription: "Experience authentic New York breakfast culture" },
            { itineraryItem: "Visit Metropolitan Museum of Art", briefDescription: "Explore one of the world's largest art museums" }
          ],
          afternoon: [
            { itineraryItem: "Stroll through Central Park", briefDescription: "Discover the green heart of Manhattan" },
            { itineraryItem: "Visit American Museum of Natural History", briefDescription: "Explore fascinating exhibits and planetarium" }
          ],
          evening: [
            { itineraryItem: "Dinner on Upper West Side", briefDescription: "Experience neighborhood dining culture" },
            { itineraryItem: "Lincoln Center evening performance", briefDescription: "Opera, ballet, or symphony at world-renowned venue" }
          ]
        }
      },
      { 
        title: "Day 3: Statue of Liberty & Downtown", 
        activities: {
          morning: [
            { itineraryItem: "Staten Island Ferry to Statue of Liberty", briefDescription: "Free ferry ride with iconic views" },
            { itineraryItem: "Explore Financial District", briefDescription: "Wall Street and historic downtown area" }
          ],
          afternoon: [
            { itineraryItem: "9/11 Memorial and Museum", briefDescription: "Pay respects and learn about September 11th" },
            { itineraryItem: "Walk across Brooklyn Bridge", briefDescription: "Iconic bridge with stunning city views" }
          ],
          evening: [
            { itineraryItem: "Explore DUMBO neighborhood", briefDescription: "Brooklyn waterfront with Manhattan views" },
            { itineraryItem: "Dinner with bridge views", briefDescription: "Waterfront dining with city skyline" }
          ]
        }
      },
      { 
        title: "Day 4: Neighborhoods & Shopping", 
        activities: {
          morning: [
            { itineraryItem: "Explore Greenwich Village", briefDescription: "Historic bohemian neighborhood with charm" },
            { itineraryItem: "Walk the High Line", briefDescription: "Elevated park built on former railway line" }
          ],
          afternoon: [
            { itineraryItem: "Shopping in SoHo", briefDescription: "Trendy boutiques and cast-iron architecture" },
            { itineraryItem: "Little Italy and Chinatown", briefDescription: "Cultural neighborhoods with authentic food" }
          ],
          evening: [
            { itineraryItem: "East Village bar scene", briefDescription: "Experience NYC nightlife in historic area" },
            { itineraryItem: "Late-night pizza slice", briefDescription: "Classic New York late-night food tradition" }
          ]
        }
      },
      { 
        title: "Day 5: Museums & Views", 
        activities: {
          morning: [
            { itineraryItem: "Visit Museum of Modern Art (MoMA)", briefDescription: "World's finest collection of modern art" },
            { itineraryItem: "Explore Midtown and Fifth Avenue", briefDescription: "Luxury shopping and iconic architecture" }
          ],
          afternoon: [
            { itineraryItem: "Top of the Rock observation deck", briefDescription: "Best views of Empire State Building and city" },
            { itineraryItem: "Rockefeller Center exploration", briefDescription: "NBC Studios and famous skating rink area" }
          ],
          evening: [
            { itineraryItem: "Dinner in Koreatown", briefDescription: "Authentic Korean BBQ and karaoke" },
            { itineraryItem: "Rooftop bar with city views", briefDescription: "Cocktails with Manhattan skyline" }
          ]
        }
      },
      { 
        title: "Day 6: Final Adventures & Departure", 
        activities: {
          morning: [
            { itineraryItem: "Brunch in West Village", briefDescription: "Classic NYC weekend brunch experience" },
            { itineraryItem: "Last-minute shopping or museum visit", briefDescription: "Final New York City experiences" }
          ],
          afternoon: [
            { itineraryItem: "Pack and check out of hotel", briefDescription: "Prepare for departure" },
            { itineraryItem: "Airport transfer", briefDescription: "Journey to airport for departure" }
          ],
          evening: []
        }
      }
    ]
  },
  {
    _id: '5',
    nameoftheplace: 'Santorini, Greece',
    abouttheplace: 'Breathtaking sunsets, white-washed buildings, and crystal-clear waters. A perfect Mediterranean escape. Experience the magic of this volcanic island with its dramatic cliffs, beautiful beaches, and charming villages perched on the caldera edge.',
    imageurl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
    views: 2200,
    likes: 178,
    rating: 4.9,
    budget: 2500,
    duration: '8 days',
    userId: { firstName: 'Elena', lastName: 'Papadopoulos' },
    createdAt: '2024-02-05',
    weatherInfo: {
      current: {
        temperature: 22,
        feels_like: 25,
        humidity: 65,
        description: "sunny",
        icon: "01d",
        wind_speed: 3.8,
        timestamp: new Date()
      },
      forecast: [
        { date: "Mon Feb 05", temperature: { min: 18, max: 25 }, description: "sunny", icon: "01d", humidity: 60, wind_speed: 3.2 },
        { date: "Tue Feb 06", temperature: { min: 20, max: 27 }, description: "partly cloudy", icon: "02d", humidity: 65, wind_speed: 4.1 },
        { date: "Wed Feb 07", temperature: { min: 19, max: 24 }, description: "windy", icon: "02d", humidity: 70, wind_speed: 5.5 },
        { date: "Thu Feb 08", temperature: { min: 21, max: 26 }, description: "sunny", icon: "01d", humidity: 58, wind_speed: 3.5 },
        { date: "Fri Feb 09", temperature: { min: 17, max: 23 }, description: "partly cloudy", icon: "02d", humidity: 68, wind_speed: 4.2 }
      ],
      seasonal: {
        spring: {
          temperature_range: "18-25°C (64-77°F)",
          description: "Perfect weather with mild temperatures and gentle breezes",
          activities: ["Sunset viewing", "Hiking", "Wine tasting"]
        },
        summer: {
          temperature_range: "25-30°C (77-86°F)",
          description: "Warm and sunny with strong Aegean winds",
          activities: ["Beach activities", "Sailing", "Outdoor dining"]
        },
        autumn: {
          temperature_range: "20-26°C (68-79°F)",
          description: "Ideal temperatures with less wind",
          activities: ["Photography", "Cultural tours", "Wine harvest"]
        },
        winter: {
          temperature_range: "12-18°C (54-64°F)",
          description: "Mild but windy with occasional rain",
          activities: ["Indoor cultural experiences", "Cozy tavernas", "Art galleries"]
        }
      },
    },
    besttimetovisit: "Late spring (May-June) and early fall (September-October) offer perfect weather with fewer crowds.",
    adventuresactivitiestodo: [
      "Watch sunset from Oia village",
      "Explore volcanic hot springs and crater",
      "Wine tasting at cliff-side wineries",
      "Sailing trip around the caldera",
      "Visit ancient Akrotiri archaeological site",
      "Hike from Fira to Oia",
      "Relax on unique colored sand beaches",
      "Traditional Greek cooking class"
    ],
    localcuisinerecommendations: [
      "Moussaka: Traditional Greek layered casserole",
      "Fresh seafood: Grilled octopus and sea bream",
      "Fava: Santorini's famous yellow split pea puree",
      "Greek salad: With local tomatoes and feta cheese",
      "Baklava: Honey and nut pastry dessert",
      "Assyrtiko wine: Local volcanic wine variety"
    ],
    packingchecklist: [
      "Comfortable walking shoes for cobblestones",
      "Sunscreen and hat for strong sun",
      "Light, breathable clothing",
      "Swimwear for beaches and hot springs",
      "Light jacket for evening breezes",
      "Camera for stunning views",
      "Water bottle to stay hydrated",
      "Modest clothing for church visits"
    ],
    topplacestovisit: [
      { 
        name: "Oia Village", 
        coordinates: { lat: 36.4618, lng: 25.3753 }
      },
      { 
        name: "Fira Town", 
        coordinates: { lat: 36.4167, lng: 25.4333 }
      },
      { 
        name: "Akrotiri Archaeological Site", 
        coordinates: { lat: 36.3567, lng: 25.4056 }
      },
      { 
        name: "Red Beach", 
        coordinates: { lat: 36.3484, lng: 25.3953 }
      },
      { 
        name: "Volcanic Hot Springs", 
        coordinates: { lat: 36.4000, lng: 25.3967 }
      },
      { 
        name: "Perissa Black Beach", 
        coordinates: { lat: 36.3583, lng: 25.4819 }
      }
    ],
    itinerary: [
      { 
        title: "Day 1-2: Arrival & Fira Exploration", 
        activities: {
          morning: [
            { itineraryItem: "Arrive at Santorini Airport", briefDescription: "Immigration and transfer to accommodation" },
            { itineraryItem: "Check into cliff-side hotel in Fira", briefDescription: "Settle into accommodation with caldera views" }
          ],
          afternoon: [
            { itineraryItem: "Explore Fira town center", briefDescription: "Walk through capital's winding streets and shops" },
            { itineraryItem: "Visit local museums and galleries", briefDescription: "Learn about island's history and culture" }
          ],
          evening: [
            { itineraryItem: "First Santorini sunset viewing", briefDescription: "Experience world-famous sunset views" },
            { itineraryItem: "Traditional Greek dinner", briefDescription: "Authentic taverna with local specialties" }
          ]
        }
      },
      { 
        title: "Day 3-4: Oia & Northern Villages", 
        activities: {
          morning: [
            { itineraryItem: "Bus or rental car to Oia village", briefDescription: "Journey to most picturesque village" },
            { itineraryItem: "Explore Oia's white and blue architecture", briefDescription: "Wander through postcard-perfect streets" }
          ],
          afternoon: [
            { itineraryItem: "Visit local art galleries and shops", briefDescription: "Browse unique crafts and artwork" },
            { itineraryItem: "Ammoudi Bay seafood lunch", briefDescription: "Fresh seafood by the water's edge" }
          ],
          evening: [
            { itineraryItem: "Famous Oia sunset experience", briefDescription: "World's most photographed sunset spot" },
            { itineraryItem: "Wine tasting at cliff-side winery", briefDescription: "Sample local Assyrtiko wines with views" }
          ]
        }
      },
      { 
        title: "Day 5: Volcanic Adventure", 
        activities: {
          morning: [
            { itineraryItem: "Boat trip to volcanic islands", briefDescription: "Visit active volcanic crater islands" },
            { itineraryItem: "Hike on volcanic terrain", briefDescription: "Explore unique volcanic landscape" }
          ],
          afternoon: [
            { itineraryItem: "Swim in volcanic hot springs", briefDescription: "Relaxing dip in natural thermal waters" },
            { itineraryItem: "Visit Thirassia island", briefDescription: "Traditional fishing village experience" }
          ],
          evening: [
            { itineraryItem: "Return sailing trip", briefDescription: "Sunset sailing back to main island" },
            { itineraryItem: "Seafood dinner in Ammoudi", briefDescription: "Fresh catch of the day by the sea" }
          ]
        }
      },
      { 
        title: "Day 6: Ancient History & Beaches", 
        activities: {
          morning: [
            { itineraryItem: "Visit Akrotiri archaeological site", briefDescription: "Explore preserved Minoan Bronze Age settlement" },
            { itineraryItem: "Learn about ancient civilization", briefDescription: "Discover 3,600-year-old ruins" }
          ],
          afternoon: [
            { itineraryItem: "Relax at Red Beach", briefDescription: "Unique red volcanic sand beach experience" },
            { itineraryItem: "Perissa Black Beach visit", briefDescription: "Swimming and sunbathing on black sand" }
          ],
          evening: [
            { itineraryItem: "Beachside taverna dinner", briefDescription: "Fresh seafood with feet in the sand" },
            { itineraryItem: "Traditional Greek music night", briefDescription: "Live music and dancing experience" }
          ]
        }
      },
      { 
        title: "Day 7: Wine & Culture", 
        activities: {
          morning: [
            { itineraryItem: "Santorini winery tour", briefDescription: "Visit multiple volcanic soil wineries" },
            { itineraryItem: "Learn about unique viticulture", briefDescription: "Understand volcanic wine production methods" }
          ],
          afternoon: [
            { itineraryItem: "Traditional Greek cooking class", briefDescription: "Learn to prepare local specialties" },
            { itineraryItem: "Visit traditional villages", briefDescription: "Explore authentic Greek island life" }
          ],
          evening: [
            { itineraryItem: "Farewell dinner with sunset", briefDescription: "Final spectacular sunset dinner" },
            { itineraryItem: "Traditional Greek dancing", briefDescription: "Join locals in traditional folk dances" }
          ]
        }
      },
      { 
        title: "Day 8: Departure", 
        activities: {
          morning: [
            { itineraryItem: "Final breakfast with caldera views", briefDescription: "Last taste of Greek hospitality" },
            { itineraryItem: "Last-minute souvenir shopping", briefDescription: "Pick up local crafts and wines" }
          ],
          afternoon: [
            { itineraryItem: "Airport transfer and departure", briefDescription: "Antio Santorini - farewell to paradise" }
          ],
          evening: []
        }
      }
    ]
  },
  {
    _id: '6',
    nameoftheplace: 'Swiss Alps, Switzerland',
    abouttheplace: 'Majestic mountain peaks, pristine lakes, and charming alpine villages. Perfect for hiking and winter sports. Experience breathtaking landscapes, traditional Swiss culture, and outdoor adventures in one of Europe\'s most stunning mountain regions.',
    imageurl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    views: 1650,
    likes: 95,
    rating: 4.8,
    budget: 4200,
    duration: '9 days',
    userId: { firstName: 'Hans', lastName: 'Mueller' },
    createdAt: '2024-02-10',
    besttimetovisit: "Summer (June-September) for hiking, Winter (December-March) for skiing and snow sports.",
    adventuresactivitiestodo: [
      "Jungfraujoch - Top of Europe train journey",
      "Matterhorn viewing and Gornergrat railway",
      "Alpine hiking trails and mountain climbing",
      "Cable car rides with panoramic views",
      "Traditional Swiss village exploration",
      "Lake Geneva and Rhine Falls visits",
      "Swiss chocolate and cheese tasting",
      "Winter sports (seasonal)"
    ],
    localcuisinerecommendations: [
      "Fondue: Traditional melted cheese with bread",
      "Raclette: Melted cheese served with potatoes",
      "Rösti: Swiss-style hash brown potato dish",
      "Zürcher Geschnetzeltes: Veal in cream sauce",
      "Swiss chocolate: World-famous Alpine chocolates",
      "Alpine herbs and liqueurs: Local mountain spirits"
    ],
    packingchecklist: [
      "Sturdy hiking boots and warm layers",
      "Weather-resistant jacket and pants",
      "Sun protection for high altitude",
      "Warm hat and gloves",
      "Camera for spectacular mountain views",
      "Swiss Travel Pass for public transport",
      "Water bottle and trail snacks",
      "First aid kit for mountain activities"
    ],
    topplacestovisit: [
      { 
        name: "Jungfraujoch", 
        coordinates: { lat: 46.5472, lng: 7.9761 }
      },
      { 
        name: "Matterhorn", 
        coordinates: { lat: 45.9763, lng: 7.6586 }
      },
      { 
        name: "Interlaken", 
        coordinates: { lat: 46.6863, lng: 7.8632 }
      },
      { 
        name: "Zermatt", 
        coordinates: { lat: 46.0207, lng: 7.7491 }
      },
      { 
        name: "Lake Geneva", 
        coordinates: { lat: 46.4312, lng: 6.9042 }
      },
      { 
        name: "Grindelwald", 
        coordinates: { lat: 46.6244, lng: 8.0411 }
      }
    ],
    itinerary: [
      { 
        title: "Day 1-2: Arrival & Interlaken", 
        activities: {
          morning: [
            { itineraryItem: "Arrive at Zurich Airport", briefDescription: "Immigration and train transfer to Alps" },
            { itineraryItem: "Scenic train journey to Interlaken", briefDescription: "First glimpse of Swiss mountain beauty" }
          ],
          afternoon: [
            { itineraryItem: "Check into alpine hotel", briefDescription: "Traditional Swiss accommodation" },
            { itineraryItem: "Explore Interlaken town center", briefDescription: "Charming town between two lakes" }
          ],
          evening: [
            { itineraryItem: "Traditional Swiss dinner", briefDescription: "Welcome fondue dinner with local wines" },
            { itineraryItem: "Evening lake walk", briefDescription: "Peaceful stroll along Lake Thun or Brienz" }
          ]
        }
      },
      { 
        title: "Day 3-4: Jungfraujoch - Top of Europe", 
        activities: {
          morning: [
            { itineraryItem: "Early train to Jungfraujoch", briefDescription: "Journey to highest railway station in Europe" },
            { itineraryItem: "Explore Ice Palace and Glacier", briefDescription: "Walk through tunnels carved in ice" }
          ],
          afternoon: [
            { itineraryItem: "Sphinx Observatory visit", briefDescription: "Panoramic views of Alps and Aletsch Glacier" },
            { itineraryItem: "Alpine hiking trails", briefDescription: "Easy to moderate trails with stunning views" }
          ],
          evening: [
            { itineraryItem: "Return train journey", briefDescription: "Scenic descent through mountain stations" },
            { itineraryItem: "Swiss mountain restaurant dinner", briefDescription: "Traditional alpine cuisine with local specialties" }
          ]
        }
      },
      { 
        title: "Day 5-6: Zermatt & Matterhorn", 
        activities: {
          morning: [
            { itineraryItem: "Train transfer to Zermatt", briefDescription: "Car-free alpine village beneath Matterhorn" },
            { itineraryItem: "Gornergrat railway journey", briefDescription: "Cog railway to 3,000m with Matterhorn views" }
          ],
          afternoon: [
            { itineraryItem: "Mountain hiking and exploration", briefDescription: "Alpine trails with iconic peak views" },
            { itineraryItem: "Traditional Swiss village tour", briefDescription: "Historic wooden chalets and local culture" }
          ],
          evening: [
            { itineraryItem: "Alphorn concert or folk music", briefDescription: "Traditional Swiss mountain music" },
            { itineraryItem: "Raclette dinner experience", briefDescription: "Watch cheese being melted traditionally" }
          ]
        }
      },
      { 
        title: "Day 7: Lake Geneva Region", 
        activities: {
          morning: [
            { itineraryItem: "Train journey to Lake Geneva", briefDescription: "Scenic route through Swiss countryside" },
            { itineraryItem: "Montreux and Chillon Castle", briefDescription: "Medieval castle on lake shores" }
          ],
          afternoon: [
            { itineraryItem: "Lavaux vineyard terraces tour", briefDescription: "UNESCO World Heritage wine region" },
            { itineraryItem: "Wine tasting experience", briefDescription: "Sample local Swiss wines with lake views" }
          ],
          evening: [
            { itineraryItem: "Lakeside dinner in Montreux", briefDescription: "Fine dining with spectacular lake views" },
            { itineraryItem: "Evening cruise on Lake Geneva", briefDescription: "Romantic boat ride with Alpine backdrop" }
          ]
        }
      },
      { 
        title: "Day 8: Adventure Activities", 
        activities: {
          morning: [
            { itineraryItem: "Choose adventure activity", briefDescription: "Paragliding, mountain biking, or cable car touring" },
            { itineraryItem: "Professional guided experience", briefDescription: "Safety-first adventure with expert guides" }
          ],
          afternoon: [
            { itineraryItem: "Swiss chocolate factory visit", briefDescription: "Learn about famous Swiss chocolate making" },
            { itineraryItem: "Cheese making demonstration", briefDescription: "Traditional Alpine cheese production" }
          ],
          evening: [
            { itineraryItem: "Farewell feast in mountain hütte", briefDescription: "Traditional alpine hut dinner experience" },
            { itineraryItem: "Stargazing in clear mountain air", briefDescription: "Spectacular night sky viewing" }
          ]
        }
      },
      { 
        title: "Day 9: Departure", 
        activities: {
          morning: [
            { itineraryItem: "Final breakfast with mountain views", briefDescription: "Last taste of Swiss hospitality" },
            { itineraryItem: "Souvenir shopping for Swiss products", briefDescription: "Chocolates, watches, and local crafts" }
          ],
          afternoon: [
            { itineraryItem: "Train transfer to Zurich Airport", briefDescription: "Scenic journey back to airport" },
            { itineraryItem: "Departure from Switzerland", briefDescription: "Auf Wiedersehen with memories of Alpine paradise" }
          ],
          evening: []
        }
      }
    ]
  },
  {
    _id: '7',
    nameoftheplace: 'Marrakech, Morocco',
    abouttheplace: 'Vibrant souks, stunning architecture, and rich cultural heritage. Experience the magic of North Africa with its bustling medinas, traditional riads, and desert adventures.',
    imageurl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73469?w=400&h=300&fit=crop',
    views: 1400,
    likes: 87,
    rating: 4.5,
    budget: 1600,
    duration: '7 days',
    userId: { firstName: 'Youssef', lastName: 'Alami' },
    createdAt: '2024-02-15',
    besttimetovisit: "October to April offers the most comfortable temperatures for exploring the city and desert.",
    adventuresactivitiestodo: [
      "Explore vibrant Jemaa el-Fnaa square",
      "Navigate the colorful souks and markets",
      "Visit magnificent Bahia Palace",
      "Relax in traditional hammam spa",
      "Sahara Desert camel trekking",
      "Atlas Mountains day trip",
      "Traditional Moroccan cooking class",
      "Majorelle Garden and museums"
    ],
    localcuisinerecommendations: [
      "Tagine: Slow-cooked stew in clay pot",
      "Couscous: Traditional semolina dish",
      "Pastilla: Sweet and savory pastry",
      "Mint tea: Traditional Moroccan hospitality",
      "Moroccan sweets: Honey-soaked pastries",
      "Harira soup: Traditional Ramadan soup"
    ],
    packingchecklist: [
      "Modest clothing respecting local culture",
      "Comfortable walking shoes for medina",
      "Sun protection and hat",
      "Light scarf for dust protection",
      "Digestive remedies for spicy food",
      "Cash for souks and tipping",
      "Camera for vibrant street scenes",
      "Hand sanitizer and tissues"
    ],
    topplacestovisit: [
      { name: "Jemaa el-Fnaa", coordinates: { lat: 31.6259, lng: -7.9893 } },
      { name: "Bahia Palace", coordinates: { lat: 31.6214, lng: -7.9844 } },
      { name: "Majorelle Garden", coordinates: { lat: 31.6415, lng: -8.0033 } },
      { name: "Koutoubia Mosque", coordinates: { lat: 31.6236, lng: -7.9997 } },
      { name: "Saadian Tombs", coordinates: { lat: 31.6186, lng: -7.9847 } }
    ],
    itinerary: [
      { 
        title: "Day 1-2: Medina Exploration", 
        activities: {
          morning: [
            { itineraryItem: "Arrive at Marrakech Airport", briefDescription: "Transfer to traditional riad accommodation" },
            { itineraryItem: "Explore Jemaa el-Fnaa square", briefDescription: "Experience the heart of Marrakech's energy" }
          ],
          afternoon: [
            { itineraryItem: "Navigate colorful souks", briefDescription: "Shop for spices, textiles, and handicrafts" },
            { itineraryItem: "Visit Koutoubia Mosque", briefDescription: "Admire the iconic minaret and architecture" }
          ],
          evening: [
            { itineraryItem: "Traditional Moroccan dinner", briefDescription: "Authentic tagine and mint tea experience" },
            { itineraryItem: "Evening entertainment in square", briefDescription: "Watch street performers and storytellers" }
          ]
        }
      },
      { 
        title: "Day 3-4: Palace & Gardens", 
        activities: {
          morning: [
            { itineraryItem: "Visit Bahia Palace", briefDescription: "Explore stunning Moroccan architecture and gardens" },
            { itineraryItem: "Saadian Tombs exploration", briefDescription: "Discover ornate royal burial site" }
          ],
          afternoon: [
            { itineraryItem: "Majorelle Garden visit", briefDescription: "Beautiful botanical garden and Berber Museum" },
            { itineraryItem: "Traditional hammam experience", briefDescription: "Relaxing traditional Moroccan spa treatment" }
          ],
          evening: [
            { itineraryItem: "Moroccan cooking class", briefDescription: "Learn to prepare traditional dishes" },
            { itineraryItem: "Rooftop dinner with city views", briefDescription: "Sunset dining overlooking medina" }
          ]
        }
      },
      { 
        title: "Day 5-6: Desert Adventure", 
        activities: {
          morning: [
            { itineraryItem: "Atlas Mountains day trip", briefDescription: "Visit Berber villages and mountain scenery" },
            { itineraryItem: "Traditional lunch in mountains", briefDescription: "Experience rural Moroccan hospitality" }
          ],
          afternoon: [
            { itineraryItem: "Desert excursion to Sahara", briefDescription: "Camel trekking and desert camp experience" },
            { itineraryItem: "Berber tent accommodation", briefDescription: "Overnight in traditional desert camp" }
          ],
          evening: [
            { itineraryItem: "Desert sunset viewing", briefDescription: "Spectacular sunset over sand dunes" },
            { itineraryItem: "Traditional Berber music night", briefDescription: "Campfire music and stargazing" }
          ]
        }
      },
      { 
        title: "Day 7: Departure", 
        activities: {
          morning: [
            { itineraryItem: "Final breakfast in riad", briefDescription: "Last taste of Moroccan hospitality" },
            { itineraryItem: "Last-minute souk shopping", briefDescription: "Final bargaining for treasures" }
          ],
          afternoon: [
            { itineraryItem: "Airport transfer and departure", briefDescription: "Ma'a salama - farewell to Morocco" }
          ],
          evening: []
        }
      }
    ]
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
    createdAt: '2024-02-20',
    besttimetovisit: "Summer (June-August) for accessibility, Winter (November-March) for Northern Lights.",
    adventuresactivitiestodo: [
      "Drive the complete Ring Road circuit",
      "Chase Northern Lights (winter)",
      "Glacier hiking and ice caves",
      "Geothermal hot springs bathing",
      "Volcano and geyser exploration",
      "Puffin watching (summer)",
      "Traditional Icelandic cuisine tasting",
      "Photography of dramatic landscapes"
    ],
    localcuisinerecommendations: [
      "Fresh seafood: Langoustine and Arctic char",
      "Icelandic lamb: Free-range mountain lamb",
      "Fermented shark: Traditional delicacy",
      "Skyr: Icelandic yogurt-like dairy product",
      "Brennivín: Traditional schnapps",
      "Geothermal-baked bread: Rye bread cooked in hot springs"
    ],
    packingchecklist: [
      "Waterproof and windproof clothing",
      "Warm layers and thermal underwear",
      "Sturdy waterproof hiking boots",
      "Camera with extra batteries",
      "International driving permit",
      "First aid kit for remote areas",
      "Headlamp for dark winter months",
      "Swimwear for hot springs"
    ],
    topplacestovisit: [
      { name: "Golden Circle", coordinates: { lat: 64.3278, lng: -20.1200 } },
      { name: "Jokulsarlon Glacier Lagoon", coordinates: { lat: 64.0784, lng: -16.2306 } },
      { name: "Skaftafell National Park", coordinates: { lat: 64.0181, lng: -16.9758 } },
      { name: "Dettifoss Waterfall", coordinates: { lat: 65.8144, lng: -16.3861 } },
      { name: "Reykjavik", coordinates: { lat: 64.1466, lng: -21.9426 } }
    ],
    itinerary: [
      { 
        title: "Day 1-3: Reykjavik & Golden Circle", 
        activities: {
          morning: [
            { itineraryItem: "Arrive in Reykjavik", briefDescription: "Pick up rental car and explore colorful capital" }
          ],
          afternoon: [
            { itineraryItem: "Golden Circle tour", briefDescription: "Geysir, Gullfoss waterfall, and Thingvellir National Park" }
          ],
          evening: [
            { itineraryItem: "Northern Lights hunting", briefDescription: "Search for Aurora Borealis (winter months)" }
          ]
        }
      },
      { 
        title: "Day 4-8: South Coast Adventure", 
        activities: {
          morning: [
            { itineraryItem: "Drive to Jokulsarlon Glacier Lagoon", briefDescription: "Icebergs floating in glacial lake" }
          ],
          afternoon: [
            { itineraryItem: "Glacier hiking and ice caves", briefDescription: "Explore crystal blue ice formations" }
          ],
          evening: [
            { itineraryItem: "Stay in glacier accommodation", briefDescription: "Remote lodging near natural wonders" }
          ]
        }
      },
      { 
        title: "Day 9-12: Complete Ring Road & Departure", 
        activities: {
          morning: [
            { itineraryItem: "Continue Ring Road circuit", briefDescription: "Complete the 1,332km journey around Iceland" }
          ],
          afternoon: [
            { itineraryItem: "Visit remaining waterfalls and geysers", briefDescription: "Dettifoss, Godafoss, and other natural wonders" }
          ],
          evening: [
            { itineraryItem: "Return to Reykjavik", briefDescription: "Final night in capital before departure" }
          ]
        }
      }
    ]
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
    createdAt: '2024-02-25',
    besttimetovisit: "Dry season (December-April) is ideal for outdoor activities and wildlife viewing.",
    adventuresactivitiestodo: [
      "Zip-lining through cloud forests",
      "Wildlife spotting in national parks",
      "Volcano hiking and hot springs",
      "White water rafting adventures",
      "Beach relaxation on both coasts",
      "Coffee plantation tours",
      "Sea turtle watching",
      "Birdwatching for exotic species"
    ],
    localcuisinerecommendations: [
      "Gallo pinto: Rice and beans breakfast",
      "Casado: Traditional plate with rice, beans, and meat",
      "Ceviche: Fresh seafood marinated in citrus",
      "Tres leches cake: Sweet milk cake dessert",
      "Costa Rican coffee: World-renowned coffee beans",
      "Fresh tropical fruits: Pineapple, mango, papaya"
    ],
    packingchecklist: [
      "Quick-dry clothing for humid climate",
      "Insect repellent for rainforest",
      "Waterproof gear for rain",
      "Binoculars for wildlife viewing",
      "Sunscreen and hat",
      "Comfortable hiking shoes",
      "Camera with zoom lens",
      "First aid kit for adventures"
    ],
    topplacestovisit: [
      { name: "Manuel Antonio National Park", coordinates: { lat: 9.3680, lng: -84.1420 } },
      { name: "Arenal Volcano", coordinates: { lat: 10.4630, lng: -84.7030 } },
      { name: "Monteverde Cloud Forest", coordinates: { lat: 10.3181, lng: -84.7939 } },
      { name: "Tortuguero National Park", coordinates: { lat: 10.5558, lng: -83.5064 } },
      { name: "Tamarindo Beach", coordinates: { lat: 10.2996, lng: -85.8397 } }
    ],
    itinerary: [
      { 
        title: "Day 1-3: Arenal Volcano Region", 
        activities: {
          morning: [
            { itineraryItem: "Arrive in San José", briefDescription: "Transfer to Arenal volcano region" }
          ],
          afternoon: [
            { itineraryItem: "Volcano hiking and hot springs", briefDescription: "Explore active volcano and natural thermal pools" }
          ],
          evening: [
            { itineraryItem: "Night wildlife tour", briefDescription: "Spot nocturnal animals in rainforest" }
          ]
        }
      },
      { 
        title: "Day 4-6: Monteverde Adventures", 
        activities: {
          morning: [
            { itineraryItem: "Cloud forest exploration", briefDescription: "Walk through mystical cloud forest canopy" }
          ],
          afternoon: [
            { itineraryItem: "Zip-lining adventure", briefDescription: "Fly through treetops on canopy tours" }
          ],
          evening: [
            { itineraryItem: "Coffee plantation tour", briefDescription: "Learn about Costa Rican coffee production" }
          ]
        }
      },
      { 
        title: "Day 7-10: Pacific Coast & Departure", 
        activities: {
          morning: [
            { itineraryItem: "Manuel Antonio National Park", briefDescription: "Wildlife viewing and pristine beaches" }
          ],
          afternoon: [
            { itineraryItem: "Beach relaxation and water sports", briefDescription: "Surfing, snorkeling, and sunbathing" }
          ],
          evening: [
            { itineraryItem: "Sea turtle watching", briefDescription: "Observe nesting turtles on beach" }
          ]
        }
      }
    ]
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
    createdAt: '2024-03-01',
    besttimetovisit: "Spring (April-May) and Autumn (September-November) offer pleasant weather and beautiful seasons.",
    adventuresactivitiestodo: [
      "Explore traditional palaces and temples",
      "Experience K-pop culture and entertainment",
      "Street food tours in Myeongdong",
      "Shopping in Gangnam district",
      "Visit DMZ (Demilitarized Zone)",
      "Traditional Korean spa (jjimjilbang)",
      "Han River park activities",
      "Traditional market exploration"
    ],
    localcuisinerecommendations: [
      "Korean BBQ: Grilled meat with banchan sides",
      "Kimchi: Fermented vegetables, Korean staple",
      "Bibimbap: Mixed rice bowl with vegetables",
      "Korean fried chicken: Crispy and flavorful",
      "Hotteok: Sweet pancakes with filling",
      "Soju: Traditional Korean alcoholic beverage"
    ],
    packingchecklist: [
      "Comfortable walking shoes",
      "T-money card for subway system",
      "Portable wifi or SIM card",
      "Camera for vibrant city scenes",
      "Light layers for variable weather",
      "Cash for street food and markets",
      "Korean phrase book or translation app",
      "Portable charger for long days"
    ],
    topplacestovisit: [
      { name: "Gyeongbokgung Palace", coordinates: { lat: 37.5788, lng: 126.9770 } },
      { name: "Myeongdong", coordinates: { lat: 37.5636, lng: 126.9826 } },
      { name: "Gangnam District", coordinates: { lat: 37.5172, lng: 127.0473 } },
      { name: "Bukchon Hanok Village", coordinates: { lat: 37.5824, lng: 126.9835 } },
      { name: "Dongdaemun", coordinates: { lat: 37.5658, lng: 127.0088 } }
    ],
    itinerary: [
      { 
        title: "Day 1-2: Traditional Seoul", 
        activities: {
          morning: [
            { itineraryItem: "Arrive at Incheon Airport", briefDescription: "Airport transfer to Seoul city center" }
          ],
          afternoon: [
            { itineraryItem: "Gyeongbokgung Palace tour", briefDescription: "Explore Korea's grandest royal palace" }
          ],
          evening: [
            { itineraryItem: "Traditional Korean BBQ dinner", briefDescription: "Authentic bulgogi and galbi experience" }
          ]
        }
      },
      { 
        title: "Day 3-5: Modern Culture", 
        activities: {
          morning: [
            { itineraryItem: "Gangnam district exploration", briefDescription: "Experience modern Korean lifestyle" }
          ],
          afternoon: [
            { itineraryItem: "K-pop entertainment and shopping", briefDescription: "Visit entertainment companies and K-pop stores" }
          ],
          evening: [
            { itineraryItem: "Noraebang (karaoke) experience", briefDescription: "Sing your heart out Korean-style" }
          ]
        }
      },
      { 
        title: "Day 6-8: Food & Markets", 
        activities: {
          morning: [
            { itineraryItem: "Traditional market tour", briefDescription: "Namdaemun and Dongdaemun markets" }
          ],
          afternoon: [
            { itineraryItem: "Street food adventure", briefDescription: "Try Korean street snacks and beverages" }
          ],
          evening: [
            { itineraryItem: "Han River evening activities", briefDescription: "Riverside picnic and city views" }
          ]
        }
      }
    ]
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
    createdAt: '2024-03-05',
    besttimetovisit: "May to September offers the best weather and longest daylight hours for Highland exploration.",
    adventuresactivitiestodo: [
      "Highland castle tours and history",
      "Whisky distillery tastings",
      "Loch Ness monster hunting",
      "Highland Games (seasonal)",
      "Hiking in Cairngorms National Park",
      "Isle of Skye day trip",
      "Traditional Scottish music sessions",
      "Highland clan heritage exploration"
    ],
    localcuisinerecommendations: [
      "Haggis: Traditional Scottish dish",
      "Fresh Scottish salmon and seafood",
      "Shortbread: Classic Scottish biscuit",
      "Single malt whisky: World-renowned spirits",
      "Tablet: Sweet Scottish confection",
      "Scottish breakfast: Full hearty morning meal"
    ],
    packingchecklist: [
      "Waterproof jacket and layers",
      "Warm clothing for unpredictable weather",
      "Comfortable hiking boots",
      "Camera for stunning landscapes",
      "Umbrella for frequent showers",
      "Insect repellent for Highland midges",
      "Cash for small Highland establishments",
      "Guidebook for clan and castle history"
    ],
    topplacestovisit: [
      { name: "Loch Ness", coordinates: { lat: 57.3229, lng: -4.4244 } },
      { name: "Edinburgh Castle", coordinates: { lat: 55.9486, lng: -3.1999 } },
      { name: "Isle of Skye", coordinates: { lat: 57.2736, lng: -6.2155 } },
      { name: "Stirling Castle", coordinates: { lat: 56.1222, lng: -3.9467 } },
      { name: "Glencoe", coordinates: { lat: 56.6756, lng: -5.1019 } }
    ],
    itinerary: [
      { 
        title: "Day 1-2: Edinburgh & Stirling", 
        activities: {
          morning: [
            { itineraryItem: "Arrive in Edinburgh", briefDescription: "Explore Scotland's historic capital city" }
          ],
          afternoon: [
            { itineraryItem: "Edinburgh Castle tour", briefDescription: "Discover Scottish royal history and crown jewels" }
          ],
          evening: [
            { itineraryItem: "Traditional Scottish dinner", briefDescription: "Haggis and whisky tasting experience" }
          ]
        }
      },
      { 
        title: "Day 3-5: Highlands & Lochs", 
        activities: {
          morning: [
            { itineraryItem: "Drive to Scottish Highlands", briefDescription: "Scenic journey through dramatic landscapes" }
          ],
          afternoon: [
            { itineraryItem: "Loch Ness and castle visits", briefDescription: "Search for the monster and explore ancient castles" }
          ],
          evening: [
            { itineraryItem: "Highland lodge accommodation", briefDescription: "Stay in traditional Scottish accommodation" }
          ]
        }
      },
      { 
        title: "Day 6-7: Isle of Skye & Departure", 
        activities: {
          morning: [
            { itineraryItem: "Isle of Skye day trip", briefDescription: "Explore rugged landscapes and fairy pools" }
          ],
          afternoon: [
            { itineraryItem: "Whisky distillery tour", briefDescription: "Learn about Scotch whisky production" }
          ],
          evening: [
            { itineraryItem: "Farewell ceilidh (Scottish dance)", briefDescription: "Traditional music and dancing celebration" }
          ]
        }
      }
    ]
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
    createdAt: '2024-03-10',
    besttimetovisit: "Spring (March-May) for cherry blossoms, Autumn (September-November) for fall colors.",
    adventuresactivitiestodo: [
      "Explore ancient temples and shrines",
      "Walk through Arashiyama Bamboo Grove",
      "Traditional tea ceremony experience",
      "Geisha district exploration in Gion",
      "Fushimi Inari shrine thousand torii gates",
      "Traditional kaiseki dining",
      "Philosopher's Path scenic walk",
      "Traditional craft workshops"
    ],
    localcuisinerecommendations: [
      "Kaiseki: Multi-course traditional Japanese meal",
      "Tofu cuisine: Buddhist vegetarian dishes",
      "Matcha sweets: Green tea flavored desserts",
      "Kyoto-style sushi: Traditional preparation",
      "Yudofu: Hot tofu in kombu broth",
      "Sake: Traditional rice wine tasting"
    ],
    packingchecklist: [
      "Comfortable walking shoes for temple visits",
      "Respectful clothing for sacred sites",
      "Camera for seasonal beauty",
      "JR Pass for train travel",
      "Cash for traditional establishments",
      "Light layers for variable weather",
      "Small day pack for temple hopping",
      "Portable phone charger"
    ],
    topplacestovisit: [
      { name: "Fushimi Inari Shrine", coordinates: { lat: 34.9671, lng: 135.7727 } },
      { name: "Kiyomizu-dera Temple", coordinates: { lat: 34.9948, lng: 135.7851 } },
      { name: "Arashiyama Bamboo Grove", coordinates: { lat: 35.0170, lng: 135.6761 } },
      { name: "Gion District", coordinates: { lat: 35.0028, lng: 135.7753 } },
      { name: "Golden Pavilion (Kinkaku-ji)", coordinates: { lat: 35.0394, lng: 135.7292 } }
    ],
    itinerary: [
      { 
        title: "Day 1-2: Traditional Temples", 
        activities: {
          morning: [
            { itineraryItem: "Arrive in Kyoto", briefDescription: "Transfer to traditional ryokan accommodation" }
          ],
          afternoon: [
            { itineraryItem: "Fushimi Inari Shrine visit", briefDescription: "Walk through thousands of red torii gates" }
          ],
          evening: [
            { itineraryItem: "Traditional kaiseki dinner", briefDescription: "Multi-course Japanese artistic meal" }
          ]
        }
      },
      { 
        title: "Day 3-4: Gardens & Culture", 
        activities: {
          morning: [
            { itineraryItem: "Golden Pavilion (Kinkaku-ji)", briefDescription: "Visit Kyoto's most famous temple" }
          ],
          afternoon: [
            { itineraryItem: "Arashiyama Bamboo Grove walk", briefDescription: "Stroll through mystical bamboo forest" }
          ],
          evening: [
            { itineraryItem: "Gion district geisha spotting", briefDescription: "Traditional entertainment district exploration" }
          ]
        }
      },
      { 
        title: "Day 5-6: Tea Culture & Departure", 
        activities: {
          morning: [
            { itineraryItem: "Traditional tea ceremony", briefDescription: "Learn the art of Japanese tea preparation" }
          ],
          afternoon: [
            { itineraryItem: "Philosopher's Path walk", briefDescription: "Scenic path connecting temples and shrines" }
          ],
          evening: [
            { itineraryItem: "Farewell dinner at traditional restaurant", briefDescription: "Final taste of Kyoto cuisine" }
          ]
        }
      }
    ]
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
