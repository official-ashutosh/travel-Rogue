"use client"

import { Calendar, MapPin, Users, Clock, Star, Share2, Eye } from "lucide-react"
import { Card, CardContent } from "@/frontend/components/ui/card"
import { Badge } from "@/frontend/components/ui/badge"
import { Button } from "@/frontend/components/ui/button"
import { getImageUrl, handleImageError } from "@/src/shared/lib/utils"
import Link from "next/link"
import Image from "next/image"

export type Plan = {
  _id: string
  nameoftheplace: string
  imageUrl?: string
  fromDate?: string
  toDate?: string
  isSharedPlan?: boolean
  duration?: number
  travelers?: number
  rating?: number
  views?: number
}

type ModernPlanCardProps = {
  plan: Plan
  isPublic?: boolean
  viewMode?: 'grid' | 'list'
}

const ModernPlanCard = ({ plan, isPublic = false, viewMode = 'grid' }: ModernPlanCardProps) => {
  const formatDateRange = (fromDate?: string, toDate?: string) => {
    if (!fromDate || !toDate) return null
    const from = new Date(fromDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const to = new Date(toDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    return `${from} - ${to}`
  }

  if (viewMode === 'list') {
    return (
      <Link href={isPublic ? `/plans/${plan._id}/community-plan` : `/plans/${plan._id}/plan`} className="group block">
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg dark:shadow-gray-900/30 dark:hover:shadow-gray-900/50 transition-all duration-200 group-hover:scale-[1.01] bg-white dark:bg-gray-800">
          <div className="flex gap-4 p-4">
            {/* Image */}            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={getImageUrl(plan.imageUrl, 96, 96)}
                alt={plan.nameoftheplace}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                onError={handleImageError}
              />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {plan.nameoftheplace}
                  </h3>
                  {plan.fromDate && plan.toDate && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDateRange(plan.fromDate, plan.toDate)}
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="flex gap-2">
                  {plan.isSharedPlan && (
                    <Badge variant="secondary" className="text-xs">
                      <Share2 className="w-3 h-3 mr-1" />
                      Shared
                    </Badge>
                  )}
                  {isPublic && (
                    <Badge variant="outline" className="text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      Public
                    </Badge>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  {plan.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{plan.duration} days</span>
                    </div>
                  )}
                  {plan.travelers && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{plan.travelers} travelers</span>
                    </div>
                  )}
                  {plan.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{plan.rating}</span>
                    </div>
                  )}
                </div>

                <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  <MapPin className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={isPublic ? `/plans/${plan._id}/community-plan` : `/plans/${plan._id}/plan`} className="group block">
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70 transition-all duration-300 group-hover:scale-[1.02] bg-white dark:bg-gray-800">
        <div className="relative">
          {/* Image */}          <div className="relative h-48 overflow-hidden">
            <Image
              src={getImageUrl(plan.imageUrl, 300, 200)}
              alt={plan.nameoftheplace}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onError={handleImageError}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {plan.isSharedPlan && (
                <Badge className="bg-blue-500/90 text-white border-0 backdrop-blur-sm">
                  <Share2 className="w-3 h-3 mr-1" />
                  Shared
                </Badge>
              )}
              {isPublic && (
                <Badge className="bg-green-500/90 text-white border-0 backdrop-blur-sm">
                  <Eye className="w-3 h-3 mr-1" />
                  Public
                </Badge>
              )}
            </div>

            {/* Rating */}
            {plan.rating && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium text-gray-900 dark:text-white">{plan.rating}</span>
              </div>
            )}

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-200 transition-colors">
                {plan.nameoftheplace}
              </h3>
              {plan.fromDate && plan.toDate && (
                <div className="flex items-center text-white/90 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDateRange(plan.fromDate, plan.toDate)}
                </div>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Trip Details */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-4">
              {plan.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{plan.duration} days</span>
                </div>
              )}
              {plan.travelers && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{plan.travelers} travelers</span>
                </div>
              )}
            </div>
            {plan.views && (
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Eye className="w-4 h-4" />
                <span>{plan.views}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            variant="ghost"
            className="w-full justify-start text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 p-0 h-auto font-medium"
          >
            <MapPin className="w-4 h-4 mr-2" />
            View Itinerary
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}

export { ModernPlanCard }
export default ModernPlanCard
