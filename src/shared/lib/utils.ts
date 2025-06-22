import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DateRange } from "react-day-picker";
import { formatDate } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDisplayName = (
  firstName: string | undefined,
  lastName: string | undefined,
  email: string
) => {
  if (!firstName) return email;
  return firstName + (lastName ? ` ${lastName}` : "") + ` (${email})`;
};

export const getFormattedDateRange = (
  fromDate: Date,
  toDate: Date,
  formatStr: string = "PPP"
) => {
  return `${formatDate(fromDate, formatStr)} - ${formatDate(toDate, formatStr)}`;
};

// Image placeholder utility
export const getImageUrl = (
  imageUrl?: string,
  width = 400,
  height = 300
): string => {
  if (imageUrl && !imageUrl.includes("/api/placeholder/")) {
    return imageUrl;
  }

  // If no image URL or it's a broken placeholder, use a more reliable placeholder service
  return `https://picsum.photos/${width}/${height}?blur=1`;
};

// Handle image load errors
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  const currentSrc = img.src;
  
  // Try different fallback strategies in order
  if (currentSrc.includes('images.unsplash.com')) {
    // If Unsplash fails, try Picsum
    const rect = img.getBoundingClientRect();
    const width = Math.round(rect.width) || 400;
    const height = Math.round(rect.height) || 300;
    img.src = `https://picsum.photos/${width}/${height}?blur=1`;
  } else if (currentSrc.includes('picsum.photos')) {
    // If Picsum fails, try via.placeholder
    const rect = img.getBoundingClientRect();
    const width = Math.round(rect.width) || 400;
    const height = Math.round(rect.height) || 300;
    img.src = `https://via.placeholder.com/${width}x${height}/e2e8f0/64748b?text=Travel+Image`;
  } else if (currentSrc.includes('via.placeholder.com')) {
    // If via.placeholder fails, use local fallback
    img.src = '/placeholder.svg';
  } else if (!currentSrc.includes('/placeholder.svg')) {
    // For any other failed images, try Picsum first
    const rect = img.getBoundingClientRect();
    const width = Math.round(rect.width) || 400;
    const height = Math.round(rect.height) || 300;
    img.src = `https://picsum.photos/${width}/${height}?blur=1`;
  }
  
  // Prevent infinite error loops
  img.onerror = null;
};