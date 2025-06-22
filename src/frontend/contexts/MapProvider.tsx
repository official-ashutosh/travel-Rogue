//Since the map will be laoded and displayed on client side
"use client";

import {SkeletonForTopPlacesToVisit} from "@/frontend/components/sections/TopPlacesToVisit";
// Import necessary modules and functions from external libraries and our own project
import {Libraries, useJsApiLoader} from "@react-google-maps/api";
import {ReactNode, useEffect} from "react";

// Define a list of libraries to load from the Google Maps API
const libraries = ["places", "drawing", "geometry"];

// Define a function component called MapProvider that takes a children prop
export function MapProvider({children, isLoading}: {children: ReactNode; isLoading: boolean}) {
  // Check if API key is available
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("❌ Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env.local file");
    } else {
      console.log("✅ Google Maps API key is configured");
    }
  }, []);

  // Load the Google Maps JavaScript API asynchronously
  const {isLoaded: scriptLoaded, loadError} = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as Libraries,
  });

  if (loadError) {
    console.error("❌ Google Maps load error:", loadError);
    return <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <p>❌ Error loading Google Maps</p>
      <p className="text-sm">Please check your Google Maps API key configuration</p>
    </div>;
  }

  if (!scriptLoaded || isLoading) return <SkeletonForTopPlacesToVisit isMaps />;

  // Return the children prop wrapped by this MapProvider component
  return children;
}
