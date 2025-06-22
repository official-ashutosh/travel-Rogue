import { MapPin, Route, Plane, Mountain } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext.jsx"

export default function ModernLogo() {
  const { isAuthenticated } = useAuth()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex gap-10 items-center justify-start flex-1">
      <Link
        to={isAuthenticated ? "/dashboard" : "/"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group"
      >
        <div className="flex items-center gap-3 transition-all duration-300 group-hover:scale-105">
          {/* Logo Icon */}
          <div className="relative">
            {/* Main Icon Container */}
            <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-500 dark:via-purple-500 dark:to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-blue-900/50 group-hover:shadow-xl dark:group-hover:shadow-blue-800/70 transition-all duration-300 group-hover:rotate-3">
              {/* Primary Icon - MapPin with Route */}
              <div className="relative">
                <MapPin className={`w-6 h-6 text-white transition-all duration-300 ${isHovered ? "scale-110" : ""}`} />
                <Route
                  className={`absolute -bottom-1 -right-1 w-3 h-3 text-yellow-300 dark:text-yellow-200 opacity-80 transition-all duration-300 ${isHovered ? "rotate-12 scale-125" : ""}`}
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 dark:bg-yellow-300 rounded-full animate-pulse">
                <div className="absolute inset-0.5 bg-yellow-300 dark:bg-yellow-200 rounded-full"></div>
              </div>

              {/* Adventure Trail */}
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-400 dark:bg-green-300 rounded-full opacity-80 group-hover:animate-bounce"></div>
            </div>

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-300/30 dark:to-purple-300/30 rounded-2xl blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Floating Icons */}
            <div
              className={`absolute -top-2 -right-2 transition-all duration-500 ${
                isHovered ? "translate-x-1 -translate-y-1 opacity-100" : "opacity-0"
              }`}
            >
              <div className="w-4 h-4 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center">
                <Plane className="w-2 h-2 text-white" />
              </div>
            </div>

            <div
              className={`absolute -bottom-2 -left-2 transition-all duration-700 ${
                isHovered ? "-translate-x-1 translate-y-1 opacity-100" : "opacity-0"
              }`}
            >
              <div className="w-4 h-4 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center">
                <Mountain className="w-2 h-2 text-white" />
              </div>
            </div>
          </div>

          {/* Brand Text */}
          <div className="flex flex-col leading-tight">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-gray-100 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 transition-all duration-300">
                Travel
              </span>
              <div className="w-1 h-1 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></div>
            </div>

            <div className="flex items-center gap-1 -mt-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-700 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 dark:group-hover:from-purple-400 dark:group-hover:to-blue-400 transition-all duration-300">
                Rogue
              </span>

              {/* Adventure Badge */}
              <div
                className={`ml-1 px-2 py-0.5 bg-gradient-to-r from-orange-400 to-red-500 dark:from-orange-500 dark:to-red-600 text-white text-xs font-semibold rounded-full transition-all duration-300 ${
                  isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
                }`}
              >
                AI
              </div>
            </div>

            {/* Tagline */}
            <div
              className={`text-xs text-gray-500 dark:text-gray-400 font-medium transition-all duration-300 ${
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
              }`}
            >
              Adventure Awaits
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
