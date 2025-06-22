"use client";
import {Button} from "@/frontend/components/ui/button";
import useAuth from "@/frontend/hooks/useAuth";
import {Compass, Sparkles} from "lucide-react";

const GeneratePlanButton = () => {
  const {openSignInPopupOrDirect} = useAuth();
  return (
    <Button
      aria-label="generate plan"
      onClick={openSignInPopupOrDirect}
      variant="default"
      className="group relative bg-gradient-to-r from-blue-600 to-blue-700 
                 hover:from-blue-700 hover:to-blue-800
                 text-white font-bold text-lg px-8 py-4
                 rounded-2xl shadow-lg hover:shadow-xl
                 transition-all duration-300 ease-in-out
                 border-0 overflow-hidden
                 transform hover:scale-105"
    >
      {/* Background shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                      opacity-0 group-hover:opacity-100 group-hover:animate-pulse
                      transition-opacity duration-500"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center gap-3">
        <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
        <span>Start Your Adventure</span>
        <div className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full ml-2">
          FREE
        </div>
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-blue-600 opacity-50 blur-xl group-hover:opacity-70 transition-opacity duration-300 -z-10"></div>
    </Button>
  );
};

export default GeneratePlanButton;
