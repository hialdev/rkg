import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { useLocale } from "../../../contexts/LocaleContext";
import {
   tripType,
   selectedLocations,
   setTripType,
   setSelectedLocations,
} from "../../../stores/search";
import { tripsData, cities, countries } from "../../../mock";
import OfflineIcon from "../../OfflineIcon";
import OpenTrip from "../../cards/OpenTrip";
import LocaleOpenTrip from "../../cards/LocaleOpenTrip";
import { getTrips, type Trip } from "../../../fetchers";

interface FilteredTripsProps {
   initialLocations: string[];
   initialTripType: string;
}

export default function FilteredTrips({
   initialLocations,
   initialTripType,
}: FilteredTripsProps) {
   const { translations } = useLocale();
   const [tripType, setTripType] = useState<
      "all" | "open-trip" | "private-trip" | string
   >(initialTripType);
   const [filtered, setFiltered] = useState<Trip[]>([]);

   useEffect(() => {
      const fetchTrips = async () => {
         try {
            const params = {type:tripType !== "all" ? tripType : "", location:initialLocations.join(',')}
            const res = await getTrips(params);
            const trips = res.data.data;

            setFiltered(trips);
         } catch (error) {
            console.error("Failed to fetch locations:", error);
         }
      };
      fetchTrips();
   }, [tripType]);
   // Get localized trip type labels
   const getTripTypeLabel = () => {
      if (tripType === "all") return translations.label?.all;
      if (tripType === "open-trip") return translations.services.items[0].title;
      if (tripType === "private-trip")
         return translations.services.items[1].title;
      return translations.nav.services;
   };
   useEffect(() => {
      getTripTypeLabel();
   }, [tripType]);

   return (
      <>
         <div className="flex items-center gap-3 mb-10">
            <h2 className="text-4xl font-medium">{getTripTypeLabel()}</h2>
            <div className="aspect-square flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full p-3 font-medium">
               {filtered != null ? filtered.length : 0}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {filtered != null && filtered.length > 0 ? (
               filtered.map((trip, i) => <LocaleOpenTrip key={i} trip={trip} />)
            ) : (
               <p className="col-span-full text-center text-gray-500">
                  {translations.services.items[2]?.description ?? ""}
               </p>
            )}
         </div>
      </>
   );
}
