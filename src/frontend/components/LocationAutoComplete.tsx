"use client";
import {Input} from "@/frontend/components/ui/input";
import {ChangeEvent, MouseEvent, useState} from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import {Loading} from "@/frontend/components/shared/Loading";
import {Search} from "lucide-react";
import {useToast} from "@/frontend/components/ui/use-toast";

type LocationAutoCompletePropType = {
  planId: string;
  addNewPlaceToTopPlaces: (lat: number, lng: number, placeName: string) => void;
};

const LocationAutoComplete = ({planId, addNewPlaceToTopPlaces}: LocationAutoCompletePropType) => {
  const [showReults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const {toast} = useToast();

  const [searchQuery, setSearchQuery] = useState("");

  // Add a placeholder for updatePlaceToVisit (replace with your MERN API call)
  const updatePlaceToVisit = async ({placeName, lat, lng, planId}: {placeName: string; lat: number; lng: number; planId: string}) => {
    // TODO: Replace with your MERN backend API call
    // Example: await fetch(`/api/plans/${planId}/top-places`, { method: 'POST', body: JSON.stringify({ placeName, lat, lng }) })
    return Promise.resolve();
  };

  const {placesService, placePredictions, getPlacePredictions, isPlacePredictionsLoading} =
    usePlacesService({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });

  const hadleSelectItem = (e: MouseEvent<HTMLLIElement>, placeId: string) => {
    e.stopPropagation();
    setShowResults(false);
    setIsSaving(true);
    const {dismiss} = toast({
      description: `Adding the selected place!`,
    });
    placesService?.getDetails({placeId}, (e) => {
      const lat = e?.geometry?.location?.lat();
      const lng = e?.geometry?.location?.lng();
      if (!lat || !lng || !e?.name) return;

      // updatePlaceToVisit is now a local async function
      updatePlaceToVisit({
        placeName: e?.name,
        lat,
        lng,
        planId: planId,
      }).then(() => {
        setSearchQuery("");
        setIsSaving(false);
        dismiss();
        addNewPlaceToTopPlaces(lat, lng, e.name || "New Place");
      });
    });
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value) {
      getPlacePredictions({input: value});
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative ">
        <Input
          disabled={isSaving}
          type="text"
          className="font-light h-12"
          placeholder="Search new location"
          onChange={handleSearch}
          value={searchQuery}
          onBlur={() => setShowResults(false)}
        />
        {isPlacePredictionsLoading ? (
          <div className="absolute right-3 top-0 h-full flex items-center">
            <Loading className="w-6 h-6" />
          </div>
        ) : (
          <div className="absolute right-3 top-0 h-full flex items-center">
            <Search className="w-4 h-4" />
          </div>
        )}
      </div>
      {showReults && (
        <div
          className="absolute w-full
        mt-2 shadow-md rounded-xl p-1 bg-background max-h-80 overflow-auto
        z-50"
          onMouseDown={(e) => e.preventDefault()}
        >
          <ul className="w-full flex flex-col gap-2" onMouseDown={(e) => e.preventDefault()}>
            {placePredictions.map((item) => (
              <li
                className="cursor-pointer
                border-b 
                flex justify-between items-center
                hover:bg-muted hover:rounded-lg
                px-1 py-2 text-sm"
                onClick={(e) => hadleSelectItem(e, item.place_id)}
                key={item.place_id}
              >
                {item.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationAutoComplete;
