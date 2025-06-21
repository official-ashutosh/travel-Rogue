import type { Metadata } from "next";
import { Montserrat_Alternates } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/contexts/ThemeProvider";

import AppToastProvider from "@/components/ui/AppToastProvider";

import Progress from "@/components/Progress";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const inter = Montserrat_Alternates({ weight: "500", subsets: ["cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.travelrogue.site"),
  title: {
    default: "Travel Rogue - Your Smart Travel Companion",
    template: "%s | Travel Rogue - Your Smart Travel Companion",
  },
  description:
    "Travel Rogue provides intelligent travel suggestions, personalized itineraries, and seamless trip planning. Plan your perfect trip with ease.",
  keywords:
    "travel rogue, AI travel planner, smart travel, travel suggestions, destination insights, personalized itineraries, trip planning, travel tips, vacation planning",
  openGraph: {
    title: "Travel Rogue - Your Smart Travel Companion",
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AppToastProvider>
            {children}
            <Progress />
            <Analytics />
          </AppToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
