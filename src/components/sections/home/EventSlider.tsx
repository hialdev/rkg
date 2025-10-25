import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import EventCard from "../../cards/EventCard";
import { events } from "../../../mock";

export default function EventSliderReact() {
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
