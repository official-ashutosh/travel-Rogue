import Header from "@/components/dashboard/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.travelrogue.site"),
  title: {
    default: "Dashboard",
    template: "%s | Travel Rogue - Your Smart Travel Planner",
  },
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
        url: "opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Travel Rogue",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex min-h-[calc(100svh-4rem)] flex-col items-center bg-blue-50/40">
        {children}
      </main>
    </>
  );
}
