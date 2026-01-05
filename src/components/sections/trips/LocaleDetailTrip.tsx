import React from "react";
import { useLocale } from "../../../contexts/LocaleContext";
import OfflineIcon from "../../OfflineIcon";
import GalleryProgressBar from "../gallery/GalleryProgressBar";
import ItineraryPath from "./ItineraryPath";
import PrivateTripBook from "../../forms/PrivateTripBook";
import OpenTripBook from "../../forms/OpenTripBook";
import TripSections from "./TripSection";
import { Icon } from "@iconify-icon/react";
import type { Trip } from "../../../fetchers";

interface LocaleDetailTripProps {
   tripData: Trip;
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

   console.log("Trip Data in LocaleDetailTrip: ", tripData);

   // Parse JSON fields if they are strings
   const parsedTripData = {
      ...tripData,
      open_dates:
         typeof tripData.open_dates === "string"
            ? JSON.parse(tripData.open_dates)
            : tripData.open_dates,
      destinations:
         typeof tripData.destinations === "string"
            ? JSON.parse(tripData.destinations)
            : tripData.destinations,
      itinerary:
         typeof tripData.itinerary === "string"
            ? JSON.parse(tripData.itinerary)
            : tripData.itinerary,
   };

   let galleriesImages = [];
   let parsedImages = JSON.parse(tripData?.images || "[]");
   if (parsedImages && Array.isArray(parsedImages)) {
      galleriesImages = parsedImages.map((img) => {
         if (typeof img === "string" && img !== "") {
            // Only prepend server URL if the path doesn't already start with http:// or https://
            if (img.startsWith("http://") || img.startsWith("https://")) {
               return img;
            }
            return import.meta.env.PUBLIC_API_URL + "/" + img;
         }
         return img;
      });
   }
   // Add cover image to galleries
   if (tripData.image) {
      const coverImage =
         tripData.image.startsWith("http://") ||
         tripData.image.startsWith("https://")
            ? tripData.image
            : import.meta.env.PUBLIC_API_URL + "/" + tripData.image;
      galleriesImages.push(coverImage);
   }

   console.log("Galleries Images: ", galleriesImages);
   // Use parsedTripData instead of tripData for rendering
   const displayTripData = parsedTripData; // Alias for cleaner usage below
   return (
      <>
         {displayTripData.type == "private-trip" ? (
            <div className="container mx-auto px-4 py-8">
               <div>
                  <GalleryProgressBar images={galleriesImages} />
               </div>
               <div className="grid grid-cols-13 mt-6 gap-y-10 md:gap-5">
                  <div className="col-span-13 md:col-span-7">
                     <div
                        className={`${"p-2 px-4 text-white font-medium text-sm inline-flex rounded-full mb-3"} ${
                           displayTripData?.type == "private-trip"
                              ? "bg-linear-to-tl from-yellow-40 via-yellow-600 to-orange-300"
                              : "bg-linear-to-bl from-emerald-300 to-cyan-700"
                        }`}
                     >
                        {displayTripData?.type == "private-trip"
                           ? translations.label.private_trip
                           : translations.label.open_trip}
                     </div>
                     <h1 className="text-3xl md:text-5xl font-bold text-red-600">
                        {displayTripData.title}
                     </h1>
                     <h2 className="text-xl md:text-2xl my-3">
                        {translations.label.start_from}{" "}
                        <strong>
                           Rp{displayTripData.price?.toLocaleString("id-ID")}
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
                                 {displayTripData.meet_point}
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
                              <div className="">All</div>
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
                                 {displayTripData.destinations?.length || 0}{" "}
                                 Destinasi
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
                              <div className="">{displayTripData.duration}</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="col-span-13 md:col-span-6">
                     <PrivateTripBook tripData={displayTripData} />
                  </div>
               </div>

               <section className="w-full max-w-4xl py-20">
                  <h2 className="text-4xl font-bold text-red-60">
                     {translations.label.description}
                  </h2>
                  <div
                     className="prose prose-stone max-w-none mt-2 [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:mt-8 [&>h1]:mb-4 [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:mt-5 [&>h3]:mb-2 [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:mt-4 [&>h4]:mb-2 [&>img]:w-full [&>img]:rounded-xl [&>img]:my-4"
                     dangerouslySetInnerHTML={{
                        __html: displayTripData.content ?? "",
                     }}
                  />
               </section>

               <TripSections tripData={displayTripData} />
            </div>
         ) : (
            <div className="container mx-auto px-4 py-8">
               <div className="grid grid-cols-6 gap-5">
                  <div className="col-span-6 lg:col-span-3">
                     <div className="md:sticky md:top-10">
                        <GalleryProgressBar
                           images={galleriesImages}
                           altTexts={galleriesImages.map((_, index) =>
                              displayTripData.title
                                 ? `${displayTripData.title} ${index + 1}`
                                 : `Image ${index + 1}`
                           )}
                        />
                     </div>
                  </div>
                  <div className="col-span-6 lg:col-span-3">
                     <div className="grid grid-cols-13 mt-6 gap-y-10 md:gap-5">
                        <div className="col-span-13">
                           <div
                              className={`${"p-2 px-4 text-white font-medium text-sm inline-flex rounded-full mb-3"} ${
                                 displayTripData.type == "open-trip"
                                    ? "bg-linear-to-bl from-emerald-300 to-cyan-700"
                                    : "bg-linear-to-tl from-yellow-40 via-yellow-600 to-orange-300"
                              }`}
                           >
                              {displayTripData.type == "open-trip"
                                 ? translations.label.open_trip
                                 : translations.label.private_trip}
                           </div>
                           <h1 className="text-2xl md:text-5xl font-bold text-red-600">
                              {displayTripData.title}
                           </h1>
                           <h2 className="text-xl md:text-2xl my-3">
                              {translations.label.start_from}{" "}
                              <strong>
                                 Rp
                                 {displayTripData.price?.toLocaleString(
                                    "id-ID"
                                 )}
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
                                       {displayTripData.meet_point}
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
                                    <div className="">All</div>
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
                                       {displayTripData.destinations?.length ||
                                          0}{" "}
                                       Destinasi
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
                                    <div className="">
                                       {displayTripData.duration}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="col-span-13">
                           <OpenTripBook tripData={displayTripData} />
                        </div>
                     </div>
                  </div>
               </div>

               <section className="w-full max-w-4xl py-20 pb-0">
                  <h2 className="text-4xl font-bold text-red-600">
                     {translations.label.description}
                  </h2>
                  <div
                     className="prose prose-stone max-w-none mt-2 [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:mt-8 [&>h1]:mb-4 [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:mt-5 [&>h3]:mb-2 [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:mt-4 [&>h4]:mb-2 [&>img]:w-full [&>img]:rounded-xl [&>img]:my-4"
                     dangerouslySetInnerHTML={{
                        __html: displayTripData.content ?? "",
                     }}
                  />
               </section>

               {/* Only show itinerary if use_itinerary is true */}
               <section className="w-full max-w-4xl py-20">
                  {displayTripData.use_itinerary && (
                     <>
                        <h2 className="text-4xl font-bold text-red-60 mb-10">
                           {translations.label.itinerary}
                        </h2>
                        <div className="">
                           <ItineraryPath
                              itinerary={displayTripData.itinerary}
                           />
                        </div>
                     </>
                  )}
               </section>

               <TripSections tripData={displayTripData} />
            </div>
         )}
      </>
   );
};

export default LocaleDetailTrip;
