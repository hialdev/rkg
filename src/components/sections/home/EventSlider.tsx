import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import EventCard from "../../cards/EventCard";
import { useEffect, useState } from "react";
import { getEvents, type Event } from "../../../fetchers";

export default function EventSliderReact() {
   const [events, setEvents] = useState<Event[]>([]);

   const fetchEvent = async () => {
      const resEvents = await getEvents();
      setEvents(resEvents.data.data);
   }

   useEffect(() => {
      fetchEvent()
   }, [])
   return (
      <Swiper
         modules={[Autoplay, Pagination]}
         slidesPerView={1}
         loop={true}
         autoplay={{ delay: 3000 }}
         pagination={{ clickable: true }}
         className="event-slider pb-8"
      >
         {events.map((event) => (
            <SwiperSlide key={event.id}>
               <EventCard event={event} />
            </SwiperSlide>
         ))}
      </Swiper>
   );
}
