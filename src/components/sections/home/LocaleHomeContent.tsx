import React, { useEffect, useState } from "react";
import { useLocale } from "../../../contexts/LocaleContext";
import { imageLists, openTrips, tripsData } from "../../../mock/index";
import LocaleOpenTrip from "../../cards/LocaleOpenTrip";
import HeroFilter from "../../forms/generals/HeroFilter";
import ImageSlider from "./ImageSlider";
import EventSlider from "./EventSlider";

import { Icon } from "@iconify-icon/react";
import {
   getClients,
   getEvents,
   getEventTypes,
   getSetting,
   getTeams,
   getTestimonials,
   getTrips,
   type Client,
   type Event,
   type EventType,
   type Setting,
   type Team,
   type Testimonial,
   type Trip,
} from "../../../fetchers";
import TestimonialCard from "../../cards/TestimonialCard";
import EventStatistics from "../../../components/sections/home/EventStatistics";
import TeamBox from "../../../components/sections/home/TeamBox";
import ClientList from "../../../components/sections/home/ClientList";
import ConsultationBox from "../../../components/sections/home/ConsultationBox";
import OfflineIcon from "../../OfflineIcon";

interface LocaleHomeContentProps {
   isFloating?: boolean;
}

interface DataHomeType {
   image_heroes: string[];
   trips: Trip[];
   selected_trips: Trip[];
   private_trips: Trip[];
   events: Event[];
   teams: Team[];
   clients: Client[];
}
const LocaleHomeContent: React.FC<LocaleHomeContentProps> = ({
   isFloating = true,
}) => {
   const { translations } = useLocale();
   const [dataHome, setDataHome] = useState<DataHomeType | null>(null);
   //-----------------------------------------------------------------

   const fetchHome = async () => {
      try {
         const resHero = await getSetting("hero.images");
         const heroSetting = resHero.data.data;
         const imageHeroes = JSON.parse(heroSetting.set_value || "[]");

         const resTrips = await getTrips();
         const trips = resTrips.data.data;

         const privTrips = Array.from(
            trips
               .filter((t) => t.type === "private-trip")
               .reduce((map, trip) => {
                  const key = `${trip.location}-${trip.country}`;

                  if (!map.has(key)) {
                     map.set(key, {
                        location: trip.location,
                        country: trip.country,
                        image: trip.image, // ambil dari item pertama
                     });
                  }

                  return map;
               }, new Map())
               .values()
         );

         const resEvents = await getEvents();
         const eventsData = resEvents.data.data;

         const resEventTypes = await getEventTypes();
         const eventTypesData = resEventTypes.data.data;

         const teamsData = await getTeams();

         const clientsData = await getClients();

         const responseDataHome = {
            image_heroes: imageHeroes,
            trips: trips,
            selected_trips: trips.slice(0, 6),
            private_trips: privTrips,
            events: eventsData,
            event_types: eventTypesData,
            teams: teamsData.data.data,
            clients: clientsData.data.data,
         };

         setDataHome(responseDataHome);
      } catch (error) {
         console.error("Failed to fetch home apis :", error);
      }
   };

   //-----------------------------------------------------------------
   useEffect(() => {
      fetchHome();
   }, []);

   //-----------------------------------------------------------------
   const isOdd = dataHome && dataHome?.private_trips.length % 2 !== 0;
   const firstRow = isOdd ? dataHome?.private_trips.slice(0, 2) : [];
   const restRows = isOdd
      ? dataHome?.private_trips.slice(2)
      : dataHome?.private_trips;

   return (
      <>
         {/* HERO */}
         <section className="relative h-screen w-full flex-col items-center justify-center py-20 px-3 text-white overflow-hidden">
            {/* Background utama */}
            <div className="absolute inset-0">
               <ImageSlider images={dataHome ? dataHome?.image_heroes : []} />

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
               {dataHome?.selected_trips.map((trip, index) => (
                  <div
                     key={index}
                     className="col-span-12 sm:col-span-6 md:col-span-4"
                  >
                     <LocaleOpenTrip trip={trip} />
                  </div>
               ))}
            </div>
            {dataHome?.trips && dataHome?.trips.length > 6 && (
               <div className="flex items-center justify-center pt-10 w-full">
                  <a
                     href="/search"
                     className="flex items-center gap-3 justify-center px-4 py-2 rounded-full border-2 border-stone-700 bg-transparent hover:bg-stone-700 hover:text-white transition-colors duration-300 text-stone-700"
                  >
                     <span className="whitespace-nowrap">See More</span>
                     <OfflineIcon name="arrow" />
                  </a>
               </div>
            )}
         </section>

         <section className="container mx-auto pb-20 pt-10 px-3">
            <h2 className="text-3xl font-semibold text-gray-800 mb-10">
               {translations.services.items[1]?.title || "Private Trip"}
            </h2>

            <div className="space-y-5">
               {isOdd && (
                  <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2">
                     {firstRow.map((trip, index) => (
                        <div
                           key={`first-${index}`}
                           className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                           <img
                              src={
                                 import.meta.env.PUBLIC_API_URL +
                                 "/" +
                                 trip?.image
                              }
                              alt={trip.location}
                              className="w-full h-full object-cover aspect-[16/9]"
                           />
                           <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                              <h3 className="text-white text-lg font-medium text-center">
                                 {trip.location}
                              </h3>
                           </div>
                           <div className="hidden group-hover:flex absolute flex-col justify-center items-center inset-0 gap-5 bg-red-800 top-30 p-5">
                              <a
                                 href={`/search?locations=` + trip.location}
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
                     isOdd
                        ? "sm:grid-cols-2 md:grid-cols-3"
                        : "sm:grid-cols-2 md:grid-cols-3"
                  }`}
               >
                  {restRows &&
                     restRows.map((trip, index) => (
                        <div
                           key={`rest-${index}`}
                           className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                           <img
                              src={
                                 import.meta.env.PUBLIC_API_URL +
                                 "/" +
                                 trip?.image
                              }
                              alt={trip.location}
                              className="w-full h-full object-cover aspect-[16/9]"
                           />
                           <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                              <h3 className="text-white text-lg font-medium text-center">
                                 {trip.location}
                              </h3>
                           </div>
                           <div className="hidden group-hover:flex flex-col absolute inset-0 bg-red-800 top-10 p-5 items-center justify-center">
                              <a
                                 href={`/search?locations=` + trip.location}
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
               <TestimonialCard />
            </div>
         </section>

         {/* Event Statistics Section */}
         <div>
            <EventStatistics />
         </div>

         {/* Team Box Section */}
         <section className="py-10 bg-stone-950 px-3">
            <div className="container mx-auto">
               <h2 className="text-5xl font-medium text-yellow-500 mb-10">
                  {translations.team?.title || "team"}
               </h2>
               <div>
                  <TeamBox />
               </div>
            </div>
         </section>

         {/* Client List Section */}
         <section className="py-20 px-3">
            <div>
               <ClientList />
            </div>
         </section>

         {/* Consultation Box Section */}
         <section id="contact" className="py-20 px-3">
            <div>
               <ConsultationBox />
            </div>
         </section>
      </>
   );
};

export default LocaleHomeContent;
