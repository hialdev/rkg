import React, { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { useLocale } from "../../../contexts/LocaleContext";
import {
   tripType,
   selectedCityIds,
   setTripType,
   setSelectedCities,
} from "../../../stores/search";
import { tripsData, cities, countries } from "../../../mock";
import OfflineIcon from "../../OfflineIcon";
import OpenTrip from "../../cards/OpenTrip";
import LocaleOpenTrip from "../../cards/LocaleOpenTrip";

interface FilteredTripsProps {
   initialCities: string[];
   initialTripType: string;
}

export default function FilteredTrips({
   initialCities,
   initialTripType,
}: FilteredTripsProps) {
   const { translations } = useLocale();
   const currentTripType = useStore(tripType);
   const currentCities = useStore(selectedCityIds);

   useEffect(() => {
      const numericCities = initialCities
         .map((id) => {
            const num = Number(id);
            return isNaN(num) ? 0 : num;
         })
         .filter((id) => id > 0);

      setSelectedCities(numericCities);
      setTripType(initialTripType);
   }, [initialCities, initialTripType]);

   const filtered = tripsData.filter((trip) => {
      const typeMatch =
         currentTripType === "all" || trip.type === currentTripType;
      const cityMatch =
         currentCities.length === 0 || currentCities.includes(trip.city_id);
      return typeMatch && cityMatch;
   });

   // Get localized trip type labels
   const getTripTypeLabel = () => {
      if (currentTripType === "all") return translations.label?.all;
      if (currentTripType === "open-trip") return translations.services.items[0].title;
      if (currentTripType === "private-trip") return translations.services.items[1].title;
      return translations.nav.services;
   };

   return (
      <>
         <div className="flex items-center gap-3 mb-10">
            <h2 className="text-4xl font-medium">
               {getTripTypeLabel()}
            </h2>
            <div className="aspect-square flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full p-3 font-medium">
               {filtered.length}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {filtered.length > 0 ? (
               filtered.map((trip, i) => <LocaleOpenTrip key={i} trip={trip} />)
            ) : (
               <p className="col-span-full text-center text-gray-500">
                  {translations.services.items[2].description} {/* Using third service item description as "No trips found" */}
               </p>
            )}
         </div>
      </>
   );
}
