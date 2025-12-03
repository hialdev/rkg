import React, { useEffect, useState } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import OfflineIcon from "../OfflineIcon";
import { cities, countries, tripsData, type openTrips } from "../../mock";
import { getSetting, type Trip } from "../../fetchers";

interface OpenTripProps {
   trip: Trip;
}

const LocaleOpenTrip: React.FC<OpenTripProps> = ({ trip }) => {
   const { translations } = useLocale();
   const [whatsapp, setWhatsapp] = useState("6289671052050");

   const fetchWhatsapp = async () => {
      const res = await getSetting("com.whatsapp");
      setWhatsapp(
         res.data.data.set_value ? res.data.data.set_value : "6289671052050"
      );
   };

   useEffect(() => {
      fetchWhatsapp();
   }, []);

   const sendMessage = () => {
      const message = `
      I'm interested for This Trip !📩

      Title: ${trip.title}
      Location: ${trip.location}
      
      Link:
      ${window.location.href+'trips/'+trip.slug}
            `.trim();

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodedMessage}`;

      window.open(whatsappUrl, "_blank");
   };

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
            {/* <div className=" p-2 px-4 bg-emerald-600 text-white font-medium text-sm">
               {translations.label.best}{" "}
            </div> */}
         </div>
         <img
            src={
               import.meta.env.PUBLIC_API_URL
                  ? import.meta.env.PUBLIC_API_URL + "/" + trip.image
                  : ""
            }
            alt={trip.title + " image"}
            width={426}
            height={240}
            className="aspect-video object-cover rounded-xl w-full"
         />

         <div className="py-4 cursor-pointer">
            <h2
               onClick={() => (window.location.href = `/trips/${trip.slug}`)}
               className="font-medium text-lg"
            >
               {trip.title}
            </h2>

            <div
               onClick={() => (window.location.href = `/trips/${trip.slug}`)}
               className="flex items-center justify-between pt-2 pb-5 border-b"
            >
               <div>
                  <div className="text-sm text-stone-400">
                     {translations.label.destination}
                  </div>{" "}
                  {/* Using gallery title as "Destination" */}
                  <div className="flex mt-1 items-center gap-2">
                     <OfflineIcon name="map" />
                     <div className="text-stone-800">
                        {trip.location}, {trip.country}
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
                     Rp{trip.price ? trip.price.toLocaleString("id-ID") : "-"}
                  </div>
               </div>
               <button
                  onClick={sendMessage}
                  className="bg-red-700 hover:shadow-lg hover:bg-orange-600 text-white cursor-pointer p-2 px-4 rounded-full"
               >
                  {translations.contact.send}{" "}
               </button>
            </div>
         </div>
      </div>
   );
};

export default LocaleOpenTrip;
