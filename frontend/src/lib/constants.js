import { 
  MapPin, 
  Sailboat, 
  Palette, 
  Castle, 
  UserIcon, 
  ShoppingBag, 
  MoonStar,
  Heart,
  Users2,
  Contact,
  Info,
  Navigation,
  Utensils,
  Backpack,
  Clock3
} from 'lucide-react';

// Activity preferences for travel planning
export const ACTIVITY_PREFERENCES = [
  { id: 'sightseeing', displayName: 'Sightseeing', icon: MapPin },
  { id: 'adventure', displayName: 'Adventure', icon: Sailboat },
  { id: 'culturalexperiences', displayName: 'Cultural Experiences', icon: Palette },
  { id: 'historical', displayName: 'Historical', icon: Castle },
  { id: 'relaxationwellness', displayName: 'Relaxation', icon: UserIcon },
  { id: 'shopping', displayName: 'Shopping', icon: ShoppingBag },
  { id: 'nightlife', displayName: 'Nightlife', icon: MoonStar },
];

// Companion preferences for travel planning
export const COMPANION_PREFERENCES = [
  { id: 'solo', displayName: 'Solo', icon: UserIcon },
  { id: 'couple', displayName: 'Couple', icon: Heart },
  { id: 'family', displayName: 'Family', icon: Users2 },
  { id: 'group', displayName: 'Group', icon: Contact },
];

// Plan sections for navigation
export const planSections = [
  {
    id: 'abouttheplace',
    name: 'About the Place',
    icon: <Info className="mr-2 h-4 w-4" />,
    isPublic: true,
  },
  {
    id: 'topplacestovisit',
    name: 'Top Places to Visit',
    icon: <MapPin className="mr-2 h-4 w-4" />,
    isPublic: true,
  },
  {
    id: 'itinerary',
    name: 'Itinerary',
    icon: <Navigation className="mr-2 h-4 w-4" />,
    isPublic: true,
  },
  {
    id: 'localcuisinerecommendations',
    name: 'Local Cuisines',
    icon: <Utensils className="mr-2 h-4 w-4" />,
    isPublic: true,
  },
  {
    id: 'packingchecklist',
    name: 'Packing Checklist',
    icon: <Backpack className="mr-2 h-4 w-4" />,
    isPublic: true,
  },
  {
    id: 'besttimetovisit',
    name: 'Best time to visit',
    icon: <Clock3 className="mr-2 h-4 w-4" />,
    isPublic: true,
  },
];

// Control center sections
export const controlCenterSections = [
  {
    id: 'settings',
    title: 'Settings',
    icon: <Info className="mr-2 h-4 w-4" />,
    tooltipText: 'Plan settings and preferences',
  },
];

// Navigation links
export const navlinks = [
  { text: 'How it works', id: 'how-it-works' },
  { text: 'Community Plans', id: 'public-plans' },
  { text: 'Pricing', id: 'pricing' },
];

// Feature list
export const features = [
  'Top Spots Unveiled',
  'Tailored Itineraries',
  'Optimal Timing',
  'Foodie Hotspots',
  'Prime Experiences',
  'Invite Others',
  'Expense tracking',
];
