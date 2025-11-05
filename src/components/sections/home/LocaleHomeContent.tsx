import React from "react";
import { useLocale } from "../../../contexts/LocaleContext";
import { imageLists, openTrips, tripsData } from "../../../mock/index";
import LocaleOpenTrip from "../../cards/LocaleOpenTrip";
import HeroFilter from "../../forms/generals/HeroFilter";
import ImageSlider from "./ImageSlider";
import EventSlider from "./EventSlider";
import TestimonialBox from "./TestimonialBox";
import { Icon } from "@iconify-icon/react";

interface LocaleHomeContentProps {
   isFloating?: boolean;
}

const LocaleHomeContent: React.FC<LocaleHomeContentProps> = ({
   isFloating = true,
}) => {
   const { translations } = useLocale();

   const isOdd = tripsData.length % 2 !== 0;
   const firstRow = isOdd ? tripsData.slice(0, 2) : [];
   const restRows = isOdd ? tripsData.slice(2) : tripsData;

   return (
      <>
         {/* HERO */}
         <section className="relative h-screen w-full flex-col items-center justify-center py-20 px-3 text-white overflow-hidden">
            {/* Background utama */}
            <div className="absolute inset-0">
               <ImageSlider images={imageLists} />

               {/* Overlay gradasi hitam dari atas */}
               <div className="absolute z-10 inset-0 bg-linear-to-b from-black/70 via-transparent to-black/70"></div>
            </div>

            {/* Konten hero */}
            <div className="relative z-10 flex flex-col justify-end items-center h-full mb-10">
               <HeroFilter />
            </div>
         </section>

         <section className="container mx-auto py-20 px-3">
            <h2 className="text-3xl font-semibold text-gray-800 mb-10">
               {translations.nav.services}
            </h2>
            <div className="grid grid-cols-12 gap-5">
               {tripsData.map((trip, index) => (
                  <div
                     key={index}
                     className="col-span-12 sm:col-span-6 md:col-span-4"
                  >
                     <LocaleOpenTrip trip={trip} />
                  </div>
               ))}
            </div>
         </section>

         <section className="container mx-auto pb-20 pt-10 px-3">
            <h2 className="text-3xl font-semibold text-gray-800 mb-10">
               {translations.services.items[1]?.title || "Private Trip"}
            </h2>

            <div className="space-y-5">
               {isOdd && (
                  <div className="grid gap-5 sm:grid-cols-2">
                     {firstRow.map((trip, index) => (
                        <div
                           key={`first-${index}`}
                           className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                           <img
                              src={trip.image.path}
                              alt={trip.title}
                              className="w-full h-full object-cover aspect-[16/9]"
                           />
                           <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                              <h3 className="text-white text-lg font-medium text-center">
                                 {trip.title}
                              </h3>
                           </div>
                           <div className="hidden group-hover:flex absolute flex-col justify-center items-center inset-0 gap-5 bg-red-800 top-30 p-5">
                              <div className="text-white text-center text-sm line-clamp-5">
                                 {trip.description ||
                                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus voluptate modi obcaecati alias facilis ipsam doloremque fuga commodi sint"}
                              </div>
                              <a
                                 href=""
                                 className="px-4 py-2 border-white border inline-flex text-white hover:bg-red-950 hover:border-red-950 hover:text-red-100 rounded-full items-center gap-3"
                              >
                                 {translations.cta?.seeDetail || "See Detail"}
                                 <Icon icon="mdi:arrow-right" />
                              </a>
                           </div>
                        </div>
                     ))}
                  </div>
               )}

               <div
                  className={`grid gap-6 ${
                     isOdd ? "sm:grid-cols-6 md:grid-cols-3" : "sm:grid-cols-6 lg:grid-cols-3"
                  }`}
               >
                  {restRows.map((trip, index) => (
                     <div
                        key={`rest-${index}`}
                        className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                     >
                        <img
                           src={trip.image.path}
                           alt={trip.title}
                           className="w-full h-full object-cover aspect-[16/9]"
                        />
                        <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                           <h3 className="text-white text-lg font-medium text-center">
                              {trip.title}
                           </h3>
                        </div>
                        <div className="hidden group-hover:flex flex-col absolute inset-0 bg-red-800 top-10 p-5 items-center justify-center">
                           <div className="text-white text-center mb-4 text-sm line-clamp-3">
                              {trip.description ||
                                 "Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus voluptate modi obcaecati alias facilis ipsam doloremque fuga commodi sint"}
                           </div>
                           <a
                              href=""
                              className="px-4 py-2 border-white border inline-flex text-white hover:bg-red-950 hover:border-red-950 hover:text-red-100 rounded-full items-center gap-3"
                           >
                              {translations.cta?.seeDetail || "See Detail"}
                              <Icon icon="mdi:arrow-right" />
                           </a>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         <section className="">
            <div className="container mx-auto px-3">
               <h2 className="text-3xl font-semibold text-gray-800 mb-10">
                  {translations.event?.title || "Event Organizer"}
               </h2>
            </div>
            <EventSlider />
         </section>

         <section className="bg-orange-400 m-0">
            <div className="container mx-auto py-20 px-3">
               <h2 className="text-5xl font-medium mb-10">
                  {translations.testimonials?.title || "Testimonials"}
               </h2>
               <TestimonialBox />
            </div>
         </section>

      </>
   );
};

export default LocaleHomeContent;
