import Dashboard from "@/frontend/components/dashboard/Dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Travel Rogue provides intelligent travel suggestions, personalized itineraries, and seamless trip planning. Plan your perfect trip with ease.",
  keywords:
    "travel planner, Travel Rogue, smart travel, travel suggestions, destination insights, personalized itineraries, trip planning, travel tips, vacation planning",

  openGraph: {
    title: "Travel Rogue - Your Smart Travel Planner",
    description:
      "Travel Rogue provides intelligent travel suggestions, personalized itineraries, and seamless trip planning. Plan your perfect trip with ease.",
    url: "https://www.travelrogue.site",
    type: "website",
    siteName: "TravelRogue",
    images: [
      {
        url: "https://www.travelrogue.site/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Travel Rogue",
      },
    ],
  },
};

export default function DashboardPage() {
  return <Dashboard />;
}
