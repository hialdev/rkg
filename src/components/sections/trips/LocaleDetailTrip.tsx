import React from "react";
import { useLocale } from "../../../contexts/LocaleContext";
import OfflineIcon from "../../OfflineIcon";
import GalleryProgressBar from "../gallery/GalleryProgressBar";
import ItineraryPath from "./ItineraryPath";
import PrivateTripBook from "../../forms/PrivateTripBook";
import OpenTripBook from "../../forms/OpenTripBook";
import TripSections from "./TripSection";
import { Icon } from "@iconify-icon/react";

interface LocaleDetailTripProps {
   tripData: any;
}

const LocaleDetailTrip: React.FC<LocaleDetailTripProps> = ({ tripData }) => {
   const { translations } = useLocale();

   if (!tripData) {
      return (
         <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">
               {translations.label.trip_not_found}
            </h1>
         </div>
      );
   }

   return (
      <>
         {tripData.type == "private-trip" ? (
            <div className="container mx-auto px-4 py-8">
               <div>
                  <GalleryProgressBar
                     images={tripData.images.map((image: any) => image.path)}
                     altTexts={tripData.images.map((image: any) => image.alt)}
                  />
               </div>
               <div className="grid grid-cols-13 mt-6 gap-y-10 md:gap-5">
                  <div className="col-span-13 md:col-span-7">
                     <div
                        className={`${"p-2 px-4 text-white font-medium text-sm inline-flex rounded-full mb-3"} ${
                           tripData.type == "open-trip"
                              ? "bg-linear-to-bl from-emerald-300 to-cyan-700"
                              : "bg-linear-to-tl from-yellow-40 via-yellow-600 to-orange-300"
                        }`}
                     >
                        {tripData.type == "open-trip"
                           ? translations.label.open_trip
                           : translations.label.private_trip}
                     </div>
                     <h1 className="text-3xl md:text-5xl font-bold text-red-600">
                        {tripData.title}
                     </h1>
                     <h2 className="text-xl md:text-2xl my-3">
                        {translations.label.start_from}{" "}
                        <strong>
                           Rp{tripData.price?.toLocaleString("id-ID")}
                        </strong>
                        /{translations.label.person}
                     </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
                        <div className="flex items-center gap-3 p-3 px-6 rounded-full bg-stone-100">
                           <Icon
                              icon={`streamline-kameleon-color:map-pin`}
                              width={25}
                           />
                           <div>
                              <h4 className="font-medium">Meeting Point</h4>
                              <div className="line-clamp-1 whitespace-nowrap">
                                 {tripData.meet_point}
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 px-6 rounded-full bg-stone-100">
                           <Icon
                              icon={`streamline-stickies-color:date-time-setting`}
                              width={25}
                           />
                           <div>
                              <h4 className="font-medium">Season Terbaik</h4>
                              <div className="">{tripData.best_season}</div>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 px-6 rounded-full bg-stone-100">
                           <Icon
                              icon={`streamline-ultimate-color:trip-pin-multiple`}
                              width={25}
                           />
                           <div>
                              <h4 className="font-medium">Destinasi</h4>
                              <div className="">
                                 {tripData.destinations.length} Destinasi
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 px-6 rounded-full bg-stone-100">
                           <Icon
                              icon={`fluent-emoji-flat:timer-clock`}
                              width={25}
                           />
                           <div>
                              <h4 className="font-medium">Duration</h4>
                              <div className="">{tripData.duration}</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="col-span-13 md:col-span-6">
                     <PrivateTripBook />
                  </div>
               </div>

               <section className="w-full max-w-4xl py-20">
                  <h2 className="text-4xl font-bold text-red-60">
                     {translations.label.description}
                  </h2>
                  <div
                     className="prose prose-stone mt-2"
                     dangerouslySetInnerHTML={{ __html: tripData.content }}
                  />
               </section>

               <TripSections tripData={tripData} />
            </div>
         ) : (
            <div className="container mx-auto px-4 py-8">
               <div className="grid grid-cols-6 gap-5">
                  <div className="col-span-6 lg:col-span-3">
                     <div className="md:sticky md:top-10">
                        <GalleryProgressBar
                           images={tripData.images.map(
                              (image: any) => image.path
                           )}
                           altTexts={tripData.images.map(
                              (image: any) => image.alt
                           )}
                        />
                     </div>
                  </div>
                  <div className="col-span-6 lg:col-span-3">
                     <div className="grid grid-cols-13 mt-6 gap-y-10 md:gap-5">
                        <div className="col-span-13">
                           <div
                              className={`${"p-2 px-4 text-white font-medium text-sm inline-flex rounded-full mb-3"} ${
                                 tripData.type == "open-trip"
                                    ? "bg-linear-to-bl from-emerald-300 to-cyan-700"
                                    : "bg-linear-to-tl from-yellow-40 via-yellow-600 to-orange-300"
                              }`}
                           >
                              {tripData.type == "open-trip"
                                 ? translations.label.open_trip
                                 : translations.label.private_trip}
                           </div>
                           <h1 className="text-2xl md:text-5xl font-bold text-red-600">
                              {tripData.title}
                           </h1>
                           <h2 className="text-xl md:text-2xl my-3">
                              {translations.label.start_from}{" "}
                              <strong>
                                 Rp{tripData.price?.toLocaleString("id-ID")}
                              </strong>
                              /{translations.label.person}
                           </h2>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
                              <div className="flex items-center gap-3 p-3 px-6 rounded-full bg-stone-100">
                                 <Icon
                                    icon={`streamline-kameleon-color:map-pin`}
                                    width={25}
                                 />
                                 <div>
                                    <h4 className="font-medium">
                                       Meeting Point
                                    </h4>
                                    <div className="line-clamp-1 whitespace-nowrap">
                                       {tripData.meet_point}
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 px-6 rounded-full bg-stone-100">
                                 <Icon
                                    icon={`streamline-stickies-color:date-time-setting`}
                                    width={25}
                                 />
                                 <div>
                                    <h4 className="font-medium">
                                       Season Terbaik
                                    </h4>
                                    <div className="">
                                       {tripData.best_season}
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 px-6 rounded-full bg-stone-100">
                                 <Icon
                                    icon={`streamline-ultimate-color:trip-pin-multiple`}
                                    width={25}
                                 />
                                 <div>
                                    <h4 className="font-medium">Destinasi</h4>
                                    <div className="">
                                       {tripData.destinations.length} Destinasi
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 px-6 rounded-full bg-stone-100">
                                 <Icon
                                    icon={`fluent-emoji-flat:timer-clock`}
                                    width={25}
                                 />
                                 <div>
                                    <h4 className="font-medium">Duration</h4>
                                    <div className="">{tripData.duration}</div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="col-span-13">
                           <OpenTripBook tripData={tripData} />
                        </div>
                     </div>
                  </div>
               </div>

               <section className="w-full max-w-4xl py-20 pb-0">
                  <h2 className="text-4xl font-bold text-red-600">
                     {translations.label.description}
                  </h2>
                  <div
                     className="prose prose-stone mt-2"
                     dangerouslySetInnerHTML={{ __html: tripData.content }}
                  />
               </section>

               <section className="w-full max-w-4xl py-20">
                  <h2 className="text-4xl font-bold text-red-60 mb-10">
                     {translations.label.itinerary}
                  </h2>
                  <div className="">
                     <ItineraryPath itinerary={tripData.itinerary} />
                  </div>
               </section>

               <TripSections tripData={tripData} />
            </div>
         )}
      </>
   );
};

export default LocaleDetailTrip;
