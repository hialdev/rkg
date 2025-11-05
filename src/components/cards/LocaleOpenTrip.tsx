import React from "react";
import { useLocale } from "../../contexts/LocaleContext";
import OfflineIcon from "../OfflineIcon";
import { cities, countries, tripsData, type openTrips } from "../../mock";

interface OpenTripProps {
   trip: (typeof tripsData)[0];
}

const LocaleOpenTrip: React.FC<OpenTripProps> = ({ trip }) => {
   const { translations } = useLocale();
   const city = cities.find((c) => c.id === trip.city_id);
   const country = countries.find((c) => c.id === city?.country_id);

   return (
      <div className="relative rounded-xl overflow-hidden">
         <div className="absolute rounded-br-xl overflow-hidden flex items-center top-0 start-0">
            <div
               className={`${"p-2 px-4 text-white font-medium text-sm"} ${
                  trip.type == "open-trip"
                     ? "bg-linear-to-bl from-emerald-300 to-cyan-700"
                     : "bg-linear-to-tl from-yellow-400 via-yellow-600 to-orange-300"
               }`}
            >
               {trip.type == "open-trip" ? "Open Trip" : "Private Trip"}
            </div>
            <div className=" p-2 px-4 bg-emerald-600 text-white font-medium text-sm">
               {translations.label.best}{" "}
               {/* Using first service item title as "Best Seller" */}
            </div>
         </div>
         <img
            src={trip.image.path}
            alt={trip.image.alt}
            width={426}
            height={240}
            className="aspect-video rounded-xl w-full"
         />

         <div className="py-4 cursor-pointer" onClick={() => window.location.href = `/trips/${trip.slug}`}>
            <h2 className="font-medium text-lg">{trip.title}</h2>

            <div className="flex items-center justify-between pt-2 pb-5 border-b">
               <div>
                  <div className="text-sm text-stone-400">
                     {translations.label.destination}
                  </div>{" "}
                  {/* Using gallery title as "Destination" */}
                  <div className="flex mt-1 items-center gap-2">
                     <OfflineIcon name="map" />
                     <div className="text-stone-800">
                        {city?.name}, {country?.name}
                     </div>
                  </div>
               </div>
               <div>
                  <div className="text-sm text-stone-400">
                     {translations.label.duration}
                  </div>{" "}
                  {/* Using contact phone as "Duration" */}
                  <div className="flex mt-1 items-center gap-2">
                     <OfflineIcon name="clock" />
                     <div className="text-stone-800">{trip.duration}</div>
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-between pt-3">
               <div>
                  <div className="fs-6">{translations.label.start_from}</div>{" "}
                  {/* Using contact send as "Start From" */}
                  <div className="text-xl font-medium">
                     Rp{trip.price.toLocaleString("id-ID")}
                  </div>
               </div>
               <button className="bg-red-700 hover:shadow-lg hover:bg-orange-600 text-white cursor-pointer p-2 px-4 rounded-full">
                  {translations.contact.send}{" "}
                  {/* Using contact send as "Book Now" */}
               </button>
            </div>
         </div>
      </div>
   );
};

export default LocaleOpenTrip;
